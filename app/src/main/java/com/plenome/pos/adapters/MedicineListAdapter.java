package com.plenome.pos.adapters;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.ClinicalNotesRequestResponse;
import com.plenome.pos.network.RestServices;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class MedicineListAdapter extends RecyclerView.Adapter<MedicineListAdapter.MedicineViewHolder> {

    private Context context;
    private List<String> dataAppan;
    private List<String> medicineList;
    private List<Integer> medicineID;
    private RestServices servicesApi;
    private Integer hopitalId;


    private MedicineListAdapter.OnClickListener onClickListener;

    public MedicineListAdapter(Context context,List<String> dataAppan,List<String> medicineList, List<Integer> medicineID, RestServices servicesApi, int hopitalId) {
        this.context = context;
        this.dataAppan = dataAppan;
        this.medicineList = medicineList;
        this.medicineID = medicineID;
        this.servicesApi = servicesApi;
        this.hopitalId = hopitalId;

    }

    @NonNull
    @Override
    public MedicineViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.medicine_list_adapter, parent, false);
        return new MedicineViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MedicineViewHolder holder, int position) {

        holder.medicineName.setText(medicineList.get(position));

        holder.close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (dataAppan.get(position).equalsIgnoreCase("api")){
                deleteChiefBasic(medicineID.get(position));
                }
                medicineList.remove(position);
                medicineID.remove(position);
                notifyItemRemoved(position);
                notifyItemRangeChanged(position, medicineList.size());
            }
        });

    }


    private void deleteChiefBasic(int position) {

                    Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call = servicesApi.deleteChiefComplaintBasic(position, hopitalId);
                    call.enqueue(new Callback<ClinicalNotesRequestResponse.ConsentRequestResponsedata>() {
                        @Override
                        public void onResponse(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Response<ClinicalNotesRequestResponse.ConsentRequestResponsedata> response) {
                            Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                        }

                        @Override
                        public void onFailure(Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> call, Throwable t) {

                        }
                    });


    }

    @Override
    public int getItemCount() {
        return medicineList.size();
    }

    // ViewHolder class to hold references to the views in each item
    public static class MedicineViewHolder extends RecyclerView.ViewHolder {

        TextView medicineName;
        ImageView close;

        public MedicineViewHolder(@NonNull View itemView) {
            super(itemView);


            medicineName = itemView.findViewById(R.id.medicine_name);
            close = itemView.findViewById(R.id.close);

        }
    }

    public interface OnClickListener {
        void onClick(int position, String option);
    }

    public void setOnClickListener(MedicineListAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }



}