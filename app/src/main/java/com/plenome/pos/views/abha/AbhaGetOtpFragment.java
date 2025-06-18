package com.plenome.pos.views.abha;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.GetOtpResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.OPHubApplication;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AbhaGetOtpFragment extends Fragment {
    View rootView;

    @BindView(R.id.linearGetOTP)
    LinearLayout linearGetOTP;

    @BindView(R.id.edtAadhaar)
    EditText edtAadhaar;

    @BindView(R.id.chkAgree)
    CheckBox chkAgree;

    RestServices services;
    String fromScreen, fromMenu = "", patientId, name, age, gender, bloodgroup, phone, email, doctor, date,
            dob, address, salutation, dialCode, emergencyNo;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragemnt_create_abha_get_otp, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createAbhaService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        edtAadhaar.addTextChangedListener(new FourDigitCardFormatWatcher());
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

            Log.i("myLog", " Get otp screen   name:" + name + "   age:" + age + "   gender:" + gender + "  blood group:" + bloodgroup +
                    "  phone:" + phone + "  email:" + email + "  address:" + address);
        }

     /*   edtAadhaar.addTextChangedListener(new TextWatcher() {
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

                //    Log.i("myLog", "Count:" + count + "   " + edtAadhaar.getText().toString());
                //  Log.i("myLog", "s:" + s + "   start:" + start + "   before:" + before);
                //String text = edtAadhaar.getText().toString();
                //Log.i("myLog", "text:" + text);

            }

            @Override
            public void afterTextChanged(Editable s) {
                String str = edtAadhaar.getText().toString();
                Log.i("myLog", "str:" + str + "  s:" + s.toString());
                if (str.length() % 4 == 0)
                    edtAadhaar.setText(str + " ");
                str = edtAadhaar.getText().toString();
                Log.i("myLog", "text str:" + str);

            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

    });*/
        return rootView;
    }

    public static class FourDigitCardFormatWatcher implements TextWatcher {

        // Change this to what you want... ' ', '-' etc..
        private static final char space = ' ';

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
        }

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
        }

        @Override
        public void afterTextChanged(Editable s) {
            // Remove spacing char
            if (s.length() > 0 && (s.length() % 5) == 0) {
                final char c = s.charAt(s.length() - 1);
                if (space == c) {
                    s.delete(s.length() - 1, s.length());
                }
            }
            // Insert char where needed.
            if (s.length() > 0 && (s.length() % 5) == 0) {
                char c = s.charAt(s.length() - 1);
                // Only if its a digit where there should be a space we insert a space
                if (Character.isDigit(c) && TextUtils.split(s.toString(), String.valueOf(space)).length <= 3) {
                    s.insert(s.length() - 1, String.valueOf(space));
                }
            }
        }

    }

    @OnClick(R.id.btn_get_otp)
    public void clickGetOtp() {
        Log.i("myLog", "click getOtp");
        String aadhaar = edtAadhaar.getText().toString();
        boolean isValid = isValidAadhaarNumber(aadhaar);
        Log.i("myLog", "click getOtp aadhaar:" + aadhaar);
        if (!isValid) {
            Toast.makeText(getActivity(), "Please enter valid Aadhaar number", Toast.LENGTH_SHORT).show();
            return;

        }
        if (!chkAgree.isChecked()) {
            Toast.makeText(getActivity(), "Please agree the terms", Toast.LENGTH_SHORT).show();
            return;
        }
        getOTP(aadhaar);

    }


    private void getOTP(String aadhaar) {
        Log.i("myLog", "getOtp");
        String aadhaarNo = aadhaar.replace(" ", "");
        Log.i("myLog", "click getOtp aadhaar space removed:" + aadhaarNo);

        OPHubRequests.GetOtpRequest request = new OPHubRequests.GetOtpRequest();
        request.setAadhaarNo(aadhaarNo);
        Log.i("myLog", "getOtp b4 call:" + new Gson().toJson(request));
        Call<GetOtpResponse> call = services.getAadhaarOtp(request);
        call.enqueue(new Callback<GetOtpResponse>() {

            @Override
            public void onResponse(Call<GetOtpResponse> call, Response<GetOtpResponse> response) {
                Log.i("myLog", "getOtp response:");
                Log.i("mylog", "getOtp response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    Log.i("myLog", "getOtp response isSuccess:");
                    GetOtpResponse resp = response.body();
                    String mobile = resp.getMobileNumber();
                    String txnId = resp.getTxnId();
                    Log.i("myLog", "getOtp mob:" + mobile + "  txnId:" + txnId);
                    loadVerifyOTPFragment(mobile, txnId, aadhaar);
                } else {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<GetOtpResponse> call, Throwable t) {
                Log.i("myLog", "getOtp response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void loadVerifyOTPFragment(String mobile, String txnId, String aadhaar) {
        linearGetOTP.removeAllViews();
        AbhaVerifyOTPFragment newFragment = new AbhaVerifyOTPFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_screen", "Get_Otp");
        result.putString("from_menu", fromMenu);
        result.putString("mobile", mobile);
        result.putString("aadhaar", aadhaar);
        result.putString("txn_id", txnId);
        result.putString("patient_id", patientId);
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

    public static boolean isValidAadhaarNumber(String str) {
        // Regex to check valid Aadhaar number.
        String regex
                = "^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$";

        // Compile the ReGex
        Pattern p = Pattern.compile(regex);

        // If the string is empty
        // return false
        if (str == null) {
            return false;
        }

        // Pattern class contains matcher() method
        // to find matching between given string
        // and regular expression.
        Matcher m = p.matcher(str);

        // Return if the string
        // matched the ReGex
        return m.matches();
    }
}
