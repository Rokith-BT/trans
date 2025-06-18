package com.plenome.pos.adapters;

import android.app.Activity;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.ForegroundColorSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.GetConsentListResp;
import com.plenome.pos.model.OPHubResponse;

import java.util.ArrayList;
import java.util.List;

public class ConsentRequestListAdapter extends RecyclerView.Adapter<ConsentRequestListAdapter.ViewHolder> {

    Activity context;

    GetConsentListResp.Datum resps;
    private OnClickListener onClickListener;

    // Constructor for initialization
    public ConsentRequestListAdapter(Activity activity, GetConsentListResp.Datum resps) {
        this.context = activity;
        this.resps = resps;
    }

    @NonNull
    @Override
    public ConsentRequestListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.adapter_consent_request_list, parent, false);
        ConsentRequestListAdapter.ViewHolder viewHolder = new ConsentRequestListAdapter.ViewHolder(view);

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ConsentRequestListAdapter.ViewHolder holder, int position) {

        System.out.println("print lineee" +resps.getConsentRequestHiTypes().get(position));
        System.out.println("print list" +resps.getConsentRequestHiTypes());

        List<String> consentRequestHiTypes = resps.getConsentRequestHiTypes();
        List<String> updatedHiTypes = resps.getUpdatedHiTypes();


        if (updatedHiTypes == null) {
            String concatenatedText = TextUtils.join("    ", consentRequestHiTypes);

            System.out.println("print time of call" + concatenatedText.toString());
            holder.req.setText(concatenatedText.toString());
            holder.req.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.appbarColor));
        }else {
            SpannableStringBuilder spannableText = new SpannableStringBuilder();
            for (String item : consentRequestHiTypes) {
                spannableText.append(item);
                if (updatedHiTypes.contains(item)) {
                    int start = spannableText.length() - item.length();
                    int end = spannableText.length();
                    spannableText.setSpan(new ForegroundColorSpan(ContextCompat.getColor(holder.itemView.getContext(), R.color.green_text)), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                }else {
                    int start = spannableText.length() - item.length();
                    int end = spannableText.length();
                    spannableText.setSpan(new ForegroundColorSpan(ContextCompat.getColor(holder.itemView.getContext(), R.color.gray)), start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                }
                spannableText.append("    ");
            }
            holder.req.setText(spannableText);
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
        System.out.println("print size " + resps);
        return resps.getConsentRequestHiTypes().size();
    }

    // Initializing the Views
    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView  req;

        public ViewHolder(View view) {
            super(view);

            req = (TextView) view.findViewById(R.id.req);

        }
    }
}
