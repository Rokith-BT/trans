package com.plenome.pos.adapters;

import android.annotation.SuppressLint;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.text.Html;
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
import com.plenome.pos.model.VerifyMobileListStatus;

import java.util.List;

public class MobileNumberSelectionList extends RecyclerView.Adapter<MobileNumberSelectionList.ViewHolder> {
    private List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> itemList;
    private OnClickListener onClickListener;


    public void ItemAdapter(List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> itemList) {
        this.itemList = itemList;
    }

    @NonNull
    @Override
    public MobileNumberSelectionList.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_select_abha_addr, parent, false);
        MobileNumberSelectionList.ViewHolder viewHolder = new MobileNumberSelectionList.ViewHolder(view);
        return viewHolder;
    }



    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, @SuppressLint("RecyclerView") int position) {
        String photoStr = null;
        List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> item = null;
        if (itemList != null) {
            item = itemList;
            holder.titleText.setText(item.get(position).getName());
            if (item.get(position).getRegistrationStatus().equalsIgnoreCase("Not Registered")){
                String colorFormat = "<font color='#DC2626'>" + item.get(position).getRegistrationStatus() + "</font>";
                holder.register.setText(Html.fromHtml(colorFormat, Html.FROM_HTML_MODE_LEGACY));
            }else {
                String colorFormat = "<font color='#22C55E'>" + item.get(position).getRegistrationStatus() + "</font>";
                holder.register.setText(Html.fromHtml(colorFormat, Html.FROM_HTML_MODE_LEGACY));
            }
            holder.txtAge.setText(item.get(position).getGender());
            String abhaNumber = item.get(position).getABHANumber();
            String makedNumber = extractMaskedMobile(abhaNumber);
            holder.subSmallText.setText(makedNumber);
            photoStr = "";
            holder.subText.setText("Index : " + item.get(position).getIndex());
            holder.txtGenter.setVisibility(View.GONE);
            holder.cardImage2.setVisibility(View.GONE);

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
        holder.card.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (onClickListener != null) {
                    onClickListener.onClick(position,itemList);
                }
            }
        });
    }

    public void setOnClickListener(MobileNumberSelectionList.OnClickListener onClickListener) {
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
        void onClick(int position,List<VerifyMobileListStatus.VerifyMobileListStatusResponse.Datum.Abha> resp);
    }

    @Override
    public int getItemCount() {
        int size = 0;
        if (itemList != null)
            size = itemList.size();
        System.out.println("print size " + size);
        return size;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView titleText, subText, subSmallText,txtAge,txtGenter,register;
        ImageView profImage,cardImage2;


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
            cardImage2 = itemView.findViewById(R.id.card_image_2);
            register = itemView.findViewById(R.id.register);

        }
    }
}
