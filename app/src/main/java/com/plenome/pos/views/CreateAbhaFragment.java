package com.plenome.pos.views;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.plenome.pos.R;
import com.plenome.pos.views.abha.AbhaGetOtpFragment;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class CreateAbhaFragment extends Fragment {
    View rootView;
    @BindView(R.id.linearCreateAbha)
    LinearLayout linearOTP;
    @BindView(R.id.imgAyushman)
    ImageView img;
    String fromMenu = "", patientId, name, age, gender, bloodgroup, phone, email, doctor, date, dob, address, salutation, dialCode, emergencyNo;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_create_abha, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarTitle.setText(R.string.abha);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        Bundle bundle = getArguments();
        if (bundle != null) {
            fromMenu = bundle.getString("from_menu");
            patientId = bundle.getString("patient_id");
            name = bundle.getString("name");
            age = bundle.getString("age");
            gender = bundle.getString("gender");
            bloodgroup = bundle.getString("bloodGroup");
            phone = bundle.getString("phone");
            email = bundle.getString("email");
            doctor = bundle.getString("doctor");
            date = bundle.getString("date");
            dob = bundle.getString("dob");
            address = bundle.getString("address");
            salutation = bundle.getString("salutation");
            dialCode = bundle.getString("dialCode");
            emergencyNo = bundle.getString("emergencyNo");
            Log.i("myLog", "name:" + name + "   age:" + age + "   gender:" + gender + "  blood group:" + bloodgroup +
                    "  phone:" + phone + "  email:" + email + "  address:" + address);
        }
        return rootView;
    }

    @OnClick(R.id.btn_create_abha)
    public void createABHA() {
        linearOTP.removeAllViews();
        AbhaGetOtpFragment newFragment = new AbhaGetOtpFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_menu", fromMenu);
        result.putString("patient_id", String.valueOf(patientId));
        result.putString("name", name);
        result.putString("gender", gender);
        result.putString("age", String.valueOf(age));
        result.putString("bloodGroup", bloodgroup);
        result.putString("phone", phone);
        result.putString("email", email);
        result.putString("doctor", doctor);
        result.putString("date", date);
        result.putString("dob", dob);
        result.putString("address", address);
        result.putString("emergencyNo", emergencyNo);
        result.putString("salutation", salutation);
        result.putString("dialCode", dialCode);

        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

}
