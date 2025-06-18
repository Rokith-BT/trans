package com.plenome.pos.utils;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;

import com.google.gson.Gson;
//import com.pixplicity.sharp.Sharp;
import com.plenome.pos.R;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import okhttp3.Cache;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class OPHubUtils {

    private static OkHttpClient httpClient;

    public static void showAlertDialog(Context context, String text) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        // builder.setTitle("Error");
        builder.setMessage(text);
        builder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface arg0, int arg1) {
            }
        });
        builder.show(); //To show the AlertDialog
    }
    public static void showUnknownErrorDialog(Context context) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        // builder.setTitle("Error");
        builder.setMessage("Error occurred!");
        builder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface arg0, int arg1) {
            }
        });
        builder.show(); //To show the AlertDialog
    }

    public static void showErrorDialog(Context context, String msg) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        //  builder.setTitle("Error");
        builder.setMessage(msg);
        builder.setPositiveButton("Ok", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface arg0, int arg1) {
            }
        });
        builder.show(); //To show the AlertDialog
    }

    public static void addProdTypeSpinner(Activity activity, List<String> list, Spinner spinner, String hint) {
        final int listSize = list.size();
        if (!list.contains(hint))
            list.add(listSize, hint);
        // Initializing an ArrayAdapter
        final int newSize = list.size();
        final ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(
                activity
                , R.layout.spinner_item, list) {
            @Override
            public boolean isEnabled(int position) {
                if (position == newSize - 1)
                    // Disable the first item from Spinner
                    // First item will be use for hint
                    return false;
                else
                    return true;
            }

            @Override
            public View getDropDownView(int position, View convertView,
                                        ViewGroup parent) {
                View view = super.getDropDownView(position, convertView, parent);
                TextView tv = (TextView) view;
                if (position == newSize - 1) {
                    // Set the hint text color gray
                    tv.setTextColor(Color.GRAY);
                } else {
                    tv.setTextColor(Color.BLACK);
                }
                return view;
            }
        };
        spinnerArrayAdapter.setDropDownViewResource(R.layout.spinner_item);
        spinner.setAdapter(spinnerArrayAdapter);
        spinner.setSelection(newSize - 1);
    }

    public static void loadSvgFromUrl(Context context, String imageUrl, ImageView imageView) {
        // Load data from the URL as a byte stream
        // Use Sharp to convert the byte stream to an SVG image
        //  Sharp.loadPath(imageUrl);
//        Sharp.loadString(imageUrl).into(imageView);
    }


    public static void fetchSvg(Context context, String url, final ImageView target) {
        Log.i("myLog", "URL:" + url);
        if (httpClient == null) {
            // Use cache for performance and basic offline capability
            httpClient = new OkHttpClient.Builder()
                    .cache(new Cache(context.getCacheDir(), 5 * 1024 * 1014))
                    .build();
        }

        Request request = new Request.Builder().url(url).build();
        httpClient.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.i("myLog", "onFailure:" + e.toString());
                target.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_no_flag));
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.i("myLog", "onResponse:" + new Gson().toJson(response.body()));

                InputStream stream = response.body().byteStream();
                try {
                    if (stream != null) {
                        Log.i("myLog", "stream != null:");
//                        Sharp.loadInputStream(stream).into(target);
                    }
                } catch (Exception ex) {
                    Log.i("myLog", "Exceptionnnnn :" + ex.toString());
                }

                stream.close();
            }
        });
    }

    public static String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(new Date());
    }


}
