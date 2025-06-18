package com.plenome.pos.views.authentication;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.LoginResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.NetworkConnectionReceiver;
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

public class ChangePwdActivity extends AppCompatActivity implements NetworkConnectionReceiver.ReceiverListener {
    private RestServices services;
    @BindView(R.id.edtNewPwd)
    EditText edtNewPwd;

    @BindView(R.id.edtConfirmPwd)
    EditText edtConfirmPwd;

    @BindView(R.id.chkPassword)
    CheckBox chkPwd;

    @BindView(R.id.ConfirmchkPassword)
    CheckBox ConfirmchkPassword;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_change_pwd);
        ButterKnife.bind(this);
        services = RetrofitInstance.createService(RestServices.class);

        chkPwd.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    //  chkPwdVisibility.setBackground(getResources().getDrawable(R.drawable.visibility_off));
                    edtNewPwd.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    //   chkPwdVisibility.setBackground(getResources().getDrawable(R.drawable.visibility_on));
                    edtNewPwd.setTransformationMethod(PasswordTransformationMethod.getInstance());

                }
            }
        });

        ConfirmchkPassword.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    //  chkPwdVisibility.setBackground(getResources().getDrawable(R.drawable.visibility_off));
                    edtConfirmPwd.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                } else {
                    //   chkPwdVisibility.setBackground(getResources().getDrawable(R.drawable.visibility_on));
                    edtConfirmPwd.setTransformationMethod(PasswordTransformationMethod.getInstance());

                }
            }
        });

    }

    @OnClick(R.id.btnUpdate)
    public void clickUpdate() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {

            Log.i("myLog", "clickUpdate");
            String username = OPHubApplication.getUserName();
            Log.i("myLog", "clickUpdate username:" + username);
            String newPwd = edtNewPwd.getText().toString();
            String confirmPwd = edtConfirmPwd.getText().toString();
            Log.i("myLog", "clickUpdate newPwd:" + newPwd + "  confirmPwd:" + confirmPwd);
            if (newPwd.length() == 0) {
                edtNewPwd.setError("Please enter new password");
                return;
            }
            if (confirmPwd.length() == 0) {
                edtConfirmPwd.setError("Please enter confirm password");
                return;
            }
            if (newPwd.length() < 8){
                edtNewPwd.setError("Enter Minimum 8 character for new password");
                return;
            }
            if (!newPwd.equalsIgnoreCase(confirmPwd)) {
                edtNewPwd.setError("New password and confirm password are not same");
                edtConfirmPwd.setError("New password and confirm password are not same");
                return;
            }
            resetPwd(username, confirmPwd);
        }
    }

    private void resetPwd(String username, String pwd) {
        Log.i("myLog", "resetPwd username:" + username + "  pwd:" + pwd);
        OPHubRequests.LoginRequest request = new OPHubRequests.LoginRequest();
        request.setUserName(username);
        request.setPassword(pwd);
        Log.i("mylog", "resetPwd request:" + new Gson().toJson(request));
        Call<LoginResponse> call = services.resetPwd(request);
        call.enqueue(new Callback<LoginResponse>() {

            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                try {
                    Log.i("myLog", "resetPwd response:");
                    Log.i("mylog", "resetPwd response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "resetPwd response isSuccess:" + response.body().toString());
                        LoginResponse loginResponse = response.body();
                        String message = loginResponse.getMessage();
                        String status = loginResponse.getStatus();
                        Log.i("myLog", "resetPwd message:" + message);
                        Log.i("myLog", "resetPwd status:" + status);
                        Intent intent = new Intent(ChangePwdActivity.this, ChangePwdSuccessActivity.class);
                        startActivity(intent);
                        finish();
                    } else {
                        OPHubUtils.showErrorDialog(ChangePwdActivity.this, response.message());
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Log.i("myLog", "resetPwd response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(ChangePwdActivity.this);
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
            OPHubUtils.showErrorDialog(ChangePwdActivity.this, message);
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


}
