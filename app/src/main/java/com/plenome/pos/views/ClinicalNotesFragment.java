package com.plenome.pos.views;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
import static android.app.Activity.RESULT_OK;

import android.Manifest;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.text.Editable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.MimeTypeMap;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.ImageCapture;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.video.VideoCapture;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;
import com.scribetech.speechsdkandroid.AugnitoSpeechAudio;
import com.scribetech.speechsdkandroid.AugnitoSpeechResult;
import com.scribetech.speechsdkandroid.Interfaces.IAugnitoSpeechOutputCallback;
import com.scribetech.speechsdkandroid.Interfaces.OnSelectionChangedListener;
import com.scribetech.speechsdkandroid.SpeechCommand.ActionRecipe;
import com.scribetech.speechsdkandroid.SpeechCommand.Commands;
//import com.theartofdev.edmodo.cropper.CropImage;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ClinicalNotesFragment extends Fragment implements IAugnitoSpeechOutputCallback, View.OnFocusChangeListener, OnSelectionChangedListener {
    View rootView;

    public static final int CAMERA_PERM_CODE = 101;
    public static final int CAMERA_REQUEST_CODE = 102;
    public static final int GALLERY_REQUEST_CODE = 105;
    public static final int REQUEST_AUDIO_PERMISSION_CODE = 1221;

    @BindView(R.id.linearScribbleDet)
    RelativeLayout relScribbleDet;
    @BindView(R.id.linearTextDet)
    RelativeLayout relTextDet;
    @BindView(R.id.linearVoiceDet)
    RelativeLayout relVoiceDet;

    @BindView(R.id.linearScribble)
    LinearLayout linearScribble;
    @BindView(R.id.linearText)
    LinearLayout linearText;
    @BindView(R.id.linearVoice)
    LinearLayout linearVoice;
    @BindView(R.id.imgScribble)
    ImageView imgScribble;
    @BindView(R.id.imgText)
    ImageView imgText;
    @BindView(R.id.imgVoice)
    ImageView imgVoice;
    @BindView(R.id.txtScribble)
    TextView txtScribble;
    @BindView(R.id.txtText)
    TextView txtText;
    @BindView(R.id.txtVoice)
    TextView txtVoice;

    @BindView(R.id.txtSaveScribble)
    TextView txtSaveScribble;

    @BindView(R.id.txtSaveText)
    TextView txtSaveText;

    @BindView(R.id.btnSaveVoice)
    Button btnSaveVoice;

    @BindView(R.id.imgView)
    ImageView imgView;

    @BindView(R.id.recTextListening)
    TextView rectextlistening;

    @BindView(R.id.recText)
    ExtendedEditTExt recordText;

    @BindView(R.id.record)
    ImageView record;

    @BindView(R.id.recordstop)
    ImageView recordstop;

    AugnitoSpeechAudio augnitoSpeechAudio = null;

    private Uri selUri = null;
    String fromScreen, apptId, apptStatus, selTab, currentPhotoPath;

    int patientId;
    private ActivityResultLauncher<Intent> launcher;
    RestServices services, fileServices;
    ActivityResultLauncher<PickVisualMediaRequest> pickMedia;
    final int CROP_PIC = 2;
    //  final int REQUEST_IMAGE_CAPTURE = 1;
    private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
    PreviewView previewView;
    private ImageCapture imageCapture;
    private VideoCapture<androidx.camera.video.VideoOutput> videoCapture;
    private static final int GalleryPick = 1;
    private static final int CAMERA_REQUEST = 100;
    private static final int STORAGE_REQUEST = 200;
    private static final int IMAGEPICK_GALLERY_REQUEST = 300;
    private static final int IMAGE_PICKCAMERA_REQUEST = 400;
    String cameraPermission[];
    String storagePermission[];
    Uri imageuri;
    private static final int pic_id = 123;

    final int REQUEST_CAMERA_PERMISSION_CODE = 1;
    final int REQUEST_IMAGE_CAPTURE = 2;
    Bitmap myBitmap;
    Uri picUri;
    ArrayList permissionsToRequest;
    private ArrayList permissionsRejected = new ArrayList();
    private ArrayList permissions = new ArrayList();

    private final static int ALL_PERMISSIONS_RESULT = 107;

    String selectedView = "Enter the report";
    ExtendedEditTExt selectedEditText = null;
    int CursorPosition = 0;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_clinical_notes, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        Bundle bundle = getArguments();
        if (bundle != null) {
            fromScreen = bundle.getString("from_screen");
            apptId = bundle.getString("appt_id");
            apptStatus = bundle.getString("appt_status");
            patientId = bundle.getInt("patient_id");
            selTab = bundle.getString("from_tab");
        }


     /*   pickMedia =
                registerForActivityResult(new ActivityResultContracts.PickVisualMedia(), uri -> {
                    // Callback is invoked after the user selects a media item or closes the
                    // photo picker.
                    if (uri != null) {
                        Log.i("myLog", "Selected URI: " + uri);
                        selUri = uri;
                        imgView.setImageURI(uri);

                    } else {
                        Log.i("myLog", "No media selected");
                    }
                });*/

        if (!CheckPermissions()) {
            RequestPermissions();
        }
        recordText.setOnFocusChangeListener(this);
        return rootView;
    }

    @OnClick(R.id.linearScribble)
    public void clickScribble() {
        linearScribble.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue_outline));
        txtScribble.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
        imgScribble.setImageResource(R.drawable.scribble_sel);
        linearText.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        txtText.setTextColor(ContextCompat.getColor(getContext(), R.color.gray));
        imgText.setImageResource(R.drawable.text);
        linearVoice.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        txtVoice.setTextColor(ContextCompat.getColor(getContext(), R.color.gray));
        imgVoice.setImageResource(R.drawable.voice);

        relScribbleDet.setVisibility(View.VISIBLE);
        relTextDet.setVisibility(View.GONE);
        relVoiceDet.setVisibility(View.GONE);

    }

    @OnClick(R.id.linearText)
    public void clickText() {
        linearText.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue_outline));
        txtText.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
        imgText.setImageResource(R.drawable.text_sel);
        linearVoice.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        txtVoice.setTextColor(ContextCompat.getColor(getContext(), R.color.gray));
        imgVoice.setImageResource(R.drawable.voice);
        linearScribble.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        txtScribble.setTextColor(ContextCompat.getColor(getContext(), R.color.gray));
        imgScribble.setImageResource(R.drawable.scribble);
        relScribbleDet.setVisibility(View.GONE);
        relTextDet.setVisibility(View.VISIBLE);
        relVoiceDet.setVisibility(View.GONE);
        if (OPHubApplication.getUserType().equalsIgnoreCase("Doctor") && fromScreen.equalsIgnoreCase("Prescription")) {
            PrescriptionFragment newFragment = new PrescriptionFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        }

    }

    @OnClick(R.id.linearVoice)
    public void clickVoice() {
        linearVoice.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue_outline));
        txtVoice.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
        imgVoice.setImageResource(R.drawable.voice_sel);
        linearText.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        txtText.setTextColor(ContextCompat.getColor(getContext(), R.color.gray));
        imgText.setImageResource(R.drawable.text);
        linearScribble.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        txtScribble.setTextColor(ContextCompat.getColor(getContext(), R.color.gray));
        imgScribble.setImageResource(R.drawable.scribble);
        relScribbleDet.setVisibility(View.GONE);
        relTextDet.setVisibility(View.GONE);
        relVoiceDet.setVisibility(View.VISIBLE);


    }

    @OnClick(R.id.btnSaveVoice)
    public void clickSaveVoice() {
        AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.relFragment, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    @OnClick(R.id.txtSaveScribble)
    public void clickSaveScribble() {
        if (selUri == null) {
            Toast.makeText(getActivity(), "Select file!", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            upload(selUri);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @OnClick(R.id.txtSaveText)
    public void clickSaveText() {
        if (selUri == null) {
            Toast.makeText(getActivity(), "Select file!", Toast.LENGTH_SHORT).show();
            return;
        }
        try {
            upload(selUri);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @OnClick(R.id.imgCameraScribble)
    public void clickedCameraScribble() {
        Log.i("myLog", "clickedCameraScribble");
        askCameraPermissions();

    }

    @OnClick(R.id.imgUploadScribble)
    public void clickedUploadScribble() {
        //  mGetContent.launch("image/*");
        Log.i("myLog", "clickedUploadScribble");

        pickMedia.launch(new PickVisualMediaRequest.Builder()
                .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE)
                .build());
        Log.i("myLog", "clickedUploadScribble end");
    }


    @OnClick(R.id.imgCameraText)
    public void clickedCameraText() {
        Log.i("myLog", "clickedCameraText");
        //    askCameraPermissions();
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION_CODE);
            return;
        }
        Intent camera_intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        // Start the activity with camera_intent, and request pic id
        startActivityForResult(camera_intent, REQUEST_IMAGE_CAPTURE);

    }

    @OnClick(R.id.imgUploadText)
    public void clickedUploadText() {
        //  mGetContent.launch("image/*");
        Log.i("myLog", "clickedUploadText");


        Log.i("myLog", "clickedUploadText end");
    }

    @OnClick(R.id.imgDeleteText)
    public void clickDeleteText() {
        //  imgView.setImageResource(ContextCompat.get);

    }

    @OnClick(R.id.imgDelScribble)
    public void clickDeleteScribble() {

    }

    private void uploadFile(String data) {
        Log.i("myLog", "uploadFile data:" + data);
        OPHubRequests.PrescriptionPostingReq req = new OPHubRequests.PrescriptionPostingReq();
        req.setFiles(data);
        req.setHospId(OPHubApplication.getHospitalId());
        req.setAppointmentId(apptId);
        req.setPatientId(patientId);
        //  req.setAppointmentId("367");
        //req.setPatientId(59);
        req.setRecName("Prescription");
        Log.i("mylog", "uploadFile request:" + new Gson().toJson(req));
        Call<OPHubResponse.FileUploadResponse> call = services.prescriptionPost(req);
        call.enqueue(new Callback<OPHubResponse.FileUploadResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.FileUploadResponse> call, Response<OPHubResponse.FileUploadResponse> response) {
                try {
                    Log.i("myLog", "uploadFile response:");
                    Log.i("mylog", "uploadFile response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "uploadFile response isSuccess:" + response.body().toString());
                        OPHubResponse.FileUploadResponse resp = response.body();
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        Log.i("myLog", "uploadFile message:" + message);
                        Log.i("myLog", "uploadFile status:" + status);
                        if (status != null && status.equalsIgnoreCase("success")) {
                            //   getParentFragmentManager().popBackStackImmediate();
                            AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
                            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                            Bundle result = new Bundle();
                            result.putInt("patient_id", patientId);
                            result.putString("appt_id", apptId);
                            result.putString("appt_status", apptStatus);
                            //   result.putString("token", token);
                            result.putString("from_screen", "Prescription");
                            result.putString("from_tab", selTab);
                            result.putString("to_tab", "Prescription");
                            newFragment.setArguments(result);
                            transaction.replace(R.id.fragment_container, newFragment);
                            transaction.addToBackStack(null);
                            transaction.commit();
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.FileUploadResponse> call, Throwable t) {
                Log.i("myLog", "ForgotPwdActivity response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    public void upload(Uri uri) throws Exception {
        Log.i("myLog", "upload file");
        File file = getFileFromUri(getContext(), uri);
        Log.i("myLog", "upload file11111111");
        MultipartBody.Part filePart = MultipartBody.Part.createFormData("file", // Replace with the field name for the file
                file.getPath(), RequestBody.create(MediaType.parse("image/jpeg"), file)
        );
        Log.i("myLog", "upload file2222222");
        Call<OPHubResponse.FileUploadResponse> call = fileServices.uploadFile(filePart);
        call.enqueue(new retrofit2.Callback<OPHubResponse.FileUploadResponse>() {
            @Override
            public void onResponse(Call<OPHubResponse.FileUploadResponse> call, retrofit2.Response<OPHubResponse.FileUploadResponse> response) {
                try {
                    Log.i("myLog", "upload file onResponse:" + new Gson().toJson(response.body()));
                    if (response.isSuccessful()) {
                        // Handle success response
                        OPHubResponse.FileUploadResponse myResponse = response.body();
                        Log.i("myLog", "upload file onResponse message:" + myResponse.getMessage());
                        System.out.println("File uploaded successfully: " + myResponse.getMessage());
                        String data = myResponse.getData();
                        String status = myResponse.getStatus();
                        Log.i("myLog", "uploadFile status:" + status);
                        if (status.equalsIgnoreCase("success")) {
                            uploadFile(data);
                        }
                    } else {
                        // Handle error response
                        Log.i("myLog", "upload file onResponse else:");
                        System.out.println("Error uploading file: " + response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.FileUploadResponse> call, Throwable t) {
                // Handle network failure
                Log.i("myLog", "upload file  on failure");
                System.out.println("Network error: " + t.getMessage());
            }
        });
    }

    public Uri getImageUri(Context inContext, Bitmap inImage) {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        inImage.compress(Bitmap.CompressFormat.JPEG, 100, bytes);
        String path = MediaStore.Images.Media.insertImage(inContext.getContentResolver(), inImage, "Title", null);
        return Uri.parse(path);
    }

    public static String getDataColumn(Context context, Uri uri, String selection,
                                       String[] selectionArgs) {

        Cursor cursor = null;
        final String column = MediaStore.Images.Media.DATA;
        final String[] projection = {
                column
        };

        try {
            cursor = context.getContentResolver().query(uri, projection, selection, selectionArgs,
                    null);
            if (cursor != null && cursor.moveToFirst()) {
                final int column_index = cursor.getColumnIndexOrThrow(column);
                return cursor.getString(column_index);
            }
        } finally {
            if (cursor != null)
                cursor.close();
        }
        return null;
    }

    public static File getFileFromUri(final Context context, final Uri uri) throws Exception {

        String path = null;

        // DocumentProvider
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (DocumentsContract.isDocumentUri(context, uri)) { // TODO: 2015. 11. 17. KITKAT


                // ExternalStorageProvider
                if (isExternalStorageDocument(uri)) {
                    final String docId = DocumentsContract.getDocumentId(uri);
                    final String[] split = docId.split(":");
                    final String type = split[0];


                    if ("primary".equalsIgnoreCase(type)) {
                        path = Environment.getExternalStorageDirectory() + "/" + split[1];
                    }

                    // TODO handle non-primary volumes

                } else if (isDownloadsDocument(uri)) { // DownloadsProvider

                    final String id = DocumentsContract.getDocumentId(uri);
                    final Uri contentUri = ContentUris.withAppendedId(
                            Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));

                    path = getDataColumn(context, contentUri, null, null);

                } else if (isMediaDocument(uri)) { // MediaProvider


                    final String docId = DocumentsContract.getDocumentId(uri);
                    final String[] split = docId.split(":");
                    final String type = split[0];

                    Uri contentUri = null;
                    if ("image".equals(type)) {
                        contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                    } else if ("video".equals(type)) {
                        contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                    } else if ("audio".equals(type)) {
                        contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                    }

                    final String selection = "_id=?";
                    final String[] selectionArgs = new String[]{
                            split[1]
                    };

                    path = getDataColumn(context, contentUri, selection, selectionArgs);

                } else if (isGoogleDrive(uri)) { // Google Drive
                    String TAG = "isGoogleDrive";
                    path = TAG;
                    final String docId = DocumentsContract.getDocumentId(uri);
                    final String[] split = docId.split(";");
                    final String acc = split[0];
                    final String doc = split[1];

                    /*
                     * @details google drive document data. - acc , docId.
                     * */

                    return saveFileIntoExternalStorageByUri(context, uri);


                } // MediaStore (and general)
            } else if ("content".equalsIgnoreCase(uri.getScheme())) {
                path = getDataColumn(context, uri, null, null);
            }
            // File
            else if ("file".equalsIgnoreCase(uri.getScheme())) {
                path = uri.getPath();
            }

            return new File(path);
        } else {

            Cursor cursor = context.getContentResolver().query(uri, null, null, null, null);
            int index = cursor.getColumnIndex("_data");
            return new File(cursor.getString(index));
        }

    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is GoogleDrive.
     */

    public static boolean isGoogleDrive(Uri uri) {
        return uri.getAuthority().equalsIgnoreCase("com.google.android.apps.docs.storage");
    }

    public static boolean isExternalStorageDocument(Uri uri) {
        return "com.android.externalstorage.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is DownloadsProvider.
     */
    public static boolean isDownloadsDocument(Uri uri) {
        return "com.android.providers.downloads.documents".equals(uri.getAuthority());
    }

    /**
     * @param uri The Uri to check.
     * @return Whether the Uri authority is MediaProvider.
     */
    public static boolean isMediaDocument(Uri uri) {
        return "com.android.providers.media.documents".equals(uri.getAuthority());
    }

    public static File saveFileIntoExternalStorageByUri(Context context, Uri uri) throws Exception {
        InputStream inputStream = context.getContentResolver().openInputStream(uri);
        int originalSize = inputStream.available();

        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        String fileName = getFileName(context, uri);
        File file = makeEmptyFileIntoExternalStorageWithTitle(fileName);
        bis = new BufferedInputStream(inputStream);
        bos = new BufferedOutputStream(new FileOutputStream(
                file, false));

        byte[] buf = new byte[originalSize];
        bis.read(buf);
        do {
            bos.write(buf);
        } while (bis.read(buf) != -1);

        bos.flush();
        bos.close();
        bis.close();

        return file;

    }

    public static String getFileName(Context context, Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = context.getContentResolver().query(uri, null, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    result = cursor.getString(index);
                }
            } finally {
                cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }
        return result;
    }

    public static File makeEmptyFileIntoExternalStorageWithTitle(String title) {
        String root = Environment.getExternalStorageDirectory().getAbsolutePath();
        return new File(root, title);
    }


  /*  @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.i("myLog", "request code:" + requestCode +
                "    result code:" + resultCode);
        if(requestCode == REQUEST_IMAGE_CAPTURE && resultCode==RESULT_OK){
            if (data != null) {
                Log.i("myLog","data != null");
                Bitmap photo = (Bitmap) data.getExtras().get("data");
                Log.i("myLog","photo != null");
                selUri = getImageUri(getContext(), photo);
                // Set the image in imageview for display
                Log.i("myLog","data != null");
                imgView.setImageBitmap(photo);
                Log.i("myLog","photo != null");
            }
        }

    }*/

    private void askCameraPermissions() {
        Log.i("myLog", "askCameraPermissions");
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            Log.i("myLog", "b4 requestPermissions");
            requestPermissions(new String[]{Manifest.permission.CAMERA}, CAMERA_PERM_CODE);
        } else {
            Log.i("myLog", "askCameraPermissions b4 take picture");
            dispatchTakePictureIntent();
        }

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        Log.i("myLog", "onRequestPermissionsResult");
        if (requestCode == CAMERA_PERM_CODE) {
            Log.i("myLog", "requestCode == CAMERA_PERM_CODE");
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.i("myLog", "grantResults[0]:" + grantResults[0] + "    PackageManager.PERMISSION_GRANTED:" + PackageManager.PERMISSION_GRANTED);
                dispatchTakePictureIntent();
            } else {
                Toast.makeText(getActivity(), "Camera Permission is Required to Use camera.", Toast.LENGTH_SHORT).show();
            }
        }
        if (requestCode == REQUEST_AUDIO_PERMISSION_CODE) {
            if (grantResults.length > 0) {
                boolean permissionToRecord = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                boolean permissionToStore = grantResults[1] == PackageManager.PERMISSION_GRANTED;
                if (permissionToRecord && permissionToStore) {
                    Toast.makeText(getActivity(), "Permission Granted", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(getActivity(), "Permission Denied", Toast.LENGTH_LONG).show();
                }
            }
        }
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Log.i("myLog", "onActivityResult:" + " requestCode:" + requestCode + "  resultCode: " + resultCode);
        if (requestCode == CAMERA_REQUEST_CODE) {
            Log.i("myLog", "onActivityResult CAMERA_REQUEST_CODE");
            if (resultCode == RESULT_OK) {
                Log.i("myLog", "onActivityResult RESULT_OK");
                File f = new File(currentPhotoPath);
                imgView.setImageURI(Uri.fromFile(f));

                // Log.d("tag", "ABsolute Url of Image is " + Uri.fromFile(f));

                Intent mediaScanIntent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
                selUri = Uri.fromFile(f);
                mediaScanIntent.setData(selUri);
                getActivity().sendBroadcast(mediaScanIntent);
            }

        }

    /*    if (requestCode == GALLERY_REQUEST_CODE) {
            Log.i("myLog", "onActivityResult GALLERY_REQUEST_CODE");
            if (resultCode == Activity.RESULT_OK) {
                Log.i("myLog", "onActivityResult RESULT_OK");
                Uri contentUri = data.getData();
                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
                String imageFileName = "JPEG_" + timeStamp + "." + getFileExt(contentUri);
                Log.d("tag", "onActivityResult: Gallery Image Uri:  " + imageFileName);
                imgView.setImageURI(contentUri);
            }

        }*/


    }

    private String getFileExt(Uri contentUri) {
        ContentResolver c = getActivity().getContentResolver();
        MimeTypeMap mime = MimeTypeMap.getSingleton();
        return mime.getExtensionFromMimeType(c.getType(contentUri));
    }


    private File createImageFile() throws IOException {
        // Create an image file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
//        File storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File storageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES);
        File image = File.createTempFile(
                imageFileName,  /* prefix */
                ".jpg",         /* suffix */
                storageDir      /* directory */
        );

        // Save a file: path for use with ACTION_VIEW intents
        currentPhotoPath = image.getAbsolutePath();
        return image;
    }


    private void dispatchTakePictureIntent() {
        Log.i("myLog", "dispatchTakePictureIntent");
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        // Ensure that there's a camera activity to handle the intent
        if (takePictureIntent.resolveActivity(getActivity().getPackageManager()) != null) {
            Log.i("myLog", "dispatchTakePictureIntent111111");
            // Create the File where the photo should go
            File photoFile = null;
            try {
                photoFile = createImageFile();
            } catch (IOException ex) {

            }
            Log.i("myLog", "dispatchTakePictureIntent22222");
            // Continue only if the File was successfully created
            if (photoFile != null) {

                selUri = FileProvider.getUriForFile(getActivity(),
                        "com.plenome.pos.fileprovider",
                        photoFile);
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, selUri);
                startActivityForResult(takePictureIntent, CAMERA_REQUEST_CODE);
                Log.i("myLog", "dispatchTakePictureIntent33333");
            }
        }
    }

    @OnClick(R.id.recordstop)
    public void Stop_Recording_Clicked(View view) {
        augnitoSpeechAudio.StopSpeech();
        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
                rectextlistening.setText("Tap to mic on...");
            }
        });

    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        System.out.println("print pause stop record");
        if(augnitoSpeechAudio != null){
            augnitoSpeechAudio.StopSpeech();
            requireActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    record.setVisibility(View.VISIBLE);
                    recordstop.setVisibility(View.GONE);
                    rectextlistening.setText("Tap to mic on...");
                }
            });
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("print pause stop record");
        if(augnitoSpeechAudio != null){
        augnitoSpeechAudio.StopSpeech();
        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
                rectextlistening.setText("Tap to mic on...");
            }
        });
        }
    }


    @OnClick(R.id.record)
    public void recordAudio() {
        String contenttype = "audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";

        try {
            augnitoSpeechAudio = new AugnitoSpeechAudio(
                    this,
                    "wss://apis.augnito.ai/v2/speechapi",
                    "273ea63c-fde1-4d86-99a3-3a597d09af39",
                    "d029c49daa9141949dbaf8cca1b26f7b",
                    211801200, // Update with your lmid
                    "udhaya",
                    "",
                    -1,
                    "otherInfo", contenttype);

            AugnitoSpeechResult asr = augnitoSpeechAudio.StartSpeech(getActivity());

            if (asr.equals(AugnitoSpeechResult.Success)) {
                requireActivity().runOnUiThread(() -> {
                    record.setVisibility(View.GONE);
                    recordstop.setVisibility(View.VISIBLE);
                    rectextlistening.setText("Initializing Augnito.....");
                });
            }
        } catch (URISyntaxException e) {
            e.printStackTrace(); // Log the exception
            requireActivity().runOnUiThread(() -> {
                rectextlistening.setText("URI Syntax Error: " + e.getMessage());
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
            });
        } catch (Exception e) {
            e.printStackTrace(); // Handle any other exceptions
            requireActivity().runOnUiThread(() -> {
                rectextlistening.setText("Error: " + e.getMessage());
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
            });
        }
    }


    @Override
    public void AugnitoSpeechEventCallback(String eventType, String eventValue) {
        String hypothesisText = "";
        if (eventType.equals("SESSION_CREATED")) {
            hypothesisText = "Listening...";
            // After successful authenticate, server creates an unique ID for each speech session and sends it back to client app for reference.
            // Client app can store this is it requires.
        } else if (eventType.equals("SERVICE_DOWN")) {
            // Very rare, But This event will come when Speech server's any internal component down.
        } else if (eventType.equals("NO_DICTATION_STOP_MIC")) {
            // Some time user start mic and forgot after it. start doing discussion with colleague or on phone.
            // In this case mic is on and user is not dictating any valid speech for trascription. Server can detect such situations and send an event to confirm from user.
        } else if (eventType.equals("INVALID_AUTH_CREDENTIALS")) {
            // This event happens when one of following is invalid.
            // AccountCode, AccessKey, Active subscription for trial or paid. lmid.
        } else if ("LOW_BANDWIDTH".equals(eventType)) {
            // This event happens when server don't sufficient audio data in significant interval.
            hypothesisText = "Poor internet connection";
        } else if ("SOCKET_DISCONNECT".equals(eventType)) {
            hypothesisText = "Disconnected";
            //event will trigger when socket connection is closed
            // when you stop the mic or due to down internet connection
        }
        String finalHypothesisText = hypothesisText;
        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                rectextlistening.setText(finalHypothesisText);
            }
        });
    }

    @Override
    public void AugnitoHypothesesCallback(String hypotheses) {
        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                rectextlistening.setText(hypotheses);
            }
        });
    }

    @Override
    public void AugnitoErrorCallback(String message) {

    }

    @Override
    public void AugnitoFinalOutputCallback(ActionRecipe actionRecipe) {
        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                System.out.println("print command " + actionRecipe.IsCommand);
                if (actionRecipe.IsStaticCommand || actionRecipe.IsCommand) {
                    ProcessCommand(actionRecipe);
                } else {
                    System.out.println("print else ");
                    UpdateSelectedView(actionRecipe.ReceivedText);
                }
            }
        });
    }

    private void ProcessCommand(ActionRecipe recipe) {
        {
            int SetSelectionStart = 0;
            switch (recipe.Name) {
                case Commands.DeleteIt:
                case Commands.DeleteThat:
                case Commands.DeletePreviousWord:
                case Commands.DeletePreviousLine:
                    char splitChar = ' ';
                    if (recipe.Name == Commands.DeletePreviousLine)
                        splitChar = '\n';
                    String[] lines = GetEditorText().split(splitChar + "");
                    if (lines != null && lines.length > 0) {
                        String last = lines[lines.length - 1];
                        int index = GetEditorText().indexOf(last);
                        SetSelectionStart = (GetEditorText().length() - index) + 1;
                    }

                    break;
                case Commands.Goto:
                    String toFocus = recipe.SearchText;
                    System.out.println("print line" + recipe.SearchText);
                    switch (toFocus.toLowerCase().replace(" ", "")) {
                        case "enterthetext":
                            recordText.requestFocus();
                            break;
                        case "ctenterthetext":
                            recordText.requestFocus();
                            break;
                    }
                    return;

            }

            try {

                int offset = CursorPosition - SetSelectionStart;
                if (offset < 0)
                    offset = 0;
                if (selectedEditText == null) {
                    selectedEditText = recordText;
                }
                selectedEditText.setSelection(offset, selectedEditText.getSelectionStart());
                Editable editText = selectedEditText.getEditableText();
                editText.replace(selectedEditText.getSelectionStart(), selectedEditText.getSelectionEnd(), "");
                selectedEditText.setSelection(selectedEditText.getSelectionStart());
            } catch (Exception ex) {
                Log.d("Error", "ProcessCommand: " + ex.getMessage());
                ex.printStackTrace();
            }

        }
    }

    private void UpdateSelectedView(String receivedText) {
        System.out.println("print selectedview " + receivedText);
        if (selectedView.equalsIgnoreCase("Enter the report")) {
            recordText.setText(UpdateTextFormat(recordText.getText().toString(), receivedText));
            recordText.setSelection(recordText.getText().length());
            selectedEditText = recordText;
        }
    }

    @Override
    public void onFocusChange(View view, boolean hasFocus) {
        System.out.println("print focus" +  hasFocus);
        if (hasFocus) {
            ExtendedEditTExt e = (ExtendedEditTExt) view;
            selectedView = e.getHint().toString().toLowerCase();
            selectedEditText = e;
            e.addOnSelectionChangedListener(this);
        }

    }

    private String GetEditorText() {
        if (selectedEditText != null) {
            return selectedEditText.getText().toString();
        }
        return "";
    }


    private String UpdateTextFormat(String existingText, String receivedText) {
        // We called this part of code, client side beatification.
        // In client side beatification text need to be processed for better formatting,
        // The Processing done here is :-
        //      Make first Charecter capital, if after fullstop.
        //      Remove prefix spaces as and when need.
        String finalText = "";
        receivedText = receivedText.replaceAll("\n", "@newline@");
        String checkPunctuation = receivedText.trim();
        boolean IsPunctuation = false;
        if (checkPunctuation.startsWith(",") || checkPunctuation.startsWith(".") || checkPunctuation.startsWith(":") || checkPunctuation.startsWith("?")) {
            receivedText = checkPunctuation;
            IsPunctuation = true;
        }
        if (existingText == null || existingText.length() == 0) {
            receivedText = receivedText.trim();
            finalText = CapitalizeFirstLetter(receivedText);
        } else if (existingText.endsWith("\n")) {
            receivedText = receivedText.trim();
            receivedText = CapitalizeFirstLetter(receivedText);
            finalText = existingText + receivedText;
        } else if (existingText.endsWith(":") || existingText.endsWith(".")) {
            receivedText = receivedText.trim();
            receivedText = CapitalizeFirstLetter(receivedText);
            finalText = existingText + " " + receivedText;
        } else {
            if (IsPunctuation) {
                finalText = existingText + receivedText;
            } else {
                finalText = existingText + " " + receivedText;
            }
        }
        finalText = finalText.replaceAll("@newline@", "\n");
        return finalText;
    }

    private String CapitalizeFirstLetter(String receivedText) {

        if (receivedText.length() < 2) {
            return receivedText;
        }
        // get First letter of the string
        String firstLetStr = receivedText.substring(0, 1);
        // Get remaining letter using substring
        String remLetStr = receivedText.substring(1);
        // convert the first letter of String to uppercase
        firstLetStr = firstLetStr.toUpperCase();
        // concantenate the first letter and remaining string
        return firstLetStr + remLetStr;
    }

    public boolean CheckPermissions() {
        int result = ContextCompat.checkSelfPermission(getActivity(), WRITE_EXTERNAL_STORAGE);
        int result1 = ContextCompat.checkSelfPermission(getActivity(), RECORD_AUDIO);
        return result == PackageManager.PERMISSION_GRANTED && result1 == PackageManager.PERMISSION_GRANTED;
    }

    private void RequestPermissions() {
        ActivityCompat.requestPermissions(getActivity(), new String[]{RECORD_AUDIO, WRITE_EXTERNAL_STORAGE}, REQUEST_AUDIO_PERMISSION_CODE);
    }

    @Override
    public void onSelectionChanged(int selStart, int selEnd) {
        CursorPosition = selEnd;
    }
}