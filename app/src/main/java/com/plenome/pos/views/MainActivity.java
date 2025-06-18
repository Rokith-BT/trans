package com.plenome.pos.views;

import static android.app.PendingIntent.getActivity;

import static com.plenome.pos.utils.OPHubUtils.showErrorDialog;

import android.Manifest;
import android.app.Dialog;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.nfc.FormatException;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.Ndef;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Parcelable;
import android.provider.Settings;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
import com.google.android.material.navigation.NavigationView;
import com.google.gson.Gson;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanner;
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.mikhaellopez.circularimageview.CircularImageView;
import com.plenome.pos.R;
import com.plenome.pos.adapters.ExistingPatientAdapter;
import com.plenome.pos.model.ExistPatientDetail;
import com.plenome.pos.model.HospitalDetailsResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.PatientProfileQR;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.MessageEvent;
import com.plenome.pos.utils.NfcEvent;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;
import com.plenome.pos.views.nfc.NdefMessageParser;
import com.plenome.pos.views.nfc.ParsedNdefRecord;
import com.plenome.pos.views.appointment.AppointmentFragment;
import com.plenome.pos.views.billing.BillingFragment;
import com.plenome.pos.views.authentication.LoginActivity;
import com.plenome.pos.views.billing.BillingPendingFragment;
import com.plenome.pos.views.patientDetail.AddNewPatientFragment;
import com.plenome.pos.views.patientDetail.PatientProfileFragment;
import com.plenome.pos.views.vibrasense.VitalsFragment;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener, NetworkConnectionReceiver.ReceiverListener {
    PopupWindow popupWindow;
    @BindView(R.id.imgProfile)
    CircularImageView imgProfile;
    @BindView(R.id.toolbar)
    Toolbar toolbar;
    @BindView(R.id.txtTitle)
    TextView txtTitle;
    @BindView(R.id.drawer_layout)
    DrawerLayout drawerLayout;

    @BindView(R.id.imgBack)
    ImageView imgBack;

    @BindView(R.id.appBarQR)
    ImageView imgQR;

    @BindView(R.id.nav_view)
    NavigationView navigationView;

    @BindView(R.id.appBarEdtSearch)
    EditText appBarEdtSearch;

    RestServices services, fileServices;
    String imgName, imgHospitalLogo;
    ImageView popupProfile;
    Bitmap bitmap;
    GmsBarcodeScanner scanner;
    BarcodeScanner barcodeScanner;
    private static final int PERMISSION_REQUEST_CAMERA = 1;
    String apptId,hospName,AayushUniqueId, writeData, cardDetect = "";
    int patientId, hospitalID;
    private Dialog dialogInvalidQR,nfcdialog;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();

    public NfcAdapter nfcAdapter;
    PendingIntent pendingIntent;
    private Dialog dilogAppointment;
    ImageView imgClose;
    EditText edtPatientId;
    private ProgressBar appointment_progress;
    private RecyclerView recyclerView;
    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable debounceRunnable;
    private static final long DEBOUNCE_DELAY = 1500;

    boolean isLoading = false;

    List<ExistPatientDetail.Detail> patientList = new ArrayList<>();
    ExistingPatientAdapter adapter = new ExistingPatientAdapter();

    int currentAdapterPage = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //  toolbar = findViewById(R.id.toolbar); //Ignore red line errors
        setSupportActionBar(toolbar);
        ButterKnife.bind(this);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        imgName = getIntent().getStringExtra("Staff_img");
        imgName = OPHubApplication.getStaffImage();
        imgHospitalLogo = OPHubApplication.getHospitalLogo();
        OPHubApplication.appBarTitle = txtTitle;
        OPHubApplication.appBarImage = imgBack;
        OPHubApplication.appBarQR = imgQR;
        OPHubApplication.appBareditTextSearch = appBarEdtSearch;
        hospName = OPHubApplication.getHospitalName();
        hospitalID = OPHubApplication.getHospitalId();
        nfcAdapter = NfcAdapter.getDefaultAdapter(this);

        Intent intent = getIntent();
        Uri data = intent.getData();

        Log.i("myLog", "imgname:" + imgName);
        //   imgProfile = findViewById(R.id.imgProfile);
        //  toolbar.setNavigationIcon(R.drawable.arrow_left);
        navigationView = findViewById(R.id.nav_view);
        navigationView.getHeaderView(0).findViewById(R.id.txtHospName);
        View headerView = navigationView.getHeaderView(0);
        TextView txtHospName = headerView.findViewById(R.id.txtHospName);
        TextView versionTextView = findViewById(R.id.version_name);
        try {
            String versionName = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
            if (versionName.contains("-")) {
                versionName = versionName.split("-")[0];
            }
            versionTextView.setText("Version " + versionName);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        txtHospName.setText(hospName);
        showNavigationImage();
        navigationView.setNavigationItemSelectedListener(this);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.nav_open,
                R.string.nav_close) {
            @Override
            public void onDrawerOpened(@NonNull View drawerView) {
                super.onDrawerOpened(drawerView);
                callHospitalDetails();

            }

            @Override
            public void onDrawerClosed(@NonNull View drawerView) {
                super.onDrawerClosed(drawerView);

            }
        };




//        if (nfcAdapter == null) {
//            Toast.makeText(this, "No NFC", Toast.LENGTH_SHORT).show();
//            finish();
//            return;
//        }
//        else {
//            System.out.println("print card info");
//        }

        pendingIntent = getActivity(this, 0,
                new Intent(this, this.getClass())
                        .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);


        //     toggle.setDrawerIndicatorEnabled(true);
        //  Drawable drawable = ResourcesCompat.getDrawable(getResources(), R.drawable.arrow_left, this.getTheme());
        // toggle.setHomeAsUpIndicator(drawable);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction().replace(R.id.fragment_container, new AppointmentFragment()).commit();
            navigationView.setCheckedItem(R.id.nav_appointment);
        }
        boolean isConnected = checkConnection();
        if (isConnected) {
            showProfileimage("Main");

            GmsBarcodeScannerOptions options = new GmsBarcodeScannerOptions.Builder()
                    .setBarcodeFormats(
                            Barcode.FORMAT_QR_CODE,
                            Barcode.FORMAT_ALL_FORMATS)
                    .build();
            //  scanner = GmsBarcodeScanning.getClient(this);
// Or with a configured options
            scanner = GmsBarcodeScanning.getClient(this, options);

            BarcodeScannerOptions scannerOptions =
                    new BarcodeScannerOptions.Builder()
                            .setBarcodeFormats(
                                    Barcode.FORMAT_QR_CODE,
                                    Barcode.FORMAT_ALL_FORMATS)
                            .enableAllPotentialBarcodes()
                            .build();
            barcodeScanner = BarcodeScanning.getClient();
// Or, to specify the formats to recognize:
// BarcodeScanner scanner = BarcodeScanning.getClient(options);

            if (data != null) {
                Log.i("myLog", "URI :" + data.toString());
                String urlData = data.toString();
                if (urlData.contains("=")) {
                    String[] arr = urlData.split("=");
                    apptId = arr[1];
                    if (apptId.contains("APPN")) {
                        goToApptSubMenu();
                    } else {
                        /*gotoPendingBillFragment(Integer.parseInt(apptId));*/
                        gotoPendingBillFragment(AayushUniqueId);
                    }
                  /*  if (apptId.equalsIgnoreCase("billing")) {
                        gotoBillingMenu();
                    } else {
                        goToApptSubMenu();
                    }*/
                }
            }
        } else {
            showAlert(isConnected);
        }
        if (intent != null) {
            String fromScreen = intent.getStringExtra("from_screen");
            Log.i("myLog", "fromScreen:" + fromScreen);
            if (fromScreen != null && fromScreen.equalsIgnoreCase("Preview")) {
                patientId = intent.getIntExtra("patient_id", 0);
                Log.i("myLog", "patientId:" + patientId);
                PatientProfileFragment newFragment = new PatientProfileFragment();
                FragmentTransaction transaction = MainActivity.this.getSupportFragmentManager().beginTransaction();
                Bundle result = new Bundle();
                result.putString("from_screen", "Preview");
                result.putInt("patient_id", patientId);
                newFragment.setArguments(result);
                Log.i("myLog", "goToPatientScreen b4 bundle");
                transaction.replace(R.id.fragment_container, newFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);


        Tag tag = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        if (cardDetect.equalsIgnoreCase("")) {
            resolveIntent(intent);
        } else if (cardDetect.equalsIgnoreCase("cardWrite")) {
            if (tag != null) {
                writeNfcTag(tag, writeData);
                cardDetect = "";
            }
        }

    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onMessageEvent(MessageEvent event) {
        // Handle the event


        cardDetect = event.getAction();
        String jsonData = "{\"aayush_unique_id\":\"123456\"}";


        try {
            JSONObject jsonObject = new JSONObject(jsonData);

            // Update the "aayush_unique_id" value
            jsonObject.put("aayush_unique_id", event.getAayushNo());
            System.out.println("print aayus number " + jsonObject);
            System.out.println("print aayus data " + jsonData);
            writeData = String.valueOf(jsonObject);

//            Toast.makeText(this, "Received: " + writeData, Toast.LENGTH_SHORT).show();

        }catch (Exception ignored){

        }


    }

    @Override
    protected void onStart() {
        super.onStart();
        EventBus.getDefault().register(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        EventBus.getDefault().unregister(this);
    }

    public void writeNfcTag(Tag tag, String data) {
        Ndef ndef = Ndef.get(tag);

        if (ndef != null) {
            try {
                ndef.connect();
                NdefRecord ndefRecord = NdefRecord.createTextRecord("en", data);
                NdefMessage ndefMessage = new NdefMessage(new NdefRecord[]{ndefRecord});
                ndef.writeNdefMessage(ndefMessage);
                successNFC();
                ndef.close();
                EventBus.getDefault().post(new NfcEvent( "cardWriteDone"));
            } catch (IOException | FormatException e) {
                EventBus.getDefault().post(new NfcEvent("cardWriteError"));
                errorNfc();
                e.printStackTrace();
            }
        } else {
            EventBus.getDefault().post(new NfcEvent("cardWriteError"));
            errorNfc();
        }
    }

    private void errorNfc() {
        nfcdialog = new Dialog(this);
        View view = getLayoutInflater().inflate(R.layout.nfcjson, null);
        nfcdialog.setContentView(view);
        nfcdialog.getWindow().setGravity(Gravity.CENTER);
        nfcdialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        nfcdialog.setCancelable(false);
        ImageView imgClose = nfcdialog.findViewById(R.id.imgClose);
        TextView txtMsgnfc = nfcdialog.findViewById(R.id.txtMsg);
        txtMsgnfc.setText("Invalid NFC Card");
        LottieAnimationView lottie_nfc = nfcdialog.findViewById(R.id.lottie_nfc);
        lottie_nfc.setAnimation(R.raw.error);
        lottie_nfc.playAnimation();

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                nfcdialog.dismiss();
            }
        });

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(nfcdialog.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        nfcdialog.getWindow().setAttributes(lp);
        nfcdialog.show();
    }

    public void successNFC() {
        nfcdialog = new Dialog(this);
        View view = getLayoutInflater().inflate(R.layout.nfcjson, null);
        nfcdialog.setContentView(view);
        nfcdialog.getWindow().setGravity(Gravity.CENTER);
        nfcdialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        nfcdialog.setCancelable(false);
        ImageView imgClose = nfcdialog.findViewById(R.id.imgClose);
        TextView txtMsgnfc = nfcdialog.findViewById(R.id.txtMsg);
        txtMsgnfc.setText("Data Written Successfully");
        LottieAnimationView lottie_nfc = nfcdialog.findViewById(R.id.lottie_nfc);
        lottie_nfc.setAnimation(R.raw.success);
        lottie_nfc.playAnimation();

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                nfcdialog.dismiss();
            }
        });
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (nfcdialog.isShowing()) {
                nfcdialog.dismiss();
            }
        }, 1000);


        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(nfcdialog.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        nfcdialog.getWindow().setAttributes(lp);
        nfcdialog.show();
    }


    private void resolveIntent(Intent intent) {
        String action = intent.getAction();

        if (NfcAdapter.ACTION_TAG_DISCOVERED.equals(action)
                || NfcAdapter.ACTION_TECH_DISCOVERED.equals(action)
                || NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action)) {
            Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
            NdefMessage[] msgs;

            if (rawMsgs != null) {
                msgs = new NdefMessage[rawMsgs.length];


                for (int i = 0; i < rawMsgs.length; i++) {
                    msgs[i] = (NdefMessage) rawMsgs[i];
                }

                displayMsgs(msgs);
            }
            // if card is empty render card details
            /*else {
                System.out.println("print empty data ");
                byte[] empty = new byte[0];
                byte[] id = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);
                Tag tag = (Tag) intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
                byte[] payload = dumpTagData(tag).getBytes();
                NdefRecord record = new NdefRecord(NdefRecord.TNF_UNKNOWN, empty, id, payload);
                NdefMessage msg = new NdefMessage(new NdefRecord[] {record});
                msgs = new NdefMessage[] {msg};
            }*/


        }
    }

    private void displayMsgs(NdefMessage[] msgs) {
        if (msgs == null || msgs.length == 0){
            showErrorDialog(this,"Invalid NFC data format. Please scan a valid NFC tag.");
            return;
        }


        System.out.println("print raw message" +msgs);
        StringBuilder builder = new StringBuilder();
        List<ParsedNdefRecord> records = NdefMessageParser.parse(msgs[0]);
        System.out.println("print message " + msgs[0]);
        final int size = records.size();

        for (int i = 0; i < size; i++) {
            ParsedNdefRecord record = records.get(i);
            String str = record.str();
            builder.append(str).append("\n");
        }

        System.out.println("print builder"+ builder.toString());
        String value = builder.toString();
        try {
            JSONObject obj = new JSONObject(builder.toString());
            String uniqueId = obj.getString("aayush_unique_id");
            successNFC();
            goToPatientScreen(/*0, salutation, patientName, dob, age, gender, email, address, image, dial_code, mobile, abhaNo, blood_group, pincode, emergency_mobile_no, bloodGrpId,*/uniqueId);
        } catch (JSONException e) {
            e.printStackTrace();


        }


    }


    @Override
    protected void onResume() {
        super.onResume();
        // call method
        Log.i("myLog", "onResume.........");

        // initialize intent filter
        IntentFilter intentFilter = new IntentFilter();

        // add action
        intentFilter.addAction("android.new.conn.CONNECTIVITY_CHANGE");

        // register receiver
        registerReceiver(networkConnectionReceiver, intentFilter);
        // Initialize listener
        NetworkConnectionReceiver.Listener = this;
        boolean isConnected = checkConnection();

        if (!isConnected)
            showAlert(isConnected);

        if (nfcAdapter != null) {
            if (!nfcAdapter.isEnabled())
                showWirelessSettings();

            nfcAdapter.enableForegroundDispatch(this, pendingIntent, null, null);
        }
    }

    private void showWirelessSettings() {
        Toast.makeText(this, "You need to enable NFC", Toast.LENGTH_SHORT).show();
        Intent intent = new Intent(Settings.ACTION_WIRELESS_SETTINGS);
        startActivity(intent);
    }

    public void callHospitalDetails(){

        Call<HospitalDetailsResponse> call = services.getHospitalDetails(hospitalID);
        call.enqueue(new Callback<HospitalDetailsResponse>() {
            @Override
            public void onResponse(Call<HospitalDetailsResponse> call, Response<HospitalDetailsResponse> response) {
                try {
                    if (response.isSuccessful()) {

                        hospName = response.body().getDetails().getHospitalName();
                        imgHospitalLogo = response.body().getDetails().getHospitalLogo();
                        showNavigationImage();
                        View headerView = navigationView.getHeaderView(0);
                        TextView txtHospital = headerView.findViewById(R.id.txtHospName);
                        txtHospital.setText(response.body().getDetails().getHospitalName());

                    } else {

                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<HospitalDetailsResponse> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }


    @Override
    protected void onPause() {
        super.onPause();
        // call method
        Log.i("myLog", "onPause...........");
        unregisterReceiver(networkConnectionReceiver);
        //  boolean isConnected = checkConnection();
        //if (!isConnected)
        //  showAlert(isConnected);
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.nav_appointment:
                txtTitle.setText(R.string.appointment);
                imgBack.setVisibility(View.GONE);
                AppointmentFragment newFragment = new AppointmentFragment();
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.fragment_container, newFragment);
                transaction.addToBackStack(null);
                transaction.commit();
                break;
            case R.id.nav_emr:
                txtTitle.setText(R.string.emr);
                imgBack.setVisibility(View.GONE);
                EMRmenuFragment emrMenuFragment = new EMRmenuFragment();
                FragmentTransaction transEmr = getSupportFragmentManager().beginTransaction();
                transEmr.replace(R.id.fragment_container, emrMenuFragment);
                transEmr.addToBackStack(null);
                transEmr.commit();
                break;
            case R.id.nav_abha:
                txtTitle.setText(R.string.abha);
                imgBack.setVisibility(View.GONE);
                CreateAbhaFragment abhaFragment = new CreateAbhaFragment();
                FragmentTransaction transAbha = getSupportFragmentManager().beginTransaction();
                transAbha.replace(R.id.fragment_container, abhaFragment);
                transAbha.addToBackStack(null);
                transAbha.commit();

                break;
            case R.id.nav_vitals:
                txtTitle.setText(R.string.vitals);
                imgBack.setVisibility(View.GONE);
                VitalsFragment vitalsFragment = new VitalsFragment();
                FragmentTransaction transVital = getSupportFragmentManager().beginTransaction();
                transVital.replace(R.id.fragment_container, vitalsFragment);
                transVital.addToBackStack(null);
                transVital.commit();
                //   Intent intent = new Intent(MainActivity.this, CreateClinicalNotesPdf.class);
                //  startActivity(intent);
                break;
            case R.id.nav_billing:
                PreferenceManager.setString(PreferenceManager.DEVICE_CLICK, "");
                txtTitle.setText(R.string.billing);
                imgBack.setVisibility(View.GONE);
                BillingFragment billingFragment = new BillingFragment();
                FragmentTransaction transBill = getSupportFragmentManager().beginTransaction();
                transBill.replace(R.id.fragment_container, billingFragment, "Billing");
                transBill.addToBackStack(null);
                transBill.commit();
                break;
        }
        drawerLayout.closeDrawer(GravityCompat.START);

        return true;
    }

    private Boolean checkCameraPermission() {
        boolean result = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == (PackageManager.PERMISSION_GRANTED);
        boolean result1 = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) == (PackageManager.PERMISSION_GRANTED);
        return result && result1;
    }

    // Requesting camera permission
    private void requestCameraPermission() {
        requestPermissionLauncher.launch(Manifest.permission.CAMERA);
        requestPermissionLauncher.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE);
    }

    private ActivityResultLauncher<String> requestPermissionLauncher = registerForActivityResult(
            new ActivityResultContracts.RequestPermission(),
            new ActivityResultCallback<Boolean>() {
                @Override
                public void onActivityResult(Boolean result) {
                    if (result) {
                        clickQR();
                    } else {
                    }
                }
            }
    );




    @OnClick(R.id.appBarQR)
    public void clickQR() {
        if (!checkCameraPermission()) {
            requestCameraPermission();
        } else {
            Log.i("myLog", "clciked QR icon");
      /*  if (checkSelfPermission(Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, REQUEST_CODE);
        }*/
            scanner
                    .startScan()
                    .addOnSuccessListener(
                            barcode -> {
                                String rawValue = barcode.getRawValue();
                                Log.i("myLog", "Raw value::::::" + rawValue);
                                // Toast.makeText(this, rawValue, Toast.LENGTH_SHORT).show();
                                // Task completed successfully
                                if (rawValue.contains("QR_Type") || rawValue.contains("hidn")) {
                                    try {
                                        String qrType = "";
                                        JSONObject obj = new JSONObject(rawValue);
                                        if (obj.has("QR_Type")) {
                                            qrType = obj.getString("QR_Type");
                                            if (qrType.equalsIgnoreCase("Patient_QR")) {
                                                JSONObject jObj = obj.getJSONObject("profile_details");
                                                parsePatientQR(jObj);
                                            } else if (qrType.equalsIgnoreCase("Appointment_QR")) {
                                                JSONObject jObj = obj.getJSONObject("Appointment_details");
                                                parseApptQRJson(jObj);
                                            }
                                        } else if (obj.has("hidn")) {
                                            parseABHAQR(obj);
                                        }

                                        Log.i("myLog", " after try");

                                    } catch (JSONException e) {
                                        Log.i("myLog", "exception:" + e.toString());
                                        e.printStackTrace();
                                    }
                                } else {
                                    showInvalidQRDialog("Invalid QR");
                                }

                            })
                    .addOnCanceledListener(
                            () -> {
                                Log.i("myLog", "addOnCanceledListener");
                                // Task canceled
                            })
                    .addOnFailureListener(
                            e -> {
                                Log.i("myLog", "addOnFailureListener");
                                // Task failed with an exception
                            });

        }
    }


    @OnClick(R.id.appBarEdtSearch)
    public void SearchPatientDialog(){
        showBookAppoinment();

    }

    private void showBookAppoinment() {
           dilogAppointment = new Dialog(this);
            View view = getLayoutInflater().inflate(R.layout.dilog_search_appbar, null);
            dilogAppointment.setContentView(view);
            dilogAppointment.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
            dilogAppointment.getWindow().setGravity(Gravity.CENTER);
            imgClose = dilogAppointment.findViewById(R.id.imgClose);
            edtPatientId = dilogAppointment.findViewById(R.id.edtPatientId);
            appointment_progress = dilogAppointment.findViewById(R.id.appointment_progress);
            recyclerView = dilogAppointment.findViewById(R.id.recyclerView);
            recyclerView.setLayoutManager(new LinearLayoutManager(this));
            recyclerView.setAdapter(adapter);




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
        request.setHospitalId(hospitalID);
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
                        add_new.setVisibility(View.GONE);
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
                                    System.out.println("print inside call" + detail.getId());
                                    dilogAppointment.dismiss();
    //
                                    BillingPendingFragment newFragment = new BillingPendingFragment();
                                    FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                                    Bundle result = new Bundle();
                                    result.putString("from_screen", "Main");
                                    result.putString("fromBill", "Bill");
                                    result.putInt("patient_id", Integer.parseInt(detail.getId()));
                                    newFragment.setArguments(result);
                                    transaction.replace(R.id.fragment_container, newFragment, "Pending_Bill");
                                    transaction.addToBackStack(null);
                                    transaction.commitAllowingStateLoss();
                                }
                            });
                        }
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<ExistPatientDetail> call, Throwable t) {
                Log.i("myLog", "getExistPatientDet response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(MainActivity.this);
            }
        });

    }

    @OnClick(R.id.imgBack)
    public void clickBackIcon() {
        Log.i("myLog", "main imgBack onclick");
        if (OPHubApplication.selApptOption.equalsIgnoreCase("Confirm")||OPHubApplication.selApptOption.equalsIgnoreCase("Patient Profile"))
            gotoAppointmentFragment();
        else
            getSupportFragmentManager().popBackStack();

    }

    @OnClick(R.id.imgProfile)
    public void clickProfileImg() {
        LayoutInflater inflater = (LayoutInflater) getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        popupWindow = new PopupWindow(
                inflater.inflate(R.layout.popup_profile_details, null, false),
                dpToPx(300), dpToPx(190), true);
        popupWindow.showAtLocation(findViewById(R.id.imgProfile), Gravity.TOP | Gravity.END, dpToPx(20), 0);

        RelativeLayout rel = popupWindow.getContentView().findViewById(R.id.relLogout);
        TextView txtName = popupWindow.getContentView().findViewById(R.id.txtName);
        TextView txtEmail = popupWindow.getContentView().findViewById(R.id.txtEmail);
        popupProfile = popupWindow.getContentView().findViewById(R.id.imgPhoto);
        if (bitmap != null) {
            popupProfile.setImageBitmap(bitmap);
        } else {
            showProfileimage("Popup");
        }
        txtName.setText(OPHubApplication.getStaffName());
        txtEmail.setText(OPHubApplication.getUserName());
        rel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                PreferenceManager.setBoolean(PreferenceManager.IS_LOGGED_IN, false);
                Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                intent.putExtra("From_Screen", "Main_Screen");
                startActivity(intent);
                finish();
            }
        });
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    @Override
    public void onBackPressed() {
        Log.i("myLog", "onbackPressed");
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            Log.i("myLog", "onbackPressed if");
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            int count = getSupportFragmentManager().getBackStackEntryCount();

            if (count == 0) {
                super.onBackPressed();

            } else {

                Log.i("myLog", "onbackPressed else");
                BillingPendingFragment myFragment = (BillingPendingFragment) getSupportFragmentManager().findFragmentByTag("Pending_Bill");
                if (myFragment != null && myFragment.isVisible()) {
                    Log.i("myLog", "BillingPendingFragment fragment visible");
                    OPHubApplication.relFragment.setVisibility(View.GONE);
                    OPHubApplication.relMain.setVisibility(View.VISIBLE);
                    OPHubApplication.appBarImage.setVisibility(View.GONE);
                    OPHubApplication.appBarTitle.setText(R.string.billing);
                    gotBillingFragment();
                }
                AppointmentSubMenusFragment myFragment1 = (AppointmentSubMenusFragment) getSupportFragmentManager().findFragmentByTag("QR");
                if (myFragment1 != null && myFragment1.isVisible()) {
                    Log.i("myLog", "submenu myFragment1 visible");
                    OPHubApplication.relFragment.setVisibility(View.GONE);
                    OPHubApplication.relMain.setVisibility(View.VISIBLE);
                    OPHubApplication.appBarImage.setVisibility(View.GONE);
                    OPHubApplication.appBarTitle.setText(R.string.appointment);
                    gotoAppointmentFragment();
                }


                PatientProfileFragment profileFragment = (PatientProfileFragment) getSupportFragmentManager().findFragmentByTag("Patient");
                if (profileFragment != null && profileFragment.isVisible()) {
                    Log.i("myLog", "submenu fragment visible");
                    OPHubApplication.relFragment.setVisibility(View.GONE);
                    OPHubApplication.relMain.setVisibility(View.VISIBLE);
                    gotoAppointmentFragment();
                }
                // getSupportFragmentManager().popBackStack();

            }
        }
    }


    private void showNavigationImage() {
        Log.i("myLog", "showProfileimage");
        Log.i("myLog", "imgName:" + imgHospitalLogo);
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setValue(imgHospitalLogo);
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
                                    if (bitmap != null) {
                                        View headerView = navigationView.getHeaderView(0);
                                        CircularImageView imgLogo = headerView.findViewById(R.id.imgLogo);
                                        imgLogo.setImageBitmap(bitmap);
                                        Log.i("myLog", "after image set");
                                    }
                                }
                            }
                        } catch (Exception e) {
                            //  throw new RuntimeException(e);
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(MainActivity.this);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "getAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(MainActivity.this);
            }
        });
    }

    private void showProfileimage(String option) {
        Log.i("myLog", "showProfileimage");
        Log.i("myLog", "imgNames:" + imgName);
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
                            if (bytes != null) {
                                byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                                if (decodedImageBytes != null) {
                                    Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                                    if (bitmap != null) {
                                        if (option.equalsIgnoreCase("Main"))
                                            imgProfile.setImageBitmap(bitmap);
                                        else if (option.equalsIgnoreCase("Popup"))
                                            popupProfile.setImageBitmap(bitmap);
                                        Log.i("myLog", "after image set");
                                    }
                                }
                            }
                        } catch (Exception e) {
                            //  throw new RuntimeException(e);
                        }

                    } else {
                        Log.i("myLog", "server contact failed");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(MainActivity.this);
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "getAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(MainActivity.this);
            }
        });
    }

    private void initQRCodeScanner() {
        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE);
        integrator.setOrientationLocked(true);
        integrator.setPrompt("Scan a QR code");
        integrator.initiateScan();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CAMERA) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                initQRCodeScanner();
            } else {
                Toast.makeText(this, "Camera permission is required", Toast.LENGTH_LONG).show();
                finish();
            }

        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() == null) {
                Toast.makeText(this, "Scan cancelled", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(this, result.getContents(), Toast.LENGTH_LONG).show();
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    public void goToPatientProfileScreen(String hid, String patientName, String gender, String dob, String address, String mobile, String abhaNo, String json) {
        Log.i("myLog", "goToPatientProfileScreen");
        PatientProfileFragment newFragment = new PatientProfileFragment();
        FragmentTransaction transaction = MainActivity.this.getSupportFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_screen", "Main");
        result.putString("name", patientName);
        result.putString("gender", gender);
        result.putString("phone", mobile);
        result.putString("abha_no", abhaNo);
        result.putString("dob", dob);
        result.putString("hid", hid);
        result.putString("address", address);
        result.putString("json", json);
        result.putString("qr_type", "ABHA");
        newFragment.setArguments(result);
        Log.i("myLog", "goToPatientScreen b4 bundle");
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.setReorderingAllowed(true);
        transaction.commitAllowingStateLoss();
    }

    public void goToPatientScreen(/*int patientId, String salutation, String patientName, String dob, int age, String gender,
                                  String email, String address, String image, String dial_code, String mobile, String abhaNo,
                                  String bloodGroup, String pincode, String emergency_mobile_no, int bloodGrpId,*/String AayushUniqueId) {
        Log.i("myLog", "goToPatientScreen");
        PatientProfileFragment newFragment = new PatientProfileFragment();
        FragmentTransaction transaction = MainActivity.this.getSupportFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_screen", "Main");
//        result.putString("name", patientName);
//        result.putString("gender", gender);
//        result.putInt("patient_id", patientId);
//        result.putString("bloodGroup", bloodGroup);
//        result.putInt("bloodGroupId", bloodGrpId);
//        result.putString("phone", mobile);
//        result.putInt("age", age);
//        result.putString("email", email);
//        result.putString("abha_no", abhaNo);
//        result.putString("dob", dob);
//        result.putString("address", address);
//        result.putString("salutation", salutation);
//        result.putString("image", image);
//        result.putString("dial_code", dial_code);
//        result.putString("pincode", pincode);
//        result.putString("emergency_mobile_no", emergency_mobile_no);
        result.putString("qr_type", "Patient_QR");
        result.putString("aayush_unique_id", AayushUniqueId);

        newFragment.setArguments(result);
        Log.i("myLog", "goToPatientScreen b4 bundle");
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.setReorderingAllowed(true);
        //  transaction.commit();
        transaction.commitAllowingStateLoss();
    }

    public void gotoPendingBillFragment(String aayushUniqueId) {
        BillingPendingFragment newFragment = new BillingPendingFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_screen", "Main");
        result.putString("patient_id", aayushUniqueId);
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment, "Pending_Bill");
        transaction.addToBackStack(null);
//        transaction.commit();
        transaction.commitAllowingStateLoss();
    }

    public void gotoAppointmentFragment() {
        txtTitle.setText(R.string.appointment);
        imgBack.setVisibility(View.GONE);
        AppointmentFragment newFragment = new AppointmentFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();

    }

    public void gotBillingFragment() {
        txtTitle.setText(R.string.billing);
        imgBack.setVisibility(View.GONE);
        BillingFragment billingFragment = new BillingFragment();
        FragmentTransaction transBill = getSupportFragmentManager().beginTransaction();
        transBill.replace(R.id.fragment_container, billingFragment, "Billing");
        transBill.addToBackStack(null);
        transBill.commit();

    }

    public void parsePatientQR(JSONObject obj) {
        try {

             AayushUniqueId = obj.getString("aayush_unique_id");
            System.out.println("aayush_unique_id"+AayushUniqueId);

            BillingPendingFragment billPendingFragment = (BillingPendingFragment) getSupportFragmentManager().findFragmentByTag("Pending_Bill");
            BillingFragment billFragment = (BillingFragment) getSupportFragmentManager().findFragmentByTag("Billing");
            if (billFragment != null && billFragment.isVisible()) {
              /*  addNewPatient(salutation, patientName, dob,age, gender, String.valueOf(bloodGrpId),
                        dial_code, mobile, email, address, abhaNo,
                        "", "", emergency_mobile_no);*/
                gotoPendingBillFragment(AayushUniqueId);

            } else if (billPendingFragment != null && billPendingFragment.isVisible()) {
               /* addNewPatient(salutation, patientName, dob,age, gender, String.valueOf(bloodGrpId),
                        dial_code, mobile, email, address, abhaNo,
                        "", "", emergency_mobile_no);*/
                gotoPendingBillFragment(AayushUniqueId);
                System.out.println("aayush_unique_idss"+AayushUniqueId);
            } else {
                System.out.println("print qr code");

                QRcodePatientDataSet(AayushUniqueId);


            }

        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

    }

    private void QRcodePatientDataSet(String aayushNo) {
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", aayushNo);
        requestData.put("hospital_id", String.valueOf(hospitalID));
        Log.i("mylog", "get AAyush response:" + new Gson().toJson(requestData));
        Call<PatientProfileQR> call = services.getQRPatientProfile(requestData);
        call.enqueue(new Callback<PatientProfileQR>() {

            @Override
            public void onResponse(Call<PatientProfileQR> call, Response<PatientProfileQR> response) {
                //log.i("myLog", "addNewPatient response:");
                //log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                try {
                    if (response.body() != null) {
                        PatientProfileQR res = response.body();
                        String status = res.getStatus();
                        if (!status.equalsIgnoreCase("failed")){
                            goToPatientScreen(/*0, salutation, patientName, dob, age, gender, email, address, image, dial_code, mobile, abhaNo, blood_group, pincode, emergency_mobile_no, bloodGrpId,*/aayushNo);
                        }else {
                            showInvalidQRDialog("Invalid QR");
                        }
                    } else {
                        Log.i("myLog", "response else part");
                    }
                }catch (Exception e){

                }

            }

            @Override
            public void onFailure(Call<PatientProfileQR> call, Throwable t) {
                Log.i("myLog", "addNewPatient response failure:" + t.toString());
                Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
            }
        });


    }

    public void parseABHAQR(JSONObject obj) {
        try {
            Log.i("myLog", "parseABHAQR");
            String hid = "";
            if (obj.has("hid"))
                hid = obj.getString("hid");
            String patientName = obj.getString("name");
            String gender = obj.getString("gender");
            String dob = obj.getString("dob");
            String address = obj.getString("address");
            String mobile = obj.getString("mobile");
            String abhaNo = obj.getString("hidn");
            Log.i("myLog", "parseABHAQR end");

            if (gender.equalsIgnoreCase("M"))
                gender = "Male";
            else if (gender.equalsIgnoreCase("F"))
                gender = "Female";
            goToPatientProfileScreen(hid, patientName, gender, dob, address, mobile, abhaNo, obj.toString());
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

    }

    public void parseApptQRJson(JSONObject obj) throws JSONException {

        Log.i("myLog", "parseApptQRJson");
        int patientId = obj.getInt("patient_id");
        //  int doctorId = obj.getInt("doctor_id");
        String apptId = obj.getString("id");
        int hospitalId = obj.getInt("Hospital_id");
        if (hospitalId == OPHubApplication.getHospitalId()) {
            AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
            FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            //  result.putInt("doctor_id", doctorId);
            result.putString("patient_id", String.valueOf(patientId));
            result.putString("appt_id", apptId);
            result.putString("from_screen", "Main");
            newFragment.setArguments(result);
            Log.i("myLog", "parseApptQRJson6666666666666");
            transaction.replace(R.id.fragment_container, newFragment, "QR");
            transaction.addToBackStack(null);
            transaction.setReorderingAllowed(true);
            transaction.commitAllowingStateLoss();
        } else {
            showInvalidQRDialog("QR is not related to this hospital!");
        }
        Log.i("myLog", "parseApptQRJson end");
    }

    public void showInvalidQRDialog(String message) {
        dialogInvalidQR = new Dialog(this);
        View view = getLayoutInflater().inflate(R.layout.dialog_invalid_qr, null);
        dialogInvalidQR.setContentView(view);
        dialogInvalidQR.getWindow().setGravity(Gravity.CENTER);
        ImageView imgClose = dialogInvalidQR.findViewById(R.id.imgClose);
        TextView txtMsg = dialogInvalidQR.findViewById(R.id.txtMsg);
        txtMsg.setText(message);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogInvalidQR.dismiss();
            }
        });

        dialogInvalidQR.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogInvalidQR.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        dialogInvalidQR.getWindow().setAttributes(lp);
    }


    @Override
    public void onNetworkChange(boolean isConnected) {
        showAlert(isConnected);
    }

    public boolean checkConnection() {
        // Initialize connectivity manager
        ConnectivityManager manager = (ConnectivityManager) getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);

        // Initialize network info
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();

        // get connection status
        boolean isConnected = networkInfo != null && networkInfo.isConnectedOrConnecting();
        return isConnected;

    }

    private void showAlert(boolean isConnected) {
        // check condition
        if (!isConnected)
            showNoNetworkDialog();
    }

    public void showNoNetworkDialog() {
        Dialog dialogNoNetwork = new Dialog(this);
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

//    private void getExistPatientDet(int patientId, String salutation, String patientName, String dob, int age, String gender,
//                                    String email, String address, String image, String dial_code, String mobile, String abhaNo,
//                                    String bloodGroup, String pincode, String emergency_mobile_no, int bloodGrpId) {
//        OPHubRequests.GetExistPatientDetReq request = new OPHubRequests.GetExistPatientDetReq();
//        request.setHospitalId(OPHubApplication.getHospitalId());
//        request.setSearchBy("mobile");
//        request.setValue(mobile);
//        Log.i("mylog", "getExistPatientDet request:" + new Gson().toJson(request));
//        Call<List<ExistPatientDetResponse>> call = services.getExistPatientDet(request);
//        call.enqueue(new Callback<List<ExistPatientDetResponse>>() {
//
//            @Override
//            public void onResponse(Call<List<ExistPatientDetResponse>> call, Response<List<ExistPatientDetResponse>> response) {
//                Log.i("myLog", "getExistPatientDet response:");
//                Log.i("mylog", "getExistPatientDet response:" + new Gson().toJson(response.body()));
//                if (response.body() != null) {
//                    Log.i("myLog", "getExistPatientDet response isSuccess:" + response.body().toString());
//                    List<ExistPatientDetResponse> list = response.body();
//                    ExistPatientDetResponse resp = list.get(0);
//                    String message = resp.getMessage();
//                    Log.i("myLog", "message:" + message);
//                    if (message != null) {
//                        goToPatientScreen(0, salutation, patientName, dob, age, gender, email, address, image, dial_code, mobile, abhaNo, bloodGroup, pincode, emergency_mobile_no, bloodGrpId);
//                    } else {
//                        gotoPendingBillFragment(resp.getId());
//                    }
//                } else
//                    goToPatientScreen(0, salutation, patientName, dob, age, gender, email, address, image, dial_code, mobile, abhaNo, bloodGroup, pincode, emergency_mobile_no, bloodGrpId);
//            }
//
//            @Override
//            public void onFailure(Call<List<ExistPatientDetResponse>> call, Throwable t) {
//                Log.i("myLog", "getExistPatientDet response failure:" + t.toString());
//                goToPatientScreen(0, salutation, patientName, dob, age, gender, email, address, image, dial_code, mobile, abhaNo, bloodGroup, pincode, emergency_mobile_no, bloodGrpId);
//                //  OPHubUtils.showUnknownErrorDialog(MainActivity.this);
//            }
//        });
//    }

/*
    private void addNewPatient(String salutationStr, String nameStr, String dobStr,Integer age, String genderStr, String bloodGroupId,
                               String dialCodeStr, String phoneStr, String emailStr, String addressStr, String abhaNoStr,
                               String insuranceNo, String insuranceValidity, String emergencyNoStr) {
        Log.i("mylog", "addNewPatient");
        OPHubRequests.AddNewPatientRequest request = new OPHubRequests.AddNewPatientRequest();
        request.setSalutation(salutationStr);
        request.setPatientName(nameStr);
        request.setDob(dobStr);
        request.setDialCode(dialCodeStr);
        request.setGender(genderStr);
        request.setBloodBankId(bloodGroupId);
        request.setMobile(phoneStr);
        request.setEmail(emailStr);
        request.setAddress(addressStr);
        request.setAbhaNo(abhaNoStr);
        request.setHospId(OPHubApplication.getHospitalId());
        request.setInsuranceId(insuranceNo);
        request.setEmergencyNo(emergencyNoStr);
        request.setInsuranceValidity(insuranceValidity);
        request.setAge(age);
        Log.i("mylog", "addNewPatient request:" + new Gson().toJson(request));
        Call<List<DataResponse>> call = services.addPatient(request);
        call.enqueue(new Callback<List<DataResponse>>() {

            @Override
            public void onResponse(Call<List<DataResponse>> call, Response<List<DataResponse>> response) {
                Log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    Log.i("myLog", "addNewPatient response isSuccess:" + response.body().toString());
                    List<DataResponse> list = response.body();
                    if (list != null && list.size() > 0) {
                        DataResponse res = list.get(0);
                        String status = res.getStatus();
                        String message = res.getMessage();
                        String patientType = res.getPatientType();
                        Log.i("myLog", "patient type:" + patientType);
                        DataResponse.Details details = res.getDetails();
                        int patientId = details.getPatientId();
                        if (status != null && status.equalsIgnoreCase("Success")) {
                            gotoPendingBillFragment(patientId);
                        }
                        Log.i("myLog", "addNewPatient  patientId:" + patientId);
                    }
                }
            }

            @Override
            public void onFailure(Call<List<DataResponse>> call, Throwable t) {
                Log.i("myLog", "addNewPatient response failure:" + t.toString());
                Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
                //  call.clone().enqueue(this);
            }
        });
    }
*/

    private void goToApptSubMenu() {
        AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("appt_id", apptId);
        result.putString("from_screen", "Main_UPI");
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void gotoBillingMenu() {
        BillingFragment billingFragment = new BillingFragment();
        FragmentTransaction transBill = getSupportFragmentManager().beginTransaction();
        transBill.replace(R.id.fragment_container, billingFragment, "Billing");
        transBill.addToBackStack(null);
        transBill.commit();
    }

}