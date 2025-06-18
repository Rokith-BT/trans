package com.plenome.pos.views;

import android.Manifest;
import android.app.DatePickerDialog;
import static android.view.Gravity.CENTER;
import static android.view.View.GONE;
import static android.view.View.VISIBLE;

import static com.plenome.pos.views.ClinicalNotesFragment.REQUEST_AUDIO_PERMISSION_CODE;

import android.app.Dialog;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
//import com.arthenica.mobileffmpeg.Config;
//import com.arthenica.mobileffmpeg.FFmpeg;
import com.google.gson.Gson;
import com.google.android.flexbox.FlexWrap;
import com.google.android.flexbox.FlexboxLayoutManager;
import com.google.android.flexbox.JustifyContent;
import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.adapters.NewMedicineAdapter;
import com.plenome.pos.model.ClinicalNotesRequestPatch;
import com.plenome.pos.model.PatientPreviewResponse;
import com.plenome.pos.model.PostPrescriptionRequest;
import com.plenome.pos.model.PostPrescriptionResponse;
import com.plenome.pos.model.PrescriptionDetail;
import com.plenome.pos.model.PrescriptionResponse;
import com.plenome.pos.model.VitalsRequestResponse;
import com.plenome.pos.model.VitalsResquest;
import com.plenome.pos.adapters.MedicineListAdapter;
import com.plenome.pos.model.CategoriesResponse;
import com.plenome.pos.model.ClinicalNotesRequestResponse;
import com.plenome.pos.model.ClinicalSuggestion;
import com.plenome.pos.model.GetClinicalNotesResponse;
import com.plenome.pos.model.SubCategoriesResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.AudioRecorder;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.appointmentFlow.PreviewFragment;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import java.util.Calendar;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EMRFragment extends Fragment {
    View rootView;

    RestServices services;

    @BindView(R.id.temperature)
    EditText temperature;

    @BindView(R.id.pulse)
    EditText pulse;

    @BindView(R.id.blood_pressure)
    EditText bloodPressure;

    @BindView(R.id.weight)
    EditText weight;

    @BindView(R.id.height_measure)
    EditText heightMeasure;

    @BindView(R.id.spo)
    EditText spo;

    @BindView(R.id.save_data)
    Button saveData;

    @BindView(R.id.medicineRecyc)
    RecyclerView medicineRecyc;

    @BindView(R.id.text)
    Button text;

    @BindView(R.id.voice)
    Button voice;

    @BindView(R.id.scribble)
    Button scribble;

    @BindView(R.id.animatedFab)
    LottieAnimationView animatedFab;

    @BindView(R.id.diagnosis_spinner)
    LinearLayout diagnosisSpinner;

    @BindView(R.id.chief_complaints)
    TextView chiefComplaints;

    @BindView(R.id.vitals_txt)
    TextView vitalstxt;

    @BindView(R.id.vitals_sub)
    LinearLayout vitalsSub;

    @BindView(R.id.chief_complaints_sub)
    LinearLayout chiefComplaintsSub;

    @BindView(R.id.diagnosis)
    TextView diagnosis;

    @BindView(R.id.diagnosis_sub)
    LinearLayout diagnosisSub;

    @BindView(R.id.treatment)
    TextView treatment;

    @BindView(R.id.treatment_sub)
    LinearLayout treatmentSub;

    @BindView(R.id.medication)
    TextView medication;

    @BindView(R.id.medication_sub)
    LinearLayout medicationSub;

    @BindView(R.id.dietplan)
    TextView dietplan;

    @BindView(R.id.dietplan_sub)
    LinearLayout dietplanSub;

    @BindView(R.id.follow_up)
    TextView followUp;

    @BindView(R.id.follow_up_sub)
    LinearLayout followupSub;

    @BindView(R.id.scorllView)
    ScrollView scorllView;

    @BindView(R.id.add_new_diagnosis)
    TextView addNewDiagnosis;

    @BindView(R.id.add_new_medication)
    TextView addNewMedication;


    @BindView(R.id.edt_treatment_advice)
    EditText edtTreatmentAdvice;

    @BindView(R.id.edt_diet_plan)
    EditText edtDietPlan;

    @BindView(R.id.recycler_view_data)
    RecyclerView recyclerViewData;

    @BindView(R.id.complaint_name)
    AutoCompleteTextView complaintName;

    @BindView(R.id.chief_day)
    EditText chiefDay;

    @BindView(R.id.chief_date)
    Spinner chiefDate;

    @BindView(R.id.complaint_remarks)
    EditText complaintRemarks;

    @BindView(R.id.follow_days)
    EditText followDays;

    @BindView(R.id.follow_week)
    Spinner followWeek;

    @BindView(R.id.follow_up_date)
    TextView followUpDate;

    @BindView(R.id.follow_up_remarks)
    EditText followUpRemarks;

    @BindView(R.id.edt_past_treatment)
    EditText edtPastTreatment;

    @BindView(R.id.lyt_treatment_advice)
    LinearLayout lytTreatmentAdvice;

    @BindView(R.id.lyt_diagnosis)
    LinearLayout lytDiagnosis;

    @BindView(R.id.lyt_diet_plan)
    LinearLayout lytDietPlan;

    @BindView(R.id.lyt_medication)
    LinearLayout lytMedication;

    @BindView(R.id.lyt_followup)
    LinearLayout lytFollowup;

    @BindView(R.id.lyt_comming_soon)
    LinearLayout lytCommingSoon;

    @BindView(R.id.lyt_text_voice)
    LinearLayout lytTextVoice;




    int sizeDiagnosis = 100, currentIndexDiagnosis = 0;
    int sizeMedication = 10, currentIndexMedication = 0;

    LinearLayout[] linearRowDiagnosis = new LinearLayout[sizeDiagnosis];




    AutoCompleteTextView[] testCategories = new AutoCompleteTextView[sizeDiagnosis];
    AutoCompleteTextView[] subCategory = new AutoCompleteTextView[sizeDiagnosis];
    EditText[] laboratory = new EditText[sizeDiagnosis];
    EditText[] remarksDiagnosis = new EditText[sizeDiagnosis];
    ImageView[] actionDiagnosis = new ImageView[sizeDiagnosis];


    List<String> testCategoriesList = new ArrayList<>();
    List<String> subCategoryList = new ArrayList<>();
    List<String> laboratoryList = new ArrayList<>();
    List<String> remarksList = new ArrayList<>();
    List<String> opdID = new ArrayList<>();
    List<String> filledUsing = new ArrayList<>();

    List<String> CategoriesList = new ArrayList<>();
    List<String> CategoriesID = new ArrayList<>();
    List<String> SubCategoriesList = new ArrayList<>();
    List<String> opdIDcomplaint = new ArrayList<>();
    List<String> complaintFilling = new ArrayList<>();

    int CursorPosition = 0, hospitalId;
    String opdId,userType, filledSave = "text";
    String[] days = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"};
    String[] month = {"Days"};

    List<String> suggestionList = new ArrayList<>();
    List<String> suggestionList1 = new ArrayList<>();
    ArrayAdapter<String> arrayAdapter;

    ArrayList<String> medicineList = new ArrayList<>();
    ArrayList<Integer> medicineID = new ArrayList<>();
    ArrayList<String> dataAppan = new ArrayList<>();
    ArrayList<String> diagnosisApi = new ArrayList<>();
    ArrayList<Integer> diagnosisID = new ArrayList<>();

    private MedicineListAdapter medicineListAdapter;

    GetClinicalNotesResponse.Details listResp;
    Boolean pastData = false;
    String APIcallMethod = "post";

    Integer getChiefCompaintID, getPastTreatmentID, getTreatmentAdviceID, getDietPlanID, getFollowUpID;

    private NewMedicineAdapter newMedicineAdapter;
    private List<PrescriptionDetail> mainList;
    private String selectedFilling = "Text";
    private String apptId, apptStatus;
    private Boolean isRecording = false;
    private AudioRecorder recorder;
    private String filePath;
    private Dialog progressDialog;



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_emr, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        OPHubApplication.appBarTitle.setText(R.string.caseSheet);
        progressDialog = new Dialog(getContext());
        progressDialog.setContentView(R.layout.progress_dialog);
        progressDialog.setCancelable(false);
        recorder = new AudioRecorder();
        hospitalId = OPHubApplication.getHospitalId();
        userType = OPHubApplication.getUserType();
        Bundle bundle = getArguments();
        if (bundle != null) {
            opdId = String.valueOf(bundle.getInt("opdId"));
            apptId = bundle.getString("appt_id");
            apptStatus = bundle.getString("appt_status");
        }

        if(userType.equalsIgnoreCase("Nurse")){
            lytTreatmentAdvice.setVisibility(GONE);
            lytDiagnosis.setVisibility(GONE);
            lytDietPlan.setVisibility(GONE);
            lytMedication.setVisibility(GONE);
            lytFollowup.setVisibility(GONE);
        }

        System.out.println("print opdId: " + opdId);

        ArrayAdapter ad
                = new ArrayAdapter(
                getActivity(),
                android.R.layout.simple_spinner_item,
                days);
        ad.setDropDownViewResource(
                android.R.layout
                        .simple_spinner_dropdown_item);
//        followDays.setAdapter(ad);
//        chiefDay.setAdapter(ad);

        ArrayAdapter week
                = new ArrayAdapter(
                getActivity(),
                android.R.layout.simple_spinner_item, month);
        week.setDropDownViewResource(
                android.R.layout
                        .simple_spinner_dropdown_item);
        followWeek.setAdapter(week);
        chiefDate.setAdapter(week);

        callGetApi();
//        getCategories();
        getClinicalNotes("New");

        followDays.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void afterTextChanged(Editable editable) {
                try {
                    // Parse the number entered by the user
                    int daysToAdd = Integer.parseInt(editable.toString());

                    // Calculate the new date
                    Calendar calendar = Calendar.getInstance();
                    calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);

                    // Format the new date
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
                    String formattedDate = dateFormat.format(calendar.getTime());


                    followUpDate.setText(formattedDate);

                } catch (NumberFormatException e) {
                    // Clear the result if input is invalid
                    followUpDate.setText("");
                }
            }
        });

        addNewDiagnosis.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                currentIndexDiagnosis++;
                addDiagnosis(currentIndexDiagnosis, "NotAPI", null);
            }
        });

        animatedFab.setOnClickListener(v -> {
            if (!isRecording){
                if (!checkPermissions()){
                    requestPermissions();
                    return;
                }
                animatedFab.playAnimation();
                isRecording = true;
                recorder.startRecording();
            }else {
                animatedFab.cancelAnimation();
                animatedFab.setProgress(0);
                isRecording = false;
                filePath = recorder.getFilePath();
                recorder.stopRecording();
                if (filePath != null) {
                    progressDialog.show();
//                    trimAudio(filePath);
                    uploadAudioFile();
                }
            }
        });



        addNewMedication.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PrescriptionDetail prescriptionDetail = new PrescriptionDetail();
                prescriptionDetail.setIsFromApi(false);
                prescriptionDetail.setDosage("");
                prescriptionDetail.setFrequency("");
                prescriptionDetail.setDurationCount("");
                prescriptionDetail.setDurationLimit("");
                prescriptionDetail.setMedicineName("");
                prescriptionDetail.setRemarks("");
                prescriptionDetail.setQuantity("");
                if (mainList != null) {
                    mainList.add(prescriptionDetail);
                } else {
                    mainList = new ArrayList<PrescriptionDetail>();
                    mainList.add(prescriptionDetail);
                }
                medicineRecyc.setLayoutManager(new LinearLayoutManager(getContext()));
                newMedicineAdapter = new NewMedicineAdapter(getContext(), mainList, services, hospitalId);
                medicineRecyc.setAdapter(newMedicineAdapter);
                newMedicineAdapter.setOnClickListener(new NewMedicineAdapter.OnClickListener() {
                    @Override
                    public void onClick(int position, String option) {
                        PrescriptionDetail detail = mainList.get(position);
                        if (detail.getId() != null){
                            showConfirmationDialog(detail.getId());
                        }else {
                            getPrescription();
                        }

                    }
                });
              /*  addNewMedication.setVisibility(VISIBLE);*/
            }
        });

//        chiefComplaints.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (chiefComplaintsSub.getVisibility() == View.GONE) {
//                    chiefComplaintsSub.setVisibility(View.VISIBLE);
//                    chiefComplaints.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    chiefComplaintsSub.setVisibility(View.GONE);
//                    chiefComplaints.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//
//                }
//            }
//        });
//
//        vitalstxt.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (vitalsSub.getVisibility() == View.GONE) {
//                    vitalsSub.setVisibility(View.VISIBLE);
//                    vitalstxt.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    vitalsSub.setVisibility(View.GONE);
//                    vitalstxt.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//                }
//            }
//        });
//
//
//        diagnosis.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (diagnosisSub.getVisibility() == View.GONE) {
//                    diagnosisSub.setVisibility(View.VISIBLE);
//                    diagnosis.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    diagnosisSub.setVisibility(View.GONE);
//                    diagnosis.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//
//                }
//            }
//        });
//
//        treatment.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (treatmentSub.getVisibility() == View.GONE) {
//                    treatmentSub.setVisibility(View.VISIBLE);
//                    treatment.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    treatmentSub.setVisibility(View.GONE);
//                    treatment.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//
//                }
//            }
//        });
//
//        medication.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (medicationSub.getVisibility() == View.GONE) {
//                    medicationSub.setVisibility(View.VISIBLE);
//                    medication.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    medicationSub.setVisibility(View.GONE);
//                    medication.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//
//                }
//            }
//        });
//
//        dietplan.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (dietplanSub.getVisibility() == View.GONE) {
//                    dietplanSub.setVisibility(View.VISIBLE);
//                    dietplan.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    dietplanSub.setVisibility(View.GONE);
//                    dietplan.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//
//                }
//            }
//        });
//
//        followUp.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                if (followupSub.getVisibility() == View.GONE) {
//                    followupSub.setVisibility(View.VISIBLE);
//                    followUp.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_uparrow, 0);
//
//                } else {
//                    followupSub.setVisibility(View.GONE);
//                    followUp.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_icon, 0, R.drawable.ic_downarrow, 0);
//
//                }
//            }
//        });
        getPrescription();

        complaintName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                getSuggestions(complaintName.getText().toString());
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });




        return rootView;
    }

    private boolean checkPermissions() {
        int result = ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.RECORD_AUDIO);
        int storagePermission = ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.WRITE_EXTERNAL_STORAGE);
        return result == PackageManager.PERMISSION_GRANTED && storagePermission == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions() {
        ActivityCompat.requestPermissions(requireActivity(),
                new String[]{Manifest.permission.RECORD_AUDIO, Manifest.permission.WRITE_EXTERNAL_STORAGE},
                REQUEST_AUDIO_PERMISSION_CODE);
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_AUDIO_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(getContext(), "Permission Granted", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(getContext(), "Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private boolean isAudioFileDurationValid(String filePath) {
        MediaPlayer mediaPlayer = new MediaPlayer();
        try {
            mediaPlayer.setDataSource(filePath);
            mediaPlayer.prepare();
            int durationInMillis = mediaPlayer.getDuration();
            int durationInSeconds = durationInMillis / 1000;
            return durationInSeconds > 5;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        } finally {
            mediaPlayer.release();
        }
    }
    public void trimAudio(String filePath) {

        String outputDir = "/storage/emulated/0/Download/splitfile/" + opdId;
        File dir = new File(outputDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String outputPattern = outputDir + "/output_chunk_%03d.mp3";
        String commands = "-i " + filePath + " -map 0:a:0 -f segment -segment_time 25 -c:a libmp3lame -q:a 2 " + outputPattern;

        Log.d("FFmpeg", "Executing command: " + commands);

//        FFmpeg.executeAsync(commands, (executionId, returnCode) -> {
//            if (returnCode == Config.RETURN_CODE_SUCCESS) {
//                Log.d("FFmpeg", "Audio split successfully!");
//                uploadAudioFile();
//            } else {
//                Log.e("FFmpeg", "Error splitting audio. Return code: " + returnCode);
//            }
//        });
    }

    public static ArrayList<File> getFilesFromDirectory(String directoryPath) {
        ArrayList<File> fileList = new ArrayList<>();
        File directory = new File(directoryPath);

        // Check if directory exists and is a directory
        if (directory.exists() && directory.isDirectory()) {
            File[] files = directory.listFiles();

            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) { // Only add files, not subdirectories
                        fileList.add(file);
                    }
                }
            }
        }
        return fileList;
    }
    private void uploadAudioFile() {
        String BASE_URL = BuildConfig.BASE_URL + "voice-text-sarvam";

        int CONNECT_TIMEOUT = 60; // seconds
        int READ_TIMEOUT = 60;    // seconds
        int WRITE_TIMEOUT = 60;   // seconds
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS)
                .readTimeout(READ_TIMEOUT, TimeUnit.SECONDS)
                .writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS)
                .retryOnConnectionFailure(true)  // Enable retries
                .addInterceptor(logging)
                .build();
     /*   File file = new File(filePath);
        if (!isAudioFileDurationValid(filePath)){
            Toast.makeText(getContext(),"Please Record More than 5 Seconds",Toast.LENGTH_SHORT).show();
            progressDialog.dismiss();
            return;
        }*/
        // Create multipart request body
       /* RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", file.getName(),
                        RequestBody.create(MediaType.parse("audio/mpeg"), file))
                .addFormDataPart("opd_id", opdId)
                .addFormDataPart("hospital_id", String.valueOf(hospitalId))
                .build();*/
        String path = "/storage/emulated/0/Download/splitfile/" + opdId;
        ArrayList<File> fileList = getFilesFromDirectory(path);
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("opd_id", opdId)
                .addFormDataPart("hospital_id", String.valueOf(hospitalId));
        for (File file : fileList) {
            builder.addFormDataPart("files", file.getName(),
                    RequestBody.create(MediaType.parse("audio/mpeg"), file));
        }
        RequestBody requestBody = builder.build();

        // Create request
        Request request = new Request.Builder()
                .url(BASE_URL)
                .post(requestBody)
                .build();

        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onResponse(@NonNull okhttp3.Call call, @NonNull okhttp3.Response response) throws IOException {
                if (response.isSuccessful()) {
                    progressDialog.dismiss();
                    String responseBody = response.body().string();
                    Gson gson = new Gson();
                    PatientPreviewResponse apiResponse = gson.fromJson(responseBody, PatientPreviewResponse.class);
                    new Handler(Looper.getMainLooper()).post(() -> {
                        Toast.makeText(getContext(),"Data Added Successfully",Toast.LENGTH_SHORT).show();

                        if(userType.equalsIgnoreCase("Nurse")){
                            setVoiceData(apiResponse);
                        }else {

                            setVoiceData(apiResponse);

                        if (apiResponse.getDetails().getPrescription() != null) {
                            if (!apiResponse.getDetails().getPrescription().isEmpty()) {
                                setPrescription(apiResponse.getDetails().getPrescription());
                            }
                        }

                        if (apiResponse.getDetails().getClinicalNotes().getPastTreatmentHistory() != null) {
                            if (apiResponse.getDetails().getClinicalNotes().getPastTreatmentHistory().getHistory() != null) {
                                edtPastTreatment.setText(apiResponse.getDetails().getClinicalNotes().getPastTreatmentHistory().getHistory().toString());
                            }
                        }
                        if (apiResponse.getDetails().getClinicalNotes().getTreatmentAdvice() != null) {
                            if (apiResponse.getDetails().getClinicalNotes().getTreatmentAdvice().getAdvice() != null) {
                                edtTreatmentAdvice.setText(apiResponse.getDetails().getClinicalNotes().getTreatmentAdvice().getAdvice().toString());
                            }
                        }

                        if (apiResponse.getDetails().getClinicalNotes().getDietPlan() != null) {
                            if (apiResponse.getDetails().getClinicalNotes().getDietPlan().getPlan() != null) {
                                edtDietPlan.setText(apiResponse.getDetails().getClinicalNotes().getDietPlan().getPlan().toString());
                            }
                        }

                        if (apiResponse.getDetails().getClinicalNotes().getFollowUp() != null) {
                            followDays.setText(apiResponse.getDetails().getClinicalNotes().getFollowUp().getCount());
                            followUpRemarks.setText(apiResponse.getDetails().getClinicalNotes().getFollowUp().getRemarks());
                            followUpDate.setText(apiResponse.getDetails().getClinicalNotes().getFollowUp().getDate());
                        }
                        }

//                        if (apiResponse.getDetails().getClinicalNotes().getDiagnosisReport() != null) {
//                            APIcallMethod = "patch";
//                            System.out.println("print Diagnosis size " + apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().size());
//                            currentIndexDiagnosis = apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().size() - 1;
//                            for (int i = 0; i < apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().size(); i++) {
//                                diagnosisID.add(apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().get(i).getId());
//                            }
//
//                            addDiagnosis(currentIndexDiagnosis, "API", apiResponse.getDetails().getClinicalNotes().getDiagnosisReport());
//                        }

                    });

                } else {
                    new Handler(Looper.getMainLooper()).post(() -> {
                        Toast.makeText(getContext(), "Internal Server Error , Please Try Again", Toast.LENGTH_SHORT).show();
                        progressDialog.dismiss();
                    });
                }
            }

            @Override
            public void onFailure(@NonNull okhttp3.Call call, @NonNull IOException e) {
                new Handler(Looper.getMainLooper()).post(() -> {
                    Toast.makeText(getContext(), "Internal Server Error , Please Try Again", Toast.LENGTH_SHORT).show();
                    progressDialog.dismiss();
                });
            }
        });
    }


    public void setVoiceData(PatientPreviewResponse apiResponse){
        if (apiResponse.getDetails().getVitals() != null){
            if(!apiResponse.getDetails().getVitals().getTemperature().isEmpty())
                temperature.setText(apiResponse.getDetails().getVitals().getTemperature());
            if (!apiResponse.getDetails().getVitals().getPulse().isEmpty())
                pulse.setText(apiResponse.getDetails().getVitals().getPulse());
            if (!apiResponse.getDetails().getVitals().getBp().isEmpty())
                bloodPressure.setText(apiResponse.getDetails().getVitals().getBp());
            if (!apiResponse.getDetails().getVitals().getWeight().isEmpty())
                weight.setText(apiResponse.getDetails().getVitals().getWeight());
            if (!apiResponse.getDetails().getVitals().getHeight().isEmpty())
                heightMeasure.setText(apiResponse.getDetails().getVitals().getHeight());
            if (!apiResponse.getDetails().getVitals().getSpo2().isEmpty())
                spo.setText(apiResponse.getDetails().getVitals().getSpo2());
        }


        if (apiResponse.getDetails().getClinicalNotes().getChiefComplaintsBasic() != null) {
            medicineList.clear();
            medicineID.clear();
            for (int i = 0; i < apiResponse.getDetails().getClinicalNotes().getChiefComplaintsBasic().size(); i++) {
                medicineList.add(apiResponse.getDetails().getClinicalNotes().getChiefComplaintsBasic().get(i).getComplaintsName());
                medicineID.add(apiResponse.getDetails().getClinicalNotes().getChiefComplaintsBasic().get(i).getId());
                dataAppan.add("API");
            }

            FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(getContext());
            layoutManager.setFlexWrap(FlexWrap.WRAP); // Allow wrapping
            layoutManager.setJustifyContent(JustifyContent.FLEX_START);
            recyclerViewData.setLayoutManager(layoutManager);
            medicineListAdapter = new MedicineListAdapter(getContext(), dataAppan, medicineList, medicineID, services, hospitalId);
            recyclerViewData.setAdapter(medicineListAdapter);
        }


        if (apiResponse.getDetails().getClinicalNotes().getChiefComplaintDetails() != null) {
            chiefDay.setText(apiResponse.getDetails().getClinicalNotes().getChiefComplaintDetails().getCount());
            complaintRemarks.setText(apiResponse.getDetails().getClinicalNotes().getChiefComplaintDetails().getRemarks());
        }
    }

     private void setPrescription(List<PrescriptionDetail> prescription) {
        prescription.forEach(prescriptionDetail -> {
            prescriptionDetail.setIsFromApi(true);
        });
        if (mainList != null) {
            mainList.clear();
        }
        mainList = prescription;
        medicineRecyc.setLayoutManager(new LinearLayoutManager(getContext()));
        newMedicineAdapter = new NewMedicineAdapter(getContext(), mainList, services, hospitalId);
        medicineRecyc.setAdapter(newMedicineAdapter);
        medicineRecyc.setVisibility(VISIBLE);
        newMedicineAdapter.setOnClickListener(new NewMedicineAdapter.OnClickListener() {
                @Override
                public void onClick(int position, String option) {
                    PrescriptionDetail detail = mainList.get(position);
                    showConfirmationDialog(detail.getId());
                }
            });
    }


    private void getPrescription() {
        Log.i("myLog", " getPrescription opdId:" + opdId + "   hospid: " + hospitalId);
        Call<PrescriptionResponse> call = services.getPrescription(Integer.parseInt(opdId), hospitalId);
        call.enqueue(new Callback<PrescriptionResponse>() {

            @Override
            public void onResponse(Call<PrescriptionResponse> call, Response<PrescriptionResponse> response) {
                try {
                    Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        if (!response.body().getDetails().isEmpty()) {
                            List<PrescriptionDetail> prescList = response.body().getDetails();

                            prescList.forEach(prescriptionDetail -> {
                                prescriptionDetail.setIsFromApi(true);
                            });
                            if (mainList != null) {
                                mainList.clear();
                            }
                            mainList = prescList;
                            medicineRecyc.setLayoutManager(new LinearLayoutManager(getContext()));
                            newMedicineAdapter = new NewMedicineAdapter(getContext(), mainList, services, hospitalId);
                            medicineRecyc.setAdapter(newMedicineAdapter);
                           /* addNewMedication.setVisibility(VISIBLE);*/
                            newMedicineAdapter.setOnClickListener(new NewMedicineAdapter.OnClickListener() {
                                @Override
                                public void onClick(int position, String option) {
                                    PrescriptionDetail detail = mainList.get(position);
                                    showConfirmationDialog(detail.getId());
                                }
                            });
                        }else {
                            if (mainList != null){
                                mainList.clear();
                                medicineRecyc.setLayoutManager(new LinearLayoutManager(getContext()));
                                newMedicineAdapter = new NewMedicineAdapter(getContext(), mainList, services, hospitalId);
                                medicineRecyc.setAdapter(newMedicineAdapter);
                                newMedicineAdapter.setOnClickListener(new NewMedicineAdapter.OnClickListener() {
                                    @Override
                                    public void onClick(int position, String option) {
                                        PrescriptionDetail detail = mainList.get(position);
                                        showConfirmationDialog(detail.getId());
                                    }
                                });
                            }
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PrescriptionResponse> call, Throwable t) {

            }
        });
    }



    private void callGetApi() {
        Log.i("myLog", "callGetApi");
        Call<VitalsResquest> call = services.getVitals(Integer.parseInt(opdId), hospitalId);
        call.enqueue(new Callback<VitalsResquest>() {
            @Override
            public void onResponse(Call<VitalsResquest> call, Response<VitalsResquest> response) {

                try {
                    if (response.body() != null) {
                        Log.i("myLog", "server contact ");
                        VitalsResquest rep = response.body();
                        if (rep.getDetails() != null){
                        temperature.setText(rep.getDetails().getTemperature());
                        pulse.setText(rep.getDetails().getPulse());
                        bloodPressure.setText(rep.getDetails().getBp());
                        weight.setText(rep.getDetails().getWeight());
                        heightMeasure.setText(rep.getDetails().getHeight());
                        spo.setText(rep.getDetails().getSpo2());


                        if (rep.getDetails().getBp().equalsIgnoreCase("") &&
                                rep.getDetails().getPulse().equalsIgnoreCase("") &&
                                rep.getDetails().getSpo2().equalsIgnoreCase("") &&
                                rep.getDetails().getTemperature().equalsIgnoreCase("") &&
                                rep.getDetails().getWeight().equalsIgnoreCase("") &&
                                rep.getDetails().getHeight().equalsIgnoreCase("")) {
                            scorllView.setVisibility(VISIBLE);
                            System.out.println("print res inside");
                            pastData = false;
                        }
                        }else {
                            scorllView.setVisibility(GONE);
                            pastData = true;
                            System.out.println("print res outside");
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
                            previewTransaction.replace(R.id.preview_frag_container, previewFragment);
                            previewTransaction.addToBackStack(null);
                            previewTransaction.commit();
                            if (animatedFab.getVisibility() == VISIBLE){
                                animatedFab.setVisibility(GONE);
                            }
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
                Log.i("myLog", "callGetApi response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    @OnClick(R.id.save_data)
    public void saveData(){
       showConfirmationDialogSave();
    }

    public void saveDataClinicalNotes() {


        if (APIcallMethod.equalsIgnoreCase("post")) {
            testCategoriesList.clear();
            subCategoryList.clear();
            laboratoryList.clear();
            remarksList.clear();
            Log.i("myLog", "currentIndexDiagnosis post : " + currentIndexDiagnosis);
            Log.i("myLog", "testCategories :" + testCategories.toString());

            try {
                for (int i = 0; i <= currentIndexDiagnosis; i++) {
                    Log.i("myLog", "for index:" + i);
                    Log.i("myLog", "for index:" );
                    String testCategory = testCategories[i].getText().toString();
                    String subCategoryValue = subCategory[i].getText().toString();
                    String laboratoryValue = laboratory[i].getText().toString();
                    String remarks = remarksDiagnosis[i].getText().toString();

                    testCategoriesList.add(testCategory);
                    subCategoryList.add(subCategoryValue);
                    laboratoryList.add(laboratoryValue);
                    remarksList.add(remarks);
                    opdID.add(opdId);
                    filledUsing.add("text");
                }
            } catch (Exception e) {
                System.out.println("print exception  " + e);
            }

            List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList = new ArrayList<>();

            Integer size = testCategoriesList.size();

            for (int i = 0; i < size; i++) {
                ClinicalNotesRequestResponse.DiagnosisReport diagnosisReport = new ClinicalNotesRequestResponse.DiagnosisReport();
                diagnosisReport.setTestCategories(testCategoriesList.get(i));
                diagnosisReport.setSubCategory(subCategoryList.get(i));
                diagnosisReport.setLaboratory(laboratoryList.get(i));
                diagnosisReport.setRemarks(remarksList.get(i));
                diagnosisReport.setOpdId(Integer.valueOf(opdID.get(i)));
                diagnosisReport.setFilledUsing(filledUsing.get(i));
                diagnosisReportList.add(diagnosisReport);
            }

            for (int i = 0; i < medicineList.size(); i++) {
                opdIDcomplaint.add(opdId);
                complaintFilling.add("text");
            }

            List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();

            Integer size1 = medicineList.size();
            for (int i = 0; i < size1; i++) {
                ClinicalNotesRequestResponse.ChiefComplaintsBasic medicine = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();
                medicine.setComplaintName(medicineList.get(i));
                medicine.setOpdId(Integer.valueOf(opdIDcomplaint.get(i)));
                medicine.setFilledUsing(complaintFilling.get(i));
                chiefComplaintsBasicList.add(medicine);
            }


            Log.i("myLog", "getConsentRequest:" + new Gson().toJson(diagnosisReportList));
            Log.i("myLog", "getMedicineList :" + new Gson().toJson(chiefComplaintsBasicList));


            callApiPost(diagnosisReportList, chiefComplaintsBasicList);
        } else {
            testCategoriesList.clear();
            subCategoryList.clear();
            laboratoryList.clear();
            remarksList.clear();
            Log.i("myLog", "currentIndexDiagnosis patch : " + currentIndexDiagnosis);
            Log.i("myLog", "testCategories :" + testCategories);

            try {
                for (int i = 0; i <= currentIndexDiagnosis; i++) {
                    Log.i("myLog", "for index:" + i);

                        if (testCategories[i].getText().toString() != null){
                            String testCategory = testCategories[i].getText().toString();
                            String subCategoryValue = subCategory[i].getText().toString();
                            String laboratoryValue = laboratory[i].getText().toString();
                            String remarks = remarksDiagnosis[i].getText().toString();

                            testCategoriesList.add(testCategory);
                            subCategoryList.add(subCategoryValue);
                            laboratoryList.add(laboratoryValue);
                            remarksList.add(remarks);
                            opdID.add(opdId);
                            filledUsing.add("text");

                    } else {
                        currentIndexDiagnosis++;
                    }
                }
            } catch (Exception e) {
                System.out.println("print exception  " + e);
            }

            List<ClinicalNotesRequestPatch.DiagnosisReport> diagnosisReportList = new ArrayList<>();

            Integer size = testCategoriesList.size();

            for (int i = 0; i < size; i++) {
                ClinicalNotesRequestPatch.DiagnosisReport diagnosisReport = new ClinicalNotesRequestPatch.DiagnosisReport();
                diagnosisReport.setTestCategories(testCategoriesList.get(i));
                diagnosisReport.setSubCategory(subCategoryList.get(i));
                diagnosisReport.setLaboratory(laboratoryList.get(i));
                diagnosisReport.setRemarks(remarksList.get(i));
                if (diagnosisApi.get(i).equalsIgnoreCase("API")) {
                    diagnosisReport.setId((diagnosisID.get(i)));
                } else {
                    diagnosisReport.setOpd_id(Integer.valueOf(opdID.get(i)));
                }
                diagnosisReport.setFilledUsing(filledUsing.get(i));
                diagnosisReportList.add(diagnosisReport);
            }

            for (int i = 0; i < medicineList.size(); i++) {
                opdIDcomplaint.add(opdId);
                complaintFilling.add("text");
            }

            List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();

            Integer size1 = medicineList.size();
            for (int i = 0; i < size1; i++) {
                ClinicalNotesRequestPatch.ChiefComplaintsBasic medicine = new ClinicalNotesRequestPatch.ChiefComplaintsBasic();
                medicine.setComplaintName(medicineList.get(i));
                Log.i("myLog", "for message" + dataAppan.get(i));
                if (dataAppan.get(i).equalsIgnoreCase("API")) {
                    medicine.setId((medicineID.get(i)));
                } else {
                    medicine.setOpd_id(Integer.valueOf(opdId));
                }
                medicine.setFilledUsing(complaintFilling.get(i));
                chiefComplaintsBasicList.add(medicine);
            }


            Log.i("myLog", "getConsentRequest:" + new Gson().toJson(diagnosisReportList));
            Log.i("myLog", "getMedicineList :" + new Gson().toJson(chiefComplaintsBasicList));


            callApiPatch(diagnosisReportList, chiefComplaintsBasicList);
        }
    }

    private void callApiPost(List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList, List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasics) {
        Log.i("myLog", "getClinicalNotesRequest");
        ClinicalNotesRequestResponse request = new ClinicalNotesRequestResponse();

        List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
        ClinicalNotesRequestResponse.ChiefComplaintsBasic chiefComplaintsBasic = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();

        chiefComplaintsBasic.setOpdId(Integer.valueOf(opdId.toString()));
        chiefComplaintsBasic.setComplaintName(complaintName.getText().toString());
        chiefComplaintsBasic.setFilledUsing(filledSave);

        chiefComplaintsBasicList.add(chiefComplaintsBasic);
        request.setChiefComplaintsBasic(chiefComplaintsBasicList);

        request.setChiefComplaintDetails(new ClinicalNotesRequestResponse.ChiefComplaintDetails());
        request.getChiefComplaintDetails().setOpdId(Integer.valueOf(opdId));
        request.getChiefComplaintDetails().setFilledUsing(filledSave);
        request.getChiefComplaintDetails().setCount(chiefDay.getText().toString());
        request.getChiefComplaintDetails().setDurationLimit(chiefDate.getSelectedItem().toString());
        request.getChiefComplaintDetails().setRemarks(complaintRemarks.getText().toString());

        request.setPastTreatmentHistory(new ClinicalNotesRequestResponse.PastTreatmentHistory());
        request.getPastTreatmentHistory().setOpdId(Integer.valueOf(opdId.toString()));
        request.getPastTreatmentHistory().setFilledUsing(filledSave);
        request.getPastTreatmentHistory().setHistory(edtPastTreatment.getText().toString());


        List<ClinicalNotesRequestResponse.PastTreatmentHistoryDoc> pastTreatmentHistoryDocsList = new ArrayList<>();
        ClinicalNotesRequestResponse.PastTreatmentHistoryDoc pastTreatmentHistoryDoc = new ClinicalNotesRequestResponse.PastTreatmentHistoryDoc();

        pastTreatmentHistoryDoc.setOpdId(Integer.valueOf(opdId.toString()));
        pastTreatmentHistoryDoc.setFilledUsing(filledSave);
        pastTreatmentHistoryDoc.setDocuments("");

        pastTreatmentHistoryDocsList.add(pastTreatmentHistoryDoc);
        request.setPastTreatmentHistoryDocs(pastTreatmentHistoryDocsList);


        request.setTreatmentAdvice(new ClinicalNotesRequestResponse.TreatmentAdvice());
        request.getTreatmentAdvice().setOpdId(Integer.valueOf(opdId.toString()));
        request.getTreatmentAdvice().setFilledUsing(filledSave);
        request.getTreatmentAdvice().setAdvice(edtTreatmentAdvice.getText().toString());


        request.setDietPlan(new ClinicalNotesRequestResponse.DietPlan());
        request.getDietPlan().setDietPlan(edtDietPlan.getText().toString());
        request.getDietPlan().setOpdId(Integer.valueOf(opdId.toString()));
        request.getDietPlan().setFilledUsing(filledSave);

        request.setDiagnosisReport(diagnosisReportList);
        request.setChiefComplaintsBasic(chiefComplaintsBasics);

        request.setFollowUp(new ClinicalNotesRequestResponse.FollowUp());
        request.getFollowUp().setDate(followUpDate.getText().toString());
        request.getFollowUp().setCount(followDays.getText().toString());
        request.getFollowUp().setDurationLimit(followWeek.getSelectedItem().toString());
        request.getFollowUp().setRemarks(followUpRemarks.getText().toString());
        request.getFollowUp().setOpdId(Integer.valueOf(opdId.toString()));
        request.getFollowUp().setFilledUsing(filledSave);


        request.setHospitalId(hospitalId);


        Log.i("myLog", "getClinicalNoesRequest:" + new Gson().toJson(request));
        Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = services.getClinicalNotesRequest(request);
        call.enqueue(new Callback<ClinicalNotesRequestResponse.ConsentRequestResponsedata>() {

            @Override
            public void onResponse(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Response<ClinicalNotesRequestResponse.ConsentRequestResponsedata> response) {
                try {
                    if (response.body() != null) {
                        ClinicalNotesRequestResponse.ConsentRequestResponsedata resp = response.body();
    //                    Toast.makeText(getContext(), resp.getMessege(), Toast.LENGTH_SHORT).show();


    //                    filterlayout.setVisibility(View.GONE);
    //                    imgNoData.setVisibility(View.GONE);
    //                    addNew.setVisibility(View.GONE);
    //                    txtNoData.setVisibility(View.GONE);
    //                    lytTab.setVisibility(View.GONE);
    //                    scrollView.setVisibility(View.GONE);
    //                    tblHead.setVisibility(View.VISIBLE);
                        getClinicalNotes("old");


                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {
                Log.i("myLog", "getConsentRequest response failure:" + t.toString());

            }
        });
    }


    private void callApiPatch(List<ClinicalNotesRequestPatch.DiagnosisReport> diagnosisReportList, List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasics) {

        Log.i("myLog", "getClinicalNotesRequest");
        ClinicalNotesRequestPatch request = new ClinicalNotesRequestPatch();

//        List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
//        ClinicalNotesRequestPatch.ChiefComplaintsBasic chiefComplaintsBasic = new ClinicalNotesRequestPatch.ChiefComplaintsBasic();
//
//        chiefComplaintsBasic.setId(1);
//        chiefComplaintsBasic.setComplaintName(complaintName.getText().toString());
//        chiefComplaintsBasic.setFilledUsing(filledSave);
//
//        chiefComplaintsBasicList.add(chiefComplaintsBasic);
//        request.setChiefComplaintsBasic(chiefComplaintsBasicList);

        request.setChiefComplaintDetails(new ClinicalNotesRequestPatch.ChiefComplaintDetails());
        request.getChiefComplaintDetails().setId(getChiefCompaintID);
        request.getChiefComplaintDetails().setFilledUsing(filledSave);
        request.getChiefComplaintDetails().setCount(chiefDay.getText().toString());
        request.getChiefComplaintDetails().setDurationLimit(chiefDate.getSelectedItem().toString());
        request.getChiefComplaintDetails().setRemarks(complaintRemarks.getText().toString());

        request.setPastTreatmentHistory(new ClinicalNotesRequestPatch.PastTreatmentHistory());
        request.getPastTreatmentHistory().setId(getPastTreatmentID);
        request.getPastTreatmentHistory().setFilledUsing(filledSave);
        request.getPastTreatmentHistory().setHistory(edtPastTreatment.getText().toString());


        List<ClinicalNotesRequestPatch.PastTreatmentHistoryDoc> pastTreatmentHistoryDocsList = new ArrayList<>();
        ClinicalNotesRequestPatch.PastTreatmentHistoryDoc pastTreatmentHistoryDoc = new ClinicalNotesRequestPatch.PastTreatmentHistoryDoc();

        pastTreatmentHistoryDoc.setId(getPastTreatmentID);
        pastTreatmentHistoryDoc.setFilledUsing(filledSave);
        pastTreatmentHistoryDoc.setDocuments("");

        pastTreatmentHistoryDocsList.add(pastTreatmentHistoryDoc);
        request.setPastTreatmentHistoryDocs(pastTreatmentHistoryDocsList);


        request.setTreatmentAdvice(new ClinicalNotesRequestPatch.TreatmentAdvice());
        request.getTreatmentAdvice().setId(getTreatmentAdviceID);
        request.getTreatmentAdvice().setFilledUsing(filledSave);
        request.getTreatmentAdvice().setAdvice(edtTreatmentAdvice.getText().toString());


        request.setDietPlan(new ClinicalNotesRequestPatch.DietPlan());
        request.getDietPlan().setDietPlan(edtDietPlan.getText().toString());
        request.getDietPlan().setId(getDietPlanID);
        request.getDietPlan().setFilledUsing(filledSave);

        request.setDiagnosisReport(diagnosisReportList);
        request.setChiefComplaintsBasic(chiefComplaintsBasics);

        request.setFollowUp(new ClinicalNotesRequestPatch.FollowUp());
        request.getFollowUp().setDate(followUpDate.getText().toString());
        request.getFollowUp().setCount(followDays.getText().toString());
        request.getFollowUp().setDurationLimit(followWeek.getSelectedItem().toString());
        request.getFollowUp().setRemarks(followUpRemarks.getText().toString());
        if (getFollowUpID != null)
        request.getFollowUp().setId(getFollowUpID);
        else
        request.getFollowUp().setOpd_id(Integer.valueOf(opdId.toString()));
        request.getFollowUp().setFilledUsing(filledSave);


        request.setHospitalId(hospitalId);


        Log.i("myLog", "getClinicalNoesRequest:" + new Gson().toJson(request));
        Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = services.updateClinicalNotesRequest(request);
        call.enqueue(new Callback<ClinicalNotesRequestResponse.ConsentRequestResponsedata>() {

            @Override
            public void onResponse(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Response<ClinicalNotesRequestResponse.ConsentRequestResponsedata> response) {
                try {
                    if (response.body() != null) {
                        ClinicalNotesRequestResponse.ConsentRequestResponsedata resp = response.body();
                        Toast.makeText(getContext(), resp.getMessege(), Toast.LENGTH_SHORT).show();


    //                    filterlayout.setVisibility(View.GONE);
    //                    imgNoData.setVisibility(View.GONE);
    //                    addNew.setVisibility(View.GONE);
    //                    txtNoData.setVisibility(View.GONE);
    //                    lytTab.setVisibility(View.GONE);
    //                    scrollView.setVisibility(View.GONE);
    //                    tblHead.setVisibility(View.VISIBLE);
                        getClinicalNotes("old");


                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {
                Log.i("myLog", "getConsentRequest response failure:" + t.toString());

            }
        });
    }






    public void savePrescription() {
        Log.i("myLog", "savePrescription:");
        if (newMedicineAdapter != null) {
            newMedicineAdapter.getMainList().forEach(prescriptionDetail -> {
                List<PrescriptionDetail> mainList = newMedicineAdapter.getMainList();
                PostPrescriptionRequest request = new PostPrescriptionRequest();
                for (int i = 0; i < mainList.size(); i++) {
                    PrescriptionDetail prescriptionDetails = mainList.get(i);
                    if (!prescriptionDetails.getIsFromApi()) {
                        if (!prescriptionDetails.getMedicineName().isEmpty()) {
                            request.setMedicineName(prescriptionDetail.getMedicineName());
                            request.setFrequency(prescriptionDetail.getFrequency());
                            request.setDosage(prescriptionDetail.getDosage());
                            request.setDurationCount(prescriptionDetail.getDurationCount());
                            request.setDurationLimit(prescriptionDetail.getDurationLimit());
                            request.setQuantity(prescriptionDetail.getQuantity());
                            request.setWhen(prescriptionDetail.getWhen());
                            request.setRemarks(prescriptionDetail.getRemarks());
                            request.setFilledUsing("");
                            if (prescriptionDetail.getId() == null) {
                                request.setOpdId(Integer.parseInt(opdId));
                                request.setHospitalId(hospitalId);

                            } else {
                                request.setId(prescriptionDetail.getId());
                                request.setHospitalId(hospitalId);
//                                editPrescription(request);
                            }
                        }
                    }
                }
                postPrescription(request);
            });
        }
    }

    public void editPrescription(PostPrescriptionRequest request) {
        Log.i("myLog", "editPrescription request:" + new Gson().toJson(request));
        Call<PostPrescriptionResponse> call = services.editPrescription(request);
        call.enqueue(new Callback<PostPrescriptionResponse>() {
            @Override
            public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {

                try {
                    Log.i("mylog", "editPrescription response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        if (response.isSuccessful()) {
                            if (response.body().getStatus().toString().equals("success")) {
                                getPrescription();
                            }
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {
                Log.i("myLog", "savePrescription response failure:" + t.toString());
            }
        });
    }

    public void postPrescription(PostPrescriptionRequest request) {
        Log.i("myLog", "savePrescription request:" + new Gson().toJson(request));
        Call<PostPrescriptionResponse> call = services.postPrescription(request);
        call.enqueue(new Callback<PostPrescriptionResponse>() {
            @Override
            public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {

                try {
                    Log.i("mylog", "savePrescription response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        if (response.isSuccessful()) {
                            if (response.body().getStatus().toString().equals("success")) {
    //                            getPrescription();
                            }
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {
                Log.i("myLog", "savePrescription response failure:" + t.toString());
            }
        });
    }

    private void callPostApi() {
        Log.i("myLog", "callPostApi");
        VitalsRequestResponse request = new VitalsRequestResponse();
        request.setTemperature(temperature.getText().toString());
        request.setPulse(pulse.getText().toString());
        request.setBp(bloodPressure.getText().toString());
        request.setWeight(weight.getText().toString());
        request.setHeight(heightMeasure.getText().toString());
        request.setSpo2(spo.getText().toString());

        Log.i("myLog", "callPostApi request : " + new Gson().toJson(request));
        Call<VitalsRequestResponse> call = services.postVitals(Integer.parseInt(opdId), hospitalId,request);
        call.enqueue(new Callback<VitalsRequestResponse>() {
            @Override
            public void onResponse(Call<VitalsRequestResponse> call, Response<VitalsRequestResponse> response) {

                try {
                    if (response.body() != null) {
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
                Log.i("myLog", "callPostApi response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void addDiagnosis(int index, String checkData, List<GetClinicalNotesResponse.Details.DiagnosisReport> diagnosisReport) {

        if (checkData.equalsIgnoreCase("API")) {
            for (int i = 0; i <= index; i++) {

                String test = diagnosisReport.get(i).getTestCategories();
                String subTest = diagnosisReport.get(i).getSubCategory();

                System.out.println("print logic " + test + " " + subTest);
                final int pos = i;


                linearRowDiagnosis[i] = new LinearLayout(getContext());


                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );


                int topMargin = 16;
                params.setMargins(10, topMargin, 0, 0);


                linearRowDiagnosis[i].setLayoutParams(params);

                linearRowDiagnosis[i].setOrientation(LinearLayout.HORIZONTAL);
                linearRowDiagnosis[i].setWeightSum(5);

                testCategories[i] = new AutoCompleteTextView(getActivity());
                LinearLayout.LayoutParams testCategoryParam = new LinearLayout.LayoutParams(0,
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                testCategoryParam.setMargins(10, 0, 0, 0);
                testCategories[i].setLayoutParams(testCategoryParam);
                testCategories[i].setPadding(0, 0, 0, 0);
                testCategories[i].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
                testCategories[i].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
                testCategories[i].setText(diagnosisReport.get(i).getTestCategories());


                System.out.println("print call data " + CategoriesList);
//                ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(),
//                        android.R.layout.simple_spinner_item, CategoriesList);
//
//                adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//                testCategories[i].setAdapter(adapter);
//                int catIntex = CategoriesList.indexOf(diagnosisReport.get(i).getTestCategories());
//                Log.i("myLog", "URL:" + catIntex);
//                testCategories[i].setSelection(catIntex);
                testCategories[i].setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        String selectedCategory = CategoriesList.get(position);
                        String selectedCategoryID = CategoriesID.get(position);
//                    subCategory[pos].setSelection(0);
                        getSubCategories(selectedCategoryID, pos, subTest);
                    }

                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                        // Handle case when nothing is selected
                    }
                });
                linearRowDiagnosis[i].addView(testCategories[i]);


                subCategory[i] = new AutoCompleteTextView(getActivity());
                LinearLayout.LayoutParams subCategoryParam = new LinearLayout.LayoutParams(0,
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                subCategoryParam.setMargins(20, 0, 0, 0);
                subCategory[i].setLayoutParams(subCategoryParam);
                subCategory[i].setPadding(0, 0, 0, 0);
                subCategory[i].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
                subCategory[i].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
                subCategory[i].setText(diagnosisReport.get(i).getSubCategory());

//                ArrayAdapter<String> subAdapter = new ArrayAdapter<>(getContext(),
//                        android.R.layout.simple_spinner_item, SubCategoriesList);
//                ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getContext(),
//                arrayResId, android.R.layout.simple_spinner_item);
//                subAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//                subCategory[i].setAdapter(subAdapter);
//                subCategory[i].setSelection(0);

                subCategory[i].setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                    @Override
                    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                        // Handle category selection here
//                String selectedCategory = CategoriesList.get(position);
//                String selectedCategoryID = CategoriesID.get(position);
//                getSubCategories(selectedCategoryID);
                    }

                    @Override
                    public void onNothingSelected(AdapterView<?> parent) {
                        // Handle case when nothing is selected
                    }
                });

                linearRowDiagnosis[i].addView(subCategory[i]);


                laboratory[i] = new EditText(getContext());
                LinearLayout.LayoutParams laboratoryParam = new LinearLayout.LayoutParams(0,
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                laboratoryParam.setMargins(20, 0, 0, 0);
                laboratory[i].setLayoutParams(laboratoryParam);
                laboratory[i].setPadding(0, 0, 0, 0);
                laboratory[i].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);

                laboratory[i].setHint("Enter laboratory");
                laboratory[i].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
                laboratory[i].setText(diagnosisReport.get(i).getLaboratory());
                linearRowDiagnosis[i].addView(laboratory[i]);


                remarksDiagnosis[i] = new EditText(getContext());
                LinearLayout.LayoutParams remarksParams = new LinearLayout.LayoutParams(0,
                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
                remarksParams.setMargins(20, 0, 0, 0);
                remarksDiagnosis[i].setLayoutParams(remarksParams);
                remarksDiagnosis[i].setPadding(30, 0, 0, 0);


                remarksDiagnosis[i].setHint("Diagnosis Remarks");
                remarksDiagnosis[i].setText(diagnosisReport.get(i).getRemarks());
                remarksDiagnosis[i].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
                linearRowDiagnosis[i].addView(remarksDiagnosis[i]);


                actionDiagnosis[i] = new ImageView(getContext());
                actionDiagnosis[i].setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1)); // Equal weight to distribute space
                actionDiagnosis[i].setImageResource(R.drawable.delete);
                linearRowDiagnosis[i].addView(actionDiagnosis[i]);


                actionDiagnosis[i].setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        try {
                            getDeleteCategories(diagnosisID.get(pos));
                            currentIndexDiagnosis--;
                            diagnosisSpinner.removeView(linearRowDiagnosis[pos]);
                        } catch (Exception e) {

                        }
                    }
                });

                diagnosisApi.add("API");
                diagnosisSpinner.addView(linearRowDiagnosis[i]);
            }
        } else {
            linearRowDiagnosis[index] = new LinearLayout(getContext());


            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );


            int topMargin = 16;
            params.setMargins(10, topMargin, 0, 0);

            linearRowDiagnosis[index].setLayoutParams(params);

            linearRowDiagnosis[index].setOrientation(LinearLayout.HORIZONTAL);
            linearRowDiagnosis[index].setWeightSum(5);

//            testCategories[index] = new Spinner(getActivity());
            testCategories[index] = new AutoCompleteTextView(getActivity());
            LinearLayout.LayoutParams testCategoryParam = new LinearLayout.LayoutParams(0,
                    LinearLayout.LayoutParams.MATCH_PARENT, 1);
            testCategoryParam.setMargins(10, 0, 0, 0);
            testCategories[index].setLayoutParams(testCategoryParam);
            testCategories[index].setPadding(0, 0, 0, 0);
            testCategories[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
            testCategories[index].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
            testCategories[index].setHint("Test Categories");


            System.out.println("print call data " + CategoriesList);
//            ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(),
//                    android.R.layout.simple_spinner_item, CategoriesList);
//            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//            testCategories[index].setAdapter(adapter);
//            testCategories[index].setSelection(0);
            testCategories[index].addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {
                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {
                  getCategories(testCategories[index].getText().toString(),index);
                }

                @Override
                public void afterTextChanged(Editable s) {

                }
            });

            testCategories[index].setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                    String selectedCategory = CategoriesList.get(position);
                    String selectedCategoryID = CategoriesID.get(position);
//                    subCategory[index].setSelection(0);
                    System.out.println("print intex" + selectedCategoryID);
                    getSubCategories(selectedCategoryID, index, "");
                }

                @Override
                public void onNothingSelected(AdapterView<?> parent) {
                    // Handle case when nothing is selected
                }
            });
            linearRowDiagnosis[index].addView(testCategories[index]);


            subCategory[index] = new AutoCompleteTextView(getActivity());
            LinearLayout.LayoutParams subCategoryParam = new LinearLayout.LayoutParams(0,
                    LinearLayout.LayoutParams.MATCH_PARENT, 1);
            subCategoryParam.setMargins(20, 0, 0, 0);
            subCategory[index].setLayoutParams(subCategoryParam);
            subCategory[index].setPadding(0, 0, 0, 0);
            subCategory[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
            subCategory[index].setHint("Sub Categories");
            subCategory[index].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);

//            ArrayAdapter<String> subAdapter = new ArrayAdapter<>(getContext(),
//                    android.R.layout.simple_spinner_item, SubCategoriesList);
////        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(getContext(),
////                arrayResId, android.R.layout.simple_spinner_item);
//            subAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
//            subCategory[index].setAdapter(subAdapter);
//            subCategory[index].setSelection(0);

            subCategory[index].setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

                }

                @Override
                public void onNothingSelected(AdapterView<?> parent) {
                    // Handle case when nothing is selected
                }
            });

            linearRowDiagnosis[index].addView(subCategory[index]);


            laboratory[index] = new EditText(getContext());
            LinearLayout.LayoutParams laboratoryParam = new LinearLayout.LayoutParams(0,
                    LinearLayout.LayoutParams.MATCH_PARENT, 1);
            laboratoryParam.setMargins(20, 0, 0, 0);
            laboratory[index].setLayoutParams(laboratoryParam);
            laboratory[index].setPadding(0, 0, 0, 0);
            laboratory[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);

            laboratory[index].setHint("Enter laboratory");
            laboratory[index].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
            linearRowDiagnosis[index].addView(laboratory[index]);


            remarksDiagnosis[index] = new EditText(getContext());
            LinearLayout.LayoutParams remarksParams = new LinearLayout.LayoutParams(0,
                    LinearLayout.LayoutParams.MATCH_PARENT, 1);
            remarksParams.setMargins(20, 0, 0, 0);
            remarksDiagnosis[index].setLayoutParams(remarksParams);
            remarksDiagnosis[index].setPadding(30, 0, 0, 0);
//            remarksDiagnosis[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);


            remarksDiagnosis[index].setHint("Diagnosis Remarks");
            remarksDiagnosis[index].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
            linearRowDiagnosis[index].addView(remarksDiagnosis[index]);


            actionDiagnosis[index] = new ImageView(getContext());
            actionDiagnosis[index].setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1)); // Equal weight to distribute space
            actionDiagnosis[index].setImageResource(R.drawable.delete);
            linearRowDiagnosis[index].addView(actionDiagnosis[index]);


            actionDiagnosis[index].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    try {
                        diagnosisSpinner.removeView(linearRowDiagnosis[index]);
                        diagnosisID.remove(index);
                        diagnosisApi.remove(index);
                        currentIndexDiagnosis--;
                    } catch (Exception e) {

                    }

                }
            });
            diagnosisID.add(0);
            diagnosisApi.add("NotAPI");
            diagnosisSpinner.addView(linearRowDiagnosis[index]);
        }

    }



    private void getCategories(String value, int pos) {
        Log.i("mylog", "getCategories opdid:");
        Call<CategoriesResponse> call = services.getCategoriesResponse(value);
        call.enqueue(new Callback<CategoriesResponse>() {

            @Override
            public void onResponse(Call<CategoriesResponse> call, Response<CategoriesResponse> response) {
                try {
                    Log.i("mylog", "getCategories response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        CategoriesResponse resp = response.body();
                        CategoriesList.clear();
                        CategoriesID.clear();
    //                    CategoriesList.add(0, "N/A");
    //                    CategoriesID.add(0, "0");
                        for (int i = 0; i < resp.getDetails().size(); i++) {
                            CategoriesList.add(resp.getDetails().get(i).getDiagnosisTestCategory());
                            CategoriesID.add(resp.getDetails().get(i).getId().toString());
                        }

    //                    getSubCategories("1");
                        ArrayAdapter<String> testcategory = new ArrayAdapter<>(getContext(),
                        android.R.layout.simple_spinner_item, CategoriesList);
                        testcategory.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        testCategories[pos].setAdapter(testcategory);
                        testcategory.notifyDataSetChanged();
                        testCategories[pos].setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                                String selectedItem = testcategory.getItem(position);
                                Log.i("AutoComplete", "Selected item: " + CategoriesID);

                                // Do something with the selected item
                                String selectedCategoryID = CategoriesID.get(position);
                                getSubCategories(selectedCategoryID, pos, "");
                            }
                        });

                        System.out.println("print list " + CategoriesList);
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<CategoriesResponse> call, Throwable t) {
                Log.i("myLog", "getCategories response failure:" + t.toString());

            }
        });
    }

    private void getSuggestions(String search) {
        Log.i("mylog", "getClinicalNotes opdid:" + opdId);
        Call<List<ClinicalSuggestion>> call = services.getClinicalSuggestion(search);
        call.enqueue(new Callback<List<ClinicalSuggestion>>() {

            @Override
            public void onResponse(Call<List<ClinicalSuggestion>> call, Response<List<ClinicalSuggestion>> response) {
                try {
                    Log.i("mylog", "getClinicalNotes response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {

                        List<ClinicalSuggestion> resp = response.body();

                        for (int i = 0; i < resp.size(); i++) {
                            suggestionList.add(resp.get(i).getChiefComplaints());
                        }
                        System.out.println("print suggestion " + suggestionList);
                        updateSuggestions(suggestionList);
                        ArrayList<String> suggestionList1 = new ArrayList<>();
                        for (int i = 0; i < resp.size(); i++) {
                            suggestionList1.add(resp.get(i).getChiefComplaints());
                        }
                        System.out.println("print sug " + suggestionList1);
                        arrayAdapter = new ArrayAdapter<String>(getContext(), android.R.layout.simple_dropdown_item_1line, suggestionList1);
                        complaintName.setAdapter(arrayAdapter);

                        complaintName.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                            @Override
                            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

                                String selectedItem = (String) parent.getItemAtPosition(position);
                                complaintName.setText("");
                                medicineList.add(selectedItem);
                                dataAppan.add("NotApi");
                                medicineID.add(0);
                                complaintName.setHint("");
                                FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(getContext());
                                layoutManager.setFlexWrap(FlexWrap.WRAP); // Allow wrapping
                                layoutManager.setJustifyContent(JustifyContent.FLEX_START); // Align items to the start

                                recyclerViewData.setLayoutManager(layoutManager);

                                medicineListAdapter = new MedicineListAdapter(getContext(), dataAppan, medicineList, medicineID, services, hospitalId);
                                recyclerViewData.setAdapter(medicineListAdapter);

                            }
                        });

    //                    medicineListAdapter.setOnClickListener(new MedicineListAdapter.OnClickListener() {
    //                        @Override
    //                        public void onClick(int position, String option) {
    //                            medicineList.remove(position);
    ////                            medicineListAdapter.notifyDataSetChanged();
    //                        }
    //                    });
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<ClinicalSuggestion>> call, Throwable t) {
                Log.i("myLog", "getClinicalNotes response failure:" + t.toString());

            }
        });
    }

    private void updateSuggestions(List<String> data) {
        suggestionList.clear();
        suggestionList.addAll(data);
//        arrayAdapter.notifyDataSetChanged();
    }

    private void getSubCategories(String subCategoriesID, int pos, String subcatagories) {
        Log.i("mylog", "getSubCategories");
        Call<SubCategoriesResponse> call = services.getSubCategoriesResponse(subCategoriesID);
        call.enqueue(new Callback<SubCategoriesResponse>() {

            @Override
            public void onResponse(Call<SubCategoriesResponse> call, Response<SubCategoriesResponse> response) {
                try {
                    Log.i("mylog", "getSubCategories" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        SubCategoriesResponse resp = response.body();
                        SubCategoriesList.clear();
    //                    SubCategoriesList.add(0, "N/A");
                        for (int i = 0; i < resp.getDetails().size(); i++) {
                            SubCategoriesList.add(resp.getDetails().get(i).getSubCategory());
                        }
    //                    int subIntex = SubCategoriesList.indexOf(subcatagories);
    //                    subCategory[pos].setAdapter(new ArrayAdapter(getContext(), android.R.layout.simple_spinner_item, SubCategoriesList));
    //                    subCategory[pos].setSelection(subIntex);
                        ArrayAdapter<String> subcategory = new ArrayAdapter<>(getContext(),
                                android.R.layout.simple_spinner_item, SubCategoriesList);
                        subcategory.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        subCategory[pos].setAdapter(subcategory);

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<SubCategoriesResponse> call, Throwable t) {
                Log.i("myLog", "getSubCategories" + t.toString());

            }
        });
    }

    private void getDeleteCategories(int value) {
        Log.i("mylog", "getSubCategories");
        Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = services.deleteDiagnosisReport(value, hospitalId);
        call.enqueue(new Callback<ClinicalNotesRequestResponse.ConsentRequestResponsedata>() {

            @Override
            public void onResponse(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Response<ClinicalNotesRequestResponse.ConsentRequestResponsedata> response) {
                Log.i("mylog", "getSubCategories" + new Gson().toJson(response.body()));
                if (response.body() != null) {

                }
            }

            @Override
            public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {
                Log.i("myLog", "getSubCategories" + t.toString());

            }
        });
    }


    private void getClinicalNotes(String dataType) {
        Log.i("mylog", "getClinicalNotes opdid:" + opdId);
        Call<GetClinicalNotesResponse> call = services.getClinicalNotes(opdId, hospitalId);
        call.enqueue(new Callback<GetClinicalNotesResponse>() {

            @Override
            public void onResponse(Call<GetClinicalNotesResponse> call, Response<GetClinicalNotesResponse> response) {
                try {
                    Log.i("mylog", "getClinicalNotes response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {

                        GetClinicalNotesResponse resp = response.body();
                        String status = resp.getStatus();
                        listResp = resp.getDetails();
                        if (resp.getDetails().getChiefComplaintDetails() != null) {
                            pastData = true;
                            APIcallMethod = "patch";
                            if (resp.getDetails().getChiefComplaintsBasic() != null) {
                                APIcallMethod = "patch";
                                medicineList.clear();
                                medicineID.clear();
                                for (int i = 0; i < resp.getDetails().getChiefComplaintsBasic().size(); i++) {
                                    medicineList.add(resp.getDetails().getChiefComplaintsBasic().get(i).getComplaintsName());
                                    medicineID.add(resp.getDetails().getChiefComplaintsBasic().get(i).getId());
                                    dataAppan.add("API");
                                }

                                FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(getContext());
                                layoutManager.setFlexWrap(FlexWrap.WRAP); // Allow wrapping
                                layoutManager.setJustifyContent(JustifyContent.FLEX_START);
                                recyclerViewData.setLayoutManager(layoutManager);
                                medicineListAdapter = new MedicineListAdapter(getContext(), dataAppan, medicineList, medicineID, services, hospitalId);
                                recyclerViewData.setAdapter(medicineListAdapter);
                            }
    //                                    resp.getDetails().getChiefComplaintsBasic().get(0).getComplaintsName();

                            getChiefCompaintID = resp.getDetails().getChiefComplaintDetails().getId();
                            if (resp.getDetails().getPastTreatmentHistory() != null) {
                                getPastTreatmentID = resp.getDetails().getPastTreatmentHistory().getId();
                            }
                            if (resp.getDetails().getTreatmentAdvice() != null) {
                                getTreatmentAdviceID = resp.getDetails().getTreatmentAdvice().getId();
                            }
                            if (resp.getDetails().getDietPlan() != null) {
                                getDietPlanID = resp.getDetails().getDietPlan().getId();
                            }


                            Log.i("mylog", "showData" + resp.getDetails().getChiefComplaintDetails().getId());
                            if (resp.getDetails().getChiefComplaintDetails() != null){
                                complaintRemarks.setText(resp.getDetails().getChiefComplaintDetails().getRemarks());
                            }
                            if (resp.getDetails().getPastTreatmentHistory() != null){
                                edtPastTreatment.setText(resp.getDetails().getPastTreatmentHistory().getHistory());
                            }
                            if (resp.getDetails().getTreatmentAdvice() != null){
                                edtTreatmentAdvice.setText(resp.getDetails().getTreatmentAdvice().getTreatmentAdvice());
                            }
                            if (resp.getDetails().getDietPlan() != null) {
                                edtDietPlan.setText(resp.getDetails().getDietPlan().getDietPlan());
                            }
                            chiefDay.setText(resp.getDetails().getChiefComplaintDetails().getCount());
                            if (resp.getDetails().getFollowUp() != null) {
                                APIcallMethod = "patch";
                                followDays.setText(resp.getDetails().getFollowUp().getCount());
                                String dateString = resp.getDetails().getFollowUp().getDate();
                                getFollowUpID = resp.getDetails().getFollowUp().getId();
                                String date = dateString.substring(0, 10);
                                followUpDate.setText(date);
                                followUpRemarks.setText(resp.getDetails().getFollowUp().getRemarks());
                            }
                            if (dataType.equalsIgnoreCase("New")) {
                                if (resp.getDetails().getDiagnosisReport() != null) {
                                    APIcallMethod = "patch";
                                    System.out.println("print Diagnosis size " + resp.getDetails().getDiagnosisReport().size());
                                    currentIndexDiagnosis = resp.getDetails().getDiagnosisReport().size() - 1;
                                    for (int i = 0; i < resp.getDetails().getDiagnosisReport().size(); i++) {
                                        diagnosisID.add(resp.getDetails().getDiagnosisReport().get(i).getId());
                                    }
                                    addDiagnosis(currentIndexDiagnosis, "API", resp.getDetails().getDiagnosisReport());
                                } else {
                                    currentIndexDiagnosis = 0;
                                    System.out.println("print not api");
                                    addDiagnosis(currentIndexDiagnosis, "NotAPI", null);
                                }
                            }

                        } else {
                            currentIndexDiagnosis = 0;
                            System.out.println("print not api");
                            addDiagnosis(currentIndexDiagnosis, "NotAPI", null);
                        }


                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetClinicalNotesResponse> call, Throwable t) {
                Log.i("myLog", "getClinicalNotes response failure:" + t.toString());

            }
        });
    }


    @OnClick(R.id.follow_up_date)
    public void clickFollowUpDate() {
        setFromDateCalender();
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

                        followUpDate.setText(year + "-" + month + "-" + day);
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        // at last we are calling show to
        // display our date picker dialog.
        c.add(Calendar.DAY_OF_MONTH, 1);
        datePickerDialog.getDatePicker().setMinDate(c.getTimeInMillis());
        datePickerDialog.show();
    }




    public void showConfirmationDialog(int id) {

        Dialog dialogConfirmation = new Dialog(getContext());
        View view = getLayoutInflater().inflate(R.layout.dialog_status_confirmation, null);
        dialogConfirmation.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogConfirmation.getWindow().setGravity(CENTER);
        Button btnNo = dialogConfirmation.findViewById(R.id.btnNo);
        Button btnYes = dialogConfirmation.findViewById(R.id.btnYes);
        TextView txtTitle = dialogConfirmation.findViewById(R.id.txtMessage);
        ImageView imgClose = dialogConfirmation.findViewById(R.id.imgClose);
        txtTitle.setText("Are you sure want to delete this prescription?");

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
                deletePrescription(id, dialogConfirmation);

            }
        });
        dialogConfirmation.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogConfirmation.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(300);
        dialogConfirmation.getWindow().setAttributes(lp);
    }

    public void showConfirmationDialogSave() {

        Dialog dialogConfirmation = new Dialog(getContext());
        View view = getLayoutInflater().inflate(R.layout.dialog_status_confirmation, null);
        dialogConfirmation.setContentView(view);
        dialogConfirmation.getWindow().setGravity(CENTER);
        Button btnNo = dialogConfirmation.findViewById(R.id.btnNo);
        Button btnYes = dialogConfirmation.findViewById(R.id.btnYes);
        TextView txtTitle = dialogConfirmation.findViewById(R.id.txtMessage);
        ImageView imgClose = dialogConfirmation.findViewById(R.id.imgClose);
        txtTitle.setText("Do you want to save");

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
                callPostApi();
                savePrescription();
                saveDataClinicalNotes();
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            scorllView.setVisibility(GONE);
                            lytTextVoice.setVisibility(GONE);
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
                            previewTransaction.replace(R.id.preview_frag_container, previewFragment);
                            previewTransaction.addToBackStack(null);
                            previewTransaction.commit();
                            if (animatedFab.getVisibility() == VISIBLE){
                                animatedFab.setVisibility(GONE);
                            }
                        } catch (Exception ex) {
                            Log.i("myLog", "exception ex:" + ex.toString());
                        }

                    }
                }, 3000);
                dialogConfirmation.dismiss();
            }
        });
        dialogConfirmation.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogConfirmation.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(300);
        dialogConfirmation.getWindow().setAttributes(lp);
    }



    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }


    private void deletePrescription(int id, Dialog dialog) {
        Call<PostPrescriptionResponse> call = services.deletePrescription(id, hospitalId);
        call.enqueue(new Callback<PostPrescriptionResponse>() {
            @Override
            public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {
                try {
                    Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                    getPrescription();
                    dialog.dismiss();
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {

            }
        });

    }

    @OnClick(R.id.text)
    public void clickText() {
        selectedFilling = "Text";
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.appbarColor));
        text.setTextColor(getResources().getColor(R.color.white));
        animatedFab.setVisibility(GONE);
        scorllView.setVisibility(VISIBLE);
        lytCommingSoon.setVisibility(GONE);
    }

    @OnClick(R.id.voice)
    public void clickVoice() {
        selectedFilling = "voice";
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setTextColor(getResources().getColor(R.color.white));
        text.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.appbarColor));
        animatedFab.setVisibility(VISIBLE);
        scorllView.setVisibility(VISIBLE);
        lytCommingSoon.setVisibility(GONE);
    }

    @OnClick(R.id.scribble)
    public void clickScribble() {
        selectedFilling = "Scribble";
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setTextColor(getResources().getColor(R.color.appbarColor));
        text.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.white));
        animatedFab.setVisibility(GONE);
        lytCommingSoon.setVisibility(VISIBLE);
        scorllView.setVisibility(GONE);
    }


}
