package com.plenome.pos.views.appointmentFlow;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;


import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
//import com.arthenica.mobileffmpeg.Config;
//import com.arthenica.mobileffmpeg.FFmpeg;
import com.google.android.flexbox.FlexWrap;
import com.google.android.flexbox.FlexboxLayoutManager;
import com.google.android.flexbox.JustifyContent;
import com.google.gson.Gson;
import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.adapters.MedicineListAdapter;
import com.plenome.pos.model.AbhaUserNameVerifyResponse;
import com.plenome.pos.model.CategoriesResponse;
import com.plenome.pos.model.ClinicalNotesRequestPatch;
import com.plenome.pos.model.ClinicalNotesRequestResponse;
import com.plenome.pos.model.ClinicalSuggestion;
import com.plenome.pos.model.GetClinicalNotesResponse;
import com.plenome.pos.model.PatientPreviewResponse;
import com.plenome.pos.model.PatientPreviewVoiceResponse;
import com.plenome.pos.model.SubCategoriesResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.AudioRecorder;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.ExtendedEditTExt;
import com.plenome.pos.views.OPHubApplication;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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

public class NewClinicalNotesFragment extends Fragment implements View.OnFocusChangeListener {
    private static final Logger log = LoggerFactory.getLogger(NewClinicalNotesFragment.class);
    View rootView;

    RestServices services;

    @BindView(R.id.txt_tap_mic)
    TextView txtTapMic;

    @BindView(R.id.record)
    ImageView record;

    @BindView(R.id.recordstop)
    ImageView recordstop;

    @BindView(R.id.text)
    Button text;

    @BindView(R.id.voice)
    Button voice;

    @BindView(R.id.scribble)
    Button scribble;

    @BindView(R.id.edt_past_treatment)
    ExtendedEditTExt edtPastTreatment;

    @BindView(R.id.edt_treatment_advice)
    ExtendedEditTExt edtTreatmentAdvice;

    @BindView(R.id.edt_diet_plan)
    ExtendedEditTExt edtDietPlan;


    @BindView(R.id.tblHead)
    LinearLayout tblHead;

    @BindView(R.id.linearScribbleDet)
    RelativeLayout linearScribbleDet;

    private Typeface typeface;

    @BindView(R.id.add_new)
    Button addNew;

    @BindView(R.id.lyt_tabs)
    RelativeLayout lytTab;


    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.scrollView)
    ScrollView scrollView;

    @BindView(R.id.save_data)
    Button saveData;

    @BindView(R.id.complaint_name)
    AutoCompleteTextView complaintName;

    @BindView(R.id.recycler_view_data)
    RecyclerView recyclerViewData;

    @BindView(R.id.complaint_remarks)
    ExtendedEditTExt complaintRemarks;

    @BindView(R.id.add_new_diagnosis)
    TextView addNewDiagnosis;

    @BindView(R.id.diagnosis_spinner)
    LinearLayout diagnosisSpinner;

    @BindView(R.id.follow_days)
    ExtendedEditTExt followDays;

    @BindView(R.id.follow_week)
    Spinner followWeek;

    @BindView(R.id.follow_up_date)
    TextView followUpDate;

    @BindView(R.id.follow_up_remarks)
    ExtendedEditTExt followUpRemarks;

    @BindView(R.id.chief_day)
    ExtendedEditTExt chiefDay;

    @BindView(R.id.symtomsEt)
    ExtendedEditTExt symtomsEt;

    @BindView(R.id.chief_date)
    Spinner chiefDate;

    @BindView(R.id.past_document)
    ImageView pastDocument;

    @BindView(R.id.cancel)
    Button cancel;

    @BindView(R.id.tblResponse)
    TableLayout tblResponse;

    @BindView(R.id.animatedFab)
    LottieAnimationView animatedFab;

    private Boolean isRecording = false;
    private AudioRecorder recorder;
    private String filePath;
    private Dialog progressDialog;

    private MedicineListAdapter medicineListAdapter;


    int sizeDiagnosis = 100, currentIndexDiagnosis = 0;
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

    GetClinicalNotesResponse.Details listResp;
    Boolean pastData = false, onPause = true;
    String APIcallMethod = "";

    private LinearLayout.LayoutParams progressBgParam, progressFirstBgParam, progressLastBgParam, progressTxtParam, progressLineParam,
            statusTxtParam, statusNameParam, statusCountParam, statusBgParam, statusBgFirstParam;

    private int width, height;
    TableRow.LayoutParams txtParam, lineParam, imgParam;

    //  AugnitoSpeechAudio augnitoSpeechAudio = null;

    String selectedView = "Past Medical History";
    ExtendedEditTExt selectedEditText = null;
    int CursorPosition = 0, hospitalId;
    String opdId, filledSave = "text";
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

    public static final int REQUEST_AUDIO_PERMISSION_CODE = 1221;

    Integer getChiefCompaintID, getPastTreatmentID, getTreatmentAdviceID, getDietPlanID, getFollowUpID;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_new_clinical_notes, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.clinicalNotes);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        progressDialog = new Dialog(getContext());
        progressDialog.setContentView(R.layout.progress_dialog);
        progressDialog.setCancelable(false);

        hospitalId = OPHubApplication.getHospitalId();
//        Bundle bundle = getArguments();
//        if (bundle != null) {
//            opdId = String.valueOf(bundle.getInt("opdId"));
//        }
        opdId = OPHubApplication.getOPID();


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

//        complaintName.setOnFocusChangeListener(this);
        chiefDay.setOnFocusChangeListener(this);
        followDays.setOnFocusChangeListener(this);
        complaintRemarks.setOnFocusChangeListener(this);
        edtPastTreatment.setOnFocusChangeListener(this);
        edtTreatmentAdvice.setOnFocusChangeListener(this);
        edtDietPlan.setOnFocusChangeListener(this);
        followUpRemarks.setOnFocusChangeListener(this);

        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        initParams();
        showVitals();
//        getCategories();
        getClinicalNotes("New");


        recorder = new AudioRecorder();
        if (!CheckPermissions()) {
            RequestPermissions();
        }

        animatedFab.setOnClickListener(v -> {
            if (!isRecording) {
                if (!CheckPermissions()) {
                    RequestPermissions();
                    return;
                }
                animatedFab.playAnimation();
                isRecording = true;
                recorder.startRecording();
            } else {
                animatedFab.cancelAnimation();
                animatedFab.setProgress(0);
                isRecording = false;
                filePath = recorder.getFilePath();
                recorder.stopRecording();
                System.out.println("filepath::" + filePath);
                if (filePath != null) {
                    progressDialog.show();
//                    trimAudio(filePath);
                    uploadAudioFile();
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

        complaintName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                complaintName.showDropDown();

            }
        });


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

        if (!CheckPermissions()) {
            RequestPermissions();
        }

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

        return rootView;
    }


    public void trimAudio(String filePath) {

        String outputDir = "/storage/emulated/0/Download/splitfile/" + opdId;
        File dir = new File(outputDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String outputPattern = outputDir + "/output_chunk_%03d.wav";
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

    //    public static ArrayList<File> getFilesFromDirectory(String directoryPath) {
//        ArrayList<File> fileList = new ArrayList<>();
//        File directory = new File(directoryPath);
//
//        // Check if directory exists and is a directory
//        if (directory.exists() && directory.isDirectory()) {
//            File[] files = directory.listFiles();
//
//            if (files != null) {
//                for (File file : files) {
//                    if (file.isFile()) { // Only add files, not subdirectories
//                        fileList.add(file);
//                    }
//                }
//            }
//        }
//        return fileList;
//    }
    public ArrayList<File> getFilesFromDirectory(String directoryPath) {
        File directory = new File(directoryPath);
        File[] files = directory.listFiles((dir, name) -> name.endsWith(".wav")); // filter .wav files
        return files != null ? new ArrayList<>(Arrays.asList(files)) : new ArrayList<>();
    }


    private void uploadAudioFile() {
        String BASE_URL = BuildConfig.BASE_URL + "stt-translate-sarvam/job/upload-file-as-batch";

        int CONNECT_TIMEOUT = 60; // seconds
        int READ_TIMEOUT = 60;    // seconds
        int WRITE_TIMEOUT = 60;   // seconds

        // Logging interceptor
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS)
                .readTimeout(READ_TIMEOUT, TimeUnit.SECONDS)
                .writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS)
                .retryOnConnectionFailure(true)  // Enable retries
                .addInterceptor(logging)
                .build();

        // Full path to the internal storage file
        // File file = new File(getContext().getFilesDir(), "audio/audio_record.wav");
        File file = new File(Environment.getExternalStorageDirectory(), "Plenome_OPHub/audio_record.wav");


        if (!file.exists()) {
            Toast.makeText(getContext(), "WAV file not found", Toast.LENGTH_SHORT).show();
            Log.e("uploadAudioFile", "File not found: " + file.getAbsolutePath());
            return;
        }

        // Create the multipart request body
        MultipartBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("opd_id", opdId)
                .addFormDataPart("hospital_id", String.valueOf(hospitalId))
                .addFormDataPart("files", file.getName(),
                        RequestBody.create(MediaType.parse("audio/wav"), file))
                .build();

        // Build the HTTP request
        Request request = new Request.Builder()
                .url(BASE_URL)
                .post(requestBody)
                .build();

        Log.d("uploadAudioFile", "Sending file: " + file.getAbsolutePath());

        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onResponse(@NonNull okhttp3.Call call, @NonNull okhttp3.Response response) throws IOException {
                if (response.isSuccessful()) {
                    String responseBody = response.body().string();
                    Log.d("uploadAudioFile", "Upload successful: " + responseBody);

                    final Handler handler = new Handler(Looper.getMainLooper());
                    handler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            getVoiceData();
                        }
                    }, 26000);



                } else {
                    new Handler(Looper.getMainLooper()).post(() -> {
                        Toast.makeText(getContext(), "Upload failed: Server error", Toast.LENGTH_SHORT).show();
                        progressDialog.dismiss();
                    });
                }
            }

            @Override
            public void onFailure(@NonNull okhttp3.Call call, @NonNull IOException e) {
                Log.e("uploadAudioFile", "Upload failed", e);
                new Handler(Looper.getMainLooper()).post(() -> {
                    Toast.makeText(getContext(), "Upload failed: Network error", Toast.LENGTH_SHORT).show();
                    progressDialog.dismiss();
                });
            }
        });
    }




    private void getVoiceData() {
        Map<String, Object> params = new HashMap<>();
        params.put("hospital_id", String.valueOf(hospitalId));
        params.put("opd_id", opdId);
        Log.i("mylog", "VoicePostDataRequest" + new Gson().toJson(params));

        Call<PatientPreviewVoiceResponse> call = services.getClinicalData(params);
        call.enqueue(new Callback<PatientPreviewVoiceResponse>() {
            @Override
            public void onResponse(Call<PatientPreviewVoiceResponse> call, Response<PatientPreviewVoiceResponse> response) {
                try {
                    //log.i("mylog", "otpVerification response:" + new Gson().toJson(response.body()));
                    System.out.println("checkVoiceRes------->"+response.raw());
                    Log.i("mylog", "VoicePostDataresponse" + new Gson().toJson(response.body()));

                    progressDialog.dismiss();
                    PatientPreviewVoiceResponse apiResponse = response.body();
                    if (response.isSuccessful()) {
                        if (response.body() != null) {
                            getClinicalNotesVoice("New");
                            //                        setVoiceData(apiResponse);
                            //
                            //
                            ////                        if (apiResponse.getDetails().getClinicalNotes().get() != null) {
                            ////                            if (apiResponse.getDetails().getClinicalNotes().getPastTreatmentHistory().getHistory() != null) {
                            ////                                edtPastTreatment.setText(apiResponse.getDetails().getClinicalNotes().getPastTreatmentHistory().getHistory().toString());
                            ////                            }
                            ////                        }
                            //                        if (apiResponse.getDetails().getClinicalNotes().getTreatmentAdvice() != null) {
                            //                            if (apiResponse.getDetails().getClinicalNotes().getTreatmentAdvice().getTreatmentAdvice() != null) {
                            //                                edtTreatmentAdvice.setText(apiResponse.getDetails().getClinicalNotes().getTreatmentAdvice().getTreatmentAdvice().toString());
                            //                            }
                            //                        }
                            //
                            //                        if (apiResponse.getDetails().getClinicalNotes().getDietPlan() != null) {
                            //                            if (apiResponse.getDetails().getClinicalNotes().getDietPlan().getDietPlan() != null) {
                            //                                edtDietPlan.setText(apiResponse.getDetails().getClinicalNotes().getDietPlan().getDietPlan().toString());
                            //                            }
                            //                        }
                            //
                            //                        if (apiResponse.getDetails().getClinicalNotes().getFollowUp() != null) {
                            //                            followDays.setText(apiResponse.getDetails().getClinicalNotes().getFollowUp().getCount());
                            //                            followUpRemarks.setText(apiResponse.getDetails().getClinicalNotes().getFollowUp().getRemarks());
                            //                            followUpDate.setText(apiResponse.getDetails().getClinicalNotes().getFollowUp().getDate());
                            //                        }
                            //
                            //
                            ////                        if (apiResponse.getDetails().getClinicalNotes().getDiagnosisReport() != null) {
                            ////                            APIcallMethod = "patch";
                            ////                            System.out.println("print Diagnosis size " + apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().size());
                            ////                            currentIndexDiagnosis = apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().size() - 1;
                            ////                            for (int i = 0; i < apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().size(); i++) {
                            ////                                diagnosisID.add(apiResponse.getDetails().getClinicalNotes().getDiagnosisReport().get(i).getId());
                            ////                            }
                            ////
                            ////                            addDiagnosis(currentIndexDiagnosis, "API", apiResponse.getDetails().getClinicalNotes().getDiagnosisReport());
                            ////                        }
                        }
                    } else {


                    }
                } catch (Exception e) {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<PatientPreviewVoiceResponse> call, Throwable t) {
                //log.i("myLog", "otpVerification response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getContext());
                progressDialog.dismiss();
            }
        });
    }

    private void getClinicalNotesVoice(String dataType) {
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
                        System.out.println("print api call" + diagnosisApi);
                        if (resp.getDetails().getChiefComplaintDetails() != null) {
                            pastData = true;

                            tblHead.setVisibility(View.GONE);
                            tblResponse.setVisibility(View.GONE);
                            scrollView.setVisibility(View.VISIBLE);
                            lytTab.setVisibility(View.VISIBLE);


                            if (resp.getDetails().getChiefComplaintsBasic() != null) {
                                medicineList.clear();
                                medicineID.clear();
                                dataAppan.clear();
                                for (int i = 0; i < resp.getDetails().getChiefComplaintsBasic().size(); i++) {
                                    medicineList.add(resp.getDetails().getChiefComplaintsBasic().get(i).getComplaintsName());
                                    medicineID.add(resp.getDetails().getChiefComplaintsBasic().get(i).getId());
                                    dataAppan.add("API");
                                }

                                //                            FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(getContext());
                                //                            layoutManager.setFlexWrap(FlexWrap.WRAP); // Allow wrapping
                                //                            layoutManager.setJustifyContent(JustifyContent.FLEX_START);
                                //                            recyclerViewData.setLayoutManager(layoutManager);
                                //                            medicineListAdapter = new MedicineListAdapter(getContext(), dataAppan, medicineList, medicineID, services, hospitalId);
                                //                            recyclerViewData.setAdapter(medicineListAdapter);
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

                            if (resp.getDetails().getChiefComplaintsBasic() != null) {

                                symtomsEt.setText(resp.getDetails().getChiefComplaintsBasic().get(0).getComplaintsName());

                            }


                            Log.i("mylog", "showData" + resp.getDetails().getChiefComplaintDetails().getId());
                            showData(resp.getDetails().getOpdDetails().getOpdNo(), resp.getDetails().getOpdDetails().getDate(), resp.getDetails().getOpdDetails().getConsultant());
                            if (resp.getDetails().getChiefComplaintDetails() != null) {
                                complaintRemarks.setText(resp.getDetails().getChiefComplaintDetails().getRemarks());
                            }
                            if (resp.getDetails().getPastTreatmentHistory() != null) {
                                edtPastTreatment.setText(resp.getDetails().getPastTreatmentHistory().getHistory());
                            }
                            if (resp.getDetails().getTreatmentAdvice() != null) {
                                edtTreatmentAdvice.setText(resp.getDetails().getTreatmentAdvice().getTreatmentAdvice());
                            }
                            if (resp.getDetails().getDietPlan() != null) {
                                edtDietPlan.setText(resp.getDetails().getDietPlan().getDietPlan());
                            }
                            chiefDay.setText(resp.getDetails().getChiefComplaintDetails().getCount());
                            if (resp.getDetails().getFollowUp() != null) {
                                followDays.setText(resp.getDetails().getFollowUp().getCount());
                                String dateString = resp.getDetails().getFollowUp().getDate();
                                getFollowUpID = resp.getDetails().getFollowUp().getId();
                                String date = dateString.substring(0, 10);
                                followUpDate.setText(date);
                                followUpRemarks.setText(resp.getDetails().getFollowUp().getRemarks());
                            }
                            if (dataType.equalsIgnoreCase("New")) {
                                if (resp.getDetails().getDiagnosisReport() != null) {

                                    currentIndexDiagnosis = resp.getDetails().getDiagnosisReport().size() - 1;
                                    for (int i = 0; i < resp.getDetails().getDiagnosisReport().size(); i++) {
                                        diagnosisID.add(resp.getDetails().getDiagnosisReport().get(i).getId());
                                    }
                                    addDiagnosis(currentIndexDiagnosis, "API", resp.getDetails().getDiagnosisReport());
                                } else {
                                    currentIndexDiagnosis = 0;

                                    addDiagnosis(currentIndexDiagnosis, "NotAPI", null);
                                }
                            }

                        } else {
                            imgNoData.setVisibility(View.VISIBLE);
                            txtNoData.setVisibility(View.VISIBLE);
                            addNew.setVisibility(View.VISIBLE);
                            scrollView.setVisibility(View.GONE);
                            lytTab.setVisibility(View.GONE);
                            currentIndexDiagnosis = 0;

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


    private boolean isAudioFileDurationValid(String outputPattern) {
        MediaPlayer mediaPlayer = new MediaPlayer();
        try {
            mediaPlayer.setDataSource(outputPattern);
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


    public void setVoiceData(PatientPreviewVoiceResponse apiResponse) {

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
                        System.out.println("print api call" + diagnosisApi);
                        if (resp.getDetails().getChiefComplaintDetails() != null) {
                            pastData = true;

                            tblHead.setVisibility(View.VISIBLE);
                            tblResponse.setVisibility(View.VISIBLE);
                            imgNoData.setVisibility(View.GONE);
                            txtNoData.setVisibility(View.GONE);
                            addNew.setVisibility(View.GONE);
                            scrollView.setVisibility(View.GONE);
                            lytTab.setVisibility(View.GONE);


                            if (resp.getDetails().getChiefComplaintsBasic() != null) {
                                medicineList.clear();
                                medicineID.clear();
                                dataAppan.clear();
                                for (int i = 0; i < resp.getDetails().getChiefComplaintsBasic().size(); i++) {
                                    medicineList.add(resp.getDetails().getChiefComplaintsBasic().get(i).getComplaintsName());
                                    medicineID.add(resp.getDetails().getChiefComplaintsBasic().get(i).getId());
                                    dataAppan.add("API");
                                }

                                //                            FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(getContext());
                                //                            layoutManager.setFlexWrap(FlexWrap.WRAP); // Allow wrapping
                                //                            layoutManager.setJustifyContent(JustifyContent.FLEX_START);
                                //                            recyclerViewData.setLayoutManager(layoutManager);
                                //                            medicineListAdapter = new MedicineListAdapter(getContext(), dataAppan, medicineList, medicineID, services, hospitalId);
                                //                            recyclerViewData.setAdapter(medicineListAdapter);
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

                            if (resp.getDetails().getChiefComplaintsBasic() != null) {
                                symtomsEt.setText(resp.getDetails().getChiefComplaintsBasic().get(0).getComplaintsName());
                            }


                            Log.i("mylog", "showData" + resp.getDetails().getChiefComplaintDetails().getId());
                            showData(resp.getDetails().getOpdDetails().getOpdNo(), resp.getDetails().getOpdDetails().getDate(), resp.getDetails().getOpdDetails().getConsultant());
                            if (resp.getDetails().getChiefComplaintDetails() != null) {
                                complaintRemarks.setText(resp.getDetails().getChiefComplaintDetails().getRemarks());
                            }
                            if (resp.getDetails().getPastTreatmentHistory() != null) {
                                edtPastTreatment.setText(resp.getDetails().getPastTreatmentHistory().getHistory());
                            }
                            if (resp.getDetails().getTreatmentAdvice() != null) {
                                edtTreatmentAdvice.setText(resp.getDetails().getTreatmentAdvice().getTreatmentAdvice());
                            }
                            if (resp.getDetails().getDietPlan() != null) {
                                edtDietPlan.setText(resp.getDetails().getDietPlan().getDietPlan());
                            }
                            chiefDay.setText(resp.getDetails().getChiefComplaintDetails().getCount());
                            if (resp.getDetails().getFollowUp() != null) {
                                followDays.setText(resp.getDetails().getFollowUp().getCount());
                                String dateString = resp.getDetails().getFollowUp().getDate();
                                getFollowUpID = resp.getDetails().getFollowUp().getId();
                                String date = dateString.substring(0, 10);
                                followUpDate.setText(date);
                                followUpRemarks.setText(resp.getDetails().getFollowUp().getRemarks());
                            }
                            if (dataType.equalsIgnoreCase("New")) {
                                if (resp.getDetails().getDiagnosisReport() != null) {

                                    currentIndexDiagnosis = resp.getDetails().getDiagnosisReport().size() - 1;
                                    for (int i = 0; i < resp.getDetails().getDiagnosisReport().size(); i++) {
                                        System.out.println("print id : " +resp.getDetails().getDiagnosisReport().get(i).getId() );
                                        diagnosisID.add(resp.getDetails().getDiagnosisReport().get(i).getId());
                                        System.out.println();
                                    }
                                    addDiagnosis(currentIndexDiagnosis, "API", resp.getDetails().getDiagnosisReport());
                                } else {
                                    currentIndexDiagnosis = 0;

                                    addDiagnosis(currentIndexDiagnosis, "NotAPI", null);
                                }
                            }

                        } else {
                            imgNoData.setVisibility(View.VISIBLE);
                            txtNoData.setVisibility(View.VISIBLE);
                            addNew.setVisibility(View.VISIBLE);
                            scrollView.setVisibility(View.GONE);
                            lytTab.setVisibility(View.GONE);
                            currentIndexDiagnosis = 0;

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

    private void getClinicalNotes1(String dataType) {
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
                        System.out.println("print api call" + diagnosisApi);
                        if (resp.getDetails().getChiefComplaintDetails() != null) {
                            pastData = true;



                            if (resp.getDetails().getChiefComplaintsBasic() != null) {
                                medicineList.clear();
                                medicineID.clear();
                                dataAppan.clear();
                                for (int i = 0; i < resp.getDetails().getChiefComplaintsBasic().size(); i++) {
                                    medicineList.add(resp.getDetails().getChiefComplaintsBasic().get(i).getComplaintsName());
                                    medicineID.add(resp.getDetails().getChiefComplaintsBasic().get(i).getId());
                                    dataAppan.add("API");
                                }

                                //                            FlexboxLayoutManager layoutManager = new FlexboxLayoutManager(getContext());
                                //                            layoutManager.setFlexWrap(FlexWrap.WRAP); // Allow wrapping
                                //                            layoutManager.setJustifyContent(JustifyContent.FLEX_START);
                                //                            recyclerViewData.setLayoutManager(layoutManager);
                                //                            medicineListAdapter = new MedicineListAdapter(getContext(), dataAppan, medicineList, medicineID, services, hospitalId);
                                //                            recyclerViewData.setAdapter(medicineListAdapter);
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
                            showData(resp.getDetails().getOpdDetails().getOpdNo(), resp.getDetails().getOpdDetails().getDate(), resp.getDetails().getOpdDetails().getConsultant());
                            if (resp.getDetails().getChiefComplaintDetails() != null) {
                                complaintRemarks.setText(resp.getDetails().getChiefComplaintDetails().getRemarks());
                            }
                            if (resp.getDetails().getPastTreatmentHistory() != null) {
                                edtPastTreatment.setText(resp.getDetails().getPastTreatmentHistory().getHistory());
                            }
                            if (resp.getDetails().getTreatmentAdvice() != null) {
                                edtTreatmentAdvice.setText(resp.getDetails().getTreatmentAdvice().getTreatmentAdvice());
                            }
                            if (resp.getDetails().getDietPlan() != null) {
                                edtDietPlan.setText(resp.getDetails().getDietPlan().getDietPlan());
                            }
                            chiefDay.setText(resp.getDetails().getChiefComplaintDetails().getCount());
                            if (resp.getDetails().getFollowUp() != null) {
                                followDays.setText(resp.getDetails().getFollowUp().getCount());
                                String dateString = resp.getDetails().getFollowUp().getDate();
                                getFollowUpID = resp.getDetails().getFollowUp().getId();
                                String date = dateString.substring(0, 10);
                                followUpDate.setText(date);
                                followUpRemarks.setText(resp.getDetails().getFollowUp().getRemarks());
                            }
                            if (dataType.equalsIgnoreCase("New")) {
                                if (resp.getDetails().getDiagnosisReport() != null) {

                                    currentIndexDiagnosis = resp.getDetails().getDiagnosisReport().size() - 1;
                                    for (int i = 0; i < resp.getDetails().getDiagnosisReport().size(); i++) {
                                        diagnosisID.add(resp.getDetails().getDiagnosisReport().get(i).getId());
                                    }
                                    addDiagnosis(currentIndexDiagnosis, "API", resp.getDetails().getDiagnosisReport());
                                } else {
                                    currentIndexDiagnosis = 0;

                                    addDiagnosis(currentIndexDiagnosis, "NotAPI", null);
                                }
                            }

                        } else {
                            imgNoData.setVisibility(View.VISIBLE);
                            txtNoData.setVisibility(View.VISIBLE);
                            addNew.setVisibility(View.VISIBLE);
                            scrollView.setVisibility(View.GONE);
                            lytTab.setVisibility(View.GONE);
                            currentIndexDiagnosis = 0;

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

                        updateSuggestions(suggestionList);
                        ArrayList<String> suggestionList1 = new ArrayList<>();
                        for (int i = 0; i < resp.size(); i++) {
                            suggestionList1.add(resp.get(i).getChiefComplaints());
                        }

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

    private void showData(String opNoData, String dateTime, String consultantData) {

        Log.i("mylog", "showData");
        tblResponse.removeAllViews();
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
                APIcallMethod = "patch";
                tblHead.setVisibility(View.GONE);
                tblResponse.setVisibility(View.GONE);
                scrollView.setVisibility(View.VISIBLE);
                lytTab.setVisibility(View.VISIBLE);

                for (int i = 0; i < diagnosisApi.size(); i++) {
                    diagnosisApi.set(i, "API");

                }

            }
        });


        tblResponse.addView(tr);


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
                try {
                    Log.i("mylog", "getSubCategories" + new Gson().toJson(response.body()));
                    if (response.body() != null) {

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {
                Log.i("myLog", "getSubCategories" + t.toString());

            }
        });
    }

    private void showVitals() {

        TableRow trTitle = new TableRow(getActivity());

        TextView txtCreatedBy = new TextView(getActivity());
        txtCreatedBy.setText(R.string.slNo);
        txtCreatedBy.setTextColor(Color.WHITE);
        txtCreatedBy.setTypeface(typeface);
        txtCreatedBy.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtCreatedBy.setGravity(Gravity.CENTER);
        trTitle.addView(txtCreatedBy, txtParam);

        TextView txtCreatedDate = new TextView(getActivity());
        txtCreatedDate.setText(R.string.opd_no);
        txtCreatedDate.setTextColor(Color.WHITE);
        txtCreatedDate.setTypeface(typeface);
        txtCreatedDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtCreatedDate.setGravity(Gravity.CENTER);
        trTitle.addView(txtCreatedDate, txtParam);

        TextView txtRepairNotes = new TextView(getActivity());
        txtRepairNotes.setText(R.string.date_time);
        txtRepairNotes.setTextColor(Color.WHITE);
        txtRepairNotes.setTypeface(typeface);
        txtRepairNotes.setGravity(Gravity.CENTER);
        txtRepairNotes.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        trTitle.addView(txtRepairNotes, txtParam);

        TextView txtApptDateHead = new TextView(getActivity());
        txtApptDateHead.setText(R.string.consultant);
        txtApptDateHead.setTextColor(Color.WHITE);
        txtApptDateHead.setTypeface(typeface);
        txtApptDateHead.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtApptDateHead.setGravity(Gravity.CENTER);
        trTitle.addView(txtApptDateHead, txtParam);


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

    @OnClick(R.id.text)
    public void clickText() {
        filledSave = "text";
        txtTapMic.setVisibility(View.GONE);
        record.setVisibility(View.GONE);
        recordstop.setVisibility(View.GONE);
        linearScribbleDet.setVisibility(View.GONE);
        scrollView.setVisibility(View.VISIBLE);
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.appbarColor));
        text.setTextColor(getResources().getColor(R.color.white));

    }

    @OnClick(R.id.voice)
    public void clickVoice() {
        filledSave = "voice";
        txtTapMic.setVisibility(View.VISIBLE);
        record.setVisibility(View.VISIBLE);
        recordstop.setVisibility(View.GONE);
        linearScribbleDet.setVisibility(View.GONE);
        scrollView.setVisibility(View.VISIBLE);
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setTextColor(getResources().getColor(R.color.white));
        text.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);

    }

    @OnClick(R.id.scribble)
    public void clickScribble() {

        txtTapMic.setVisibility(View.GONE);
        record.setVisibility(View.GONE);
        recordstop.setVisibility(View.GONE);
        linearScribbleDet.setVisibility(View.VISIBLE);
        scrollView.setVisibility(View.GONE);
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setTextColor(getResources().getColor(R.color.appbarColor));
        text.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.white));

    }

    @OnClick(R.id.add_new)
    public void addNew() {
        APIcallMethod = "post";
        tblHead.setVisibility(View.GONE);
        imgNoData.setVisibility(View.GONE);
        addNew.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        lytTab.setVisibility(View.VISIBLE);
        scrollView.setVisibility(View.VISIBLE);


    }

    @OnClick(R.id.cancel)
    public void cancel() {
        scrollView.setVisibility(View.GONE);
        lytTab.setVisibility(View.GONE);
        tblHead.setVisibility(View.VISIBLE);
        if (pastData) {
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
            addNew.setVisibility(View.GONE);
            tblResponse.setVisibility(View.VISIBLE);
        } else {
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            addNew.setVisibility(View.VISIBLE);
        }


    }

    @OnClick(R.id.follow_up_date)
    public void clickFollowUpDate() {
        setFromDateCalender();
    }

//    @OnClick(R.id.save_data)
//    public void saveData() {
//
//
//
//
//        if (APIcallMethod.equalsIgnoreCase("post")) {
//            testCategoriesList.clear();
//            subCategoryList.clear();
//            laboratoryList.clear();
//            remarksList.clear();
//            Log.i("myLog", "currentIndexDiagnosis:" + currentIndexDiagnosis);
//            Log.i("myLog", "testCategories :" + testCategories);
//
//            try {
//                for (int i = 0; i <= currentIndexDiagnosis; i++) {
//                    Log.i("myLog", "for index:" + i);
//                    String testCategory = testCategories[i].getText().toString();
//                    String subCategoryValue = subCategory[i].getText().toString();
//                    String laboratoryValue = laboratory[i].getText().toString();
//                    String remarks = remarksDiagnosis[i].getText().toString();
//
//                    testCategoriesList.add(testCategory);
//                    subCategoryList.add(subCategoryValue);
//                    laboratoryList.add(laboratoryValue);
//                    remarksList.add(remarks);
//                    opdID.add(opdId);
//                    filledUsing.add("text");
//                }
//            } catch (Exception e) {
//                System.out.println("print exception  " + e);
//            }
//
//            List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList = new ArrayList<>();
//
//            Integer size = testCategoriesList.size();
//
//            for (int i = 0; i < size; i++) {
//                ClinicalNotesRequestResponse.DiagnosisReport diagnosisReport = new ClinicalNotesRequestResponse.DiagnosisReport();
//                diagnosisReport.setTestCategories(testCategoriesList.get(i));
//                diagnosisReport.setSubCategory(subCategoryList.get(i));
//                diagnosisReport.setLaboratory(laboratoryList.get(i));
//                diagnosisReport.setRemarks(remarksList.get(i));
//                diagnosisReport.setOpdId(Integer.valueOf(opdID.get(i)));
//                diagnosisReport.setFilledUsing(filledUsing.get(i));
//                diagnosisReportList.add(diagnosisReport);
//            }
//
//            for (int i = 0; i < medicineList.size(); i++) {
//                opdIDcomplaint.add(opdId);
//                complaintFilling.add("text");
//            }
//
//            List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
//
//            Integer size1 = medicineList.size();
//           // for (int i = 0; i < size1; i++) {
////                ClinicalNotesRequestResponse.ChiefComplaintsBasic medicine = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();
////                medicine.setComplaintName(medicineList.get(i));
////                medicine.setOpdId(Integer.valueOf(opdIDcomplaint.get(i)));
////                medicine.setFilledUsing(complaintFilling.get(i));
////                chiefComplaintsBasicList.add(medicine);
//         //   }
//
//            ClinicalNotesRequestResponse.ChiefComplaintsBasic medicine = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();
//            medicine.setComplaintName(symtomsEt.getText().toString());
//            medicine.setOpdId(Integer.valueOf(opdId));
//            medicine.setFilledUsing("text");
//            chiefComplaintsBasicList.add(medicine);
//
//
//            Log.i("myLog", "getConsentRequest:" + new Gson().toJson(diagnosisReportList));
//            Log.i("myLog", "getMedicineList :" + new Gson().toJson(chiefComplaintsBasicList));
//
//
//            callApiPost(diagnosisReportList, chiefComplaintsBasicList);
//            System.out.println("this from voice patch If");
//        } else {
//            System.out.println("this from voice patch else");
//            testCategoriesList.clear();
//            subCategoryList.clear();
//            laboratoryList.clear();
//            remarksList.clear();
//            Log.i("myLog", "currentIndexDiagnosis:" + currentIndexDiagnosis);
//            Log.i("myLog", "testCategories :" + testCategories);
//
//            try {
//                for (int i = 0; i <= currentIndexDiagnosis; i++) {
//                    Log.i("myLog", "for index:" + i);
//
//                    if (testCategories[i] != null) {
//                        String testCategory = testCategories[i].getText().toString();
//                        String subCategoryValue = subCategory[i].getText().toString();
//                        String laboratoryValue = laboratory[i].getText().toString();
//                        String remarks = remarksDiagnosis[i].getText().toString();
//
//                        testCategoriesList.add(testCategory);
//                        subCategoryList.add(subCategoryValue);
//                        laboratoryList.add(laboratoryValue);
//                        remarksList.add(remarks);
//                        opdID.add(opdId);
//                        filledUsing.add("text");
//
//                    } else {
//                        currentIndexDiagnosis++;
//                    }
//                }
//            } catch (Exception e) {
//                System.out.println("print exception  " + e);
//            }
//
//            List<ClinicalNotesRequestPatch.DiagnosisReport> diagnosisReportList = new ArrayList<>();
//
//            Integer size = testCategoriesList.size();
//
//            for (int i = 0; i < size; i++) {
//                ClinicalNotesRequestPatch.DiagnosisReport diagnosisReport = new ClinicalNotesRequestPatch.DiagnosisReport();
//                diagnosisReport.setTestCategories(testCategoriesList.get(i));
//                diagnosisReport.setSubCategory(subCategoryList.get(i));
//                diagnosisReport.setLaboratory(laboratoryList.get(i));
//                diagnosisReport.setRemarks(remarksList.get(i));
//                System.out.println("print diagnosis " + diagnosisApi.get(i));
//                    diagnosisReport.setId((diagnosisID.get(i)));
//                    diagnosisReport.setOpd_id(Integer.valueOf(opdID.get(i)));
//
//                diagnosisReport.setFilledUsing(filledUsing.get(i));
//                diagnosisReportList.add(diagnosisReport);
//            }
//
//            for (int i = 0; i < medicineList.size(); i++) {
//                opdIDcomplaint.add(opdId);
//                complaintFilling.add("text");
//            }
//
//            List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasicList = null;
//            try {
//                chiefComplaintsBasicList = new ArrayList<>();
//
//                Integer size1 = medicineList.size();
    ////            for (int i = 0; i < size1; i++) {
    ////                ClinicalNotesRequestPatch.ChiefComplaintsBasic medicine = new ClinicalNotesRequestPatch.ChiefComplaintsBasic();
    ////                medicine.setComplaintName(medicineList.get(i));
    ////                Log.i("myLog", "for message" + dataAppan.get(i));
    ////                if (dataAppan.get(i).equalsIgnoreCase("API")) {
    ////                    medicine.setId((medicineID.get(i)));
    ////                } else {
    ////                    medicine.setOpd_id(Integer.valueOf(opdId));
    ////                }
    ////                medicine.setFilledUsing(complaintFilling.get(i));
    ////                chiefComplaintsBasicList.add(medicine);
    ////            }
//                ClinicalNotesRequestPatch.ChiefComplaintsBasic medicine = new ClinicalNotesRequestPatch.ChiefComplaintsBasic();
//                medicine.setComplaintName(symtomsEt.getText().toString());
//
//
//                if(medicineID.size()>0)
//                 medicine.setId((medicineID.get(0)));
//                medicine.setOpd_id(Integer.valueOf(opdId));
//
//                // medicine.setOpd_id(Integer.valueOf(opdId));
//                medicine.setFilledUsing("text");
//                chiefComplaintsBasicList.add(medicine);
//            } catch (Exception e) {
//
//            }
//
//
//            Log.i("myLog", "getConsentRequest:" + new Gson().toJson(diagnosisReportList));
//            Log.i("myLog", "getMedicineList :" + new Gson().toJson(chiefComplaintsBasicList));
//
//
//            callApiPatch(diagnosisReportList, chiefComplaintsBasicList);
//        }
//    }

    @OnClick(R.id.save_data)
    public void saveData() {
        onPause = false;

        if (APIcallMethod.equalsIgnoreCase("post")) {
            testCategoriesList.clear();
            subCategoryList.clear();
            laboratoryList.clear();
            remarksList.clear();

            try {
                for (int i = 0; i <= currentIndexDiagnosis; i++) {
                    boolean isAnyFieldFilled =
                            !testCategories[i].getText().toString().trim().isEmpty() ||
                                    !subCategory[i].getText().toString().trim().isEmpty() ||
                                    !laboratory[i].getText().toString().trim().isEmpty() ||
                                    !remarksDiagnosis[i].getText().toString().trim().isEmpty();

                    if (isAnyFieldFilled) {
                        testCategoriesList.add(testCategories[i].getText().toString());
                        subCategoryList.add(subCategory[i].getText().toString());
                        laboratoryList.add(laboratory[i].getText().toString());
                        remarksList.add(remarksDiagnosis[i].getText().toString());
                        opdID.add(opdId);
                        filledUsing.add("text");
                    }
                }
            } catch (Exception e) {
                System.out.println("print exception " + e);
            }

            if (symtomsEt.getText().toString().trim().isEmpty()
                    && chiefDay.getText().toString().trim().isEmpty()
                    && edtPastTreatment.getText().toString().trim().isEmpty()
                    && edtTreatmentAdvice.getText().toString().trim().isEmpty()
                    && edtDietPlan.getText().toString().trim().isEmpty()
                    && testCategoriesList.isEmpty()
                    && followDays.getText().toString().trim().isEmpty()) {
                OPHubUtils.showAlertDialog(getContext(),"Please fill atleast one or two clinical detail !");
                return;
            }

            List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList = new ArrayList<>();
            for (int i = 0; i < testCategoriesList.size(); i++) {
                ClinicalNotesRequestResponse.DiagnosisReport report = new ClinicalNotesRequestResponse.DiagnosisReport();
                report.setTestCategories(testCategoriesList.get(i));
                report.setSubCategory(subCategoryList.get(i));
                report.setLaboratory(laboratoryList.get(i));
                report.setRemarks(remarksList.get(i));
                report.setOpdId(Integer.valueOf(opdID.get(i)));
                report.setFilledUsing(filledUsing.get(i));
                diagnosisReportList.add(report);
            }

            List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
            ClinicalNotesRequestResponse.ChiefComplaintsBasic medicine = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();
            medicine.setComplaintName(symtomsEt.getText().toString());
            medicine.setOpdId(Integer.valueOf(opdId));
            medicine.setFilledUsing("text");
            chiefComplaintsBasicList.add(medicine);

            callApiPost(diagnosisReportList, chiefComplaintsBasicList);

        } else {
            testCategoriesList.clear();
            subCategoryList.clear();
            laboratoryList.clear();
            remarksList.clear();

            try {
                for (int i = 0; i <= currentIndexDiagnosis; i++) {
                    if (testCategories[i] != null) {
                        boolean isAnyFieldFilled =
                                !testCategories[i].getText().toString().trim().isEmpty() ||
                                        !subCategory[i].getText().toString().trim().isEmpty() ||
                                        !laboratory[i].getText().toString().trim().isEmpty() ||
                                        !remarksDiagnosis[i].getText().toString().trim().isEmpty();

                        if (isAnyFieldFilled) {
                            testCategoriesList.add(testCategories[i].getText().toString());
                            subCategoryList.add(subCategory[i].getText().toString());
                            laboratoryList.add(laboratory[i].getText().toString());
                            remarksList.add(remarksDiagnosis[i].getText().toString());
                            opdID.add(opdId);
                            filledUsing.add("text");
                        }
                    } else {
                        currentIndexDiagnosis++;
                    }
                }
            } catch (Exception e) {
                System.out.println("print exception " + e);
            }



            if (symtomsEt.getText().toString().trim().isEmpty()
                    && chiefDay.getText().toString().trim().isEmpty()
                    && edtPastTreatment.getText().toString().trim().isEmpty()
                    && edtTreatmentAdvice.getText().toString().trim().isEmpty()
                    && edtDietPlan.getText().toString().trim().isEmpty()
                    && followDays.getText().toString().trim().isEmpty()
                    &&testCategoriesList.isEmpty()) {
                OPHubUtils.showAlertDialog(getContext(),"Please fill atleast one or two clinical detail !");
                return;
            }

            List<ClinicalNotesRequestPatch.DiagnosisReport> diagnosisReportList = new ArrayList<>();
            for (int i = 0; i < testCategoriesList.size(); i++) {
                ClinicalNotesRequestPatch.DiagnosisReport report = new ClinicalNotesRequestPatch.DiagnosisReport();
                report.setTestCategories(testCategoriesList.get(i));
                report.setSubCategory(subCategoryList.get(i));
                report.setLaboratory(laboratoryList.get(i));
                report.setRemarks(remarksList.get(i));
                Integer id = diagnosisID.get(i);
                if (id != null && id != 0) {
                    report.setId(id);
                }
                // report.setId(diagnosisID.get(i));
                report.setOpd_id(Integer.valueOf(opdID.get(i)));
                report.setFilledUsing(filledUsing.get(i));
                diagnosisReportList.add(report);
            }

            List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
            try {
                ClinicalNotesRequestPatch.ChiefComplaintsBasic medicine = new ClinicalNotesRequestPatch.ChiefComplaintsBasic();
                medicine.setComplaintName(symtomsEt.getText().toString());
                if (medicineID.size() > 0) {
                    medicine.setId(medicineID.get(0));
                }
                medicine.setOpd_id(Integer.valueOf(opdId));
                medicine.setFilledUsing("text");
                chiefComplaintsBasicList.add(medicine);
            } catch (Exception e) {
                e.printStackTrace();
            }

            callApiPatch(diagnosisReportList, chiefComplaintsBasicList);
        }
    }



    @OnClick(R.id.past_document)
    public void clickPastDocument() {


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


    @OnClick(R.id.record)
    public void recordAudio() {
     /*   String contenttype = "audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";

        try {
            augnitoSpeechAudio = new AugnitoSpeechAudio(
                    this,
                    "wss://apis.augnito.ai/v2/speechapi",
                    "ca03bb64-64e4-4952-9e4b-72cc81be9077",
                    "73bcb2a475de4138be2fecbd51957bf2",
                    211801200, // Update with your lmid
                    "udhaya",
                    "",
                    -1,
                    "otherInfo", contenttype);

            AugnitoSpeechResult asr = augnitoSpeechAudio.StartSpeech(getActivity());

            if (asr.equals(AugnitoSpeechResult.Success)) {
                requireActivity().runOnUiThread(() -> {
                    record.setVisibility(View.GONE);
                    recordstop.setVisibility(View.VISIBLE);
                    txtTapMic.setText("Initializing Augnito.....");
                });
            }
        } catch (URISyntaxException e) {
            e.printStackTrace(); // Log the exception
            requireActivity().runOnUiThread(() -> {
                txtTapMic.setText("URI Syntax Error: " + e.getMessage());
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
            });
        } catch (Exception e) {
            e.printStackTrace(); // Handle any other exceptions
            requireActivity().runOnUiThread(() -> {
                txtTapMic.setText("Error: " + e.getMessage());
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
            });
        }*/
    }

    @Override
    public void onFocusChange(View view, boolean hasFocus) {
        if (hasFocus) {
            ExtendedEditTExt e = (ExtendedEditTExt) view;
            selectedView = e.getHint().toString().toLowerCase();
            selectedEditText = e;

        }
    }





    private String GetEditorText() {
        if (selectedEditText != null) {
            return selectedEditText.getText().toString();
        }
        return "";
    }

    private void UpdateSelectedView(String receivedText) {


        if (selectedView.equalsIgnoreCase("Complaint Type")) {
//            complaintName.setText(UpdateTextFormat(complaintName.getText().toString(), receivedText));
//            complaintName.setSelection(complaintName.getText().length());
//            selectedEditText = complaintName;
        } else if (selectedView.equalsIgnoreCase("Complaint Remarks")) {
            complaintRemarks.setText(UpdateTextFormat(complaintRemarks.getText().toString(), receivedText));
            complaintRemarks.setSelection(complaintRemarks.getText().length());
            selectedEditText = complaintRemarks;
        } else if (selectedView.equalsIgnoreCase("Past Medical History")) {
            edtPastTreatment.setText(UpdateTextFormat(edtPastTreatment.getText().toString(), receivedText));
            edtPastTreatment.setSelection(edtPastTreatment.getText().length());
            selectedEditText = edtPastTreatment;
        } else if (selectedView.equalsIgnoreCase("Treatment Advice")) {
            edtTreatmentAdvice.setText(UpdateTextFormat(edtTreatmentAdvice.getText().toString(), receivedText));
            edtTreatmentAdvice.setSelection(edtTreatmentAdvice.getText().length());
            selectedEditText = edtTreatmentAdvice;
        } else if (selectedView.equalsIgnoreCase("Diet Plan")) {
            edtDietPlan.setText(UpdateTextFormat(edtDietPlan.getText().toString(), receivedText));
            edtDietPlan.setSelection(edtDietPlan.getText().length());
            selectedEditText = edtDietPlan;
        } else if (selectedView.equalsIgnoreCase("Follow up")) {
            followUpRemarks.setText(UpdateTextFormat(edtDietPlan.getText().toString(), receivedText));
            followUpRemarks.setSelection(followUpRemarks.getText().length());
            selectedEditText = followUpRemarks;
        } else if (selectedView.equalsIgnoreCase("Days")) {

            receivedText = receivedText.trim();
            int number = 0;
            try {
                number = Integer.parseInt(receivedText);
                if (number >= 0 && number <= 100) {
                    chiefDay.setText(String.valueOf(number));
                    chiefDay.setSelection(chiefDay.getText().length());
                    selectedEditText = chiefDay;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }

        } else if (selectedView.equalsIgnoreCase("Count")) {

            receivedText = receivedText.trim();
            int number = 0;
            try {
                number = Integer.parseInt(receivedText);
                if (number >= 0 && number <= 100) {
                    followDays.setText(String.valueOf(number));
                    followDays.setSelection(followDays.getText().length());
                    selectedEditText = followDays;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }

    private String UpdateTextFormat(String existingText, String receivedText) {
        // We called this part of code, client side beatification.
        // In client side beatification text need to be processed for better formatting,
        // The Processing done here is :-
        //      Make first Charecter capital, if after fullstop.
        //      Remove prefix spaces as and when need.
        String finalText = "";
        receivedText = receivedText.replaceAll("\n", "@newline@");
        String checkPunctuation = receivedText.trim();
        boolean IsPunctuation = false;
        if (checkPunctuation.startsWith(",") || checkPunctuation.startsWith(".") || checkPunctuation.startsWith(":") || checkPunctuation.startsWith("?")) {
            receivedText = checkPunctuation;
            IsPunctuation = true;
        }
        if (existingText == null || existingText.length() == 0) {
            receivedText = receivedText.trim();
            finalText = CapitalizeFirstLetter(receivedText);
        } else if (existingText.endsWith("\n")) {
            receivedText = receivedText.trim();
            receivedText = CapitalizeFirstLetter(receivedText);
            finalText = existingText + receivedText;
        } else if (existingText.endsWith(":") || existingText.endsWith(".")) {
            receivedText = receivedText.trim();
            receivedText = CapitalizeFirstLetter(receivedText);
            finalText = existingText + " " + receivedText;
        } else {
            if (IsPunctuation) {
                finalText = existingText + receivedText;
            } else {
                finalText = existingText + " " + receivedText;
            }
        }
        finalText = finalText.replaceAll("@newline@", "\n");
        return finalText;
    }

    private String CapitalizeFirstLetter(String receivedText) {

        if (receivedText.length() < 2) {
            return receivedText;
        }
        // get First letter of the string
        String firstLetStr = receivedText.substring(0, 1);
        // Get remaining letter using substring
        String remLetStr = receivedText.substring(1);
        // convert the first letter of String to uppercase
        firstLetStr = firstLetStr.toUpperCase();
        // concantenate the first letter and remaining string
        return firstLetStr + remLetStr;
    }

    @OnClick(R.id.recordstop)
    public void Stop_Recording_Clicked(View view) {
        //augnitoSpeechAudio.StopSpeech();
        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
                txtTapMic.setText("Tap to mic on...");
            }
        });

    }

    @Override
    public void onDestroy() {
        super.onDestroy();


    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("print onpause status : "+ onPause);
        if (onPause) {
            savedataOnPause();
        }
        System.out.println("Condition"+"onpause");

    }

    @Override
    public void onResume() {
        super.onResume();
        System.out.println("Condition"+"onResume");
        //savedataOnPause();

    }

    private void savedataOnPause() {


        if (APIcallMethod.equalsIgnoreCase("post")) {
            testCategoriesList.clear();
            subCategoryList.clear();
            laboratoryList.clear();
            remarksList.clear();

            try {
                for (int i = 0; i <= currentIndexDiagnosis; i++) {
                    boolean isAnyFieldFilled =
                            !testCategories[i].getText().toString().trim().isEmpty() ||
                                    !subCategory[i].getText().toString().trim().isEmpty() ||
                                    !laboratory[i].getText().toString().trim().isEmpty() ||
                                    !remarksDiagnosis[i].getText().toString().trim().isEmpty();

                    if (isAnyFieldFilled) {
                        testCategoriesList.add(testCategories[i].getText().toString());
                        subCategoryList.add(subCategory[i].getText().toString());
                        laboratoryList.add(laboratory[i].getText().toString());
                        remarksList.add(remarksDiagnosis[i].getText().toString());
                        opdID.add(opdId);
                        filledUsing.add("text");
                    }
                }
            } catch (Exception e) {
                System.out.println("print exception " + e);
            }



            List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList = new ArrayList<>();
            for (int i = 0; i < testCategoriesList.size(); i++) {
                ClinicalNotesRequestResponse.DiagnosisReport report = new ClinicalNotesRequestResponse.DiagnosisReport();
                report.setTestCategories(testCategoriesList.get(i));
                report.setSubCategory(subCategoryList.get(i));
                report.setLaboratory(laboratoryList.get(i));
                report.setRemarks(remarksList.get(i));
                report.setOpdId(Integer.valueOf(opdID.get(i)));
                report.setFilledUsing(filledUsing.get(i));
                diagnosisReportList.add(report);
            }

            List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
            ClinicalNotesRequestResponse.ChiefComplaintsBasic medicine = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();
            medicine.setComplaintName(symtomsEt.getText().toString());
            medicine.setOpdId(Integer.valueOf(opdId));
            medicine.setFilledUsing("text");
            chiefComplaintsBasicList.add(medicine);
            if (symtomsEt.getText().toString().trim().isEmpty()
                    && chiefDay.getText().toString().trim().isEmpty()
                    && edtPastTreatment.getText().toString().trim().isEmpty()
                    && edtTreatmentAdvice.getText().toString().trim().isEmpty()
                    && edtDietPlan.getText().toString().trim().isEmpty()
                    && testCategoriesList.isEmpty()
                    && followDays.getText().toString().trim().isEmpty()) {
            }else {
                callApiPostOnPause(diagnosisReportList, chiefComplaintsBasicList);

            }

        } else {
            testCategoriesList.clear();
            subCategoryList.clear();
            laboratoryList.clear();
            remarksList.clear();

            try {
                for (int i = 0; i <= currentIndexDiagnosis; i++) {
                    if (testCategories[i] != null) {
                        boolean isAnyFieldFilled =
                                !testCategories[i].getText().toString().trim().isEmpty() ||
                                        !subCategory[i].getText().toString().trim().isEmpty() ||
                                        !laboratory[i].getText().toString().trim().isEmpty() ||
                                        !remarksDiagnosis[i].getText().toString().trim().isEmpty();

                        if (isAnyFieldFilled) {
                            testCategoriesList.add(testCategories[i].getText().toString());
                            subCategoryList.add(subCategory[i].getText().toString());
                            laboratoryList.add(laboratory[i].getText().toString());
                            remarksList.add(remarksDiagnosis[i].getText().toString());
                            opdID.add(opdId);
                            filledUsing.add("text");
                        }
                    } else {
                        currentIndexDiagnosis++;
                    }
                }
            } catch (Exception e) {
                System.out.println("print exception " + e);
            }

            List<ClinicalNotesRequestPatch.DiagnosisReport> diagnosisReportList = new ArrayList<>();
            for (int i = 0; i < testCategoriesList.size(); i++) {
                ClinicalNotesRequestPatch.DiagnosisReport report = new ClinicalNotesRequestPatch.DiagnosisReport();
                report.setTestCategories(testCategoriesList.get(i));
                report.setSubCategory(subCategoryList.get(i));
                report.setLaboratory(laboratoryList.get(i));
                report.setRemarks(remarksList.get(i));
                Integer id = diagnosisID.get(i);
                if (id != null && id != 0) {
                    report.setId(id);
                }
                report.setOpd_id(Integer.valueOf(opdID.get(i)));
                report.setFilledUsing(filledUsing.get(i));
                diagnosisReportList.add(report);
            }

            List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
            try {
                ClinicalNotesRequestPatch.ChiefComplaintsBasic medicine = new ClinicalNotesRequestPatch.ChiefComplaintsBasic();
                medicine.setComplaintName(symtomsEt.getText().toString());
                if (medicineID.size() > 0) {
                    medicine.setId(medicineID.get(0));
                }
                medicine.setOpd_id(Integer.valueOf(opdId));
                medicine.setFilledUsing("text");
                chiefComplaintsBasicList.add(medicine);
            } catch (Exception e) {
                e.printStackTrace();
            }

            if (symtomsEt.getText().toString().trim().isEmpty()
                    && chiefDay.getText().toString().trim().isEmpty()
                    && edtPastTreatment.getText().toString().trim().isEmpty()
                    && edtTreatmentAdvice.getText().toString().trim().isEmpty()
                    && edtDietPlan.getText().toString().trim().isEmpty()
                    && followDays.getText().toString().trim().isEmpty()
                    &&testCategoriesList.isEmpty()) {

            }else {
                callApiPatchOnPause(diagnosisReportList, chiefComplaintsBasicList);
            }


        }
    }

    private void callApiPostOnPause(List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList, List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasics)
    {
        Log.i("myLog", "getClinicalNotesRequest");
        ClinicalNotesRequestResponse request = new ClinicalNotesRequestResponse();

        List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
        ClinicalNotesRequestResponse.ChiefComplaintsBasic chiefComplaintsBasic = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();

        chiefComplaintsBasic.setOpdId(Integer.valueOf(opdId.toString()));
        chiefComplaintsBasic.setComplaintName(symtomsEt.getText().toString());
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

        if(!followUpDate.getText().toString().isEmpty()) {
            request.setFollowUp(new ClinicalNotesRequestResponse.FollowUp());
            request.getFollowUp().setDate(followUpDate.getText().toString());
            request.getFollowUp().setCount(followDays.getText().toString());
            request.getFollowUp().setDurationLimit(followWeek.getSelectedItem().toString());
            request.getFollowUp().setRemarks(followUpRemarks.getText().toString());
            request.getFollowUp().setOpdId(Integer.valueOf(opdId.toString()));
            request.getFollowUp().setFilledUsing(filledSave);
        }


        request.setHospitalId(hospitalId);


        Log.i("myLog", "getClinicalNoesRequest:" + new Gson().toJson(request));
        Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = services.getClinicalNotesRequest(request);
        call.enqueue(new Callback<ClinicalNotesRequestResponse.ConsentRequestResponsedata>() {

            @Override
            public void onResponse(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Response<ClinicalNotesRequestResponse.ConsentRequestResponsedata> response) {

            }

            @Override
            public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {

            }
        });
    }

    private void callApiPatchOnPause(List<ClinicalNotesRequestPatch.DiagnosisReport> diagnosisReportList, List<ClinicalNotesRequestPatch.ChiefComplaintsBasic> chiefComplaintsBasics)  {

        Log.i("myLog", "getClinicalNotesRequest");
        ClinicalNotesRequestPatch request = new ClinicalNotesRequestPatch();
        request.setChiefComplaintDetails(new ClinicalNotesRequestPatch.ChiefComplaintDetails());
        request.getChiefComplaintDetails().setId(getChiefCompaintID);
        request.getChiefComplaintDetails().setFilledUsing(filledSave);
        request.getChiefComplaintDetails().setCount(chiefDay.getText().toString());
        request.getChiefComplaintDetails().setDurationLimit(chiefDate.getSelectedItem().toString());
        request.getChiefComplaintDetails().setRemarks(complaintRemarks.getText().toString());

        if (getPastTreatmentID != null ) {
            ClinicalNotesRequestPatch.PastTreatmentHistory pastTreatmentHistory = new ClinicalNotesRequestPatch.PastTreatmentHistory();
            pastTreatmentHistory.setId(getPastTreatmentID);
            pastTreatmentHistory.setFilledUsing(filledSave);
            pastTreatmentHistory.setHistory(edtPastTreatment.getText().toString());
            request.setPastTreatmentHistory(pastTreatmentHistory);

            ClinicalNotesRequestPatch.PastTreatmentHistoryDoc pastTreatmentHistoryDoc = new ClinicalNotesRequestPatch.PastTreatmentHistoryDoc();
            pastTreatmentHistoryDoc.setId(getPastTreatmentID);
            pastTreatmentHistoryDoc.setFilledUsing(filledSave);
            pastTreatmentHistoryDoc.setDocuments("");

            List<ClinicalNotesRequestPatch.PastTreatmentHistoryDoc> pastTreatmentHistoryDocsList = new ArrayList<>();
            pastTreatmentHistoryDocsList.add(pastTreatmentHistoryDoc);
            request.setPastTreatmentHistoryDocs(pastTreatmentHistoryDocsList);
        }



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


        if(!followUpDate.getText().toString().isEmpty()) {
            request.setFollowUp(new ClinicalNotesRequestPatch.FollowUp());
            request.getFollowUp().setDate(followUpDate.getText().toString());
            request.getFollowUp().setCount(followDays.getText().toString());
            request.getFollowUp().setDurationLimit(followWeek.getSelectedItem().toString());
            request.getFollowUp().setRemarks(followUpRemarks.getText().toString());
            request.getFollowUp().setId(getFollowUpID);
            request.getFollowUp().setOpd_id(Integer.parseInt(opdId));
            request.getFollowUp().setFilledUsing(filledSave);
        }




        request.setHospitalId(hospitalId);


        Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = services.updateClinicalNotesRequest(request);
        call.enqueue(new Callback<ClinicalNotesRequestResponse.ConsentRequestResponsedata>() {

            @Override
            public void onResponse(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Response<ClinicalNotesRequestResponse.ConsentRequestResponsedata> response) {

            }

            @Override
            public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {

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
                diagnosisSpinner.removeView(linearRowDiagnosis[pos]);
                linearRowDiagnosis[i] = new LinearLayout(getContext());
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );

                int topMargin = 16;
                params.setMargins(0, topMargin, 0, 0);

                linearRowDiagnosis[i].setLayoutParams(params);
                linearRowDiagnosis[i].setOrientation(LinearLayout.HORIZONTAL);
                linearRowDiagnosis[i].setWeightSum(4);
                testCategories[i] = new AutoCompleteTextView(getActivity());
                LinearLayout.LayoutParams testCategoryParam = new LinearLayout.LayoutParams(0,
                        44, 1.2f);
                testCategoryParam.setMargins(0, 0, 0, 0);
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
                        LinearLayout.LayoutParams.MATCH_PARENT, 1.2f);
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
                laboratory[i].setVisibility(View.GONE);
//                LinearLayout.LayoutParams laboratoryParam = new LinearLayout.LayoutParams(0,
//                        LinearLayout.LayoutParams.MATCH_PARENT, 1);
//                laboratoryParam.setMargins(20, 0, 0, 0);
//                laboratory[i].setLayoutParams(laboratoryParam);
//                laboratory[i].setPadding(0, 0, 0, 0);
//                laboratory[i].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
//
//                laboratory[i].setHint("Enter laboratory");
//                laboratory[i].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
//                laboratory[i].setText(diagnosisReport.get(i).getLaboratory());
                linearRowDiagnosis[i].addView(laboratory[i]);


                remarksDiagnosis[i] = new EditText(getContext());
                LinearLayout.LayoutParams remarksParams = new LinearLayout.LayoutParams(0,
                        LinearLayout.LayoutParams.MATCH_PARENT, 1.2f);
                remarksParams.setMargins(20, 0, 0, 0);
                remarksDiagnosis[i].setLayoutParams(remarksParams);
                remarksDiagnosis[i].setPadding(30, 0, 0, 0);


                remarksDiagnosis[i].setHint("Diagnosis Remarks");
                remarksDiagnosis[i].setText(diagnosisReport.get(i).getRemarks());
                remarksDiagnosis[i].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
                linearRowDiagnosis[i].addView(remarksDiagnosis[i]);


                actionDiagnosis[i] = new ImageView(getContext());
                actionDiagnosis[i].setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 0.4f)); // Equal weight to distribute space
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
            params.setMargins(0, topMargin, 0, 0);

            linearRowDiagnosis[index].setLayoutParams(params);

            linearRowDiagnosis[index].setOrientation(LinearLayout.HORIZONTAL);
            linearRowDiagnosis[index].setWeightSum(4);

//            testCategories[index] = new Spinner(getActivity());
            testCategories[index] = new AutoCompleteTextView(getActivity());
            LinearLayout.LayoutParams testCategoryParam = new LinearLayout.LayoutParams(0,
                    44, 1.2f);
            testCategoryParam.setMargins(0, 0, 0, 0);
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
                    LinearLayout.LayoutParams.MATCH_PARENT, 1.2f);
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
            laboratory[index].setVisibility(View.GONE);
//            LinearLayout.LayoutParams laboratoryParam = new LinearLayout.LayoutParams(0,
//                    LinearLayout.LayoutParams.MATCH_PARENT, 1);
//            laboratoryParam.setMargins(20, 0, 0, 0);
//            laboratory[index].setLayoutParams(laboratoryParam);
//            laboratory[index].setPadding(0, 0, 0, 0);
//            laboratory[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);
//
//            laboratory[index].setHint("Enter laboratory");
//            laboratory[index].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
            linearRowDiagnosis[index].addView(laboratory[index]);


            remarksDiagnosis[index] = new EditText(getContext());
            LinearLayout.LayoutParams remarksParams = new LinearLayout.LayoutParams(0,
                    LinearLayout.LayoutParams.MATCH_PARENT, 1.2f);
            remarksParams.setMargins(20, 0, 0, 0);
            remarksDiagnosis[index].setLayoutParams(remarksParams);
            remarksDiagnosis[index].setPadding(30, 0, 0, 0);
//            remarksDiagnosis[index].setTextAlignment(View.TEXT_ALIGNMENT_CENTER);


            remarksDiagnosis[index].setHint("Diagnosis Remarks");
            remarksDiagnosis[index].setBackgroundResource(R.drawable.rounded_rectangle_gray_outline);
            linearRowDiagnosis[index].addView(remarksDiagnosis[index]);


            actionDiagnosis[index] = new ImageView(getContext());
            actionDiagnosis[index].setLayoutParams(new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 0.4f)); // Equal weight to distribute space
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


    private void callApiPost(List<ClinicalNotesRequestResponse.DiagnosisReport> diagnosisReportList, List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasics) {
        Log.i("myLog", "getClinicalNotesRequest");
        ClinicalNotesRequestResponse request = new ClinicalNotesRequestResponse();

        List<ClinicalNotesRequestResponse.ChiefComplaintsBasic> chiefComplaintsBasicList = new ArrayList<>();
        ClinicalNotesRequestResponse.ChiefComplaintsBasic chiefComplaintsBasic = new ClinicalNotesRequestResponse.ChiefComplaintsBasic();

        chiefComplaintsBasic.setOpdId(Integer.valueOf(opdId.toString()));
        chiefComplaintsBasic.setComplaintName(symtomsEt.getText().toString());
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

        if(!followUpDate.getText().toString().isEmpty()) {
            request.setFollowUp(new ClinicalNotesRequestResponse.FollowUp());
            request.getFollowUp().setDate(followUpDate.getText().toString());
            request.getFollowUp().setCount(followDays.getText().toString());
            request.getFollowUp().setDurationLimit(followWeek.getSelectedItem().toString());
            request.getFollowUp().setRemarks(followUpRemarks.getText().toString());
            request.getFollowUp().setOpdId(Integer.valueOf(opdId.toString()));
            request.getFollowUp().setFilledUsing(filledSave);
        }


        request.setHospitalId(hospitalId);


        Log.i("myLog", "getClinicalNoesRequest:" + new Gson().toJson(request));
        Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = services.getClinicalNotesRequest(request);
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
                        // getClinicalNotes("old");

                        NewClinicalNotesFragment newFragment = new NewClinicalNotesFragment();
                        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();transaction.replace(R.id.fragment_container, newFragment);
                        transaction.addToBackStack(null);
                        transaction.commit();
                        onPause = false;

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

        if (getPastTreatmentID != null ) {
            ClinicalNotesRequestPatch.PastTreatmentHistory pastTreatmentHistory = new ClinicalNotesRequestPatch.PastTreatmentHistory();
            pastTreatmentHistory.setId(getPastTreatmentID);
            pastTreatmentHistory.setFilledUsing(filledSave);
            pastTreatmentHistory.setHistory(edtPastTreatment.getText().toString());
            request.setPastTreatmentHistory(pastTreatmentHistory);

            ClinicalNotesRequestPatch.PastTreatmentHistoryDoc pastTreatmentHistoryDoc = new ClinicalNotesRequestPatch.PastTreatmentHistoryDoc();
            pastTreatmentHistoryDoc.setId(getPastTreatmentID);
            pastTreatmentHistoryDoc.setFilledUsing(filledSave);
            pastTreatmentHistoryDoc.setDocuments("");

            List<ClinicalNotesRequestPatch.PastTreatmentHistoryDoc> pastTreatmentHistoryDocsList = new ArrayList<>();
            pastTreatmentHistoryDocsList.add(pastTreatmentHistoryDoc);
            request.setPastTreatmentHistoryDocs(pastTreatmentHistoryDocsList);
        }



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


        if(!followUpDate.getText().toString().isEmpty()) {
            request.setFollowUp(new ClinicalNotesRequestPatch.FollowUp());
            request.getFollowUp().setDate(followUpDate.getText().toString());
            request.getFollowUp().setCount(followDays.getText().toString());
            request.getFollowUp().setDurationLimit(followWeek.getSelectedItem().toString());
            request.getFollowUp().setRemarks(followUpRemarks.getText().toString());
            request.getFollowUp().setId(getFollowUpID);
            request.getFollowUp().setOpd_id(Integer.parseInt(opdId));
            request.getFollowUp().setFilledUsing(filledSave);
        }




        request.setHospitalId(hospitalId);


        Log.i("myLog", "getClinicalNoesRequestPatchSeperate:" + new Gson().toJson(request));
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
                        //                    getClinicalNotes("old");
                        NewClinicalNotesFragment newFragment = new NewClinicalNotesFragment();
                        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();transaction.replace(R.id.fragment_container, newFragment);
                        transaction.addToBackStack(null);
                        transaction.commit();

                        onPause = false;

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


    public boolean CheckPermissions() {
        int result = ContextCompat.checkSelfPermission(getActivity(), WRITE_EXTERNAL_STORAGE);
        int result1 = ContextCompat.checkSelfPermission(getActivity(), RECORD_AUDIO);
        return result == PackageManager.PERMISSION_GRANTED && result1 == PackageManager.PERMISSION_GRANTED;
    }

    private void RequestPermissions() {
        ActivityCompat.requestPermissions(getActivity(), new String[]{RECORD_AUDIO, WRITE_EXTERNAL_STORAGE}, REQUEST_AUDIO_PERMISSION_CODE);
    }


}
