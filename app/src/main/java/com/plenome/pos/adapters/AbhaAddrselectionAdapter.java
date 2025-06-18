package com.plenome.pos.adapters;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.VerifyAadhaarOTPResp;
import com.plenome.pos.model.VerifyMobileOTPResponse;
import com.plenome.pos.model.VerifyNewMobileOTPResponse;

import java.util.List;

public class AbhaAddrselectionAdapter extends RecyclerView.Adapter<AbhaAddrselectionAdapter.ViewHolder> {
    private List<VerifyMobileOTPResponse.Users> itemList;
    private VerifyAadhaarOTPResp.KycVerifiedData.ABHAProfile aadhaarList;

    private List<VerifyNewMobileOTPResponse.Account> mobileUser;
    private OnClickListener onClickListener;


    public void ItemAdapter(List<VerifyMobileOTPResponse.Users> itemList, VerifyAadhaarOTPResp.KycVerifiedData.ABHAProfile aadhaarList, List<VerifyNewMobileOTPResponse.Account> mobileUser) {
        this.itemList = itemList;
        this.aadhaarList = aadhaarList;
        this.mobileUser = mobileUser;
    }

    @NonNull
    @Override
    public AbhaAddrselectionAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_select_abha_addr, parent, false);
        AbhaAddrselectionAdapter.ViewHolder viewHolder = new AbhaAddrselectionAdapter.ViewHolder(view);
        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        String photoStr = null;
        VerifyMobileOTPResponse.Users item = null;
        if (itemList != null) {
            item = itemList.get(position);
            holder.titleText.setText(item.getFullName());
            holder.register.setVisibility(View.GONE);
            holder.subText.setText(item.getAbhaAddress());
            String abhaNumber = item.getAbhaNumber();
            String makedNumber = extractMaskedMobile(abhaNumber);
            holder.subSmallText.setText(makedNumber);
            photoStr = item.getProfilePhoto();

        } else if (aadhaarList != null) {
            List<String> phrList = aadhaarList.getPhrAddress();
            holder.titleText.setText(aadhaarList.getFirstName() + " " + aadhaarList.getMiddleName() + " " + aadhaarList.getLastName());
            holder.register.setVisibility(View.GONE);
            holder.txtAge.setText(aadhaarList.getDob());
            holder.txtGenter.setText(aadhaarList.getGender());
            String abhaAddress = phrList.get(position);
            holder.subText.setText(abhaAddress);
            String abhaNumber = aadhaarList.getABHANumber();
            String makedNumber = extractMaskedMobile(abhaNumber);
            holder.subSmallText.setText(makedNumber);
            photoStr = aadhaarList.getPhoto();
        }

        else if (mobileUser != null) {
            holder.titleText.setText(mobileUser.get(position).getName());
            holder.txtAge.setText(mobileUser.get(position).getDob());
            holder.register.setVisibility(View.GONE);
            holder.txtGenter.setText(mobileUser.get(position).getGender());
            String abhaAddress = mobileUser.get(position).getPreferredAbhaAddress();
            holder.subText.setText(abhaAddress);
            String abhaNumber = mobileUser.get(position).getABHANumber();
            String makedNumber = extractMaskedMobile(abhaNumber);
            holder.subSmallText.setText(makedNumber);
            photoStr = mobileUser.get(position).getProfilePhoto();
        }
        try {
            byte[] bytes = photoStr.getBytes();
            Log.i("myLog", "byte  length:" + bytes.length);
            if (bytes != null) {
                byte[] decodedImageBytes = Base64.decode(bytes, Base64.DEFAULT);
                if (decodedImageBytes != null) {
                    Bitmap bitmap = BitmapFactory.decodeByteArray(decodedImageBytes, 0, decodedImageBytes.length);
                    if (bitmap != null) {
                        holder.profImage.setImageBitmap(bitmap);
                        Log.i("myLog", "after image set");
                    }
                }
            }
        } catch (Exception e) {
            //  throw new RuntimeException(e);
            Log.i("myLog", " image set exception");
        }
        VerifyMobileOTPResponse.Users finalItem = item;
        holder.card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    if (mobileUser != null){
                    onClickListener.onClick(position, finalItem, aadhaarList,mobileUser.get(position));
                    }else {
                        onClickListener.onClick(position, finalItem, aadhaarList,null);
                    }
                }
            }
        });
    }

    public void setOnClickListener(AbhaAddrselectionAdapter.OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public static String extractMaskedMobile(String input) {
        int visibleChars = 5;
        int maskLength = input.length() - visibleChars;

        if (maskLength <= 0) {
            return input;
        }

        String maskedPart = "x".repeat(maskLength);
        String visiblePart = input.substring(maskLength);

        return maskedPart + visiblePart;
    }

    public interface OnClickListener {
        void onClick(int position, VerifyMobileOTPResponse.Users item, VerifyAadhaarOTPResp.KycVerifiedData.ABHAProfile abhaProfile, VerifyNewMobileOTPResponse.Account mobileUser);
    }

    @Override
    public int getItemCount() {
        int size = 0;
        if (itemList != null)
            size = itemList.size();
        if (aadhaarList != null) {
            size = 1;
        }
        if (mobileUser != null) {
            size = mobileUser.size();
        }
        return size;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleText, subText, subSmallText,txtAge,txtGenter,register;
        ImageView profImage;
        LinearLayout card;

        public ViewHolder(View itemView) {
            super(itemView);
            titleText = itemView.findViewById(R.id.card_title);
            subText = itemView.findViewById(R.id.card_description);
            subSmallText = itemView.findViewById(R.id.card_description_2);
            txtAge = itemView.findViewById(R.id.txtAge);
            txtGenter = itemView.findViewById(R.id.txtGenter);
            profImage = itemView.findViewById(R.id.card_image);
            card = itemView.findViewById(R.id.card_1);
            register = itemView.findViewById(R.id.register);

        }
    }
}
