package com.plenome.pos.adapters;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.Html;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.ExistPatientDetail;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExistingPatientAdapter extends RecyclerView.Adapter<ExistingPatientAdapter.ViewHolder> {
    private List<ExistPatientDetail.Detail> itemList;
    private OnClickListener onClickListener;
    RestServices imageServices;

    public void PatientAdapter(List<ExistPatientDetail.Detail> itemList) {
        this.itemList = itemList;
    }

    @NonNull
    @Override
    public ExistingPatientAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.existing_patient_adapter, parent, false);
        ExistingPatientAdapter.ViewHolder viewHolder = new ExistingPatientAdapter.ViewHolder(view);
        return viewHolder;
    }


    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        imageServices = RetrofitInstance.createImageUrl(RestServices.class);


        if (itemList != null) {
            showProfileimage(itemList.get(position).getImage(),holder);
            holder.titleText.setText(itemList.get(position).getPatientName());
            String colorFormat = itemList.get(position).getMobileno()/* + " |<font color='#6070FF'> Patient Id: " + itemList.get(position).getId()+"</font>"*/;
            holder.mobile_number.setText(Html.fromHtml(colorFormat, Html.FROM_HTML_MODE_LEGACY));
            holder.age.setText(itemList.get(position).getAge() + " | " + itemList.get(position).getGender());
            System.out.println(itemList.get(position).getImage()+"CheckAdaptertImage");

        }


        holder.lyt_patient.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    onClickListener.onClick(position, itemList.get(position));
                }
            }
        });
    }

    private void showProfileimage(String imgName, ViewHolder holder) {
        //log.i("myLog", "showProfileimage");
        Log.i("myLog", "imgName:Adpter" + imgName);
        OPHubRequests.ShowProfileImageRequest request = new OPHubRequests.ShowProfileImageRequest();
        request.setKey(imgName);
        Call<ResponseBody> call = imageServices.getProfileImageNew(request);
        call.enqueue(new Callback<ResponseBody>() {

            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                if (response.body() != null) {
                    //log.i("myLog", "server contacted and has file");

                    try {
                        byte[] bytes = response.body().bytes();
                        //log.i("myLog", "byte  length:" + bytes.length);
                        if (bytes != null) {
                            byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                            if (decodedImageBytes != null) {
                                Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                                if (bitmap != null) {
                                    holder.patient_img.setImageBitmap(bitmap);
                                    //log.i("myLog", "after image set");
                                }
                            }
                        }
                    } catch (Exception e) {
                        //  throw new RuntimeException(e);
                        //log.i("myLog", "exception", e);
                    }

                } else {
                    //log.i("myLog", "server contact failed");
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                //log.i("myLog", "getAbhaCard response failure:" + t.toString());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    public void setOnClickListener(ExistingPatientAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public interface OnClickListener {
        void onClick(int position, ExistPatientDetail.Detail detail);
    }

    @Override
    public int getItemCount() {
        int size = 0;
        size = itemList.size();
        System.out.println("print size " + size);
        return size;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleText, mobile_number, age;
        ImageView patient_img;
        LinearLayout lyt_patient;

        public ViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.patient_name);
            mobile_number = itemView.findViewById(R.id.mobile_number);
            age = itemView.findViewById(R.id.age);
            patient_img = itemView.findViewById(R.id.patient_img);
            lyt_patient = itemView.findViewById(R.id.lyt_patient);

        }
    }
}
