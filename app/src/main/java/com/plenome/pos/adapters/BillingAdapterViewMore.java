package com.plenome.pos.adapters;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.PendingBillResponse;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class BillingAdapterViewMore extends RecyclerView.Adapter<BillingAdapterViewMore.BillingViewHolder> {

    private List<PendingBillResponse.PendingDetails> originalList;
    private List<PendingBillResponse.PendingDetails> filteredList;
    private Context context;
    private DecimalFormat df;


    public BillingAdapterViewMore(Context context, List<PendingBillResponse.PendingDetails> billingList) {
        this.context = context;
        this.originalList = new ArrayList<>(billingList);
        this.filteredList = new ArrayList<>(billingList);
        this.df = new DecimalFormat("0.00");
    }





    @NonNull
    @Override
    public BillingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.fragment_pending_billing_reccard_viewmore, parent, false);
        return new BillingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BillingViewHolder holder, int position) {
        PendingBillResponse.PendingDetails item = filteredList.get(position);

        holder.dateTxt.setText(item.getDate());
        holder.sectionTxt.setText(item.getSection());
        holder.sectionIdsTxt.setText(item.getSectionId());
        holder.qty.setText(item.getQty()+"");
      //  holder.chargeTxt.setText(item.getCharges()+"");
        holder.chargeTxt.setText("\u20B9 " + df.format(item.getCharges()));

      //  holder.addiCharges.setText(item.getAdditionalCharge()+"");
        holder.addiCharges.setText("\u20B9 " + df.format(item.getAdditionalCharge()));

        // holder.disc.setText(item.getDiscount()+"");
        holder.disc.setText("\u20B9 " + df.format(item.getDiscount()));
        holder.amtTxts.setText("₹ " + df.format(item.getTotal()));

        double charge = item.getCharges() * item.getQty();
        double subTotal = charge + item.getAdditionalCharge() - item.getDiscount();
        double taxCalc = subTotal * item.getTaxPercentage() / 100;
        Log.i("mylog", "taxCalc1:" + taxCalc);
        holder.tax.setText("\u20B9 " + df.format(taxCalc));



    }

    @Override
    public int getItemCount() {
        return filteredList.size();
    }

    public void filter(String filterType) {
        filteredList.clear();
        if (filterType.equalsIgnoreCase("ALL")) {
            filteredList.addAll(originalList);
        } else {
            for (PendingBillResponse.PendingDetails item : originalList) {
                if (item.getSection().equalsIgnoreCase(filterType)) {
                    filteredList.add(item);
                }
            }
        }
        notifyDataSetChanged();
    }

    public static class BillingViewHolder extends RecyclerView.ViewHolder {

        TextView dateTxt, sectionTxt, sectionIdsTxt, filterText,qty,chargeTxt, amtTxts,tax,addiCharges,disc;


        public BillingViewHolder(@NonNull View itemView) {
            super(itemView);
            dateTxt = itemView.findViewById(R.id.dateTxt);
            sectionTxt = itemView.findViewById(R.id.sectionTxt);
            sectionIdsTxt = itemView.findViewById(R.id.sectionIdsTxt);
            filterText = itemView.findViewById(R.id.filterText);
            amtTxts = itemView.findViewById(R.id.amtTxts);
            chargeTxt = itemView.findViewById(R.id.chargeTxt);
            qty = itemView.findViewById(R.id.qtyTxt);
            tax = itemView.findViewById(R.id.tax);
            addiCharges = itemView.findViewById(R.id.addiCharges);
            disc = itemView.findViewById(R.id.disc);
        }
    }
}
