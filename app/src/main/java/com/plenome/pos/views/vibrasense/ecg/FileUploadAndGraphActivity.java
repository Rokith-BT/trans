package com.plenome.pos.views.vibrasense.ecg;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.jmatio.io.MatFileReader;
import com.jmatio.types.MLArray;
import com.jmatio.types.MLDouble;
import com.jmatio.types.MLSingle;
import com.plenome.pos.R;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

public class FileUploadAndGraphActivity extends AppCompatActivity {
    private LineChart lineChart;
    private Button uploadfile;
    private ImageView uploadImage, imgBack;
    private TextView txtTitle;
    private static final int PICK_MAT_FILE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_file_upload_and_graph);
        lineChart = findViewById(R.id.lineChart);
        uploadfile = findViewById(R.id.uploadfile);
        uploadImage = findViewById(R.id.uploadImage);
        txtTitle = findViewById(R.id.txtTitle);
        imgBack = findViewById(R.id.imgBack);
        txtTitle.setText("Bonesaw sensor");
        uploadfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openFileChooser();
            }
        });
        imgBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


    }

    //    private void openFileChooser() {
//        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
//        intent.setType("*/*");  // Select any file
//        intent.addCategory(Intent.CATEGORY_OPENABLE);
//        startActivityForResult(Intent.createChooser(intent, "Select .mat file"), PICK_MAT_FILE);
//    }
    private void openFileChooser() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("application/octet-stream");
        intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/octet-stream"});
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(Intent.createChooser(intent, "Select .mat file"), PICK_MAT_FILE);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_MAT_FILE && resultCode == RESULT_OK && data != null) {
            Uri uri = data.getData();
            if (uri != null) {
                String filePath = getPathFromUri(getApplicationContext(), uri);
                Log.i("mylog", "file path:" + filePath);
                if (filePath != null) {
                    //   readFile(filePath);
                    LineChart lineChart = findViewById(R.id.lineChart);  // Get the LineChart from the layout
                    readFile(filePath, lineChart);
                    uploadfile.setVisibility(View.GONE);
                    uploadImage.setVisibility(View.GONE);
                    lineChart.setVisibility(View.VISIBLE);
                } else {
                    Log.e("MainActivity", "Failed to get file path");
                }
            }
        }
    }

    public String getPathFromUri(Context context, Uri uri) {
        ContentResolver contentResolver = context.getContentResolver();
        String fileName = getFileName(context, uri);
        File file = new File(context.getCacheDir(), fileName);

        try {
            InputStream inputStream = contentResolver.openInputStream(uri);
            FileOutputStream outputStream = new FileOutputStream(file);
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            inputStream.close();
            outputStream.close();
        } catch (Exception e) {
            Log.e("FileUtils", "Error copying file", e);
            return null;
        }
        return file.getAbsolutePath();
    }

    private String getFileName(Context context, Uri uri) {
        String result = "temp_file";
        Cursor cursor = context.getContentResolver().query(uri, null, null, null, null);
        if (cursor != null && cursor.moveToFirst()) {
            int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
            if (nameIndex != -1) {
                result = cursor.getString(nameIndex);
            }
            cursor.close();
        }
        return result;
    }

    public static void readFile(String filePath, LineChart lineChart) {
        try {
            MatFileReader matReader = new MatFileReader(filePath);

            // Print available variables
            System.out.println("MAT File Variables:");
            for (String varName : matReader.getContent().keySet()) {
                System.out.println("Variable: " + varName);
            }

            // Extract scalar variables (dt, t0, N)
            double t0 = getScalarVariable(matReader, "t0");
            double dt = getScalarVariable(matReader, "dt");
            int N = (int) getScalarVariable(matReader, "N");  // Ensure it's cast to int

            Log.i("MATReader", "t0: " + t0 + ", dt: " + dt + ", N: " + N);

            // Extract 'x' values
            MLArray mlArrayX = matReader.getMLArray("x");
            if (mlArrayX == null) {
                Log.e("MATReader", "Variable 'x' not found in .mat file");
                return;
            }

            double[] xValues = new double[N];
            if (mlArrayX instanceof MLSingle) {
                MLSingle mlSingleX = (MLSingle) mlArrayX;

                for (int i = 0; i < N; i++) {
                    xValues[i] = mlSingleX.getReal(0, i);  // Extract from row 0, column i
                }
            } else if (mlArrayX instanceof MLDouble) {
                xValues = ((MLDouble) mlArrayX).getArray()[0]; // If MLDouble, extract directly
            } else {
                Log.e("MATReader", "Unsupported type for 'x': " + mlArrayX.getClass().getSimpleName());
                return;
            }

            // Debug: Print first 10 values of x
            System.out.println("First 10 values of x:");
            for (int i = 0; i < Math.min(10, xValues.length); i++) {
                System.out.print(xValues[i] + " ");
            }
            System.out.println();

            // Generate time values using t = t0 + n * dt
            ArrayList<Entry> entries = new ArrayList<>();
            for (int i = 0; i < N; i++) {
                float time = (float) (t0 + i * dt);
                float value = (float) xValues[i];
                entries.add(new Entry(time, value));
            }

            // Create dataset
            LineDataSet dataSet = new LineDataSet(entries, "Bonesaw Sensor");
            lineChart.getLegend().setEnabled(false);
            dataSet.setColor(R.color.menuTxtColor);
            dataSet.setLineWidth(2f);
            dataSet.setValueTextColor(Color.BLACK);
            dataSet.setDrawCircles(false);
            lineChart.getDescription().setEnabled(false);
            XAxis xAxis = lineChart.getXAxis();

            xAxis.setPosition(XAxis.XAxisPosition.BOTH_SIDED);
            xAxis.setDrawAxisLine(true);



            // Set up the chart
            LineData lineData = new LineData(dataSet);
            lineChart.setData(lineData);
            lineChart.invalidate();
        } catch (IOException e) {
            Log.e("MATReader", "Error reading .mat file", e);
        }
    }

    // Helper method to extract single value (dt, t0, N)
    private static double getScalarVariable(MatFileReader matReader, String varName) {
        MLArray mlArray = matReader.getMLArray(varName);
        if (mlArray instanceof MLDouble) {
            return ((MLDouble) mlArray).getArray()[0][0];
        } else if (mlArray instanceof MLSingle) {
            return ((MLSingle) mlArray).getReal(0, 0);  // Extract first float value
        } else {
            Log.e("MATReader", "Variable '" + varName + "' not found or invalid.");
            return 0;
        }
    }


}