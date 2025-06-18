package com.plenome.pos.views;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;

import com.plenome.pos.R;
import com.plenome.pos.views.authentication.LoginActivity;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_splash);
        boolean isLoggedIn = OPHubApplication.isUserLoggedIn();
        OPHubApplication.selTab = "todayAppointment";
        Intent intent = getIntent();
        Uri data = intent.getData();
        if (data != null) {
            Log.i("myLog", "URI :" + data.toString());
        }

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                if (isLoggedIn) {
                    Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                 //   Intent intent = new Intent(SplashActivity.this, SampleCameraActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    Intent intent = new Intent(SplashActivity.this, LoginActivity.class);
                    intent.putExtra("From_Screen", "Splash_screen");
                    startActivity(intent);
                    finish();
                }
            }
        }, 3000);

    }
}
