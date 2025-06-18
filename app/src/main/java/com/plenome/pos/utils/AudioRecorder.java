package com.plenome.pos.utils;

import android.media.MediaRecorder;
import android.os.Environment;

import java.io.File;
import java.io.IOException;

public class AudioRecorder {
    private MediaRecorder recorder;
    private String filePath;

    public AudioRecorder() {
       // String fileDir = "/data/user/0/com.plenome.pos/files/audio";
//        File dir = new File(fileDir);
//        if (!dir.exists()) dir.mkdirs();
//
//        filePath = fileDir + "/audio_record.wav";


        File pdfDir = new File(Environment.getExternalStorageDirectory(), "Plenome_OPHub");
        if (!pdfDir.exists()) {
            pdfDir.mkdirs();
        }
        filePath = pdfDir+ "/audio_record.wav";

    }

    public void startRecording() {
        recorder = new MediaRecorder();
        recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
        recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
        recorder.setOutputFile(filePath);

        try {
            recorder.prepare();
            recorder.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void stopRecording() {
        recorder.stop();
        recorder.release();
        recorder = null;

    }

    public String getFilePath() {
        return filePath;
    }
}
