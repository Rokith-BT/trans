package com.plenome.pos.views.authentication;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Window;
import android.view.WindowManager;

import androidx.appcompat.app.AppCompatActivity;

import com.plenome.pos.R;

import butterknife.ButterKnife;

public class ForgotPwdSuccessActivity extends AppCompatActivity {
    String email;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_forgot_pwd_success);
        email = getIntent().getStringExtra("email");

        ButterKnife.bind(this);

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(ForgotPwdSuccessActivity.this, LoginActivity.class);
                intent.putExtra("From_Screen", "Forgot_Pwd");
                intent.putExtra("email", email);
                startActivity(intent);
                finish();
            }
        }, 3000);

    }
}
