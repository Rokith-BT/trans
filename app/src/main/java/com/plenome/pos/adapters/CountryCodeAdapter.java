package com.plenome.pos.adapters;

import android.app.Activity;
import android.content.Context;
import android.graphics.drawable.PictureDrawable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions;
import com.bumptech.glide.request.RequestOptions;
import com.github.twocoffeesoneteam.glidetovectoryou.GlideToVectorYou;
import com.plenome.pos.R;

import java.util.ArrayList;

public class CountryCodeAdapter extends ArrayAdapter {
    private ArrayList<String> countryNames, countryDialCodes, countryFlagUrl;
    private Activity context;

    public CountryCodeAdapter(Activity context, ArrayList<String> countryNames, ArrayList<String> countryDialCodes, ArrayList<String> countryFlagUrl) {
        super(context, R.layout.spinner_row_item, countryNames);
        this.context = context;
        this.countryNames = countryNames;
        this.countryDialCodes = countryDialCodes;
        this.countryFlagUrl = countryFlagUrl;

    }

    public CountryCodeAdapter(@NonNull Context context, int resource) {
        super(context, resource);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View row = convertView;
        LayoutInflater inflater = context.getLayoutInflater();
        if (convertView == null)
            row = inflater.inflate(R.layout.spinner_row_item, null, true);
        TextView txtName = (TextView) row.findViewById(R.id.txtCountry);
        TextView txtCode = (TextView) row.findViewById(R.id.txtCode);
        ImageView imgName = (ImageView) row.findViewById(R.id.imgFlag);

        txtName.setText(countryNames.get(position));
        txtCode.setText(countryDialCodes.get(position));
        String imageUrl = countryFlagUrl.get(position);
        Log.i("myLog", "Iamge url:" + imageUrl);
        //   imageUrl = "https://upload.wikimedia.org/wikipedia/commons/8/85/Flag_of_Belarus.svg";
     /*   if (imageUrl != null && !imageUrl.isEmpty())
            OPHubUtils.fetchSvg(context, imageUrl, imgName);
        else
            imgName.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_no_flag));*/

      //  GlideToVectorYou.justLoadImageAsBackground(context, imageUrl, imgName);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            RequestBuilder<PictureDrawable> requestBuilder = GlideToVectorYou
                    .init()
                    .with(context)
                    .getRequestBuilder();
            requestBuilder
                    .load(imageUrl)
                    .transition(DrawableTransitionOptions.withCrossFade())
                    .apply(new RequestOptions()
                            .centerCrop())
                    .into(imgName);
        } else
            imgName.setImageDrawable(ContextCompat.getDrawable(context, R.drawable.ic_no_flag));

     /*   Uri uri = Uri.parse(imageUrl);
        Glide.with(context)
                .load(uri)
                .apply(new RequestOptions()
                        // .placeholder(R.drawable.placeholder_image) // Placeholder image
                        .error(R.drawable.ic_close) // Error image in case of loading failure
                )
                .into(imgName);*/

        return row;
    }
}