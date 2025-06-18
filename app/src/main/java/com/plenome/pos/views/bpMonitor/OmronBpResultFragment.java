package com.plenome.pos.views.bpMonitor;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.VitalsRequestResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.appointment.AppointmentFragment;
import com.plenome.pos.views.vibrasense.VitalsFragment;
import com.plenome.pos.views.vitalsReports.VitalsReport;

import butterknife.ButterKnife;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OmronBpResultFragment extends Fragment {
    View rootView;
    String sys, dia, pulse;
    TextView bpToolbarName;
    TextView btnSave,btnRetake;

    RestServices services;

    @SuppressLint("SetTextI18n")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.omron_bp_result_screen, container, false);
        services = RetrofitInstance.createService(RestServices.class);
        Bundle bundle = getArguments();
        if (bundle == null
                || bundle.getString("Blood_Pressure_sys") == null
                || bundle.getString("Blood_Pressure_Dia") == null
                || bundle.getString("Blood_Pressure_Pulse") == null) {

            // Go back if invalid arguments
            new Handler(Looper.getMainLooper()).postDelayed(() ->
                            requireActivity().getSupportFragmentManager().popBackStackImmediate(),
                    1500
            );
            return rootView;
        }

        sys = bundle.getString("Blood_Pressure_sys");
        dia = bundle.getString("Blood_Pressure_Dia");
        pulse = bundle.getString("Blood_Pressure_Pulse");

        TextView valueTxt = rootView.findViewById(R.id.value);
        valueTxt.setText(sys + " / " + dia);

        TextView pulseTxt = rootView.findViewById(R.id.valuePulse);
        pulseTxt.setText(pulse);

        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        btnSave = rootView.findViewById(R.id.btnSave);
        btnRetake = rootView.findViewById(R.id.btnRetake);

        btnSave.setOnClickListener(v -> {



            VitalsReport newFragment = new VitalsReport();
            Bundle result_data = new Bundle();
            result_data.putString("sys", sys);
            result_data.putString("dia", dia);
            result_data.putString("pulse", pulse);
            newFragment.setArguments(result_data);
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            transaction.replace(R.id.fragment_container, newFragment,"SS");
            transaction.addToBackStack(null);
            transaction.commit();


        });

        btnRetake.setOnClickListener(v -> {
            VitalsFragment newFragment = new VitalsFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            transaction.replace(R.id.fragment_container, newFragment, "SS");
            transaction.addToBackStack(null);
            transaction.commit();

        });

        return rootView;
    }


}
