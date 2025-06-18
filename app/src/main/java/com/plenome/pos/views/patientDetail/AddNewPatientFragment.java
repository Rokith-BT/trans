package com.plenome.pos.views.patientDetail;

import static android.app.Activity.RESULT_OK;
import static android.view.View.GONE;
import static android.view.View.VISIBLE;


import static com.plenome.pos.views.ClinicalNotesFragment.getFileFromUri;

import android.Manifest;
import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.ImageDecoder;
import android.graphics.drawable.PictureDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Base64;
import android.util.Log;
import android.util.Patterns;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.airbnb.lottie.LottieAnimationView;
import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.request.RequestOptions;
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYou;
import com.google.gson.Gson;
import com.imin.printerlib.IminPrintUtils;
import com.mikhaellopez.circularimageview.CircularImageView;
import com.plenome.pos.R;
import com.plenome.pos.adapters.CountryCodeAdapter;
import com.plenome.pos.model.AbhaAddrCreationRequest;
import com.plenome.pos.model.BloodGroupResponse;
import com.plenome.pos.model.DataResponse;
import com.plenome.pos.model.GetPatientProfileResponse;
import com.plenome.pos.model.ImageResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.UpdatePatientResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.AbhaDialogUtils;
import com.plenome.pos.utils.AbhaOnboradDialogUtils;
import com.plenome.pos.utils.CameraUtils;
import com.plenome.pos.utils.MessageEvent;
import com.plenome.pos.utils.NfcEvent;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.CreateAbhaFragment;
import com.plenome.pos.views.OPHubApplication;
//import com.theartofdev.edmodo.cropper.CropImage;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.joda.time.Period;
import org.joda.time.PeriodType;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.OnItemSelected;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddNewPatientFragment extends Fragment implements AbhaOnboradDialogUtils.AddNewPatientListener {
    private View rootView;
    private RestServices services, fileServices, abhaServices,imageServices;
    private int patientId, hospId, width, height, textSize, age, apptStatusId, bloodGrpId;
    private TableRow.LayoutParams txtParam, lineParam, imgParam;
    private Dialog dialogViewFile, dialogFilter, dialogABHA, dialogMobileOTP, dialogVerifyOTP, dialogProfileDet,
            dialogCreateAbhaAddr, dialogSuccess, dialogAbhaCard, dialogSelectAbhaAddr,
            dialogVerifyAbhaAddr, dialogOtpOption, dialogAadhaarOTP, dialogAbhaOTP, dialogCommInfo, nfcdialog;
    private AlertDialog dialog;
    private String fromScreen, name, gender, salutation, email, phone, hid, image= "", pincode, dialCode, emergencyNo, medicalHistory, insuranceNo, insuranceValidity,
            bloodgroup, fromMenu, abhaNo, dob, address, option = "", qrType = "", json, patientType = "", apptStatus, abhaAddress;
    private ArrayList<Integer> doctorId, bloodGrpIdAL, alStatusId;
    private ArrayList<String> countryName, countryDialCode, countryIso, countryFlag, bloodGroupAL, alStatus, genderAL;
    private String selAbhaOption, token, currentPhotoPath, selectedGender, selectedState, selectedStateCode, selectedDistrict, selectedDistrictCode,
            selectedDay, selectedMonth, selectedYear, selectedImageStream, abhaNumber, aayushNumber,FaceKey,ImageUrls;
    private boolean isEditMobileClicked = false;
    private static final int PICK_IMAGE_REQUEST = 100;
    private ImageView profImage;
    private IminPrintUtils mIminPrintUtils;
    Thread thread;
    Bitmap bitmapAbhaCard;
    private TextView profDob, suggestionTxt1, suggestionTxt2, suggestionTxt3;
    AbhaAddrCreationRequest abhaAddrCreateReq;
    private AbhaDialogUtils abhaDialogUtils;

    private Dialog underDevelop;
    private AbhaOnboradDialogUtils abhaOnboradDialogUtils;

    private static final int CAMERA_REQUEST_CODE = 1001;
    private Uri imageUri;

    private Integer kycVerify;

    @BindView(R.id.edtName)
    EditText edtPatientName;

    @BindView(R.id.spinGender)
    Spinner spinGender;

    @Nullable
    @BindView(R.id.spinDistrict)
    Spinner spinDistrict;

    @BindView(R.id.spinSalutation)
    Spinner spinSalutation;

    @BindView(R.id.relPrimaryNo)
    RelativeLayout relPrimaryFlag;

    @BindView(R.id.relEmergencyNo)
    RelativeLayout relEmergencyNo;

    @BindView(R.id.edtPrimaryNo)
    EditText edtPrimaryNo;

    @BindView(R.id.txtEmergencyNoCode)
    TextView txtEmergencyCode;

    @BindView(R.id.txtPrimaryNoCode)
    TextView txtPrimaryCode;

    @BindView(R.id.edtEmergencyNo)
    EditText edtEmergencyNo;

    @BindView(R.id.edtMedicalHistory)
    EditText edtMedicalHistory;

    @BindView(R.id.edtDob)
    EditText edtDob;

    @BindView(R.id.imgDob)
    View imgDob;

    @BindView(R.id.edtEmail)
    EditText edtEmail;

    @BindView(R.id.edtAbhaNo)
    EditText edtAbhaNo;

    @BindView(R.id.edtInsuranceNo)
    EditText edtInsuranceNo;

    @BindView(R.id.edtAge)
    EditText edtAge;

    @BindView(R.id.spinBloodGroup)
    Spinner spinBloodGroup;

    @BindView(R.id.edtPermenantAddr)
    EditText edtPermenantAddr;

    @BindView(R.id.imgProfile)
    CircularImageView imgProfile;

    @BindView(R.id.scrollView)
    ScrollView scrollView;

    @BindView(R.id.listView)
    ListView listView;

    @BindView(R.id.imgFlagPrimaryNo)
    ImageView imgFlagPrimaryNo;

    @BindView(R.id.imgFlagEmergencyNo)
    ImageView imgFlagEmergencyNo;

    @BindView(R.id.edtInsuranceValidity)
    TextView txtInsuranceValidity;

    @BindView(R.id.txtCreateABHA)
    TextView txtCreateABHA;

    @BindView(R.id.lyt_name)
    LinearLayout lytName;

    @BindView(R.id.lyt_primary)
    LinearLayout lytPrimary;

    @BindView(R.id.err_lyt_1)
    LinearLayout errorLayout1;
    @BindView(R.id.err_lyt_3)
    LinearLayout errorLayout3;

    @BindView(R.id.err_lyt_2)
    LinearLayout errorLayout2;

    @BindView(R.id.err_name)
    TextView errorTextName;

    @BindView(R.id.imgCamera)
    View imgCamera;

    @BindView(R.id.err_age)
    TextView errorTextAge;

    @BindView(R.id.err_dob)
    TextView errorTextDob;

    @BindView(R.id.err_mobile_number)
    TextView errorMobileNumber;

    @BindView(R.id.err_address)
    TextView erroraddress;

    @BindView(R.id.err_gender)
    TextView errGender;

    @BindView(R.id.err_email)
    TextView errorEmail;

    @BindView(R.id.nfcCard)
    ImageView nfcCard;

    @BindView(R.id.loader)
    LinearLayout loader;

    @BindView(R.id.btnABHA)
    Button btnABHA;

    @BindView(R.id.btnSubmit)
    Button btnSubmit;

    @BindView(R.id.kyc_text)
    TextView kycText;



    GetPatientProfileResponse resp;
    private boolean isDeleting = false;
    private boolean isWrongDate = false;
    private boolean isWrongMonth = false, isWrongYear = false, isRunning = false;
    private boolean nfcImage = false;
    boolean isUpdatingDob = false;
    boolean isUpdatingAge = false;



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_add_new_patient, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        abhaServices = RetrofitInstance.createAbhaService(RestServices.class);
        imageServices = RetrofitInstance.createImageUrl(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.patient_profile);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        OPHubApplication.flagScrollView = scrollView;
        OPHubApplication.flagListView = listView;
        abhaOnboradDialogUtils = new AbhaOnboradDialogUtils();
        abhaOnboradDialogUtils.setListenerAddNewPatient(this);
        Bundle bundle = getArguments();
        if (bundle != null) {
            abhaNo = bundle.getString("abha_no");
            edtAbhaNo.setText(abhaNo);
            hospId = bundle.getInt("hospital_id");
            patientId = bundle.getInt("patient_id");
            fromScreen = bundle.getString("from_screen");
            name = bundle.getString("name");
            gender = bundle.getString("gender");
            bloodgroup = bundle.getString("bloodGroup");
            bloodGrpId = bundle.getInt("bloodGroupId");
            phone = bundle.getString("phone");
            dob = bundle.getString("dob");
            email = bundle.getString("email");
            abhaNo = bundle.getString("abha_no");
            address = bundle.getString("address");
            image = bundle.getString("image");
            salutation = bundle.getString("salutation");
            pincode = bundle.getString("pincode");
            dialCode = bundle.getString("dial_code");
            age = bundle.getInt("age");
            abhaAddress = bundle.getString("abha_address");
            emergencyNo = bundle.getString("emergency_mobile_no");
            nfcImage = bundle.getBoolean("nfc");
            aayushNumber = bundle.getString("aayushNo");
            insuranceNo = bundle.getString("insurance_no");
            insuranceValidity = bundle.getString("insurance_validity");
            medicalHistory = bundle.getString("medical_history");
            kycVerify = bundle.getInt("kyc_verified");


           showProfileImage();
            Log.i("myLog", "insuranceNo:" + insuranceNo + "  insuranceValidity:" + insuranceValidity + "   medicalHistory:" + medicalHistory);
            if (email == null || email.equalsIgnoreCase("-")) {
                email = "";
            }
            if (nfcImage){
                nfcCard.setVisibility(View.VISIBLE);
            }else
                nfcCard.setVisibility(View.GONE);

            if (fromScreen.equalsIgnoreCase("Patient_id_search")) {
                Log.i("myLog", "phone:::" + phone + "   fromScreen:" + fromScreen);
              //  edtAbhaNo.setText(abhaNo);
                btnABHA.setVisibility(VISIBLE);
                edtPrimaryNo.setText(phone);
            } else {
                Log.i("myLog", "from_menu:" + fromMenu + "   fromScreen:" + fromScreen);
                Log.i("mYlog", "blood group:" + bloodgroup + "    dob:" + dob + "    address:" + address+ "    abha no : "+ abhaAddress );
              //  edtPatientName.setEnabled(false);
                btnABHA.setVisibility(GONE);
                edtPatientName.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                edtDob.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                edtPrimaryNo.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                txtPrimaryCode.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                edtAge.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                edtPatientName.setText(name);
                edtAge.setText(String.valueOf(age));
                edtEmail.setText(email);
                edtAbhaNo.setText(abhaNo);
                edtDob.setText(dob);
                edtPermenantAddr.setText(address);
                edtPrimaryNo.setText(phone);
                txtPrimaryCode.setText(dialCode);
                txtEmergencyCode.setText(dialCode);
                edtEmergencyNo.setText(emergencyNo);
                edtMedicalHistory.setText(medicalHistory);
                edtInsuranceNo.setText(insuranceNo);
                txtInsuranceValidity.setText(insuranceValidity);
                if (kycVerify.equals(1)) {
                    kycText.setVisibility(VISIBLE);
                    edtDob.setEnabled(false);
                    edtPrimaryNo.setEnabled(false);
                    edtEmergencyNo.setEnabled(false);
                    imgDob.setEnabled(false);
                    edtAge.setEnabled(false);
                    edtAge.setFocusable(false);
                    edtAge.setClickable(false);
                    edtPatientName.setEnabled(false);
                    spinSalutation.setEnabled(false);
                    spinSalutation.setFocusable(false);
                    spinSalutation.setClickable(false);
                    relPrimaryFlag.setEnabled(false);
                    relEmergencyNo.setEnabled(false);
                    edtPermenantAddr.setEnabled(false);
                    spinGender.setEnabled(false);
                    edtPatientName.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    edtDob.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    edtPrimaryNo.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    edtEmergencyNo.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    txtEmergencyCode.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    txtPrimaryCode.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    edtAge.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                    edtPermenantAddr.setTextColor(ContextCompat.getColor(getActivity(), R.color.gray));
                }else{
                    edtPatientName.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                    edtDob.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                    edtPrimaryNo.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                    txtPrimaryCode.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                    edtAge.setTextColor(ContextCompat.getColor(getActivity(), R.color.black));
                }
                SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
                String currDate = sdf.format(new Date());
                Log.i("myLog", "DOB:" + dob);
                if (dob != null && dob.contains("-") && !dob.equalsIgnoreCase("-")) {
                    String[] selDob = dob.split("-");
                    String selDate = selDob[2] + "-" + selDob[1] + "-" + selDob[0];
                    Log.i("myLog", "selDate:" + selDate + "    currDate:" + currDate);
                    edtDob.setText(selDate);
                    ageCaluculate(selDate, currDate);
                }

                if (gender != null && gender.contains(",")) {
                    String[] genderArr = gender.split(",");
                    if (genderArr.length > 0)
                        gender = genderArr[0];
                }
            }
        }
        Log.i("myLog", "genderrr1111111111:" + gender);
        scrollView.setVisibility(View.GONE);
        loader.setVisibility(View.VISIBLE);
        //TODO salutation,blood group, gender API back to back call
        getCountryCode(dialCode);
        if (mIminPrintUtils == null) {
            mIminPrintUtils = IminPrintUtils.getInstance(getActivity());
        }
        mIminPrintUtils.resetDevice();
        hospId = OPHubApplication.getHospitalId();

        int widthInDp = 100;
        float scale = getResources().getDisplayMetrics().density;
        int px = (int) (widthInDp * scale + 0.5f);
        spinSalutation.setDropDownWidth(px);

        edtAge.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) { }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) { }

            @Override
            public void afterTextChanged(Editable e) {
                edtAge.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                errorTextAge.setVisibility(View.INVISIBLE);
                if (isUpdatingAge) return;


                String s = edtAge.getText().toString();
                Log.i("myLog", "onEditorAction:  s:" + s);
                if (s.length() > 0) {
                    try {
                        String age = s;
                        DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
                        Date currentDate = new Date();
                        String currDateTime = dateFormat.format(currentDate);
                        String[] currDate = currDateTime.split("-");
                        String year = currDate[2];
                        int birthYear = Integer.parseInt(year) - Integer.parseInt(age);
                        String birthDate = currDate[0] + "-" + currDate[1] + "-" + birthYear;

                        isUpdatingDob = true;
                        edtDob.setText(birthDate);
                        isUpdatingDob = false;

                    } catch (Exception ex) {
                        Log.e("myLog", "Error calculating DOB from age", ex);
                    }
                } else {
                    isUpdatingDob = true;
                    edtDob.setText("");
                    isUpdatingDob = false;
                }
            }
        });
//        edtAge.setOnEditorActionListener(new TextView.OnEditorActionListener() {
//            @Override
//            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
//                Log.i("myLog", "onEditorAction:");
//
//
//
//
//                return false;
//            }
//        });

        edtDob.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) { }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) { }

            @Override
            public void afterTextChanged(Editable s) {
                imgDob.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                errorTextDob.setVisibility(View.INVISIBLE);
                if (isUpdatingDob) return;

                String selDate = edtDob.getText().toString();
                Log.i("myLog", "onEditorAction:  selDate:" + selDate);
                SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
                try {
                    Date dob = sdf.parse(selDate);
                    Date today = new Date();

                    long timeDiff = today.getTime() - dob.getTime();
                    int years = (int) (timeDiff / (1000L * 60 * 60 * 24 * 365)); // rough age calc

                    isUpdatingAge = true;
                    edtAge.setText(String.valueOf(years));
                    isUpdatingAge = false;

                } catch (ParseException e) {
                    Log.e("myLog", "Invalid date format", e);
                }
            }
        });

//        edtDob.setOnEditorActionListener(new TextView.OnEditorActionListener() {
//            @Override
//            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
//                Log.i("myLog", "onEditorAction date:");
//                if (actionId == EditorInfo.IME_ACTION_DONE) {
//
//                }
//                return false;
//            }
//        });
     /*   edtAge.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (s.length() > 0) {
                    String age = s.toString();
                    Log.i("myLog", "age:" + age);
                    DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
                    Date date1 = new Date();
                    String currDateTime = dateFormat.format(date1);
                    Log.i("myLog", "currDateTime:" + currDateTime);
                    String[] currDate = currDateTime.split("-");
                    String year = currDate[2];
                    int birthyear = Integer.parseInt(year) - Integer.parseInt(age);
                    Log.i("myLog", "birthyear:" + birthyear);
                    String birthdate = currDate[0] + "-" + currDate[1] + "-" + birthyear;
                    Log.i("myLog", "birthdate:" + birthdate);
                    edtDob.setText(birthdate);
                } else {
                    edtDob.setText("");
                }
            }
        });*/
      /*  edtAbhaNo.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (s.length() > 0) {
                    txtCreateABHA.setVisibility(View.INVISIBLE);
                } else {
                    txtCreateABHA.setVisibility(View.VISIBLE);
                }
            }
        });*/


        edtPatientName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (s.length() > 0 && Character.isLowerCase(s.charAt(0))) {
                    s.replace(0, 1, String.valueOf(Character.toUpperCase(s.charAt(0))));
                }
                lytName.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                errorTextName.setVisibility(View.INVISIBLE);
            }
        });
        edtPrimaryNo.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                lytPrimary.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                errorMobileNumber.setVisibility(View.INVISIBLE);
            }
        });

        edtPermenantAddr.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                edtPermenantAddr.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                erroraddress.setVisibility(View.INVISIBLE);
            }
        });

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                // txtPrimaryNoCode.setText(countryDialCode.get(position));
                listView.setVisibility(View.GONE);
                scrollView.setVisibility(View.VISIBLE);
                String imgUrl = countryFlag.get(position);
                dialCode = countryDialCode.get(position);
                //   if (imgUrl != null && !imgUrl.isEmpty()) {
                if (option.equalsIgnoreCase("Primary")) {
                    txtPrimaryCode.setText(dialCode);
                    if (imgUrl != null && !imgUrl.isEmpty()) {
                        RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                                .init()
                                .with(getActivity())
                                .getRequestBuilder();
                        requestBuilder
                                .load(imgUrl)
                                .transition(DrawableTransitionOptions.withCrossFade())
                                .apply(new RequestOptions()
                                        .centerCrop())
                                .into(imgFlagPrimaryNo);
                    } else
                        imgFlagPrimaryNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));

                   /* if (imgUrl != null && !imgUrl.isEmpty())
                        OPHubUtils.fetchSvg(getActivity(), imgUrl, imgFlagPrimaryNo);
                    else
                        imgFlagPrimaryNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));*/
                } else if (option.equalsIgnoreCase("Emergency")) {
                    txtEmergencyCode.setText(dialCode);
                    if (imgUrl != null && !imgUrl.isEmpty()) {
                        System.out.println("print image " + imgUrl);
                        RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                                .init()
                                .with(getActivity())
                                .getRequestBuilder();
                        requestBuilder
                                .load(imgUrl)
                                .transition(DrawableTransitionOptions.withCrossFade())
                                .apply(new RequestOptions()
                                        .centerCrop())
                                .into(imgFlagEmergencyNo);
                    } else
                        imgFlagEmergencyNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));

                }

            }
        });

        edtDob.addTextChangedListener(new DateMask());
//        dob();

        return rootView;
    }


    @OnClick(R.id.nfcCard)
    public void cardUpdate(){
        showNFC();
        EventBus.getDefault().post(new MessageEvent(aayushNumber, "cardWrite"));
    }


    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(NfcEvent event) {

        try {
            String writeStatus = event.getAction();
            if(writeStatus.equalsIgnoreCase("cardWriteDone")){
            nfcdialog.dismiss();
            }else if (writeStatus.equalsIgnoreCase("cardWriteError")) {
                if (nfcdialog != null && nfcdialog.isShowing()) {
                    nfcdialog.dismiss();
                }
            }
        }catch (Exception ignored){
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    public void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
    }


    public void showNFC() {
        nfcdialog = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.nfcjson, null);
        nfcdialog.setContentView(view);
        nfcdialog.getWindow().setGravity(Gravity.CENTER);
        nfcdialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        nfcdialog.setCancelable(false);
        ImageView imgClose = nfcdialog.findViewById(R.id.imgClose);
        LottieAnimationView lottie_nfc = nfcdialog.findViewById(R.id.lottie_nfc);
        lottie_nfc.setAnimation(R.raw.tap_the_card);
        lottie_nfc.playAnimation();

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                EventBus.getDefault().post(new MessageEvent(aayushNumber, ""));
                nfcdialog.dismiss();
            }
        });


        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(nfcdialog.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        nfcdialog.getWindow().setAttributes(lp);
        nfcdialog.show();
    }

    @OnClick(R.id.txtCreateABHA)
    public void clickCreateABHA() {
        String name = edtPatientName.getText().toString();
        String dob = edtDob.getText().toString();
        String bloodGrp = spinBloodGroup.getSelectedItem().toString();
        String gender = spinGender.getSelectedItem().toString();
        String phone = edtPrimaryNo.getText().toString();
        String emergencyNo = edtEmergencyNo.getText().toString();
        String salutation = spinSalutation.getSelectedItem().toString();
        //  String dialCode = txtPrimaryDialCode.getText().toString();
        String email = edtEmail.getText().toString();
        String address = edtPermenantAddr.getText().toString();

        CreateAbhaFragment newFragment = new CreateAbhaFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_menu", "Patient_Profile");
        result.putString("name", name);
        result.putString("gender", gender);
        result.putString("dob", dob);
        result.putString("bloodGroup", bloodGrp);
        result.putString("phone", phone);
        result.putString("email", email);
        result.putString("address", address);
        result.putString("emergencyNo", emergencyNo);
        result.putString("salutation", salutation);
        //    result.putString("dialCode", dialCode);

        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }


    @OnClick(R.id.imgCamera)
    public void cameraClicked() {
        showImageUploadDialog();
        //showUnderDevelopment();
    }

    public void showUnderDevelopment() {
        underDevelop = new Dialog(getContext());
        View view = getLayoutInflater().inflate(R.layout.under_development, null);
        underDevelop.setContentView(view);
        underDevelop.getWindow().setGravity(Gravity.CENTER);
        underDevelop.setCancelable(false);
        ImageView imgClose = underDevelop.findViewById(R.id.imgClose);


        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                underDevelop.dismiss();
            }
        });

        underDevelop.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(underDevelop.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        underDevelop.getWindow().setAttributes(lp);
    }


    @OnClick(R.id.relPrimaryNo)
    public void clickedPrimaryNoFlag() {
        Log.i("myLog", "clciked primary No code");
        option = "Primary";
        listView.setVisibility(View.VISIBLE);
        scrollView.setVisibility(View.GONE);
        if (countryName != null) {
            CountryCodeAdapter adapter = new CountryCodeAdapter(getActivity(), countryName, countryDialCode, countryFlag);
            // Setting Adapter to RecyclerView
            if (adapter != null)
                listView.setAdapter(adapter);
        }
    }

    @OnClick(R.id.relEmergencyNo)
    public void clickedEmergencyNoFlag() {
        Log.i("myLog", "clciked clickedEmergencyNoFlag No code");
        option = "Emergency";
        listView.setVisibility(View.VISIBLE);
        scrollView.setVisibility(View.GONE);
        if (countryName != null) {
            CountryCodeAdapter adapter = new CountryCodeAdapter(getActivity(), countryName, countryDialCode, countryFlag);
            // Setting Adapter to RecyclerView
            if (adapter != null)
                listView.setAdapter(adapter);
        }
    }

    @OnClick(R.id.imgDob)
    public void clickedDOB() {
        String dob = edtDob.getText().toString();
        setFromDateCalender("dob", dob);
    }

    @OnClick(R.id.edtInsuranceValidity)
    public void clickedInsuranceValidity() {
        setFromDateCalender("insurance", "");
    }

    @OnItemSelected(R.id.spinSalutation)
    public void clickSpinSalutation() {
        Log.i("myLog", "spinSalutation clicked");
        String salutation = spinSalutation.getSelectedItem().toString();
        if (salutation.equalsIgnoreCase("Select")) {
            if (genderAL != null && genderAL.contains("Select Gender")) {
                int index = genderAL.indexOf("Select Gender");
                spinGender.setSelection(index);
            }
        }else if (salutation.equalsIgnoreCase("Mr")) {
            if (genderAL != null && genderAL.contains("Male")) {
                int index = genderAL.indexOf("Male");
                spinGender.setSelection(index);
                lytName.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                errorTextName.setVisibility(View.INVISIBLE);
            }
        } else if (salutation.equalsIgnoreCase("Mrs") || salutation.equalsIgnoreCase("Ms")) {
            if (genderAL != null && genderAL.contains("Female")) {
                int index = genderAL.indexOf("Female");
                spinGender.setSelection(index);
                lytName.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                errorTextName.setVisibility(View.INVISIBLE);
            }
        }
    }




    @OnClick(R.id.btnABHA)
    public void clickedABHA() {
        token = null;
        AbhaOnboradDialogUtils.showABHADialog(getContext(), edtAbhaNo, this, hospId, true, edtPrimaryNo.getText().toString(), edtPatientName.getText().toString(), edtDob.getText().toString(), "");
    }

    @OnClick(R.id.btnSubmit)
    public void clickedSubmit() {
        String salutation = spinSalutation.getSelectedItem().toString();
        System.out.println("salutationdd" + salutation);
        String name = edtPatientName.getText().toString();
        String dob = edtDob.getText().toString();
        String age = edtAge.getText().toString();
        String salutatae = spinSalutation.getSelectedItem().toString();
        if (name.isEmpty()) {
            lytName.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
            errorTextName.setVisibility(VISIBLE);

        } else {
            lytName.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
            errorTextName.setVisibility(View.INVISIBLE);
        }




        if (age.isEmpty()) {
            edtAge.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
            errorTextAge.setVisibility(VISIBLE);

        } else {
            edtAge.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
            errorTextAge.setVisibility(View.INVISIBLE);
        }
        if (dob.isEmpty()) {
            imgDob.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
            errorTextDob.setVisibility(VISIBLE);

        } else {
            imgDob.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
            errorTextDob.setVisibility(View.INVISIBLE);
        }

        if ((name.isEmpty() && salutatae.equalsIgnoreCase("Select"))|| age.isEmpty() || dob.isEmpty()) {
            errorLayout1.setVisibility(VISIBLE);
        } else {
            errorLayout1.setVisibility(GONE);
        }
        Log.i("myLog", "submit 1");
        String phone = edtPrimaryNo.getText().toString();
        if (!(!phone.isEmpty() && phone.length() == 10 && Patterns.PHONE.matcher(phone).matches())) {
            lytPrimary.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
            errorMobileNumber.setVisibility(VISIBLE);

        } else {
            lytPrimary.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
            errorMobileNumber.setVisibility(View.INVISIBLE);
        }

        String address = edtPermenantAddr.getText().toString();
        if (address.isEmpty()) {
            edtPermenantAddr.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
            erroraddress.setVisibility(VISIBLE);
            Log.i("myLog", "submit 1 address empty");
        } else {
            edtPermenantAddr.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
            erroraddress.setVisibility(View.INVISIBLE);
        }

        String gender = spinGender.getSelectedItem().toString();
        if (gender.equalsIgnoreCase("Select Gender")) {
            //   Toast.makeText(getActivity(), "Select gender!", Toast.LENGTH_SHORT).show();
            spinGender.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
            errGender.setVisibility(VISIBLE);
            errorLayout3.setVisibility(VISIBLE);
        }else {
            spinGender.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
            errGender.setVisibility(View.INVISIBLE);
            errorLayout3.setVisibility(GONE);
        }




        Log.i("myLog", "submit 222");
        if (phone.isEmpty()) {
            errorLayout2.setVisibility(VISIBLE);

        } else {
            errorLayout2.setVisibility(GONE);
        }


        String email = edtEmail.getText().toString();
        if (!email.isEmpty()) {
            if (!isValidEmail(email)) {
                errorEmail.setVisibility(VISIBLE);
                errorLayout3.setVisibility(VISIBLE);
                return;
            }else{
                errorEmail.setVisibility(GONE);
                errorLayout3.setVisibility(GONE);
            }
        }
        Log.i("myLog", "submit 333");
        if (phone.length() != 10) {
            Log.i("myLog", "phone.length() != 10");
            errorLayout2.setVisibility(VISIBLE);
            errorMobileNumber.setVisibility(VISIBLE);
            errorMobileNumber.setText("Enter your 10 digit mobile number!");
            // Toast.makeText(getActivity(), "Enter your 10 digit phone!", Toast.LENGTH_SHORT).show();
            return;
        }
        if (address.isEmpty()) {
            Log.i("myLog", "address.isEmpty()");
            errorLayout2.setVisibility(VISIBLE);
            erroraddress.setVisibility(VISIBLE);
            //  Toast.makeText(getActivity(), "Enter valid address !", Toast.LENGTH_SHORT).show();
            return;
        }

        Log.i("myLog", "submit 444");

        String bloodGrp = spinBloodGroup.getSelectedItem().toString();
      /*  if (bloodGrp.equalsIgnoreCase("Select blood group")) {

            Toast.makeText(getActivity(), "Select blood group!", Toast.LENGTH_SHORT).show();
            return;
        }*/
        String bloodGrpId = null;
        if (!bloodGrp.equalsIgnoreCase("NA")) {
            int pos = spinBloodGroup.getSelectedItemPosition();
            bloodGrpId = String.valueOf(bloodGrpIdAL.get(pos));
        }
        Log.i("myLog", "submit 5555");
       /* if (name.isEmpty() || (age.isEmpty()) || (dob.isEmpty()) || (phone.isEmpty())) {
            Toast.makeText(getActivity(), "Please Enter Valid Details...", Toast.LENGTH_SHORT).show();
            return;
        }*/

        Log.i("myLog", "submit 6666");
        String abhaNo = edtAbhaNo.getText().toString();
        String dialCode = txtPrimaryCode.getText().toString();
        String insuranceNo = edtInsuranceNo.getText().toString();
        String insuranceValidity = txtInsuranceValidity.getText().toString();
        String emergencyNo = edtEmergencyNo.getText().toString();
        String knownAllery = edtMedicalHistory.getText().toString();

        String inputDate = edtDob.getText().toString();
        if (!dob.isEmpty()) {

            try {
                Date date = new SimpleDateFormat("dd-MM-yyyy").parse(inputDate);
                dob = new SimpleDateFormat("yyyy-MM-dd").format(date);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (!insuranceValidity.isEmpty()) {

            try {
                Date date = new SimpleDateFormat("dd-MM-yyyy").parse(inputDate);
                insuranceValidity = new SimpleDateFormat("yyyy-MM-dd").format(date);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }






        if (fromScreen != null && fromScreen.equalsIgnoreCase("Profile")) {
            if (gender.equalsIgnoreCase("Select Gender")) {
                spinGender.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
                errGender.setVisibility(VISIBLE);
                errorLayout3.setVisibility(VISIBLE);
            } else if (salutatae.equalsIgnoreCase("Select") || edtPatientName.getText().length() == 0) {
                errorLayout1.setVisibility(VISIBLE);
                errorTextName.setVisibility(VISIBLE);
            } else {
                updatePatient("Update", salutation, age, name, dob, gender, bloodGrpId, dialCode, phone, email, address, abhaNo, emergencyNo, insuranceNo, insuranceValidity, knownAllery);
            }

        } else {
            if (gender.equalsIgnoreCase("Select Gender")) {
                spinGender.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_red_outline));
                errGender.setVisibility(VISIBLE);
                errorLayout3.setVisibility(VISIBLE);
            } else if (salutatae.equalsIgnoreCase("Select") || edtPatientName.getText().length() == 0) {
                errorLayout1.setVisibility(VISIBLE);
                errorTextName.setVisibility(VISIBLE);
            } else {
                addNewPatient("Add", salutation, name, Integer.parseInt(age), dob, gender, bloodGrpId, dialCode, phone, email, address, abhaNo, insuranceNo, insuranceValidity, emergencyNo, knownAllery);
            }
        }


    }

    public boolean isValidEmail1(String email) {
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
    public boolean isValidEmail(String email) {
        return email != null && Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    private void addNewPatient(String option, String salutationStr, String nameStr,
                               int ageStr, String dobStr, String genderStr, String bloodGroupId,
                               String dialCodeStr, String phoneStr, String emailStr, String addressStr, String
                                       abhaNoStr,
                               String insuranceNo, String insuranceValidity, String emergencyNoStr, String knownAllergy) {
        Log.i("mylog", "addNewPatientttttt");
        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
        request.setSalutation(salutationStr);
        request.setPatientName(nameStr);
        request.setDob(dobStr);
        request.setAge(ageStr);
        request.setDialCode(dialCodeStr);
        request.setGender(genderStr);
        if (bloodGroupId != null) {
            Log.i("mylog", "bloodGroupId:" + bloodGroupId + " " + bloodGroupId.length());
            request.setBloodBankId(bloodGroupId);
        }
        Log.i("mylog", "bloodGroupId:" + bloodGroupId);
        request.setMobile(phoneStr);
        request.setEmail(emailStr);
        request.setAddress(addressStr);
        request.setAbhaNo(abhaNoStr);
            request.setImage(image);
        request.setHospId(hospId);
        request.setInsuranceId(insuranceNo);
        request.setEmergencyNo(emergencyNoStr);
        if (!insuranceValidity.isEmpty())
            request.setInsuranceValidity(insuranceValidity);
        request.setKnownAllergies(knownAllergy);
        Log.i("mylog", "addNewPatient requestttt:" + new Gson().toJson(request));
        Call<List<DataResponse>> call = services.addPatient(request);
        call.enqueue(new Callback<List<DataResponse>>() {

            @Override
            public void onResponse(Call<List<DataResponse>> call, Response<List<DataResponse>> response) {
                try {
                    Log.i("myLog", "addNewPatient response:");
                    Log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "addNewPatient response isSuccess:" + response.body().toString());
                        List<DataResponse> list = response.body();
                        if (list != null && list.size() > 0) {
                            DataResponse res = list.get(0);
                            String status = res.getStatus();
                            String message = res.getMessage();
                            String errormsg = res.getErrorMessage();
                            patientType = res.getPatientType();

                            Log.i("myLog", "patient type:" + patientType);
                            DataResponse.Details details = res.getDetails();
                            if (details != null) {
                                patientId = details.getPatientId();
                                name = details.getPatientName();
                                gender = details.getGender();
                                age = details.getAge();
                                dob = details.getDob();
                                if (dob != null && dob.contains("T")) {
                                    String[] str = dob.split("T");
                                    dob = str[0];
                                }

                                address = details.getAddress();
                                bloodgroup = details.getBlood_group();
                                phone = details.getPhone();
                                email = details.getEmail();
                                abhaNo = details.getAbhaNo();
                                dialCode = details.getDialCode();
                                salutation = details.getSalutation();
                                aayushNumber = details.getAayushUniqueId();
                               // ImageUrls = details.getAayushUniqueId();
                                System.out.println("salutationss" + salutation);
                                emergencyNo = details.getEmergencyNo();
                                //    if (status.equalsIgnoreCase("Success") && option.equalsIgnoreCase("Add")) {
                                if (status.equalsIgnoreCase("Success")) {
                                    PatientProfileFragment newFragment = new PatientProfileFragment();
                                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                    Bundle result = new Bundle();
                                    result.putString("from_screen", "Add_New_Patient");
                                    result.putString("name", name);
                                    result.putString("gender", gender);
                                    result.putInt("patient_id", patientId);
                                    result.putString("bloodGroup", bloodgroup);
                                    result.putInt("bloodGroupId", bloodGrpId);
                                    result.putString("phone", phone);
                                    result.putInt("age", age);
                                    result.putString("email", email);
                                    result.putString("abha_no", abhaNo);
                                    result.putString("dob", dob);
                                    result.putString("address", address);
                                    result.putString("salutation", salutation);
                                    result.putString("image", image);
                                    result.putString("dial_code", dialCode);
                                    result.putString("pincode", pincode);
                                    result.putString("aayush_unique_id", aayushNumber);
                                    result.putString("emergency_mobile_no", emergencyNo);
                                    newFragment.setArguments(result);
                                    Log.i("myLog", "goToPatientScreen b4 bundle");
                                    //  transaction.replace(R.id.fragment_container, newFragment);
                                    transaction.replace(R.id.fragment_container, newFragment, "Patient");
    //                                transaction.addToBackStack(null);
                                    transaction.commit();

                                }

                                Log.i("myLog", "addNewPatient  patientId:" + patientId);
                                Log.i("myLog", "addNewPatient  abhaNo:" + abhaNo);
                                Log.i("myLog", "addNewPatient  emergencyNo:" + emergencyNo);
                            } else {
                                if (errormsg != null) {
                                    OPHubUtils.showErrorDialog(getActivity(), "patient already exists with same gender and same dob/age and same name on this mobile number");
                                }
                            }

                        }
                    } else {
                        Log.i("myLog", "response else part");
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                        // Toast.makeText(getActivity(),  response.message(), Toast.LENGTH_SHORT).show();

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<DataResponse>> call, Throwable t) {
                Log.i("myLog", "addNewPatient response failure:" + t.toString());
                Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
//                call.clone().enqueue(this);

            }
        });
    }

    private void updatePatient(String option, String salutate, String age, String name, String
            dob, String gender, String bloodGroupId, String dialCode, String phone, String email, String address, String abhaNo, String
                                       emergencyNo, String insuranceNo, String insuranceValidity, String knownAllergy) {
        Log.i("mylog", "updatePatient");
        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
        request.setPatientName(name);
        request.setDob(dob);
        request.setSalutation(salutate);
        request.setGender(gender);
        if (bloodGroupId != null)
            request.setBloodBankId(bloodGroupId);
        request.setMobile(phone);
        request.setDialCode(dialCode);
        request.setEmail(email);
        if (age != null && !age.isEmpty())
            request.setAge(Integer.parseInt(age));
        request.setAddress(address);
        if (!abhaNo.isEmpty())
            request.setAbhaNo(abhaNo);
        request.setHospId(hospId);
        request.setEmergencyNo(emergencyNo);
        request.setInsuranceId(insuranceNo);
        request.setImage(image);
        if (!insuranceValidity.isEmpty())
            request.setInsuranceValidity(insuranceValidity);
        request.setKnownAllergies(knownAllergy);
        Log.i("mylog", "updatePatient request:" + new Gson().toJson(request));
        Call<List<UpdatePatientResponse>> call = services.updatePatient(patientId, hospId, request);
        call.enqueue(new Callback<List<UpdatePatientResponse>>() {

            @Override
            public void onResponse(Call<List<UpdatePatientResponse>> call, Response<List<UpdatePatientResponse>> response) {
                try {
                    Log.i("myLog", "updatePatient response:");
                    Log.i("mylog", "updatePatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "updatePatient response isSuccess:" + response.body().toString());
                        List<UpdatePatientResponse> list = response.body();
                        if (list != null && list.size() > 0) {
                            Log.i("myLog", "updatePatient response if");
                            UpdatePatientResponse res = list.get(0);

                            String status = res.getStatus();
                            String message = res.getMessage();
                            Log.i("myLog", "status:" + status + "    message:" + message);
                            if (status != null && status.equalsIgnoreCase("success")) {
                                Log.i("myLog", "status != null:");
                                UpdatePatientResponse.Details details = res.getDetails();
                                patientId = details.getPatientId();
                                String name = details.getPatientName();
                                String gender = details.getGender();
                                int age = details.getAge();
                                String bloodGroup = details.getBlood_group();
                                //  String bloodGrpId = details.get
                                String phone = details.getPhone();
                                String email = details.getEmail();
                                String abhaNo = details.getAbhaNo();
                                String emergencyNo = details.getEmergencyMobileNo();
                                String address = details.getAddress();

                              //  requireActivity().getSupportFragmentManager().popBackStack();


                                PatientProfileFragment newFragment = new PatientProfileFragment();
                                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                Bundle result = new Bundle();
                                result.putString("from_screen", "Add_New_Patient");
                                result.putString("name", name);
                                result.putString("gender", gender);
                                result.putInt("patient_id", patientId);
                                result.putString("bloodGroup", bloodGroup);
                                result.putInt("bloodGroupId", bloodGrpId);
                                result.putString("phone", phone);
                                result.putInt("age", age);
                                result.putString("email", email);
                                result.putString("abha_no", abhaNo);
                                result.putString("dob", dob);
                                result.putString("address", address);
                                result.putString("salutation", salutate);
                                result.putString("image", image);
                                result.putString("dial_code", dialCode);
                                result.putString("pincode", pincode);
                                result.putString("emergency_mobile_no", emergencyNo);
                                newFragment.setArguments(result);
                                Log.i("myLog", "goToPatientScreen b4 bundle");
                                transaction.replace(R.id.fragment_container, newFragment, "Patient");
    //                            transaction.addToBackStack(null);
                                transaction.commit();
                            } else {
                                OPHubUtils.showErrorDialog(getActivity(), "Unable to update patient");
                            }
                        } else {
                            OPHubUtils.showErrorDialog(getActivity(), "Unable to update patient");
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<UpdatePatientResponse>> call, Throwable t) {
                Log.i("myLog", "updatePatient response failure:" + t.toString());
                Log.i("myLog", "updatePatient response failure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void upload(Uri uri) throws Exception {
        Log.i("myLog", "upload file");
        File file = getFileFromUri(getContext(), uri);
        Log.i("myLog", "upload file11111111");
        MultipartBody.Part filePart = MultipartBody.Part.createFormData("file", // Replace with the field name for the file
                file.getPath(), RequestBody.create(MediaType.parse("image/jpeg"), file)
        );
        Log.i("myLog", "upload file2222222");
        Call<ImageResponse> call = imageServices.uploadImageUrl(filePart);
        call.enqueue(new retrofit2.Callback<ImageResponse>() {
            @Override
            public void onResponse(Call<ImageResponse> call, retrofit2.Response<ImageResponse> response) {
                try {
                    Log.i("myLog", "upload file onResponse:" + new Gson().toJson(response.body()));
                    if (response.isSuccessful()) {
                        if (response.body().getMessage().contains("Face indexed successfully!")){
                          //  imgProfile.setImageURI(uri);
                            // Handle success response
                            ImageResponse myResponse = response.body();
                            Log.i("myLog", "upload file onResponse message:" + myResponse.getMessage());
                            System.out.println("File uploaded successfully: " + myResponse.getMessage());
                            FaceKey = myResponse.getKey();
                            image=FaceKey;
                            String Messsage = myResponse.getMessage();
                            Log.i("myLog", "uploadFilestatus:" + Messsage);
                            Toast.makeText(getActivity(), Messsage, Toast.LENGTH_SHORT).show();
                           showProfileImage();
                        }else {
                            imgProfile.setImageResource(R.drawable.ic_user);
                            OPHubUtils.showErrorDialog(getActivity(), response.body().getMessage());
                        }

                    } else {
                        imgProfile.setImageResource(R.drawable.ic_user);
                        OPHubUtils.showErrorDialog(getActivity(), response.body().getMessage());
                        // Handle error response
                        Log.i("myLog", "upload file onResponse else:");

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ImageResponse> call, Throwable t) {
                // Handle network failure
                Log.i("myLog", "upload file  on failure");
                System.out.println("Network error: " + t.getMessage());
            }
        });
    }

    private void showProfileImage() {
        Log.i("myLog", "showProfileImage");
        Log.i("myLog", "imgName:" + image);
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setKey(image);
        Log.i("mylog", "Image request : " + new Gson().toJson(request));
        Call<ResponseBody> call = imageServices.getProfileImageNew(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                try {
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
                                        imgProfile.setImageBitmap(bitmap);
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
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "getProfileImage response failure:" + t.toString());
            }
        });
    }



    private void showFile(String imgName) {
        Log.i("myLog", "showFile");
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setValue(imgName);
        Call<ResponseBody> call = fileServices.getProfileImage(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                try {
                    if (response.body() != null) {
                        Log.i("myLog", "server contacted and has file");

                        try {
                            byte[] bytes = response.body().bytes();
                            Log.i("myLog", "byte  length:" + bytes.length);
                            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                            showViewFileDialog(bitmap);
                            Log.i("myLog", "after image set");
                        } catch (Exception e) {
                            Log.i("myLog", "Exception :" + e.toString());
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "showFile response failure:" + t.toString());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void showViewFileDialog(Bitmap bitmap) {
        Log.i("myLog", "showViewFileDialog");
        dialogViewFile = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_view_file, null);
        dialogViewFile.setContentView(view);
        dialogViewFile.getWindow().setGravity(Gravity.CENTER);
        ImageView imgFile = dialogViewFile.findViewById(R.id.imgViewFile);
        TextView txtClose = dialogViewFile.findViewById(R.id.txtClose);
        imgFile.setImageBitmap(bitmap);
        dialogViewFile.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogViewFile.getWindow().getAttributes());
        lp.width = width - dpToPx(100);
        lp.height = height - dpToPx(100);
        dialogViewFile.getWindow().setAttributes(lp);
        txtClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogViewFile.dismiss();
            }
        });
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    public void showImageUploadDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        // set the custom layout
        final View customLayout = getLayoutInflater().inflate(R.layout.dialog_image_selection, null);
        builder.setView(customLayout);
        ImageView imgClose = customLayout.findViewById(R.id.imgClose);
        LinearLayout linearCamera = customLayout.findViewById(R.id.linearCamera);
        LinearLayout linearGallery = customLayout.findViewById(R.id.linearGallery);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                dialog.dismiss();
            }
        });

        linearCamera.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!checkCameraPermission()) {
                    requestCameraPermission();
                } else {
                    pickFromCamera();
                }
                dialog.dismiss();
            }
        });

        linearGallery.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!checkCameraPermission()) {
                    requestCameraPermission();
                } else {
                    pickFromGallery();
                }
                dialog.dismiss();
            }
        });
        // create and show the alert dialog
        dialog = builder.create();
        dialog.show();

    }


    private void pickFromCamera() {
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        takePhotoForResult.launch(intent);

    }

    private ActivityResultLauncher<Intent> takePhotoForResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                    Bundle extras = result.getData().getExtras();
                    Bitmap imageBitmap = (Bitmap) extras.get("data");
                    System.out.println("imageBitmap"+imageBitmap);
                    imgProfile.setImageBitmap(imageBitmap); // Set the captured image in the ImageView
                }
            }
    );




    private void getBloodGroup() {
        Log.i("myLog", "getAppointmentStatus");
        services.getBloodGroup().enqueue(new Callback<List<BloodGroupResponse>>() {

            @Override
            public void onResponse(Call<List<BloodGroupResponse>> call, Response<List<BloodGroupResponse>> response) {
                try {
                    Log.i("myLog", "getAppointmentStatus onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        getGender();
                        List<BloodGroupResponse> list = response.body();
                        int size = list.size();
                        bloodGroupAL = new ArrayList<>();
                        bloodGrpIdAL = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            BloodGroupResponse resp = list.get(start);
                            bloodGroupAL.add(resp.getName());
                            bloodGrpIdAL.add(resp.getId());
                        }
                        if (spinBloodGroup != null) {
                            OPHubUtils.addProdTypeSpinner(getActivity(), bloodGroupAL, spinBloodGroup, "NA");
                            if (bloodgroup != null && !bloodgroup.equalsIgnoreCase("-")) {
                                int index = bloodGroupAL.indexOf(bloodgroup);
                                spinBloodGroup.setSelection(index);
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
            public void onFailure(Call<List<BloodGroupResponse>> call, Throwable t) {
                //  OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }


    private void getGender() {
        Log.i("myLog", "getGender");
        services.getGender().enqueue(new Callback<List<OPHubResponse.GenderResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.GenderResponse>> call, Response<List<OPHubResponse.GenderResponse>> response) {
                try {
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
                                    getActivity()
                                    , R.layout.spinner_item, genderAL);
                            spinGender.setAdapter(spinnerArrayAdapter);
                        }
                        spinGender.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                            @Override
                            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                                System.out.println("print po");
                                selectedGender = list.get(position).getGender();
                                System.out.println("genterrs::"+selectedGender);
                                if (!selectedGender.equalsIgnoreCase("Select Gender")) {
                                    spinGender.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
                                    errorLayout3.setVisibility(GONE);
                                }else {
                                    errorLayout3.setVisibility(VISIBLE);
                                }

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
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                    scrollView.setVisibility(View.VISIBLE);
                    loader.setVisibility(View.GONE);
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.GenderResponse>> call, Throwable t) {
                // OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void getCountryCode(String dCode) {
        Log.i("myLog", "getCountryCode");
        services.getCountry().enqueue(new Callback<List<OPHubResponse.CountryResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.CountryResponse>> call, Response<List<OPHubResponse.CountryResponse>> response) {
                try {
                    Log.i("myLog", "getCountryCode onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        getSalutation();
                        List<OPHubResponse.CountryResponse> list = response.body();
                        int size = list.size();
                        countryName = new ArrayList<>();
                        countryDialCode = new ArrayList<>();
                        countryIso = new ArrayList<>();
                        countryFlag = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            OPHubResponse.CountryResponse resp = list.get(start);
                            String name = resp.getName();
                            String flagUrl = resp.getCountryFlag();
                            String dialCode = resp.getDial_code();
                            countryName.add(name);
                            countryFlag.add(flagUrl);
                            countryDialCode.add(dialCode);
                            countryIso.add(resp.getIso());

                            if (name.equalsIgnoreCase("India")) {
                                if (flagUrl != null && !flagUrl.isEmpty()) {
                                    RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                                            .init()
                                            .with(getActivity())
                                            .getRequestBuilder();
                                    requestBuilder
                                            .load(flagUrl)
                                            .transition(DrawableTransitionOptions.withCrossFade())
                                            .apply(new RequestOptions()
                                                    .centerCrop())
                                            .into(imgFlagPrimaryNo);
                                    requestBuilder
                                            .load(flagUrl)
                                            .transition(DrawableTransitionOptions.withCrossFade())
                                            .apply(new RequestOptions()
                                                    .centerCrop())
                                            .into(imgFlagEmergencyNo);
                                }
                                txtPrimaryCode.setText(dialCode);
                                txtEmergencyCode.setText(dialCode);
                            }

                            // String dCode = resp.getDial_code();
                            if (dialCode.equalsIgnoreCase(dCode)) {
                                String url = resp.getCountryFlag();
                                Log.i("myLog", "Matched URL:" + url);
                                txtPrimaryCode.setText(dCode);
                                txtEmergencyCode.setText(dCode);
                                if (url != null && !url.isEmpty()) {
                                    RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                                            .init()
                                            .with(getActivity())
                                            .getRequestBuilder();
                                    requestBuilder
                                            .load(url)
                                            .transition(DrawableTransitionOptions.withCrossFade())
                                            .apply(new RequestOptions()
                                                    .centerCrop())
                                            .into(imgFlagPrimaryNo);
                                    requestBuilder
                                            .load(url)
                                            .transition(DrawableTransitionOptions.withCrossFade())
                                            .apply(new RequestOptions()
                                                    .centerCrop())
                                            .into(imgFlagEmergencyNo);
                                } else {
                                    imgFlagPrimaryNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));
                                    imgFlagEmergencyNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));
                                }
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
            public void onFailure
                    (Call<List<OPHubResponse.CountryResponse>> call, Throwable t) {
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }


    private void getSalutation() {
        Log.i("myLog", "getSalutation");
        services.getSalutation().enqueue(new Callback<List<OPHubResponse.SalutationResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.SalutationResponse>> call, Response<List<OPHubResponse.SalutationResponse>> response) {
                try {
                    Log.i("myLog", "getAppointmentStatus onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        getBloodGroup();
                        List<OPHubResponse.SalutationResponse> list = response.body();
                        ArrayList<String> salutationAL = new ArrayList<>();

                        // Add default "Select" at index 0
                        salutationAL.add("Select");

                        for (OPHubResponse.SalutationResponse resp : list) {
                            salutationAL.add(resp.getSalutation());
                        }

                        if (spinSalutation != null) {
                            ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<>(
                                    getActivity(), R.layout.spinner_item, salutationAL);
                            spinSalutation.setAdapter(spinnerArrayAdapter);
                        }

                        if (salutation != null) {
                            int index = salutationAL.indexOf(salutation);
                            if (index != -1) {
                                spinSalutation.setSelection(index);
                            } else {
                                // If not found, keep "Select" as default
                                spinSalutation.setSelection(0);
                            }
                        } else {
                            spinSalutation.setSelection(0); // Default to "Select"
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.SalutationResponse>> call, Throwable t) {
                // OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void setFromDateCalender(String option, String date) {
        final Calendar c = Calendar.getInstance();

        // on below line we are getting
        // our day, month and year.
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        // on below line we are creating a variable for date picker dialog.
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                // on below line we are passing context.
                getActivity(),
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
                        if (option.equalsIgnoreCase("dob")) {
                            //  edtDob.setText(day + "-" + month + "-" + year);
                            Log.i("myLog", "dob before set date");
                            edtDob.setText(selDate);
                            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");

                            // on below line we are creating a variable
                            // for current date and time and calling a simple date format in it.
                            String currDate = sdf.format(new Date());
                            edtAge.setEnabled(false);
                            ageCaluculate(selDate, currDate);
                        } else if (option.equalsIgnoreCase("insurance")) {
                            Log.i("myLog", "insurance");
                            txtInsuranceValidity.setText(selDate);
                        }
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);

        Date date1 = new Date();
        if (option.equalsIgnoreCase("dob")) {
            // For "dob", only past dates are allowed
            datePickerDialog.getDatePicker().setMaxDate(date1.getTime());
        } else {
            // For other options, only future dates are allowed
            c.add(Calendar.DAY_OF_YEAR, 1); // Set to tomorrow to exclude today
            datePickerDialog.getDatePicker().setMinDate(c.getTimeInMillis());
        }

        datePickerDialog.show();
    }

    private Boolean checkCameraPermission() {
        boolean result = ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.CAMERA) == (PackageManager.PERMISSION_GRANTED);
        boolean result1 = ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.WRITE_EXTERNAL_STORAGE) == (PackageManager.PERMISSION_GRANTED);
        return result && result1;
    }

    // Requesting camera permission
    private void requestCameraPermission() {
        //   requestPermissions(cameraPermission, CAMERA_REQUEST);
        requestPermissionLauncher.launch(Manifest.permission.CAMERA);
    }

    private ActivityResultLauncher<String> requestPermissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestPermission(),
            new ActivityResultCallback<Boolean>() {
                @Override
                public void onActivityResult(Boolean result) {
                    if (result) {
                        // PERMISSION GRANTED
                        pickFromGallery();
                    } else {
                        // PERMISSION NOT GRANTED
                    }
                }
            }
    );

    private void pickFromGallery() {
        //  CropImage.activity().start(getActivity());
        openSomeActivityForResult();
    }

    public void openSomeActivityForResult() {
//        Intent intent = new Intent(getActivity(), CropImage.class);
//        someActivityResultLauncher.launch(intent);
        Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    // You can do the assignment inside onAttach or onCreate, i.e, before the activity is displayed
    ActivityResultLauncher<Intent> someActivityResultLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if (result.getResultCode() == RESULT_OK) {
                        // There are no request codes
                        Intent data = result.getData();
                        Log.i("myLog", "data received");

                    }
                }
            });

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.i("myLog", "request code:" + requestCode +
                "    result code:" + resultCode);
        // Handle image capture result
        Bitmap bitmap = CameraUtils.handleImageCapture(getContext(), requestCode, resultCode, data);
        if (bitmap != null) {
            AbhaDialogUtils.setImage(bitmap);
        }


        if (requestCode == 100 && resultCode == Activity.RESULT_OK && data != null) {
            Uri imageUri = data.getData();
            try {
                setImages(imageUri);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
    private void setImages(Uri imageUri) throws Exception {

//        imgCamera.setVisibility(View.GONE);
        upload(imageUri);

    }


    public void ageCaluculate(String dob, String currDate) {
        Log.i("myLog", "ageCaluculate dob:" + dob + "   currDate:" + currDate);
        SimpleDateFormat simpleDateFormat1 = new SimpleDateFormat("dd-MM-yyyy");
        try {
            // converting it to date format
            Date date1 = simpleDateFormat1.parse(dob);
            Date date2 = simpleDateFormat1.parse(currDate);

            long startdate = date1.getTime();
            long endDate = date2.getTime();

            // condition
            if (startdate <= endDate) {
                Period period = new Period(startdate, endDate, PeriodType.yearMonthDay());
                Log.i("myLog", "after period");
                int years = period.getYears();
                int months = period.getMonths();
                int days = period.getDays();
                //  edtAge.setEnabled(false);
                Log.i("myLog", "after years:" + years + "  months: " + months + "   days:" + days);
                // show the final output
                edtAge.setText(String.valueOf(years));
                Log.i("myLog", "age:" + years);
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            edtAge.setEnabled(true);

                        } catch (Exception ex) {
                            Log.i("myLog", "exception ex:" + ex.toString());
                        }

                    }
                }, 1500);
            } else {
                // show message
                //  Toast.makeText(getActivity(), "BirthDate should not be larger than today's date!", Toast.LENGTH_SHORT).show();
            }
        } catch (ParseException e) {
            Log.i("myLog", "age exception");
            e.printStackTrace();
        }
    }

    private void dob() {
        edtDob.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {
                Log.e("beforeTextChanged", "-->" + charSequence);
                Log.e("start", "" + start);
                Log.e("after", "" + after);
                Log.e("count", "" + count);
                isDeleting = count > after;

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int start, int before, int count) {
                String text = charSequence.toString();
                Log.e("onTextChanged", "-->" + charSequence);
                Log.e("start1", "" + start);
                Log.e("before1", "" + before);
                Log.e("count1", "" + count);
                Log.e("isDeleting ", "" + isDeleting);
                char subChar = 'T';
                if (text.length() > 0) {
                    subChar = text.charAt(text.length() - 1);
                    Log.e("LastChar", "-->" + subChar);
                }

                if (isDeleting) {
                    return;
                }
                if (text.length() == 1) {
                    return;
                }
                if (text.length() == 4) {
                    return;
                }

                if (subChar == '/') {
                    return;
                }
                if (charSequence.length() == 2) {
                    int date = Integer.parseInt(String.valueOf(charSequence));
                    if (date < 1 || date > 31) {
                        edtDob.setError("Please enter correct date");
                        isWrongDate = true;
                        return;
                    }
                    isWrongDate = false;
                    isDeleting = false;
                    charSequence = charSequence + "/";
                    edtDob.setText(charSequence);
                    isRunning = true;
                  //  edtDob.setSelection(edtDob.getText().length());
                    isDeleting = true;
                }

                if (text.length() == 5) {
                    String month = text.substring(3, 5);
                    Log.e("Month", "-->" + month);
                    int monthVal = Integer.parseInt(month);
                    if (monthVal < 0 || monthVal > 12) {
                        edtDob.setError("Please enter correct month");
                        isWrongMonth = true;
                        return;
                    }
                    isWrongMonth = false;
                    isDeleting = false;
                    charSequence = charSequence + "/";
                    edtDob.setText(charSequence);
                    isRunning = true;
                  //  edtDob.setSelection(edtDob.getText().length());
                    isDeleting = true;
                }

                if (text.length() == 10) {
                    String year = text.substring(6, 10);
                    Log.e("year", "-->" + year);
                    int yearVal = Integer.parseInt(year);
                    if (yearVal < 1900 || yearVal > 2050) {
                        edtDob.setError("Please enter correct year");
                        isWrongYear = true;
                        return;
                    }
                }

                if (isWrongDate) {
                    Log.e("isWrongDate", "-->" + isWrongDate);
                    if (text.length() > 2) {
                        isDeleting = false;
                        edtDob.setText(text.substring(0, text.length() - 1));
                        isDeleting = true;
                      //  edtDob.setSelection(edtDob.getText().length());
                    }
                }

                if (isWrongMonth) {
                    if (text.length() > 2) {
                        isDeleting = false;
                        edtDob.setText(text.substring(0, text.length() - 1));
                        isDeleting = true;
                      //  edtDob.setSelection(edtDob.getText().length());
                    }
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
    }

    public static String getOrDefault(String input, String defaultValue) {
        return (input == null || input.isEmpty()) ? defaultValue : input;
    }

    @Override
    public void onNewPatientOnboardAdded(Response<List<DataResponse>> response, String userAayushId) {

            Log.i("myLog", "addNewPatient response:");
            Log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
            if (response.body() != null) {
                PatientProfileFragment newFragment = new PatientProfileFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                Bundle result = new Bundle();
                result.putString("from_screen", "Main");
                result.putString("qr_type", "Patient_QR");
                result.putString("aayush_unique_id", userAayushId);

                newFragment.setArguments(result);
                Log.i("myLog", "goToPatientScreen b4 bundle");
                //  transaction.replace(R.id.fragment_container, newFragment);
                transaction.replace(R.id.fragment_container, newFragment, "Patient");
//                transaction.addToBackStack(null);
                transaction.commit();
            } else {
                Log.i("myLog", "response else part");
                //    OPHubUtils.showErrorDialog(getActivity(), response.message());

            }

    }

    @Override
    public void onAbhaQR(String aayusId) {

            PatientProfileFragment newFragment = new PatientProfileFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("from_screen", "Main");
            result.putString("qr_type", "Patient_QR");
            result.putString("aayush_unique_id", aayusId);

            newFragment.setArguments(result);
            Log.i("myLog", "goToPatientScreen b4 bundle");
            //  transaction.replace(R.id.fragment_container, newFragment);
            transaction.replace(R.id.fragment_container, newFragment, "Patient");
//            transaction.addToBackStack(null);
            transaction.commit();

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

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        Log.i("myLog", "onRequestPermissionsResult");
        CameraUtils.onRequestPermissionsResult(requestCode, grantResults, this);
    }

}

