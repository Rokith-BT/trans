package com.plenome.pos.views;

import android.content.Context;
import android.util.AttributeSet;

import com.scribetech.speechsdkandroid.Interfaces.OnSelectionChangedListener;

public class ExtendedEditTExt extends androidx.appcompat.widget.AppCompatEditText {

    private OnSelectionChangedListener listener;

    public ExtendedEditTExt(Context context) {
        super(context);
    }

    public ExtendedEditTExt(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ExtendedEditTExt(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

//    public ExtendedEditTExt(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
//        super(context, attrs, defStyleAttr, defStyleRes);
//    }

    public void addOnSelectionChangedListener(OnSelectionChangedListener l) {
        listener = l;
    }

    @Override
    protected void onSelectionChanged(int selStart, int selEnd) {
        super.onSelectionChanged(selStart, selEnd);

        if(listener!=null){
            listener.onSelectionChanged(selStart, selEnd);
        }


    }
}

