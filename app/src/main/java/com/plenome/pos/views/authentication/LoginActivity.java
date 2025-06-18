package com.plenome.pos.views.authentication;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.LoginResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.MainActivity;
import com.plenome.pos.views.OPHubApplication;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity implements NetworkConnectionReceiver.ReceiverListener {
    String fromScreen = "", email = "";
    private RestServices services;
    @BindView(R.id.email)
    EditText edtEmail;
    @BindView(R.id.password)
    EditText edtPwd;

    @BindView(R.id.chkPassword)
    CheckBox chkPwd;

    @BindView(R.id.btn_login)
    Button btnLogin;

    @BindView(R.id.chkRemPwd)
    CheckBox remPwd;
    @BindView(R.id.invalid)
    TextView invalid;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_login);
        ButterKnife.bind(this);
        fromScreen = getIntent().getStringExtra("From_Screen");
        email = getIntent().getStringExtra("email");
        services = RetrofitInstance.createService(RestServices.class);
        invalid.setText("Invalid Email or Password");
        invalid.setVisibility(View.GONE);

        boolean isRemPwd = PreferenceManager.getBoolean(PreferenceManager.IS_REM_PWD, false);
        if (isRemPwd) {
            String username = OPHubApplication.getUserName();
            String pwd = OPHubApplication.getPassword();
            remPwd.setChecked(true);
            edtEmail.setText(username);
            edtPwd.setText(pwd);
        }
        edtEmail.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                checkSignInButton();
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
        edtPwd.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                checkSignInButton();
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
        chkPwd.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    //  chkPwdVisibility.setBackground(getResources().getDrawable(R.drawable.visibility_off));
                    edtPwd.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    //   chkPwdVisibility.setBackground(getResources().getDrawable(R.drawable.visibility_on));
                    edtPwd.setTransformationMethod(PasswordTransformationMethod.getInstance());

                }
            }
        });

    }

    public static boolean isValidPassword(String password) {
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        return password != null && password.matches(passwordPattern);
    }

    @OnClick(R.id.btn_login)
    public void signin(View v) {
        String username = edtEmail.getText().toString();
        String pwd = edtPwd.getText().toString();
        if (username.length() == 0) {
            Toast.makeText(LoginActivity.this, "Please enter username", Toast.LENGTH_SHORT).show();
            return;
        }
    /*    if (isValidPassword(pwd)) {
            Toast.makeText(this, "Password is valid", Toast.LENGTH_SHORT).show();
        }else {
            Toast.makeText(this, "Password is  Not valid", Toast.LENGTH_SHORT).show();
        }*/
        if (pwd.length() == 0) {
            Toast.makeText(LoginActivity.this, "Please enter password", Toast.LENGTH_SHORT).show();
            return;
        }
        if (remPwd.isChecked()) {
            PreferenceManager.setBoolean(PreferenceManager.IS_REM_PWD, true);
            PreferenceManager.setString(PreferenceManager.USER_NAME, username);
            PreferenceManager.setString(PreferenceManager.PASSWORD, pwd);
        } else {
            PreferenceManager.setBoolean(PreferenceManager.IS_REM_PWD, false);
            PreferenceManager.setString(PreferenceManager.USER_NAME, username);
            PreferenceManager.setString(PreferenceManager.PASSWORD, "");
        }

        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            login(username, pwd);
        }

    }

    private void checkSignInButton(){
        edtEmail.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_gray_outline));
        edtPwd.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_gray_outline));
        if (edtEmail.getText().length() != 0  && edtPwd.getText().length() != 0){
            btnLogin.setEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.rounded_rectangle_blue);
            btnLogin.setBackground(drawable);
            invalid.setVisibility(View.GONE);
        }else {
            Drawable drawable = getResources().getDrawable(R.drawable.rounded_rectangle_grey);
            btnLogin.setBackground(drawable);
            btnLogin.setEnabled(false);
            invalid.setVisibility(View.GONE);
        }
    }

    @OnClick(R.id.forgot_password)
    public void forgotPwd() {
        Intent intent = new Intent(LoginActivity.this, ForgotPwdActivity.class);
        startActivity(intent);
    }

    private void login(String username, String password) {
        OPHubRequests.LoginRequest request = new OPHubRequests.LoginRequest();
        request.setUserName(username);
        request.setPassword(password);
        Log.i("mylog", "Login request:" + new Gson().toJson(request));
        Call<LoginResponse> call = services.login(request);
        call.enqueue(new Callback<LoginResponse>() {

            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                try {
                    //Log.i("myLog", "Login response:");
                    Log.i("mylog", "Login response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "Login response isSuccess:" + response.body().toString());
                        LoginResponse loginResponse = response.body();
                        String message = loginResponse.getMessage();
                        String errMsg = loginResponse.getErrMsg();
                        String status = loginResponse.getStatus();
                        LoginResponse.Details details = loginResponse.getDetails();
                        String staffName = details.getStaffName();
                        String staffImg = details.getStaffImg();
                        String employeeID = details.getEmployeeID();
                        int hospitalId = details.getHospitalId();
                        int staffId = details.getStaffId();
                        int resetStatus = details.getResetStatus();
                        String roleName = details.getRoleName();
                        String hospitalLogo = details.getHospitalLogo();
                        String hospitalImage = details.getHospitalImage();
                        PreferenceManager.setString(PreferenceManager.USER_TYPE, roleName);
                        PreferenceManager.setString(PreferenceManager.HOSPITAL_LOGO, hospitalLogo);
                        PreferenceManager.setString(PreferenceManager.HOSPITAL_IMAGE, hospitalImage);
                        PreferenceManager.setString(PreferenceManager.STAFF_NAME, staffName);
                        PreferenceManager.setString(PreferenceManager.STAFF_IMAGE, staffImg);
                        PreferenceManager.setString(PreferenceManager.EMPLOYEE_ID, employeeID);
                        PreferenceManager.setInt(PreferenceManager.HOSPITAL_ID, hospitalId);
                        PreferenceManager.setInt(PreferenceManager.STAFF_ID, staffId);
                        PreferenceManager.setString(PreferenceManager.HOSPITAL_NAME, details.getHospName());
                        PreferenceManager.setString(PreferenceManager.HOSPITAL_ADDRESS, details.getHospAddress());
                        PreferenceManager.setString(PreferenceManager.HITYPE_ID, details.getHipId());
                        PreferenceManager.setString(PreferenceManager.ROLE_NAME, details.getRoleName());
                        PreferenceManager.setString(PreferenceManager.ACCESS_TOKEN, details.getAccessToken());
                        Log.i("myLog", "Login message:" + message);
                        Log.i("myLog", "Login status:" + status + "   role:" + roleName);

                        if (status.equalsIgnoreCase("success")) {
                            PreferenceManager.setBoolean(PreferenceManager.IS_LOGGED_IN, true);
                            //      if (fromScreen.equalsIgnoreCase("Forgot_Pwd") && email.equalsIgnoreCase(username)) {
                            if (resetStatus == 1) {
                                Intent intent = new Intent(LoginActivity.this, ChangePwdActivity.class);
                                startActivity(intent);
                                finish();
                            } else {
                                Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                                intent.putExtra("Staff_img", staffImg);
                                startActivity(intent);
                                finish();
                            }
                        } else {
                            edtEmail.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_red_outline));
                            edtPwd.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_red_outline));
    //                        OPHubUtils.showErrorDialog(LoginActivity.this, errMsg);
                            invalid.setVisibility(View.VISIBLE);
                        }
                    } else {
                        edtEmail.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_red_outline));
                        edtPwd.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_red_outline));
    //                    OPHubUtils.showErrorDialog(LoginActivity.this, "Enter correct username and password");
                        invalid.setVisibility(View.VISIBLE);
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(LoginActivity.this);
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Log.i("myLog", "Login response failure:" + t.toString());
                edtEmail.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_red_outline));
                edtPwd.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.rounded_rectangle_red_outline));
//                OPHubUtils.showUnknownErrorDialog(LoginActivity.this);
            }
        });

    }

    public boolean checkConnection() {

        // initialize intent filter
        // Initialize connectivity manager
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);

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
            OPHubUtils.showErrorDialog(LoginActivity.this, message);
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
        registerReceiver(networkConnectionReceiver, intentFilter);
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
        unregisterReceiver(networkConnectionReceiver);
        //  boolean isConnected = checkConnection();
        //if (!isConnected)
        //  showAlert(isConnected);
    }



  /*  private void login(String username, String password) {
        OPHubRequests.LoginRequest request = new OPHubRequests.LoginRequest();
        request.setUserName(username);
        request.setPassword(password);
        Log.i("mylog", "Login request:" + new Gson().toJson(request));
        Call<List<LoginResponse>> call = services.login(request);
        call.enqueue(new Callback<List<LoginResponse>>() {

            @Override
            public void onResponse(Call<List<LoginResponse>> call, Response<List<LoginResponse>> response) {
                Log.i("myLog", "Login response:");
                Log.i("mylog", "Login response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    Log.i("myLog", "Login response isSuccess:" + response.body().toString());
                    List<LoginResponse> resp = response.body();
                    LoginResponse loginResponse = resp.get(0);
                    String message = loginResponse.getMessage();
                    String status = loginResponse.getStatus();
                    LoginResponse.Details details = loginResponse.getDetails();
                    String staffName = details.getStaffName();
                    String staffImg = details.getStaffImg();
                    int hospitalId = details.getHospitalId();
                    PreferenceManager.setString(PreferenceManager.STAFF_NAME, staffName);
                    PreferenceManager.setString(PreferenceManager.STAFF_IMAGE, staffImg);
                    PreferenceManager.setInt(PreferenceManager.HOSPITAL_ID, hospitalId);
                    Log.i("myLog", "Login message:" + message);
                    Log.i("myLog", "Login status:" + status);
                    if (status.equalsIgnoreCase("success")) {
                        PreferenceManager.setBoolean(PreferenceManager.IS_LOGGED_IN, true);
                        if (fromScreen.equalsIgnoreCase("Forgot_Pwd")) {
                            Intent intent = new Intent(LoginActivity.this, ChangePwdActivity.class);
                            startActivity(intent);
                            finish();
                        } else {
                            //     Intent intent = new Intent(LoginActivity.this, MainMenuActivity.class);
                            Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                            intent.putExtra("Staff_img", staffImg);
                            startActivity(intent);
                            finish();
                        }
                    } else {
                        OPHubUtils.showErrorDialog(LoginActivity.this, message);
                    }
                } else {
                    OPHubUtils.showErrorDialog(LoginActivity.this, response.message());
                }
            }

            @Override
            public void onFailure(Call<List<LoginResponse>> call, Throwable t) {
                Log.i("myLog", "Login response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(LoginActivity.this);
            }
        });


    }*/


}
