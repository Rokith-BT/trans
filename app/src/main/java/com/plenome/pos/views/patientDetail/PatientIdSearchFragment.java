package com.plenome.pos.views.patientDetail;

import static android.view.Gravity.CENTER;

import android.app.Dialog;
import android.graphics.drawable.PictureDrawable;
import android.os.Bundle;
import android.text.InputFilter;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.request.RequestOptions;
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYou;
import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.adapters.CountryCodeAdapter;
import com.plenome.pos.model.ExistPatientDetResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.OPHubApplication;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.OnItemSelected;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class PatientIdSearchFragment extends Fragment {
    View rootView;

    RestServices services;
    @BindView(R.id.relFragment)
    RelativeLayout relFragment;


    @BindView(R.id.edtPatientId)
    EditText edtPatientId;

    @BindView(R.id.txtOptions)
    TextView txtOptions;

//    @BindView(R.id.edtDialCode)
//    EditText edtDialCode;
    @BindView(R.id.spinSelect)
    Spinner spinSelect;

    @BindView(R.id.imgFlagPhoneNo)
    ImageView imgFlagPhoneNo;

    @BindView(R.id.lytPhoneNumber)
    LinearLayout lytphonenumber;

    @BindView(R.id.lytPatientId)
    LinearLayout lytpatientid;

    @BindView(R.id.relPhoneNo)
    RelativeLayout relPhoneNo;

    @BindView(R.id.txtPhoneCode)
    TextView txtphonecode;

    @BindView(R.id.listView)
    ListView listView;

    @BindView(R.id.scrollView)
    ScrollView scrollView;

    @BindView(R.id.edtPhoneNo)
    EditText edtPhoneNo;

    private String dialCode;


    int hospitalId;
    Dialog dialogConfirmation;

    ArrayList<String> countryName, countryDialCode, countryIso, countryFlag, bloodGroupAL, alStatus, genderAL;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_patient_id_search, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarTitle.setText(R.string.appointmentBook);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        ArrayList<String> al = new ArrayList<>();
        al.add("Phone Number");
        al.add("Patient Id");
        al.add("ABHA Number");
        //  OPHubUtils.addProdTypeSpinner(getActivity(), al, spinSelect, "Select");
        ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, al);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinSelect.setAdapter(adapter);
        hospitalId = OPHubApplication.getHospitalId();
        OPHubApplication.flagScrollView = scrollView;
        OPHubApplication.flagListView = listView;
        getCountryCode();


        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                // txtPrimaryNoCode.setText(countryDialCode.get(position));
                listView.setVisibility(View.GONE);
                scrollView.setVisibility(View.VISIBLE);
                String imgUrl = countryFlag.get(position);
                dialCode = countryDialCode.get(position);
                //   if (imgUrl != null && !imgUrl.isEmpty()) {

                txtphonecode.setText(dialCode);
                if (imgUrl != null && !imgUrl.isEmpty()) {
                    RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                            .init()
                            .with(getActivity())
                            .getRequestBuilder();
                    requestBuilder
                            .load(imgUrl)
                            .transition(DrawableTransitionOptions.withCrossFade())
                            .apply(new RequestOptions()
                                    .centerCrop())
                            .into(imgFlagPhoneNo);
                } else
                    imgFlagPhoneNo.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_no_flag));
            }
        });
        return rootView;
    }

    @OnItemSelected(R.id.spinSelect)
    public void spinnerClicked() {
        String searchBy = spinSelect.getSelectedItem().toString();
        txtOptions.setText(searchBy);
        edtPatientId.setText("");
        edtPatientId.setHint("Enter " + searchBy);
        if (searchBy.equalsIgnoreCase("Phone Number")) {
            lytphonenumber.setVisibility(View.VISIBLE);
            lytpatientid.setVisibility(View.GONE);
            setEditTextMaxLength(edtPatientId, 10);
            //   edtPatientId.setMaxLEms(10);
        } else {
            lytphonenumber.setVisibility(View.GONE);
            lytpatientid.setVisibility(View.VISIBLE);
            setEditTextMaxLength(edtPatientId, 16);
            // if (searchBy.equalsIgnoreCase("ABHA Number"))
            //   edtPatientId.setMaxEms(16);
        }

    }

    @OnClick(R.id.btnContinue)
    public void clickContinue() {
        //  relFragment.removeAllViews();
        String searchBy = spinSelect.getSelectedItem().toString();
        String value = edtPatientId.getText().toString();
        String phone = edtPhoneNo.getText().toString();
        int pos = spinSelect.getSelectedItemPosition();
        if (searchBy.equalsIgnoreCase("Phone Number")) {
            if (phone.isEmpty()) {
                System.out.println("print error " + searchBy);
                Toast.makeText(getActivity(), "Please enter " + searchBy, Toast.LENGTH_SHORT).show();
                return;
            }
        } else {
            if (value.isEmpty()) {
                Toast.makeText(getActivity(), "Please enter " + searchBy, Toast.LENGTH_SHORT).show();
                return;
            }
        }

        if (pos == 0) {
            searchBy = "mobile";
            if (phone.length() != 10) {
                Toast.makeText(getActivity(), "Please enter valid 10 digit phone number", Toast.LENGTH_SHORT).show();
                return;
            }
        } else if (pos == 1) {
            searchBy = "patientId";
        } else if (pos == 2) {
            searchBy = "ABHA";
            if (value.length() != 16) {
                Toast.makeText(getActivity(), "Please enter valid 16 digit ABHA number", Toast.LENGTH_SHORT).show();
                return;
            }
        }
        if (searchBy.equalsIgnoreCase("mobile")) {
            getExistPatientDet(searchBy, phone);
        } else {
            getExistPatientDet(searchBy, value);
        }


    }


    @OnClick(R.id.btnAddNewPatient)
    public void clickAddNewPatient() {
        //    relFragment.removeAllViews();
        AddNewPatientFragment newFragment = new AddNewPatientFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        //Bundle result = new Bundle();
        //result.putString("from_screen", "Patient_id_search");
        //  newFragment.setArguments(result);
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();
    }

    @OnClick(R.id.relPhoneNo)
    public void clickedPrimaryNoFlag() {
        Log.i("myLog", "clciked primary No code");

        listView.setVisibility(View.VISIBLE);
        scrollView.setVisibility(View.GONE);
        if (countryName != null) {
            CountryCodeAdapter adapter = new CountryCodeAdapter(getActivity(), countryName, countryDialCode, countryFlag);
            // Setting Adapter to RecyclerView
            if (adapter != null)
                listView.setAdapter(adapter);
        }
    }


    private void getCountryCode() {
        Log.i("myLog", "getCountryCode");
        services.getCountry().enqueue(new Callback<List<OPHubResponse.CountryResponse>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.CountryResponse>> call, Response<List<OPHubResponse.CountryResponse>> response) {
                try {
                    Log.i("myLog", "getCountryCode onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.CountryResponse> list = response.body();
                        int size = list.size();
                        countryName = new ArrayList<>();
                        countryDialCode = new ArrayList<>();
                        countryIso = new ArrayList<>();
                        countryFlag = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            OPHubResponse.CountryResponse resp = list.get(start);
                            String name = resp.getName();
                            String flagUrl = resp.getCountryFlag();
                            String dialCode = resp.getDial_code();
                            countryName.add(name);
                            countryFlag.add(flagUrl);
                            countryDialCode.add(dialCode);
                            countryIso.add(resp.getIso());

                            if (name.equalsIgnoreCase("India")) {
                                if (flagUrl != null && !flagUrl.isEmpty()) {
                                    RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                                            .init()
                                            .with(getActivity())
                                            .getRequestBuilder();
                                    requestBuilder
                                            .load(flagUrl)
                                            .transition(DrawableTransitionOptions.withCrossFade())
                                            .apply(new RequestOptions()
                                                    .centerCrop())
                                            .into(imgFlagPhoneNo);
                                }
                                txtphonecode.setText(dialCode);

                            }
                        }


                    } else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure
                    (Call<List<OPHubResponse.CountryResponse>> call, Throwable t) {
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }

        });
    }

    private void getExistPatientDet(String searchBy, String value) {
        OPHubRequests.GetExistPatientDetReq request = new OPHubRequests.GetExistPatientDetReq();
        request.setHospitalId(hospitalId);
        request.setSearchBy(searchBy);
        request.setValue(value);
        Log.i("mylog", "getExistPatientDet request:" + new Gson().toJson(request));
        Call<List<ExistPatientDetResponse>> call = services.getExistPatientDet(request);
        call.enqueue(new Callback<List<ExistPatientDetResponse>>() {

            @Override
            public void onResponse(Call<List<ExistPatientDetResponse>> call, Response<List<ExistPatientDetResponse>> response) {
                try {
                    Log.i("myLog", "getExistPatientDet response:");
                    Log.i("mylog", "getExistPatientDet response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "getExistPatientDet response isSuccess:" + response.body().toString());
                        List<ExistPatientDetResponse> list = response.body();
                        ExistPatientDetResponse resp = list.get(0);
                        String message = resp.getMessage();
                        Log.i("myLog", "message:" + message);
                        if (message != null) {
                            String content = edtPatientId.getText().toString();
                            AddNewPatientFragment newFragment = new AddNewPatientFragment();
                            FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                            Bundle result = new Bundle();
                            if (searchBy != null && searchBy.equalsIgnoreCase("mobile"))
                                result.putString("phone", value);
                            if (searchBy != null && searchBy.equalsIgnoreCase("abha_no"))
                                result.putString("abha_no", value);
                            result.putString("from_screen", "Patient_id_search");
                            newFragment.setArguments(result);
                            transaction.replace(R.id.fragment_container, newFragment);
                            transaction.addToBackStack(null);
                            transaction.commit();
                            //   showConfirmationDialog(message);
                        } else {
                            int patientId = resp.getId();

                            if (patientId != 0) {

                                PatientProfileFragment newFragment = new PatientProfileFragment();
                                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                Bundle result = new Bundle();
                                result.putInt("patient_id", resp.getId());
                                result.putString("name", resp.getPatient_name());
                                result.putString("gender", resp.getGender());
                                result.putInt("age", resp.getAge());
                                result.putString("bloodGroup", resp.getBloodGroup());
                                result.putString("phone", resp.getMobileno());
                                String dob = resp.getDob();
                                if (dob != null && dob.contains("T")) {
                                    String[] dobStr = dob.split("T");
                                    dob = dobStr[0];
                                }
                                result.putString("dob", dob);
                                result.putString("email", resp.getEmail());
                                result.putString("abha_no", resp.getAbhaNo());
                                result.putString("address", resp.getAddress());
                                result.putString("abha_address", resp.getAbhaAddress());
                                result.putString("salutation", resp.getSalutation());
                                result.putString("dial_code", resp.getDial_code());
                                result.putString("pincode", resp.getPincode());
                                result.putString("emergency_mobile_no", resp.getEmergency_mobile_no());
                                result.putString("from_screen", "Patient_id_search");
                                newFragment.setArguments(result);
                                Log.i("myLog", "getExistPatientDet b4 bundle");
                                transaction.replace(R.id.fragment_container, newFragment);
                                transaction.addToBackStack(null);
                                transaction.commit();

                            /*    DoctorSelectionFragment newFragment = new DoctorSelectionFragment();
                                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                                Bundle result = new Bundle();
                                result.putInt("patient_id", patientId);
                                result.putString("name", resp.getPatient_name());
                                result.putString("gender", resp.getGender());
                                result.putInt("age", resp.getAge());
                                result.putString("bloodGroup", resp.getBloodGroup());
                                result.putString("phone", resp.getMobileno());
                                result.putString("email", resp.getEmail());
                                result.putString("abha_no", resp.getAbhaNo());

                                result.putString("from_screen", "Patient_id_search");
                                newFragment.setArguments(result);
                                transaction.replace(R.id.fragment_container, newFragment);
                                transaction.addToBackStack(null);
                                transaction.commit();*/
                            } else {
                                Toast.makeText(getActivity(), "Patient ID is not generated, Try again later", Toast.LENGTH_SHORT).show();
                            }

                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<ExistPatientDetResponse>> call, Throwable t) {
                Log.i("myLog", "getExistPatientDet response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    public void setEditTextMaxLength(final EditText editText, int length) {
        InputFilter[] FilterArray = new InputFilter[1];
        FilterArray[0] = new InputFilter.LengthFilter(length);
        editText.setFilters(FilterArray);
    }

    public void showConfirmationDialog(String message) {

        dialogConfirmation = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_status_confirmation, null);
        dialogConfirmation.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogConfirmation.getWindow().setGravity(CENTER);
        Button btnNo = dialogConfirmation.findViewById(R.id.btnNo);
        Button btnYes = dialogConfirmation.findViewById(R.id.btnYes);
        TextView txtTitle = dialogConfirmation.findViewById(R.id.txtMessage);
        ImageView imgClose = dialogConfirmation.findViewById(R.id.imgClose);
        txtTitle.setText(message);
        btnNo.setText(R.string.cancel);
        btnYes.setText(R.string.add_new_patient);

        btnNo.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogConfirmation.dismiss();
            }
        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogConfirmation.dismiss();
            }
        });

        btnYes.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "btn submit");
                dialogConfirmation.dismiss();
                int pos = spinSelect.getSelectedItemPosition();
                String searchBy = null;

                if (pos == 0) {
                    searchBy = "patient_id";

                } else if (pos == 1) {
                    searchBy = "phone";

                } else if (pos == 2) {
                    searchBy = "abha_no";
                }
                String content = edtPatientId.getText().toString();
                AddNewPatientFragment newFragment = new AddNewPatientFragment();
                FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                Bundle result = new Bundle();
                if (searchBy != null && searchBy.equalsIgnoreCase("phone"))
                    result.putString("phone", content);
                if (searchBy != null && searchBy.equalsIgnoreCase("abha_no"))
                    result.putString("abha_no", content);
                result.putString("from_screen", "Patient_id_search");
                newFragment.setArguments(result);
                transaction.replace(R.id.fragment_container, newFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });
        dialogConfirmation.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogConfirmation.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(300);
        dialogConfirmation.getWindow().setAttributes(lp);
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

}
