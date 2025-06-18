package com.plenome.pos.views.vibrasense;

import static android.app.PendingIntent.getActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ayati.connectvibrasense.main.VibrasenseConnect;
import com.clj.fastble.data.BleDevice;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.plenome.pos.R;
import com.plenome.pos.views.vibrasense.adapter.VibrasenseDevicesAdapter;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class DeviceScanAndConnectActivity extends AppCompatActivity implements VibrasenseDevicesAdapter.DevicesAdapterListener {


    private final String TAG = DeviceScanAndConnectActivity.class.getSimpleName();
    private TextView btnScan, scanning_for, txt_devicename, devicename, connected, txtTitle;
    private RecyclerView rvDevices;
    private VibrasenseDevicesAdapter vibrasenseDevicesAdapter;
    private List<BleDevice> list = new ArrayList<BleDevice>();
    private BleDevice bleDevice;
    private RelativeLayout images;
    private ImageView imgBack;
    int hospitalId,patientId;
    String opdId;


    public static Intent getIntent(Context context) {
        Intent intent = new Intent(context, DeviceScanAndConnectActivity.class);
        return intent;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.device_connectsss);
        Log.i("myLog", "DeviceScanAndConnectActivity:");
        btnScan = findViewById(R.id.txt_addevice);
        txt_devicename = findViewById(R.id.txt_devicename);
        rvDevices = findViewById(R.id.rv_recycle);
        images = findViewById(R.id.relScan);
        scanning_for = findViewById(R.id.scanning_for);
        devicename = findViewById(R.id.devicename);
        connected = findViewById(R.id.connect);
        imgBack = findViewById(R.id.imgBack);
        txtTitle = findViewById(R.id.txtTitle);
        txtTitle.setText("Vibrasense");
        opdId = getIntent().getStringExtra("opdId");
        patientId = getIntent().getIntExtra("patient_id", 0);
        //  System.out.println("patient_id::"+patientId);
        //System.out.println("opdId_id::"+opdId);
        Log.i("myLog", "patient_id::" + patientId);
        Log.i("myLog", "opdId::" + opdId);
        SharedPreferences sharedPreferences = getSharedPreferences("VibrasenseDevicesPref", Context.MODE_PRIVATE);
        String deviceName = sharedPreferences.getString("device_name", "Default Name");
        String deviceMac = sharedPreferences.getString("device_mac", "Default MAC");
        Log.i("myLog", "deviceName::" + deviceName);
        Log.i("myLog", "deviceMac::" + deviceMac);
        Log.i("myLog", "list size::" + list.size());


        vibrasenseDevicesAdapter = new VibrasenseDevicesAdapter(this, list, this);

        rvDevices.setLayoutManager(new LinearLayoutManager(this));
        //   rvDevices.setAdapter(vibrasenseDevicesAdapter);
        setDeviceCallback();
        loadDeviceData();
        imgBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();

            }
            });
        btnScan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                btnScan.setVisibility(View.VISIBLE);
                txt_devicename.setVisibility(View.VISIBLE);
                images.setVisibility(View.VISIBLE);
                scanning_for.setVisibility(View.VISIBLE);
                startScanning();

            }
        });

    }

    private void loadDeviceData() {
        Log.i("mylog", "Load device data");
        SharedPreferences sharedPreferences = getSharedPreferences("VibrasenseDevicesPref", MODE_PRIVATE);
        String json = sharedPreferences.getString("device_list", null);

     /*   if (json != null) {
            Log.i("mylog", "json != null");
            Gson gson = new Gson();
            Type type = new TypeToken<List<BleDevice>>() {
            }.getType();
            List<BleDevice> savedDevices = gson.fromJson(json, type);
            Log.i("mylog", "savedDevices size:" + savedDevices.size());
            if (savedDevices != null && !savedDevices.isEmpty()) {
                // If there are saved devices, add them to the adapter's list
                list.clear();
                list.addAll(savedDevices);

            }
            Log.i("mylog", "list size:" + list.size());
        } else {
            Log.i("mylog", "No device found");
        }*/

        if (json != null) {
            Log.i("myLog","json!=null");
            Gson gson = new Gson();
            BleDevice savedDevice = gson.fromJson(json, BleDevice.class);
            Log.i("myLog","after getting saveDevice");
            list.clear();
            list.add(savedDevice);
            Log.i("myLog", "Saved device name: " + savedDevice.getName()); // or whatever method it has
        } else {
            Log.i("myLog", "No saved device found");
        }

    }

    private void startScanning() {
        Log.i("myLog", "startScanning");
        vibrasenseDevicesAdapter.clear();
        VibrasenseConnect.getINSTANCE().startVibrasenseScanning();
        Log.i("myLog", "After startVibrasenseScanning");
    }

    public void setDeviceCallback() {
        Log.i("myLog", "setDeviceCallback");
        VibrasenseConnect.getINSTANCE().connectDevice(this, new VibrasenseConnect.VibrasenseConnectDeviceDialogListener() {
            @Override
            public void onDeviceConnect() {

                Log.i("myLog", "onDeviceConnect");
                moveToNextScreen();
            }

            @Override
            public void onDeviceFailed(String s) {
                Log.e(TAG, "device failed message = " + s);
            }

            @Override
            public void onVibrasenseDeviceStatusUpdate(String s) {
                Log.e(TAG, "device status message = " + s);
            }

            @Override
            public void onVibrasenseDeviceDiscover(BleDevice bleDevice) {
                Log.i("myLog", "onVibrasenseDeviceDiscover");
                if (bleDevice != null) {
                    // vibrasenseDevicesAdapter.clear();
                    vibrasenseDevicesAdapter.addData(bleDevice);
                    Log.i("myLog", "data added to adapter");
                    images.setVisibility(View.GONE);
                    scanning_for.setVisibility(View.GONE);
                    rvDevices.setAdapter(vibrasenseDevicesAdapter);
                    // Save to SharedPreferences
                    SharedPreferences prefs = getSharedPreferences("VibrasenseDevicesPref", MODE_PRIVATE);
                    SharedPreferences.Editor editor = prefs.edit();
                    Gson gson = new Gson();
                    String json = gson.toJson(bleDevice);
                    editor.putString("device_list", json);
                    editor.apply();

                    Log.i("myLog", "Device saved to SharedPreferences");
                }

            }

            @Override
            public void onErrorMessage(String s) {
                Log.e(TAG, "error message = " + s);
            }
        });
    }

    private void moveToNextScreen() {
        Log.i("myLog", "moveToNextScreen");
        startActivity(FootActivity.getIntent(this, bleDevice, opdId, String.valueOf(patientId)));
        finish();
    }


    @Override
    public void onDeviceClick(int position, BleDevice ble) {
        this.bleDevice = ble;
        VibrasenseConnect.getINSTANCE().connectVibrasenseDevice(bleDevice);
        ImageView connectedImage = findViewById(R.id.imgVibrasense);
        if (connectedImage != null) {
            rvDevices.setVisibility(View.GONE);
            btnScan.setVisibility(View.GONE);
            txt_devicename.setVisibility(View.GONE);
            connectedImage.setVisibility(View.VISIBLE);
            devicename.setVisibility(View.VISIBLE);
            connected.setVisibility(View.VISIBLE);
            connectedImage.setImageResource(R.drawable.vibrasense_device);
        }


    }
}