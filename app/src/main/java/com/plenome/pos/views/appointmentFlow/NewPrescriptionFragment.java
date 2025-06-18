package com.plenome.pos.views.appointmentFlow;

import static android.Manifest.permission.RECORD_AUDIO;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

import static android.view.Gravity.CENTER;

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
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
import com.google.gson.Gson;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Paragraph;

import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.adapters.MedicineAdapter;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.PatientPreviewResponse;
import com.plenome.pos.model.PostPrescriptionRequest;
import com.plenome.pos.model.PostPrescriptionResponse;
import com.plenome.pos.model.PrescriptionDetail;
import com.plenome.pos.model.PrescriptionResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.AudioRecorder;
import com.plenome.pos.views.ExtendedEditTExt;
import com.plenome.pos.views.OPHubApplication;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

import com.itextpdf.layout.Document;

public class NewPrescriptionFragment extends Fragment {
    View rootView;

    RestServices services, fileServices;

    @BindView(R.id.txt_tap_mic)
    TextView txtTapMic;

    @BindView(R.id.txtMor)
    TextView txtMor;

    @BindView(R.id.txtNoon)
    TextView txtNoon;

    @BindView(R.id.txtEve)
    TextView txtEve;

    @BindView(R.id.txtNight)
    TextView txtNight;

    @BindView(R.id.btnAddPrescription)
    Button btnAddPrescription;

    @BindView(R.id.edt_medicine_name)
    ExtendedEditTExt edtMedicineName;

    @BindView(R.id.remarks)
    ExtendedEditTExt remarks;

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

    @BindView(R.id.backButton)
    Button backBtn;
    @BindView(R.id.tblHead)
    TableLayout tblHead;

    @BindView(R.id.linearScribbleDet)
    RelativeLayout linearScribbleDet;

    @BindView(R.id.spin_dosage)
    Spinner spinDosage;

    @BindView(R.id.spinDuration)
    Spinner spinDuration;

    @BindView(R.id.spinWhen)
    Spinner spinWhen;

    @BindView(R.id.lyt_tabs)
    RelativeLayout lytTab;


    @BindView(R.id.lyt_medication)
    LinearLayout lytMedication;

    @BindView(R.id.add_new_prescription)
    TextView addNewPrescription;

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.countDosage)
    ExtendedEditTExt countDosage;

    @BindView(R.id.countDuration)
    ExtendedEditTExt countDuration;

    @BindView(R.id.countQuantity)
    ExtendedEditTExt countQuantity;

    @BindView(R.id.medicineRecyc)
    RecyclerView medicineRecyc;

    @BindView(R.id.freq_tabs)
    LinearLayout freq_tabs;

    @BindView(R.id.animatedFab)
    LottieAnimationView animatedFab;

    private Boolean isRecording = false;
    private AudioRecorder recorder;
    private String filePath;
    private Dialog progressDialog;


    private Typeface typeface;
    private String isMornSelected = "0";
    private String isAftrSelected = "0";
    private String isEveSelected = "0";
    private String isNightSelected = "0";
    int opdId;
    private int hospid, prescId;
    private String selectedDosage, prescOption;
    private String selectedDuration;
    private String selectedWhen;
    private String selectedFilling = "Text";
    private MedicineAdapter medicineAdapter;
    private Button selectedButton = null;
    private String selectedHour = "0";
    private Boolean isHoursChecked = false;
    private Switch hourSwitch;

    private LinearLayout.LayoutParams progressBgParam, progressFirstBgParam, progressLastBgParam, progressTxtParam, progressLineParam,
            statusTxtParam, statusNameParam, statusCountParam, statusBgParam, statusBgFirstParam;

    private int width, height;
    TableRow.LayoutParams txtParam, lineParam, imgParam;

    //AugnitoSpeechAudio augnitoSpeechAudio = null;

    String selectedView = "Medicine Name";
    ExtendedEditTExt selectedEditText = null;
    int CursorPosition = 0;

    public static final int REQUEST_AUDIO_PERMISSION_CODE = 1221;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_new_prescription, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.prescription);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        progressDialog = new Dialog(getContext());
        progressDialog.setContentView(R.layout.progress_dialog);
        progressDialog.setCancelable(false);


        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        initParams();
        //   createAndUploadPdf();
        getPrescription("Main");
        //  showVitals();

        ArrayList<String> list = new ArrayList<>();
        list.add("Tablet");
        list.add("Syrup");
        list.add("Injection");
        list.add("Ointment");
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getActivity(), android.R.layout.simple_list_item_1, list);
        spinDosage.setAdapter(adapter);
        spinDosage.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                selectedDosage = list.get(i).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });

        ArrayList<String> Duration = new ArrayList<>();
        Duration.add("Days");
        //  Duration.add("Months");
        //Duration.add("Years");
        ArrayAdapter<String> adapterDuration = new ArrayAdapter<>(getActivity(), android.R.layout.simple_list_item_1, Duration);
        spinDuration.setAdapter(adapterDuration);
        spinDuration.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                selectedDuration = Duration.get(i).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });

        ArrayList<String> when = new ArrayList<>();
        when.add("After Meal");
        when.add("Before Meal");
        ArrayAdapter<String> adapterWhen = new ArrayAdapter<>(getActivity(), android.R.layout.simple_list_item_1, when);
        spinWhen.setAdapter(adapterWhen);
        spinWhen.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                selectedWhen = when.get(i).toString();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {
            }
        });

        //  edtMedicineName.setOnFocusChangeListener(this);

        addNewPrescription.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lytMedication.setVisibility(View.VISIBLE);
                addNewPrescription.setVisibility(View.GONE);
                tblHead.setVisibility(View.GONE);
                imgNoData.setVisibility(View.GONE);
                txtNoData.setVisibility(View.GONE);
                lytTab.setVisibility(View.VISIBLE);
                if (selectedFilling.equalsIgnoreCase("Voice")) {
                    txtTapMic.setVisibility(View.VISIBLE);
                    record.setVisibility(View.VISIBLE);
                    recordstop.setVisibility(View.GONE);
                }
                hourSwitch.setChecked(false);
                if (selectedButton != null) {
                    selectedButton.setSelected(false);
                    selectedButton.setBackgroundResource(R.drawable.rectangle_white);
                    selectedHour = "0";
                }
                prescOption = "Save";
                edtMedicineName.setText("");
                remarks.setText("");
                countDosage.setText("");
                countDuration.setText("");
                countQuantity.setText("");
                isMornSelected = "0";
                isNightSelected = "0";
                isEveSelected = "0";
                isAftrSelected = "0";
                spinDosage.setSelection(0);
                spinWhen.setSelection(0);
                txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                txtNoon.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
                txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                txtMor.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
                txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                txtNight.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
                txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
                txtEve.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            }
        });

        if (!CheckPermissions()) {
            RequestPermissions();
        }

        Switch customSwitch = rootView.findViewById(R.id.custom_switch);
        hourSwitch = customSwitch;
        final LinearLayout buttonContainer = rootView.findViewById(R.id.button_container);

        customSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                // Handle switch toggle state here
                if (isChecked) {
                    customSwitch.setThumbTintList(getResources().getColorStateList(R.color.appbarColor));
                    buttonContainer.setVisibility(View.VISIBLE);
                    isHoursChecked = true;
                    freq_tabs.setVisibility(View.GONE);
                } else {
                    customSwitch.setThumbTintList(getResources().getColorStateList(R.color.white));
                    buttonContainer.setVisibility(View.GONE);
                    isHoursChecked = false;
                    freq_tabs.setVisibility(View.VISIBLE);
                    if (selectedButton != null) {
                        selectedButton.setSelected(false);
                        selectedButton.setBackgroundResource(R.drawable.rectangle_white);
                        selectedHour = "0";
                    }
                }
            }
        });


        rootView.findViewById(R.id.button1).setOnClickListener(listener);
        rootView.findViewById(R.id.button2).setOnClickListener(listener);
        rootView.findViewById(R.id.button3).setOnClickListener(listener);
        rootView.findViewById(R.id.button4).setOnClickListener(listener);
        rootView.findViewById(R.id.button5).setOnClickListener(listener);
        rootView.findViewById(R.id.button6).setOnClickListener(listener);
        rootView.findViewById(R.id.button7).setOnClickListener(listener);
        rootView.findViewById(R.id.button8).setOnClickListener(listener);
        rootView.findViewById(R.id.button9).setOnClickListener(listener);
        rootView.findViewById(R.id.button10).setOnClickListener(listener);
        rootView.findViewById(R.id.button11).setOnClickListener(listener);
        rootView.findViewById(R.id.button12).setOnClickListener(listener);

        recorder = new AudioRecorder();
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
                if (filePath != null) {
                    progressDialog.show();
                    uploadAudioFile();
                }
            }
        });


        return rootView;
    }


    View.OnClickListener listener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (selectedButton != null) {
                selectedButton.setSelected(false); // Deselect the previously selected button
                selectedButton.setBackgroundResource(R.drawable.rectangle_white);
            }
            selectedButton = (Button) v;
            selectedButton.setSelected(true); // Highlight the new selected button
            selectedHour = selectedButton.getText().toString();
            selectedButton.setBackgroundResource(R.drawable.button_background);
        }
    };

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
        File file = new File(filePath);
        if (!isAudioFileDurationValid(filePath)) {
            Toast.makeText(getContext(), "Please Record More than 5 Seconds", Toast.LENGTH_SHORT).show();
            progressDialog.dismiss();
            return;
        }
        // Create multipart request body
        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", file.getName(),
                        RequestBody.create(MediaType.parse("audio/mpeg"), file))
                .addFormDataPart("opd_id", String.valueOf(opdId))
                .addFormDataPart("hospital_id", String.valueOf(hospid))
                .build();

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
                        Toast.makeText(getContext(), "Data Added Successfully", Toast.LENGTH_SHORT).show();
                        lytMedication.setVisibility(View.GONE);
                        tblHead.setVisibility(View.GONE);
                        lytTab.setVisibility(View.GONE);
                        getPrescription("Save");
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


    @OnClick(R.id.btnAddPrescription)
    public void addPrescriptionClicked() {
        prescOption = "Save";
        lytMedication.setVisibility(View.VISIBLE);
        addNewPrescription.setVisibility(View.GONE);
        tblHead.setVisibility(View.GONE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        btnAddPrescription.setVisibility(View.GONE);
        lytTab.setVisibility(View.VISIBLE);
        if (selectedFilling.equalsIgnoreCase("Voice")) {
            txtTapMic.setVisibility(View.VISIBLE);
            record.setVisibility(View.VISIBLE);
            recordstop.setVisibility(View.GONE);
        }
        edtMedicineName.setText("");
        remarks.setText("");
        countDosage.setText("");
        countDuration.setText("");
        countQuantity.setText("");
        isMornSelected = "0";
        isNightSelected = "0";
        isEveSelected = "0";
        isAftrSelected = "0";
        txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNoon.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtMor.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNight.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtEve.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        spinDosage.setSelection(0);
        spinWhen.setSelection(0);
    }

    @OnClick(R.id.backButton)
    public void backClicked() {
        getPrescription("Main");
        if (selectedFilling.equalsIgnoreCase("Voice")) {
            txtTapMic.setVisibility(View.GONE);
            record.setVisibility(View.GONE);
            recordstop.setVisibility(View.GONE);
        }
        lytTab.setVisibility(View.GONE);
    }

    private void getPrescription(String option) {
        Log.i("myLog", " getPrescription opdId:" + opdId + "   hospid: " + hospid);
        Call<PrescriptionResponse> call = services.getPrescription(opdId, hospid);
        call.enqueue(new Callback<PrescriptionResponse>() {

            @Override
            public void onResponse(Call<PrescriptionResponse> call, Response<PrescriptionResponse> response) {
                try {
                    Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        if (!response.body().getDetails().isEmpty()) {
                            Log.i("myLog", "!response.body().getDetails().isEmpty()");
                            // loadData(response.body().getDetails());

                            List<PrescriptionDetail> prescList = response.body().getDetails();
                            if (option.equalsIgnoreCase("Main")) {
                                tblHead.setVisibility(View.VISIBLE);
                                imgNoData.setVisibility(View.GONE);
                                txtNoData.setVisibility(View.GONE);
                                btnAddPrescription.setVisibility(View.GONE);
                                lytMedication.setVisibility(View.GONE);
                                medicineRecyc.setVisibility(View.GONE);
                                addNewPrescription.setVisibility(View.GONE);
                                PrescriptionResponse.OpdDetails opdDetails = response.body().getOpdDetails();
                                showVitals();
                                if (opdDetails != null)
                                    showData(opdDetails, prescList);
                            } else if (option.equalsIgnoreCase("Edit") || option.equalsIgnoreCase("Save")) {
                                loadData(prescList);
                            }
                        } else {
                            Log.i("myLog", "else");
                            showVitals();
                            lytMedication.setVisibility(View.GONE);
                            addNewPrescription.setVisibility(View.GONE);
                            tblHead.setVisibility(View.VISIBLE);
                            imgNoData.setVisibility(View.VISIBLE);
                            txtNoData.setVisibility(View.VISIBLE);
                            btnAddPrescription.setVisibility(View.VISIBLE);
                            medicineRecyc.setVisibility(View.GONE);

                            //  lytTab.setVisibility(View.GONE);
                        }
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<PrescriptionResponse> call, Throwable t) {

            }
        });
    }

    private void loadData(List<PrescriptionDetail> details) {
        tblHead.setVisibility(View.GONE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        btnAddPrescription.setVisibility(View.GONE);
        medicineRecyc.setLayoutManager(new LinearLayoutManager(getContext()));
        medicineAdapter = new MedicineAdapter(getContext(), details, services, hospid);
        medicineRecyc.setAdapter(medicineAdapter);
        medicineRecyc.setVisibility(View.VISIBLE);
        lytMedication.setVisibility(View.GONE);
        addNewPrescription.setVisibility(View.VISIBLE);
        medicineAdapter.setOnClickListener(new MedicineAdapter.OnClickListener() {
            @Override
            public void onClick(int position, String option) {
                Log.i("myLog", "Edit clicked--------");
                PrescriptionDetail detail = details.get(position);
                if (option.equalsIgnoreCase("Edit")) {
                    prescOption = "Edit";
                    lytTab.setVisibility(View.VISIBLE);
                    addNewPrescription.setVisibility(View.GONE);
                    if (selectedFilling.equalsIgnoreCase("Voice")) {
                        txtTapMic.setVisibility(View.VISIBLE);
                        record.setVisibility(View.VISIBLE);
                        recordstop.setVisibility(View.GONE);
                    }
                    lytMedication.setVisibility(View.VISIBLE);
                    //  PrescriptionDetail detail = details.get(position);
                    prescId = detail.getId();
                    edtMedicineName.setText(detail.getMedicineName());
                    String dosage = detail.getDosage();
                    String dosageCount;
                    if (dosage.contains(" ")) {
                        String[] doseArr = dosage.split(" ");
                        dosageCount = doseArr[0];
                        countDosage.setText(dosageCount);
                    }
                    if (dosage.contains("Tablet")) {
                        spinDosage.setSelection(0);
                    } else if (dosage.contains("Syrup"))
                        spinDosage.setSelection(1);
                    else if (dosage.contains("Injection"))
                        spinDosage.setSelection(2);
                    else if (dosage.contains("Ointment"))
                        spinDosage.setSelection(3);
                    countDuration.setText(detail.getDurationCount());
                    countQuantity.setText(detail.getQuantity());
                    remarks.setText(detail.getRemarks());
                    String frequency = detail.getFrequency();
                    if (frequency.contains("Hours")) {
                        hourSwitch.setChecked(true);
                        selectButton(frequency);
                    } else {
                        hourSwitch.setChecked(false);
                        String[] freqArr = frequency.split("-");
                        isMornSelected = getArrayElementOrDefault(freqArr, 0, "0");
                        isAftrSelected = getArrayElementOrDefault(freqArr, 1, "0");
                        isEveSelected = getArrayElementOrDefault(freqArr, 2, "0");
                        isNightSelected = getArrayElementOrDefault(freqArr, 3, "0");
                        if (isMornSelected.equalsIgnoreCase("1")) {
                            txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
                            txtMor.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
                        }
                        if (isAftrSelected.equalsIgnoreCase("1")) {
                            txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
                            txtNoon.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
                        }
                        if (isEveSelected.equalsIgnoreCase("1")) {
                            txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
                            txtEve.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
                        }
                        if (isNightSelected.equalsIgnoreCase("1")) {
                            txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
                            txtNight.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
                        }
                    }
                    String when = detail.getWhen();
                    if (when.equalsIgnoreCase("After Meal")) spinWhen.setSelection(0);
                    else spinWhen.setSelection(1);

                } else if (option.equalsIgnoreCase("Delete")) {
                    showConfirmationDialog(detail.getId());
                }
            }
        });

    }

    public static String getArrayElementOrDefault(String[] array, int index, String defaultValue) {
        if (array != null && array.length > index && array[index] != null) {
            return array[index];
        }
        return defaultValue;
    }


    private void selectButton(String value) {
        if (selectedButton != null) {
            selectedButton.setSelected(false);
            selectedButton.setBackgroundResource(R.drawable.rectangle_white);
        }
        String timeString = value;
        String numberOnly = timeString.replaceAll("[^0-9]", ""); // Removes non-digit characters
        int hourValue = Integer.parseInt(numberOnly);
        switch (hourValue) {
            case 1:
                selectedButton = rootView.findViewById(R.id.button1);
                break;
            case 2:
                selectedButton = rootView.findViewById(R.id.button2);
                break;
            case 3:
                selectedButton = rootView.findViewById(R.id.button3);
                break;
            case 4:
                selectedButton = rootView.findViewById(R.id.button4);
                break;
            case 5:
                selectedButton = rootView.findViewById(R.id.button5);
                break;
            case 6:
                selectedButton = rootView.findViewById(R.id.button6);
                break;
            case 7:
                selectedButton = rootView.findViewById(R.id.button7);
                break;
            case 8:
                selectedButton = rootView.findViewById(R.id.button8);
                break;
            case 9:
                selectedButton = rootView.findViewById(R.id.button9);
                break;
            case 10:
                selectedButton = rootView.findViewById(R.id.button10);
                break;
            case 11:
                selectedButton = rootView.findViewById(R.id.button11);
                break;
            case 12:
                selectedButton = rootView.findViewById(R.id.button12);
                break;
        }
        if (selectedButton != null) {
            selectedButton.setSelected(true);
            selectedHour = selectedButton.getText().toString();
            selectedButton.setBackgroundResource(R.drawable.button_background);
        }
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            opdId = getArguments().getInt("opdId");
            hospid = getArguments().getInt("hospId");
        }
    }

    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            txtParam = new TableRow.LayoutParams((width - dpToPx(100)) / 5, dpToPx(50));
            lineParam = new TableRow.LayoutParams(width - dpToPx(50), dpToPx(1));
            lineParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            lineParam.span = 5;
            int w = ((width - dpToPx(100)) / 5) - dpToPx(25);
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

    private void showVitals() {
        tblHead.removeAllViews();
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

    private void showData(PrescriptionResponse.OpdDetails opdDet, List<PrescriptionDetail> prescList) {
        Log.i("myLog", "showData");
        TableRow trTitle = new TableRow(getActivity());

        TextView txtCreatedBy = new TextView(getActivity());
        txtCreatedBy.setText("1");
        txtCreatedBy.setTextAppearance(R.style.email);
        txtCreatedBy.setTypeface(typeface);
        txtCreatedBy.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtCreatedBy.setGravity(Gravity.CENTER);
        trTitle.addView(txtCreatedBy, txtParam);

        TextView txtCreatedDate = new TextView(getActivity());
        txtCreatedDate.setText(opdDet.getOpdNo());
        txtCreatedDate.setTextAppearance(R.style.email);
        txtCreatedDate.setTypeface(typeface);
        txtCreatedDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtCreatedDate.setGravity(Gravity.CENTER);
        trTitle.addView(txtCreatedDate, txtParam);
        Log.i("myLog", "showData22222");
        TextView txtRepairNotes = new TextView(getActivity());
        txtRepairNotes.setText(opdDet.getDate() + " & " + opdDet.getTime());
        txtRepairNotes.setTextAppearance(R.style.email);
        txtRepairNotes.setTypeface(typeface);
        txtRepairNotes.setGravity(Gravity.CENTER);
        txtRepairNotes.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        trTitle.addView(txtRepairNotes, txtParam);
        Log.i("myLog", "showData33333");
        TextView txtApptDateHead = new TextView(getActivity());
        txtApptDateHead.setText(opdDet.getConsultant());
        txtApptDateHead.setTextAppearance(R.style.email);
        txtApptDateHead.setTypeface(typeface);
        txtApptDateHead.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtApptDateHead.setGravity(Gravity.CENTER);
        trTitle.addView(txtApptDateHead, txtParam);

        TextView txtAction = new TextView(getActivity());
        txtAction.setText(R.string.view);
        txtAction.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
        txtAction.setTypeface(typeface);
        txtAction.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        txtAction.setGravity(Gravity.CENTER);
        trTitle.addView(txtAction, txtParam);
        trTitle.setBackground(ContextCompat.getDrawable(getContext(), R.color.white));
        Log.i("myLog", "showData444");
        tblHead.addView(trTitle);
        txtAction.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //  medicineRecyc.setVisibility(View.VISIBLE);
                //addNewPrescription.setVisibility(View.VISIBLE);
                //tblHead.setVisibility(View.GONE);
                loadData(prescList);
            }
        });

    }

    @OnClick(R.id.text)
    public void clickText() {
        selectedFilling = "Text";
        txtTapMic.setVisibility(View.GONE);
        record.setVisibility(View.GONE);
        recordstop.setVisibility(View.GONE);
        linearScribbleDet.setVisibility(View.GONE);
        addNewPrescription.setVisibility(View.GONE);
        lytMedication.setVisibility(View.VISIBLE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        imgNoData.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.no_data));
        txtNoData.setText(R.string.noDataFound);
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.appbarColor));
        text.setTextColor(getResources().getColor(R.color.white));
//        getPrescription("Main");

    }

    @OnClick(R.id.voice)
    public void clickVoice() {
        selectedFilling = "voice";
        txtTapMic.setVisibility(View.VISIBLE);
        record.setVisibility(View.VISIBLE);
        recordstop.setVisibility(View.GONE);
        addNewPrescription.setVisibility(View.GONE);
        lytMedication.setVisibility(View.VISIBLE);
        linearScribbleDet.setVisibility(View.GONE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        imgNoData.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.no_data));
        txtNoData.setText(R.string.noDataFound);
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setTextColor(getResources().getColor(R.color.white));
        text.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.appbarColor));
//        getPrescription("Main");
    }

    @OnClick(R.id.scribble)
    public void clickScribble() {
        selectedFilling = "Scribble";
        txtTapMic.setVisibility(View.GONE);
        record.setVisibility(View.GONE);
        recordstop.setVisibility(View.GONE);
        linearScribbleDet.setVisibility(View.GONE);
        lytMedication.setVisibility(View.GONE);
        addNewPrescription.setVisibility(View.GONE);
        text.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        voice.setBackgroundResource(R.drawable.rounded_rectangle_blue_outline);
        scribble.setBackgroundResource(R.drawable.rounded_rectangle_blue);
        voice.setTextColor(getResources().getColor(R.color.appbarColor));
        text.setTextColor(getResources().getColor(R.color.appbarColor));
        scribble.setTextColor(getResources().getColor(R.color.white));
//        tblHead.setVisibility(View.INVISIBLE);
        imgNoData.setVisibility(View.VISIBLE);
        txtNoData.setVisibility(View.VISIBLE);
        imgNoData.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.coming_soon));
        txtNoData.setText("Coming Soon");
        btnAddPrescription.setVisibility(View.GONE);
        lytMedication.setVisibility(View.GONE);
        medicineRecyc.setVisibility(View.GONE);

    }


    @OnClick(R.id.saveButton)
    public void savePrescription() {
        Log.i("myLog", "savePrescription:");
        PostPrescriptionRequest request = new PostPrescriptionRequest();
        if (!edtMedicineName.getText().toString().isEmpty()) {
            request.setMedicineName(edtMedicineName.getText().toString());
        }
        if (isHoursChecked) {
            request.setFrequency(selectedHour + " Hours");
        } else {
            request.setFrequency(isMornSelected + "-" + isAftrSelected + "-" + isEveSelected + "-" + isNightSelected);
        }
        request.setDosage(countDosage.getText().toString() + " " + selectedDosage);
        request.setDurationCount(countDuration.getText().toString());
        request.setDurationLimit(selectedDuration);
        request.setQuantity(countQuantity.getText().toString());
        request.setWhen(selectedWhen);
        request.setRemarks(remarks.getText().toString());
        request.setFilledUsing(selectedFilling);

        request.setHospitalId(hospid);
        Log.i("myLog", "prescOption:" + prescOption);
        if (prescOption.equalsIgnoreCase("Save")) {
            request.setOpdId(opdId);
            savePrescription(request);
        } else if (prescOption.equalsIgnoreCase("Edit")) {
            request.setId(prescId);
            editPrescription(request);
        }
    }


    @OnClick(R.id.txtMor)
    public void clickMor() {
        if (isMornSelected == "0") {
            txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
            txtMor.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
            isMornSelected = "1";
        } else {
            txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
            txtMor.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            isMornSelected = "0";
        }
    }

    @OnClick(R.id.txtNight)
    public void clickNight() {
        if (isNightSelected == "0") {
            txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
            txtNight.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
            isNightSelected = "1";
        } else {
            txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
            txtNight.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            isNightSelected = "0";
        }
    }

    @OnClick(R.id.txtEve)
    public void clickEve() {
        if (isEveSelected == "0") {
            txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
            isEveSelected = "1";
            txtEve.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
        } else {
            txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
            txtEve.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
            isEveSelected = "0";
        }
    }

    @OnClick(R.id.txtNoon)
    public void clickNoon() {
        if (isAftrSelected == "0") {
            txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangel_light_blue_border));
            isAftrSelected = "1";
            txtNoon.setTextColor(ContextCompat.getColor(getContext(), R.color.blue_text));
        } else {
            txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
            isAftrSelected = "0";
            txtNoon.setTextColor(ContextCompat.getColor(getContext(), R.color.menuTxtColor));
        }
    }

 /*   @OnClick(R.id.add_new)
    public void addNew() {
        tblHead.setVisibility(View.GONE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        lytTab.setVisibility(View.VISIBLE);
        lytMedication.setVisibility(View.VISIBLE);
        addNewPrescription.setVisibility(View.GONE);
    }*/


    private String GetEditorText() {
        if (selectedEditText != null) {
            return selectedEditText.getText().toString();
        }
        return "";
    }

    private void UpdateSelectedView(String receivedText) {
        System.out.println("print selectedview " + receivedText);
        if (selectedView.equalsIgnoreCase("Medicine Name")) {
            edtMedicineName.setText(UpdateTextFormat(edtMedicineName.getText().toString(), receivedText));
            edtMedicineName.setSelection(edtMedicineName.getText().length());
            selectedEditText = edtMedicineName;
        } else if (selectedView.equalsIgnoreCase("remarks")) {
            remarks.setText(UpdateTextFormat(remarks.getText().toString(), receivedText));
            remarks.setSelection(remarks.getText().length());
            selectedEditText = remarks;
        } else if (selectedView.equalsIgnoreCase("dosage")) {
            receivedText = receivedText.trim();
            int number = 0;
            try {
                number = Integer.parseInt(receivedText);
                if (number >= 0 && number <= 100) {
                    countDosage.setText(String.valueOf(number));
                    countDosage.setSelection(countDosage.getText().length());
                    selectedEditText = countDosage;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } else if (selectedView.equalsIgnoreCase("duration")) {
            receivedText = receivedText.trim();
            int number = 0;
            try {
                number = Integer.parseInt(receivedText);
                if (number >= 0 && number <= 1000) {
                    countDuration.setText(String.valueOf(number));
                    countDuration.setSelection(countDuration.getText().length());
                    selectedEditText = countDuration;
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } else if (selectedView.equalsIgnoreCase("quantity")) {
            receivedText = receivedText.trim();
            int number = 0;
            try {
                number = Integer.parseInt(receivedText);
                if (number >= 0 && number <= 100) {
                    countQuantity.setText(String.valueOf(number));
                    countQuantity.setSelection(countQuantity.getText().length());
                    selectedEditText = countQuantity;
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
        //  augnitoSpeechAudio.StopSpeech();
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
        System.out.println("print pause stop record");

    }

    @Override
    public void onPause() {
        super.onPause();
        System.out.println("print pause stop record");
        savePrescriptionOnPause();
    }

    private void savePrescriptionOnPause() {
        Log.i("myLog", "savePrescription:");
        PostPrescriptionRequest request = new PostPrescriptionRequest();
        if (!edtMedicineName.getText().toString().isEmpty()) {
            request.setMedicineName(edtMedicineName.getText().toString());
        }
        if (isHoursChecked) {
            request.setFrequency(selectedHour + " Hours");
        } else {
            request.setFrequency(isMornSelected + "-" + isAftrSelected + "-" + isEveSelected + "-" + isNightSelected);
        }
        request.setDosage(countDosage.getText().toString() + " " + selectedDosage);
        request.setDurationCount(countDuration.getText().toString());
        request.setDurationLimit(selectedDuration);
        request.setQuantity(countQuantity.getText().toString());
        request.setWhen(selectedWhen);
        request.setRemarks(remarks.getText().toString());
        request.setFilledUsing(selectedFilling);

        request.setHospitalId(hospid);
        if (prescOption != null) {
            if (prescOption.equalsIgnoreCase("Save")) {
                request.setOpdId(opdId);
                savePrescriptionOnpause(request);
            } else if (prescOption.equalsIgnoreCase("Edit")) {
                request.setId(prescId);
                editPrescriptionOnPause(request);
            }
        } else {
            Log.w("myLog", "prescOption is null, skipping save/edit prescription.");
        }

    }

    private void editPrescriptionOnPause(PostPrescriptionRequest request) {
        Log.i("myLog", "editPrescription request:" + new Gson().toJson(request));
        Call<PostPrescriptionResponse> call = services.editPrescription(request);
        call.enqueue(new Callback<PostPrescriptionResponse>() {
            @Override
            public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {

            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {
                Log.i("myLog", "savePrescription response failure:" + t.toString());
            }
        });
    }

    private void savePrescriptionOnpause(PostPrescriptionRequest request) {
        Log.i("myLog", "savePrescription request:" + new Gson().toJson(request));
        Call<PostPrescriptionResponse> call = services.postPrescription(request);
        call.enqueue(new Callback<PostPrescriptionResponse>() {
            @Override
            public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {

            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {
                Log.i("myLog", "savePrescription response failure:" + t.toString());
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


    public void savePrescription(PostPrescriptionRequest request) {
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
                                lytMedication.setVisibility(View.GONE);
                                tblHead.setVisibility(View.GONE);
                                //   addNewPrescription.setVisibility(View.VISIBLE);
                                lytTab.setVisibility(View.GONE);
                                getPrescription("Save");
                            }
                        }
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {
                Log.i("myLog", "savePrescription response failure:" + t.toString());
            }
        });
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
                                lytMedication.setVisibility(View.GONE);
                                tblHead.setVisibility(View.GONE);
                                addNewPrescription.setVisibility(View.VISIBLE);
                                lytTab.setVisibility(View.GONE);
                                getPrescription("Edit");
                            }
                        }
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {
                Log.i("myLog", "savePrescription response failure:" + t.toString());
            }
        });
    }

    private void createAndUploadPdf() {
        File pdfFile = createPdf(); // Create the PDF
        uploadFile(pdfFile); // Upload the PDF
    }

    private File createPdf() {
        Log.i("myLog", "createPdf ");
        File pdfDir = new File(Environment.getExternalStorageDirectory(), "PDFs");
        if (!pdfDir.exists()) {
            pdfDir.mkdirs();
        }
        File pdfFile = new File(pdfDir, "sample.pdf");
        //  File pdfFile = new File(getContext().getExternalFilesDir(null), "sample.pdf");
        try {
            PdfWriter writer = new PdfWriter(new FileOutputStream(pdfFile));
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);
            Log.i("myLog", "createPdf 11111");
            //  PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            //document.open();
            document.add(new Paragraph("Hello, this is a sample PDF!"));
            Log.i("myLog", "createPdf 2222");
            document.close();
            pdfDoc.close();
            writer.close();
            Log.i("myLog", "createPdf 3333");
        } catch (Exception e) {
            e.printStackTrace();
            Log.i("myLog", "createPdf exc");
        }
        Log.i("myLog", "createPdf end");
        return pdfFile;
    }


    private void uploadFile(File file) {
        Log.i("myLog", "uploadFile ");
        RequestBody requestFile = RequestBody.create(MediaType.parse("application/pdf"), file);
        MultipartBody.Part body = MultipartBody.Part.createFormData("file", file.getName(), requestFile);
        Log.i("myLog", "uploadFile b4 req: " + file.getName());
        Call<OPHubResponse.FileUploadResponse> call = fileServices.uploadFile(body);
        call.enqueue(new Callback<OPHubResponse.FileUploadResponse>() {
            @Override
            public void onResponse(Call<OPHubResponse.FileUploadResponse> call, Response<OPHubResponse.FileUploadResponse> response) {
                if (response.isSuccessful()) {
                    // Handle success
                    Log.i("myLog", "uploadFile success");
                } else {
                    // Handle error
                    Log.i("myLog", "uploadFile success else");
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.FileUploadResponse> call, Throwable t) {
                // Handle failure
            }
        });
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

    private void deletePrescription(int id, Dialog dialog) {
        Call<PostPrescriptionResponse> call = services.deletePrescription(id, hospid);
        call.enqueue(new Callback<PostPrescriptionResponse>() {
            @Override
            public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {
                try {
                    Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                    getPrescription("Edit");
                    dialog.dismiss();
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {

            }
        });

    }


}
