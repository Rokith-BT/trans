package com.plenome.pos.views;

import static com.imin.printerlib.util.BmpUtils.getBlackWhiteBitmap;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Point;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.text.Layout;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.imin.library.SystemPropManager;
import com.imin.printerlib.IminPrintUtils;
import com.plenome.pos.R;
import com.plenome.pos.model.ViewApptInfoResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.appointment.AppointmentFragment;

import java.util.ArrayList;
import java.util.List;

import androidmads.library.qrgenearator.QRGContents;
import androidmads.library.qrgenearator.QRGEncoder;
import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AppointmentTokenFragment extends Fragment {
    View rootView;

    RestServices services;

    @BindView(R.id.imgQR)
    ImageView imgQR;

    @BindView(R.id.doctorName)
    TextView txtDoctor;
    @BindView(R.id.txtApptNo)
    TextView txtApptNo;
    @BindView(R.id.token)
    TextView txtTokenNo;
    @BindView(R.id.txtName)
    TextView txtName;

    @BindView(R.id.txtSlotDate)
    TextView txtSlotDate;
    @BindView(R.id.txtSlotTime)
    TextView txtSlotTime;

    @BindView(R.id.plenome)
    TextView txtHospName;

    @BindView(R.id.address)
    TextView txtHospAddress;

    String apptId, doctorName, speciality, tokenNo, patientName, abhaNo, slotDate, slotTime, address, qrJsonStr;
    int hospitalId;
    String hospAddress, hospName;
    private List<String> connectTypeList;
    private byte[] content;
    private int orientation;
    private IminPrintUtils mIminPrintUtils;
    //  private BluetoothStateReceiver mBluetoothStateReceiver;
    //private DeviceListAdapter mAdapter;
    private int bluetoothPosition = -1;
    Bitmap bitmapQR;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_appointment_token, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.appointmentBook);
        Bundle bundle = getArguments();
        apptId = bundle.getString("appt_id");
        hospitalId = bundle.getInt("hospital_id");
        hospAddress = OPHubApplication.getHospitalAddress();
        hospName = OPHubApplication.getHospitalName();
        txtHospAddress.setText(hospAddress);
        txtHospName.setText(hospName);
        Log.i("myLog", "apptId:" + apptId + "   hospitalId: " + hospitalId + " hosp addr:" + hospAddress + "   hosp name:" + hospName);
        viewApptInfo();
        checkStorageManagerPermission();
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(),
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE,
                            Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.MOUNT_UNMOUNT_FILESYSTEMS}, 0);
        }
        initView();

        //   initReceiver();
        if (mIminPrintUtils == null) {
            mIminPrintUtils = IminPrintUtils.getInstance(getActivity());
        }
        mIminPrintUtils.resetDevice();

        return rootView;
    }


    @Override
    public void onResume() {
        super.onResume();
        //  fillAdapter();
     /*   DisplayMetrics dm = getResources().getDisplayMetrics();
        if (Utils.getWidth(getActivity()) <= 1460) {
            dm.density = 1.8f;
            dm.scaledDensity = 1.8f;
            dm.densityDpi = 200;
        } else {
            dm.density = 2.0f;
            dm.scaledDensity = 2.0f;
            dm.densityDpi = 220;
        }*/

        //  spiPrinter = SpiPrinter.getInstance();
    }

    @Override
    public void onDestroy() {
        // if (mBluetoothStateReceiver != null) {
        //   getActivity().unregisterReceiver(mBluetoothStateReceiver);
        // mBluetoothStateReceiver = null;
        //}
        mIminPrintUtils.unRegisterReceiver();
        IminPrintUtils.getInstance(getActivity()).resetDevice();
        super.onDestroy();

    }


    @OnClick(R.id.cancel_button)
    public void clickCancel() {
        AppointmentFragment newFragment = new AppointmentFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();

    }

    @OnClick(R.id.print_button)
    public void clickPrint() {
        mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.USB);
        int status = mIminPrintUtils.getPrinterStatus(IminPrintUtils.PrintConnectType.USB);
        if (status == 3) {
            OPHubUtils.showErrorDialog(getActivity(), "Print head open");
        } else if (status == 7) {
            OPHubUtils.showErrorDialog(getActivity(), "No paper feed");
        } else if (status == 8) {
            OPHubUtils.showErrorDialog(getActivity(), "Paper running out");
        }
        callPrinter();
    }

    private void generateQR(String json) {

        WindowManager manager = (WindowManager) getActivity().getSystemService(Context.WINDOW_SERVICE);

        // initializing a variable for default display.
        Display display = manager.getDefaultDisplay();

        // creating a variable for point which
        // is to be displayed in QR Code.
        Point point = new Point();
        display.getSize(point);

        // getting width and
        // height of a point
        int width = point.x;
        int height = point.y;
        Log.i("myLog", "width:" + width + "   height:" + height);
        // generating dimension from width and height.
        int dimen = width < height ? width : height;
        dimen = dimen * 1 / 2;
        Log.i("myLog", "dimen:" + dimen);
        //  dimen = 200;
        // setting this dimensions inside our qr code
        // encoder to generate our qr code.
        //   QRGEncoder qrgEncoder = new QRGEncoder("{\"name\":\"mathes\"}", null, QRGContents.Type.TEXT, dimen);
        QRGEncoder qrgEncoder = new QRGEncoder(json, null, QRGContents.Type.TEXT, dimen);
        try {
            // getting our qrcode in the form of bitmap.
            bitmapQR = qrgEncoder.getBitmap(0);
            // the bitmap is set inside our image
            // view using .setimagebitmap method.
            imgQR.setImageBitmap(bitmapQR);
        } catch (Exception e) {
            // this method is called for
            // exception handling.
            Log.e("Tag", e.toString());
        }
        //   callPrinter(json);
    }


    private void viewApptInfo() {
        Log.i("mylog", "viewApptInfo apptId:" + apptId);
        Call<ViewApptInfoResponse> call = services.viewApptInfo(hospitalId, String.valueOf(apptId));
        call.enqueue(new Callback<ViewApptInfoResponse>() {

            @Override
            public void onResponse(Call<ViewApptInfoResponse> call, Response<ViewApptInfoResponse> response) {
                try {
                    Log.i("myLog", "viewApptInfo response:");
                    Log.i("mylog", "viewApptInfo response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "viewApptInfo response isSuccess:" + response.body().toString());
                        ViewApptInfoResponse resp = response.body();
                        if (resp != null) {
                            //     List<ViewApptInfoResponse.AppointmentDetails> list = resp.getList();
                            //   Log.i("myLog", "list size>0" + list.size());
                            ViewApptInfoResponse.AppointmentDetails details = resp.getDetails();
                            Log.i("mylog", "viewApptInfo response111111111111:" + new Gson().toJson(resp));
                            if(details!=null) {
                                doctorName = details.getDoctorName();
                                txtDoctor.setText(doctorName);
                                apptId = details.getAppointment_id();
                                txtApptNo.setText(apptId);
                                tokenNo = details.getToken();
                                if (tokenNo == null) {
                                    tokenNo = "-";
                                }
                                txtTokenNo.setText("Token Number: " + tokenNo);
                                patientName = details.getPatientName();
                                txtName.setText(patientName);
                                abhaNo = details.getAbhaNo();
                                slotDate = details.getAppointmentDate();
                                txtSlotDate.setText(slotDate);
                                slotTime = details.getAppointmentTime();
                                txtSlotTime.setText(slotTime);
                                qrJsonStr = new Gson().toJson(resp);
                                generateQR(qrJsonStr);
                            }
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ViewApptInfoResponse> call, Throwable t) {
                Log.i("myLog", "viewApptInfo response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }


    private void checkStorageManagerPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            if (!Environment.isExternalStorageManager()) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
                startActivity(intent);
            }
        } else {
            if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
            }
        }
    }

    Thread thread;
    boolean isIminPrint = true;//切换USB打印机 true imin  false 默认列表第一位

    private void initView() {
        Log.i("myLog", "initView");
        final String deviceModel = SystemPropManager.getModel();

        Log.i("myLog", "deviceModel:" + Build.MODEL);

        connectTypeList = new ArrayList<>();
        if (TextUtils.equals("M2-202", deviceModel)
                || TextUtils.equals("M2-203", deviceModel)
                || TextUtils.equals("M2-Pro", deviceModel)) {
            connectTypeList.add("SPI");
            connectTypeList.add("Bluetooth");
        } else if (TextUtils.equals("S1-701", deviceModel) || TextUtils.equals("S1-702", deviceModel)) {
            connectTypeList.add("USB");
            connectTypeList.add("Bluetooth");
        } else if (TextUtils.equals("D1p-601", deviceModel) || TextUtils.equals("D1p-602", deviceModel)
                || TextUtils.equals("D1p-603", deviceModel) || TextUtils.equals("D1p-604", deviceModel)
                || TextUtils.equals("D1w-701", deviceModel) || TextUtils.equals("D1w-702", deviceModel)
                || TextUtils.equals("D1w-703", deviceModel) || TextUtils.equals("D1w-704", deviceModel)
                || TextUtils.equals("D4-501", deviceModel) || TextUtils.equals("D4-502", deviceModel)
                || TextUtils.equals("D4-503", deviceModel) || TextUtils.equals("D4-504", deviceModel)
                || deviceModel.startsWith("D4-505") || TextUtils.equals("M2-Max", deviceModel)
                || TextUtils.equals("D1", deviceModel) || TextUtils.equals("D1-Pro", deviceModel)
                || TextUtils.equals("Swift 1", deviceModel) || TextUtils.equals("I22T01", deviceModel)
                || TextUtils.equals("TF1-11", deviceModel) || TextUtils.equals("D3-510", deviceModel)
                || Build.MODEL.equals("V3") || Build.MODEL.equals("W27_Pro") || Build.MODEL.equals("I23D01")) {
            connectTypeList.add("USB");
            connectTypeList.add("Bluetooth");

        }


        String datas = "CgobMwAbKiEAAf////////////////////gAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAD/gAD/gAD/gAD/gAAfgAAfgAA/gAB/gAD/gAD/gAH/gAH/gAH/gAH/gBP/gH//gH//gH//gDv/gAH/gAH/gAH/gAH/gAD/gAD/gAB/gAB/gAA/gAAfgAA/gAD/gAD/gAD/gAB/gAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAP///////////////////wobKiEAAf///////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAH4AAH4AADwAAf8AD//4f//5/////////H4/8H4PwDwP4H4P8H4P+Dwc/Dw4f37wP//wD//wB//oj4H//wD//wD//wD//4HwB8PgD//wH//4P//4fn58/Dw/+Dwf4H4P4DwP4DwP8H4P/n55///4///wP//wB//gADwAADwAAH4AAH4AABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///x///x///x///x///x/gAB/wAB//gB///AH//wAf/wAA/wAAPwAA/wAf/wP//x///B//gB/wAB/4AB///x///x///x///x///wAAAAAAAAAAABAAABwAAB4AAB+AAB/gAB/4AB/8AB//AAP/gAH//wB//wAf/wAf/wA//wD//wP/wA//AB/8AB/4AB/gAB+AAB4AABwAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///x///x///x///x///x///x///wAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAAAAAAADwAA//AD//wP//wf//wf//w///w/wDx/AAx+AAR8AAB8AAB8AAB8AAB+AAR+AAR/gBw///w///wf//wP//wH//wD//wAP8AAAAAAAAAAAAAAAAAA//AD//wH//wf//wf//w///w/4Hx/AAx+AAR+AAR8AAB8AAB8B8B8B8B+B8B/h8R/x8Q/x/w/h/wfh/wPB/wDB/wAB/wAAAAAAAAAAAAAAAAA//AD//wP//wf//wf//w///w/4Hx/gAx+AAR8AAB8AAB8AAB8AAB8AAB+AAR/gBw/8Pw///wf//wf//wH//wD//wA//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////////wobKiEAAf///////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOHwAPnwAP/wAP/wAP+AAD+AAH/AAP/gAP/wAPPwAOH4AMD4AAD4AAD4ABH8gP//4P//4P//4L/9wAD4AAD4AID4AMH4AOHwAPPwAP/gAH/gAH/AAH+AAP/AAP/wAPnwAPHwAIDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAAAAAAAAAAAAAAAAAMAAAPgAAPgAAPgAAPgAAPgAAMAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAAgAAAAAAAAAAAAAAAAAAAAAAMAAAOAAAOAAAPAAAPAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPAAAPAAAOAAAMAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAOAAAOAAAPAAAPAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPAAAPAAAPAAAOAAAOAAAMAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAOAAAOAAAPAAAPAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPAAAPAAAOAAAOAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////////wobKiEAAf8AAP8AAP8AAP8AAP8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8A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/8D//8D//8D//8AD8D8D8D8D8D8D8D8D8D8D8D////////////////////////////////////////////////8D8D8D8D8D8D8D8D8D8D8D8D8D8AAD8AAD8AAD8AAD8AAD8AAH8AD///////////////////////8D//8D//8D//8D//8D//8D//8AAD8AAD8AAD8AAD8AAD8AAD8AD8AAD8AAD8AAD8AAD8AAD8D8D//4D//4D//4D//4D//8D/8D8D8D8D8D8D8D8D8D8D8D8D8AAAAAAAAAAAAAAAAAAAAAAAD///////////////////////8AAAAAAAAAAAAAAAAAAAAAAAD//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D8D8D8D8D8D8D8D8D8D8AAD8AD/8AD/8AD/8AD/8AD/8AD/8D//8D//8D//8D//8D//8D//8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8AAAD8AAD8AAD8AAD8AAD8AAD/8D//8D//8D//8D//8D//8D/8D8AAD8AAD8AAD8AAD8AAD8AD//8D//8D//8D//8D//8D//8AAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////8AD8AAD8AAD8AAD8AAD8AAD8AAD8D8D//8D//8D//8D//8D/8AAD8D8D8D8D8D8D8D8D8D8D8D8D/8D8D8D8D8D8D8D8D8D8D8D8AD8AAD8AAD8AAD8AAD8AAD8AD///////////////////////8AAD8AAD8AAD8AAD8AAD8AAD///8D//8D//8D//8D//8D//8AAD/8AD/8AD/8AD/8AD/8AD//8AD/8AD/8AD/8AD/8AD/8AD/8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D//8D//8D//8D//8D//8D//8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D//8D//8D//8D//8D/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AB/8AD/8AD/8AD/8AD/8AD/8AB/8AAD8AAD8AAD8AAD8AAD8AAD//8D//8D//8D//8D//8D//8D/8AD/8AD/8AD/8AD/8AD/8AAD8AAD8AAD8AAD8AAD8AAD8AD8D8D8D8D8D8D8D8D8D8D8D8AD8AAD8AAD8AAD8AAD8AAD8AD///////////////////////8AD8AAD8AAD8AAD8AAD8AAB8AD/8AD/8AD/8AD/8AD/8AD/8D8D//8D//8D//8D//8D//8D/8AD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D8D8D8D8D8D8D8D8D8D8D8D8D//8D//8D//8D//8D//8D//8AD/8AD/8AD/8AD/8AD/8AD/8D/8D//8D//8D//8D//8D//8D/8D8D8D8D8D8D8D8D8D8D8D8AAD8AAD8AAD8AAD8AAD8AAD8AD8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D//8D//8D//8D//8D//8D//8AD/8AD/8AD/8AD/8AD/8AD/8D8AAD8AAD8AAD8AAD8AAD8AD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD/8B//8D//8D//8D//8D//8D//8D/8AD/8AD/8AD/8AD/8AD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8B/98B/98B/98B/98B/8AB/8AB/8AB/8AB/8AB/8AB/8AB/98AB98AB98AB98AB98AB98AB8B+B8B+B8B+B8B+B8B+B8B+B98B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+D8B+D8B+D8B+D8B+D8B+D8B+B/+AB/+AB/+AB/+AB/+AB/+AAAB8AAB+AAB+AAB+AAB+AAB+AAAB8AAB8AAB8AAB8AAB+AAB8AB8AAB+AAB+AAB+AAB+AAB+AB+AAB+AAB+AAB+AAB+AAB+AAD+AB/+AB/+AB/+AB/+AB/+AAAAAAAB/8AB/8AB/8AB/8AB/8AB/8D/8AB/+AB/+AB/+AB/+AB/8D8AAD8AAD8AAD8AAD8AAD8AAAAB/8AB/8AB/8AB/8AB/8AB/8AAAAAAAAAAAAAAAAAAAAAAACD/+AB/+AB/+AB/+AB/+AB/+AAB/8AB/8AB/8AB/8AB/8AB///////////////////////////+B//+B//+B//+B//+B//+B8AAAAAAAAAAAAAAAAAAAAAAAAAB/8AB/8AB/8AB/8AB/8AB/8AAB98AB98AB98AB98AB98AB//8B//+B//+B//+B//+B//+B//+B////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+B+B+B+B+B+B+B+B+B+AB+AAB+AAB+AAB+AAB+AAB+AAB+AD+B+D+B+D+B+D+B+D+B+D+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AACB/+CB/+CB/+CB/+CB/+CB/+B+B+B+B+B+B+B+B+B+B+B+B+AB+AAB+AAB+AAB+AAB+AAB+AAAAB8AAB8AAB8AAB8AAB8AAB9+AAB+AAB+AAB+AAB+AAB+AAAB+AAB+AAB+AAB+AAB+AAB+ACAAACAAACAAACAAACAAACAAAB8B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+AAB/+AB/+AB/+AB/+AB/+AAAAACAB+CAB+CAB+CAB+CAB+CAB+B+AAB+AAB+AAB+AAB+AAB+AAB/+AB/+AB/+AB/+AB/+AB/+AD+AB/+AB/+AB/+AB/+AB/+AB8B/+AB/+AB/+AB/+AB/+AB/+AB//8B//8B//8B//8B//8B///+B+D+B+D+B+D+B+D+B+D+B+CB/+CB/+CB/+CB/+CB/+CB/+D+B+D+B+D+B+D+B+D+B+D+B+B+B/9+B/9+B/9+B/9+B/9+B//+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD///////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///9///9///9///9///9+AAB+AAB+AAB+AAB+AAB+AAB+AAB+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+AAB+AAB+AAB+AAB+AAB+AAB///9///9///9///9///9///8AAAAAAAAAAAAAAAAAAAAAAACB/+CB/+CB/+CB/+CB/+CB/+B//+B//+B//+B//+B//+B//+AAAB8AAB8AAB8AAB8AAB8AAB9/+B9/+B9/+B9/+B9/+B9/+B+AAB+AAB+AAB+AAB+AAB+AAB+B//+B//+B//+B//+B//+B//8B//8B//8B//8B//8B//8B//8AB+B+B+B+B+B+B+B+B+B+B+B+B+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+D+B+D+B+D+B+D+B+D+B+D+B+B+AAB+AAB+AAB+AAB+AAB+AAD///////////////////////8AB/8AB/8AB/8AB/8AB/8AB/9+B+B+B+B+B+B+B+B+B+B+B+AAB+AAB+AAB+AAB+AAB+AAB+D///////////////////////8AB+AAB+AAB+AAB+AAB+AAB+AAAAB+AAB+AAB+AAB+AAB+AAD//+D//+D//+D//+D//+D//+D//+D/+AD/+AD/+AD/+AD/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//+D//+D//+D//+D//+AAA+AAA+AAA+AAA+AAA+AAA+AAA+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+AAA+AAA+AAA+AAA+AAA+AAA+D//+D//+D//+D//+D//+D//+AAAAAAAAAAAAAAAAAAAAAAAAB+AAA+AAA+AAA+AAA+AAB+AAAAA+AAA+AAA+AAA+AAA+AAA+CB/+CB/+CB/+CB/+CB/+CB/+D+AAD+AAD+AAD+AAD+AAD+AAD//+D//+D//+D//+D//+D//+CB/ACB/ACB/ACB/ACB/ACB/ADAAAD+A+D+A+D+A+D+A+D+A+B/AAA//AA//AA//AA//AA//AA/+AA+A+A+A+A+A+A+A+B+A+A+A+AB/+AB/+AB/+AB/+AB/+AB/+AB+AAB/AAB/AAB/AAB/AAB/AB//+A//+A//+A//+A//+B//+CB/+CB/+CB/+CB/+CB/+CB/+CAA+CAA+CAA+CAA+CAA+CAA+AB/AAB/AAB/AAB/AAB/AAB/AB//AA//AA//AA//AA//AA//AD+A+D+A+D+A+D+A+D+A+D+A+AAA+AAA+AAA+AAA+AAA+AAA+AAAAB+AAA+AAA+AAA+AAB+AAAB/+AB/+AB/+AB/+AB/+AB/+AA/+B+A+A+A+A+A+A+A+B+A+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGzIKCgodIQAbYQHV4srHtv7OrMLrw+jK9tXiyse2/s6swuvD6Mr21eLKx7b+zqzC68PoyvbV4srHtv7OrMLrw+jK9iAKCgoKCgoKHVYA";
        content = Base64.decode(datas, Base64.DEFAULT);
    }

    private void callPrinter() {
        Log.i("myLog", "call printer");
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i("myLog", "call printer run :");


            /*    //    mIminPrintUtils.printQrCode("qrtext", 0);
                Log.i("myLog", "call printer run after print qr1111111:");
                mIminPrintUtils.printQrCode("Sample print", 1);
                Log.i("myLog", "call printer run after print qr2222222:");
                //  mIminPrintUtils.printQrCode("qrtext", 2);
                mIminPrintUtils.printAndFeedPaper(100);*/

                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
                mIminPrintUtils.setTextTypeface(typeface);
             /*   List<Bitmap> mBitmapList1 = new ArrayList<>();
                Bitmap bitmap2 = BitmapFactory.decodeResource(getResources(), R.drawable.plenome_hospitals);
                mBitmapList1.add(bitmap2);
                mIminPrintUtils.printMultiBitmap(mBitmapList1, 1);*/
                mIminPrintUtils.setTextSize(30);
                mIminPrintUtils.printText(hospName + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText(hospAddress);
                //    mIminPrintUtils.setQrCodeSize(100);
                bitmapQR = getBlackWhiteBitmap(bitmapQR);
                mIminPrintUtils.printSingleBitmap(bitmapQR, 1);
                Log.i("myLog", "jsonString length:" + qrJsonStr.length());
                //  qrJsonStr="{\"ABHA_number\":\"527268279\",\"age\":23,\"appointmentDate\":\"30th Apr 2024\",\"appointmentTime\":\"03:47 AM\",\"appointment_id\":\"APPN1994\",\"appointment_status\":\"approved\",\"consultFees\":10.0,\"consultingType\":\"online\",\"doctor_id\":\"173\",\"doctorName\":\"PoomathiG\"}";
                //Log.i("myLog", "json length:" + qrJsonStr.length());
                //mIminPrintUtils.printQrCode(qrJsonStr, 1);

                mIminPrintUtils.printAndFeedPaper(5);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                mIminPrintUtils.printText("\t" + apptId + "\n");
                mIminPrintUtils.printText("\t" + doctorName + "\n");
                mIminPrintUtils.setTextSize(35);
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText("\t Token Number : " + tokenNo + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText("\t ------------------------------------------------");
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_NORMAL;
                mIminPrintUtils.printText("\t Patient Name   : " + patientName + "\n");
                mIminPrintUtils.printText("\t Slot Date           : " + slotDate + "\n");
                mIminPrintUtils.printText("\t Slot Time           : " + slotTime + "\n");

                mIminPrintUtils.printAndFeedPaper(100);
                mIminPrintUtils.printAndLineFeed();
                mIminPrintUtils.fullCut();
                Log.i("myLog", "call printer run after print qr33333333:");
                Log.i("myLog", "call printer run end:");
            }
        });
        thread.start();
    }


    private void initReceiver() {
       /* if (mBluetoothStateReceiver == null) {
            mBluetoothStateReceiver = new BluetoothStateReceiver();
            IntentFilter filter = new IntentFilter();
            filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
            getActivity().registerReceiver(mBluetoothStateReceiver, filter);*/
    }
}


  /*  class BluetoothStateReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1);
            switch (state) {
                case BluetoothAdapter.STATE_TURNING_ON:
                    toast("Bluetooth ON");
                    break;

                case BluetoothAdapter.STATE_TURNING_OFF:
                    toast("Bluetooth OFF");
                    break;
            }
        }
    }

    protected void toast(String message) {
        Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
    }


    class DeviceListAdapter extends ArrayAdapter<BluetoothDevice> {

        public DeviceListAdapter(Context context) {
            super(context, 0);
        }

        @TargetApi(Build.VERSION_CODES.ECLAIR)
        @Override
        public View getView(int position, View convertView, ViewGroup parent) {

            BluetoothDevice device = getItem(position);
            if (convertView == null) {
                convertView = LayoutInflater.from(getContext()).inflate(R.layout.item_bluetooth_device, parent, false);
            }

            TextView tvDeviceName = (TextView) convertView.findViewById(R.id.tv_device_name);
            CheckBox cbDevice = (CheckBox) convertView.findViewById(R.id.cb_device);

            tvDeviceName.setText(device.getName());

            cbDevice.setChecked(position == bluetoothPosition);

            return convertView;
        }

    }


    private void fillAdapter() {
        List<BluetoothDevice> printerDevices = BluetoothUtil.getPairedDevices();
        mAdapter.clear();
        mAdapter.addAll(printerDevices);
        //    refreshButtonText(printerDevices);
    }*/



