package com.plenome.pos.views;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.adapters.PrescriptionAdapter;
import com.plenome.pos.network.RestServices;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;

public class GeneratePrescriptionFragment extends Fragment {
    View rootView;

    RestServices services;
    @BindView(R.id.recycleView)
    RecyclerView recyclerview;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.generate_prescription, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarTitle.setText(R.string.patient_prescription);
        ArrayList<String> alMedName = new ArrayList<>(), alBfAf = new ArrayList<>(), alMedForm = new ArrayList<>(),
                alTiming = new ArrayList<>(),
                alDosage = new ArrayList<>(),
                alDuration = new ArrayList<>(),
                alAddInfo = new ArrayList<>();
        alMedForm.add("fdfdg");
        alMedName.add("medicine");
        alTiming.add("Mor");
        alBfAf.add("Before Food");
        alDosage.add("10");
        alDuration.add("10");
        alAddInfo.add("dgdg");

        PrescriptionAdapter adapter = new PrescriptionAdapter(getActivity(), alMedName, alBfAf, alMedForm,
                alTiming, alDosage, alDuration, alAddInfo);
        recyclerview.setAdapter(adapter);
        return rootView;
    }


}
