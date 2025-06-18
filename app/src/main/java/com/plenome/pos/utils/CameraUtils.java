package com.plenome.pos.utils;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class CameraUtils {

    private static final int REQUEST_IMAGE_CAPTURE = 1;
    private static final int REQUEST_PERMISSIONS = 100;
    private static Uri imageUri;
    private static String currentPhotoPath;

    // Method to check permissions in a fragment context
    public static boolean checkAndRequestPermissions(Fragment fragment) {
        Context context = fragment.getContext();
        if (context == null) return false;

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED ||
                ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            fragment.requestPermissions(new String[]{
                    Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_PERMISSIONS);
            return false;
        }
        return true;
    }

    // Method to start image capture
    public static void captureImage(Fragment fragment) {
        if (checkAndRequestPermissions(fragment)) {
            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (takePictureIntent.resolveActivity(fragment.getActivity().getPackageManager()) != null) {
                File photoFile = null;
                try {
                    photoFile = createImageFile(fragment.getContext());
                } catch (IOException ex) {
                    Log.e("CameraUtils", "Error occurred while creating the file", ex);
                }

                if (photoFile != null) {
                    imageUri = FileProvider.getUriForFile(fragment.getContext(), fragment.getContext().getPackageName() + ".fileprovider", photoFile);
                    takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
                    fragment.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
                }
            }
        }
    }

    // Method to create image file
    private static File createImageFile(Context context) throws IOException {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String imageFileName = "JPEG_" + timeStamp + "_";
        File storageDir = context.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File image = File.createTempFile(imageFileName, ".jpg", storageDir);
        currentPhotoPath = image.getAbsolutePath();
        return image;
    }

    // Method to handle the result of image capture
    public static Bitmap handleImageCapture(Context context, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == Activity.RESULT_OK) {
            try {
                File file = new File(currentPhotoPath);
                return MediaStore.Images.Media.getBitmap(context.getContentResolver(), Uri.fromFile(file));
            } catch (IOException e) {
                Log.e("CameraUtils", "Error processing image capture", e);
            }
        }
        return null;
    }

    // Callback for permission result handling
    public static void onRequestPermissionsResult(int requestCode, int[] grantResults, Fragment fragment) {
        if (requestCode == REQUEST_PERMISSIONS) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED &&
                    grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                captureImage(fragment);
            } else {
                Log.e("CameraUtils", "Permissions not granted");
            }
        }
    }
}
