package com.plenome.pos.views;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.IsMobileLinkedResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.abha.AbhaNoCreation;
import com.plenome.pos.views.abha.AbhaVerifyOTPFragment;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FragmentAbhaGetMobile extends Fragment {
    View rootView;

    @BindView(R.id.btn_next)
    Button btnNext;

    @BindView(R.id.chk)
    CheckBox chk;

    @BindView(R.id.edtMobileNo)
    EditText edtMobile;
    String txnId, token;
    RestServices services;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_abha_get_mobile_no, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createAbhaService(RestServices.class);
        Bundle bundle = getArguments();
        txnId = bundle.getString("txn_id");
        token = bundle.getString("token");
        return rootView;
    }

    @OnClick(R.id.btn_next)
    public void clickNext() {
        boolean isChecked = chk.isChecked();
        if (!isChecked) {
            Toast.makeText(getActivity(), "Please agree the terms", Toast.LENGTH_SHORT).show();
            return;
        }
        String mobile = edtMobile.getText().toString();
        checkIsMobileLinked(mobile);

    }

    private void checkIsMobileLinked(String mobile) {
        OPHubRequests.IsMobileLinkedRequest request = new OPHubRequests.IsMobileLinkedRequest();
        request.setMobile(mobile);
        request.setTxnId(txnId);
        Log.i("myLog", "checkIsMobileLinked b4 call:" + new Gson().toJson(request));
        Log.i("mylog", "mobile:" + mobile + " txn_id:" + txnId);
        Call<IsMobileLinkedResponse> call = services.isMobileLinked(request);
        call.enqueue(new Callback<IsMobileLinkedResponse>() {

            @Override
            public void onResponse(Call<IsMobileLinkedResponse> call, Response<IsMobileLinkedResponse> response) {
                Log.i("myLog", "checkIsMobileLinked response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    Log.i("myLog", "checkIsMobileLinked response isSuccess:" + response.body().toString());
                    IsMobileLinkedResponse resp = response.body();
                    txnId = resp.getTxnId();
                    boolean isMobileLinked = resp.getMobileLinked();
                    Log.i("mylog", "isMobileLinked:" + isMobileLinked + "txn id:" + txnId);
                    if (!isMobileLinked)
                        goToVerifyOtp(mobile);
                    else
                        goToAbhaCreation();

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

    private void goToVerifyOtp(String mobile) {
        AbhaVerifyOTPFragment newFragment = new AbhaVerifyOTPFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("from_screen", "Get_Mobile");
        result.putString("mobile", mobile);
        result.putString("txn_id", txnId);
        newFragment.setArguments(result);
        transaction.replace(R.id.linearGetOTP, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    private void goToAbhaCreation() {
        AbhaNoCreation newFragment = new AbhaNoCreation();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        Bundle result = new Bundle();
        result.putString("txn_id", txnId);
        newFragment.setArguments(result);
        transaction.replace(R.id.linearGetOTP, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

}
