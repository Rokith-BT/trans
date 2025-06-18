package com.plenome.pos.views.appointmentFlow;

import static android.view.Gravity.CENTER;

import android.Manifest;
import android.app.Dialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Base64;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.BorderRadius;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.layout.property.VerticalAlignment;
import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.model.CareContextLinkTokenResponse;
import com.plenome.pos.model.CareContextTokenRequest;
import com.plenome.pos.model.FhirBundleUploadResponse;
import com.plenome.pos.model.GetPatientProfileResponse;
import com.plenome.pos.model.HospitalDetailsResponse;
import com.plenome.pos.model.LinkCareContextRequest;
import com.plenome.pos.model.LinkCareContextResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.PreviewResponse;
import com.plenome.pos.model.ViewApptInfoResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.MainActivity;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.patientDetail.PatientProfileFragment;

import org.hl7.fhir.r4.model.Appointment;
import org.hl7.fhir.r4.model.CarePlan;
import org.hl7.fhir.r4.model.CodeableConcept;
import org.hl7.fhir.r4.model.Coding;
import org.hl7.fhir.r4.model.Composition;
import org.hl7.fhir.r4.model.Condition;
import org.hl7.fhir.r4.model.DiagnosticReport;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.Identifier;
import org.hl7.fhir.r4.model.Medication;
import org.hl7.fhir.r4.model.Narrative;
import org.hl7.fhir.r4.model.NutritionOrder;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Period;
import org.hl7.fhir.r4.model.Practitioner;
import org.hl7.fhir.r4.model.Quantity;
import org.hl7.fhir.r4.model.Reference;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PreviewFragment extends Fragment {
    private View rootView;
    private RestServices services, fileServices, abhaServices;
    private int opdId, hospId, width, height, textSize, patientId;
    private String roleName, apptId,paymentStatus, apptStatus,docKey,patientReqID,name,gender,dob,abhaAddress,
            hospitalName = "", hospitalAddress = "", hospitalDis = "", hospitalSta = "", hospitalImage = "", hospitalPincode = "", hospitalMobile = "", hospitalLink = "";
    private TableRow.LayoutParams prescTxParam, diagnosisTxtParam, prescLineParam, prescRemarksParam;
    private TableLayout.LayoutParams diagnosisTrParam, prescTrParam;
    private Typeface typeface;
    private static final int STORAGE_PERMISSION_CODE = 101;
    private PreviewResponse previewResponse;

    Bitmap bitmap1;

    @BindView(R.id.btnSubmit)
    Button btnSubmit;
    @BindView(R.id.txtPatientName)
    TextView txtPatientName;
    @BindView(R.id.txtDate)
    TextView txtDate;
    @BindView(R.id.txtGender)
    TextView txtGender;
    @BindView(R.id.txtBloodGroup)
    TextView txtBloodGroup;
    @BindView(R.id.txtAge)
    TextView txtAge;
    @BindView(R.id.txtMobile)
    TextView txtMobile;
    @BindView(R.id.txtEmail)
    TextView txtEmail;
    @BindView(R.id.txtAddress)
    TextView txtAddress;
    @BindView(R.id.linearVitals)
    LinearLayout linearVitals;
    @BindView(R.id.linearChiefComplaints)
    LinearLayout linearChiefComplaints;
    @BindView(R.id.linearPastTreatmentHistory)
    LinearLayout linearPastTreatmentHistory;
    @BindView(R.id.linearDiagnosis)
    LinearLayout linearDiagnosis;
    @BindView(R.id.linearPastTreatmentAdvice)
    LinearLayout linearTreatmentAdvice;
    @BindView(R.id.linearMedication)
    LinearLayout linearMedication;
    @BindView(R.id.linearFollowup)
    LinearLayout linearFollowup;

    @BindView(R.id.noDataLnr)
    LinearLayout noDataLnr;

    @BindView(R.id.dataLnr)
    RelativeLayout dataLnr;
    @BindView(R.id.txtPastTreatmentHiostory)
    TextView txtPastTreatmentHiostory;
    @BindView(R.id.txtFollowup)
    TextView txtFollowup;
    @BindView(R.id.txtTreatmentAdvice)
    TextView txtTreatmentAdvice;
    @BindView(R.id.txtTemp)
    TextView txtTemperature;
    @BindView(R.id.txtPulse)
    TextView txtPulse;
    @BindView(R.id.txtSpo2)
    TextView txtSpo2;
    @BindView(R.id.txtBP)
    TextView txtBp;
    //    @BindView(R.id.txtRespRate)
//    TextView txtRespRate;
    @BindView(R.id.txtWeight)
    TextView txtWeight;
    @BindView(R.id.txtHeight)
    TextView txtHeight;
    @BindView(R.id.tblDiagnosis)
    TableLayout tblDiagnosis;
    @BindView(R.id.tblMedication)
    TableLayout tblPresc;
    @BindView(R.id.tblChiefComplaints)
    TableLayout tblChiefComplaints;
    @BindView(R.id.txtDietPlan)
    TextView txtDietPlan;
    @BindView(R.id.txtChiefComplaints)
    TextView txtChiefComplaints;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_preview, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        abhaServices = RetrofitInstance.createAbhaService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.preview);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        roleName = OPHubApplication.getUserType();
        hospId = OPHubApplication.getHospitalId();
        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        Bundle bundle = getArguments();
        if (bundle != null) {
            opdId = bundle.getInt("opdId");
            apptId = bundle.getString("appt_id");
            apptStatus = bundle.getString("appt_status");
        }

        Log.i("myLog", "onCreateView opdId:" + opdId + "   apptId:" + apptId+"  appStatus"+ apptStatus);
        initParams();
        checkPermission();
        viewApptInfo(apptId);
        getPreview();
        callHospitalDetails();





        return rootView;
    }

    @OnClick(R.id.btnSubmit)
    public void clickSubmit() {
        PreviewResponse.Details details = previewResponse != null ? previewResponse.getDetails() : null;
        PreviewResponse.Vitals vitals = details != null ? details.getVitals() : null;
        PreviewResponse.ClinicalNotes clinicalNotes = details != null ? details.getClinicalNotes() : null;

        boolean isVitalsEmpty = vitals == null ||
                isEmpty(vitals.getBp()) &&
                        isEmpty(vitals.getTemperature()) &&
                        isEmpty(vitals.getSpo2()) &&
                        isEmpty(vitals.getPulse()) &&
                        isEmpty(vitals.getWeight()) &&
                        isEmpty(vitals.getHeight());

        boolean isChiefComplaintsEmpty = clinicalNotes == null ||
                clinicalNotes.getChiefComplaintsBasic() == null ||
                clinicalNotes.getChiefComplaintsBasic().isEmpty();

        boolean isPastHistoryEmpty = clinicalNotes == null ||
                clinicalNotes.getPastTreatmentHistory() == null ||
                isEmpty(clinicalNotes.getPastTreatmentHistory().getHistory());

        boolean isTreatmentAdviceEmpty = clinicalNotes == null ||
                clinicalNotes.getTreatmentAdvice() == null ||
                isEmpty(clinicalNotes.getTreatmentAdvice().getTreatmentAdvice());

        boolean isPrescriptionEmpty = details == null ||
                details.getPrescription() == null ||
                details.getPrescription().isEmpty();

        if (isVitalsEmpty && isChiefComplaintsEmpty && isPastHistoryEmpty && isTreatmentAdviceEmpty && isPrescriptionEmpty) {
            Toast.makeText(getContext(), "Empty data cannot be submitted. PDF creation failed", Toast.LENGTH_LONG).show();
            return;
        }

        if (paymentStatus != null && paymentStatus.equalsIgnoreCase("Payment done.")) {
            showConfirmationDialog();
        } else {
            OPHubUtils.showErrorDialog(getActivity(), "Please complete payment process!");
        }
    }

    // Helper method to avoid repeated null/empty checks
    private boolean isEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }


    private void getPreview() {
        Log.i("myLog", " getPreview ");
        Call<PreviewResponse> call = services.getPreview(opdId, hospId);
        call.enqueue(new Callback<PreviewResponse>() {

            @Override
            public void onResponse(Call<PreviewResponse> call, Response<PreviewResponse> response) {
                try {
                    Log.i("mylog", "getPreview response:" + new Gson().toJson(response.body()));
                    Log.d("getRawas", "onResponse: "+response.raw());

                    if (response.body() != null) {
                        previewResponse = response.body();
                        String status = response.body().getStatus();

                        if (status.equalsIgnoreCase("success")) {
                            PreviewResponse.Details details = response.body().getDetails();

                            // Check if the list is empty BEFORE loading it




                            if (details == null) {
                                noDataLnr.setVisibility(View.VISIBLE);
                                dataLnr.setVisibility(View.GONE);
                            } else {
                                noDataLnr.setVisibility(View.GONE);
                                dataLnr.setVisibility(View.VISIBLE);
                                loadData(details);
                            }





                        } else {
                            Toast.makeText(getContext(), "Something went wrong", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(getContext(), "Response is empty", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }


            @Override
            public void onFailure(Call<PreviewResponse> call, Throwable t) {

            }
        });
    }


    private void viewApptInfo(String apptId) {
        Log.i("mylog", "viewApptInfo apptId:" + apptId);
        Call<ViewApptInfoResponse> call = services.viewApptInfo(hospId, apptId);
        call.enqueue(new Callback<ViewApptInfoResponse>() {

            @Override
            public void onResponse(Call<ViewApptInfoResponse> call, Response<ViewApptInfoResponse> response) {
                try {
                    Log.i("myLog", "viewApptInfo response:");
                    Log.i("mylog", "viewApptInfo response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "viewApptInfo response isSuccess:" + response.body().toString());
                        ViewApptInfoResponse resp = response.body();
                        ViewApptInfoResponse.AppointmentDetails details = resp.getDetails();


                        if (details != null) {
                            paymentStatus = details.getPaymentStatus();
                            patientId = details.getPatientId();
                            AbhaAddressPatientData();
                            System.out.println("payments"+paymentStatus);
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


    private void loadData(PreviewResponse.Details details) {
        boolean isDocUploaded = details.isDocUploaded();
        Log.i("myLog", "isDocUploaded:" + isDocUploaded);
        if (apptStatus.equalsIgnoreCase("Inprocess") || (apptStatus.equalsIgnoreCase("In process"))) {
//            if (isDocUploaded)
//                btnSubmit.setVisibility(View.GONE);
//            else
            btnSubmit.setVisibility(View.VISIBLE);
        }

        else
            btnSubmit.setVisibility(View.GONE);
        System.out.println("priny + "+roleName);


        System.out.println("roleNamexx"+roleName+"---"+paymentStatus);

        if (roleName.equalsIgnoreCase("Nurse") || roleName.equalsIgnoreCase("Receptionist")) {
            if ("Payment done.".equalsIgnoreCase(paymentStatus)) {
                btnSubmit.setVisibility(View.VISIBLE);
            } else {
                OPHubUtils.showErrorDialog(getActivity(), "Please complete payment process!");
                btnSubmit.setVisibility(View.VISIBLE);
            }
        } else {
            btnSubmit.setVisibility(View.VISIBLE);
        }


        PreviewResponse.PatientDetails patientDet = details.getPatientDetails();
        patientId = patientDet.getId();
        txtPatientName.setText(patientDet.getPatientName());
        txtAge.setText(patientDet.getAge());
        txtGender.setText(patientDet.getGender());
        txtBloodGroup.setText(patientDet.getPatientBloodGroup());
        txtEmail.setText(patientDet.getEmail());
        txtMobile.setText(patientDet.getMobileno());
        txtAddress.setText(patientDet.getAddress());
        name = patientDet.getPatientName();
        gender = patientDet.getGender();
        dob = patientDet.getDob();
//        abhaAddress = patientDet.getAbhaAddress();
        String date = getCurrentDateTime();
        txtDate.setText(date);
        PreviewResponse.Vitals vitals = details.getVitals();
        if (vitals != null) {
            txtTemperature.setText(vitals.getTemperature());
            txtBp.setText(vitals.getBp());
            txtSpo2.setText(vitals.getSpo2());
//            txtRespRate.setText(vitals.getRespiration());
            txtWeight.setText(vitals.getWeight());
            txtHeight.setText(vitals.getHeight());
            txtPulse.setText(vitals.getPulse());
        }
        PreviewResponse.ClinicalNotes clinicalNotes = details.getClinicalNotes();
        if (clinicalNotes != null) {
            PreviewResponse.PastTreatmentHistory pastTreatmentHistory = details.getClinicalNotes().getPastTreatmentHistory();
            if (pastTreatmentHistory != null) {
                txtPastTreatmentHiostory.setText(pastTreatmentHistory.getHistory());
            }
            PreviewResponse.TreatmentAdvice treatmentAdvice = details.getClinicalNotes().getTreatmentAdvice();
            if (treatmentAdvice != null) {
                txtTreatmentAdvice.setText(treatmentAdvice.getTreatmentAdvice());
            }
            PreviewResponse.DietPlan dietPlan = details.getClinicalNotes().getDietPlan();
            if (dietPlan != null) {
                txtDietPlan.setText(dietPlan.getDietPlan());
            }
            PreviewResponse.FollowUp followUp = details.getClinicalNotes().getFollowUp();
            if (followUp != null) {
                txtFollowup.setText("Visit to hospital on " + followUp.getDate() + "\n\n" + "Remarks:" + followUp.getRemarks());
            }
            List<PreviewResponse.DiagnosisReport> diagnosisReportAL = details.getClinicalNotes().getDiagnosisReport();
            if (diagnosisReportAL != null) {
                loadDiagnosisData(diagnosisReportAL);
            }
            List<PreviewResponse.Prescription> prescriptionList = details.getPrescription();
            if (prescriptionList != null) {
                loadPresData(prescriptionList);
            }

            List<PreviewResponse.ChiefComplaintsBasic> chiefComplaints = details.getClinicalNotes().getChiefComplaintsBasic();

            if (chiefComplaints != null) {
                StringBuilder complaintsText = new StringBuilder();
                for (int i = 0; i < chiefComplaints.size(); i++) {
                    complaintsText.append(chiefComplaints.get(i).getComplaintsName());
                    if (i < chiefComplaints.size() - 1) {
                        complaintsText.append(", ");
                    }
                }
                txtChiefComplaints.setText(complaintsText.toString());
            }
        }

    }

    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            diagnosisTxtParam = new TableRow.LayoutParams((width - dpToPx(100)) / 4, dpToPx(50));
            int w = width - dpToPx(100);
            prescTxParam = new TableRow.LayoutParams(w / 7, dpToPx(50));
            //  prescTxParam.setMargins(0, dpToPx(1), 0, 0);
            prescRemarksParam = new TableRow.LayoutParams(w, dpToPx(50));
            prescRemarksParam.span = 7;
            prescLineParam = new TableRow.LayoutParams(w, dpToPx(1));
            prescLineParam.span = 7;
            prescLineParam.setMargins(0, dpToPx(1), 0, 0);
            textSize = 14;
            diagnosisTrParam = new TableLayout.LayoutParams(w, dpToPx(50));
            diagnosisTrParam.setMargins(0, dpToPx(5), 0, 0);
            prescTrParam = new TableLayout.LayoutParams(w, dpToPx(50));
            prescTrParam.setMargins(0, dpToPx(5), 0, 0);

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            diagnosisTxtParam = new TableRow.LayoutParams((width - dpToPx(100)) / 4, dpToPx(50));
            prescTxParam = new TableRow.LayoutParams((width - dpToPx(100)) / 7, dpToPx(50));
            textSize = 14;
            diagnosisTrParam = new TableLayout.LayoutParams(width - dpToPx(100), dpToPx(50));
            diagnosisTrParam.setMargins(0, dpToPx(5), 0, 0);
            prescTrParam = new TableLayout.LayoutParams(width - dpToPx(100), dpToPx(50));
            prescTrParam.setMargins(0, dpToPx(5), 0, 0);
            prescRemarksParam = new TableRow.LayoutParams(width - dpToPx(50), dpToPx(50));
            prescRemarksParam.span = 7;
            prescLineParam = new TableRow.LayoutParams(width - dpToPx(50), dpToPx(1));
            prescLineParam.span = 7;
        }

    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    private void loadDiagnosisData(List<PreviewResponse.DiagnosisReport> diagnosisReportAL) {
        tblDiagnosis.removeAllViews();

        int size = diagnosisReportAL.size();
        TableRow trow = new TableRow(getActivity());
        TextView txtSlNo = new TextView(getActivity());
        txtSlNo.setText(R.string.test_categories);
        txtSlNo.setTextColor(Color.BLACK);
        txtSlNo.setTypeface(typeface);
        txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtSlNo.setGravity(Gravity.CENTER);
        trow.addView(txtSlNo, diagnosisTxtParam);

        TextView txtName = new TextView(getActivity());
        txtName.setText(R.string.sub_category);
        txtName.setTextColor(Color.BLACK);
        txtName.setTypeface(typeface);
        txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtName.setGravity(Gravity.CENTER);
        trow.addView(txtName, diagnosisTxtParam);

        TextView txtApptNo = new TextView(getActivity());
        txtApptNo.setVisibility(View.GONE);
      //  txtApptNo.setText(R.string.laboratory);
        txtApptNo.setTextColor(Color.BLACK);
        txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtApptNo.setGravity(Gravity.CENTER);
        txtApptNo.setTypeface(typeface);
        trow.addView(txtApptNo, diagnosisTxtParam);

        TextView txtOPDNo = new TextView(getActivity());
        txtOPDNo.setText(R.string.remarks);
        txtOPDNo.setTextColor(Color.BLACK);
        txtOPDNo.setTypeface(typeface);
        txtOPDNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtOPDNo.setGravity(Gravity.CENTER);
        trow.addView(txtOPDNo, diagnosisTxtParam);
        trow.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.preview_tbl_head_bg));
        tblDiagnosis.addView(trow);

        for (int start = 0; start < size; start++) {
            PreviewResponse.DiagnosisReport report = diagnosisReportAL.get(start);
            TableRow tr = new TableRow(getActivity());
            TextView txtCat = new TextView(getActivity());
            txtCat.setText(report.getTestCategories());
            txtCat.setTextColor(Color.BLACK);
            txtCat.setTypeface(typeface);
            txtCat.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtCat.setGravity(Gravity.CENTER);
            tr.addView(txtCat, diagnosisTxtParam);

            TextView txtSubCat = new TextView(getActivity());
            txtSubCat.setText(report.getSubCategory());
            txtSubCat.setTextColor(Color.BLACK);
            txtSubCat.setTypeface(typeface);
            txtSubCat.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtSubCat.setGravity(Gravity.CENTER);
            tr.addView(txtSubCat, diagnosisTxtParam);

//            TextView txtLab = new TextView(getActivity());
//            txtLab.setText(report.getLaboratory());
//            txtLab.setTextColor(Color.BLACK);
//            txtLab.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
//            txtLab.setGravity(Gravity.CENTER);
//            txtLab.setTypeface(typeface);
//            tr.addView(txtLab, diagnosisTxtParam);

            TextView txtRemarks = new TextView(getActivity());
            txtRemarks.setText(report.getRemarks());
            txtRemarks.setTextColor(Color.BLACK);
            txtRemarks.setTypeface(typeface);
            txtRemarks.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtRemarks.setGravity(Gravity.CENTER);
            tr.addView(txtRemarks, diagnosisTxtParam);
            tr.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.white));

            tblDiagnosis.addView(tr, diagnosisTrParam);

        }
    }


    private void loadPresData(List<PreviewResponse.Prescription> prescAL) {
        tblPresc.removeAllViews();

        int size = prescAL.size();
        TableRow trow = new TableRow(getActivity());
        TextView txtSlNo = new TextView(getActivity());
        txtSlNo.setText(R.string.slNo);
        txtSlNo.setTextColor(Color.BLACK);
        txtSlNo.setTypeface(typeface);
        txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtSlNo.setGravity(Gravity.CENTER);
        trow.addView(txtSlNo, prescTxParam);

        TextView txtName = new TextView(getActivity());
        txtName.setText(R.string.medicine_name);
        txtName.setTextColor(Color.BLACK);
        txtName.setTypeface(typeface);
        txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtName.setGravity(Gravity.CENTER);
        trow.addView(txtName, prescTxParam);

        TextView txtApptNo = new TextView(getActivity());
        txtApptNo.setText(R.string.dosage);
        txtApptNo.setTextColor(Color.BLACK);
        txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtApptNo.setGravity(Gravity.CENTER);
        txtApptNo.setTypeface(typeface);
        trow.addView(txtApptNo, prescTxParam);

        TextView txtOPDNo = new TextView(getActivity());
        txtOPDNo.setText(R.string.frequency);
        txtOPDNo.setTextColor(Color.BLACK);
        txtOPDNo.setTypeface(typeface);
        txtOPDNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtOPDNo.setGravity(Gravity.CENTER);
        trow.addView(txtOPDNo, prescTxParam);
        TextView txtTime = new TextView(getActivity());
        txtTime.setText(R.string.timing);
        txtTime.setTextColor(Color.BLACK);
        txtTime.setTypeface(typeface);
        txtTime.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTime.setGravity(Gravity.CENTER);
        trow.addView(txtTime, prescTxParam);

        TextView txtQty = new TextView(getActivity());
        txtQty.setText(R.string.quantity);
        txtQty.setTextColor(Color.BLACK);
        txtQty.setTypeface(typeface);
        txtQty.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtQty.setGravity(Gravity.CENTER);
        trow.addView(txtQty, prescTxParam);
        TextView txtDuration = new TextView(getActivity());
        txtDuration.setText(R.string.duration);
        txtDuration.setTextColor(Color.BLACK);
        txtDuration.setTypeface(typeface);
        txtDuration.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtDuration.setGravity(Gravity.CENTER);
        trow.addView(txtDuration, prescTxParam);
        trow.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.preview_tbl_head_bg));
        tblPresc.addView(trow);

        for (int start = 0; start < size; start++) {
            PreviewResponse.Prescription report = prescAL.get(start);
            TableRow tr = new TableRow(getActivity());
            TableRow trLine = new TableRow(getActivity());
            TableRow trRemarks = new TableRow(getActivity());
            TextView txtCat = new TextView(getActivity());
            txtCat.setText(String.valueOf(start + 1));
            txtCat.setTextColor(Color.BLACK);
            txtCat.setTypeface(typeface);
            txtCat.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtCat.setGravity(Gravity.CENTER);
            tr.addView(txtCat, prescTxParam);

            TextView txtSubCat = new TextView(getActivity());
            txtSubCat.setText(report.getMedicineName());
            txtSubCat.setTextColor(Color.BLACK);
            txtSubCat.setTypeface(typeface);
            txtSubCat.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtSubCat.setGravity(Gravity.CENTER);
            tr.addView(txtSubCat, prescTxParam);

            TextView txtLab = new TextView(getActivity());
            txtLab.setText(report.getDosage());
            txtLab.setTextColor(Color.BLACK);
            txtLab.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtLab.setGravity(Gravity.CENTER);
            txtLab.setTypeface(typeface);
            tr.addView(txtLab, prescTxParam);

            TextView txtFreq = new TextView(getActivity());
            txtFreq.setText(report.getFrequency());
            txtFreq.setTextColor(Color.BLACK);
            txtFreq.setTypeface(typeface);
            txtFreq.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtFreq.setGravity(Gravity.CENTER);
            tr.addView(txtFreq, prescTxParam);

            TextView txtTiming = new TextView(getActivity());
            txtTiming.setText(report.getWhen());
            txtTiming.setTextColor(Color.BLACK);
            txtTiming.setTypeface(typeface);
            txtTiming.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtTiming.setGravity(Gravity.CENTER);
            tr.addView(txtTiming, prescTxParam);

            TextView txtQuantity = new TextView(getActivity());
            txtQuantity.setText(report.getQuantity());
            txtQuantity.setTextColor(Color.BLACK);
            txtQuantity.setTypeface(typeface);
            txtQuantity.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtQuantity.setGravity(Gravity.CENTER);
            tr.addView(txtQuantity, prescTxParam);
            TextView txtDuration1 = new TextView(getActivity());
            txtDuration1.setText(report.getDurationCount());
            txtDuration1.setTextColor(Color.BLACK);
            txtDuration1.setTypeface(typeface);
            txtDuration1.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtDuration1.setGravity(Gravity.CENTER);
            tr.addView(txtDuration1, prescTxParam);
            tr.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.white));
            View v = new View(getActivity());
            //   trLine.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.upload_photo_title));
            trLine.addView(v, prescLineParam);
            TextView txtRemarks = new TextView(getActivity());
            txtRemarks.setText("Remarks: " + report.getRemarks());
            txtRemarks.setTextColor(ContextCompat.getColor(getContext(), R.color.upload_photo_title));
            txtRemarks.setTypeface(typeface);
            txtRemarks.setPadding(dpToPx(5), 0, 0, 0);
            txtRemarks.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtRemarks.setGravity(Gravity.CENTER_VERTICAL);
            trRemarks.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.white));
            trRemarks.addView(txtRemarks, prescRemarksParam);
            //   trRemarks.setPadding(0,0, 0, dpToPx(2));
            tblPresc.addView(tr,prescTrParam);
            tblPresc.addView(trLine);
            tblPresc.addView(trRemarks);
            // tblPresc.addView(tr, prescTrParam);
            //tblPresc.addView(trLine, prescTrParam);
            //tblPresc.addView(trRemarks, prescTrParam);

        }
    }

    private String getCurrentDateTime() {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss", Locale.getDefault());
        return dateFormat.format(calendar.getTime());

    }

    private boolean checkPermission() {
        return ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermission() {
        ActivityCompat.requestPermissions(requireActivity(), new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == STORAGE_PERMISSION_CODE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(getContext(), "Permission granted", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(getContext(), "Permission denied", Toast.LENGTH_SHORT).show();
        }
    }

    private void createPdfFromJson(String jsonResponse) {
        Gson gson = new Gson();
        PreviewResponse productListData = gson.fromJson(jsonResponse, PreviewResponse.class);
        File pdfDir = new File(Environment.getExternalStorageDirectory(), "PDFs");
        if (!pdfDir.exists()) {
            pdfDir.mkdirs();
        }
        File pdfFile = new File(pdfDir, apptId + "_case_sheet.pdf");

        try {
            PdfWriter writer = new PdfWriter(new FileOutputStream(pdfFile));
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);
            document.setBackgroundColor(new DeviceRgb(249, 250, 251));
            document.setMargins(5, 20, 5, 20);
            addHeader(document,pdfDocument);
            PreviewResponse.Details details = productListData.getDetails();
            if (details != null) {
                // Patient Information Header
                float[] patientInfoWidths = {2, 1, 1, 1, 1, 1};
                Table patientInfoTable = new Table(patientInfoWidths);
                patientInfoTable.setWidth(UnitValue.createPercentValue(100));
                patientInfoTable.setBackgroundColor(ColorConstants.WHITE);

                // Row 1: Basic Info
                Cell nameCell = new Cell(1, 2);
                Paragraph namePara = new Paragraph();
                namePara.add(new Text(details.getPatientDetails().getPatientName() + "\n").setBold().setFontSize(14));
                document.add(new Paragraph("\n"));
                Bitmap bitmap = BitmapFactory.decodeResource(getContext().getResources(), R.drawable.male);
                ByteArrayOutputStream stream = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
                Image logo = new Image(ImageDataFactory.create(stream.toByteArray()));
                logo.setHeight(12).setWidth(12).setMarginLeft(5).setMarginRight(5);
                namePara.add(logo);

                namePara.add(new Text(details.getPatientDetails().getGender()).setFontSize(12).setFontColor(ColorConstants.GRAY));

                Bitmap bitmap1 = BitmapFactory.decodeResource(getContext().getResources(), R.drawable.blood);
                ByteArrayOutputStream stream1 = new ByteArrayOutputStream();
                bitmap1.compress(Bitmap.CompressFormat.PNG, 100, stream1);
                Image logo1 = new Image(ImageDataFactory.create(stream1.toByteArray()));
                logo1.setHeight(12).setWidth(12).setMarginLeft(5).setMarginRight(5);
                namePara.add(logo1);

                namePara.add(new Text(details.getPatientDetails().getPatientBloodGroup()).setFontSize(12).setFontColor(ColorConstants.GRAY));

                Bitmap bitmap2 = BitmapFactory.decodeResource(getContext().getResources(), R.drawable.age);
                ByteArrayOutputStream stream2 = new ByteArrayOutputStream();
                bitmap2.compress(Bitmap.CompressFormat.PNG, 100, stream2);
                Image logo2 = new Image(ImageDataFactory.create(stream2.toByteArray()));
                logo2.setHeight(12).setWidth(12).setMarginLeft(5).setMarginRight(5);
                namePara.add(logo2);

                namePara.add(new Text(details.getPatientDetails().getAge()).setFontSize(12).setFontColor(ColorConstants.GRAY));

                Bitmap bitmap3 = BitmapFactory.decodeResource(getContext().getResources(), R.drawable.phone);
                ByteArrayOutputStream stream3 = new ByteArrayOutputStream();
                bitmap3.compress(Bitmap.CompressFormat.PNG, 100, stream3);
                Image logo3 = new Image(ImageDataFactory.create(stream3.toByteArray()));
                logo3.setHeight(12).setWidth(12).setMarginLeft(5).setMarginRight(5);
                namePara.add(logo3);

                namePara.add(new Text(details.getPatientDetails().getMobileno()).setFontSize(12).setFontColor(ColorConstants.GRAY));

                Bitmap bitmap4 = BitmapFactory.decodeResource(getContext().getResources(), R.drawable.address);
                ByteArrayOutputStream stream4 = new ByteArrayOutputStream();
                bitmap4.compress(Bitmap.CompressFormat.PNG, 100, stream4);
                Image logo4 = new Image(ImageDataFactory.create(stream4.toByteArray()));
                logo4.setHeight(12).setWidth(12).setMarginLeft(5).setMarginRight(5);
                namePara.add(logo4);

                namePara.add(new Text(details.getPatientDetails().getEmail()).setFontSize(12).setFontColor(ColorConstants.GRAY));
                nameCell.add(namePara);
                nameCell.setBorder(Border.NO_BORDER);
                patientInfoTable.addCell(nameCell);
                document.add(patientInfoTable);
                document.add(new Paragraph("\n"));

                // Vitals Section
                addSectionTitle(document, "Vitals");
                float[] vitalsWidths = {1, 1, 1, 1, 1, 1, 1};
                Table vitalsTable = new Table(vitalsWidths);
                vitalsTable.setWidth(UnitValue.createPercentValue(100));

                // Vitals Headers
                String[] vitalsHeadersLeft = {"Temperature"};
                for (String header : vitalsHeadersLeft) {
                    addHeaderCellLeft(vitalsTable, header);
                }

                String[] vitalsHeaders = { "Pulse", "Blood Pressure",
                        "Weight", "Height"};
                for (String header : vitalsHeaders) {
                    addHeaderCell(vitalsTable, header, false);
                }

                String[] vitalsHeadersRight = {"SpO2"};
                for (String header : vitalsHeadersRight) {
                    addHeaderCellRight(vitalsTable, header);
                }

                // Vitals Values
                PreviewResponse.Vitals vitals = details.getVitals();
                if(!vitals.getTemperature().isEmpty())
                    addDataCell(vitalsTable, vitals.getTemperature() + " °F");
                else
                    addDataCell(vitalsTable, "");
                if(!vitals.getPulse().isEmpty())
                    addDataCell(vitalsTable, vitals.getPulse() + " bpm");
                else
                    addDataCell(vitalsTable, "");
                if(!vitals.getBp().isEmpty())
                    addDataCell(vitalsTable, vitals.getBp() + " mmHg");
                else
                    addDataCell(vitalsTable, "");
                if(!vitals.getWeight().isEmpty())
                    addDataCell(vitalsTable, vitals.getWeight() + " kg");
                else
                    addDataCell(vitalsTable, "");
                if(!vitals.getHeight().isEmpty())
                    addDataCell(vitalsTable, vitals.getHeight() + " cm");
                else
                    addDataCell(vitalsTable, "");
                if(!vitals.getSpo2().isEmpty())
                    addDataCell(vitalsTable, vitals.getSpo2() + " %");
                else
                    addDataCell(vitalsTable, "");

                document.add(vitalsTable);
                document.add(new Paragraph("\n"));

                // Chief Complaints Section
                addSectionTitle(document, "Chief Complaints");
                float[] complaintsWidths = {1, 1, 1, 1};
                Table complaintsTable = new Table(complaintsWidths);
                complaintsTable.setWidth(UnitValue.createPercentValue(100));

                // Complaints Headers
//                String[] complaintsHeaders = {"Symptoms"};
//                for (String header : complaintsHeaders) {
//                    addHeaderCell(complaintsTable, header,true);
//                }
                document.add(complaintsTable);
                // Complaints Data
                if (details.getClinicalNotes().getChiefComplaintsBasic() != null) {
                    for (PreviewResponse.ChiefComplaintsBasic complaint : details.getClinicalNotes().getChiefComplaintsBasic()) {
                        document.add(new Paragraph(complaint.getComplaintsName())
                                .setFontSize(12)
                                .setBackgroundColor(ColorConstants.WHITE)
                                .setPadding(8));
                    }
                }
                document.add(new Paragraph("\n"));

                // Past Treatment History
                addSectionTitle(document, "Past Medical History");
                if (details.getClinicalNotes().getPastTreatmentHistory() != null) {
                    document.add(new Paragraph(details.getClinicalNotes().getPastTreatmentHistory().getHistory())
                            .setFontSize(12)
                            .setBackgroundColor(ColorConstants.WHITE)
                            .setPadding(8));
                }
                document.add(new Paragraph("\n"));

                // Diagnosis Section
                addSectionTitle(document, "Investigation Advised");
                float[] diagnosisWidths = {1, 1, 1, 1};
                Table diagnosisTable = new Table(diagnosisWidths);
                diagnosisTable.setWidth(UnitValue.createPercentValue(100));

                // Diagnosis Headers

                String[] diagnosisHeadersLeft = {"Test Categories"};
                for (String header : diagnosisHeadersLeft) {
                    addHeaderCellLeft(diagnosisTable, header);
                }
                String[] diagnosisHeaders = {"Sub Categories"};
                for (String header : diagnosisHeaders) {
                    addHeaderCell(diagnosisTable, header, false);
                }
                String[] diagnosisHeadersRight = {"Remarks"};
                for (String header : diagnosisHeadersRight) {
                    addHeaderCellRight(diagnosisTable, header);
                }


                // Diagnosis Data
                if (details.getClinicalNotes().getDiagnosisReport() != null) {
                    for (PreviewResponse.DiagnosisReport diagnosis :
                            details.getClinicalNotes().getDiagnosisReport()) {
                        addDataCell(diagnosisTable, diagnosis.getTestCategories());
                        addDataCell(diagnosisTable, diagnosis.getSubCategory());
                       // addDataCell(diagnosisTable, diagnosis.getLaboratory());
                        addDataCell(diagnosisTable, diagnosis.getRemarks());
                    }
                }
                document.add(diagnosisTable);
                document.add(new Paragraph("\n"));
                document.add(new Paragraph("\n"));
                document.add(new Paragraph("\n"));


                // Treatment Advice Section
                addSectionTitle(document, "Diagnosis & Treatment Advice");
                if (details.getClinicalNotes().getTreatmentAdvice() != null) {
                    document.add(new Paragraph(details.getClinicalNotes().getTreatmentAdvice().getTreatmentAdvice())
                            .setFontSize(12)
                            .setBackgroundColor(ColorConstants.WHITE)
                            .setPadding(8));
                }
                document.add(new Paragraph("\n"));


                // Diet Plan Section
                addSectionTitle(document, "Diet Plan");
                if (details.getClinicalNotes().getDietPlan() != null) {
                    document.add(new Paragraph(details.getClinicalNotes().getDietPlan().getDietPlan())
                            .setFontSize(12)
                            .setBackgroundColor(ColorConstants.WHITE)
                            .setPadding(8));
                }
                document.add(new Paragraph("\n"));

                // Medications Section
                addSectionTitle(document, "Medications");
                float[] medicationWidths = {0.5f, 2, 1, 1, 1, 1, 1};
                Table medicationTable = new Table(medicationWidths);
                medicationTable.setWidth(UnitValue.createPercentValue(100));

                // Medication Headers
                String[] medicationHeadersLeft = {"S.No"};
                for (String header : medicationHeadersLeft) {
                    addHeaderCellLeft(medicationTable, header);
                }

                String[] medicationHeaders = {"Medicine Name", "Dosage", "Frequency",
                        "Timing", "Quantity"};
                for (String header : medicationHeaders) {
                    addHeaderCell(medicationTable, header, false);
                }

                String[] medicationHeadersRight = {"Duration"};
                for (String header : medicationHeadersRight) {
                    addHeaderCellRight(medicationTable, header);
                }

                // Medication Data
                if (details.getPrescription() != null) {
                    int slNo = 1;
                    for (PreviewResponse.Prescription med : details.getPrescription()) {
                        addDataCell(medicationTable, String.valueOf(slNo++));
                        addDataCell(medicationTable, med.getMedicineName());
                        addDataCell(medicationTable, med.getDosage());
                        addDataCell(medicationTable, med.getFrequency());
                        addDataCell(medicationTable, med.getWhen());
                        addDataCell(medicationTable, med.getQuantity());
                        addDataCell(medicationTable, med.getDurationCount() + " Days");
                    }
                }
                document.add(medicationTable);
                document.add(new Paragraph("\n"));

                // Follow Up Section
                addSectionTitle(document, "Follow up");
                if (details.getClinicalNotes().getFollowUp() != null) {
                    PreviewResponse.FollowUp followUp = details.getClinicalNotes().getFollowUp();
                    document.add(new Paragraph("Visit to hospital on: " + followUp.getDate())
                            .setFontSize(12)
                            .setBackgroundColor(ColorConstants.WHITE)
                            .setPadding(8));
                    document.add(new Paragraph("Remarks: " + followUp.getRemarks())
                            .setFontSize(12)
                            .setBackgroundColor(ColorConstants.WHITE)
                            .setPadding(8));
                }

                document.close();
                Toast.makeText(getContext(), "PDF created successfully", Toast.LENGTH_LONG).show();
                uploadFile(pdfFile);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void addSectionTitle(Document document, String title) throws IOException {
        document.add(new Paragraph(title)
                .setBold()
                .setFontSize(14)
                .setBackgroundColor(new DeviceRgb(224, 231, 255))
                .setPadding(8)
                .setBorderRadius(new BorderRadius(5))); // Add border radius to section titles
    }

    private void addHeaderCellLeft(Table table, String text) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text)
                .setFontSize(12)
                .setBold());
        cell.setTextAlignment(TextAlignment.CENTER);
        cell.setVerticalAlignment(VerticalAlignment.MIDDLE);
        cell.setBackgroundColor(new DeviceRgb(184, 191, 255));
        // Add padding for better appearance
        cell.setPaddingTop(12);
        cell.setPaddingBottom(12);
        cell.setPaddingLeft(15);
        cell.setPaddingRight(15);

        cell.setBorderBottomLeftRadius(new BorderRadius(8));
        cell.setBorderTopLeftRadius(new BorderRadius(8));
        cell.setBorder(Border.NO_BORDER);
        // Add some margin between cells
        cell.setMarginRight(4);
        cell.setMarginBottom(4);
        table.addHeaderCell(cell);
    }

    private void addHeaderCellRight(Table table, String text) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text)
                .setFontSize(12)
                .setBold());
        cell.setTextAlignment(TextAlignment.CENTER);
        cell.setVerticalAlignment(VerticalAlignment.MIDDLE);
        cell.setBackgroundColor(new DeviceRgb(184, 191, 255));
        // Add padding for better appearance
        cell.setPaddingTop(12);
        cell.setPaddingBottom(12);
        cell.setPaddingLeft(15);
        cell.setPaddingRight(15);

        cell.setBorderBottomRightRadius(new BorderRadius(8));
        cell.setBorderTopRightRadius(new BorderRadius(8));
        cell.setBorder(Border.NO_BORDER);
        // Add some margin between cells
        cell.setMarginRight(4);
        cell.setMarginBottom(4);
        table.addHeaderCell(cell);
    }

    private void addHeaderCell(Table table, String text, boolean border) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text)
                .setFontSize(12)
                .setBold());

        cell.setTextAlignment(TextAlignment.CENTER);
        cell.setVerticalAlignment(VerticalAlignment.MIDDLE);
        // Create rounded background style
        cell.setBackgroundColor(new DeviceRgb(184, 191, 255));
        cell.setBorder(Border.NO_BORDER);
        cell.setPaddingTop(12);
        cell.setPaddingBottom(12);
        cell.setPaddingLeft(15);
        cell.setPaddingRight(15);
        // Add some margin between cells
        if (border){
            cell.setBorderRadius(new BorderRadius(5));
        }
        cell.setMarginRight(4);
        cell.setMarginBottom(4);
        table.addHeaderCell(cell);
    }

    private void addDataCell(Table table, String text) {
        Cell cell = new Cell();
        cell.add(new Paragraph(text != null ? text : "")
                .setFontSize(12));
        cell.setBackgroundColor(ColorConstants.WHITE);
        cell.setTextAlignment(TextAlignment.CENTER);
        cell.setVerticalAlignment(VerticalAlignment.MIDDLE);

        // Adjust padding to match header cells
        cell.setPaddingTop(12);
        cell.setPaddingBottom(12);
        cell.setPaddingLeft(15);
        cell.setPaddingRight(15);
        cell.setMarginRight(4);
        cell.setMarginBottom(4);
        cell.setBorder(Border.NO_BORDER);

        table.addCell(cell);
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

    private void closeConsultation() {
        Log.i("mylog", "closeConsultation");
        Call<OPHubResponse.UpdateApptStatusResponse> call = services.closeConsultation(hospId, apptId);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {
                try {
                    Log.i("mylog", "closeConsultation response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String status = resp.getStatus();
                        String message = resp.getMessage();
                        if (status != null && status.equalsIgnoreCase("success")) {
                            Log.i("mylog ", "close consultation success");
                            gotoPatientScreen();
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

    public void showConfirmationDialog() {
        Dialog dialogConfirmation = new Dialog(getContext());
        View view = getLayoutInflater().inflate(R.layout.dialog_status_confirmation, null);
        dialogConfirmation.setContentView(view);
        dialogConfirmation.getWindow().setGravity(CENTER);
        dialogConfirmation.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogConfirmation.setCancelable(false);
        Button btnNo = dialogConfirmation.findViewById(R.id.btnNo);
        Button btnYes = dialogConfirmation.findViewById(R.id.btnYes);
        TextView txtTitle = dialogConfirmation.findViewById(R.id.txtMessage);
        ImageView imgClose = dialogConfirmation.findViewById(R.id.imgClose);
        txtTitle.setText("Are you sure want to generate case sheet and close consultation?");

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
                if (previewResponse != null) {
                    createPdfFromJson(new Gson().toJson(previewResponse));
//                    try {
//                        Gson gson = new Gson();
//                        String jsonResponse = gson.toJson(previewResponse);
//                        JSONObject jsonObject = new JSONObject(jsonResponse);
//                        createPDF(jsonObject);
//                    } catch (JSONException e) {
//                        throw new RuntimeException(e);
//                    } catch (FileNotFoundException e) {
//                        throw new RuntimeException(e);
//                    }
                } else {
                    OPHubUtils.showErrorDialog(getContext(), "Error occured!");
                }

            }
        });
        dialogConfirmation.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogConfirmation.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(300);
        dialogConfirmation.getWindow().setAttributes(lp);
    }

    private void uploadFile(File file) {
        Log.i("myLog", "uploadFile opdid:: " + opdId + "    hospId:" + hospId+ "  abha address : " + abhaAddress);
        if (abhaAddress == null){
            abhaAddress = "";
        }
        Log.i("myLog", "abhaAddress " + abhaAddress);
        // Create RequestBody instance from file
        RequestBody requestFile = RequestBody.create(MediaType.parse("multipart/form-data"), file);
        MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);
        // Create RequestBody for other fields
        RequestBody opdIdReq = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(opdId));
        RequestBody hospIdReq = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(hospId));
        RequestBody abhaAdress = RequestBody.create(MediaType.parse("text/plain"), String.valueOf(abhaAddress));
        Call<OPHubResponse.FileUploadResponse> call = services.submitForm(body, opdIdReq, hospIdReq,abhaAdress);
        call.enqueue(new Callback<OPHubResponse.FileUploadResponse>() {
            @Override
            public void onResponse(Call<OPHubResponse.FileUploadResponse> call, Response<OPHubResponse.FileUploadResponse> response) {
                try {
                    Log.i("myLog", "uploadFile response:: ");
                    if (response.isSuccessful()) {
                        // Handle success
                        String status = response.body().getStatus();
                        String message = response.body().getMessege();
                        Log.i("mylog", "status:" + status + "  message: " + message);
                        if (status.equalsIgnoreCase("Success")){
    //                        uploadFhirBundle();
                            closeConsultation();
    //                        AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
    //                        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
    //                        transaction.replace(R.id.fragment_container, newFragment);
    //                        transaction.addToBackStack(null);
    //                        transaction.commit();
                        }

                    } else {
                        // Handle error
                        Log.i("myLog", "uploadFile success else");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.FileUploadResponse> call, Throwable t) {
                // Handle failure
            }
        });

    }


    private void uploadFhirBundle(){
        if (previewResponse != null){
            FhirContext fhirContext = FhirContext.forR4();
            String fullUrl = "urn:uuid:" + UUID.randomUUID().toString();
            String patientId = UUID.randomUUID().toString();
            patientReqID = patientId;
            String fullUrlPatient = "urn:uuid:" + patientId;
            String fullUrlPractioner = "urn:uuid:" + UUID.randomUUID().toString();
            org.hl7.fhir.r4.model.Bundle bundle = new org.hl7.fhir.r4.model.Bundle();
            bundle.setType(org.hl7.fhir.r4.model.Bundle.BundleType.DOCUMENT);
            Identifier identifier = new Identifier();
            identifier.setSystem("http://real-domain.com/fhir/document-ids");
            identifier.setValue(fullUrl);  // Generate a unique value
            bundle.setIdentifier(identifier);
            bundle.setTimestamp(Date.from(Instant.now()));
            Composition composition = new Composition();
            composition.setStatus(Composition.CompositionStatus.FINAL);
            composition.setType(new CodeableConcept().setText("Clinical Report"));
            composition.setDate(Date.from(Instant.now()));
            composition.addAuthor(new Reference(fullUrlPractioner));
            composition.setSubject(new Reference(fullUrlPatient));
            composition.setTitle("Clinical Report for Patient");
            org.hl7.fhir.r4.model.Bundle.BundleEntryComponent compositionEntry = new org.hl7.fhir.r4.model.Bundle.BundleEntryComponent();
            compositionEntry.setResource(composition);
            compositionEntry.setFullUrl("urn:uuid:" + UUID.randomUUID().toString());
            bundle.addEntry(compositionEntry);
            org.hl7.fhir.r4.model.Bundle.BundleEntryComponent practitionerEntry = new org.hl7.fhir.r4.model.Bundle.BundleEntryComponent();
            practitionerEntry.setResource(createPractitioner(previewResponse));
            practitionerEntry.setFullUrl(fullUrlPractioner);
            bundle.addEntry(practitionerEntry);
            org.hl7.fhir.r4.model.Bundle.BundleEntryComponent entry = new org.hl7.fhir.r4.model.Bundle.BundleEntryComponent();
            entry.setResource(createPatient(previewResponse));
            entry.setFullUrl(fullUrlPatient);
            bundle.addEntry(entry);


            if (!previewResponse.getDetails().getPrescription().isEmpty()) {
                for (PreviewResponse.Prescription previewResponse : previewResponse.getDetails().getPrescription()) {
                    String fullUrlMedication = "urn:uuid:" + UUID.randomUUID().toString();
                    Composition.SectionComponent section = composition.addSection();
                    section.setTitle("Medication Information");
                    section.setFocus(new Reference(fullUrlMedication));
                    Narrative narrative = new Narrative();
                    narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                    narrative.setDivAsString("<div>Medication</div>");
                    section.setText(narrative);
                    bundle.addEntry().setFullUrl(fullUrlMedication).setResource(createMedication(previewResponse.getMedicineName(), previewResponse.getDosage()));
                }
            }


            if (previewResponse.getDetails().getVitals() != null){
                String fullUrlObservation = "urn:uuid:" + UUID.randomUUID().toString();
                Composition.SectionComponent section = composition.addSection();
                section.setTitle("Observation Information");
                section.setFocus(new Reference(fullUrlObservation));
                Narrative narrative = new Narrative();
                narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                narrative.setDivAsString("<div>Observation</div>");
                section.setText(narrative);
                bundle.addEntry().setFullUrl(fullUrlObservation).setResource(createObservation(previewResponse.getDetails().getVitals()));
            }




            if (previewResponse.getDetails().getClinicalNotes() != null) {
                PreviewResponse.ClinicalNotes clinicalNotes = previewResponse.getDetails().getClinicalNotes();

                if (clinicalNotes.getDiagnosisReport() != null) {
                    if (!clinicalNotes.getDiagnosisReport().isEmpty()) {
                        for (PreviewResponse.DiagnosisReport diagnosisReport : clinicalNotes.getDiagnosisReport()) {
                            String fullUrlDiagnosisReport = "urn:uuid:" + UUID.randomUUID().toString();
                            Composition.SectionComponent section = composition.addSection();
                            section.setTitle("DiagnosisReport Information");
                            section.setFocus(new Reference(fullUrlDiagnosisReport));
                            Narrative narrative = new Narrative();
                            narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                            narrative.setDivAsString("<div>DiagnosisReport</div>");
                            section.setText(narrative);
                            bundle.addEntry().setFullUrl(fullUrlDiagnosisReport).setResource(createDiagnosisReport(diagnosisReport));
                        }
                    }
                }


                if (clinicalNotes.getFollowUp() != null) {
                    String fullUrlFollowUp = "urn:uuid:" + UUID.randomUUID().toString();
                    Composition.SectionComponent section = composition.addSection();
                    section.setTitle("FollowUp Information");
                    section.setFocus(new Reference(fullUrlFollowUp));
                    Narrative narrative = new Narrative();
                    narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                    narrative.setDivAsString("<div>FollowUp</div>");
                    section.setText(narrative);
                    bundle.addEntry().setFullUrl(fullUrlFollowUp).setResource(createAppointmentResponse(clinicalNotes.getFollowUp(), fullUrlPatient));
                }


                if (clinicalNotes.getTreatmentAdvice() != null) {
                    String fullUrlTreatmentAdvice = "urn:uuid:" + UUID.randomUUID().toString();
                    Composition.SectionComponent section = composition.addSection();
                    section.setTitle("TreatmentAdvice Information");
                    section.setFocus(new Reference(fullUrlTreatmentAdvice));
                    Narrative narrative = new Narrative();
                    narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                    narrative.setDivAsString("<div>TreatmentAdvice</div>");
                    section.setText(narrative);
                    bundle.addEntry().setFullUrl(fullUrlTreatmentAdvice).setResource(createTreatMentAdvice(clinicalNotes.getTreatmentAdvice(), fullUrlPatient));
                }


                if (clinicalNotes.getDietPlan() != null) {
                    String fullUrlDietPlan = "urn:uuid:" + UUID.randomUUID().toString();
                    Composition.SectionComponent section = composition.addSection();
                    section.setTitle("DietPlan Information");
                    section.setFocus(new Reference(fullUrlDietPlan));
                    Narrative narrative = new Narrative();
                    narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                    narrative.setDivAsString("<div>DietPlan</div>");
                    section.setText(narrative);
                    bundle.addEntry().setFullUrl(fullUrlDietPlan).setResource(createNutritionOrder(clinicalNotes.getDietPlan(), fullUrlPatient));
                }

                if (clinicalNotes.getChiefComplaintsBasic() != null) {
                    if (!clinicalNotes.getChiefComplaintsBasic().isEmpty()) {
                        for (PreviewResponse.ChiefComplaintsBasic chiefComplaintsBasic : clinicalNotes.getChiefComplaintsBasic()) {
                            String fullUrlChiefComplaintsBasic = "urn:uuid:" + UUID.randomUUID().toString();
                            Composition.SectionComponent section = composition.addSection();
                            section.setTitle("ChiefComplaintsBasic Information");
                            section.setFocus(new Reference(fullUrlChiefComplaintsBasic));
                            Narrative narrative = new Narrative();
                            narrative.setStatus(Narrative.NarrativeStatus.GENERATED);
                            narrative.setDivAsString("<div>ChiefComplaintsBasic</div>");
                            section.setText(narrative);
                            bundle.addEntry().setFullUrl(fullUrlChiefComplaintsBasic).setResource(createCondition(chiefComplaintsBasic, fullUrlPatient));
                        }
                    }
                }
            }

            IParser parser = fhirContext.newJsonParser();
            parser.setPrettyPrint(true);
            String bundleString = parser.encodeResourceToString(bundle);
            try {
                // Parse the original JSON into a JsonObject
                JsonObject originalJsonObject = JsonParser.parseString(bundleString).getAsJsonObject();

                // Create a new JsonObject to hold the "value" wrapper
                JsonObject wrapperJsonObject = new JsonObject();
                wrapperJsonObject.add("value", originalJsonObject);

                // Convert the wrapped JSON back to a String
                String wrappedJson = wrapperJsonObject.toString();
                JSONObject bundleJsonObject = new JSONObject(wrappedJson);
                RequestBody requestBody = RequestBody.create(
                        bundleJsonObject.toString(),
                        MediaType.parse("application/json")  // Set the content type
                );
                Call<FhirBundleUploadResponse> call = abhaServices.uploadFhirBundle(requestBody);
                call.enqueue(new Callback<FhirBundleUploadResponse>() {
                    @Override
                    public void onResponse(Call<FhirBundleUploadResponse> call, Response<FhirBundleUploadResponse> response) {
                        try {
                            if (response.isSuccessful()) {
                                docKey = response.body().getData();
                                getCareContextToken();
                            } else {
                            }
                        } catch (Exception e) {
                            OPHubUtils.showUnknownErrorDialog(getActivity());
                        }
                    }

                    @Override
                    public void onFailure(Call<FhirBundleUploadResponse> call, Throwable t) {
                    }
                });


            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }

    private void getCareContextToken() {
        Log.i("myLog", "getCareContextToken");
        CareContextTokenRequest request = new CareContextTokenRequest();
        request.setName(name);
        if (gender.equalsIgnoreCase("Male")) {
            request.setGender("M");
        } else {
            request.setGender("F");
        }
        String dateStr = dob;
        try {
            if (dateStr != null && !dateStr.isEmpty() && !dateStr.equalsIgnoreCase("-")){
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                LocalDate date = LocalDate.parse(dateStr, formatter);
                int year = date.getYear();
                request.setYearOfBirth(String.valueOf(year));}
        }catch (Exception e){

        }
        request.setAbhaAddress(abhaAddress);
        String hipID = OPHubApplication.getHitypeId();
        Log.i("myLog", "getCareContextToken request : " + new Gson().toJson(request));
        Call<List<CareContextLinkTokenResponse>> call = abhaServices.getCareContextToken(hipID, request);
        call.enqueue(new Callback<List<CareContextLinkTokenResponse>>() {
            @Override
            public void onResponse(Call<List<CareContextLinkTokenResponse>> call, Response<List<CareContextLinkTokenResponse>> response) {

                try {
                    if (response.body() != null) {
                        if (response.body().get(0).getResponse().get(0).getPayload().getError() == null) {
                            linkCareContext(response.body().get(0).getResponse().get(0).getPayload().getLinkToken(), hipID);
                        } else {
    //                        Toast.makeText(getContext(), response.body().get(0).getResponse()
    //                                .get(0).getPayload().getError().getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<CareContextLinkTokenResponse>> call, Throwable t) {
                Log.i("myLog", "getCareContextToken response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void linkCareContext(String linkToken, String hipID) {
        Log.i("myLog", "linkCareContext");
        LinkCareContextRequest request = new LinkCareContextRequest();
        request.setAbhaAddress(abhaAddress);
        LinkCareContextRequest.Patient patient = new LinkCareContextRequest.Patient();
        patient.setDisplay("HealthDocumentRecord new record");
        patient.setHiType("HealthDocumentRecord");
        patient.setCount(1);
        LinkCareContextRequest.CareContext careContext = new LinkCareContextRequest.CareContext();
        careContext.setDisplay("HealthDocumentRecord new carecontext linked");
        careContext.setDocKey(docKey);
        List<LinkCareContextRequest.CareContext> careContexts = new ArrayList<>();
        careContexts.add(careContext);
        patient.setCareContexts(careContexts);
        List<LinkCareContextRequest.Patient> patients = new ArrayList<>();
        patients.add(patient);
        request.setPatient(patients);

        Log.i("myLog", "linkCareContext request : " + new Gson().toJson(request));
        Call<List<LinkCareContextResponse>> call = abhaServices.linkCareContext(linkToken, hipID, request);
        call.enqueue(new Callback<List<LinkCareContextResponse>>() {
            @Override
            public void onResponse(Call<List<LinkCareContextResponse>> call, Response<List<LinkCareContextResponse>> response) {

                if (response.body() != null) {
                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<List<LinkCareContextResponse>> call, Throwable t) {
                Log.i("myLog", "linkCareContext response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private static Condition createCondition(PreviewResponse.ChiefComplaintsBasic chiefComplaintsBasic, String fullUrlPatient){
        Condition condition = new Condition();
        condition.setSubject(new Reference(fullUrlPatient));
        CodeableConcept code = new CodeableConcept();
        code.addCoding(new Coding()
                .setDisplay(chiefComplaintsBasic.getComplaintsName()));
        condition.setCode(code);
        return condition;
    }

    private static CarePlan createTreatMentAdvice(PreviewResponse.TreatmentAdvice treatmentAdvice, String fullUrlPatient){
        CarePlan carePlan = new CarePlan();
        carePlan.setTitle("Treatment Advice Plan");
        carePlan.setStatus(CarePlan.CarePlanStatus.ACTIVE);
        carePlan.setSubject(new Reference(fullUrlPatient)); // Linking the patient
        carePlan.setIntent(CarePlan.CarePlanIntent.PLAN); // Setting the intent
        carePlan.setDescription(treatmentAdvice.getTreatmentAdvice());
        return carePlan;
    }

    private static NutritionOrder createNutritionOrder(PreviewResponse.DietPlan dietPlan, String fullUrlPatient){
        NutritionOrder nutritionOrder = new NutritionOrder();
        nutritionOrder.setPatient(new Reference(fullUrlPatient));
        nutritionOrder.setStatus(NutritionOrder.NutritionOrderStatus.ACTIVE);
        nutritionOrder.setIntent(NutritionOrder.NutritiionOrderIntent.PLAN); // Setting the intent
        nutritionOrder.setDateTime(Date.from(Instant.now())); // Setting the date/time of the order
        NutritionOrder.NutritionOrderOralDietComponent oralDiet = new NutritionOrder.NutritionOrderOralDietComponent();
        oralDiet.setInstruction(dietPlan.getDietPlan());  // Set the diet plan description
        nutritionOrder.setOralDiet(oralDiet);
        return nutritionOrder;
    }




    private static Appointment createAppointmentResponse(PreviewResponse.FollowUp followUp, String fullUrlPatient){
        Appointment appointment = new Appointment();
        appointment.setStatus(Appointment.AppointmentStatus.BOOKED);
        Period period = new Period();
        period.setStart(Date.from(Instant.now()));
        Instant now = Instant.now();
        Instant futureInstant = now.plus(Duration.ofDays(Integer.parseInt(followUp.getCount())));
        period.setEnd(Date.from(futureInstant));
        appointment.setStart(period.getStart());
        appointment.setEnd(period.getEnd());
        Appointment.AppointmentParticipantComponent participant = new Appointment.AppointmentParticipantComponent();
        participant.setActor(new Reference(fullUrlPatient));
        participant.setStatus(Appointment.ParticipationStatus.ACCEPTED);
        appointment.addParticipant(participant);
        return appointment;
    }

    private static DiagnosticReport createDiagnosisReport(PreviewResponse.DiagnosisReport diagnosisReportInput){
        DiagnosticReport diagnosticReport = new DiagnosticReport();

        diagnosticReport.setStatus(DiagnosticReport.DiagnosticReportStatus.FINAL);

        diagnosticReport.addCategory(new CodeableConcept()
                .addCoding(new Coding()
                        .setDisplay(diagnosisReportInput.getTestCategories())));

        diagnosticReport.setCode(new CodeableConcept()
                .addCoding(new Coding()
                        .setDisplay(diagnosisReportInput.getSubCategory())));

     //   diagnosticReport.addPerformer(new Reference().setDisplay(diagnosisReportInput.getLaboratory()));
        return diagnosticReport;
    }


    private static Observation createObservation(PreviewResponse.Vitals vitals) {
        Observation observation = new Observation();
        observation.setStatus(Observation.ObservationStatus.FINAL);
        observation.setCode(new CodeableConcept().addCoding(new Coding()
                .setSystem("http://real-domain.com/fhir/document-ids")
                .setCode("8310-5")
                .setDisplay("vitals")));

        if (!vitals.getSpo2().equalsIgnoreCase("")) {
            String numberPart = vitals.getSpo2().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Oxygen saturation in Arterial blood by Pulse oximetry")))
                    .setValue(new Quantity().setValue(number).setUnit("%"));
        }

        if (!vitals.getRespiration().equalsIgnoreCase("")) {
            String numberPart = vitals.getRespiration().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Respiratory rate")))
                    .setValue(new Quantity().setValue(number).setUnit("breaths/min"));
        }

        if (!vitals.getTemperature().equalsIgnoreCase("")) {
            String numberPart = vitals.getTemperature().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Body temperature")))
                    .setValue(new Quantity().setValue(number).setUnit("°F"));
        }

        if (!vitals.getPulse().equalsIgnoreCase("")) {
            String numberPart = vitals.getPulse().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Heart rate")))
                    .setValue(new Quantity().setValue(number).setUnit("beats/min"));
        }

        if (!vitals.getWeight().equalsIgnoreCase("")) {
            String numberPart = vitals.getWeight().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Body weight")))
                    .setValue(new Quantity().setValue(number).setUnit("kg"));
        }

        if (!vitals.getHeight().equalsIgnoreCase("")) {
            String numberPart = vitals.getHeight().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Body height")))
                    .setValue(new Quantity().setValue(number).setUnit("cm"));
        }

        if (!vitals.getBp().equalsIgnoreCase("")) {
            String numberPart = vitals.getBp().replaceAll("[^0-9]", "");
            int number = Integer.parseInt(numberPart);
            Observation.ObservationComponentComponent systolicBP = observation.addComponent()
                    .setCode(new CodeableConcept().addCoding(
                            new Coding().setDisplay("Systolic blood pressure")))
                    .setValue(new Quantity().setValue(number).setUnit("mmHg"));
        }

        return observation;
    }



    private static Medication createMedication(String medName, String strengthValue) {
        Medication medication = new Medication();
        medication.setStatus(Medication.MedicationStatus.ACTIVE);
        CodeableConcept code = new CodeableConcept();
        code.addCoding(new Coding()
                .setDisplay(medName + " " + strengthValue));
        medication.setCode(code);
        return medication;
    }

    private static Practitioner createPractitioner(PreviewResponse previewResponse) {
        PreviewResponse.DoctorDetails doctorDetails = previewResponse.getDetails().getDoctorDetails();
        Practitioner practitioner = new Practitioner();
        practitioner.addName()
                .setFamily(doctorDetails.getDoctorName())
                .addGiven(doctorDetails.getDoctorName());
        practitioner.setId("example-practitioner");
        return practitioner;
    }


    private static Patient createPatient(PreviewResponse previewResponse) {
        PreviewResponse.PatientDetails patientDetails = previewResponse.getDetails().getPatientDetails();
        Patient patient = new Patient();
        patient.addName()
                .setUse(HumanName.NameUse.OFFICIAL)
                .setFamily(patientDetails.getPatientName())
                .addGiven(patientDetails.getPatientName());
        patient.setId(String.valueOf(patientDetails.getId()));
        return patient;
    }


    private void gotoPatientProfileScreen() {
        PatientProfileFragment newFragment = new PatientProfileFragment();
        FragmentTransaction transaction = getChildFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        //Log.i("myLog", "pidddddddddd:" + pId);
        result.putInt("patient_id", patientId);
        result.putInt("hospital_id", hospId);
        result.putString("from_screen", "Preview");
        result.putBoolean("preview_screen", true);
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment, "Patient");
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void gotoPatientScreen() {
        Intent intent = new Intent(getActivity(), MainActivity.class);
        intent.putExtra("from_screen", "Preview");
        intent.putExtra("patient_id", patientId);
        startActivity(intent);
        getActivity().finish();
    }

    private void addHeader(Document document, PdfDocument pdfDocument) {
        float headerHeight = 100f;
        document.add(new Paragraph("\n").setHeight(headerHeight).setBackgroundColor(new DeviceRgb(96, 112, 255)));
//        Bitmap bitmap = BitmapFactory.decodeResource(getContext().getResources(), R.drawable.splash_logo); // Replace with your actual logo resource
//        if (bitmap1 != null){
//        ByteArrayOutputStream stream = new ByteArrayOutputStream();
//        bitmap1.compress(Bitmap.CompressFormat.PNG, 100, stream);
//        Image logo = new Image(ImageDataFactory.create(stream.toByteArray()));
//        logo.setFixedPosition(1,30,pdfDocument.getDefaultPageSize().getTop() - 50,20);
//        document.add(logo);
//        }
        if (bitmap1 != null) {
            int diameter = 25; // you can set your desired circular image size here
            int borderWidth = 1;

            Bitmap circularBitmap = getCircularBitmapWithBorder(bitmap1, diameter, borderWidth);

            ByteArrayOutputStream stream = new ByteArrayOutputStream();
            circularBitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
            Image logo = new Image(ImageDataFactory.create(stream.toByteArray()));

            // Position: x = 30 (left), y = from top
            logo.setFixedPosition(30, pdfDocument.getDefaultPageSize().getTop() - 55);
            logo.setHeight(diameter + borderWidth * 2);
            logo.setWidth(diameter + borderWidth * 2);

            document.add(logo);
        }


        // Add hospital name and address
        Paragraph hospitalName1 = new Paragraph(hospitalName)
                .setFontSize(14)
                .setBold()
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.LEFT)
                .setFixedLeading(20);
        hospitalName1.setFixedPosition(60, pdfDocument.getDefaultPageSize().getTop() - 50, 200);

        Paragraph address = new Paragraph(hospitalAddress + "\n" +
                hospitalDis + "\n" +
                hospitalSta + " - " + hospitalPincode)
                .setFontSize(10)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.LEFT)
                .setFixedLeading(12);
        address.setFixedPosition(30, pdfDocument.getDefaultPageSize().getTop() - 120, 200);

        document.add(hospitalName1);
        document.add(address);

        // Add contact information
        Paragraph contactInfo = new Paragraph(hospitalMobile +
                "\n" +
                hospitalLink)
                .setFontSize(10)
                .setFontColor(ColorConstants.WHITE)
                .setTextAlignment(TextAlignment.RIGHT)
                .setFixedLeading(12);
        contactInfo.setFixedPosition(pdfDocument.getDefaultPageSize().getWidth() - 200, pdfDocument.getDefaultPageSize().getTop() - 120, 150);

        document.add(contactInfo);


    }

//private void addHeader(Document document, PdfDocument pdfDocument) {
//    float headerHeight = 100f;
//    float logoSize = 30f;
//    float leftMargin = 30f;
//    float pageWidth = pdfDocument.getDefaultPageSize().getWidth();
//    float pageTop = pdfDocument.getDefaultPageSize().getTop();
//
//    // Header background
//    document.add(new Paragraph("\n")
//            .setHeight(headerHeight)
//            .setBackgroundColor(new DeviceRgb(96, 112, 255)));
//
//    // Left-aligned, vertically centered logo
//    if (bitmap1 != null) {
//        int diameter = (int) logoSize;
//        int borderWidth = 1; // You can change border thickness here
//
//        Bitmap circularBitmapWithBorder = getCircularBitmapWithBorder(bitmap1, diameter, borderWidth);
//
//        ByteArrayOutputStream stream = new ByteArrayOutputStream();
//        circularBitmapWithBorder.compress(Bitmap.CompressFormat.PNG, 100, stream);
//        Image logo = new Image(ImageDataFactory.create(stream.toByteArray()));
//
//        float totalSize = diameter + (borderWidth * 2);
//        logo.setWidth(totalSize);
//        logo.setHeight(totalSize);
//
//        float x = leftMargin;
//        float y = pageTop - (headerHeight / 2) - (totalSize / 2);
//
//        logo.setFixedPosition(x, y);
//        document.add(logo);
//
//    }
//
//
//
//    // Hospital name to the right of logo
//    Paragraph hospitalName1 = new Paragraph(hospitalName)
//            .setFontSize(18)
//            .setBold()
//            .setFontColor(ColorConstants.WHITE)
//            .setTextAlignment(TextAlignment.LEFT)
//            .setFixedLeading(20)
//            .setFixedPosition(leftMargin + logoSize + 20, pageTop - 50, 250);
//    document.add(hospitalName1);
//
//    // Address
//    Paragraph address = new Paragraph(hospitalAddress + "\n" +
//            hospitalDis + "\n" +
//            hospitalSta + " - " + hospitalPincode)
//            .setFontSize(10)
//            .setFontColor(ColorConstants.WHITE)
//            .setTextAlignment(TextAlignment.LEFT)
//            .setFixedLeading(12)
//            .setFixedPosition(leftMargin + logoSize + 20, pageTop - 100, 250);
//    document.add(address);
//
//    // Contact info aligned to right
//    Paragraph contactInfo = new Paragraph(hospitalMobile + "\n" + hospitalLink)
//            .setFontSize(10)
//            .setFontColor(ColorConstants.WHITE)
//            .setTextAlignment(TextAlignment.RIGHT)
//            .setFixedLeading(12)
//            .setFixedPosition(pageWidth - 180, pageTop - 100, 150);
//    document.add(contactInfo);
//}

    private Bitmap getCircularBitmapWithBorder(Bitmap sourceBitmap, int diameter, int borderWidth) {
        int totalDiameter = diameter + 2 * borderWidth;

        Bitmap scaledBitmap = Bitmap.createScaledBitmap(sourceBitmap, diameter, diameter, true);
        Bitmap output = Bitmap.createBitmap(totalDiameter, totalDiameter, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(output);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        // Border (white circle)
        paint.setColor(Color.WHITE);
        canvas.drawCircle(totalDiameter / 2f, totalDiameter / 2f, totalDiameter / 2f, paint);

        // Clip path
        Path path = new Path();
        path.addCircle(totalDiameter / 2f, totalDiameter / 2f, diameter / 2f, Path.Direction.CCW);
        canvas.clipPath(path);

        // Draw scaled image
        canvas.drawBitmap(scaledBitmap, borderWidth, borderWidth, null);

        return output;
    }





    private void AbhaAddressPatientData(){
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("patient_id", String.valueOf(patientId));
        requestData.put("hospital_id", String.valueOf(hospId));
        Call<GetPatientProfileResponse.AbhaAdderssListResponse> call = services.abhaAdderessList(requestData);
        call.enqueue(new Callback<GetPatientProfileResponse.AbhaAdderssListResponse>() {

            @Override
            public void onResponse(Call<GetPatientProfileResponse.AbhaAdderssListResponse> call, Response<GetPatientProfileResponse.AbhaAdderssListResponse> response) {
                try {
                    Log.i("myLog", "addAbhaPatient response:::");
                    Log.i("mylog", "addAbhaPatient response:" + new Gson().toJson(response.body()));

           /*     if (response.body() != null) {
                    txtLinkNow.setVisibility(View.GONE);
                   // txtAbhaAddress.setText(response.body().getAbhaAddress().get(0).getAbhaAddress());
                    GetPatientProfileResponse.AbhaAdderssListResponse list = response.body();
                    int size = list.getAbhaAddress().size();
                    ArrayList<String> abhaList = new ArrayList<>();
                    abhaLists = new ArrayList<>();
                    abhaList.add("Link Now");
                    for (int start = 0; start < size; start++) {
                        GetPatientProfileResponse.AbhaAdderssListResponse.AbhaAddress resp = list.getAbhaAddress().get(start);
                        abhaList.add(resp.getAbhaAddress());


                    }

                    ArrayAdapter<String> adapter = new ArrayAdapter<String>(getActivity(), android.R.layout.simple_spinner_item, abhaList) {
                        @Override
                        public View getView(int position, View convertView, ViewGroup parent) {
                            TextView textView = (TextView) super.getView(position, convertView, parent);

                            if (position == 0) {
                                textView.setTextColor(Color.BLUE);
                            } else {
                                textView.setTextColor(Color.BLACK);
                            }

                            return textView;
                        }

                        @Override
                        public View getDropDownView(int position, View convertView, ViewGroup parent) {
                            TextView textView = (TextView) super.getDropDownView(position, convertView, parent);

                            if (position == 0) {
                                textView.setTextColor(Color.BLUE);
                            } else {
                                textView.setTextColor(Color.BLACK);
                            }

                            return textView;
                        }
                    };

                    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                    spinnerAbhaAddress.setAdapter(adapter);

                  //  OPHubUtils.addProdTypeSpinner(getActivity(), abhaList, spinnerAbhaAddress, "Abha List");
                    if (!abhaList.isEmpty()) {
                        spinnerAbhaAddress.setSelection(1);
                    }

                }


                spinnerAbhaAddress.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        if (position == 0) {
                            showAbhaDialog();
                        }
                    }

                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                    }
                });
*/


                    if (response.body() != null) {
                        GetPatientProfileResponse.AbhaAdderssListResponse list = response.body();
                        if (list.getAbhaAddress() != null) {
                            abhaAddress = list.getAbhaAddress().get(0).getAbhaAddress();
                            System.out.println("print abha address " + list.getAbhaAddress().get(0).getAbhaAddress());
                        }

                    } else {

                        Log.e("Error", "Response body is null");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }

            }

            @Override
            public void onFailure(Call<GetPatientProfileResponse.AbhaAdderssListResponse> call, Throwable t) {
                Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
            }
        });





    }

    //TODO Hospital details API
    public void callHospitalDetails() {

        Log.i("myLog", "Hospital Request  :  " +hospId);
        Call<HospitalDetailsResponse> call = services.getHospitalDetails(hospId);
        call.enqueue(new Callback<HospitalDetailsResponse>() {
            @Override
            public void onResponse(Call<HospitalDetailsResponse> call, Response<HospitalDetailsResponse> response) {
                try {
                    if (response.isSuccessful()) {

    //                    Log.i("myLog", "Hospital Response :  " + new Gson().toJson(response));
                        hospitalName = response.body().getDetails().getHospitalName();
                        hospitalAddress = response.body().getDetails().getHospitalAddress();
                        hospitalDis = response.body().getDetails().getHospitalDistrict();
                        hospitalSta = response.body().getDetails().getHospitalState();
                        hospitalPincode = response.body().getDetails().getHospitalPincode();
                        hospitalImage = response.body().getDetails().getHospitalLogo();
                        hospitalMobile = response.body().getDetails().getHospitalContactNo();
                        hospitalLink = response.body().getDetails().getHospitalWebsiteLink();
                        showProfileimage();
                    } else {

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<HospitalDetailsResponse> call, Throwable t) {
//                t.printStackTrace();
            }
        });
    }

    private void showProfileimage() {
        Log.i("myLog", "showProfileimage");
        Log.i("myLog", "imgName:" + hospitalImage);
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setValue(hospitalImage);
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
                            if (bytes != null) {
                                byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                                if (decodedImageBytes != null) {
                                    Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                                    bitmap1 = bitmap;
                                }
                            }
                        } catch (Exception e) {
                            //  throw new RuntimeException(e);
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "getAbhaCard response failure:" + t.toString());
            }
        });
    }

}