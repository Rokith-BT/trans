package com.plenome.pos.views.vitalsReports;

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
import android.os.Looper;
import android.provider.Settings;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.adapters.ExistingPatientAdapter;
import com.plenome.pos.model.ExistPatientDetail;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.VitalsRequestResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.appointment.AppointmentFragment;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;
import com.plenome.pos.views.billing.BillingFragment;
import com.plenome.pos.views.bpMonitor.OmronScanFragment;
import com.plenome.pos.views.patientDetail.AddNewPatientFragment;
import com.plenome.pos.views.patientDetail.PatientProfileFragment;
import com.plenome.pos.views.vibrasense.DeviceScanAndConnectActivity;
import com.plenome.pos.views.vibrasense.VitalMeasurementFragment;
import com.plenome.pos.views.vibrasense.VitalsFragment;
import com.plenome.pos.views.vibrasense.ecg.FileUploadAndGraphActivity;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VitalsReport extends Fragment {
    View rootView;
    RestServices services;
    private Dialog dialogScan;
    private Integer option;
    String opdId;
    int hospitalId,patientId;

    private Dialog dilogAppointment;
    ImageView imgClose;
    private EditText edtPatientId;
    private LinearLayout mapLay,searchLay;

    Button add_new;

    private ProgressBar appointment_progress;
    private RecyclerView recyclerView;

    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable debounceRunnable;
    private static final long DEBOUNCE_DELAY = 1500;

    boolean isLoading = false;

    List<ExistPatientDetail.Detail> patientList = new ArrayList<>();
    ExistingPatientAdapter adapter = new ExistingPatientAdapter();

    int currentAdapterPage = 1;

    TextView txtTitle;


    @BindView(R.id.mapVitals)
    TextView mapVitals;

    @BindView(R.id.backButton)
    TextView backButton;

    String DeviceClick="";
    String sys, dia, pulse;
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_vitals_reports, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        hospitalId = OPHubApplication.getHospitalId();
        opdId = OPHubApplication.getOPID();
        DeviceClick = OPHubApplication.getDeviceClik();
        Bundle bundle = getArguments();
        if (bundle != null) {
            sys = bundle.getString("sys");
            dia = bundle.getString("dia");
            pulse = bundle.getString("pulse");
        }
//        System.out.println("print opdId: " + opdId);
//        System.out.println("print patientId: " + patientId);
        initView();
        return rootView;
    }

    private void initView() {
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                VitalsFragment newFragment = new VitalsFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                transaction.replace(R.id.fragment_container, newFragment, "ss");
                transaction.addToBackStack(null);
                transaction.commit();

            }
        });

        mapVitals.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {



                showBookAppoinment();

            }
        });
    }
    private void callPostApi(String pulse, String sys, String dia) {
        Log.i("myLog", "viewConsentReq");
        VitalsRequestResponse request = new VitalsRequestResponse();
        request.setPulse(pulse);
        request.setBp(sys+"/"+dia);
        Log.i("myLog", "viewConsentReq request : " + new Gson().toJson(request));
        Call<VitalsRequestResponse> call = services.postVitals(Integer.parseInt(opdId), hospitalId, request);
        call.enqueue(new Callback<VitalsRequestResponse>() {
            @Override
            public void onResponse(Call<VitalsRequestResponse> call, Response<VitalsRequestResponse> response) {

//                VitalsReport newFragment = new VitalsReport();
//                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
//                transaction.replace(R.id.fragment_container, newFragment, "SS");
//                transaction.addToBackStack(null);
//                transaction.commit();
            }

            @Override
            public void onFailure(Call<VitalsRequestResponse> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void showBookAppoinment() {
        dilogAppointment = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dilog_vitals_appointment, null);
        dilogAppointment.setContentView(view);
        dilogAppointment.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dilogAppointment.getWindow().setGravity(Gravity.CENTER);
        imgClose = dilogAppointment.findViewById(R.id.imgClose);
        edtPatientId = dilogAppointment.findViewById(R.id.edtPatientId);
        mapLay = dilogAppointment.findViewById(R.id.mapLay);
        searchLay = dilogAppointment.findViewById(R.id.searchLay);
        add_new = dilogAppointment.findViewById(R.id.add_new);
        txtTitle = dilogAppointment.findViewById(R.id.txtTitle);
        appointment_progress = dilogAppointment.findViewById(R.id.appointment_progress);

        txtTitle.setText("Map Vitals");
        recyclerView = dilogAppointment.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        recyclerView.setAdapter(adapter);

        callPostApi(pulse,sys,dia);
        if (DeviceClick.equalsIgnoreCase("Clicked")){
            appointment_progress.setVisibility(View.VISIBLE);
            txtTitle.setVisibility(View.INVISIBLE);
            mapLay.setVisibility(View.VISIBLE);
            searchLay.setVisibility(View.GONE);
            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    appointment_progress.setVisibility(View.GONE);
                    dilogAppointment.dismiss();
                    AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
                    Bundle result_data = new Bundle();
                    String apptId = PreferenceManager.getString(PreferenceManager.APPOINTMENT_ID, "");
                    String opdId = PreferenceManager.getString(PreferenceManager.OPD_ID, "");
                    String token = PreferenceManager.getString(PreferenceManager.APPOINTMENT_TOKEN, "");
                    String fromScreen = PreferenceManager.getString(PreferenceManager.FROM_SCREEN, "");
                    String fromTab = PreferenceManager.getString(PreferenceManager.FROM_TAB, "");
                    String toTab = PreferenceManager.getString(PreferenceManager.TO_TAB, "");
                    double apptFeesStr = PreferenceManager.getDouble(PreferenceManager.APPT_FEES,00);
                    int pId = PreferenceManager.getInt(PreferenceManager.PATIENT_ID, 0);
                    Log.d("checkfromScreen", "checkfromScreen: "+fromScreen);

                    Bundle result = new Bundle();
                    result.putInt("patient_id", pId);
                    result.putString("appt_id", apptId);
                    result.putString("opd_ID", opdId);
                    result.putString("token", token);
                    result.putString("from_screen", fromScreen);
                    result.putString("from_tab", fromTab);
                    result.putString("to_tab", toTab);
                    result.putDouble("appt_fees", apptFeesStr);
                    result.putString("VITALS", "REPORT");
                    newFragment.setArguments(result);
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    transaction.replace(R.id.fragment_container, newFragment);
                    transaction.addToBackStack(null);
                    transaction.commit();

//                                        VitalMeasurementFragment vitalMeasurementFragment = new VitalMeasurementFragment();
//                                        Bundle result_data = new Bundle();
//                                        int opd_id_vital = 0;
//                                        if (opdId != null) {
//                                            opd_id_vital = Integer.parseInt(opdId);
//                                        }
//                                        result_data.putInt("opdId", opd_id_vital);
//                                        vitalMeasurementFragment.setArguments(result_data);
//                                        FragmentTransaction vitalsTransaction = getParentFragmentManager().beginTransaction();
//                                        vitalsTransaction.replace(R.id.fragment_container, vitalMeasurementFragment);
//                                        vitalsTransaction.addToBackStack(null);
//                                        vitalsTransaction.commit();

                }
            }, 1000);


        }else {
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
        }



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
                                appointment_progress.setVisibility(View.VISIBLE);
                                new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                                    @Override
                                    public void run() {
                                        txtTitle.setVisibility(View.INVISIBLE);
                                        appointment_progress.setVisibility(View.GONE);
                                        searchLay.setVisibility(View.GONE);
                                        mapLay.setVisibility(View.VISIBLE);


                                        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                                            @Override
                                            public void run() {
                                                dilogAppointment.dismiss();
                                                VitalsFragment newFragment = new VitalsFragment();
                                                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                                transaction.replace(R.id.fragment_container, newFragment);
                                                transaction.addToBackStack(null);
                                                transaction.commit();

                                            }
                                        }, 100);








                                    }
                                }, 500);





                                //dilogAppointment.dismiss();
//                                PatientProfileFragment newFragment = new PatientProfileFragment();
//                                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
//                                Bundle result = new Bundle();
//                                result.putString("from_screen", "Main");
//                                result.putString("qr_type", "Patient_QR");
//                                result.putString("aayush_unique_id", detail.getAayushUniqueId());
//                                newFragment.setArguments(result);
//                                transaction.replace(R.id.fragment_container, newFragment);
//                                transaction.addToBackStack(null);
//                                transaction.setReorderingAllowed(true);
//                                transaction.commitAllowingStateLoss();
                            }
                        });
                    }
                }
            }

            @Override
            public void onFailure(Call<ExistPatientDetail> call, Throwable t) {
                Log.i("myLog", "getExistPatientDet response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

}
