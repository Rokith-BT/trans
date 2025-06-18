package com.plenome.pos.views;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

import com.plenome.pos.R;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;

import java.util.ArrayList;
import java.util.Calendar;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class ConsentRequestFragment extends Fragment {
    View rootView;

    RestServices services;

    @BindView(R.id.purposeRequest)
    Spinner purposeRequest;

    @BindView(R.id.close_fragment)
    TextView closeFragment;

    @BindView(R.id.patient_name)
    TextView patientName;

    @BindView(R.id.edtFromDate)
    EditText edtFromDate;

    @BindView(R.id.edtToDate)
    EditText edtToDate;

    @BindView(R.id.lyt_op_consulation)
    LinearLayout lytOpConsulation;

    @BindView(R.id.lyt_diagnostic_report)
    LinearLayout lytDiagnosticReport;

    @BindView(R.id.lyt_prescription)
    LinearLayout lytPrescription;

    @BindView(R.id.lyt_discharge_summary)
    LinearLayout lytDischargeSummary;

    @BindView(R.id.lyt_immunisation_record)
    LinearLayout lytImmunisationRecord;

    @BindView(R.id.lyt_health_document_record)
    LinearLayout lytHealthDocumentRecord;

    @BindView(R.id.lyt_wellness_record)
    LinearLayout lytWellnessRecord;

    @BindView(R.id.request_consent)
    Button request_consent;

    String dateselection = "";
    String name = "";
    String opConsulation = "", diagnosticReport = "", prescription = "", dischargeSummary = "", immunisationRecord = "", healthDocumentRecord = "", wellnessRecord = "";

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_consent_request, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);

        Bundle bundle = getArguments();
        if (bundle != null) {
            name = bundle.getString("name");

        }

        patientName.setText(name);

        ArrayList<String> al = new ArrayList<>();
        al.add("Care Management");
        al.add("Break the Glass");
        al.add("Public Health");
        al.add("Healthcare Payment");
        al.add("Disease Specific Healthcare Research");
        al.add("Self Requested");


        ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, al);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        purposeRequest.setAdapter(adapter);

        return rootView;
    }


    @OnClick(R.id.close_fragment)
    public void closeFragment() {
        getActivity().onBackPressed();
    }

    @OnClick(R.id.edtFromDate)
    public void setEdtFromDate() {
        dateselection = "fromdate";
        setFromDateCalender();
    }

    @OnClick(R.id.edtToDate)
    public void setEdtToDate() {
        dateselection = "todate";
        setFromDateCalender();
    }

    @OnClick(R.id.lyt_op_consulation)
    public void setOpConsulation() {

        if (opConsulation.equalsIgnoreCase("")) {
            lytOpConsulation.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            opConsulation = "OPConsultation";
        } else {
            lytOpConsulation.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            opConsulation = "";
        }
    }

    @OnClick(R.id.lyt_diagnostic_report)
    public void setDiagnosticReport() {
        if (diagnosticReport.equalsIgnoreCase("")) {
            lytDiagnosticReport.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            diagnosticReport = "DiagnosticReport";
        } else {
            lytDiagnosticReport.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            diagnosticReport = "";
        }

    }

    @OnClick(R.id.lyt_prescription)
    public void setPrescription() {


        if (prescription.equalsIgnoreCase("")) {
            lytPrescription.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            prescription = "Prescription";
        } else {
            lytPrescription.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            prescription = "";
        }

    }

    @OnClick(R.id.lyt_discharge_summary)
    public void setdischargeSummary() {


        if (dischargeSummary.equalsIgnoreCase("")) {
            lytDischargeSummary.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            dischargeSummary = "DischargeSummary";
        } else {
            lytDischargeSummary.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            dischargeSummary = "";
        }

    }

    @OnClick(R.id.lyt_immunisation_record)
    public void setimmunisationRecord() {


        if (immunisationRecord.equalsIgnoreCase("")) {
            lytImmunisationRecord.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            immunisationRecord = "ImmunizationRecord";
        } else {
            lytImmunisationRecord.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            immunisationRecord = "";
        }

    }


    @OnClick(R.id.lyt_health_document_record)
    public void sethealthDocumentRecord() {


        if (healthDocumentRecord.equalsIgnoreCase("")) {
            lytHealthDocumentRecord.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            healthDocumentRecord = "HealthDocumentRecord";
        } else {
            lytHealthDocumentRecord.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            healthDocumentRecord = "";
        }

    }

    @OnClick(R.id.lyt_wellness_record)
    public void setlytWellnessRecord() {


        if (wellnessRecord.equalsIgnoreCase("")) {
            lytWellnessRecord.setBackgroundResource(R.drawable.rounded_rectangle_blue);
            wellnessRecord = "WellnessRecord";
        } else {
            lytWellnessRecord.setBackgroundResource(R.drawable.rounded_rectangle_light_blue);
            wellnessRecord = "";
        }

    }

    @OnClick(R.id.request_consent)
    public void request_consent() {

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
                        if (dateselection.equalsIgnoreCase("fromdate")) {
                            edtFromDate.setText(selDate);
                        }
                        else{
                            edtToDate.setText(selDate);
                        }

                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        c.add(Calendar.DAY_OF_MONTH, -1);
        datePickerDialog.getDatePicker().setMaxDate(c.getTimeInMillis());
        // at last we are calling show to
        // display our date picker dialog.
        datePickerDialog.show();
    }

}
