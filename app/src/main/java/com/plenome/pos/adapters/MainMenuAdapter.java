package com.plenome.pos.adapters;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.plenome.pos.R;

public class MainMenuAdapter extends ArrayAdapter {
    private String[] menuNames;
    private Integer[] menuImages;
    private Activity context;

    public MainMenuAdapter(Activity context, String[] menuNames, Integer[] imageId) {
        super(context, R.layout.main_menu_row_item, menuNames);
        this.context = context;
        this.menuNames = menuNames;
        this.menuImages = imageId;

    }

    public MainMenuAdapter(@NonNull Context context, int resource) {
        super(context, resource);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        View row = convertView;
        LayoutInflater inflater = context.getLayoutInflater();
        if (convertView == null)
            row = inflater.inflate(R.layout.main_menu_row_item, null, true);
        TextView txtName = (TextView) row.findViewById(R.id.txtRowItem);
        ImageView imgName = (ImageView) row.findViewById(R.id.imgRowItem);

        txtName.setText(menuNames[position]);
        imgName.setImageResource(menuImages[position]);
        return row;
    }
}

