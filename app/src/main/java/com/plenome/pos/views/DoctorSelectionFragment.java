package com.plenome.pos.views;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.model.GetV2DoctorResponse;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;
import com.plenome.pos.views.horizontal.DatePickerListener;
import com.plenome.pos.views.horizontal.HorizontalPicker;
import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.adapters.DoctorListAdapter;
import com.plenome.pos.model.GetAppointmentStatusResponse;
import com.plenome.pos.model.GetDoctorResponse;
import com.plenome.pos.model.GetDoctorSlotResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;

import org.joda.time.DateTime;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
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

public class DoctorSelectionFragment extends Fragment implements DatePickerListener, NetworkConnectionReceiver.ReceiverListener {
    View rootView;
    private Dialog dialogDatePicker, dialogFilter;
    RestServices services;
    int hospId, age, patientId, width, height, textSize, selGlobalShiftId, selShiftId, doctorId, shiftId, globalShiftId;
    Calendar myCalendar;
    LinearLayout tblSlotTime;
    TextView txtNoSlot;
    boolean isFilterSet = false;
    private TableRow.LayoutParams txtParam, lineParam, linearParam, txtSlotTimeParam;
    String selSlot, selDate,stratDate=null,selGender = null,specialitys=null;
    String fromScreen, apptId, apptStatus, apptStatusId, docName, docSlot, docSpeciality, name, gender, bloodgroup, phone, email, abhaNo, charges, tax, taxPercent, totAmt;
    @BindView(R.id.recyclerView)
    RecyclerView recyclerView;
    ArrayList<Integer>  alStatusId;
    ArrayList<String>  alStatus, alShiftName, alSlotTime, alShift;
    int selPos;
    Spinner spinGender, spinSpeciality;
    EditText edtDate;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();

    Button btnConfirm;
    @BindView(R.id.edtSearch)
    EditText editSearch;

    @BindView(R.id.imgClose)
    ImageView imgClose;

    @BindView(R.id.relNoData)
    RelativeLayout relNoData;

    @BindView(R.id.imgFilter)
    ImageView imgFilter;
    @BindView(R.id.linearMain)
    LinearLayout linearMain;

    private DoctorListAdapter adapter;
    private ArrayList<String> alDocName = new ArrayList<>();
    private ArrayList<String> alQualification = new ArrayList<>();
    private ArrayList<String> alDocSpeciality = new ArrayList<>();
    private ArrayList<String> alTime = new ArrayList<>();
    private ArrayList<Double> alFee = new ArrayList<>();
    private ArrayList<String> alRating = new ArrayList<>();
    private ArrayList<String> alImage = new ArrayList<>();
    private ArrayList<String> alExp = new ArrayList<>();
    private ArrayList<Double> alStdCharge = new ArrayList<>();
    private ArrayList<Double> alTax = new ArrayList<>();
    private ArrayList<String> alTaxPercent = new ArrayList<>();
    private ArrayList<Double> alTotal = new ArrayList<>();
    private ArrayList<Integer> alDocId = new ArrayList<>();

    private boolean isLoading = false;
    private int currentAdapterPage = 1;

    List<GetV2DoctorResponse.Datum> list;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_doctor_selection, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarTitle.setText(R.string.appointmentBook);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        services = RetrofitInstance.createService(RestServices.class);
        hospId = OPHubApplication.getHospitalId();
        stratDate = OPHubApplication.getHistFromDate();
        selGender = OPHubApplication.getDocGenter();
        specialitys = OPHubApplication.getDocSpeciality();
        System.out.println("selGendervv"+specialitys);
        if (isFilterSet) {
            imgFilter.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.filter_sel));
        } else {
            imgFilter.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.filter));
        }
        Bundle bundle = getArguments();
        if (bundle != null) {
            fromScreen = bundle.getString("from_screen");
            patientId = bundle.getInt("patient_id");
            name = bundle.getString("name");
            age = bundle.getInt("age");
            gender = bundle.getString("gender");
            bloodgroup = bundle.getString("bloodGroup");
            phone = bundle.getString("phone");
            email = bundle.getString("email");
            abhaNo = bundle.getString("abha_no");
            apptStatus = bundle.getString("appt_status");
            apptId = bundle.getString("appt_id");
            apptStatusId = bundle.getString("appt_status_id");
            Log.i("myLog", "doctor sel screen apptId:" + apptId + "   email:" + email + "   apptStatusId:" + apptStatusId);
        }

        myCalendar = Calendar.getInstance();
        initParams();
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            getDoctors(null, null, null, "doctor",currentAdapterPage);
            getAppointmentStatus(String.valueOf(hospId));
        }
//        editSearch.setOnEditorActionListener(new TextView.OnEditorActionListener() {
//            @Override
//            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
//                System.out.println("print doctor search");
//                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
//                    String text = editSearch.getText().toString();
//                    if (text.contains("Select"))
//                        text = null;
//                    getDoctors(text, null, null, "doctor");
//                }
//                return false;
//            }
//        });


        adapter = new DoctorListAdapter(getContext(), alDocName, alQualification, alDocSpeciality, alExp, alRating, alTime, alFee);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);



        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                if (layoutManager != null && dy > 0) {
                    int visibleItemCount = layoutManager.getChildCount();
                    int totalItemCount = layoutManager.getItemCount();
                    int pastVisibleItems = layoutManager.findFirstVisibleItemPosition();

                    if (!isLoading && (visibleItemCount + pastVisibleItems) >= totalItemCount) {
                        isLoading = true;
                        currentAdapterPage++;
                        getDoctors(null, null, null, "doctor", currentAdapterPage);
                    }
                }
            }
        });

// Adapter click listener
        adapter.setOnClickListener((position, docNames) -> {
            selPos = position;
            showDatePickerDialog(position, alDocName, alDocId, alStdCharge, alTax, alTaxPercent, alTotal);
        });

        editSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
//                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                if (editSearch.getText().toString().equalsIgnoreCase("")) {
                    imgClose.setVisibility(View.GONE);
                } else {
                    imgClose.setVisibility(View.VISIBLE);
                }
                String text = editSearch.getText().toString();
                if (text.contains("Select"))
                    text = null;
                currentAdapterPage =1;
                getDoctors(text, null, null, "doctor",currentAdapterPage);
//                }

            }

            @Override
            public void afterTextChanged(Editable editable) {

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
            linearParam = new TableRow.LayoutParams(dpToPx(160), dpToPx(40));
            linearParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            txtParam = new TableRow.LayoutParams(dpToPx(300), dpToPx(30));
            txtParam.setMargins(dpToPx(0), dpToPx(5), dpToPx(0), dpToPx(0));
            txtSlotTimeParam = new TableRow.LayoutParams(dpToPx(160), dpToPx(40));
            txtSlotTimeParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            textSize = 16;
            linearParam = new TableRow.LayoutParams(dpToPx(160), dpToPx(40));
            linearParam.setMargins(dpToPx(5), dpToPx(10), dpToPx(5), dpToPx(10));
            txtParam = new TableRow.LayoutParams(dpToPx(300), dpToPx(30));
            txtParam.setMargins(dpToPx(0), dpToPx(5), dpToPx(0), dpToPx(0));
            txtSlotTimeParam = new TableRow.LayoutParams(dpToPx(160), dpToPx(40));
            txtSlotTimeParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    @OnClick(R.id.imgClose)
    public void clickClose() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            editSearch.setText("");
            currentAdapterPage = 1;
            getDoctors(null, null, null, "doctor",currentAdapterPage);
        }
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

    public void showDatePickerDialog(int pos, ArrayList<String> alName, ArrayList<Integer> alId, ArrayList<Double> alStdCharge,
                                     ArrayList<Double> alTax, ArrayList<String> alTaxPercent, ArrayList<Double> alTotalAmt) {
        selDate = null;
        selSlot = null;
        dialogDatePicker = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_time_slot_sel, null);
        dialogDatePicker.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogDatePicker.getWindow().setGravity(Gravity.CENTER);
        HorizontalPicker mPicker = dialogDatePicker.findViewById(R.id.day_date_picker);
        ImageView imgClose = dialogDatePicker.findViewById(R.id.imgClose);
        btnConfirm = dialogDatePicker.findViewById(R.id.btnConfirm);
        tblSlotTime = dialogDatePicker.findViewById(R.id.tblSlotTime);
        txtNoSlot = dialogDatePicker.findViewById(R.id.txtNoSlot);
        dialogDatePicker.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogDatePicker.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogDatePicker.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(550);
        dialogDatePicker.getWindow().setAttributes(lp);
        DateTime date = new DateTime(System.currentTimeMillis());
        btnConfirm.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        btnConfirm.setTextColor(ContextCompat.getColor(getActivity(), R.color.blue_text));
        mPicker.setListener(this)
                .setDays(400)
                .setOffset(0)
                .setDateSelectedColor(ContextCompat.getColor(getContext(), R.color.blue_text))
                .setDateSelectedTextColor(Color.WHITE)
                .setMonthAndYearTextColor(Color.WHITE)
                .setTodayButtonTextColor(Color.TRANSPARENT)
                //   .setTodayDateTextColor(ContextCompat.getColor(getContext(), R.color.blue_text))
                // .setTodayDateBackgroundColor(Color.TRANSPARENT)
                .setTodayDateBackgroundColor(ContextCompat.getColor(getContext(), R.color.blue_text))
                .setTodayDateTextColor(Color.WHITE)
                .setUnselectedDayTextColor(ContextCompat.getColor(getContext(), R.color.blue_text))
                .setDayOfWeekTextColor(ContextCompat.getColor(getContext(), R.color.blue_text))
                .showTodayButton(true)
                .init();
        mPicker.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.loginBg));
        Log.i("myLog", "b4 date set");

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date1 = new Date();
        String currDate = dateFormat.format(date1);
        selDate = currDate;
        Log.i("myLog", "selected date:" + selDate);

        getDoctorSlot();
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogDatePicker.dismiss();
            }
        });
        btnConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean isConnected = checkConnection();
                if (!isConnected)
                    showAlert(isConnected);
                else {

                    if (selDate != null && selSlot != null) {
                        dialogDatePicker.dismiss();

                        if (fromScreen.equalsIgnoreCase("Profile") || fromScreen.equalsIgnoreCase("Patient_id_search")) {
                            docName = alName.get(pos);
                            doctorId = alId.get(pos);
                            charges = String.valueOf(alStdCharge.get(pos));
                            tax = String.valueOf(alTax.get(pos));
                            taxPercent = String.valueOf(alTaxPercent.get(pos));
                            totAmt = String.valueOf(alTotalAmt.get(pos));
                            //   rescheduleAppt(apptId, selDate, selSlot, doctorId, selShiftId, selGlobalShiftId, apptStatus, apptStatusId);
                            gotoApptSubMenuFragment();
                        } else if (fromScreen.equalsIgnoreCase("Appointment_info") || fromScreen.equalsIgnoreCase("Tracking")) {
                            docName = alName.get(pos);
                            doctorId = alId.get(pos);
                            charges = String.valueOf(alStdCharge.get(pos));
                            tax = String.valueOf(alTax.get(pos));
                            taxPercent = String.valueOf(alTaxPercent.get(pos));
                            totAmt = String.valueOf(alTotalAmt.get(pos));
                            //  int statusId = 0;
                            //String status;
                            if (alStatus != null) {
                                int size = alStatus.size();
                                for (int start = 0; start < size; start++) {
                                    String status = alStatus.get(start);
                                    if (status.equalsIgnoreCase("Reserved")) {
                                        apptStatusId = String.valueOf(alStatusId.get(start));
                                        Log.i("myLog", "apptStatusIdapptStatusId:" + apptStatusId);
                                        apptStatus = status;
                                        //    return;

                                    }
                                }
                            }
                            Log.i("myLog", "apptStatusIdapptStatusId:" + apptStatusId);
                            rescheduleAppt(fromScreen, apptId, selDate, selSlot, doctorId, docName, selShiftId, selGlobalShiftId, apptStatus, apptStatusId);
                        }
                    } else {
                        if (txtNoSlot.getVisibility() == View.VISIBLE)
                            Toast.makeText(getContext(), "No slots available", Toast.LENGTH_SHORT).show();
                        else
                            Toast.makeText(getContext(), "Please select time!", Toast.LENGTH_SHORT).show();
                    }
                }

            }
        });
     /*   mPicker.getSelectedDate(new OnDateSelectedListener() {
            @Override
            public void onDateSelected(@Nullable Date date) {
                if (date != null) {
                    selDate = date.toString();
                    // do something with selected date
                    Log.i("mylog", "Selected date is " + date.toString());
                    String myFormat = "yyyy-MM-dd"; //put your date format in which you need to display
                    SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.ENGLISH);
                    selDate = sdf.format(date);
                    Log.i("mylog", "Selected dateStr " + selDate);

                    getDoctorSlot(selDate, alId.get(pos));
                }
            }
        });*/
    }

    private void getDoctors(String speciality, String date, String gender, String option, Integer page) {
        services.getAllDoctors(String.valueOf(hospId), speciality, gender, date, "10", page)
                .enqueue(new Callback<GetV2DoctorResponse>() {
                    @Override
                    public void onResponse(Call<GetV2DoctorResponse> call, Response<GetV2DoctorResponse> response) {
                        try {
                            Log.i("myLog", "getDoctors onResponse:" + new Gson().toJson(response.body()));
                            if (response.body() != null && response.body().getData() != null) {
                                list = response.body().getData();


                                if (page == 1) {
                                    alDocName.clear();
                                    alDocId.clear();
                                    alDocSpeciality.clear();
                                    alQualification.clear();
                                    alTime.clear();
                                    alFee.clear();
                                    alRating.clear();
                                    alImage.clear();
                                    alExp.clear();
                                    alStdCharge.clear();
                                    alTax.clear();
                                    alTaxPercent.clear();
                                    alTotal.clear();
                                    adapter.notifyDataSetChanged();
                                }

                                if (!list.isEmpty()) {
                                    int oldSize = alDocName.size();

                                    for (GetV2DoctorResponse.Datum resp : list) {
                                        alDocName.add(resp.getDoctorName());
                                        alDocId.add(resp.getDoctorId());
                                        alDocSpeciality.add(resp.getSpecialistNames());
                                        alFee.add(resp.getTotalamount());
                                        alTime.add(resp.getHospitalOpeningTiming());
                                        alRating.add(resp.getRating());
                                        alImage.add(resp.getImage());
                                        alExp.add(resp.getExperience());
                                        alQualification.add(resp.getQualification());
                                        alStdCharge.add(resp.getStandardCharge());
                                        alTax.add(resp.getTax());
                                        alTaxPercent.add(resp.getTaxPercentage());
                                        alTotal.add(resp.getTotalamount());
                                    }

                                    adapter.notifyItemRangeInserted(oldSize, list.size());
                                    recyclerView.setVisibility(View.VISIBLE);
                                    relNoData.setVisibility(View.GONE);
                                    isLoading = false;
                                } else if (page == 1) {
                                    recyclerView.setVisibility(View.GONE);
                                    relNoData.setVisibility(View.VISIBLE);
                                }
                            } else {
    //                            OPHubUtils.showErrorDialog(getActivity(), response.message());
                            }
                        } catch (Exception e) {
                            OPHubUtils.showErrorDialog(getActivity(), response.message());
                        }
                    }

                    @Override
                    public void onFailure(Call<GetV2DoctorResponse> call, Throwable t) {
                        Log.e("getDoctors", "Failure: " + t.getMessage());
                        call.clone().enqueue(this);
                    }
                });
    }
    private void getDoctorSlot() {
        OPHubRequests.GetDoctorSlotRequest request = new OPHubRequests.GetDoctorSlotRequest();
        request.setDate(selDate);
        request.setHospId(hospId);
        int staffId = alDocId.get(selPos);
        request.setStaffId(staffId);
        //   request.setStaffId(98);
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
                        alSlotTime = new ArrayList<>();
                        alShiftName = new ArrayList<>();
                        alShift = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            GetDoctorSlotResponse resp = list.get(start);
                            //    String slotTime = resp.getSlotTime();
                            String shiftName = resp.getShiftName();
                            if (!alShift.contains(shiftName))
                                alShift.add(shiftName);

                        }
                        int shiftSize = alShift.size();
                        for (int start = 0; start < shiftSize; start++) {
                            String shift = alShift.get(start);
                            for (int index = 0; index < size; index++) {
                                GetDoctorSlotResponse resp = list.get(index);
                                String slotTime = convertTimeRangeTo12HourFormat(resp.getSlotTime());
                                String shiftName = resp.getShiftName();
                                Log.i("myLog", "shiftName:" + shiftName + "    slotTime:" + slotTime);

                                if (shift != null && shift.equalsIgnoreCase(shiftName)) {
                                    alSlotTime.add(slotTime);
                                    Log.i("myLog", "matchess     shiftName:" + shiftName + "    slotTime:" + slotTime);
                                    alShiftName.add(shiftName);


                                }
                            }
                        }

                        //  showSlotTime(list);

                        if (size > 0) {
                            txtNoSlot.setVisibility(View.GONE);
                            tblSlotTime.setVisibility(View.VISIBLE);
                            showSlotTime(list);
                        } else {
                            txtNoSlot.setVisibility(View.VISIBLE);
                            tblSlotTime.setVisibility(View.GONE);
                        }
                        //  Toast.makeText(getActivity(), "No slots available", Toast.LENGTH_SHORT).show();

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


    public static String convertTimeRangeTo12HourFormat(String timeRange24) {
        String[] times = timeRange24.split(" - ");
        String startTime = convertTo12HourFormat(times[0]);
        String endTime = convertTo12HourFormat(times[1]);
        return startTime + " - " + endTime;
    }
    public static String convertTo12HourFormat(String time24) {
        try {
            SimpleDateFormat sdf24 = new SimpleDateFormat("HH:mm:ss");
            SimpleDateFormat sdf12 = new SimpleDateFormat("hh:mm:ss a");
            Date date = sdf24.parse(time24);
            return sdf12.format(date);

        } catch (Exception e) {
            return null;
        }
    }

    private void showSlotTime(List<GetDoctorSlotResponse> list) {
        tblSlotTime.removeAllViews();
        int size = alSlotTime.size();
        int shiftSize = alShift.size();

        TextView[] txtSlot = new TextView[size];
        for (int start = 0; start < shiftSize; start++) {
            TextView txtShift = new TextView(getActivity());
            String shiftName = alShift.get(start);
            txtShift.setText(shiftName);
            txtShift.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtShift.setGravity(Gravity.CENTER_VERTICAL);
            txtShift.setTextAppearance(R.style.morning);
            tblSlotTime.addView(txtShift, txtParam);

            HorizontalScrollView hs = new HorizontalScrollView(getActivity());
            LinearLayout li = new LinearLayout(getActivity());
            li.setOrientation(LinearLayout.HORIZONTAL);
            for (int index = 0; index < size; index++) {
                final int pos = index;
                String shift = alShiftName.get(index);
                String time = alSlotTime.get(index);
                if (shift.equalsIgnoreCase(shiftName)) {
                    txtSlot[index] = new TextView(getActivity());
                    txtSlot[index].setText(time);
                    txtSlot[index].setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                    txtSlot[index].setGravity(Gravity.CENTER);
                    txtSlot[index].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                    txtSlot[index].setTextAppearance(R.style.slottime);
                    li.addView(txtSlot[index], txtSlotTimeParam);

                    txtSlot[index].setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            Log.i("myLog", "selected pos:" + pos);
                            btnConfirm.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
                            btnConfirm.setTextColor(ContextCompat.getColor(getActivity(), R.color.white));
                            for (int i = 0; i < size; i++) {
                                if (i == pos) {
                                    txtSlot[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
                                    txtSlot[i].setTextAppearance(R.style.slottime_white);
                                } else {
                                    txtSlot[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                                    txtSlot[i].setTextAppearance(R.style.slottime);
                                }
                            }
                            selSlot = txtSlot[pos].getText().toString();
                            Log.i("myLog", "sel selSlot:" + selSlot);
                            GetDoctorSlotResponse resp = list.get(pos);
                            if (resp != null) {
                                selGlobalShiftId = resp.getGlobalShiftId();
                                selShiftId = resp.getShiftId();

                                System.out.println("Print selGlobalShiftId"+selGlobalShiftId);
                            }
                        }
                    });
                }
            }
            hs.addView(li);
            tblSlotTime.addView(hs);
        }
    }

    private void showDoctorSlot(List<GetDoctorSlotResponse> list) {
        tblSlotTime.removeAllViews();
        int size = list.size();
        TextView[] txtSlot = new TextView[size];
        LinearLayout[] linear = new LinearLayout[size];
        for (int start = 0; start < size; start++) {
            final int index = start;
            GetDoctorSlotResponse resp = list.get(start);
            String slotTime = resp.getSlotTime();

            TableRow tr = new TableRow(getActivity());
            tr.setGravity(Gravity.CENTER);
            linear[start] = new LinearLayout(getActivity());
            linear[start].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
            txtSlot[start] = new TextView(getActivity());
            txtSlot[start].setText(slotTime);
            txtSlot[start].setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtSlot[start].setGravity(Gravity.CENTER);
            txtSlot[start].setTextAppearance(R.style.slottime);
            linear[start].addView(txtSlot[start], txtParam);
            tr.addView(linear[start], linearParam);
            tblSlotTime.addView(tr);

            txtSlot[start].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    //    showRescheduleDialog();
                    Log.i("myLog", "index:" + index);
                    for (int i = 0; i < size; i++) {
                        if (i == index) {
                            linear[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
                            //    txtSlot[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
                            txtSlot[i].setTextAppearance(R.style.slottime_white);
                        } else {
                            //   txtSlot[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                            linear[i].setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                            txtSlot[i].setTextAppearance(R.style.slottime);
                        }
                    }
                    selSlot = txtSlot[index].getText().toString();
                    Log.i("myLog", "sel selSlot:" + selSlot);
                    GetDoctorSlotResponse resp = list.get(index);
                    if (resp != null) {
                        selGlobalShiftId = resp.getGlobalShiftId();
                        selShiftId = resp.getShiftId();
                    }
                }
            });
        }
    }

    @Override
    public void onDateSelected(DateTime dateSelected) {
        Log.i("myLog", "onDateSelected");
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        //  Date date = new Date();
        selDate = dateFormat.format(dateSelected.toDate());
        Log.i("myLog", "selected date:" + selDate);
        selSlot = null;
        btnConfirm.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        btnConfirm.setTextColor(ContextCompat.getColor(getActivity(), R.color.blue_text));
        getDoctorSlot();
    }

    private void gotoApptSubMenuFragment() {
        AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putInt("doctor_id", doctorId);
        result.putString("date", selDate);
        result.putString("slot", selSlot);
        result.putString("doctor_name", docName);
        Log.i("myLog", "doc doctor_name:" + docName);
        result.putInt("shift_id", selShiftId);
        result.putInt("global_shift_id", selGlobalShiftId);
        result.putString("appt_id", apptId);
        result.putString("appt_status", apptStatus);
        result.putString("appt_status_id", apptStatusId);
        result.putInt("patient_id", patientId);
        result.putString("gender", gender);
        result.putString("name", name);
        Log.i("myLog", "doc name:" + name);
        result.putInt("age", age);
        result.putString("bloodGroup", bloodgroup);
        result.putString("phone", phone);
        result.putString("email", email);
        Log.i("myLog", "doc email:" + email);
        result.putString("abha_no", abhaNo);
        result.putString("charge", charges);
        result.putString("tax", tax);
        result.putString("tax_percent", taxPercent);
        result.putString("total_amt", totAmt);
        Log.i("myLog", "doc total_amt:" + totAmt);
        result.putString("from_screen", fromScreen);
        result.putString("VITALS", "NOTRPT");
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }


    public void showFilterDialog() {
        dialogFilter = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_doctor_filter, null);
        dialogFilter.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogFilter.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogFilter.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogFilter.findViewById(R.id.btnSubmit);
        spinGender = dialogFilter.findViewById(R.id.spinGender);
        spinSpeciality = dialogFilter.findViewById(R.id.spinSpeciality);
        edtDate = dialogFilter.findViewById(R.id.edtSelDate);
        ImageView imgClose = dialogFilter.findViewById(R.id.imgClose);
        TextView txtClearFilter = dialogFilter.findViewById(R.id.txtClearFilter);
        dialogFilter.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        getGender();
        System.out.println("print gender  "  + selGender);
        currentAdapterPage =1;
        getDoctors(null, null, null, "filter",currentAdapterPage);
        if (stratDate != null)
            edtDate.setText(stratDate);
        edtDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "from date clicked");
                setFromDateCalender();
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
                stratDate=null;
                selGender=null;
                specialitys=null;
                dialogFilter.dismiss();
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                currentAdapterPage =1;
                getDoctors(null, null, null, "doctor",currentAdapterPage);
            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "btn submit");

                stratDate = edtDate.getText().toString();
                if (spinGender.getSelectedItem() != null)
                    selGender = spinGender.getSelectedItem().toString();
                if (spinSpeciality.getSelectedItem() != null)
                    specialitys = spinSpeciality.getSelectedItem().toString();

                if (stratDate.length() == 0)
                    stratDate = null;
                if (specialitys != null && specialitys.equalsIgnoreCase("Select Speciality"))
                    specialitys = null;
                if (selGender != null && selGender.equalsIgnoreCase("Select Gender"))
                    selGender = null;
                PreferenceManager.setString(PreferenceManager.DOC_FROM_DATE, stratDate);
                PreferenceManager.setString(PreferenceManager.DOC_FIT_GENTERS, selGender);
                PreferenceManager.setString(PreferenceManager.DOC_FIT_SPLICALITY, specialitys);
                getDoctors(specialitys, stratDate, selGender, "doctor",currentAdapterPage);
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
                dialogFilter.dismiss();
            }
        });
        dialogFilter.show();
    }


    private void setFromDateCalender() {
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
                        edtDate.setText(selDate);

                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        // at last we are calling show to
        // display our date picker dialog.
        Date date1 = new Date();
        datePickerDialog.getDatePicker().setMinDate(date1.getTime());
        datePickerDialog.show();
    }


    private void getGender() {
        Log.i("myLog", "getGender");
        services.getGender().enqueue(new Callback<List<OPHubResponse.GenderResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.GenderResponse>> call, Response<List<OPHubResponse.GenderResponse>> response) {
                try {
                    Log.i("myLog", "getGender onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.GenderResponse> list = response.body();
                        int size = list.size();
                        ArrayList<String> genderAL = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            OPHubResponse.GenderResponse resp = list.get(start);
                            genderAL.add(resp.getGender());
                        }
                        if (spinGender != null) {
                            OPHubUtils.addProdTypeSpinner(getActivity(), genderAL, spinGender, "Select Gender");
                        }
                        if (selGender != null) {
                            int index = genderAL.indexOf(selGender);
                            spinGender.setSelection(index);
                        }

                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.GenderResponse>> call, Throwable t) {
                //  OPHubUtils.showUnknownErrorDialog(getActivity());
                Log.i("myLog", "getGender onFailure:" + t.getMessage());
            }

        });
    }


    private void rescheduleAppt(String fromScreen, String apptId, String date, String time, int doctorId, String docName, int shiftId, int globalShiftId, String status, String apptStatusId) {
        Log.i("mylog", "rescheduleAppt apptid::" + apptId + "    hosp_id:" + hospId + "   status:" + status);
        OPHubRequests.RescheduleApptReq request = new OPHubRequests.RescheduleApptReq();
        request.setDate(date);
        String[] timeArr = time.split(" - ");
        try {
            SimpleDateFormat sdf12Hour = new SimpleDateFormat("hh:mm:ss a");
            SimpleDateFormat sdf24Hour = new SimpleDateFormat("HH:mm:ss");
            Date date1 = sdf12Hour.parse(timeArr[0]);
            String time24Hr = sdf24Hour.format(date1);
            request.setTime(time24Hr);
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setHospId(hospId);
        request.setDoctorId(doctorId);
        request.setShiftId(shiftId);
        request.setLive_consult("no");
        request.setApptStatus(status);
        request.setGlobal_shift_id(globalShiftId);
        request.setApptStatusId(apptStatusId);
        request.setPaymentMode("offline");
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
                        Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
                        if (status != null && status.equalsIgnoreCase("Success")) {
                            //  if (fromScreen.equalsIgnoreCase("Appointment_info"))
                            gotoApptSubMenuFragment();
                            //  else if (fromScreen.equalsIgnoreCase("Tracking"))
                            //    gotoTrackingStatus(doctorId, docName);
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
                Log.i("myLog", "rescheduleAppt response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void getAppointmentStatus(String hospId) {
        Log.i("myLog", "getAppointmentStatus hospId:" + hospId);
        services.getAppointmentStatus(hospId).enqueue(new Callback<List<GetAppointmentStatusResponse>>() {

            @Override
            public void onResponse(Call<List<GetAppointmentStatusResponse>> call, Response<List<GetAppointmentStatusResponse>> response) {
                try {
                    Log.i("myLog", "getAppointmentStatus onResponse:" + new Gson().toJson(response.body()));
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

                    } //else {
                    //OPHubUtils.showErrorDialog(getActivity(), response.message());
                    //}
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<GetAppointmentStatusResponse>> call, Throwable t) {
                Log.i("myLog", "getAppointmentStatus onFailure:" + t.getMessage());
                //  OPHubUtils.showUnknownErrorDialog(getActivity());
                //call.clone().enqueue(this);
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
