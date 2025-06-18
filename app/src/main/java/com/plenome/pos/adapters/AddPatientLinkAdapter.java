package com.plenome.pos.adapters;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.AbhaLinkResponse;

import java.util.List;

public class AddPatientLinkAdapter extends RecyclerView.Adapter<AddPatientLinkAdapter.ViewHolder>{

    private List<AbhaLinkResponse> itemList;
    private OnClickListener onClickListener ;
    public void ItemAdapter(List<AbhaLinkResponse> itemList) {
        this.itemList = itemList;
    }

    @NonNull
    @Override
    public AddPatientLinkAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_select_abha_addr_link, parent, false);
        AddPatientLinkAdapter.ViewHolder viewHolder = new AddPatientLinkAdapter.ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull AddPatientLinkAdapter.ViewHolder holder, @SuppressLint("RecyclerView") int position) {
            holder.titleText.setText(itemList.get(0).getDetails().get(position).getPatientName());
            holder.mobileNumber.setText(itemList.get(0).getDetails().get(position).getMobileno());
            holder.genter.setText(itemList.get(0).getDetails().get(position).getGender());
            holder.txtAge.setText(itemList.get(0).getDetails().get(position).getDob());

        holder.txt_linkAbha.setOnClickListener(v -> {
            if (onClickListener != null) {
                onClickListener.onTitleClick(position, itemList.get(0).getDetails().get(position), itemList.get(0));
            }
        });


    }

    @Override
    public int getItemCount() {
        System.out.println("printss size" +itemList.size() );
        return itemList.get(0).getDetails().size();
    }

    public void setOnClickListener(AddPatientLinkAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }
    public interface OnClickListener {
        void onTitleClick(int position, AbhaLinkResponse.Detail item, AbhaLinkResponse items);
    }
    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleText, mobileNumber, genter,txt_linkAbha,txtAge;
        ImageView profImage;

        public ViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.card_title);
            mobileNumber = itemView.findViewById(R.id.card_description);
            genter = itemView.findViewById(R.id.card_description_2);
            profImage = itemView.findViewById(R.id.card_image);
            txt_linkAbha = itemView.findViewById(R.id.txt_linkAbha);
            txtAge = itemView.findViewById(R.id.txtAge);

        }
    }

}
