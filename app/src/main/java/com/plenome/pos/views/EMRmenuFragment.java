package com.plenome.pos.views;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.plenome.pos.R;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;

import butterknife.ButterKnife;

public class EMRmenuFragment extends Fragment {
    View rootView;

    RestServices services;



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_emr_menu, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.emr);
        OPHubApplication.appBarImage.setVisibility(View.GONE);




        return rootView;
    }





}
