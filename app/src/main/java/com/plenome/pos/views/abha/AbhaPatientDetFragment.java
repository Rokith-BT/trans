package com.plenome.pos.views.abha;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.mikhaellopez.circularimageview.CircularImageView;
import com.plenome.pos.R;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.views.FragmentAbhaGetMobile;
import com.plenome.pos.views.SuccessFragment;
import com.plenome.pos.views.patientDetail.PatientProfileFragment;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class AbhaPatientDetFragment extends Fragment {
    View rootView;

    @BindView(R.id.btnDone)
    Button btnDone;

    @BindView(R.id.btnCreateAbhaNo)
    Button btnCreateAbhaNo;

    @BindView(R.id.txtAbhaNo)
    TextView txtAbhaNo;
    @BindView(R.id.edtAbhaNumber)
    TextView edtAbhaNo;
    @BindView(R.id.edtAadhar)
    TextView edtAadhaar;
    @BindView(R.id.edtName)
    TextView edtName;
    @BindView(R.id.edtDob)
    TextView edtDob;
    @BindView(R.id.edtGender)
    TextView edtGender;
    @BindView(R.id.edtAddress)
    EditText edtAddress;

    @BindView(R.id.profileImg)
    CircularImageView profileImg;

    private RestServices services;
    String txnId, aadhaar, namee, dob, genderr, mobile, addresss, healthId, token, photo, fromMenu,
            patientId, name, age, gender, bloodgroup, phone, dobb, email, doctor, date, maritalStatus, address, salutation, emergencyNo, dialCode;
    Boolean isMobileLinked = false;
    //byte photo;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_abha_patient_det, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createAbhaService(RestServices.class);
        Bundle bundle = getArguments();
        mobile = bundle.getString("mobile");
        txnId = bundle.getString("txn_id");
        aadhaar = bundle.getString("aadhaar");
        namee = bundle.getString("namee");
        dobb = bundle.getString("dobb");
        genderr = bundle.getString("genderr");
        addresss = bundle.getString("addresss");
        healthId = bundle.getString("health_id");
        token = bundle.getString("token");
        photo = bundle.getString("photo");
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
        maritalStatus = bundle.getString("marital_status");
        dob = bundle.getString("dob");
        address = bundle.getString("address");
        salutation = bundle.getString("salutation");
        dialCode = bundle.getString("dialCode");
        emergencyNo = bundle.getString("emergencyNo");

        Log.i("myLog", "name:" + name + "   age:" + age + "  phone:" + phone + "   email:" + email + "   address:" + address);
        edtAadhaar.setText(aadhaar);
        edtName.setText(namee);
        edtDob.setText(dobb);
        edtGender.setText(genderr);
        edtAddress.setText(addresss);
        if (healthId == null) {
            edtAbhaNo.setVisibility(View.GONE);
            txtAbhaNo.setVisibility(View.GONE);
            btnDone.setVisibility(View.GONE);
            btnCreateAbhaNo.setVisibility(View.VISIBLE);
        } else {
            edtAbhaNo.setText(healthId);
            edtAbhaNo.setVisibility(View.VISIBLE);
            txtAbhaNo.setVisibility(View.VISIBLE);
            btnDone.setVisibility(View.VISIBLE);
            btnCreateAbhaNo.setVisibility(View.GONE);
        }
/*        byte[] decodedImageBytes = Base64.decode(photo, Base64.DEFAULT);
        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
        profileImg.setImageBitmap(bitmap);*/
        Log.i("myLog", " pateint det screen name:" + name + "   age:" + age + "   gender:" + gender + "  blood group:" + bloodgroup +
                "  phone:" + phone + "  email:" + email + "  address:" + address);
        return rootView;
    }

    @OnClick(R.id.btnCreateAbhaNo)
    public void clickCreateAbhaNo() {
        // if (!isMobileLinked) {
        FragmentAbhaGetMobile newFragment = new FragmentAbhaGetMobile();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("txn_id", txnId);
        result.putString("token", token);
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
        //   } else {
        //     AbhaNoCreation newFragment = new AbhaNoCreation();
        //   FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        // transaction.replace(R.id.linearGetOTP, newFragment);
        // transaction.addToBackStack(null);
        //transaction.commit();
        //}

    }

    @OnClick(R.id.btnDone)
    public void clickDone() {
        if (fromMenu.equalsIgnoreCase("Patient_Profile")) {
            PatientProfileFragment newFragment = new PatientProfileFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("abha_no", healthId);
            result.putString("from_menu", fromMenu);
            result.putString("from_screen", "CREATE_ABHA");
            result.putString("name", name);
            result.putString("gender", gender);
            result.putString("bloodGroup", bloodgroup);
            result.putString("phone", phone);
            result.putString("email", email);
            result.putString("dob", dob);
            result.putString("address", address);
            result.putString("emergencyNo", emergencyNo);
            result.putString("salutation", salutation);
            result.putString("dialCode", dialCode);

            newFragment.setArguments(result);
            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();

       /* } else if (fromMenu.equalsIgnoreCase("Book_Appointment")) {
            AddNewApptFromPatient newFragment = new AddNewApptFromPatient();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("abha_no", healthId);
            result.putString("from_menu", fromMenu);
            result.putString("from_screen", "CREATE_ABHA");
            result.putString("patient_id", patientId);
            result.putString("name", name);
            result.putString("gender", gender);
            result.putString("age", String.valueOf(age));
            result.putString("bloodGroup", bloodgroup);
            result.putString("phone", phone);
            result.putString("email", email);
            result.putString("doctor", doctor);
            result.putString("date", date);

            newFragment.setArguments(result);
            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();*/

        } else {
            SuccessFragment newFragment = new SuccessFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("token", token);
            result.putString("from_screen", "Patient_Details");
            newFragment.setArguments(result);

            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        }

    }


}
