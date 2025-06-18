package com.plenome.pos.views.vibrasense.adapter;

import android.content.Context;
import android.content.SharedPreferences;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.clj.fastble.data.BleDevice;
import com.plenome.pos.R;

import java.util.List;

public class VibrasenseDevicesAdapter extends RecyclerView.Adapter<VibrasenseDevicesAdapter.ViewHolder> {

    private Context ctx;
    private List<BleDevice> list;
    private DevicesAdapterListener devicesAdapterListener;
    private static final String PREF_NAME = "VibrasenseDevicesPref";




    public VibrasenseDevicesAdapter(Context context, List<BleDevice> rowListItem, DevicesAdapterListener devicesAdapterListener) {
        this.ctx = context;
        this.list = rowListItem;
        this.devicesAdapterListener = devicesAdapterListener;

    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LayoutInflater layoutInflater = LayoutInflater.from(parent.getContext());
        View listItem = layoutInflater.inflate(R.layout.device_connectsss3, parent, false);
        ViewHolder viewHolder = new ViewHolder(listItem);
        return viewHolder;
    }

    public void addData(BleDevice bleDevice){
        list.add(bleDevice);
        notifyDataSetChanged();
    }

    public void clear(){
        list.clear();
        notifyDataSetChanged();
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        holder.setData(list.get(position),position);
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        private TextView tvTitleLabel,mac_Id;
        private TextView tvIndex;
        private ConstraintLayout cvContainer;


        public ViewHolder(View itemView) {
            super(itemView);

            this.tvTitleLabel = itemView.findViewById(R.id.tvTitleLabel);
            this.tvIndex = itemView.findViewById(R.id.tvIndex);
            this.cvContainer = itemView.findViewById(R.id.cvContainer);
            this.mac_Id = itemView.findViewById(R.id.mac_id);

            this.cvContainer.setOnClickListener(this);

        }

        @Override
        public void onClick(View v) {

            if(devicesAdapterListener != null){
                int position = getAdapterPosition();
                BleDevice selectedDevice = list.get(position);
                devicesAdapterListener.onDeviceClick(position,list.get(position));

                saveDeviceToPreferences(selectedDevice);
            }
        }


        private void saveDeviceToPreferences(BleDevice device) {
            SharedPreferences sharedPreferences = ctx.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();

            // Save device details
            editor.putString("device_name", device.getName());
            editor.putString("device_mac", device.getMac());

            editor.apply(); // Commit the changes
        }
        public void setData(BleDevice  model,int index){
            tvIndex.setText(""+(index+1)+".");
            tvTitleLabel.setText(""+model.getName());
            mac_Id.setText(""+model.getMac());

        }


    }

    public interface DevicesAdapterListener{
        public void onDeviceClick(int position, BleDevice bleDevice);

    }

}

