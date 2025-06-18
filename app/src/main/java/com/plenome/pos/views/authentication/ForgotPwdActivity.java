package com.plenome.pos.views.authentication;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.TextView;

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

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ForgotPwdActivity extends AppCompatActivity implements NetworkConnectionReceiver.ReceiverListener {
    private RestServices services;
    @BindView(R.id.edtEmail)
    EditText edtEmail;

    @BindView(R.id.invalid)
    TextView invalidEmail;


    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_forgot_pwd);
        ButterKnife.bind(this);
        services = RetrofitInstance.createService(RestServices.class);

        edtEmail.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                invalidEmail.setVisibility(View.GONE);
                edtEmail.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.edit_text));
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });


    }

    @OnClick(R.id.btnNext)
    public void clickNext() {
        boolean isConnected = checkConnection();
        if (!isConnected)
            showAlert(isConnected);
        else {
            String username = edtEmail.getText().toString();
            if (!username.isEmpty()) {
                if (!Patterns.EMAIL_ADDRESS.matcher(username).matches()) {
                    invalidEmail.setVisibility(View.VISIBLE);
                    edtEmail.setBackground(ContextCompat.getDrawable(getApplicationContext(), R.drawable.edit_text_error));
//                    Toast.makeText(ForgotPwdActivity.this, "Enter valid email address !", Toast.LENGTH_SHORT).show();
                    return;
                }
            }
            PreferenceManager.setString(PreferenceManager.USER_NAME, username);
            forgotPwd(username);
        }
    }

    private void forgotPwd(String username) {
        OPHubRequests.LoginRequest request = new OPHubRequests.LoginRequest();
        request.setUserName(username);
        Log.i("mylog", "forgotPwd request:" + new Gson().toJson(request));
        Call<LoginResponse> call = services.forGotPwd(request);
        call.enqueue(new Callback<LoginResponse>() {

            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                try {
                    Log.i("myLog", "forgotPwd response:");
                    Log.i("mylog", "forgotPwd response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "forgotPwd response isSuccess:" + response.body().toString());
                        LoginResponse loginResponse = response.body();
                        String message = loginResponse.getMessage();
                        String status = loginResponse.getStatus();
                        Log.i("myLog", "forgotPwd message:" + message);
                        Log.i("myLog", "forgotPwd status:" + status);
                        Intent intent = new Intent(ForgotPwdActivity.this, ForgotPwdSuccessActivity.class);
                        intent.putExtra("email", username);
                        startActivity(intent);
                        finish();
                    } else {
    //                    OPHubUtils.showErrorDialog(ForgotPwdActivity.this, response.message());
                        invalidEmail.setVisibility(View.VISIBLE);
                    }
                } catch (Exception e) {

                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Log.i("myLog", "ForgotPwdActivity response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(ForgotPwdActivity.this);
                invalidEmail.setVisibility(View.VISIBLE);
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
            OPHubUtils.showErrorDialog(ForgotPwdActivity.this, message);
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
