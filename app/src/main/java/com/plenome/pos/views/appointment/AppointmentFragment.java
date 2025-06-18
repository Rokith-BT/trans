package com.plenome.pos.views.appointment;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.PendingIntent;
import android.content.Context;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.nfc.NfcAdapter;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
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
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.navigation.NavigationView;
import com.google.android.material.tabs.TabLayout;
import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.adapters.ExistingPatientAdapter;
import com.plenome.pos.model.ExistPatientDetail;
import com.plenome.pos.model.GetAppointmentResponse;
import com.plenome.pos.model.GetAppointmentStatusResponse;
import com.plenome.pos.model.GetDoctorResponse;
import com.plenome.pos.model.GetDoctorSlotResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.plenome.pos.model.OPHubResponse.PaymentStatusResponse;
import com.plenome.pos.utils.PreferenceManager;

import com.plenome.pos.views.patientDetail.AddNewPatientFragment;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.patientDetail.PatientProfileFragment;


public class AppointmentFragment extends Fragment implements NavigationView.OnNavigationItemSelectedListener, NetworkConnectionReceiver.ReceiverListener {
    View rootView;

    RestServices services;

    @BindView(R.id.txtWelcome)
    TextView txtWelcome;

    @BindView(R.id.relFragment)
    RelativeLayout relativeLayout;

    @BindView(R.id.relMain)
    RelativeLayout relMain;

    @BindView(R.id.tabLayout)
    TabLayout tabLayout;

    @BindView(R.id.tblAppointments)
    TableLayout tblView;

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

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.chkStatus)
    CheckBox chkStatus;

    @BindView(R.id.progressBar)
    ProgressBar progressBar;

    @BindView(R.id.imgRefresh)
    ImageView imgRefresh;

    @BindView(R.id.imgFilter)
    ImageView imgFilter;

    ArrayList<String> status, paymentStatus;
    ArrayList<Integer> doctorId, alShiftId, alGlobalShiftId, statusId, paymentStatusId;
    int hospitalId,StaffId, width, height, currentPage = 1, totPage, remPage, textSize, totSize, initPageNo = 1, endPageNo;
    private Dialog dialogFilter, dialogReschedule, dialogStatus,dilogAppointment, underDevelop;
    private Spinner spinDoctor, spinStatus, spinSlotTime, spinPaymentStatus;
    private EditText edtFromDate, edtToDate, edtDate,edtPatientId;
    private DatePickerDialog fromDatePickerDialog;
    private TextView[] txtNo, txtStatus;CheckBox[] checkbox;
    private TableRow.LayoutParams txtParam, txtParamdate, lineParam, pageTxtParam, noDataParam, chkBoxParam, patientIdParam;
    List<GetAppointmentResponse.Datum> listResp;
    //  String[] pages = {"5", "10", "15", "20", "25", "30", "35", "40", "45", "50"};
    int selPageCount, selInitial, selEnd, selPageNumber;
    Typeface typeface;
    String roleName,selTab, selDoctor = null, selFromDate = null, selToDate = null, selStatus = null, selStatusId = null, selPaymentStatus = null, refereshStatus = null;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();
    ArrayList<Integer> pages = new ArrayList<>();
    TextView txtClearFilter;
    ImageView imgClose;

    Button add_new;
    boolean isFilterSet = false;
    boolean isUserInteraction = false;
    private long lastCallTime = 0;

    private Bitmap bitmap = null;
    private Canvas canvas;
    private Paint paint = new Paint();
    private Bitmap newBitmap = Bitmap.createBitmap(240, 320, Bitmap.Config.ARGB_8888);

    private ProgressBar appointment_progress;
    private RecyclerView recyclerView;

    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable debounceRunnable;
    private static final long DEBOUNCE_DELAY = 1500;

    boolean isLoading = false;

    List<ExistPatientDetail.Detail> patientList = new ArrayList<>();
    ExistingPatientAdapter adapter = new ExistingPatientAdapter();

    int currentAdapterPage = 1;

    private NfcAdapter nfcAdapter;
    private PendingIntent pendingIntent;

    private String RPT="";
    private String listIndexs="";
    @SuppressLint("WrongConstant")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_appointment, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.appointment);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        OPHubApplication.relFragment = relativeLayout;
        OPHubApplication.relMain = relMain;
        relativeLayout.setVisibility(View.INVISIBLE);
        String name = OPHubApplication.getStaffName();
        hospitalId = OPHubApplication.getHospitalId();
        StaffId = OPHubApplication.getStaffId();
        roleName = OPHubApplication.getUserType();
        if (roleName.equalsIgnoreCase("Doctor"))
            name = "Dr. " + name;
        isFilterSet = OPHubApplication.isTodayApptFilterSet();
        selFromDate = OPHubApplication.getSelFromDate();
        selToDate = OPHubApplication.getSelToDate();
        selDoctor = OPHubApplication.getTodaySelDoctor();
        selStatus = OPHubApplication.getTodaySelApptStatus();
        selStatusId = OPHubApplication.getTodaySelApptStatusId();
        selPaymentStatus = OPHubApplication.getSelPaymentStatus();
        listIndexs = OPHubApplication.getClickedIndex();
        Log.d("listIndexss", "onCreateView: "+listIndexs);
        Bundle bundle = getArguments();
        if (bundle != null) {
            RPT = bundle.getString("VITALS");
            Log.d("rttt", "rtttt: "+RPT);
        }




        Log.i("mylog", "sel doctorrrrr:" + selDoctor + " selFromDate: " + selFromDate + "  selToDate:" + selToDate + "  selStatus:" + selStatus);
        if (isFilterSet) {
            imgFilter.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.filter_sel));
            //  selFromDate = OPHubApplication.getSelFromDate();
        } else {
            imgFilter.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.filter));
        }
        txtWelcome.setText("Welcome, " + name);
        initParams();
        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
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

        selTab = OPHubApplication.selTab;

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
            isUserInteraction = true;
            spinPages.setSelection(1);
        }
        else {
            isUserInteraction = true;
            spinPages.setSelection(index);
        }
        getAppointmentStatus(String.valueOf(hospitalId));

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        Log.i("myLog", "clicked appointments");
                        selTab = "todayAppointment";
                        isFilterSet = OPHubApplication.isTodayApptFilterSet();
                        selFromDate = OPHubApplication.gettodaySelFromDate();
                        selToDate = OPHubApplication.gettodaySelToDate();
                        selDoctor = OPHubApplication.getTodaySelDoctor();
                        selStatus = OPHubApplication.getTodaySelApptStatus();
                        selStatusId = OPHubApplication.getTodaySelApptStatusId();
                        selPaymentStatus = OPHubApplication.getTodaySelPaymentStatus();
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        System.out.println("print isFilterSet"+isFilterSet);
                        if (isFilterSet)
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
                        else
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        boolean isChecked = checkConnection();
                        if (isChecked)
                            getAppointmentsToday(null, null, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                        else
                            showAlert(isChecked);
                        // getAppointments(null, null, null, null, null, "");
                        break;
                    case 1:
                        Log.i("myLog", "clicked appointments");
                        selTab = "Appointment";
                        isFilterSet = OPHubApplication.isApptFilterSet();
                        selFromDate = OPHubApplication.getSelFromDate();
                        selToDate = OPHubApplication.getSelToDate();
                        selDoctor = OPHubApplication.getSelDoctor();
                        selStatus = OPHubApplication.getSelApptStatus();
                        selStatusId = OPHubApplication.getSelApptStatusId();
                        selPaymentStatus = OPHubApplication.getSelPaymentStatus();
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        if (isFilterSet)
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
                        else
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        boolean isChecked2 = checkConnection();
                        if (isChecked2)
                            getAppointments(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                        else
                            showAlert(isChecked2);
                        // getAppointments(null, null, null, null, null, "");
                        break;
                    case 2:
                        Log.i("myLog", "clicked appointments history");
                        selTab = "History";
                        isFilterSet = OPHubApplication.isHistFilterSet();
                        selFromDate = OPHubApplication.getHistSelFromDate();
                        selToDate = OPHubApplication.getHistSelToDate();
                        selDoctor = OPHubApplication.getHistSelDoctor();
                        selStatus = OPHubApplication.getHistSelApptStatus();
                        selStatusId = OPHubApplication.getHistSelApptStatusId();
                        selPaymentStatus = OPHubApplication.getHistSelPaymentStatus();
                        if (isFilterSet)
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
                        else
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));

                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        boolean isChecked1 = checkConnection();
                        if (isChecked1)
                            getAppointmentsHistory(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                        else
                            showAlert(isChecked1);
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
            txtParam = new TableRow.LayoutParams((width - dpToPx(280)) / 6, dpToPx(35));
            txtParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            patientIdParam = new TableRow.LayoutParams(dpToPx(100), dpToPx(35));
            lineParam = new TableRow.LayoutParams(width - dpToPx(80), dpToPx(1));
            lineParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam.span = 8;
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            noDataParam = new TableRow.LayoutParams(dpToPx(270), dpToPx(260));
            noDataParam.span = 8;
            chkBoxParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            chkBoxParam.setMargins(dpToPx(20), 0, dpToPx(20), 0);

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            textSize = 16;
            txtParam = new TableRow.LayoutParams((width - dpToPx(110)) / 8, dpToPx(35));
            txtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            lineParam = new TableRow.LayoutParams((width - dpToPx(110)), dpToPx(1));
            // lineParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            lineParam.span = 8;
            patientIdParam = new TableRow.LayoutParams(dpToPx(100), dpToPx(35));
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            noDataParam = new TableRow.LayoutParams(dpToPx(270), dpToPx(260));
            noDataParam.span = 8;
            chkBoxParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            chkBoxParam.setMargins(dpToPx(20), 0, dpToPx(20), 0);

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_NORMAL) {
            textSize = 16;
            txtParam = new TableRow.LayoutParams((width - dpToPx(110)) / 8, dpToPx(35));
            txtParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            lineParam = new TableRow.LayoutParams((width - dpToPx(110)), dpToPx(1));
            //lineParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            lineParam.span = 8;
            patientIdParam = new TableRow.LayoutParams(dpToPx(100), dpToPx(35));
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            noDataParam = new TableRow.LayoutParams(dpToPx(270), dpToPx(260));
            noDataParam.span = 8;
            chkBoxParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            chkBoxParam.setMargins(dpToPx(20), 0, dpToPx(20), 0);
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    @OnClick(R.id.imgRefresh)
    public void refersh() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            if (selStatus != null) {
                if (selStatus.equalsIgnoreCase("Requested")) {
                    refereshStatus = "1";
                } else if (selStatus.equalsIgnoreCase("Reserved")) {
                    refereshStatus = "2";
                } else if (selStatus.equalsIgnoreCase("Approved")) {
                    refereshStatus = "3";
                } else if (selStatus.equalsIgnoreCase("Cancelled")) {
                    refereshStatus = "4";
                } else if (selStatus.equalsIgnoreCase("Inprocess")) {
                    refereshStatus = "5";
                } else if (selStatus.equalsIgnoreCase("Completed")) {
                    refereshStatus = "6";
                }
            }
            if (selTab.equalsIgnoreCase("todayAppointment")){
                getAppointmentsToday(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
            }
            else if (selTab.equalsIgnoreCase("Appointment")) {
                getAppointments(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
            }else
                getAppointmentsHistory(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
        }
    }

    @SuppressLint("ResourceType")
    @OnClick(R.id.btn_book_appointment)
    public void clickBookAppointment() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

//            relativeLayout.removeAllViews();
//            PatientIdSearchFragment newFragment = new PatientIdSearchFragment();
//            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
//            transaction.replace(R.id.fragment_container, newFragment);
//            transaction.addToBackStack(null);
//            transaction.commit();
//            String[] strings3 = {"udhaya", "kumar", "Plenome"};
//            int[] colsAlign3 = {0, 1, 2};
//            ILcdManager.getInstance(getActivity()).sendLCDMultiString(strings3, colsAlign3);

            showBookAppoinment();


//            Bitmap bitmap1 = BitmapFactory.decodeResource(getResources(), R.drawable.plenome_icon);
//            ILcdManager.getInstance(getActivity()).sendLCDBitmap(bitmap1);
//            System.out.println("print second");


            new Thread(() -> {
                Looper.prepare();
                Looper.loop();
            }).start();

        }
    }


    public void showBookAppoinment() {
        dilogAppointment = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dilog_book_appointment, null);
        dilogAppointment.setContentView(view);
        dilogAppointment.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dilogAppointment.getWindow().setGravity(Gravity.CENTER);
        imgClose = dilogAppointment.findViewById(R.id.imgClose);
        edtPatientId = dilogAppointment.findViewById(R.id.edtPatientId);
        add_new = dilogAppointment.findViewById(R.id.add_new);
        appointment_progress = dilogAppointment.findViewById(R.id.appointment_progress);
        recyclerView = dilogAppointment.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);

        add_new.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dilogAppointment.dismiss();
                AddNewPatientFragment newFragment = new AddNewPatientFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                Bundle result = new Bundle();
                result.putString("from_screen", "Patient_id_search");
                result.putBoolean("nfc", false);
                if (edtPatientId.length()==10){
                    result.putString("phone", edtPatientId.getText().toString());
                }
                newFragment.setArguments(result);
                transaction.replace(R.id.fragment_container, newFragment);
                transaction.addToBackStack(null);
                transaction.commit();

            }
        });


//        edtPatientId.setOnEditorActionListener(new TextView.OnEditorActionListener() {
//            @Override
//            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
//                if (actionId == EditorInfo.IME_ACTION_DONE) {
//                    String text = edtPatientId.getText().toString();
//                    Log.i("mylog", "text: " + text);
//                    getExistPatientDet(text.toString());
//                }
//                return false;
//
//            }
//        });


        edtPatientId.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                appointment_progress.setVisibility(View.VISIBLE);
                recyclerView.setVisibility(View.GONE);

                if (debounceRunnable != null) {
                    handler.removeCallbacks(debounceRunnable);
                }

                debounceRunnable = new Runnable() {
                    @Override
                    public void run() {
                        getExistPatientDet(s.toString(),1);
                        currentAdapterPage = 1;
                    }
                };
                handler.postDelayed(debounceRunnable, DEBOUNCE_DELAY);
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dilogAppointment.dismiss();
            }
        });
        changeHintDynamically(edtPatientId);

        dilogAppointment.show();
    }

    private void changeHintDynamically(EditText editText) {
        String[] hints = {"Search for patient mobile number", "Search for patient name", "Search for patient ID"};
        Handler handler = new Handler();
        Runnable runnable = new Runnable() {
            int index = 0;

            @Override
            public void run() {
                editText.setHint(hints[index]);
                index = (index + 1) % hints.length;
                handler.postDelayed(this, 1500);
            }
        };
        handler.post(runnable);
    }


    private void getExistPatientDet(String value, Integer page) {
        OPHubRequests.GetExistPatientDetReq request = new OPHubRequests.GetExistPatientDetReq();
        request.setHospitalId(hospitalId);
        request.setValue(value);
        Log.i("mylog", "getExistPatientDet request:" + new Gson().toJson(request));
        Call<ExistPatientDetail> call = services.getExistingPatientV2(request, 100,page);
        call.enqueue(new Callback<ExistPatientDetail>() {

            @Override
            public void onResponse(Call<ExistPatientDetail> call, Response<ExistPatientDetail> response) {
                try {
                    appointment_progress.setVisibility(View.GONE);
                    if (response.body() != null) {
                        isLoading = false;
                        ExistPatientDetail resp = response.body();
    //                    Log.i("mylog", "getExistPatientDet response:" + new Gson().toJson(response.body()));


                        LinearLayout noRecord = dilogAppointment.findViewById(R.id.lyt_no_record);
                        Button add_new = dilogAppointment.findViewById(R.id.add_new);
                        add_new.setVisibility(View.VISIBLE);
                        if (resp.getDetails().isEmpty()) {
                            if (page <= 1) {
                                recyclerView.setVisibility(View.GONE);
                                noRecord.setVisibility(View.VISIBLE);
                            }
                        }else {
                            recyclerView.setVisibility(View.VISIBLE);
                            noRecord.setVisibility(View.GONE);
                            ExistPatientDetail users = response.body();

                            if (page <= 1){
                                patientList.clear();
                                adapter.notifyDataSetChanged();
                            }
                            patientList.addAll(users.getDetails());
                            adapter.PatientAdapter(patientList);
                            if (page >= 1)
                                adapter.notifyItemRangeInserted(patientList.size(), users.getDetails().size());

                            recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                                @Override
                                public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                                    super.onScrolled(recyclerView, dx, dy);

                                    LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                                    if (layoutManager != null && dy > 0) {
                                        int visibleItemCount = layoutManager.getChildCount();
                                        int totalItemCount = layoutManager.getItemCount();
                                        int pastVisibleItems = layoutManager.findFirstVisibleItemPosition();

                                        if (!isLoading && (visibleItemCount + pastVisibleItems) >= totalItemCount) {
                                            isLoading = true;
                                            currentAdapterPage++;
                                            getExistPatientDet(value,currentAdapterPage);
                                        }
                                    }
                                }
                            });

                            adapter.setOnClickListener(new ExistingPatientAdapter.OnClickListener() {
                                @Override
                                public void onClick(int position, ExistPatientDetail.Detail detail) {
                                    System.out.println("print inside call" + detail.getAayushUniqueId());
                                    dilogAppointment.dismiss();
                                    PatientProfileFragment newFragment = new PatientProfileFragment();
                                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                    Bundle result = new Bundle();
                                    result.putString("from_screen", "Main");
                                    result.putString("qr_type", "Patient_QR");
                                    result.putString("aayush_unique_id", detail.getAayushUniqueId());
                                    newFragment.setArguments(result);
                                    transaction.replace(R.id.fragment_container, newFragment);
                                    transaction.addToBackStack(null);
                                    transaction.setReorderingAllowed(true);
                                    transaction.commitAllowingStateLoss();
                                }
                            });
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ExistPatientDetail> call, Throwable t) {
                Log.i("myLog", "getExistPatientDet response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

//
//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//
//        if (requestCode == 1) {
//            System.out.println("print inide");
//            Uri uri = (data != null) ? data.getData() : null;
//            ContentResolver cr = this.getActivity().getContentResolver();
//            try {
//                if (cr == null) return;
//                if (uri == null) return;
//
//                Bitmap bitmap = BitmapFactory.decodeStream(cr.openInputStream(uri));
//                // Set the image to the ImageView to display it
////                ImageView imageView = findViewById(R.id.iv);
//
//                // BitmapUtils.saveBmp(bitmap);
//                // bitmap = ILcdManager.toRGB565Bmp(bitmap);
//                /* Set the Bitmap to the ImageView */
////                imageView.setImageBitmap(bitmap);
//
    ////                if (isClick == 0) {
    ////                    ILcdManager.getInstance(getContext()).sendLCDBitmap(bitmap);
    ////                } else {
    ////                    ILcdManager.getInstance(getContext()).sendLCDBitmap(cr.openInputStream(uri), cr.openInputStream(uri));
    ////                }
//            } catch (FileNotFoundException e) {
//                Log.e("Exception", e.toString());
//            }
//        }
//    }

//    private Bitmap getTextBitmap(
//            String firstLine, String secondLine, String thirdLine,
//            String fourthLine, String fifthLine, String sixthLine, String seventhLine) {
//
//        // Create a new Bitmap
//        Bitmap newBitmap = Bitmap.createBitmap(240, 320, Bitmap.Config.ARGB_8888);
//
//        // Create a Canvas to draw on the Bitmap
//        Canvas canvas = new Canvas(newBitmap);
//
//        // Fill the canvas with black color
//        canvas.drawColor(Color.BLACK);
//
//        // Create a Paint object to define text properties
//        Paint paint = new Paint();
//        paint.setTypeface(Typeface.create("Arial", Typeface.NORMAL));  // Set the font type
//        paint.setTextSize(25f);  // Set text size
//        paint.setColor(Color.WHITE);  // Set text color to white
//
//        // Draw the text lines if they are not null
//        if (firstLine != null) {
//            canvas.drawText(firstLine, 10.0f, 30.0f, paint);
//        }
//        if (secondLine != null) {
//            canvas.drawText(secondLine, 10.0f, 70.0f, paint);
//        }
//        if (thirdLine != null) {
//            canvas.drawText(thirdLine, 10.0f, 110.0f, paint);
//        }
//        if (fourthLine != null) {
//            canvas.drawText(fourthLine, 10.0f, 150.0f, paint);
//        }
//        if (fifthLine != null) {
//            canvas.drawText(fifthLine, 10.0f, 190.0f, paint);
//        }
//        if (sixthLine != null) {
//            canvas.drawText(sixthLine, 10.0f, 230.0f, paint);
//        }
//        if (seventhLine != null) {
//            canvas.drawText(seventhLine, 10.0f, 270.0f, paint);
//        }
//
//        // Return the Bitmap with the drawn text
//        return newBitmap;
//    }

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
                getAppointmentsHistory(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));

            } else if (selTab.equalsIgnoreCase("todayAppointment")) {
                Log.i("myLog", "todayAppointment selected");
                tabLayout.getTabAt(0).select();
                getAppointmentsToday(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
            }
            else {
                Log.i("myLog", "appt selected");
                tabLayout.getTabAt(1).select();
                Log.i("mgLog", "selFromDate:" + selFromDate + "  selToDate:" + selToDate + "   selDoctor:" + selDoctor + "   selStatus:" + selStatus + "   selPaymentStatus:" + selPaymentStatus);
                getAppointments(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
            }
        }
    }

    @OnClick(R.id.imgFilter)
    public void filterClicked() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            showFilterDialog();
        }
    }


    @OnClick(R.id.imgPrev)
    public void prevClicked() {
        if (totPage > 4) {
            if (currentPage <= 1)
                Toast.makeText(getActivity(), "No previous data available", Toast.LENGTH_SHORT).show();
            else {
                currentPage = currentPage - 1;
                showPrevNextPages1(listResp, "Prev");
                if (selTab.equalsIgnoreCase("todayAppointment")){
                    getAppointmentsToday(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                else if (selTab.equalsIgnoreCase("Appointment")) {
                    getAppointments(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }else
                    getAppointmentsHistory(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));

                ////Log.i("myLog", "initial page:" + initPageNo + "   end page:" + endPageNo + "  curr page:" + currentPage);

            }
        }

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
                ////Log.i("myLog", "1111111111111111 initial page:" + initPageNo + "   end page:" + endPageNo + "  curr page:" + currentPage + "  totpage:" + totPage);
                showPrevNextPages1(listResp, "Next");
                if (selTab.equalsIgnoreCase("todayAppointment")){
                    getAppointmentsToday(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                else if (selTab.equalsIgnoreCase("Appointment")) {
                    getAppointments(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }else
                    getAppointmentsHistory(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));

            }
        }
    }

    private void getAppointmentsToday(String fromDate, String toDate, String doctorId, String appointStatus, String paymentStatus, String option, String limit, String page) {
        if (listResp != null) listResp.clear();
        Log.i("myLog", "getAppointments");
        progressBar.setVisibility(View.VISIBLE);
        if(roleName.equalsIgnoreCase("Doctor")){
            doctorId = String.valueOf(StaffId);
        }
        //Log.i("myLog", "getAppointments fromDate:" + fromDate + "  toDate:" + toDate + "  doctorId:" + doctorId + "  appointStatus:" + appointStatus + "  hospitalId:" + hospitalId);
        services.getV2AppointmentsToday(fromDate, toDate, doctorId, appointStatus, paymentStatus, hospitalId, limit,page).enqueue(new Callback<GetAppointmentResponse>() {
            @Override
            public void onResponse(Call<GetAppointmentResponse> call, Response<GetAppointmentResponse> response) {
                try {
                    Log.i("myLog", "getAppointments onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetAppointmentResponse.Datum> list = response.body().getData();
                        listResp = list;
                        if (response.body().getTotal() != null){
                            totSize =  Integer.parseInt(response.body().getTotal().toString());
                        }else {
                            totSize = 0;
                        }
                        //Log.i("myLog", "getAppointments onResponse: size:" + totSize);
                        if (option != null && option.equalsIgnoreCase("update") || option.equalsIgnoreCase("Tracking")) {
                            showAppointments(selInitial, selEnd, option);
                        } else {
                            showInitialList1(list, option);
                        }
                        //showInitialList1(listResp, option);
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                    if (progressBar.getVisibility() == View.VISIBLE)
                        progressBar.setVisibility(View.GONE);
                } catch (Exception e) {
                    System.out.println("print catch ");
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetAppointmentResponse> call, Throwable t) {
                Log.i("myLog", " getAppointments failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //     call.clone().enqueue(this);
                if (progressBar.getVisibility() == View.VISIBLE)
                    progressBar.setVisibility(View.GONE);
                //  call.clone().enqueue(this);
            }
        });
    }

    private void getAppointments(String fromDate, String toDate, String doctorId, String appointStatus, String paymentStatus, String option, String limit, String page) {
        if (listResp != null) listResp.clear();
        Log.i("myLog", "getAppointments");
        progressBar.setVisibility(View.VISIBLE);
        if(roleName.equalsIgnoreCase("Doctor")){
            doctorId = String.valueOf(StaffId);
        }
        //Log.i("myLog", "getAppointments fromDate:" + fromDate + "  toDate:" + toDate + "  doctorId:" + doctorId + "  appointStatus:" + appointStatus + "  hospitalId:" + hospitalId);
        services.getV2Appointments(fromDate, toDate, doctorId, appointStatus, paymentStatus, hospitalId, limit,page).enqueue(new Callback<GetAppointmentResponse>() {
            @Override
            public void onResponse(Call<GetAppointmentResponse> call, Response<GetAppointmentResponse> response) {
                try {
                    Log.i("myLog", "getAppointments onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetAppointmentResponse.Datum> list = response.body().getData();
                        listResp = list;
                        if (response.body().getTotal() != null){
                            totSize =  Integer.parseInt(response.body().getTotal().toString());
                        }else {
                            totSize = 0;
                        }
                        //Log.i("myLog", "getAppointments onResponse: size:" + totSize);
                        if (option != null && option.equalsIgnoreCase("update") || option.equalsIgnoreCase("Tracking")) {
                            showAppointments(selInitial, selEnd, option);
                        } else {
                            showInitialList1(list, option);
                        }
                        //showInitialList1(listResp, option);
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                    if (progressBar.getVisibility() == View.VISIBLE)
                        progressBar.setVisibility(View.GONE);
                } catch (NumberFormatException e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetAppointmentResponse> call, Throwable t) {
                Log.i("myLog", " getAppointments failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //     call.clone().enqueue(this);
                if (progressBar.getVisibility() == View.VISIBLE)
                    progressBar.setVisibility(View.GONE);
                //  call.clone().enqueue(this);
            }
        });
    }

    private void getAppointmentsHistory(String fromDate, String toDate, String doctorId, String appointStatus, String paymentStatus, String option, String limit, String page) {
        if (listResp != null) listResp.clear();
        Log.i("myLog", "getAppointmentsHistory");
        if(roleName.equalsIgnoreCase("Doctor")){
            doctorId = String.valueOf(StaffId);
        }
        progressBar.setVisibility(View.VISIBLE);
        services.getV2AppointmentHistory(fromDate, toDate, doctorId, appointStatus, paymentStatus, hospitalId, limit,page).enqueue(new Callback<GetAppointmentResponse>() {

            @Override
            public void onResponse(Call<GetAppointmentResponse> call, Response<GetAppointmentResponse> response) {
                try {
                    Log.i("myLog", "getAppointmentsHistory onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetAppointmentResponse.Datum> list = response.body().getData();
                        listResp = list;
                        if (response.body().getTotal() != null){
                            totSize =  Integer.parseInt(response.body().getTotal().toString());
                        }else {
                            totSize = 0;
                        }
                        showInitialList1(list, option);
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
            public void onFailure(Call<GetAppointmentResponse> call, Throwable t) {
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                Log.i("mylog", "history failure:" + t.getMessage());
                if (progressBar.getVisibility() == View.VISIBLE)
                    progressBar.setVisibility(View.GONE);
            }

        });
    }

    private void getDoctors(String hospID) {
        Log.i("myLog", "getDoctors");
        Log.i("myLog", "hospID:" + hospID);
        services.getDoctors(hospID).enqueue(new Callback<List<GetDoctorResponse>>() {

            @Override
            public void onResponse(Call<List<GetDoctorResponse>> call, Response<List<GetDoctorResponse>> response) {
                try {
                    Log.i("myLog", "getDoctors onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<GetDoctorResponse> list = response.body();
                        int size = list.size();
                        ArrayList<String> doctorName = new ArrayList<>();
                        doctorId = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            GetDoctorResponse resp = list.get(start);
                            doctorName.add(resp.getInternalDoctorName());
                            doctorId.add(resp.getInternalDoctorId());
                            //   Log.i("myLog", "doctorId:" + resp.getInternalDoctorId() + "   doctor name:" + resp.getInternalDoctorName());
                        }
                        OPHubUtils.addProdTypeSpinner(getActivity(), doctorName, spinDoctor, "Select Doctor");
                        Log.i("myLog", "selDoctor:" + selDoctor);
                        if (selDoctor != null) {
                            int index = doctorId.indexOf(Integer.parseInt(selDoctor));
                            Log.i("myLog", "index:" + index);
                            spinDoctor.setSelection(index);
                        }
                        Log.i("myLog", "doctor end:");
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<List<GetDoctorResponse>> call, Throwable t) {
                //  OPHubUtils.showUnknownErrorDialog(getActivity());
                call.clone().enqueue(this);
            }

        });
    }


    private void getAppointmentStatus(String hospId) {
        //Log.i("myLog", "getAppointmentStatus hospId:" + hospId);
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
                     /*   ArrayAdapter adapter = new ArrayAdapter(getActivity(),
                                android.R.layout.simple_spinner_item, status);
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        spinStatus.setAdapter(adapter);*/
                        if (spinStatus != null)
                            OPHubUtils.addProdTypeSpinner(getActivity(), status, spinStatus, "Select status");
                        if (selStatus != null && spinStatus != null) {
                            int index = status.indexOf(selStatus);
                            spinStatus.setSelection(index);
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
                //Log.i("myLog", "getAppointmentStatus onFailure:" + t.getMessage());
                // OPHubUtils.showUnknownErrorDialog(getActivity());
                //  call.clone().enqueue(this);
            }

        });
    }


    private void getPaymentStatus() {
        services.getPaymentStatus().enqueue(new Callback<List<PaymentStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.PaymentStatusResponse>> call, Response<List<PaymentStatusResponse>> response) {
                try {
                    Log.i("myLog", "getPaymentStatus onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<PaymentStatusResponse> list = response.body();
                        int size = list.size();
                        paymentStatus = new ArrayList<>();
                        paymentStatusId = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            PaymentStatusResponse resp = list.get(start);
                            paymentStatus.add(resp.getStatus());
                            paymentStatusId.add(resp.getId());
                        }
                        if (paymentStatus != null)
                            OPHubUtils.addProdTypeSpinner(getActivity(), paymentStatus, spinPaymentStatus, "Select payment status");
                        if (selPaymentStatus != null) {
                            int index = paymentStatus.indexOf(selPaymentStatus);
                            spinPaymentStatus.setSelection(index);
                        }
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<PaymentStatusResponse>> call, Throwable t) {
                Log.i("myLog", "getPaymentStatus onFailure:" + t.getMessage());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    public void showFilterDialog() {
        dialogFilter = new Dialog(getActivity());
        String roleName = OPHubApplication.getUserType();
        View view = getLayoutInflater().inflate(R.layout.dialog_appointment_filter, null);
        dialogFilter.setContentView(view);
        dialogFilter.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogFilter.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogFilter.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogFilter.findViewById(R.id.btnSubmit);
        TextView txtFromDate = dialogFilter.findViewById(R.id.txtTitleFromDate);
        TextView txtToDate = dialogFilter.findViewById(R.id.txtTitleToDate);
        spinDoctor = dialogFilter.findViewById(R.id.spinDoctor);
        spinStatus = dialogFilter.findViewById(R.id.spinStatus);
        edtFromDate = dialogFilter.findViewById(R.id.edtFromDate);
        edtToDate = dialogFilter.findViewById(R.id.edtToDate);
        spinPaymentStatus = dialogFilter.findViewById(R.id.spinPaymentStatus);
        txtClearFilter = dialogFilter.findViewById(R.id.txtClearFilter);
        imgClose = dialogFilter.findViewById(R.id.imgClose);
        RelativeLayout relativespineer = dialogFilter.findViewById(R.id.spinnerDoctor);
        TextView doctorTitle = dialogFilter.findViewById(R.id.doctorTitle);

        if (roleName.equalsIgnoreCase("Doctor")  ){
            relativespineer.setVisibility(View.GONE);
            doctorTitle.setVisibility(View.GONE);
        }

        if(selTab.equalsIgnoreCase("todayAppointment")){
            edtFromDate.setVisibility(View.GONE);
            edtToDate.setVisibility(View.GONE);
            txtFromDate.setVisibility(View.GONE);
            txtToDate.setVisibility(View.GONE);
        }
        else {
            edtFromDate.setVisibility(View.VISIBLE);
            edtToDate.setVisibility(View.VISIBLE);
            txtFromDate.setVisibility(View.VISIBLE);
            txtToDate.setVisibility(View.VISIBLE);
        }


        if (selFromDate != null)
            edtFromDate.setText(selFromDate);

        if (selToDate != null)
            edtToDate.setText(selToDate);

        Log.i("mylog", "sel doctorrrrr:" + selDoctor);

        getDoctors(String.valueOf(hospitalId));
        getAppointmentStatus(String.valueOf(hospitalId));
        getPaymentStatus();
        edtFromDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Log.i("myLog", "from date clicked");
                setFromDateCalender("from", 0);
            }
        });
        edtToDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Log.i("myLog", "edtToDate date clicked");
                setFromDateCalender("to", 0);
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

        txtClearFilter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                int pos = tabLayout.getSelectedTabPosition();
                currentPage = 1;
                initPageNo = 1;
                selInitial = 0;
                selEnd = 0;
                selPageNumber = 1;
                selFromDate = null;
                selToDate = null;
                selDoctor = null;
                selStatus = null;
                selStatusId = null;
                selPaymentStatus = null;
                if (pos == 0) {
                    PreferenceManager.setBoolean(PreferenceManager.TODAY_APPOINTMENT_FILTER, false);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_DOCTOR, selDoctor);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_STATUS, selStatus);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_PAYMENT_STATUS, selStatusId);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_STATUS_ID, selPaymentStatus);
                    getAppointmentsToday(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));

                } else if (pos == 1) {
                    PreferenceManager.setBoolean(PreferenceManager.APPOINTMENT_HIST_FILTER, false);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_FROM_DATE, selFromDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_TO_DATE, selToDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_DOCTOR, selDoctor);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS, selStatus);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS_ID, selStatusId);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_PAYMENT_STATUS, selPaymentStatus);
                    getAppointments(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                else if (pos == 2) {
                    PreferenceManager.setBoolean(PreferenceManager.APPOINTMENT_HIST_FILTER, false);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_FROM_DATE, selFromDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_TO_DATE, selToDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_DOCTOR, selDoctor);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS, selStatus);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS_ID, selStatusId);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_PAYMENT_STATUS, selPaymentStatus);
                    getAppointmentsHistory(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                dialogFilter.dismiss();
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
            }
        });
        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // String doctor = null, status = null;
                selFromDate = edtFromDate.getText().toString();
                selToDate = edtToDate.getText().toString();
                if (spinDoctor.getSelectedItem() != null)
                    selDoctor = spinDoctor.getSelectedItem().toString();
                selStatusId = null;
                selPaymentStatus = spinPaymentStatus.getSelectedItem().toString();
                selStatus = spinStatus.getSelectedItem().toString();
                if (!selStatus.contains("Select status")) {
                    int pos = spinStatus.getSelectedItemPosition();
                    Log.i("myLog", "Pos:" + pos);
                    selStatusId = String.valueOf(statusId.get(pos));
                }
                if (selFromDate.length() == 0)
                    selFromDate = null;
                if (selToDate.length() == 0)
                    selToDate = null;
                if (selDoctor.equalsIgnoreCase("Select Doctor"))
                    selDoctor = null;
                else {
                    int pos = spinDoctor.getSelectedItemPosition();
                    selDoctor = String.valueOf(doctorId.get(pos));
                }
                if (selStatus.equalsIgnoreCase("Select Status"))
                    selStatus = null;
                if (selPaymentStatus.equalsIgnoreCase("Select payment status"))
                    selPaymentStatus = null;

                int pos = tabLayout.getSelectedTabPosition();
                String text = spinPages.getSelectedItem().toString();
                selPageCount = Integer.parseInt(text);
                PreferenceManager.setInt(PreferenceManager.PAGE_COUNT, selPageCount);
                currentPage = 1;
                initPageNo = 1;
                selInitial = 0;
                selEnd = 0;
                selPageNumber = 1;
                if (pos == 0) {
                    PreferenceManager.setBoolean(PreferenceManager.TODAY_APPOINTMENT_FILTER, true);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_FROM_DATE, null);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_TO_DATE, null);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_DOCTOR, selDoctor);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_STATUS, selStatus);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_PAYMENT_STATUS, selStatusId);
                    PreferenceManager.setString(PreferenceManager.TODAY_APPT_STATUS_ID, selPaymentStatus);
                    getAppointmentsToday(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));

                } else if (pos == 1) {
                    PreferenceManager.setBoolean(PreferenceManager.APPOINTMENT_HIST_FILTER, true);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_FROM_DATE, selFromDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_TO_DATE, selToDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_DOCTOR, selDoctor);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS, selStatus);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS_ID, selStatusId);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_PAYMENT_STATUS, selPaymentStatus);
                    getAppointments(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                else if (pos == 2) {
                    PreferenceManager.setBoolean(PreferenceManager.APPOINTMENT_HIST_FILTER, true);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_FROM_DATE, selFromDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_TO_DATE, selToDate);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_DOCTOR, selDoctor);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS, selStatus);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_STATUS_ID, selStatusId);
                    PreferenceManager.setString(PreferenceManager.APPT_HIST_PAYMENT_STATUS, selPaymentStatus);
                    getAppointmentsHistory(selFromDate, selToDate, selDoctor, selStatusId, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                }
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));

                dialogFilter.dismiss();
            }
        });
        dialogFilter.show();
    }



    public void showRescheduleDialog(String apptId, String doctorName, int doctorId) {
        dialogReschedule = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.alert_reschedule, null);
        dialogReschedule.setContentView(view);
        //  dialogReschedule.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogReschedule.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogReschedule.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogReschedule.findViewById(R.id.btnSave);
        EditText edtDocName = dialogReschedule.findViewById(R.id.edtDocName);
        EditText edtMessage = dialogReschedule.findViewById(R.id.edtMsg);
        Spinner spinStatus = dialogReschedule.findViewById(R.id.spinStatus);
        edtDate = dialogReschedule.findViewById(R.id.edtDate);
        spinSlotTime = dialogReschedule.findViewById(R.id.spinSlotTime);
        getAppointmentStatus(String.valueOf(hospitalId));
        edtDocName.setText(doctorName);
        if (status.contains("Reschedule"))
            status.remove("Reschedule");
        ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, status);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinStatus.setAdapter(adapter);
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogReschedule.dismiss();
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String date = edtDate.getText().toString();

                if (date.isEmpty()) {
                    Toast.makeText(getActivity(), "Please select date", Toast.LENGTH_SHORT).show();
                    return;
                }
                String slot = spinSlotTime.getSelectedItem().toString();
                int pos = spinSlotTime.getSelectedItemPosition();
                int shiftId = alShiftId.get(pos);
                int globalShiftId = alGlobalShiftId.get(pos);
                String status = spinStatus.getSelectedItem().toString();
                rescheduleAppt(apptId, date, slot, doctorId, shiftId, globalShiftId, status);
                dialogReschedule.dismiss();
            }
        });
        edtDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Log.i("myLog", "from date clicked");
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

    public void showStatusDialog(int index, String apptId, String statusTxt, String doctorName, String doctorId) {
        //Log.i("myLog", " showStatusDialog index:" + index);
        dialogStatus = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.status_sel_popup, null);
        dialogStatus.setContentView(view);
        //  dialogReschedule.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogStatus.getWindow().setGravity(Gravity.CENTER);
        TextView txtName = dialogStatus.findViewById(R.id.txtName);
        ListView listView = dialogStatus.findViewById(R.id.listView);
        txtName.setText(statusTxt);
        //Log.i("myLog", "statusTxt:" + statusTxt);
        if (status != null) {
            if (!status.contains("Reschedule"))
                status.add("Reschedule");
            ArrayAdapter<String> adapter = new ArrayAdapter<String>(getContext(), android.R.layout.simple_list_item_1, status);
            listView.setAdapter(adapter);
        }
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                String statusSel = status.get(position);
                //Log.i("myLog", "sel apptid:" + apptId);
                if (statusSel.equalsIgnoreCase("Reschedule"))
                    showRescheduleDialog(apptId, doctorName, Integer.parseInt(doctorId));
                else
                    updateApptStatus(index, apptId, statusSel, statusTxt);

            }
        });
        dialogStatus.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogStatus.getWindow().getAttributes());
        lp.width = dpToPx(250);
        lp.height = dpToPx(450);
        dialogStatus.getWindow().setAttributes(lp);
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
        // at last we are calling show to
        // display our date picker dialog.
        if (selTab.equalsIgnoreCase("History")) {
            if (option.equalsIgnoreCase("from")) {
                c.add(Calendar.DAY_OF_MONTH, -1);
                datePickerDialog.getDatePicker().setMaxDate(c.getTimeInMillis());
            } else if (option.equalsIgnoreCase("to")) {
                c.add(Calendar.DAY_OF_MONTH, -1);
                datePickerDialog.getDatePicker().setMaxDate(c.getTimeInMillis());
            }
        } else {
            if (option.equalsIgnoreCase("from")) {
                Date date1 = new Date();
                datePickerDialog.getDatePicker().setMinDate(date1.getTime());
            } else if (option.equalsIgnoreCase("to")) {
                Date date1 = new Date();
                datePickerDialog.getDatePicker().setMinDate(date1.getTime());
            }
        }
        datePickerDialog.show();
    }

    private void showAppointments(int initial, int end, String option) {
        Log.i("myLog", "showAppointments: initial:" + initial + "   end:" + end);
        tblView.removeAllViews();
//        totSize = listResp.size();
        //Log.i("myLog", "showAppointments list size:" + listResp.size());
        if (totSize <= 0) {
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            //Toast.makeText(getActivity(), "No data found", Toast.LENGTH_SHORT).show();
            return;
        }
        txtStatus = new TextView[selPageCount];
        checkbox = new CheckBox[selPageCount];
        int index = 0;
        int initVal = initial;

        int endVal = end - totSize;
        //Log.i("myLog", "endVal:" + endVal + "    end:" + end);
        if (endVal > 0)
            end = end - endVal;
        //Log.i("myLog", "endVal:" + endVal + "    end:" + end + "   totSize:" + totSize);

        txtResults.setText("Results " + initVal + "-" + end + " of " + totSize);
        //Log.i("myLog", "end:" + end + "    initial:" + initial);
        if (totSize < end) {
            end = totSize;
        }
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        for (int start = 0; start < listResp.size(); start++) {
            final int ij = index;
            final int listIndex = start;
            System.out.println("print start value " + start);
            GetAppointmentResponse.Datum resp = listResp.get(start);
            String tokenNo = resp.getAppointmentToken();
            String name = resp.getPatientName();
            String colorCode = resp.getColorCode();
            int patientId = 0;
           if (resp.getPatientId() != null)
                patientId = resp.getPatientId();
            String apptDate = resp.getAppointmentDate();
            String mobile = resp.getMobile();
            String apptId = resp.getAppointmentId();
            String consultant = resp.getConsultant();
            String status = resp.getAppointmentStatus();
            String module = resp.getModule();
            String appType = "";

            if (module.equalsIgnoreCase("Appointment")){
                appType = " [Appt]";
            }else if (module.equalsIgnoreCase("opd")){
                appType = " [OPD]";
            }else {
                appType = " [IPD]";
            }

            if (status == null) {
                status = "";
            }
            TableRow tr = new TableRow(getActivity());
            tr.setGravity(Gravity.CENTER);
            TextView txtName = new TextView(getActivity());
            txtName.setText(name);
            txtName.setTypeface(typeface);
            txtName.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtName.setGravity(Gravity.CENTER);
            tr.addView(txtName, txtParam);

            TextView txtPatientId = new TextView(getActivity());
            txtPatientId.setText(String.valueOf(patientId));
            txtPatientId.setTypeface(typeface);
            txtPatientId.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor));
            txtPatientId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtPatientId.setGravity(Gravity.CENTER);
            tr.addView(txtPatientId, patientIdParam);

            TextView txtApptNo = new TextView(getActivity());
            txtApptNo.setText(apptId +appType);
            txtApptNo.setTypeface(typeface);
            txtApptNo.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor));
            txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtApptNo.setGravity(Gravity.CENTER);
            tr.addView(txtApptNo, txtParam);

            TextView txtToken = new TextView(getActivity());
            txtToken.setText(tokenNo);
            txtToken.setTypeface(typeface);
            txtToken.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtToken.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtToken.setGravity(Gravity.CENTER);
            tr.addView(txtToken, patientIdParam);

            TextView txtApptDate = new TextView(getActivity());
            txtApptDate.setText(apptDate);
            txtApptDate.setTypeface(typeface);
            txtApptDate.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtApptDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtApptDate.setGravity(Gravity.CENTER);
            tr.addView(txtApptDate, txtParam);

            TextView txtMobile = new TextView(getActivity());
            txtMobile.setText(mobile);
            txtMobile.setTypeface(typeface);
            txtMobile.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtMobile.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtMobile.setGravity(Gravity.CENTER);
            tr.addView(txtMobile, txtParam);

            TextView txtConsultant = new TextView(getActivity());
            txtConsultant.setText(consultant);
            txtConsultant.setTypeface(typeface);
            txtConsultant.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            txtConsultant.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtConsultant.setGravity(Gravity.CENTER);
            tr.addView(txtConsultant, txtParam);

            txtStatus[index] = new TextView(getActivity());
            txtStatus[index].setText(status);
            txtStatus[index].setTypeface(typeface);
            txtStatus[index].setPadding(0, 0, dpToPx(10), 0);
            txtStatus[index].setTextColor(Color.WHITE);
            if (colorCode != null && !colorCode.isEmpty()) {
                Drawable drawable = ContextCompat.getDrawable(getActivity(), R.drawable.rounded_approved_bg);
                GradientDrawable gradientDrawable = (GradientDrawable) drawable;
                gradientDrawable.setColor(Color.parseColor(colorCode));
                txtStatus[index].setBackground(gradientDrawable);
            }
            txtStatus[index].setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            txtStatus[index].setGravity(Gravity.CENTER);
            tr.addView(txtStatus[index], txtParam);

            checkbox[index] = new CheckBox(getActivity());
            checkbox[index].setChecked(false);
            checkbox[index].setVisibility(View.GONE);
            tr.addView(checkbox[index], chkBoxParam);

            if (RPT.equalsIgnoreCase("REPORT")){
                OPHubApplication.currentPage = currentPage;
                OPHubApplication.pageCount = selPageCount;
                OPHubApplication.selTab = selTab;
                AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                GetAppointmentResponse.Datum resps = listResp.get(Integer.parseInt(listIndexs));
                String apptIds = resps.getAppointmentId();
                String token = resps.getAppointmentToken();
                int pId = resps.getPatientId();
                int doctorId=0;
                if(resps.getDoctor()!=null){
                    doctorId = resps.getDoctor();
                }
                String statuss = resps.getAppointmentStatus();
                String statusId = resps.getAppointmentStatusId();
                String doctorName = resps.getConsultant();
                String opdId = resps.getOpdId().toString();
                double apptFees = resps.getApptFees();
                Bundle result = new Bundle();
                result.putString("opd_ID", opdId);
                result.putInt("patient_id", pId);
                result.putInt("doctor_id", doctorId);
                result.putString("appt_id", apptIds);
                result.putString("token", token);
                result.putDouble("appt_fees", apptFees);
                result.putString("doctor_name", doctorName);
                result.putString("appt_status", statuss);
                result.putString("appt_status_id", statusId);
                result.putString("from_screen", "Appointment");
                result.putString("VITALS", "REPORT");
//                            result.putString("to_tab", "Tracking");
                newFragment.setArguments(result);
                transaction.replace(R.id.fragment_container, newFragment, "View_Appt");
                transaction.addToBackStack(null);
                transaction.commit();

                PreferenceManager.setInt(PreferenceManager.PATIENT_ID, pId);
            }else {
                txtApptNo.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(module.equalsIgnoreCase("APPOINTMENT")){
                            relativeLayout.setVisibility(View.VISIBLE);
                            relMain.setVisibility(View.INVISIBLE);
                            OPHubApplication.currentPage = currentPage;
                            OPHubApplication.pageCount = selPageCount;
                            OPHubApplication.selTab = selTab;
                            AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
                            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                            GetAppointmentResponse.Datum resp = listResp.get(listIndex);
                            String apptId = resp.getAppointmentId();
                            String token = resp.getAppointmentToken();
                            String opdID = resp.getOpdId().toString();
                            int pId = resp.getPatientId();
                            double apptFees = resp.getApptFees();
                            Bundle result = new Bundle();
                            result.putInt("patient_id", pId);
                            result.putString("appt_id", apptId);
                            result.putString("opd_ID", opdID);
                            result.putString("token", token);
                            result.putString("from_screen", "Appointment");
                            result.putString("from_tab", selTab);
                            result.putString("to_tab", "Info");
                            result.putDouble("appt_fees", apptFees);
                            result.putString("VITALS", "NOTRPT");
                            newFragment.setArguments(result);
                            transaction.replace(R.id.fragment_container, newFragment, "View_Appt");
                            transaction.addToBackStack(null);
                            transaction.commit();
                            PreferenceManager.setInt(PreferenceManager.PATIENT_ID, pId);
                            PreferenceManager.setString(PreferenceManager.CLICKED_INDEX, String.valueOf(listIndex));




                            PreferenceManager.setString(PreferenceManager.APPOINTMENT_ID, apptId);       // You'll need to define this key
                            PreferenceManager.setString(PreferenceManager.OPD_ID, opdID);
                            PreferenceManager.setString(PreferenceManager.APPOINTMENT_TOKEN, token);     // Define key
                            PreferenceManager.setString(PreferenceManager.FROM_SCREEN, "Appointment");   // Define key
                            PreferenceManager.setString(PreferenceManager.FROM_TAB, selTab);
                            PreferenceManager.setString(PreferenceManager.TO_TAB, "Info");               // Define key
                            PreferenceManager.setDouble(PreferenceManager.APPT_FEES, apptFees);          // Add a setDouble method if needed
                            PreferenceManager.setString(PreferenceManager.VITALS, "NOTRPT");
                            PreferenceManager.setString(PreferenceManager.CLICKED_INDEX, String.valueOf(listIndex));



                        }else {
                            showUnderDevelopment();
                        }
                    }
                });
            }





            txtPatientId.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    relativeLayout.setVisibility(View.VISIBLE);
                    relMain.setVisibility(View.INVISIBLE);
                    OPHubApplication.currentPage = currentPage;
                    OPHubApplication.pageCount = selPageCount;
                    OPHubApplication.selTab = selTab;
                    PatientProfileFragment newFragment = new PatientProfileFragment();
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    GetAppointmentResponse.Datum resp = listResp.get(listIndex);
                    int pId = resp.getPatientId();
                    Bundle result = new Bundle();
                    result.putInt("patient_id", pId);
                    result.putInt("hospital_id", hospitalId);
                    result.putString("from_screen", "appointment");
                    newFragment.setArguments(result);
                    transaction.replace(R.id.fragment_container, newFragment, "Patient");
                    transaction.addToBackStack(null);
                    transaction.commit();


                    PreferenceManager.setInt(PreferenceManager.PATIENT_ID, pId);
                }
            });


            if (RPT.equalsIgnoreCase("REPORT")){
                OPHubApplication.currentPage = currentPage;
                OPHubApplication.pageCount = selPageCount;
                OPHubApplication.selTab = selTab;
                AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                GetAppointmentResponse.Datum resps = listResp.get(Integer.parseInt(listIndexs));
                String apptIds = resps.getAppointmentId();
                String token = resps.getAppointmentToken();
                int pId = resps.getPatientId();
                int doctorId=0;
                if(resps.getDoctor()!=null){
                    doctorId = resps.getDoctor();
                }
                String statuss = resps.getAppointmentStatus();
                String statusId = resps.getAppointmentStatusId();
                String doctorName = resps.getConsultant();
                String opdId = resps.getOpdId().toString();
                double apptFees = resps.getApptFees();
                Bundle result = new Bundle();
                result.putString("opd_ID", opdId);
                result.putInt("patient_id", pId);
                result.putInt("doctor_id", doctorId);
                result.putString("appt_id", apptIds);
                result.putString("token", token);
                result.putDouble("appt_fees", apptFees);
                result.putString("doctor_name", doctorName);
                result.putString("appt_status", statuss);
                result.putString("appt_status_id", statusId);
                result.putString("from_screen", "Appointment");
                result.putString("VITALS", "REPORT");
//                            result.putString("to_tab", "Tracking");
                newFragment.setArguments(result);
                transaction.replace(R.id.fragment_container, newFragment, "View_Appt");
                transaction.addToBackStack(null);
                transaction.commit();

                PreferenceManager.setInt(PreferenceManager.PATIENT_ID, pId);
            }else {
                txtStatus[index].setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {

                        if(module.equalsIgnoreCase("APPOINTMENT")) {
                            if (!selTab.equalsIgnoreCase("History")) {
                                OPHubApplication.currentPage = currentPage;
                                OPHubApplication.pageCount = selPageCount;
                                OPHubApplication.selTab = selTab;
                                AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
                                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                GetAppointmentResponse.Datum resp = listResp.get(listIndex);
                                String apptId = resp.getAppointmentId();
                                String token = resp.getAppointmentToken();
                                int pId = resp.getPatientId();
                                int doctorId=0;
                                if(resp.getDoctor()!=null){
                                    doctorId = resp.getDoctor();
                                }
                                String status = resp.getAppointmentStatus();
                                String statusId = resp.getAppointmentStatusId();
                                String doctorName = resp.getConsultant();
                                String opdId = resp.getOpdId().toString();
                                double apptFees = resp.getApptFees();
                                Bundle result = new Bundle();
                                result.putString("opd_ID", opdId);
                                result.putInt("patient_id", pId);
                                result.putInt("doctor_id", doctorId);
                                result.putString("appt_id", apptId);
                                result.putString("token", token);
                                result.putDouble("appt_fees", apptFees);
                                result.putString("doctor_name", doctorName);
                                result.putString("appt_status", status);
                                result.putString("appt_status_id", statusId);
                                result.putString("from_screen", "Appointment");
                                result.putString("VITALS", "NOTRPT");
//                            result.putString("to_tab", "Tracking");
                                newFragment.setArguments(result);
                                transaction.replace(R.id.fragment_container, newFragment, "View_Appt");
                                transaction.addToBackStack(null);
                                transaction.commit();

                                PreferenceManager.setInt(PreferenceManager.PATIENT_ID, pId);
                            }
                        }else {
                            showUnderDevelopment();
                        }

                    }
                });
            }




//            txtStatus[index].setOnClickListener(new View.OnClickListener() {
//                @Override
//                public void onClick(View v) {
//
//                    if(module.equalsIgnoreCase("APPOINTMENT")) {
//                        if (!selTab.equalsIgnoreCase("History")) {
//                            OPHubApplication.currentPage = currentPage;
//                            OPHubApplication.pageCount = selPageCount;
//                            OPHubApplication.selTab = selTab;
//                            AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
//                            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
//                            GetAppointmentResponse.Datum resp = listResp.get(listIndex);
//                            String apptId = resp.getAppointmentId();
//                            String token = resp.getAppointmentToken();
//                            int pId = resp.getPatientId();
//                            int doctorId=0;
//                            if(resp.getDoctor()!=null){
//                                doctorId = resp.getDoctor();
//                            }
//                            String status = resp.getAppointmentStatus();
//                            String statusId = resp.getAppointmentStatusId();
//                            String doctorName = resp.getConsultant();
//                            String opdId = resp.getOpdId().toString();
//                            double apptFees = resp.getApptFees();
//                            Bundle result = new Bundle();
//                            result.putString("opd_ID", opdId);
//                            result.putInt("patient_id", pId);
//                            result.putInt("doctor_id", doctorId);
//                            result.putString("appt_id", apptId);
//                            result.putString("token", token);
//                            result.putDouble("appt_fees", apptFees);
//                            result.putString("doctor_name", doctorName);
//                            result.putString("appt_status", status);
//                            result.putString("appt_status_id", statusId);
//                            result.putString("from_screen", "Appointment");
//                            result.putString("VITALS", "NOTRPT");
////                            result.putString("to_tab", "Tracking");
//                            newFragment.setArguments(result);
//                            transaction.replace(R.id.fragment_container, newFragment, "View_Appt");
//                            transaction.addToBackStack(null);
//                            transaction.commit();
//
//                            PreferenceManager.setInt(PreferenceManager.PATIENT_ID, pId);
//                        }
//                    }else {
//                        showUnderDevelopment();
//                    }
//
//                }
//            });



            index++;
            TableRow trLine1 = new TableRow(getActivity());
            View v1 = new View(getActivity());
            v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
            trLine1.addView(v1, lineParam);
            tblView.addView(tr);
            tblView.addView(trLine1);
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

                    if (selTab.equalsIgnoreCase("todayAppointment")){
                        getAppointmentsToday(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                    }
                    else if (selTab.equalsIgnoreCase("Appointment")) {
                        getAppointments(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                    }else
                        getAppointmentsHistory(selFromDate, selToDate, selDoctor, refereshStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));

//                    showAppointments(selInitial, selEnd, "");

                }
            });
        }
        tblPages.addView(tr);

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
        showAppointments(selInitial, selEnd, "");
    }


    private void showInitialList1(List<GetAppointmentResponse.Datum> list, String option) {
        Log.i("myLog", "Show initail list");
//        int size = listResp.size();
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
            showPages1(listResp);
            if (option != null && option.equalsIgnoreCase("tracking")) {
                selEnd = currentPage * selPageCount;
                selInitial = selEnd - selPageCount;

            }

            if (totSize < selPageCount)
                selEnd = totSize;
            showAppointments(selInitial, selEnd, option);
        } else {
            tblPages.removeAllViews();
            tblView.removeAllViews();
            currentPage = 0;
            totPage = 0;
            remPage = 0;
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
        }
    }


    private void updateApptStatus(int index, String apptId, String statusSel, String statusTxt) {
        //Log.i("mylog", "updateApptStatus apptid::" + apptId + "    hosp_id:" + hospitalId + "   status:" + selStatus);
        OPHubRequests.UpdateAppointmentStatusReq request = new OPHubRequests.UpdateAppointmentStatusReq();
        request.setHospitalId(hospitalId);
        request.setApptStatus(statusSel);

        //Log.i("mylog", "updateApptStatus request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.updateAppointmentStatus(apptId, request);
        //Log.i("myLog", "URLLLLLLLLll:" + call.request().url().toString());
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    //Log.i("myLog", "updateApptStatus response:");
                    //Log.i("mylog", "updateApptStatus response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //Log.i("myLog", "updateApptStatus response isSuccess:" + response.body().toString());
                        List<OPHubResponse.UpdateApptStatusResponse> list = response.body();
                        OPHubResponse.UpdateApptStatusResponse res = list.get(0);
                        String status = res.getStatus();
                        String message = res.getMessage();
                        //Log.i("myLog", "satus:" + status);
                        //Log.i("myLog", "message:" + message);
                        Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                        dialogStatus.dismiss();
                        //  statusTxtUpdate(index, selStatus);
                        if (selTab.equalsIgnoreCase("Appointment"))
                            getAppointments(selFromDate, selToDate, selDoctor, selStatusId, null, "update",String.valueOf(selPageCount), String.valueOf(currentPage));
                        else if (selTab.equalsIgnoreCase("History"))
                            getAppointmentsHistory(selFromDate, selToDate, selDoctor, selStatusId, null, "update",String.valueOf(selPageCount), String.valueOf(currentPage));

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


    private void rescheduleAppt(String apptId, String date, String time, int doctorId,
                                int shiftId, int globalShiftId, String status) {
        //Log.i("mylog", "rescheduleAppt apptid::" + apptId + "    hosp_id:" + hospitalId + "   status:" + status);
        OPHubRequests.RescheduleApptReq request = new OPHubRequests.RescheduleApptReq();
        request.setDate(date);
        String[] timeArr = time.split(" - ");
        request.setTime(timeArr[0]);
        request.setHospId(hospitalId);
        request.setDoctorId(doctorId);
        request.setShiftId(shiftId);
        request.setLive_consult("no");
        request.setApptStatus(status);
        request.setGlobal_shift_id(globalShiftId);
        request.setReceivedByName(OPHubApplication.getStaffName());
        //Log.i("mylog", "rescheduleAppt request:" + new Gson().toJson(request));
        Call<List<OPHubResponse.UpdateApptStatusResponse>> call = services.rescheduleAppointment(apptId, request);
        call.enqueue(new Callback<List<OPHubResponse.UpdateApptStatusResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Response<List<OPHubResponse.UpdateApptStatusResponse>> response) {
                try {
                    //Log.i("myLog", "rescheduleAppt response:");
                    //Log.i("mylog", "rescheduleAppt response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //Log.i("myLog", "rescheduleAppt response isSuccess:" + response.body().toString());
                        List<OPHubResponse.UpdateApptStatusResponse> list = response.body();
                        OPHubResponse.UpdateApptStatusResponse res = list.get(0);
                        String status = res.getStatus();
                        String message = res.getMessage();
                        //Log.i("myLog", "status:" + status);
                        //Log.i("myLog", "message:" + message);
                        Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                        if (selTab.equalsIgnoreCase("Appointment"))
                            getAppointments(selFromDate, selToDate, selDoctor, selStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                        else if (selTab.equalsIgnoreCase("History"))
                            getAppointmentsHistory(selFromDate, selToDate, selDoctor, selStatus, selPaymentStatus, "",String.valueOf(selPageCount), String.valueOf(currentPage));
                        dialogStatus.dismiss();
                        //   statusTxtUpdate(index, selStatus);
                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.UpdateApptStatusResponse>> call, Throwable t) {
                //Log.i("myLog", "rescheduleAppt response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });


    }

    private void getDoctorSlot(String selDate, int doctorId) {
        OPHubRequests.GetDoctorSlotRequest request = new OPHubRequests.GetDoctorSlotRequest();
        request.setDate(selDate);
        request.setHospId(hospitalId);
        request.setStaffId(doctorId);
        //Log.i("mylog", "getDoctorSlot request:" + new Gson().toJson(request));
        Call<List<GetDoctorSlotResponse>> call = services.getDoctorSlot(request);
        call.enqueue(new Callback<List<GetDoctorSlotResponse>>() {

            @Override
            public void onResponse(Call<List<GetDoctorSlotResponse>> call, Response<List<GetDoctorSlotResponse>> response) {
                try {
                    //Log.i("myLog", "getDoctorSlot response:");
                    //Log.i("mylog", "getDoctorSlot response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        //Log.i("myLog", "getDoctorSlot response isSuccess:" + response.body().toString());
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
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }


            @Override
            public void onFailure(Call<List<GetDoctorSlotResponse>> call, Throwable t) {
                //Log.i("myLog", "getDoctorSlot response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
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
            //    OPHubUtils.showErrorDialog(getActivity(), message);
            //  Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
        }

        // show snack bar

    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        return false;
    }

    @Override
    public void onNetworkChange(boolean isConnected) {
        Log.i("myLog", "onnetwork changed ------appt fragment");
        showAlert(isConnected);
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
        //  boolean isConnected = checkConnection();
        //if (!isConnected)
        //  showAlert(isConnected);
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

}
