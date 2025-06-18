package com.plenome.pos.views.patientDetail;

import static android.app.Activity.RESULT_OK;
import static android.view.Gravity.CENTER;
import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import static com.google.zxing.integration.android.IntentIntegrator.REQUEST_CODE;

import android.Manifest;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.TimePickerDialog;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.PictureDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.Patterns;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AccelerateInterpolator;
import android.view.animation.DecelerateInterpolator;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.TimePicker;
import android.widget.Toast;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.request.RequestOptions;
import com.chaos.view.PinView;
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYou;
import com.google.android.material.tabs.TabLayout;
import com.google.gson.Gson;
import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.adapters.ConsentListAdapter;
import com.plenome.pos.adapters.CountryCodeAdapter;
import com.plenome.pos.model.AbhaLinkResponse;
import com.plenome.pos.model.AbhaUserNameOtpVerifyResponse;
import com.plenome.pos.model.AbhaUserNameVerifyResponse;
import com.plenome.pos.model.ConsentRequest;
import com.plenome.pos.model.ConsentRequestResponse;
import com.plenome.pos.model.DataResponse;
import com.plenome.pos.model.EventModel;
import com.plenome.pos.model.ExistPatientDetResponse;

import com.plenome.pos.model.GetAppointmentResponse;
import com.plenome.pos.model.GetAppointmentStatusResponse;
import com.plenome.pos.model.GetConsentListResp;
import com.plenome.pos.model.GetDoctorResponse;
import com.plenome.pos.model.GetPatientProfileResponse;
import com.plenome.pos.model.GetAppointmentResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.PatientProfileQR;
import com.plenome.pos.model.UpdatePatientRequest;
import com.plenome.pos.model.UpdatePatientResponse;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.AbhaDialogUtils;
import com.plenome.pos.utils.CameraUtils;
import com.plenome.pos.utils.MessageEvent;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.CreateAbhaFragment;
import com.plenome.pos.views.DoctorSelectionFragment;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.ViewConsentFragment;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;
//import com.theartofdev.edmodo.cropper.CropImage;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.Composition;
import org.hl7.fhir.r4.model.DocumentReference;
import org.hl7.fhir.r4.model.Dosage;
import org.hl7.fhir.r4.model.Encounter;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Medication;
import org.hl7.fhir.r4.model.MedicationRequest;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Practitioner;
import org.hl7.fhir.r4.model.Quantity;
import org.hl7.fhir.r4.model.Reference;
import org.hl7.fhir.r4.model.Resource;
import org.joda.time.Period;
import org.joda.time.PeriodType;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import static com.plenome.pos.views.OPHubApplication.selApptOption;

public class PatientProfileFragment extends Fragment implements NetworkConnectionReceiver.ReceiverListener, AbhaDialogUtils.AbhaListener {
    private static final Logger log = LoggerFactory.getLogger(PatientProfileFragment.class);
    private View rootView;
    private RestServices services, fileServices, abhaServices,imageServices;
    private int patientId;
    private int hospId;
    private int width;
    private int height;
    private int textSize;
    private int age, kycVerified;
    private int apptStatusId;
    private int bloodGrpId;
    private TableRow.LayoutParams txtParam, historyTxtParam, historyLineParam, slNoParam, lineParam, imgParam, consentTxtParam, consentLineParam,consentParam,pageTxtParam;
    private Dialog dialogViewFile, dialogFilter, consentDialog, underDevelop, dialogVerifyOTP;
    String dateselection = "";
    private static final int REQUEST_CODE_READ_STORAGE = 100;
    String opConsulation = "", diagnosticReport = "", prescription = "", dischargeSummary = "", immunisationRecord = "", healthDocumentRecord = "", wellnessRecord = "", invoice = "";
    String staffName = "";
    String employeeId = "";
    ArrayList<String> modalList = new ArrayList<>();
    private AlertDialog dialog;
    private String fromScreen, roleName, name, gender, salutation, email, phone, hid, image, pincode, dialCode, emergencyNo, abahnumber,
            bloodgroup, fromMenu, abhaNo, abhaAddress, dob, address, option = "", qrType = "", json, patientType = "", apptStatus, aayushNo,
            insuranceNo, insuranceValidity, medicalHistory,selectDate = null, selectDoctor = null ;

    private Boolean previewScreen = false ;
    private ArrayList<Integer> doctorId, bloodGrpIdAL, alStatusId;
    private ArrayList<String> countryName, countryDialCode, countryIso, countryFlag, bloodGroupAL, alStatus, abhaLists;
    private AbhaDialogUtils abhaDialogUtils;
    File file;

    boolean userTouchedSpinner = false;
    private int lastSelectedPosition = -1;


    @BindView(R.id.edtName)
    EditText edtPatientName;

    @BindView(R.id.spinGender)
    Spinner spinGender;

    @BindView(R.id.spinnerAbhaAddress)
    Spinner spinnerAbhaAddress;

    @BindView(R.id.spinSalutation)
    Spinner spinSalutation;

    @BindView(R.id.edtPrimaryNo)
    EditText edtPrimaryNo;

    @BindView(R.id.txtEmergencyNoCode)
    TextView txtEmergencyCode;

    @BindView(R.id.txtPrimaryNoCode)
    TextView txtPrimaryCode;

    @BindView(R.id.edtEmergencyNo)
    EditText edtEmergencyNo;

    @BindView(R.id.edtDob)
    TextView edtDob;

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
    @BindView(R.id.edtKnownAllergy)
    EditText edtKnowAllergy;

    @BindView(R.id.imgProfile)
    ImageView imgProfile;

    @BindView(R.id.tblView)
    TableLayout tblView;

    @BindView(R.id.scrollView)
    ScrollView scrollView;

    @BindView(R.id.listView)
    ListView listView;

    @BindView(R.id.txtId)
    TextView txtID;

    @BindView(R.id.txtName)
    TextView txtName;

    @BindView(R.id.txtGender)
    TextView txtGender;

    @BindView(R.id.txtSalutation)
    TextView txtSalutation;

    @BindView(R.id.txtPrimaryDialCode)
    TextView txtPrimaryDialCode;

    @BindView(R.id.txtEmergencyDialCode)
    TextView txtEmergencyDialCode;

    @BindView(R.id.txtPermanentAddress)
    TextView txtPermanentAddress;

    @BindView(R.id.txtPrimaryNo)
    TextView txtPrimaryNo;

    @BindView(R.id.txtEmergencyNo)
    TextView txtEmergencyNo;

    @BindView(R.id.txtEmail)
    TextView txtEmail;

    @BindView(R.id.txtDob)
    TextView txtDob;

    @BindView(R.id.txtBloodGroup)
    TextView txtBloodGroup;

    @BindView(R.id.txtAbhaAddress)
    TextView txtAbhaAddress;

    @BindView(R.id.txtabhaNumber)
    TextView txtabhaNumber;

    @BindView(R.id.txtLinkNow)
    TextView txtLinkNow;

    @BindView(R.id.btnEdit)
    TextView btnEdit;

    @BindView(R.id.btnSelDoctor)
    TextView btnSelDoctor;

    @BindView(R.id.relFragment)
    RelativeLayout relLayout;

    @BindView(R.id.tabLayout)
    TabLayout tabLayout;

    @BindView(R.id.txtCaseSheet)
    TextView txtCaseSheet;
    @BindView(R.id.linearHeading)
    LinearLayout linearHead;

    @BindView(R.id.imgFilter)
    ImageView imgFilter;

    @BindView(R.id.request_consent)
    Button btnConsentReq;

    @BindView(R.id.imgFlagPrimaryNo)
    ImageView imgFlagPrimaryNo;

    @BindView(R.id.imgFlagEmergencyNo)
    ImageView imgFlagEmergencyNo;

    @BindView(R.id.edtInsuranceValidity)
    TextView txtInsuranceValidity;

    @BindView(R.id.txtCreateABHA)
    TextView txtCreateABHA;

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.progressBar)
    ProgressBar progressBar;

    @BindView(R.id.linearConsentsHeading)
    LinearLayout linearConsentHeading;

    @BindView(R.id.consent_list)
    RecyclerView recyclerView;

    @BindView(R.id.arrow_hide)
    LinearLayout arrowHide;

    @BindView(R.id.downarrow)
    ImageView downarrow;


    @BindView(R.id.tblPages)
    TableLayout tblPages;
    @BindView(R.id.imgPrev)
    ImageView imgPrev;

    @BindView(R.id.imgNext)
    ImageView imgNext;

    @BindView(R.id.spinPages)
    Spinner spinPages;

    @BindView(R.id.txtResults)
    TextView txtResults;

    @BindView(R.id.txtLastPage)
    TextView txtLastPage;

    @BindView(R.id.txtEtc)
    TextView txtEtc;

    @BindView(R.id.linearPages)
    RelativeLayout linearPages;

    ArrayList<Integer> pages = new ArrayList<>();

    int currentPage = 1,selPageCount, selInitial, selEnd, selPageNumber,initPageNo = 1,totSize,totPage, remPage,endPageNo;

    String selTab,abhaListAddress;

    private long lastCallTime = 0;
    private TextView[] txtNo, txtStatus;
    CheckBox[] checkbox;

    List<GetAppointmentResponse.Datum> listResp;
    List<GetConsentListResp.Datum> list;

    Typeface typeface;
    GetPatientProfileResponse resp;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_patient_profile, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        abhaServices = RetrofitInstance.createAbhaService(RestServices.class);
        imageServices = RetrofitInstance.createImageUrl(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.patient_profile_space);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        OPHubApplication.scrollView = scrollView;
        OPHubApplication.relPatient = relLayout;
        roleName = OPHubApplication.getUserType();
        selApptOption = "Patient Profile";
        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        abhaDialogUtils = new AbhaDialogUtils();
        abhaDialogUtils.setMyListener(this);
        Bundle bundle = getArguments();
        //   getBloodGroup();
        if (bundle != null) {
            fromMenu = bundle.getString("from_menu");
            abhaNo = bundle.getString("abha_no");
            abhaAddress = bundle.getString("abha_address");

            hospId = bundle.getInt("hospital_id");
            patientId = bundle.getInt("patient_id");
            Log.i("myLog", "patientId patient screen:" + patientId);
            fromScreen = bundle.getString("from_screen");
            name = bundle.getString("name");
            hid = bundle.getString("hid");
            gender = bundle.getString("gender");
            bloodgroup = bundle.getString("bloodGroup");
            bloodGrpId = bundle.getInt("bloodGroupId");
            phone = bundle.getString("phone");
            dob = bundle.getString("dob");
            email = bundle.getString("email");
            //  abhaNo = bundle.getString("abha_no");
            address = bundle.getString("address");
            image = bundle.getString("image");
            qrType = bundle.getString("qr_type");
            json = bundle.getString("json");
            salutation = bundle.getString("salutation");
            pincode = bundle.getString("pincode");
            dialCode = bundle.getString("dial_code");
            age = bundle.getInt("age");
            json = bundle.getString("json");
            aayushNo = bundle.getString("aayush_unique_id");
            emergencyNo = bundle.getString("emergency_mobile_no");
            insuranceNo = bundle.getString("insurance_no");
            insuranceValidity = bundle.getString("insurance_validity");
            medicalHistory = bundle.getString("medical_history");
            previewScreen = bundle.getBoolean("preview_screen");
            PreferenceManager.setInt(PreferenceManager.PATIENT_ID, patientId);

            //   apptStatus = bundle.getString("appt_status");
            // apptStatusId = bundle.getInt("appt_status_id");
            Log.i("myLog", "from_menu:" + fromMenu + "   fromScreen:" + fromScreen);
            Log.i("myLog", "insuranceNo:" + insuranceNo + "  insuranceValidity:" + insuranceValidity + "  medicalHistory:" + medicalHistory);
            if (abhaAddress == null || abhaAddress.equalsIgnoreCase("null") || abhaAddress.isEmpty()) {
                abhaAddress = "";
            }
            Log.i("mYlog", "blood group:" + bloodgroup + "    emergencyNo:" + emergencyNo + "    abhaAddress:" + abhaAddress);
        }
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQUEST_CODE);
        }
        checkPermission();
        hospId = OPHubApplication.getHospitalId();
        staffName = OPHubApplication.getStaffName();
        employeeId = OPHubApplication.getEmployeeId();
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            Log.i("myLog", "pid:" + patientId + "  hid:" + hospId);
            initParams();
            if (fromScreen.equalsIgnoreCase("appointment") || fromScreen.equalsIgnoreCase("Preview") || fromScreen.equalsIgnoreCase("Add_New_Patient")) {

                patientType = "old";
                getPatientProfile(patientId, hospId);
            } else {

                Log.i("myLog", "else part");
                if (qrType != null && qrType.equalsIgnoreCase("ABHA")) {
                    //  txtID.setText(String.valueOf(patientId));
                    txtName.setText(name);
                    if (gender.equalsIgnoreCase("M"))
                        gender = "Male";
                    else if (gender.equalsIgnoreCase("F"))
                        gender = "Female";
                    txtGender.setText(gender);

                    Log.i("mylog", "DOB:" + dob);
                    String[] str = null;
                    if (dob.contains("/"))
                        str = dob.split("/");
                    else if (dob.contains("-"))
                        str = dob.split("-");
                    if (str != null && str.length == 3)
                        dob = str[2] + "-" + str[1] + "-" + str[0];
                    Log.i("mylog", "DOBbbbbbbbbbbbbbb:" + dob);

                    if (abhaAddress != null && !abhaAddress.isEmpty() && !abhaAddress.equalsIgnoreCase("-")) {
                        txtAbhaAddress.setText("");
                        txtAbhaAddress.setVisibility(View.VISIBLE);
                        txtLinkNow.setVisibility(View.GONE);
                        /* btnConsentReq.setVisibility(View.VISIBLE);*/
                    } else {
                        txtAbhaAddress.setText("");
                        txtLinkNow.setVisibility(View.GONE);
                        txtAbhaAddress.setVisibility(View.GONE);
                        /*   btnConsentReq.setVisibility(View.GONE);*/
                    }
                    //system.out.println("print abha number " + abhaNo);
                    if (abhaNo != null && !abhaNo.isEmpty()){
                        txtabhaNumber.setText(abhaNo);
                    }
                    txtDob.setText(birthDayFormat(dob));
                    //   txtCommunicationAddress.setText(address);
                    txtPermanentAddress.setText(address);
                    txtPrimaryNo.setText(phone);
                    //  txtEmergencyNo.setText(emergencyNo);
                    checkAbhaQR();

                } else if (qrType != null && qrType.equalsIgnoreCase("Patient_QR")) {
                    Log.i("myLog", "qr type= patient");
                    Log.i("mYlog", "blood group:" + bloodgroup + "    dob:" + dob + "    address:" + address + " age1 : " + age);
//
                    QRcodePatientDataSet();


                } else {
                    Log.i("myLog", "else");
                    patientType = "old";
                    if (email != null && email.isEmpty())
                        email = "-";
                    if (dob != null && dob.isEmpty())
                        dob = "-";
                    if (bloodgroup == null)
                        bloodgroup = "-";
                    if (bloodgroup != null && bloodgroup.isEmpty())
                        bloodgroup = "-";
                    if (address != null && address.isEmpty())
                        address = "-";
                    txtID.setText(String.valueOf(patientId));
                    txtName.setText(name);
                    txtBloodGroup.setText(bloodgroup);
                    txtEmail.setText(email);
                    if (abhaAddress != null && !abhaAddress.isEmpty() && !abhaAddress.equalsIgnoreCase("-")) {
                        txtAbhaAddress.setText("");
                        txtAbhaAddress.setVisibility(View.VISIBLE);
                        txtLinkNow.setVisibility(View.GONE);
                        /*   btnConsentReq.setVisibility(View.VISIBLE);*/
                    } else {
                        txtAbhaAddress.setText("");
                        txtLinkNow.setVisibility(View.GONE);
                        txtAbhaAddress.setVisibility(View.GONE);
                        /* btnConsentReq.setVisibility(View.GONE);*/
                    }
                    //system.out.println("print abha number " + abhaNo);
                    if (abhaNo != null && !abhaNo.isEmpty()){
                        txtabhaNumber.setText(abhaNo);
                    }
                    if (dob != null && !dob.isEmpty())
                        txtDob.setText(birthDayFormat(dob));
                    else
                        txtDob.setText("-");
                    txtGender.setText(gender + ", " + age + " Years");
                    txtSalutation.setText(salutation);
                    txtPermanentAddress.setText(address);
                    txtPrimaryNo.setText(phone);
                    txtPrimaryDialCode.setText("+" + dialCode);
                    if (emergencyNo != null && !emergencyNo.isEmpty()) {
                        txtEmergencyNo.setText(emergencyNo);
                        txtEmergencyDialCode.setText("+" + dialCode);
                    }
                    AbhaAddressPatientData();
                    getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));

                }
            }

            //  getUpcomingAppts(null, null);
        }

    /*    edtAbhaNo.addTextChangedListener(new TextWatcher() {
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

        for (int i = 0; i <= tabLayout.getTabCount(); i++) {
            TabLayout.Tab tabs = tabLayout.getTabAt(i);
            if (tabs != null && tabs.view != null) {
                if (roleName.equalsIgnoreCase("Doctor")) {
                    if (i == 0 || i == 1 || i == 2 || i == 3) {
                        linearConsentHeading.setVisibility(View.VISIBLE);
//                        btnConsentReq.setVisibility(View.VISIBLE);
//                        imgFilter.setVisibility(View.VISIBLE);
                        tabs.view.setVisibility(View.VISIBLE);
                    } else {
                        tabs.view.setVisibility(View.GONE);
                    }
                } else if (roleName.equalsIgnoreCase("Nurse")) {
                    if (i == 0 || i == 1 || i == 2) {
                        tabs.view.setVisibility(View.VISIBLE);
//                        btnConsentReq.setVisibility(View.GONE);
//                        imgFilter.setVisibility(View.GONE);

                    } else {
                        tabs.view.setVisibility(View.GONE);
                    }
                }


            }
        }
        txtLinkNow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showAbhaDialog();
            }
        });
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        //log.i("myLog", "clicked today appointments");
                        selTab = "todayAppointment";
                        imgFilter.setVisibility(View.VISIBLE);
                        linearConsentHeading.setVisibility(View.GONE);
                        linearHead.setVisibility(View.VISIBLE);
                        linearPages.setVisibility(View.VISIBLE);
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {

                            tblView.removeAllViews();
                            if (!previewScreen) {
                                getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                            } else{
                                getHistoryAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                                previewScreen = false;
                            }


                        }
                        btnConsentReq.setVisibility(View.GONE);
                        btnSelDoctor.setVisibility(View.VISIBLE);
                        btnEdit.setVisibility(View.VISIBLE);
                        selectDate = null;
                        selectDoctor = null;
                        imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        break;
                    case 1:
                        //log.i("myLog", "clicked upcoming  appointments");
                        selTab = "Appointment";
                        imgFilter.setVisibility(View.VISIBLE);
                        linearConsentHeading.setVisibility(View.GONE);
                        linearHead.setVisibility(View.VISIBLE);
                        linearPages.setVisibility(View.VISIBLE);
                        boolean isConnected1 = checkConnection();
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        if (!isConnected1)
                            showAlert(isConnected1);
                        else {

                            tblView.removeAllViews();
                            getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                        }
                        btnConsentReq.setVisibility(View.GONE);
                        btnSelDoctor.setVisibility(View.VISIBLE);
                        btnEdit.setVisibility(View.VISIBLE);
                        selectDate = null;
                        selectDoctor = null;
                        imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        break;
                    case 2:
                        //log.i("myLog", "clicked appointments history");
                        selTab = "History";
                        linearConsentHeading.setVisibility(View.GONE);
                        linearHead.setVisibility(View.VISIBLE);
                        imgFilter.setVisibility(View.VISIBLE);
                        linearPages.setVisibility(View.VISIBLE);
                        boolean isConnected2 = checkConnection();
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        if (!isConnected2)
                            showAlert(isConnected2);
                        else {

                            tblView.removeAllViews();
                            getHistoryAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                        }
                        btnConsentReq.setVisibility(View.GONE);
                        btnSelDoctor.setVisibility(View.VISIBLE);
                        btnEdit.setVisibility(View.VISIBLE);
                        selectDate = null;
                        selectDoctor = null;
                        imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        break;
                    case 3:
                        //log.i("myLog", "clicked Consents");
                        selTab = "consent";
                        linearHead.setVisibility(View.GONE);
                        imgFilter.setVisibility(View.INVISIBLE);
                        btnSelDoctor.setVisibility(GONE);
                        btnEdit.setVisibility(GONE);
                        selectDate = null;
                        selectDoctor = null;
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        boolean isConnected3 = checkConnection();
                        if (!isConnected3)
                            showAlert(isConnected3);
                        else {
                            tblView.removeAllViews();
                            //   getConsentList("Blocktracksbx03", "vkarthick3@sbx");

                            if (spinnerAbhaAddress != null) {
                                Object selectedItem = spinnerAbhaAddress.getSelectedItem();
                                if (selectedItem != null) {
                                    abhaListAddress = selectedItem.toString();
                                    getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
                                    // Do something with the value
                                }
                            } else {
                                Log.e("SpinnerError", "Spinner is null");
                            }

                        }
                        if (roleName.equalsIgnoreCase("Doctor") || roleName.equalsIgnoreCase("super admin") || roleName.equalsIgnoreCase("admin")) {
                            if (abhaLists != null && !abhaLists.isEmpty())
                                btnConsentReq.setVisibility(View.VISIBLE);
                            else
                                btnConsentReq.setVisibility(View.GONE);
                        } else {
                            btnConsentReq.setVisibility(View.GONE);
                        }
                        break;
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });
        if (fromScreen.equalsIgnoreCase("Preview")) {
            tabLayout.getTabAt(2).select();
        }
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

                 /*   if (imgUrl != null && !imgUrl.isEmpty())
                        OPHubUtils.fetchSvg(getActivity(), imgUrl, imgFlagEmergencyNo);
                    else
                        imgFlagEmergencyNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));*/
                }
                // }
            }
        });

        spinnerAbhaAddress.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if (event.getAction() == MotionEvent.ACTION_DOWN) {
//                    showConfirmationDialog();
                }
                return false;
            }
        });

        downarrow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (arrowHide.getVisibility() == View.VISIBLE) {
                    slideUp(arrowHide);
                    downarrow.animate().rotation(0).setDuration(500);
                } else {
                    slideDown(arrowHide);
                    downarrow.animate().rotation(180).setDuration(500);
                }
            }
        });


        spinPages.setOnItemSelectedListener(null);
        pages.clear();
        pages.add(5);
        pages.add(10);
        pages.add(15);
        pages.add(20);
        pages.add(25);
        pages.add(30);
        pages.add(35);
        pages.add(40);
        pages.add(45);
        pages.add(50);
        Log.i("myLog", "b4 spinpages adapter");
        ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, pages);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinPages.setAdapter(adapter);


        Log.i("myLog", "after spinpages adapter");
        currentPage = OPHubApplication.currentPage;
        selPageCount = OPHubApplication.getPageCount();

        selTab = "todayAppointment";

        int index = pages.indexOf(selPageCount);
        spinPages.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                long currentTime = System.currentTimeMillis();
                if (lastCallTime != 0 && (currentTime - lastCallTime) <= 1000) {
                } else {
                    progressBar.setVisibility(View.VISIBLE);
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            clickSpinPages();
                        }
                    }, 1000);
                }
                lastCallTime = currentTime;
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        if (index < 0) {
            spinPages.setSelection(1);
        }
        else {
            spinPages.setSelection(index);
        }






        return rootView;
    }


    public void clickSpinPages() {
        Log.i("myLog", "Spinpages clicked");
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            String text = spinPages.getSelectedItem().toString();
            ////Log.i("myLog", "Selected item:" + text);
            selPageCount = Integer.parseInt(text);
            PreferenceManager.setInt(PreferenceManager.PAGE_COUNT, selPageCount);
         /*   selFromDate = null;
            selToDate = null;
            selDoctor = null;
            selStatus = null;
            selStatusId = null;
            selPaymentStatus = null;*/
           /* currentPage = 1;
            initPageNo = 1;
            selInitial = 0;
            selEnd = 0;*/
            selPageNumber = 1;
            currentPage = 1;
            initPageNo = 1;
            selInitial = (currentPage - 1) * selPageCount;
            selEnd = selInitial + (selPageCount - 1);


      /*  currentPage = 2;
        initPageNo = 1;
        selInitial = 10;
        selEnd = 19;*/
            Log.i("mLog", "selTab------:" + selTab);
            if (selTab.equalsIgnoreCase("History")) {
                Log.i("myLog", "History selected");
                tabLayout.getTabAt(2).select();
                getHistoryAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
            } else if (selTab.equalsIgnoreCase("todayAppointment")) {
                Log.i("myLog", "todayAppointment selected");
                tabLayout.getTabAt(0).select();
                getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));            }
            else if (selTab.equalsIgnoreCase("Appointment")) {
                Log.i("myLog", "appt selected");
                tabLayout.getTabAt(1).select();
                getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
            }else {
                tabLayout.getTabAt(3).select();
                getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
            }
        }
    }


    private void slideDown(View view) {
        view.setVisibility(View.VISIBLE);
        view.setAlpha(0f);
        view.setTranslationY(-30); // small offset for slide-in
        view.animate()
                .translationY(0)
                .alpha(1f)
                .setDuration(300)
                .setInterpolator(new DecelerateInterpolator())
                .start();
    }

    private void slideUp(final View view) {
        view.animate()
                .translationY(-30)
                .alpha(0f)
                .setDuration(300)
                .setInterpolator(new AccelerateInterpolator())
                .withEndAction(() -> view.setVisibility(View.GONE))
                .start();
    }

    private void AbhaAddressPatientData() {
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("patient_id", String.valueOf(patientId));
        requestData.put("hospital_id", String.valueOf(hospId));
        Log.i("mylog", "ABHA address list" + new Gson().toJson(requestData));
        spinnerAbhaAddress.setVisibility(View.GONE);
        progressBar.setVisibility(View.VISIBLE);
        Call<GetPatientProfileResponse.AbhaAdderssListResponse> call = services.abhaAdderessList(requestData);
        call.enqueue(new Callback<GetPatientProfileResponse.AbhaAdderssListResponse>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse.AbhaAdderssListResponse> call, Response<GetPatientProfileResponse.AbhaAdderssListResponse> response) {
                try {
                    Log.i("myLog", "addAbhaPatient response:::");
                    Log.i("mylog", "addAbhaPatient response:" + new Gson().toJson(response.body()));

                    spinnerAbhaAddress.setVisibility(View.VISIBLE);
                    progressBar.setVisibility(View.GONE);
                    if (response.body() != null) {
                        GetPatientProfileResponse.AbhaAdderssListResponse list = response.body();
                        if (list.getAbhaAddress() != null) {
                            txtLinkNow.setVisibility(View.GONE);
                            int size = list.getAbhaAddress().size();
                            abhaLists = new ArrayList<>();
                            abhaLists.add("Link Now");
                            for (int start = 0; start < size; start++) {
                                GetPatientProfileResponse.AbhaAdderssListResponse.AbhaAddress resp = list.getAbhaAddress().get(start);
                                abhaLists.add(resp.getAbhaAddress());
                                abhaLists.remove("Link Now");
                                abhaAddress = resp.getAbhaAddress();
                            }
                            ArrayAdapter<String> adapter = new ArrayAdapter<String>(getActivity(), android.R.layout.simple_spinner_item, abhaLists) {
                                @Override
                                public View getView(int position, View convertView, ViewGroup parent) {
                                    TextView textView = (TextView) super.getView(position, convertView, parent);

                                    if (position == 0) {
                                        if (textView.getText().toString().equalsIgnoreCase("Link Now"))
                                            textView.setTextColor(Color.BLUE);
                                        else
                                            textView.setTextColor(Color.BLACK);
                                    } else {
                                        textView.setTextColor(Color.BLACK);
                                    }

                                    return textView;
                                }

                                @Override
                                public View getDropDownView(int position, View convertView, ViewGroup parent) {
                                    TextView textView = (TextView) super.getDropDownView(position, convertView, parent);

                                    if (position == 0) {
                                        if (textView.getText().toString().equalsIgnoreCase("Link Now"))
                                            textView.setTextColor(Color.BLUE);
                                        else
                                            textView.setTextColor(Color.BLACK);
                                    } else {
                                        textView.setTextColor(Color.BLACK);
                                    }

                                    return textView;
                                }
                            };

                            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                            spinnerAbhaAddress.setAdapter(adapter);
                            if (!abhaLists.isEmpty()) {
    //                            spinnerAbhaAddress.setSelection(1);
                                spinnerAbhaAddress.setSelection(abhaLists.size() - 1);
                            }
                        } else {
                            Log.e("Error", "Abha address list is null");
    //                        imgFilter.setVisibility(View.INVISIBLE);
                            if (tabLayout.getTabCount() > 3) {
                                tabLayout.removeTabAt(3);
                            }
                            spinnerAbhaAddress.setVisibility(GONE);
                            txtLinkNow.setVisibility(View.VISIBLE);
                        }

                        spinnerAbhaAddress.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                            @Override
                            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                                if (position == 0) {
                                    String selectedText = parent.getItemAtPosition(position).toString();
                                    if (selectedText.equalsIgnoreCase("Link Now")) {
                                        showAbhaDialog();
                                        spinnerAbhaAddress.post(() -> spinnerAbhaAddress.setSelection(1));
                                    }
                                }
                            }

                            @Override
                            public void onNothingSelected(AdapterView<?> parent) {
                            }
                        });

                    } else {

                        Log.e("Error", "Response body is null");
                    }
                } catch (Exception e) {
//                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }

            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse.AbhaAdderssListResponse> call, Throwable t) {
                //log.i("myLog", "addNewPatient response failure:" + t.toString());
                //log.i("myLog", "addNewPatient response failure:" + t.getMessage());
            }
        });


    }

    public void showConfirmationDialog() {
        Dialog dialogConfirmation = new Dialog(getContext());
        View view = getLayoutInflater().inflate(R.layout.dialog_status_confirmation, null);
        dialogConfirmation.setContentView(view);
        dialogConfirmation.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogConfirmation.getWindow().setGravity(CENTER);
        dialogConfirmation.setCancelable(false);
        Button btnNo = dialogConfirmation.findViewById(R.id.btnNo);
        Button btnYes = dialogConfirmation.findViewById(R.id.btnYes);
        TextView txtTitle = dialogConfirmation.findViewById(R.id.txtMessage);
        ImageView imgClose = dialogConfirmation.findViewById(R.id.imgClose);
        txtTitle.setText("Are you sure you want to unlink your ABHA address?");

        btnNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogConfirmation.dismiss();

            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogConfirmation.dismiss();
            }
        });

        btnYes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "btn submit");
                dialogConfirmation.dismiss();
                otpVerification(abhaAddress);

            }
        });
        dialogConfirmation.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogConfirmation.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(300);
        dialogConfirmation.getWindow().setAttributes(lp);
    }

    private void QRcodePatientDataSet() {
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", aayushNo);
        requestData.put("hospital_id", String.valueOf(hospId));
        Log.i("mylog", "get AAyush response:" + new Gson().toJson(requestData));
        Call<PatientProfileQR> call = services.getQRPatientProfile(requestData);
        call.enqueue(new Callback<PatientProfileQR>() {

            @Override
            public void onResponse(Call<PatientProfileQR> call, Response<PatientProfileQR> response) {
                //log.i("myLog", "addNewPatient response:");

                try {
                    Log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //log.i("myLog", "addNewPatient response isSuccess:" + response.body().toString());
                        PatientProfileQR res = response.body();
                        String status = res.getStatus();
                        String message = res.getMessage();
                        patientType = res.getDetails().get(0).getPatientType();
                        //log.i("myLog", "patient type:" + patientType);
                        PatientProfileQR.Detail details = res.getDetails().get(0);
                        patientId = Integer.parseInt(details.getId());
                        name = details.getPatientName();
                        gender = details.getGender();
                        age = Integer.parseInt(details.getAge());
                        dob = details.getDob();
                        showProfileimage(details.getImage());
                        if (dob.contains("T")) {
                            String[] str = dob.split("T");
                            dob = str[0];
                        }

                        address = details.getAddress();
                        bloodgroup = details.getPatientBloodGroup();
                        phone = details.getMobileno();
                        email = details.getEmail();
                        abhaNo = details.getABHANumber();
                        dialCode = details.getDialCode();
                        salutation = details.getSalutation();
                        emergencyNo = details.getEmergencyMobileNo();
                        txtabhaNumber.setText(details.getABHANumber());
                        insuranceNo = details.getInsuranceId();
                        insuranceValidity = details.getInsuranceValidity();
                        medicalHistory = details.getKnownAllergies();
                        kycVerified = details.getIskycverified();
//                    if (kycVerified == 1) {
//                        btnEdit.setVisibility(View.GONE);
//                    }

                        //    if (status.equalsIgnoreCase("Success") && option.equalsIgnoreCase("Add")) {
                        if (status.equalsIgnoreCase("success")) {
                            relLayout.setVisibility(View.VISIBLE);
                            scrollView.setVisibility(View.GONE);
                            //log.i("mYlog", "blood group:" + bloodgroup + "    dob:" + dob + "    address:" + address);
                            txtID.setText(String.valueOf(patientId));
                            txtSalutation.setText(salutation);
                            txtName.setText(name);
                            txtGender.setText(gender + ", " + age + " Years");
                            txtBloodGroup.setText(bloodgroup);
                            txtEmail.setText(email);
                            if (abhaAddress != null && !abhaAddress.isEmpty()) {
                                txtAbhaAddress.setText("");
                                txtAbhaAddress.setVisibility(View.VISIBLE);
                                txtLinkNow.setVisibility(View.GONE);
                                //  btnConsentReq.setVisibility(View.VISIBLE);
                            } else {
                                txtAbhaAddress.setText("");
                                txtLinkNow.setVisibility(View.GONE);
                                txtAbhaAddress.setVisibility(View.GONE);
                                //  btnConsentReq.setVisibility(View.GONE);
                            }
                            txtDob.setText(birthDayFormat(dob));
                            //    txtCommunicationAddress.setText(address);
                            txtPermanentAddress.setText(address);
                            txtPrimaryNo.setText(phone);
                            txtPrimaryDialCode.setText("+" + dialCode);
                            txtEmergencyNo.setText(emergencyNo);

                        } else {
                            OPHubUtils.showErrorDialog(getActivity(), message);
                        }
                        //log.i("myLog", "addNewPatient  patientId:" + patientId);
                        //log.i("myLog", "addNewPatient  abhaNo:" + abhaNo);
                        tblView.removeAllViews();
                        getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                        AbhaAddressPatientData();

                    } else {
                        Log.i("myLog", "response else part");
                        OPHubUtils.showErrorDialog(getActivity(), response.message());

                    }
                }catch (Exception e){
                    //TODO Invavlid QR Code scan
//                    getParentFragmentManager().popBackStack();
                    Toast.makeText(getActivity(), "Error in generating paitent Id", Toast.LENGTH_SHORT).show();
                }

            }

            @Override
            public void onFailure(Call<PatientProfileQR> call, Throwable t) {
                Log.i("myLog", "addNewPatient response failure:" + t.toString());
                Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
            }
        });


    }

    private void showAbhaDialog() {
        AbhaDialogUtils.showABHADialog(getContext(), edtAbhaNo, this, hospId, false, txtPrimaryNo.getText().toString(), name, dob, aayushNo,address,gender,phone,image);
    }

    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            textSize = 14;
            txtParam = new TableRow.LayoutParams((width - dpToPx(180)) / 6, dpToPx(35));
            txtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            historyTxtParam = new TableRow.LayoutParams((width - dpToPx(180)) / 7, dpToPx(35));
            historyTxtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            slNoParam = new TableRow.LayoutParams(dpToPx(70), dpToPx(35));
            slNoParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            lineParam = new TableRow.LayoutParams(width - dpToPx(40), dpToPx(1));
            lineParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            lineParam.span = 7;
            historyLineParam = new TableRow.LayoutParams(width - dpToPx(40), dpToPx(1));
            historyLineParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            historyLineParam.span = 8;
            int w = ((width - dpToPx(40)) / 7) - dpToPx(25);
            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(w / 2, dpToPx(10), w / 2, dpToPx(10));

            consentTxtParam = new TableRow.LayoutParams((width - dpToPx(120)) / 5, dpToPx(35));
            consentTxtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            consentLineParam = new TableRow.LayoutParams(width - dpToPx(40), dpToPx(1));
            consentLineParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);

            consentParam = new TableRow.LayoutParams((width - dpToPx(120)) / 8, dpToPx(35));
            consentParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            consentLineParam.span = 8;
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            textSize = 14;
            txtParam = new TableRow.LayoutParams((width - dpToPx(180)) / 6, dpToPx(35));
            txtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            historyLineParam = new TableRow.LayoutParams(width - dpToPx(40), dpToPx(1));
            historyLineParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            historyLineParam.span = 8;
            historyTxtParam = new TableRow.LayoutParams((width - dpToPx(180)) / 7, dpToPx(35));
            historyTxtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            slNoParam = new TableRow.LayoutParams(dpToPx(70), dpToPx(35));
            slNoParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            lineParam = new TableRow.LayoutParams(width - dpToPx(40), dpToPx(1));
            lineParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            lineParam.span = 7;
            int w = ((width - dpToPx(40)) / 7) - dpToPx(25);
            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(w / 2, dpToPx(10), w / 2, dpToPx(10));
            consentTxtParam = new TableRow.LayoutParams((width - dpToPx(120)) / 5, dpToPx(35));
            consentTxtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            consentLineParam = new TableRow.LayoutParams(width - dpToPx(40), dpToPx(1));
            consentLineParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);

            consentParam = new TableRow.LayoutParams((width - dpToPx(120)) / 8, dpToPx(35));
            consentParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            consentLineParam.span = 8;
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
        }

    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    @OnClick(R.id.txtLinkNow)
    public void clickedLinkNow() {

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
        String dialCode = "+" + txtPrimaryDialCode.getText().toString();
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
        result.putString("dialCode", dialCode);

        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    @OnClick(R.id.imgFilter)
    public void clickedFilter() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {


            int pos = tabLayout.getSelectedTabPosition();
            if (pos == 0)
                showFilterDialog("Today");
            else if (pos == 1)
                showFilterDialog("Upcoming");
            else if (pos == 2)
                showFilterDialog("History");
        }
    }


    private ActivityResultLauncher<String> requestPermissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestPermission(),
            new ActivityResultCallback<Boolean>() {
                @Override
                public void onActivityResult(Boolean result) {
                    if (result) {
                        showImageUploadDialog();
                    } else {
                    }
                }
            }
    );

    @OnClick(R.id.imgCamera)
    public void cameraClicked() {
        if (!checkCameraPermission()) {
            requestCameraPermission();
        } else {
            showImageUploadDialog();
        }
    }

    @OnClick(R.id.btnSelDoctor)
    public void selDoctor() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            if (patientId != 0) {
                DoctorSelectionFragment newFragment = new DoctorSelectionFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                Bundle result = new Bundle();
                result.putInt("patient_id", patientId);
                result.putString("name", name);
                result.putString("gender", gender);
                result.putInt("age", age);
                result.putString("bloodGroup", bloodgroup);
                result.putString("phone", phone);
                result.putString("email", email);
                result.putString("abha_no", abhaNo);

                result.putString("from_screen", "Profile");
                newFragment.setArguments(result);
                transaction.replace(R.id.fragment_container, newFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            } else {
                Toast.makeText(getActivity(), "Patient ID is not generated, Try again later", Toast.LENGTH_SHORT).show();
            }
        }
    }

    @OnClick(R.id.relPrimaryNo)
    public void clickedPrimaryNoFlag() {
        //log.i("myLog", "clciked primary No code");
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {


            option = "Primary";
            listView.setVisibility(View.VISIBLE);
            scrollView.setVisibility(View.GONE);
            //log.i("myLog", "clciked primary No code111111111111");
            if (countryName != null) {
                //log.i("myLog", "countryName != null");
                CountryCodeAdapter adapter = new CountryCodeAdapter(getActivity(), countryName, countryDialCode, countryFlag);
                // Setting Adapter to RecyclerView
                if (adapter != null)
                    listView.setAdapter(adapter);
            }
        }
        //log.i("myLog", "clciked primary No code end");
    }

    @OnClick(R.id.relEmergencyNo)
    public void clickedEmergencyNoFlag() {
        //log.i("myLog", "clciked clickedEmergencyNoFlag No code");
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {


            option = "Emergency";
            listView.setVisibility(View.VISIBLE);
            scrollView.setVisibility(View.GONE);
            //log.i("myLog", "clciked clickedEmergencyNoFlag No code111111111111");
            if (countryName != null) {
                CountryCodeAdapter adapter = new CountryCodeAdapter(getActivity(), countryName, countryDialCode, countryFlag);
                // Setting Adapter to RecyclerView
                if (adapter != null)
                    listView.setAdapter(adapter);
            }
        }
        //log.i("myLog", "clciked clickedEmergencyNoFlag No code end");
    }

    @OnClick(R.id.edtDob)
    public void clickedDOB() {
        setFromDateCalender("dob");
    }

    @OnClick(R.id.edtInsuranceValidity)
    public void clickedInsuranceValidity() {
        setFromDateCalender("insurance");
    }

    @OnClick(R.id.btnEdit)
    public void clickedEdit() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            AddNewPatientFragment newFragment = new AddNewPatientFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("from_screen", "Profile");
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
            result.putString("image",image);
            result.putString("dial_code", dialCode);
            result.putString("pincode", pincode);
            result.putString("emergency_mobile_no", emergencyNo);
            result.putString("abha_address", abhaAddress);
            result.putBoolean("nfc", true);
            result.putString("aayushNo", aayushNo);
            result.putString("insurance_no", insuranceNo);
            result.putString("insurance_validity", insuranceValidity);
            result.putString("medical_history", medicalHistory);
            result.putInt("kyc_verified", kycVerified);
            //  result.putString("qr_type", "Patient");

            newFragment.setArguments(result);
            //log.i("myLog", "goToPatientScreen b4 bundle");
            transaction.replace(R.id.fragment_container, newFragment, "Add_New_Patient");
            transaction.addToBackStack(null);
            // transaction.setReorderingAllowed(true);
            transaction.commit();
            System.out.println("imageimage"+image);
        }

     /*   Log.i("myLog", "btnedit clicked:");
        Log.i("myLog", "Name:" + name);
        relLayout.setVisibility(View.GONE);
        scrollView.setVisibility(View.VISIBLE);
        edtPatientName.setEnabled(false);
        //  edtAbhaNo.setEnabled(false);
        edtDob.setEnabled(false);
        //  edtEmail.setEnabled(false);
        edtPrimaryNo.setEnabled(false);

        edtPatientName.setText(txtName.getText().toString());

        gender = txtGender.getText().toString();
        Log.i("myLog", "genderrr:" + gender);
        bloodgroup = txtBloodGroup.getText().toString();

        edtAge.setText(String.valueOf(age));
        edtEmail.setText(txtEmail.getText().toString());
        edtAbhaNo.setText(txtAbhaNo.getText().toString());
        edtDob.setText(txtDob.getText().toString());
        edtPermenantAddr.setText(txtPermanentAddress.getText().toString());
        edtPrimaryNo.setText(txtPrimaryNo.getText().toString());
        txtPrimaryCode.setText(txtPrimaryDialCode.getText().toString());
        txtEmergencyCode.setText(txtEmergencyDialCode.getText().toString());
        edtEmergencyNo.setText(txtEmergencyNo.getText().toString());

        SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
        String currDate = sdf.format(new Date());
        String dob = txtDob.getText().toString();
        Log.i("myLog", "DOB:" + dob);
        if (dob.contains("-")) {
            String[] selDob = dob.split("-");
            String selDate = selDob[2] + "/" + selDob[1] + "/" + selDob[0];
            Log.i("myLog", "selDate:" + selDate + "    currDate:" + currDate);
            ageCaluculate(selDate, currDate);
        }
        String[] genderArr = gender.split(",");
        if (genderArr.length > 0)
            gender = genderArr[0];
        Log.i("myLog", "genderrr1111111111:" + gender);
        getGender();
        getBloodGroup();
        getSalutation();
        String dialCode = txtPrimaryCode.getText().toString();
        getCountryCode(dialCode);*/
    }

    @OnClick(R.id.updateCard)
    public void cardUpdate() {
        EventBus.getDefault().post(new MessageEvent(aayushNo, "cardWrite"));
    }

    @OnClick(R.id.btnSubmit)
    public void clickedSubmit() {
        Log.i("myLog", "clicked submit");
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {


            String salutation = spinSalutation.getSelectedItem().toString();
            String name = edtPatientName.getText().toString();
            String dob = edtDob.getText().toString();
            if (name.isEmpty()) {
                Toast.makeText(getActivity(), "Enter name!", Toast.LENGTH_SHORT).show();
                return;
            }
          /*  if (dob.isEmpty()) {
                Toast.makeText(getActivity(), "Select Date of Birth!", Toast.LENGTH_SHORT).show();
                return;
            }*/
            String gender = spinGender.getSelectedItem().toString();
            if (gender.equalsIgnoreCase("Select gender")) {
                Toast.makeText(getActivity(), "Select gender!", Toast.LENGTH_SHORT).show();
                return;
            }
            String bloodGrp = spinBloodGroup.getSelectedItem().toString();
            String bloodGrpId = null;
            if (!bloodGrp.equalsIgnoreCase("NA")) {
                int pos = spinBloodGroup.getSelectedItemPosition();
                bloodGrpId = String.valueOf(bloodGrpIdAL.get(pos));
            }


            String phone = edtPrimaryNo.getText().toString();
            if (!(!phone.isEmpty() && Patterns.PHONE.matcher(phone).matches())) {
                Toast.makeText(getActivity(), "Enter valid phone number!", Toast.LENGTH_SHORT).show();
                return;
            }
            String email = edtEmail.getText().toString();
            if (!(!email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches())) {
                Toast.makeText(getActivity(), "Enter valid email address !", Toast.LENGTH_SHORT).show();
                return;
            }

            address = edtPermenantAddr.getText().toString();
            if (address.isEmpty()) {
                Toast.makeText(getActivity(), "Enter Permanent address!", Toast.LENGTH_SHORT).show();
                return;
            }
            String age = edtAge.getText().toString();
            String abhaNo = edtAbhaNo.getText().toString();
            String dialCode = txtPrimaryCode.getText().toString();
            String insuranceNo = edtInsuranceNo.getText().toString();
            String insuranceValidity = txtInsuranceValidity.getText().toString();
            String emergencyNo = edtEmergencyNo.getText().toString();
            //log.i("myLog", "ABha no1:" + abhaNo);
            if (abhaNo.equalsIgnoreCase("-"))
                abhaNo = "";
            //log.i("myLog", "ABha no2:" + abhaNo);
       /* if (abhaNo.isEmpty()) {
            Toast.makeText(getActivity(), "Enter ABHA number!", Toast.LENGTH_SHORT).show();
            return;
        }*/
            if (patientType.equalsIgnoreCase("old")) {
                updatePatient("Update", salutation, age, name, dob, gender, bloodGrpId, dialCode, phone, email, address, abhaNo, emergencyNo);

            } else {
                addNewPatient("Add", salutation, name, dob, Integer.valueOf(age), gender, bloodGrpId, dialCode, phone, email, address, abhaNo, insuranceNo, insuranceValidity, emergencyNo);
            }
        }

    }

    @OnClick(R.id.request_consent)
    public void requestConsent() {
        showConsentRequestDialog();
    }


    private void showConsentRequestDialog() {

        consentDialog = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.fragment_consent_request, null);
        consentDialog.setContentView(view);
        consentDialog.getWindow().setGravity(Gravity.END);

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(consentDialog.getWindow().getAttributes());

        consentDialog.getWindow().setAttributes(lp);

        Spinner spinPurpose = consentDialog.findViewById(R.id.purposeRequest);

        TextView closeFragment = consentDialog.findViewById(R.id.close_fragment);
        TextView patientName = consentDialog.findViewById(R.id.patient_name);
        TextView abhaAddressList = consentDialog.findViewById(R.id.abha_address);
        TextView patientAge = consentDialog.findViewById(R.id.age);

        EditText edtFromDate = consentDialog.findViewById(R.id.edtFromDate);
        EditText edtToDate = consentDialog.findViewById(R.id.edtToDate);
        EditText consentExpiry = consentDialog.findViewById(R.id.consent_expiry);


        LinearLayout lytOpConsulation = consentDialog.findViewById(R.id.lyt_op_consulation);
        LinearLayout lytDiagnosticReport = consentDialog.findViewById(R.id.lyt_diagnostic_report);
        LinearLayout lytPrescription = consentDialog.findViewById(R.id.lyt_prescription);
        LinearLayout lytDischargeSummary = consentDialog.findViewById(R.id.lyt_discharge_summary);
        LinearLayout lytImmunisationRecord = consentDialog.findViewById(R.id.lyt_immunisation_record);
        LinearLayout lytHealthDocumentRecord = consentDialog.findViewById(R.id.lyt_health_document_record);
        LinearLayout lytWellnessRecord = consentDialog.findViewById(R.id.lyt_wellness_record);
        LinearLayout lytInvoice = consentDialog.findViewById(R.id.lyt_invoice);

        TextView txtOpConsulation = consentDialog.findViewById(R.id.txt_op_consulation);
        TextView txtDiagnosticReport = consentDialog.findViewById(R.id.txt_diagnostic_report);
        TextView txtPrescription = consentDialog.findViewById(R.id.txt_prescription);
        TextView txtDischargeSummary = consentDialog.findViewById(R.id.txt_discharge_summary);
        TextView txtImmunisationRecord = consentDialog.findViewById(R.id.txt_immunisation_record);
        TextView txtHealthDocumentRecord = consentDialog.findViewById(R.id.txt_health_document_record);
        TextView txtWellnessRecord = consentDialog.findViewById(R.id.txt_wellness_record);
        TextView txtInvoice = consentDialog.findViewById(R.id.txt_invoice);

        Button request_consent = consentDialog.findViewById(R.id.request_consent);
        progressBar = consentDialog.findViewById(R.id.progressBar);

        //system.out.println("print abha address " + abhaAddress);
        patientName.setText(name);
        abhaAddressList.setText(abhaAddress);
        patientAge.setText(age + " years | " + gender);

        ArrayList<String> al = new ArrayList<>();
        al.add("Care Management");
        al.add("Break the Glass");
        al.add("Public Health");
        al.add("Healthcare Payment");
        al.add("Disease Specific Healthcare Research");
        al.add("Self Requested");


        ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, al);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinPurpose.setAdapter(adapter);

        opConsulation = "";
        diagnosticReport = "";
        prescription = "";
        dischargeSummary = "";
        immunisationRecord = "";
        healthDocumentRecord = "";
        wellnessRecord = "";
        invoice = "";


        lytOpConsulation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (opConsulation.equalsIgnoreCase("")) {
                    lytOpConsulation.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtOpConsulation.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    opConsulation = "OPConsultation";
                } else {
                    lytOpConsulation.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtOpConsulation.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    opConsulation = "";
                }

            }
        });
        lytDiagnosticReport.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (diagnosticReport.equalsIgnoreCase("")) {
                    lytDiagnosticReport.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtDiagnosticReport.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    diagnosticReport = "DiagnosticReport";
                } else {
                    lytDiagnosticReport.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtDiagnosticReport.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    diagnosticReport = "";
                }

            }
        });
        lytPrescription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (prescription.equalsIgnoreCase("")) {
                    lytPrescription.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtPrescription.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    prescription = "Prescription";
                } else {
                    lytPrescription.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtPrescription.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    prescription = "";
                }
            }
        });
        lytDischargeSummary.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (dischargeSummary.equalsIgnoreCase("")) {
                    lytDischargeSummary.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtDischargeSummary.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    dischargeSummary = "DischargeSummary";
                } else {
                    lytDischargeSummary.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtDischargeSummary.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    dischargeSummary = "";
                }
            }
        });
        lytImmunisationRecord.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                if (immunisationRecord.equalsIgnoreCase("")) {
                    lytImmunisationRecord.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtImmunisationRecord.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    immunisationRecord = "ImmunizationRecord";
                } else {
                    lytImmunisationRecord.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtImmunisationRecord.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    immunisationRecord = "";
                }
            }
        });
        lytHealthDocumentRecord.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (healthDocumentRecord.equalsIgnoreCase("")) {
                    lytHealthDocumentRecord.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtHealthDocumentRecord.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    healthDocumentRecord = "HealthDocumentRecord";
                } else {
                    lytHealthDocumentRecord.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtHealthDocumentRecord.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    healthDocumentRecord = "";
                }
            }
        });
        lytWellnessRecord.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (wellnessRecord.equalsIgnoreCase("")) {
                    lytWellnessRecord.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtWellnessRecord.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    wellnessRecord = "WellnessRecord";
                } else {
                    lytWellnessRecord.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtWellnessRecord.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    wellnessRecord = "";
                }
            }
        });
        lytInvoice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (invoice.equalsIgnoreCase("")) {
                    lytInvoice.setBackgroundResource(R.drawable.rounded_rectangle_blue);
                    txtInvoice.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                    invoice = "invoice";
                } else {
                    lytInvoice.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
                    txtInvoice.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                    invoice = "";
                }
            }
        });

        edtFromDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //log.i("myLog", "from date clicked");
                setFromDateCalender(edtFromDate, "Consent_Request");
            }
        });
        edtToDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //log.i("myLog", "from date clicked");
                setFromDateCalender(edtToDate, "Consent_Request");
            }
        });

        consentExpiry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //log.i("myLog", "from date clicked");
                setFromDateCalender(consentExpiry, "Consent_Request");
            }
        });

        closeFragment.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                consentDialog.dismiss();
            }
        });


        request_consent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                if (edtFromDate.getText().toString().isEmpty()) {
                    Toast.makeText(getContext(), "Please Enter From Date", Toast.LENGTH_SHORT).show();
                    return;
                }
                if (edtToDate.getText().toString().isEmpty()) {
                    Toast.makeText(getContext(), "Please Enter To Date", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (consentExpiry.getText().toString().isEmpty()) {
                    Toast.makeText(getContext(), "Please Enter Expiry Date", Toast.LENGTH_SHORT).show();
                    return;
                }


                String purpose = spinPurpose.getSelectedItem().toString();
                String purposeCode = "CAREMGT";
                if (purpose.equalsIgnoreCase("Care Management")) {
                    purposeCode = "CAREMGT";
                } else if (purpose.equalsIgnoreCase("Break the Glass")) {
                    purposeCode = "BTG";
                } else if (purpose.equalsIgnoreCase("Public Health")) {
                    purposeCode = "PUBHLTH";
                } else if (purpose.equalsIgnoreCase("Healthcare Payment")) {
                    purposeCode = "HPAYMT";
                } else if (purpose.equalsIgnoreCase("Disease Specific Healthcare Research")) {
                    purposeCode = "DSRCH";
                } else if (purpose.equalsIgnoreCase("Self Requested")) {
                    purposeCode = "PATRQT";
                }


                ArrayList<String> selectHealth = new ArrayList<>();
                selectHealth.clear();
                if (!opConsulation.equalsIgnoreCase(""))
                    selectHealth.add(opConsulation);
                if (!diagnosticReport.equalsIgnoreCase(""))
                    selectHealth.add(diagnosticReport);
                if (!prescription.equalsIgnoreCase(""))
                    selectHealth.add(prescription);
                if (!dischargeSummary.equalsIgnoreCase(""))
                    selectHealth.add(dischargeSummary);
                if (!immunisationRecord.equalsIgnoreCase(""))
                    selectHealth.add(immunisationRecord);
                if (!healthDocumentRecord.equalsIgnoreCase(""))
                    selectHealth.add(healthDocumentRecord);
                if (!wellnessRecord.equalsIgnoreCase(""))
                    selectHealth.add(wellnessRecord);
                if (!invoice.equalsIgnoreCase(""))
                    selectHealth.add(invoice);

                progressBar.setVisibility(VISIBLE);
                request_consent.setVisibility(GONE);
                callApi(request_consent,purpose, purposeCode, selectHealth, edtFromDate.getText().toString(), edtToDate.getText().toString(), consentExpiry.getText().toString());
            }
        });


        consentDialog.show();

    }


    private void callApi(Button request_consent,String purpose, String purposeCode, List<String> selectHealth, String fromDate, String toDate, String expiryDate) {
        //log.i("myLog", "getAbhaAddrSuggestion");
        ConsentRequest request = new ConsentRequest();

        request.setPurpose(new ConsentRequest.Purpose());
        request.getPurpose().setText(purpose);
        request.getPurpose().setCode(purposeCode);
        request.getPurpose().setRefUri("string");


        request.setPermission(new ConsentRequest.Permission());
        request.getPermission().setAccessMode("VIEW");
        request.getPermission().setDataEraseAt(convertToFormattedDate(expiryDate));


        request.getPermission().setDateRange(new ConsentRequest.Permission.DateRange());
        request.getPermission().getDateRange().setFrom(convertToFormattedDate(fromDate));
        request.getPermission().getDateRange().setTo(convertToFormattedDate(toDate));


        request.getPermission().setFrequency(new ConsentRequest.Permission.Frequency());
        request.getPermission().getFrequency().setRepeats(20);
        request.getPermission().getFrequency().setUnit("HOUR");
        request.getPermission().getFrequency().setValue(10);


        request.setHiTypes(selectHealth);
        request.setEmployeeId(employeeId);
        request.setStaffName(staffName);
        request.setAbhaAddress(abhaAddress);
        request.setHiuId(OPHubApplication.getHitypeId());

        Log.i("myLog", "getConsentRequest:" + new Gson().toJson(request));
        Call<List<ConsentRequestResponse>> call = abhaServices.getConsentRequest(request);
        call.enqueue(new Callback<List<ConsentRequestResponse>>() {

            @Override
            public void onResponse(Call<List<ConsentRequestResponse>> call, Response<List<ConsentRequestResponse>> response) {
                try {
                    progressBar.setVisibility(GONE);
                    request_consent.setVisibility(VISIBLE);
                    if (response.body() != null) {
                        List<ConsentRequestResponse> resp = response.body();
                        Toast.makeText(getActivity(), "Consent request sent successfully.", Toast.LENGTH_LONG).show();
                        //system.out.println("print response " + resp.get(0).getPayload().getConsentRequest().getId().toString());
                        getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
                        consentDialog.dismiss();

                    } else if (response.code() == 400) {
                        try {

                            String errorBody = response.errorBody().string();
                            JSONArray jsonArray = new JSONArray(errorBody);
                            JSONObject errorObject = jsonArray.getJSONObject(0).getJSONObject("error");
                            String errorMessage = errorObject.getString("message");

                            Toast.makeText(getActivity(), errorMessage, Toast.LENGTH_LONG).show();

                        } catch (Exception e) {
                            e.printStackTrace();
    //                        Toast.makeText(getActivity(), "Error parsing error message", Toast.LENGTH_LONG).show();
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<ConsentRequestResponse>> call, Throwable t) {
                //log.i("myLog", "getConsentRequest response failure:" + t.toString());

            }
        });
    }

    public static String convertToFormattedDate(String fromDate) {
        // Step 1: Parse the input string into LocalDateTime
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime localDateTime = LocalDateTime.parse(fromDate, inputFormatter);

        // Step 2: Convert LocalDateTime to Instant (UTC) and include milliseconds
        Instant instant = localDateTime.atZone(ZoneOffset.UTC).toInstant();

        // Step 3: Format the Instant to the desired format with milliseconds and 'Z' suffix
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                .withZone(ZoneOffset.UTC);
        return outputFormatter.format(instant);
    }



    private void addNewPatient(String option, String salutationStr, String nameStr, String dobStr, Integer ageStr, String genderStr, String bloodGroupId,
                               String dialCodeStr, String phoneStr, String emailStr, String addressStr, String abhaNoStr,
                               String insuranceNo, String insuranceValidity, String emergencyNoStr) {
        //log.i("mylog", "addNewPatient");
        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
        request.setSalutation(salutationStr);
        request.setPatientName(nameStr);
        request.setDob(dobStr);
        request.setDialCode(dialCodeStr);
        request.setGender(genderStr);
        if (bloodGroupId != null)
            request.setBloodBankId(bloodGroupId);
        request.setMobile(phoneStr);
        request.setEmail(emailStr);
        request.setAddress(addressStr);
        request.setAbhaNo(abhaNoStr);
        request.setHospId(hospId);
        request.setInsuranceId(insuranceNo);
        request.setEmergencyNo(emergencyNoStr);
        request.setInsuranceValidity(insuranceValidity);
        request.setAge(ageStr);
        //log.i("mylog", "addNewPatient request:" + new Gson().toJson(request));
        Call<List<DataResponse>> call = services.addPatient(request);
        call.enqueue(new Callback<List<DataResponse>>() {

            @Override
            public void onResponse(Call<List<DataResponse>> call, Response<List<DataResponse>> response) {
                try {
                    //log.i("myLog", "addNewPatient response:");
                    //log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //log.i("myLog", "addNewPatient response isSuccess:" + response.body().toString());
                        List<DataResponse> list = response.body();
                        if (list != null && list.size() > 0) {
                            DataResponse res = list.get(0);
                            String status = res.getStatus();
                            String message = res.getMessage();
                            patientType = res.getPatientType();
                            //log.i("myLog", "patient type:" + patientType);
                            DataResponse.Details details = res.getDetails();
                            patientId = details.getPatientId();
                            name = details.getPatientName();
                            gender = details.getGender();
                            age = details.getAge();
                            dob = details.getDob();
                            if (dob.contains("T")) {
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
                            emergencyNo = details.getEmergencyNo();
                            //    if (status.equalsIgnoreCase("Success") && option.equalsIgnoreCase("Add")) {
                            if (status.equalsIgnoreCase("Success")) {
                                relLayout.setVisibility(View.VISIBLE);
                                scrollView.setVisibility(View.GONE);
                                //log.i("mYlog", "blood group:" + bloodgroup + "    dob:" + dob + "    address:" + address);
                                txtID.setText(String.valueOf(patientId));
                                txtSalutation.setText(salutation);
                                txtName.setText(name);
                                txtGender.setText(gender + ", " + age + " Years");
                                txtBloodGroup.setText(bloodgroup);
                                txtEmail.setText(email);
                                if (abhaAddress != null && !abhaAddress.isEmpty()) {
                                    txtAbhaAddress.setText("");
                                    txtAbhaAddress.setVisibility(View.VISIBLE);
                                    txtLinkNow.setVisibility(View.GONE);
                                    // btnConsentReq.setVisibility(View.VISIBLE);
                                } else {
                                    txtAbhaAddress.setText("");
                                    txtLinkNow.setVisibility(View.GONE);
                                    txtAbhaAddress.setVisibility(View.GONE);
                                    //   btnConsentReq.setVisibility(View.GONE);
                                }
                                txtDob.setText(birthDayFormat(dob));
                                //    txtCommunicationAddress.setText(address);
                                txtPermanentAddress.setText(address);
                                txtPrimaryNo.setText(phone);
                                txtPrimaryDialCode.setText("+" + dialCode);
                                txtEmergencyNo.setText(emergencyNo);
                                // txtEmergencyDialCode.setText(dialCode);
                                getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                            } else {
                                OPHubUtils.showErrorDialog(getActivity(), message);
                            }
                            //log.i("myLog", "addNewPatient  patientId:" + patientId);
                            //log.i("myLog", "addNewPatient  abhaNo:" + abhaNo);
                        }
                    } else {
                        //log.i("myLog", "response else part");
                        OPHubUtils.showErrorDialog(getActivity(), response.message());

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<DataResponse>> call, Throwable t) {
                //log.i("myLog", "addNewPatient response failure:" + t.toString());
                //log.i("myLog", "addNewPatient response failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //  call.clone().enqueue(this);
            }
        });
    }

    private void updatePatient(String option, String salutate, String age, String name, String dob, String gender, String bloodGroupId,
                               String dialCode, String phone, String email, String address, String abhaNo, String emergencyNo) {
        //log.i("mylog", "updatePatient");
        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
        //log.i("mylog", "ABHA no11:" + abhaNo);
        if (abhaNo.equalsIgnoreCase("-"))
            abhaNo = "";
        //log.i("mylog", "ABHA no:::" + abhaNo + "   len:" + abhaNo.length());
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
        //log.i("mylog", "ABHA no1:" + abhaNo);
        if (abhaNo.equalsIgnoreCase("-"))
            abhaNo = "";
        //log.i("mylog", "ABHA no:" + abhaNo + "   len:" + abhaNo.length());
        if (!abhaNo.isEmpty())
            request.setAbhaNo(abhaNo);
        request.setHospId(hospId);
        request.setEmergencyNo(emergencyNo);
        //log.i("mylog", "updatePatient request:::" + new Gson().toJson(request));
        Call<List<UpdatePatientResponse>> call = services.updatePatient(patientId, hospId, request);
        call.enqueue(new Callback<List<UpdatePatientResponse>>() {

            @Override
            public void onResponse(Call<List<UpdatePatientResponse>> call, Response<List<UpdatePatientResponse>> response) {
                try {
                    //log.i("myLog", "updatePatient response:");
                    //log.i("mylog", "updatePatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //log.i("myLog", "updatePatient response isSuccess:" + response.body().toString());
                        List<UpdatePatientResponse> list = response.body();
                        if (list != null && list.size() > 0) {
                            UpdatePatientResponse res = list.get(0);
                            String status = res.getStatus();
                            String message = res.getMessage();
                            if (status != null && status.equalsIgnoreCase("success")) {
                                relLayout.setVisibility(View.VISIBLE);
                                scrollView.setVisibility(View.GONE);

                                UpdatePatientResponse.Details details = res.getDetails();
                                patientId = details.getPatientId();
                                String name = details.getPatientName();
                                String gender = details.getGender();
                                int age = details.getAge();
                                String bloodGroup = details.getBlood_group();
                                String phone = details.getPhone();
                                String email = details.getEmail();
                                String abhaNo = details.getAbhaNo();
                                String emergencyNo = details.getEmergencyMobileNo();
                                String address = details.getAddress();
                                showProfileimage(details.getImage());
                                txtEmergencyNo.setText(emergencyNo);
                                if (abhaNo != null && !abhaNo.isEmpty()) {
                                    txtAbhaAddress.setText("");
                                    txtAbhaAddress.setVisibility(View.VISIBLE);
                                    txtLinkNow.setVisibility(View.GONE);
                                    //   btnConsentReq.setVisibility(View.VISIBLE);
                                } else {
                                    txtAbhaAddress.setText("");
                                    txtLinkNow.setVisibility(View.GONE);
                                    txtAbhaAddress.setVisibility(View.GONE);
                                    //  btnConsentReq.setVisibility(View.GONE);
                                }
                                txtID.setText(String.valueOf(patientId));
                                txtName.setText(name);
                                txtBloodGroup.setText(bloodgroup);
                                txtEmail.setText(email);
                                txtDob.setText(birthDayFormat(dob));
                                txtGender.setText(gender + ", " + age + " Years");
                                // txtCommunicationAddress.setText(address);
                                txtPermanentAddress.setText(address);
                                txtPrimaryNo.setText(phone);
                                getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                                //log.i("myLog", "updatePatient  patientId:" + patientId);
                                //log.i("myLog", "updatePatient  abhaNo:" + abhaNo);
                                //log.i("myLog", "updatePatient  age:" + age);
                                //log.i("myLog", "updatePatient  bloodGroup:" + bloodGroup);
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
            public void onFailure(Call<List<UpdatePatientResponse>> call, Throwable t) {
                //log.i("myLog", "updatePatient response failure:" + t.toString());
                //log.i("myLog", "updatePatient response failure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void getPatientProfile(int patientId, int hospId) {
        //log.i("myLog", "getPatientProfile:   patientId:" + patientId + "   hospId:" + hospId);
        services.getPatientProfile(patientId, hospId).enqueue(new Callback<GetPatientProfileResponse>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse> call, Response<GetPatientProfileResponse> response) {
                try {
                    //log.i("myLog", "getPatientProfile onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        resp = response.body();
                        GetPatientProfileResponse.Patient patient = resp.getPatient();
                        aayushNo = patient.getAayushUniqueId();
                        abhaNo = patient.getAbhaNo();
                        name = patient.getPatientName();
                        abhaAddress = patient.getAbhaAddress();
                        abahnumber = patient.getAbhaNo();
                        insuranceNo = patient.getInsuranceId();
                        insuranceValidity = patient.getInsurance_validity();
                        medicalHistory = patient.getKnownAllergies();
                        System.out.println("abhanum" + abahnumber);
                        txtabhaNumber.setText(abahnumber);
                        //  txtInsuranceValidity.setText(insuranceValidity);

                        //   patientId = patient.getId();
                        Log.i("myLog", "abhaAddress:" + abhaAddress);
                        if (abhaAddress != null && !abhaAddress.isEmpty()) {
                            txtAbhaAddress.setText("");
                            txtAbhaAddress.setVisibility(View.VISIBLE);
                            txtLinkNow.setVisibility(View.GONE);
                            //  btnConsentReq.setVisibility(View.VISIBLE);
                        } else {
                            txtAbhaAddress.setText("");
                            txtLinkNow.setVisibility(View.GONE);
                            txtAbhaAddress.setVisibility(View.GONE);
                            // btnConsentReq.setVisibility(View.GONE);
                        }

                        txtID.setText(String.valueOf(patient.getId()));
                        txtName.setText(name);
                        salutation = patient.getSalutation();
                        dialCode = patient.getDialCode();
                        age = patient.getAge();
                        gender = patient.getGender();
                        txtGender.setText(gender + ", " + age + " Years");
                        email = patient.getEmail();
                        phone = patient.getMobileno();
                        dob = patient.getDob();
                        emergencyNo = patient.getEmergencyNo();
                        kycVerified = patient.getIskycverified();
    //                    if (kycVerified == 1){
    //                        btnEdit.setVisibility(View.GONE);
    //                    }
                        //log.i("myLog", "emergencyNo:" + emergencyNo);
                        if (email != null && !email.isEmpty()) {
                            txtEmail.setText(email);
                        } else {
                            txtEmail.setText("-");
                        }

                        txtPrimaryNo.setText(phone);
                        if (dob != null && !dob.isEmpty()) {
                            txtDob.setText(birthDayFormat(dob));
                        } else {
                            txtDob.setText("-");
                        }
                        bloodgroup = patient.getBloodGroup();
                        if (bloodgroup != null && !bloodgroup.isEmpty()) {
                            txtBloodGroup.setText(bloodgroup);
                        } else {
                            bloodgroup = "-";
                        }
                        address = patient.getAddress();
                        if (address != null) {
                            if (address.isEmpty())
                                address = "-";
                        }
                        txtEmergencyNo.setText(emergencyNo);
                        if (emergencyNo != null && !emergencyNo.isEmpty()) {
                            txtEmergencyNo.setText(emergencyNo);
                            txtEmergencyDialCode.setText("+" + dialCode);
                        } else {
                            txtEmergencyNo.setText("-");
                        }
                        txtPrimaryDialCode.setText("+" + dialCode);
                        //   txtCommunicationAddress.setText(patient.getAddress());
                        txtPermanentAddress.setText(address);
                        txtSalutation.setText(salutation);
                   //     image=patient.getImageName();
                      //  System.out.println("CheckImageKey"+image);
                        showProfileimage(patient.getImageName());
    //                    getTodayAppts(null, null);
                        AbhaAddressPatientData();
                    } else {
                        //   OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse> call, Throwable t) {
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //log.i("myLog", "onfailure:" + t.getMessage());
            }
        });
    }

    private String birthDayFormat(String dob){

        try {
            SimpleDateFormat fromFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            SimpleDateFormat toFormat = new SimpleDateFormat("dd-MMMM-yyyy", Locale.getDefault());
            Date date = fromFormat.parse(dob);
            String formattedDate = toFormat.format(date);
            txtDob.setText(formattedDate);
            return formattedDate;
        } catch (ParseException e) {
            txtDob.setText("-");
        }
        return " ";
    }

    private void showProfileimage(String images) {
        Log.i("myLog", "showProfileImage");
        Log.i("myLog", "imgName:Get" + images);
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setKey(images);
        Log.i("mylog", "Image request : " + new Gson().toJson(request));
        Call<ResponseBody> call = imageServices.getProfileImageNew(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                try {
                    if (response.body() != null) {
                        Log.i("myLog", "server contacted");

                        try {
                            byte[] bytes = response.body().bytes();
                            Log.i("myLog", "byte  length:" + bytes.length);
                            if (bytes != null) {
                                byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                                if (decodedImageBytes != null) {
                                    Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                                    if (bitmap != null) {
                                        imgProfile.setImageBitmap(bitmap);
                                        image=images;
                                        Log.i("myLog", "after image set");
                                    }
                                }else {
                                    imgProfile.setBackgroundResource(R.drawable.ic_user);
                                    Log.i("myLog", " default after image set");
                                }
                            }
                        } catch (Exception e) {
                            imgProfile.setBackgroundResource(R.drawable.ic_user);
                            Log.e("myLog", "Error decoding image", e);
                        }

                    } else {
                        imgProfile.setBackgroundResource(R.drawable.ic_user);
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

    private void showUpcomingAppts(List<GetAppointmentResponse.Datum> list,int initial, int end) {
        System.out.println("print iside value");
        tblView.removeAllViews();
        txtCaseSheet.setVisibility(View.GONE);
        linearHead.setVisibility(View.VISIBLE);
        recyclerView.setVisibility(View.GONE);
        // tblView.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        //  tblView.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_white));
        int size = totSize;
        if (size <= 0) {
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            linearHead.setVisibility(View.GONE);

        } else {
            linearHead.setVisibility(View.VISIBLE);
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);

            int initVal = initial;

            int endVal = end - totSize;
            //Log.i("myLog", "endVal:" + endVal + "    end:" + end);
            if (endVal > 0)
                end = end - endVal;
            //Log.i("myLog", "endVal:" + endVal + "    end:" + end + "   totSize:" + totSize);

            txtResults.setText("Results " + initVal + "-" + end + " of " + totSize);

            for (int start = 0; start < listResp.size(); start++) {
                final int index = start;
                GetAppointmentResponse.Datum resp = list.get(start);

                String module = resp.getModule();
                String appType = "";

                if (module.equalsIgnoreCase("Appointment")) {
                    appType = " [Appt]";
                } else if (module.equalsIgnoreCase("opd")) {
                    appType = " [OPD]";
                } else {
                    appType = " [IPD]";
                }

                TableRow tr = new TableRow(getActivity());
                TextView txtSlNo = new TextView(getActivity());
                txtSlNo.setText(String.valueOf(start + 1));
                txtSlNo.setTextColor(Color.BLACK);
                txtSlNo.setTypeface(typeface);
                txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSlNo.setGravity(Gravity.CENTER);
                tr.addView(txtSlNo, slNoParam);

                TextView txtName = new TextView(getActivity());
                txtName.setText(resp.getConsultant());
                txtName.setTextColor(Color.BLACK);
                txtName.setTypeface(typeface);
                txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtName.setGravity(Gravity.CENTER);
                tr.addView(txtName, txtParam);

                TextView txtApptNo = new TextView(getActivity());
                txtApptNo.setText(resp.getAppointmentId() + appType);
                txtApptNo.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor));
                txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtApptNo.setGravity(Gravity.CENTER);
                txtApptNo.setTypeface(typeface);
                tr.addView(txtApptNo, txtParam);

                TextView txtOPDNo = new TextView(getActivity());
                txtOPDNo.setText(resp.getOpdId());
                txtOPDNo.setTextColor(Color.BLACK);
                txtOPDNo.setTypeface(typeface);
                txtOPDNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtOPDNo.setGravity(Gravity.CENTER);
                tr.addView(txtOPDNo, txtParam);

                TextView txtApptDate = new TextView(getActivity());
                txtApptDate.setText(resp.getAppointmentDate());
                txtApptDate.setTextColor(Color.BLACK);
                txtApptDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtApptDate.setGravity(Gravity.CENTER);
                txtApptDate.setTypeface(typeface);
                tr.addView(txtApptDate, txtParam);

                TextView txtSpeciality = new TextView(getActivity());
                txtSpeciality.setText(resp.getDoctorSpecialist());
                txtSpeciality.setTextColor(Color.BLACK);
                txtSpeciality.setTypeface(typeface);
                txtSpeciality.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSpeciality.setGravity(Gravity.CENTER);
                tr.addView(txtSpeciality, txtParam);

                TextView txtStatus = new TextView(getActivity());
                txtStatus.setText(resp.getAppointmentStatus());
                txtStatus.setTextColor(Color.WHITE);
                txtStatus.setTypeface(typeface);
                String colorCode = resp.getColorCode();
                if (colorCode != null && !colorCode.isEmpty()) {
                    Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.rounded_approved_bg);
                    GradientDrawable gradientDrawable = (GradientDrawable) drawable;
                    gradientDrawable.setColor(Color.parseColor(colorCode));
                    txtStatus.setBackground(gradientDrawable);
                }
                txtStatus.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtStatus.setGravity(Gravity.CENTER);
                tr.addView(txtStatus, txtParam);
                TableRow trLine1 = new TableRow(getActivity());
                View v1 = new View(getActivity());
                v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
                trLine1.addView(v1, lineParam);
                tblView.addView(tr);
                tblView.addView(trLine1);
                txtApptNo.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {
                            if (module.equalsIgnoreCase("APPOINTMENT")) {
                                GetAppointmentResponse.Datum resp = list.get(index);
                                String apptId = resp.getAppointmentId();
                                String status = resp.getAppointmentStatus();
                                String statusId = resp.getAppointmentStatusId();
                                int doctorId = resp.getDoctor();
                                String doctor = resp.getConsultant();
                                double apptFees = resp.getApptFees();
                                //log.i("myLog", "apptFees :" + apptFees);
                                gotoApptSubMenuFragment(apptId, doctor, doctorId, status, statusId, apptFees, "Info");
                            } else {
                                showUnderDevelopment();
                            }
                        }
                    }
                });
                txtStatus.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {
                            GetAppointmentResponse.Datum resp = list.get(index);
                            String apptId = resp.getAppointmentId();
                            String status = resp.getAppointmentStatus();
                            String statusId = resp.getAppointmentStatusId();
                            int doctorId = resp.getDoctor();
                            String doctor = resp.getConsultant();
                            double apptFees = resp.getApptFees();
                            //log.i("myLog", "apptFees :" + apptFees);
                            gotoApptSubMenuFragment(apptId, doctor, doctorId, status, statusId, apptFees, "Tracking");
                        }
                    }
                });
            }
        }
    }


    public void showUnderDevelopment() {
        underDevelop = new Dialog(getActivity());
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


    private void showHistoryAppts(List<GetAppointmentResponse.Datum> list,int initial, int end) {
        tblView.removeAllViews();
        txtCaseSheet.setVisibility(View.VISIBLE);
        linearHead.setVisibility(View.VISIBLE);
        recyclerView.setVisibility(View.GONE);
        int size = totSize;
        if (size <= 0) {
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            linearHead.setVisibility(View.GONE);

        } else {
            linearHead.setVisibility(View.VISIBLE);
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);



            int initVal = initial;

            int endVal = end - totSize;
            //Log.i("myLog", "endVal:" + endVal + "    end:" + end);
            if (endVal > 0)
                end = end - endVal;
            //Log.i("myLog", "endVal:" + endVal + "    end:" + end + "   totSize:" + totSize);

            txtResults.setText("Results " + initVal + "-" + end + " of " + totSize);

            for (int start = 0; start < list.size(); start++) {
                final int index = start;
                GetAppointmentResponse.Datum resp = list.get(start);

                TableRow tr = new TableRow(getActivity());
                TextView txtSlNo = new TextView(getActivity());
                txtSlNo.setText(String.valueOf(start + 1));
                txtSlNo.setTextColor(Color.BLACK);
                txtSlNo.setTypeface(typeface);
                txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSlNo.setGravity(Gravity.CENTER);
                tr.addView(txtSlNo, slNoParam);

                TextView txtName = new TextView(getActivity());
                txtName.setText(resp.getConsultant());
                txtName.setTextColor(Color.BLACK);
                txtName.setTypeface(typeface);
                txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtName.setGravity(Gravity.CENTER);
                tr.addView(txtName, historyTxtParam);

                TextView txtApptNo = new TextView(getActivity());
                txtApptNo.setText(resp.getAppointmentId());
                txtApptNo.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor));
                txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtApptNo.setGravity(Gravity.CENTER);
                txtApptNo.setTypeface(typeface);
                tr.addView(txtApptNo, historyTxtParam);

                TextView txtOPDNo = new TextView(getActivity());
                txtOPDNo.setText(resp.getOpdId());
                txtOPDNo.setTextColor(Color.BLACK);
                txtOPDNo.setTypeface(typeface);
                txtOPDNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtOPDNo.setGravity(Gravity.CENTER);
                tr.addView(txtOPDNo, historyTxtParam);

                TextView txtApptDate = new TextView(getActivity());
                txtApptDate.setText(resp.getAppointmentDate());
                txtApptDate.setTextColor(Color.BLACK);
                txtApptDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtApptDate.setGravity(Gravity.CENTER);
                txtApptDate.setTypeface(typeface);
                tr.addView(txtApptDate, historyTxtParam);

                TextView txtSpeciality = new TextView(getActivity());
                txtSpeciality.setText(resp.getDoctorSpecialist());
                txtSpeciality.setTextColor(Color.BLACK);
                txtSpeciality.setTypeface(typeface);
                txtSpeciality.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSpeciality.setGravity(Gravity.CENTER);
                tr.addView(txtSpeciality, historyTxtParam);

                String status = resp.getAppointmentStatus();
                TextView txtStatus = new TextView(getActivity());
                txtStatus.setText(resp.getAppointmentStatus());
                txtStatus.setTextColor(Color.WHITE);
                txtStatus.setTypeface(typeface);
                String colorCode = resp.getColorCode();
                if (colorCode != null && !colorCode.isEmpty()) {
                    Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.rounded_approved_bg);
                    GradientDrawable gradientDrawable = (GradientDrawable) drawable;
                    gradientDrawable.setColor(Color.parseColor(colorCode));
                    txtStatus.setBackground(gradientDrawable);
                }
                txtStatus.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtStatus.setGravity(Gravity.CENTER);
                tr.addView(txtStatus, historyTxtParam);
                String value = resp.getCaseSheetDoc();
                ImageView imgCaseShhet = new ImageView(getActivity());
                imgCaseShhet.setImageDrawable(ContextCompat.getDrawable(getContext(), R.drawable.pdf));
                tr.addView(imgCaseShhet, imgParam);
                if (status.equalsIgnoreCase("Completed") && value != null && !value.isEmpty()) {
                    imgCaseShhet.setVisibility(View.VISIBLE);
                } else imgCaseShhet.setVisibility(View.INVISIBLE);
                TableRow trLine1 = new TableRow(getActivity());
                View v1 = new View(getActivity());
                v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
                trLine1.addView(v1, historyLineParam);
                tblView.addView(tr);
                tblView.addView(trLine1);
                txtApptNo.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {
                            GetAppointmentResponse.Datum resp = list.get(index);
                            String apptId = resp.getAppointmentId();
                            String status = resp.getAppointmentStatus();
                            String statusId = resp.getAppointmentStatusId();
                            int doctorId = resp.getDoctor();
                            String doctor = resp.getConsultant();
                            double apptFees = resp.getApptFees();
                            //log.i("myLog", "apptFees :" + apptFees);
                            gotoApptSubMenuFragment(apptId, doctor, doctorId, status, statusId, apptFees, "Info");
                        }
                    }
                });
                txtStatus.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {
                            GetAppointmentResponse.Datum resp = list.get(index);
                            String apptId = resp.getAppointmentId();
                            String status = resp.getAppointmentStatus();
                            String statusId = resp.getAppointmentStatusId();
                            int doctorId = resp.getDoctor();
                            String doctor = resp.getConsultant();
                            double apptFees = resp.getApptFees();
                            //log.i("myLog", "apptFees :" + apptFees);
                            gotoApptSubMenuFragment(apptId, doctor, doctorId, status, statusId, apptFees, "Tracking");
                        }
                    }
                });
                imgCaseShhet.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {
                            GetAppointmentResponse.Datum resp = list.get(index);
                            String value = resp.getCaseSheetDoc();
                            String apptId = resp.getAppointmentId();
                            //log.i("myLog", "value:" + value);
                            viewFile(value, apptId + "_case_sheet_view.pdf");

                        }
                    }
                });
            }
        }
    }

    private void gotoApptSubMenuFragment(String apptId, String doctor, int doctorId, String status, String statusId, double apptFees, String toTab) {
        AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("appt_id", apptId);
        result.putString("from_screen", "Profile_Appt");
        result.putString("to_tab", toTab);
        result.putString("doctor_name", doctor);
        result.putInt("doctor_id", doctorId);
        result.putInt("patient_id", patientId);
        result.putString("appt_status", status);
        result.putString("appt_status_id", statusId);
        result.putString("VITALS", "NOTRPT");
        result.putDouble("appt_fees", apptFees);
        if (spinnerAbhaAddress != null) {
            Object selectedItem = spinnerAbhaAddress.getSelectedItem();
            if (selectedItem != null) {
                String abhalist = selectedItem.toString();
                result.putString("abha_address", abhalist);
                //system.out.println("abha_address print" + abhalist);
            }
        } else {
            Log.e("SpinnerError", "Spinner is null");
        }

        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }


    private void showFile(String imgName) {
        //log.i("myLog", "showFile");
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setValue(imgName);
        Call<ResponseBody> call = fileServices.getProfileImage(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                try {
                    if (response.body() != null) {
                        //log.i("myLog", "server contacted and has file");

                        try {
                            byte[] bytes = response.body().bytes();
                            //log.i("myLog", "byte  length:" + bytes.length);
                            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                            Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                            showViewFileDialog(bitmap);
                            //log.i("myLog", "after image set");
                        } catch (Exception e) {
                            //log.i("myLog", "Exception :" + e.toString());
                        }

                    } else {
                        //log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                //log.i("myLog", "showFile response failure:" + t.toString());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void showViewFileDialog(Bitmap bitmap) {
        //log.i("myLog", "showViewFileDialog");
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
             /*   if (!checkCameraPermission()) {
                    requestCameraPermission();
                } else {
                    pickFromGallery();
                }*/
            }
        });

        linearGallery.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
             /*   if (!checkCameraPermission()) {
                    requestCameraPermission();
                } else {
                    pickFromGallery();
                }*/
            }
        });
        // create and show the alert dialog
        dialog = builder.create();
        dialog.show();
    }


    public void showFilterDialog(String option) {
        dialogFilter = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_appointment_filter, null);
        dialogFilter.setContentView(view);
        dialogFilter.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogFilter.getWindow().setGravity(Gravity.CENTER);
        dialogFilter.setCancelable(false);
        Button btnCancel = dialogFilter.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogFilter.findViewById(R.id.btnSubmit);
        ImageView imgClose = dialogFilter.findViewById(R.id.imgClose);
        TextView txtClearFilter = dialogFilter.findViewById(R.id.txtClearFilter);
        Spinner spinDoctor = dialogFilter.findViewById(R.id.spinDoctor);
        EditText edtSelDate = dialogFilter.findViewById(R.id.edtSelDate);
        TextView txtSelDate = dialogFilter.findViewById(R.id.txtTitleSelDate);
        EditText edtFromDate = dialogFilter.findViewById(R.id.edtFromDate);
        EditText edtToDate = dialogFilter.findViewById(R.id.edtToDate);
        TextView txtFromDate = dialogFilter.findViewById(R.id.txtTitleFromDate);
        TextView txtToDate = dialogFilter.findViewById(R.id.txtTitleToDate);
        TextView txtStatus = dialogFilter.findViewById(R.id.txtStatus);
        RelativeLayout relStatus = dialogFilter.findViewById(R.id.relStatus);
        TextView txtPaymentStatus = dialogFilter.findViewById(R.id.txtPaymentStatus);
        RelativeLayout relPaymentStatus = dialogFilter.findViewById(R.id.relPaymentStatus);
        edtFromDate.setVisibility(View.GONE);
        edtToDate.setVisibility(View.GONE);
        txtFromDate.setVisibility(View.GONE);
        txtToDate.setVisibility(View.GONE);
        txtStatus.setVisibility(View.GONE);
        relStatus.setVisibility(View.GONE);
        edtSelDate.setVisibility(View.VISIBLE);
        txtSelDate.setVisibility(View.VISIBLE);
        relPaymentStatus.setVisibility(View.GONE);
        txtPaymentStatus.setVisibility(View.GONE);
        txtClearFilter.setVisibility(View.VISIBLE);
        getDoctors(String.valueOf(hospId), spinDoctor);
        if (selectDate != null){
            edtSelDate.setText(selectDate);
        }

        txtClearFilter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                selectDate = null;
                selectDoctor = null;
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                if (option.equalsIgnoreCase("Today"))
                    getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                else if (option.equalsIgnoreCase("Upcoming"))
                    getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                else
                    getHistoryAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                dialogFilter.dismiss();
            }
        });

        edtSelDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //log.i("myLog", "from date clicked");
                setFromDateCalender(edtSelDate, option);
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogFilter.dismiss();
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogFilter.dismiss();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String doctorID = null, date = null;
                String doctor = spinDoctor.getSelectedItem().toString();
                selectDoctor = doctor;
                //log.i("myLog", "Doctor:" + doctor);
                if (!doctor.contains("Select Doctor")) {
                    int pos = spinDoctor.getSelectedItemPosition();
                    int id = doctorId.get(pos);
                    doctorID = String.valueOf(id);
                }
                String selDate = edtSelDate.getText().toString();
                if (!selDate.isEmpty())
                    date = selDate;
                if (doctorID != null || date != null) {
                    if (option.equalsIgnoreCase("Today")) {
                        getTodayAppts(doctorID, date,String.valueOf(selPageCount), String.valueOf(currentPage));
                        dialogFilter.dismiss();
                    } else if (option.equalsIgnoreCase("Upcoming")) {
                        getUpcomingAppts(doctorID, date,String.valueOf(selPageCount), String.valueOf(currentPage));
                        dialogFilter.dismiss();
                    } else {
                        getHistoryAppts(doctorID, date,String.valueOf(selPageCount), String.valueOf(currentPage));
                        dialogFilter.dismiss();
                    }
                    selectDate = selDate;
                    imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
                } else {
                    Toast.makeText(getActivity(), "Please select doctor or date", Toast.LENGTH_SHORT).show();
                }


            }
        });
        dialogFilter.show();
//        imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
    }

    private void setFromDateCalender(EditText edtSelDate, String option) {
        Calendar calendar = Calendar.getInstance();

        // Get the current date
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DAY_OF_MONTH);

        // on below line we are creating a variable for date picker dialog.
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                // on below line we are passing context.
                getActivity(),
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        // on below line we are setting date to our text view.
                        String day = String.valueOf(dayOfMonth);
                        if (day.length() == 1)
                            day = "0" + day;
                        String month = String.valueOf(monthOfYear + 1);
                        if (month.length() == 1)
                            month = "0" + month;
                        String selDate = year + "-" + month + "-" + day;
                        edtSelDate.setText(selDate);
                        if (option.equalsIgnoreCase("Consent_Request")) {
                            openTimePicker(edtSelDate, selDate);
                        }

                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        // at last we are calling show to
        // display our date picker dialog.
        if (option.equalsIgnoreCase("Upcoming")) {
            Calendar calendar1 = Calendar.getInstance();

            // Subtract one day to set as maximum date
            calendar1.add(Calendar.DAY_OF_MONTH, +1);
            long minDate = calendar1.getTimeInMillis();
            datePickerDialog.getDatePicker().setMinDate(minDate);

        } else if (option.equalsIgnoreCase("History")) {
            Calendar calendar2 = Calendar.getInstance();
            // Subtract one day to set as maximum date
            calendar2.add(Calendar.DAY_OF_MONTH, -1);
            long maxDate = calendar2.getTimeInMillis();
            datePickerDialog.getDatePicker().setMaxDate(maxDate);
        }
        datePickerDialog.show();
    }


    private void openTimePicker(EditText edtSelDate, String selectedDate) {
        Calendar calendar = Calendar.getInstance();

        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);

        TimePickerDialog timePickerDialog = new TimePickerDialog(
                getActivity(),
                new TimePickerDialog.OnTimeSetListener() {
                    @Override
                    public void onTimeSet(TimePicker view, int hourOfDay, int minute) {
                        // Format hour and minute to add leading zero if needed
                        String hourStr = String.valueOf(hourOfDay);
                        if (hourStr.length() == 1)
                            hourStr = "0" + hourStr;

                        String minuteStr = String.valueOf(minute);
                        if (minuteStr.length() == 1)
                            minuteStr = "0" + minuteStr;

                        // Combine date and time
                        String selectedDateTime = selectedDate + " " + hourStr + ":" + minuteStr;

                        // Set the selected date and time in the EditText
                        edtSelDate.setText(selectedDateTime);
                    }
                },
                hour, minute, true);
        timePickerDialog.setCancelable(false);
        timePickerDialog.setButton(DialogInterface.BUTTON_NEGATIVE, "", (DialogInterface.OnClickListener) null);

        timePickerDialog.show();
    }


    private void getDoctors(String hospID, Spinner spinDoctor) {
        //log.i("myLog", "getDoctors");
        //log.i("myLog", "hospID:" + hospID);
        services.getDoctors(hospID).enqueue(new Callback<List<GetDoctorResponse>>() {

            @Override
            public void onResponse(Call<List<GetDoctorResponse>> call, Response<List<GetDoctorResponse>> response) {
                try {
                    //log.i("myLog", "getDoctors onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetDoctorResponse> list = response.body();
                        int size = list.size();
                        ArrayList<String> doctorName = new ArrayList<>();
                        doctorId = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            GetDoctorResponse resp = list.get(start);
                            doctorName.add(resp.getInternalDoctorName());
                            doctorId.add(resp.getInternalDoctorId());
                        }
                        OPHubUtils.addProdTypeSpinner(getActivity(), doctorName, spinDoctor, "Select Doctor");
                        if (selectDoctor != null) {
                            int index = doctorName.indexOf(selectDoctor);
                            spinDoctor.setSelection(index);
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<List<GetDoctorResponse>> call, Throwable t) {
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void setFromDateCalender(String option) {
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
                        String day = String.valueOf(dayOfMonth);
                        if (day.length() == 1)
                            day = "0" + day;
                        String month = String.valueOf(monthOfYear + 1);
                        if (month.length() == 1)
                            month = "0" + month;
                        //    String selDate = year + "-" + month + "-" + day;
                        String selDate = day + "/" + month + "/" + year;
                        if (option.equalsIgnoreCase("dob")) {
                            edtDob.setText(year + "-" + month + "-" + day);
                            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

                            // on below line we are creating a variable
                            // for current date and time and calling a simple date format in it.
                            String currDate = sdf.format(new Date());

                            ageCaluculate(selDate, currDate);
                        } else if (option.equalsIgnoreCase("insurance")) {
                            txtInsuranceValidity.setText(year + "-" + month + "-" + day);
                        }
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        // at last we are calling show to
        // display our date picker dialog.
        datePickerDialog.getDatePicker().setMaxDate(c.getTimeInMillis());
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


    private void pickFromGallery() {
        //  CropImage.activity().start(getActivity());
        openSomeActivityForResult();
    }

    public void openSomeActivityForResult() {
//        Intent intent = new Intent(getActivity(), CropImage.class);
//        someActivityResultLauncher.launch(intent);
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
                        //log.i("myLog", "data received");


                    }
                }
            });

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        //log.i("myLog", "request code:" + requestCode +"    result code:" + resultCode);
        // Handle image capture result
        Bitmap bitmap = CameraUtils.handleImageCapture(getContext(), requestCode, resultCode, data);
        if (bitmap != null) {
            AbhaDialogUtils.setImage(bitmap);
        }
    }


    private void checkAbhaQR() {
        //log.i("mylog", "checkAbhaQR");
        OPHubRequests.CheckAbhaQR request = new OPHubRequests.CheckAbhaQR();
        request.setHid(hid);
        request.setDob(dob);
        request.setGender(gender);
        request.setAddress(address);
        request.setMobile(phone);
        request.setHidn(abhaNo);
        request.setAddress(address);
        request.setHospitalId(hospId);
        //log.i("mylog", "checkAbhaQR request:::" + new Gson().toJson(request));
        Call<List<AbhaLinkResponse>> call = services.checkByAbhaQRs(request);
        call.enqueue(new Callback<List<AbhaLinkResponse>>() {

            @Override
            public void onResponse(Call<List<AbhaLinkResponse>> call, Response<List<AbhaLinkResponse>> response) {
                try {
                    //log.i("myLog", "checkAbhaQR response:");
//                //log.i("mylog", "checkAbhaQR response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {

                        List<AbhaLinkResponse> res = response.body();
                        //log.i("myLog", "checkAbhaQR response isSuccess:" + res.size());

                        if (res != null) {
                            AbhaDialogUtils.selectAbhaAddrLinkDialogNew(getContext(), getParentFragment(), res);
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<AbhaLinkResponse>> call, Throwable t) {

            }


        });

    }

    public void ageCaluculate(String dob, String currDate) {
        //log.i("myLog", "ageCaluculate dob:" + dob + "   currDate:" + currDate);
        SimpleDateFormat simpleDateFormat1 = new SimpleDateFormat("dd/MM/yyyy");
        try {
            // converting it to date format
            Date date1 = simpleDateFormat1.parse(dob);
            Date date2 = simpleDateFormat1.parse(currDate);

            long startdate = date1.getTime();
            long endDate = date2.getTime();

            // condition
            if (startdate <= endDate) {
                Period period = new Period(startdate, endDate, PeriodType.yearMonthDay());
                int years = period.getYears();
                int months = period.getMonths();
                int days = period.getDays();

                // show the final output
                edtAge.setText(String.valueOf(years));
                //log.i("myLog", "age:" + years);
            } else {
                // show message
                //  Toast.makeText(getActivity(), "BirthDate should not be larger than today's date!", Toast.LENGTH_SHORT).show();
            }
        } catch (ParseException e) {
            //log.i("myLog", "age exception");
            e.printStackTrace();
        }
    }


    private void getAppointmentStatus(String hospId) {
        //log.i("myLog", "getAppointmentStatus hospId:" + hospId);
        services.getAppointmentStatus(hospId).enqueue(new Callback<List<GetAppointmentStatusResponse>>() {

            @Override
            public void onResponse(Call<List<GetAppointmentStatusResponse>> call, Response<List<GetAppointmentStatusResponse>> response) {
                try {
                    //log.i("myLog", "getAppointmentStatus onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetAppointmentStatusResponse> list = response.body();
                        int size = list.size();
                        alStatus = new ArrayList<>();
                        alStatusId = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            GetAppointmentStatusResponse resp = list.get(start);
                            alStatus.add(resp.getStatus());
                            alStatusId.add(resp.getId());
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<GetAppointmentStatusResponse>> call, Throwable t) {
                ////log.i("myLog", "getAppointmentStatus onFailure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void getUpcomingAppts(String doctorId, String date, String limit, String page) {
        //  if (listResp != null) listResp.clear();
        //log.i("myLog", "getUpcomingAppts");
        ////log.i("myLog", "getAppointments fromDate:" + fromDate + "  toDate:" + toDate + "  doctorId:" + doctorId + "  appointStatus:" + appointStatus + "  hospitalId:" + hospitalId);
        Log.i("myLog", "Upcoming appointment"+ "doctor : " + doctorId + " date :" + date );
        services.getUpcomingAppts(hospId, patientId, doctorId, date,limit,page).enqueue(new Callback<GetAppointmentResponse>() {
            @Override
            public void onResponse(Call<GetAppointmentResponse> call, Response<GetAppointmentResponse> response) {
                try {
                    //log.i("myLog", "getUpcomingAppts onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        listResp = response.body().getData();
                        if (response.body().getTotal() != null){
                            totSize =  Integer.parseInt(response.body().getTotal().toString());
                        }else {
                            totSize = 0;
                        }
                        showInitialList1(listResp);

                    } else {
                        // OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }


            @Override
            public void onFailure(Call<GetAppointmentResponse> call, Throwable t) {
                //log.i("myLog", " getUpcomingAppts failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void getHistoryAppts(String doctorId, String date, String limit, String page) {
        //  if (listResp != null) listResp.clear();
        //log.i("myLog", "getHistoryAppts");
        ////log.i("myLog", "getAppointments fromDate:" + fromDate + "  toDate:" + toDate + "  doctorId:" + doctorId + "  appointStatus:" + appointStatus + "  hospitalId:" + hospitalId);
        services.getHistoryAppts(hospId, patientId, doctorId, date,limit,page).enqueue(new Callback<GetAppointmentResponse>() {
            @Override
            public void onResponse(Call<GetAppointmentResponse> call, Response<GetAppointmentResponse> response) {
                try {
                    //log.i("myLog", "getHistoryAppts onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        listResp = response.body().getData();
                        if (response.body().getTotal() != null){
                            totSize =  Integer.parseInt(response.body().getTotal().toString());
                        }else {
                            totSize = 0;
                        }
                        showInitialList1(listResp);
                        //  showUpcomingAppts(list);
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<GetAppointmentResponse> call, Throwable t) {
                Log.i("myLog", " getHistoryAppts failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void getTodayAppts(String doctorId, String date,String limit,String page) {
        //  if (listResp != null) listResp.clear();
        Log.i("myLog", "getTodayAppts");
        ////log.i("myLog", "getAppointments fromDate:" + fromDate + "  toDate:" + toDate + "  doctorId:" + doctorId + "  appointStatus:" + appointStatus + "  hospitalId:" + hospitalId);
        services.getTodayAppts(hospId, patientId, doctorId, date,limit,page).enqueue(new Callback<GetAppointmentResponse>() {
            @Override
            public void onResponse(Call<GetAppointmentResponse> call, Response<GetAppointmentResponse> response) {
                try {
                    Log.i("myLog", "getTodayAppts onResponse:" + new Gson().toJson(response.body()));
//                if (response.body() != null) {
                    listResp = response.body().getData();
//                    showUpcomingAppts(list,0,0);
                    if (response.body().getTotal() != null){
                        totSize =  Integer.parseInt(response.body().getTotal().toString());
                    }else {
                        totSize = 0;
                    }
                    showInitialList1(listResp);

                    System.out.println("print totsize " + totSize);
                    // else {
                    // OPHubUtils.showErrorDialog(getActivity(), response.message());
                    //}
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetAppointmentResponse> call, Throwable t) {
                Log.i("myLog", " getTodayAppts failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void showInitialList1(List<GetAppointmentResponse.Datum> list) {
        Log.i("myLog", "Show initail list");
//        int size = listResp.size();
        linearPages.setVisibility(VISIBLE);
        if (totSize > 0) {
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
//            totSize = listResp.size();
            totPage = totSize / selPageCount;
            remPage = totSize % selPageCount;
            if (remPage != 0)
                totPage = totPage + 1;
            //Log.i("myLog", "totSize:" + totSize + "   total pages:" + totPage);
            if (totPage <= 4)
                endPageNo = totPage;
            else
                endPageNo = 4;
            selEnd = selInitial + selPageCount;
            showPages1(list);
            if (option != null && option.equalsIgnoreCase("tracking")) {
                selEnd = currentPage * selPageCount;
                selInitial = selEnd - selPageCount;

            }

            if (totSize < selPageCount)
                selEnd = totSize;
            if (selTab.equalsIgnoreCase("todayAppointment") || selTab.equalsIgnoreCase("Appointment"))
                showUpcomingAppts(list,selInitial, selEnd);
            else
                showHistoryAppts(list,selInitial, selEnd);

        } else {
            tblPages.removeAllViews();
            tblView.removeAllViews();
            currentPage = 0;
            totPage = 0;
            remPage = 0;
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            linearHead.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            System.out.println("print else part");
        }
    }

    private void showInitialList2(List<GetConsentListResp.Datum> list) {
        Log.i("myLog", "Show initail list");
//        int size = listResp.size();
        linearPages.setVisibility(VISIBLE);
        if (totSize > 0) {
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
//            totSize = listResp.size();
            totPage = totSize / selPageCount;
            remPage = totSize % selPageCount;
            if (remPage != 0)
                totPage = totPage + 1;
            //Log.i("myLog", "totSize:" + totSize + "   total pages:" + totPage);
            if (totPage <= 4)
                endPageNo = totPage;
            else
                endPageNo = 4;
            selEnd = selInitial + selPageCount;
            showPages2(list);
            if (option != null && option.equalsIgnoreCase("tracking")) {
                selEnd = currentPage * selPageCount;
                selInitial = selEnd - selPageCount;

            }

            if (totSize < selPageCount)
                selEnd = totSize;
//            showUpcomingAppts(list,selInitial, selEnd);
            showConsentList(list,selInitial, selEnd);

        } else {
            tblPages.removeAllViews();
            tblView.removeAllViews();
            currentPage = 0;
            totPage = 0;
            remPage = 0;
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            linearHead.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            System.out.println("print else part");
        }
    }

    private void showPages1(List<GetAppointmentResponse.Datum> list) {
        Log.i("myLog", "show pages1");
        //Log.i("myLog", "show pages1 initial page:" + initPageNo + "  end page:" + endPageNo);
        tblPages.removeAllViews();
        Log.i("myLog", "show pages1 tot page:" + totPage);
      /*  if (totPage > 0) {
            imgPrev.setVisibility(View.VISIBLE);
            imgNext.setVisibility(View.VISIBLE);
            // txtEtc.setVisibility(View.VISIBLE);
            //txtLastPage.setVisibility(View.VISIBLE);
        } else {
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
        }*/
        TableRow tr = new TableRow(getActivity());
        tr.setGravity(Gravity.CENTER);
        int endPage;
        if (totPage <= 4) {
            endPage = totPage;
        } else {
            endPage = 4;
        }
        if (endPageNo > totPage) {
            endPage = endPageNo - totPage;
            initPageNo = totPage - 3;
        }
        Log.i("myLog", "show pages1 tot pageeeeeeee:" + totPage);
        if (totPage > 4) {
            imgPrev.setVisibility(View.VISIBLE);
            imgNext.setVisibility(View.VISIBLE);
            txtEtc.setVisibility(View.VISIBLE);
            txtLastPage.setVisibility(View.VISIBLE);
            txtLastPage.setText(String.valueOf(totPage));
        } else {
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgPrev.setVisibility(View.INVISIBLE);
            imgNext.setVisibility(View.INVISIBLE);
        }

        txtNo = new TextView[endPage];

        for (int index = 0; index < endPage; index++) {
            final int start = index;
            final int endNo = endPage;
            //  //Log.i("myLog", "init page:" + initPageNo + "    index:" + index);
            int pageNo = index + initPageNo;

            txtNo[index] = new TextView(getActivity());
            txtNo[index].setText(String.valueOf(pageNo));
            //  txtNo[index].setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtNo[index].setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            txtNo[index].setGravity(Gravity.CENTER);
            if (pageNo == currentPage) {
                txtNo[index].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(getContext(), R.color.white));
            } else {
                txtNo[index].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.light_blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            }


            tr.addView(txtNo[index], pageTxtParam);

            txtNo[index].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String no = txtNo[start].getText().toString();
                    int number = Integer.parseInt(no);
                    //Log.i("mylog", "Selected page number:" + number + "   totPage:" + totPage);
                    currentPage = number;
                    //Log.i("mylog", "Selected page no:" + currentPage);
                    //   showPrevNextPages1(listResp);
                    for (int i = 0; i < endNo; i++) {
                        //    //Log.i("myLog", "i==:" + i + "  start:" + start + "   totPage:" + totPage);
                        int pageno = Integer.parseInt(txtNo[i].getText().toString());
                        if (pageno == currentPage) {
                            txtNo[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                        } else {
                            txtNo[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.light_blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
                        }

                    }

                    selEnd = currentPage * selPageCount;
                    selInitial = selEnd - selPageCount;
                    System.out.println("print page no : " + currentPage );

                    if (selTab.equalsIgnoreCase("History")) {
                        Log.i("myLog", "History selected");
//                tabLayout.getTabAt(2).select();
                        getHistoryAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                    } else if (selTab.equalsIgnoreCase("todayAppointment")) {
                        Log.i("myLog", "todayAppointment selected");
//                tabLayout.getTabAt(0).select();
                        getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));            }
                    else if (selTab.equalsIgnoreCase("Appointment")) {
                        Log.i("myLog", "appt selected");

                        getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                    }else {

                        getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
                    }
//                    showAppointments(selInitial, selEnd, "");

                }
            });
        }
        tblPages.addView(tr);

    }
    private void showPages2(List<GetConsentListResp.Datum> list) {
        Log.i("myLog", "show pages1");
        //Log.i("myLog", "show pages1 initial page:" + initPageNo + "  end page:" + endPageNo);
        tblPages.removeAllViews();
        Log.i("myLog", "show pages1 tot page:" + totPage);
      /*  if (totPage > 0) {
            imgPrev.setVisibility(View.VISIBLE);
            imgNext.setVisibility(View.VISIBLE);
            // txtEtc.setVisibility(View.VISIBLE);
            //txtLastPage.setVisibility(View.VISIBLE);
        } else {
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
        }*/
        TableRow tr = new TableRow(getActivity());
        tr.setGravity(Gravity.CENTER);
        int endPage;
        if (totPage <= 4) {
            endPage = totPage;
        } else {
            endPage = 4;
        }
        if (endPageNo > totPage) {
            endPage = endPageNo - totPage;
            initPageNo = totPage - 3;
        }
        Log.i("myLog", "show pages1 tot pageeeeeeee:" + totPage);
        if (totPage > 4) {
            imgPrev.setVisibility(View.VISIBLE);
            imgNext.setVisibility(View.VISIBLE);
            txtEtc.setVisibility(View.VISIBLE);
            txtLastPage.setVisibility(View.VISIBLE);
            txtLastPage.setText(String.valueOf(totPage));
        } else {
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgPrev.setVisibility(View.INVISIBLE);
            imgNext.setVisibility(View.INVISIBLE);
        }

        txtNo = new TextView[endPage];

        for (int index = 0; index < endPage; index++) {
            final int start = index;
            final int endNo = endPage;
            //  //Log.i("myLog", "init page:" + initPageNo + "    index:" + index);
            int pageNo = index + initPageNo;

            txtNo[index] = new TextView(getActivity());
            txtNo[index].setText(String.valueOf(pageNo));
            //  txtNo[index].setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtNo[index].setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            txtNo[index].setGravity(Gravity.CENTER);
            if (pageNo == currentPage) {
                txtNo[index].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(getContext(), R.color.white));
            } else {
                txtNo[index].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.light_blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            }


            tr.addView(txtNo[index], pageTxtParam);

            txtNo[index].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String no = txtNo[start].getText().toString();
                    int number = Integer.parseInt(no);
                    //Log.i("mylog", "Selected page number:" + number + "   totPage:" + totPage);
                    currentPage = number;
                    //Log.i("mylog", "Selected page no:" + currentPage);
                    //   showPrevNextPages1(listResp);
                    for (int i = 0; i < endNo; i++) {
                        //    //Log.i("myLog", "i==:" + i + "  start:" + start + "   totPage:" + totPage);
                        int pageno = Integer.parseInt(txtNo[i].getText().toString());
                        if (pageno == currentPage) {
                            txtNo[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(getContext(), R.color.white));
                        } else {
                            txtNo[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.light_blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
                        }

                    }

                    selEnd = currentPage * selPageCount;
                    selInitial = selEnd - selPageCount;
                    System.out.println("print page no : " + currentPage );

                    if (selTab.equalsIgnoreCase("History")) {
                        Log.i("myLog", "History selected");
//                tabLayout.getTabAt(2).select();
                        getHistoryAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                    } else if (selTab.equalsIgnoreCase("todayAppointment")) {
                        Log.i("myLog", "todayAppointment selected");
//                tabLayout.getTabAt(0).select();
                        getTodayAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));            }
                    else if (selTab.equalsIgnoreCase("Appointment")) {
                        Log.i("myLog", "appt selected");
                        tabLayout.getTabAt(1).select();
                        getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                    }else {
                        tabLayout.getTabAt(3).select();
                        getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
                    }
//                    showAppointments(selInitial, selEnd, "");

                }
            });
        }
        tblPages.addView(tr);

    }

    @OnClick(R.id.imgPrev)
    public void prevClicked() {
        if (totPage > 4) {
            if (currentPage <= 1)
                Toast.makeText(getActivity(), "No previous data available", Toast.LENGTH_SHORT).show();
            else {
                currentPage = currentPage - 1;
                showPrevNextPages1(listResp, "Prev");
                if (selTab.equalsIgnoreCase("History")) {
                    getHistoryAppts(null, null, String.valueOf(selPageCount), String.valueOf(currentPage));
                } else if (selTab.equalsIgnoreCase("todayAppointment")) {
                    getTodayAppts(null, null, String.valueOf(selPageCount), String.valueOf(currentPage));
                } if (selTab.equalsIgnoreCase("Appointment")) {
                    Log.i("myLog", "appt selected");

                    getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                }else {

                    getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                ////Log.i("myLog", "initial page:" + initPageNo + "   end page:" + endPageNo + "  curr page:" + currentPage);

            }
        }

    }

    private void showPrevNextPages1(List<GetAppointmentResponse.Datum> list, String option) {
        //Log.i("myLog", "showPrevNextPages list:" + list.size());
        endPageNo = currentPage;
        initPageNo = endPageNo - 3;
        if (initPageNo <= 0) {
            initPageNo = 1;
            endPageNo = initPageNo + 3;
        }
        showPages1(list);
        selEnd = currentPage * selPageCount;
        selInitial = selEnd - selPageCount;
        showUpcomingAppts(list,selInitial, selEnd);
    }


    @OnClick(R.id.imgNext)
    public void nextClicked() {
        ////Log.i("myLog", "current page:" + currentPage + "   total page:" + totPage);
        if (totPage > 4) {
            if (totPage == currentPage) {
                ////Log.i("myLog", "current page == totpage");
                Toast.makeText(getActivity(), "No more data available", Toast.LENGTH_SHORT).show();
            } else {
                currentPage = currentPage + 1;
                showPrevNextPages1(listResp, "Next");
                if (selTab.equalsIgnoreCase("History")) {
                    getHistoryAppts(null, null, String.valueOf(selPageCount), String.valueOf(currentPage));
                } else if (selTab.equalsIgnoreCase("todayAppointment")) {
                    getTodayAppts(null, null, String.valueOf(selPageCount), String.valueOf(currentPage));
                } else if (selTab.equalsIgnoreCase("Appointment")) {
                    getUpcomingAppts(null, null,String.valueOf(selPageCount), String.valueOf(currentPage));
                }else {
                    getConsentList(OPHubApplication.getHitypeId(), abhaListAddress,String.valueOf(selPageCount), String.valueOf(currentPage));
                }
            }
        }
    }

    private void getExistPatientDet(String searchBy, String value) {
        OPHubRequests.GetExistPatientDetReq request = new OPHubRequests.GetExistPatientDetReq();
        request.setHospitalId(hospId);
        request.setSearchBy(searchBy);
        request.setValue(value);
        //log.i("mylog", "getExistPatientDet request:" + new Gson().toJson(request));
        Call<List<ExistPatientDetResponse>> call = services.getExistPatientDet(request);
        call.enqueue(new Callback<List<ExistPatientDetResponse>>() {

            @Override
            public void onResponse(Call<List<ExistPatientDetResponse>> call, Response<List<ExistPatientDetResponse>> response) {
                try {
                    //log.i("myLog", "getExistPatientDet response:");
                    //log.i("mylog", "getExistPatientDet response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //log.i("myLog", "getExistPatientDet response isSuccess:" + response.body().toString());
                        List<ExistPatientDetResponse> list = response.body();
                        ExistPatientDetResponse resp = list.get(0);

                        PatientProfileFragment newFragment = new PatientProfileFragment();
                        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                        Bundle result = new Bundle();
                        result.putInt("patient_id", resp.getId());
                        result.putString("name", resp.getPatient_name());
                        result.putString("gender", resp.getGender());
                        result.putInt("age", resp.getAge());
                        result.putString("bloodGroup", resp.getBloodGroup());
                        result.putString("phone", resp.getMobileno());
                        String dob = resp.getDob();
                        if (dob != null && dob.contains("T")) {
                            String[] dobStr = dob.split("T");
                            dob = dobStr[0];
                        }
                        result.putString("dob", dob);
                        result.putString("email", resp.getEmail());
                        result.putString("abha_no", resp.getAbhaNo());
                        result.putString("address", resp.getAddress());
                        result.putString("salutation", resp.getSalutation());
                        result.putString("dial_code", resp.getDial_code());
                        result.putString("pincode", resp.getPincode());
                        result.putString("emergency_mobile_no", resp.getEmergency_mobile_no());
                        result.putString("from_screen", "Patient_id_search");
                        newFragment.setArguments(result);
                        //log.i("myLog", "getExistPatientDet b4 bundle");
                        transaction.replace(R.id.fragment_container, newFragment);
                        transaction.addToBackStack(null);
                        transaction.commit();
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<ExistPatientDetResponse>> call, Throwable t) {
                //log.i("myLog", "getExistPatientDet response failure:" + t.toString());
                //  OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    public boolean checkConnection() {

        // initialize intent filter
        // Initialize connectivity manager
        ConnectivityManager manager = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);

        // Initialize network info
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();

        // get connection status
        boolean isConnected = networkInfo != null && networkInfo.isConnectedOrConnecting();
        return isConnected;
        // display snack bar
        // showAlert(isConnected);
    }

    private void showAlert(boolean isConnected) {

        // initialize color and message
        String message;
        int color;

        // check condition
        if (isConnected) {

            // when internet is connected
            // set message
            message = "Connected to Internet";

            // set text color
            color = Color.WHITE;

        } else {

            // when internet
            // is disconnected
            // set message
            message = "Not Connected to Internet";

            // set text color
            color = Color.RED;
            showNoNetworkDialog();
            //   OPHubUtils.showErrorDialog(getActivity(), message);
            //  Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
        }

        // show snack bar

    }


    @Override
    public void onNetworkChange(boolean isConnected) {
        //log.i("myLog", "onnetwork changed ------appt fragment");
        showAlert(isConnected);
    }

    @Override
    public void onResume() {
        super.onResume();
        //selApptOption = "";
        // call method
        //log.i("myLog", "onResume.........appt fragment");

        // initialize intent filter
        IntentFilter intentFilter = new IntentFilter();

        // add action
        intentFilter.addAction("android.new.conn.CONNECTIVITY_CHANGE");

        // register receiver
        getActivity().registerReceiver(networkConnectionReceiver, intentFilter);
        // Initialize listener
        NetworkConnectionReceiver.Listener = this;
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
    }

    @Override
    public void onPause() {
        super.onPause();
        // call method
        //log.i("myLog", "onPause...........appt fragment");
//        getActivity().unregisterReceiver(networkConnectionReceiver);
        //  boolean isConnected = checkConnection();
        //if (!isConnected)
        //  showAlert(isConnected);
      //  selApptOption = "";
    }

    public void showNoNetworkDialog() {
        Dialog dialogNoNetwork = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_no_network, null);
        dialogNoNetwork.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogNoNetwork.getWindow().setGravity(Gravity.CENTER);
        ImageView imgClose = dialogNoNetwork.findViewById(R.id.imgClose);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogNoNetwork.dismiss();
            }
        });

        dialogNoNetwork.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogNoNetwork.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        dialogNoNetwork.getWindow().setAttributes(lp);
    }

    @Override
    public void onAbhaCardDownloaded(String abhaNo, String abhaAddress, String first, String middle, String last, String add, String patDOB, String gender, String mobile, String image) {
        if (!abhaNo.isEmpty()) {
            txtLinkNow.setVisibility(View.GONE);
            txtAbhaAddress.setVisibility(View.VISIBLE);
            txtAbhaAddress.setText("");
            txtAbhaAddress.setText("");
//            btnConsentReq.setVisibility(View.VISIBLE);
        }
        if (tabLayout.getTabCount() <= 3) {
            TabLayout.Tab restoredTab = tabLayout.newTab();
            restoredTab.setText("Consent");
            tabLayout.addTab(restoredTab, 3);
        }
        txtabhaNumber.setText(abhaNo);
        //system.out.println("abhano"+abhaNo);
        UpdatePatientRequest request = new UpdatePatientRequest();
        request.setABHANumber(abhaNo);
        if(!first.isEmpty()){
            request.setFirstName(first);
        }
        request.setMiddleName(middle);
        request.setLastName(last);
        if (!patDOB.isEmpty())
            request.setDob(patDOB);
        request.setGender(gender);
        request.setMobile(mobile);
        if (image != null &&  !image.isEmpty())
        request.setImage(image);
        if (!add.isEmpty())
            request.setAddress(add);
        Log.i("mylog", "updatePatient response:" + new Gson().toJson(request));
        Call<List<UpdatePatientResponse>> call = services.updatePatientAbha(patientId, hospId, request);
        call.enqueue(new Callback<List<UpdatePatientResponse>>() {

            @Override
            public void onResponse(Call<List<UpdatePatientResponse>> call, Response<List<UpdatePatientResponse>> response) {
                try {
                    Log.i("mylog", "updatePatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        QRcodePatientDataSet();
                        AbhaAddressPatientData();
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<UpdatePatientResponse>> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    @Override
    public void onDialogClose() {
        requireActivity().getSupportFragmentManager().popBackStack();
    }

    @Override
    public void onAbhaQR(String aayusId) {
        aayushNo = aayusId;
        QRcodePatientDataSet();
    }

    private void getConsentList(String hiuId, String abhaAddr, String limit, String page) {
        //log.i("myLog", "getConsentList" + abhaAddr);
        OPHubRequests.GetConsentListReq req = new OPHubRequests.GetConsentListReq();
        req.setHiuId(hiuId);
        if (abhaAddr == null || abhaAddr.isEmpty()) {
            return;
        }
        req.setAbhaAddress(abhaAddress);
        req.setLimit(Integer.parseInt(limit));
        req.setPagenumber((Integer.parseInt(page)));
        Log.i("myLog", "getConsentList req:" + new Gson().toJson(req));
        Call<GetConsentListResp> call = abhaServices.getConsentList(req);
        call.enqueue(new Callback<GetConsentListResp>() {

            @Override
            public void onResponse(Call<GetConsentListResp> call, Response<GetConsentListResp> response) {
                try {
                    Log.i("mylog", "getConsentList response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        list = response.body().getData();
                        if (response.body().getTotal() != null){
                            totSize =  Integer.parseInt(response.body().getTotal().toString());
                        }else {
                            totSize = 0;
                        }
                        showInitialList2(list);
    //                    showConsentList(list);
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetConsentListResp> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void showConsentList(List<GetConsentListResp.Datum> list,int initial, int end) {
        tblView.removeAllViews();
        linearConsentHeading.setVisibility(View.VISIBLE);
        linearHead.setVisibility(View.GONE);
        recyclerView.setVisibility(View.VISIBLE);
        //log.i("mylog", "showConsentList");
        // tblView.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_gray_outline));
        //  tblView.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_white));
        int size = totSize;
        //log.i("mylog", "showConsentList size:" + size);
        if (size <= 0) {
            //log.i("mylog", "showConsentList size<=0:");
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            linearConsentHeading.setVisibility(View.GONE);
            linearHead.setVisibility(View.GONE);
        } else {
            //log.i("mylog", "showConsentList else");
            linearHead.setVisibility(View.GONE);
            linearConsentHeading.setVisibility(View.VISIBLE);
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
            recyclerView.setVisibility(View.VISIBLE);
            //log.i("mylog", "showConsentList else22222");

            int initVal = initial;

            int endVal = end - totSize;
            //Log.i("myLog", "endVal:" + endVal + "    end:" + end);
            if (endVal > 0)
                end = end - endVal;
            //Log.i("myLog", "endVal:" + endVal + "    end:" + end + "   totSize:" + totSize);

            txtResults.setText("Results " + initVal + "-" + end + " of " + totSize);

            LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getContext());
            recyclerView.setLayoutManager(linearLayoutManager);
            ConsentListAdapter adapter = new ConsentListAdapter(getActivity(), list);
            recyclerView.setAdapter(adapter);

            adapter.setOnClickListener(new ConsentListAdapter.OnClickListener() {
                @Override
                public void onClick(int position, GetConsentListResp.Datum resp) {
                    //log.i("myLog", "txtViewConsent clicked");
                    boolean isConnected = checkConnection();
                    if (!isConnected)
                        showAlert(isConnected);
                    else {
                        GetConsentListResp.Datum response = list.get(position);
                        String status = resp.getRequestStatus();
                        //log.i("myLog", "txtViewConsent status:" + status);
                        if (status.equalsIgnoreCase("Granted")) {
                            //log.i("myLog", "txtViewConsent status if");
                            GetConsentListResp.Datum artifactsList = resp;

                            String artifactsId = artifactsList.getConsentArtifacts().get(0).getId();
                            List<GetConsentListResp.Datum.ConsentArtifact> consentArtifacts = artifactsList.getConsentArtifacts();
                            List<String> artifactIds = new ArrayList<>();

                            // Populate the list with the artifact IDs
                            for (GetConsentListResp.Datum.ConsentArtifact artifact : consentArtifacts) {
                                artifactIds.add(artifact.getId());
                            }
//                                    artifactsId = "6b22135e-671f-4730-8b30-7d270f5dabd9";
                            //log.i("myLog", "txtViewConsent artifactsId :" + artifactsId);
//                                    viewConsentReq(artifactsId);

                            ViewConsentFragment newFragment = new ViewConsentFragment();
                            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                            Bundle result = new Bundle();
                            result.putStringArrayList("artifactIdsList", new ArrayList<>(artifactIds));
                            result.putString("artifactsId", artifactsId);
                            result.putString("requested", resp.getRequestedDate().substring(0, 16));
                            result.putString("granted", resp.getStatusChangeDate().substring(0, 16));
                            result.putString("expireDate", resp.getExpiryDate().substring(0, 10) + " " + resp.getExpiryDate().substring(11, 16));
                            result.putString("start", resp.getConsentRequestFromDate().substring(0, 10) + " " + resp.getConsentRequestFromDate().substring(11, 16));
                            result.putString("end", resp.getConsentRequestToDate().substring(0, 10) + " " + resp.getConsentRequestToDate().substring(11, 16));
                            result.putString("abhaAddress", abhaAddress);
                            result.putString("abhaNumber", abhaNo);

                            newFragment.setArguments(result);
                            transaction.replace(R.id.fragment_container, newFragment);
                            transaction.addToBackStack(null);
                            transaction.commit();
                            //  getFhirBundle(artifactsId);
                        }
                    }
                }
            });

//            for (int start = 0; start < size; start++) {
//                final int index = start;
//                OPHubResponse.GetConsentListResp resp = list.get(start);
//
//                TableRow tr = new TableRow(getActivity());
//                TableRow tr2 = new TableRow(getActivity());
//                TextView txtSlNo = new TextView(getActivity());
//                txtSlNo.setText(String.valueOf(start + 1));
//                txtSlNo.setTextColor(Color.BLACK);
//                txtSlNo.setTypeface(typeface);
//                txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                txtSlNo.setGravity(Gravity.CENTER);
//                tr.addView(txtSlNo,slNoParam);
//
//                TextView txtReqDate = new TextView(getActivity());
//                txtReqDate.setText(resp.getRequested_date());
//                txtReqDate.setTextColor(Color.BLACK);
//                txtReqDate.setTypeface(typeface);
//                txtReqDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                txtReqDate.setGravity(Gravity.CENTER);
//
//                tr.addView(txtReqDate,consentTxtParam);
//
//                TextView txtGrantedDate = new TextView(getActivity());
//                txtGrantedDate.setText(resp.getStatus_change_date());
//                txtGrantedDate.setTextColor(Color.BLACK);
//                txtGrantedDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                txtGrantedDate.setGravity(Gravity.CENTER);
//                txtGrantedDate.setTypeface(typeface);
//
//                tr.addView(txtGrantedDate,consentTxtParam);
//
//                TextView txtExpireDate = new TextView(getActivity());
//                txtExpireDate.setText(resp.getExpiry_date());
//                txtExpireDate.setTextColor(Color.BLACK);
//                txtExpireDate.setTypeface(typeface);
//                txtExpireDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                txtExpireDate.setGravity(Gravity.CENTER);
//
//                tr.addView(txtExpireDate,consentTxtParam);
//
//                TextView txtStatus = new TextView(getActivity());
//                String status = resp.getRequest_status();
//                txtStatus.setText(status);
//                txtStatus.setTextColor(Color.WHITE);
//                txtStatus.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                txtStatus.setGravity(Gravity.CENTER);
//                txtStatus.setTypeface(typeface);
//
//                String colorCode = null;
//                if (status.equalsIgnoreCase("Requested")) {
//                    colorCode = "#FFCB44";
//                } else if (status.equalsIgnoreCase("Granted")) {
//                    colorCode = "#33DE7C";
//                } else if (status.equalsIgnoreCase("Revoked")) {
//                    colorCode = "#FF4C47";
//                } else if (status.equalsIgnoreCase("Expired")) {
//                    colorCode = "#737791";
//                } else if (status.equalsIgnoreCase("DENIED")) {
//                    colorCode = "#000080";
//                }
//
//                if (colorCode != null) {
//                    Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.rounded_approved_bg);
//                    GradientDrawable gradientDrawable = (GradientDrawable) drawable;
//                    gradientDrawable.setColor(Color.parseColor(colorCode));
//                    txtStatus.setBackground(gradientDrawable);
//                }
//                tr.addView(txtStatus,consentTxtParam);
//
//                TextView txtViewConsent = new TextView(getActivity());
//                txtViewConsent.setText("View consent");
//                if (status.equalsIgnoreCase("Granted")) {
//                    txtViewConsent.setTextColor(ContextCompat.getColor(getActivity(), R.color.blue_text));
//                } else
//                    txtViewConsent.setTextColor(ContextCompat.getColor(getActivity(), R.color.view_color));
//                txtViewConsent.setTypeface(typeface);
//                txtViewConsent.setGravity(Gravity.CENTER);
//                txtViewConsent.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//
//                tr.addView(txtViewConsent,consentTxtParam);
//
//                tblView.addView(tr);
//
//
//
//
//                TextView op = new TextView(getActivity());
//                op.setText(R.string.op_consultantion);
//                op.setTextColor(Color.BLACK);
//                op.setTypeface(typeface);
//                op.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                op.setGravity(Gravity.CENTER);
//                tr2.addView(op, consentParam);
//
//                TextView dr = new TextView(getActivity());
//                dr.setText(R.string.diagnostic_report);
//                dr.setTextColor(Color.BLACK);
//                dr.setTypeface(typeface);
//                dr.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                dr.setGravity(Gravity.CENTER);
//                tr2.addView(dr,consentParam);
//
//                TextView prescription = new TextView(getActivity());
//                prescription.setText(R.string.diagnostic_report);
//                prescription.setTextColor(Color.BLACK);
//                prescription.setTypeface(typeface);
//                prescription.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                prescription.setGravity(Gravity.CENTER);
//                tr2.addView(prescription,consentParam);
//
//                TextView discharge = new TextView(getActivity());
//                discharge.setText(R.string.discharge_summary);
//                discharge.setTextColor(Color.BLACK);
//                discharge.setTypeface(typeface);
//                discharge.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                discharge.setGravity(Gravity.CENTER);
//                tr2.addView(discharge,consentParam);
//
//
//                TextView immunisation = new TextView(getActivity());
//                immunisation.setText(R.string.immunisation_record);
//                immunisation.setTextColor(Color.BLACK);
//                immunisation.setTypeface(typeface);
//                immunisation.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                immunisation.setGravity(Gravity.CENTER);
//                tr2.addView(immunisation,consentParam);
//
//                TextView health = new TextView(getActivity());
//                health.setText(R.string.health_document_record);
//                health.setTextColor(Color.BLACK);
//                health.setTypeface(typeface);
//                health.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                health.setGravity(Gravity.CENTER);
//                tr2.addView(health,consentParam);
//
//
//                TextView wellness = new TextView(getActivity());
//                wellness.setText(R.string.wellness_record);
//                wellness.setTextColor(Color.BLACK);
//                wellness.setTypeface(typeface);
//                wellness.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                wellness.setGravity(Gravity.CENTER);
//                tr2.addView(wellness,consentParam);
//
//                TextView invoice = new TextView(getActivity());
//                invoice.setText(R.string.invoice);
//                invoice.setTextColor(Color.BLACK);
//                invoice.setTypeface(typeface);
//                invoice.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//                invoice.setGravity(Gravity.CENTER);
//                tr2.addView(invoice,consentParam);
//
//                tblView.addView(tr2);
//
//                TableRow trLine1 = new TableRow(getActivity());
//                View v1 = new View(getActivity());
//                v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
//                trLine1.addView(v1, consentLineParam);
//                tblView.addView(trLine1);
//
//                txtViewConsent.setOnClickListener(new View.OnClickListener() {
//                    @Override
//                    public void onClick(View v) {
//                        //log.i("myLog", "txtViewConsent clicked");
//                        boolean isConnected = checkConnection();
//                        if (!isConnected)
//                            showAlert(isConnected);
//                        else {
//                            OPHubResponse.GetConsentListResp resp = list.get(index);
//                            String status = resp.getRequest_status();
//                            //log.i("myLog", "txtViewConsent status:" + status);
//                            if (status.equalsIgnoreCase("Granted")) {
//                                //log.i("myLog", "txtViewConsent status if");
//                                List<OPHubResponse.GetConsentListResp.ConsentArtifacts> artifactsList = resp.getConsentArtifactsList();
//                                if (artifactsList != null && artifactsList.size() > 0) {
//                                    //log.i("myLog", "txtViewConsent inside if");
//                                    String artifactsId = artifactsList.get(0).getId();
////                                    artifactsId = "0ed79e6b-0041-473e-923e-c436f456d3d6";
//                                    //log.i("myLog", "txtViewConsent artifactsId :" + artifactsId);
////                                    viewConsentReq(artifactsId);
//
//                                    ViewConsentFragment newFragment = new ViewConsentFragment();
//                                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
//                                    Bundle result = new Bundle();
//                                    result.putString("artifactsId", artifactsId);
//                                    result.putString("requested", resp.getRequested_date());
//                                    result.putString("granted", resp.getStatus_change_date());
//                                    result.putString("expireDate", resp.getExpiry_date());
//                                    result.putString("start", resp.getConsent_request_from_date());
//                                    result.putString("end", resp.getConsent_request_to_date());
//
//                                    newFragment.setArguments(result);
//                                    transaction.replace(R.id.fragment_container, newFragment);
//                                    transaction.addToBackStack(null);
//                                    transaction.commit();
//
//                                    //  getFhirBundle(artifactsId);
//                                }
//                            }
//
//                        }
//                    }
//                });
//            }



        }
    }


    private void viewConsentReq(String consentArtefactId) {
        //log.i("myLog", "viewConsentReq");
        OPHubRequests.ViewConsentReq request = new OPHubRequests.ViewConsentReq();
        request.setConsentArtefactId(consentArtefactId);
        //log.i("myLog", "viewConsentReq request : " + new Gson().toJson(request));
        Call<ResponseBody> call = abhaServices.viewConsentReq(request);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                try {
                    if (response.body() != null) {
                        //log.i("myLog", "server contacted and has file");
                        //    //log.i("myLog", "viewConsentReq response : " + new Gson().toJson(response));
                        try {
                            byte[] bytes = response.body().bytes();
                            //log.i("myLog", "byte  length:" + bytes.length);
                            String base64 = new String(bytes, StandardCharsets.UTF_8);
                            base64ToFile(base64, "Document.txt");
                            //log.i("myLog", "after image set");
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }

                    } else {
                        //log.i("myLog", "server contact failed");
                    }
                } catch (RuntimeException e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                //log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    public void base64ToFile(String base64String, String fileName) {
        try {
            // Decode the Base64 string
            byte[] decodedBytes = Base64.decode(base64String, Base64.DEFAULT);

            // Define the path where the file will be saved
            File file = new File(getContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName);

            // Write the decoded bytes to a file
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(decodedBytes);
            fos.close();

            //system.out.println("File saved: " + file.getAbsolutePath());
            JSONObject jsonObject = fileToJson(fileName);
            if (jsonObject != null) {
                //log.i("myLog", jsonObject.toString());
                //log.i("myLog", "File name : " + jsonObject.getString("entries"));

                // Inflate the custom layout for the dialog
                LayoutInflater inflater = getLayoutInflater();
                View dialogView = inflater.inflate(R.layout.dialog_fhir_details, null);

                // Find the container where we'll dynamically add data
                ImageView closeIcon = dialogView.findViewById(R.id.close_icon);
                LinearLayout fhirContainer = dialogView.findViewById(R.id.fhir_container);

                int length = jsonObject.getJSONArray("entries").length();
                for (int start = 0; start < length; start++) {
                    parseFhirBundleAndPopulateUI(jsonObject.getJSONArray("entries").getJSONObject(start).getString("content"), fhirContainer);
                }
                // Parse FHIR bundle and populate UI

                // Create the AlertDialog
                AlertDialog dialog = new AlertDialog.Builder(getContext())
                        .setView(dialogView)
                        .create();

                // Position the dialog in the right corner of the screen
                Window window = dialog.getWindow();
                if (window != null) {
                    WindowManager.LayoutParams layoutParams = window.getAttributes();
                    layoutParams.x = 20;  // Adjust X-position (optional, tweak for desired margin)
                    layoutParams.y = 100; // Adjust Y-position (optional, tweak for desired margin)
                    layoutParams.dimAmount = 0.3f; // Set dim effect when dialog is displayed
                    window.setAttributes(layoutParams);

                }
                dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
                dialog.getWindow().setLayout(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.MATCH_PARENT);

                // Handle the close button click
                closeIcon.setOnClickListener(v -> dialog.dismiss());

                // Show the dialog
                dialog.show();

            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (JSONException e) {
//            throw new RuntimeException(e);
        }
    }

    public void responseBodyToFile(String base64String, String fileName, byte[] bytes) {
        try {
            // Decode the Base64 string
            byte[] decodedBytes = Base64.decode(base64String, Base64.DEFAULT);

            // Define the path where the file will be saved
            File pdfDir = new File(Environment.getExternalStorageDirectory(), "PDFs");
            if (!pdfDir.exists()) {
                pdfDir.mkdirs();
            }
            file = new File(pdfDir, fileName);

            // Write the decoded bytes to a file
            FileOutputStream fos = new FileOutputStream(file);
            fos.write(decodedBytes);
            fos.close();

            //system.out.println("File saved: " + file.getAbsolutePath());
            displaypdf(file);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private void parseFhirBundleAndPopulateUI(String jsonBundle, LinearLayout fhirContainer) {
        // Initialize FHIR context
        FhirContext fhirContext = FhirContext.forR4();
        IParser parser = fhirContext.newJsonParser();

        // Parse the bundle
        org.hl7.fhir.r4.model.Bundle bundle = parser.parseResource(org.hl7.fhir.r4.model.Bundle.class, jsonBundle);

        // Iterate over the entries in the bundle
        for (org.hl7.fhir.r4.model.Bundle.BundleEntryComponent entry : bundle.getEntry()) {
            Resource resource = entry.getResource();
            String resourceType = resource.getResourceType().toString();

            View emptyView = new View(getContext());
            emptyView.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(30)));
            fhirContainer.addView(emptyView);


            if(!(resource instanceof Composition)) {
                // Create a TextView for the resource type
                TextView resourceTitle = new TextView(getContext());
                resourceTitle.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(45)));
                resourceTitle.setText(resourceType);
                Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
                resourceTitle.setTypeface(typeface);
                resourceTitle.setTextSize(18);
                resourceTitle.setTypeface(typeface, Typeface.BOLD);
                resourceTitle.setTextColor(ContextCompat.getColor(getContext(), R.color.black));
                resourceTitle.setGravity(Gravity.CENTER_VERTICAL);
//            resourceTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue)); // Custom color from colors.xml
                fhirContainer.addView(resourceTitle);
            }


            // Extract and display resource details based on type
            if (resource instanceof Patient) {
                Patient patient = (Patient) resource;
                displayPatientData(patient, fhirContainer);  // Display the Patient data
            } else if (resource instanceof Observation) {
                Observation observation = (Observation) resource;
                displayObservationData(observation, fhirContainer);  // Display the Observation data
            } else if (resource instanceof Encounter) {
                Encounter encounter = (Encounter) resource;
                displayEncounterData(encounter, fhirContainer);  // Display the Encounter data
            } else if (resource instanceof Composition) {
                Composition composition = (Composition) resource;
                displayCompositionData(composition, fhirContainer);  // Display the Composition data.
            } else if (resource instanceof Practitioner) {
                Practitioner practitioner = (Practitioner) resource;
                displayPractitionerData(practitioner, fhirContainer);  // Display the Practitioner data
            } else if (resource instanceof Organization) {
                Organization organization = (Organization) resource;
                displayOrganizationData(organization, fhirContainer);  // Display the Organization data
            } else if (resource instanceof MedicationRequest) {
                MedicationRequest medicationRequest = (MedicationRequest) resource;
                displayMedicationRequestData(medicationRequest, fhirContainer);  // Display the MedicationRequest data
            } else if (resource instanceof Medication) {
                Medication medication = (Medication) resource;
                displayMedicationData(medication, fhirContainer);  // Display the Medication data
            } else if (resource instanceof DocumentReference) {
                DocumentReference documentReference = (DocumentReference) resource;
                displayDocumentReferenceData(documentReference, fhirContainer);  // Display the DocumentReference data
            } else {
                addTextView(fhirContainer, "Other Resource: " + resourceType + " (Details not displayed)");
            }
        }
    }

    // Method to display DocumentReference details in the layout
    private void displayDocumentReferenceData(DocumentReference documentReference, LinearLayout layout) {
        // Create TextView for the document status
        if (documentReference.hasStatus()) {
            addTextView(layout, "Document Status: " + documentReference.getStatus().toString());
        }

        // Create TextView for the document type
        if (documentReference.hasType()) {
            String type = documentReference.getType().getCodingFirstRep().getDisplay();
            addTextView(layout, "Document Type: " + type);
        }

        // Create TextView for the subject of the document reference (patient)
        if (documentReference.hasSubject()) {
            Reference subjectReference = documentReference.getSubject();
            String subjectRef = subjectReference.getReference();
            addTextView(layout, "Document Subject: " + subjectRef);
        }

        // Create TextView for the date of the document
        if (documentReference.hasDate()) {
            addTextView(layout, "Document Date: " + documentReference.getDate().toString());
        }

        // Create TextView for the author(s) of the document
        if (documentReference.hasAuthor()) {
            documentReference.getAuthor().forEach(author -> {
                String authorRef = author.getReference();
                addTextView(layout, "Document Author: " + authorRef);
            });
        }

        // Create TextView for the content reference
        if (documentReference.hasContent()) {
            documentReference.getContent().forEach(content -> {
                String data = content.getAttachment().getData().toString();
                if (data != null || !data.isEmpty()) {
                    addDownloadTextView(layout, "View Document: " + content.getAttachment().getTitle(),
                            content.getAttachment().getData(), content.getAttachment().getTitle());
                }
            });
        }
    }


    // Method to display Patient details in the layout
    private void displayPatientData(Patient patient, LinearLayout layout) {
        // Create TextView for the patient's name
        if (patient.hasName()) {
            for (HumanName name : patient.getName()) {
                if (name.hasText()) {
                    String fullName = name.getText().toString();/* + " " + name.getFamily();*/
                    addTextView(layout, "Patient Name: " + fullName);
                }
            }
        }

        // Create TextView for the patient's identifier
        if (patient.hasIdentifier()) {
            for (Identifier identifier : patient.getIdentifier()) {
                String idValue = identifier.getValue();
                String idSystem = identifier.getSystem();
                addTextView(layout, "Patient Identifier: " + idValue + " (System: " + idSystem + ")");
            }
        }

        // Create TextView for the patient's gender
        if (patient.hasGender()) {
            addTextView(layout, "Patient Gender: " + patient.getGender().toString());
        }

        // Create TextView for the patient's birth date
        if (patient.hasBirthDate()) {
            addTextView(layout, "Patient Birth Date: " + patient.getBirthDate().toString());
        }

        // Add additional patient details as necessary
        if (patient.hasAddress()) {
            patient.getAddress().forEach(address -> {
                String addressText = address.getText();
                addTextView(layout, "Patient Address: " + addressText);
            });
        }
    }


    // Method to display Observation details in the layout
    private void displayObservationData(Observation observation, LinearLayout layout) {
        // Create a TextView for the observation code
        if (observation.hasCode()) {
            CodeableConcept code = observation.getCode();
            String observationCode = code.getCodingFirstRep().getDisplay();
            addTextView(layout, "Observation Code: " + observationCode);
        }

        // Create a TextView for the observation status
        if (observation.hasStatus()) {
            addTextView(layout, "Observation Status: " + observation.getStatus().toString());
        }

        // Create a TextView for the observation value
        if (observation.hasValueQuantity()) {
            Quantity value = observation.getValueQuantity();
            String valueText = value.getValue() + " " + value.getUnit();
            addTextView(layout, "Observation Value: " + valueText);
        }

        // Create a TextView for the subject of the observation (patient)
        if (observation.hasSubject()) {
            String patientReference = observation.getSubject().getReference();
            addTextView(layout, "Patient Reference: " + patientReference);
        }

        // Add additional observation details as necessary
        addTextView(layout, "Observation Date: " + observation.getEffectiveDateTimeType().getValueAsString());
    }

    // Method to display Encounter details in the layout
    private void displayEncounterData(Encounter encounter, LinearLayout layout) {
        // Create a TextView for the encounter status
        if (encounter.hasStatus()) {
            addTextView(layout, "Encounter Status: " + encounter.getStatus().toString());
        }

        // Create a TextView for the encounter class
        if (encounter.hasClass_()) {
            Coding encounterClass = encounter.getClass_();
            String classDisplay = encounterClass.getCode();
            addTextView(layout, "Encounter Class: " + classDisplay);
        }

        // Create TextView for the subject of the encounter (patient)
        if (encounter.hasSubject()) {
            String patientReference = encounter.getSubject().getReference();
            // Here, you may want to extract the actual patient information if available
            addTextView(layout, "Patient Reference: " + patientReference);
        }

        // Add additional encounter details as necessary
        if (encounter.hasPeriod()) {
            String start = encounter.getPeriod().getStart().toString();
            String end = encounter.getPeriod().getEnd() != null ? encounter.getPeriod().getEnd().toString() : "Ongoing";
            addTextView(layout, "Encounter Period: " + start + " to " + end);
        }
    }

    // Method to display Medication details in the layout
    private void displayMedicationData(Medication medication, LinearLayout layout) {
        // Create a TextView for the medication name
        if (medication.hasCode()) {
            CodeableConcept medicationCode = medication.getCode();
            String medicationName = medicationCode.getCodingFirstRep().getDisplay();
            addTextView(layout, "Medication Name: " + medicationName);
        }

        // Create a TextView for the form of medication (if available)
        if (medication.hasForm()) {
            String form = medication.getForm().getCodingFirstRep().getDisplay();
            addTextView(layout, "Form: " + form);
        }

        // Create TextView for ingredients (if any)
        if (medication.hasIngredient()) {
            medication.getIngredient().forEach(ingredient -> {
                if (ingredient.hasItemCodeableConcept()) {
                    String ingredientName = ingredient.getItemCodeableConcept().getCodingFirstRep().getDisplay();
                    addTextView(layout, "Ingredient: " + ingredientName);
                }
            });
        }

        // Add additional medication details as necessary
    }


    // Method to display MedicationRequest details in the layout
    private void displayMedicationRequestData(MedicationRequest medicationRequest, LinearLayout layout) {
        // Create a TextView for the medication name
        if (medicationRequest.hasMedicationCodeableConcept()) {
            CodeableConcept medication = medicationRequest.getMedicationCodeableConcept();
            String medicationName = medication.getCodingFirstRep().getDisplay();
            addTextView(layout, "Medication: " + medicationName);
        }

        // Create a TextView for the status
        if (medicationRequest.hasStatus()) {
            addTextView(layout, "Status: " + medicationRequest.getStatus().toString());
        }

        // Create TextView for dosage instructions
        if (medicationRequest.hasDosageInstruction()) {
            for (Dosage dosage : medicationRequest.getDosageInstruction()) {
                String dosageText = dosage.getText();
                if (dosageText != null && !dosageText.isEmpty()) {
                    addTextView(layout, "Dosage: " + dosageText);
                }
            }
        }

        // Create a TextView for the subject of the medication request
        if (medicationRequest.hasSubject()) {
            addTextView(layout, "Patient: " + medicationRequest.getSubject().getDisplay());
        }

        // Add additional medication request details as necessary
    }

    // Method to display Organization details in the layout
    private void displayOrganizationData(Organization organization, LinearLayout layout) {
        // Create a TextView for the name

        addTextView(layout, "Name: " + organization.getName());

        // Create a TextView for the identifier
        if (organization.hasIdentifier()) {
            organization.getIdentifier().forEach(identifier -> {
                addTextView(layout, "Identifier: " + identifier.getValue());
            });
        }

        // Create a TextView for the type (if available)
        if (organization.hasType()) {
            organization.getType().forEach(codeableConcept -> {
                addTextView(layout, "Type: " + codeableConcept.getCodingFirstRep().getDisplay());
            });
        }

        // Create TextView for address
        if (organization.hasAddress()) {
            organization.getAddress().forEach(address -> {
                String addressStr = address.getText();
                if (addressStr == null || addressStr.isEmpty()) {
                    addressStr = address.getLine().toString();
                }
                addTextView(layout, "Address: " + addressStr);
            });
        }

        // Add additional organization details as necessary
    }


    // Method to display Practitioner details in the layout
    private void displayPractitionerData(Practitioner practitioner, LinearLayout layout) {
        // Create a TextView for the name
        String name = getPractitionerFullName(practitioner);
        addTextView(layout, "Practitioner");
        addTextView(layout, "Name: " + name);

        // Create a TextView for the identifier
        if (practitioner.hasIdentifier()) {
            practitioner.getIdentifier().forEach(identifier -> {
                addTextView(layout, "Identifier: " + identifier.getValue());
            });
        }

        // Create a TextView for the gender
        if (practitioner.hasGender()) {
            addTextView(layout, "Gender: " + practitioner.getGender().getDisplay());
        }

        // Create a TextView for the specialty (if any)
        if (practitioner.hasQualification()) {
            practitioner.getQualification().forEach(qualification -> {
                if (qualification.hasCode()) {
                    addTextView(layout, "Specialty: " + qualification.getCode().getCodingFirstRep().getDisplay());
                }
            });
        }

        // Add additional practitioner details as necessary
    }

    // Method to get the full name of the practitioner
    private String getPractitionerFullName(Practitioner practitioner) {
        StringBuilder fullName = new StringBuilder();
        //system.out.println("print name outside");
        if (practitioner.hasName()) {
            //system.out.println("print name inside");
            //system.out.println(practitioner.getName());
            practitioner.getName().forEach(humanName -> {
                if (humanName.hasText()) {
                    //system.out.println("print name inside has text ");
                    //system.out.println("print name inside  " + humanName.getText().toString());
                    //system.out.println("print name inside 2");
                    fullName.append(humanName.getText().toString()).append(" ");
//                    for (StringType given : humanName.getText().toString()) {
//                        //system.out.println("print name inside hashgiven");
//                        fullName.append(given).append(" ");
//                    }
                }
//                if (humanName.hasFamily()) {
//                    //system.out.println("print name inside hasfamily");
//                    fullName.append(humanName.getText()).append(" ");
//                }
            });
        }
        return fullName.toString().trim();
    }


    // Method to display Composition details in the layout
    private void displayCompositionData(Composition composition, LinearLayout layout) {
        // Create a TextView for the title
//        addTextView(layout, "Title: " + composition.getTitle());

        TextView resourceTitle = new TextView(getContext());
        resourceTitle.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(45)));
        resourceTitle.setText(composition.getTitle());
        Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
        resourceTitle.setTypeface(typeface);
        resourceTitle.setTextSize(18);
        resourceTitle.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
        resourceTitle.setGravity(Gravity.CENTER);
        resourceTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_darkblue)); // Custom color from colors.xml
//        resourceTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue)); // Custom color from colors.xml
        layout.addView(resourceTitle);

        // Create a TextView for the status
        addTextView(layout, "Status: " + composition.getStatus().getDisplay());

        // Create a TextView for the composition date
        addTextView(layout, "Date: " + composition.getDate().toString());

        // Display author details
        for (Reference author : composition.getAuthor()) {
            addTextView(layout, "Author: " + author.getDisplay());
        }

        // Display section details
        for (Composition.SectionComponent section : composition.getSection()) {
            displaySectionDetails(section, layout); // Display section data recursively
        }
    }

    // Method to display Composition section details recursively
    private void displaySectionDetails(Composition.SectionComponent section, LinearLayout layout) {
        // Create a TextView for the section title
        if (section.hasTitle())
            addTextView(layout, "Section: " + (section.hasTitle() ? section.getTitle() : ""));

        // Create a TextView for the section text summary (if available)
        if (section.hasText() && section.getText().hasDiv()) {
            addTextView(layout, "Text: " + section.getText().getDiv().getValueAsString());
        }

        // Recursively handle subsections, if any
        if (!section.getSection().isEmpty()) {
            for (Composition.SectionComponent subSection : section.getSection()) {
                displaySectionDetails(subSection, layout);  // Recursive call for subsections
            }
        }
    }


    // Utility method to add a TextView with dynamic content
    private void addTextView(LinearLayout container, String text) {
        TextView textView = new TextView(getContext());
        textView.setText(text);
        Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
        textView.setTypeface(typeface);
        textView.setTextSize(16);
        textView.setTextColor(Color.BLACK);
//        textView.setPadding(0, 0, 0, 0);
        container.addView(textView,new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,dpToPx(35)));
    }

    // Utility method to add a TextView with dynamic content
    private void addDownloadTextView(LinearLayout container, String text, byte[] data, String title) {
        TextView textView = new TextView(getContext());
        textView.setText(text);
        Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal); // custom_font.ttf in res/font
        textView.setTypeface(typeface);
        textView.setTextSize(16);
        textView.setPadding(0, 8, 0, 8);
        textView.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor)); // Custom color from colors.xml
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Toast.makeText(getContext(), text, Toast.LENGTH_LONG).show();
                saveFile(data, title);
            }
        });
        container.addView(textView);
    }


    public JSONObject fileToJson(String fileName) {
        File file = new File(getContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName);
        StringBuilder jsonString = new StringBuilder();

        try {
            BufferedReader br = new BufferedReader(new FileReader(file));
            String line;
            while ((line = br.readLine()) != null) {
                jsonString.append(line);
            }
            br.close();

            // Convert the file content to JSON object
            return new JSONObject(jsonString.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }


    private void saveFile(byte[] bytes, String title) {
        //log.i("myLog", "saveFile ");
        FileOutputStream fos = null;
        try {
            fos = getContext().openFileOutput(title + ".pdf", Context.MODE_PRIVATE);
            //log.i("myLog", "bytes: " + bytes.length);
            fos.write(bytes);

        } catch (IOException e) {
            //log.i("myLog", "File write error: " + e.getMessage());
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    //log.i("mylog", "Error closing file output stream: " + e.getMessage());
                }
            }
        }
    }

    private void openPdf(File file) {
        Uri fileUri = FileProvider.getUriForFile(getContext(), BuildConfig.APPLICATION_ID + ".fileprovider", file);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(fileUri, "application/pdf");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        try {
            startActivity(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(getContext(), "No application available to view this file", Toast.LENGTH_SHORT).show();
        }
    }

    private void viewFile(String value, String filename) {
        OPHubRequests.ShowProfileImageRequest req = new OPHubRequests.ShowProfileImageRequest();
        req.setValue(value);
        Log.i("myLog", "viewFile b4 req: " + new Gson().toJson(req));
        Call<ResponseBody> call = services.getCaseSheet(req);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                try {
                    //log.i("myLog", "viewFile response:: ");
                    if (response.isSuccessful()) {
                        // Handle success
                        //log.i("myLog", "viewFile success");
                        try {
                            byte[] bytes = response.body().bytes();
                            if (bytes != null) {
                                String base64 = new String(bytes, StandardCharsets.UTF_8);
                                responseBodyToFile(base64, filename, bytes);
                            }
                        } catch (Exception ex) {

                        }


                    } else {
                        // Handle error
                        //log.i("myLog", "uploadFile viewFile else");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                // Handle failure
            }
        });
    }

    public void displaypdf(File file) {
        //log.i("mylog", "displaypdf:");
        if (file != null && file.exists()) {
            //  File file1 = new File("/storage/emulated/0/PDFs/case_sheet_view.pdf");
            Uri fileUri = FileProvider.getUriForFile(getContext(), BuildConfig.APPLICATION_ID + ".fileprovider", file);
            //log.i("myLog", "fileUri:" + fileUri.toString());

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(fileUri, "application/pdf");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            //log.i("mylog", "Action: " + intent.getAction() + ", Data: " + intent.getData());
            try {
                startActivity(intent);
            } catch (Exception e) {
                //log.i("mylog", "displaypdf333333 excep:" + e.toString());
                // Instruct the user to install a PDF reader here, or something
            }
        }
        //log.i("mylog", "file.exists() no:");
        // Toast.makeText(getContext(), "File path is incorrect.", Toast.LENGTH_LONG).show();
    }

    private void checkPermission() {
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            // Permission is not granted, request it
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, REQUEST_CODE_READ_STORAGE);
        } else {
            // Permission already granted, you can access the PDF
            accessPdfFile();
        }
    }

    private void accessPdfFile() {
        // Code to access your PDF file
        //  Toast.makeText(getContext(), "Permission granted! You can access the PDF file.", Toast.LENGTH_SHORT).show();
        // Call your method to open the PDF here
        displaypdf(file);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_CODE_READ_STORAGE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted
                accessPdfFile();
            } else {
                // Permission denied
                Toast.makeText(getContext(), "Permission denied to read your external storage", Toast.LENGTH_SHORT).show();
            }
        } else {
            CameraUtils.onRequestPermissionsResult(requestCode, grantResults, this);
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

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEvent(EventModel event) {

        //system.out.println("print onclick output");
//        getPatientProfile(patientId, hospId);

    }

    private void otpVerification(String abhaAddress) {
        OPHubRequests.sendOtpUserNameVerify request = new OPHubRequests.sendOtpUserNameVerify();
        request.setAbhaAddress(abhaAddress);
        request.setOtpSystem("abdm");
        //log.i("mylog", "otpVerification request:" + new Gson().toJson(request));
        Call<AbhaUserNameVerifyResponse> call = abhaServices.sendOtpUserNameVerify(request);
        call.enqueue(new Callback<AbhaUserNameVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaUserNameVerifyResponse> call, Response<AbhaUserNameVerifyResponse> response) {
                try {
                    //log.i("mylog", "otpVerification response:" + new Gson().toJson(response.body()));
                    if (response.isSuccessful()) {
                        if (response.body() != null) {
                            showOtpDialogForUserNameVerify("abdm", response);
                        }
                    } else {


                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<AbhaUserNameVerifyResponse> call, Throwable t) {
                //log.i("myLog", "otpVerification response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getContext());
            }
        });
    }

    private void getUnlinkAddress() {
        Map<String, Object> params = new HashMap<>();
        params.put("hospital_id", hospId);
        params.put("patient_id", patientId);
        params.put("abhaAddress", abhaAddress);
        Call<AbhaUserNameVerifyResponse> call = services.getABHAUnlink(params);
        call.enqueue(new Callback<AbhaUserNameVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaUserNameVerifyResponse> call, Response<AbhaUserNameVerifyResponse> response) {
                try {
                    //log.i("mylog", "otpVerification response:" + new Gson().toJson(response.body()));
                    if (response.isSuccessful()) {
                        if (response.body() != null) {
                            AbhaAddressPatientData();
                            Toast.makeText(getContext(), "Successfully delinked your ABHA address.", Toast.LENGTH_SHORT).show();
                        }
                    } else {


                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<AbhaUserNameVerifyResponse> call, Throwable t) {
                //log.i("myLog", "otpVerification response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getContext());
            }
        });
    }

    private void showOtpDialogForUserNameVerify(String otpSystem, Response<AbhaUserNameVerifyResponse> response) {
        //log.i("myLog", "showOtpDialogForUserNameVerify");
        dialogVerifyOTP = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.fragment_abha_verify_otp, null);
        dialogVerifyOTP.setContentView(view);
        ImageView imgClose = dialogVerifyOTP.findViewById(R.id.imgClose);
        Button btnVerify = dialogVerifyOTP.findViewById(R.id.btn_verify);
        TextView txtMob = dialogVerifyOTP.findViewById(R.id.txtMob);
        PinView pinView = dialogVerifyOTP.findViewById(R.id.pinview);
        TextView txtMsg = dialogVerifyOTP.findViewById(R.id.txtMessage);
        TextView txtEdit = dialogVerifyOTP.findViewById(R.id.txtEdit);
        LinearLayout linearMob = dialogVerifyOTP.findViewById(R.id.linearMob);
        LinearLayout linearResend = dialogVerifyOTP.findViewById(R.id.linearResend);
        LinearLayout linearSecs = dialogVerifyOTP.findViewById(R.id.linearResendSec);
        TextView txtSec = dialogVerifyOTP.findViewById(R.id.txtSecs);
        TextView resendOtpCount = dialogVerifyOTP.findViewById(R.id.resend_otp_count);
        TextView resendotpsuccess = dialogVerifyOTP.findViewById(R.id.resendotpsuccess);
        TextView txtmaxlimitotp = dialogVerifyOTP.findViewById(R.id.txtmaxlimitotp);
        TextView txtInvalidOTP = dialogVerifyOTP.findViewById(R.id.txtInvaidotp);
        TextView enable_otp = dialogVerifyOTP.findViewById(R.id.enable_otp);
        txtMsg.setText(response.body().getMessage().toString());
        txtMob.setVisibility(View.VISIBLE);
        linearMob.setVisibility(View.VISIBLE);
        txtEdit.setVisibility(View.GONE);
        txtMob.setVisibility(View.GONE);
        linearMob.setVisibility(View.GONE);
        btnVerify.setEnabled(false);
        btnVerify.setBackgroundResource(R.drawable.round_disable_button);
        dialogVerifyOTP.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogVerifyOTP.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogVerifyOTP.getWindow().getAttributes());
        lp.width = dpToPx(800);
        lp.height = dpToPx(450);
        dialogVerifyOTP.getWindow().setAttributes(lp);
//        new CountDownTimer(60000, 1000) {
//            public void onTick(long millisUntilFinished) {
//                long res = millisUntilFinished / 1000;
//                if (res != 0)
//                    txtSec.setText(res + "s");
//            }
//
//            public void onFinish() {
//                linearResend.setVisibility(View.VISIBLE);
//                linearSecs.setVisibility(View.GONE);
//            }
//        }.start();
        linearResend.setVisibility(View.GONE);
        linearSecs.setVisibility(View.GONE);

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogVerifyOTP.dismiss();
            }
        });

        linearResend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });

        pinView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                if (s.toString().trim().length() == 6) {
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

        btnVerify.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String otp = pinView.getText().toString();
                if (otp.isEmpty() || otp.length() != 6) {
                    pinView.setLineColor(Color.RED);
                    txtInvalidOTP.setVisibility(View.VISIBLE);
                    txtInvalidOTP.setText("Please enter a valid OTP");
                    return;
                } else {
                    pinView.setLineColor(Color.GREEN);
                    txtInvalidOTP.setVisibility(View.GONE);
                    verifyOTPUserName(otp, otpSystem, response.body().getTxnId().toString());
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


    private void verifyOTPUserName(String otp, String otpSystem, String txnId) {
        OPHubRequests.verifyAbhaUserNameOtp request = new OPHubRequests.verifyAbhaUserNameOtp();
        request.setOtp(otp);
        request.setOtpSystem(otpSystem);
        request.setTxnId(txnId);
        Log.i("mylog", "otpVerification request:" + new Gson().toJson(request));
        Call<AbhaUserNameOtpVerifyResponse> call = abhaServices.verifyOtpResponse(request);
        call.enqueue(new Callback<AbhaUserNameOtpVerifyResponse>() {
            @Override
            public void onResponse(Call<AbhaUserNameOtpVerifyResponse> call, Response<AbhaUserNameOtpVerifyResponse> response) {
                try {
                    Log.i("mylog", "otpVerification response:" + new Gson().toJson(response.body()));

                    if (response.isSuccessful()) {
                        if (response.body() != null) {
                            String message = response.body().getMessage();
                            if (response.body().getAuthResult().matches("success")) {

                                if (dialogVerifyOTP != null && dialogVerifyOTP.isShowing()) {
                                    dialogVerifyOTP.dismiss();
                                }
                                getUnlinkAddress();


                            } else {


                            }
                        }
                    }else if (response.code() == 400) {
                        try {

                            String errorBody = response.errorBody().string();
                            JSONObject jsonObject = new JSONObject(errorBody);
                            String errorMessage = jsonObject.getString("message");


                        } catch (Exception e) {
                            e.printStackTrace();
    //
                        }
                    } else {
                        //Toast.makeText(abhaContext, "Please Enter Correct OTP", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<AbhaUserNameOtpVerifyResponse> call, Throwable t) {
                Log.i("myLog", "otpVerification response failure:" + t.toString());

            }
        });

    }



}
