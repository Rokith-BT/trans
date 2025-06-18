package com.plenome.pos.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

// Extends the Adapter class to RecyclerView.Adapter
// and implement the unimplemented methods
public class DoctorListAdapter extends RecyclerView.Adapter<DoctorListAdapter.ViewHolder> {
    ArrayList<String> docNameAL, specialityAL, expAL, ratingAL, timeAL, qualificationAL;
    ArrayList<Double> feesAL;
    Context context;
    private OnClickListener onClickListener;

    // Constructor for initialization
    public DoctorListAdapter(Context context, ArrayList<String> docName, ArrayList<String> qualificationAL, ArrayList<String> speciality,
                             ArrayList<String> exp, ArrayList<String> rating, ArrayList<String> time, ArrayList<Double> fees) {
        this.context = context;
        this.docNameAL = docName;
        this.qualificationAL = qualificationAL;
        this.specialityAL = speciality;
        this.expAL = exp;
        this.ratingAL = rating;
        this.timeAL = time;
        this.feesAL = fees;
    }

    @NonNull
    @Override
    public DoctorListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflating the Layout(Instantiates list_item.xml
        // layout file into View object)
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.doctor_selection_row_item, parent, false);

        // Passing view to ViewHolder
        DoctorListAdapter.ViewHolder viewHolder = new DoctorListAdapter.ViewHolder(view);
        return viewHolder;
    }

    // Binding data to the into specified position
    @Override
    public void onBindViewHolder(@NonNull DoctorListAdapter.ViewHolder holder, int position) {
        // TypeCast Object to int type
        //  int res = (int) courseImg.get(position);
        // holder.images.setImageResource(res);
        holder.txtDocName.setText(docNameAL.get(position));
        holder.txtDocSpeciality.setText(specialityAL.get(position));
        holder.txtTime.setText(convertTimeRangeTo12HourFormat(timeAL.get(position)));
        String rating = ratingAL.get(position);
        if (!rating.isEmpty() && !rating.equalsIgnoreCase("-")) {
            holder.txtRating.setText(rating + " Ratings");
        } else
            holder.txtRating.setText("-");
        String exp = expAL.get(position);
        if (exp.isEmpty())
            exp = "-";
        holder.txtExp.setText(exp + " Years Experience");
        holder.txtQualification.setText(qualificationAL.get(position));
        holder.txtFee.setText("Rs. " + feesAL.get(position));
        holder.btnScheduleAppt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    onClickListener.onClick(position, docNameAL);
                }
            }
        });
      /*  holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    onClickListener.onClick(position, docNameAL);
                }
            }
        });*/
    }
    public static String convertTimeRangeTo12HourFormat(String timeRange24) {
        String[] times = timeRange24.split(" - ");
        String startTime = convertTo12HourFormat(times[0]);
        String endTime = convertTo12HourFormat(times[1]);
        return startTime + " - " + endTime;
    }
    public static String convertTo12HourFormat(String time24) {
        try {
            SimpleDateFormat sdf24 = new SimpleDateFormat("HH:mm");
            SimpleDateFormat sdf12 = new SimpleDateFormat("hh:mm a");
            Date date = sdf24.parse(time24);
            return sdf12.format(date);

        } catch (Exception e) {
            return null;
        }
    }

    public void setOnClickListener(OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public interface OnClickListener {
        void onClick(int position, ArrayList<String> docName);
    }

    @Override
    public int getItemCount() {
        // Returns number of items
        // currently available in Adapter
        return docNameAL.size();
    }

    // Initializing the Views
    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imgDoctor;
        TextView txtDocName, txtDocSpeciality, txtExp, txtRating, txtTime, txtFee, txtQualification;
        Button btnScheduleAppt;

        public ViewHolder(View view) {
            super(view);
            imgDoctor = (ImageView) view.findViewById(R.id.imgDoctor);
            txtDocName = (TextView) view.findViewById(R.id.txtDocName);
            txtQualification = (TextView) view.findViewById(R.id.txtDocDegree);
            txtDocSpeciality = (TextView) view.findViewById(R.id.txtDocSpeciality);
            txtExp = (TextView) view.findViewById(R.id.txtExp);
            txtRating = (TextView) view.findViewById(R.id.txtRatings);
            txtTime = (TextView) view.findViewById(R.id.txtTime);
            txtFee = (TextView) view.findViewById(R.id.txtFee);
            btnScheduleAppt = (Button) view.findViewById(R.id.btnSubmit);
        }
    }
}
