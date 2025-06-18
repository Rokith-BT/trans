package com.plenome.pos.utils;

import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class FileUtils {

    // Extract the path from URI after user selects the file
    public static String getPathFromUri(Context context, Uri uri) {
        Cursor cursor = context.getContentResolver().query(uri, null, null, null, null);
        String fileName = ""; // Leave file name empty for user upload

        if (cursor != null && cursor.moveToFirst()) {
            int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
            if (index != -1) {
                fileName = cursor.getString(index);
            }
            cursor.close();
        }

        // Create a file in the cache directory with user-defined name
        File tempFile = new File(context.getCacheDir(), fileName);
        copyFileFromUri(context, uri, tempFile);
        return tempFile.getAbsolutePath();  // Return path of the file in cache
    }

    // Copy selected file from URI to the application's cache directory
    private static void copyFileFromUri(Context context, Uri uri, File destinationFile) {
        try (InputStream inputStream = context.getContentResolver().openInputStream(uri);
             OutputStream outputStream = new FileOutputStream(destinationFile)) {

            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
