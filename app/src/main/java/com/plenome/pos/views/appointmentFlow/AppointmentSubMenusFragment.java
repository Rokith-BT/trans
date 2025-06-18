package com.plenome.pos.views.appointmentFlow;

import static android.view.Gravity.CENTER;
import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import static com.imin.printerlib.util.BmpUtils.getBlackWhiteBitmap;
import static com.plenome.pos.views.OPHubApplication.selApptOption;

import android.Manifest;
import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.NetworkRequest;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.Layout;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Display;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.webkit.WebView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentContainerView;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.tabs.TabLayout;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.imin.library.SystemPropManager;
import com.imin.printerlib.IminPrintUtils;

import com.mikhaellopez.circularimageview.CircularImageView;
import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.adapters.ConsultationProcessAdapter;
import com.plenome.pos.model.BookAppointmentOnlineRes;
import com.plenome.pos.model.BookAppointmentResponse;
import com.plenome.pos.model.ConsultationStatusResponse;
import com.plenome.pos.model.ConsultationTrackingResponse;
import com.plenome.pos.model.GetAppointmentStatusResponse;
import com.plenome.pos.model.GetDoctorResponse;
import com.plenome.pos.model.GetDoctorSlotResponse;
import com.plenome.pos.model.GetPrescriptionResponse;
import com.plenome.pos.model.HospitalDetailsResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.ViewApptInfoResponse;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.JavaScriptInterface;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.ClinicalNotesFragment;
import com.plenome.pos.views.DoctorSelectionFragment;
import com.plenome.pos.views.EMRFragment;
import com.plenome.pos.views.EMRFragmentNew;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.RazorpayActivity;
import com.plenome.pos.views.vibrasense.VitalMeasurementFragment;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import androidmads.library.qrgenearator.QRGContents;
import androidmads.library.qrgenearator.QRGEncoder;

public class AppointmentSubMenusFragment extends Fragment implements NetworkConnectionReceiver.ReceiverListener {
    private View rootView;
    private int width, age, height, textSize, hospitalId, shiftId, globalShiftId, patientChargeId, isTokenVerified, patientId, doctorId, currentPage, pageCount;
    TableRow.LayoutParams txtParam, lineParam, imgParam;
    private Dialog dialogDiscount, dialogFilter, dialogToken, dialogSuccess, dialogChangeStatus, dialogConfirmation, dialogReschedule;
    private Spinner spinDoctor, spinStatus, spinSlotTime, spinReason;
    private EditText edtFromDate, edtToDate, edtDate;
    private RestServices services,imageServices;
    private RestServices fileServices;
    private Dialog dialogViewFile;
    private Typeface typeface;
    Bitmap bitmapQR;
    boolean isAdditCharges = false;
    boolean isUpdating = false;
    private String roleName, userType, opdId, toTab, fromTab, fromScreen, docName, docSlot, name, gender, bloodgroup, phone, email, abhaAddress, abhaNo, charges = "0.0", tax = "0.0",
            totAmt = "0.0", taxPercent, paymentMode, paymentStatus, transactionId, paymentDate, source, message,
            consultType, apptStatus, apptStatusId, dateVal, dateDisplay, timeVal, selTab, apptId, token,
            hospName, hospAddr, doctorName, payment = "", additChargeNotes, referenceNumber, razorpayPaymentID;
    private ArrayList<String> status, cancelReason, progressStatus, trackingStatus, consultProcessName, consultProcessDocName,
            consultProcessStatus, consultProcessDesc, consultProcessDoctor, consultProcessDate, consultProcessColor, statusName, statusCount, statusColor;
    ArrayList<Integer> alShiftId, alGlobalShiftId, statusId, progressStatusId, trackingStatusId, trackingIsCompleted, consultProcessId, statusColorId;
    private LinearLayout.LayoutParams progressBgParam, progressFirstBgParam, progressLastBgParam, progressTxtParam, progressLineParam,
            statusTxtParam, statusNameParam, statusCountParam, statusBgParam, statusBgFirstParam;
    private double discount, discountPercent, additCharges, consultFees, taxAmount, netAmt, taxPercentage;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();
    ImageView imgQR;
    private List<String> connectTypeList;
    private byte[] content;
    private int orientation, totalCount;
    private IminPrintUtils mIminPrintUtils;
    boolean isConnected = true;

    // to check if we are monitoring Network
    private boolean monitoringConnectivity = false;


    @BindView(R.id.mainTabLayout)
    TabLayout mainTabLayout;

    @BindView(R.id.linearApptInfo)
    LinearLayout linearApptInfo;

    @BindView(R.id.newPrescFragContainer)
    FragmentContainerView prescFragContainer;

    @BindView(R.id.linearTracking)
    LinearLayout linearTracking;

    @BindView(R.id.linearPaymentBook)
    LinearLayout linearPayBook;

    @BindView(R.id.tblDet)
    TableLayout tblView;

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.btnTokenVerified)
    Button btnTokenVerified;

    @BindView(R.id.btnNew)
    Button btnNew;

    @BindView(R.id.imgFilter)
    ImageView imgFilter;

    @BindView(R.id.linearContents)
    RelativeLayout linearContents;

    @BindView(R.id.webView)
    WebView webView;

    @BindView(R.id.txtName)
    TextView txtName;

    @BindView(R.id.txtGender)
    TextView txtGender;

    @BindView(R.id.txtAge)
    TextView txtAge;

    @BindView(R.id.txtPhone)
    TextView txtPhone;

    @BindView(R.id.txtEmail)
    TextView txtEmail;

    @BindView(R.id.txtAbhaAddress)
    TextView txtAbhaAddress;

    @BindView(R.id.txtId)
    TextView txtID;

    @BindView(R.id.txtConsultType)
    TextView txtConsultType;

    @BindView(R.id.txtApptNo)
    TextView txtApptNo;

    @BindView(R.id.txtDocName)
    TextView txtDocName;

    @BindView(R.id.txtSpeciality)
    TextView txtSpeciality;

    @BindView(R.id.txtStatus)
    TextView txtStatus;

    @BindView(R.id.txtTokenNo)
    TextView txtTokenNo;

    @BindView(R.id.txtApptDate)
    TextView txtApptDate;

    @BindView(R.id.txtApptTime)
    TextView txtSlotTime;

    @BindView(R.id.txtConsultFee)
    TextView txtConsultFee;
    @BindView(R.id.txtAdditionalCharges)
    TextView txtAdditionalCharges;
    @BindView(R.id.txtAddChargeNotes)
    TextView txtAdditChargeNotes;
    @BindView(R.id.txtSubTotal)
    TextView txtSubTotal;

    @BindView(R.id.txtDiscount)
    TextView txtDiscount;
    @BindView(R.id.txtDiscountPercent)
    TextView txtDiscountPercent;

    @BindView(R.id.txtTax)
    TextView txtTax;

    @BindView(R.id.txtTaxpercent)
    TextView txtTaxPercent;

    @BindView(R.id.txtNetAmt)
    TextView txtTotAmt;

    @BindView(R.id.linearPaymentOption)
    LinearLayout linearPaymentOption;

    @BindView(R.id.linearPaymentDone)
    LinearLayout linearPaymentDone;

    @BindView(R.id.linearPaymentNotDone)
    LinearLayout linearPaymentNotDone;

    @BindView(R.id.btnSelectDoctor)
    Button btnSelectDoctor;

    @BindView(R.id.txtPaymentDet)
    TextView txtPaymentDet;

    @BindView(R.id.txtPaymentId)
    TextView txtPaymentId;

    @BindView(R.id.txtPaymentMode)
    TextView txtPaymentMode;

    @BindView(R.id.txtAmount)
    TextView txtAmount;

    @BindView(R.id.btnTokenPreview)
    Button btnTokenPreview;

    @BindView(R.id.btnCloseConsultation)
    Button btnCloseConsultation;

    @BindView(R.id.btnStartConsultation)
    Button btnStartConsultation;

    @BindView(R.id.btnMakePayment)
    Button btnPayment;

    @BindView(R.id.btnConfirmAppt)
    Button btnConfirmAppt;

    @BindView(R.id.btnApprove)
    Button btnApprove;

    @BindView(R.id.btnCancels)
    Button btnCancels;

    @BindView(R.id.lytBookAppointment)
    LinearLayout lytBookAppointment;

    @BindView(R.id.relComingSoon)
    RelativeLayout relComingSoon;

    @BindView(R.id.progressBar)
    ProgressBar progressBar;

    @BindView(R.id.tabLayout)
    TabLayout tabLayout;

    @BindView(R.id.linearApptStatus)
    LinearLayout linearApptStatus;

    @BindView(R.id.linearConsultStatus)
    LinearLayout linearConsultStatus;

    @BindView(R.id.linearProgress)
    LinearLayout linearProgress;

    @BindView(R.id.linearProgressText)
    LinearLayout linearProgressText;

    @BindView(R.id.btnReschedule)
    Button btnRescehdule;

    @BindView(R.id.btnCancelAppt)
    Button btnCancel;

    @BindView(R.id.btnSelDoctor)
    Button btnSelDoctor;

    @BindView(R.id.recyclerView)
    RecyclerView recyclerView;

    @BindView(R.id.linearCount)
    LinearLayout linearCount;

    @BindView(R.id.tblHead)
    TableLayout tblHead;

    @BindView(R.id.txtEdit)
    TextView txtEdit;

    @BindView(R.id.loaderOverlay)
    FrameLayout loaderOverlay;

    @BindView(R.id.imgDoctor)
    CircularImageView imgProfile;

    Thread thread;
    boolean isIminPrint = true;
    private static final int PAYMENT_REQUEST_CODE = 100;
    DecimalFormat df;
   String image= "";

    private String RPT="";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_appt_sub_menu, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarTitle.setText(R.string.appointmentInfo);
        services = RetrofitInstance.createService(RestServices.class);
        imageServices = RetrofitInstance.createImageUrl(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        initParams();
        df = new DecimalFormat("0.00");
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        userType = OPHubApplication.getUserType();
        hospitalId = OPHubApplication.getHospitalId();
        roleName = OPHubApplication.getUserType();
        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
//        progressBar.setVisibility(View.VISIBLE);
        selApptOption = "";
        Bundle bundle = getArguments();
        if (bundle != null) {
            opdId = bundle.getString("opd_ID");
            doctorId = bundle.getInt("doctor_id");
            shiftId = bundle.getInt("shift_id");
            globalShiftId = bundle.getInt("global_shift_id");
            timeVal = bundle.getString("time");
            docSlot = bundle.getString("slot");
            docName = bundle.getString("doctor_name");
            dateVal = bundle.getString("date");
            patientId = bundle.getInt("patient_id");
            name = bundle.getString("name");
            age = bundle.getInt("age");
            gender = bundle.getString("gender");
            bloodgroup = bundle.getString("bloodGroup");
            phone = bundle.getString("phone");
            email = bundle.getString("email");
            abhaNo = bundle.getString("abha_no");
            abhaAddress = bundle.getString("abha_address");
            apptId = bundle.getString("appt_id");
            apptStatusId = bundle.getString("appt_status_id");
            token = bundle.getString("token");
            Log.i("myLog", "apptId:" + apptId);
            charges = bundle.getString("charge");
            if (charges != null && !charges.isEmpty())
                consultFees = Double.parseDouble(charges);

            taxPercent = bundle.getString("tax_percent");
            totAmt = bundle.getString("total_amt");
            tax = bundle.getString("tax");
            if (tax != null && !tax.isEmpty())
                taxAmount = Double.parseDouble(tax);
            paymentDate = bundle.getString("payment_date");
            paymentStatus = bundle.getString("payment_status");
            paymentMode = bundle.getString("payment_mode");
            apptStatus = bundle.getString("appt_status");
            transactionId = bundle.getString("transaction_id");
            source = bundle.getString("source");
            message = bundle.getString("message");
            consultType = bundle.getString("consult_type");
            fromScreen = bundle.getString("from_screen");
            fromTab = bundle.getString("from_tab");
            toTab = bundle.getString("to_tab");
            netAmt = bundle.getDouble("appt_fees");
            image = bundle.getString("image");
            RPT = bundle.getString("VITALS");
            System.out.println("imagepass"+image);
            System.out.println("patientIds"+patientId);
            PreferenceManager.setInt(PreferenceManager.PATIENT_ID, patientId);
            showProfileImage();
            Log.d("RPT", "RPTRPssT: "+fromScreen);
            Log.d("RPT", "RPTRPT: "+RPT);
            Log.i("myLog", " oncreate netAmt:" + netAmt + "   consultFees:" + consultFees + "   totAmt:" + totAmt);
        }



        if (fromTab != null && fromTab.equalsIgnoreCase("History")) {
//            mainTabLayout.removeTabAt(2);
        }
        Log.i("myLog", "fromScreennnnnnnnnnn:" + fromScreen);
        Log.i("myLog", "from tab:" + fromTab);
        Log.i("myLog", "apptStatusId:" + apptStatusId + "   taxPercent:" + taxPercent);
        txtName.setText(name);
        Log.i("myLog", "name:" + name);
        txtAge.setText(age + " Years");
        txtGender.setText(gender);
        txtPhone.setText("+ 91" + phone);
        txtEmail.setText(email);
        if (abhaAddress == null || abhaAddress.isEmpty())
            abhaAddress = "-";
        txtAbhaAddress.setText(abhaAddress);
        Log.i("myLog", "patientId:" + patientId);
        txtID.setText(String.valueOf(patientId));
        if (docName != null && docName != "")
            txtDocName.setText(docName);
        else
            txtDocName.setText(R.string.doctor_not_assigned);
        txtApptDate.setText(dateVal);
        txtSlotTime.setText(docSlot);
        txtTaxPercent.setText(taxPercent);
        Log.i("myLog", "txtDocName:" + txtDocName);
        if (token == null)
            token = "-";
        txtTokenNo.setText(token);
        txtApptNo.setText(apptId);
        txtConsultType.setText(consultType);
        txtStatus.setText(apptStatus);
        Log.i("myLog", "appt status:" + apptStatus);
        if (apptStatus != null) {
            if (apptStatus.equalsIgnoreCase("Requested")) {
                txtStatus.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_requested_bg));
            } else if (apptStatus.equalsIgnoreCase("Reserved")) {
                txtStatus.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_reserved_bg));
            } else if (apptStatus.equalsIgnoreCase("Approved")) {
                txtStatus.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_approved_bg));

            } else if (apptStatus.equalsIgnoreCase("Cancelled")) {
                txtStatus.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_cancelled_bg));
            } else if (apptStatus.equalsIgnoreCase("Completed")) {
                txtStatus.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_completed_bg));
            } else if (apptStatus.equalsIgnoreCase("InProcess")) {
                txtStatus.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_inprocess_bg));
            }
        }

        Log.i("myLog", "Token333333333:" + token);
        if (charges != null)
            txtConsultFee.setText(df.format(Double.parseDouble(charges)));
        if (tax != null)
            txtTax.setText(df.format(Double.parseDouble(tax)));
        if (totAmt != null)
            txtTotAmt.setText(df.format(Double.parseDouble(totAmt)));
        Log.i("myLog", "totAmt:" + totAmt);
        txtPaymentId.setText(transactionId);
        txtPaymentMode.setText(paymentMode);

        if (fromScreen != null && fromScreen.equalsIgnoreCase("Profile") || fromScreen.equalsIgnoreCase("Patient_id_search")) {
            // btnConfirmAppt.setVisibility(View.VISIBLE);
            btnSelectDoctor.setVisibility(GONE);
            linearPaymentDone.setVisibility(GONE);
            linearPaymentNotDone.setVisibility(View.VISIBLE);
            txtEdit.setVisibility(GONE);
            txtPaymentDet.setVisibility(View.VISIBLE);
            linearPayBook.setVisibility(GONE);
            lytBookAppointment.setVisibility(VISIBLE);
            if (apptId == null || apptId.isEmpty()) {
                btnConfirmAppt.setVisibility(VISIBLE);
            } else {
                btnApprove.setVisibility(VISIBLE);
                btnCancels.setVisibility(VISIBLE);
            }
            txtConsultType.setVisibility(GONE);
            linearPaymentOption.setVisibility(GONE);
            if (progressBar.getVisibility() == View.VISIBLE)
                progressBar.setVisibility(View.GONE);
            int[] positionsToHide = {6, 5, 4, 3, 2, 1}; // Specify the positions you want to hide
            for (int position : positionsToHide) {
                if (position < mainTabLayout.getTabCount()) {
                    TabLayout.Tab tabToHide = mainTabLayout.getTabAt(position);
                    if (tabToHide != null && tabToHide.view != null) {
                        // Set the tab's view to GONE
                        tabToHide.view.setVisibility(View.GONE);
                    }
                }
            }
        } else if (fromScreen != null && fromScreen.equalsIgnoreCase("Add_new_patient")) {
            btnSelectDoctor.setVisibility(View.VISIBLE);
            linearPaymentDone.setVisibility(GONE);
            linearPaymentNotDone.setVisibility(GONE);
            txtEdit.setVisibility(GONE);
            txtPaymentDet.setVisibility(GONE);
            linearPayBook.setVisibility(GONE);
            lytBookAppointment.setVisibility(VISIBLE);
            if (apptId == null || apptId.isEmpty()) {
                btnConfirmAppt.setVisibility(VISIBLE);
            } else {
                btnApprove.setVisibility(VISIBLE);
                btnCancels.setVisibility(VISIBLE);
            }
            txtConsultType.setVisibility(GONE);
            linearPaymentOption.setVisibility(GONE);

            if (progressBar.getVisibility() == View.VISIBLE)
                progressBar.setVisibility(View.GONE);
            int[] positionsToHide = {6, 5, 4, 3, 2, 1}; // Specify the positions you want to hide
            for (int position : positionsToHide) {
                if (position < mainTabLayout.getTabCount()) {
                    TabLayout.Tab tabToHide = mainTabLayout.getTabAt(position);
                    if (tabToHide != null && tabToHide.view != null) {
                        // Set the tab's view to GONE
                        tabToHide.view.setVisibility(View.GONE);
                    }
                }
            }
        } else {
            Log.i("mylog", "else");
            if (toTab != null && toTab.equalsIgnoreCase("Tracking")) {
                //    viewApptInfo(apptId);
                mainTabLayout.getTabAt(1).select();
                btnCancels.setVisibility(GONE);
                gotoTrackingTab();
            } else if (toTab != null && toTab.equalsIgnoreCase("Prescription")) {
                mainTabLayout.getTabAt(4).select();
                goToPrescriptionTab();
            } else {
                Log.i("mylog", "else2");
                if (apptId != null)
                    viewApptInfo(apptId);
            }
        }


        getAppointmentStatus(String.valueOf(hospitalId), "");




        if (RPT.equalsIgnoreCase("REPORT")){
            btnTokenVerified.setVisibility(GONE);
            mainTabLayout.selectTab(mainTabLayout.getTabAt(2), true);


            goToVitals();
            btnTokenVerified.setVisibility(GONE);
//                        prescFragContainer.setVisibility(VISIBLE);
//                        prescFragContainer.removeAllViews();
            System.out.println("print list " + apptStatus);

            if (apptStatus.equalsIgnoreCase("Reserved") || apptStatus.equalsIgnoreCase("InProcess") || apptStatus.equalsIgnoreCase("Approved") || apptStatus.equalsIgnoreCase("In Process")) {
                VitalMeasurementFragment vitalMeasurementFragment = new VitalMeasurementFragment();
                Bundle result_data = new Bundle();
                int opd_id_vital = 0;
                if (opdId != null) {
                    opd_id_vital = Integer.parseInt(opdId);
                }
                result_data.putInt("patient_id", patientId);
                result_data.putInt("opdId", opd_id_vital);
                vitalMeasurementFragment.setArguments(result_data);
                FragmentTransaction vitalsTransaction = getChildFragmentManager().beginTransaction();
                vitalsTransaction.replace(R.id.newPrescFragContainer, vitalMeasurementFragment);
                vitalsTransaction.addToBackStack(null);
                vitalsTransaction.commit();
            }
        }

        mainTabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        Log.i("myLog", "clicked appointments");
                        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
                        prescFragContainer.setVisibility(GONE);
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else
                            gotoAppointmentInfo();
                        break;
                    case 1:
                        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
                        prescFragContainer.setVisibility(GONE);
                        boolean isConnected1 = checkConnection();
                        if (!isConnected1)
                            showAlert(isConnected1);
                        else
                            gotoTrackingTab();
                        break;
                    case 2:
                        goToVitals();
                        PreferenceManager.setString(PreferenceManager.OPD_ID, opdId);
//                        prescFragContainer.setVisibility(VISIBLE);
//                        prescFragContainer.removeAllViews();
                        System.out.println("print list " + apptStatus);

                        if (apptStatus.equalsIgnoreCase("Reserved") || apptStatus.equalsIgnoreCase("InProcess") || apptStatus.equalsIgnoreCase("Approved") || apptStatus.equalsIgnoreCase("In Process")) {
                            VitalMeasurementFragment vitalMeasurementFragment = new VitalMeasurementFragment();
                            Bundle result_data = new Bundle();
                            int opd_id_vital = 0;
                            if (opdId != null) {
                                opd_id_vital = Integer.parseInt(opdId);
                            }
                            result_data.putInt("patient_id", patientId);
                            result_data.putInt("opdId", opd_id_vital);
                            vitalMeasurementFragment.setArguments(result_data);
                            FragmentTransaction vitalsTransaction = getChildFragmentManager().beginTransaction();
                            vitalsTransaction.replace(R.id.newPrescFragContainer, vitalMeasurementFragment);
                            vitalsTransaction.addToBackStack(null);
                            vitalsTransaction.commit();
                        }
                        break;
                    case 3:
                        //   prescFragContainer.setVisibility(VISIBLE);
                        // prescFragContainer.removeAllViews();
                        //  selTab = "Clinical_notes";
                        goToClinicalNotes();
                        PreferenceManager.setString(PreferenceManager.OPD_ID, opdId);
                        NewClinicalNotesFragment newClinicalNotesFragment = new NewClinicalNotesFragment();
                        Bundle result = new Bundle();
                        int opd_id_clinical = 0;
                        if (opdId != null) {
                            opd_id_clinical = Integer.parseInt(opdId);
                        }
                        result.putInt("opdId", opd_id_clinical);
                        newClinicalNotesFragment.setArguments(result);
                        FragmentTransaction clinicalNotesTransaction = getChildFragmentManager().beginTransaction();
                        clinicalNotesTransaction.replace(R.id.newPrescFragContainer, newClinicalNotesFragment);
                        clinicalNotesTransaction.addToBackStack(null);
                        clinicalNotesTransaction.commit();
                        break;

                    case 4:
                        prescFragContainer.setVisibility(VISIBLE);
                        prescFragContainer.removeAllViews();
                        goToPrescriptionTab();
                        selTab = "Prescription";
                        NewPrescriptionFragment newPrescriptionFragment = new NewPrescriptionFragment();
                        Bundle bundle = new Bundle();
                        int opd_id = 0;
                        if (opdId != null) {
                            opd_id = Integer.parseInt(opdId);
                        }
                        bundle.putInt("opdId", opd_id);
                        bundle.putInt("hospId", hospitalId);
                        newPrescriptionFragment.setArguments(bundle);
                        FragmentTransaction prescriptionTransaction = getChildFragmentManager().beginTransaction();
                        prescriptionTransaction.replace(R.id.newPrescFragContainer, newPrescriptionFragment);
                        prescriptionTransaction.addToBackStack(null);
                        prescriptionTransaction.commit();
                        break;

                    case 5:

                        linearApptInfo.setVisibility(GONE);
                        tblView.setVisibility(GONE);
                        relComingSoon.setVisibility(GONE);
                        btnTokenVerified.setVisibility(GONE);
                        linearTracking.setVisibility(GONE);
                        txtStatus.setVisibility(GONE);
                        tblHead.setVisibility(GONE);
                        imgNoData.setVisibility(GONE);
                        txtNoData.setVisibility(GONE);
                        linearPaymentOption.setVisibility(GONE);
                        prescFragContainer.setVisibility(VISIBLE);
                        btnApprove.setVisibility(GONE);
                        btnCancels.setVisibility(GONE);
                        btnConfirmAppt.setVisibility(GONE);
                        prescFragContainer.removeAllViews();
                        //EMRFragment newFragment = new EMRFragment();
                        EMRFragmentNew newFragment = new EMRFragmentNew();
                        Bundle result_data = new Bundle();
                        int opd_id_vital = 0;
                        if (opdId != null) {
                            opd_id_vital = Integer.parseInt(opdId);
                        }
                        result_data.putInt("opdId", opd_id_vital);
                        result_data.putString("appt_id", apptId);
                        result_data.putString("appt_status", apptStatus);
                        newFragment.setArguments(result_data);
                        FragmentTransaction NewTransaction = getChildFragmentManager().beginTransaction();
                        NewTransaction.replace(R.id.newPrescFragContainer, newFragment);
                        NewTransaction.addToBackStack(null);
                        NewTransaction.commit();

                        break;

                    case 6:
                        prescFragContainer.setVisibility(VISIBLE);
                        prescFragContainer.removeAllViews();
                        goToPrescriptionTab();
                        selTab = "Preview";
                        PreviewFragment previewFragment = new PreviewFragment();
                        Bundle bundle1 = new Bundle();
                        Log.i("myLog", "opdId:" + opdId);
                        int opd_id1 = 0;
                        if (opdId != null) {
                            opd_id1 = Integer.parseInt(opdId);
                        }
                        Log.i("myLog", "opd_id1:" + opd_id1);
                        bundle1.putInt("opdId", opd_id1);
                        bundle1.putString("appt_id", apptId);
                        bundle1.putString("appt_status", apptStatus);
                        previewFragment.setArguments(bundle1);
                        FragmentTransaction previewTransaction = getChildFragmentManager().beginTransaction();
                        previewTransaction.replace(R.id.newPrescFragContainer, previewFragment);
                        previewTransaction.addToBackStack(null);
                        previewTransaction.commit();
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
        return rootView;
    }

    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            textSize = 14;
            txtParam = new TableRow.LayoutParams(width / 4, dpToPx(50));
            lineParam = new TableRow.LayoutParams(width - dpToPx(50), dpToPx(1));
            lineParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            lineParam.span = 4;
            int w = (width / 4) - dpToPx(25);
            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(w / 2, 0, w / 2, 0);
            progressBgParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            progressFirstBgParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            progressFirstBgParam.setMargins(dpToPx(75), 0, 0, 0);
            progressLastBgParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            progressLastBgParam.setMargins(0, 0, dpToPx(75), 0);
            progressLineParam = new TableRow.LayoutParams(dpToPx(150), dpToPx(2));
            progressLineParam.setMargins(0, 24, 0, 24);
            progressTxtParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            statusTxtParam = new TableRow.LayoutParams(dpToPx(200), dpToPx(50));
            statusCountParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            statusNameParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            statusBgFirstParam = new LinearLayout.LayoutParams(dpToPx(100), dpToPx(100));
            statusBgParam = new LinearLayout.LayoutParams(dpToPx(100), dpToPx(100));
            statusBgParam.setMargins(dpToPx(100), 0, 0, 0);


        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            textSize = 16;
            txtParam = new TableRow.LayoutParams(width / 4, dpToPx(50));
            lineParam = new TableRow.LayoutParams(width - dpToPx(50), dpToPx(1));
            lineParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            lineParam.span = 4;
            int w = (width / 4) - dpToPx(25);
            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(w / 2, 0, w / 2, 0);
            progressBgParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            progressFirstBgParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            progressFirstBgParam.setMargins(dpToPx(75), 0, 0, 0);
            progressLastBgParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            progressLastBgParam.setMargins(0, 0, dpToPx(75), 0);
            progressLineParam = new TableRow.LayoutParams(dpToPx(150), dpToPx(2));
            progressLineParam.setMargins(0, 24, 0, 24);
            progressTxtParam = new TableRow.LayoutParams(dpToPx(50), dpToPx(50));
            statusTxtParam = new TableRow.LayoutParams(dpToPx(200), dpToPx(50));
            statusCountParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            statusNameParam = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            statusBgFirstParam = new LinearLayout.LayoutParams(dpToPx(100), dpToPx(100));
            statusBgParam = new LinearLayout.LayoutParams(dpToPx(100), dpToPx(100));
            statusBgParam.setMargins(dpToPx(100), 0, 0, 0);

        }

    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }


    @OnClick(R.id.btnCancelAppt)
    public void cancelAppt() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            showRescheduleDialog("Cancel");
        }
    }

    @OnClick(R.id.btnReschedule)
    public void rescheduleAppt() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            showRescheduleDialog("Reschedule");
        }
    }

    @OnClick(R.id.btnSelDoctor)
    public void selDoctor() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            goToSelDoctor();
        }
    }

    @OnClick(R.id.txtEdit)
    public void clickedEdit() {
        showDiscountDialog();
    }

    @OnClick(R.id.imgFilter)
    public void clickFilter() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            showFilterDialog();
        }
    }


    @OnClick(R.id.btnCloseConsultation)
    public void clickedCloseConsultation() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            if (paymentStatus != null && paymentStatus.equalsIgnoreCase("Payment done."))
                showConfirmationDialog("Close", "", 0, "Are you sure want to close this consultation");
            else
                OPHubUtils.showErrorDialog(getActivity(), "Please complete payment process!");
        }
    }

    @OnClick(R.id.btnStartConsultation)
    public void clickStartConsultation() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = new Date();
            String currDate = dateFormat.format(date);
            Log.i("myLog", "currDate:" + currDate + "    dateval:" + dateVal);
            if (currDate.equalsIgnoreCase(dateVal))
                tokenVerify();
            else
                OPHubUtils.showErrorDialog(getActivity(), "Unable to verify this token now, Please verify on " + dateDisplay);
        }
    }

    @OnClick(R.id.btnApprove)
    public void btnApprove() {
        updateStatus();
    }

    @OnClick(R.id.btnCancels)
    public void btnCancels() {
        cancelStatus();
    }

    private void cancelStatus() {
        showRescheduleDialog("Cancel");
    }


    @OnClick(R.id.btnConfirmAppt)
    public void clickConfirmAppt() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            selApptOption = "Confirm";
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = new Date();
            String currDateTime = dateFormat.format(date);
            bookAppointmentCash(shiftId, patientId, "offline", currDateTime, globalShiftId);
        }
    }

    @OnClick(R.id.btnSelectDoctor)
    public void clickSelDoctor() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

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
            result.putString("appt_status_id", apptStatusId);
            result.putString("appt_id", apptId);
            result.putString("appt_status", apptStatus);
            result.putString("from_screen", "Appointment_info");
            newFragment.setArguments(result);
            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        }
    }

    @OnClick(R.id.btnNew)
    public void clickNew() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            int tabSelPos = mainTabLayout.getSelectedTabPosition();
            if (tabSelPos == 1) {
                // getParentFragmentManager().beginTransaction().replace(R.id.fragment_container, new VitalsFragment()).commit();
                if (userType.equalsIgnoreCase("Doctor")||userType.equalsIgnoreCase("admin")||userType.equalsIgnoreCase("super admin")||userType.equalsIgnoreCase("Nurse")) {
                    ClinicalNotesFragment newFragment = new ClinicalNotesFragment();
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    Bundle result = new Bundle();
                    result.putString("from_screen", "Prescription");
                    result.putInt("patient_id", patientId);
                    result.putString("appt_id", apptId);
                    result.putString("appt_status", apptStatus);
                    result.putString("from_tab", selTab);
                    newFragment.setArguments(result);

                    transaction.replace(R.id.fragment_container, newFragment);
                    transaction.addToBackStack(null);
                    transaction.commit();
                }
                //  Intent intent = new Intent(getActivity(), VibrasenseMainActivity.class);
                //startActivity(intent);

            } else if (tabSelPos == 2) {
                ClinicalNotesFragment newFragment = new ClinicalNotesFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                Bundle result = new Bundle();
                result.putString("from_screen", "Clinical_Notes");
                newFragment.setArguments(result);

                transaction.replace(R.id.fragment_container, newFragment, "Clinical_Notes");
                transaction.addToBackStack(null);
                transaction.commit();

            } else if (tabSelPos == 3) {
                if (userType.equalsIgnoreCase("Doctor")||userType.equalsIgnoreCase("admin")||userType.equalsIgnoreCase("super admin")||userType.equalsIgnoreCase("Nurse")) {
                    ClinicalNotesFragment newFragment = new ClinicalNotesFragment();
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    Bundle result = new Bundle();
                    result.putString("from_screen", "Prescription");
                    newFragment.setArguments(result);

                    transaction.replace(R.id.fragment_container, newFragment);
                    transaction.addToBackStack(null);
                    transaction.commit();

               /* PrescriptionFragment newFragment = new PrescriptionFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                transaction.replace(R.id.relFragment, newFragment);
                transaction.addToBackStack(null);
                transaction.commit();*/
                }
            }
        }
    }

    @OnClick(R.id.btnTokenPreview)
    public void verifyToken() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            showTokenDialog();
        }
    }


    @OnClick(R.id.btnMakePayment)
    public void makePayment() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            showPaymentSelDialog();
        }
    }

    @OnClick(R.id.btnCash)
    public void clickCash() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            showUpiCashSelDialog();

        }
    }


    @OnClick(R.id.btnScheme)
    public void clickScheme() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = new Date();
            String currDateTime = dateFormat.format(date);
            Log.i("myLog", "btn scheme Date val:" + dateVal);
            Log.i("myLog", "Patient id:" + patientId);
            if (fromScreen.equalsIgnoreCase("Profile") || fromScreen.equalsIgnoreCase("Patient_id_search"))
                bookAppointmentCash(shiftId, patientId, "scheme", currDateTime, globalShiftId);
            else if (fromScreen.equalsIgnoreCase("Profile_Appt") || fromScreen.equalsIgnoreCase("Appointment") || fromScreen.equalsIgnoreCase("Appointment_info") || fromScreen.equalsIgnoreCase("Main") || fromScreen.equalsIgnoreCase("Tracking"))
                rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, "scheme");
        }
    }


    @OnClick(R.id.btnPayLater)
    public void clickPayLater() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date date = new Date();
            String currDateTime = dateFormat.format(date);
            Log.i("myLog", "btn pay later Date val:" + dateVal);
            if (fromScreen.equalsIgnoreCase("Profile") || fromScreen.equalsIgnoreCase("Patient_id_search"))
                bookAppointmentCash(shiftId, patientId, "offline", currDateTime, globalShiftId);
            else if (fromScreen.equalsIgnoreCase("Profile_Appt") || fromScreen.equalsIgnoreCase("Appointment") || fromScreen.equalsIgnoreCase("Appointment_info") || fromScreen.equalsIgnoreCase("Main") || fromScreen.equalsIgnoreCase("Tracking"))
                rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, "paylater");
        }
    }

    public void gotoAppointmentInfo() {
        selTab = "appointment_info";
        OPHubApplication.appBarTitle.setText(R.string.appointmentInfo);
        linearApptInfo.setVisibility(View.VISIBLE);
        tblView.setVisibility(GONE);
        btnNew.setVisibility(GONE);
        imgFilter.setVisibility(GONE);
        btnTokenVerified.setVisibility(GONE);
        txtStatus.setVisibility(View.VISIBLE);
        relComingSoon.setVisibility(GONE);
        linearTracking.setVisibility(GONE);
        tblHead.setVisibility(GONE);
        imgNoData.setVisibility(GONE);
        txtNoData.setVisibility(GONE);
        btnApprove.setVisibility(GONE);
        btnCancels.setVisibility(GONE);
        txtEdit.setVisibility(GONE);
        btnConfirmAppt.setVisibility(GONE);
        viewApptInfo(apptId);

    }

    private void showVitals(List<GetPrescriptionResponse> list) {
        tblView.removeAllViews();
        tblHead.removeAllViews();
        int size = list.size();
        if (size > 0) {
            tblHead.setVisibility(VISIBLE);
            TableRow trTitle = new TableRow(getActivity());
            trTitle.setGravity(Gravity.CENTER);
            TextView txtCreatedBy = new TextView(getActivity());
            txtCreatedBy.setText(R.string.opd_no);
            txtCreatedBy.setTextColor(Color.WHITE);
            txtCreatedBy.setTypeface(typeface);
            txtCreatedBy.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtCreatedBy.setGravity(Gravity.CENTER);
            trTitle.addView(txtCreatedBy, txtParam);

            TextView txtCreatedDate = new TextView(getActivity());
            txtCreatedDate.setText(R.string.appointmentDateTime);
            txtCreatedDate.setTextColor(Color.WHITE);
            txtCreatedDate.setTypeface(typeface);
            txtCreatedDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtCreatedDate.setGravity(Gravity.CENTER);
            trTitle.addView(txtCreatedDate, txtParam);

            TextView txtRepairNotes = new TextView(getActivity());
            txtRepairNotes.setText(R.string.consulting_doctor);
            txtRepairNotes.setTextColor(Color.WHITE);
            txtRepairNotes.setTypeface(typeface);
            txtRepairNotes.setGravity(Gravity.CENTER);
            txtRepairNotes.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            trTitle.addView(txtRepairNotes, txtParam);

            TextView txtApptDateHead = new TextView(getActivity());

            if (selTab.equalsIgnoreCase("vitals"))
                txtApptDateHead.setText(R.string.vitals);
            else if (selTab.equalsIgnoreCase("prescription"))
                txtApptDateHead.setText(R.string.prescription);
            else if (selTab.equalsIgnoreCase("clinical_notes"))
                txtApptDateHead.setText(R.string.clinicalNotes);
            txtApptDateHead.setTextColor(Color.WHITE);
            txtApptDateHead.setTypeface(typeface);
            txtApptDateHead.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtApptDateHead.setGravity(Gravity.CENTER);
            trTitle.addView(txtApptDateHead, txtParam);
            trTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.table_title_bg));
            tblHead.addView(trTitle);

            ImageView[] img = new ImageView[size];
            for (int start = 0; start < size; start++) {
                final int index = start;
                GetPrescriptionResponse resp = list.get(start);
                String files = resp.getFiles();

                TableRow tr = new TableRow(getActivity());
                tr.setGravity(Gravity.CENTER);
                TextView txtToken = new TextView(getActivity());
                txtToken.setText(String.valueOf(resp.getHospOPDId()));
                txtToken.setTextColor(ContextCompat.getColor(getContext(), R.color.vitaltbl_text));
                txtToken.setTypeface(typeface);
                txtToken.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtToken.setGravity(Gravity.CENTER);
                tr.addView(txtToken, txtParam);

                TextView txtName = new TextView(getActivity());
                txtName.setText(resp.getAppointmentDate());
                txtName.setTextColor(ContextCompat.getColor(getContext(), R.color.vitaltbl_text));
                txtName.setTypeface(typeface);
                txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtName.setGravity(Gravity.CENTER);
                tr.addView(txtName, txtParam);

                TextView txtPatientId = new TextView(getActivity());
                txtPatientId.setText(resp.getDoctorName());
                txtPatientId.setTypeface(typeface);
                txtPatientId.setTextColor(ContextCompat.getColor(getContext(), R.color.vitaltbl_text));
                txtPatientId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtPatientId.setGravity(Gravity.CENTER);
                tr.addView(txtPatientId, txtParam);

                img[start] = new ImageView(getActivity());
                img[start].setImageResource(R.drawable.pdf);
                tr.addView(img[index], imgParam);

                img[start].setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Log.i("myLog", "image clicked index:" + index);
                        GetPrescriptionResponse resp = list.get(index);
                        String files = resp.getFiles();
                        Log.i("myLog", "Files :" + files);
                        showFile(files);
                    }
                });
                TableRow trLine1 = new TableRow(getActivity());
                View v1 = new View(getActivity());
                v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
                trLine1.addView(v1, lineParam);
                //  tr.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                tblView.addView(tr);
                tblView.addView(trLine1);
            }

        } else {
            tblHead.setVisibility(GONE);
            tblView.setVisibility(GONE);
            imgNoData.setVisibility(GONE);
            txtNoData.setVisibility(GONE);
        }
    }

    public void showFilterDialog() {
        dialogFilter = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_appointment_filter, null);
        dialogFilter.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogFilter.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogFilter.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogFilter.findViewById(R.id.btnSubmit);
        RelativeLayout relStatus = dialogFilter.findViewById(R.id.relStatus);
        spinDoctor = dialogFilter.findViewById(R.id.spinDoctor);
        TextView txtStatus = (TextView) dialogFilter.findViewById(R.id.txtStatus);
        spinStatus = dialogFilter.findViewById(R.id.spinStatus);
        edtFromDate = dialogFilter.findViewById(R.id.edtFromDate);
        edtToDate = dialogFilter.findViewById(R.id.edtToDate);
        relStatus.setVisibility(GONE);
        txtStatus.setVisibility(GONE);
        getDoctors(String.valueOf(hospitalId));
        edtFromDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "from date clicked");
                setFromDateCalender("from");
            }
        });
        edtToDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "edtToDate date clicked");
                setFromDateCalender("to");
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogFilter.dismiss();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String doctor = null;
                String fromDate = edtFromDate.getText().toString();
                String toDate = edtToDate.getText().toString();
                if (spinDoctor.getSelectedItem() != null)
                    doctor = spinDoctor.getSelectedItem().toString();
                if (fromDate.length() == 0)
                    fromDate = null;
                if (toDate.length() == 0)
                    toDate = null;
                if (doctor.equalsIgnoreCase("Select Doctor"))
                    doctor = null;
                Log.i("myLog", "from date:" + fromDate + "   to date:" + toDate + "   doctor:" + doctor);

                dialogFilter.dismiss();
            }
        });
        dialogFilter.show();
    }

    private void getDoctors(String hospID) {
        Log.i("myLog", "getDoctors");
        services.getDoctors(hospID).enqueue(new Callback<List<GetDoctorResponse>>() {

            @Override
            public void onResponse(Call<List<GetDoctorResponse>> call, Response<List<GetDoctorResponse>> response) {
                try {
                    Log.i("myLog", "getDoctors onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetDoctorResponse> list = response.body();
                        int size = list.size();
                        ArrayList<String> doctorName = new ArrayList<>();
                        ArrayList<Integer> doctorId = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            GetDoctorResponse resp = list.get(start);
                            doctorName.add(resp.getInternalDoctorName());
                            doctorId.add(resp.getInternalDoctorId());
                        }
                        Log.i("myLog", "getDoctors onResponse:");
                        OPHubUtils.addProdTypeSpinner(getActivity(), doctorName, spinDoctor, "Select Doctor");
                        Log.i("myLog", "getDoctors onResponse:::::::::::");
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<List<GetDoctorResponse>> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(getActivity());
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

                        if (option.equalsIgnoreCase("from"))
                            edtFromDate.setText(year + "-" + month + "-" + day);
                        else if (option.equalsIgnoreCase("to"))
                            edtToDate.setText(year + "-" + month + "-" + day);
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        // at last we are calling show to
        // display our date picker dialog.
        c.add(Calendar.DAY_OF_MONTH, 30);
        datePickerDialog.show();
    }

    private void getPrescription(int patientId) {
        Log.i("mylog", "getPrescription");
        OPHubRequests.GetPrescriptionRequest request = new OPHubRequests.GetPrescriptionRequest();
        request.setHospitalId(hospitalId);
        request.setPatientId(patientId);
        Log.i("mylog", "getPrescription request:" + new Gson().toJson(request));
        Call<List<GetPrescriptionResponse>> call = services.getPrescription(request);
        call.enqueue(new Callback<List<GetPrescriptionResponse>>() {

            @Override
            public void onResponse(Call<List<GetPrescriptionResponse>> call, Response<List<GetPrescriptionResponse>> response) {
                try {
                    Log.i("myLog", "getPrescription response:");
                    Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "getPrescription response isSuccess:" + response.body().toString());
                        List<GetPrescriptionResponse> list = response.body();
                        if (list != null) {
                            showVitals(list);
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<GetPrescriptionResponse>> call, Throwable t) {
                Log.i("myLog", "getPrescription response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
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
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (RuntimeException e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "showFile response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
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

    private void bookAppointmentCash(int shiftId, int patientId, String paymentMode, String paymentDate, int globalShiftId) {
        Log.i("mylog", "bookAppointmentCash");
        Log.i("mylog", "bookAppointmentCash slot:" + docSlot);
        Log.i("mylog", "bookAppointmentCash dateVal:" + dateVal);
        OPHubRequests.BookAppointmentReq request = new OPHubRequests.BookAppointmentReq();
        request.setDate(dateVal);
        if (docSlot != null) {
            String[] slotTime = docSlot.split(" - ");
            String time = slotTime[0];
            try {
                SimpleDateFormat sdf12Hour = new SimpleDateFormat("hh:mm:ss a");
                SimpleDateFormat sdf24Hour = new SimpleDateFormat("HH:mm:ss");
                Date date = sdf12Hour.parse(time);
                String time24Hr = sdf24Hour.format(date);
                request.setTime(time24Hr);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        request.setDoctorId(doctorId);
        request.setShiftId(shiftId);
        request.setPatientId(patientId);
        request.setHospitalId(hospitalId);
        request.setLive_consult("no");
        request.setPayment_date(paymentDate);
        request.setPayment_mode(paymentMode);
        request.setGlobal_shift_id(globalShiftId);
        request.setReceivedByName(OPHubApplication.getStaffName());
        Log.i("myLog", "apptStatusId:" + apptStatusId);
        if (apptStatusId != null)
            request.setApptStatusId(Integer.parseInt(apptStatusId));
        // request., apptStatusId);

        Log.i("mylog", "bookAppointmentCash request:" + new Gson().toJson(request));
        Call<List<BookAppointmentResponse>> call = services.bookAppointmentCash(request);
        call.enqueue(new Callback<List<BookAppointmentResponse>>() {

            @Override
            public void onResponse(Call<List<BookAppointmentResponse>> call, Response<List<BookAppointmentResponse>> response) {
                try {
                    Log.i("mylog", "bookAppointmentCash response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "bookAppointmentCash response isSuccess:" + response.body().toString());
                        List<BookAppointmentResponse> responses = response.body();
                        BookAppointmentResponse resp = responses.get(0);
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        Log.i("myLog", "bookAppointmentCash message:" + message);
                        Log.i("myLog", "bookAppointmentCash status:" + status);

                        if (status.equalsIgnoreCase("success")) {
                            BookAppointmentResponse.InsertedDetails details = resp.getInsertedDetails();
                            apptId = details.getId();
                            Log.i("myLog", "bookAppointmentCash apptId:" + apptId);
                            //   showSuccessDialog(message, "New_Appt");
                            viewApptInfo(apptId);
                            new Handler().postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    try {
                                        showTokenDialog();

                                    } catch (Exception ex) {
                                        Log.i("myLog", "exception ex:" + ex.toString());
                                    }

                                }
                            }, 1000);

                        } else {
                            OPHubUtils.showErrorDialog(getActivity(), message);
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<BookAppointmentResponse>> call, Throwable t) {
                Log.i("myLog", "bookAppointmentCash response failure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void bookAppointmentOnline() {
        Log.i("mylog", "bookAppointmentOnline");
        JSONObject obj1 = new JSONObject();
        try {
            obj1.put("amount", String.valueOf(netAmt));
            obj1.put("hospital_id", hospitalId);
            obj1.put("patient_email", email);
            obj1.put("patient_mobile", phone);
            obj1.put("payment_mode", "UPI");
            obj1.put("transaction_type", "DIRECT");

        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        JsonParser jsonParser1 = new JsonParser();
        JsonObject jsonObject1 = (JsonObject) jsonParser1.parse(obj1.toString());

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = new Date();
        String dateStr = dateFormat.format(date);

        JSONObject obj2 = new JSONObject();
        try {
            obj2.put("date", dateVal);
            obj2.put("time", timeVal);
            obj2.put("doctor", doctorId);
            obj2.put("shift_id", shiftId);
            obj2.put("patient_id", patientId);
            obj2.put("Hospital_id", hospitalId);
            obj2.put("live_consult", "no");
            obj2.put("payment_date", dateStr);
            obj2.put("payment_mode", "UPI");
            obj2.put("global_shift_id", globalShiftId);
            obj2.put("appointment_status_id", apptStatusId);

        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        JsonParser jsonParser2 = new JsonParser();
        JsonObject jsonObject2 = (JsonObject) jsonParser2.parse(obj2.toString());
        JSONObject obj = new JSONObject();

        try {
            if (fromScreen.equalsIgnoreCase("Profile")) {
                obj.put("api", BuildConfig.BASE_URL + "appointment");
                obj.put("method", "post");
            } else if (fromScreen.equalsIgnoreCase("Appointment") || fromScreen.equalsIgnoreCase("Appointment_info")) {
                obj.put("api", BuildConfig.BASE_URL + "appointment/reshedule/" + apptId);
                obj.put("method", "post");
            }
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        JsonParser jsonParser = new JsonParser();
        JsonObject jsonObject = (JsonObject) jsonParser.parse(obj.toString());
        JsonArray arr = new JsonArray();
        arr.add(jsonObject1);
        arr.add(jsonObject2);
        arr.add(jsonObject);
        Log.i("mylog", "bookAppointmentOnline request:" + new Gson().toJson(arr));
        Call<BookAppointmentOnlineRes> call = fileServices.bookAppointmentOnline(arr, "OP_HUB");
        call.enqueue(new Callback<BookAppointmentOnlineRes>() {

            @Override
            public void onResponse(Call<BookAppointmentOnlineRes> call, Response<BookAppointmentOnlineRes> response) {
                try {
                    Log.i("mylog", "BookAppointmentOnlineRes response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "BookAppointmentOnlineRes response isSuccess:" + response.body().toString());
                        BookAppointmentOnlineRes resp = response.body();
                        String merchantId = resp.getMerchantId();
                        String reqData = resp.getReqData();
                        String transNo = resp.getTransactionNumber();

                        Log.i("myLog", "BookAppointmentOnlineRes merchantId:" + merchantId);
                        Log.i("myLog", "BookAppointmentOnlineRes reqData:" + reqData);
                        Log.i("myLog", "BookAppointmentOnlineRes transNo:" + transNo);
                        linearContents.setVisibility(GONE);
                        webView.setVisibility(View.VISIBLE);
                        webView.getSettings().setJavaScriptEnabled(true);
                        webView.addJavascriptInterface(new JavaScriptInterface(getActivity()), "Android");
                        //  webView.loadUrl("file:///android_asset/upi.html");

                        InputStream is = null;
                        try {
                            is = getActivity().getAssets().open("upi.html");
                            int size = is.available();

                            // Read the entire asset into a local byte buffer.
                            byte[] buffer = new byte[size];
                            is.read(buffer);
                            is.close();

                            // Convert the buffer into a string.
                            String str = new String(buffer);
                            if (merchantId != null && reqData != null) {
                                //  Log.i("myLog", "BookAppointmentOnlineRes htmlContent strstrstrstrstr:" + str);
                                str = str.replace("M00", merchantId);
                                //    Log.i("myLog", "BookAppointmentOnlineRes htmlContent strstrstrstrstr111111111111111:" + str);
                                str = str.replace("android", reqData);
                                Log.i("myLog", "BookAppointmentOnlineRes htmlContent strstrstrstrstr after:" + str);
                                webView.loadDataWithBaseURL("file:///android_asset/upi.html", str, "text/html", "UTF-8", null);
                            }
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<BookAppointmentOnlineRes> call, Throwable t) {
                Log.i("myLog", "BookAppointmentOnlineRes response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void showUpiCashSelDialog() {
        String options[] = {"Online","Cash","UPI","Card","NEFT"};
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Select payment mode");
        builder.setItems(options, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {

                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date = new Date();
                String currDateTime = dateFormat.format(date);
                boolean isConnected = checkConnection();
                if (!isConnected)
                    showAlert(isConnected);
                else {
                    if (which == 0) {
                        OPHubUtils.showErrorDialog(getActivity(), "UPI is currently not available");
                        //  bookAppointmentOnline();
                    } else if (which == 1) {
                        bookAppointmentCash(shiftId, patientId, "Cash", currDateTime, globalShiftId);
                    }
                }
            }
        });
        builder.create().show();
    }

    private void showPaymentSelDialog() {
        String options[] = {"Online","Cash","UPI","Card","NEFT"};
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setTitle("Select payment mode");
        builder.setItems(options, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
                String currDateTime = dateFormat.format(new Date());

                switch (which) {
                    case 0: // Online
                        paymentMode = "online";
                        Intent intent = new Intent(getActivity(), RazorpayActivity.class);
                        try {
                            int finalAmount = (int) (netAmt * 100);
                            intent.putExtra("amount", String.valueOf(finalAmount));
                            intent.putExtra("name", "Plenome");
                            startActivityForResult(intent, PAYMENT_REQUEST_CODE);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        break;

                    case 1: // Cash
                        paymentMode = "cash";
                        rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, paymentMode);
                        break;

                    case 2: // UPI
                        paymentMode = "upi";
                        rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, paymentMode);
                        break;

                    case 3: // Card
                        paymentMode = "card";
                        rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, paymentMode);
                        break;

                    case 4: // NEFT
                        paymentMode = "neft";
                        rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, paymentMode);
                        break;

                    default:
                        break;
                }
            }
        });

        builder.create().show();
    }


    public void callCheckAppoinmentStatus() {
        HospitalDetailsResponse.CheckDuplicateAppointmentRequest req = new HospitalDetailsResponse.CheckDuplicateAppointmentRequest();
        req.setPatientId(patientId);
        req.setDoctor(doctorId);
        req.setDate(dateVal);
        req.setHospitalId(hospitalId);
        req.setShiftId(shiftId);

        Log.i("myLog", "message request  :  " + new Gson().toJson(req));

        Call<HospitalDetailsResponse.CheckDuplicateAppointmentResponse> call = services.checkDuplicateAppointment(req);
        call.enqueue(new Callback<HospitalDetailsResponse.CheckDuplicateAppointmentResponse>() {
            @Override
            public void onResponse(Call<HospitalDetailsResponse.CheckDuplicateAppointmentResponse> call, Response<HospitalDetailsResponse.CheckDuplicateAppointmentResponse> response) {
                try {
                    if (response.isSuccessful()) {

                        Boolean checkAppoinment = response.body().getIsDuplicateAppointment();
                        if (!checkAppoinment) {

                        }


                    } else {

                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<HospitalDetailsResponse.CheckDuplicateAppointmentResponse> call, Throwable t) {
                t.printStackTrace();
            }
        });


    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PAYMENT_REQUEST_CODE && resultCode == Activity.RESULT_OK && data != null) {
            razorpayPaymentID = data.getStringExtra("razorpayPaymentID");
            String status = data.getStringExtra("status");
            referenceNumber = data.getStringExtra("referenceNumber");

            if (status.equalsIgnoreCase("success")) {
                System.out.println("paymen success in fragment  " + razorpayPaymentID);
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                Date date = new Date();
                String currDateTime = dateFormat.format(date);
                rescheduleAppt(apptId, dateVal, timeVal, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, paymentMode);

            } else {
                System.out.println("payment failure in fragment");
                Toast.makeText(getContext(), "Payment Failed", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void viewApptInfo(String apptId) {
        Log.i("mylog", "viewApptInfo apptId:" + apptId);
        loaderOverlay.setVisibility(VISIBLE);
        Call<ViewApptInfoResponse> call = services.viewApptInfo(hospitalId, apptId);
        call.enqueue(new Callback<ViewApptInfoResponse>() {

            @Override
            public void onResponse(Call<ViewApptInfoResponse> call, Response<ViewApptInfoResponse> response) {
                try {
                    Log.i("myLog", "viewApptInfo response:");
                    Log.i("mylog", "viewApptInfo response:" + new Gson().toJson(response.body()));
                    loaderOverlay.setVisibility(GONE);
                    if (response.body() != null) {
                        Log.i("myLog", "viewApptInfo response isSuccess:" + response.body().toString());
                        ViewApptInfoResponse resp = response.body();
                        ViewApptInfoResponse.AppointmentDetails details = resp.getDetails();
                        if (details != null) {
                            name = details.getPatientName();
                            patientId = details.getPatientId();
                            age = details.getAge();
                            gender = details.getGender();
                            phone = details.getMobileno();
                            email = details.getEmail();
                            abhaNo = details.getAbhaNo();
                            docName = details.getDoctorName();
                            opdId = details.getOpdId();
                            Log.i("myLog", "opdId:" + opdId);
                            double netAm = details.getNetAmount();
                            payment = String.valueOf(netAm);
                            paymentStatus = details.getPaymentStatus();
                            abhaAddress = details.getAbhaAddress();
                            consultType = details.getConsultingType();
                            timeVal = details.getTime();
                            shiftId = details.getShiftId();
                            globalShiftId = details.getGlobalShiftId();
                            isTokenVerified = details.getIsTokenVerified();
                            patientChargeId = details.getPatientChargeId();
                            discount = details.getDiscount_amount();
                            discountPercent = details.getDiscount_percentage();
                            additChargeNotes = details.getAdditional_charge_note();
                            additCharges = details.getAdditional_charge();
                            consultFees = details.getConsultFees();
                            taxAmount = details.getTaxAmount();
                            netAmt = details.getNetAmount();
                            Log.i("myLog", " viewApptInfo netAmt:" + netAmt);

                            lytBookAppointment.setVisibility(GONE);
                            btnApprove.setVisibility(GONE);
                            btnCancels.setVisibility(GONE);
                            txtEdit.setVisibility(GONE);
                            btnConfirmAppt.setVisibility(GONE);
                            txtConsultType.setVisibility(VISIBLE);
                            if (isTokenVerified == 0) {
                                btnStartConsultation.setVisibility(View.VISIBLE);
                            } else if (isTokenVerified == 1) {
                                if (RPT.equalsIgnoreCase("REPORT")){
                                    btnTokenVerified.setVisibility(GONE);

                                }else {
                                    btnTokenVerified.setVisibility(View.VISIBLE);

                                }
                            }

                            double taxPercent = details.getTaxPercentage();
                            txtAge.setText(age + " Years");
                            txtName.setText(name);
                            txtGender.setText(gender);
                            txtPhone.setText("+ 91 " + phone);
                            txtEmail.setText(email);
                            if (abhaAddress == null || abhaAddress.isEmpty())
                                abhaAddress = "-";

                            txtAbhaAddress.setText(abhaAddress);
                            if (docName != null && docName != "")
                                txtDocName.setText(docName);
                            else
                                txtDocName.setText(R.string.doctor_not_assigned);
                            txtID.setText(String.valueOf(patientId));
                            txtConsultType.setText(consultType);
                            if (!details.getAppointment_id().isEmpty() && details.getAppointment_id() != null) {
                                txtApptNo.setText("Appointment No : " + details.getAppointment_id());
                            }
                            dateDisplay = details.getAppointmentDate();
                            dateVal = details.getDate();
                            Log.i("myLog", "Date val:" + dateVal + "  dateDisplay:" + dateDisplay);
                            doctorId = details.getDoctorId();
                            Log.i("myLog", "doctor id:" + doctorId);
                            txtApptDate.setText(dateDisplay);
                            txtTaxPercent.setText(taxPercent + "%");
                            taxPercentage = taxPercent;
                            docSlot = details.getSlot();
                            apptStatusId = details.getApptStatusId();
                            token = details.getToken();
                            if (token == null || token.length() == 0)
                                token = "-";
                            txtTokenNo.setText(token);

                            txtConsultFee.setText(getString(R.string.rs) + " " + df.format(consultFees));
                            txtTax.setText("\u20B9 " + df.format(taxAmount));
                            txtTotAmt.setText("\u20B9 " + df.format(netAmt));
                            txtAmount.setText("\u20B9 " + df.format(netAmt));
                            txtPaymentId.setText(details.getTransactionID());
                            txtPaymentMode.setText(details.getPayment_mode());

                            txtDiscount.setText(" - \u20B9 " + df.format(discount));
                            txtDiscountPercent.setText(discountPercent + "%");
                            if (additChargeNotes != null)
                                txtAdditChargeNotes.setText(additChargeNotes);
                            txtAdditionalCharges.setText("\u20B9 " + df.format(additCharges));

                            double subtotal = consultFees + additCharges - discount;
                            txtSubTotal.setText("\u20B9 " + df.format(subtotal));
                            txtSlotTime.setText(docSlot);
                            if (details.getDoctorSpecialist() != null && details.getDoctorSpecialist() != "" && details.getDoctorSpecialist() != "-") {
                                txtSpeciality.setText(details.getDoctorSpecialist());
                            } else {
                                txtSpeciality.setText("");
                                txtSpeciality.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.rounded_rectangle_white));
                            }
                            apptStatus = details.getAppointment_status();
                            txtStatus.setText(apptStatus);
                            System.out.println("print appstatus " + apptStatus);
                            if (apptStatus.equalsIgnoreCase("Requested") || apptStatus.equalsIgnoreCase("Reserved") ||
                                    apptStatus.equalsIgnoreCase("Cancelled") || apptStatus.equalsIgnoreCase("Completed")) {
                                int[] positionsToHide = {6, 5, 4, 3, 2}; // Specify the positions you want to hide
                                for (int position : positionsToHide) {
                                    if (position < mainTabLayout.getTabCount()) {
                                        TabLayout.Tab tabToHide = mainTabLayout.getTabAt(position);
                                        if (tabToHide != null && tabToHide.view != null) {
                                            // Set the tab's view to GONE
                                            tabToHide.view.setVisibility(View.GONE);
                                        }
                                    }
                                }
                                System.out.println("Apooinmeni id" + details.getAppointment_id());
                            } else if (apptStatus.equalsIgnoreCase("Approved")) {
                                int[] positionsToHide = {6, 5, 4, 3, 2, 1}; // Specify the positions you want to hide
                                for (int position : positionsToHide) {
                                    if (position < mainTabLayout.getTabCount()) {
                                        TabLayout.Tab tabToHide = mainTabLayout.getTabAt(position);
                                        if (tabToHide != null && tabToHide.view != null) {
                                            // Set the tab's view to GONE
                                            if (position == 1) {
                                                tabToHide.view.setVisibility(VISIBLE);
                                            } else {
                                                tabToHide.view.setVisibility(View.GONE);
                                            }
                                        }
                                    }
                                }
                            } else {
                                System.out.println("checkRole"+roleName);
                                int[] positionsToHide = {6, 5, 4, 3, 2, 1, 0}; // Specify the positions you want to hide
                                for (int i = 0; i <= mainTabLayout.getTabCount(); i++) {
                                    TabLayout.Tab tab = mainTabLayout.getTabAt(i);
                                    if (tab != null && tab.view != null) {
                                        if (roleName.equalsIgnoreCase("Doctor") || roleName.equalsIgnoreCase("Super Admin") || roleName.equalsIgnoreCase("Admin")|| roleName.equalsIgnoreCase("Nurse")) {
                                            if (i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5) {
                                                tab.view.setVisibility(View.VISIBLE);
                                            } else {
                                                tab.view.setVisibility(View.GONE);
                                            }
                                        }  else if (roleName.equalsIgnoreCase("Receptionist")) {
                                            if (i == 0 || i == 1 || i == 5 ) {
                                                tab.view.setVisibility(View.VISIBLE);
                                            } else {
                                                tab.view.setVisibility(View.GONE);
                                            }
                                        }

    //                                    if (i ==0 || i == 1 || i == 6) {


                                    /*        if (i ==0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5) {
                                            tab.view.setVisibility(View.VISIBLE);
                                        } else {
                                            tab.view.setVisibility(View.GONE);
                                        }*/
                                    }
                                }
                            }

                            String colorCode = details.getColor_code();
                            if (colorCode != null && !colorCode.isEmpty()) {
                                Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.rounded_approved_bg);
                                GradientDrawable gradientDrawable = (GradientDrawable) drawable;
                                gradientDrawable.setColor(Color.parseColor(colorCode));
                                txtStatus.setBackground(gradientDrawable);
                                txtStatus.setTextColor(Color.WHITE);
                            }
                            String paymentStatus = details.getPaymentStatus();
                            String doctor = details.getDoctorName();
                            if (fromScreen.equalsIgnoreCase("Main"))
                                dateComparison();
                            Log.i("myLog", "Appt status11111111:" + apptStatus + " apptStatusId: " + apptStatusId);
                            if (apptStatus != null) {
                                txtStatus.setText(apptStatus);
                                if (paymentStatus.equalsIgnoreCase("Payment done.")) {
                                    linearPaymentDone.setVisibility(View.VISIBLE);
                                    linearPaymentNotDone.setVisibility(GONE);
                                    txtEdit.setVisibility(GONE);
                                    btnPayment.setVisibility(GONE);
                                } else {
                                    linearPaymentDone.setVisibility(GONE);
                                    linearPaymentNotDone.setVisibility(View.VISIBLE);
                                    txtEdit.setVisibility(GONE);
                                    btnPayment.setVisibility(VISIBLE);
                                    if (apptStatus.equalsIgnoreCase("Cancelled") || apptStatus.equalsIgnoreCase("Completed")) {
                                        txtEdit.setVisibility(GONE);
                                    } else {
                                        txtEdit.setVisibility(VISIBLE);
                                    }
                                }
                                if (apptStatus.equalsIgnoreCase("Requested")) {
                                    btnStartConsultation.setVisibility(View.VISIBLE);
                                    btnCloseConsultation.setVisibility(GONE);
                                    btnSelectDoctor.setVisibility(View.VISIBLE);
                                    txtPaymentDet.setVisibility(GONE);
                                    linearPaymentDone.setVisibility(GONE);
                                    linearPaymentNotDone.setVisibility(GONE);
                                    txtEdit.setVisibility(GONE);
                                    linearPaymentOption.setVisibility(GONE);
                                    btnTokenPreview.setVisibility(GONE);
                                } else if (apptStatus.equalsIgnoreCase("Reserved")) {
                                    btnStartConsultation.setVisibility(View.VISIBLE);
                                    btnCloseConsultation.setVisibility(GONE);
                                    btnSelectDoctor.setVisibility(GONE);
                                    txtPaymentDet.setVisibility(View.VISIBLE);
                                    linearPaymentOption.setVisibility(GONE);
                                    linearPaymentNotDone.setVisibility(GONE);
                                    linearPaymentDone.setVisibility(VISIBLE);
                                    btnTokenPreview.setVisibility(VISIBLE);
                                    txtEdit.setVisibility(GONE);
                                    lytBookAppointment.setVisibility(VISIBLE);
                                    if (apptId == null || apptId.isEmpty()) {
                                        btnConfirmAppt.setVisibility(VISIBLE);
                                    } else {
                                        btnApprove.setVisibility(VISIBLE);
                                        btnCancels.setVisibility(VISIBLE);
                                    }
                                    if (paymentStatus.equalsIgnoreCase("Need payment.")) {
                                        btnPayment.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.rounded_rectangle_blue));
                                        btnPayment.setTextColor(Color.WHITE);
                                        btnStartConsultation.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.rounded_rectangle_blue_outline));
                                        btnStartConsultation.setTextColor(ContextCompat.getColor(getActivity(), R.color.blue_text));
                                    } else {

                                        btnStartConsultation.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.rounded_rectangle_blue));
                                        btnStartConsultation.setTextColor(ContextCompat.getColor(getActivity(), R.color.white));
                                    }

                                } else if (apptStatus.equalsIgnoreCase("Approved")) {
                                    btnCloseConsultation.setVisibility(GONE);
                                    btnSelectDoctor.setVisibility(GONE);
                                    txtPaymentDet.setVisibility(View.VISIBLE);
                                    linearPaymentOption.setVisibility(VISIBLE);
                                    txtEdit.setVisibility(GONE);
                                    btnTokenPreview.setVisibility(VISIBLE);
                                    if (isTokenVerified == 0) {
                                        btnStartConsultation.setVisibility(View.VISIBLE);
                                    } else if (isTokenVerified == 1) {
                                        btnStartConsultation.setVisibility(GONE);
                                    }
                                    if (roleName.equalsIgnoreCase("Doctor")||roleName.equalsIgnoreCase("Admin") || roleName.equalsIgnoreCase("super admin")) {
                                        btnStartConsultation.setVisibility(VISIBLE);
                                        if (isTokenVerified == 1) {
                                            btnStartConsultation.setVisibility(GONE);
                                        }
                                    } else if (roleName.equalsIgnoreCase("Nurse")) {
                                        btnStartConsultation.setVisibility(GONE);
                                    }
                                } else if (apptStatus.equalsIgnoreCase("Cancelled") || apptStatus.equalsIgnoreCase("Completed")) {
                                    Log.i("mylog", "app status cancelled");
                                    btnSelectDoctor.setVisibility(GONE);
                                    txtPaymentDet.setVisibility(View.VISIBLE);
                                    txtEdit.setVisibility(GONE);
                                    btnTokenPreview.setVisibility(GONE);
                                    btnSelectDoctor.setVisibility(GONE);
                                    linearPaymentOption.setVisibility(GONE);
                                } else {
                                    Log.i("myLog", "elseeeeeeeee");
                                    btnSelectDoctor.setVisibility(GONE);
                                    txtPaymentDet.setVisibility(View.VISIBLE);
                                    btnStartConsultation.setVisibility(GONE);
//                                    if (roleName.equalsIgnoreCase("Doctor")||roleName.equalsIgnoreCase("admin")||roleName.equalsIgnoreCase("super admin")|| roleName.equalsIgnoreCase("Nurse")) {
//                                        btnCloseConsultation.setVisibility(View.VISIBLE);
//                                    }
                                    linearPaymentOption.setVisibility(VISIBLE);
    //                                txtEdit.setVisibility(VISIBLE);
                                    btnTokenPreview.setVisibility(VISIBLE);
                                    btnPayment.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.rounded_rectangle_blue));
                                    btnPayment.setTextColor(Color.WHITE);

                                }
                                if (paymentStatus.equalsIgnoreCase("Payment done.")) {
                                    linearPaymentDone.setVisibility(View.VISIBLE);
                                    linearPaymentNotDone.setVisibility(GONE);
                                    txtEdit.setVisibility(GONE);
                                    btnPayment.setVisibility(GONE);
                                } else {
                                    linearPaymentDone.setVisibility(GONE);
                                    linearPaymentNotDone.setVisibility(View.VISIBLE);
                                    btnPayment.setVisibility(VISIBLE);
                                    if (apptStatus.equalsIgnoreCase("InProcess") || apptStatus.equalsIgnoreCase("In Process") ) {
                                        txtEdit.setVisibility(VISIBLE);
                                    } else {
                                        txtEdit.setVisibility(GONE);
                                    }
                                }

                            }

                            if ((fromScreen.equalsIgnoreCase("Appointment") || fromScreen.equalsIgnoreCase("Main")) && fromTab != null && fromTab.equalsIgnoreCase("History")) {
                                Log.i("myLog", "from screen appt:");
                                btnSelectDoctor.setVisibility(GONE);
                                btnStartConsultation.setVisibility(GONE);
                                btnCloseConsultation.setVisibility(GONE);
                                txtEdit.setVisibility(GONE);
                                btnPayment.setVisibility(GONE);
                                lytBookAppointment.setVisibility(GONE);
                                btnConfirmAppt.setVisibility(GONE);
                                txtConsultType.setVisibility(VISIBLE);
                                btnTokenPreview.setVisibility(GONE);
                                if (paymentStatus.equalsIgnoreCase("Payment done.")) {
                                    linearPaymentDone.setVisibility(View.VISIBLE);
                                    linearPaymentNotDone.setVisibility(GONE);
                                    txtEdit.setVisibility(GONE);
                                } else {
                                    linearPaymentDone.setVisibility(GONE);
                                    linearPaymentNotDone.setVisibility(View.VISIBLE);
                                    if (apptStatus.equalsIgnoreCase("Cancelled") || apptStatus.equalsIgnoreCase("Completed")) {
                                        txtEdit.setVisibility(GONE);
                                    } else {
                                        txtEdit.setVisibility(VISIBLE);
                                    }

                                    linearPaymentOption.setVisibility(GONE);
                                }

                            }
                            if (fromScreen.equalsIgnoreCase("Main_UPI"))
                                showTokenDialog();
                            linearPayBook.setVisibility(GONE);
                            if (progressBar.getVisibility() == View.VISIBLE)
                                progressBar.setVisibility(View.GONE);
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
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //   call.clone().enqueue(this);
            }
        });
    }

    private void rescheduleAppt(String apptId, String date, String time, int doctorId,
                                int shiftId, int globalShiftId, String status, String apptStatusId, String currTime, String
                                        paymentMode) {
//        progressBar.setVisibility(View.VISIBLE);
        Log.i("mylog", "rescheduleAppt apptid::" + apptId + "    hosp_id:" + hospitalId + "   status:" + status);
        OPHubRequests.RescheduleApptReq request = new OPHubRequests.RescheduleApptReq();
        request.setDate(date);
        //  String[] timeArr = time.split(" - ");
        //request.setTime(timeArr[0]);
        request.setTime(time);
        request.setHospId(hospitalId);
        request.setDoctorId(doctorId);
        request.setShiftId(shiftId);
        request.setLive_consult("no");
        request.setApptStatus(status);
        request.setGlobal_shift_id(globalShiftId);
        request.setApptStatusId(apptStatusId);
        request.setPaymentMode(paymentMode);
        request.setPaymentDate(currTime);
        request.setReceivedByName(OPHubApplication.getStaffName());
        Log.i("mylog", "rescheduleAppt request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.rescheduleAppointment(apptId, request);
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    Log.i("myLog", "rescheduleAppt response:");
                    Log.i("mylog", "rescheduleAppt response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "rescheduleAppt response isSuccess:" + response.body().toString());
                        List<OPHubResponse.UpdateApptStatusResponse> list = response.body();
                        OPHubResponse.UpdateApptStatusResponse res = list.get(0);
                        String status = res.getStatus();
                        String message = res.getMessage();
                        Log.i("myLog", "status:" + status);
                        Log.i("myLog", "message:" + message);
                        //  Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                        if (status != null && status.equalsIgnoreCase("Success")) {
                            //  if (fromScreen.equalsIgnoreCase("Tracking")) {
                            if (dialogReschedule != null && dialogReschedule.isShowing())
                                dialogReschedule.dismiss();
                            //   showSuccessDialog(message, "Reschedule_Appt");
                            if (paymentMode.equalsIgnoreCase("online")) {
                                callAfterPayment(res.getTxnId().toString());
                            } else {
                                mainTabLayout.getTabAt(0).select();
                                viewApptInfo(apptId);
                            }


                        } else
                            OPHubUtils.showErrorDialog(getActivity(), message);

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                    if (progressBar.getVisibility() == View.VISIBLE)
                        progressBar.setVisibility(View.GONE);
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Throwable t) {
                Log.i("myLog", "rescheduleAppt response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());


                    progressBar.setVisibility(View.GONE);
            }
        });


    }

    public void callAfterPayment(String trnxId) {
        HospitalDetailsResponse.AfterPaymentModel req = new HospitalDetailsResponse.AfterPaymentModel();
        req.setHospitalId(hospitalId);
        req.setPaymentReferenceNumber(referenceNumber);
        req.setPaymentId(razorpayPaymentID);
        req.setPaymentGateway("razorpay");


        Call<HospitalDetailsResponse.AfterPaymentModel> call = services.afterPayment(req, Integer.valueOf(trnxId));
        call.enqueue(new Callback<HospitalDetailsResponse.AfterPaymentModel>() {
            @Override
            public void onResponse(Call<HospitalDetailsResponse.AfterPaymentModel> call, Response<HospitalDetailsResponse.AfterPaymentModel> response) {
                try {
                    if (response.isSuccessful()) {
                        mainTabLayout.getTabAt(0).select();
                        viewApptInfo(apptId);
                    } else {

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<HospitalDetailsResponse.AfterPaymentModel> call, Throwable t) {
                t.printStackTrace();
            }
        });


    }


    private void tokenVerify() {
        Log.i("mylog", "tokenVerify");
//        progressBar.setVisibility(VISIBLE);
        loaderOverlay.setVisibility(VISIBLE);
        Call<OPHubResponse.UpdateApptStatusResponse> call = services.verifyToken(hospitalId, apptId);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {
                try {
                    Log.i("myLog", "tokenVerify response:");
                    Log.i("mylog", "tokenVerify response:" + new Gson().toJson(response.body()));
                    loaderOverlay.setVisibility(GONE);
                    if (response.body() != null) {
                        Log.i("myLog", "tokenVerify response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String status = resp.getStatus();
                        String message = resp.getMessage();
                        if (status != null && status.equalsIgnoreCase("success")) {
                            btnTokenVerified.setVisibility(View.VISIBLE);
                            btnStartConsultation.setVisibility(GONE);
                            // showSuccessDialog(getString(R.string.consultStartSuccess), "Token_Verify");
                            viewApptInfo(apptId);
                        } else {
                            OPHubUtils.showUnknownErrorDialog(getActivity());
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }

                    if (progressBar.getVisibility() == View.VISIBLE)
                        progressBar.setVisibility(View.GONE);
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "tokenVerify response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());

                    progressBar.setVisibility(View.GONE);
            }
        });

    }

    private void closeConsultation() {
        Log.i("mylog", "closeConsultation");
        Call<OPHubResponse.UpdateApptStatusResponse> call = services.closeConsultation(hospitalId, apptId);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {
                try {
                    Log.i("myLog", "closeConsultation response:");
                    Log.i("mylog", "closeConsultation response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "closeConsultation response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String status = resp.getStatus();
                        String message = resp.getMessage();
                        if (status != null && status.equalsIgnoreCase("success")) {
                            // Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                            // gotoAppointmentFragment();
                            viewApptInfo(apptId);
                            if (dialogConfirmation.isShowing())
                                dialogConfirmation.dismiss();
                            //   showSuccessDialog(message, "Close_Appt");
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "closeConsultation response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
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
    private void getAppointmentStatus(String hospId, String option) {
        Log.i("myLog", "getAppointmentStatus hospId:" + hospId);
        services.getAppointmentStatus(hospId).enqueue(new Callback<List<GetAppointmentStatusResponse>>() {

            @Override
            public void onResponse(Call<List<GetAppointmentStatusResponse>> call, Response<List<GetAppointmentStatusResponse>> response) {
                try {
                    //Log.i("myLog", "getAppointmentStatus onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetAppointmentStatusResponse> list = response.body();
                        int size = list.size();
                        status = new ArrayList<>();
                        statusId = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            GetAppointmentStatusResponse resp = list.get(start);
                            status.add(resp.getStatus());
                            statusId.add(resp.getId());
                        }
                        if (option.equalsIgnoreCase("reschedule")) {
                            if (spinStatus != null)
                                OPHubUtils.addProdTypeSpinner(getActivity(), status, spinStatus, "Select status");
                        }


                    } /*else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }*/
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<GetAppointmentStatusResponse>> call, Throwable t) {
                //Log.i("myLog", "getAppointmentStatus onFailure:" + t.getMessage());
                // OPHubUtils.showUnknownErrorDialog(getActivity());
                call.clone().enqueue(this);
            }

        });
    }

    public void showSuccessDialog(String msg, String option) {
        dialogSuccess = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.activity_change_pwd_success, null);
        dialogSuccess.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogSuccess.getWindow().setGravity(Gravity.CENTER);
        TextView txtMsg = dialogSuccess.findViewById(R.id.txtSuccess);
        txtMsg.setText(msg);
        dialogSuccess.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSuccess.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(550);
        dialogSuccess.getWindow().setAttributes(lp);
        dialogSuccess.getWindow().setBackgroundDrawable(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_white));
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    dialogSuccess.dismiss();
                    if (option.equalsIgnoreCase("New_Appt"))
                        showTokenDialog();

                } catch (Exception ex) {
                    Log.i("myLog", "exception ex:" + ex.toString());
                }

            }
        }, 3000);

    }

    public void showTokenDialog() {
        if (ContextCompat.checkSelfPermission(getActivity(), Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(getActivity(),
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE,
                            Manifest.permission.READ_EXTERNAL_STORAGE, Manifest.permission.MOUNT_UNMOUNT_FILESYSTEMS}, 0);
        }

        dialogToken = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.fragment_appointment_token, null);
        dialogToken.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogToken.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogToken.findViewById(R.id.cancel_button);
        Button btnPrint = dialogToken.findViewById(R.id.print_button);
        TextView txtHospName = dialogToken.findViewById(R.id.plenome);
        TextView txtHospAddr = dialogToken.findViewById(R.id.address);

        TextView txtApptId = dialogToken.findViewById(R.id.txtApptNo);
        TextView txtDocName = dialogToken.findViewById(R.id.doctorName);
        TextView txtTokenNo = dialogToken.findViewById(R.id.token);
        TextView txtPatientName = dialogToken.findViewById(R.id.txtName);
        TextView txtSlotDate = dialogToken.findViewById(R.id.txtSlotDate);
        TextView txtSlotTime = dialogToken.findViewById(R.id.txtSlotTime);
        imgQR = dialogToken.findViewById(R.id.imgQR);
        txtApptId.setText(apptId);
        txtDocName.setText(docName);
        if (token == null || token.length() == 0)
            token = "-";

        txtTokenNo.setText("Token Number : " + token);
        txtPatientName.setText(name);
        txtSlotDate.setText(dateDisplay);
        txtSlotTime.setText(docSlot);
        hospAddr = OPHubApplication.getHospitalAddress();
        hospName = OPHubApplication.getHospitalName();
        txtHospName.setText(hospName);
        txtHospAddr.setText(hospAddr);
        initView();
        if (mIminPrintUtils == null) {
            mIminPrintUtils = IminPrintUtils.getInstance(getActivity());
        }
        mIminPrintUtils.resetDevice();

        getQRInfo();
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogToken.dismiss();
            }
        });

        btnPrint.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.USB);
                int status = mIminPrintUtils.getPrinterStatus(IminPrintUtils.PrintConnectType.USB);
                if (status == 1 || status == -1) {
                    OPHubUtils.showErrorDialog(getActivity(), "The printer is not connected or powered on");
                    return;
                } else if (status == 3) {
                    OPHubUtils.showErrorDialog(getActivity(), "Print head open");
                    return;
                } else if (status == 7) {
                    OPHubUtils.showErrorDialog(getActivity(), "No paper feed");
                    return;
                } else if (status == 8) {
                    OPHubUtils.showErrorDialog(getActivity(), "Paper running out");
                    return;
                }
                callPrinter();
                dialogToken.dismiss();
            }
        });
        dialogToken.show();
    }

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


        String datas = "CgobMwAbKiEAAf////////////////////gAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAD/gAD/gAD/gAD/gAAfgAAfgAA/gAB/gAD/gAD/gAH/gAH/gAH/gAH/gBP/gH//gH//gH//gDv/gAH/gAH/gAH/gAH/gAD/gAD/gAB/gAB/gAA/gAAfgAA/gAD/gAD/gAD/gAB/gAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAP///////////////////wobKiEAAf///////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAH4AAH4AADwAAf8AD//4f//5/////////H4/8H4PwDwP4H4P8H4P+Dwc/Dw4f37wP//wD//wB//oj4H//wD//wD//wD//4HwB8PgD//wH//4P//4fn58/Dw/+Dwf4H4P4DwP4DwP8H4P/n55///4///wP//wB//gADwAADwAAH4AAH4AABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///x///x///x///x///x/gAB/wAB//gB///AH//wAf/wAA/wAAPwAA/wAf/wP//x///B//gB/wAB/4AB///x///x///x///x///wAAAAAAAAAAABAAABwAAB4AAB+AAB/gAB/4AB/8AB//AAP/gAH//wB//wAf/wAf/wA//wD//wP/wA//AB/8AB/4AB/gAB+AAB4AABwAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///x///x///x///x///x///x///wAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAQAAAAAAAAADwAA//AD//wP//wf//wf//w///w/wDx/AAx+AAR8AAB8AAB8AAB8AAB+AAR+AAR/gBw///w///wf//wP//wH//wD//wAP8AAAAAAAAAAAAAAAAAA//AD//wH//wf//wf//w///w/4Hx/AAx+AAR+AAR8AAB8AAB8B8B8B8B+B8B/h8R/x8Q/x/w/h/wfh/wPB/wDB/wAB/wAAAAAAAAAAAAAAAAA//AD//wP//wf//wf//w///w/4Hx/gAx+AAR8AAB8AAB8AAB8AAB8AAB+AAR/gBw/8Pw///wf//wf//wH//wD//wA//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////////wobKiEAAf///////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOHwAPnwAP/wAP/wAP+AAD+AAH/AAP/gAP/wAPPwAOH4AMD4AAD4AAD4ABH8gP//4P//4P//4L/9wAD4AAD4AID4AMH4AOHwAPPwAP/gAH/gAH/AAH+AAP/AAP/wAPnwAPHwAIDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAAAAAAAAAAAAAAAAAMAAAPgAAPgAAPgAAPgAAPgAAMAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAAgAAAAAAAAAAAAAAAAAAAAAAMAAAOAAAOAAAPAAAPAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPAAAPAAAOAAAMAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAOAAAOAAAPAAAPAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPAAAPAAAPAAAOAAAOAAAMAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAOAAAOAAAPAAAPAAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPAAAPAAAOAAAOAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////////////////wobKiEAAf8AAP8AAP8AAP8AAP8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAB8AAP8AAP8AAP8AAP8AAP8AAAobMgoKCh0hABthAdXiysex6s231eLKx7HqzbcKHSEAG2EByP3J7rn6vMoKHSEAG2EB1eK49srHw8W16rXY1rcKHSEAG2EBVEVMOiAxMzUyMjIyMjExMSAKHSEAG2EBR1NUIDogMjAyMjgxMjNGCh0hABthADIwMjItMDYtMjQgMTQ6MzM6MTIKHSEAG2EAQ0FTSElFUjogemVuZ2xpbmd5dWFuQHNob3BsaW5lYXBwLmNvbQodIQAbYQBPUkRFUjogMTEzOAodIQAbYQBSRUNFSVBUIE5PIDogMDAxNjkKG2EBLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLQobYQA5OTkgwLbJq8Wj19CzpNDkzPXOxsnP0sIgKMC2yasgLyBNKQoKICAgICAgVEhCMC4wMCoxICAgICAgICBUSEIwLjAwChthAS0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0KClNVQiBUT1RBTCAgICAgICAgICAgICAgICBUSEIwLjAwCkRJU0NPVU5UICAgICAgICAgICAgICAgICBUSEIwLjAwCklOQ0xVREUgR1NUIDEyJSAgICAgICAgICBUSEIwLjAwClRPVEFMKFFUWSAxIFBJQ1MpICAgICAgICBUSEIwLjAwChthAS0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0gLSAtIC0KHSEAG2EB1eLKx7j2uau45tXiyse49rmruObV4srHuPa5q7jm1eLKx7j2uau45tXiyscKGzMAGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/8AD/8AD/8AD/8AD/8AD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD/8AD/8AD/8AD/8AD/8AD/8AAAAAAAAAAAAAAAAAAAAAAAAAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAAD8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAD4AAD4AAD4AAD4AAAAAAAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAH8AAD4AAAAAAAAAAAAAAAAAAAAAAAAAD/8AD/8AD/8AD/8AD/8AD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/8AD/8AD/8AD/8AD/8AD/8AD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD4AAD/8AD/8AD/8AD/8AD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAD//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8AAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAD8AAD8AAD8AAD8AAD8AAD8AD//8D//8D//8D//8D//8D//8AD8D8D8D8D8D8D8D8D8D8D8D////////////////////////////////////////////////8D8D8D8D8D8D8D8D8D8D8D8D8D8AAD8AAD8AAD8AAD8AAD8AAH8AD///////////////////////8D//8D//8D//8D//8D//8D//8AAD8AAD8AAD8AAD8AAD8AAD8AD8AAD8AAD8AAD8AAD8AAD8D8D//4D//4D//4D//4D//8D/8D8D8D8D8D8D8D8D8D8D8D8D8AAAAAAAAAAAAAAAAAAAAAAAD///////////////////////8AAAAAAAAAAAAAAAAAAAAAAAD//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8D//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D8D8D8D8D8D8D8D8D8D8AAD8AD/8AD/8AD/8AD/8AD/8AD/8D//8D//8D//8D//8D//8D//8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8AAAD8AAD8AAD8AAD8AAD8AAD/8D//8D//8D//8D//8D//8D/8D8AAD8AAD8AAD8AAD8AAD8AD//8D//8D//8D//8D//8D//8AAAAAAAAAAAAAAAAAAAAAAAAD///////////////////////8AD8AAD8AAD8AAD8AAD8AAD8AAD8D8D//8D//8D//8D//8D/8AAD8D8D8D8D8D8D8D8D8D8D8D8D/8D8D8D8D8D8D8D8D8D8D8D8AD8AAD8AAD8AAD8AAD8AAD8AD///////////////////////8AAD8AAD8AAD8AAD8AAD8AAD///8D//8D//8D//8D//8D//8AAD/8AD/8AD/8AD/8AD/8AD//8AD/8AD/8AD/8AD/8AD/8AD/8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D//8D//8D//8D//8D//8D//8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D//8D//8D//8D//8D/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AB/8AD/8AD/8AD/8AD/8AD/8AB/8AAD8AAD8AAD8AAD8AAD8AAD//8D//8D//8D//8D//8D//8D/8AD/8AD/8AD/8AD/8AD/8AAD8AAD8AAD8AAD8AAD8AAD8AD8D8D8D8D8D8D8D8D8D8D8D8AD8AAD8AAD8AAD8AAD8AAD8AD///////////////////////8AD8AAD8AAD8AAD8AAD8AAB8AD/8AD/8AD/8AD/8AD/8AD/8D8D//8D//8D//8D//8D//8D/8AD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8D8D8D8D8D8D8D8D8D8D8D8D8D//8D//8D//8D//8D//8D//8AD/8AD/8AD/8AD/8AD/8AD/8D/8D//8D//8D//8D//8D//8D/8D8D8D8D8D8D8D8D8D8D8D8AAD8AAD8AAD8AAD8AAD8AAD8AD8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D8D//8D//8D//8D//8D//8D//8AD/8AD/8AD/8AD/8AD/8AD/8D8AAD8AAD8AAD8AAD8AAD8AD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD8AAD/8B//8D//8D//8D//8D//8D//8D/8AD/8AD/8AD/8AD/8AD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8B/98B/98B/98B/98B/8AB/8AB/8AB/8AB/8AB/8AB/8AB/98AB98AB98AB98AB98AB98AB8B+B8B+B8B+B8B+B8B+B8B+B98B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+B8B+D8B+D8B+D8B+D8B+D8B+D8B+B/+AB/+AB/+AB/+AB/+AB/+AAAB8AAB+AAB+AAB+AAB+AAB+AAAB8AAB8AAB8AAB8AAB+AAB8AB8AAB+AAB+AAB+AAB+AAB+AB+AAB+AAB+AAB+AAB+AAB+AAD+AB/+AB/+AB/+AB/+AB/+AAAAAAAB/8AB/8AB/8AB/8AB/8AB/8D/8AB/+AB/+AB/+AB/+AB/8D8AAD8AAD8AAD8AAD8AAD8AAAAB/8AB/8AB/8AB/8AB/8AB/8AAAAAAAAAAAAAAAAAAAAAAACD/+AB/+AB/+AB/+AB/+AB/+AAB/8AB/8AB/8AB/8AB/8AB///////////////////////////+B//+B//+B//+B//+B//+B8AAAAAAAAAAAAAAAAAAAAAAAAAB/8AB/8AB/8AB/8AB/8AB/8AAB98AB98AB98AB98AB98AB//8B//+B//+B//+B//+B//+B//+B////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+B+B+B+B+B+B+B+B+B+AB+AAB+AAB+AAB+AAB+AAB+AAB+AD+B+D+B+D+B+D+B+D+B+D+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AACB/+CB/+CB/+CB/+CB/+CB/+B+B+B+B+B+B+B+B+B+B+B+B+AB+AAB+AAB+AAB+AAB+AAB+AAAAB8AAB8AAB8AAB8AAB8AAB9+AAB+AAB+AAB+AAB+AAB+AAAB+AAB+AAB+AAB+AAB+AAB+ACAAACAAACAAACAAACAAACAAAB8B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+AAB/+AB/+AB/+AB/+AB/+AAAAACAB+CAB+CAB+CAB+CAB+CAB+B+AAB+AAB+AAB+AAB+AAB+AAB/+AB/+AB/+AB/+AB/+AB/+AD+AB/+AB/+AB/+AB/+AB/+AB8B/+AB/+AB/+AB/+AB/+AB/+AB//8B//8B//8B//8B//8B///+B+D+B+D+B+D+B+D+B+D+B+CB/+CB/+CB/+CB/+CB/+CB/+D+B+D+B+D+B+D+B+D+B+D+B+B+B/9+B/9+B/9+B/9+B/9+B//+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD+AAD///////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB///9///9///9///9///9+AAB+AAB+AAB+AAB+AAB+AAB+AAB+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+B/9+AAB+AAB+AAB+AAB+AAB+AAB///9///9///9///9///9///8AAAAAAAAAAAAAAAAAAAAAAACB/+CB/+CB/+CB/+CB/+CB/+B//+B//+B//+B//+B//+B//+AAAB8AAB8AAB8AAB8AAB8AAB9/+B9/+B9/+B9/+B9/+B9/+B+AAB+AAB+AAB+AAB+AAB+AAB+B//+B//+B//+B//+B//+B//8B//8B//8B//8B//8B//8B//8AB+B+B+B+B+B+B+B+B+B+B+B+B+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+AAB+D+B+D+B+D+B+D+B+D+B+D+B+B+AAB+AAB+AAB+AAB+AAB+AAD///////////////////////8AB/8AB/8AB/8AB/8AB/8AB/9+B+B+B+B+B+B+B+B+B+B+B+AAB+AAB+AAB+AAB+AAB+AAB+D///////////////////////8AB+AAB+AAB+AAB+AAB+AAB+AAAAB+AAB+AAB+AAB+AAB+AAD//+D//+D//+D//+D//+D//+D//+D/+AD/+AD/+AD/+AD/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//+D//+D//+D//+D//+AAA+AAA+AAA+AAA+AAA+AAA+AAA+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+D+A+AAA+AAA+AAA+AAA+AAA+AAA+D//+D//+D//+D//+D//+D//+AAAAAAAAAAAAAAAAAAAAAAAAB+AAA+AAA+AAA+AAA+AAB+AAAAA+AAA+AAA+AAA+AAA+AAA+CB/+CB/+CB/+CB/+CB/+CB/+D+AAD+AAD+AAD+AAD+AAD+AAD//+D//+D//+D//+D//+D//+CB/ACB/ACB/ACB/ACB/ACB/ADAAAD+A+D+A+D+A+D+A+D+A+B/AAA//AA//AA//AA//AA//AA/+AA+A+A+A+A+A+A+A+B+A+A+A+AB/+AB/+AB/+AB/+AB/+AB/+AB+AAB/AAB/AAB/AAB/AAB/AB//+A//+A//+A//+A//+B//+CB/+CB/+CB/+CB/+CB/+CB/+CAA+CAA+CAA+CAA+CAA+CAA+AB/AAB/AAB/AAB/AAB/AAB/AB//AA//AA//AA//AA//AA//AD+A+D+A+D+A+D+A+D+A+D+A+AAA+AAA+AAA+AAA+AAA+AAA+AAAAB+AAA+AAA+AAA+AAB+AAAB/+AB/+AB/+AB/+AB/+AB/+AA/+B+A+A+A+A+A+A+A+B+A+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGyohyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKGzIKCgodIQAbYQHV4srHtv7OrMLrw+jK9tXiyse2/s6swuvD6Mr21eLKx7b+zqzC68PoyvbV4srHtv7OrMLrw+jK9iAKCgoKCgoKHVYA";
        content = Base64.decode(datas, Base64.DEFAULT);
    }

    private void callPrinter() {
        Log.i("myLog", "call printer");
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i("myLog", "call printer run :");

                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
                mIminPrintUtils.setTextTypeface(typeface);
                mIminPrintUtils.setTextSize(30);
                mIminPrintUtils.printText(hospName + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText(hospAddr);
                //    mIminPrintUtils.setQrCodeSize(100);
                bitmapQR = getBlackWhiteBitmap(bitmapQR);
                mIminPrintUtils.printSingleBitmap(bitmapQR, 1);
                mIminPrintUtils.printAndFeedPaper(5);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                mIminPrintUtils.printText("\t" + apptId + "\n");
                mIminPrintUtils.printText("\t" + docName + "\n");
                mIminPrintUtils.setTextSize(35);
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText("\t Token Number : " + token + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText("\t ------------------------------------------------");
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_NORMAL;
                mIminPrintUtils.printText("\t Patient Name   : " + name + "\n");
                mIminPrintUtils.printText("\t Slot Date           : " + dateDisplay + "\n");
                mIminPrintUtils.printText("\t Slot Time           : " + docSlot + "\n");

                //  mIminPrintUtils.printColumnsText(new String[]{"1", "iMin", "Plenome"}, new int[]{1, 2, 2}, new int[]{1, 0, 0}, new int[]{26, 26, 26});
                mIminPrintUtils.printAndFeedPaper(100);
                mIminPrintUtils.printAndLineFeed();
                mIminPrintUtils.fullCut();


                Log.i("myLog", "call printer run after print qr33333333:");
                Log.i("myLog", "call printer run end:");
            }
        });
        thread.start();
    }

    private void getQRInfo() {
        Log.i("mylog", "getTokenInfo apptId:" + apptId);
        Call<OPHubResponse.GetApptQRResponse> call = services.getApptQRDetails(hospitalId, apptId);
        call.enqueue(new Callback<OPHubResponse.GetApptQRResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.GetApptQRResponse> call, Response<OPHubResponse.GetApptQRResponse> response) {
                try {
                    Log.i("myLog", "getQRInfo response:");
                    Log.i("mylog", "getQRInfo response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "getQRInfo response isSuccess:" + response.body().toString());
                        OPHubResponse.GetApptQRResponse resp = response.body();
                        if (resp != null) {
                            //     List<ViewApptInfoResponse.AppointmentDetails> list = resp.getList();
                            //   Log.i("myLog", "list size>0" + list.size());
                            //   ViewApptInfoResponse.AppointmentDetails details = resp.getDetails();
                            Log.i("mylog", "getQRInfo response111111111111:" + new Gson().toJson(resp));

                            String qrJsonStr = new Gson().toJson(resp);
                            generateQR(qrJsonStr);
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.GetApptQRResponse> call, Throwable t) {
                Log.i("myLog", "getQRInfo response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

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

    private void getAppointmentTracking(int hospId, String apptId, String option) {
        Log.i("myLog", "getAppointmentTracking hospId:" + hospId);
        services.getAppointmentTracking(hospId, apptId).enqueue(new Callback<List<GetAppointmentStatusResponse>>() {

            @Override
            public void onResponse(Call<List<GetAppointmentStatusResponse>> call, Response<List<GetAppointmentStatusResponse>> response) {
                try {
                    Log.i("myLog", "getAppointmentTracking onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetAppointmentStatusResponse> list = response.body();
                        int size = list.size();
                        trackingStatus = new ArrayList<>();
                        trackingStatusId = new ArrayList<>();
                        trackingIsCompleted = new ArrayList<>();
                        Log.i("myLog", "b4 for");
                        int index = -1;
                        for (int start = 0; start < size; start++) {
                            GetAppointmentStatusResponse resp = list.get(start);
                            String state = resp.getStatus();
                            int id = resp.getId();
                            int isComp = resp.getIsCompleted();
                            trackingStatus.add(state);
                            trackingStatusId.add(id);
                            trackingIsCompleted.add(isComp);

                        }
                        Log.i("mylog", "trackingStatusId sizeeeeee:" + trackingStatusId.size());
                        if (apptStatus.equalsIgnoreCase("Cancelled"))
                            showProgress("Cancel");
                        else {
                            // if (option.equalsIgnoreCase("Update"))
                            showProgress("Main");
                        }
                        Log.i("myLog", "after if else");
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                    Log.i("myLog", "after ,,,,,,,");
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<GetAppointmentStatusResponse>> call, Throwable t) {
                Log.i("myLog", "getAppointmentTracking onFailure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void getConsultationProcess() {
        Log.i("myLog", "getConsultationProcess hospId:" + hospitalId);
        services.getConsultationStatus(hospitalId).enqueue(new Callback<List<ConsultationStatusResponse>>() {

            @Override
            public void onResponse(Call<List<ConsultationStatusResponse>> call, Response<List<ConsultationStatusResponse>> response) {
                try {
                    Log.i("myLog", "getConsultationProcess onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<ConsultationStatusResponse> list = response.body();
                        int size = list.size();
                        Log.i("myLog", "getConsultationProcess size:" + size);
                        consultProcessDate = new ArrayList<>();
                        consultProcessId = new ArrayList<>();
                        consultProcessDesc = new ArrayList<>();
                        consultProcessName = new ArrayList<>();
                        consultProcessDoctor = new ArrayList<>();
                        consultProcessColor = new ArrayList<>();
                        consultProcessStatus = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            Log.i("myLog", "getConsultationProcess index:" + start);
                            ConsultationStatusResponse resp = list.get(start);
                            consultProcessDate.add("-");
                            consultProcessName.add(resp.getProcess_name());
                            consultProcessId.add(resp.getId());
                            consultProcessDesc.add(resp.getProcess_description());
                            consultProcessDoctor.add("-");
                            consultProcessColor.add("");
                            consultProcessStatus.add("");

                        }
                        Log.i("myLog", "getConsultationProcess after for consultProcessName size:" + consultProcessName.size());
                        getConsultationTracking();
                        Log.i("myLog", "getConsultationProcess after recyclerview");
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<ConsultationStatusResponse>> call, Throwable t) {
                Log.i("myLog", "ConsultationStatusResponse onFailure:" + t.getMessage());
                //  OPHubUtils.showUnknownErrorDialog(getActivity());
                call.clone().enqueue(this);
            }

        });
    }


    private void getConsultationTracking() {
        Log.i("myLog", "getConsultationTracking hospId:" + hospitalId);
        //  apptId = "APPN635";
        services.getConsultationTracking(hospitalId, apptId).enqueue(new Callback<List<ConsultationTrackingResponse>>() {

            @Override
            public void onResponse(Call<List<ConsultationTrackingResponse>> call, Response<List<ConsultationTrackingResponse>> response) {
                try {
                    Log.i("myLog", "getConsultationTracking onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<ConsultationTrackingResponse> list = response.body();
                        int size = list.size();
                        Log.i("myLog", "getConsultationTracking size:" + size);
                        for (int start = 0; start < size; start++) {
                            Log.i("myLog", "getConsultationTracking index:" + start);
                            ConsultationTrackingResponse resp = list.get(start);
                            String processName = resp.getConsultProcessName();
                            Log.i("myLog", "getConsultationTracking processName:" + processName);
                            if (consultProcessName != null && consultProcessName.contains(processName)) {
                                Log.i("myLog", "matched ");
                                int index = consultProcessName.indexOf(processName);
                                consultProcessDate.remove(index);
                                consultProcessDate.add(index, resp.getTime());
                                consultProcessDoctor.remove(index);
                                consultProcessDoctor.add(index, resp.getDoctorName());
                                consultProcessColor.remove(index);
                                consultProcessColor.add(index, resp.getColorCode());
                                consultProcessStatus.remove(index);
                                consultProcessStatus.add(index, resp.getStatus());
                                consultProcessDesc.remove(index);
                                consultProcessDesc.add(index, resp.getDescription());
                            }

                        }
                        if (consultProcessName != null) {
                            Log.i("myLog", "getConsultationTracking after for consultProcessName size:" + consultProcessName.size());
                            ConsultationProcessAdapter adapter = new ConsultationProcessAdapter(getActivity(), consultProcessName, consultProcessDesc, consultProcessDate, consultProcessDoctor, consultProcessColor);
                            if (adapter != null) {
                                Log.i("myLog", " adapter !=null size:" + adapter.getItemCount());

                                // Setting Adapter to RecyclerView
                                recyclerView.setAdapter(adapter);
                                adapter.setOnClickListener(new ConsultationProcessAdapter.OnClickListener() {
                                    @Override
                                    public void onClick(int position, ArrayList<String> consultProcessName) {
                                        Log.i("myLog", "recycler view position:" + position);
                                        String name = consultProcessName.get(position);
                                        Log.i("myLog", "recycler view process Name:" + name);
                                        String desc = consultProcessDesc.get(position);
                                        int processId = consultProcessId.get(position);
                                        String status = consultProcessStatus.get(position);
                                        if (status.equalsIgnoreCase("Completed")) {
                                            OPHubUtils.showErrorDialog(getActivity(), "It is already completed!");
                                            return;
                                        }
                                        showChangeStatusDialog(desc, processId, status);

                                    }
                                });
                            }
                        }
                        Log.i("myLog", "getConsultationTrackingge after recyclerview");
                        //   showProgress();
                        if (progressBar.getVisibility() == View.VISIBLE)
                            progressBar.setVisibility(View.GONE);
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<ConsultationTrackingResponse>> call, Throwable t) {
                Log.i("myLog", "ConsultationStatusResponse onFailure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                call.clone().enqueue(this);

                    progressBar.setVisibility(View.GONE);
            }

        });
    }

    private void setFromDateCalender(String option, int doctorId) {
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
                        String selDate = year + "-" + month + "-" + day;
                        if (option.equalsIgnoreCase("from")) {
                            //   edtFromDate.setText(day + "-" + month + "-" + year);
                            edtFromDate.setText(year + "-" + month + "-" + day);
                        } else if (option.equalsIgnoreCase("to")) {
                            edtToDate.setText(year + "-" + month + "-" + day);
                            //     edtToDate.setText(day + "-" + month + "-" + year);
                        } else if (option.equalsIgnoreCase("reschedule_date")) {
                            edtDate.setText(year + "-" + month + "-" + day);
                            getDoctorSlot(selDate, doctorId);
                        }
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        //     datePickerDialog.setMin(c.getTimeInMillis());
        // at last we are calling show to
        // display our date picker dialog.
        //Get the DatePicker instance from DatePickerDialog
        DatePicker dp = datePickerDialog.getDatePicker();
        //Set the DatePicker minimum date selection to current date
        dp.setMinDate(c.getTimeInMillis());//get the current day
        //dp.setMinDate(System.currentTimeMillis() - 1000);// Alternate way to get the current day
        if (option.equalsIgnoreCase("reschedule_date")) {
            c.add(Calendar.DAY_OF_MONTH, 30);
            datePickerDialog.getDatePicker().setMaxDate(c.getTimeInMillis());
        }
        //Add 6 days with current date
        datePickerDialog.show();
    }

    private void getDoctorSlot(String selDate, int doctorId) {
        OPHubRequests.GetDoctorSlotRequest request = new OPHubRequests.GetDoctorSlotRequest();
        request.setDate(selDate);
        request.setHospId(hospitalId);
        request.setStaffId(doctorId);
        Log.i("mylog", "getDoctorSlot request:" + new Gson().toJson(request));
        Call<List<GetDoctorSlotResponse>> call = services.getDoctorSlot(request);
        call.enqueue(new Callback<List<GetDoctorSlotResponse>>() {

            @Override
            public void onResponse(Call<List<GetDoctorSlotResponse>> call, Response<List<GetDoctorSlotResponse>> response) {
                try {
                    Log.i("myLog", "getDoctorSlot response:");
                    Log.i("mylog", "getDoctorSlot response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "getDoctorSlot response isSuccess:" + response.body().toString());
                        List<GetDoctorSlotResponse> list = response.body();
                        int size = list.size();
                        if (size > 0) {
                            ArrayList<String> alTime = new ArrayList<>();
                            alShiftId = new ArrayList<>();
                            alGlobalShiftId = new ArrayList<>();
                            for (int start = 0; start < size; start++) {
                                GetDoctorSlotResponse resp = list.get(start);
                                String slot = resp.getSlotTime();
                                alTime.add(slot);
                                alShiftId.add(resp.getShiftId());
                                alGlobalShiftId.add(resp.getGlobalShiftId());
                            }
                            ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, alTime);
                            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                            spinSlotTime.setAdapter(adapter);
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }


            @Override
            public void onFailure(Call<List<GetDoctorSlotResponse>> call, Throwable t) {
                Log.i("myLog", "getDoctorSlot response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void getCancellationReason() {
        services.getCancellationReason().enqueue(new Callback<List<OPHubResponse.CancellationReasonResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.CancellationReasonResponse>> call, Response<List<OPHubResponse.CancellationReasonResponse>> response) {
                try {
                    Log.i("myLog", "getCancellationReason onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.CancellationReasonResponse> list = response.body();
                        int size = list.size();
                        cancelReason = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            OPHubResponse.CancellationReasonResponse resp = list.get(start);
                            cancelReason.add(resp.getReason());
                        }
                        Log.i("myLog", "cancelReason size::" + cancelReason.size());
                        ArrayAdapter adapter = new ArrayAdapter(
                                getActivity(),
                                android.R.layout.simple_spinner_item,
                                cancelReason);
                        if (adapter != null) {
                            Log.i("myLog", "if adapter!=null");
                            adapter.setDropDownViewResource(
                                    android.R.layout
                                            .simple_spinner_dropdown_item);
                            spinReason.setAdapter(adapter);
                        }
                        txtEdit.setVisibility(GONE);

                        // if (cancelReason != null)
                        //   OPHubUtils.addProdTypeSpinner(getActivity(), cancelReason, spinReason, "Select Reason");
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.CancellationReasonResponse>> call, Throwable t) {
                Log.i("myLog", "getCancellationReason onFailure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void getConsultStatusCount(String option) {
        services.getConsultationStatusCount(hospitalId, apptId).enqueue(new Callback<List<OPHubResponse.ConsulationStatusCountResp>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.ConsulationStatusCountResp>> call, Response<List<OPHubResponse.ConsulationStatusCountResp>> response) {
                try {
                    Log.i("myLog", "getConsultStatusCount onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.ConsulationStatusCountResp> list = response.body();
                        int size = list.size();
                        statusCount = new ArrayList<>();
                        statusName = new ArrayList<>();
                        statusColor = new ArrayList<>();
                        statusColorId = new ArrayList<>();
                        totalCount = 0;
                        for (int index = 0; index < size; index++) {
                            OPHubResponse.ConsulationStatusCountResp resp = list.get(index);
                            String count = resp.getCount();
                            if (count != null)
                                totalCount = totalCount + Integer.parseInt(count);
                            statusName.add(resp.getName());
                            statusCount.add(resp.getCount());
                            statusColor.add(resp.getColorCode());
                            statusColorId.add(resp.getId());
                            if (option.equalsIgnoreCase("status")) {
                                ArrayAdapter adapter1 = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, statusName);
                                adapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                                spinStatus.setAdapter(adapter1);

                                //  OPHubUtils.addProdTypeSpinner(getActivity(), statusName, spinStatus, "Select status");
                            }
                        }

                        showConsultProgressCount();

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.ConsulationStatusCountResp>> call, Throwable t) {
                Log.i("myLog", "getConsultStatusCount onFailure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void getConsultStatusDropdown(String status) {
        services.getConsultStatus(hospitalId).enqueue(new Callback<List<OPHubResponse.ConsulationStatusCountResp>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.ConsulationStatusCountResp>> call, Response<List<OPHubResponse.ConsulationStatusCountResp>> response) {
                try {
                    Log.i("myLog", "getConsultStatusDropdown onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.ConsulationStatusCountResp> list = response.body();
                        int size = list.size();
                        statusCount = new ArrayList<>();
                        statusName = new ArrayList<>();
                        statusColor = new ArrayList<>();
                        statusColorId = new ArrayList<>();
                        // totalCount = 0;
                        for (int index = 0; index < size; index++) {
                            OPHubResponse.ConsulationStatusCountResp resp = list.get(index);
                            statusName.add(resp.getName());
                            statusCount.add(resp.getCount());
                            statusColor.add(resp.getColorCode());
                            statusColorId.add(resp.getId());
                        }
                        ArrayAdapter adapter1 = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, statusName);
                        adapter1.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        spinStatus.setAdapter(adapter1);
                        if (statusName.contains(status)) {
                            int index = statusName.indexOf(status);
                            spinStatus.setSelection(index);
                        }


                        //    showConsultProgressCount();

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.ConsulationStatusCountResp>> call, Throwable t) {
                Log.i("myLog", "getConsultStatusDropdown onFailure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }


    private void showProgress(String option) {
        Log.i("myLog", "show progress");
        //   if (option.equalsIgnoreCase("Main"))
        //     size = progressStatus.size();
        //else if (option.equalsIgnoreCase("Cancel"))
        int size = trackingStatus.size();
        linearProgress.removeAllViews();
        linearProgressText.removeAllViews();
        LinearLayout[] linearBg = new LinearLayout[size];
        TextView[] textNo = new TextView[size];
        TextView[] textStatus = new TextView[size];
        View[] viewLine = new View[size];

        for (int start = 0; start < size; start++) {
            final int index = start;
            int s = size - 1;
            linearBg[start] = new LinearLayout(getActivity());
            linearBg[start].setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.gray_circle));
            textNo[start] = new TextView(getActivity());
            textNo[start].setText(String.valueOf(start + 1));
            textNo[start].setGravity(CENTER);
            textNo[start].setTextAppearance(R.style.status_no_text);
            linearBg[start].addView(textNo[start], progressTxtParam);

            viewLine[start] = new View(getActivity());
            //   viewLine[start].setForegroundGravity(View.TEXT_ALIGNMENT_CENTER);
            viewLine[start].setBackgroundColor(ContextCompat.getColor(getActivity(), R.color.status_line));
            String status = trackingStatus.get(start);
            textStatus[start] = new TextView(getActivity());
            textStatus[start].setText(status);
            textStatus[start].setGravity(CENTER);
            textStatus[start].setTextAppearance(R.style.status_text);

            if (option.equalsIgnoreCase("Main")) {
                int isCompleted = trackingIsCompleted.get(start);
                Log.i("mylog", "status isCompleted:::" + isCompleted);
                if (isCompleted == 1) {
                    Log.i("mylog", "status id matched");
                    linearBg[start].setEnabled(false);
                    linearBg[start].setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.status_done));
                    viewLine[start].setBackgroundColor(ContextCompat.getColor(getActivity(), R.color.status_done));
                    textNo[start].setVisibility(View.INVISIBLE);
                }
                if (apptStatus.equalsIgnoreCase("Requested") || status.equalsIgnoreCase("In Process") || status.equalsIgnoreCase("Inprocess")) {
                    linearBg[start].setEnabled(false);
                }
                if (start == 0)
                    linearProgress.addView(linearBg[start], progressFirstBgParam);
                else if (start == s)
                    linearProgress.addView(linearBg[start], progressLastBgParam);
                else
                    linearProgress.addView(linearBg[start], progressBgParam);

                if (start != s)
                    linearProgress.addView(viewLine[start], progressLineParam);
                linearProgressText.addView(textStatus[start], statusTxtParam);
            } else if (option.equalsIgnoreCase("Cancel")) {
                int isCompleted = trackingIsCompleted.get(start);
                String state = trackingStatus.get(start);
                Log.i("mylog", "status isCompleted:::" + isCompleted + "   state:" + state);
                if (isCompleted == 1) {
                    linearBg[start].setEnabled(false);
                    linearBg[start].setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.status_done));
                    viewLine[start].setBackgroundColor(ContextCompat.getColor(getActivity(), R.color.status_done));
                    if (start == 0) {
                        linearProgress.addView(linearBg[start], progressFirstBgParam);
                    } else if
                    (start == s || state.equalsIgnoreCase("Cancelled")) {
                        linearProgress.addView(linearBg[start], progressLastBgParam);
                        txtEdit.setVisibility(GONE);
                    } else
                        linearProgress.addView(linearBg[start], progressBgParam);

                    if (start != s && !state.equalsIgnoreCase("Cancelled"))
                        linearProgress.addView(viewLine[start], progressLineParam);
                    linearProgressText.addView(textStatus[start], statusTxtParam);
                    txtEdit.setVisibility(GONE);
                }
                //  String state = trackingStatus.get(start);
                if (state.equalsIgnoreCase("Cancelled")) {
                    linearBg[start].setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.cancelled));
                    txtEdit.setVisibility(GONE);
                }
                textNo[start].setVisibility(View.INVISIBLE);
            }


            linearBg[start].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    int statusId = 0;
                    String status = textStatus[index].getText().toString();
                    String no = textNo[index].getText().toString();
                    Log.i("myLog", "status:" + status + "   index:" + index);
                    if (status.equalsIgnoreCase("Completed")) {
                        if (paymentStatus != null && !paymentStatus.equalsIgnoreCase("Payment done.")) {
                            OPHubUtils.showErrorDialog(getActivity(), "Please do payment before changing the status to completed");
                            return;
                        }
                    }

                    String state = trackingStatus.get(index);
                    int id = trackingStatusId.get(index);
                    Log.i("myLog", "clicked sattus:" + state + "  id:" + id);
                    int maximum = trackingStatusId.get(0);
                    for (int i = 1; i < trackingStatusId.size(); i++) {
                        if (trackingIsCompleted.get(i) == 1) {
                            if (maximum < trackingStatusId.get(i))
                                maximum = trackingStatusId.get(i);
                        }
                    }
                    Log.i("myLog", "maximum no:" + maximum);
                    int next = maximum + 1;
                    Log.i("myLog", "clicked id:" + id + "  next:" + next);
                    if (id == next) {
//                        showConfirmationDialog("Tracking", state, id, "Are you sure want to mark as " + status);
                    }

                }
            });

        }
        if (progressBar.getVisibility() == View.VISIBLE)
            progressBar.setVisibility(View.GONE);
    }


    private void showConsultProgressCount() {
        int size = statusName.size();
        linearCount.removeAllViews();
        LinearLayout[] linearBg = new LinearLayout[size];
        TextView[] textCount = new TextView[size];
        TextView[] textStatus = new TextView[size];
        if (size > 0) {

            LinearLayout linearBgTot = new LinearLayout(getActivity());
            linearBgTot.setGravity(CENTER);
            linearBgTot.setOrientation(LinearLayout.VERTICAL);
            Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.circle_stroke);
            GradientDrawable gradientDrawable = (GradientDrawable) drawable;
            gradientDrawable.setStroke(dpToPx(10), ContextCompat.getColor(getActivity(), R.color.blue_text));
            linearBgTot.setBackground(gradientDrawable);

            TextView txtTotCount = new TextView(getActivity());
            txtTotCount.setText(String.valueOf(totalCount));
            txtTotCount.setGravity(CENTER);
            txtTotCount.setTextAppearance(R.style.ayushman_bh);
            linearBgTot.addView(txtTotCount, statusCountParam);

            TextView textTotal = new TextView(getActivity());
            textTotal.setText(getString(R.string.total));
            textTotal.setGravity(CENTER);
            textTotal.setTextAppearance(R.style.i_provide_m);
            linearBgTot.addView(textTotal, statusNameParam);
            linearCount.addView(linearBgTot, statusBgFirstParam);

        }
        for (int start = 0; start < size; start++) {
            linearBg[start] = new LinearLayout(getActivity());
            linearBg[start].setGravity(CENTER);
            linearBg[start].setOrientation(LinearLayout.VERTICAL);
            String color = statusColor.get(start);
            Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.circle_stroke);
            GradientDrawable gradientDrawable = (GradientDrawable) drawable;
            gradientDrawable.setStroke(dpToPx(10), Color.parseColor(color));
            linearBg[start].setBackground(gradientDrawable);

            textCount[start] = new TextView(getActivity());
            textCount[start].setText(statusCount.get(start));
            textCount[start].setGravity(CENTER);
            textCount[start].setTextAppearance(R.style.ayushman_bh);
            linearBg[start].addView(textCount[start], statusCountParam);

            textStatus[start] = new TextView(getActivity());
            textStatus[start].setText(statusName.get(start));
            textStatus[start].setGravity(CENTER);
            textStatus[start].setTextAppearance(R.style.i_provide_m);
            linearBg[start].addView(textStatus[start], statusNameParam);
            linearCount.addView(linearBg[start], statusBgParam);
        }
    }


    public void showConfirmationDialog(String option, String status, int statusId, String message) {

        dialogConfirmation = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_status_confirmation, null);
        dialogConfirmation.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogConfirmation.getWindow().setGravity(CENTER);
        Button btnNo = dialogConfirmation.findViewById(R.id.btnNo);
        Button btnYes = dialogConfirmation.findViewById(R.id.btnYes);
        TextView txtTitle = dialogConfirmation.findViewById(R.id.txtMessage);
        ImageView imgClose = dialogConfirmation.findViewById(R.id.imgClose);
        txtTitle.setText(message);

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
                if (option.equalsIgnoreCase("Close"))
                    closeConsultation();
                else if (option.equalsIgnoreCase("Tracking"))
                    updateApptStatus(status, statusId);
            }
        });
        dialogConfirmation.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogConfirmation.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(300);
        dialogConfirmation.getWindow().setAttributes(lp);
    }


    private void cancelAppointment(String apptId, String reason) {
        Log.i("mylog", "cancelAppointment apptid::" + apptId + "    hosp_id:" + hospitalId + "   reason:" + reason);
        OPHubRequests.CancelAppointmentReq request = new OPHubRequests.CancelAppointmentReq();
        request.setHospitalId(hospitalId);
        request.setReason(reason);
        Log.i("mylog", "cancelAppointment request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.cancelAppointment(apptId, request);
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    //Log.i("myLog", "updateApptStatus response:");
                    Log.i("mylog", "cancelAppointment response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.UpdateApptStatusResponse> list = response.body();
                        OPHubResponse.UpdateApptStatusResponse res = list.get(0);
                        String status = res.getStatus();
                        String message = res.getMessage();

                        if (status != null && status.equalsIgnoreCase("success")) {
                            dialogReschedule.dismiss();
                            Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                            mainTabLayout.getTabAt(0).select();
                            txtEdit.setVisibility(GONE);
                            gotoAppointmentInfo();

                        } else {
                            Toast.makeText(getActivity(), "Error occurred!", Toast.LENGTH_SHORT).show();
                        }
                        btnCancels.setVisibility(GONE);
                        btnApprove.setVisibility(GONE);


                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Throwable t) {
                //Log.i("myLog", "updateApptStatus response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void goToSelDoctor() {
        DoctorSelectionFragment newFragment = new DoctorSelectionFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("appt_id", apptId);
        result.putString("from_screen", "Tracking");
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }


    private void updateApptStatus(String status, int statusId) {
        //Log.i("mylog", "updateApptStatus apptid::" + apptId + "    hosp_id:" + hospitalId + "   status:" + selStatus);
        OPHubRequests.UpdateAppointmentStatusReq request = new OPHubRequests.UpdateAppointmentStatusReq();
        request.setHospitalId(hospitalId);
        request.setApptStatus(status);
        request.setApptStatusId(statusId);

        //Log.i("mylog", "updateApptStatus request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.updateAppointmentStatus(apptId, request);
        //Log.i("myLog", "URLLLLLLLLll:" + call.request().url().toString());
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    //Log.i("myLog", "updateApptStatus response:");\
                    Log.i("mylog", "updateApptStatus response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //Log.i("myLog", "updateApptStatus response isSuccess:" + response.body().toString());
                        List<OPHubResponse.UpdateApptStatusResponse> list = response.body();
                        OPHubResponse.UpdateApptStatusResponse res = list.get(0);
                        String status = res.getStatus();
                        String message = res.getMessage();
                        Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                        getAppointmentTracking(hospitalId, apptId, "Update");

                        dialogConfirmation.dismiss();

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Throwable t) {
                Log.i("myLog", "updateApptStatus response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    public static GradientDrawable drawCircle(int color) {
        GradientDrawable shape = new GradientDrawable();
        shape.setShape(GradientDrawable.OVAL);
        shape.setCornerRadii(new float[]{0, 0, 0, 0, 0, 0, 0, 0});
        shape.setColor(color);
        // shape.setStroke(10, borderColor);
        return shape;
        // imageView.setBackground(drawCircle(getColor(android.R.color.holo_blue_dark));
    }

    public void showChangeStatusDialog(String processDesc, int processId, String status) {
        dialogChangeStatus = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_tracking_status_change, null);
        dialogChangeStatus.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogChangeStatus.getWindow().setGravity(CENTER);
        ImageView imgClose = dialogChangeStatus.findViewById(R.id.imgClose);
        Button btnSubmit = dialogChangeStatus.findViewById(R.id.btnSubmit);
        spinStatus = dialogChangeStatus.findViewById(R.id.spinStatus);
        EditText edtMsg = dialogChangeStatus.findViewById(R.id.edtMessage);
        getConsultStatusDropdown(status);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogChangeStatus.dismiss();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (spinStatus != null) {
                    String selStatus = spinStatus.getSelectedItem().toString();
                    if (selStatus.contains("Select status")) {
                        Toast.makeText(getActivity(), "Please select status", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    int pos = spinStatus.getSelectedItemPosition();
                    Log.i("myLog", "Pos:" + pos);
                    int colorId = statusColorId.get(pos);
                    updateStatus(edtMsg.getText().toString(), processId, colorId);
                }
            }
        });
        dialogChangeStatus.show();
    }


    private void updateStatus(String processDesc, int processId, int colorCodeId) {
        Log.i("mylog", "updateStatus");
        Log.i("mylog", "updateStatus desc:" + processDesc + " pId:" + processId + "   colorId:" + colorCodeId);
        OPHubRequests.UpdateConsultStatusReq request = new OPHubRequests.UpdateConsultStatusReq();
        request.setApptId(apptId);
        request.setProcessId(processId);
        request.setPatientId(patientId);
        request.setDescription(processDesc);
        request.setColorCodeId(colorCodeId);
        request.setStaffId(doctorId);
        request.setHospitalId(hospitalId);
        Log.i("mylog", "updateStatus request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.updateConsultationStatus(request);
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    Log.i("myLog", "updateStatus response:");
                    Log.i("mylog", "updateStatus response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "updateStatus response isSuccess:" + response.body().toString());
                        List<OPHubResponse.UpdateApptStatusResponse> list = response.body();
                        if (list != null && list.size() > 0) {
                            OPHubResponse.UpdateApptStatusResponse res = list.get(0);
                            String status = res.getStatus();
                            String message = res.getMessage();
                            if (status != null && status.equalsIgnoreCase("success")) {
                                getConsultStatusCount("");
                                //  getConsultationProcess();
                                new Handler().postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        try {
                                            dialogChangeStatus.dismiss();
                                            getConsultationTracking();
                                        } catch (Exception ex) {
                                            Log.i("myLog", "exception ex:" + ex.toString());
                                        }

                                    }
                                }, 1000);

                            } else {
                                Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
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
            public void onFailure(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Throwable t) {
                Log.i("myLog", "updateStatus response failure:" + t.toString());
                Log.i("myLog", "updateStatus response failure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void showRescheduleDialog(String option) {
        Log.i("myLog", "showRescheduleDialog");
        dialogReschedule = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.alert_reschedule, null);
        dialogReschedule.setContentView(view);
        //  dialogReschedule.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogReschedule.getWindow().setGravity(CENTER);
        Button btnCancel = dialogReschedule.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogReschedule.findViewById(R.id.btnSave);
        EditText edtDocName = dialogReschedule.findViewById(R.id.edtDocName);
        EditText edtPayment = dialogReschedule.findViewById(R.id.edtPayment);
        EditText edtMessage = dialogReschedule.findViewById(R.id.edtMsg);
        TextView txtTitle = dialogReschedule.findViewById(R.id.title);
        spinStatus = dialogReschedule.findViewById(R.id.spinStatus);
        edtDate = dialogReschedule.findViewById(R.id.edtDate);
        spinSlotTime = dialogReschedule.findViewById(R.id.spinSlotTime);
        spinReason = dialogReschedule.findViewById(R.id.spinReason);
        LinearLayout linearSlotTitle = dialogReschedule.findViewById(R.id.linearTitleSlot);
        LinearLayout linearSlot = dialogReschedule.findViewById(R.id.linearSlot);
        LinearLayout linearStatusMsgTitle = dialogReschedule.findViewById(R.id.linearTitleStatusMsg);
        LinearLayout linearStatusMsg = dialogReschedule.findViewById(R.id.linearStatusMsg);
        LinearLayout linearReasonTitle = dialogReschedule.findViewById(R.id.linearTitleReason);
        LinearLayout linearReason = dialogReschedule.findViewById(R.id.linearReason);
        if (option.equalsIgnoreCase("Cancel")) {
            txtTitle.setText("Cancel Appointment");
            linearReasonTitle.setVisibility(View.VISIBLE);
            linearReason.setVisibility(View.VISIBLE);
            linearStatusMsg.setVisibility(View.GONE);
            linearStatusMsgTitle.setVisibility(View.GONE);
            linearSlotTitle.setVisibility(View.GONE);
            linearSlot.setVisibility(View.GONE);
            txtEdit.setVisibility(GONE);
        } else {
            txtTitle.setText("Reschedule Appointment");
            linearReasonTitle.setVisibility(View.GONE);
            linearReason.setVisibility(View.GONE);
            linearStatusMsg.setVisibility(View.VISIBLE);
            linearStatusMsgTitle.setVisibility(View.VISIBLE);
            linearSlotTitle.setVisibility(View.VISIBLE);
            linearSlot.setVisibility(View.VISIBLE);
        }

        getAppointmentStatus(String.valueOf(hospitalId), "reschedule");
        edtDocName.setText(docName);
        Log.i("myLog", "netAmt:" + netAmt);
        edtPayment.setText(String.valueOf(netAmt));
        getCancellationReason();

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogReschedule.dismiss();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (option.equalsIgnoreCase("Reschedule")) {
                    String date = edtDate.getText().toString();
                    if (date.isEmpty()) {
                        Toast.makeText(getActivity(), "Please select date", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    if (spinSlotTime.getSelectedItem() == null) {
                        Toast.makeText(getActivity(), "Slot is not available, Please select another date", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    String slot = spinSlotTime.getSelectedItem().toString();
                    String[] timeArr = slot.split("-");
                    String time = timeArr[0].trim();
                    int pos = spinSlotTime.getSelectedItemPosition();
                    int shiftId = alShiftId.get(pos);
                    int globalShiftId = alGlobalShiftId.get(pos);
                    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    Date date1 = new Date();
                    String currDateTime = dateFormat.format(date1);
                    rescheduleAppt(apptId, date, time, doctorId, shiftId, globalShiftId, apptStatus, apptStatusId, currDateTime, "");

                } else if (option.equalsIgnoreCase("Cancel")) {
                    String reason = spinReason.getSelectedItem().toString();
                    //   mainTabLayout.getTabAt(0).select();
                    cancelAppointment(apptId, reason);

                }
            }
        });
        edtDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "from date clicked");
                setFromDateCalender("reschedule_date", doctorId);
            }
        });

        dialogReschedule.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogReschedule.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        dialogReschedule.getWindow().setAttributes(lp);
    }

    private void goToPrescriptionTab() {
        selTab = "prescription";
        OPHubApplication.appBarTitle.setText(R.string.medical_records);
        Log.i("myLog", "clicked appointments history");
        linearApptInfo.setVisibility(GONE);
        prescFragContainer.setVisibility(VISIBLE);
        tblView.setVisibility(View.VISIBLE);
        relComingSoon.setVisibility(GONE);
        btnTokenVerified.setVisibility(GONE);
        txtStatus.setVisibility(GONE);
        linearTracking.setVisibility(GONE);
        linearPaymentOption.setVisibility(GONE);
        btnApprove.setVisibility(GONE);
        btnCancels.setVisibility(GONE);
        btnConfirmAppt.setVisibility(GONE);
     /*   getPrescription(patientId);
        if (userType.equalsIgnoreCase("Doctor") || userType.equalsIgnoreCase("Receptionist") || userType.equalsIgnoreCase("Nurse"))
            btnNew.setVisibility(View.INVISIBLE);
        else
            btnNew.setVisibility(View.INVISIBLE);*/
    }

    private void gotoTrackingTab() {
        selTab = "Tracking";
        OPHubApplication.appBarTitle.setText(R.string.trackDetails);
        Log.i("myLog", "clicked gotoTrackingTab");
        prescFragContainer.setVisibility(GONE);
        linearApptInfo.setVisibility(GONE);
        tblView.setVisibility(GONE);
        relComingSoon.setVisibility(GONE);
        btnTokenVerified.setVisibility(GONE);
        txtStatus.setVisibility(GONE);
        linearTracking.setVisibility(VISIBLE);
        tblHead.setVisibility(GONE);
        imgNoData.setVisibility(GONE);
        txtNoData.setVisibility(GONE);
        linearPaymentOption.setVisibility(GONE);
        btnApprove.setVisibility(GONE);
        btnCancels.setVisibility(GONE);
        btnConfirmAppt.setVisibility(GONE);
        Log.i("myLog", "apptStatus:" + apptStatus);
        if (apptStatus.equalsIgnoreCase("Requested")) {
            btnRescehdule.setVisibility(View.GONE);
            btnSelDoctor.setVisibility(View.VISIBLE);
            btnCancel.setVisibility(View.VISIBLE);
            ((LinearLayout) tabLayout.getTabAt(1).view).setVisibility(GONE);

        } else if (apptStatus.equalsIgnoreCase("Approved") || apptStatus.equalsIgnoreCase("Reserved")) {
            btnRescehdule.setVisibility(View.VISIBLE);
            btnSelDoctor.setVisibility(View.GONE);
            btnCancel.setVisibility(View.VISIBLE);
            ((LinearLayout) tabLayout.getTabAt(1).view).setVisibility(GONE);

        } else if (apptStatus.equalsIgnoreCase("Completed") || apptStatus.equalsIgnoreCase("Cancelled")) {
            btnRescehdule.setVisibility(View.GONE);
            btnSelDoctor.setVisibility(View.GONE);
            btnCancel.setVisibility(View.GONE);

            ((LinearLayout) tabLayout.getTabAt(1).view).setVisibility(GONE);
        } else {
            Log.i("myLog", "elseee");
            btnRescehdule.setVisibility(View.GONE);
            btnSelDoctor.setVisibility(View.GONE);
            btnCancel.setVisibility(View.GONE);
            Log.i("myLog", "before");
            ((LinearLayout) tabLayout.getTabAt(1).view).setVisibility(VISIBLE);


        }
        Log.i("myLog", "apptStatus:" + apptStatus);


        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        getAppointmentTracking(hospitalId, apptId, "");
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        Log.i("myLog", "clicked appointments");
                        boolean isConnected = checkConnection();
                        if (!isConnected)
                            showAlert(isConnected);
                        else {
                            selTab = "appointment_status";
//                            progressBar.setVisibility(View.VISIBLE);
                            getAppointmentTracking(hospitalId, apptId, "");
                            linearApptStatus.setVisibility(View.VISIBLE);
                            linearConsultStatus.setVisibility(View.GONE);
                        }


                        break;
                    case 1:
                        boolean isConnected1 = checkConnection();
                        if (!isConnected1)
                            showAlert(isConnected1);
                        else {
                            selTab = "consultation_status";
//                            progressBar.setVisibility(View.VISIBLE);
                            linearApptStatus.setVisibility(View.GONE);
                            linearConsultStatus.setVisibility(View.VISIBLE);

                            getConsultStatusCount("");
                            getConsultationProcess();
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

    }

    private ConnectivityManager.NetworkCallback connectivityCallback
            = new ConnectivityManager.NetworkCallback() {
        @Override
        public void onAvailable(Network network) {
            isConnected = true;
            OPHubUtils.showErrorDialog(getActivity(), "INTERNET CONNECTED");
            // Log.i.LOGD(TAG, "INTERNET CONNECTED");
        }

        @Override
        public void onLost(Network network) {
            isConnected = false;
            OPHubUtils.showErrorDialog(getActivity(), "INTERNET LOST");
            // LogUtility.LOGD(TAG, "INTERNET LOST");
        }
    };

    private void checkConnectivity() {
        // here we are getting the connectivity service from connectivity manager
        final ConnectivityManager connectivityManager = (ConnectivityManager) getActivity().getSystemService(
                Context.CONNECTIVITY_SERVICE);

        // Getting network Info
        // give Network Access Permission in Manifest
        final NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();

        // isConnected is a boolean variable
        // here we check if network is connected or is getting connected
        isConnected = activeNetworkInfo != null && activeNetworkInfo.isConnectedOrConnecting();

        if (!isConnected) {
            // SHOW ANY ACTION YOU WANT TO SHOW
            // WHEN WE ARE NOT CONNECTED TO INTERNET/NETWORK
            // LogUtility.LOGD(TAG, " NO NETWORK!");
            OPHubUtils.showErrorDialog(getActivity(), "No Network");
// if Network is not connected we will register a network callback to  monitor network
            connectivityManager.registerNetworkCallback(
                    new NetworkRequest.Builder()
                            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                            .build(), connectivityCallback);
            monitoringConnectivity = true;
        }

    }

    @Override
    public void onResume() {
        super.onResume();
        // call method
        Log.i("myLog", "onResume.........appt fragment");

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
        Log.i("myLog", "onPause...........appt fragment");
        getActivity().unregisterReceiver(networkConnectionReceiver);

    }

    @Override
    public void onNetworkChange(boolean isConnected) {
        showAlert(isConnected);
    }

    public boolean checkConnection() {

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

        }

        // show snack bar

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


    public void showDiscountDialog() {

        dialogDiscount = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.add_discount_additional, null);
        dialogDiscount.setContentView(view);
        dialogDiscount.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogDiscount.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogDiscount.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogDiscount.findViewById(R.id.btnSubmit);
        ImageView imgClose = dialogDiscount.findViewById(R.id.imgClose);
        TextView txtConsultFees = dialogDiscount.findViewById(R.id.txtConsultFee);
        TextView txtDiscountRate = dialogDiscount.findViewById(R.id.txtDiscount);
        TextView txtDiscountPercent = dialogDiscount.findViewById(R.id.txtDiscountPercent);
        TextView txtTaxPercent = dialogDiscount.findViewById(R.id.txtTaxpercent);
        TextView txtAdditCharges = dialogDiscount.findViewById(R.id.txtAdditionalCharges);
        TextView txtAdditChargesNotes = dialogDiscount.findViewById(R.id.txtAdditChargeNotes);
        TextView txtSubTotal = dialogDiscount.findViewById(R.id.txtSubTotal);
        TextView txtNetAmt = dialogDiscount.findViewById(R.id.txtNetAmt);
        TextView txtTaxAmt = dialogDiscount.findViewById(R.id.txtTax);
        EditText edtDiscount = dialogDiscount.findViewById(R.id.edtDiscountRate);
        EditText edtDiscountPercent = dialogDiscount.findViewById(R.id.edtDiscountPercent);
        EditText edtAdditCharges = dialogDiscount.findViewById(R.id.edtAdditCharges);
        EditText edtAdditChargeNotes = dialogDiscount.findViewById(R.id.edtNotes);
        LinearLayout linearAdditChargeNotes = dialogDiscount.findViewById(R.id.linearAdditChargeNotes);
        txtConsultFees.setText("\u20B9 " + df.format(consultFees));
        txtDiscountRate.setText(" - \u20B9 " + df.format(discount));
        txtDiscountPercent.setText(df.format(discountPercent) + "%");
        txtTaxPercent.setText(df.format(taxPercentage) + "%");
        txtAdditCharges.setText("\u20B9 " + df.format(additCharges));
        txtAdditChargesNotes.setText(additChargeNotes);
        Log.i("myLog", "consultFees:" + consultFees + "   additCharges: " + additCharges + "   discount:" + discount);
        double subtotal = consultFees + additCharges - discount;
        Log.i("myLog", "subtotal:" + subtotal);
        txtSubTotal.setText("\u20B9 " + df.format(subtotal));
        txtTaxAmt.setText("\u20B9 " + df.format(taxAmount));
        netAmt = subtotal + taxAmount;
        txtNetAmt.setText("\u20B9 " + df.format(netAmt));
        Log.i("myLog", "netAmt:" + netAmt);
        boolean isAdditCharges = false;

        if (discount != 0.0)
            edtDiscount.setText(String.valueOf(discount));
        if (discountPercent != 0.0)
            edtDiscountPercent.setText(String.valueOf(discountPercent));
        if (additCharges != 0.0)
            edtAdditCharges.setText(String.valueOf(additCharges));
        edtAdditChargeNotes.setText(additChargeNotes);
        if (additChargeNotes == null || additChargeNotes.isEmpty()) {
            linearAdditChargeNotes.setVisibility(GONE);
        }
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogDiscount.dismiss();
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogDiscount.dismiss();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                System.out.println("print calculation sumbit");
                double discount = 0.0, discountPercent = 0.0, additCharges = 0.0;
                String discountStr = edtDiscount.getText().toString();
                String discountPercentStr = edtDiscountPercent.getText().toString();
                String additChargesStr = edtAdditCharges.getText().toString();
                String additChargeNotes = edtAdditChargeNotes.getText().toString();
                String netAmtStr = txtNetAmt.getText().toString();
                String[] total = netAmtStr.split(" ");
                double netAmt = Double.parseDouble(total[1]);
                if (discountStr.isEmpty() && additChargesStr.isEmpty()) {
                    Toast.makeText(getActivity(), "Please enter discount or additional charges", Toast.LENGTH_SHORT).show();
                    return;
                } else if (additChargeNotes.isEmpty()) {
                    Toast.makeText(getActivity(), "Please enter Notes", Toast.LENGTH_SHORT).show();
                    return;
                }


                if (!discountStr.isEmpty())
                    discount = Double.parseDouble(discountStr);
                if (!discountPercentStr.isEmpty())
                    discountPercent = Double.parseDouble(discountPercentStr);
                if (!additChargesStr.isEmpty())
                    additCharges = Double.parseDouble(additChargesStr);
                saveDiscount(discount, discountPercent, additCharges, additChargeNotes, netAmt);
            }
        });
        edtAdditChargeNotes.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                Log.i("myLog", "edtAddiCharges onEditorAction:");
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    String notes = edtAdditChargeNotes.getText().toString();
                    Log.i("myLog", "onEditorAction:  notes:" + notes);
                    if (!notes.isEmpty()) {
                        linearAdditChargeNotes.setVisibility(View.VISIBLE);
                        txtAdditChargesNotes.setText(notes);
                    }
                }
                return false;
            }
        });

        edtDiscount.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (isUpdating) return;
                isUpdating = true;

                String input = s.toString();
                //  String consultFeeArr[] = txtTotal.getText().toString().split(" ");
                //String consultFee = consultFeeArr[1];
                Log.i("myLog", "consultFee:" + consultFees);
                if (!input.isEmpty()) {
                    try {
                        double value = Double.parseDouble(input);
                        Log.i("myLog", "value:" + value);
                        //   double consultFees = Double.parseDouble(consultFees);
                        Log.i("myLog", "value:" + value + "   consultFees:" + consultFees);
                        if (value > consultFees) {
                            Log.i("myLog", "inside if");
                            edtDiscount.setText(String.valueOf(consultFees));
                            edtDiscount.setSelection(edtDiscount.getText().length());
                        }
                    } catch (NumberFormatException e) {
                        // Handle invalid input
                        Log.i("myLog", "NumberFormatException if");
                        // edtDiscountRate.setText("");
                    }
                }

                edtDiscountPercent.setText("");
                txtDiscountPercent.setText("");
                String discountRate = edtDiscount.getText().toString();
                Log.i("myLog", "afterTextChanged: discountRate: " + discountRate);

                double discount = 0.0;
                String additional = edtAdditCharges.getText().toString();
//                double additCharges = isAdditCharges ? parseDouble(edtAdditCharges.getText().toString()) : 0.0;
                Double additCharges;
                if (additional.isEmpty()) {
                    additCharges = 0.0;
                } else {
                    additCharges = Double.valueOf(additional);
                }


                if (consultFees != 0.0) {
                    if (!discountRate.isEmpty()) {
                        discount = Double.parseDouble(discountRate);
                        double percent = 100 * discount / consultFees;
                        edtDiscountPercent.setText(df.format(percent));
                        txtDiscountPercent.setText(df.format(percent) + "%");
                    }
                    txtDiscountRate.setText(" - \u20B9 " + df.format(discount));
                    Log.i("myLog", " discountconsultFees:" + consultFees + "   additCharges:" + additCharges + "   discount:" + discount);
                    double subTotal = consultFees + additCharges - discount;
                    Log.i("myLog", "subtotal discpunt:" + subTotal);
                    txtSubTotal.setText("\u20B9 " + df.format(subTotal));

                    String taxStr = txtTaxAmt.getText().toString();
                    if (!taxStr.isEmpty()) {
                        double tax = parseDouble(taxStr.split(" ")[1]);
                        double taxTotal = subTotal * taxPercentage / 100;
                        double netAmt = subTotal + taxTotal;
                        System.out.println("print tax amount " + taxTotal);
                        txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                        txtTaxAmt.setText("\u20B9 " + String.format("%.2f", taxTotal));
                    } else {
                        txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                    }
                }
                isUpdating = false;
            }
        });


        edtDiscountPercent.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (isUpdating) return;
                isUpdating = true;
                String input = s.toString();
                if (!input.isEmpty()) {
                    try {
                        int value = Integer.parseInt(input);
                        if (value > 100) {
                            edtDiscountPercent.setText("100");
                            edtDiscountPercent.setSelection(edtDiscountPercent.getText().length());
                        }
                    } catch (NumberFormatException e) {
                        // Handle invalid input
                        edtDiscountPercent.setText("");
                    }
                }

                String discountPercent = edtDiscountPercent.getText().toString();
                if (!discountPercent.isEmpty()){
                    txtDiscountPercent.setText(discountPercent + "%");
                }else {
                    txtDiscountPercent.setText("0.0" + "%");
                }

                Log.i("myLog", "afterTextChanged: discountPercent: " + discountPercent);

                double discount = 0.0;
                //  double additCharges = isAdditCharges ? parseDouble(edtAdditCharges.getText().toString()) : 0.0;
                String additional = edtAdditCharges.getText().toString();
//                double additCharges = isAdditCharges ? parseDouble(edtAdditCharges.getText().toString()) : 0.0;
                Double additCharges;
                if (additional.isEmpty()) {
                    additCharges = 0.0;
                } else {
                    additCharges = Double.valueOf(additional);
                }
                if (consultFees != 0.0) {
                    if (!discountPercent.isEmpty()) {
                        double percent = Double.parseDouble(discountPercent);
                        discount = consultFees * percent / 100;
                    }
                    txtDiscountRate.setText(" - \u20B9 " + df.format(discount));
                    edtDiscount.setText(String.valueOf(discount));
                    double subTotal = consultFees + additCharges - discount;
                    txtSubTotal.setText("\u20B9 " + df.format(subTotal));

                    String taxStr = txtTaxAmt.getText().toString();
                    if (!taxStr.isEmpty()) {
                        double tax = parseDouble(taxStr.split(" ")[1]);
                        double taxTotal = subTotal * taxPercentage / 100;
                        double netAmt = subTotal + taxTotal;
                        System.out.println("print tax amount " + taxTotal);
                        txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                        txtTaxAmt.setText("\u20B9 " + String.format("%.2f", taxTotal));
                    } else {
                        txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                    }
                }
                isUpdating = false;
            }
        });


        edtAdditCharges.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
            }

            @Override
            public void afterTextChanged(Editable editable) {
                if (isUpdating) return;
                isUpdating = true;

                String amount = edtAdditCharges.getText().toString();
                Log.i("myLog", "afterTextChanged: amount: " + amount);
                double additCharges = parseDouble(amount);
                txtAdditCharges.setText("\u20B9 " + df.format(additCharges));

                double discount = parseDouble(edtDiscount.getText().toString());
                double discountPercent = parseDouble(edtDiscountPercent.getText().toString());
                double calculatedDiscount = 0.0;

                if (consultFees != 0.0) {
                    if (!edtDiscountPercent.getText().toString().isEmpty()) {
                        calculatedDiscount = consultFees * discountPercent / 100;
                        txtDiscountRate.setText(" - \u20B9 " + df.format(calculatedDiscount));
                    } else if (!edtDiscount.getText().toString().isEmpty()) {
                        calculatedDiscount = discount;
                        txtDiscountRate.setText(" - \u20B9 " + df.format(discount));
                    }
                    double subTotal = consultFees + additCharges - discount;
                    txtSubTotal.setText("\u20B9 " + df.format(subTotal));
                    System.out.println("subTotal::::: " + subTotal);
                    String taxStr = txtTaxAmt.getText().toString();
                    if (!taxStr.isEmpty()) {
                        double tax = parseDouble(taxStr.split(" ")[1]);
                        double taxTotal = subTotal * taxPercentage / 100;
                        double netAmt = subTotal + taxTotal;
                        System.out.println("print tax amount " + taxTotal);
                        txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                        txtTaxAmt.setText("\u20B9 " + String.format("%.2f", taxTotal));
                    } else {
                        txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                    }
                }
                isUpdating = false;
            }
        });


        dialogDiscount.show();
        /*   WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogDiscount.getWindow().getAttributes());
        lp.width = dpToPx(720);
        lp.height = dpToPx(550);
        dialogDiscount.getWindow().setAttributes(lp);*/
    }


    public double parseDouble(String value) {
        if (value.isEmpty()) return 0.0;
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private void saveDiscount(double discount, double discountPercent, double additCharges, String additChargeNotes, double total) {
        Log.i("mylog", "saveDiscount");
        Log.i("myLog", "apptId:" + apptId);
        OPHubRequests.SaveDiscountsReq request = new OPHubRequests.SaveDiscountsReq();
        request.setDiscount_amount(discount);
        request.setDiscount_percentage(discountPercent);
        request.setAdditional_charge(additCharges);
        request.setAdditional_charge_note(additChargeNotes);
        request.setHospital_id(hospitalId);
        request.setTotal(total);
        Log.i("mylog", "saveDiscount patientChargeId:" + patientChargeId);
        Log.i("mylog", "saveDiscount request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.saveDiscounts(patientChargeId, request);
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    Log.i("mylog", "saveDiscount response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "saveDiscount response isSuccess:" + response.body().toString());
                        List<OPHubResponse.UpdateApptStatusResponse> responses = response.body();
                        if (responses != null && !responses.isEmpty()) {
                            OPHubResponse.UpdateApptStatusResponse resp = responses.get(0);
                            String message = resp.getMessage();
                            String status = resp.getStatus();
                            Log.i("myLog", "saveDiscount message:" + message);
                            Log.i("myLog", "saveDiscount status:" + status);

                            if (status != null && status.equalsIgnoreCase("success")) {

                                viewApptInfo(apptId);
                                new Handler().postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        try {
                                            Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                                            dialogDiscount.dismiss();
                                        } catch (Exception ex) {
                                            Log.i("myLog", "exception ex:" + ex.toString());
                                        }

                                    }
                                }, 1000);

                            } else {
                                OPHubUtils.showErrorDialog(getActivity(), message);
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
            public void onFailure(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Throwable t) {
                Log.i("myLog", "bookAppointmentCash response failure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }


    public void dateComparison() {
        Log.i("myLog", " dateComparison:");
        Log.i("myLog", " dateVal:" + dateVal);
        // Example date to compare (format: YYYY-MM-DD)
        //  LocalDate givenDate = LocalDate.parse("2024-10-16"); // Change this to your date
        LocalDate givenDate = LocalDate.parse(dateVal); // Change this to your date

        // Get the current date
        LocalDate currentDate = LocalDate.now();
        if (givenDate.isBefore(currentDate)) {

            fromTab = "History";
            Log.i("myLog", " previous date");
        }
        // Compare the dates
   /*     if (givenDate.isAfter(currentDate)) {
            System.out.println("The given date is greater than the current date.");
        } else if (givenDate.isBefore(currentDate)) {
            System.out.println("The given date is less than the current date.");
        } else {
            System.out.println("The given date is equal to the current date.");
        }*/
    }

    private void goToClinicalNotes() {
        selTab = "clinical_Notes";
        OPHubApplication.appBarTitle.setText(R.string.medical_records);
        Log.i("myLog", "clicked appointments history");
        linearApptInfo.setVisibility(GONE);
        prescFragContainer.setVisibility(VISIBLE);
        tblView.setVisibility(View.VISIBLE);
        relComingSoon.setVisibility(GONE);
        btnTokenVerified.setVisibility(GONE);
        txtStatus.setVisibility(GONE);
        linearTracking.setVisibility(GONE);
        linearPaymentOption.setVisibility(GONE);
        btnApprove.setVisibility(GONE);
        btnCancels.setVisibility(GONE);
        btnConfirmAppt.setVisibility(GONE);/*   getPrescription(patientId);    if (userType.equalsIgnoreCase("Doctor") || userType.equalsIgnoreCase("Receptionist") || userType.equalsIgnoreCase("Nurse"))        btnNew.setVisibility(View.INVISIBLE);    else        btnNew.setVisibility(View.INVISIBLE);*/
    }

    private void goToVitals() {
        selTab = "vitals";
        OPHubApplication.appBarTitle.setText(R.string.medical_records);
        Log.i("myLog", "clicked appointments history");
        linearApptInfo.setVisibility(GONE);
        prescFragContainer.setVisibility(VISIBLE);
        tblView.setVisibility(View.VISIBLE);
        relComingSoon.setVisibility(GONE);
        btnTokenVerified.setVisibility(GONE);
        txtStatus.setVisibility(GONE);
        linearTracking.setVisibility(GONE);
        linearPaymentOption.setVisibility(GONE);
        btnApprove.setVisibility(GONE);
        btnCancels.setVisibility(GONE);
        btnConfirmAppt.setVisibility(GONE);/*   getPrescription(patientId);    if (userType.equalsIgnoreCase("Doctor") || userType.equalsIgnoreCase("Receptionist") || userType.equalsIgnoreCase("Nurse"))        btnNew.setVisibility(View.INVISIBLE);    else        btnNew.setVisibility(View.INVISIBLE);*/
    }

    public void updateStatus() {

        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("appointment_status", "Approved");
        requestData.put("appointment_status_id", "3");
        requestData.put("Hospital_id", String.valueOf(hospitalId));
        loaderOverlay.setVisibility(VISIBLE);


        Call<ResponseBody> call = services.updateStatus(requestData, apptId);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                try {
                    if (response.isSuccessful()) {
                        loaderOverlay.setVisibility(GONE);
                        viewApptInfo(apptId);
                    } else {

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                t.printStackTrace();
            }
        });


    }


}
