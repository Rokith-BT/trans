package com.plenome.pos.utils;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;

public class JavaScriptInterface {

    private Context mContext;

    public JavaScriptInterface(Context context) {
        mContext = context;
    }

    // Method to receive the value from the web page
    @JavascriptInterface
    public void showMyValue(String passedValue) {
        Log.i("myLog", "Received value: " + passedValue);
        // Handle the value as needed
    }


}
