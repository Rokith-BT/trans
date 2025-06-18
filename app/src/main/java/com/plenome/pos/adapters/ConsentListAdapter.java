package com.plenome.pos.adapters;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.plenome.pos.R;
import com.plenome.pos.model.GetConsentListResp;
import com.plenome.pos.model.OPHubResponse;

import java.util.List;

public class ConsentListAdapter extends RecyclerView.Adapter<ConsentListAdapter.ViewHolder> {

    Activity context;

    List<GetConsentListResp.Datum> resps;
    private OnClickListener onClickListener;

    // Constructor for initialization
    public ConsentListAdapter(Activity activity, List<GetConsentListResp.Datum> resps) {
        this.context = activity;
        this.resps = resps;
    }

    @NonNull
    @Override
    public ConsentListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.adapter_consent_list, parent, false);
        ConsentListAdapter.ViewHolder viewHolder = new ConsentListAdapter.ViewHolder(view);

        return viewHolder;
    }

    @Override
    public void onBindViewHolder(@NonNull ConsentListAdapter.ViewHolder holder, int position) {

        GetConsentListResp.Datum response = resps.get(position);
       holder.siNo.setText(String.valueOf(position + 1));
       holder.req.setText(resps.get(position).getRequestedDate().substring(0, 16));
       if (resps.get(position).getStatusChangeDate() != null) {
           holder.grant.setText(resps.get(position).getStatusChangeDate().substring(0, 16));
       }
       holder.expire.setText(resps.get(position).getExpiryDate().substring(0, 10) + " " + resps.get(position).getExpiryDate().substring(11, 16));
       holder.status.setText(resps.get(position).getRequestStatus());
       if(resps.get(position).getRequestStatus().equalsIgnoreCase("GRANTED")){
           holder.action.setText("View Consent  >");
           holder.action.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.appbarColor));
       }else {
           holder.action.setText("View Consent");
           holder.action.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.gray));
       }


       holder.action.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               if (onClickListener != null) {
                   if (resps.get(position).getRequestStatus().equalsIgnoreCase("Granted")) {
                       onClickListener.onClick(position, response);
                   }
               }
           }
       });


        holder.requestList.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false) {
            @Override
            public boolean canScrollHorizontally() {
                return false;
            }
        });
        ConsentRequestListAdapter innerAdapter = new ConsentRequestListAdapter(context, resps.get(position));
        holder.requestList.setAdapter(innerAdapter);


    }

    public void setOnClickListener(OnClickListener onClickListener) {
        this.onClickListener = onClickListener;
    }

    public interface OnClickListener {
        void onClick(int position, GetConsentListResp.Datum resp);
    }

    @Override
    public int getItemCount() {
        System.out.println("print size " + resps);
        return resps.size();
    }

    // Initializing the Views
    public class ViewHolder extends RecyclerView.ViewHolder {

        TextView  siNo,req,grant,expire,status,action;

        RecyclerView requestList;


        public ViewHolder(View view) {
            super(view);

            siNo = (TextView) view.findViewById(R.id.si_no);
            req = (TextView) view.findViewById(R.id.req);
            grant = (TextView) view.findViewById(R.id.grant);
            expire = (TextView) view.findViewById(R.id.expire);
            status = (TextView) view.findViewById(R.id.status);
            action = (TextView) view.findViewById(R.id.action);
            requestList = (RecyclerView) view.findViewById(R.id.request_list);



        }
    }
}
