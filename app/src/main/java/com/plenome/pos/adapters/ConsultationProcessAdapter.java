package com.plenome.pos.adapters;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;

import java.util.ArrayList;

public class ConsultationProcessAdapter extends RecyclerView.Adapter<ConsultationProcessAdapter.ViewHolder> {
    ArrayList<String> processNameAL, processDescAL, dateAL, doctorNameAL, colorCodeAL;
    Context context;
    private ConsultationProcessAdapter.OnClickListener onClickListener;

    // Constructor for initialization
    public ConsultationProcessAdapter(Context context, ArrayList<String> pNameAL, ArrayList<String> pDescAL, ArrayList<String> dateAL, ArrayList<String> doctorAL, ArrayList<String> colorAL) {
        this.context = context;
        this.processNameAL = pNameAL;
        this.processDescAL = pDescAL;
        this.dateAL = dateAL;
        this.doctorNameAL = doctorAL;
        this.colorCodeAL = colorAL;

    }

    @NonNull
    @Override
    public ConsultationProcessAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflating the Layout(Instantiates list_item.xml
        // layout file into View object)
        Log.i("myLog", "onCreateViewHolder");
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.consultation_process_row, parent, false);

        // Passing view to ViewHolder
        ConsultationProcessAdapter.ViewHolder viewHolder = new ConsultationProcessAdapter.ViewHolder(view);
        return viewHolder;
    }

    // Binding data to the into specified position
    @Override
    public void onBindViewHolder(@NonNull ConsultationProcessAdapter.ViewHolder holder, int position) {
        // TypeCast Object to int type
        //  int res = (int) courseImg.get(position);
        // holder.images.setImageResource(res);
        Log.i("myLog", "onBindViewHolder pos:"+position);
        holder.txtProcessName.setText(processNameAL.get(position));
        holder.txtProcessDesc.setText(processDescAL.get(position));
        holder.txtDate.setText(dateAL.get(position));
        holder.txtDocName.setText(doctorNameAL.get(position));
        String color = colorCodeAL.get(position);
        Log.i("myLog","color:"+ color+"     color len:"+color.length());
       // Drawable drawable = ContextCompat.getDrawable(context, R.drawable.circle_bg);
        if (color != null && !color.isEmpty()) {
            Drawable drawable = ContextCompat.getDrawable(context, R.drawable.light_blue_circle_bg);
            GradientDrawable gradientDrawable = (GradientDrawable) drawable;
            gradientDrawable.setColor(Color.parseColor(color));
            holder.imgProcess.setBackground(gradientDrawable);
            holder.viewProcess.setBackgroundColor(Color.parseColor(color));
            Log.i("myLog","color updated");
        }else{
            Log.i("myLog","else color not updated");
            holder.imgProcess.setBackground(ContextCompat.getDrawable(context, R.drawable.circle_bg));
        }


        //   holder.imgProcess.setImageResource(R.drawable.clock);
        //    gradientDrawable.setShape(GradientDrawable.OVAL);
        //   gradientDrawable.setStroke(12, Color.CYAN);
        int check = processNameAL.size() - 1;
        if (position == check)
            holder.viewProcess.setVisibility(View.INVISIBLE);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "onclick");
                if (onClickListener != null) {
                    onClickListener.onClick(position, processNameAL);
                }
            }
        });
    }

    public void setOnClickListener(ConsultationProcessAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public interface OnClickListener {
        void onClick(int position, ArrayList<String> docName);
    }

    @Override
    public int getItemCount() {
        // Returns number of items
        // currently available in Adapter
        Log.i("myLog", "getitemcount");
        return processNameAL.size();
    }

    // Initializing the Views
    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView imgProcess;
        View viewProcess;
        TextView txtDocName, txtProcessName, txtProcessDesc, txtDate;


        public ViewHolder(View view) {
            super(view);
            Log.i("myLog", "view holder");
            imgProcess = (ImageView) view.findViewById(R.id.imgProcess);
            txtDocName = (TextView) view.findViewById(R.id.txtDoctorName);
            txtProcessDesc = (TextView) view.findViewById(R.id.txtProcessDesc);
            txtProcessName = (TextView) view.findViewById(R.id.txtProcessName);
            txtDate = (TextView) view.findViewById(R.id.txtDate);
            viewProcess = (View) view.findViewById(R.id.viewProcess);

        }
    }
}