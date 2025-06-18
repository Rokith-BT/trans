package com.plenome.pos.views.abha;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.chaos.view.PinView;
import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.GetOtpResponse;
import com.plenome.pos.model.IsMobileLinkedResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.VerifyOtpResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AbhaVerifyOTPFragment extends Fragment {
    View rootView;
    String fromScreen, mobile, txnId, aadhaar, token, healthId, fromMenu, patientId, name, age, gender,
            bloodgroup, phone, email, doctor, date, dob, address, salutation, dialCode, emergencyNo;
    @BindView(R.id.resend_otp)
    TextView resendOtp;

    @BindView(R.id.enable_otp)
    TextView enableOtp;

    @BindView(R.id.didnotreceive)
    TextView didnotReceiveOtp;
    @BindView(R.id.linearResend)
    LinearLayout linearResend;

    @BindView(R.id.pinview)
    PinView pinView;

//    @BindView(R.id.otpMobile)
//    TextView txtMobileNo;
    @BindView(R.id.view)
    View view;

    private RestServices services;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_abha_verify_otp, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createAbhaService(RestServices.class);
        Bundle bundle = getArguments();
        if (bundle != null) {
            fromScreen = bundle.getString("from_screen");
            fromMenu = bundle.getString("from_menu");
            mobile = bundle.getString("mobile");
            aadhaar = bundle.getString("aadhaar");
            txnId = bundle.getString("txn_id");
            Log.i("myLog", "From screen : " + fromScreen);
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

            Log.i("myLog", "verify OTP screen name:" + name + "   age:" + age + "   gender:" + gender + "  blood group:" + bloodgroup +
                    "  phone:" + phone + "  email:" + email + "  address:" + address);
//            txtMobileNo.setText(mobile);
        }
        new CountDownTimer(60000, 1000) {

            public void onTick(long millisUntilFinished) {
                long res = millisUntilFinished / 1000;
                if (res != 0)
                    enableOtp.setText("Resend otp will enable in " + res + "s");

            }

            public void onFinish() {
                linearResend.setVisibility(View.VISIBLE);
                //     resendOtp.setVisibility(View.VISIBLE);
                enableOtp.setVisibility(View.GONE);
                //   didnotReceiveOtp.setVisibility(View.VISIBLE);
                // view.setVisibility(View.VISIBLE);
            }
        }.start();
        return rootView;
    }

    @OnClick(R.id.btn_verify)
    public void clickVerifyOtp() {
        String pin = pinView.getText().toString();
        if (pin.length() != 6) {
            Toast.makeText(getActivity(), "Please enter correct OTP", Toast.LENGTH_SHORT).show();
            return;
        }
        if (fromScreen.equalsIgnoreCase("Get_Otp")) {
            String otp = pinView.getText().toString();
            verifyOtp(otp);

        } else if (fromScreen.equalsIgnoreCase("Get_Mobile")) {
            String otp = pinView.getText().toString();
            verifyMobileOtp(otp);
        }
    }

    @OnClick(R.id.resend_otp)
    public void clickedResend() {
        if (fromScreen.equalsIgnoreCase("Get_Otp")) {
            getOTP(aadhaar);

        } else if (fromScreen.equalsIgnoreCase("Get_Mobile")) {
            checkIsMobileLinked(mobile);
        }
    }

    private void verifyOtp(String otp) {
        OPHubRequests.VerifyOtpRequest request = new OPHubRequests.VerifyOtpRequest();
        request.setOtp(otp);
        request.setTxnId(txnId);
        Log.i("myLog", "verify otp:" + " Otp:" + otp + "   txnId:" + txnId);
        Log.i("mylog", "verifyOtp request:" + new Gson().toJson(request));
        Call<VerifyOtpResponse> call = services.verifyAadhaarOtp(request);
        call.enqueue(new Callback<VerifyOtpResponse>() {

            @Override
            public void onResponse(Call<VerifyOtpResponse> call, Response<VerifyOtpResponse> response) {
                Log.i("myLog", "verifyOtp response:");
                Log.i("mylog", "verifyOtp response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    Log.i("myLog", "verifyOtp response isSuccess:" + response.body().toString());
                    VerifyOtpResponse resp = response.body();
                    // String aadhaar = resp.getAadhaar();
                    txnId = resp.getTxnId();
                    Log.i("myLog", "verify otp aadhaar:" + aadhaar + "  txnId:" + txnId);
                    String name = resp.getName();
                    String dob = resp.getBirthDate();
                    String gender = resp.getGender();
                    String mobileNo = resp.getPhone();
                    String address = resp.getHouse() + ", " + resp.getStreet() + ", " + resp.getVillageTownCity() + ", " +
                            resp.getDistrict() + ", " + resp.getState() + "-" + resp.getPincode();
                  /*  boolean isNew = resp.getNewBool();
                    if ( !isNew) {
                        healthId = resp.getHealthIdNumber();
                        VerifyOtpResponse.JwtResponse jwtRes = resp.getJwtResponse();
                        token = jwtRes.getToken();
                    }*/
                    Log.i("myLog", "verify otp b4 get photo");
                    String bytes = resp.getPhoto();
                    Log.i("myLog", "verify otp after get photo len:");

                    if (fromScreen.equalsIgnoreCase("Get_Otp")) {
                        showPatientDetFragment(txnId, aadhaar, name, dob, gender, mobileNo, address, healthId, token, bytes);

                    } else if (fromScreen.equalsIgnoreCase("Get_Mobile")) {
                        goToAbhaCreation();
                    }
                } else {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<VerifyOtpResponse> call, Throwable t) {
                Log.i("myLog", "verifyOtp response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void showPatientDetFragment(String txnId, String aadhaar, String namee, String dobb, String genderr,
                                        String mobileNo, String addresss, String healthIdNo, String token, String photo) {
        AbhaPatientDetFragment newFragment = new AbhaPatientDetFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("txn_id", txnId);
        result.putString("aadhaar", aadhaar);
        result.putString("namee", namee);
        result.putString("dobb", dobb);
        result.putString("from_menu", fromMenu);
        result.putString("genderr", genderr);
        result.putString("mobile", mobileNo);
        result.putString("addresss", addresss);
        result.putString("health_id", healthIdNo);
        result.putString("token", token);
        result.putString("photo", photo);


        result.putString("patient_id", patientId);
        result.putString("name", name);
        result.putString("gender", gender);
        result.putString("age", age);
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


    private void getOTP(String aadhaar) {
        Log.i("myLog", "getOtp");
        OPHubRequests.GetOtpRequest request = new OPHubRequests.GetOtpRequest();
        String aadhaarNo = aadhaar.replace(" ", "");
        Log.i("myLog", "click getOtp aadhaar space removed:" + aadhaarNo);

        request.setAadhaarNo(aadhaarNo);
        Log.i("myLog", "getOtp b4 call:" + new Gson().toJson(request));
        Call<GetOtpResponse> call = services.getAadhaarOtp(request);
        call.enqueue(new Callback<GetOtpResponse>() {

            @Override
            public void onResponse(Call<GetOtpResponse> call, Response<GetOtpResponse> response) {
                Log.i("myLog", "getOtp response:");
                if (response.body() != null) {
                    Log.i("myLog", "getOtp response isSuccess:" + response.body().toString());
                    GetOtpResponse resp = response.body();
                    mobile = resp.getMobileNumber();
                    txnId = resp.getTxnId();
                    Log.i("myLog", "getOtp mob:" + mobile + "  txnId:" + txnId);
                    OPHubUtils.showErrorDialog(getActivity(), "OTP Resent");
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

    private void checkIsMobileLinked(String mobile) {
        OPHubRequests.IsMobileLinkedRequest request = new OPHubRequests.IsMobileLinkedRequest();
        request.setMobile(mobile);
        request.setTxnId(txnId);
        Log.i("myLog", "checkIsMobileLinked b4 call:" + request.toString());
        Log.i("mylog", "mobile:" + mobile + " txn_id:" + txnId);
        Call<IsMobileLinkedResponse> call = services.isMobileLinked(request);
        call.enqueue(new Callback<IsMobileLinkedResponse>() {

            @Override
            public void onResponse(Call<IsMobileLinkedResponse> call, Response<IsMobileLinkedResponse> response) {
                Log.i("myLog", "checkIsMobileLinked response:");
                if (response.body() != null) {
                    Log.i("myLog", "checkIsMobileLinked response isSuccess:" + response.body().toString());
                    IsMobileLinkedResponse resp = response.body();
                    txnId = resp.getTxnId();
                    boolean isMobileLinked = resp.getMobileLinked();
                    Log.i("mylog", "isMobileLinked:" + isMobileLinked + "  txn id:" + txnId);
                    OPHubUtils.showErrorDialog(getActivity(), "OTP Resent");

                } else {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }

            }

            @Override
            public void onFailure(Call<IsMobileLinkedResponse> call, Throwable t) {
                Log.i("myLog", "checkIsMobileLinked response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void goToAbhaCreation() {
        Bundle result = new Bundle();
        result.putString("txn_id", txnId);
        result.putString("token", token);
        result.putString("from_menu", fromMenu);
        AbhaNoCreation newFragment = new AbhaNoCreation();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void verifyMobileOtp(String otp) {
        OPHubRequests.VerifyOtpRequest request = new OPHubRequests.VerifyOtpRequest();
        request.setOtp(otp);
        request.setTxnId(txnId);
        Log.i("myLog", "verifyMobileOtp otp:" + " Otp:" + otp + "   txnId:" + txnId);
        Log.i("mylog", "verifyMobileOtp request:" + new Gson().toJson(request));
        Call<GetOtpResponse> call = services.verifyMobileOtp(request);
        call.enqueue(new Callback<GetOtpResponse>() {

            @Override
            public void onResponse(Call<GetOtpResponse> call, Response<GetOtpResponse> response) {
                Log.i("myLog", "verifyMobileOtp response:");
                Log.i("mylog", "verifyMobileOtp response:" + new Gson().toJson(response.body()));

                if (response.body() != null) {
                    Log.i("myLog", "verifyMobileOtp response isSuccess:" + response.body().toString());
                    GetOtpResponse resp = response.body();
                    txnId = resp.getTxnId();
                    goToAbhaCreation();

                } else {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<GetOtpResponse> call, Throwable t) {
                Log.i("myLog", "verifyMobileOtp response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


}
