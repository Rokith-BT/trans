package com.plenome.pos.utils;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.CountDownTimer;
import android.os.Environment;
import android.os.Handler;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextWatcher;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Base64;
import android.util.Log;
import android.util.Patterns;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.print.PrintHelper;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.chaos.view.PinView;
import com.google.gson.Gson;
import com.imin.printerlib.IminPrintUtils;
import com.plenome.pos.adapters.AbhaAddrselectionAdapter;
import com.plenome.pos.adapters.AddPatientLinkAdapter;
import com.plenome.pos.adapters.MobileNumberSelectionList;
import com.plenome.pos.model.AbhaAddrCreationRequest;
import com.plenome.pos.model.AbhaAddrCreationResponse;
import com.plenome.pos.model.AbhaAddressCreationResp;
import com.plenome.pos.model.AbhaAddressVerifyResponse;
import com.plenome.pos.model.AbhaLinkResponse;
import com.plenome.pos.model.AbhaProfileInfoResponse;
import com.plenome.pos.model.AbhaProfileResp;
import com.plenome.pos.model.AbhaUserNameOtpVerifyResponse;
import com.plenome.pos.model.AbhaUserNameVerifyResponse;
import com.plenome.pos.model.AbhaUsernameSuggestionResp;
import com.plenome.pos.model.DataResponse;
import com.plenome.pos.model.EventModel;
import com.plenome.pos.model.GetPatientProfileResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.PhrProfileResponse;
import com.plenome.pos.model.UpdatePatientRequest;
import com.plenome.pos.model.UpdatePatientResponse;
import com.plenome.pos.model.VerifyAadhaarOTPResp;
import com.plenome.pos.model.VerifyEmailOTPResp;
import com.plenome.pos.model.VerifyMobileListStatus;
import com.plenome.pos.model.VerifyMobileNumberList;
import com.plenome.pos.model.VerifyMobileOTPResponse;
import com.plenome.pos.model.VerifyNewMobileOTPResponse;
import com.plenome.pos.model.VerifyOTPLinkABHAResp;
import com.plenome.pos.model.VerifySecondOTPResp;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.views.OPHubApplication;

import org.greenrobot.eventbus.EventBus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.plenome.pos.R;

public class AbhaOnboradDialogUtils {

    private static RestServices services, abhaServices,imageServices;

    private static String generatedCaptcha, selAbhaOption, token, selectedGender, selectedState, selectedStateCode, selectedDistrict, selectedDistrictCode,
            selectedDay, selectedMonth, selectedYear, selectedImageStream, abhaNumber = "", abhaAddress = "", gender = "gender", userName, userDOB, userAayushId, selectedAdhaarType = "", updateAddress = "",
            updateFirstName = "",updateMiddleName = "",updateLastName = "", updateDOB = "", updateGender = "",getAAyushNumber = "",updateMobile = "",filterAbhaNumber = "",
            updateState = "",updateDistric = "",updatePincode = "",updatePhoto = "",updateImage = "";

    private static Dialog dialogMobileOTP, dialogVerifyOTP, dialogProfileDet,
            dialogCreateAbhaAddr, dialogSuccess, dialogAbhaCard, dialogSelectAbhaAddr, dialogSelectAbhaAddrlink,
            dialogVerifyAbhaAddr, dialogOtpOption, dialogAadhaarOTP, dialogAbhaOTP, dialogCommInfo, dialogTerms, dialogABHA, dialogMobileNumberList,dialogaadherexit,demographic,dialogCompare;
    private static Integer hositalID, clickCount = 0;
    private static ArrayList<String> genderAL;
    private static Context abhaContext;
    private static IminPrintUtils mIminPrintUtils;
    private static EditText edtAbhaNo, edtAadhaarNo,captchaEditText, edtMobile, editText;
    private static ImageView profImage,captchaImageView,imgRefresh;
    private static Bitmap bitmapAbhaCard;
    private static Boolean isEditMobileClicked = false, isFromAdd, showCard= true;
    private static TextView profDob,captchaResultText,resendOtpCount,enable_otp,resendotpsuccess,txtmaxlimitotp, suggestionTxt1, suggestionTxt2, suggestionTxt3, txtInvalidOTP, invalidNumber;
    private static AbhaAddrCreationRequest abhaAddrCreateReq;
    private static Spinner spinGender;
    private static Spinner spinDistrict;
    private static Fragment fragment;
    private static AbhaListener listener;
    private static AddNewPatientListener listenerAddNewPatient;
    private static Response<List<DataResponse>> responseAddNewPatient;
    private static Boolean AbhaQRlink = false;

    private static ProgressBar progressBar,recycle_progress;
    private static Button btnVerify,btnCreateAbhaAddr, btnNext, btnGetprofile,btnContinue,createNew,btnPrint;

    private static PinView pinView;
    private static LinearLayout linearResend;
    private static RelativeLayout relAadhaarOTP,relABHAOTP;

    private static TextView txtmim,txtSpecial,txtSpecialend, abhaText, aadharText,otppinError;
    private static CaptchaGenerator captchaGenerator;

    private static FrameLayout loaderOverlay;

    private static RecyclerView recyclerView;
    private static DataResponse.ExistingPatientDetails oldPatient = null;


    @SuppressLint("ResourceAsColor")
    public static void showABHADialog(Context context, EditText edtAbhaNoInput, Fragment parentFragment, Integer hospId, Boolean isFromAddInput, String mobileNumber, String name, String dob, String aayushId) {
        fragment = parentFragment;
        abhaContext = context;
        edtAbhaNo = edtAbhaNoInput;
        isFromAdd = isFromAddInput;
        if (mIminPrintUtils == null) {
            mIminPrintUtils = IminPrintUtils.getInstance(abhaContext);
        }
        if (hospId != null) {
            hositalID = hospId;
        }
        services = RetrofitInstance.createService(RestServices.class);
        abhaServices = RetrofitInstance.createAbhaService(RestServices.class);
        imageServices = RetrofitInstance.createImageUrl(RestServices.class);
        dialogABHA = new Dialog(context);
        //View view = LayoutInflater.from(context).inflate(R.layout.dialog_abha_main, null);
        View view = LayoutInflater.from(context).inflate(R.layout.abha_new_tab_mainscreen, null);
        dialogABHA.getWindow().setGravity(Gravity.CENTER);
        dialogABHA.setContentView(view);

        ImageView imgClose = dialogABHA.findViewById(R.id.imgClose);
        LinearLayout relAbhaAddress = dialogABHA.findViewById(R.id.relAbhaAddress);
        LinearLayout relMobileNo = dialogABHA.findViewById(R.id.relMobileNo);
        LinearLayout relAadhaarNo = dialogABHA.findViewById(R.id.relAadhaarNo);
        LinearLayout relAbhaNo = dialogABHA.findViewById(R.id.relAbhaNumber);
        LinearLayout llcreate = dialogABHA.findViewById(R.id.llcreate);
        LinearLayout llVerify = dialogABHA.findViewById(R.id.llVerify);
        LinearLayout verifyconten = dialogABHA.findViewById(R.id.verifyconten);
        TextView txtcreate = dialogABHA.findViewById(R.id.txtcreate);
        TextView txtVerify = dialogABHA.findViewById(R.id.txtVerify);
        TextView termstxt1 = dialogABHA.findViewById(R.id.termstxt1);
        TextView termstxt2 = dialogABHA.findViewById(R.id.termstxt2);
        TextView termstxt3 = dialogABHA.findViewById(R.id.termstxt3);
        TextView termstxt4 = dialogABHA.findViewById(R.id.termstxt4);
        captchaEditText = dialogABHA.findViewById(R.id.captchaEditText);
        captchaImageView = dialogABHA.findViewById(R.id.captchaImageView);
        imgRefresh = dialogABHA.findViewById(R.id.imgRefresh);
        captchaResultText = dialogABHA.findViewById(R.id.captchaResultText);
        RelativeLayout createContent = dialogABHA.findViewById(R.id.createContent);
        btnVerify = dialogABHA.findViewById(R.id.btn_verify);
        edtAadhaarNo = dialogABHA.findViewById(R.id.edtAadhaarNo);
        invalidNumber = dialogABHA.findViewById(R.id.invalidNumber);
        CheckBox checkbox = dialogABHA.findViewById(R.id.chk);
        CheckBox chkAbhaNo = dialogABHA.findViewById(R.id.chkAbhaNo);
        CheckBox chkAbhaNo3 = dialogABHA.findViewById(R.id.chkAbhaNo3);
        CheckBox chkAbhaNo4 = dialogABHA.findViewById(R.id.chkAbhaNo4);
        CheckBox chkAbhaNo5 = dialogABHA.findViewById(R.id.chkAbhaNo5);
        CheckBox chkAbhaNo6 = dialogABHA.findViewById(R.id.chkAbhaNo6);
        CheckBox chkAbhaNo7 = dialogABHA.findViewById(R.id.chkAbhaNo7);
        TextView terms = dialogABHA.findViewById(R.id.termscondition);
        CheckBox chkPwd = dialogABHA.findViewById(R.id.chkPassword);
        progressBar = dialogABHA.findViewById(R.id.progressBar);
//        edtAadhaarNo.addTextChangedListener(new AbhaGetOtpFragment.FourDigitCardFormatWatcher());;
        dialogABHA.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogABHA.getWindow().setLayout(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.MATCH_PARENT);
        dialogABHA.setCancelable(false);
        dialogABHA.show();

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogABHA.getWindow().getAttributes());
        lp.width = dpToPx(700, context);
        lp.height = dpToPx(670, context);
        dialogABHA.getWindow().setAttributes(lp);
        btnVerify.setEnabled(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);
        captchaGenerator = new CaptchaGenerator();
        loadNewCaptcha();
        termstxt1.setText("I am voluntarily sharing my AADHAAR Number/Virtual ID issued by the Unique Identification Authority of India (\"UIDAI\"), and my demographic information for the purpose of creating an Ayushman Bharat Health Account number (\"ABHA number\") and Ayushman Bharat Health Account address (\"ABHA Address\"). I authorize NHA to use my AADHAAR number/Virtual ID for performing AADHAAR based authentication with UIDAI as per the provisions of the AADHAAR (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of \"Yes\" with NHA upon successful authentication.\n");
        termstxt2.setText("I consent to the usage of my ABHA address and ABHA number for linking my legacy (past) health records and those that will be generated during this encounter.");
        termstxt3.setText("I authorize the sharing of all my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter.");
        termstxt4.setText("I consent to the anonymization and subsequent use of my health records for public health purposes.");

        imgRefresh.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loadNewCaptcha();
            }
        });
        if (!name.isEmpty() && name != null) {
            userName = name;
        }
        if (!dob.isEmpty() && dob != null) {
            userDOB = dob;
        }
        userAayushId = aayushId;

        checkbox.setButtonTintList(ContextCompat.getColorStateList(context, R.color.gray));
        checkbox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                checkbox.setButtonTintList(ContextCompat.getColorStateList(context, R.color.green_text));
                // checkbox.setButtonTintList(android.content.res.ColorStateList.valueOf(R.color.green_text));
            }
        });

        edtAadhaarNo.addTextChangedListener(new TextWatcher() {
            private static final char space = ' ';
            private boolean isFormatting;
            private int deleteIndex;

            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                deleteIndex = charSequence.length();
            }

            @Override
            public void onTextChanged(CharSequence s, int i, int i1, int i2) {
                if (s.toString().trim().length() == 14) {
                    updateButtonState();
                    invalidNumber.setVisibility(GONE);
                } else {
                    invalidNumber.setText("Please enter 12 digit AADHAAR number");
                    invalidNumber.setVisibility(VISIBLE);
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                }


                if (isFormatting || s.length() > 14) {
                    return;
                }

                isFormatting = true;
                String cleanString = s.toString().replaceAll("\\s", ""); // Remove existing spaces
                StringBuilder formatted = new StringBuilder();

                for (int index = 0; index < cleanString.length(); index++) {
                    if (index > 0 && index % 4 == 0) {
                        formatted.append(" ");
                    }
                    formatted.append(cleanString.charAt(index));
                }

                edtAadhaarNo.setText(formatted.toString());
                edtAadhaarNo.setSelection(formatted.length()); // Move cursor to end
                isFormatting = false;


            }

            private  void updateButtonState() {
                if (chkAbhaNo.isChecked() && chkAbhaNo3.isChecked() && chkAbhaNo4.isChecked() &&
                        chkAbhaNo5.isChecked() && chkAbhaNo6.isChecked() && chkAbhaNo7.isChecked()) {
                    btnVerify.setEnabled(true);
                    btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {
//                invalidNumber.setVisibility(View.GONE);
                edtAadhaarNo.setBackground(ContextCompat.getDrawable(context, R.drawable.edit_text));
//                if (s.length() > 0 && (s.length() % 5) == 0) {
//                    final char c = s.charAt(s.length() - 1);
//                    if (space == c) {
//                        s.delete(s.length() - 1, s.length());
//                    }
//                }
//                if (s.length() > 0 && (s.length() % 5) == 0) {
//                    char c = s.charAt(s.length() - 1);
//                    if (Character.isDigit(c) && TextUtils.split(s.toString(), String.valueOf(space)).length <= 3) {
//                        s.insert(s.length() - 1, String.valueOf(space));
//                    }
//                }
//                String cleanString = s.toString().replaceAll("[^\\d]", ""); // Remove non-digit characters
//                StringBuilder formatted = new StringBuilder();
//
//                for (int i = 0; i < cleanString.length(); i++) {
//                    if (i == 4 || i == 9) {
//                        formatted.append(String.valueOf(space));
//                    }
//                    formatted.append(cleanString.charAt(i));
//                }


//                if (s.length() == 5 ){
//                    final char c = s.charAt(4);
//                    if (space == c) {
//                        s.delete(4, s.length());
//                    }
//                }
//                else if (s.length() > 8 ){
//                    final char c = s.charAt(9);
//                    if (space == c) {
//                        s.delete(9, s.length());
//                    }
//                }
//
//
//                if (s.length() > 3 ){
//                    s.insert(4, String.valueOf(space));
//                }
//                else if (s.length() > 8 ){
//                    s.insert(9, String.valueOf(space));
//                }

            }
        });


        CompoundButton.OnCheckedChangeListener listener = new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                checkVerifyButtonVisibility();
            }

            private void checkVerifyButtonVisibility() {
                if (chkAbhaNo7.isChecked() && chkAbhaNo5.isChecked() && chkAbhaNo4.isChecked() &&
                        chkAbhaNo3.isChecked() && chkAbhaNo.isChecked() && chkAbhaNo6.isChecked() && edtAadhaarNo.getText().length() == 14) {
                    btnVerify.setEnabled(true);
                    btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                }
            }
        };

        chkAbhaNo7.setOnCheckedChangeListener(listener);
        chkAbhaNo6.setOnCheckedChangeListener(listener);
        chkAbhaNo5.setOnCheckedChangeListener(listener);
        chkAbhaNo4.setOnCheckedChangeListener(listener);
        chkAbhaNo3.setOnCheckedChangeListener(listener);
        chkAbhaNo.setOnCheckedChangeListener(listener);


        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogABHA.dismiss();
            }
        });


        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String aadhernumber = edtAadhaarNo.getText().toString();
                String captchaText = captchaEditText.getText().toString();
                String aadhaar = edtAadhaarNo.getText().toString();
                if (!isValidAadhaarNumber(aadhaar)) {
                    invalidNumber.setVisibility(View.VISIBLE);
                    edtAadhaarNo.setBackground(ContextCompat.getDrawable(context, R.drawable.edit_text_error));
//                    Toast.makeText(abhaContext, "Please enter valid Aadhaar number", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (aadhernumber.isEmpty()) {
                    invalidNumber.setVisibility(View.VISIBLE);
                    edtAadhaarNo.setBackground(ContextCompat.getDrawable(context, R.drawable.edit_text_error));
                    return;
                }
                if (!(aadhernumber.length() == 14)) {
                    invalidNumber.setVisibility(View.VISIBLE);
                    edtAadhaarNo.setBackground(ContextCompat.getDrawable(context, R.drawable.edit_text_error));
                    return;
                }

                if (!checkbox.isChecked()) {
                    checkbox.setButtonTintList(android.content.res.ColorStateList.valueOf(Color.RED));
                    return;
                }

                selAbhaOption = "AADHAAR_NO";
                selectedAdhaarType = "creation";
                progressBar.setVisibility(View.VISIBLE);
                btnVerify.setVisibility(View.GONE);
                clickCount = 0;
                if (generatedCaptcha.equals(captchaEditText.getText().toString())){
                    captchaResultText.setText("CAPTCHA Verified ✅");
                    captchaResultText.setTextColor(abhaContext.getResources().getColor(android.R.color.holo_green_dark));
                    loadNewCaptcha();
                    edtAadhaarNo.setEnabled(false);
                    captchaEditText.setEnabled(false);
                    generateAadhaarOTP(aadhaar, "creation");
                }else {
                    progressBar.setVisibility(View.GONE);
                    btnVerify.setVisibility(View.VISIBLE);
                    captchaResultText.setText("CAPTCHA Incorrect ❌");
                    captchaResultText.setTextColor(abhaContext.getResources().getColor(android.R.color.holo_red_dark));
                }

            }
        });
        chkPwd.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    edtAadhaarNo.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    edtAadhaarNo.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }
                edtAadhaarNo.setSelection(edtAadhaarNo.getText().length());
            }
        });
        llcreate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                llcreate.setBackground(ContextCompat.getDrawable(context, R.drawable.ababackground_bg));
                txtcreate.setTextColor(ContextCompat.getColor(context, R.color.white));
                llVerify.setBackground(ContextCompat.getDrawable(context, R.drawable.abha_new_bg));
                txtVerify.setTextColor(ContextCompat.getColor(context, R.color.blue_text));
                createContent.setVisibility(View.VISIBLE);
                verifyconten.setVisibility(View.GONE);
            }
        });

        llVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                llcreate.setBackground(ContextCompat.getDrawable(context, R.drawable.abha_new_bg));
                txtcreate.setTextColor(ContextCompat.getColor(context, R.color.blue_text));
                llVerify.setBackground(ContextCompat.getDrawable(context, R.drawable.ababackground_bg));
                txtVerify.setTextColor(ContextCompat.getColor(context, R.color.white));
                verifyconten.setVisibility(View.VISIBLE);
                createContent.setVisibility(View.GONE);
            }
        });
        terms.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (checkbox.isChecked()) {
                    showTermsAndCondition(true);
                } else {
                    showTermsAndCondition(false);
                }

            }
        });
        relAadhaarNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogABHA.dismiss();
                selAbhaOption = "AADHAAR_NO_VERIFY";
                selectedAdhaarType = "";
                clickCount = 0;
                showAadharOTPDialog();
            }
        });
        relAbhaNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogABHA.dismiss();
                selAbhaOption = "ABHA_NO";
                selectedAdhaarType = "";
                clickCount = 0;
                showAbhaOTPDialog("","");
            }
        });
        relAbhaAddress.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogABHA.dismiss();
                selAbhaOption = "ABHA_ADDRESS";
                selectedAdhaarType = "";
                clickCount = 0;
                showVerifyAbhaAddrDialog(context);
            }
        });
        relMobileNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogABHA.dismiss();
                selAbhaOption = "MOBILE_NO";
                selectedAdhaarType = "";
                clickCount = 0;
                showGetMobOTPDialog(mobileNumber);
            }
        });

    }
    private static void loadNewCaptcha() {
        Bitmap captchaBitmap = captchaGenerator.generateCaptcha();
        generatedCaptcha = captchaGenerator.getCaptchaText();
        captchaImageView.setImageBitmap(captchaBitmap);
        captchaEditText.setText("");
        captchaResultText.setText("");
    }

    //TODO AADHAR Creation and Resent OTP
    private static void generateAadhaarOTP(String aadhaar, String type) {
        String aadhaarNo = aadhaar.replace(" ", "");
        OPHubRequests.GenerateAadhaarOTPRequest request = new OPHubRequests.GenerateAadhaarOTPRequest();
        request.setAadhaarNo(aadhaarNo);
        Log.i("mylog", "generateAadhaarOTP request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.generateAadhaarOTP(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "generateAadhaarOTP response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(View.GONE);
                btnVerify.setVisibility(View.VISIBLE);
                edtAadhaarNo.setEnabled(true);
                captchaEditText.setEnabled(true);
                if (response.body() != null) {
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        System.out.println("print type " + type);
                        if (type.equalsIgnoreCase("creation")) {
                            if (dialogABHA != null && dialogABHA.isShowing()) {
                                dialogABHA.dismiss();
                            }
                        } else {
                            if (dialogAadhaarOTP != null && dialogAadhaarOTP.isShowing()) {
                                dialogAadhaarOTP.dismiss();
                            }
                        }

                        if(dialogVerifyOTP != null &&dialogVerifyOTP.isShowing())
                            dialogVerifyOTP.dismiss();
                        showVerifyOTPDialog("AADHAAR_OTP", txnId, message, aadhaar, "", "", false, "");
                    }

                }else if (response.code() == 400) {
                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");

                        invalidNumber.setVisibility(View.VISIBLE);
                        invalidNumber.setText(errorMessage);
                        edtAadhaarNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                }else {
                    if (type.equalsIgnoreCase("creation") || type.equalsIgnoreCase("verify")) {
                        invalidNumber.setVisibility(View.VISIBLE);
                        edtAadhaarNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
                    }
//                    Toast.makeText(abhaContext, "Please enter valid Aadhaar number", Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                progressBar.setVisibility(View.GONE);
                btnVerify.setVisibility(View.VISIBLE);
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }


    //TODO AABHA Creation OTP and Resend OTP
    public static void showVerifyOTPDialog(String option, String txnId, String message, String aadhaarNo, String email, String mobile, boolean isNew, String otpSystem) {
        Log.i("myLog", "showVerifyOTPDialog");
        Log.i("myLog", "showVerifyOTPDialog option:" + option);
        Log.i("myLog", "showVerifyOTPDialog otpSystem:" + otpSystem + "  aadhaarNo:" + aadhaarNo + "   mobile:" + mobile + "  email:" + email);
        isEditMobileClicked = false;
        dialogVerifyOTP = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.fragment_abha_verify_otp, null);
        dialogVerifyOTP.setContentView(view);
        ImageView imgClose = dialogVerifyOTP.findViewById(R.id.imgClose);
        btnVerify = dialogVerifyOTP.findViewById(R.id.btn_verify);
        TextView txtMob = dialogVerifyOTP.findViewById(R.id.txtMob);
        TextView mobilenumber = dialogVerifyOTP.findViewById(R.id.mobilenumber);
        resendotpsuccess = dialogVerifyOTP.findViewById(R.id.resendotpsuccess);
        edtMobile = dialogVerifyOTP.findViewById(R.id.edtMobileNo);
        progressBar = dialogVerifyOTP.findViewById(R.id.progressBar);
        pinView = dialogVerifyOTP.findViewById(R.id.pinview);
        TextView txtMsg = dialogVerifyOTP.findViewById(R.id.txtMessage);
        txtInvalidOTP = dialogVerifyOTP.findViewById(R.id.txtInvaidotp);
//        ProgressBar progressBar = dialogVerifyOTP.findViewById(R.id.progressBar);
        TextView txtEdit = dialogVerifyOTP.findViewById(R.id.txtEdit);
        LinearLayout linearMob = dialogVerifyOTP.findViewById(R.id.linearMob);
        linearResend = dialogVerifyOTP.findViewById(R.id.linearResend);
        LinearLayout linearSecs = dialogVerifyOTP.findViewById(R.id.linearResendSec);
        resendOtpCount = dialogVerifyOTP.findViewById(R.id.resend_otp_count);
        TextView txtSec = dialogVerifyOTP.findViewById(R.id.txtSecs);
        txtmaxlimitotp = dialogVerifyOTP.findViewById(R.id.txtmaxlimitotp);
        enable_otp = dialogVerifyOTP.findViewById(R.id.enable_otp);
        otppinError = dialogVerifyOTP.findViewById(R.id.otppinError);

        btnVerify.setEnabled(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);

        String messages = message;
        String maskedNumber = extractMaskedMobile(messages);
        mobilenumber.setText(maskedNumber);

        String firstmessage = message;
        String extractedMessage = extractMessage(firstmessage);
        txtMsg.setText(extractedMessage);

        if (option.equalsIgnoreCase("AADHAAR_OTP")) {
            txtMob.setVisibility(View.VISIBLE);
            linearMob.setVisibility(View.VISIBLE);
        } else {
            txtEdit.setVisibility(View.GONE);
            txtMob.setVisibility(View.GONE);
            linearMob.setVisibility(View.GONE);
        }
        dialogVerifyOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogVerifyOTP.setCancelable(false);
        dialogVerifyOTP.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogVerifyOTP.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(450);
        dialogVerifyOTP.getWindow().setAttributes(lp);
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                long res = millisUntilFinished / 1000;
                if (res != 0)
                    txtSec.setText(res + "s");
            }

            public void onFinish() {
                linearResend.setVisibility(View.VISIBLE);
                resendOtpCount.setText(" "+clickCount + "/2");
                linearSecs.setVisibility(View.GONE);
            }
        }.start();

        txtEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                isEditMobileClicked = true;
                txtEdit.setVisibility(View.GONE);
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                if (dialogVerifyOTP != null && dialogVerifyOTP.isShowing()) {
//                    dialogVerifyOTP.dismiss();
//                }
                System.out.println("print dismiss dialog");
                dialogVerifyOTP.dismiss();
            }
        });
        linearResend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (option.equalsIgnoreCase("AADHAAR_OTP")) {
                    clickCount++;
                    if (clickCount == 1 || clickCount == 2) {
                        resendOtpCount.setText(" " + clickCount + "/2");
                        btnVerify.setVisibility(GONE);
                        progressBar.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(View.VISIBLE);
                        generateAadhaarOTP(aadhaarNo, "");
                    } else if (clickCount >= 3) {
                        linearResend.setVisibility(View.GONE);
                        enable_otp.setVisibility(View.GONE);
                        txtmaxlimitotp.setVisibility(View.VISIBLE);
                        resendotpsuccess.setVisibility(View.GONE);
                    }
                } else if (option.equalsIgnoreCase("ABHA_OTP")) {
                    clickCount++;
                    if (clickCount == 1 || clickCount == 2) {
                        resendOtpCount.setText(" " + clickCount + "/2");
                        btnVerify.setVisibility(GONE);
                        progressBar.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(VISIBLE);
                        getOTPLinkABHA(abhaNumber, otpSystem);
                    } else if (clickCount >= 3) {
                        linearResend.setVisibility(GONE);
                        enable_otp.setVisibility(GONE);
                        txtmaxlimitotp.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(GONE);
                    }
                } else if (option.equalsIgnoreCase("AADHAAR_OTP_VERIFICATION")) {
                    clickCount++;
                    if (clickCount == 1 || clickCount == 2) {
                        resendOtpCount.setText(" " + clickCount + "/2");
                        btnVerify.setVisibility(GONE);
                        progressBar.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(VISIBLE);
                        //This not abha number it's changed to aadhar number
                        getAadhaarVerify(abhaNumber, "verify");
                    } else if (clickCount >= 3) {
                        linearResend.setVisibility(GONE);
                        enable_otp.setVisibility(GONE);
                        txtmaxlimitotp.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(GONE);
                    }
                } else if (option.equalsIgnoreCase("EMAIL_OTP")) {
                    resendotpsuccess.setVisibility(VISIBLE);
                    generateEmailOTP(email, txnId, isNew);
                } else if (option.equalsIgnoreCase("CHANGE_PHONE_OTP")) {
                    resendotpsuccess.setVisibility(View.VISIBLE);
//                    generateChangePhoneOTP(mobile, txnId,null);
                } else if (option.equalsIgnoreCase("MOBILE_OTP")){
                    clickCount++;
                    if (clickCount == 1 || clickCount == 2) {
                        resendOtpCount.setText(" " + clickCount + "/2");
                        btnVerify.setVisibility(GONE);
                        progressBar.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(VISIBLE);
                        generateMobileNoOTP(mobile);
                    } else if (clickCount >= 3) {
                        linearResend.setVisibility(GONE);
                        enable_otp.setVisibility(GONE);
                        txtmaxlimitotp.setVisibility(VISIBLE);
                        resendotpsuccess.setVisibility(GONE);
                    }
                }
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("print dismiss dialogs");
                dialogVerifyOTP.dismiss();
            }
        });

        edtMobile.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (selectedAdhaarType.equalsIgnoreCase("creation")) {
                    if (pinView.getText().length() == 6 && edtMobile.getText().length() == 10) {
                        btnVerify.setEnabled(true);
                        btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    } else {
                        btnVerify.setEnabled(false);
                        btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                    }
                    pinView.setLineColor(Color.BLACK);
                    txtInvalidOTP.setVisibility(GONE);
                }

            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });


        pinView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                //  invalidNumber.setVisibility(View.GONE);
                // pinView.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text));

                otppinError.setVisibility(VISIBLE);

                if (selectedAdhaarType.equalsIgnoreCase("creation")) {


                    if (s.toString().trim().length() == 6){
                        otppinError.setVisibility(GONE);
                        if (edtMobile.getText().length() == 10) {
                            btnVerify.setEnabled(true);
                            btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                        } else {
                            btnVerify.setEnabled(false);
                            btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                        }
                        pinView.setLineColor(Color.BLACK);
                        txtInvalidOTP.setVisibility(GONE);
                    }else {
                        otppinError.setVisibility(VISIBLE);
                    }
                } else {
                    if (s.toString().trim().length() == 6) {
                        btnVerify.setEnabled(true);
                        otppinError.setVisibility(GONE);
                        btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    } else {
                        otppinError.setVisibility(VISIBLE);
                        btnVerify.setEnabled(false);
                        btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                    }
                    pinView.setLineColor(Color.BLACK);
                    txtInvalidOTP.setVisibility(GONE);
                }


            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "btnVerify onclick selAbhaOption:" + selAbhaOption);
                String mobileNo = edtMobile.getText().toString();
                String otp = pinView.getText().toString();
                if (otp.isEmpty() || otp.length() != 6) {
                    pinView.setLineColor(Color.RED);
                    txtInvalidOTP.setVisibility(VISIBLE);
                    txtInvalidOTP.setText("Please enter a valid OTP");
                    // Toast.makeText(abhaContext, "Please enter a valid OTP", Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    //  pinView.setLineColor(Color.GREEN);
                    txtInvalidOTP.setVisibility(GONE);
                }

                if (selAbhaOption.equalsIgnoreCase("MOBILE_NO")) {
                    progressBar.setVisibility(VISIBLE);
                    btnVerify.setVisibility(GONE);
                    pinView.setEnabled(false);
                    verifyMobileNoOTP(mobile, txnId, otp, "", "MOBILE_NO");

                } else if (selAbhaOption.equalsIgnoreCase("ABHA_NO")) {
                    progressBar.setVisibility(VISIBLE);
                    btnVerify.setVisibility(GONE);
                    Log.i("myLog", "btnVerify onclick ABHA_NO:  otpSystem:" + otpSystem);
                    pinView.setEnabled(false);
                    verifyOTPLinkABHA(txnId, otp, otpSystem);

                } else if (selAbhaOption.equalsIgnoreCase("ABHA_ADDRESS")) {
                    dialogVerifyOTP.dismiss();
                    showSuccessDialog(abhaContext.getString(R.string.abha_no_linked), "ABHA_VERIFY", false, false);

                } else if (option.equalsIgnoreCase("AADHAAR_OTP_VERIFICATION")) {
                    progressBar.setVisibility(VISIBLE);
                    btnVerify.setVisibility(GONE);
                    pinView.setEnabled(false);
                    verifyOTPAadhaar(txnId, otp, otpSystem);
                } else if (selAbhaOption.equalsIgnoreCase("AADHAAR_NO")) {
                    if (option.equalsIgnoreCase("CHANGE_PHONE_OTP")) {
                        System.out.println("print changed phone number");
                    } else if (option.equalsIgnoreCase("EMAIL_OTP")) {
                        verifyEmailOTP(txnId, otp, isNew);
                    } else if (option.equalsIgnoreCase("AADHAAR_OTP")) {
                        if (mobileNo.isEmpty()) {
//                            Toast.makeText(abhaContext, "Please Enter Mobile number", Toast.LENGTH_SHORT).show();
                            return;
                        }
                        if (isEditMobileClicked) {
                            linearMob.setVisibility(View.GONE);
                            txtMob.setVisibility(View.GONE);
//                            generateChangePhoneOTP(mobileNo, txnId,null);
                        } else {
                            progressBar.setVisibility(VISIBLE);
                            btnVerify.setVisibility(GONE);
                            pinView.setEnabled(false);
                            edtMobile.setEnabled(false);
                            verifyAadhaarOTP(txnId, otp, mobileNo);
                        }
                    }
                }
//                dialogVerifyOTP.dismiss();
            }
        });
    }


    public static void showGetMobOTPDialog(String mobileNumber) {
        Log.i("myLog", "showABHADialog");
        dialogMobileOTP = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.fragment_abha_get_mobile_no, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogMobileOTP.setContentView(view);
        ImageView imgClose = dialogMobileOTP.findViewById(R.id.imgClose);
        btnNext = dialogMobileOTP.findViewById(R.id.btn_next);
        createNew = dialogMobileOTP.findViewById(R.id.create_new);
        edtMobile = dialogMobileOTP.findViewById(R.id.edtMobileNo);
        CheckBox chkAgree = dialogMobileOTP.findViewById(R.id.chkAbhaNo);
        LinearLayout llmobile = dialogMobileOTP.findViewById(R.id.llmobile);
        TextView terms = dialogMobileOTP.findViewById(R.id.termscondition);
        progressBar = dialogMobileOTP.findViewById(R.id.progressBar);
        invalidNumber = dialogMobileOTP.findViewById(R.id.invalidNumber);
        dialogMobileOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogMobileOTP.setCancelable(false);
        dialogMobileOTP.show();
        edtMobile.setText(mobileNumber);
        edtMobile.setSelection(edtMobile.getText().length());
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogMobileOTP.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(450);
        dialogMobileOTP.getWindow().setAttributes(lp);
        btnNext.setEnabled(true);
        btnNext.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        btnNext.setVisibility(GONE);


        edtMobile.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (charSequence.toString().trim().length() == 10) {
                    btnNext.setVisibility(VISIBLE);
                    btnNext.setEnabled(true);
                    btnNext.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnNext.setVisibility(GONE);
                    createNew.setVisibility(GONE);
                    btnNext.setEnabled(false);
                    btnNext.setBackgroundResource(R.drawable.round_disable_button);
                }

            }

            @Override
            public void afterTextChanged(Editable editable) {
                llmobile.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text));
                invalidNumber.setVisibility(View.GONE);
            }
        });


        chkAgree.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.gray));
        chkAgree.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                chkAgree.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.green_text));
                // checkbox.setButtonTintList(android.content.res.ColorStateList.valueOf(R.color.green_text));
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogMobileOTP.dismiss();
            }
        });
        terms.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(chkAgree.isChecked()){
                    showTermsAndCondition(true);
                }else {
                    showTermsAndCondition(false);
                }
            }
        });
        dialogMobileOTP.dismiss();
        btnNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String mobile = edtMobile.getText().toString();
                if (!(!mobile.isEmpty() && mobile.length() == 10 && Patterns.PHONE.matcher(mobile).matches())) {
                    llmobile.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
                    invalidNumber.setVisibility(View.VISIBLE);
//                    Toast.makeText(abhaContext, "Enter valid mobile number!", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (!chkAgree.isChecked()) {
                    chkAgree.setButtonTintList(android.content.res.ColorStateList.valueOf(Color.RED));
//                    Toast.makeText(abhaContext, "Please agree the terms", Toast.LENGTH_SHORT).show();
                    return;
                }
                progressBar.setVisibility(View.VISIBLE);
                btnNext.setVisibility(View.GONE);
                edtMobile.setEnabled(false);
                generateMobileNoList(mobile);
                // generateMobileOTP(mobile, "", "");
                //  showVerifyOTPDialog("MOBILE_OTP", "", "", "", "", "", false);
            }
        });

        createNew.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showABHADialog(abhaContext,edtAbhaNo,fragment,hositalID,isFromAdd,"","","","");
                dialogMobileOTP.dismiss();
            }
        });
        dialogMobileOTP.show();
    }

    public static void showAbhaOTPDialog(String invalid, String abhaNO) {
        Log.i("myLog", "showAbhaOTPDialog");
        dialogAbhaOTP = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_get_abha_no_otp, null);
        dialogAbhaOTP.setContentView(view);
        ImageView imgClose = dialogAbhaOTP.findViewById(R.id.imgClose);
        Button btnVerify = dialogAbhaOTP.findViewById(R.id.btn_verify);
        EditText edtAbhaNo = dialogAbhaOTP.findViewById(R.id.edtAbhaNo);
        CheckBox chkAgree = dialogAbhaOTP.findViewById(R.id.chkAbhaNo);
        TextView terms = dialogAbhaOTP.findViewById(R.id.termscondition);
        TextView invalidNumber = dialogAbhaOTP.findViewById(R.id.invalidNumber);
        progressBar = dialogAbhaOTP.findViewById(R.id.progressBar);
        CheckBox chkPwd = dialogAbhaOTP.findViewById(R.id.chkPassword);
        //  edtAbhaNo.addTextChangedListener(new AbhaNoFormatWatcher());
        dialogAbhaOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogAbhaOTP.setCancelable(false);
        dialogAbhaOTP.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogAbhaOTP.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(450);
        dialogAbhaOTP.getWindow().setAttributes(lp);
        btnVerify.setEnabled(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);

        if (invalid.equalsIgnoreCase("invalid")){
            edtAbhaNo.setText(abhaNO);
            edtAbhaNo.setSelection(edtAbhaNo.getText().length());
            invalidNumber.setVisibility(View.VISIBLE);
            edtAbhaNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
        }
        chkPwd.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.gray));
        chkPwd.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                chkPwd.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.green_text));
                // checkbox.setButtonTintList(android.content.res.ColorStateList.valueOf(R.color.green_text));
            }
        });

        chkPwd.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    edtAbhaNo.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    edtAbhaNo.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }
                edtAbhaNo.setSelection(edtAbhaNo.getText().length());
            }
        });

        terms.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(chkPwd.isChecked()){
                    showTermsAndCondition(true);
                }else {
                    showTermsAndCondition(false);
                }
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogAbhaOTP.dismiss();
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String abhaNo = edtAbhaNo.getText().toString();
                if (!isValidABHANumber(abhaNo)) {
                    invalidNumber.setVisibility(View.VISIBLE);
                    edtAbhaNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
                    return;
                }
                if (!chkAgree.isChecked()) {
                    chkAgree.setButtonTintList(android.content.res.ColorStateList.valueOf(Color.RED));
//                    Toast.makeText(abhaContext, "Please agree the terms", Toast.LENGTH_SHORT).show();
                    return;
                }
                dialogAbhaOTP.dismiss();
                progressBar.setVisibility(View.VISIBLE);
                btnVerify.setVisibility(View.GONE);
                showOTPOptionDialog("LINK_ABHA_NO", abhaNo, null);
            }
        });
        edtAbhaNo.addTextChangedListener(new TextWatcher() {
            private String current = "";
            private final String hyphen = "-";

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                invalidNumber.setVisibility(View.GONE);
                edtAbhaNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text));
                if (!s.toString().equals(current)) {
                    String cleanString = s.toString().replaceAll("[^\\d]", ""); // Remove non-digit characters
                    StringBuilder formatted = new StringBuilder();

                    for (int i = 0; i < cleanString.length(); i++) {
                        if (i == 2 || i == 6 || i == 10) {
                            formatted.append(hyphen);
                        }
                        formatted.append(cleanString.charAt(i));
                    }

                    current = formatted.toString();
                    edtAbhaNo.setText(current);
                    edtAbhaNo.setSelection(current.length()); // Move the cursor to the end
                }

                if (s.toString().trim().length() == 17) {
                    btnVerify.setEnabled(true);
                    btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                }


            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    public static void showTermsAndCondition(Boolean check) {

        Log.i("myLog", "showAbhaOTPDialog");
        dialogTerms = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_terms_condition, null);
        dialogTerms.setContentView(view);
        dialogTerms.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogTerms.setCancelable(false);
        dialogTerms.show();
        CheckBox checkBox1 = dialogTerms.findViewById(R.id.chkAbhaNo);
        CheckBox checkBox2 = dialogTerms.findViewById(R.id.chkAbhaNo2);
        CheckBox checkBox3 = dialogTerms.findViewById(R.id.chkAbhaNo3);
        CheckBox checkBox4 = dialogTerms.findViewById(R.id.chkAbhaNo4);
        CheckBox checkBox5 = dialogTerms.findViewById(R.id.chkAbhaNo5);
        CheckBox checkBox6 = dialogTerms.findViewById(R.id.chkAbhaNo6);
        CheckBox checkBox7 = dialogTerms.findViewById(R.id.chkAbhaNo7);
        ImageView imgClose = dialogTerms.findViewById(R.id.imgClose);
        TextView name = dialogTerms.findViewById(R.id.name);
        TextView hospital_name = dialogTerms.findViewById(R.id.hospital_name);
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogTerms.getWindow().getAttributes());
        lp.width = dpToPx(1000);
        lp.height = dpToPx(550);
        dialogTerms.getWindow().setAttributes(lp);

        if (check){
            checkBox1.setChecked(true);
            checkBox2.setChecked(true);
            checkBox3.setChecked(true);
            checkBox4.setChecked(true);
            checkBox5.setChecked(true);
            checkBox6.setChecked(true);
            checkBox7.setChecked(true);
        }else {
            checkBox1.setChecked(false);
            checkBox2.setChecked(false);
            checkBox3.setChecked(false);
            checkBox4.setChecked(false);
            checkBox5.setChecked(false);
            checkBox6.setChecked(false);
            checkBox7.setChecked(false);
        }

        hospital_name.setText("I plenome, confirm that I have duly informed and explained the beneficiary of the contents of consent for aforementioned purposes.");
        name.setText("I have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes.");

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogTerms.dismiss();
            }
        });
    }

    public static boolean isValidAadhaarNumber(String str) {
        // Regex to check valid Aadhaar number.
        String regex
                = "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$";

        // Compile the ReGex
        Pattern p = Pattern.compile(regex);

        // If the string is empty
        // return false
        if (str == null) {
            return false;
        }

        // Pattern class contains matcher() method
        // to find matching between given string
        // and regular expression.
        Matcher m = p.matcher(str);

        // Return if the string
        // matched the ReGex
        return m.matches();
    }


    public static void showAadharOTPDialog() {
        Log.i("myLog", "showAadharOTPDialog");
        dialogAadhaarOTP = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_get_aadhar_otp, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogAadhaarOTP.setContentView(view);
        ImageView imgClose = dialogAadhaarOTP.findViewById(R.id.imgClose);
        btnVerify = dialogAadhaarOTP.findViewById(R.id.btn_verify);
        edtAadhaarNo = dialogAadhaarOTP.findViewById(R.id.edtAadhaarNo);
        CheckBox chkAgree = dialogAadhaarOTP.findViewById(R.id.chk);
        TextView terms = dialogAadhaarOTP.findViewById(R.id.termscondition);
        invalidNumber = dialogAadhaarOTP.findViewById(R.id.invalidNumber);
        progressBar = dialogAadhaarOTP.findViewById(R.id.progressBar);
        CheckBox chkPwd = dialogAadhaarOTP.findViewById(R.id.chkPassword);
//        edtAadhaarNo.addTextChangedListener(new AbhaGetOtpFragment.FourDigitCardFormatWatcher());
        dialogAadhaarOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogAadhaarOTP.setCancelable(false);
        dialogAadhaarOTP.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogAadhaarOTP.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(450, abhaContext);
        dialogAadhaarOTP.getWindow().setAttributes(lp);
        btnVerify.setEnabled(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);

        edtAadhaarNo.addTextChangedListener(new TextWatcher() {
            private static final char space = ' ';
            private boolean isFormatting;
            private int deleteIndex;

            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                deleteIndex = charSequence.length();
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (charSequence.toString().trim().length() == 14) {
                    btnVerify.setEnabled(true);
                    btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                }
                if (isFormatting || charSequence.length() > 14) {
                    return;
                }

                isFormatting = true;
                String cleanString = charSequence.toString().replaceAll("\\s", ""); // Remove existing spaces
                StringBuilder formatted = new StringBuilder();

                for (int index = 0; index < cleanString.length(); index++) {
                    if (index > 0 && index % 4 == 0) {
                        formatted.append(" ");
                    }
                    formatted.append(cleanString.charAt(index));
                }

                edtAadhaarNo.setText(formatted.toString());
                edtAadhaarNo.setSelection(formatted.length()); // Move cursor to end
                isFormatting = false;
            }

            @Override
            public void afterTextChanged(Editable s) {
                invalidNumber.setVisibility(View.GONE);
                edtAadhaarNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text));
          /*      if (s.length() > 0 && (s.length() % 5) == 0) {
                    final char c = s.charAt(s.length() - 1);
                    if (space == c) {
                        s.delete(s.length() - 1, s.length());
                    }
                }
                // Insert char where needed.
                if (s.length() > 0 && (s.length() % 5) == 0) {
                    char c = s.charAt(s.length() - 1);
                    // Only if its a digit where there should be a space we insert a space
                    if (Character.isDigit(c) && TextUtils.split(s.toString(), String.valueOf(space)).length <= 3) {
                        s.insert(s.length() - 1, String.valueOf(space));
                    }
                }*/
            }
        });

        terms.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (chkAgree.isChecked()) {
                    showTermsAndCondition(true);
                } else {
                    showTermsAndCondition(false);
                }
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogAadhaarOTP.dismiss();
            }
        });
        chkAgree.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.gray));
        chkAgree.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                chkAgree.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.green_text));
                // checkbox.setButtonTintList(android.content.res.ColorStateList.valueOf(R.color.green_text));
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String aadhaar = edtAadhaarNo.getText().toString();
                if (!isValidAadhaarNumber(aadhaar)) {
                    invalidNumber.setVisibility(View.VISIBLE);
                    edtAadhaarNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
                    return;
                }
                if (!chkAgree.isChecked()) {
                    chkAgree.setButtonTintList(android.content.res.ColorStateList.valueOf(Color.RED));
//                    Toast.makeText(abhaContext, "Please agree the terms", Toast.LENGTH_SHORT).show();
                    return;
                }
                btnVerify.setVisibility(View.GONE);
                progressBar.setVisibility(View.VISIBLE);
//                generateAadhaarOTP(aadhaar, "verify");
                edtAadhaarNo.setEnabled(false);
                getAadhaarVerify(aadhaar, "verify");

            }
        });

        chkPwd.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    edtAadhaarNo.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    edtAadhaarNo.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }
                edtAadhaarNo.setSelection(edtAadhaarNo.getText().length());
            }
        });

    }




    private static String extractMaskedMobile(String message) {
        String[] words = message.split(" ");
        return words[words.length - 1];
    }

    private static String extractMessage(String message) {
        int index = message.lastIndexOf(" ");
        if (index != -1) {
            return message.substring(0, index); // Extract everything before the last space
        }
        return message; // Return as is if no space found
    }

    private static void verifyMobileNoOTP(String mobile, String txnId, String otp, String otpFrom, String option) {
        OPHubRequests.VerifyMobileOTPReq request = new OPHubRequests.VerifyMobileOTPReq();
        Log.i("myLog", "verifyMobileNoOTP");
        Log.i("myLog", "verifyMobileNoOTP mobile:" + mobile);
        request.setTxnId(txnId);
        request.setOtp(otp);
        Log.i("mylog", "VerifyMobileOTP request:" + new Gson().toJson(request));
        Call<VerifyNewMobileOTPResponse> call = abhaServices.verifyNewMobileNoOTP(request);
        call.enqueue(new Callback<VerifyNewMobileOTPResponse>() {

            @Override
            public void onResponse(Call<VerifyNewMobileOTPResponse> call, Response<VerifyNewMobileOTPResponse> response) {

                pinView.setEnabled(true);
                if (response.body() != null) {
                    Log.i("mylog", "VerifyMobileOTP response:" + response.body().toString());
                    VerifyNewMobileOTPResponse resp = response.body();
                    String message = resp.getMessage();
                    String authResult = resp.getAuthResult();
//

                    if (authResult != null && authResult.equalsIgnoreCase("Success")) {
                        //   pinView.setLineColor(Color.GREEN);
                        //  Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
//                        if (dialogVerifyOTP.isShowing())
//                            dialogVerifyOTP.dismiss();

                        if (message.equalsIgnoreCase("OTP verified successfully")) {

                            abhaNumber = resp.getAccounts().get(0).getABHANumber();
                            abhaAddress = resp.getAccounts().get(0).getPreferredAbhaAddress();

                            String abhaNumber = "";
                            if (resp != null) {
                                btnCreateAbhaAddr.setVisibility(View.GONE);
                                List<VerifyNewMobileOTPResponse.Account> mobileUsers = resp.getAccounts();
                                if (mobileUsers != null) {
                                    for (VerifyNewMobileOTPResponse.Account user : mobileUsers) {
                                        if (user.getABHANumber() != null) {
                                            String abha = user.getABHANumber().replaceAll("[^\\d]", "");
                                            if (abha.length() >= 4 && abha.substring(abha.length() - 4).equals(filterAbhaNumber)) {
                                                abhaNumber = user.getABHANumber();
                                            }
                                        }
                                    }
                                }
                            }
                            verifyNewMobileOTPToken(resp.getToken(), abhaNumber, resp.getTxnId());
//                            verifyNewMobileOTPToken(resp.getToken(), resp.getAccounts().get(0).getABHANumber(), resp.getTxnId());
//                            selectAbhaAddrDialogNew("", "", null, null, resp);

//                              getProfile(abhaAddressInput, token, txnId,item.getAbhaNumber());


                        }

//                        List<VerifyMobileOTPResponse.Users> userList = resp.getUsers();
//                        if(!AbhaQRlink) {
//                            if (userList.size() > 0) {
//                                token = resp.getTokens().getToken();
//                                selectAbhaAddrDialogNew(mobile, txnId, resp, null);
//                            } else
//                                showProfileDetails(mobile, txnId, null);
//                        }else {
//                            System.out.println("print call qr otp ");
//                            if (userList.size() > 0) {
//                                token = resp.getTokens().getToken();
//                            }
//                            getAayushUniqueId();
//
//                        }
                    }
                    else {
                        pinView.setLineColor(Color.RED);
                        txtInvalidOTP.setVisibility(View.VISIBLE);
                        btnVerify.setVisibility(View.VISIBLE);
                        progressBar.setVisibility(View.GONE);
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                    }




                }
                else {
                    progressBar.setVisibility(View.GONE);
                    pinView.setLineColor(Color.RED);
                    btnVerify.setVisibility(View.VISIBLE);
                    txtInvalidOTP.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<VerifyNewMobileOTPResponse> call, Throwable t) {
                Log.i("myLog", "VerifyMobileOTPResponse response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.GONE);
            }
        });
    }


    public static void verifyNewMobileOTPToken(String tkn, String ABHANumber, String trxId) {

        OPHubRequests.LinkAbhaNoRequest request = new OPHubRequests.LinkAbhaNoRequest();
        request.setABHANumber(ABHANumber);
        request.setTxnId(trxId);
        Log.i("mylog", "getProfile request:" + new Gson().toJson(request));
        Call<OPHubResponse.TokenResponse> call = abhaServices.linkAbhaNo("Bearer " + tkn, request);
        call.enqueue(new Callback<OPHubResponse.TokenResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.TokenResponse> call, Response<OPHubResponse.TokenResponse> response) {

                Log.i("mylog", "ccc" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    token = response.body().getToken();
                    System.out.println("Print token" + token);
                    getAbhaProfile(token);
//                    getAayushUnique(abhaContext.getString(R.string.congratulations), "ABHA_CARD", false, true);

                }

            }

            @Override
            public void onFailure(Call<OPHubResponse.TokenResponse> call, Throwable t) {
                Log.i("myLog", "getProfile response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });


    }
    private static void verifyOTPAadhaar(String txnId, String otp, String otpSystem) {
        OPHubRequests.VerifyOTPLinkABHAReq request = new OPHubRequests.VerifyOTPLinkABHAReq();
        Log.i("myLog", "verifyOTPLinkABHA");
        request.setTxnId(txnId);
        request.setAadhaarOTP(otp);
        Log.i("mylog", "verifyOTPLinkABHA request:" + new Gson().toJson(request));
        Call<VerifyOTPLinkABHAResp> call = abhaServices.verifyOTPLinkABHA(request);
        call.enqueue(new Callback<VerifyOTPLinkABHAResp>() {

            @Override
            public void onResponse(Call<VerifyOTPLinkABHAResp> call, Response<VerifyOTPLinkABHAResp> response) {

                Log.i("mylog", "VerifyOTPLinkABHAResp response:" + new Gson().toJson(response.body()));
                pinView.setEnabled(true);
                if (response.body() != null) {
                    VerifyOTPLinkABHAResp resp = response.body();
                    String message = resp.getMessage();
                    String authResult = resp.getAuthResult();
                    if (authResult != null && authResult.equalsIgnoreCase("Success")) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        token = resp.getToken();
                        getAbhaProfile(token);
//                        showSuccessDialog(abhaContext.getString(R.string.abha_no_linked), "ABHA_NO_LINK", false, false);
//                        if (dialogVerifyOTP.isShowing()) {
//                            dialogVerifyOTP.dismiss();
//                        }


                    } else {
                        progressBar.setVisibility(GONE);
                        btnVerify.setVisibility(VISIBLE);
                        txtInvalidOTP.setVisibility(View.VISIBLE);
                        pinView.setLineColor(Color.RED);
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                    }
                } else if (response.code() == 400) {

                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        dialogVerifyOTP.dismiss();
                        navigationAadherflow();


                        //  Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                }else {

                    txtInvalidOTP.setVisibility(View.VISIBLE);
                    pinView.setLineColor(Color.RED);
                }
            }

            @Override
            public void onFailure(Call<VerifyOTPLinkABHAResp> call, Throwable t) {
                Log.i("myLog", "VerifyMobileOTPResponse response failure:" + t.toString());
                invalidNumber.setVisibility(View.VISIBLE);
                pinView.setLineColor(Color.RED);
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    public static void navigationAadherflow() {
        Log.i("myLog", "exituserAddrDialog");
        dialogaadherexit = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.aadhernumber_exist, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogaadherexit.setContentView(view);
        ImageView imgClose = dialogaadherexit.findViewById(R.id.imgClose);
        btnVerify = dialogaadherexit.findViewById(R.id.btn_verify);
        EditText edtTxt = dialogaadherexit.findViewById(R.id.edtMobileNo);
        CheckBox checkBox = dialogaadherexit.findViewById(R.id.chkAbhaNo);
        progressBar = dialogaadherexit.findViewById(R.id.progressBar);
        TextView message = dialogaadherexit.findViewById(R.id.message);
        dialogaadherexit.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogaadherexit.setCancelable(false);
        dialogaadherexit.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogaadherexit.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(450, abhaContext);
        dialogaadherexit.getWindow().setAttributes(lp);
        btnVerify.setVisibility(VISIBLE);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogaadherexit.dismiss();
            }
        });

        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

//                if (listener != null) {
//                    listener.onAbhaCardDownloaded("", "",names,"","",address,dobs,genterS,updateMobile);
//                }
                dialogaadherexit.dismiss();
                showABHADialog(abhaContext,edtAbhaNo,fragment,hositalID,isFromAdd,"","","","");

            }
        });

    }

    private static void verifyOTPLinkABHA(String txnId, String otp, String otpSystem) {
        OPHubRequests.VerifyOTPLinkABHAReq request = new OPHubRequests.VerifyOTPLinkABHAReq();
        Log.i("myLog", "verifyOTPLinkABHA");
        request.setTxnId(txnId);
        request.setOtpSystem(otpSystem);
        request.setAbhaOTP(otp);
        Log.i("mylog", "verifyOTPLinkABHA request:" + new Gson().toJson(request));
        Call<VerifyOTPLinkABHAResp> call = abhaServices.verifyOTPLinkABHA(request);
        call.enqueue(new Callback<VerifyOTPLinkABHAResp>() {

            @Override
            public void onResponse(Call<VerifyOTPLinkABHAResp> call, Response<VerifyOTPLinkABHAResp> response) {

                Log.i("mylog", "VerifyOTPLinkABHAResp response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(View.GONE);
                pinView.setEnabled(true);
                if (response.body() != null) {
                    VerifyOTPLinkABHAResp resp = response.body();
                    String message = resp.getMessage();
                    String authResult = resp.getAuthResult();
                    if (authResult != null && authResult.equalsIgnoreCase("Success")) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        token = resp.getToken();
                        getAbhaProfile(token);
//                        showSuccessDialog(abhaContext.getString(R.string.abha_no_linked), "ABHA_NO_LINK", false, false);
                        if (dialogVerifyOTP.isShowing()) {
                            dialogVerifyOTP.dismiss();
                        }


                    } else {
                        btnVerify.setVisibility(View.VISIBLE);
                        txtInvalidOTP.setVisibility(View.VISIBLE);
                        pinView.setLineColor(Color.RED);
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                    }
                }else {
                    btnVerify.setVisibility(View.VISIBLE);
                    txtInvalidOTP.setVisibility(View.VISIBLE);
                    pinView.setLineColor(Color.RED);
                }
            }

            @Override
            public void onFailure(Call<VerifyOTPLinkABHAResp> call, Throwable t) {
                Log.i("myLog", "VerifyMobileOTPResponse response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(View.VISIBLE);
            }
        });
    }


    private static void getAbhaProfile(String token) {
        Call<AbhaProfileInfoResponse> call = abhaServices.getAbhaProfileInfo("Bearer " + token);
        call.enqueue(new Callback<AbhaProfileInfoResponse>() {
            @Override
            public void onResponse(Call<AbhaProfileInfoResponse> call, Response<AbhaProfileInfoResponse> response) {
                Log.i("mylog", "getProfileInfo response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    abhaAddress = response.body().getPreferredAbhaAddress();
                    abhaNumber = response.body().getABHANumber();
                    OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
                    request.setAbhaNo(response.body().getABHANumber());
                    request.setAbhaAddress(response.body().getPreferredAbhaAddress());
                    request.setAddress(response.body().getAddress());
                    request.setDob(response.body().getYearOfBirth() + "-" +
                            response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth());
                    request.setPatientName(response.body().getName());
                    request.setDialCode("91");
                    request.setMobile(response.body().getMobile());
                    //No need gender verify method
                    /*String gender = "";
                    if(response.body().getGender().equals("M")){
                        gender = "Male";
                    } else if (response.body().getGender().equals("F")) {
                        gender = "Female";
                    }else {
                        gender = "Others";
                    }*/
                    updateAddress = response.body().getAddress();
                    updateDOB = response.body().getYearOfBirth() + "-" +
                            response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth();
                    updateFirstName = response.body().getFirstName();
                    updateMiddleName = response.body().getMiddleName();
                    updateLastName = response.body().getLastName();
                    updateGender = response.body().getGender();
                    updateMobile = response.body().getMobile();
                    updateImage = response.body().getImageKey();
                    request.setGender(response.body().getGender());
                    request.setAge(calculateAge(response.body().getYearOfBirth() + "-" +
                            response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth()));
                    String name=updateFirstName +" "+updateMiddleName+" "+updateLastName;

                    checkAddressNumber();
//                    addonboradpatient(abhaNumber,name,updateAddress,updateGender,response.body().getMobile(),updateDOB);

//                    getAayushUnique(abhaContext.getString(R.string.abha_no_linked), "ABHA_NO_LINK", false, false);
//                    if (hositalID != null) {
//                        request.setHospId(hositalID);
//                        addNewPatient(request);
//                    }
                }
            }

            @Override
            public void onFailure(Call<AbhaProfileInfoResponse> call, Throwable t) {
                Log.i("myLog", "getProfileInfo response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }



    //TODO AAdhar creation flow adapter click
    private static void checkAddressNumberAdapter() {
        OPHubResponse.VerifyRequest request = new OPHubResponse.VerifyRequest();
        request.setAbhaAddress(abhaAddress);
        request.setAbhaNumber(abhaNumber);
        request.setHospitalId(hositalID.toString());
        Log.i("mylog", "verifyAbhaAddr request:" + new Gson().toJson(request));
        Call<OPHubResponse.VerifyAbhaAddress> call = services.CheckAddressNumber(request);
        call.enqueue(new Callback<OPHubResponse.VerifyAbhaAddress>() {
            @Override
            public void onResponse(Call<OPHubResponse.VerifyAbhaAddress> call, Response<OPHubResponse.VerifyAbhaAddress> response) {
                Log.i("mylog", "CheckNumberAddresss response:");
                if (dialogVerifyOTP.isShowing() && dialogVerifyOTP != null) {
                    dialogVerifyOTP.dismiss();
                }
                if (dialogCreateAbhaAddr != null && dialogCreateAbhaAddr.isShowing())
                    dialogCreateAbhaAddr.dismiss();
                if (response.body() != null) {
                    try {
                        Log.i("mylog", "CheckNumberAddresss response:" + new Gson().toJson(response.body()));
                        if (response.body().getStatus().equalsIgnoreCase("failed") || response.body().getStatus() == null) {
                            if (response.body().getPatientDetails().get(0).getAayushUniqueId() != null) {
                                getAAyushNumber = response.body().getPatientDetails().get(0).getAayushUniqueId();
                                userAayushId = getAAyushNumber;
    //                            secondAbhaAdressDemographic();
                                showcompareSecondDialog();
                                updateAbhaNumber(false);

    //                            alreadyLinked();
    //                            System.out.println("ayus:::" + ayus);
    //                            if (listener != null) {
    //                                listener.onAbhaQR(ayus);
    //                            }
                            }
                        } else {
    //                        demographic();
                            showcompareDialog();
    //                        addonboradpatient(abhaNumber,updateFirstName,updateAddress,updateGender,updateMobile,updateDOB);
    //                        getAayushUnique(abhaContext.getString(R.string.abha_no_linked), "ABHA_NO_LINK", false, false);
                        }

                } catch (Exception e) {
                        OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.VerifyAbhaAddress> call, Throwable t) {
                Log.i("myLog", "CheckAddressNumber response failure:" + t.toString());

            }
        });

    }


    private static void checkAddressNumber() {
        OPHubResponse.VerifyRequest request = new OPHubResponse.VerifyRequest();
        request.setAbhaAddress(abhaAddress);
        request.setAbhaNumber(abhaNumber);
        request.setHospitalId(hositalID.toString());
        Log.i("mylog", "verifyAbhaAddr request:" + new Gson().toJson(request));
        Call<OPHubResponse.VerifyAbhaAddress> call = services.CheckAddressNumber(request);
        call.enqueue(new Callback<OPHubResponse.VerifyAbhaAddress>() {
            @Override
            public void onResponse(Call<OPHubResponse.VerifyAbhaAddress> call, Response<OPHubResponse.VerifyAbhaAddress> response) {
                Log.i("mylog", "CheckNumberAddresss response:");
                if (dialogVerifyOTP.isShowing() && dialogVerifyOTP != null) {
                    dialogVerifyOTP.dismiss();
                }
                if (dialogCreateAbhaAddr != null && dialogCreateAbhaAddr.isShowing())
                    dialogCreateAbhaAddr.dismiss();
                if (response.body() != null){ try {

                        Log.i("mylog", "CheckNumberAddresss response:" + new Gson().toJson(response.body()));
                        if (response.body().getStatus().equalsIgnoreCase("failed") || response.body().getStatus() == null) {
                            if (response.body().getPatientDetails().get(0).getAayushUniqueId() != null) {
                                getAAyushNumber = response.body().getPatientDetails().get(0).getAayushUniqueId();
                                if (abhaNumber != null && !abhaNumber.isEmpty()){
                                updateAbhaNumber(true);
                                } else {
                                  alreadyLinked();
                                }
    //                            alreadyLinked();
    //                            System.out.println("ayus:::" + ayus);
    //                            if (listener != null) {
    //                                listener.onAbhaQR(ayus);
    //                            }
                            }
                        } else {

                            addonboradpatient(abhaNumber,updateFirstName +" "+updateMiddleName+" "+updateLastName,updateAddress,updateGender,updateMobile,updateDOB);
    //                        getAayushUnique(abhaContext.getString(R.string.abha_no_linked), "ABHA_NO_LINK", false, false);
                        }

                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.VerifyAbhaAddress> call, Throwable t) {
                Log.i("myLog", "CheckAddressNumber response failure:" + t.toString());

            }
        });

    }

    public static void alreadyLinked() {
        Log.i("myLog", "exituserAddrDialog");
        dialogaadherexit = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.aadhernumber_exist, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogaadherexit.setContentView(view);
        ImageView imgClose = dialogaadherexit.findViewById(R.id.imgClose);
        btnVerify = dialogaadherexit.findViewById(R.id.btn_verify);
        TextView message = dialogaadherexit.findViewById(R.id.message);
        EditText edtTxt = dialogaadherexit.findViewById(R.id.edtMobileNo);
        CheckBox checkBox = dialogaadherexit.findViewById(R.id.chkAbhaNo);
        progressBar = dialogaadherexit.findViewById(R.id.progressBar);
        dialogaadherexit.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogaadherexit.setCancelable(false);
        dialogaadherexit.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogaadherexit.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(450, abhaContext);
        dialogaadherexit.getWindow().setAttributes(lp);
        message.setText("ABHA Already exist");
        btnVerify.setVisibility(VISIBLE);
        btnVerify.setText("Get Profile");
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogaadherexit.dismiss();
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogaadherexit.dismiss();
                if (listenerAddNewPatient != null) {
                    listenerAddNewPatient.onAbhaQR(getAAyushNumber);
                }

            }
        });


    }

    private static void addNewPatient(OPHubRequests.AddNewPatientRequest request) {
        if (isFromAdd) {
            Call<List<DataResponse>> call = services.addPatient(request);
            call.enqueue(new Callback<List<DataResponse>>() {

                @Override
                public void onResponse(Call<List<DataResponse>> call, Response<List<DataResponse>> response) {
                    Log.i("myLog", "addNewPatient response:");
                    Log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                    responseAddNewPatient = response;
                }

                @Override
                public void onFailure(Call<List<DataResponse>> call, Throwable t) {
                    Log.i("myLog", "addNewPatient response failure:" + t.toString());
                    Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
                    call.clone().enqueue(this);

                }
            });
        }
    }

    public static int calculateAge(String dobString) {
        // Define the date format in which the DOB is provided
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Parse the String to LocalDate
        LocalDate dob = LocalDate.parse(dobString, formatter);

        // Get the current date
        LocalDate currentDate = LocalDate.now();

        // Calculate the difference between the current date and DOB
        return Period.between(dob, currentDate).getYears();
    }


    //TODO Aadhar creation same or different number check
    private static void verifyAadhaarOTP(String txnId, String otp, String mobile) {
        OPHubRequests.VerifyAadhaarOTPRequest request = new OPHubRequests.VerifyAadhaarOTPRequest();
        request.setMobile(mobile);
        request.setOtpValue(otp);
        request.setTxnId(txnId);
        Log.i("mylog", "verifyAadhaarOTP request:" + new Gson().toJson(request));
        Call<VerifyAadhaarOTPResp> call = abhaServices.verifyAadhaarOTP(request);
        call.enqueue(new Callback<VerifyAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<VerifyAadhaarOTPResp> call, Response<VerifyAadhaarOTPResp> response) {

                Log.i("mylog", "verifyAadhaarOTP response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(GONE);
                pinView.setEnabled(true);
                edtMobile.setEnabled(true);
                if (response.body() != null) {
                    //  pinView.setLineColor(Color.GREEN);


                    VerifyAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    System.out.println("otp verify" + message);
                    Boolean otpneed = resp.getIsOtpVerficationNeeded();
                    Boolean newUser = resp.getKycVerifiedData().getIsNew();


//                    if (resp.getMessage().equalsIgnoreCase("SUCCESS")) {
//                        Toast.makeText(abhaContext, "OTP Verified Successfully!", Toast.LENGTH_SHORT).show();
//                    } else {
//                        Toast.makeText(abhaContext, "Invalid OTP. Please try again.", Toast.LENGTH_SHORT).show();
//                    }
                    VerifyAadhaarOTPResp.KycVerifiedData.Tokens tokens = resp.getKycVerifiedData().getTokens();
                    if (message != null) {
//                            Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        if (dialogVerifyOTP.isShowing())
                            dialogVerifyOTP.dismiss();
                        token = tokens.getToken();
//                            getAbhaProfile(token);
                        String txnId = resp.getKycVerifiedData().getTxnId();
                        boolean isNew = resp.getKycVerifiedData().getIsNew();
//                        if (isNew)
//                            showCommInfoDialog(txnId, isNew, resp);
//                        else {
                        abhaNumber = resp.getKycVerifiedData().getABHAProfile().getABHANumber();
                        updateFirstName = resp.getKycVerifiedData().getABHAProfile().getFirstName();
                        updateMiddleName = resp.getKycVerifiedData().getABHAProfile().getMiddleName();
                        updateLastName = resp.getKycVerifiedData().getABHAProfile().getLastName();
                        updateAddress = resp.getKycVerifiedData().getABHAProfile().getAddress();
                        updateGender = resp.getKycVerifiedData().getABHAProfile().getGender();
                        updateMobile = resp.getKycVerifiedData().getABHAProfile().getMobile();
                        updateState = resp.getKycVerifiedData().getABHAProfile().getStateName();
                        updateDistric = resp.getKycVerifiedData().getABHAProfile().getDistrictName();
                        updatePincode = resp.getKycVerifiedData().getABHAProfile().getPinCode();
                        updatePhoto = resp.getKycVerifiedData().getABHAProfile().getPhoto();
                        updateImage = resp.getKycVerifiedData().getImageKey();
                        String inputDate = resp.getKycVerifiedData().getABHAProfile().getDob();

                        // Define the input and output formats
                        SimpleDateFormat inputFormat = new SimpleDateFormat("dd-MM-yyyy", Locale.getDefault());
                        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());

                        try {
                            // Parse the input date string to Date object
                            Date date = inputFormat.parse(inputDate);

                            // Convert to the desired format
                            String formattedDate = outputFormat.format(date);

                            updateDOB = formattedDate;

                            // Print the output
                            System.out.println("Formatted Date: " + formattedDate); // Output: 1998-12-24
                        } catch (ParseException e) {

                        }

                        VerifyAadhaarOTPResp.KycVerifiedData.ABHAProfile abhaProfile = resp.getKycVerifiedData().getABHAProfile();
                        if (abhaProfile != null) {
                            String email = abhaProfile.getEmail();
//                                if (email == null || email.isEmpty() || email.equalsIgnoreCase("null"))
//                                    showCommInfoDialog(txnId, isNew, resp);
//                                else
//                            if (otpneed) {
//                                if (dialogVerifyOTP.isShowing())
//                                    dialogVerifyOTP.dismiss();
//                                clickCount = 0;
//                                showVerifyNewNumberOTPDialog(resp.getKycVerifiedData().getTxnId(), resp, mobile);
//                            } else {
//                                selectAbhaAddrDialogNew("", txnId, null, resp);
//                            }

                            checkExistingPatient();
                            if (otpneed) {
                                clickCount = 0;
                                String SecondNumberMessage = "Your primary mobile number is not matching with the AADHAAR- linked mobile. So OTP is sent on your entered Communication mobile number";
                                showVerifyNewNumberOTPDialog(txnId, resp, mobile,newUser,SecondNumberMessage);
                            } else {
                                if (newUser) {
                                    showProfileDetails("", txnId, new AbhaProfileInfoResponse[]{new AbhaProfileInfoResponse()});
                                } else {
                                    selectAbhaAddrDialogNew("", txnId, null, resp, null);
                                }
                            }
                                //TODO First check to ABHA Number our system Add or Not
//                                checkAddressNumberAADHAARcreation(txnId, resp, mobile,otpneed,newUser);
                        }
                    }
//                        }
                }else if (response.code() == 400) {
                    try {
                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        pinView.setLineColor(Color.RED);
                        txtInvalidOTP.setText(errorMessage);
                        txtInvalidOTP.setVisibility(VISIBLE);
                        if(errorMessage.equalsIgnoreCase("You have requested multiple OTPs Or Exceeded maximum number of attempts for OTP match in this transaction. Please try again in 30 minutes.")){
                            btnVerify.setVisibility(GONE);
                        }else {
                            btnVerify.setVisibility(VISIBLE);
                        }
//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();
                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                } else {
                    pinView.setLineColor(Color.RED);
                    txtInvalidOTP.setVisibility(VISIBLE);
                    btnVerify.setVisibility(VISIBLE);
                    txtInvalidOTP.setText("Please enter a valid OTP");
                    //   Toast.makeText(abhaContext, "Please enter a valid OTP", Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailure(Call<VerifyAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(VISIBLE);
            }
        });

    }

    private static void addonboradpatient(String abhaNumber, String name, String updateAddress, String updateGender, String mobile,String dob) {

        Log.i("mylog", "addNewPatient");
        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
        request.setPatientName(name);
        request.setDob(updateDOB);
        request.setGender(updateGender);
        request.setMobile(mobile);
        request.setAddress(updateAddress);
        request.setAbhaNo(abhaNumber);
        request.setHospId(hositalID);
        Log.i("mylog", "addNewOnboradPatient request:" + new Gson().toJson(request));
        Call<List<DataResponse>> call = services.addPatient(request);
        call.enqueue(new Callback<List<DataResponse>>() {

            @Override
            public void onResponse(Call<List<DataResponse>> call, Response<List<DataResponse>> response) {
                Log.i("myLog", "addNewOnboradPatient response:");
                Log.i("mylog", "addNewOnboradPatient response:" + new Gson().toJson(response.body()));

                try {
                    if (response.body() != null) {
                        if (response.body().get(0).getStatus().equalsIgnoreCase("failed")){
    //                        OPHubUtils.showErrorDialog(abhaContext, "unable to add patient profile same dob and mobile number");
                            if (response.body().get(0).getExistingPatientDetails() != null) {
                                getAAyushNumber = response.body().get(0).getExistingPatientDetails().getAayushUniqueId();
                                if (abhaNumber != null && !abhaNumber.isEmpty()){
                                    updateAbhaNumber(true);
                                } else {
                                    alreadyLinked();
                                }
    //                            alreadyLinked();
    //                            System.out.println("ayus:::" + ayus);
    //                            if (listener != null) {
    //                                listener.onAbhaQR(ayus);
    //                            }
                            }
                            return;
                        }

                        Log.i("myLog", "addNewOnboradPatient response isSuccess:" + response.body().toString());
                        List<DataResponse> list = response.body();
                        if (list != null && list.size() > 0) {
                            DataResponse res = list.get(0);
                            String status = res.getStatus();
                            String message = res.getMessage();
                            String errormsg = res.getErrorMessage();

                            DataResponse.Details details = res.getDetails();
                            if (details != null) {
                                userAayushId = details.getAayushUniqueId();
                                responseAddNewPatient = response;
                                System.out.println("aasuss"+userAayushId);
                                callPatchAPI(name, details.getPatientId(),mobile);


                            }
                        }

                    }else {
                        OPHubUtils.showErrorDialog(abhaContext, "failed to add patient profile");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }

            }

            public void onFailure(Call<List<DataResponse>> call, Throwable t) {
                Log.i("myLog", "addNewOnboradPatient response failure:" + t.toString());
                Log.i("myLog", "addNewOnboradPatient response failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //  call.clone().enqueue(this);
            }
        });
    }

    private static void callPatchAPI(String name, Integer patientId, String mobile){
        UpdatePatientRequest request = new UpdatePatientRequest();
        request.setFirstName(name);
        request.setDob(updateDOB);
        request.setGender(updateGender);
        request.setMobile(mobile);
        request.setAddress(updateAddress);
        request.setABHANumber(abhaNumber);
        if(!updateImage.isEmpty())
        request.setImage(updateImage);
        Log.i("mylog", "updatePatient response:" + new Gson().toJson(request));
        Call<List<UpdatePatientResponse>> call = services.updatePatientAbha(patientId, hositalID, request);
        call.enqueue(new Callback<List<UpdatePatientResponse>>() {

            @Override
            public void onResponse(Call<List<UpdatePatientResponse>> call, Response<List<UpdatePatientResponse>> response) {
                Log.i("mylog", "updatePatient response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    getAayushUnique(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);
                } else {

                }
            }

            @Override
            public void onFailure(Call<List<UpdatePatientResponse>> call, Throwable t) {

            }
        });
    }


//    private static void checkAddressNumberAADHAARcreation(String txnId, VerifyAadhaarOTPResp aadhaarResp, String mobile, Boolean otpneed, Boolean newUser) {
//        OPHubResponse.VerifyRequest request = new OPHubResponse.VerifyRequest();
//        request.setAbhaNumber(abhaNumber);
//        request.setHospitalId(hositalID.toString());
//        Log.i("mylog", "verifyAbhaAddr request:" + new Gson().toJson(request));
//        Call<OPHubResponse.VerifyAbhaAddress> call = services.CheckAddressNumber(request);
//        call.enqueue(new Callback<OPHubResponse.VerifyAbhaAddress>() {
//            @Override
//            public void onResponse(Call<OPHubResponse.VerifyAbhaAddress> call, Response<OPHubResponse.VerifyAbhaAddress> response) {
//                Log.i("mylog", "CheckNumberAddresss response:");
//                if (response.body() != null) {
//                    Log.i("mylog", "CheckNumberAddresss response:" + new Gson().toJson(response.body()));
//                    if (response.body().getStatus().equalsIgnoreCase("failed") || response.body().getStatus() == null) {
//                        if (response.body().getPatientDetails().get(0).getAayushUniqueId() != null) {
//                            getAAyushNumber = response.body().getPatientDetails().get(0).getAayushUniqueId();
//                            alreadyLinked();
//                            System.out.println("ayus:::" + ayus);
//                            if (listener != null) {
//                                listener.onAbhaQR(ayus);
//                            }
//                        }
//                    } else {
//                        if (otpneed) {
//                            clickCount = 0;
//                            showVerifyNewNumberOTPDialog(txnId, aadhaarResp, mobile,newUser);
//                        } else {
//                            if (newUser) {
//                                showProfileDetails("", txnId, new AbhaProfileInfoResponse[]{new AbhaProfileInfoResponse()});
//                            } else {
//                                selectAbhaAddrDialogNew("", txnId, null, aadhaarResp, null);
//                            }
//                        }
//                    }
//                }
//            }
//
//            @Override
//            public void onFailure(Call<OPHubResponse.VerifyAbhaAddress> call, Throwable t) {
//                Log.i("myLog", "CheckAddressNumber response failure:" + t.toString());
//
//            }
//        });
//
//    }


    //TODO Aadar creation second number OTP
    public static void showVerifyNewNumberOTPDialog(String txnId, VerifyAadhaarOTPResp aadhaarResp, String mobile, Boolean NewUser, String message) {
        Log.i("myLog", "showVerifyNewNumberOTPDialog otpSystem:");
        isEditMobileClicked = false;
        dialogVerifyOTP = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.fragment_abha_verify_otp, null);
        dialogVerifyOTP.setContentView(view);
        ImageView imgClose = dialogVerifyOTP.findViewById(R.id.imgClose);
        btnVerify = dialogVerifyOTP.findViewById(R.id.btn_verify);
        progressBar = dialogVerifyOTP.findViewById(R.id.progressBar);
        TextView txtMsg = dialogVerifyOTP.findViewById(R.id.txtMessage);
        TextView mobilenumbers = dialogVerifyOTP.findViewById(R.id.mobilenumber);
        pinView = dialogVerifyOTP.findViewById(R.id.pinview);
        TextView txtEdit = dialogVerifyOTP.findViewById(R.id.txtEdit);
        LinearLayout linearMob = dialogVerifyOTP.findViewById(R.id.linearMob);
        LinearLayout linearResend = dialogVerifyOTP.findViewById(R.id.linearResend);
        LinearLayout linearSecs = dialogVerifyOTP.findViewById(R.id.linearResendSec);
        TextView txtSec = dialogVerifyOTP.findViewById(R.id.txtSecs);
        txtInvalidOTP = dialogVerifyOTP.findViewById(R.id.txtInvaidotp);
        txtmaxlimitotp = dialogVerifyOTP.findViewById(R.id.txtmaxlimitotp);
        resendOtpCount = dialogVerifyOTP.findViewById(R.id.resend_otp_count);
        txtMsg.setText(message);
        dialogVerifyOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogVerifyOTP.setCancelable(false);
        dialogVerifyOTP.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogVerifyOTP.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(450);
        dialogVerifyOTP.getWindow().setAttributes(lp);
        btnVerify.setEnabled(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);
       /* linearResend.setVisibility(View.GONE);
        linearSecs.setVisibility(View.GONE);*/
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                long res = millisUntilFinished / 1000;
                if (res != 0)
                    txtSec.setText(res + "s");
            }

            public void onFinish() {
                linearResend.setVisibility(VISIBLE);
                resendOtpCount.setText(" "+clickCount + "/2");
                linearSecs.setVisibility(GONE);
            }
        }.start();

        String mobileNumber = mobile;
        String maskedNumber = maskMobileNumber(mobileNumber);
        mobilenumbers.setText(maskedNumber);
        System.out.println(maskedNumber);

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("print dismiss dialogss");
                dialogVerifyOTP.dismiss();
            }
        });
        linearResend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clickCount++;
                System.out.println("print count " + clickCount);
                if (clickCount == 1 || clickCount == 2) {
                    resendOtpCount.setText(" " + clickCount + "/2");
                    btnVerify.setVisibility(GONE);
                    progressBar.setVisibility(VISIBLE);
                    resendotpsuccess.setVisibility(VISIBLE);
                    generateChangePhoneOTP(mobile,txnId,aadhaarResp,NewUser,message);
                } else if (clickCount >= 3) {
                    linearResend.setVisibility(GONE);
                    enable_otp.setVisibility(GONE);
                    txtmaxlimitotp.setVisibility(VISIBLE);
                    resendotpsuccess.setVisibility(GONE);
                }


            }
        });
        pinView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                //  invalidNumber.setVisibility(View.GONE);
                // pinView.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text));

                if (s.toString().trim().length() == 6) {
                    btnVerify.setEnabled(true);
                    btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                }
                pinView.setLineColor(Color.BLACK);
                txtInvalidOTP.setVisibility(GONE);

            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "btnVerify onclick selAbhaOption:" + selAbhaOption);

                String otp = pinView.getText().toString();
                if (otp.isEmpty() || otp.length() != 6) {
                    pinView.setLineColor(Color.RED);
                    txtInvalidOTP.setVisibility(VISIBLE);
                    txtInvalidOTP.setText("Please enter a valid OTP");
                    // Toast.makeText(abhaContext, "Please enter a valid OTP", Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    //  pinView.setLineColor(Color.GREEN);
                    txtInvalidOTP.setVisibility(GONE);
                    btnVerify.setVisibility(GONE);
                    progressBar.setVisibility(VISIBLE);
                    pinView.setEnabled(false);
                    verifySecondOTP(otp, txnId, aadhaarResp,NewUser);
                }

              /*  if (otp.isEmpty()) {
                    Toast.makeText(abhaContext, "Please Enter OTP", Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    verifySecondOTP(otp, txnId, aadhaarResp);
//
                }*/
            }
        });
    }

    public static String maskMobileNumber(String mobileNumber) {
        if (mobileNumber.length() >= 10) {
            return "xxxxxx" + mobileNumber.substring(mobileNumber.length() - 4);
        } else {
            return mobileNumber; // Return as is if it's not a valid length
        }
    }


    public static void verifySecondOTP(String otp, String txnId, VerifyAadhaarOTPResp aadhaarRes, Boolean newUser) {

        OPHubRequests.VerifyOtpRequest request = new OPHubRequests.VerifyOtpRequest();
        request.setOtp(otp);
        request.setTxnId(txnId);

        Log.i("mylog", "generateSecondAadhaarOTP request:" + request);

        Call<VerifySecondOTPResp> call = abhaServices.verifySecondOTP(request);
        call.enqueue(new Callback<VerifySecondOTPResp>() {

            @Override
            public void onResponse(Call<VerifySecondOTPResp> call, Response<VerifySecondOTPResp> response) {

                Log.i("mylog", "generateSecondAadhaarOTP response:" + new Gson().toJson(response.body()));
                pinView.setEnabled(true);
                if (response.body() != null) {
                    //    pinView.setLineColor(Color.GREEN);

                    String message = response.body().getMessage();
                    if (response.body().getAuthResult().matches("success")) {
                        dialogVerifyOTP.dismiss();
                        showSecondNumberlinkSuccessDialog(txnId, aadhaarRes,newUser);
                    }else if (response.code() == 400) {
                        try {

                            String errorBody = response.errorBody().string();
                            JSONObject jsonObject = new JSONObject(errorBody);
                            String errorMessage = jsonObject.getString("message");

                            txtInvalidOTP.setText(errorMessage);
                            pinView.setLineColor(Color.RED);
                            txtInvalidOTP.setVisibility(VISIBLE);
                            btnVerify.setVisibility(VISIBLE);
                            progressBar.setVisibility(GONE);

                        } catch (Exception e) {
                            e.printStackTrace();
//
                        }
                    } else {
                        txtInvalidOTP.setText(message);
                        pinView.setLineColor(Color.RED);
                        txtInvalidOTP.setVisibility(VISIBLE);
                        btnVerify.setVisibility(VISIBLE);
                        progressBar.setVisibility(GONE);
                    }

                } else {
//                    Toast.makeText(abhaContext, "Please enter valid Aadhaar number", Toast.LENGTH_SHORT).show();
                    pinView.setLineColor(Color.RED);
                    txtInvalidOTP.setVisibility(VISIBLE);
                    btnVerify.setVisibility(VISIBLE);
                    progressBar.setVisibility(GONE);
                }

            }

            @Override
            public void onFailure(Call<VerifySecondOTPResp> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });


    }
    public static void showSecondNumberlinkSuccessDialog(String txnId, VerifyAadhaarOTPResp aadhaarRes, Boolean newUser) {
        Log.i("myLog", "showSuccessDialog");
        dialogSuccess = new Dialog(abhaContext);

        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_success, null);
        TextView txtSuccess = view.findViewById(R.id.txtSuccess);
        dialogSuccess.setContentView(view);
        dialogSuccess.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSuccess.show();
        dialogSuccess.setCancelable(false);
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSuccess.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(500, abhaContext);
        dialogSuccess.getWindow().setAttributes(lp);
        txtSuccess.setText("Mobile number is now successfully linked to your Account");
        Button btnContinue = dialogSuccess.findViewById(R.id.btn_continue);
        btnContinue.setVisibility(VISIBLE);

        btnContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSuccess.dismiss();
                if(newUser){
                    showProfileDetails("", txnId, new AbhaProfileInfoResponse[]{new AbhaProfileInfoResponse()});
                }else {
                    selectAbhaAddrDialogNew("", txnId, null, aadhaarRes, null);
                }
            }
        });

    }

    public static void selectAbhaAddrLinkDialogNew(Context context, Fragment parentFragment, List<AbhaLinkResponse> res) {

        fragment = parentFragment;
        abhaContext = context;
        services = RetrofitInstance.createService(RestServices.class);
        abhaServices = RetrofitInstance.createAbhaService(RestServices.class);
        dialogSelectAbhaAddrlink = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_select_abha_addr_link, null);
        dialogSelectAbhaAddrlink.setContentView(view);
        dialogSelectAbhaAddrlink.setCanceledOnTouchOutside(false);
        ImageView imgClose = dialogSelectAbhaAddrlink.findViewById(R.id.imgClose);
        RecyclerView recyclerView = dialogSelectAbhaAddrlink.findViewById(R.id.abh_recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(abhaContext));
        dialogSelectAbhaAddrlink.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSelectAbhaAddrlink.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSelectAbhaAddrlink.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(600);
        dialogSelectAbhaAddrlink.getWindow().setAttributes(lp);
        AddPatientLinkAdapter adapter = new AddPatientLinkAdapter();
        List<AbhaLinkResponse.Detail> detail = null;


        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSelectAbhaAddrlink.dismiss();
                if (listener != null) {
                    listener.onDialogClose();
                }

            }
        });


        adapter.ItemAdapter(res);
        recyclerView.setAdapter(adapter);

        adapter.setOnClickListener(new AddPatientLinkAdapter.OnClickListener() {
            @Override
            public void onTitleClick(int position, AbhaLinkResponse.Detail item, AbhaLinkResponse items) {
                System.out.println("print call place " + item.getId());
                userAayushId = item.getAayushUniqueId();
                abhaAddress = items.getVerifiedAbhaAddress();
                abhaNumber = item.getABHANumber();
                System.out.println("print call place: " + item.getAayushUniqueId());
                System.out.println("print call place:: " + items.getVerifiedAbhaAddress());
                System.out.println("print call place:: " + item.getMobileno());
                System.out.println("print call number:: " + item.getABHANumber());

                AbhaQRlink = true;
                selAbhaOption = "MOBILE_NO";
                generateMobileNoOTP(item.getMobileno());


            }
        });

    }

    private static void getAayushUniqueId() {
        Integer hospitalID = OPHubApplication.getHospitalId();
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", userAayushId);
        requestData.put("hospital_id", String.valueOf(hospitalID));
        requestData.put("abhaAddress", abhaAddress);

        Log.i("mylog", "aayusUnique response:" + new Gson().toJson(requestData));

        Call<GetPatientProfileResponse.AaysuhUnqicResponse> call = services.getAayushId(requestData);
        call.enqueue(new Callback<GetPatientProfileResponse.AaysuhUnqicResponse>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse.AaysuhUnqicResponse> call, Response<GetPatientProfileResponse.AaysuhUnqicResponse> response) {

                Log.i("mylog", "aayusUnique response:" + new Gson().toJson(response.body()));
                try {
                    if (response.body() != null) {
                        if (response.body().getStatus().equalsIgnoreCase("failed") || response.body().getStatus() == null) {
                            OPHubUtils.showErrorDialog(abhaContext, "Abha address already mapped to another patient");
                        } else {
                            showSuccessDialog(abhaContext.getString(R.string.abha_no_linked), "ABHA_VERIFY", false, false);
                        }
                        dialogSelectAbhaAddrlink.dismiss();
                        if (listenerAddNewPatient != null) {
                            listenerAddNewPatient.onAbhaQR(userAayushId);
                        }

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse.AaysuhUnqicResponse> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
            }
        });

    }


    public static void showCommInfoDialog(String txnId, boolean isNew, VerifyAadhaarOTPResp response) {
        Log.i("myLog", "showCommInfoDialog");
        dialogCommInfo = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_comm_info, null);
        dialogCommInfo.setContentView(view);
        ImageView imgClose = dialogCommInfo.findViewById(R.id.imgClose);
        Button btnVerify = dialogCommInfo.findViewById(R.id.btn_verify);
        Button btnSkip = dialogCommInfo.findViewById(R.id.btn_skip);
        EditText edtEmail = dialogCommInfo.findViewById(R.id.edtEmail);
        dialogCommInfo.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogCommInfo.setCancelable(false);
        dialogCommInfo.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogCommInfo.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(450);
        dialogCommInfo.getWindow().setAttributes(lp);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogCommInfo.dismiss();
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = edtEmail.getText().toString();
                if (!email.isEmpty()) {
                    if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
//                        Toast.makeText(abhaContext, "Enter valid email address !", Toast.LENGTH_SHORT).show();
                        return;
                    }
                }
                generateEmailOTP(email, txnId, isNew);

            }
        });
        btnSkip.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogCommInfo.dismiss();
                if (isNew)
                    createAbhaAddrDialog("", txnId);
                else
                    selectAbhaAddrDialogNew("", txnId, null, response, null);
                ;

            }
        });
    }

    public static void selectMobileNumberList(String mobile, String txnId, List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> resp) {
        Log.i("myLog", "selectAbhaAddrDialogNew");
        dialogMobileNumberList = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_select_mobilenumber_list, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogMobileNumberList.setContentView(view);
        ImageView imgClose = dialogMobileNumberList.findViewById(R.id.imgClose);
        btnCreateAbhaAddr = dialogMobileNumberList.findViewById(R.id.btn_create_abha_addr);
        recyclerView = dialogMobileNumberList.findViewById(R.id.recyclerView);
        progressBar = dialogMobileNumberList.findViewById(R.id.progressBar);
        recycle_progress = dialogMobileNumberList.findViewById(R.id.recycle_progress);
        recyclerView.setLayoutManager(new LinearLayoutManager(abhaContext));
        dialogMobileNumberList.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogMobileNumberList.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogMobileNumberList.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(600);
        dialogMobileNumberList.getWindow().setAttributes(lp);
        MobileNumberSelectionList adapter = new MobileNumberSelectionList();
        btnCreateAbhaAddr.setVisibility(GONE);
        List<VerifyMobileOTPResponse.Users> users = null;

        adapter.ItemAdapter(resp);
        recyclerView.setAdapter(adapter);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogMobileNumberList.dismiss();
            }
        });
        btnCreateAbhaAddr.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressBar.setVisibility(View.VISIBLE);
                btnCreateAbhaAddr.setVisibility(View.GONE);
                generateMobileNoVerifyOTP(mobile,txnId);

            }
        });

        adapter.setOnClickListener(new MobileNumberSelectionList.OnClickListener() {

            @Override
            public void onClick(int position,List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> resp) {
                String abha = resp.get(position).getABHANumber().replaceAll("[^\\d]", "");
                if (abha.length() >= 4) {
                    filterAbhaNumber = abha.substring(abha.length() - 4);
                }

                recyclerView.setVisibility(GONE);
                recycle_progress.setVisibility(VISIBLE);
                generateMobileNoVerifyOTP(mobile, txnId);
            }
        });

    }


    private static void generateMobileNoVerifyOTP(String mobile, String txnId) {
        OPHubRequests.GetMobileOTPRequest request = new OPHubRequests.GetMobileOTPRequest();
        request.setMobileno(mobile);
        request.setTxnId(txnId);
        Log.i("mylog", "generateMobileNoOTP request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.getMobileNoVerifyOTP(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "generateMobileNoOTP response:" + new Gson().toJson(response.body()));
                recyclerView.setVisibility(VISIBLE);
                recycle_progress.setVisibility(GONE);
                progressBar.setVisibility(View.GONE);
                if (response.body() != null) {
                    dialogMobileNumberList.dismiss();
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        showVerifyOTPDialog("MOBILE_OTP", txnId, message, "", "", mobile, false, "");
                    }
                } else if (response.code() == 400) {
                    btnCreateAbhaAddr.setVisibility(View.VISIBLE);
                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");

//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                } else {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                    btnCreateAbhaAddr.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateMobileNoOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    //TODO AAdar creation create New
    public static void selectAbhaAddrDialogNew(String mobile, String txnId, VerifyMobileOTPResponse resp, VerifyAadhaarOTPResp aadhaarResp, VerifyNewMobileOTPResponse mobileResp) {
        Log.i("myLog", "selectAbhaAddrDialogNew");
        dialogSelectAbhaAddr = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_select_abha_addr_new, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogSelectAbhaAddr.setContentView(view);
        ImageView imgClose = dialogSelectAbhaAddr.findViewById(R.id.imgClose);
        TextView txtHeading = dialogSelectAbhaAddr.findViewById(R.id.txt_heading);
        Button btnCreateAbhaAddr = dialogSelectAbhaAddr.findViewById(R.id.btn_create_abha_addr);
        RecyclerView recyclerView = dialogSelectAbhaAddr.findViewById(R.id.recyclerView);
        if (selectedAdhaarType.equalsIgnoreCase("creation"))
            btnCreateAbhaAddr.setVisibility(View.VISIBLE);
        recyclerView.setLayoutManager(new LinearLayoutManager(abhaContext));
        dialogSelectAbhaAddr.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSelectAbhaAddr.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSelectAbhaAddr.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(600);
        dialogSelectAbhaAddr.getWindow().setAttributes(lp);
        dialogSelectAbhaAddr.setCancelable(false);
        AbhaAddrselectionAdapter adapter = new AbhaAddrselectionAdapter();
        List<VerifyMobileOTPResponse.Users> users = null;
        if (resp != null) {
            users = resp.getUsers();
        }
        VerifyAadhaarOTPResp.KycVerifiedData.ABHAProfile profileUser = null;
        if (aadhaarResp != null) {
            profileUser = aadhaarResp.getKycVerifiedData().getABHAProfile();
            int size = aadhaarResp.getKycVerifiedData().getABHAProfile().getPhrAddress().size();
            if (size < 6){
                btnCreateAbhaAddr.setVisibility(View.VISIBLE);
            }
            else {
                txtHeading.setText("Select existing ABHA address to continue");
                btnCreateAbhaAddr.setVisibility(View.GONE);
            }
        }
        List<VerifyNewMobileOTPResponse.Account> mobileUsers = null;
        if (mobileResp != null){
            btnCreateAbhaAddr.setVisibility(GONE);
            mobileUsers = mobileResp.getAccounts();
        }
        adapter.ItemAdapter(users, profileUser,mobileUsers);
        recyclerView.setAdapter(adapter);
        adapter.setOnClickListener(new AbhaAddrselectionAdapter.OnClickListener() {
            @Override
            public void onClick(int position, VerifyMobileOTPResponse.Users item, VerifyAadhaarOTPResp.KycVerifiedData.ABHAProfile abhaProfile, VerifyNewMobileOTPResponse.Account mobileUser) {
                String txnId = "", abhaAddressInput = "";
                if (resp != null) {
                    token = resp.getTokens().getToken();
                    System.out.println("Prints Token" + token);
                    txnId = resp.getTxnId();
                    abhaAddressInput = item.getAbhaAddress();
                    getProfile(abhaAddressInput, token, txnId, item.getAbhaNumber());
                    if (item.getAbhaNumber() != null) {
                        if (!item.getAbhaNumber().isEmpty()) {
                            abhaNumber = item.getAbhaNumber();
                        }
                    }
                    if (item.getAbhaAddress() != null) {
                        if (!item.getAbhaAddress().isEmpty()) {
                            abhaAddress = item.getAbhaAddress();
                        }
                    }
                }
                if (aadhaarResp != null) {
                    token = aadhaarResp.getKycVerifiedData().getTokens().getToken();
                    txnId = aadhaarResp.getKycVerifiedData().getTxnId();
                    if (!aadhaarResp.getKycVerifiedData().getABHAProfile().getPhrAddress().get(position).isEmpty()) {
                        abhaAddress = aadhaarResp.getKycVerifiedData().getABHAProfile().getPhrAddress().get(position);
                    }
                    if (!aadhaarResp.getKycVerifiedData().getABHAProfile().getABHANumber().isEmpty()) {
                        abhaNumber = aadhaarResp.getKycVerifiedData().getABHAProfile().getABHANumber();
                    }
                    checkAddressNumberAdapter();
//                    checkExistingPatient();
//                    demographic();
//                    addonboradpatient(abhaNumber,name,updateAddress,updateGender,mobile,updateDOB);

                    // getAayushUnique(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);
//                    showSuccessDialog(abhaContext.getString(R.string.abha_address_link_success),"ABHA_CARD",false, false);
                }

                if (mobileResp != null){
                    verifyNewMobileOTPToken(mobileResp.getToken(), mobileUser.getABHANumber(), mobileResp.getTxnId());
                }

                dialogSelectAbhaAddr.dismiss();
            }

         /*   @Override
            public void onClick(int position, VerifyMobileOTPResponse.Users item) {
                token = resp.getTokens().getToken();
                showSuccessDialog(getString(R.string.congratulations), "ABHA_CARD", false);
                dialogSelectAbhaAddr.dismiss();
            }*/
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSelectAbhaAddr.dismiss();
            }
        });
        btnCreateAbhaAddr.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSelectAbhaAddr.dismiss();
                if (resp != null && resp.getUsers() != null && !resp.getUsers().isEmpty()) {
                    for (VerifyMobileOTPResponse.Users item : resp.getUsers()) {
                        if (item != null && item.getAbhaNumber() != null && !item.getAbhaNumber().isEmpty()) {
                            abhaNumber = item.getAbhaNumber();
                            break;
                        }
                    }
                } else {
                    Log.e("Error", "Response or Users list is null");
                }

               /* if (!resp.getUsers().isEmpty()) {
                    for (VerifyMobileOTPResponse.Users item : resp.getUsers()) {
                        if (item.getAbhaNumber() != null) {
                            if (!item.getAbhaNumber().isEmpty()) {
                                abhaNumber = item.getAbhaNumber();
                                break;
                            }
                        }
                    }
                }*/
                showProfileDetails(mobile, txnId, new AbhaProfileInfoResponse[]{new AbhaProfileInfoResponse()});
            }
        });
    }

    private static void getProfile(String abhaAddress, String tokenReq, String txnId, String abhaNumber) {

        OPHubRequests.VerifyAbhaAddress request = new OPHubRequests.VerifyAbhaAddress();
        request.setAbhaAddress(abhaAddress);
        request.setTxnId(txnId);
        request.setToken(tokenReq);
        Log.i("mylog", "getProfile request:" + new Gson().toJson(request));
        Call<VerifyMobileOTPResponse.Tokens> call = abhaServices.verifyAbhaAddress(request);
        call.enqueue(new Callback<VerifyMobileOTPResponse.Tokens>() {

            @Override
            public void onResponse(Call<VerifyMobileOTPResponse.Tokens> call, Response<VerifyMobileOTPResponse.Tokens> response) {

                Log.i("mylog", "getProfile response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    token = response.body().getToken();
                    System.out.println("Print token" + token);
                    dialogSelectAbhaAddr.dismiss();
                }

            }

            @Override
            public void onFailure(Call<VerifyMobileOTPResponse.Tokens> call, Throwable t) {
                Log.i("myLog", "getProfile response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });


    }

    private static void getPhrProfile(String token, String abhaNumber) {
        OPHubRequests.UserNameVerifyCardToken request = new OPHubRequests.UserNameVerifyCardToken();
        request.setToken(token);
        Log.i("mylog", "getPhrProfile request:" + new Gson().toJson(request));
        Call<PhrProfileResponse> call = abhaServices.getPhrProfile(request);
        call.enqueue(new Callback<PhrProfileResponse>() {

            @Override
            public void onResponse(Call<PhrProfileResponse> call, Response<PhrProfileResponse> response) {

                Log.i("mylog", "getPhrProfile response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
                    if (abhaNumber != null) {
                        request.setAbhaNo(abhaNumber);
                    }
                    request.setAbhaAddress(response.body().getAbhaAddress());
                    request.setAddress(response.body().getAddress());
                    request.setDob(response.body().getYearOfBirth() + "-" +
                            response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth());
                    request.setPatientName(response.body().getFullName());
                    request.setDialCode("91");
                    request.setMobile(response.body().getMobile());
                    String gender = "";
                    if (response.body().getGender().equals("M")) {
                        gender = "Male";
                    } else if (response.body().getGender().equals("F")) {
                        gender = "Female";
                    } else {
                        gender = "Others";
                    }
                    request.setGender(gender);
                    request.setAge(calculateAge(response.body().getYearOfBirth() + "-" +
                            response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth()));
                    if (hositalID != null) {
                        request.setHospId(hositalID);
                        addNewPatient(request);
                    }
                    /* getAayushUnique();*/
                    //   getAayushUniqueId(abhaNumber,response.body().getHiuId());
                }
            }

            @Override
            public void onFailure(Call<PhrProfileResponse> call, Throwable t) {
                Log.i("myLog", "getPhrProfile response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }


/*    private static void getAayushUnique(){
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", userAayushId);
        requestData.put("hospital_id", String.valueOf(hositalID));
        requestData.put("abhaAddress", abhaAddress);

        Call<GetPatientProfileResponse.AaysuhResponse> call = services.getAayush(requestData);
        call.enqueue(new Callback<GetPatientProfileResponse.AaysuhResponse>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse.AaysuhResponse> call, Response<GetPatientProfileResponse.AaysuhResponse> response) {

                Log.i("mylog", "verifyAadhaarOTP response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {

                }
            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse.AaysuhResponse> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
            }
        });

    }*/


    private static void getAayushUnique(String msg, String option, Boolean isFromUserNameVerify, Boolean isFromMobileOtp) {
        Integer hospitalID = OPHubApplication.getHospitalId();
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", userAayushId);
        requestData.put("hospital_id", String.valueOf(hospitalID));
        requestData.put("abhaAddress", abhaAddress);
        System.out.println("aayush_unique_id" + userAayushId);
        System.out.println("abhaAddress" + abhaAddress);

        Call<GetPatientProfileResponse.AyusRespons> call = services.getAayush(requestData);
        call.enqueue(new Callback<GetPatientProfileResponse.AyusRespons>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse.AyusRespons> call, Response<GetPatientProfileResponse.AyusRespons> response) {

                Log.i("mylog", "abhaAddressss response:" + new Gson().toJson(response.body()));
                try {
                    if (response.body() != null) {

                        if (response.body().getStatus().equalsIgnoreCase("failed") || response.body().getStatus() == null) {
    //                        OPHubUtils.showErrorDialog(abhaContext, "Abha address already mapped to another patient");
                            getAAyushNumber =response.body().getPatientDetails().get(0).getAayushUniqueId();
                            System.out.println("ayus:::"+getAAyushNumber);
                            if (abhaNumber != null && !abhaNumber.isEmpty()){
                                updateAbhaNumber(true);
                            } else {
                                alreadyLinked();
                            }
    //                        alreadyLinked();
                        } else {
    //                        getPhrProfile(token,abhaNumber);
    //                        getAbhaProfile(token);
    //                        addonboradpatient(abhaNumber,updateFirstName,updateAddress,updateGender,updateMobile,updateDOB);
                            if (responseAddNewPatient != null) {
                                if (listenerAddNewPatient != null) {
                                    listenerAddNewPatient.onNewPatientOnboardAdded(responseAddNewPatient, userAayushId);
                                }
                            }
                            if (selAbhaOption.equalsIgnoreCase("AADHAAR_NO") ||(selAbhaOption.equalsIgnoreCase("AADHAAR_NO_VERIFY"))) {
                                if (showCard){
                                showAbhaCard(false, false);
                                }else {
                                    if (responseAddNewPatient != null) {
                                        if (listenerAddNewPatient != null) {
                                            listenerAddNewPatient.onNewPatientOnboardAdded(responseAddNewPatient, userAayushId);
                                        }
                                    }
                                }
                            }else {
                                showSuccessDialog(msg);
                            }
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse.AyusRespons> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
            }
        });

    }


    //TODO second abha address link flow
    private static void getAayushUnique1(String msg, String option, Boolean isFromUserNameVerify, Boolean isFromMobileOtp) {
        Integer hospitalID = OPHubApplication.getHospitalId();
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", userAayushId);
        requestData.put("hospital_id", String.valueOf(hospitalID));
        requestData.put("abhaAddress", abhaAddress);
        System.out.println("aayush_unique_id" + userAayushId);
        System.out.println("abhaAddress" + abhaAddress);

        Call<GetPatientProfileResponse.AyusRespons> call = services.getAayush(requestData);
        call.enqueue(new Callback<GetPatientProfileResponse.AyusRespons>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse.AyusRespons> call, Response<GetPatientProfileResponse.AyusRespons> response) {

                try {
                    Log.i("mylog", "abhaAddressss response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {

                        if (response.body().getStatus().equalsIgnoreCase("failed") || response.body().getStatus() == null) {
    //                        OPHubUtils.showErrorDialog(abhaContext, "Abha address already mapped to another patient");
                            getAAyushNumber =response.body().getPatientDetails().get(0).getAayushUniqueId();
                            System.out.println("ayus:::"+getAAyushNumber);
                            if (listenerAddNewPatient != null) {
                                System.out.println("print abha address2");
                                listenerAddNewPatient.onAbhaQR(userAayushId);
                            }
                        } else {
    //                        getPhrProfile(token,abhaNumber);
    //                        getAbhaProfile(token);
    //                        addonboradpatient(abhaNumber,updateFirstName,updateAddress,updateGender,updateMobile,updateDOB);
                            if (listenerAddNewPatient != null) {
                                System.out.println("print abha address2");
                                listenerAddNewPatient.onAbhaQR(userAayushId);
                            }
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse.AyusRespons> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
            }
        });

    }


    public static void showSuccessDialog(String msg) {
        Log.i("myLog", "showSuccessDialog");
        dialogSuccess = new Dialog(abhaContext);

        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_success, null);
        TextView txtSuccess = view.findViewById(R.id.txtSuccess);
        if (!msg.isEmpty())
            txtSuccess.setText(msg);
        dialogSuccess.setContentView(view);
        dialogSuccess.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSuccess.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSuccess.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(500, abhaContext);
        dialogSuccess.getWindow().setAttributes(lp);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    dialogSuccess.dismiss();
                } catch (Exception ex) {
                    Log.i("myLog", "exception ex:" + ex.toString());
                }
            }
        }, 1500);
    }

    private static void verifyEmailOTP(String txnId, String otp, boolean isNew) {
        OPHubRequests.VerifyOtpRequest request = new OPHubRequests.VerifyOtpRequest();
        request.setOtp(otp);
        request.setTxnId(txnId);
        Log.i("mylog", "verifyEmailOTP request:" + new Gson().toJson(request));
        Call<VerifyEmailOTPResp> call = abhaServices.verifyEmailOTP(request);
        call.enqueue(new Callback<VerifyEmailOTPResp>() {

            @Override
            public void onResponse(Call<VerifyEmailOTPResp> call, Response<VerifyEmailOTPResp> response) {

                Log.i("mylog", "verifyAadhaarOTP response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    VerifyEmailOTPResp resp = response.body();
                    String message = resp.getMessage();
                    String authResult = resp.getAuthResult();
                    if (authResult != null && authResult.equalsIgnoreCase("Success")) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        if (dialogVerifyOTP.isShowing())
                            dialogVerifyOTP.dismiss();
                        if (isNew)
                            createAbhaAddrDialog("", txnId);
                        else
                            selectAbhaAddrDialog(txnId);
                    }
                }
            }

            @Override
            public void onFailure(Call<VerifyEmailOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }

    public static void selectAbhaAddrDialog(String txnId) {
        Log.i("myLog", "selectAbhaAddrDialog");
        dialogSelectAbhaAddr = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_select_abha_addr, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogSelectAbhaAddr.setContentView(view);
        ImageView imgClose = dialogSelectAbhaAddr.findViewById(R.id.imgClose);
        LinearLayout card1 = dialogSelectAbhaAddr.findViewById(R.id.card_1);
        ImageView imgProf = dialogSelectAbhaAddr.findViewById(R.id.card_image);
        ImageView imgRight = dialogSelectAbhaAddr.findViewById(R.id.card_image_2);
        TextView userName = dialogSelectAbhaAddr.findViewById(R.id.card_title);
        TextView abhaUsername = dialogSelectAbhaAddr.findViewById(R.id.card_description);
        TextView genderTxt = dialogSelectAbhaAddr.findViewById(R.id.card_description_2);
        Button btnCreateAbhaAddr = dialogSelectAbhaAddr.findViewById(R.id.btn_create_abha_addr);
        dialogSelectAbhaAddr.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSelectAbhaAddr.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSelectAbhaAddr.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(600);
        dialogSelectAbhaAddr.getWindow().setAttributes(lp);
        final AbhaProfileInfoResponse[] profileDetails = {new AbhaProfileInfoResponse()};
        Log.i("mylog", "getProfileInfo ");
        Call<AbhaProfileInfoResponse> call = abhaServices.getAbhaProfileInfo("Bearer " + token);
        call.enqueue(new Callback<AbhaProfileInfoResponse>() {
            @Override
            public void onResponse(Call<AbhaProfileInfoResponse> call, Response<AbhaProfileInfoResponse> response) {
                Log.i("mylog", "getProfileInfo response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    profileDetails[0] = response.body();
                    AbhaProfileInfoResponse resp = response.body();
                    String name = resp.getName();
                    String gender = resp.getGender();
                    String address = resp.getAddress();
                    String pincode = resp.getPincode();
                    String dob = resp.getDayOfBirth() + "/" + resp.getMonthOfBirth() + "/" + resp.getDayOfBirth();
                    Log.i("myLog", "b4 image set");
                    userName.setText(name);
                    abhaUsername.setText(resp.getPreferredAbhaAddress());
                    genderTxt.setText(gender);
                    updateAddress = response.body().getAddress();
                    updateDOB = response.body().getYearOfBirth() + "-" +
                            response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth();
                    updateFirstName = response.body().getFirstName();
                    updateMiddleName = response.body().getMiddleName();
                    updateLastName = response.body().getLastName();
                    updateGender = response.body().getGender();
                    updateImage = response.body().getImageKey();
                    try {
                        String photoStr = resp.getProfilePhoto();
                        byte[] bytes = photoStr.getBytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        if (bytes != null) {
                            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                            if (decodedImageBytes != null) {
                                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                                if (bitmap != null) {
                                    imgProf.setImageBitmap(bitmap);
                                    Log.i("myLog", "after image set");
                                }
                            }
                        }
                    } catch (Exception e) {
                        //  throw new RuntimeException(e);
                        Log.i("myLog", " image set exception");
                    }
                    card1.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<AbhaProfileInfoResponse> call, Throwable t) {
                Log.i("myLog", "getProfileInfo response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

        imgRight.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showProfileDetails("", txnId, profileDetails);
                dialogSelectAbhaAddr.dismiss();
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSelectAbhaAddr.dismiss();
            }
        });
        btnCreateAbhaAddr.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSelectAbhaAddr.dismiss();
                // showSuccessDialog();
                showProfileDetails("", txnId, new AbhaProfileInfoResponse[]{new AbhaProfileInfoResponse()});
            }
        });
    }

    public static void showProfileDetails(String mobile, String txnId, AbhaProfileInfoResponse[] profileDetails) {
        Log.i("myLog", "showProfileDetails");
        dialogProfileDet = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_profile_det, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogProfileDet.setContentView(view);
        ImageView imgClose = dialogProfileDet.findViewById(R.id.imgClose);
        View imgCalendar = dialogProfileDet.findViewById(R.id.imgDob);
        Button btnVerify = dialogProfileDet.findViewById(R.id.btn_verify);
        ImageView imgProfile = dialogProfileDet.findViewById(R.id.imgProfile);
        EditText edtName = dialogProfileDet.findViewById(R.id.edtName);
        EditText edtPinCode = dialogProfileDet.findViewById(R.id.edtPincode);
        TextView profEdtDob = dialogProfileDet.findViewById(R.id.edtDob);
        CheckBox chkAgree = dialogProfileDet.findViewById(R.id.chk);
        spinGender = dialogProfileDet.findViewById(R.id.spinGender);
        View imgCamera = dialogProfileDet.findViewById(R.id.imgCamera);
        ImageView imgProf = dialogProfileDet.findViewById(R.id.imgProfile);
        getGender();
        dialogProfileDet.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        Spinner stateSpinner = dialogProfileDet.findViewById(R.id.spinState);
        spinDistrict = dialogProfileDet.findViewById(R.id.spinDistrict);
        getStates(stateSpinner);
        dialogProfileDet.show();
        profImage = imgProf;
        profDob = profEdtDob;
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogProfileDet.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(500);
        dialogProfileDet.getWindow().setAttributes(lp);

//        profEdtDob.addTextChangedListener(new AbhaDialogUtils().new DateMask());

        if (profileDetails != null && profileDetails[0] != null) {
            edtName.setText(profileDetails[0].getName());
            profEdtDob.setText(profileDetails[0].getDayOfBirth());
            edtPinCode.setText(profileDetails[0].getPincode());
            Log.i("myLog", "b4 image set");
//            try {
//                String photoStr = profileDetails[0].getProfilePhoto();
//                byte[] bytes = photoStr.getBytes();
//                Log.i("myLog", "byte  length:" + bytes.length);
//                if (bytes != null) {
//                    byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
//                    if (decodedImageBytes != null) {
//                        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
//                        if (bitmap != null) {
//                            imgProfile.setImageBitmap(bitmap);
//                            Log.i("myLog", "after image set");
//                        }
//                    }
//                }
//            } catch (Exception e) {
//                //  throw new RuntimeException(e);
//                Log.i("myLog", " image set exception");
//            }
            dialogProfileDet.dismiss();
            createAbhaAddrDialog(txnId, profileDetails[0].getName());

        } else {
            edtName.setText(userName);
            profEdtDob.setText(userDOB);

        }
        imgCalendar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setFromDateCalender("profDetails", "");
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogProfileDet.dismiss();
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String name = edtName.getText().toString();

                if (name.isEmpty()) {
                    edtName.setError("Please Enter Name");
                    return;
                }
                if (spinGender.getSelectedItem() == null) {
//                    Toast.makeText(abhaContext, "Please select gender", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (profEdtDob.getText().toString().isEmpty()) {
                    profEdtDob.setError("Please Enter Date of Birth");
                    return;
                }
                String pincode = edtPinCode.getText().toString();
                if (!isValidPincode(pincode)) {
                    edtPinCode.setError("Please enter valid pincode");
                    return;
                }
                if (!chkAgree.isChecked()) {
//                    Toast.makeText(abhaContext, "Please agree the terms", Toast.LENGTH_SHORT).show();
                    return;
                }


                abhaAddrCreateReq = new AbhaAddrCreationRequest();
                abhaAddrCreateReq.setFirstName(name);
                abhaAddrCreateReq.setLastName("");
                abhaAddrCreateReq.setTxnId(txnId);
                abhaAddrCreateReq.setMobile(mobile);
                Log.i("myLog", "b4 gender check:");
                if (spinGender.getSelectedItem() != null) {
                    String gender = spinGender.getSelectedItem().toString();
                    Log.i("myLog", "gender:" + gender);
                    String gen = String.valueOf(gender.charAt(0));
                    Log.i("myLog", "gender1111111:" + gen);
                    abhaAddrCreateReq.setGender(gen);
                }
                Log.i("myLog", "after gender check:");
                abhaAddrCreateReq.setDistrictName(selectedDistrict);
                abhaAddrCreateReq.setDistrictCode(selectedDistrictCode);
                abhaAddrCreateReq.setStateName(selectedState);
                abhaAddrCreateReq.setAddress(selectedDistrict + "," + selectedState);
                abhaAddrCreateReq.setStateCode(selectedStateCode);
                abhaAddrCreateReq.setPinCode(Integer.parseInt(edtPinCode.getText().toString()));
                abhaAddrCreateReq.setDayOfBirth(selectedDay);
                abhaAddrCreateReq.setMonthOfBirth(selectedMonth);
                abhaAddrCreateReq.setYearOfBirth(selectedYear);
                //  abhaAddrCreateReq.setGender(selectedGender);
                abhaAddrCreateReq.setProfilePhoto(selectedImageStream);
                dialogProfileDet.dismiss();
                createAbhaAddrDialog(txnId, name);

            }
        });
        imgCamera.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CameraUtils.captureImage(fragment);
            }
        });
    }

    public class DateMask implements TextWatcher {

        private static final int MAX_LENGTH = 8;
        private static final int MIN_LENGTH = 2;

        private String updatedText;
        private boolean editing;


        @Override
        public void beforeTextChanged(CharSequence charSequence, int start, int before, int count) {

        }

        @Override
        public void onTextChanged(CharSequence text, int start, int before, int count) {
            if (text.toString().equals(updatedText) || editing) return;

            String digits = text.toString().replaceAll("\\D", "");
            int length = digits.length();

            if (length <= MIN_LENGTH) {
                updatedText = digits;
                return;
            }

            if (length > MAX_LENGTH) {
                digits = digits.substring(0, MAX_LENGTH);
            }

            if (length <= 4) {
                String day = digits.substring(0, 2);
                String month = digits.substring(2);

                updatedText = String.format(Locale.US, "%s-%s", day, month);
            } else {
                String day = digits.substring(0, 2);
                String month = digits.substring(2, 4);
                String year = digits.substring(4);

                updatedText = String.format(Locale.US, "%s-%s-%s", day, month, year);
            }
        }

        @Override
        public void afterTextChanged(Editable editable) {

            if (editing) return;

            editing = true;

            editable.clear();
            editable.insert(0, updatedText);

            editing = false;
        }

    }

    // Method to get Activity from a Context
    public static Activity getActivityFromContext(Context context) {
        if (context instanceof Activity) {
            return (Activity) context;
        }
        return null;
    }

    public static boolean isValidPincode(String pincode) {
        // Regex for a 6-digit number
        return pincode.matches("^[0-9]{6}$");
    }

    public static boolean isValidABHANumber(String abhaNumber) {
        // Regex for validating the format XXXX-XXXX-XXXX-XX
        return abhaNumber.matches("^\\d{2}-\\d{4}-\\d{4}-\\d{4}$");
    }

    private static void setFromDateCalender(String option, String date) {
        final Calendar c = Calendar.getInstance();

        // on below line we are getting
        // our day, month and year.
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        // on below line we are creating a variable for date picker dialog.
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                // on below line we are passing context.
                abhaContext,
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        // on below line we are setting date to our text view.
                        Log.i("myLog", "onDateSet");
                        String day = String.valueOf(dayOfMonth);
                        if (day.length() == 1)
                            day = "0" + day;
                        Log.i("myLog", "onDateSet 1");
                        String month = String.valueOf(monthOfYear + 1);
                        if (month.length() == 1)
                            month = "0" + month;
                        Log.i("myLog", "onDateSet22222");
                        //    String selDate = year + "-" + month + "-" + day;
                        String selDate = day + "-" + month + "-" + year;
                        if (option.equalsIgnoreCase("profDetails")) {
                            selectedDay = day;
                            selectedMonth = month;
                            selectedYear = String.valueOf(year);
                            profDob.setText(selDate);
                        }
                        Log.i("myLog", "optionoptionoption:" + option + "   selDate:" + selDate);
//                        if (option.equalsIgnoreCase("dob")) {
//                            //  edtDob.setText(day + "-" + month + "-" + year);
//                            Log.i("myLog", "dob before set date");
//                            edtDob.setText(selDate);
//                            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
//
//                            // on below line we are creating a variable
//                            // for current date and time and calling a simple date format in it.
//                            String currDate = sdf.format(new Date());
//                            edtAge.setEnabled(false);
//                            ageCaluculate(selDate, currDate);
//                        } else if (option.equalsIgnoreCase("insurance")) {
//                            Log.i("myLog", "insurance");
//                            txtInsuranceValidity.setText(selDate);
//                        }
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);

        Date date1 = new Date();
        datePickerDialog.getDatePicker().setMaxDate(date1.getTime());
        datePickerDialog.show();
    }

    private static void getStates(Spinner spinner) {
        Call<List<OPHubResponse.StateResponse>> call = abhaServices.getStates();
        call.enqueue(new Callback<List<OPHubResponse.StateResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.StateResponse>> call, Response<List<OPHubResponse.StateResponse>> response) {

                Log.i("mylog", "getStates response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    List<OPHubResponse.StateResponse> list = response.body();
                    int size = list.size();
                    Log.i("myLog", "size:" + size);
                    genderAL = new ArrayList<>();
                    int genderPos = -1;
                    for (int start = 0; start < size; start++) {
                        OPHubResponse.StateResponse resp = list.get(start);
                        String gen = resp.getName();
                        if (gen.equalsIgnoreCase("TAMIL NADU")) {
                            Log.i("myLog", " matched index:" + start);
                            genderPos = start;
                        }
                        genderAL.add(gen);
                    }

                    if (spinner != null) {
                        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(
                                abhaContext
                                , R.layout.spinner_item, genderAL);
                        spinner.setAdapter(spinnerArrayAdapter);
                    }
                    spinner.setSelection(genderPos);
                    spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                        @Override
                        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                            Log.i("myLog", " matched index:" + list.get(position).getCode()
                                    + list.get(position).getName());
                            getDistrict(list.get(position).getCode());
                            selectedState = list.get(position).getName();
                            selectedStateCode = list.get(position).getCode();
                        }

                        @Override
                        public void onNothingSelected(AdapterView<?> parent) {

                        }
                    });
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.StateResponse>> call, Throwable t) {
                Log.i("myLog", "getStates response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }


    private static void getDistrict(String code) {
        OPHubRequests.DistrictCodeRequest request = new OPHubRequests.DistrictCodeRequest();
        request.setStateCode(code);
        Call<List<OPHubResponse.DistrictResponse>> call = abhaServices.getDistrict(request);
        call.enqueue(new Callback<List<OPHubResponse.DistrictResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.DistrictResponse>> call, Response<List<OPHubResponse.DistrictResponse>> response) {

                Log.i("mylog", "getStates response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    List<OPHubResponse.DistrictResponse> list = response.body();
                    int size = list.size();
                    Log.i("myLog", "size:" + size);
                    genderAL = new ArrayList<>();
                    int genderPos = -1;
                    for (int start = 0; start < size; start++) {
                        OPHubResponse.DistrictResponse resp = list.get(start);
                        String gen = resp.getName();
                        if (gen.equalsIgnoreCase("name")) {
                            Log.i("myLog", " matched index:" + start);
                            genderPos = start;
                        }
                        genderAL.add(gen);
                    }
                    if (spinDistrict != null) {
                        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(
                                abhaContext
                                , R.layout.spinner_item, genderAL);
                        spinDistrict.setAdapter(spinnerArrayAdapter);
                    }
                    spinDistrict.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                        @Override
                        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                            Log.i("myLog", " spinDistrict :" + list.get(position).getCode()
                                    + list.get(position).getName());
                            selectedDistrict = list.get(position).getName();
                            selectedDistrictCode = list.get(position).getCode();
                        }

                        @Override
                        public void onNothingSelected(AdapterView<?> parent) {

                        }
                    });
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.DistrictResponse>> call, Throwable t) {
                Log.i("myLog", "getStates response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    private static void getGender() {
        Log.i("myLog", "getGender");
        services.getGender().enqueue(new Callback<List<OPHubResponse.GenderResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.GenderResponse>> call, Response<List<OPHubResponse.GenderResponse>> response) {
                Log.i("myLog", "getAppointmentStatus onResponse:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    List<OPHubResponse.GenderResponse> list = response.body();
                    int size = list.size();
                    Log.i("myLog", "size:" + size);
                    genderAL = new ArrayList<>();
                    int genderPos = -1;
                    for (int start = 0; start < size; start++) {
                        OPHubResponse.GenderResponse resp = list.get(start);
                        String gen = resp.getGender();
//                        Log.i("myLog", "gen:" + gen + " len:" + gen.length() + "   gender:" + gender + " lrn:" + gender.length());
                        if (gen.equalsIgnoreCase(gender)) {
                            Log.i("myLog", " matched index:" + start);
                            genderPos = start;
                        }
                        genderAL.add(gen);
                    }
                    if (spinGender != null) {
                        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(
                                abhaContext
                                , R.layout.spinner_item, genderAL);
                        spinGender.setAdapter(spinnerArrayAdapter);
                    }
                    spinGender.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                        @Override
                        public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                            selectedGender = list.get(position).getGender();
                        }

                        @Override
                        public void onNothingSelected(AdapterView<?> parent) {

                        }
                    });
                    //  if (spinGender != null)
                    //    OPHubUtils.addProdTypeSpinner(getActivity(), genderAL, spinGender, "Select Gender");
                    Log.i("myLog", "getGender:" + gender);
                    if (gender != null) {
                        Log.i("myLog", "genderAL size:" + genderAL.size() + "   gender:" + gender);
                        int index = -1;
                        for (int start = 0; start < genderAL.size(); start++) {
                            String value = genderAL.get(start);
                            Log.i("myLog", "Value:" + value + "  len:" + value.length() + "  gender.len:" + gender.length());
                            if (value.equalsIgnoreCase(gender)) {
                                index = start;
                                Log.i("myLog", "Value amtched index:" + index);
                                // return;
                            }

                        }
                        //  int index = genderAL.indexOf(gender);
                        Log.i("myLog", "getGender genderPos:" + genderPos);
                       /* if (index >= 0)
                            spinGender.setSelection(index);*/
                        spinGender.setSelection(index);
                    }
                } else {
                    OPHubUtils.showErrorDialog(abhaContext, response.message());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.GenderResponse>> call, Throwable t) {
                // OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }


    public static void createAbhaAddrDialog(String txnId, String name) {
        Log.i("myLog", "showProfileDetails");
        dialogCreateAbhaAddr = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_create_abha_address, null);
        dialogCreateAbhaAddr.setContentView(view);
        ImageView imgClose = dialogCreateAbhaAddr.findViewById(R.id.imgClose);
        btnContinue = dialogCreateAbhaAddr.findViewById(R.id.btn_continue);
        progressBar = dialogCreateAbhaAddr.findViewById(R.id.progressBar);
        Button btnContinue = dialogCreateAbhaAddr.findViewById(R.id.btn_continue);
        editText = dialogCreateAbhaAddr.findViewById(R.id.edtName);
        suggestionTxt1 = dialogCreateAbhaAddr.findViewById(R.id.suggestion_txt_1);
        suggestionTxt2 = dialogCreateAbhaAddr.findViewById(R.id.suggestion_txt_2);
        suggestionTxt3 = dialogCreateAbhaAddr.findViewById(R.id.suggestion_txt_3);
        TextView txtsbx = dialogCreateAbhaAddr.findViewById(R.id.txtsbx);
        txtmim = dialogCreateAbhaAddr.findViewById(R.id.txtmim);
        txtSpecial = dialogCreateAbhaAddr.findViewById(R.id.txtSpecial);
        dialogCreateAbhaAddr.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogCreateAbhaAddr.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogCreateAbhaAddr.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(770);
        dialogCreateAbhaAddr.getWindow().setAttributes(lp);
        dialogCreateAbhaAddr.setCancelable(false);
        txtmim.setText("1. Minimum length - 8 characters\n" +"2. Maximum length - 18 characters\n" + "3. Special characters allowed - 1 dot (.) and/or 1 underscore (_)\n" + "4. Special character dot and underscore should be in between. Special characters cannot be in the beginning or at the end\n" +"5. Alphanumeric - only numbers, only letters or any combination of numbers and letters is allowed.");
        txtsbx.setText("@sbx");
        txtsbx.setTextColor(Color.BLACK);
        if (selAbhaOption.equalsIgnoreCase("MOBILE_NO"))
            getAbhaAddrSuggestion(txnId, name);
        else
            getAbhaUsernameSuggestions(txnId);

        suggestionTxt1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String text = suggestionTxt1.getText().toString();
                editText.setText(text);
            }
        });
        suggestionTxt2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String text = suggestionTxt2.getText().toString();
                editText.setText(text);
            }
        });
        suggestionTxt3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String text = suggestionTxt3.getText().toString();
                editText.setText(text);
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogCreateAbhaAddr.dismiss();
            }
        });
        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String username = s.toString();
                String regex = "^[A-Za-z0-9]+([._]?[A-Za-z0-9]+)*$";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(username);

                if (username.length() < 8){
                    txtSpecial.setText("Minimum length - 8 characters");
                    txtSpecial.setVisibility(View.VISIBLE);
                    return;
                }else{
                    txtSpecial.setVisibility(GONE);
                }


                if (username.startsWith(".") || username.startsWith("_") || username.endsWith(".") || username.endsWith("_") || username.startsWith("@") || username.startsWith("@") || username.endsWith("@") || username.chars().filter(ch -> ch == '@').count() > 1) {
                    txtSpecial.setText("Special character dot and underscore should be in between. Special characters cannot be in the beginning or at the end");
                    txtSpecial.setVisibility(View.VISIBLE);
                    System.out.println("print inside");
                    return;
                } else {
                    txtSpecial.setVisibility(View.GONE);
                    System.out.println("print outside");
                }

                if (!username.matches("^[a-zA-Z0-9._]+$")) {
                    txtSpecial.setText("Special characters allowed - 1 dot (.) and/or 1 underscore (_)");
                    txtSpecial.setVisibility(View.VISIBLE);
                    return;
                } else {
                    txtSpecial.setVisibility(View.GONE);
                }

              /*  if (!matcher.matches()) {
                    return;
                }*/
              /*  if (!username.matches("^[a-zA-Z0-9]+[._]?[a-zA-Z0-9]+$")) {
                    return;
                }*/


                if (username.length() >= 8 && matcher.matches() &&
                        !username.startsWith(".") && !username.startsWith("_") &&
                        !username.endsWith(".") && !username.endsWith("_") &&
                        !username.contains("@")) {
                    btnContinue.setEnabled(true);
                    btnContinue.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnContinue.setEnabled(false);
                    btnContinue.setBackgroundResource(R.drawable.round_disable_button);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {
                String username = s.toString();
//                if (username.length() < 8 || username.length() > 18) {
//                    txtmim.setVisibility(View.VISIBLE);
//                } else {
//                    txtmim.setVisibility(View.GONE);
//                }

            }
        });

      /*  editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                String username = s.toString();
                String regex = "^[A-Za-z0-9]+([._]?[A-Za-z0-9]+)*$";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(username);

                if (username.length() < 8 || username.length() > 18) {
                    txtmim.setVisibility(View.VISIBLE);
                } else {
                    txtmim.setVisibility(View.GONE);
                }

              *//*  if (!matcher.matches()) {
                    return;
                }*//*

                if (username.length() >= 8 && matcher.matches() &&
                        !username.startsWith(".") && !username.startsWith("_") &&
                        !username.endsWith(".") && !username.endsWith("_") &&
                        !username.contains("@")) {
                    txtSpecial.setVisibility(View.GONE);
                    txtmim.setVisibility(View.GONE);
                    btnContinue.setEnabled(true);
                    btnContinue.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    txtSpecial.setVisibility(View.VISIBLE);
                    txtmim.setVisibility(View.VISIBLE);
                    btnContinue.setEnabled(false);
                    btnContinue.setBackgroundResource(R.drawable.round_disable_button);
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });*/

        btnContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String abhaAddr = editText.getText().toString();
                if (abhaAddr.isEmpty()) {
//                    Toast.makeText(abhaContext, "Please enter valid User Name", Toast.LENGTH_SHORT).show();
                    return;

                }
                if (selAbhaOption.equalsIgnoreCase("MOBILE_NO")){
                    checkAbhaAddr(abhaAddr);
                }
                else {
                    progressBar.setVisibility(VISIBLE);
                    btnContinue.setVisibility(GONE);
                    editText.setEnabled(false);
                    createAbhaAddress(editText.getText().toString(), editText, txnId, dialogCreateAbhaAddr);
                }
            }
        });

    }
    private static void createAbhaAddress(String address, EditText edtText, String txnId, Dialog dialogCreateAbhaAddr) {
        OPHubRequests.AbhaAddressReq request = new OPHubRequests.AbhaAddressReq();
        request.setAbhaAddress(address);
        request.setTxnId(txnId);
        request.setPreferred(1);
        Log.i("myLog", "createAbhaAddress request:" + new Gson().toJson(request));
        Call<AbhaAddressCreationResp> call = abhaServices.abhaAddressCreation(request);
        call.enqueue(new Callback<AbhaAddressCreationResp>() {

            @Override
            public void onResponse(Call<AbhaAddressCreationResp> call, Response<AbhaAddressCreationResp> response) {
                Log.i("myLog", "createAbhaAddress response:" + new Gson().toJson(response.body()));
                editText.setEnabled(true);
                if (!response.isSuccessful()) {
                    edtText.setError("ABHA address unavailable");
                }
                if (response.body() != null) {
                    if (response.isSuccessful()) {

                        abhaNumber = response.body().getHealthIdNumber();
                        abhaAddress = response.body().getPreferredAbhaAddress();
                        if (dialogCreateAbhaAddr != null && dialogCreateAbhaAddr.isShowing())
                            dialogCreateAbhaAddr.dismiss();
                        showCreateAbhaSuccessDialog();
//                        demographic();
//                        getAayushUnique(abhaContext.getString(R.string.congratulations), "ABHA_CARD", false, false);
//                        showSuccessDialog(abhaContext.getString(R.string.congratulations), "ABHA_CARD", false, false);
                    } else {
                        progressBar.setVisibility(GONE);
                        btnContinue.setVisibility(VISIBLE);
                        edtText.setError("ABHA address unavailable");
                    }
                }else if (response.code() == 400) {
                    try {
                        edtText.setError("ABHA address unavailable");
                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        progressBar.setVisibility(GONE);
                        btnContinue.setVisibility(VISIBLE);
                        edtText.setError(errorMessage);
                    }catch (Exception e){
                        progressBar.setVisibility(GONE);
                        btnContinue.setVisibility(VISIBLE);
                    }
                } else {
                    Log.i("myLog", "server contact failed");
                    progressBar.setVisibility(GONE);
                    btnContinue.setVisibility(VISIBLE);
                    edtText.setError("ABHA address unavailable");
                }
            }

            @Override
            public void onFailure(Call<AbhaAddressCreationResp> call, Throwable t) {
                Log.i("myLog", "createAbhaAddress response failure:" + t.toString());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                progressBar.setVisibility(GONE);
                btnContinue.setVisibility(VISIBLE);
                edtText.setError("ABHA address unavailable");
            }
        });
    }
    public static void showCreateAbhaSuccessDialog() {
        Log.i("myLog", "showSuccessDialog");
        dialogSuccess = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_success, null);
        dialogSuccess.setContentView(view);
        dialogSuccess.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSuccess.show();
        dialogSuccess.setCancelable(false);
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSuccess.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(500, abhaContext);
        dialogSuccess.getWindow().setAttributes(lp);
        Button btnContinue = dialogSuccess.findViewById(R.id.btn_continue);
        TextView txtSuccess = view.findViewById(R.id.txtSuccess);
        txtSuccess.setText("ABHA address created successfully.");
        btnContinue.setVisibility(VISIBLE);

        btnContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogSuccess.dismiss();
                checkAddressNumberAdapter();
//                checkExistingPatient();
            }
        });

    }

    private static void checkAbhaAddr(String address) {

        OPHubRequests.CheckAbhaUsername request = new OPHubRequests.CheckAbhaUsername();
        request.setAddress(address);
        Call<Boolean> call = abhaServices.checkUserName(request);
        call.enqueue(new Callback<Boolean>() {

            @Override
            public void onResponse(Call<Boolean> call, Response<Boolean> response) {
                if (response.body() != null) {
                    Boolean result = response.body();
                    Log.i("checkAbhaAddr", "checkAbhaAddr response sucess:" + result.toString());
                    if (true) {
                        String abhaAddr = address;
                        if (!abhaAddr.contains("@sbx")) {
                            abhaAddr = address + "@sbx";
                            abhaAddress = abhaAddr;
                        }
                        abhaAddrCreateReq.setAbhaAddress(abhaAddr);
                        createAbhaAddress(abhaAddrCreateReq);
                    }
                }
            }

            @Override
            public void onFailure(Call<Boolean> call, Throwable t) {
                Log.i("myLog", "checkAbhaAddr response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    private static void createAbhaAddress(AbhaAddrCreationRequest requestInput) {

        //  AbhaAddrCreationRequest request = new AbhaAddrCreationRequest();
        Log.i("mylog", "createAbhaAddress request:" + new Gson().toJson(requestInput));
        Call<AbhaAddrCreationResponse> call = abhaServices.createAbhaAddr(requestInput);
        call.enqueue(new Callback<AbhaAddrCreationResponse>() {

            @Override
            public void onResponse(Call<AbhaAddrCreationResponse> call, Response<AbhaAddrCreationResponse> response) {

                Log.i("mylog", "createAbhaAddress response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    if (dialogCreateAbhaAddr.isShowing())
                        dialogCreateAbhaAddr.dismiss();
                    AbhaAddrCreationResponse resp = response.body();
                    token = resp.getTokens().getToken();
                    AbhaAddrCreationResponse.PhrDetails res = new AbhaAddrCreationResponse.PhrDetails();
                    String firstname =res.getFirstName();
                    String middlename =res.getMiddleName();
                    String lastname =res.getLastName();
                    String mobile=res.getMobile();
                    String address=res.getAddress();
                    String dob=res.getDateOfBirth();
                    String genter=res.getGender();

                    String name=firstname+middlename+lastname;
                    addonboradpatient(abhaNumber,name,address,genter,mobile,dob);
                    //  getAayushUnique(abhaContext.getString(R.string.congratulations), "ABHA_CARD", false, true);
//                    getPhrProfile(token,null);
//                    showSuccessDialog(abhaContext.getString(R.string.congratulations), "ABHA_CARD", false, true);
                }

            }

            @Override
            public void onFailure(Call<AbhaAddrCreationResponse> call, Throwable t) {
                Log.i("myLog", "createAbhaAddress response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });


    }

    private static void getAbhaUsernameSuggestions(String txnId) {
        Call<AbhaUsernameSuggestionResp> call = abhaServices.abhaUsernameSuggestion(txnId);
        call.enqueue(new Callback<AbhaUsernameSuggestionResp>() {

            @Override
            public void onResponse(Call<AbhaUsernameSuggestionResp> call, Response<AbhaUsernameSuggestionResp> response) {
                Log.i("mylog", "AbhaUsernameSuggestions response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    AbhaUsernameSuggestionResp resp = response.body();
                    Log.i("mylog", "AbhaUsernameSuggestions getAbhaAddressList:" + resp.getAbhaAddressList().toString());
                    if (!resp.getAbhaAddressList().isEmpty()) {
                        suggestionTxt1.setText(resp.getAbhaAddressList().get(0).toString());
                        suggestionTxt2.setText(resp.getAbhaAddressList().get(1).toString());
                        suggestionTxt3.setText(resp.getAbhaAddressList().get(2).toString());
                        suggestionTxt1.setVisibility(View.VISIBLE);
                        suggestionTxt2.setVisibility(View.VISIBLE);
                        suggestionTxt3.setVisibility(View.VISIBLE);
                    }
                }
            }

            @Override
            public void onFailure(Call<AbhaUsernameSuggestionResp> call, Throwable t) {
                Log.i("myLog", "AbhaUsernameSuggestions response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }

    private static void getAbhaAddrSuggestion(String txnId, String name) {
        Log.i("myLog", "getAbhaAddrSuggestion");
        OPHubRequests.AbhaAddrSuggestionReq request = new OPHubRequests.AbhaAddrSuggestionReq();
        request.setFirstName(name);
        request.setTxnId(txnId);
        request.setLastName("");
        request.setDayOfBirth(selectedDay);
        request.setMonthOfBirth(selectedMonth);
        request.setYearOfBirth(selectedYear);
        Log.i("myLog", "getAbhaAddrSuggestion request:" + new Gson().toJson(request));
        Call<OPHubResponse.AbhaAddrSuggestionResp> call = abhaServices.abhaAddressSuggestion(request);
        call.enqueue(new Callback<OPHubResponse.AbhaAddrSuggestionResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.AbhaAddrSuggestionResp> call, Response<OPHubResponse.AbhaAddrSuggestionResp> response) {
                Log.i("mylog", "getAbhaAddrSuggestion response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    OPHubResponse.AbhaAddrSuggestionResp resp = response.body();
                    Log.i("mylog", "getAbhaAddrSuggestion getAbhaAddressList:" + resp.getAbhaAddrlist().toString());
                    if (!resp.getAbhaAddrlist().isEmpty()) {
                        String suggestion1 = resp.getAbhaAddrlist().get(0).toString();
                        String suggestion2 = resp.getAbhaAddrlist().get(1).toString();
                        String suggestion3 = resp.getAbhaAddrlist().get(2).toString();
                        if (selAbhaOption.equalsIgnoreCase("Mobile")) {
                            suggestion1 = suggestion1 + "@sbx";
                            suggestion2 = suggestion2 + "@sbx";
                            suggestion3 = suggestion3 + "@sbx";
                        }
                        suggestionTxt1.setText(suggestion1);
                        suggestionTxt2.setText(suggestion2);
                        suggestionTxt3.setText(suggestion3);
                        suggestionTxt1.setVisibility(View.VISIBLE);
                        suggestionTxt2.setVisibility(View.VISIBLE);
                        suggestionTxt3.setVisibility(View.VISIBLE);
                    }
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.AbhaAddrSuggestionResp> call, Throwable t) {
                Log.i("myLog", "getAbhaAddrSuggestion response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }


    private static void generateMobileNoList(String mobile) {
        OPHubRequests.GetMobileListOTPRequest request = new OPHubRequests.GetMobileListOTPRequest();
        request.setMobileno(mobile);
        Log.i("mylog", "generateMobileNoOTP request:" + new Gson().toJson(request));
        Call<List<VerifyMobileNumberList>> call = abhaServices.getMobileList(request);
        call.enqueue(new Callback<List<VerifyMobileNumberList>>() {

            @Override
            public void onResponse(Call<List<VerifyMobileNumberList>> call, Response<List<VerifyMobileNumberList>> response) {

                Log.i("mylog", "generateMobileNoOTP response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(View.GONE);
                edtMobile.setEnabled(true);
                if (response.body() != null) {
                    dialogMobileOTP.dismiss();
                    List<VerifyMobileNumberList> resp = response.body();
//                    selectMobileNumberList(mobile, resp.get(0).getTxnId().toString(), resp);
                    generateMobileNoListStatus(mobile, resp.get(0).getTxnId().toString(), resp);
                } else if (response.code() == 400) {
                    btnNext.setVisibility(GONE);
                    createNew.setVisibility(VISIBLE);
                    invalidNumber.setVisibility(View.VISIBLE);
                    invalidNumber.setText("ABHA Number not found We did not find any ABHA number linked to this mobile number. Please use ABHA linked mobile number");
                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        invalidNumber.setText(errorMessage);
                        createNew.setVisibility(VISIBLE);

//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {

//
                    }
                } else if (response.code() == 404) {
                    btnNext.setVisibility(GONE);
                    createNew.setVisibility(VISIBLE);
                    invalidNumber.setVisibility(View.VISIBLE);
                    invalidNumber.setText("ABHA Number not found We did not find any ABHA number linked to this mobile number. Please use ABHA linked mobile number");
                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        invalidNumber.setText(errorMessage);
                        createNew.setVisibility(VISIBLE);

//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {

//
                    }
                } else {
                    btnNext.setVisibility(View.VISIBLE);
                    invalidNumber.setText("ABHA Number not found We did not find any ABHA number linked to this mobile number. Please use ABHA linked mobile number");
                    invalidNumber.setVisibility(View.VISIBLE);
                    btnNext.setVisibility(GONE);
                    createNew.setVisibility(VISIBLE);
//                    OPHubUtils.showUnknownErrorDialog(abhaContext);

                }
            }

            @Override
            public void onFailure(Call<List<VerifyMobileNumberList>> call, Throwable t) {
                Log.i("myLog", "generateMobileNoOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }


    private static void generateMobileNoListStatus(String mobile, String txnId, List<VerifyMobileNumberList> resp) {

        List<VerifyMobileNumberList.Abha> abhaList = resp.get(0).getAbha();

        List<VerifyMobileListStatus.Abha> abhaDetailList = new ArrayList<>();

        for (VerifyMobileNumberList.Abha abha : abhaList) {
            VerifyMobileListStatus.Abha abhaEntry = new VerifyMobileListStatus.Abha();
            abhaEntry.setABHANumber(abha.getABHANumber());
            abhaEntry.setName(abha.getName());
            abhaEntry.setGender(abha.getGender());
            abhaEntry.setIndex(abha.getIndex());
            abhaDetailList.add(abhaEntry);
        }

// Now wrap this in a single AbhaDetail
        VerifyMobileListStatus.AbhaDetail abhaDetail = new VerifyMobileListStatus.AbhaDetail();
        abhaDetail.setTxnId(txnId);
        abhaDetail.setMobile(mobile);
        abhaDetail.setAbha(abhaDetailList);

// Wrap in parent object
        List<VerifyMobileListStatus.AbhaDetail> abhaDetailsList = new ArrayList<>();
        abhaDetailsList.add(abhaDetail);

        VerifyMobileListStatus request = new VerifyMobileListStatus();
        request.setAbhaDetails(abhaDetailsList);

// Convert to JSON and log
        Log.i("mylog", "status request: " + new Gson().toJson(request));
        Call<VerifyMobileListStatus.VerifyMobileListStatusResponse> call = services.getMobileListStatus(request, hositalID);
        call.enqueue(new Callback<VerifyMobileListStatus.VerifyMobileListStatusResponse>() {

            @Override
            public void onResponse(Call<VerifyMobileListStatus.VerifyMobileListStatusResponse> call, Response<VerifyMobileListStatus.VerifyMobileListStatusResponse> response) {

                Log.i("mylog", "generateMobileNoOTP response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(GONE);

                if (response.body() != null) {
                    dialogMobileOTP.dismiss();
                    List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> resp = response.body().getData().get(0).getAbha();
                    selectMobileNumberList(mobile, txnId, resp);

                } else if (response.code() == 400) {
                    btnNext.setVisibility(VISIBLE);
                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");

                        //   Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {

//
                    }
                } else {
                    btnNext.setVisibility(VISIBLE);
                    invalidNumber.setText("ABHA Number not found We did not find any ABHA number linked to this mobile number. Please use ABHA linked mobile number");
                    invalidNumber.setVisibility(VISIBLE);
//                    OPHubUtils.showUnknownErrorDialog(abhaContext);

                }
            }

            @Override
            public void onFailure(Call<VerifyMobileListStatus.VerifyMobileListStatusResponse> call, Throwable t) {
                Log.i("myLog", "generateMobileNoOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }



    private static void generateMobileNoOTP(String mobile) {
        OPHubRequests.GetMobileOTPRequest request = new OPHubRequests.GetMobileOTPRequest();
        request.setMobileno(mobile);
        Log.i("mylog", "generateMobileNoOTP request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.getMobileNoOTP(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "generateMobileNoOTP response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        if (!AbhaQRlink) {
                            dialogMobileOTP.dismiss();

                        }
                        if (dialogVerifyOTP != null && dialogVerifyOTP.isShowing()) {
                            dialogVerifyOTP.dismiss();
                        }

                        showVerifyOTPDialog("MOBILE_OTP", txnId, message, "", "", mobile, false, "");
                    }
                } else if (response.code() == 400) {
                    try {

                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");

//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                } else {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateMobileNoOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }


    private static void generateChangePhoneOTP(String mobile, String txnId, VerifyAadhaarOTPResp aadhaarResp, Boolean newUser, String messages) {
        OPHubRequests.GenerateEmailOTPRequest request = new OPHubRequests.GenerateEmailOTPRequest();
        request.setTxnId(txnId);
        request.setLoginId(mobile);
        Log.i("mylog", "generateChangePhoneOTP request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.generateChangePhoneOTP(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "generateChangePhoneOTP response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
                        //        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        if (dialogVerifyOTP != null && dialogVerifyOTP.isShowing()) {
                            dialogVerifyOTP.dismiss();
                        }
                        showVerifyNewNumberOTPDialog(txnId, aadhaarResp, mobile,newUser,messages);
//                        showVerifyOTPDialog("CHANGE_PHONE_OTP", txnId, message, "", "", mobile, false, "");
                    }
                } else if (response.code() == 400) {
                    try {
                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        btnVerify.setVisibility(VISIBLE);
                        invalidNumber.setVisibility(VISIBLE);
                        progressBar.setVisibility(GONE);
                        invalidNumber.setText(errorMessage);
                        edtAadhaarNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();
                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                }else {

                }

            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }


    private static void generateEmailOTP(String email, String txnId, boolean isNew) {
        OPHubRequests.GenerateEmailOTPRequest request = new OPHubRequests.GenerateEmailOTPRequest();
        request.setTxnId(txnId);
        request.setLoginId(email);
        Log.i("mylog", "generateEmailOTP request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.generateEmailOTP(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "generateEmailOTP response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        if (dialogCommInfo.isShowing())
                            dialogCommInfo.dismiss();
                        showVerifyOTPDialog("EMAIL_OTP", txnId, message, "", email, "", false, "");
                    }
                }

            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }


    public static void showVerifyAbhaAddrDialog(Context context) {
        Log.i("myLog", "showVerifyAbhaAddrDialog");
        dialogVerifyAbhaAddr = new Dialog(context);
        View view = LayoutInflater.from(context).inflate(R.layout.dialog_verify_abha_address, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogVerifyAbhaAddr.setContentView(view);
        ImageView imgClose = dialogVerifyAbhaAddr.findViewById(R.id.imgClose);
        btnVerify = dialogVerifyAbhaAddr.findViewById(R.id.btn_verify);
        btnGetprofile = dialogVerifyAbhaAddr.findViewById(R.id.btn_getprofile);
        EditText edtTxt = dialogVerifyAbhaAddr.findViewById(R.id.edtMobileNo);
        CheckBox checkBox = dialogVerifyAbhaAddr.findViewById(R.id.chkAbhaNo);
        progressBar = dialogVerifyAbhaAddr.findViewById(R.id.progressBar);
        TextView terms = dialogVerifyAbhaAddr.findViewById(R.id.termscondition);
        TextView txtsbx = dialogVerifyAbhaAddr.findViewById(R.id.txtsbx);
        TextView invalidNumber = dialogVerifyAbhaAddr.findViewById(R.id.invalidNumber);
        CheckBox chkPwd = dialogVerifyAbhaAddr.findViewById(R.id.chkPassword);
        dialogVerifyAbhaAddr.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogVerifyAbhaAddr.setCancelable(false);
        dialogVerifyAbhaAddr.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogVerifyAbhaAddr.getWindow().getAttributes());
        lp.width = dpToPx(800, context);
        lp.height = dpToPx(450, context);
        dialogVerifyAbhaAddr.getWindow().setAttributes(lp);
        txtsbx.setText("@sbx");
        txtsbx.setTextColor(Color.BLACK);
        btnGetprofile.setVisibility(GONE);
        btnVerify.setVisibility(GONE);


        edtTxt.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                btnGetprofile.setVisibility(GONE);
                btnVerify.setVisibility(GONE);
//                String abhaadrs = edtTxt.getText().toString();
//                String output = abhaadrs.replaceFirst("@sbx", "");
//                System.out.println("output"+output);
                invalidNumber.setVisibility(GONE);
                edtTxt.setBackground(ContextCompat.getDrawable(context, R.drawable.edit_text));
                verifyAbhaAddrress(edtTxt.getText().toString() + "@sbx", edtTxt, invalidNumber);
            }

            @Override
            public void afterTextChanged(Editable editable) {
                invalidNumber.setVisibility(GONE);
            }
        });

        btnGetprofile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (listenerAddNewPatient != null) {
                    dialogVerifyAbhaAddr.dismiss();
                    listenerAddNewPatient.onAbhaQR(getAAyushNumber);
                }
            }
        });


        chkPwd.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    edtTxt.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    edtTxt.setTransformationMethod(PasswordTransformationMethod.getInstance());
                }
                edtTxt.setSelection(edtTxt.getText().length());
            }
        });


        checkBox.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.gray));
        checkBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (isChecked) {
                checkBox.setButtonTintList(ContextCompat.getColorStateList(abhaContext, R.color.green_text));
                // checkbox.setButtonTintList(android.content.res.ColorStateList.valueOf(R.color.green_text));
            }
        });


        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogVerifyAbhaAddr.dismiss();
            }
        });
        terms.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (checkBox.isChecked()) {
                    showTermsAndCondition(true);
                } else {
                    showTermsAndCondition(false);
                }
            }
        });
        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                progressBar.setVisibility(View.VISIBLE);
//                btnVerify.setVisibility(View.GONE);
                String abhaadrs = edtTxt.getText().toString();
                if (abhaadrs.isEmpty()) {
                    invalidNumber.setVisibility(VISIBLE);
                    invalidNumber.setText("Please enter valid ABHA Address");
                    edtTxt.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
                    return;
                }
                if (checkBox.isChecked()) {
                    if (!edtTxt.getText().toString().isEmpty()) {
                        progressBar.setVisibility(VISIBLE);
                        btnVerify.setVisibility(GONE);
                        invalidNumber.setVisibility(GONE);
                        String edtAbhaAddress = abhaadrs.replaceFirst("@sbx", "");
                        System.out.println("output"+edtAbhaAddress);
                        verifyAbhaAddr(edtAbhaAddress + "@sbx", edtTxt, invalidNumber);
                    } else {
                        edtTxt.setError("Please Enter ABHA address");
                    }
                } else {
                    checkBox.setButtonTintList(android.content.res.ColorStateList.valueOf(Color.RED));
//                    Toast.makeText(abhaContext, "Please agree the terms", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private static void verifyAbhaAddrress(String Addr, EditText edtTxt, TextView invalidNumber) {
        OPHubRequests.verifyAbhaAddr request = new OPHubRequests.verifyAbhaAddr();
        request.setAbhaAddr(Addr);
        Log.i("mylog", "verifyAbhaAddr request:" + new Gson().toJson(request));
        Call<AbhaAddressVerifyResponse> call = abhaServices.verifyAbhaAddr(request);
        call.enqueue(new Callback<AbhaAddressVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaAddressVerifyResponse> call, Response<AbhaAddressVerifyResponse> response) {
                Log.i("mylog", "verifyAbhaAddr response:" + new Gson().toJson(response.body()));
                if (response.isSuccessful()) {
                    verifyAbhaAddrressHospital(Addr, edtTxt, invalidNumber);
                } else {
//                    edtTxt.setError("Please Enter a Valid Abha Address");
                    invalidNumber.setVisibility(VISIBLE);
                    edtTxt.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
//                    Toast.makeText(abhaContext, "Please Enter a Valid ABHA Address", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AbhaAddressVerifyResponse> call, Throwable t) {
                Log.i("myLog", "verifyChangePhoneOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(VISIBLE);
                progressBar.setVisibility(GONE);
            }
        });

    }


    private static void verifyAbhaAddrressHospital(String Addr, EditText edtTxt, TextView invalidNumber) {
        OPHubResponse.VerifyRequest request = new OPHubResponse.VerifyRequest();
        request.setAbhaAddress(Addr);
        request.setHospitalId(hositalID.toString());
        Log.i("mylog", "verifyAbhaAddr request:" + new Gson().toJson(request));
        Call<OPHubResponse.VerifyAbhaAddress> call = services.getAbhaHospital(request);
        call.enqueue(new Callback<OPHubResponse.VerifyAbhaAddress>() {
            @Override
            public void onResponse(Call<OPHubResponse.VerifyAbhaAddress> call, Response<OPHubResponse.VerifyAbhaAddress> response) {
                Log.i("mylog", "verifyAbhaAddr response:" + new Gson().toJson(response.body()));
                if (response.isSuccessful()) {
                    if (response.body().getMessage().equalsIgnoreCase("Abha address not mapped to any patient")){
                        btnVerify.setVisibility(VISIBLE);
                        btnGetprofile.setVisibility(GONE);
                    }
                    else {
                        getAAyushNumber = response.body().getPatientDetails().get(0).getAayushUniqueId();
                        btnVerify.setVisibility(VISIBLE);
                        btnGetprofile.setVisibility(GONE);
                    }


                } else {
                    btnVerify.setVisibility(VISIBLE);
//                    edtTxt.setError("Please Enter a Valid Abha Address");
                    invalidNumber.setVisibility(VISIBLE);
                    edtTxt.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
//                    Toast.makeText(abhaContext, "Please Enter a Valid ABHA Address", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.VerifyAbhaAddress> call, Throwable t) {
                Log.i("myLog", "verifyChangePhoneOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(VISIBLE);
                progressBar.setVisibility(GONE);
            }
        });

    }


    private static void verifyAbhaAddr(String Addr, EditText edtTxt, TextView invalidNumber) {
        OPHubRequests.verifyAbhaAddr request = new OPHubRequests.verifyAbhaAddr();
        request.setAbhaAddr(Addr);
        Log.i("mylog", "verifyAbhaAddr request:" + new Gson().toJson(request));
        Call<AbhaAddressVerifyResponse> call = abhaServices.verifyAbhaAddr(request);
        call.enqueue(new Callback<AbhaAddressVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaAddressVerifyResponse> call, Response<AbhaAddressVerifyResponse> response) {
                Log.i("mylog", "verifyAbhaAddr response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(View.GONE);
                if (response.isSuccessful()) {
                    if (response.body() != null) {
                        AbhaAddressVerifyResponse resp = response.body();
                        showOTPOptionDialog("VERIFY_ABHA_ADDRESS", "", resp);
                        dialogVerifyAbhaAddr.dismiss();
                    }
                } else {
                    btnVerify.setVisibility(View.VISIBLE);
//                    edtTxt.setError("Please Enter a Valid Abha Address");
                    invalidNumber.setVisibility(View.VISIBLE);
                    edtTxt.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
//                    Toast.makeText(abhaContext, "Please Enter a Valid ABHA Address", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AbhaAddressVerifyResponse> call, Throwable t) {
                Log.i("myLog", "verifyChangePhoneOTP response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.GONE);
            }
        });

    }

    public static void showOTPOptionDialog(String option, String abhano, AbhaAddressVerifyResponse response) {
        Log.i("myLog", "showOTPOptionDialog");
        dialogOtpOption = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_otp_options, null);
        dialogOtpOption.setContentView(view);
        ImageView imgClose = dialogOtpOption.findViewById(R.id.imgClose);
        relABHAOTP = dialogOtpOption.findViewById(R.id.relAbha);
        relAadhaarOTP = dialogOtpOption.findViewById(R.id.relAadhaarNo);
        abhaText = dialogOtpOption.findViewById(R.id.invalidABHA);
        aadharText = dialogOtpOption.findViewById(R.id.invalidAadhar);
        loaderOverlay = dialogOtpOption.findViewById(R.id.loaderOverlay);
        dialogOtpOption.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogOtpOption.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogOtpOption.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(450, abhaContext);
        dialogOtpOption.getWindow().setAttributes(lp);
        dialogOtpOption.setCancelable(false);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogOtpOption.dismiss();
            }
        });
        relABHAOTP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loaderOverlay.setVisibility(VISIBLE);
                relABHAOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_blue_outline));
                if (option.equalsIgnoreCase("VERIFY_ABHA_ADDRESS"))
                    otpVerification("abdm", response);
                else if (option.equalsIgnoreCase("LINK_ABHA_NO"))
                    getOTPLinkABHA(abhano, "abdm");
            }
        });
        relAadhaarOTP.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loaderOverlay.setVisibility(VISIBLE);
                relAadhaarOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_blue_outline));
                if (option.equalsIgnoreCase("VERIFY_ABHA_ADDRESS"))
                    otpVerification("aadhaar", response);
                else if (option.equalsIgnoreCase("LINK_ABHA_NO"))
                    getOTPLinkABHA(abhano, "aadhaar");
            }
        });
    }


    private static void getAadhaarVerify(String abhaNo, String otpSystem) {
        OPHubRequests.GetOTPLinkABHAReq request = new OPHubRequests.GetOTPLinkABHAReq();
        String aadhaarNo = abhaNo.replace(" ", "");
        request.setAadhaarNumber(aadhaarNo);
        Log.i("mylog", "GetOTPLinkABHA request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.getOTPLinkABHA(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "GetOTPLinkABHA response:" + new Gson().toJson(response.body()));
                edtAadhaarNo.setEnabled(true);
                if (response.body() != null) {
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        if (dialogAadhaarOTP != null && dialogAadhaarOTP.isShowing())
                            dialogAadhaarOTP.dismiss();
                        if (dialogVerifyOTP != null && dialogVerifyOTP.isShowing())
                            dialogVerifyOTP.dismiss();
                        abhaNumber = abhaNo;
                        //   Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        showVerifyOTPDialog("AADHAAR_OTP_VERIFICATION", txnId, message, "", "", "", false, otpSystem);

                    }
                } else if (response.code() == 400) {
                    try {
                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        btnVerify.setVisibility(View.VISIBLE);
                        invalidNumber.setVisibility(View.VISIBLE);
                        progressBar.setVisibility(View.GONE);
                        invalidNumber.setText(errorMessage);
                        edtAadhaarNo.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text_error));
//                        Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();
                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                btnVerify.setVisibility(View.VISIBLE);
                invalidNumber.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.GONE);
//                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }
    private static void getOTPLinkABHA(String abhaNo, String otpSystem) {
        OPHubRequests.GetOTPLinkABHAReq request = new OPHubRequests.GetOTPLinkABHAReq();
        request.setAbhaNumber(abhaNo);
        request.setOtpSystem(otpSystem);
        Log.i("mylog", "GetOTPLinkABHA request:" + new Gson().toJson(request));
        Call<OPHubResponse.GenerateAadhaarOTPResp> call = abhaServices.getOTPLinkABHA(request);
        call.enqueue(new Callback<OPHubResponse.GenerateAadhaarOTPResp>() {

            @Override
            public void onResponse(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Response<OPHubResponse.GenerateAadhaarOTPResp> response) {

                Log.i("mylog", "GetOTPLinkABHA response:" + new Gson().toJson(response.body()));
                loaderOverlay.setVisibility(GONE);
                relABHAOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_white));
                relAadhaarOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_white));
                if (response.body() != null) {
                    OPHubResponse.GenerateAadhaarOTPResp resp = response.body();
                    String message = resp.getMessage();
                    if (message != null) {
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        String txnId = resp.getTxnId();
                        if (dialogOtpOption != null && dialogOtpOption.isShowing())
                            dialogOtpOption.dismiss();
                        if(dialogVerifyOTP !=null && dialogVerifyOTP.isShowing())
                            dialogVerifyOTP.dismiss();
                        abhaNumber = abhaNo;
//                        Toast.makeText(abhaContext, message, Toast.LENGTH_SHORT).show();
                        showVerifyOTPDialog("ABHA_OTP", txnId, message, "", "", "", false, otpSystem);

                    }
                }else if (response.code() == 400) {
                    try {
                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
//                            if (dialogOtpOption != null && dialogOtpOption.isShowing())
//                                dialogOtpOption.dismiss();
//                            if (dialogVerifyOTP != null && dialogVerifyOTP.isShowing())
//                                dialogVerifyOTP.dismiss();
////                            showAbhaOTPDialog("invalid", abhaNo, errorMessage);
                        if (otpSystem.equalsIgnoreCase("abdm")){
                            abhaText.setVisibility(VISIBLE);
                            abhaText.setText(errorMessage);
                        }else  {
                            aadharText.setVisibility(VISIBLE);
                            aadharText.setText(errorMessage);
                        }
                        //  Toast.makeText(abhaContext, errorMessage, Toast.LENGTH_LONG).show();

                    } catch (Exception e) {
                        e.printStackTrace();
//
                    }
                } else {
                    if (dialogOtpOption != null && dialogOtpOption.isShowing())
                        dialogOtpOption.dismiss();
                    if(dialogVerifyOTP !=null && dialogVerifyOTP.isShowing())
                        dialogVerifyOTP.dismiss();
                    showAbhaOTPDialog("invalid",abhaNo);
//                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.GenerateAadhaarOTPResp> call, Throwable t) {
                Log.i("myLog", "generateAadhaarOTP response failure:" + t.toString());
                loaderOverlay.setVisibility(GONE);
                relABHAOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_white));
                relAadhaarOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_white));
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    private static void otpVerification(String otpSystem, AbhaAddressVerifyResponse response) {
        OPHubRequests.sendOtpUserNameVerify request = new OPHubRequests.sendOtpUserNameVerify();
        request.setAbhaAddress(response.getAbhaAddress());
        request.setOtpSystem(otpSystem);
        Log.i("mylog", "otpVerification request:" + new Gson().toJson(request));
        Call<AbhaUserNameVerifyResponse> call = abhaServices.sendOtpUserNameVerify(request);
        call.enqueue(new Callback<AbhaUserNameVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaUserNameVerifyResponse> call, Response<AbhaUserNameVerifyResponse> response) {
                Log.i("mylog", "otpVerification response:" + new Gson().toJson(response.body()));
                loaderOverlay.setVisibility(GONE);
                relABHAOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_white));
                relAadhaarOTP.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.rounded_rectangle_white));
                if (response.isSuccessful()) {
                    if (response.body() != null) {
                        showOtpDialogForUserNameVerify(otpSystem, response);
                        //    Toast.makeText(abhaContext, response.body().getMessage(), Toast.LENGTH_SHORT).show();
                        dialogOtpOption.dismiss();
                    }
                }else if (response.code() == 400) {
                    try {
                        System.out.println("print error message ");
                        String errorBody = response.errorBody().string();
                        JSONObject jsonObject = new JSONObject(errorBody);
                        String errorMessage = jsonObject.getString("message");
                        if (otpSystem.equalsIgnoreCase("abdm")){
                            abhaText.setVisibility(VISIBLE);
                            abhaText.setText(errorMessage);
                        }else {
                            aadharText.setVisibility(VISIBLE);
                            aadharText.setText(errorMessage);
                        }

                    } catch (Exception e) {
                        System.out.println("print error catch ");
//                        e.printStackTrace();
//
                    }
                } else {
                    TextView errorText = dialogOtpOption.findViewById(R.id.errorTxt);
                    try {
                        //   Toast.makeText(abhaContext, "You have requested multiple OTPs Or Exceeded maximum number of attempts for OTP match in this transaction. Please try again in 30 minutes.", Toast.LENGTH_SHORT).show();
                        JSONArray jsonArray = new JSONArray(response.errorBody().string());
                        JSONObject jsonObject = jsonArray.getJSONObject(0);
                        String message = jsonObject.getString("message");
                        errorText.setText(message);
                    } catch (IOException | JSONException e) {
//                        throw new RuntimeException(e);
                    }
                }
            }

            @Override
            public void onFailure(Call<AbhaUserNameVerifyResponse> call, Throwable t) {
                Log.i("myLog", "otpVerification response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    //TODO verify of ABHA address OTP
    private static void showOtpDialogForUserNameVerify(String otpSystem, Response<AbhaUserNameVerifyResponse> response) {
        Log.i("myLog", "showOtpDialogForUserNameVerify");
        dialogVerifyOTP = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.fragment_abha_verify_otp, null);
        dialogVerifyOTP.setContentView(view);
        ImageView imgClose = dialogVerifyOTP.findViewById(R.id.imgClose);
        btnVerify = dialogVerifyOTP.findViewById(R.id.btn_verify);
        progressBar = dialogVerifyOTP.findViewById(R.id.progressBar);
        TextView txtMob = dialogVerifyOTP.findViewById(R.id.txtMob);
        pinView = dialogVerifyOTP.findViewById(R.id.pinview);
        TextView txtMsg = dialogVerifyOTP.findViewById(R.id.txtMessage);
        TextView txtEdit = dialogVerifyOTP.findViewById(R.id.txtEdit);
        LinearLayout linearMob = dialogVerifyOTP.findViewById(R.id.linearMob);
        LinearLayout linearResend = dialogVerifyOTP.findViewById(R.id.linearResend);
        LinearLayout linearSecs = dialogVerifyOTP.findViewById(R.id.linearResendSec);
        TextView txtSec = dialogVerifyOTP.findViewById(R.id.txtSecs);
        resendOtpCount = dialogVerifyOTP.findViewById(R.id.resend_otp_count);
        TextView resendotpsuccess = dialogVerifyOTP.findViewById(R.id.resendotpsuccess);
        TextView txtmaxlimitotp = dialogVerifyOTP.findViewById(R.id.txtmaxlimitotp);
        txtInvalidOTP = dialogVerifyOTP.findViewById(R.id.txtInvaidotp);
        TextView enable_otp = dialogVerifyOTP.findViewById(R.id.enable_otp);
        otppinError = dialogVerifyOTP.findViewById(R.id.otppinError);
        txtMsg.setText(response.body().getMessage().toString());
        txtMob.setVisibility(View.VISIBLE);
        linearMob.setVisibility(View.VISIBLE);
        txtEdit.setVisibility(View.GONE);
        txtMob.setVisibility(View.GONE);
        linearMob.setVisibility(View.GONE);
        btnVerify.setEnabled(false);
        dialogVerifyOTP.setCancelable(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);
        dialogVerifyOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogVerifyOTP.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogVerifyOTP.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(450, abhaContext);
        dialogVerifyOTP.getWindow().setAttributes(lp);
        new CountDownTimer(60000, 1000) {
            public void onTick(long millisUntilFinished) {
                long res = millisUntilFinished / 1000;
                if (res != 0)
                    txtSec.setText(res + "s");
            }

            public void onFinish() {
                linearResend.setVisibility(View.VISIBLE);
                linearSecs.setVisibility(View.GONE);
                resendOtpCount.setText(" "+clickCount + "/2");
            }
        }.start();

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogVerifyOTP.dismiss();
            }
        });

        linearResend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                clickCount++;
                if (clickCount == 1 || clickCount == 2) {
                    resendOtpCount.setText(" " + clickCount + "/2");
                    btnVerify.setVisibility(GONE);
                    progressBar.setVisibility(VISIBLE);
                    resendotpsuccess.setVisibility(VISIBLE);
                    pinView.setEnabled(false);
                    otpVerifications(otpSystem, response.body().getAbhaAddress());
                } else if (clickCount >= 3) {
                    linearResend.setVisibility(GONE);
                    enable_otp.setVisibility(GONE);
                    txtmaxlimitotp.setVisibility(VISIBLE);
                    resendotpsuccess.setVisibility(GONE);
                }
//                otpVerifications(otpSystem, response.body().getAbhaAddress());

            }
        });

        pinView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                //  invalidNumber.setVisibility(View.GONE);
                //  pinView.setBackground(ContextCompat.getDrawable(abhaContext, R.drawable.edit_text));
                otppinError.setVisibility(VISIBLE);
                if (s.toString().trim().length() == 6) {
                    btnVerify.setEnabled(true);
                    otppinError.setVisibility(GONE);
                    btnVerify.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                } else {
                    btnVerify.setEnabled(false);
                    btnVerify.setBackgroundResource(R.drawable.round_disable_button);
                    otppinError.setVisibility(VISIBLE);
                }
                pinView.setLineColor(Color.BLACK);
                txtInvalidOTP.setVisibility(GONE);


            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });

        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String otp = pinView.getText().toString();
                if (otp.isEmpty() || otp.length() != 6) {
                    pinView.setLineColor(Color.RED);
                    txtInvalidOTP.setVisibility(VISIBLE);
                    btnVerify.setVisibility(VISIBLE);
                    progressBar.setVisibility(GONE);
                    txtInvalidOTP.setText("Please enter a valid OTP");
                    return;
                } else {
                    // pinView.setLineColor(Color.GREEN);
                    txtInvalidOTP.setVisibility(GONE);
                    btnVerify.setVisibility(GONE);
                    progressBar.setVisibility(VISIBLE);
                    pinView.setEnabled(false);
                    verifyOTPUserName(otp, otpSystem, response.body().getTxnId().toString(), dialogVerifyOTP);
                }
             /*   if (otp.isEmpty()) {
                    Toast.makeText(abhaContext, "Please Enter OTP", Toast.LENGTH_SHORT).show();
                    return;
                } else {
                    verifyOTPUserName(otp, otpSystem, response.body().getTxnId().toString(), dialogVerifyOTP);
                }*/
            }
        });
    }

    private static void otpVerifications(String otpSystem, String abhaAddress) {
        OPHubRequests.sendOtpUserNameVerify request = new OPHubRequests.sendOtpUserNameVerify();
        request.setAbhaAddress(abhaAddress);
        System.out.println("abhaAddressss::" + abhaAddress);
        request.setOtpSystem(otpSystem);
        Log.i("mylog", "otpVerification resend request:" + new Gson().toJson(request));
        Call<AbhaUserNameVerifyResponse> call = abhaServices.sendOtpUserNameVerify(request);
        call.enqueue(new Callback<AbhaUserNameVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaUserNameVerifyResponse> call, Response<AbhaUserNameVerifyResponse> response) {
                Log.i("mylog", "otpVerification resend response:" + new Gson().toJson(response.body()));
                pinView.setEnabled(true);
                if (response.isSuccessful()) {
                    if (response.body() != null) {
                        dialogVerifyOTP.dismiss();
                        showOtpDialogForUserNameVerify(otpSystem, response);
                    }
                } else {
                    TextView errorText = dialogOtpOption.findViewById(R.id.errorTxt);
                    try {
                        JSONArray jsonArray = new JSONArray(response.errorBody().string());
                        JSONObject jsonObject = jsonArray.getJSONObject(0);
                        String message = jsonObject.getString("message");
                        errorText.setText(message);
                    } catch (IOException | JSONException e) {

                    }
                }
            }

            @Override
            public void onFailure(Call<AbhaUserNameVerifyResponse> call, Throwable t) {
                Log.i("myLog", "otpVerification response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    private static void verifyOTPUserName(String otp, String otpSystem, String txnId, Dialog
            dialogVerifyOTP) {
        OPHubRequests.verifyAbhaUserNameOtp request = new OPHubRequests.verifyAbhaUserNameOtp();
        request.setOtp(otp);
        request.setOtpSystem(otpSystem);
        request.setTxnId(txnId);
        Log.i("mylog", "otpVerification request:" + new Gson().toJson(request));
        Call<AbhaUserNameOtpVerifyResponse> call = abhaServices.verifyOtpResponse(request);
        call.enqueue(new Callback<AbhaUserNameOtpVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaUserNameOtpVerifyResponse> call, Response<AbhaUserNameOtpVerifyResponse> response) {
                Log.i("mylog", "otpVerification response:" + new Gson().toJson(response.body()));
                progressBar.setVisibility(View.GONE);
                pinView.setEnabled(true);
                if (response.isSuccessful()) {
                    if (response.body() != null) {
                        if (response.body().getAuthResult().matches("success")) {
                            //    pinView.setLineColor(Color.GREEN);
                            token = response.body().getTokens().getToken();
                            getAbhaAddrProfile(token);
                            if (response.body().getUsers().get(0).getAbhaAddress() != null) {
                                if (!response.body().getUsers().get(0).getAbhaAddress().isEmpty()) {
                                    abhaAddress = response.body().getUsers().get(0).getAbhaAddress();
                                }
                            }
                            if (response.body().getUsers().get(0).getAbhaNumber() != null) {
                                if (!response.body().getUsers().get(0).getAbhaNumber().isEmpty()) {
                                    abhaNumber = response.body().getUsers().get(0).getAbhaNumber();
                                }
                            }
//                            showSuccessDialog(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", true, false);
                            dialogVerifyOTP.dismiss();
                        } else {
                            btnVerify.setVisibility(View.VISIBLE);
                            pinView.setLineColor(Color.RED);
                            txtInvalidOTP.setVisibility(View.VISIBLE);
                            // Toast.makeText(abhaContext, "Please Enter Correct OTP", Toast.LENGTH_SHORT).show();
                        }
                    }
                } else {
                    //Toast.makeText(abhaContext, "Please Enter Correct OTP", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<AbhaUserNameOtpVerifyResponse> call, Throwable t) {
                Log.i("myLog", "otpVerification response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
                btnVerify.setVisibility(View.VISIBLE);
            }
        });

    }

    public static void getAbhaAddrProfile(String token) {
        OPHubRequests.UserNameVerifyCardToken request = new OPHubRequests.UserNameVerifyCardToken();
        request.setToken(token);
        Log.i("mylog", "getAbhaAddrProfile request:" + new Gson().toJson(request));
        Call<AbhaProfileResp> call = abhaServices.getAbhaProfile(request);
        call.enqueue(new Callback<AbhaProfileResp>() {
            @Override
            public void onResponse(Call<AbhaProfileResp> call, Response<AbhaProfileResp> response) {
                Log.i("mylog", "getAbhaAddrProfile response:" + new Gson().toJson(response.body()));
                if (response.isSuccessful()) {
                    if (response.body() != null) {
                        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
                        request.setAbhaNo(response.body().getAbhaNumber());
                        request.setAbhaAddress(response.body().getAbhaAddress());
                        request.setAddress(response.body().getAddress());
                        abhaAddress = response.body().getAbhaAddress();
                        //TODO No need for abha address flow
                        updateAddress = response.body().getAddress();
                        updateDOB = response.body().getYearOfBirth() + "-" +
                                response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth();
                        updateFirstName = response.body().getFirstName();
                        updateMiddleName = response.body().getMiddleName();
                        updateLastName = response.body().getLastName();
                        updateGender = response.body().getGender();
                        updateImage = response.body().getImageKey();
                        request.setDob(response.body().getYearOfBirth() + "-" +
                                response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth());
                        request.setPatientName(response.body().getFullName());
                        request.setDialCode("91");
                        request.setMobile(response.body().getMobile());
                        String gender = "";
                        if (response.body().getGender().equals("M")) {
                            gender = "Male";
                        } else if (response.body().getGender().equals("F")) {
                            gender = "Female";
                        } else {
                            gender = "Others";
                        }
                        request.setGender(gender);
                        request.setAge(calculateAge(response.body().getYearOfBirth() + "-" +
                                response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth()));
//                        if (hositalID != null) {
//                            request.setHospId(hositalID);
//                            addNewPatient(request);
//                        }
                        String firstname=response.body().getFirstName();
                        String middlename=response.body().getMiddleName();
                        String lastname=response.body().getLastName();
                        String addrs=response.body().getAddress();
                        String mobile=response.body().getMobile();
                        String name=firstname+middlename+lastname;
//                        addonboradpatient(response.body().getAbhaNumber(),name,addrs,gender,mobile,response.body().getYearOfBirth() + "-" +
//                                response.body().getMonthOfBirth() + "-" + response.body().getDayOfBirth());
                        checkAddressNumber();
                       // getAayushUnique(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", true, false);
                    }
                } else {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }
            }

            @Override
            public void onFailure(Call<AbhaProfileResp> call, Throwable t) {
                Log.i("myLog", "getAbhaAddrProfile response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }

    public static void showSuccessDialog(String msg, String option, Boolean isFromUserNameVerify, Boolean isFromMobileOtp) {
        Log.i("myLog", "showSuccessDialog");
        dialogSuccess = new Dialog(abhaContext);

        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_success, null);
        TextView txtSuccess = view.findViewById(R.id.txtSuccess);
        if (!msg.isEmpty())
            txtSuccess.setText(msg);
        dialogSuccess.setContentView(view);
        dialogSuccess.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogSuccess.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSuccess.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(500, abhaContext);
        dialogSuccess.getWindow().setAttributes(lp);
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    dialogSuccess.dismiss();

                    if (option.equalsIgnoreCase("ABHA_CARD"))
                        showAbhaCard(isFromUserNameVerify, isFromMobileOtp);
                    else if (option.equalsIgnoreCase("ABHA_NO_LINK"))
                        showAbhaCard(isFromUserNameVerify, isFromMobileOtp);
                } catch (Exception ex) {
                    Log.i("myLog", "exception ex:" + ex.toString());
                }
            }
        }, 1500);
    }

    public static void showAbhaCard(Boolean isFromUserNameVerify, Boolean isFromMobileOtp) {
        Log.i("myLog", "showAbhaCard");
        dialogAbhaCard = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_abha_card, null);
        dialogAbhaCard.setContentView(view);
        dialogAbhaCard.setCancelable(false);

        btnPrint = dialogAbhaCard.findViewById(R.id.btn_print);
        Button btnClose = dialogAbhaCard.findViewById(R.id.btn_close);
        ImageView imgClose = dialogAbhaCard.findViewById(R.id.imgClose);
        ImageView imgAbhaCard = dialogAbhaCard.findViewById(R.id.imgAbhaCard);
        ImageView btnContinue = dialogAbhaCard.findViewById(R.id.btn_continue);
        progressBar = dialogAbhaCard.findViewById(R.id.progressBar);
        dialogAbhaCard.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogAbhaCard.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogAbhaCard.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(670, abhaContext);
        dialogAbhaCard.getWindow().setAttributes(lp);
        if (isFromUserNameVerify) {

            downloadAbhaCard(token, imgAbhaCard, isFromUserNameVerify);
        } else if (isFromMobileOtp) {
            downloadPhrAbhaCard(token, imgAbhaCard);
        } else {
            downloadAbhaCard("Bearer " + token, imgAbhaCard, false);
        }
        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogAbhaCard.dismiss();
                EventBus.getDefault().post(new EventModel(""));
                if (!isFromAdd) {
                    if (listener != null) {
                        listener.onAbhaCardDownloaded(abhaNumber, abhaAddress,updateFirstName +" "+updateMiddleName+" "+updateLastName,updateMiddleName,updateLastName,updateAddress,updateDOB,updateGender);
                    }
                } else {
                    System.out.println("print abha address1");
                        if (listenerAddNewPatient != null) {
                            System.out.println("print abha address2");
                            listenerAddNewPatient.onAbhaQR(userAayushId);
                        }
                }
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogAbhaCard.dismiss();
                EventBus.getDefault().post(new EventModel(""));
                if (!isFromAdd) {
                    if (listener != null) {
                        listener.onAbhaCardDownloaded(abhaNumber, abhaAddress,updateFirstName,updateMiddleName,updateLastName,updateAddress,updateDOB,updateGender);
                    }
                } else {
                    System.out.println("print abha address1 close ");
                        if (listenerAddNewPatient != null) {
                            System.out.println("print abha address2 close ");
                            listenerAddNewPatient.onAbhaQR(userAayushId);
                        }

                }
            }
        });
        btnPrint.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.USB);
//                int status = mIminPrintUtils.getPrinterStatus(IminPrintUtils.PrintConnectType.USB);
//                if (status == 1 || status == -1) {
//                    OPHubUtils.showErrorDialog(abhaContext, "The printer is not connected or powered on");
//                    return;
//                } else if (status == 3) {
//                    OPHubUtils.showErrorDialog(abhaContext, "Print head open");
//                    return;
//                } else if (status == 7) {
//                    OPHubUtils.showErrorDialog(abhaContext, "No paper feed");
//                    return;
//                } else if (status == 8) {
//                    OPHubUtils.showErrorDialog(abhaContext, "Paper running out");
//                    return;
//                }
//                //    callPrinter();
//                dialogAbhaCard.dismiss();
//                EventBus.getDefault().post(new EventModel(""));
//                if (!isFromAdd) {
//                    if (listener != null) {
//                        // listener.onAbhaCardDownloaded(abhaNumber, abhaAddress);
//                        listener.onAbhaCardDownloaded(abhaNumber, abhaAddress,updateFirstName,updateMiddleName,updateLastName,updateAddress,updateDOB,updateGender);
//                    }
//                } else {
//                    if (responseAddNewPatient != null) {
//                        if (listenerAddNewPatient != null) {
//                            listenerAddNewPatient.onNewPatientOnboardAdded(responseAddNewPatient, userAayushId);
//                        }
//                    }
//                }
//
                progressBar.setVisibility(VISIBLE);
                btnPrint.setVisibility(GONE);
                if (isFromMobileOtp) {
                    downloadPhrAbhaCard1(token, imgAbhaCard);
                } else {
                    downloadAbhaCard1("Bearer " + token, imgAbhaCard, false);
                }
            }
        });
    }

    //TODO second abha address link flow
    public static void showAbhaCard1(Boolean isFromUserNameVerify, Boolean isFromMobileOtp) {
        Log.i("myLog", "showAbhaCard");
        dialogAbhaCard = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.dialog_abha_card, null);
        dialogAbhaCard.setContentView(view);
        dialogAbhaCard.setCancelable(false);

        btnPrint = dialogAbhaCard.findViewById(R.id.btn_print);
        Button btnClose = dialogAbhaCard.findViewById(R.id.btn_close);
        ImageView imgClose = dialogAbhaCard.findViewById(R.id.imgClose);
        ImageView imgAbhaCard = dialogAbhaCard.findViewById(R.id.imgAbhaCard);
        progressBar = dialogAbhaCard.findViewById(R.id.progressBar);
        dialogAbhaCard.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogAbhaCard.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogAbhaCard.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(670, abhaContext);
        dialogAbhaCard.getWindow().setAttributes(lp);
        if (isFromUserNameVerify) {

            downloadAbhaCard(token, imgAbhaCard, isFromUserNameVerify);
        } else if (isFromMobileOtp) {
            downloadPhrAbhaCard(token, imgAbhaCard);
        } else {
            downloadAbhaCard("Bearer " + token, imgAbhaCard, false);
        }
        btnClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogAbhaCard.dismiss();
                getAayushUnique1(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogAbhaCard.dismiss();
                getAayushUnique1(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);

            }
        });
        btnPrint.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                progressBar.setVisibility(VISIBLE);
                btnPrint.setVisibility(GONE);
                if (isFromMobileOtp) {
                    downloadPhrAbhaCard1(token, imgAbhaCard);
                } else {
                    downloadAbhaCard1("Bearer " + token, imgAbhaCard, false);
                }
            }
        });
    }
    private static void downloadPhrAbhaCard(String inputToken, ImageView imgAbhaCard) {
        Call<ResponseBody> call = null;
        OPHubRequests.GetAbhaCardRequest request = new OPHubRequests.GetAbhaCardRequest();
        request.setToken(inputToken);
        System.out.println("print token " + inputToken);
        call = abhaServices.getPhrAbhaCardDownload(request);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                if (response.body() != null) {
                    Log.i("myLog", "server contacted and has file");
                    try {
                        byte[] bytes = response.body().bytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                        bitmapAbhaCard = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                        imgAbhaCard.setImageBitmap(bitmapAbhaCard);
                        Log.i("myLog", "after image set");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }


    private static void downloadAbhaCard(String token, ImageView img, Boolean isFromUserNameVerify) {
        Log.i("mylog", "downloadAbhaCard isFromUserNameVerify:" + isFromUserNameVerify);
        Call<ResponseBody> call = null;
        if (isFromUserNameVerify) {
            OPHubRequests.UserNameVerifyCardToken request = new OPHubRequests.UserNameVerifyCardToken();
            request.setToken(token);
            Log.i("mylog", "downloadAbhaCardUserVerify request:" + request);
            call = abhaServices.downloadAbhaCardUserVerify(request);
        } else {
            Log.i("mylog", "downloadAbhaCard token:" + token);
            call = abhaServices.downloadAbhaCard(token);
        }
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                if (response.body() != null) {
                    Log.i("myLog", "server contacted and has file");
                    try {
                        byte[] bytes = response.body().bytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                        bitmapAbhaCard = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                        img.setImageBitmap(bitmapAbhaCard);

                        Log.i("myLog", "after image set");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }



    private static void downloadPhrAbhaCard1(String inputToken, ImageView imgAbhaCard) {
        Call<ResponseBody> call = null;
        OPHubRequests.GetAbhaCardRequest request = new OPHubRequests.GetAbhaCardRequest();
        request.setToken(inputToken);
        System.out.println("print token " + inputToken);
        call = abhaServices.getPhrAbhaCardDownload(request);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                progressBar.setVisibility(GONE);
                btnPrint.setVisibility(VISIBLE);
                if (response.body() != null) {
                    Log.i("myLog", "server contacted and has file");
                    try {
                        byte[] bytes = response.body().bytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                        bitmapAbhaCard = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                        imgAbhaCard.setImageBitmap(bitmapAbhaCard);
                        Log.i("myLog", "after image set");
                        savePngToStorage(decodedImageBytes);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });
    }


    private static void downloadAbhaCard1(String token, ImageView img, Boolean isFromUserNameVerify) {
        Log.i("mylog", "downloadAbhaCard isFromUserNameVerify:" + isFromUserNameVerify);
        Call<ResponseBody> call = null;
        if (isFromUserNameVerify) {
            OPHubRequests.UserNameVerifyCardToken request = new OPHubRequests.UserNameVerifyCardToken();
            request.setToken(token);
            Log.i("mylog", "downloadAbhaCardUserVerify request:" + request);
            call = abhaServices.downloadAbhaCardUserVerify(request);
        } else {
            Log.i("mylog", "downloadAbhaCard token:" + token);
            call = abhaServices.downloadAbhaCard(token);
        }
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                progressBar.setVisibility(GONE);
                btnPrint.setVisibility(VISIBLE);
                if (response.body() != null) {
                    Log.i("myLog", "server contacted and has file");
                    try {
                        byte[] bytes = response.body().bytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                        bitmapAbhaCard = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                        img.setImageBitmap(bitmapAbhaCard);

                        Log.i("myLog", "after image set");
                        savePngToStorage(decodedImageBytes);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(abhaContext);
            }
        });

    }


    private static void savePngToStorage(byte[] imageBytes) {
        String fileName = "ABHA_Card.png";

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, fileName);
            values.put(MediaStore.Downloads.MIME_TYPE, "image/png");
            values.put(MediaStore.Downloads.IS_PENDING, 1);

            ContentResolver resolver = abhaContext.getContentResolver();
            Uri collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
            Uri fileUri = resolver.insert(collection, values);

            if (fileUri != null) {
                try {
                    OutputStream out = resolver.openOutputStream(fileUri);
                    out.write(imageBytes);
                    out.close();

                    values.clear();
                    values.put(MediaStore.Downloads.IS_PENDING, 0);
                    resolver.update(fileUri, values, null, null);

                    Log.i("myLog", "PNG saved to Downloads: " + fileUri.toString());
                    Toast.makeText(abhaContext, "ABHA Card downloaded successfully:\n" + fileUri.toString(), Toast.LENGTH_LONG).show();

                } catch (IOException e) {
                    Log.e("myLog", "Failed to save PNG to Downloads: " + e.getMessage());
                }
            }
        } else {
            File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
            File pngFile = new File(downloadsDir, fileName);

            try {
                FileOutputStream fos = new FileOutputStream(pngFile);
                fos.write(imageBytes);
                fos.close();

                Log.i("myLog", "PNG saved to Downloads folder: " + pngFile.getAbsolutePath());
                Toast.makeText(abhaContext, "ABHA Card downloaded successfully:\n" + pngFile.getAbsolutePath(), Toast.LENGTH_LONG).show();
            } catch (IOException e) {
                Log.e("myLog", "Error saving PNG to Downloads: " + e.getMessage());
            }
        }
    }
    private static int dpToPx(int dp) {
        float density = abhaContext.getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    private static int dpToPx(int dp, Context context) {
        float density = context.getResources().getDisplayMetrics().density;
        return Math.round(dp * density);
    }

    public static void setImage(Bitmap image) {
        profImage.setImageBitmap(image);
        try {
            String string = imageFileToByteStreamString(image);
            selectedImageStream = string;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String imageFileToByteStreamString(Bitmap bitmap) {
        if (bitmap == null) {
            throw new RuntimeException("Failed to decode image from path: ");
        }
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String base64String = Base64.encodeToString(byteArray, Base64.DEFAULT);

        return base64String;
    }

    // Define an interface to listen for events
    public interface AbhaListener {
        void onAbhaCardDownloaded(String AbhaNumber, String AbhaAddress, String first,String middle, String last,  String add, String dob, String gender);

        void onDialogClose();

        void onAbhaQR(String aayusId);
    }

    // Method to set the listener from outside
    public void setMyListener(AbhaListener listener) {
        this.listener = listener;
    }


    // Define an interface to listen for events
    public interface AddNewPatientListener {
        void onNewPatientOnboardAdded(Response<List<DataResponse>> response,String userAayushId );
        void onAbhaQR(String aayusId);
    }

    // Method to set the listener from outside
    public void setListenerAddNewPatient(AddNewPatientListener listener) {
        this.listenerAddNewPatient = listener;
    }


    public static void printAbhaCard(Bitmap bitmap) {
        PrintHelper photoPrinter = new PrintHelper(abhaContext);
        photoPrinter.setScaleMode(PrintHelper.SCALE_MODE_FIT);
        //  Bitmap bitmap = ((BitmapDrawable) imageView.getDrawable()).getBitmap();
        photoPrinter.printBitmap("test print", bitmap);
    }


    public static void demographic(){
        Log.i("myLog", "showCompareDialog");
        demographic = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.abha_demographic_dialog, null);
        demographic.setContentView(view);
        TextView txtName = demographic.findViewById(R.id.name);
        TextView dob = demographic.findViewById(R.id.dob);
        TextView gender = demographic.findViewById(R.id.gender);
        TextView mobileNum = demographic.findViewById(R.id.mobile_no);
        TextView abhaNum = demographic.findViewById(R.id.abhanum);
        TextView abhaAdd = demographic.findViewById(R.id.abha_add);
        TextView state = demographic.findViewById(R.id.state);
        TextView district = demographic.findViewById(R.id.district);
        TextView pinCode = demographic.findViewById(R.id.pin_code);
        TextView address = demographic.findViewById(R.id.address);
        Button btnAbha = demographic.findViewById(R.id.btnAbha);
        Button btnContinue = demographic.findViewById(R.id.btnContinue);
        ImageView imgClose = demographic.findViewById(R.id.imgClose);
        ImageView cardImage = demographic.findViewById(R.id.card_image);

        demographic.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        demographic.setCancelable(false);
        demographic.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(demographic.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(550, abhaContext);
        demographic.getWindow().setAttributes(lp);

        txtName.setText(updateFirstName +" " + updateMiddleName + " " + updateLastName);
        dob.setText(updateDOB);
        gender.setText(updateGender);
        mobileNum.setText(updateMobile);
        abhaNum.setText(abhaNumber);
        abhaAdd.setText(abhaAddress);
        state.setText(updateState);
        district.setText(updateDistric);
        pinCode.setText(updatePincode);
        address.setText(updateAddress);
        byte[] bytes = updatePhoto.getBytes();

        if (bytes != null) {
            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
            if (decodedImageBytes != null) {
                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                if (bitmap != null) {
                    cardImage.setImageBitmap(bitmap);
                    Log.i("myLog", "after image set");
                }
            }
        }

        btnAbha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                demographic.dismiss();
                showCard = true;
//                checkAddressNumberAdapter();
                addonboradpatient(abhaNumber,updateFirstName +" "+updateMiddleName+" "+updateLastName,updateAddress,updateGender,updateMobile,updateDOB);
            }
        });

        btnContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                demographic.dismiss();
                showCard = false;
//                checkAddressNumberAdapter();
                addonboradpatient(abhaNumber,updateFirstName +" "+updateMiddleName+" "+updateLastName,updateAddress,updateGender,updateMobile,updateDOB);
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                demographic.dismiss();
                showCard = false;
//                checkAddressNumberAdapter();
                addonboradpatient(abhaNumber,updateFirstName +" "+updateMiddleName+" "+updateLastName,updateAddress,updateGender,updateMobile,updateDOB);
            }
        });

    }

    public static void secondAbhaAdressDemographic(){
        Log.i("myLog", "showCompareDialog");
        demographic = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.abha_demographic_dialog, null);
        demographic.setContentView(view);
        TextView txtName = demographic.findViewById(R.id.name);
        TextView dob = demographic.findViewById(R.id.dob);
        TextView gender = demographic.findViewById(R.id.gender);
        TextView mobileNum = demographic.findViewById(R.id.mobile_no);
        TextView abhaNum = demographic.findViewById(R.id.abhanum);
        TextView abhaAdd = demographic.findViewById(R.id.abha_add);
        TextView state = demographic.findViewById(R.id.state);
        TextView district = demographic.findViewById(R.id.district);
        TextView pinCode = demographic.findViewById(R.id.pin_code);
        TextView address = demographic.findViewById(R.id.address);
        Button btnAbha = demographic.findViewById(R.id.btnAbha);
        Button btnContinue = demographic.findViewById(R.id.btnContinue);
        ImageView imgClose = demographic.findViewById(R.id.imgClose);
        ImageView cardImage = demographic.findViewById(R.id.card_image);

        demographic.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        demographic.setCancelable(false);
        demographic.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(demographic.getWindow().getAttributes());
        lp.width = dpToPx(800, abhaContext);
        lp.height = dpToPx(550, abhaContext);
        demographic.getWindow().setAttributes(lp);

        txtName.setText(updateFirstName +" " + updateMiddleName + " " + updateLastName);
        dob.setText(updateDOB);
        gender.setText(updateGender);
        mobileNum.setText(updateMobile);
        abhaNum.setText(abhaNumber);
        abhaAdd.setText(abhaAddress);
        state.setText(updateState);
        district.setText(updateDistric);
        pinCode.setText(updatePincode);
        address.setText(updateAddress);
        byte[] bytes = updatePhoto.getBytes();

        if (bytes != null) {
            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
            if (decodedImageBytes != null) {
                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                if (bitmap != null) {
                    cardImage.setImageBitmap(bitmap);
                    Log.i("myLog", "after image set");
                }
            }
        }

        btnAbha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                demographic.dismiss();
                showCard = true;
//                checkAddressNumberAdapter();

                if (showCard){
                    showAbhaCard1(false, false);
                }else {
                    if (responseAddNewPatient != null) {
                        if (listenerAddNewPatient != null) {
                            listenerAddNewPatient.onNewPatientOnboardAdded(responseAddNewPatient, userAayushId);
                        }
                    }
                }

//                getAayushUnique(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);
//                addonboradpatient(abhaNumber,updateFirstName,updateAddress,updateGender,updateMobile,updateDOB);
            }
        });

        btnContinue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                demographic.dismiss();
                showCard = false;

                getAayushUnique1(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);

//                checkAddressNumberAdapter();
//                getAayushUnique(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);
//                addonboradpatient(abhaNumber,updateFirstName,updateAddress,updateGender,updateMobile,updateDOB);
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                demographic.dismiss();
                showCard = false;
//                checkAddressNumberAdapter();
                getAayushUnique(abhaContext.getString(R.string.abha_address_link_success), "ABHA_CARD", false, false);
//                addonboradpatient(abhaNumber,updateFirstName,updateAddress,updateGender,updateMobile,updateDOB);
            }
        });

    }


    private static void checkExistingPatient() {

        Log.i("mylog", "addNewPatient");
        Integer hospitalID = OPHubApplication.getHospitalId();
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("patient_name", updateFirstName + " " + updateMiddleName + " " + updateLastName);
        requestData.put("dob", updateDOB);
        requestData.put("mobileno",updateMobile);
        requestData.put("gender", updateGender);
        requestData.put("hospital_id", String.valueOf(hospitalID));
        Log.i("mylog", "checkExistingPatient request:" + new Gson().toJson(requestData));
        Call<List<DataResponse>> call = services.checkExistingPatient(requestData);
        call.enqueue(new Callback<List<DataResponse>>() {

            @Override
            public void onResponse(Call<List<DataResponse>> call, Response<List<DataResponse>> response) {
                try {
                    Log.i("myLog", "checkExistingPatient response:");
                    Log.i("mylog", "checkExistingPatient response:" + new Gson().toJson(response.body()));

                    if (response.body() != null) {
                        if (response.body().get(0).getStatus().equalsIgnoreCase("failed")){
    //                        OPHubUtils.showErrorDialog(abhaContext, "unable to add patient profile same dob and mobile number");
                            if (response.body().get(0).getExistingPatientDetails() != null) {

                                oldPatient = response.body().get(0).getExistingPatientDetails();
                                System.out.println("print old patient  " + oldPatient);

                            }else {
                                oldPatient = null;
                            }

                        }
                        oldPatient = null;
                    }else {
                        oldPatient = null;
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(abhaContext);
                }

            }

            public void onFailure(Call<List<DataResponse>> call, Throwable t) {
                Log.i("myLog", "addNewOnboradPatient response failure:" + t.toString());
                Log.i("myLog", "addNewOnboradPatient response failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //  call.clone().enqueue(this);
            }
        });
    }


    public static void showcompareDialog() {
        Log.i("myLog", "showCompareDialog");
        dialogCompare = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.onboard_compare_abha_mobile_screen, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogCompare.setContentView(view);
        ImageView imgClose = dialogCompare.findViewById(R.id.imgClose);
        ImageView cardImage = dialogCompare.findViewById(R.id.card_image);
        ImageView cardHims = dialogCompare.findViewById(R.id.card_images);
        TextView txt_name = dialogCompare.findViewById(R.id.txt_name);
        TextView patiendDob = dialogCompare.findViewById(R.id.patiendDob);
        TextView patiendgenter = dialogCompare.findViewById(R.id.patiendgenter);
        TextView patiendmobile = dialogCompare.findViewById(R.id.patiendmobile);
        TextView patiendaddress = dialogCompare.findViewById(R.id.patiendaddress);
        TextView abhaname = dialogCompare.findViewById(R.id.abhaname);
        TextView abhadob = dialogCompare.findViewById(R.id.abhadob);
        TextView abhamobile = dialogCompare.findViewById(R.id.abhamobile);
        TextView abhamobileadd = dialogCompare.findViewById(R.id.abhamobileadd);
        TextView abhaaddress = dialogCompare.findViewById(R.id.abhaaddress);
        TextView abhagender = dialogCompare.findViewById(R.id.abhagender);
        TextView abhaadrs = dialogCompare.findViewById(R.id.abhaadrs);
        Button linkpatiend = dialogCompare.findViewById(R.id.linkpatiend);
        Button btnhisdata = dialogCompare.findViewById(R.id.btnhisdata);
        Button onboard = dialogCompare.findViewById(R.id.onboard);
        LinearLayout lytNoRecord = dialogCompare.findViewById(R.id.lyt_no_record);
        LinearLayout lytHims = dialogCompare.findViewById(R.id.lyt_hims);

//        edtAadhaarNo.addTextChangedListener(new AbhaGetOtpFragment.FourDigitCardFormatWatcher());
        dialogCompare.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogCompare.setCancelable(false);
        dialogCompare.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogCompare.getWindow().getAttributes());
        lp.width = dpToPx(900, abhaContext);
        lp.height = dpToPx(720, abhaContext);
        dialogCompare.getWindow().setAttributes(lp);
        System.out.println("upadate" + updateAddress);
        System.out.println("upadate" + abhaAddress);
        System.out.println("upadate" + updateDOB);
        System.out.println("upadate" + abhaNumber);
        String name = updateFirstName + " " + updateMiddleName+ " " + updateLastName;
        abhaname.setText(name);
        abhadob.setText(updateDOB);
        abhaaddress.setText(updateAddress);
        abhaadrs.setText(abhaAddress);
        abhagender.setText(updateGender);
        System.out.println("mobilesss" + updateMobile);
        abhamobile.setText(updateMobile);
        abhamobileadd.setText(abhaNumber);

        System.out.println("print oldpatine compare " + oldPatient);
        if (oldPatient != null){
        txt_name.setText(oldPatient.getPatientName());
        patiendDob.setText(oldPatient.getDob());
        patiendgenter.setText(oldPatient.getGender());
        patiendmobile.setText(oldPatient.getMobileno());
        patiendaddress.setText(oldPatient.getAddress());
        showProfileimage(oldPatient.getImage(), cardHims);
            lytHims.setVisibility(VISIBLE);
            lytNoRecord.setVisibility(GONE);
        }else {
            lytHims.setVisibility(GONE);
            lytNoRecord.setVisibility(VISIBLE);
        }

        byte[] bytes = updatePhoto.getBytes();

        if (bytes != null) {
            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
            if (decodedImageBytes != null) {
                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                if (bitmap != null) {
                    cardImage.setImageBitmap(bitmap);
                    Log.i("myLog", "after image set");
                }
            }
        }


        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogCompare.dismiss();
                demographic();
            }
        });


        linkpatiend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogCompare.dismiss();
                demographic();
            }
        });
    }

    public static void showcompareSecondDialog() {
        Log.i("myLog", "showCompareDialog");
        dialogCompare = new Dialog(abhaContext);
        View view = LayoutInflater.from(abhaContext).inflate(R.layout.onboard_compare_abha_mobile_screen, null);
        //   dialogMobileOTP.getWindow().setGravity(Gravity.END);
        dialogCompare.setContentView(view);
        ImageView imgClose = dialogCompare.findViewById(R.id.imgClose);
        ImageView cardImage = dialogCompare.findViewById(R.id.card_image);
        ImageView cardHims = dialogCompare.findViewById(R.id.card_images);
        TextView txt_name = dialogCompare.findViewById(R.id.txt_name);
        TextView patiendDob = dialogCompare.findViewById(R.id.patiendDob);
        TextView patiendgenter = dialogCompare.findViewById(R.id.patiendgenter);
        TextView patiendmobile = dialogCompare.findViewById(R.id.patiendmobile);
        TextView patiendaddress = dialogCompare.findViewById(R.id.patiendaddress);
        TextView abhaname = dialogCompare.findViewById(R.id.abhaname);
        TextView abhadob = dialogCompare.findViewById(R.id.abhadob);
        TextView abhamobile = dialogCompare.findViewById(R.id.abhamobile);
        TextView abhamobileadd = dialogCompare.findViewById(R.id.abhamobileadd);
        TextView abhaaddress = dialogCompare.findViewById(R.id.abhaaddress);
        TextView abhagender = dialogCompare.findViewById(R.id.abhagender);
        TextView abhaadrs = dialogCompare.findViewById(R.id.abhaadrs);
        Button linkpatiend = dialogCompare.findViewById(R.id.linkpatiend);
        Button btnhisdata = dialogCompare.findViewById(R.id.btnhisdata);
        Button onboard = dialogCompare.findViewById(R.id.onboard);
        LinearLayout lytNoRecord = dialogCompare.findViewById(R.id.lyt_no_record);
        LinearLayout lytHims = dialogCompare.findViewById(R.id.lyt_hims);

//        edtAadhaarNo.addTextChangedListener(new AbhaGetOtpFragment.FourDigitCardFormatWatcher());
        dialogCompare.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogCompare.setCancelable(false);
        dialogCompare.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogCompare.getWindow().getAttributes());
        lp.width = dpToPx(900, abhaContext);
        lp.height = dpToPx(720, abhaContext);
        dialogCompare.getWindow().setAttributes(lp);
        System.out.println("upadate" + updateAddress);
        System.out.println("upadate" + abhaAddress);
        System.out.println("upadate" + updateDOB);
        System.out.println("upadate" + abhaNumber);
        String name = updateFirstName + " " + updateMiddleName + " " + updateLastName;
        abhaname.setText(name);
        abhadob.setText(updateDOB);
        abhaaddress.setText(updateAddress);
        abhaadrs.setText(abhaAddress);
        abhagender.setText(updateGender);
        System.out.println("mobilesss" + updateMobile);
        abhamobile.setText(updateMobile);
        abhamobileadd.setText(abhaNumber);

        System.out.println("print oldpatine second compare " + oldPatient);
        if (oldPatient != null){
            txt_name.setText(oldPatient.getPatientName());
            patiendDob.setText(oldPatient.getDob());
            patiendgenter.setText(oldPatient.getGender());
            patiendmobile.setText(oldPatient.getMobileno());
            patiendaddress.setText(oldPatient.getAddress());
            showProfileimage(oldPatient.getImage(), cardHims);
            lytHims.setVisibility(VISIBLE);
            lytNoRecord.setVisibility(GONE);
        }else {
            lytHims.setVisibility(GONE);
            lytNoRecord.setVisibility(VISIBLE);
        }

        byte[] bytes = updatePhoto.getBytes();

        if (bytes != null) {
            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
            if (decodedImageBytes != null) {
                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                if (bitmap != null) {
                    cardImage.setImageBitmap(bitmap);
                    Log.i("myLog", "after image set");
                }
            }
        }


        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogCompare.dismiss();
                secondAbhaAdressDemographic();
            }
        });


        linkpatiend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogCompare.dismiss();
                secondAbhaAdressDemographic();
                }
        });
    }



    private static void showProfileimage(String images, ImageView image) {
        Log.i("myLog", "showProfileImage");
        Log.i("myLog", "imgName:Get" + images);
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setKey(images);
        Log.i("mylog", "Image request : " + new Gson().toJson(request));
        Call<ResponseBody> call = imageServices.getProfileImageNew(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.body() != null) {
                    Log.i("myLog", "server contacted and has file");

                    try {
                        byte[] bytes = response.body().bytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        if (bytes != null) {
                            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                            if (decodedImageBytes != null) {
                                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                                if (bitmap != null) {
                                    image.setImageBitmap(bitmap);
                                    Log.i("myLog", "after image set");
                                }
                            }
                        }
                    } catch (Exception e) {
                        Log.e("myLog", "Error decoding image", e);
                    }

                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "getProfileImage response failure:" + t.toString());
            }
        });
    }
    private static void updateAbhaNumber(Boolean alreadyLink) {
            Call<ResponseBody> call = services.updateAbhaNumber(String.valueOf(hositalID), getAAyushNumber, abhaNumber);
            call.enqueue(new Callback<ResponseBody>() {

                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (alreadyLink) {
                        alreadyLinked();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {


                }
            });

    }




}
