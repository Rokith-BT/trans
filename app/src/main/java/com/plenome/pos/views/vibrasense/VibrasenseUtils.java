package com.plenome.pos.views.vibrasense;

import java.util.ArrayList;

public class VibrasenseUtils {

    static {
        System.loadLibrary("test");
        System.loadLibrary("test-lib");
    }
    public native ArrayList<String> getReport(String data);

}
