package com.plenome.pos.adapters;

import android.app.Activity;
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

public class PrescAdapter extends RecyclerView.Adapter<PrescAdapter.ViewHolder> {
    private Activity context;
    ArrayList<String> medicineAL, bfAfAL, medicineFormAL, timingAL, dosageAL, durationAL, addInfoAL;

    public PrescAdapter(Activity context, ArrayList<String> medicineAL, ArrayList<String> bfAfAL, ArrayList<String> medicineFormAL,
                        ArrayList<String> timingAL, ArrayList<String> dosageAL, ArrayList<String> durationAL, ArrayList<String> addInfoAL) {
        super();
        this.context = context;
        this.medicineAL = medicineAL;
        this.bfAfAL = bfAfAL;
        this.medicineFormAL = medicineFormAL;
        this.timingAL = timingAL;
        this.durationAL = durationAL;
        this.dosageAL = dosageAL;
        this.addInfoAL = addInfoAL;

    }

    @NonNull
    @Override
    public PrescAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        //   View row = convertView;
        LayoutInflater inflater = context.getLayoutInflater();

        View row = inflater.inflate(R.layout.prescription_row_item, null, true);
        PrescAdapter.ViewHolder viewHolder = new PrescAdapter.ViewHolder(row);
        return viewHolder;


        //   return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull PrescAdapter.ViewHolder holder, int position) {
        holder.txtMedName.setText(medicineAL.get(position));
        holder.txtTiming.setText(timingAL.get(position));
        holder.  txtDosage.setText(dosageAL.get(position));
        holder. txtDuration.setText(durationAL.get(position));
        holder. txtBfAf.setText(addInfoAL.get(position));

    }

    @Override
    public int getItemCount() {
        return medicineAL.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imgMedForm;
        TextView txtMedName, txtBfAf, txtTiming, txtDosage, txtDuration;

        public ViewHolder(View view) {
            super(view);
            Log.i("myLog", "PrescriptionAdapter ViewHolder");
            txtMedName = (TextView) view.findViewById(R.id.txtMedName);
            imgMedForm = (ImageView) view.findViewById(R.id.imgMedForm);
            txtBfAf = (TextView) view.findViewById(R.id.txtAddInfo);
            txtTiming = (TextView) view.findViewById(R.id.txtTime);
            txtDosage = (TextView) view.findViewById(R.id.txtDosage);
            txtDuration = (TextView) view.findViewById(R.id.txtDuration);

        }
    }
}
