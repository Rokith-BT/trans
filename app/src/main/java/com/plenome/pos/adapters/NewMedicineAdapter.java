package com.plenome.pos.adapters;

import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.PrescriptionDetail;
import com.plenome.pos.network.RestServices;

import java.util.List;

public class NewMedicineAdapter extends RecyclerView.Adapter<NewMedicineAdapter.NewMedicineViewHolder> {

    private Context context;
    private List<PrescriptionDetail> medicineList;
    private RestServices servicesApi;
    private Integer hopitalId;

    private NewMedicineAdapter.OnClickListener onClickListener;

    public NewMedicineAdapter(Context context, List<PrescriptionDetail> medicineList, RestServices services, Integer hospId) {
        this.context = context;
        this.medicineList = medicineList;
        this.servicesApi = services;
        this.hopitalId = hospId;
    }

    @NonNull
    @Override
    public NewMedicineViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_new_prescription, parent, false);
        return new NewMedicineViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NewMedicineViewHolder holder, int position) {
        PrescriptionDetail medicine = medicineList.get(position);

        // Bind data to the views
        holder.tvMedicineName.setText(medicine.getMedicineName());
        holder.tvDosage.setText(medicine.getDosage());
        holder.tvFrequency.setText(medicine.getFrequency());
        holder.tvTiming.setText(medicine.getWhen());
        String duration = medicine.getDurationCount() + " " + medicine.getDurationLimit();
        if (!duration.trim().isEmpty()){
            holder.tvDuration.setText(duration);
        }
        holder.tvQuantity.setText(String.valueOf(medicine.getQuantity()));
        holder.tvRemarks.setText(medicine.getRemarks());

        if (medicineList.get(position).getIsFromApi()){
            holder.tvMedicineName.setEnabled(false);
            holder.tvDosage.setEnabled(false);
            holder.tvFrequency.setEnabled(false);
            holder.tvTiming.setEnabled(false);
            holder.tvDuration.setEnabled(false);
            holder.tvQuantity.setEnabled(false);
            holder.tvRemarks.setEnabled(false);
        }


        holder.tvMedicineName.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setMedicineName(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        holder.tvDosage.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setDosage(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        holder.tvFrequency.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setFrequency(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        holder.tvTiming.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setWhen(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        holder.tvDuration.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setDurationLimit(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        holder.tvQuantity.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setQuantity(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });

        holder.tvRemarks.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                medicineList.get(position).setRemarks(charSequence.toString());
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });


        // Optional: Add actions for edit and delete icons
        holder.ivEdit.setOnClickListener(v -> {
            // Handle edit click
            Log.i("myLog","edit click in adapter");
            medicineList.get(position).setIsFromApi(false);
            holder.tvMedicineName.setEnabled(true);
            holder.tvDosage.setEnabled(true);
            holder.tvFrequency.setEnabled(true);
            holder.tvTiming.setEnabled(true);
            holder.tvDuration.setEnabled(true);
            holder.tvQuantity.setEnabled(true);
            holder.tvRemarks.setEnabled(true);
            holder.tvMedicineName.requestFocus();
        });

        holder.ivDelete.setOnClickListener(v -> {
            int pos = holder.getAdapterPosition();
            if (pos != RecyclerView.NO_POSITION) {
                onClickListener.onClick(pos, "Delete");
            }
        });


    }

    @Override
    public int getItemCount() {
        return medicineList.size();
    }

    public List<PrescriptionDetail> getMainList(){return medicineList;}

    // ViewHolder class to hold references to the views in each item
    public static class NewMedicineViewHolder extends RecyclerView.ViewHolder {

        EditText tvMedicineName, tvDosage, tvFrequency, tvTiming, tvDuration, tvQuantity, tvRemarks;
        ImageView ivEdit, ivDelete;

        public NewMedicineViewHolder(@NonNull View itemView) {
            super(itemView);

            // Initialize the views
            tvMedicineName = itemView.findViewById(R.id.tvMedicineName);
            tvDosage = itemView.findViewById(R.id.tvDosage);
            tvFrequency = itemView.findViewById(R.id.tvFrequency);
            tvTiming = itemView.findViewById(R.id.tvTiming);
            tvDuration = itemView.findViewById(R.id.tvDuration);
            tvQuantity = itemView.findViewById(R.id.tvQuantity);
            tvRemarks = itemView.findViewById(R.id.tvRemarks);

            ivEdit = itemView.findViewById(R.id.ivEdit);
            ivDelete = itemView.findViewById(R.id.ivDelete);
        }
    }

    public interface OnClickListener {
        void onClick(int position, String option);
    }

    public void setOnClickListener(NewMedicineAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }



}
