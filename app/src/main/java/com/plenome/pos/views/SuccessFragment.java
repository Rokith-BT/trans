package com.plenome.pos.views;

import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.plenome.pos.R;
import com.plenome.pos.views.abha.ABHACardFragment;
import com.plenome.pos.views.appointment.AppointmentFragment;

import butterknife.BindView;
import butterknife.ButterKnife;

public class SuccessFragment extends Fragment {
    View rootView;
    @BindView(R.id.txtSuccess)
    TextView txtSuccessMsg;
    @BindView(R.id.img)
    ImageView img;
    String token;
    int hospitalId;
    String apptId;
    String fromScreen, option, fromMenu;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.activity_change_pwd_success, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        Bundle bundle = getArguments();
        token = bundle.getString("token");
        fromScreen = bundle.getString("from_screen");
        fromMenu = bundle.getString("from_menu");
        option = bundle.getString("option");
        apptId = bundle.getString("appt_id");
        hospitalId = bundle.getInt("hospital_id");
        if (fromScreen.equalsIgnoreCase("Book_Appointment") || fromScreen.equalsIgnoreCase("Appointment_Submenu")) {
            OPHubApplication.appBarTitle.setText(R.string.appointmentBook);
            if (option != null && option.equalsIgnoreCase("Token")) {
                txtSuccessMsg.setText(R.string.token_verified);
                img.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.token_verified));
            } else {
                txtSuccessMsg.setText(R.string.appointment_success);
            }
        } else if (fromScreen.equalsIgnoreCase("Patient_Details") || fromScreen.equalsIgnoreCase("ABHA_No_Creation")) {
            OPHubApplication.appBarTitle.setText(R.string.abha);
            txtSuccessMsg.setText(R.string.abha_success);
        }
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    if (fromScreen.equalsIgnoreCase("Book_Appointment") || fromScreen.equalsIgnoreCase("Appointment_Submenu")) {
                        if (option != null && option.equalsIgnoreCase("Token"))
                            gotoAppointmentFragment();
                        else
                            gotoAppointmentTokenFragment();
                    } else if (fromScreen.equalsIgnoreCase("Patient_Details") || fromScreen.equalsIgnoreCase("ABHA_No_Creation")) {
                        gotoAbhaCardFragment();
                    }
                } catch (Exception ex) {
                    Log.i("myLog", "exception ex:" + ex.toString());
                }

            }
        }, 3000);
        return rootView;
    }

    public void gotoAbhaCardFragment() {
        ABHACardFragment newFragment = new ABHACardFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("token", token);
        result.putString("from_menu", fromMenu);
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    public void gotoAppointmentTokenFragment() {
        AppointmentTokenFragment newFragment = new AppointmentTokenFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("appt_id", apptId);
        result.putInt("hospital_id", hospitalId);
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }


    public void gotoAppointmentFragment() {
        AppointmentFragment newFragment = new AppointmentFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();


    }


}