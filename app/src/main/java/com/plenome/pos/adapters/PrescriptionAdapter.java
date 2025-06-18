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

import com.plenome.pos.R;

import java.util.ArrayList;

public class PrescriptionAdapter extends RecyclerView.Adapter<PrescriptionAdapter.ViewHolder> {
    ArrayList<String> medicineAL, bfAfAL, medicineFormAL, timingAL, dosageAL, durationAL, addInfoAL;
    ArrayList<Double> feesAL;
    Context context;
    private PrescriptionAdapter.OnClickListener onClickListener;

    // Constructor for initialization
    public PrescriptionAdapter(Context context, ArrayList<String> medicineName, ArrayList<String> bfAf,
                               ArrayList<String> medicineForm, ArrayList<String> timing, ArrayList<String> dosage,
                               ArrayList<String> duration, ArrayList<String> additionalInfo) {
        Log.i("myLog","PrescriptionAdapter");
        this.context = context;
        this.medicineAL = medicineName;
        this.bfAfAL = bfAf;
        this.medicineFormAL = medicineForm;
        this.timingAL = timing;
        this.dosageAL = dosage;
        this.durationAL = duration;
        this.addInfoAL = additionalInfo;
        Log.i("myLog","PrescriptionAdapter size:"+medicineName.size());
    }

    @NonNull
    @Override
    public PrescriptionAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        Log.i("myLog","PrescriptionAdapter onCreateViewHolder");
        // Inflating the Layout(Instantiates list_item.xml
        // layout file into View object)
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.prescription_row_item, parent, false);

        // Passing view to ViewHolder
        PrescriptionAdapter.ViewHolder viewHolder = new PrescriptionAdapter.ViewHolder(view);
        return viewHolder;
    }

    // Binding data to the into specified position
    @Override
    public void onBindViewHolder(@NonNull PrescriptionAdapter.ViewHolder holder, int position) {
        Log.i("myLog","PrescriptionAdapter onBindViewHolder");
        holder.txtMedName.setText(medicineAL.get(position));
        holder.txtDuration.setText(durationAL.get(position));
        holder.txtDosage.setText(dosageAL.get(position));
        holder.txtBfAf.setText(bfAfAL.get(position));
        holder.txtTiming.setText(timingAL.get(position));
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    onClickListener.onClick(position, medicineAL);
                }
            }
        });
    }

    public void setOnClickListener(PrescriptionAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public interface OnClickListener {
        void onClick(int position, ArrayList<String> docName);
    }

    @Override
    public int getItemCount() {
        // Returns number of items
        // currently available in Adapter
        return medicineAL.size();
    }

    // Initializing the Views
    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imgMedForm;
        TextView txtMedName, txtBfAf, txtTiming, txtDosage, txtDuration;

        public ViewHolder(View view) {
            super(view);
            Log.i("myLog","PrescriptionAdapter ViewHolder");
            imgMedForm = (ImageView) view.findViewById(R.id.imgMedForm);
            txtBfAf = (TextView) view.findViewById(R.id.txtAddInfo);
            txtTiming = (TextView) view.findViewById(R.id.txtTime);
            txtDosage = (TextView) view.findViewById(R.id.txtDosage);
            txtDuration = (TextView) view.findViewById(R.id.txtDuration);
            txtMedName = (TextView) view.findViewById(R.id.txtMedName);

        }
    }
}
