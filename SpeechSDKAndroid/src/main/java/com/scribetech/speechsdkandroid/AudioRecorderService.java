package com.scribetech.speechsdkandroid;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.AsyncTask;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

/**
 * Background service for capturing audio in background.
 */
public class AudioRecorderService extends Service {

    private AudioRecord _recorder;
    private AudioManager audioManager;
    private int _bufferSize;
    private final int SamplerRate = 16000;
    private byte[] _audioBuffer;
    private WebSocketWrapper _ws = null;
    boolean isRecording;
    NotificationChannel channel;

    @Override
    public void onCreate() {
        super.onCreate();
        _ws = AudioWrapper.GetWebSocketObject();
        _bufferSize = 3200;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            StartAppForegroundService();
        else
            startForeground(1, new android.app.Notification());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                RecordAudio();
            }
        });
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {

        try {
            _ws = null;
            isRecording = false;
            _recorder.stop();
            _recorder.release();
            _recorder = null;
            if (channel != null) {
                channel = null;
            }
            if (audioManager != null) {
                audioManager.stopBluetoothSco();
                audioManager.setBluetoothScoOn(false);
            }
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
//                stopForeground(STOP_FOREGROUND_REMOVE);
//            else
//                stopSelf();
            super.onDestroy();
        } catch (Exception ex) {
            Log.e("Error stopping","Error Message");
        }
    }

    private void StartAppForegroundService() {
        String channelId = AudioWrapper.packageName;
        CreateNotificationChannel(channelId);

        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this, channelId);

        Notification notification = notificationBuilder.setOngoing(true)
                .setSound(null)
                .setContent(null)
                .setChannelId(channelId)
                .build();
        // Enlist this instance of the service as a foreground service
        startForeground(1012, notification);
    }

    void CreateNotificationChannel(String channelId) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            // Notification channels are new in API 26 (and not a part of the
            // support library). There is no need to create a notification
            // channel on older versions of Android.
            return;
        }
        channel = new NotificationChannel(channelId, "Android_SDK_Background", NotificationManager.IMPORTANCE_NONE);
        NotificationManager notificationManager = (NotificationManager) getSystemService(NotificationManager.class);
        notificationManager.createNotificationChannel(channel);
    }

    private void RecordAudio() {
        try {
            _audioBuffer = new byte[_bufferSize];
            audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            audioManager.startBluetoothSco();
            audioManager.setBluetoothScoOn(true);
            _recorder = new AudioRecord(MediaRecorder.AudioSource.DEFAULT, SamplerRate, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT, _bufferSize);

            if (_recorder.getState() == AudioRecord.STATE_INITIALIZED) {
                _recorder.startRecording();
                isRecording = true;
                while (isRecording) {
                    _ws = AudioWrapper.GetWebSocketObject();
                    if(_ws!=null && _recorder!=null){
                        int readSize = _recorder.read(_audioBuffer, 0, _audioBuffer.length);
                        _ws.SendMessage(_audioBuffer, 0, _audioBuffer.length);
                    }
                }
            } else {

            }

        } catch (Exception ex) {
        }


    }
}
