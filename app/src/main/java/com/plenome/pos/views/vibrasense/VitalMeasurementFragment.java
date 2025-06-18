package com.plenome.pos.views.vibrasense;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
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
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.VibarasensGetResponse;
import com.plenome.pos.model.VitalsRequestResponse;
import com.plenome.pos.model.VitalsResquest;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.OPHubApplication;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class VitalMeasurementFragment extends Fragment {
    View rootView;

    RestServices services;
    private static Dialog vibrasenseDialog;
    private static Context context;
    @BindView(R.id.vitals_edit)
    LinearLayout vitalsSpinner;


    @BindView(R.id.tblHead)
    LinearLayout tblHead;

    @BindView(R.id.lyt_reading)
    LinearLayout lytReading;


    @BindView(R.id.add_vitals)
    Button addVitals;

    @BindView(R.id.lyt_manual)
    RelativeLayout lytManual;

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;


    @BindView(R.id.temperature)
    EditText temperature;

    @BindView(R.id.pulse)
    EditText pulse;

    @BindView(R.id.blood_pressure)
    EditText bloodPressure;

    @BindView(R.id.respiratory_rate)
    EditText respiratoryRate;


    @BindView(R.id.weight)
    EditText weight;

    @BindView(R.id.height_measure)
    EditText heightMeasure;

    @BindView(R.id.spo)
    EditText spo;

    @BindView(R.id.save_data)
    Button saveData;

    @BindView(R.id.lyt_save)
    RelativeLayout lytSave;

    @BindView(R.id.cancel)
    Button cancel;

    @BindView(R.id.vibrasense)
    Button vibrasense;

    Boolean pastData = false;


    @BindView(R.id.tblDet)
    TableLayout tblView;

    @BindView(R.id.lyt_comming)
    RelativeLayout lytComming;

    @BindView(R.id.manual)
    Button manual;

    @BindView(R.id.device)
    Button device;

    private Typeface typeface;
    private TextView rightp1, rightp2, rightp3, rightp4, rightp5, rightp6,leftp1,leftp2,leftp3,leftp4,leftp5,leftp6,rightVpt,leftVpt;
    private LinearLayout.LayoutParams progressBgParam, progressFirstBgParam, progressLastBgParam, progressTxtParam, progressLineParam,
            statusTxtParam, statusNameParam, statusCountParam, statusBgParam, statusBgFirstParam;

    private int width, height;
    TableRow.LayoutParams txtParam, lineParam, imgParam;


    int sizeVitals = 10, currentIndexVitals = 0;

    LinearLayout[] linearRowVitals = new LinearLayout[sizeVitals];

    Spinner[] medicineName = new Spinner[sizeVitals];
    Spinner[] dosage = new Spinner[sizeVitals];
    Spinner[] frequency = new Spinner[sizeVitals];
    Spinner[] timing = new Spinner[sizeVitals];
    Spinner[] duration = new Spinner[sizeVitals];
    Spinner[] quatity = new Spinner[sizeVitals];
    EditText[] remarksVitals = new EditText[sizeVitals];
    ImageView[] actionVitals = new ImageView[sizeVitals];

    int opd_id_vital = 0;
    int hospitalId, patientId;
    String opdId;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_vitals_measurement, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.vitals);
        OPHubApplication.appBarImage.setVisibility(GONE);

        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        initParams();
        showVitals();

//        addVitals(currentIndexVitals);

        hospitalId = OPHubApplication.getHospitalId();
        Bundle bundle = getArguments();
        if (bundle != null) {
            opdId = String.valueOf(bundle.getInt("opdId"));
            patientId = bundle.getInt("patient_id");
        }

        System.out.println("print opdId: " + opdId);
        System.out.println("print patientId: " + patientId);

        callGetApi();
//        vibarasensGet();

        bloodPressure.addTextChangedListener(new TextWatcher() {
            private boolean isEditing;
            private String previousText = "";

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                // No action needed
                previousText = s.toString();
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // No action needed
            }

            @Override
            public void afterTextChanged(Editable s) {
                if (isEditing) return;
                isEditing = true;

                String input = s.toString();
                String digitsOnly = input.replace("/", "");

                // Handle deletion of the slash
                if (previousText.contains("/") && !input.contains("/")) {
                    int slashIndex = previousText.indexOf("/");
                    if (slashIndex > 0 && slashIndex <= digitsOnly.length()) {
                        digitsOnly = digitsOnly.substring(0, slashIndex - 1) + digitsOnly.substring(slashIndex);
                    }
                }

                String formatted = digitsOnly;

                if (digitsOnly.length() >= 1) {
                    char firstChar = digitsOnly.charAt(0);
                    if (firstChar == '1' || firstChar == '2' || firstChar == '3') {
                        if (digitsOnly.length() >= 3) {
                            formatted = digitsOnly.substring(0, 3) + "/" + digitsOnly.substring(3);
                        }
                    } else if (firstChar == '4' || firstChar == '5' || firstChar == '6' ||
                            firstChar == '7' || firstChar == '8' || firstChar == '9') {
                        if (digitsOnly.length() >= 2) {
                            formatted = digitsOnly.substring(0, 2) + "/" + digitsOnly.substring(2);
                        }
                    }
                }

                bloodPressure.setText(formatted);
                bloodPressure.setSelection(formatted.length());

                isEditing = false;
            }
        });
        return rootView;
    }

    private void vibarasensGet() {
        Call<VibarasensGetResponse> call = services.getVitalsdata(Integer.parseInt(opdId), hospitalId);
        call.enqueue(new Callback<VibarasensGetResponse>() {
            @Override
            public void onResponse(Call<VibarasensGetResponse> call, Response<VibarasensGetResponse> response) {
                try {
                    if (response.body() != null) {
                        VibarasensGetResponse.DeviceReading resp = new VibarasensGetResponse.DeviceReading();
                        String left1= String.valueOf(resp.getLeftp1());
                        String left2= String.valueOf(resp.getLeftp2());
                        String left3= String.valueOf(resp.getLeftp3());
                        String left4= String.valueOf(resp.getLeftp4());
                        String left5= String.valueOf(resp.getLeftp5());
                        String left6= String.valueOf(resp.getLeftp6());
                        String leftvpt= String.valueOf(resp.getLeftvpt());

                        String right1= String.valueOf(resp.getRight1());
                        String right2= String.valueOf(resp.getRight2());
                        String right3= String.valueOf(resp.getRight3());
                        String right4= String.valueOf(resp.getRight4());
                        String right5= String.valueOf(resp.getRight5());
                        String right6= String.valueOf(resp.getRight6());
                        String rightvpt= String.valueOf(resp.getRightvpt());

                        leftp1.setText(left1);
                        leftp2.setText(left2);
                        leftp3.setText(left3);
                        leftp4.setText(left4);
                        leftp5.setText(left5);
                        leftp6.setText(left6);
                        leftVpt.setText(leftvpt);

                        rightp1.setText(right1);
                        rightp2.setText(right2);
                        rightp3.setText(right3);
                        rightp4.setText(right4);
                        rightp5.setText(right5);
                        rightp6.setText(right6);
                        rightVpt.setText(rightvpt);
                        /* resp.setLegtype("left");*/
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }

            }

            @Override
            public void onFailure(Call<VibarasensGetResponse> call, Throwable t) {
                Log.i("myLog", "vibrasense response failure:" + t.toString());
            }
        });
    }

    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            txtParam = new TableRow.LayoutParams(width / 5, dpToPx(50));
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
            txtParam = new TableRow.LayoutParams(width / 5, dpToPx(50));
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

    public void addVitals(int index) {


        linearRowVitals[index] = new LinearLayout(getContext());
        linearRowVitals[index].setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));
        linearRowVitals[index].setOrientation(LinearLayout.HORIZONTAL);
        linearRowVitals[index].setWeightSum(3);

        medicineName[index] = new Spinner(getContext());
        medicineName[index].setLayoutParams(new LinearLayout.LayoutParams(
                0, // Width set to 0 to use weight
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1));
        medicineName[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);


        int arrayResId = R.array.navigation_drawer_items_array;
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getContext(),
                arrayResId, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        medicineName[index].setAdapter(adapter);
        linearRowVitals[index].addView(medicineName[index]);


        dosage[index] = new Spinner(getContext());
        dosage[index].setLayoutParams(new LinearLayout.LayoutParams(
                0, // Width set to 0 to use weight
                LinearLayout.LayoutParams.WRAP_CONTENT, 1));
        dosage[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);


        dosage[index].setAdapter(adapter);
        linearRowVitals[index].addView(dosage[index]);


        frequency[index] = new Spinner(getContext());
        frequency[index].setLayoutParams(new LinearLayout.LayoutParams(
                0, // Width set to 0 to use weight
                LinearLayout.LayoutParams.WRAP_CONTENT,
                1));
        frequency[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);


        frequency[index].setAdapter(adapter);
        linearRowVitals[index].addView(frequency[index]);


//        vitalsSpinner.addView(linearRowVitals[index]);


    }

    private void showVitals() {

        TableRow trTitle = new TableRow(getActivity());

        TextView txtSiNo = new TextView(getActivity());
        txtSiNo.setText(R.string.slNo);
        txtSiNo.setTextColor(Color.WHITE);
        txtSiNo.setTypeface(typeface);
        txtSiNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtSiNo.setGravity(Gravity.CENTER);
        trTitle.addView(txtSiNo, txtParam);

        TextView opdNo = new TextView(getActivity());
        opdNo.setText(R.string.opd_no);
        opdNo.setTextColor(Color.WHITE);
        opdNo.setTypeface(typeface);
        opdNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        opdNo.setGravity(Gravity.CENTER);
        trTitle.addView(opdNo, txtParam);

        TextView txtDateTime = new TextView(getActivity());
        txtDateTime.setText(R.string.date_time);
        txtDateTime.setTextColor(Color.WHITE);
        txtDateTime.setTypeface(typeface);
        txtDateTime.setGravity(Gravity.CENTER);
        txtDateTime.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        trTitle.addView(txtDateTime, txtParam);

        TextView txtConsultant = new TextView(getActivity());
        txtConsultant.setText(R.string.consultant);
        txtConsultant.setTextColor(Color.WHITE);
        txtConsultant.setTypeface(typeface);
        txtConsultant.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtConsultant.setGravity(Gravity.CENTER);
        trTitle.addView(txtConsultant, txtParam);


        TextView txtAction = new TextView(getActivity());
        txtAction.setText(R.string.action);
        txtAction.setTextColor(Color.WHITE);
        txtAction.setTypeface(typeface);
        txtAction.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtAction.setGravity(Gravity.CENTER);
        trTitle.addView(txtAction, txtParam);

        trTitle.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.table_heading_bg));


        tblHead.addView(trTitle);

//            ImageView[] img = new ImageView[size];
//            for (int start = 0; start < size; start++) {
//                final int index = start;
//                GetPrescriptionResponse resp = list.get(start);
//                String files = resp.getFiles();
//
//                TableRow tr = new TableRow(getActivity());
//                tr.setGravity(Gravity.CENTER);
//                TextView txtToken = new TextView(getActivity());
//                txtToken.setText(String.valueOf(resp.getHospOPDId()));
//                txtToken.setTextColor(ContextCompat.getColor(getContext(), R.color.vitaltbl_text));
//                txtToken.setTypeface(typeface);
//                txtToken.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
//                txtToken.setGravity(Gravity.CENTER);
//                tr.addView(txtToken, txtParam);
//
//                TextView txtName = new TextView(getActivity());
//                txtName.setText(resp.getAppointmentDate());
//                txtName.setTextColor(ContextCompat.getColor(getContext(), R.color.vitaltbl_text));
//                txtName.setTypeface(typeface);
//                txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
//                txtName.setGravity(Gravity.CENTER);
//                tr.addView(txtName, txtParam);
//
//                TextView txtPatientId = new TextView(getActivity());
//                txtPatientId.setText(resp.getDoctorName());
//                txtPatientId.setTypeface(typeface);
//                txtPatientId.setTextColor(ContextCompat.getColor(getContext(), R.color.vitaltbl_text));
//                txtPatientId.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
//                txtPatientId.setGravity(Gravity.CENTER);
//                tr.addView(txtPatientId, txtParam);
//
//                img[start] = new ImageView(getActivity());
//                img[start].setImageResource(R.drawable.pdf);
//                tr.addView(img[index], imgParam);
//
//                img[start].setOnClickListener(new View.OnClickListener() {
//                    @Override
//                    public void onClick(View v) {
//                        Log.i("myLog", "image clicked index:" + index);
//                        GetPrescriptionResponse resp = list.get(index);
//                        String files = resp.getFiles();
//                        Log.i("myLog", "Files :" + files);
////                        showFile(files);
//                    }
//                });
//                TableRow trLine1 = new TableRow(getActivity());
//                View v1 = new View(getActivity());
//                v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
//                trLine1.addView(v1, lineParam);
//                //  tr.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
//                tblView.addView(tr);
//                tblView.addView(trLine1);
//            }


    }

    @OnClick(R.id.vibrasense)
    public void vibrasense() {
        showVibrasense();
        vibarasensGet();
    }

    @OnClick(R.id.add_vitals)
    public void addNew() {
        lytReading.setVisibility(VISIBLE);
        lytManual.setVisibility(VISIBLE);
        vibrasense.setVisibility(GONE);
        tblHead.setVisibility(GONE);
        txtNoData.setVisibility(GONE);
        imgNoData.setVisibility(GONE);
        addVitals.setVisibility(GONE);
        tblView.setVisibility(GONE);
        lytSave.setVisibility(VISIBLE);
    }

    @OnClick(R.id.save_data)
    public void saveData() {
        if (temperature.getText().toString().isEmpty()
                && pulse.getText().toString().isEmpty()
                && bloodPressure.getText().toString().isEmpty()
                && respiratoryRate.getText().toString().isEmpty()
                && weight.getText().toString().isEmpty()
                && heightMeasure.getText().toString().isEmpty()
                && spo.getText().toString().isEmpty()) {
            OPHubUtils.showAlertDialog(getContext(),"Please fill at least one Vital detail !");
            return;
        }

        callPostApi();


    }

    @OnClick(R.id.device)
    public void device() {


        lytComming.setVisibility(VISIBLE);
        lytReading.setVisibility(GONE);
        lytSave.setVisibility(GONE);
        device.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        manual.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        manual.setTextColor(getResources().getColor(R.color.appbarColor));
        device.setTextColor(getResources().getColor(R.color.white));
        View container = getActivity().findViewById(R.id.fragment_container);
        if (container == null) {
            return;
        }
        VitalsFragment vitalsFragment = new VitalsFragment();
        Bundle result_data = new Bundle();

        if (opdId != null) {
            opd_id_vital = Integer.parseInt(opdId);
        }
        result_data.putInt("patient_id", patientId);
        result_data.putInt("opdId", opd_id_vital);
        result_data.putString("DeviceClick", "Clicked");
        vitalsFragment.setArguments(result_data);
        FragmentTransaction transVital;
        if (getActivity() != null) {
            transVital = getActivity().getSupportFragmentManager().beginTransaction();
        } else {
            transVital = getParentFragmentManager().beginTransaction();
        }

        transVital.replace(R.id.fragment_container, vitalsFragment);
        transVital.addToBackStack(null);
        transVital.commit();

    }

    @OnClick(R.id.manual)
    public void manual() {
        lytComming.setVisibility(GONE);
        lytReading.setVisibility(VISIBLE);
        lytSave.setVisibility(VISIBLE);
        manual.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        device.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        device.setTextColor(getResources().getColor(R.color.appbarColor));
        manual.setTextColor(getResources().getColor(R.color.white));


    }

    @OnClick(R.id.cancel)
    public void cancel() {

        if (pastData) {
            tblHead.setVisibility(VISIBLE);
            tblView.setVisibility(VISIBLE);

            txtNoData.setVisibility(GONE);
            imgNoData.setVisibility(GONE);
            addVitals.setVisibility(GONE);
            lytReading.setVisibility(GONE);
            lytManual.setVisibility(GONE);
            lytSave.setVisibility(GONE);
        } else {

            tblHead.setVisibility(GONE);
            tblView.setVisibility(GONE);
            lytReading.setVisibility(GONE);
            lytManual.setVisibility(GONE);
            lytSave.setVisibility(GONE);

            txtNoData.setVisibility(VISIBLE);
            imgNoData.setVisibility(VISIBLE);
            addVitals.setVisibility(VISIBLE);
            tblHead.setVisibility(VISIBLE);

        }

    }

    @SuppressLint("MissingInflatedId")
    public void showVibrasense() {

        AlertDialog.Builder builder = new AlertDialog.Builder(requireContext());
        LayoutInflater inflater = getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.dialog_vibrasense, null);
        builder.setView(dialogView);

        AlertDialog dialog = builder.create();
        dialog.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialog.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(400);
        dialog.getWindow().setAttributes(lp);
        rightp1 = dialogView.findViewById(R.id.rightp1);
        rightp2 = dialogView.findViewById(R.id.rightp2);
        rightp3 = dialogView.findViewById(R.id.rightp3);
        rightp4 = dialogView.findViewById(R.id.rightp4);
        rightp5 = dialogView.findViewById(R.id.rightp5);
        leftp1 = dialogView.findViewById(R.id.leftp1);
        leftp2 = dialogView.findViewById(R.id.leftp2);
        leftp3 = dialogView.findViewById(R.id.leftp3);
        leftp4 = dialogView.findViewById(R.id.leftp4);
        leftp5 = dialogView.findViewById(R.id.leftp5);
        leftp6 = dialogView.findViewById(R.id.leftp6);
        rightp6 = dialogView.findViewById(R.id.rightp6);
        rightVpt = dialogView.findViewById(R.id.rightvpt);
        leftVpt = dialogView.findViewById(R.id.leftvpt);
        TextView leftButton = dialogView.findViewById(R.id.leftbuttton);
        TextView righttbutton = dialogView.findViewById(R.id.righttbutton);
        LinearLayout rightFoot = dialogView.findViewById(R.id.rightFoot);
        LinearLayout leftfoot = dialogView.findViewById(R.id.leftFoot);

        leftButton.setOnClickListener(v -> {
            leftButton.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
            leftButton.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
            righttbutton.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue_outline));
            righttbutton.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
            rightFoot.setVisibility(GONE);
            leftfoot.setVisibility(VISIBLE);
        });

        righttbutton.setOnClickListener(v -> {
            righttbutton.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
            righttbutton.setTextColor(ContextCompat.getColor(getContext(), R.color.white));
            leftButton.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue_outline));
            leftButton.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
            rightFoot.setVisibility(VISIBLE);
            leftfoot.setVisibility(GONE);
        });
    }

    private void callGetApi() {
        Log.i("myLog", "viewConsentReq");


        Call<VitalsResquest> call = services.getVitals(Integer.parseInt(opdId), hospitalId);
        call.enqueue(new Callback<VitalsResquest>() {
            @Override
            public void onResponse(Call<VitalsResquest> call, Response<VitalsResquest> response) {

                try {
                    if (response.body() != null) {
                        Log.i("myLog", "server contact ");
                        VitalsResquest rep = response.body();
                        temperature.setText(rep.getDetails().getTemperature());
                        pulse.setText(rep.getDetails().getPulse());
                        bloodPressure.setText(rep.getDetails().getBp());
                        respiratoryRate.setText(rep.getDetails().getRespiration());
                        weight.setText(rep.getDetails().getWeight());
                        heightMeasure.setText(rep.getDetails().getHeight());
                        spo.setText(rep.getDetails().getSpo2());
                        System.out.println("print rep: " + rep.getDetails().getBp());
                        if (rep.getDetails().getBp().equalsIgnoreCase("") &&
                                rep.getDetails().getPulse().equalsIgnoreCase("") &&
                                rep.getDetails().getSpo2().equalsIgnoreCase("") &&
                                rep.getDetails().getTemperature().equalsIgnoreCase("") &&
                                rep.getDetails().getWeight().equalsIgnoreCase("") &&
                                rep.getDetails().getHeight().equalsIgnoreCase("")) {
                            System.out.println("print res inside");
                            txtNoData.setVisibility(VISIBLE);
                            imgNoData.setVisibility(VISIBLE);
                            addVitals.setVisibility(VISIBLE);
                            tblHead.setVisibility(VISIBLE);
                            lytSave.setVisibility(GONE);
                            pastData = false;
                        } else {
                            pastData = true;
                            System.out.println("print res outside");

                            showData(rep.getDetails().getOpd_details_id(), rep.getDetails().getDate_time(), rep.getDetails().getConsultant());
                            tblHead.setVisibility(VISIBLE);
                            tblView.setVisibility(VISIBLE);

                            txtNoData.setVisibility(GONE);
                            imgNoData.setVisibility(GONE);
                            addVitals.setVisibility(GONE);
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<VitalsResquest> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void showData(String opNoData, String dateTime, String consultantData) {

        Log.i("mylog", "showData");
        tblView.removeAllViews();
        TableRow tr = new TableRow(getActivity());


        TextView sNO = new TextView(getActivity());
        sNO.setText("1");
        sNO.setTypeface(typeface);
        sNO.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        sNO.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        sNO.setGravity(Gravity.CENTER);
        tr.addView(sNO, txtParam);

        TextView opdNo = new TextView(getActivity());
        opdNo.setText(opNoData);
        opdNo.setTypeface(typeface);
        opdNo.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        opdNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        opdNo.setGravity(Gravity.CENTER);
        tr.addView(opdNo, txtParam);

        TextView date = new TextView(getActivity());
        date.setText(dateTime);
        date.setTypeface(typeface);
        date.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        date.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        date.setGravity(Gravity.CENTER);
        tr.addView(date, txtParam);

        TextView consultant = new TextView(getActivity());
        consultant.setText(consultantData);
        consultant.setTypeface(typeface);
        consultant.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        consultant.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        consultant.setGravity(Gravity.CENTER);
        tr.addView(consultant, txtParam);

        TextView action = new TextView(getActivity());
        action.setText("View");
        action.setTypeface(typeface);
        action.setTextColor(ContextCompat.getColor(getContext(), R.color.appbarColor));
        action.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        action.setGravity(Gravity.CENTER);
        tr.addView(action, txtParam);


        action.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                tblHead.setVisibility(GONE);
                tblView.setVisibility(GONE);
                lytManual.setVisibility(VISIBLE);
                lytReading.setVisibility(VISIBLE);
                lytSave.setVisibility(VISIBLE);

            }
        });


        tblView.addView(tr);


    }

    private void callPostApi() {
        Log.i("myLog", "viewConsentReq");
        VitalsRequestResponse request = new VitalsRequestResponse();
        request.setTemperature(temperature.getText().toString());
        request.setPulse(pulse.getText().toString());
        request.setBp(bloodPressure.getText().toString());
        request.setRespiration(respiratoryRate.getText().toString());
        request.setWeight(weight.getText().toString());
        request.setHeight(heightMeasure.getText().toString());
        request.setSpo2(spo.getText().toString());

        Log.i("myLog", "viewConsentReq request : " + new Gson().toJson(request));
        Call<VitalsRequestResponse> call = services.postVitals(Integer.parseInt(opdId), hospitalId, request);
        call.enqueue(new Callback<VitalsRequestResponse>() {
            @Override
            public void onResponse(Call<VitalsRequestResponse> call, Response<VitalsRequestResponse> response) {

                try {
                    if (response.body() != null) {

                        tblHead.setVisibility(VISIBLE);
                        tblView.setVisibility(VISIBLE);
                        lytSave.setVisibility(GONE);
                        imgNoData.setVisibility(GONE);
                        txtNoData.setVisibility(GONE);
                        addVitals.setVisibility(GONE);

                        lytReading.setVisibility(GONE);
                        lytManual.setVisibility(GONE);
                        lytSave.setVisibility(GONE);

                        callGetApi();

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<VitalsRequestResponse> call, Throwable t) {
                Log.i("myLog", "downloadAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("ONRESUME");
        if (temperature.getText().toString().isEmpty()
                && pulse.getText().toString().isEmpty()
                && bloodPressure.getText().toString().isEmpty()
                && respiratoryRate.getText().toString().isEmpty()
                && weight.getText().toString().isEmpty()
                && heightMeasure.getText().toString().isEmpty()
                && spo.getText().toString().isEmpty()) {

        }else {
            callPostApionPause();
        }



    }

    private void callPostApionPause()  {
        Log.i("myLog", "viewConsentReq");
        VitalsRequestResponse request = new VitalsRequestResponse();
        request.setTemperature(temperature.getText().toString());
        request.setPulse(pulse.getText().toString());
        request.setBp(bloodPressure.getText().toString());
        request.setRespiration(respiratoryRate.getText().toString());
        request.setWeight(weight.getText().toString());
        request.setHeight(heightMeasure.getText().toString());
        request.setSpo2(spo.getText().toString());

        Log.i("myLog", "viewConsentReq request : " + new Gson().toJson(request));
        Call<VitalsRequestResponse> call = services.postVitals(Integer.parseInt(opdId), hospitalId, request);
        call.enqueue(new Callback<VitalsRequestResponse>() {
            @Override
            public void onResponse(Call<VitalsRequestResponse> call, Response<VitalsRequestResponse> response) {

            }

            @Override
            public void onFailure(Call<VitalsRequestResponse> call, Throwable t) {
            }
        });
    }
}
