package com.plenome.pos.views;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.plenome.pos.R;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.views.appointmentFlow.AppointmentSubMenusFragment;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class PrescriptionFragment extends Fragment  {
    View rootView;
    RestServices services;
    private ArrayList<String> alMedName = new ArrayList<>(), alTiming = new ArrayList<>(), alDuration = new ArrayList<>(),
            alDosage = new ArrayList<>(), alBfAf = new ArrayList<>(), alAddInfo = new ArrayList<>(), alMedForm = new ArrayList<>();

    private String selMedineForm, selBfAf, selTimimg;
    @BindView(R.id.linearPrescriptionView)
    LinearLayout linearPrescView;
    @BindView(R.id.linearPrescSelection)
    LinearLayout linearPrescSelection;
    @BindView(R.id.recyclerView)
    ListView recyclerView;

    @BindView(R.id.edtMedicineName)
    ExtendedEditTExt edtMedicine;

    @BindView(R.id.edtPatientName)
    ExtendedEditTExt patientname;

    @BindView(R.id.linearTablet)
    LinearLayout linearTablet;
    @BindView(R.id.linearSyrup)
    LinearLayout linearSyrup;
    @BindView(R.id.linearOintment)
    LinearLayout linearOintment;

    @BindView(R.id.linearInjection)
    LinearLayout linearInjection;

    @BindView(R.id.linearBeforeFood)
    LinearLayout linearBeforeFood;

    @BindView(R.id.linearAfterFood)
    LinearLayout linearAfterFood;

    @BindView(R.id.edtAdditionalInfo)
    ExtendedEditTExt edtAddInfo;

    @BindView(R.id.spinMlPerCons)
    ExtendedEditTExt consInMl;

    @BindView(R.id.spinTabPerCons)
    ExtendedEditTExt consInTab;

    @BindView(R.id.spinDays)
    ExtendedEditTExt spinDays;
    @BindView(R.id.txtMor)
    TextView txtMor;

    @BindView(R.id.txtNoon)
    TextView txtNoon;

    @BindView(R.id.txtEve)
    TextView txtEve;

    @BindView(R.id.record)
    ImageView record;

    @BindView(R.id.recordstop)
    ImageView recordstop;

    @BindView(R.id.txt_tap_mic)
    TextView txtTapMic;

    @BindView(R.id.txtNight)
    TextView txtNight;
    String[] days = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"};
    String[] tablets = {"1", "2", "3", "4", "5"};

    int CursorPosition = 0;
    ExtendedEditTExt selectedEditText = null;
    String selectedView = "Patient Name";


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_prescription, container, false);
        ButterKnife.bind(this, rootView);
        OPHubApplication.appBarTitle.setText(R.string.patient_prescription);
//        ArrayAdapter ad
//                = new ArrayAdapter(
//                getActivity(),
//                android.R.layout.simple_spinner_item,
//                days);
//        ad.setDropDownViewResource(
//                android.R.layout
//                        .simple_spinner_dropdown_item);
//        spinDays.setAdapter(ad);
//        consInMl.setAdapter(ad);
//        ArrayAdapter adapter = new ArrayAdapter(
//                getActivity(),
//                android.R.layout.simple_spinner_item,
//                tablets);
//        adapter.setDropDownViewResource(
//                android.R.layout
//                        .simple_spinner_dropdown_item);
//
//        consInTab.setAdapter(adapter);
        return rootView;
    }

    @OnClick(R.id.btnSave)
    public void clickSave() {
        String medicine = edtMedicine.getText().toString();
        Log.i("myLog", "medicine:" + medicine + "   seltime:" + selTimimg + "   selBfAf:" + selBfAf + "  selmedForm:" + selMedineForm);
        if (medicine.isEmpty()) {
            Toast.makeText(getContext(), "Enter Medicine", Toast.LENGTH_SHORT).show();
            return;
        }

        if (selTimimg == null) {
            Toast.makeText(getContext(), "Select Morning/Afternoon/Evening/Night", Toast.LENGTH_SHORT).show();
            return;
        }
        if (selBfAf == null) {
            Toast.makeText(getContext(), "Select Before Meal/After Meal", Toast.LENGTH_SHORT).show();
            return;
        }
        Log.i("myLog", "After check end");
        alMedName.add(medicine);
        alBfAf.add(selBfAf);
        alMedForm.add(selMedineForm);
        alTiming.add(selTimimg);
//        String dosageTab = consInTab.getSelectedItem().toString();
//        String dosageMl = consInMl.getSelectedItem().toString();
//        if (selMedineForm.equalsIgnoreCase("Tablet"))
//            alDosage.add(dosageTab);
//        else if (selMedineForm.equalsIgnoreCase("Syrup"))
//            alDosage.add(dosageMl);
//        else
//            alDosage.add(dosageTab);
//        alDuration.add(spinDays.getSelectedItem().toString());
        alAddInfo.add(edtAddInfo.getText().toString());
        Log.i("myLog", "size:" + alMedName.size());
        for (int start = 0; start < alMedName.size(); start++) {
            Log.i("myLog", "name:" + alMedName.get(start) + "  bfaf:" + alBfAf.get(start) + "  med form:" + alMedForm.get(start) +
                    "  time:" + alTiming.get(start) + "  dose:" + alDosage.get(start) + "  duration:" + alDuration.get(start) +
                    "   addInfo:" + alAddInfo.get(start));
        }
      /*  PrescriptionAdapter adapter = new PrescriptionAdapter(getActivity(), alMedName, alBfAf, alMedForm,
                alTiming, alDosage, alDuration, alAddInfo);
        if (adapter == null)
            Log.i("myLog", "adapter==null");
        else
            Log.i("myLog", "adapter!=null");
        recyclerView.setAdapter(adapter);*/
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getActivity(), android.R.layout.simple_list_item_1, alMedName);

// Set the adapter for the ListView
        recyclerView.setAdapter(adapter);


        linearPrescSelection.setVisibility(View.GONE);
        linearPrescView.setVisibility(View.VISIBLE);

    }

    @OnClick(R.id.btnDiscard)
    public void clickDiscard() {

        AppointmentSubMenusFragment newFragment = new AppointmentSubMenusFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    @OnClick(R.id.btnGenPrescription)
    public void genPrescription() {

    }

    @OnClick(R.id.txtAddMedicine)
    public void clickAddMedicine() {
        linearPrescSelection.setVisibility(View.VISIBLE);
        linearPrescView.setVisibility(View.GONE);
    }

    @OnClick(R.id.linearTablet)
    public void clickTablet() {
        selMedineForm = "Tablet";
        linearTablet.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        linearSyrup.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearOintment.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearInjection.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));

    }


    @OnClick(R.id.linearSyrup)
    public void clickSyrup() {
        selMedineForm = "Syrup";
        linearTablet.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearSyrup.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        linearOintment.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearInjection.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));

    }


    @OnClick(R.id.linearOintment)
    public void clickOintment() {
        selMedineForm = "Ointment";
        linearTablet.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearSyrup.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearOintment.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        linearInjection.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));


    }

    @OnClick(R.id.linearInjection)
    public void clickInjection() {
        selMedineForm = "Injection";
        linearTablet.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearSyrup.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearOintment.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearInjection.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));


    }

    @OnClick(R.id.linearBeforeFood)
    public void clickBf() {
        selBfAf = "Before Food";
        linearBeforeFood.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        linearAfterFood.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));

    }

    @OnClick(R.id.linearAfterFood)
    public void clickAf() {
        selBfAf = "After Food";
        linearBeforeFood.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        linearAfterFood.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));

    }

    @OnClick(R.id.txtMor)
    public void clickMor() {
        selTimimg = "Morning";
        txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));

    }

    @OnClick(R.id.txtNight)
    public void clickNight() {
        selTimimg = "Night";
        txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));

    }

    @OnClick(R.id.txtEve)
    public void clickEve() {
        selTimimg = "Evening";
        txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));

    }

    @OnClick(R.id.txtNoon)
    public void clickNoon() {
        selTimimg = "Noon";
        txtMor.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNoon.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_blue));
        txtEve.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));
        txtNight.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_light_blue));

    }


    @OnClick(R.id.recordstop)
    public void Stop_Recording_Clicked(View view) {

        requireActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
                txtTapMic.setText(R.string.tap_to_mic_on);
            }
        });

    }


    @OnClick(R.id.record)
    public void recordAudio() {
     /*   String contenttype = "audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";

        try {
            augnitoSpeechAudio = new AugnitoSpeechAudio(
                    this,
                    "wss://apis.augnito.ai/v2/speechapi",
                    "273ea63c-fde1-4d86-99a3-3a597d09af39",
                    "d029c49daa9141949dbaf8cca1b26f7b",
                    211801200, // Update with your lmid
                    "udhaya",
                    "",
                    -1,
                    "otherInfo", contenttype);

        } catch (URISyntaxException e) {
            e.printStackTrace(); // Log the exception
            requireActivity().runOnUiThread(() -> {
//                rectextlistening.setText("URI Syntax Error: " + e.getMessage());
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
            });
        } catch (Exception e) {
            e.printStackTrace(); // Handle any other exceptions
            requireActivity().runOnUiThread(() -> {
//                rectextlistening.setText("Error: " + e.getMessage());
                record.setVisibility(View.VISIBLE);
                recordstop.setVisibility(View.GONE);
            });
        }
    }*/


    }
}
