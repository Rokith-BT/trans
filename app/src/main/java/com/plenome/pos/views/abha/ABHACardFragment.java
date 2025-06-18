package com.plenome.pos.views.abha;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.CreateAbhaFragment;

import java.io.IOException;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ABHACardFragment extends Fragment {
    View rootView;
    String token;
    RestServices services;
    String fromMenu;
    @BindView(R.id.imgCard)
    ImageView img;


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_abha_card, container, false);
        ButterKnife.bind(this, rootView);
        Bundle bundle = getArguments();
        token = bundle.getString("token");
        fromMenu = bundle.getString("from_menu");
        services = RetrofitInstance.createAbhaService(RestServices.class);
        getAbhaCarddownload();
        return rootView;
    }

    @OnClick(R.id.btnDone)
    public void clickedDone() {
        CreateAbhaFragment newFragment = new CreateAbhaFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment);
        transaction.addToBackStack(null);
        transaction.commit();

    }


    private void getAbhaCarddownload() {
        RestServices services = RetrofitInstance.createAbhaService(RestServices.class);
        OPHubRequests.GetAbhaCardRequest request = new OPHubRequests.GetAbhaCardRequest();
        Log.i("myLog", "token:" + token);
        request.setToken(token);
        Log.i("mylog", "getAbhaCard request:" + new Gson().toJson(request));
        Call<ResponseBody> call = services.getAbhaCard(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                if (response.body() != null) {
                    Log.i("myLog", "server contacted and has file");

                    try {
                        byte[] bytes = response.body().bytes();
                        Log.i("myLog", "byte  length:" + bytes.length);
                        byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                        Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                        img.setImageBitmap(bitmap);
                        Log.i("myLog", "after image set");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                } else {
                    Log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Log.i("myLog", "getAbhaCard response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

}
