package com.plenome.pos.views.vibrasense;

import android.Manifest;
import android.app.AlertDialog;
import android.app.Dialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.bpMonitor.OmronScanFragment;
import com.plenome.pos.R;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.views.vibrasense.ecg.FileUploadAndGraphActivity;

import java.util.ArrayList;
import java.util.List;

import butterknife.ButterKnife;
import butterknife.OnClick;

public class VitalsFragment extends Fragment {
    View rootView;
    RestServices services;
    private static final int REQUEST_CODE_OPEN_GPS = 1;
    private static final int REQUEST_CODE_PERMISSION_LOCATION = 2;
    private Dialog dialogScan;
    private Integer option;
    String opdId;
    int hospitalId,patientId;

    String DeviceClick="";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_vitals, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        Bundle bundle = getArguments();
        if (bundle != null) {
            opdId = String.valueOf(bundle.getInt("opdId"));
            patientId = bundle.getInt("patient_id");
            DeviceClick = bundle.getString("DeviceClick");
        }
        PreferenceManager.setString(PreferenceManager.DEVICE_CLICK, DeviceClick);
        System.out.println("print opdId: " + opdId);
        System.out.println("print patientId: " + patientId);
        return rootView;
    }

    @OnClick(R.id.imgVibrasense)
    public void clickedVibraSense() {
        option = 1;
        checkPermissions();
        gotoVibrasenseScanFragment();
    }

    @OnClick(R.id.imgEcg)
    public void clickedimgEcg() {
        imgEcgFragment();
    }

    private void imgEcgFragment() {
        Intent intent = new Intent(getActivity(), FileUploadAndGraphActivity.class);
        startActivity(intent);
    }

    @OnClick(R.id.imgOmron)
    public void clickedOmron() {
        option = 2;
        checkPermissions();
        gotoOmronScanFragment();
    }


    private void checkPermissions() {
        BluetoothAdapter bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (!bluetoothAdapter.isEnabled()) {
            Toast.makeText(getActivity(), "Please turn on Bluetooth first", Toast.LENGTH_LONG).show();
            return;
        }

        String[] permissions = {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT};
        List<String> permissionDeniedList = new ArrayList<>();
        for (String permission : permissions) {
            int permissionCheck = ContextCompat.checkSelfPermission(getActivity(), permission);
            if (permissionCheck == PackageManager.PERMISSION_GRANTED) {
                onPermissionGranted(permission);
            } else {
                permissionDeniedList.add(permission);
            }
        }
        if (!permissionDeniedList.isEmpty()) {
            String[] deniedPermissions = permissionDeniedList.toArray(new String[permissionDeniedList.size()]);
            ActivityCompat.requestPermissions(getActivity(), deniedPermissions, REQUEST_CODE_PERMISSION_LOCATION);
        }
    }

    private void onPermissionGranted(String permission) {
        switch (permission) {
            case Manifest.permission.ACCESS_FINE_LOCATION:
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !checkGPSIsOpen()) {
                    new AlertDialog.Builder(getActivity())
                            .setTitle("Prompt")
                            .setMessage("Current mobile phone scanning Bluetooth needs to open the positioning function")
                            .setNegativeButton("Cancel",
                                    new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            //   finish();
                                        }
                                    })
                            .setPositiveButton("Go to settings",
                                    new DialogInterface.OnClickListener() {
                                        @Override
                                        public void onClick(DialogInterface dialog, int which) {
                                            Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                                            startActivityForResult(intent, REQUEST_CODE_OPEN_GPS);
                                        }
                                    })

                            .setCancelable(false)
                            .show();
                } else {
                    if (option.equals(1)){
                      /*  gotoVibrasenseScanFragment();*/
                    }else {
                        gotoOmronScanFragment();
                    }
                }
                break;
        }
    }

    private boolean checkGPSIsOpen() {
        LocationManager locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
        if (locationManager == null)
            return false;
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CODE_OPEN_GPS) {
            if (checkGPSIsOpen()) {
                if (option.equals(1)){
                   // gotoVibrasenseScanFragment();
                }else {
                    gotoOmronScanFragment();
                }            } else {
                Toast.makeText(getActivity(), "Permission Denied", Toast.LENGTH_LONG).show();
                //  VibrasenseMainActivity.this.finish();
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQUEST_CODE_PERMISSION_LOCATION) {
            for (int i = 0; i < permissions.length; i++) {
                String permission = permissions[i];
                int grantResult = grantResults[i];

                if (permission.equals(Manifest.permission.ACCESS_FINE_LOCATION)) {
                    if (grantResult == PackageManager.PERMISSION_GRANTED) {
                        onPermissionGranted(permission);
                    } else {
                        Toast.makeText(getActivity(), "Permission Denied", Toast.LENGTH_LONG).show();
                        //    VibrasenseMainActivity.this.finish();
                    }
                }
            }
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    public void showScanDialog() {
        Log.i("myLog", "showAadharOTPDialog");
        dialogScan = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_device_scan, null);
        dialogScan.setContentView(view);
        ImageView image = dialogScan.findViewById(R.id.imgScan);
        RelativeLayout rel = dialogScan.findViewById(R.id.relScan);
        TextView txtConnecting = dialogScan.findViewById(R.id.txt_connecting);
        TextView txtScanning = dialogScan.findViewById(R.id.scanning_for);
        TextView txtDevName = dialogScan.findViewById(R.id.txt_device_name);
        dialogScan.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogScan.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogScan.getWindow().getAttributes());
        lp.width = dpToPx(900);
        lp.height = dpToPx(600);
        dialogScan.getWindow().setAttributes(lp);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                rel.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.vibrasense_device));
                image.setVisibility(View.GONE);
                txtScanning.setVisibility(View.GONE);
                txtDevName.setVisibility(View.VISIBLE);
                txtConnecting.setVisibility(View.VISIBLE);
                goToVibrasenseReadingFragment();
            }
        }, 1500);
    }

    public void goToVibrasenseReadingFragment() {
/*        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                if (dialogScan.isShowing())
                    dialogScan.dismiss();
                VibrasenseReadingFragment newFragment = new VibrasenseReadingFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                transaction.replace(R.id.fragment_container, newFragment, "Vibrasense_reading");
                transaction.addToBackStack(null);
                transaction.commit();

            }
        }, 1500);*/

    }

    private void gotoVibrasenseScanFragment() {
     /*   VibrasenseScanFragment newFragment = new VibrasenseScanFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment, "Vibrasense_scan");
        transaction.addToBackStack(null);
        transaction.commit();*/
        Intent intent = new Intent(getActivity(), DeviceScanAndConnectActivity.class);

        intent.putExtra("patient_id", patientId);
        intent.putExtra("opdId", opdId);
        startActivity(intent);
    }

    private void gotoOmronScanFragment() {
        OmronScanFragment newFragment = new OmronScanFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment, "Omron_scan");
        transaction.addToBackStack(null);
        transaction.commit();
    }


}
