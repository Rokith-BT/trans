package com.plenome.pos.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.omronhealthcare.OmronConnectivityLibrary.OmronLibrary.Model.OmronPeripheral;
import com.plenome.pos.R;

import java.util.ArrayList;

public class OmronDeviceListAdapter extends RecyclerView.Adapter<OmronDeviceListAdapter.ViewHolder> {


    private ArrayList<OmronPeripheral> itemList;
    private OnClickListener onClickListener;
    private Context rContext;

    public void ItemAdapter(ArrayList<OmronPeripheral> itemListInput, Context context) {
        this.itemList = itemListInput;
        this.rContext = context;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_omron_device, parent, false);
        ViewHolder viewHolder = new ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if (itemList !=null){
            holder.titleText.setText(itemList.get(position).getModelName());
            holder.imgIcon.setImageDrawable(ContextCompat.getDrawable(rContext,R.drawable.omron_logo));
        }
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    onClickListener.onClick(position, itemList.get(position));
                }
            }
        });
    }


    @Override
    public int getItemCount() {
        int size = 0;
        if (itemList != null)
            size = itemList.size();
        return size;
    }


    public void setOnClickListener(OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public interface OnClickListener {
        void onClick(int position,OmronPeripheral item);
    }


    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleText;
        ImageView imgIcon;

        public ViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.deviceName);
            imgIcon = itemView.findViewById(R.id.imgLogo);
        }
    }


}
