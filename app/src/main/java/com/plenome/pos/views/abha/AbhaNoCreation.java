package com.plenome.pos.views.abha;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.plenome.pos.R;
import com.plenome.pos.model.CreateAbhaNoResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;
import com.plenome.pos.views.SuccessFragment;
import com.plenome.pos.views.patientDetail.PatientProfileFragment;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AbhaNoCreation extends Fragment {
    View rootView;
    private RestServices services;

    @BindView(R.id.edtAbhaNo)
    EditText edtAbhaNo;
    String txnId, healthIdNo, token, fromMenu;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_abha_no, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createAbhaService(RestServices.class);
        Bundle bundle = getArguments();
        txnId = bundle.getString("txn_id");
        token = bundle.getString("token");
        fromMenu = bundle.getString("from_menu");
        createAbhaNo();
        return rootView;
    }

    @OnClick(R.id.btnDone)
    public void clickDone() {
        if (fromMenu.equalsIgnoreCase("Patient_Profile")) {
            PatientProfileFragment newFragment = new PatientProfileFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("abha_no", healthIdNo);
            result.putString("from_menu", fromMenu);
            result.putString("from_screen", "CREATE_ABHA");
            newFragment.setArguments(result);
            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();


        } else {
            SuccessFragment newFragment = new SuccessFragment();
            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
            Bundle result = new Bundle();
            result.putString("token", token);
            result.putString("from_menu", fromMenu);
            result.putString("from_screen", "ABHA_No_Creation");
            newFragment.setArguments(result);
            transaction.replace(R.id.fragment_container, newFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        }
    }


    private void createAbhaNo() {
        OPHubRequests.CreateAbhaNoRequest request = new OPHubRequests.CreateAbhaNoRequest();
        request.setTxnId(txnId);
        Log.i("myLog", "createAbhaNo txn_id:" + txnId);
        Log.i("myLog", "CreateAbhaNoResponse b4 call:" + request.toString());
        Call<CreateAbhaNoResponse> call = services.createAbhaNo(request);
        call.enqueue(new Callback<CreateAbhaNoResponse>() {

            @Override
            public void onResponse(Call<CreateAbhaNoResponse> call, Response<CreateAbhaNoResponse> response) {
                Log.i("myLog", "CreateAbhaNoResponse response:");
                if (response.body() != null) {
                    Log.i("myLog", "CreateAbhaNoResponse response isSuccess:" + response.body().toString());
                    CreateAbhaNoResponse resp = response.body();
                    healthIdNo = resp.getHealthIdNumber();
                    edtAbhaNo.setText(healthIdNo);
                    Log.i("myLog", "CreateAbhaNoResponse healthIdNo:" + healthIdNo);
                    PreferenceManager.setString(PreferenceManager.ABHA_ID, healthIdNo);
                } else {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<CreateAbhaNoResponse> call, Throwable t) {
                Log.i("myLog", "checkIsMobileLinked response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });


    }


}
