package com.plenome.pos.services;

import android.content.Intent;
import android.print.PrintAttributes;
import android.print.PrinterCapabilitiesInfo;
import android.print.PrinterId;
import android.print.PrinterInfo;
import android.printservice.PrintJob;
import android.printservice.PrintService;
import android.printservice.PrinterDiscoverySession;
import android.util.Log;

import androidx.annotation.Nullable;

import com.plenome.pos.views.MainActivity;

import java.util.ArrayList;
import java.util.List;

public class MyPrintService extends PrintService {

    PrinterInfo mThermalPrinter;

    @Override
    public void onCreate() {
        Log.i("myLog","Print service oncreate");
        mThermalPrinter = new PrinterInfo.Builder(generatePrinterId("USB"),
                "USB Printer", PrinterInfo.STATUS_IDLE).build();
    }

    @Override
    protected void onPrintJobQueued(PrintJob printJob) {
        Log.i("myLog","Print service onPrintJobQueued");
        Intent intent = new Intent(MyPrintService.this, MainActivity.class);
        intent.putExtra("data", printJob.getDocument().getData());
        printJob.start();
        startActivity(intent);
    }

    @Nullable
    @Override
    protected PrinterDiscoverySession onCreatePrinterDiscoverySession() {
        Log.i("myLog","Print service onCreatePrinterDiscoverySession");
        return new ThermalPrinterDiscoverySession(mThermalPrinter);
    }

    @Override
    protected void onRequestCancelPrintJob(PrintJob printJob) {
        Log.i("myLog","Print service onRequestCancelPrintJob");
        printJob.cancel();
    }
}

class ThermalPrinterDiscoverySession extends PrinterDiscoverySession {

    private PrinterInfo printerInfo;


    ThermalPrinterDiscoverySession(PrinterInfo printerInfo) {
        Log.i("myLog","Print service ThermalPrinterDiscoverySession");
        PrinterCapabilitiesInfo capabilities =
                new PrinterCapabilitiesInfo.Builder(printerInfo.getId())
                        .addMediaSize(PrintAttributes.MediaSize.ISO_A4, true)
                        .addResolution(new PrintAttributes.Resolution("1234","Default",58,160), true)
                        .setColorModes(PrintAttributes.COLOR_MODE_MONOCHROME, PrintAttributes.COLOR_MODE_MONOCHROME)
                        .build();
        this.printerInfo = new PrinterInfo.Builder(printerInfo)
                .setCapabilities(capabilities)
                .build();
    }

    @Override
    public void onStartPrinterDiscovery(List<PrinterId> priorityList) {
        Log.i("myLog","Print service onStartPrinterDiscovery");
        List<PrinterInfo> printers = new ArrayList<PrinterInfo>();
        printers.add(printerInfo);
        addPrinters(printers);
    }

    @Override
    public void onStopPrinterDiscovery() {
        Log.i("myLog","Print service onStopPrinterDiscovery");
    }

    @Override
    public void onValidatePrinters(List<PrinterId> printerIds) {
        Log.i("myLog","Print service onValidatePrinters");
    }

    @Override
    public void onStartPrinterStateTracking(PrinterId printerId) {
        Log.i("myLog","Print service onStartPrinterStateTracking");
    }

    @Override
    public void onStopPrinterStateTracking(PrinterId printerId) {
        Log.i("myLog","Print service onStopPrinterStateTracking");
    }

    @Override
    public void onDestroy() {
        Log.i("myLog","Print service onDestroy");
    }
}