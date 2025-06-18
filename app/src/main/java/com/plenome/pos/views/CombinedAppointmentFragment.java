package com.plenome.pos.views;

import static com.plenome.pos.views.ClinicalNotesFragment.REQUEST_AUDIO_PERMISSION_CODE;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.plenome.pos.R;
import com.plenome.pos.model.TranscriptResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.AudioRecorder;

import java.io.File;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;

public class CombinedAppointmentFragment extends Fragment {


    private ImageView btnStartRecording;
    private ImageView btnStopRecording;
    private AudioRecorder recorder;
    private RestServices services;
    private TextView outputTextView;
    private String filePath;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.combined_appointment_fragment, container, false);

        btnStartRecording = view.findViewById(R.id.record);
        btnStopRecording = view.findViewById(R.id.recordStop);
        outputTextView = view.findViewById(R.id.userInput);
        services = RetrofitInstance.createSarvamService(RestServices.class);
        recorder = new AudioRecorder();
        btnStartRecording.setOnClickListener(v -> {
            if (checkPermissions()) {
                startRecording();
            } else {
                requestPermissions();
            }
        });
        btnStopRecording.setOnClickListener(v -> stopRecording());
        return view;
    }


    private void startRecording() {
        recorder.startRecording();
        btnStartRecording.setVisibility(View.GONE);
        btnStopRecording.setVisibility(View.VISIBLE);
    }

    private void stopRecording() {
        filePath = recorder.getFilePath();
        recorder.stopRecording();
        btnStopRecording.setVisibility(View.GONE);
        btnStartRecording.setVisibility(View.VISIBLE);
        if (filePath != null) {
            uploadFile();
        }
    }

    private void uploadFile() {
        File file = new File("/storage/emulated/0/Download/ttsMP3.com_VoiceText_2024-11-10_8-22-30.mp3");
        MultipartBody.Part filePart = MultipartBody.Part.createFormData("file", // Replace with the field name for the file
                file.getPath(), RequestBody.create(MediaType.parse("audio/wav"), file)
        );
        Call<TranscriptResponse> call = services.translateSpeech("54034a78-4136-45d5-918d-693a8dd08fc2",filePart);
        call.enqueue(new retrofit2.Callback<TranscriptResponse>() {
            @Override
            public void onResponse(Call<TranscriptResponse> call, retrofit2.Response<TranscriptResponse> response) {
                try {
                    if (response.isSuccessful()) {
                        if (response.body() != null) {
                            if (response.body().getTranscript() != null) {
                                outputTextView.setText(response.body().getTranscript());
                            }
                        }
                    } else {
                        // Handle error response
                        Log.i("myLog", "upload file onResponse else:");
                        System.out.println("Error uploading file: " + response.message());
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<TranscriptResponse> call, Throwable t) {
                // Handle network failure
                Log.i("myLog", "upload file  on failure");
                System.out.println("Network error: " + t.getMessage());
            }
        });
    }

    private boolean checkPermissions() {
        int result = ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.RECORD_AUDIO);
        int storagePermission = ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE);
        return result == PackageManager.PERMISSION_GRANTED && storagePermission == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions() {
        ActivityCompat.requestPermissions(requireActivity(),
                new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.WRITE_EXTERNAL_STORAGE},
                REQUEST_AUDIO_PERMISSION_CODE);
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_AUDIO_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(getContext(), "Permission Granted", Toast.LENGTH_SHORT).show();
                startRecording();
            } else {
                Toast.makeText(getContext(), "Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

}
