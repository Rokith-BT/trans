package com.plenome.pos.views.vibrasense;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.AppCompatButton;
import androidx.appcompat.widget.AppCompatImageView;
import androidx.appcompat.widget.AppCompatTextView;
import androidx.appcompat.widget.Toolbar;

import com.ayati.connectvibrasense.main.VibrasenseConnect;
import com.ayati.connectvibrasense.model.LegModel;
import com.ayati.connectvibrasense.test.Test;
import com.plenome.pos.R;

import butterknife.BindView;
import butterknife.ButterKnife;

public class TestDetailsActivity extends AppCompatActivity {

    private final String TAG = TestDetailsActivity.class.getSimpleName();
    private static final String REPORT_ID_KEY = "report_id";
    private static final String PATIENT_ID_KEY = "patient_id";
    private String reportId, patientId;

    private AppCompatButton btnReport;
    private AppCompatImageView ivLeft, ivLeftMap, ivRight, ivRightMap;

    private AppCompatTextView tvResult;
    @BindView(R.id.toolbar)
    Toolbar toolbar;

    @BindView(R.id.imgBack)
    ImageView imgBack;

    @BindView(R.id.txtTitle)
    TextView txtTitle;

    public static Intent getIntent(Context context, String patientId, String reportId) {
        Intent intent = new Intent(context, TestDetailsActivity.class);
        intent.putExtra(PATIENT_ID_KEY, patientId);
        intent.putExtra(REPORT_ID_KEY, reportId);
        return intent;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_details);
        ButterKnife.bind(this);
        setSupportActionBar(toolbar);
        txtTitle.setText(R.string.vitals);
        imgBack.setVisibility(View.INVISIBLE);
        btnReport = findViewById(R.id.btnReport);
        ivLeft = findViewById(R.id.ivLeftLeg);
        ivLeftMap = findViewById(R.id.ivLeftLegMap);
        ivRight = findViewById(R.id.ivRightLeg);
        ivRightMap = findViewById(R.id.ivRightLegMap);
        tvResult = findViewById(R.id.tvResult);

        reportId = getIntent().getExtras().getString(REPORT_ID_KEY);
        patientId = getIntent().getExtras().getString(PATIENT_ID_KEY);

        btnReport.setOnClickListener(v -> {
            getReport();
        });

        getReport();

    }

    private void getReport() {
        VibrasenseConnect.getINSTANCE().getTestReport(patientId, reportId, new Test.GetReportEvent() {
            @Override
            public void onGetReport(Bitmap left, Bitmap right, Bitmap colorMap, LegModel leftLeg, LegModel rightLeg) {
                Log.e(TAG, "Left leg avg = " + leftLeg.getVpt());
                ivLeft.setImageBitmap(left);
                ivLeftMap.setImageBitmap(colorMap);
                ivRight.setImageBitmap(right);
                ivRightMap.setImageBitmap(colorMap);
                if (leftLeg != null && rightLeg != null) {
                    tvResult.setText(
                            "Left Leg :- " + "P1:-" + leftLeg.getPos1()
                                    + ", P2:-" + leftLeg.getPos2()
                                    + ", P3:-" + leftLeg.getPos3()
                                    + ", P4:-" + leftLeg.getPos4()
                                    + ", P5:-" + leftLeg.getPos5()
                                    + ", P6:-" + leftLeg.getPos6()
                                    + ", VPT:-" + leftLeg.getVpt()
                                    + "\n" + "\n"
                                    + "Right Leg :- " + "P1:-" + rightLeg.getPos1()
                                    + ", P2:-" + rightLeg.getPos2()
                                    + ", P3:-" + rightLeg.getPos3()
                                    + ", P4:-" + rightLeg.getPos4()
                                    + ", P5:-" + rightLeg.getPos5()
                                    + ", P6:-" + rightLeg.getPos6()
                                    + ", VPT:-" + rightLeg.getVpt()

                    );
                }
            }

            @Override
            public void onFailure(String message) {
                Toast.makeText(TestDetailsActivity.this, message, Toast.LENGTH_LONG).show();
            }
        });
    }
}