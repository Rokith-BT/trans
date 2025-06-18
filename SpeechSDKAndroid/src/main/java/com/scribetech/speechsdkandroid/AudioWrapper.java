package com.scribetech.speechsdkandroid;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;

import java.util.Timer;
import java.util.TimerTask;

/**
 *Audio wrapper class that provides audio start stop functionalities
 */
public class AudioWrapper implements AudioManager.OnAudioFocusChangeListener {
    AudioFocusRequest focusRequest;
    Intent intent;
    Context _currentContext = null;
    Activity _mainActivity;
    static String packageName = "com.scribetech.java.speechsdk";

    static WebSocketWrapper _ws;
    private Timer _timer;
    private int _countSeconds;

    boolean IsResume;
    private boolean IsPaused;
    public boolean IsRecording;
    public boolean IsForceStopAudio;

    public AudioWrapper(Context context, Activity activity) {
        _currentContext = context;
        _mainActivity = activity;
        packageName = _mainActivity.getPackageName();
    }

    public static WebSocketWrapper GetWebSocketObject() {
        return _ws;
    }

    private int RequestForAudioFocus() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                    .setAudioAttributes(new AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build())
                    .setOnAudioFocusChangeListener(this).setAcceptsDelayedFocusGain(true)
                    .build();
            int res = ((AudioManager) _currentContext.getSystemService(Context.AUDIO_SERVICE)).requestAudioFocus(focusRequest);
            return res;
        } else {
            int res = ((AudioManager) _currentContext.getSystemService(Context.AUDIO_SERVICE)).requestAudioFocus(this, AudioManager.STREAM_SYSTEM, AudioManager.AUDIOFOCUS_GAIN);
            return res;
        }
    }

    public void StartRecord(WebSocketWrapper ws) {
        _ws = ws;
        try {
            if (focusRequest == null) {
                RequestForAudioFocus();
            }
            IsRecording = true;
            intent = new Intent(_currentContext, AudioRecorderService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                _mainActivity.startForegroundService(intent);
            } else {
                _mainActivity.startService(intent);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }


    @Override
    public void onAudioFocusChange(int focusChange) {
        if (focusChange == AudioManager.AUDIOFOCUS_GAIN) {
            IsResume = true;
            IsPaused = false;
        } else if (focusChange == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
            IsPaused = true;
            IsResume = false;
        } else {
            IsForceStopAudio = true;
            StopRecord();
            _timer = new Timer();
            _timer.schedule(new TimerTask() {
                @Override
                public void run() {
                    _countSeconds--;
                    int res = RequestForAudioFocus();
                    if (res == AudioManager.AUDIOFOCUS_REQUEST_GRANTED) {
                        _timer.cancel();
                        IsResume = true;
                    }

                    if (_countSeconds == 0) {
                        _timer.cancel();
                    }
                }
            }, 1000);
        }

    }

    public void StopRecord() {
        try {
            if (IsRecording) {
                if (!IsPaused) {
                    _ws = null;
                    IsRecording = false;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        ((AudioManager) _currentContext.getSystemService(Context.AUDIO_SERVICE)).abandonAudioFocusRequest(focusRequest);
                    } else {
                        ((AudioManager) _currentContext.getSystemService(Context.AUDIO_SERVICE)).abandonAudioFocus(this);
                    }
                    _mainActivity.stopService(intent);
                    focusRequest = null;
                }

            }
        } catch (Exception ex) {
            throw ex;
        }
    }


}
