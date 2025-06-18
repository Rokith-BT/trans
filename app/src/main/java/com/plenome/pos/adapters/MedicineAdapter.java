package com.plenome.pos.adapters;

import android.app.AlertDialog;
import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.plenome.pos.R;
import com.plenome.pos.model.PostPrescriptionResponse;
import com.plenome.pos.model.PrescriptionDetail;
import com.plenome.pos.network.RestServices;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class MedicineAdapter extends RecyclerView.Adapter<MedicineAdapter.MedicineViewHolder> {

    private Context context;
    private List<PrescriptionDetail> medicineList;
    private RestServices servicesApi;
    private Integer hopitalId;

    private MedicineAdapter.OnClickListener onClickListener;

    public MedicineAdapter(Context context, List<PrescriptionDetail> medicineList, RestServices services, Integer hospId) {
        this.context = context;
        this.medicineList = medicineList;
        this.servicesApi = services;
        this.hopitalId = hospId;
    }

    @NonNull
    @Override
    public MedicineViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_prescription_layout, parent, false);
        return new MedicineViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MedicineViewHolder holder, int position) {
        // Get the current Medicine item
        if (position == 0) {
            holder.header.setVisibility(View.VISIBLE);
        } else {
            holder.header.setVisibility(View.GONE);
        }
        PrescriptionDetail medicine = medicineList.get(position);

        // Bind data to the views
        holder.tvMedicineName.setText(medicine.getMedicineName());
        holder.tvDosage.setText(medicine.getDosage());
        holder.tvFrequency.setText(medicine.getFrequency());
        holder.tvTiming.setText(medicine.getWhen());
        holder.tvDuration.setText(medicine.getDurationCount() + " " + medicine.getDurationLimit());
        holder.tvQuantity.setText(String.valueOf(medicine.getQuantity()));
        holder.tvRemarks.setText("Remarks: " + medicine.getRemarks());

        // Optional: Add actions for edit and delete icons
        holder.ivEdit.setOnClickListener(v -> {
            // Handle edit click
            Log.i("myLog","edit click in adapter");
            if (onClickListener != null) {
                onClickListener.onClick(position, "Edit");
            }
        });

        holder.ivDelete.setOnClickListener(v -> {
          //  showDeleteConfirmationDialog(position);
            if (onClickListener != null) {
                onClickListener.onClick(position, "Delete");
            }
        });
    }

    // Show the confirmation dialog for deleting an item
    private void showDeleteConfirmationDialog(int position) {
        new AlertDialog.Builder(context)
                .setTitle("Delete Prescription")
                .setMessage("Are you sure you want to delete this prescription?")
                .setPositiveButton("Yes", (dialog, which) -> {
                    Call<PostPrescriptionResponse> call = servicesApi.deletePrescription(medicineList.get(position).getId(), hopitalId);
                    call.enqueue(new Callback<PostPrescriptionResponse>() {
                        @Override
                        public void onResponse(Call<PostPrescriptionResponse> call, Response<PostPrescriptionResponse> response) {
                            Log.i("mylog", "getPrescription response:" + new Gson().toJson(response.body()));
                        }

                        @Override
                        public void onFailure(Call<PostPrescriptionResponse> call, Throwable t) {

                        }
                    });
                    // Remove the item from the list
                    medicineList.remove(position);
                    // Notify the adapter about the removed item
                    notifyItemRemoved(position);
                    notifyItemRangeChanged(position, medicineList.size());
                })
                .setNegativeButton("No", (dialog, which) -> dialog.dismiss()) // Dismiss on "No"
                .show();
    }

    @Override
    public int getItemCount() {
        return medicineList.size();
    }

    // ViewHolder class to hold references to the views in each item
    public static class MedicineViewHolder extends RecyclerView.ViewHolder {

        TextView tvMedicineName, tvBrandName, tvDosage, tvFrequency, tvTiming, tvDuration, tvQuantity, tvRemarks;
        ImageView ivEdit, ivDelete;
        LinearLayout header;

        public MedicineViewHolder(@NonNull View itemView) {
            super(itemView);

            // Initialize the views
            tvMedicineName = itemView.findViewById(R.id.tvMedicineName);
            //   tvBrandName = itemView.findViewById(R.id.tvBrandName);
            tvDosage = itemView.findViewById(R.id.tvDosage);
            tvFrequency = itemView.findViewById(R.id.tvFrequency);
            tvTiming = itemView.findViewById(R.id.tvTiming);
            tvDuration = itemView.findViewById(R.id.tvDuration);
            tvQuantity = itemView.findViewById(R.id.tvQuantity);
            tvRemarks = itemView.findViewById(R.id.tvRemarks);
            header = itemView.findViewById(R.id.header);

            ivEdit = itemView.findViewById(R.id.ivEdit);
            ivDelete = itemView.findViewById(R.id.ivDelete);
        }
    }

    public interface OnClickListener {
        void onClick(int position, String option);
    }

    public void setOnClickListener(MedicineAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }



}