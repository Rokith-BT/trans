package com.plenome.pos.adapters;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.PendingBillResponse;
import com.plenome.pos.utils.OPHubUtils;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

public class BillingAdapter extends RecyclerView.Adapter<BillingAdapter.BillingViewHolder> {

    private List<PendingBillResponse.PendingDetails> originalList;
    private List<PendingBillResponse.PendingDetails> filteredList;
    private Context context;
    private OnMenuItemClickListener menuItemClickListener;
    private OnParticularItemListListener onParticularItemListListener;
    private DecimalFormat df;

    public BillingAdapter(Context context, List<PendingBillResponse.PendingDetails> billingList) {
        this.context = context;
        this.originalList = new ArrayList<>(billingList);
        this.filteredList = new ArrayList<>(billingList);
        this.df = new DecimalFormat("0.00");
    }



    public interface OnMenuItemClickListener {
        void onMenuItemClick(int position, int menuItemId, PendingBillResponse.PendingDetails item);
    }

    public interface OnParticularItemListListener {
        void onViewItem(int position, PendingBillResponse.PendingDetails item);
    }

    public void setOnMenuItemClickListener(OnMenuItemClickListener listener) {
        this.menuItemClickListener = listener;
    }

    public void setOnViewParticlulars(OnParticularItemListListener listener) {
        this.onParticularItemListListener = listener;
    }

    @NonNull
    @Override
    public BillingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.fragment_pending_billing_reccard, parent, false);
        return new BillingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BillingViewHolder holder, int position) {
        PendingBillResponse.PendingDetails item = filteredList.get(position);

        holder.dateTxt.setText(item.getDate());
        holder.sectionTxt.setText(item.getSection());
        holder.sectionIdsTxt.setText(item.getSectionId());
       // holder.filterText.setText("All");
        holder.amtTxts.setText("₹ " + df.format(item.getTotal()));


        if (item.getSection().equalsIgnoreCase("APPOINTMENT")) {
            holder.makePayment.setEnabled(true);
            holder.makePayment.setAlpha(1.0f);
        } else {
            holder.makePayment.setEnabled(false);
            holder.makePayment.setAlpha(0.15f);
        }


        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (onParticularItemListListener != null) {
                    onParticularItemListListener.onViewItem(position, item);
                }
            }
        });

        holder.menu.setOnClickListener(v -> {
            PopupMenu popupMenu = new PopupMenu(context, v, Gravity.END);
            popupMenu.inflate(R.menu.menu_billing_options);

            try {
                Field[] fields = popupMenu.getClass().getDeclaredFields();
                for (Field field : fields) {
                    if ("mPopup".equals(field.getName())) {
                        field.setAccessible(true);
                        Object menuPopupHelper = field.get(popupMenu);
                        Class<?> classPopupHelper = Class.forName(menuPopupHelper.getClass().getName());
                        Method setForceIcons = classPopupHelper.getMethod("setForceShowIcon", boolean.class);
                        setForceIcons.invoke(menuPopupHelper, true);
                        break;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            popupMenu.setOnMenuItemClickListener(menuItem -> {
                if (menuItemClickListener != null) {
                    menuItemClickListener.onMenuItemClick(position, menuItem.getItemId(), item);
                }
                return true;
            });

            popupMenu.show();
        });
        holder.makePayment.setOnClickListener(v -> {


            if (item.getSection().equalsIgnoreCase("APPOINTMENT")) {
                PopupMenu popupMenu = new PopupMenu(context, v, Gravity.END);
                popupMenu.inflate(R.menu.new_payment_option_menu);
                try {
                    Field[] fields = popupMenu.getClass().getDeclaredFields();
                    for (Field field : fields) {
                        if ("mPopup".equals(field.getName())) {
                            field.setAccessible(true);
                            Object menuPopupHelper = field.get(popupMenu);
                            Class<?> classPopupHelper = Class.forName(menuPopupHelper.getClass().getName());
                            Method setForceIcons = classPopupHelper.getMethod("setForceShowIcon", boolean.class);
                            setForceIcons.invoke(menuPopupHelper, true);
                            break;
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

                popupMenu.setOnMenuItemClickListener(menuItem -> {
                    if (menuItemClickListener != null) {
                        menuItemClickListener.onMenuItemClick(position, menuItem.getItemId(), item);
                    }
                    return true;
                });

                popupMenu.show();
            } else {
                OPHubUtils.showErrorDialog(context,"You can make a payment only for appointments.");
            }









        });
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

        TextView dateTxt, sectionTxt, sectionIdsTxt, filterText, amtTxts,makePayment;
        ImageView menu;

        public BillingViewHolder(@NonNull View itemView) {
            super(itemView);
            dateTxt = itemView.findViewById(R.id.dateTxt);
            sectionTxt = itemView.findViewById(R.id.sectionTxt);
            sectionIdsTxt = itemView.findViewById(R.id.sectionIdsTxt);
          //  filterText = itemView.findViewById(R.id.filterText);
            amtTxts = itemView.findViewById(R.id.amtTxts);
            menu = itemView.findViewById(R.id.menu);
            makePayment = itemView.findViewById(R.id.makePayment);
        }
    }
}
