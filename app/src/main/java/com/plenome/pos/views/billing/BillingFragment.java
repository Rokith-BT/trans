package com.plenome.pos.views.billing;

import static com.plenome.pos.views.OPHubApplication.currentPage;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.text.Layout;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.plenome.pos.model.V2BillingHistoryResponse;
import com.plenome.pos.model.V2PendingBillHistoryResponse;
import com.plenome.pos.views.OPHubApplication;
import com.google.android.material.tabs.TabLayout;
import com.google.gson.Gson;
import com.imin.printerlib.IminPrintUtils;
import com.plenome.pos.R;
import com.plenome.pos.model.BillingHistoryResponse;
import com.plenome.pos.model.GetInvoiceDataResponse;
import com.plenome.pos.model.PendingBillHistoryResponse;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.utils.PreferenceManager;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import butterknife.OnItemSelected;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BillingFragment extends Fragment implements NetworkConnectionReceiver.ReceiverListener {
    View rootView;
    RestServices services;

    @BindView(R.id.tblBilling)
    TableLayout tblBilling;

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.linearHeading)
    LinearLayout linearHeading;

    @BindView(R.id.linearPendBillsHeading)
    LinearLayout linearPendBillsHeading;

    @BindView(R.id.relPages)
    RelativeLayout relPages;

    @BindView(R.id.txtResults)
    TextView txtResults;

    @BindView(R.id.spinPages)
    Spinner spinPages;

    @BindView(R.id.tblPages)
    TableLayout tblPages;

    @BindView(R.id.txtLastPage)
    TextView txtLastPage;

    @BindView(R.id.imgPrev)
    ImageView imgPrev;

    @BindView(R.id.imgNext)
    ImageView imgNext;

    @BindView(R.id.txtEtc)
    TextView txtEtc;

    @BindView(R.id.txtDate)
    TextView txtDate;

    @BindView(R.id.mainTabLayout)
    TabLayout tabLayout;

    @BindView(R.id.imgFilter)
    ImageView imgFilter;

    @BindView(R.id.txtTotRevenue)
    TextView txtTotRevenue;

    @BindView(R.id.txtCompleted)
    TextView txtCompletedCount;

    @BindView(R.id.changeAblePendingRevenue)
    TextView changeAblePendingRevenue;
    Context context;
    private TableLayout tblInvoice;
    private TextView txtSubTotal, txtTaxTotal, txtTotal;
    private Dialog dialogFilter, dialogInvoice;
    private EditText edtFromDate, edtToDate, edtPatientId;
    private Spinner spinPaymentMethod;
    private int hospId, selPageCount = 10, selInitial, selEnd, initPageNo, selPageNumber = 1, totPage, remPage, endPageNo, totSize, width, height, textSize;
    private String selFromDate, selToDate, selPatientId, selPaymentMethod, selTab;
    List<V2BillingHistoryResponse.Datum> listDet;
    List<V2PendingBillHistoryResponse.PendingList> listPendingDet;
    // BillingHistoryResponse.Details.HospitalDetails hospDetails;
    Typeface typeface;
    private TableRow.LayoutParams txtParam, lineParam, txtPendingParam, linePendingParam, imgParam, pageTxtParam, invoiceTxtParam, invoiceLineParam;
    ArrayList<String> pages = new ArrayList<>();
    private TextView[] txtNo;
    boolean isFilterSet = false;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();
    private IminPrintUtils mIminPrintUtils;
    Thread thread;
    DecimalFormat df;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_billing, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.GONE);
        hospId = OPHubApplication.getHospitalId();
        selTab = OPHubApplication.billingSelTab;
        context = getContext();
        df = new DecimalFormat("0.00");
        Log.i("myLog", "selTab111:" + selTab);
        if (selTab == null) {
            selTab = "Pending_Bills";
            OPHubApplication.billingSelTab = selTab;

        }
        initParams();
        Log.i("myLog", "selTab2222:" + selTab);
        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        pages.add("10");
        pages.add("15");
        pages.add("20");
        pages.add("25");
        pages.add("30");
        pages.add("35");
        pages.add("40");
        pages.add("45");
        pages.add("50");
        selPageNumber = 1;
        initPageNo = 1;
        selInitial = 0;
        selEnd = 0;
        String date = getCurrentDate();
        txtDate.setText(date);
        isFilterSet = OPHubApplication.isPendingBillFilterSet();
        selFromDate = OPHubApplication.getPendingBillSelFromDate();
        selToDate = OPHubApplication.getPendingBillSelToDate();
        selPatientId = OPHubApplication.getPendingBillPatientId();
        selPaymentMethod = OPHubApplication.getPendingBillPaymentMethod();
        if (isFilterSet) {
            imgFilter.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.filter_sel));
        } else {
            imgFilter.setBackground(ContextCompat.getDrawable(getContext(), R.drawable.filter));
        }
        Log.i("myLog", "b4 spinpages adapter");
        ArrayAdapter adapter = new ArrayAdapter(getActivity(), android.R.layout.simple_spinner_item, pages);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinPages.setAdapter(adapter);
        Log.i("myLog", "After spinpages adapter");
        getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(currentPage));
        changeAblePendingRevenue.setText(R.string.totalPending);
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0:
                        Log.i("myLog", "clicked pending  bills");
                        selTab = "Pending_Bills";
                        OPHubApplication.billingSelTab = selTab;
                        isFilterSet = OPHubApplication.isPendingBillFilterSet();
                        tblBilling.removeAllViews();
                       // txtTotRevenue.setText(R.string.totalPending);
                        // txtCompletedCount.setText(R.string.count);
                        changeAblePendingRevenue.setText(R.string.totalPending);
                        linearHeading.setVisibility(View.GONE);
                        linearPendBillsHeading.setVisibility(View.VISIBLE);
                        imgFilter.setVisibility(View.GONE);
                        txtDate.setVisibility(View.GONE);
                        tblBilling.removeAllViews();

                        selPageNumber = 1;
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        boolean isChecked1 = checkConnection();
                        if (isChecked1)
                            getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(currentPage));
                        else
                            showAlert(isChecked1);

                        break;
                    case 1:
                        Log.i("myLog", "clicked billing history");
                        selTab = "Billing_History";
                        OPHubApplication.billingSelTab = selTab;
                       // txtTotRevenue.setText(R.string.totalRevenue);
                        //txtCompletedCount.setText(R.string.completed);
                        changeAblePendingRevenue.setText(R.string.totalRevenue);
                        isFilterSet = OPHubApplication.isApptFilterSet();
                        linearHeading.setVisibility(View.VISIBLE);
                        linearPendBillsHeading.setVisibility(View.GONE);
                        tblBilling.removeAllViews();
                        String date = getCurrentDate();
                        txtDate.setText(date);
                        txtDate.setVisibility(View.VISIBLE);
                        imgFilter.setVisibility(View.VISIBLE);
                        isFilterSet = OPHubApplication.isBillingFilterSet();
                        selFromDate = OPHubApplication.getBillingSelFromDate();
                        selToDate = OPHubApplication.getBillingSelToDate();
                        selPatientId = OPHubApplication.getBillingPatientId();
                        selPaymentMethod = OPHubApplication.getBillingPaymentMethod();
                   /*     currentPage = 1;
                        initPageNo = 1;
                        selInitial = (selPageNumber - 1) * selPageCount;
                        selEnd = selInitial + (selPageCount - 1);*/
                        selPageNumber = 1;
                        currentPage = 1;
                        initPageNo = 1;
                        selInitial = 0;
                        selEnd = 0;
                        if (isFilterSet) {
                            if (selFromDate == null && selToDate == null)
                                date = txtDate.getText().toString();
                            else
                                date = null;
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
                        } else {
                            date = txtDate.getText().toString();
                            imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));
                        }
                        boolean isChecked = checkConnection();
                        if (isChecked)
                            getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, date,String.valueOf(selPageCount), String.valueOf(currentPage));
                        else
                            showAlert(isChecked);
                        break;
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });

        return rootView;
    }


    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            textSize = 14;
            int w = (width - dpToPx(75)) / 8;
            txtParam = new TableRow.LayoutParams(w, dpToPx(35));
            txtParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            lineParam = new TableRow.LayoutParams((w - dpToPx(6)) * 8, dpToPx(1));
            lineParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam.span = 8;
            int w1 = (width - dpToPx(80)) / 7;
            txtPendingParam = new TableRow.LayoutParams(w1, dpToPx(35));
            txtPendingParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            linePendingParam = new TableRow.LayoutParams((w1 - dpToPx(6)) * 7, dpToPx(1));
            linePendingParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            linePendingParam.span = 7;

            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(((w - dpToPx(25)) / 2), 0, ((w - dpToPx(25)) / 2), 0);
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            invoiceTxtParam = new TableRow.LayoutParams(dpToPx(510) / 7, dpToPx(35));
            invoiceTxtParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            invoiceLineParam = new TableRow.LayoutParams(dpToPx(510), dpToPx(1));
            invoiceLineParam.setMargins(0, dpToPx(5), 0, dpToPx(5));
            invoiceLineParam.span = 7;


        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            textSize = 14;
            int w = (width - dpToPx(60)) / 8;
            txtParam = new TableRow.LayoutParams(w, dpToPx(35));
            txtParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            lineParam = new TableRow.LayoutParams((w - dpToPx(6)) * 8, dpToPx(1));
            lineParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam.span = 8;
            int w1 = (width - dpToPx(80)) / 7;
            txtPendingParam = new TableRow.LayoutParams(w1, dpToPx(35));
            txtPendingParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            linePendingParam = new TableRow.LayoutParams((w1 - dpToPx(6)) * 7, dpToPx(1));
            linePendingParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            linePendingParam.span = 7;
            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(((w - dpToPx(25)) / 2), 0, ((w - dpToPx(25)) / 2), 0);
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            invoiceTxtParam = new TableRow.LayoutParams(dpToPx(510) / 7, dpToPx(35));
            invoiceTxtParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            invoiceLineParam = new TableRow.LayoutParams(dpToPx(510), dpToPx(1));
            invoiceLineParam.setMargins(0, dpToPx(5), 0, dpToPx(5));
            invoiceLineParam.span = 7;

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_NORMAL) {
            textSize = 14;
            int w = (width - dpToPx(60)) / 8;
            txtParam = new TableRow.LayoutParams(w, dpToPx(35));
            txtParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            lineParam = new TableRow.LayoutParams((w - dpToPx(6)) * 8, dpToPx(1));
            lineParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam.span = 8;
            int w1 = (width - dpToPx(80)) / 7;
            txtPendingParam = new TableRow.LayoutParams(w1, dpToPx(35));
            txtPendingParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            linePendingParam = new TableRow.LayoutParams((w1 - dpToPx(6)) * 7, dpToPx(1));
            linePendingParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            linePendingParam.span = 7;
            imgParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            imgParam.setMargins(((w - dpToPx(25)) / 2), 0, ((w - dpToPx(25)) / 2), 0);
            pageTxtParam = new TableRow.LayoutParams(dpToPx(28), dpToPx(28));
            pageTxtParam.setMargins(dpToPx(5), 0, dpToPx(5), 0);
            invoiceTxtParam = new TableRow.LayoutParams(dpToPx(510) / 7, dpToPx(35));
            invoiceTxtParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            invoiceLineParam = new TableRow.LayoutParams(dpToPx(510), dpToPx(1));
            invoiceLineParam.setMargins(0, dpToPx(5), 0, dpToPx(5));
            invoiceLineParam.span = 7;
        }
    }

    private int dpToPx(int dp) {
        float density = getResources().getDisplayMetrics().density;
        return Math.round((float) dp * density);
    }

    @Override
    public void onResume() {
        super.onResume();
        // call method
        Log.i("myLog", "onResume.........appt fragment");

        // initialize intent filter
        IntentFilter intentFilter = new IntentFilter();

        // add action
        intentFilter.addAction("android.new.conn.CONNECTIVITY_CHANGE");

        // register receiver
        getActivity().registerReceiver(networkConnectionReceiver, intentFilter);
        // Initialize listener
        NetworkConnectionReceiver.Listener = this;
        boolean isConnected = checkConnection();
        if (!isConnected)
            showNoNetworkDialog();
    }

    @Override
    public void onPause() {
        super.onPause();

        Log.i("myLog", "onPause...........appt fragment");
        getActivity().unregisterReceiver(networkConnectionReceiver);

    }

    @OnItemSelected(R.id.spinPages)
    public void clickSpinPages() {
        Log.i("myLog", "Spinpages clicked");
        boolean isConnected = checkConnection();
        if (!isConnected)
            showNoNetworkDialog();
        else {
            String text = spinPages.getSelectedItem().toString();
            selPageCount = Integer.parseInt(text);
            Log.i("myLog", "selTab in spin pages click:" + selTab);
            if (selTab.equalsIgnoreCase("Billing_History")) {
                OPHubApplication.billingSelTab = selTab;
                tabLayout.getTabAt(1).select();
                linearHeading.setVisibility(View.VISIBLE);
                imgFilter.setVisibility(View.VISIBLE);
                linearPendBillsHeading.setVisibility(View.GONE);
                initPageNo = 1;
                selInitial = (selPageNumber - 1) * selPageCount;
                selEnd = selInitial + (selPageCount - 1);
                String date = null;
                if (isFilterSet)
                    if (selFromDate == null && selToDate == null)
                        date = txtDate.getText().toString();
                    else
                        date = null;

                else {
                    date = txtDate.getText().toString();
                }
                getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, date,String.valueOf(selPageCount), String.valueOf(currentPage));
            } else {
                OPHubApplication.billingSelTab = selTab;
                tabLayout.getTabAt(0).select();
                linearHeading.setVisibility(View.GONE);
                linearPendBillsHeading.setVisibility(View.VISIBLE);
                imgFilter.setVisibility(View.GONE);
                selFromDate = null;
                selToDate = null;
                selPatientId = null;
                selPaymentMethod = null;
                initPageNo = 1;
                selInitial = (selPageNumber - 1) * selPageCount;
                selEnd = selInitial + (selPageCount - 1);
                Log.i("myLog", "selInitial:" + selInitial + "   selEnd:" + selEnd + "   selPageNumber:" + selPageNumber + "   selPageCount:" + selPageCount);
                getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(currentPage));
            }
        }
    }

    @OnClick(R.id.txtDate)
    public void clickedDob() {
        showDateCalendar();
    }

    @OnClick(R.id.imgPrev)
    public void prevClicked() {
        if (totPage > 4) {
            if (selPageNumber <= 1)
                Toast.makeText(getActivity(), "No previous data available", Toast.LENGTH_SHORT).show();
            else {
                selPageNumber = selPageNumber - 1;
                showPrevNextPages(listDet, "Prev");
            }
        }
    }

    @OnClick(R.id.imgNext)
    public void nextClicked() {
        ////Log.i("myLog", "current page:" + currentPage + "   total page:" + totPage);
        if (totPage > 4) {
            if (totPage == selPageNumber) {
                ////Log.i("myLog", "current page == totpage");
                Toast.makeText(getActivity(), "No more data available", Toast.LENGTH_SHORT).show();
            } else {
                selPageNumber = selPageNumber + 1;
                ////Log.i("myLog", "1111111111111111 initial page:" + initPageNo + "   end page:" + endPageNo + "  curr page:" + currentPage + "  totpage:" + totPage);
                showPrevNextPages(listDet, "Next");
            }
        }
    }

    @OnClick(R.id.imgFilter)
    public void clickedFilter() {
        showFilterDialog();
    }

    private void showPrevNextPages(List<V2BillingHistoryResponse.Datum> list, String option) {
        //Log.i("myLog", "showPrevNextPages list:" + list.size());
        endPageNo = selPageNumber;
        initPageNo = endPageNo - 3;
        if (initPageNo <= 0) {
            initPageNo = 1;
            endPageNo = initPageNo + 3;
        }
        showPages(list);
        selEnd = selPageNumber * selPageCount;
        selInitial = selEnd - selPageCount;
//        showPendingBillHistory(selInitial, selEnd);
        if (selTab.equalsIgnoreCase("Billing_History")) {
            getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, txtDate.getText().toString(),String.valueOf(selPageCount), String.valueOf(selPageNumber));
        }else {
            getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(selPageNumber));
        }
    }

    public void showFilterDialog() {
        dialogFilter = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_billing_filter, null);
        dialogFilter.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogFilter.getWindow().setGravity(Gravity.CENTER);
        Button btnCancel = dialogFilter.findViewById(R.id.btnCancel);
        Button btnSubmit = dialogFilter.findViewById(R.id.btnSubmit);

        TextView txtClearFilter = dialogFilter.findViewById(R.id.txtClearFilter);
        ImageView imgClose = dialogFilter.findViewById(R.id.imgClose);
        edtFromDate = dialogFilter.findViewById(R.id.edtFromDate);
        edtToDate = dialogFilter.findViewById(R.id.edtToDate);
        edtPatientId = dialogFilter.findViewById(R.id.edtPatientId);
        spinPaymentMethod = dialogFilter.findViewById(R.id.spinPaymentMethod);
        ArrayList<String> al = new ArrayList<>();
        al.add("UPI");
        al.add("Cash");
        ArrayAdapter<String> spinnerArrayAdapter = new ArrayAdapter<String>(
                getActivity()
                , R.layout.spinner_item, al);
        //  spinPaymentMethod.setAdapter(spinnerArrayAdapter);
        OPHubUtils.addProdTypeSpinner(getActivity(), al, spinPaymentMethod, "Select payment method");
        selPatientId = OPHubApplication.getBillingPatientId();
        boolean isFilterSet = OPHubApplication.isBillingFilterSet();
        selFromDate = OPHubApplication.getBillingSelFromDate();
        selToDate = OPHubApplication.getBillingSelToDate();
        selPaymentMethod = OPHubApplication.getBillingPaymentMethod();

        if (selFromDate != null)
            edtFromDate.setText(selFromDate);
        if (selToDate != null)
            edtToDate.setText(selToDate);
        if (selPatientId != null)
            edtPatientId.setText(selPatientId);
        if (selPaymentMethod != null) {
            int index = al.indexOf(selPaymentMethod);
            Log.i("myLog", "index:" + index);
            spinPaymentMethod.setSelection(index);
        }
        edtFromDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Log.i("myLog", "from date clicked");
                setFromDateCalender("from");
            }
        });
        edtToDate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //Log.i("myLog", "edtToDate date clicked");
                setFromDateCalender("to");
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogFilter.dismiss();
            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogFilter.dismiss();
            }
        });
        txtClearFilter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentPage = 1;
                initPageNo = 1;
                selInitial = 0;
                selEnd = 0;
                selPageNumber = 1;

                PreferenceManager.setBoolean(PreferenceManager.BILLING_FILTER, false);
                PreferenceManager.setString(PreferenceManager.BILLING_FROM_DATE, null);
                PreferenceManager.setString(PreferenceManager.BILLING_TO_DATE, null);
                PreferenceManager.setString(PreferenceManager.BILLING_PATIENT_ID, null);
                PreferenceManager.setString(PreferenceManager.BILLING_PAYMENT_METHOD, null);
                selFromDate = null;
                selToDate = null;
                selPatientId = null;
                selPaymentMethod = null;
                String date = getCurrentDate();
                //   String date = txtDate.getText().toString();
                txtDate.setText(date);
                getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, date,String.valueOf(selPageCount), String.valueOf(currentPage));
                dialogFilter.dismiss();
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter));

            }
        });

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // String doctor = null, status = null;
                selFromDate = edtFromDate.getText().toString();
                selToDate = edtToDate.getText().toString();
                selPatientId = edtPatientId.getText().toString();
                selPaymentMethod = spinPaymentMethod.getSelectedItem().toString();
                currentPage = 1;
                initPageNo = 1;
                selInitial = 0;
                selEnd = 0;
                selPageNumber = 1;
                String date = null;
                if (selFromDate.length() == 0)
                    selFromDate = null;
                if (selToDate.length() == 0)
                    selToDate = null;
                if (selPatientId.length() == 0)
                    selPatientId = null;
                if (selPaymentMethod.equalsIgnoreCase("Select payment method"))
                    selPaymentMethod = null;
                if (selFromDate == null && selToDate == null)
                    date = getCurrentDate();
                if (selFromDate != null || selToDate != null) {
                    txtDate.setText(selFromDate + " to " + selToDate);
                }
                //   date = txtDate.getText().toString();
                PreferenceManager.setBoolean(PreferenceManager.BILLING_FILTER, true);
                PreferenceManager.setString(PreferenceManager.BILLING_FROM_DATE, selFromDate);
                PreferenceManager.setString(PreferenceManager.BILLING_TO_DATE, selToDate);
                PreferenceManager.setString(PreferenceManager.BILLING_PATIENT_ID, selPatientId);
                PreferenceManager.setString(PreferenceManager.BILLING_PAYMENT_METHOD, selPaymentMethod);
                getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, date,String.valueOf(selPageCount), String.valueOf(currentPage));

                dialogFilter.dismiss();
                imgFilter.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.filter_sel));
            }
        });
        dialogFilter.show();
    }

    private void setFromDateCalender(String option) {
        final Calendar c = Calendar.getInstance();

        // on below line we are getting
        // our day, month and year.
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        // on below line we are creating a variable for date picker dialog.
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                // on below line we are passing context.
                getActivity(),
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        // on below line we are setting date to our text view.
                        String day = String.valueOf(dayOfMonth);
                        if (day.length() == 1)
                            day = "0" + day;
                        String month = String.valueOf(monthOfYear + 1);
                        if (month.length() == 1)
                            month = "0" + month;
                        String selDate = year + "-" + month + "-" + day;
                        if (option.equalsIgnoreCase("from")) {
                            //   edtFromDate.setText(day + "-" + month + "-" + year);
                            edtFromDate.setText(year + "-" + month + "-" + day);
                        } else if (option.equalsIgnoreCase("to")) {
                            edtToDate.setText(year + "-" + month + "-" + day);
                            //     edtToDate.setText(day + "-" + month + "-" + year);
                        }
                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        // at last we are calling show to
        // display our date picker dialog.

        //    c.add(Calendar.DAY_OF_MONTH, -1);
        datePickerDialog.getDatePicker().setMaxDate(c.getTimeInMillis());
        datePickerDialog.show();
    }


    private void getPendingBillHistory(String limit,String page) {
        //  if (listResp != null) listResp.clear();
        Log.i("myLog", "getPendingBillHistory");

        services.getPendingBillHistory(hospId,limit,page).enqueue(new Callback<V2PendingBillHistoryResponse>() {
            @Override
            public void onResponse(Call<V2PendingBillHistoryResponse> call, Response<V2PendingBillHistoryResponse> response) {
                try {
                    if (response.body() != null) {


                        try {
                            Log.i("myLog", "getPendingBillHistory onResponse:" + new Gson().toJson(response.body()));

                            String status = response.body().getStatus();
                            String message = response.body().getMessage();
                            if (status != null && status.equalsIgnoreCase("success")) {
                                int count = 0;
                                if (response.body().getTotalCount() != null) {
                                    count = Integer.parseInt(response.body().getTotalCount());
                                    double total = response.body().getTotalAmount();
                                    txtCompletedCount.setText(String.valueOf(count));
                                    txtTotRevenue.setText("\u20B9 " + total);
                                    listPendingDet = response.body().getData();
                                }
                                showInitialListPendingBill(listPendingDet,count);
                            } else {
                                if (message == null)
                                    message = "Error Occurred!";
                                //  OPHubUtils.showErrorDialog(getActivity(), message);
                                OPHubUtils.showUnknownErrorDialog(getActivity());
                            }
                        } catch (Exception e) {
                            OPHubUtils.showUnknownErrorDialog(getActivity());
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<V2PendingBillHistoryResponse> call, Throwable t) {
                Log.i("myLog", "getPendingBillHistory failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void getBillingHistory(String patientId, String fromDate, String toDate, String paymentMethod, String date,String limit,String page) {
        Log.i("myLog", "getBillingHistory");
        services.getBillingHistory(hospId, patientId, fromDate, toDate, paymentMethod, date,limit,page).enqueue(new Callback<V2BillingHistoryResponse>() {
            @Override
            public void onResponse(Call<V2BillingHistoryResponse> call, Response<V2BillingHistoryResponse> response) {
                try {
                    Log.i("myLog", "getBillingHistory onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        String status = response.body().getStatus();
                        String message = response.body().getMessage();
                        if (status != null && status.equalsIgnoreCase("success")) {
                            int count = 0;
                            if (response.body().getTotalCount() != null) {
                                count = Integer.parseInt(response.body().getTotalCount());
                                double total = response.body().getTotalAmount();
                                txtCompletedCount.setText(String.valueOf(count));
                                txtTotRevenue.setText(" \u20B9 " + total);
                                listDet = response.body().getData();
                            }
                            showInitialList(listDet, "", count);
                        } else {
                            OPHubUtils.showErrorDialog(getActivity(), message);
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<V2BillingHistoryResponse> call, Throwable t) {
                Log.i("myLog", "getBillingHistory failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void showBillingHistory(int initial, int end, int size) {
        Log.i("myLog", "showBillingHistory: initial:" + initial + "   end:" + end);
        tblBilling.removeAllViews();
        totSize = listDet.size();
        linearHeading.setVisibility(View.VISIBLE);
        linearPendBillsHeading.setVisibility(View.GONE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        int index = 0;
        int initVal = initial + 1;
        int endVal = end - totSize;
        if (endVal > 0)
            end = end - endVal;

        txtResults.setText("Results " + initVal + "-" + end + " of " + totSize);
        //Log.i("myLog", "end:" + end + "    initial:" + initial);
        if (totSize < end) {
            end = totSize;
        }

        Log.i("myLog", "showBillingHistory11111");
        ImageView[] imgInvoice = new ImageView[selPageCount];
        for (int start = 0; start < end; start++) {
            final int ij = index;
            final int listIndex = start;
            V2BillingHistoryResponse.Datum resp = listDet.get(start);
            String name = resp.getPatientName();
            //  String apptNo = resp.getSectionID();
            String date = resp.getPaymentDate();
            String txnId = resp.getTransactionId();
            double amount = resp.getAmount();
            Integer patientId = resp.getPatientId();
            String paymentMethod = resp.getPaymentMode();

            TableRow tr = new TableRow(context);
            tr.setGravity(Gravity.CENTER);
            tr.setBackgroundColor(ContextCompat.getColor(context, R.color.tbl_bg));

            TextView txtSlNo = new TextView(getActivity());
            txtSlNo.setText(String.valueOf(index + 1));
            txtSlNo.setTypeface(typeface);
            txtSlNo.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtSlNo.setGravity(Gravity.CENTER);
            tr.addView(txtSlNo, txtParam);

            TextView txtName = new TextView(getActivity());
            txtName.setText(name);
            txtName.setTypeface(typeface);
            txtName.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtName.setGravity(Gravity.CENTER);
            tr.addView(txtName, txtParam);

            TextView txtId = new TextView(getActivity());
            if (patientId != null) {
                txtId.setText(String.valueOf(patientId));
            } else {
                txtId.setText("-"); // or "" or a default value
            }
            txtId.setTypeface(typeface);
            txtId.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtId.setGravity(Gravity.CENTER);
            tr.addView(txtId, txtParam);

            TextView txtApptNo = new TextView(getActivity());
            txtApptNo.setText(txnId);
            txtApptNo.setTypeface(typeface);
            txtApptNo.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtApptNo.setGravity(Gravity.CENTER);
            tr.addView(txtApptNo, txtParam);

            TextView txtDate = new TextView(getActivity());
            txtDate.setText(date);
            txtDate.setTypeface(typeface);
            txtDate.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtDate.setGravity(Gravity.CENTER);
            tr.addView(txtDate, txtParam);


            TextView txtAmount = new TextView(getActivity());
            txtAmount.setText("\u20B9 " +  df.format(amount));
            txtAmount.setTypeface(typeface);
            txtAmount.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtAmount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtAmount.setGravity(Gravity.CENTER);
            tr.addView(txtAmount, txtParam);
            TextView txtPaymentMethod = new TextView(getActivity());
            txtPaymentMethod.setText(paymentMethod);
            txtPaymentMethod.setTypeface(typeface);
            txtPaymentMethod.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtPaymentMethod.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtPaymentMethod.setGravity(Gravity.CENTER);
            tr.addView(txtPaymentMethod, txtParam);
            imgInvoice[index] = new ImageView(getActivity());
            imgInvoice[index].setImageDrawable(ContextCompat.getDrawable(context, R.drawable.pdf));
            //     imgInvoice[index].setVisibility(View.GONE);
            tr.addView(imgInvoice[index], imgParam);
            imgInvoice[index].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    int ind = listIndex;
                    V2BillingHistoryResponse.Datum resp = listDet.get(listIndex);
                    String txnId = resp.getTransactionId();
                    getInvoiceData(txnId);
                }
            });
        /*    txtId.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    BillingHistoryResponse.Details resp = listDet.get(listIndex);

                    int patientId = resp.getId();

                    BillingPendingFragment newFragment = new BillingPendingFragment();
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    Bundle result = new Bundle();
                    result.putInt("patient_id", patientId);
                    result.putString("from_screen", "Billing");

                    newFragment.setArguments(result);
                    transaction.replace(R.id.fragment_container, newFragment, "Pending_Bill");
                    transaction.addToBackStack(null);
                    transaction.commit();
                }
            });*/
            index++;
            TableRow trLine1 = new TableRow(context);
            View v1 = new View(getActivity());
            v1.setBackgroundColor(ContextCompat.getColor(context, R.color.gray));
            trLine1.addView(v1, lineParam);
            tblBilling.addView(tr);
            tblBilling.addView(trLine1);
        }
        Log.i("myLog", "showBillingHistory22222");

    }

    private void showInitialList(List<V2BillingHistoryResponse.Datum> list, String option,Integer size) {
        Log.i("myLog", "Show initail list");
        if (size > 0) {
            linearHeading.setVisibility(View.VISIBLE);
            Log.i("myLog", "size > 0:");
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
            totSize = size;
            totPage = totSize / selPageCount;
            remPage = totSize % selPageCount;
            if (remPage != 0)
                totPage = totPage + 1;
            //Log.i("myLog", "totSize:" + totSize + "   total pages:" + totPage);
            if (totPage <= 4) {
                endPageNo = totPage;
            } else {
                endPageNo = 4;

            }
            if (size < selPageCount) {
                selInitial = 0;
                selEnd = size;
            } else {
                //  selInitial = (selPageNumber - 1) * selPageCount;
                selEnd = selInitial + selPageCount;
                //   selEnd = selInitial + selPageCount;
            }
            showPages(list);

            showBillingHistory(selInitial, selEnd,size);
        } else {
            Log.i("myLog", "size > 0: else");
            tblPages.removeAllViews();
            tblBilling.removeAllViews();
            selPageNumber = 0;
            totPage = 0;
            remPage = 0;
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);

            linearHeading.setVisibility(View.GONE);
            linearPendBillsHeading.setVisibility(View.GONE);
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
        }
    }

    private void showPages(List<V2BillingHistoryResponse.Datum> list) {
        Log.i("myLog", "show pages1");
        tblPages.removeAllViews();
        relPages.setVisibility(View.VISIBLE);
        Log.i("myLog", "show pages1 tot page:" + totPage);

        TableRow tr = new TableRow(getActivity());
        tr.setGravity(Gravity.CENTER);
        int endPage;
        if (totPage <= 4) {
            endPage = totPage;
        } else {
            endPage = 4;
        }
        if (endPageNo > totPage) {
            endPage = endPageNo - totPage;
            initPageNo = totPage - 3;
        }
        Log.i("myLog", "show pages1 tot page:" + totPage);
        if (totPage > 4) {
            imgPrev.setVisibility(View.VISIBLE);
            imgNext.setVisibility(View.VISIBLE);
            txtEtc.setVisibility(View.VISIBLE);
            txtLastPage.setVisibility(View.VISIBLE);
            txtLastPage.setText(String.valueOf(totPage));
        } else {
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgPrev.setVisibility(View.INVISIBLE);
            imgNext.setVisibility(View.INVISIBLE);
        }

        txtNo = new TextView[endPage];

        for (int index = 0; index < endPage; index++) {
            final int start = index;
            final int endNo = endPage;
            int pageNo = index + initPageNo;

            txtNo[index] = new TextView(getActivity());
            txtNo[index].setText(String.valueOf(pageNo));
            txtNo[index].setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            txtNo[index].setGravity(Gravity.CENTER);
            if (pageNo == selPageNumber) {
                txtNo[index].setBackground(ContextCompat.getDrawable(context, R.drawable.blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(context, R.color.white));
            } else {
                txtNo[index].setBackground(ContextCompat.getDrawable(context, R.drawable.light_blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(context, R.color.menuTxtColor));
            }


            tr.addView(txtNo[index], pageTxtParam);

            txtNo[index].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String no = txtNo[start].getText().toString();
                    int number = Integer.parseInt(no);
                    //Log.i("mylog", "Selected page number:" + number + "   totPage:" + totPage);
                    selPageNumber = number;
                    //Log.i("mylog", "Selected page no:" + currentPage);
                    //   showPrevNextPages1(listResp);
                    for (int i = 0; i < endNo; i++) {
                        //    //Log.i("myLog", "i==:" + i + "  start:" + start + "   totPage:" + totPage);
                        int pageno = Integer.parseInt(txtNo[i].getText().toString());
                        if (pageno == selPageNumber) {
                            txtNo[i].setBackground(ContextCompat.getDrawable(context, R.drawable.blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(context, R.color.white));
                        } else {
                            txtNo[i].setBackground(ContextCompat.getDrawable(context, R.drawable.light_blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(context, R.color.menuTxtColor));
                        }

                    }

                    selEnd = selPageNumber * selPageCount;
                    selInitial = selEnd - selPageCount;
                    if (selTab.equalsIgnoreCase("Billing_History")) {
                        getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, txtDate.getText().toString(),String.valueOf(selPageCount), String.valueOf(selPageNumber));
                    }else {
                        getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(selPageNumber));
                    }

                }
            });
        }
        tblPages.addView(tr);

    }

    private void showInitialListPendingBill(List<V2PendingBillHistoryResponse.PendingList> list, Integer count) {
        Log.i("myLog", "showInitialListPendingBill");
        if (count > 0) {
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
            totSize = count;
            totPage = totSize / selPageCount;
            remPage = totSize % selPageCount;
            if (remPage != 0)
                totPage = totPage + 1;
            Log.i("myLog", "totSize:" + totSize + "   total pages:" + totPage);
            if (totPage <= 4)
                endPageNo = totPage;
            else
                endPageNo = 4;
            //   selEnd = selInitial + selPageCount;

            if (count < selPageCount) {
                selInitial = 0;
                selEnd = count;
            } else {
                selEnd = selInitial + selPageCount;
            }
            showPagesPendingBill(list);
            showPendingBillHistory(selInitial, selEnd);
        } else {
            tblPages.removeAllViews();
            tblBilling.removeAllViews();
            selPageNumber = 0;
            totPage = 0;
            remPage = 0;
            imgPrev.setVisibility(View.GONE);
            imgNext.setVisibility(View.GONE);
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            linearHeading.setVisibility(View.GONE);
            linearPendBillsHeading.setVisibility(View.GONE);
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
        }
    }

    private void showPagesPendingBill(List<V2PendingBillHistoryResponse.PendingList> list) {
        Log.i("myLog", "showPagesPendingBill");
        tblPages.removeAllViews();
        relPages.setVisibility(View.VISIBLE);

        Log.i("myLog", "showPagesPendingBill tot page:" + totPage);

        TableRow tr = new TableRow(context);
        tr.setGravity(Gravity.CENTER);
        int endPage;
        if (totPage <= 4) {
            endPage = totPage;
        } else {
            endPage = 4;
        }
        if (endPageNo > totPage) {
            endPage = endPageNo - totPage;
            initPageNo = totPage - 3;
        }
        Log.i("myLog", "showPagesPendingBill tot page:" + totPage);
        if (totPage > 4) {
            imgPrev.setVisibility(View.VISIBLE);
            imgNext.setVisibility(View.VISIBLE);
            txtEtc.setVisibility(View.VISIBLE);
            txtLastPage.setVisibility(View.VISIBLE);
            txtLastPage.setText(String.valueOf(totPage));
        } else {
            txtEtc.setVisibility(View.GONE);
            txtLastPage.setVisibility(View.GONE);
            imgPrev.setVisibility(View.INVISIBLE);
            imgNext.setVisibility(View.INVISIBLE);
        }

        txtNo = new TextView[endPage];

        for (int index = 0; index < endPage; index++) {
            final int start = index;
            final int endNo = endPage;
            int pageNo = index + initPageNo;

            txtNo[index] = new TextView(context);
            txtNo[index].setText(String.valueOf(pageNo));
            txtNo[index].setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            txtNo[index].setGravity(Gravity.CENTER);
            if (pageNo == selPageNumber) {
                txtNo[index].setBackground(ContextCompat.getDrawable(context, R.drawable.blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(context, R.color.white));
            } else {
                txtNo[index].setBackground(ContextCompat.getDrawable(context, R.drawable.light_blue_circle_bg));
                txtNo[index].setTextColor(ContextCompat.getColor(context, R.color.menuTxtColor));
            }


            tr.addView(txtNo[index], pageTxtParam);

            txtNo[index].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    String no = txtNo[start].getText().toString();
                    int number = Integer.parseInt(no);
                    selPageNumber = number;

                    for (int i = 0; i < endNo; i++) {
                        int pageno = Integer.parseInt(txtNo[i].getText().toString());
                        if (pageno == selPageNumber) {
                            txtNo[i].setBackground(ContextCompat.getDrawable(context, R.drawable.blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(context, R.color.white));
                        } else {
                            txtNo[i].setBackground(ContextCompat.getDrawable(context, R.drawable.light_blue_circle_bg));
                            txtNo[i].setTextColor(ContextCompat.getColor(context, R.color.menuTxtColor));
                        }
                    }
                    selEnd = selPageNumber * selPageCount;
                    selInitial = selEnd - selPageCount;
                    if (selTab.equalsIgnoreCase("Billing_History")) {
                        getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, txtDate.getText().toString(),String.valueOf(selPageCount), String.valueOf(currentPage));
                    }else {
                        getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(selPageNumber));
                    }
                }
            });
        }
        tblPages.addView(tr);

    }


    @Override
    public void onNetworkChange(boolean isConnected) {
        //  showAlert(isConnected);
        if (!isConnected)
            showNoNetworkDialog();
    }

    public void showNoNetworkDialog() {
        Dialog dialogNoNetwork = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_no_network, null);
        dialogNoNetwork.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogNoNetwork.getWindow().setGravity(Gravity.CENTER);
        ImageView imgClose = dialogNoNetwork.findViewById(R.id.imgClose);
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogNoNetwork.dismiss();
            }
        });

        dialogNoNetwork.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogNoNetwork.getWindow().getAttributes());
        lp.width = dpToPx(700);
        lp.height = dpToPx(450);
        dialogNoNetwork.getWindow().setAttributes(lp);
    }

    public boolean checkConnection() {

        // initialize intent filter
        // Initialize connectivity manager
        ConnectivityManager manager = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);

        // Initialize network info
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();

        // get connection status
        boolean isConnected = networkInfo != null && networkInfo.isConnectedOrConnecting();
        return isConnected;
        // display snack bar
        // showAlert(isConnected);
    }

    public void showInvoiceDialog(GetInvoiceDataResponse resp, String txnId) {
        dialogInvoice = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_invoice, null);
        dialogInvoice.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogInvoice.getWindow().setGravity(Gravity.CENTER);

        TextView txtHospName = dialogInvoice.findViewById(R.id.plenome);
        TextView txtHospAddr = dialogInvoice.findViewById(R.id.address);
        TextView txtHospPhone = dialogInvoice.findViewById(R.id.phone);
        TextView txtWebsite = dialogInvoice.findViewById(R.id.txtWebsite);

        TextView txtInvoiceno = dialogInvoice.findViewById(R.id.txtInvoiceNo);
        TextView txtDate = dialogInvoice.findViewById(R.id.txtPaymentDate);
        TextView txtMobile = dialogInvoice.findViewById(R.id.txtMobile);
        TextView txtName = dialogInvoice.findViewById(R.id.txtName);
        TextView txtAddress = dialogInvoice.findViewById(R.id.txtAddress);
        tblInvoice = dialogInvoice.findViewById(R.id.tblLayout);
        Button btnCancel = dialogInvoice.findViewById(R.id.cancel_button);
        Button btnPrint = dialogInvoice.findViewById(R.id.print_button);
        txtSubTotal = dialogInvoice.findViewById(R.id.txtSubTotal);
        txtTaxTotal = dialogInvoice.findViewById(R.id.txtTax);
        txtTotal = dialogInvoice.findViewById(R.id.txtTotal);
        String date = getCurrentDate();
        txtDate.setText(date);
        //   TextView txtAddress = dialogInvoice.findViewById(R.id.txtAddress);
        // TextView txtPaymentMode = dialogInvoice.findViewById(R.id.txtPaymentMode);
        // TextView txtSection = dialogInvoice.findViewById(R.id.txtSection);
        // TextView txtAmount = dialogInvoice.findViewById(R.id.txtAmount);
        ImageView imgClose = dialogInvoice.findViewById(R.id.imgClose);
        GetInvoiceDataResponse.HospitalDetails hospDetails = resp.getHospitalDetails();
        if (hospDetails != null) {
            String hospAddr = hospDetails.getAddress();
            String hospName = hospDetails.getHospital_name();
            String phone = hospDetails.getContact_no();
            String website = hospDetails.getWebsite();
            txtHospAddr.setText(hospAddr);
            txtHospName.setText(hospName);
            txtWebsite.setText(website);
            txtHospPhone.setText("Phone: " + phone);
        }



        GetInvoiceDataResponse.PatientDetails patientDetails = resp.getPatientDetails();


        if (patientDetails != null) {
            txtAddress.setText(patientDetails.getAddress() != null ? patientDetails.getAddress() : "-");
            txtMobile.setText(patientDetails.getMobileno() != null ? patientDetails.getMobileno() : "-");
            txtName.setText(patientDetails.getPatient_name() != null ? patientDetails.getPatient_name() : "-");
        } else {
            // If patientDetails is null, set safe fallback values
            txtAddress.setText("-");
            txtMobile.setText("-");
            txtName.setText("-");

            // Optional: log or show a toast if this is unexpected
            Log.w("BillingFragment", "PatientDetails is null in showInvoiceDialog()");
        }

        txtInvoiceno.setText(txnId);


        showInvoiceTable(resp);
        if (mIminPrintUtils == null) {
            mIminPrintUtils = IminPrintUtils.getInstance(getActivity());
        }
        mIminPrintUtils.resetDevice();
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogInvoice.dismiss();
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogInvoice.dismiss();
            }
        });
        btnPrint.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mIminPrintUtils.initPrinter(IminPrintUtils.PrintConnectType.USB);
                int status = mIminPrintUtils.getPrinterStatus(IminPrintUtils.PrintConnectType.USB);
                if (status == 1 || status == -1) {
                    OPHubUtils.showErrorDialog(getActivity(), "The printer is not connected or powered on");
                    return;
                } else if (status == 3) {
                    OPHubUtils.showErrorDialog(getActivity(), "Print head open");
                    return;
                } else if (status == 7) {
                    OPHubUtils.showErrorDialog(getActivity(), "No paper feed");
                    return;
                } else if (status == 8) {
                    OPHubUtils.showErrorDialog(getActivity(), "Paper running out");
                    return;
                }
                callPrinter(resp, txnId);
                dialogInvoice.dismiss();
            }
        });
        dialogInvoice.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogInvoice.getWindow().getAttributes());
        lp.width = dpToPx(600);
        //  lp.height = dpToPx(450);
        dialogInvoice.getWindow().setAttributes(lp);
    }


    private void showInvoiceTable(GetInvoiceDataResponse resp) {
        tblInvoice.removeAllViews();
        TableRow trLine1 = new TableRow(getActivity());
        View vLine1 = new View(getActivity());
        vLine1.setBackground(ContextCompat.getDrawable(context, R.color.view_color));
        trLine1.addView(vLine1, invoiceLineParam);
        tblInvoice.addView(trLine1);

        TableRow tr = new TableRow(getActivity());
        tr.setGravity(Gravity.CENTER);
        //  tr.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.tbl_bg));


        TextView txtSlNo = new TextView(getActivity());
        txtSlNo.setText(R.string.item);
        txtSlNo.setTypeface(typeface);
        txtSlNo.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtSlNo.setGravity(Gravity.CENTER);
        tr.addView(txtSlNo, invoiceTxtParam);

        TextView txtName = new TextView(getActivity());
        txtName.setText(R.string.qty);
        txtName.setTypeface(typeface);
        txtName.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtName.setGravity(Gravity.CENTER);
        tr.addView(txtName, invoiceTxtParam);

        TextView txtId = new TextView(getActivity());
        txtId.setText(R.string.price);
        txtId.setTypeface(typeface);
        txtId.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        //  txtId.setTextColor(ContextCompat.getColor(getContext(), R.color.billing_text));
        txtId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtId.setGravity(Gravity.CENTER);
        tr.addView(txtId, invoiceTxtParam);

        TextView discount = new TextView(getActivity());
        discount.setText(R.string.discount);
        discount.setTypeface(typeface);
        discount.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        //  txtId.setTextColor(ContextCompat.getColor(getContext(), R.color.billing_text));
        discount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        discount.setGravity(Gravity.CENTER);
        tr.addView(discount, invoiceTxtParam);

        TextView addCharge = new TextView(getActivity());
        addCharge.setText(R.string.add_Charges);
        addCharge.setTypeface(typeface);
        addCharge.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        //  txtId.setTextColor(ContextCompat.getColor(getContext(), R.color.billing_text));
        addCharge.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        addCharge.setGravity(Gravity.CENTER);
        tr.addView(addCharge, invoiceTxtParam);



        TextView txtTax = new TextView(getActivity());
        txtTax.setText(R.string.tax);
        txtTax.setTypeface(typeface);
        txtTax.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        txtTax.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTax.setGravity(Gravity.CENTER);
        tr.addView(txtTax, invoiceTxtParam);

        TextView txtApptNo = new TextView(getActivity());
        txtApptNo.setText(R.string.amount);
        txtApptNo.setTypeface(typeface);
        txtApptNo.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
        txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtApptNo.setGravity(Gravity.CENTER);
        tr.addView(txtApptNo, invoiceTxtParam);
        tblInvoice.addView(tr);
        TableRow trLine = new TableRow(getActivity());
        View vLine = new View(getActivity());
        vLine.setBackground(ContextCompat.getDrawable(context, R.color.view_color));
        trLine.addView(vLine, invoiceLineParam);
        tblInvoice.addView(trLine);
        ArrayList<GetInvoiceDataResponse.InvoiceDetails> invoiceList = resp.getInvoiceDetails();
        if (invoiceList != null && !invoiceList.isEmpty()) {
            int size = invoiceList.size();
            double subTotal = 0.0, taxTotal = 0.0;
            for (int start = 0; start < size; start++) {
                TableRow trow = new TableRow(getActivity());
                trow.setGravity(Gravity.CENTER);
                GetInvoiceDataResponse.InvoiceDetails invoiceData = invoiceList.get(start);
                TextView txtSlNo1 = new TextView(getActivity());
                txtSlNo1.setText(invoiceData.getChargeName());
                txtSlNo1.setTypeface(typeface);
                txtSlNo1.setPadding(dpToPx(3),0,0,0);
                txtSlNo1.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtSlNo1.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSlNo1.setGravity(Gravity.CENTER_VERTICAL);
                trow.addView(txtSlNo1, invoiceTxtParam);

                int qty = invoiceData.getQty();
                TextView txtQty = new TextView(getActivity());
                txtQty.setText(String.valueOf(qty));
                txtQty.setTypeface(typeface);
                txtQty.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtQty.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtQty.setGravity(Gravity.CENTER);
                trow.addView(txtQty, invoiceTxtParam);

                double charge = invoiceData.getStandard_charge();
                TextView txtPrice = new TextView(getActivity());
                txtPrice.setText("\u20B9 " + df.format(charge));
                txtPrice.setTypeface(typeface);
                txtPrice.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtPrice.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtPrice.setGravity(Gravity.CENTER);
                trow.addView(txtPrice, invoiceTxtParam);

                double discountAmt = invoiceData.getDiscount_amount();
                TextView txtDiscount = new TextView(getActivity());
                txtDiscount.setText("\u20B9 " + df.format(discountAmt));
                txtDiscount.setTypeface(typeface);
                txtDiscount.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtDiscount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtDiscount.setGravity(Gravity.CENTER);
                trow.addView(txtDiscount, invoiceTxtParam);

                double additionalAmt = invoiceData.getAdditional_charge();
                TextView txtAdditional = new TextView(getActivity());
                txtAdditional.setText("\u20B9 " + df.format(additionalAmt));
                txtAdditional.setTypeface(typeface);
                txtAdditional.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtAdditional.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtAdditional.setGravity(Gravity.CENTER);
                trow.addView(txtAdditional, invoiceTxtParam);

                double tax = invoiceData.getTaxAmount();
                TextView txtTaxVal = new TextView(getActivity());
                txtTaxVal.setText("\u20B9 " + df.format(tax));
                txtTaxVal.setTypeface(typeface);
                txtTaxVal.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtTaxVal.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtTaxVal.setGravity(Gravity.CENTER);
                trow.addView(txtTaxVal, invoiceTxtParam);


                double amount = invoiceData.getTotal();
                TextView txtAmount = new TextView(getActivity());
                txtAmount.setText("\u20B9 " + df.format(amount));
                txtAmount.setTypeface(typeface);
                txtAmount.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtAmount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtAmount.setGravity(Gravity.CENTER);
                trow.addView(txtAmount, invoiceTxtParam);
                tblInvoice.addView(trow);
            }
            TableRow trLine2 = new TableRow(getActivity());
            View vLine2 = new View(getActivity());
            vLine2.setBackground(ContextCompat.getDrawable(context, R.color.view_color));
            trLine2.addView(vLine2, invoiceLineParam);
            tblInvoice.addView(trLine2);

            double totalAmt = resp.getTotal();
            txtTotal.setText("\u20B9 " + df.format(totalAmt));

        }
    }

    private void showAlert(boolean isConnected) {

        // initialize color and message
        String message;
        int color;

        // check condition
        if (isConnected) {

            // when internet is connected
            // set message
            message = "Connected to Internet";

            // set text color
            color = Color.WHITE;

        } else {

            // when internet
            // is disconnected
            // set message
            message = "Not Connected to Internet";

            // set text color
            color = Color.RED;
            showNoNetworkDialog();
            //    OPHubUtils.showErrorDialog(getActivity(), message);
            //  Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT).show();
        }

        // show snack bar

    }

    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        // on below line we are creating a variable
        // for current date and time and calling a simple date format in it.
        String currDate = sdf.format(new Date());
        return currDate;
    }


    private void showPendingBillHistory(int initial, int end) {
        Log.i("myLog", "showPendingBillHistory: initial:" + initial + "   end:" + end);
        tblBilling.removeAllViews();
        totSize = listPendingDet.size();
        linearHeading.setVisibility(View.GONE);
        linearPendBillsHeading.setVisibility(View.VISIBLE);
        imgNoData.setVisibility(View.GONE);
        txtNoData.setVisibility(View.GONE);
        int index = 0;
        int initVal = initial + 1;
        int endVal = end - totSize;
        if (endVal > 0)
            end = end - endVal;


        Log.i("myLog", "end:" + end + "    initial:" + initial);
        if (totSize < end) {
            end = totSize;
        }
        txtResults.setText("Results " + initVal + "-" + end + " of " + totSize);
        for (int start = 0; start < end; start++) {
            Log.i("myLog", "showPendingBillHistory for index:" + start);
            final int ij = index;
            final int listIndex = start;
            V2PendingBillHistoryResponse.PendingList resp = listPendingDet.get(start);
            String name = resp.getPatientName();
            int patientId = resp.getPatientID();
            String email = resp.getEmail();
            String mobile = resp.getMobileno();
            String amount = resp.getBalanceAmount().toString();

            TableRow tr = new TableRow(context);
            tr.setGravity(Gravity.CENTER);
            tr.setBackgroundColor(ContextCompat.getColor(context, R.color.tbl_bg));

            TextView txtSlNo = new TextView(context);
            txtSlNo.setText(String.valueOf(index + 1));
            txtSlNo.setTypeface(typeface);
            txtSlNo.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtSlNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtSlNo.setGravity(Gravity.CENTER);
            tr.addView(txtSlNo, txtPendingParam);

            TextView txtName = new TextView(context);
            txtName.setText(name);
            txtName.setTypeface(typeface);
            txtName.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtName.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtName.setGravity(Gravity.CENTER);
            tr.addView(txtName, txtPendingParam);

            TextView txtId = new TextView(context);
            txtId.setText(String.valueOf(patientId));
            txtId.setTypeface(typeface);
            txtId.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtId.setGravity(Gravity.CENTER);
            tr.addView(txtId, txtPendingParam);

            TextView txtApptNo = new TextView(context);
            txtApptNo.setText(email);
            txtApptNo.setTypeface(typeface);
            txtApptNo.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtApptNo.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtApptNo.setGravity(Gravity.CENTER);
            tr.addView(txtApptNo, txtPendingParam);

            TextView txtDate = new TextView(context);
            txtDate.setText(mobile);
            txtDate.setTypeface(typeface);
            txtDate.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtDate.setGravity(Gravity.CENTER);
            tr.addView(txtDate, txtPendingParam);

            TextView txtAmount = new TextView(context);
            txtAmount.setText("\u20B9 " +  df.format(Double.parseDouble(amount)));
            txtAmount.setTypeface(typeface);
            txtAmount.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
            txtAmount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtAmount.setGravity(Gravity.CENTER);
            tr.addView(txtAmount, txtPendingParam);
            TextView txtPaymentMethod = new TextView(context);
            txtPaymentMethod.setText("Make Payment");
            txtPaymentMethod.setTypeface(typeface);
            txtPaymentMethod.setTextColor(Color.WHITE);
            txtPaymentMethod.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
            txtPaymentMethod.setGravity(Gravity.CENTER);
            Drawable drawable = ContextCompat.getDrawable(context, R.drawable.rounded_approved_bg);
            GradientDrawable gradientDrawable = (GradientDrawable) drawable;
            gradientDrawable.setColor(ContextCompat.getColor(context, R.color.blue_text));
            txtPaymentMethod.setBackground(gradientDrawable);
            tr.addView(txtPaymentMethod, txtPendingParam);

            txtPaymentMethod.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    V2PendingBillHistoryResponse.PendingList resp = listPendingDet.get(listIndex);
                    int patientId = resp.getPatientID();
                    BillingPendingFragment newFragment = new BillingPendingFragment();
                    FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
                    Bundle result = new Bundle();
                    result.putInt("patient_id", patientId);
                    result.putString("from_screen", "Billing");
                    newFragment.setArguments(result);
                    transaction.replace(R.id.fragment_container, newFragment, "Pending_Bill");
                    transaction.addToBackStack(null);
                    transaction.commit();
                }
            });
            index++;
            TableRow trLine1 = new TableRow(context);
            View v1 = new View(context);
            v1.setBackgroundColor(ContextCompat.getColor(context, R.color.gray));
            trLine1.addView(v1, linePendingParam);
            tblBilling.addView(tr);
            tblBilling.addView(trLine1);
        }

    }

    private void getInvoiceData(String txnId) {
        Log.i("myLog", "getInvoiceData");
        // txnId = "TRID439";
        String finalTxnId = txnId;
        services.getBillingInvoiceData(hospId, txnId).enqueue(new Callback<GetInvoiceDataResponse>() {
            @Override
            public void onResponse(Call<GetInvoiceDataResponse> call, Response<GetInvoiceDataResponse> response) {
                try {
                    Log.i("myLog", "getInvoiceData onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        GetInvoiceDataResponse resp = response.body();
                        String status = resp.getStatus();
                        String message = resp.getMessage();
                        if (status.equalsIgnoreCase("success")) {
                            showInvoiceDialog(resp, finalTxnId);
                        } else {
                            OPHubUtils.showErrorDialog(getActivity(), message);
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetInvoiceDataResponse> call, Throwable t) {
                Log.i("myLog", "getInvoiceData failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void showDateCalendar() {
        Log.i("myLog", "showDateCalendar");
        final Calendar c = Calendar.getInstance();

        // on below line we are getting
        // our day, month and year.
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int day = c.get(Calendar.DAY_OF_MONTH);

        // on below line we are creating a variable for date picker dialog.
        DatePickerDialog datePickerDialog = new DatePickerDialog(
                // on below line we are passing context.
                getActivity(),
                new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year,
                                          int monthOfYear, int dayOfMonth) {
                        // on below line we are setting date to our text view.
                        Log.i("myLog", "onDateSet");
                        String day = String.valueOf(dayOfMonth);
                        if (day.length() == 1)
                            day = "0" + day;
                        Log.i("myLog", "onDateSet 1");
                        String month = String.valueOf(monthOfYear + 1);
                        if (month.length() == 1)
                            month = "0" + month;
                        Log.i("myLog", "onDateSet22222");
                        String selDate = year + "-" + month + "-" + day;
                        Log.i("myLog", "selDate:" + selDate);
                        txtDate.setText(selDate);
                        getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, selDate,String.valueOf(selPageCount), String.valueOf(currentPage));

                    }
                },
                // on below line we are passing year,
                // month and day for selected date in our date picker.
                year, month, day);
        Date date1 = new Date();
        datePickerDialog.getDatePicker().setMaxDate(date1.getTime());
        datePickerDialog.show();
    }
    private void callPrinter(GetInvoiceDataResponse resp, String txnId) {
        Log.i("myLog", "call printer");
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i("myLog", "call printer run :");
                String hospName = "", hospAddr = "", hospPhone = "", hospWebsite = "";
                GetInvoiceDataResponse.HospitalDetails hospDetails = resp.getHospitalDetails();
                if (hospDetails != null) {
                    hospAddr = hospDetails.getAddress();
                    hospName = hospDetails.getHospital_name();
                    hospPhone = hospDetails.getContact_no();
                    hospWebsite = hospDetails.getWebsite();

                }
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                Typeface typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
                mIminPrintUtils.setTextTypeface(typeface);
                mIminPrintUtils.setTextSize(35);
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText(hospName + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText(hospAddr + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText("Phone: " + hospPhone + "\n");

                GetInvoiceDataResponse.PatientDetails patientDetails = resp.getPatientDetails();
                String date = getCurrentDate();
                mIminPrintUtils.printAndFeedPaper(5);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_NORMAL;
                mIminPrintUtils.printText("\t Invoice      : " + txnId + "\n");
                mIminPrintUtils.printText("\t Date         : " + date + "\n");
                mIminPrintUtils.printText("\t Name       : " + patientDetails.getPatient_name() + "\n");
                mIminPrintUtils.printText("\t Mobile      : " + patientDetails.getMobileno() + "\n");
                mIminPrintUtils.printText("\t Address   : " + patientDetails.getAddress() + "\n");
                double subtotal = 0.0, totalTax = 0.0;
                ArrayList<GetInvoiceDataResponse.InvoiceDetails> invoiceList = resp.getInvoiceDetails();
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText("\t ----------------------------------------------------");
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printColumnsText(new String[]{"Item", "Qty", "Price","Discount","Add Charges", "Tax", "Amount"}, new int[]{2, 1, 2,2,2, 2, 2}, new int[]{1, 1,1,1, 1, 1, 1}, new int[]{20, 20,20,20, 20, 20, 20});
                mIminPrintUtils.printText("\t ------------------------------------------------------");
                if (invoiceList != null && !invoiceList.isEmpty()) {
                    int size = invoiceList.size();
                    for (int start = 0; start < size; start++) {
                        GetInvoiceDataResponse.InvoiceDetails details = invoiceList.get(start);
                        int qty = details.getQty();
                        double charge = details.getStandard_charge();
                        double amount = details.getTotal();
                        double tax = details.getTaxAmount();
                        double discount = details.getDiscount_amount();
                        double addCharge = details.getAdditional_charge();
                        mIminPrintUtils.printColumnsText(new String[]{details.getChargeName(), String.valueOf(qty), /*"\u20B9 " +*/ String.valueOf(charge), /*"\u20B9 " +*/ String.valueOf(discount), /*"\u20B9 " +*/ String.valueOf(addCharge), /*"\u20B9 " +*/ String.valueOf(tax),/* " \u20B9 " +*/ String.valueOf(amount)}, new int[]{2, 1,2,2, 2, 2, 2}, new int[]{0, 1,1,1, 1, 1, 1}, new int[]{23, 23,23,23, 23, 23, 23});
                    }
                }
                double total = resp.getTotal();
                mIminPrintUtils.printText("\t ----------------------------------------------------");

                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printColumnsText(new String[]{"Total", " \u20B9 " + total}, new int[]{2, 2}, new int[]{0, 2}, new int[]{26, 26});
                mIminPrintUtils.setTextSize(35);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText("\t Thank You! \n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                Log.i("myLog", "hospWebsite:" + hospWebsite);
                mIminPrintUtils.printText("\t" + hospWebsite + "\n");
                mIminPrintUtils.printAndFeedPaper(100);
                mIminPrintUtils.printAndLineFeed();
                mIminPrintUtils.fullCut();
                Log.i("myLog", "call printer run after print qr33333333:");
                Log.i("myLog", "call printer run end:");
            }
        });
        thread.start();
    }

    /*private void callPrinter(GetInvoiceDataResponse resp, String txnId) {
        Log.i("myLog", "call printer");
        thread = new Thread(new Runnable() {
            @Override
            public void run() {
                Log.i("myLog", "call printer run :");
                String hospName = "", hospAddr = "", hospPhone = "", hospWebsite = "";
                GetInvoiceDataResponse.HospitalDetails hospDetails = resp.getHospitalDetails();
                if (hospDetails != null) {
                    hospAddr = hospDetails.getAddress();
                    hospName = hospDetails.getHospital_name();
                    hospPhone = hospDetails.getContact_no();
                    hospWebsite = hospDetails.getWebsite();

                }
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                Typeface typeface = ResourcesCompat.getFont(context, R.font.mulish_normal);
                mIminPrintUtils.setTextTypeface(typeface);
                mIminPrintUtils.setTextSize(35);
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText(hospName + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText(hospAddr + "\n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText("Phone: " + hospPhone + "\n");

                GetInvoiceDataResponse.PatientDetails patientDetails = resp.getPatientDetails();
                String date = getCurrentDate();
                mIminPrintUtils.printAndFeedPaper(5);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_NORMAL;
                mIminPrintUtils.printText("\t Invoice      : " + txnId + "\n");
                mIminPrintUtils.printText("\t Date         : " + date + "\n");
                mIminPrintUtils.printText("\t Name       : " + patientDetails.getPatient_name() + "\n");
                mIminPrintUtils.printText("\t Mobile      : " + patientDetails.getMobileno() + "\n");
                mIminPrintUtils.printText("\t Address   : " + patientDetails.getAddress() + "\n");
                double subtotal = 0.0, totalTax = 0.0;
                ArrayList<GetInvoiceDataResponse.InvoiceDetails> invoiceList = resp.getInvoiceDetails();
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.printText("\t ----------------------------------------------------");
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printColumnsText(new String[]{"Item", "Qty", "Unit Price", "Tax", "Amount"}, new int[]{2, 1, 2, 2, 2}, new int[]{1, 1, 1, 1, 1}, new int[]{23, 23, 23, 23, 23});
                mIminPrintUtils.printText("\t ------------------------------------------------------");
                if (invoiceList != null && !invoiceList.isEmpty()) {
                    int size = invoiceList.size();
                    for (int start = 0; start < size; start++) {
                        GetInvoiceDataResponse.InvoiceDetails details = invoiceList.get(start);
                        int qty = details.getQty();
                        double charge = details.getStandard_charge();
                        double amount = details.getTotal();
                        double tax = details.getTaxAmount();
                        mIminPrintUtils.printColumnsText(new String[]{details.getChargeName(), String.valueOf(qty), "\u20B9 " + charge, "\u20B9 " + tax, " \u20B9 " + amount}, new int[]{2, 1, 2, 2, 2}, new int[]{0, 1, 1, 1, 1}, new int[]{23, 23, 23, 23, 23});
                    }
                }
                double total = resp.getTotal();
                mIminPrintUtils.printText("\t ----------------------------------------------------");

                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printColumnsText(new String[]{"Total", " \u20B9 " + total}, new int[]{2, 2}, new int[]{0, 2}, new int[]{26, 26});
                mIminPrintUtils.setTextSize(35);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                mIminPrintUtils.setTextStyle(Typeface.BOLD);
                mIminPrintUtils.printText("\t Thank You! \n");
                mIminPrintUtils.setTextSize(25);
                mIminPrintUtils.textAlignment = Layout.Alignment.ALIGN_CENTER;
                Log.i("myLog", "hospWebsite:" + hospWebsite);
                mIminPrintUtils.printText("\t" + hospWebsite + "\n");
                mIminPrintUtils.printAndFeedPaper(100);
                mIminPrintUtils.printAndLineFeed();
                mIminPrintUtils.fullCut();
                Log.i("myLog", "call printer run after print qr33333333:");
                Log.i("myLog", "call printer run end:");
            }
        });
        thread.start();
    }*/


    private void showData() {
        String text = spinPages.getSelectedItem().toString();
        selPageCount = Integer.parseInt(text);
        Log.i("myLog", "selTab in spin pages click:" + selTab);
        if (selTab.equalsIgnoreCase("Billing_History")) {
            OPHubApplication.billingSelTab = selTab;
            tabLayout.getTabAt(1).select();
            linearHeading.setVisibility(View.VISIBLE);
            linearPendBillsHeading.setVisibility(View.GONE);
            initPageNo = 1;
            selInitial = (selPageNumber - 1) * selPageCount;
            selEnd = selInitial + (selPageCount - 1);
            String date = null;
            if (isFilterSet) {
                if (selFromDate == null && selToDate == null)
                    date = txtDate.getText().toString();
            } else {
                date = txtDate.getText().toString();
            }
            getBillingHistory(selPatientId, selFromDate, selToDate, selPaymentMethod, date,String.valueOf(selPageCount), String.valueOf(currentPage));
        } else {
            OPHubApplication.billingSelTab = selTab;
            tabLayout.getTabAt(0).select();
            linearHeading.setVisibility(View.GONE);
            linearPendBillsHeading.setVisibility(View.VISIBLE);
            selFromDate = null;
            selToDate = null;
            selPatientId = null;
            selPaymentMethod = null;
            initPageNo = 1;
            selInitial = (selPageNumber - 1) * selPageCount;
            selEnd = selInitial + (selPageCount - 1);
            Log.i("myLog", "selInitial:" + selInitial + "   selEnd:" + selEnd + "   selPageNumber:" + selPageNumber + "   selPageCount:" + selPageCount);
            getPendingBillHistory(String.valueOf(selPageCount), String.valueOf(currentPage));
        }
    }

}