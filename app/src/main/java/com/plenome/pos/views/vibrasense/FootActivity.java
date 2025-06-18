package com.plenome.pos.views.vibrasense;


import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;

import com.ayati.connectvibrasense.main.VibrasenseConnect;
import com.ayati.connectvibrasense.model.LegModel;
import com.ayati.connectvibrasense.model.PositionModel;
import com.ayati.connectvibrasense.test.Test;
import com.ayati.connectvibrasense.vibrasense_dialog.VibrasenseTest;
import com.clj.fastble.data.BleDevice;
import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.VibrasenseRequest;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.OPHubApplication;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FootActivity extends AppCompatActivity {

    private static final String TAG = FootActivity.class.getSimpleName();
    private ImageView leftfoot, rightfoot, imgLeg, imgLegReport, imgColorMap, imgBack;
    private TextView txtTitle, leftbut, righttbut, rightretake, leftretake,txt_rightraw,txt_rightai, generate, pl1, txt_avl, txt_avr, ptr1, ptr2, ptr3, ptr4, ptr5, ptr6, pl2, pl3, pl4, pl5, pl6, txt_raw, txt_ai, average_vpt;
    private ConstraintLayout txt_loading, ll_loadings, lr_loadings, ll_raw;
    private String currentLeg = VibrasenseTest.TEST_LEG_TYPE.LEFT_LEG;
    private LinearLayout ll_rawvalue, ll_aivalue;
    private String reportId = null;
    private String patientId = "P001", legOption,left1;

    private Boolean rightResult = false;
    private Boolean leftResult = false;
    RestServices services;
    int hospitalId;
    String opdId;
    String patientid;
    ArrayList<String> readingList = new ArrayList<>();


    public static Intent getIntent(Context context, BleDevice bleDevice,String optId,String patientId) {
        Intent intent = new Intent(context, FootActivity.class);
        intent.putExtra("KEY_DATA", bleDevice);
        intent.putExtra("opdId", optId);
        intent.putExtra("patient_id", patientId);
        return intent;
    }

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_foot);
    /*    OPHubApplication.appBarTitle.setText("Vibrasense");
        OPHubApplication.appBarImage.setVisibility(View.GONE);*/
        services = RetrofitInstance.createService(RestServices.class);
        hospitalId = OPHubApplication.getHospitalId();
        opdId = getIntent().getStringExtra("opdId");
        patientid = getIntent().getStringExtra("patient_id");
        System.out.println("print value patient id  "+ patientid);
        legOption = "Left";
        leftfoot = findViewById(R.id.leftfoot);
        rightfoot = findViewById(R.id.rightfoot);
        txt_loading = findViewById(R.id.txt_loading);
        ll_loadings = findViewById(R.id.ll_loadings);
        lr_loadings = findViewById(R.id.lr_loadings);
        imgBack = findViewById(R.id.imgBack);
        txtTitle = findViewById(R.id.txtTitle);
        ll_raw = findViewById(R.id.ll_raw);
        txt_raw = findViewById(R.id.txt_raw);
        txt_ai = findViewById(R.id.txt_ai);
        average_vpt = findViewById(R.id.average_vpt);
        ll_aivalue = findViewById(R.id.ll_aivalue);
        imgLeg = findViewById(R.id.imgLeg);
        imgLegReport = findViewById(R.id.imgLegReport);
        imgColorMap = findViewById(R.id.imgColorMap);
        pl1 = findViewById(R.id.txt_pl1);
        pl2 = findViewById(R.id.txt_pl2);
        pl3 = findViewById(R.id.txt_pl3);
        pl4 = findViewById(R.id.txt_pl4);
        pl5 = findViewById(R.id.txt_pl5);
        pl6 = findViewById(R.id.txt_pl6);
        ptr1 = findViewById(R.id.txt_pr1);
        ptr2 = findViewById(R.id.txt_pr2);
        ptr3 = findViewById(R.id.txt_pr3);
        ptr4 = findViewById(R.id.txt_pr4);
        ptr5 = findViewById(R.id.txt_pr5);
        ptr6 = findViewById(R.id.txt_pr6);
        txt_avr = findViewById(R.id.txt_avr);
        txt_avl = findViewById(R.id.txt_avl);
        leftbut = findViewById(R.id.leftbut);
        righttbut = findViewById(R.id.righttbut);
        rightretake = findViewById(R.id.rightretake);
        leftretake = findViewById(R.id.leftretake);
        generate = findViewById(R.id.generate);
        ll_rawvalue = findViewById(R.id.ll_rawvalue);
        txtTitle = findViewById(R.id.txtTitle);
        txtTitle.setText("Vibrasense");

  /*      leftbut.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_blue));
        leftbut.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
*/
        imgBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        leftbut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                legOption = "Left";
                leftbut.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_blue));
                leftbut.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                righttbut.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_blue_outline));
                righttbut.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                leftfoot.setVisibility(View.VISIBLE);
                ll_loadings.setVisibility(View.VISIBLE);
                rightfoot.setVisibility(View.GONE);
                lr_loadings.setVisibility(View.GONE);
                ll_aivalue.setVisibility(View.GONE);
                ll_raw.setVisibility(View.VISIBLE);
                rightretake.setVisibility(View.GONE);
                leftretake.setVisibility(View.VISIBLE);
                if (leftResult) {
                    ll_loadings.setVisibility(View.VISIBLE);
                    txt_loading.setVisibility(View.GONE);
                } else {
                    txt_loading.setVisibility(View.VISIBLE);
                    ll_loadings.setVisibility(View.GONE);
                }
                currentLeg = VibrasenseTest.TEST_LEG_TYPE.LEFT_LEG;
                txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                VibrasenseConnect.getINSTANCE().startVibrasenseTest(VibrasenseTest.TEST_LEG_TYPE.LEFT_LEG);
            }
        });

        righttbut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                legOption = "Right";
                leftfoot.setVisibility(View.GONE);
                rightfoot.setVisibility(View.VISIBLE);
                ll_aivalue.setVisibility(View.GONE);
                ll_raw.setVisibility(View.VISIBLE);
                rightretake.setVisibility(View.VISIBLE);
                leftretake.setVisibility(View.GONE);
                if (rightResult) {
                    lr_loadings.setVisibility(View.VISIBLE);
                    txt_loading.setVisibility(View.GONE);
                } else {
                    txt_loading.setVisibility(View.VISIBLE);
                    lr_loadings.setVisibility(View.GONE);
                }
                ll_loadings.setVisibility(View.GONE);
                righttbut.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_blue));
                righttbut.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                leftbut.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_blue_outline));
                leftbut.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                currentLeg = VibrasenseTest.TEST_LEG_TYPE.RIGHT_LEG;
                txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                VibrasenseConnect.getINSTANCE().startVibrasenseTest(VibrasenseTest.TEST_LEG_TYPE.RIGHT_LEG);
            }
        });

        generate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                moveToNextScreen();

            }
        });


        VibrasenseConnect.getINSTANCE().createTest(patientId, new VibrasenseConnect.VibrasenseTestDialogListener() {
            @Override
            public void onTestReport(String rId) {
                reportId = rId;
                 /*   if (rId != null && !rId.isEmpty()) {
                        reportId = rId;

                    }*/
            }

            @Override
            public void onTestFinished(String legType) {
                if ((legOption.equalsIgnoreCase("Left"))) {
                    leftResult = true;
                    PositionModel left = VibrasenseConnect.getINSTANCE().getLegTestData(VibrasenseTest.TEST_LEG_TYPE.LEFT_LEG);
                    if (left != null) {
                        leftfoot.setVisibility(View.VISIBLE);
                        ll_loadings.setVisibility(View.VISIBLE);
                        leftretake.setVisibility(View.VISIBLE);
                        generate.setVisibility(View.VISIBLE);
                        ll_rawvalue.setVisibility(View.VISIBLE);
                        ll_raw.setVisibility(View.VISIBLE);
                        txt_loading.setVisibility(View.GONE);
                        rightfoot.setVisibility(View.GONE);
                        lr_loadings.setVisibility(View.GONE);
                        txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                        txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                        txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                        txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));

                        txt_raw.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                ll_aivalue.setVisibility(View.GONE);
                                ll_raw.setVisibility(View.VISIBLE);
                                txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                                txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                                txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                                txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                            }
                        });

                        leftretake.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                System.out.println("print retake left");
                                leftResult = false;
                                currentLeg = VibrasenseTest.TEST_LEG_TYPE.LEFT_LEG;
                                VibrasenseConnect.getINSTANCE().startVibrasenseTest(VibrasenseTest.TEST_LEG_TYPE.LEFT_LEG);
                                ll_aivalue.setVisibility(View.GONE);
                                ll_raw.setVisibility(View.VISIBLE);
                                if (leftResult) {
                                    ll_loadings.setVisibility(View.VISIBLE);
                                    txt_loading.setVisibility(View.GONE);
                                } else {
                                    txt_loading.setVisibility(View.VISIBLE);
                                    ll_loadings.setVisibility(View.GONE);
                                }
                                txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                                txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                                txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                                txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                                pl1.setText("0");
                                pl2.setText("0");
                                pl3.setText("0");
                                pl4.setText("0");
                                pl5.setText("0");
                                pl6.setText("0");
                                txt_avl.setText("0");
                            }
                        });


                        txt_ai.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                ll_aivalue.setVisibility(View.VISIBLE);
                                ll_raw.setVisibility(View.GONE);
                                txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                                txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                                txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                                txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                                getReport();

                            }
                        });
                        VibrasenseConnect.getINSTANCE().uploadVibrasenseTest();
                        txt_loading.setVisibility(View.GONE);
                    } else if (left == null) {
                        txt_loading.setVisibility(View.VISIBLE);
                        ll_loadings.setVisibility(View.GONE);
                    }

                } else if (legOption.equalsIgnoreCase("Right")) {
                    rightResult = true;
                    txt_loading.setVisibility(View.VISIBLE);
                    lr_loadings.setVisibility(View.GONE);
                    if (legType.equalsIgnoreCase(VibrasenseTest.TEST_LEG_TYPE.RIGHT_LEG)) {
                        // Handle Right Leg

                        PositionModel right = VibrasenseConnect.getINSTANCE().getLegTestData(VibrasenseTest.TEST_LEG_TYPE.RIGHT_LEG);

                        if (right != null) {

                            rightfoot.setVisibility(View.VISIBLE);
                            lr_loadings.setVisibility(View.VISIBLE);
                            rightretake.setVisibility(View.VISIBLE);
                            generate.setVisibility(View.VISIBLE);
                            ll_rawvalue.setVisibility(View.VISIBLE);
                            txt_loading.setVisibility(View.GONE);
                            ll_raw.setVisibility(View.VISIBLE);
                            txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                            txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                            txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                            txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));

                            txt_raw.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    ll_aivalue.setVisibility(View.GONE);
                                    ll_raw.setVisibility(View.VISIBLE);
                                    txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                                    txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                                    txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                                    txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                                }
                            });

                            rightretake.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    System.out.println("print retake right");
                                    rightResult = false;
                                    currentLeg = VibrasenseTest.TEST_LEG_TYPE.RIGHT_LEG;
                                    VibrasenseConnect.getINSTANCE().startVibrasenseTest(VibrasenseTest.TEST_LEG_TYPE.RIGHT_LEG);
                                    ll_aivalue.setVisibility(View.GONE);
                                    ll_raw.setVisibility(View.VISIBLE);
                                    if (rightResult) {
                                        lr_loadings.setVisibility(View.VISIBLE);
                                        txt_loading.setVisibility(View.GONE);
                                    } else {
                                        txt_loading.setVisibility(View.VISIBLE);
                                        lr_loadings.setVisibility(View.GONE);
                                    }
                                    txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                                    txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                                    txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                                    txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                                    ptr1.setText("0");
                                    ptr2.setText("0");
                                    ptr3.setText("0");
                                    ptr4.setText("0");
                                    ptr5.setText("0");
                                    ptr6.setText("0");
                                    txt_avr.setText("0");
                                }
                            });

                            txt_ai.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    ll_aivalue.setVisibility(View.VISIBLE);
                                    ll_raw.setVisibility(View.GONE);
                                    txt_ai.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.raw_value));
                                    txt_ai.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.white));
                                    txt_raw.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.ai_value));
                                    txt_raw.setTextColor(ContextCompat.getColor(getApplicationContext(), R.color.blue_text));
                                    getReport();

                                }
                            });

                            // Hide left section
                            leftfoot.setVisibility(View.GONE);
                            ll_loadings.setVisibility(View.GONE);
                            VibrasenseConnect.getINSTANCE().uploadVibrasenseTest();
                            txt_loading.setVisibility(View.GONE);

                        }
                    }
                }


            }


            @Override
            public void onDeviceDisconnected(String s) {
                moveToNextScreens();
                Toast.makeText(FootActivity.this, "Vibrasense Device Disconnect.", Toast.LENGTH_LONG).show();
            }

            @Override
            public void onOfflineTest(String patientId, PositionModel left, PositionModel right) {

                Log.e(TAG, "patientId = " + patientId);


                String leftStr = "[]";
                String rightStr = "[]";

                ArrayList<String> leftList = null;
                ArrayList<String> rightList = null;


                if (legOption.equalsIgnoreCase("Left")) {
                    if (left != null && left.getRawData() != null && left.getRawData().length == 30) {
                        txt_loading.setVisibility(View.GONE);
                        lr_loadings.setVisibility(View.GONE);
                        leftStr = String.join(",", left.getRawData());
                        Log.e(TAG, " leftStr  = " + leftStr);
                        leftList = new VibrasenseUtils().getReport(leftStr);
                        Log.e(TAG, " left  = " + leftList);

                        String plvalue = leftList.get(0);
                        int intValue1 = (int) Float.parseFloat(plvalue);
                        pl1.setText(String.valueOf(intValue1));

                        String pl2value = leftList.get(1);
                        int intValue2 = (int) Float.parseFloat(pl2value);
                        pl2.setText(String.valueOf(intValue2));

                        String pl3value = leftList.get(2);
                        int intValue3 = (int) Float.parseFloat(pl3value);
                        pl3.setText(String.valueOf(intValue3));

                        String pl4value = leftList.get(3);
                        int intValue4 = (int) Float.parseFloat(pl4value);
                        pl4.setText(String.valueOf(intValue4));

                        String pl5value = leftList.get(4);
                        int intValue5 = (int) Float.parseFloat(pl5value);
                        pl5.setText(String.valueOf(intValue5));


                        String value = leftList.get(5);
                        int intValue = (int) Float.parseFloat(value);
                        pl6.setText(String.valueOf(intValue));

                        String vptValue = leftList.get(6);
                        Log.e(TAG, "VPT Value = " + vptValue);
                        float vptFloat = Float.parseFloat(vptValue);
                        Log.e(TAG, "VPT Float Value = " + vptFloat);
                        txt_avl.setText(String.valueOf(vptFloat));


                    }

                } else if (legOption.equalsIgnoreCase("Right")) {
                    txt_loading.setVisibility(View.VISIBLE);
                    ll_loadings.setVisibility(View.GONE);
                    if (right != null && right.getRawData() != null && right.getRawData().length == 30) {

                        rightStr = String.join(",", right.getRawData());
                        Log.e(TAG, " rightStr = " + rightStr);
                        rightList = new VibrasenseUtils().getReport(rightStr);
                        Log.e(TAG, " right = " + rightList);


                        String prvalue = rightList.get(0);
                        int intValuer1 = (int) Float.parseFloat(prvalue);
                        ptr1.setText(String.valueOf(intValuer1));

                        String pr2value = rightList.get(1);
                        int intValuer2 = (int) Float.parseFloat(pr2value);
                        ptr2.setText(String.valueOf(intValuer2));

                        String pr3value = rightList.get(2);
                        int intValuer3 = (int) Float.parseFloat(pr3value);
                        ptr3.setText(String.valueOf(intValuer3));

                        String pr4value = rightList.get(3);
                        int intValuer4 = (int) Float.parseFloat(pr4value);
                        ptr4.setText(String.valueOf(intValuer4));

                        String pr5value = rightList.get(4);
                        int intValuer5 = (int) Float.parseFloat(pr5value);
                        ptr5.setText(String.valueOf(intValuer5));


                        String pr6value = rightList.get(5);
                        int intValuer6 = (int) Float.parseFloat(pr6value);
                        ptr6.setText(String.valueOf(intValuer6));

                        String vptValue = rightList.get(6);
                        Log.e(TAG, "VPT Value = " + vptValue);
                        float vptFloat = Float.parseFloat(vptValue);
                        Log.e(TAG, "VPT Float Value = " + vptFloat);
                        txt_avr.setText(String.valueOf(vptFloat));


                    }

                }


            }

            @Override
            public void onErrorMessage(String s) {
                Toast.makeText(FootActivity.this, "Error = " + s, Toast.LENGTH_LONG).show();
            }
        });
    }

    private void vibrasencestest(String txtLeftp1, String txtLeftp2, String txtLeftp3, String txtLeftp4, String txtLeftp5, String txtLeftp6, String txtLeftavt, String txtRightavt, String txtRightp1, String txtRightp2, String txtRightp3, String txtRightp4, String txtRightp5, String txtRightp6, String patientId, int hospitalId) {

        Log.i("mylog", "vibrasences reading");

    }

    private void moveToNextScreens() {
        startActivity(DeviceScanAndConnectActivity.getIntent(this));
    }

    private void getReport() {
        VibrasenseConnect.getINSTANCE().getTestReport(patientId, reportId, new Test.GetReportEvent() {
            @Override
            public void onGetReport(Bitmap left, Bitmap right, Bitmap colorMap, LegModel leftLeg, LegModel rightLeg) {
                //    Log.e(TAG, "Left leg avg = " + leftLeg.getVpt());


                imgLegReport.setVisibility(View.VISIBLE);
                imgColorMap.setVisibility(View.VISIBLE);
                imgColorMap.setImageBitmap(colorMap);
                if (legOption.equalsIgnoreCase("Left")) {
                    leftResult = true;
                    imgLegReport.setImageBitmap(left);

                    average_vpt.setText("Average VPT : " + String.format("%.2f", leftLeg.getVpt()));
                } else if (legOption.equalsIgnoreCase("Right")) {
                    rightResult = true;
                    imgLegReport.setImageBitmap(right);


                    average_vpt.setText("Average VPT : " + String.format("%.2f", rightLeg.getVpt()));
                }
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(FootActivity.this, message, Toast.LENGTH_LONG).show();
            }
        });
    }


    private void moveToNextScreen() {
        //startActivity(TestDetailsActivity.getIntent(this, patientId, reportId));
        String lefl1=pl1.getText().toString();
        String lefl2=pl2.getText().toString();
        String lefl3=pl3.getText().toString();
        String lefl4=pl4.getText().toString();
        String lefl5=pl5.getText().toString();
        String lefl6=pl6.getText().toString();
        String right1=pl1.getText().toString();
        String right2=pl2.getText().toString();
        String right3=pl3.getText().toString();
        String right4=pl4.getText().toString();
        String right5=pl5.getText().toString();
        String right6=pl6.getText().toString();
        String leftvpt=txt_avl.getText().toString();
        String rightvpt=txt_avr.getText().toString();

        VibrasenseRequest request = new VibrasenseRequest();
        List<VibrasenseRequest.DeviceReading> vibrasenseList = new ArrayList<>();
        VibrasenseRequest.DeviceReading vibrasenseBase = new VibrasenseRequest.DeviceReading();

        request.setHospitalId(hospitalId);
        if (opdId != null && !opdId.isEmpty())
            request.setOpdId(Integer.valueOf(opdId));
        if (patientid != null && !patientid.isEmpty())
            request.setPatientId(Integer.valueOf(patientid));
        request.setDeviceName("vibrasense");
//        vibrasenseList.add(vibrasenseBase);
        request.setDeviceReading(vibrasenseList);


        VibrasenseRequest.DeviceReading leftLeg = new VibrasenseRequest.DeviceReading();

        leftLeg.setLeftp1(Integer.valueOf(lefl1));
        leftLeg.setLeftp2(Integer.valueOf(lefl2));
        leftLeg.setLeftp3(Integer.valueOf(lefl3));
        leftLeg.setLeftp4(Integer.valueOf(lefl4));
        leftLeg.setLeftp5(Integer.valueOf(lefl5));
        leftLeg.setLeftp6(Integer.valueOf(lefl6));
        leftLeg.setImageleft("");
        leftLeg.setLegtype("left");
        leftLeg.setLeftvpt(Double.valueOf(leftvpt));



        VibrasenseRequest.DeviceReading rightLeg = new VibrasenseRequest.DeviceReading();
        rightLeg.setRight1(Integer.valueOf(right1));
        rightLeg.setRight2(Integer.valueOf(right2));
        rightLeg.setRight3(Integer.valueOf(right3));
        rightLeg.setRight4(Integer.valueOf(right4));
        rightLeg.setRight5(Integer.valueOf(right5));
        rightLeg.setRight6(Integer.valueOf(right6));
        rightLeg.setRightvpt(Double.valueOf(rightvpt));
        rightLeg.setLegtype("right");
        rightLeg.setImageright("");
        vibrasenseList.add(leftLeg);
        vibrasenseList.add(rightLeg);


        Log.i("myLog", "vitalRequest:" + new Gson().toJson(request));
        Call<VibrasenseRequest.VibrasenseResponse> call = services.vibrasenseRequest(request);
        call.enqueue(new Callback<VibrasenseRequest.VibrasenseResponse>() {

            @Override
            public void onResponse(Call<VibrasenseRequest.VibrasenseResponse> call, Response<VibrasenseRequest.VibrasenseResponse> response) {
                try {
                    if (response.body() != null) {
    //                    VibrasenseRequest.VibrasenseResponse resp = response.body();
    //                    VitalMeasurementFragment vitalMeasurementFragment = new VitalMeasurementFragment();
    //                    Bundle result_data = new Bundle();
    //                    int opd_id_vital = 0;
    //                    if (opdId != null) {
    //                        opd_id_vital = Integer.parseInt(opdId);
    //                    }
    //                    result_data.putInt("opdId", opd_id_vital);
    //                    vitalMeasurementFragment.setArguments(result_data);
    //                    FragmentTransaction vitalsTransaction = getSupportFragmentManager().beginTransaction();
    //                    vitalsTransaction.replace(R.id.newPrescFragContainer, vitalMeasurementFragment);
    //                    vitalsTransaction.addToBackStack(null);
    //                    vitalsTransaction.commit();
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getApplicationContext());
                }
            }

            @Override
            public void onFailure(Call<VibrasenseRequest.VibrasenseResponse> call, Throwable t) {
                Log.i("myLog", "vitalRequest response failure:" + t.toString());

            }
        });
    }
}