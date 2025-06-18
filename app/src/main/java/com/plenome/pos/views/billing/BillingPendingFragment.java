package com.plenome.pos.views.billing;

import static android.view.View.GONE;

import static com.plenome.pos.utils.OPHubUtils.getCurrentDate;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.ColorDrawable;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Handler;
import android.text.Editable;
import android.text.InputFilter;
import android.text.Layout;
import android.text.Spanned;
import android.text.TextWatcher;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.Spinner;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.core.content.res.ResourcesCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.imin.printerlib.IminPrintUtils;
import com.plenome.pos.BuildConfig;
import com.plenome.pos.R;
import com.plenome.pos.adapters.BillingAdapter;
import com.plenome.pos.adapters.BillingAdapterViewMore;
import com.plenome.pos.model.BookAppointmentOnlineRes;
import com.plenome.pos.model.GetInvoiceDataResponse;
import com.plenome.pos.model.GetPatientChargeDetResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.OpdDropdownRes;
import com.plenome.pos.model.PatientProfileQR;
import com.plenome.pos.model.PendingBillResponse;
import com.plenome.pos.network.NetworkConnectionReceiver;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.plenome.pos.utils.JavaScriptInterface;
import com.plenome.pos.utils.OPHubUtils;
import com.plenome.pos.views.OPHubApplication;
import com.plenome.pos.views.RazorpayActivity;
import com.razorpay.Checkout;
import com.razorpay.PaymentResultListener;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BillingPendingFragment extends Fragment implements NetworkConnectionReceiver.ReceiverListener, PaymentResultListener {

    View rootView;
    BillingAdapter billingAdapter;
    BillingAdapterViewMore billingAdapterViewMore;
    RestServices services, fileServices;
    int hospId, patientId, width, height, textSize, chargeIndex, chargeId, stdCharge, patientChargeId;
    String fromScreen, taxPercent,fromBill;
    Typeface typeface;
    NetworkConnectionReceiver networkConnectionReceiver = new NetworkConnectionReceiver();
    TableRow.LayoutParams txtParam, lineParam, qtyParam, iconParam, invoiceLineParam, invoiceTxtParam, txtParam1, txtParam2;
    EditText edtStdCharge, edtQty, edtNotes, edtDiscountRate, edtDiscountPercent, edtAddiCharges, edtChargeType, edtChargeName, edtChargeCategory;
    TextView txtTotal, txtTaxPercent, txtTax, txtNetAmt, txtRemove, txtDiscount, txtDiscountPercent, txtTaxTotal, txtSubTotal, txtAddiCharges, txtNotes;
    boolean isAdditCharges = true;
    TableLayout tblInvoice;
    DecimalFormat df;
    Dialog dialogSuccess, dialogAddCharges, dialogConfirmation, dialogEditCharges, dialogInvoice,viewDialog;
    LinearLayout linearAddCharges, linearTxtAddiCharges, linearTxtNotes;
    Double totDueAmt;
    Button btnAdd;
    Spinner spinopdAppointment,spinChargeType, spinChargeCategory, spinChargeName;
    ArrayList<String> opdAppts,chargeTypeAL, chargeCategoryAL, chargeNameAL, chargeNameTaxPercentAL;
    ArrayList<Integer> chargeTypeIdAL, chargeCategoryIdAL, chargeNameIdAL, chargeNameStdChargeAL;
    ArrayList<Double> chargeNameTaxAmtAL, chargeNameNetAmtAL;
    PendingBillResponse.PatientDetails patientDet;
    private IminPrintUtils mIminPrintUtils;
    Thread thread;
    Context context;
    boolean isUpdating = false;

    String passFilterTxt="All";
    private String aayushUniqueId;

    @BindView(R.id.txtTotDue)
    TextView txtDueAmt;

    @BindView(R.id.txtPatientName)
    TextView txtPatientName;

    @BindView(R.id.txtPatientAbhaNo)
    TextView txtAbhaNo;

    @BindView(R.id.txtPatientId)
    TextView txtPatientId;

    @BindView(R.id.txtDate)
    TextView txtDate;

    @BindView(R.id.tblPendingPayment)
    TableLayout tblView;

    @BindView(R.id.imgNoData)
    ImageView imgNoData;

    @BindView(R.id.txtNoData)
    TextView txtNoData;

    @BindView(R.id.tblPendingPaymentHeading)
    TableLayout tblHeading;

    TextView txtnewAdditionalCharges;

    @BindView(R.id.linearPaymentOption)
    LinearLayout linearPayment;

    @BindView(R.id.webView)
    WebView webview;

    @BindView(R.id.relContents)
    RelativeLayout relContents;

    @BindView(R.id.billingRec)
    RecyclerView billingRec;


    RecyclerView billingRecSub;

    @BindView(R.id.onlineTxt)
    TextView onlineTxt;

    @BindView(R.id.filterText)
    TextView filterText;

    @BindView(R.id.cashTxt)
    TextView cashTxt;

    @BindView(R.id.newAddBtn)
    Button newAddBtn;

    @BindView(R.id.billFilterOptionsLnr)
    LinearLayout billFilterOptionsLnrs;


    @BindView(R.id.noDataFound)
    LinearLayout noDataFound;



    private static final int PAYMENT_REQUEST_CODE = 100;
    PopupWindow popupWindow;
    private String OpdApptId="";
    private int ChargeTypeId;
    private List<PendingBillResponse.PendingDetails> filteredList = new ArrayList<>();
    private List<PendingBillResponse.PendingDetails> filteredListSingle = new ArrayList<>();
    private List<PendingBillResponse.PendingDetails> filteredListMain = new ArrayList<>();

    private List<PendingBillResponse.PendingDetails> originalList = new ArrayList<>();





    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        rootView = inflater.inflate(R.layout.fragment_pending_billing, container, false);
        ButterKnife.bind(this, rootView);
        services = RetrofitInstance.createService(RestServices.class);
        fileServices = RetrofitInstance.createFileService(RestServices.class);
        OPHubApplication.appBarImage.setVisibility(View.VISIBLE);
        OPHubApplication.appBarTitle.setText(R.string.billing);
        hospId = OPHubApplication.getHospitalId();
        typeface = ResourcesCompat.getFont(getContext(), R.font.mulish_normal);
        context = getContext();
        df = new DecimalFormat("0.00");
        billFilterOptionsLnrs=rootView.findViewById(R.id.billFilterOptionsLnr);
        billFilterOptionsLnrs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                filterPopover();
            }
        });

        initParams();
        Bundle bundle = getArguments();
        if (bundle != null) {
            // patientId = bundle.getInt("patient_id");
            fromScreen = bundle.getString("from_screen");
            fromBill = bundle.getString("fromBill");
            if (fromScreen.equalsIgnoreCase("Billing")) {
                patientId = bundle.getInt("patient_id");
                getPendingBill(patientId);
            } else if (fromBill.equalsIgnoreCase("Bill")) {
                patientId = bundle.getInt("patient_id");
                getPendingBill(patientId);
            } else {
                aayushUniqueId = bundle.getString("patient_id");
                QRcodePatientDataSet(aayushUniqueId);
            }

        }

        Checkout.preload(getContext());








        return rootView;
    }




    private void initParams() {
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        width = metrics.widthPixels;
        height = metrics.heightPixels;
        if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
            textSize = 14;
            int w = (width - dpToPx(70)) / 13;
            int w1 = ((width - dpToPx(70)) / 2) / 5;
            int w2 = ((width - dpToPx(70)) / 2) / 6;
            txtParam = new TableRow.LayoutParams(w, dpToPx(45));
            txtParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            txtParam1 = new TableRow.LayoutParams(w1, dpToPx(45));
            txtParam1.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            txtParam2 = new TableRow.LayoutParams(w2, dpToPx(55));
            txtParam2.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            lineParam = new TableRow.LayoutParams(w, dpToPx(1));
            lineParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam.span = 13;
            qtyParam = new TableRow.LayoutParams(dpToPx(150), dpToPx(35));
            qtyParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            iconParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            iconParam.setMargins(20, 0, 10, 0);
            invoiceTxtParam = new TableRow.LayoutParams(dpToPx(510) / 7, dpToPx(35));
            invoiceTxtParam.setMargins(dpToPx(2), 0, dpToPx(2), 0);
            invoiceLineParam = new TableRow.LayoutParams(dpToPx(510), dpToPx(1));
            invoiceLineParam.setMargins(0, dpToPx(5), 0, dpToPx(5));
            invoiceLineParam.span = 7;

        } else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
            textSize = 14;
            int w = (width - dpToPx(75)) / 13;
            int w1 = ((width - dpToPx(75)) / 2) / 5;
            int w2 = ((width - dpToPx(75)) / 2) / 7;
            txtParam = new TableRow.LayoutParams(w, dpToPx(35));
            txtParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            txtParam1 = new TableRow.LayoutParams(w1, dpToPx(40));
            txtParam1.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            txtParam2 = new TableRow.LayoutParams(w2, dpToPx(40));
            txtParam2.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam = new TableRow.LayoutParams(w, dpToPx(1));
            lineParam.setMargins(dpToPx(3), 0, dpToPx(3), 0);
            lineParam.span = 13;
            qtyParam = new TableRow.LayoutParams(dpToPx(150), dpToPx(35));
            qtyParam.setMargins(dpToPx(3), dpToPx(10), dpToPx(3), dpToPx(10));
            iconParam = new TableRow.LayoutParams(dpToPx(25), dpToPx(25));
            iconParam.setMargins(20, 0, 10, 0);
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
        // call method
        Log.i("myLog", "onPause...........appt fragment");
        getActivity().unregisterReceiver(networkConnectionReceiver);
    }

    @OnClick(R.id.btnScheme)
    public void clickedScheme() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String currDate = dateFormat.format(date);
       // cashPayment(currDate, "Scheme");
    }

    @OnClick(R.id.newAddBtn)
    public void clikedNewAddDialog() {
        showAddChargesDialog("AddDropdown", 0, "");
    }




    @OnClick(R.id.cashTxt)
    public void clickedCash() {
        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        System.out.println("checkIf");
        String currDate = dateFormat.format(date);
        cashPayment(currDate, "Cash");
        //cashPaymentV2(currDate,"Cash");
        //cashPaymentV2All(currDate,"Cash");
    }

    private void cashPaymentV2All(String date, String paymentMode) {
        OPHubRequests.CashBillPayReqV2 request = new OPHubRequests.CashBillPayReqV2();
        request.setHospitalId(hospId);
        request.setPatientId(patientId);
        request.setPaymentDate(date);
        request.setPaymentMode(paymentMode);
        request.setReceivedByName(OPHubApplication.getStaffName());

        // Create the payment details list with only the last section ID







        List<OPHubRequests.PaymentDetail> paymentDetails = new ArrayList<>();
        if (!filteredListMain.isEmpty()) {
            PendingBillResponse.PendingDetails lastDetail = filteredListMain.get(filteredListMain.size() - 1);
            OPHubRequests.PaymentDetail lastPaymentDetail = new OPHubRequests.PaymentDetail();
            lastPaymentDetail.setSectionId(lastDetail.getSectionId());
            lastPaymentDetail.setPatientChargeId(lastDetail.getPatientChargeId());
            lastPaymentDetail.setDate(lastDetail.getDate());
            lastPaymentDetail.setSection(lastDetail.getSection());
            lastPaymentDetail.setChargeDescription(lastDetail.getChargeDescription());
            lastPaymentDetail.setQty(lastDetail.getQty());
            lastPaymentDetail.setAdditionalCharge(lastDetail.getAdditionalCharge());


            Integer qtyObj = lastDetail.getQty();
            Double chargesObj = lastDetail.getCharges();
            Double discountObj = lastDetail.getDiscount();
            Integer addChargeObj = lastDetail.getAdditionalCharge();
            Double taxObj = lastDetail.getTaxPercentage();

            int qty = qtyObj != null ? qtyObj : 0;
            double charges = chargesObj != null ? chargesObj : 0.0;
            double discount = discountObj != null ? discountObj : 0.0;
            int addCharge = addChargeObj != null ? addChargeObj : 0;
            double tax = taxObj != null ? taxObj : 0.0;



            double subtotal = (charges * qty) + addCharge - discount;
            int taxAmt = (int) Math.round(subtotal * (tax / 100.0));
            double total = subtotal + taxAmt;

            lastDetail.setTotal(total);
            paymentDetails.add(lastPaymentDetail);
        }

        request.setPaymentDetails(paymentDetails);
        Log.i("mylog", "cashPaymentrequestV2LastIds:" + new Gson().toJson(request));

        Call<OPHubResponse.UpdateApptStatusResponse> call = services.cashBillPaymentV2(request);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {
            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {
                try {
                    Log.i("mylog", "cashPayment response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "cashPayment response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        String txnId = resp.getTxnId();
                        System.out.println("invoice print::" + txnId);
                        if ("success".equalsIgnoreCase(status)) {
                            showSuccessDialog(message, txnId, "Payment");
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "cashPayment response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void cashPaymentV2(String date, String paymentMode) {
        OPHubRequests.CashBillPayReqV2 request = new OPHubRequests.CashBillPayReqV2();
        request.setHospitalId(hospId);
        request.setPatientId(patientId);
        request.setPaymentDate(date);
        request.setPaymentMode(paymentMode);
        request.setReceivedByName(OPHubApplication.getStaffName());

        // 👇 Create the payment details list (this must not be null)
        List<OPHubRequests.PaymentDetail> paymentDetails = new ArrayList<>();
        for (PendingBillResponse.PendingDetails detail : filteredListMain) {
            if (detail.getPatientChargeId()==ChargeTypeId) {
                OPHubRequests.PaymentDetail paymentDetail = new OPHubRequests.PaymentDetail();
                paymentDetail.setPatientChargeId(detail.getPatientChargeId());
                paymentDetail.setDate(detail.getDate());
                paymentDetail.setSection(detail.getSection());
                 if (!detail.getSectionId().equals(" - "))
                 paymentDetail.setSectionId(detail.getSectionId());
                paymentDetail.setChargeDescription(detail.getChargeDescription());
                paymentDetail.setQty(detail.getQty());
                paymentDetail.setAdditionalCharge(detail.getAdditionalCharge());

                // Safe parsing
                Integer qtyObj = detail.getQty();
                Double chargesObj = detail.getCharges();
                Double discountObj = detail.getDiscount();
                Integer addChargeObj = detail.getAdditionalCharge();
                Double taxObj = detail.getTaxPercentage();

                int qty = qtyObj != null ? qtyObj : 0;
                double charges = chargesObj != null ? chargesObj : 0.0;
                double discount = discountObj != null ? discountObj : 0.0;
                int addCharge = addChargeObj != null ? addChargeObj : 0;
                double tax = taxObj != null ? taxObj : 0.0;

                double subtotal = (charges * qty) + addCharge - discount;
                int taxAmt = (int) Math.round(subtotal * (tax / 100.0));
                double total = subtotal + taxAmt;

                paymentDetail.setTotal(total);

                paymentDetails.add(paymentDetail);
                break; // Stop after finding the first matching item
            }
        }


        request.setPaymentDetails(paymentDetails);

        Log.i("mylog", "cashPaymentrequestV2:" + new Gson().toJson(request));

        Call<OPHubResponse.UpdateApptStatusResponse> call = services.cashBillPaymentV2(request);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {
            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {
                try {
                    Log.i("mylog", "cashPayment response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "cashPayment response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        String txnId = resp.getTxnId();
                        System.out.println("invoice print::" + txnId);
                        if ("success".equalsIgnoreCase(status)) {
                            showSuccessDialog(message, txnId, "Payment");
                        }
                    }else {
                        OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "cashPayment response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    @OnClick(R.id.onlineTxt)
    public void clickedUpi() {
//        OPHubUtils.showErrorDialog(getActivity(), "UPI is currently not available");
//        upiPayment();
        Intent intent = new Intent(getActivity(), RazorpayActivity.class);
        intent.putExtra("amount", "100"); // Amount in paise
        intent.putExtra("name", "Plenome");
        startActivityForResult(intent, PAYMENT_REQUEST_CODE);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PAYMENT_REQUEST_CODE && resultCode == Activity.RESULT_OK && data != null) {
            String razorpayPaymentID = data.getStringExtra("razorpayPaymentID");
            String status = data.getStringExtra("status");

            if ("success".equals(status)) {
                System.out.println("paymen success in fragment  " + razorpayPaymentID);
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date date = new Date();
                String currDate = dateFormat.format(date);
                cashPaymentV2(currDate, "UPI");
                //   Toast.makeText(getContext(), "Payment Successful: " + razorpayPaymentID, Toast.LENGTH_LONG).show();

            } else {
                System.out.println("payment failure in fragment");
                Toast.makeText(getContext(), "Payment Failed", Toast.LENGTH_LONG).show();
            }
        }
    }


    private void QRcodePatientDataSet(String aayushUniqueId) {
        HashMap<String, String> requestData = new HashMap<>();
        requestData.put("aayush_unique_id", aayushUniqueId);
        requestData.put("hospital_id", String.valueOf(hospId));
        Call<PatientProfileQR> call = services.getQRPatientProfile(requestData);
        call.enqueue(new Callback<PatientProfileQR>() {

            @Override
            public void onResponse(Call<PatientProfileQR> call, Response<PatientProfileQR> response) {
                try {
                    Log.i("myLog", "addNewPatient response:");
                    Log.i("mylog", "addNewPatient response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "addNewPatient response isSuccess:" + response.body().toString());
                        PatientProfileQR res = response.body();

                        if (res != null && res.getDetails() != null && !res.getDetails().isEmpty()) {
                            PatientProfileQR.Detail details = res.getDetails().get(0);
                            patientId = Integer.parseInt(details.getId());

                            getPendingBill(patientId);
                        } else {
                            Log.e("myLog", "Response is null or details list is empty");
                            // Optionally show an error to the user
                        }

                    } else {
                        Log.i("myLog", "response else part");
                        OPHubUtils.showErrorDialog(getActivity(), response.message());

                    }
                } catch (NumberFormatException e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PatientProfileQR> call, Throwable t) {
                Log.i("myLog", "addNewPatient response failure:" + t.toString());
                Log.i("myLog", "addNewPatient response failure:" + t.getMessage());
            }
        });


    }


    public void upiRazorpay() {
        System.out.println("print on print");
        Checkout checkout = new Checkout();
        checkout.setKeyID("rzp_live_E1TEgAPfjZ0OIQ");
        checkout.setImage(R.drawable.plenome_icon);
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", "udhayakumar");
            jsonObject.put("amount", 200);
            jsonObject.put("currency", "INR");
            jsonObject.put("prefill", new JSONObject()
                    .put("name", "John Doe")
                    .put("email", "johndoe@example.com")
                    .put("contact", "9876543210"));

            checkout.open(requireActivity(), jsonObject);

        } catch (Exception e) {


        }


    }

    @OnClick(R.id.btnAddCharges)
    public void clickedAddCharges() {
        showAddChargesDialog("Add", 0, "");
    }

    public boolean checkConnection() {
        // Initialize connectivity manager
        ConnectivityManager manager = (ConnectivityManager) getActivity().getSystemService(Context.CONNECTIVITY_SERVICE);
        // Initialize network info
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        // get connection status
        boolean isConnected = networkInfo != null && networkInfo.isConnectedOrConnecting();
        return isConnected;
    }

    public void showNoNetworkDialog() {
        Dialog dialogNoNetwork = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_no_network, null);
        dialogNoNetwork.setContentView(view);
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

    @Override
    public void onNetworkChange(boolean isConnected) {
        if (!isConnected)
            showNoNetworkDialog();
    }

    private void getPendingBill(int patientId) {
        Log.i("myLog", "getPendingBill"+patientId);
        services.getPendingBillPatient(hospId, patientId).enqueue(new Callback<PendingBillResponse>() {
            @Override
            public void onResponse(Call<PendingBillResponse> call, Response<PendingBillResponse> response) {
                try {
                    Log.i("myLog", "getPendingBill onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        PendingBillResponse resp = response.body();

                        totDueAmt = resp.getTotalDue();
                        txtDueAmt.setText("\u20B9 " + df.format(totDueAmt));
                        List<PendingBillResponse.PatientDetails> patientDetAL = resp.getPatientDetailsAL();
                        if (patientDetAL != null && !patientDetAL.isEmpty()) {
                            patientDet = patientDetAL.get(0);
                            txtPatientName.setText(patientDet.getPatientName() + " , " + patientDet.getGender() + " | " + patientDet.getAge());
                            txtPatientId.setText("Patient ID : " + patientDet.getId());

                        }
                        List<PendingBillResponse.PendingDetails> pendingDetAL = resp.getPendingDetailsAL();
                        originalList=pendingDetAL;
                        if (pendingDetAL != null && !pendingDetAL.isEmpty()) {
                            billingRec.setLayoutManager(new LinearLayoutManager(requireContext()));
                            billingRec.setVisibility(View.VISIBLE);
                            noDataFound.setVisibility(View.GONE);

                            filteredListMain.addAll(pendingDetAL);

                            billingAdapter = new BillingAdapter(requireContext(), pendingDetAL);
                            billingRec.setAdapter(billingAdapter);

                            billingAdapter.setOnMenuItemClickListener((position, menuItemId, item) -> {
                                OpdApptId = item.getSectionId();
                                ChargeTypeId = item.getPatientChargeId();

                                switch (menuItemId) {
                                    case R.id.action_add:
                                        showAddChargesDialog("Add", 0, "");
                                        break;

                                    case R.id.action_edit:
                                        showAddChargesDialog("Edit", item.getPatientChargeId(), item.getSection());
                                        break;

                                    case R.id.online:
                                        double amountInPaise = item.getTotal() * 100;
                                        Intent intent = new Intent(getActivity(), RazorpayActivity.class);
                                        intent.putExtra("amount", String.valueOf((int) amountInPaise));
                                        intent.putExtra("name", "Plenome");
                                        startActivityForResult(intent, PAYMENT_REQUEST_CODE);
                                        break;

                                    case R.id.cash:
                                        payNowWithMode("Cash");
                                        break;

                                    case R.id.upi:
                                        payNowWithMode("UPI");
                                        break;

                                    case R.id.card:
                                        payNowWithMode("Card");
                                        break;

                                    case R.id.neft:
                                        payNowWithMode("NEFT");
                                        break;

                                    default:
                                        break;
                                }
                            });

                            billingAdapter.setOnViewParticlulars((position, item) -> {
                                System.out.println("PositionCheck" + item.getTotal());
                                showViewMore(item);
                            });

                        } else {
                            billingRec.setVisibility(View.GONE);
                            noDataFound.setVisibility(View.VISIBLE);
                        }


                    } else {
                        // OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PendingBillResponse> call, Throwable t) {
                Log.i("myLog", "getPendingBill failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void payNowWithMode(String mode) {
        String currentDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
        cashPaymentV2(currentDate, mode);
    }


    private void showViewMore(PendingBillResponse.PendingDetails item) {
        viewDialog = new Dialog(getActivity());
            View view = getLayoutInflater().inflate(R.layout.view_dialog_bill, null);
        viewDialog.setContentView(view);
        viewDialog.show();

        txtTotal = viewDialog.findViewById(R.id.txtConsultantFee);
        txtDiscount = viewDialog.findViewById(R.id.txtDiscount);
        txtSubTotal = viewDialog.findViewById(R.id.txtSubTotal);
        txtTaxTotal = viewDialog.findViewById(R.id.txtTax);
        txtNetAmt = viewDialog.findViewById(R.id.txtNetAmt);
        billingRecSub = viewDialog.findViewById(R.id.billingRecSub);
        ImageView imgClose = viewDialog.findViewById(R.id.imgClose);

//        txtNetAmt.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//                Date date = new Date();
//                String currDate = dateFormat.format(date);
//               cashPaymentV2(currDate,"Cash");
//                viewDialog.dismiss();
//            }
//        });

        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                viewDialog.dismiss();
            }
        });

        getPendingBillNew(patientId,billingRecSub,item.getSectionId());
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(viewDialog.getWindow().getAttributes());
        lp.width = dpToPx(950);
        lp.height = dpToPx(700);
        viewDialog.getWindow().setAttributes(lp);

    }

    private void getPendingBillNew(int patientId, RecyclerView billingRecSub, String sectionId) {

        Log.i("myLog", "getPendingBill sectionId: " + sectionId);

        services.getPendingBillPatient(hospId, patientId).enqueue(new Callback<PendingBillResponse>() {
            @Override
            public void onResponse(Call<PendingBillResponse> call, Response<PendingBillResponse> response) {
                try {
                    Log.i("myLog", "getPendingBill onResponse: " + new Gson().toJson(response.body()));

                    if (response.body() != null) {
                        PendingBillResponse resp = response.body();
                        List<PendingBillResponse.PendingDetails> pendingDetAL = resp.getPendingDetailsAL();

                        if (pendingDetAL != null) {
                            filteredList.clear(); // reset existing list

                            // Totals
                            double totalCharges = 0;
                            double totalDiscount = 0;
                            double totalSubTotal = 0;
                            double totalTax = 0;
                            double totalNetAmount = 0;

                            for (PendingBillResponse.PendingDetails detail : pendingDetAL) {
                                if (detail.getSectionId().equalsIgnoreCase(sectionId)) {
                                    filteredList.add(detail);

                                    double chargeAmt = detail.getCharges() * detail.getQty();
                                    double subTotal = chargeAmt + detail.getAdditionalCharge() - detail.getDiscount();

                                    double taxAmt = 0;
                                    double netAmt;

                                    if (detail.getTaxPercentage() > 0) {
                                        taxAmt = subTotal * (detail.getTaxPercentage() / 100);
                                        totalTax += taxAmt;
                                        netAmt = detail.getTotal(); // add tax
                                    } else {
                                        netAmt = subTotal;
                                    }

                                    totalCharges += chargeAmt;
                                    totalDiscount += detail.getDiscount();
                                    totalSubTotal += subTotal;
                                    totalNetAmount += netAmt;
                                }
                            }

                            // Update UI
                            txtTotal.setText("₹ " + df.format(totalCharges));
                            txtDiscount.setText("₹ " + df.format(totalDiscount));
                            txtSubTotal.setText("₹ " + df.format(totalSubTotal));
                            txtTaxTotal.setText("₹ " + df.format(totalTax));
                            txtNetAmt.setText("₹ " + df.format(totalNetAmount));

                            billingRecSub.setLayoutManager(new LinearLayoutManager(requireContext()));
                            billingRecSub.setVisibility(View.VISIBLE);
                            billingAdapterViewMore = new BillingAdapterViewMore(requireContext(), filteredList);
                            billingRecSub.setAdapter(billingAdapterViewMore);
                        }

                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<PendingBillResponse> call, Throwable t) {
                Log.i("myLog", "getPendingBill failure: " + t.getMessage());
            }
        });
    }


    private void showPendingDet(List<PendingBillResponse.PendingDetails> list) {
        tblView.removeAllViews();
        Log.i("myLog", "list size:" + list.size());
        TableRow trTitle = new TableRow(getActivity());
        TextView txtTitleDate = new TextView(getActivity());
        txtTitleDate.setText(R.string.date);
        txtTitleDate.setTextColor(Color.WHITE);
        txtTitleDate.setTypeface(typeface);
        txtTitleDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleDate.setGravity(Gravity.CENTER);
        trTitle.addView(txtTitleDate, txtParam1);

        TextView txtTitleSection = new TextView(getActivity());
        txtTitleSection.setText(R.string.section);
        txtTitleSection.setTextColor(Color.WHITE);
        txtTitleSection.setTypeface(typeface);
        txtTitleSection.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleSection.setGravity(Gravity.CENTER);
        trTitle.addView(txtTitleSection, txtParam1);

        TextView txtTitleSectionId = new TextView(getActivity());
        txtTitleSectionId.setText(R.string.sectionId);
        txtTitleSectionId.setTextColor(Color.WHITE);
        txtTitleSectionId.setTypeface(typeface);
        txtTitleSectionId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleSectionId.setGravity(Gravity.CENTER);
        trTitle.addView(txtTitleSectionId, txtParam1);

        TextView txtTitleChargeDesc = new TextView(getActivity());
        txtTitleChargeDesc.setText(R.string.chargeDesc);
        txtTitleChargeDesc.setTextColor(Color.WHITE);
        txtTitleSection.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleChargeDesc.setGravity(Gravity.CENTER);
        txtTitleSection.setTypeface(typeface);
        trTitle.addView(txtTitleChargeDesc, txtParam1);

        TextView txtTitleQty = new TextView(getActivity());
        txtTitleQty.setText(R.string.qty);
        txtTitleQty.setTextColor(Color.WHITE);
        txtTitleQty.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleQty.setGravity(Gravity.CENTER);
        txtTitleQty.setTypeface(typeface);
        trTitle.addView(txtTitleQty, txtParam2);

        TextView txtTitleDiscount = new TextView(getActivity());
        txtTitleDiscount.setText(R.string.discount);
        txtTitleDiscount.setTextColor(Color.WHITE);
        txtTitleDiscount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleDiscount.setGravity(Gravity.CENTER);
        txtTitleDiscount.setTypeface(typeface);
        trTitle.addView(txtTitleDiscount, txtParam2);
      /*  TextView txtAdditCharges = new TextView(getActivity());
        txtAdditCharges.setText(R.string.additionalCharges);
        txtAdditCharges.setTextColor(Color.WHITE);
        txtAdditCharges.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize-1);
        txtAdditCharges.setGravity(CENTER);
        txtAdditCharges.setTypeface(typeface);
        trTitle.addView(txtAdditCharges, txtParam2);*/

        TextView txtTitleCharges = new TextView(getActivity());
        txtTitleCharges.setText(R.string.charges);
        txtTitleCharges.setTextColor(Color.WHITE);
        txtTitleCharges.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleCharges.setGravity(Gravity.CENTER);
        txtTitleCharges.setTypeface(typeface);
        trTitle.addView(txtTitleCharges, txtParam2);

        TextView txtAdditionalCharges = new TextView(getActivity());
        txtAdditionalCharges.setText(R.string.additionalCharges);
        txtAdditionalCharges.setTextColor(Color.WHITE);
        txtAdditionalCharges.setTextSize(TypedValue.COMPLEX_UNIT_SP, 13);
        txtAdditionalCharges.setGravity(Gravity.CENTER);
        txtAdditionalCharges.setTypeface(typeface);
        trTitle.addView(txtAdditionalCharges, txtParam2);


        TextView txtTitleTax = new TextView(getActivity());
        txtTitleTax.setText(R.string.tax);
        txtTitleTax.setTextColor(Color.WHITE);
        txtTitleTax.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleTax.setGravity(Gravity.CENTER);
        txtTitleTax.setTypeface(typeface);
        trTitle.addView(txtTitleTax, txtParam2);

        TextView txtTitleAmt = new TextView(getActivity());
        txtTitleAmt.setText(R.string.amount);
        txtTitleAmt.setTextColor(Color.WHITE);
        txtTitleAmt.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleAmt.setGravity(Gravity.CENTER);
        txtTitleAmt.setTypeface(typeface);
        trTitle.addView(txtTitleAmt, txtParam2);

        TextView txtTitleAction = new TextView(getActivity());
        txtTitleAction.setText(R.string.action);
        txtTitleAction.setTextColor(Color.WHITE);
        txtTitleAction.setTypeface(typeface);
        txtTitleAction.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
        txtTitleAction.setGravity(Gravity.CENTER);
        trTitle.addView(txtTitleAction, txtParam2);

        trTitle.setBackground(ContextCompat.getDrawable(getActivity(), R.drawable.table_title_bg));
        tblHeading.addView(trTitle);

        tblHeading.setVisibility(View.VISIBLE);
        int size = list.size();
        if (size <= 0) {
            imgNoData.setVisibility(View.VISIBLE);
            txtNoData.setVisibility(View.VISIBLE);
            tblHeading.setVisibility(View.GONE);
            linearPayment.setVisibility(View.GONE);

        } else {
            tblHeading.setVisibility(View.VISIBLE);
            imgNoData.setVisibility(View.GONE);
            txtNoData.setVisibility(View.GONE);
            linearPayment.setVisibility(View.VISIBLE);

            for (int start = 0; start < size; start++) {
                final int index = start;
                PendingBillResponse.PendingDetails resp = list.get(start);

                TableRow tr = new TableRow(getActivity());
                TextView txtDate = new TextView(getActivity());
                txtDate.setText(resp.getDate());
                txtDate.setTextColor(Color.BLACK);
                txtDate.setTypeface(typeface);
                txtDate.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtDate.setGravity(Gravity.CENTER);
                tr.addView(txtDate, txtParam1);
                TextView txtSection = new TextView(getActivity());
                txtSection.setText(resp.getSection());
                txtSection.setTextColor(Color.BLACK);
                txtSection.setTypeface(typeface);
                txtSection.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSection.setGravity(Gravity.CENTER);
                tr.addView(txtSection, txtParam1);
                TextView txtSectionId = new TextView(getActivity());
                txtSectionId.setText(String.valueOf(resp.getSectionId()));
                txtSectionId.setTextColor(Color.BLACK);
                txtSectionId.setTypeface(typeface);
                txtSectionId.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtSectionId.setGravity(Gravity.CENTER);
                tr.addView(txtSectionId, txtParam1);
                TextView txtChargeDesc = new TextView(getActivity());
                txtChargeDesc.setText(resp.getChargeDescription());
                txtChargeDesc.setTextColor(Color.BLACK);
                txtChargeDesc.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtChargeDesc.setGravity(Gravity.CENTER);
                txtChargeDesc.setTypeface(typeface);
                tr.addView(txtChargeDesc, txtParam1);

                TextView txtQty = new TextView(getActivity());
                txtQty.setText(String.valueOf(resp.getQty()));
                txtQty.setTextColor(Color.BLACK);
                txtQty.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtQty.setGravity(Gravity.CENTER);
                txtQty.setTypeface(typeface);
                tr.addView(txtQty, txtParam2);
                TextView txtDiscount = new TextView(getActivity());
                //   txtDiscount.setText(String.valueOf(resp.getDiscount()));
                txtDiscount.setText("₹ " + df.format(resp.getDiscount()));
                txtDiscount.setTextColor(Color.BLACK);
                txtDiscount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtDiscount.setGravity(Gravity.CENTER);
                txtDiscount.setTypeface(typeface);
                tr.addView(txtDiscount, txtParam2);

                TextView txtCharge = new TextView(getActivity());
                txtCharge.setText("₹ " +df.format(resp.getCharges()));
                txtCharge.setTextColor(Color.BLACK);
                txtCharge.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtCharge.setGravity(Gravity.CENTER);
                txtCharge.setTypeface(typeface);
                tr.addView(txtCharge, txtParam2);


                TextView additionalAmount = new TextView(getActivity());
                additionalAmount.setText("\u20B9 " +  df.format(resp.getAdditionalCharge()));
                additionalAmount.setTextColor(Color.BLACK);
                additionalAmount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                additionalAmount.setGravity(Gravity.CENTER);
                additionalAmount.setTypeface(typeface);
                tr.addView(additionalAmount, txtParam2);



                TextView txtTax = new TextView(getActivity());
                txtTax.setText( df.format(resp.getTaxPercentage()) + " %");
                txtTax.setTextColor(Color.BLACK);
                txtTax.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtTax.setGravity(Gravity.CENTER);
                txtTax.setTypeface(typeface);
                tr.addView(txtTax, txtParam2);

                TextView txtAmount = new TextView(getActivity());
                txtAmount.setText("\u20B9 " +  df.format(resp.getTotal()));
                txtAmount.setTextColor(Color.BLACK);
                txtAmount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtAmount.setGravity(Gravity.CENTER);
                txtAmount.setTypeface(typeface);
                tr.addView(txtAmount, txtParam2);

                TextView txtAction = new TextView(getActivity());
                txtAction.setText(String.valueOf(resp.getTotal()));
                txtAction.setTextColor(Color.BLACK);
                txtAction.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtAction.setGravity(Gravity.CENTER);
                txtAction.setTypeface(typeface);


                //    tr.addView(txtAction, txtParam);

                ImageView imgDel = new ImageView(getActivity());
                imgDel.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.ic_del));
                ImageView imgEdit = new ImageView(getActivity());
                imgEdit.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.edit));
                ImageView imgAdd = new ImageView(getActivity());
                imgAdd.setImageDrawable(ContextCompat.getDrawable(getActivity(), R.drawable.plus_grey));
                //   tr.addView(imgDel, iconParam);
                tr.addView(imgEdit, iconParam);
                 tr.addView(imgAdd, iconParam);
                tr.setGravity(Gravity.CENTER_VERTICAL);
                TableRow trLine1 = new TableRow(getActivity());
                View v1 = new View(getActivity());
                v1.setBackgroundColor(ContextCompat.getColor(getContext(), R.color.gray));
                trLine1.addView(v1, lineParam);
                tblView.addView(tr);
                tblView.addView(trLine1);

                imgEdit.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        //  showEditChargesDialog();
                        PendingBillResponse.PendingDetails resp = list.get(index);
                        int chargeId = resp.getPatientChargeId();
                        String section = resp.getSection();
                        showAddChargesDialog("Edit", chargeId, section);
                    }
                });

                imgAdd.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        showAddChargesDialog("Add", 0, "");
                    }
                });
            }
        }
    }

    private void cashPayment(String date, String paymentMode) {
        OPHubRequests.CashBillPayReq request = new OPHubRequests.CashBillPayReq();
        request.setHospId(hospId);
        request.setPatientId(patientId);
        request.setPaymentDate(date);
        request.setPaymentMode(paymentMode);
        request.setReceivedByName(OPHubApplication.getStaffName());
        Log.i("mylog", "cashPayment request:" + new Gson().toJson(request));
        Call<OPHubResponse.UpdateApptStatusResponse> call = services.cashBillPayment(request);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {
            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {
                try {
                    Log.i("mylog", "cashPayment response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "cashPayment response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        String txnId = resp.getTxnId();
                        System.out.println("invoice print::" + txnId);
                        if (status != null && status.equalsIgnoreCase("success"))
                            showSuccessDialog(message, txnId, "Payment");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "cashPayment response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    public void showSuccessDialog(String msg, String txnId, String option) {
        dialogSuccess = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.activity_change_pwd_success, null);
        dialogSuccess.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogSuccess.getWindow().setGravity(Gravity.CENTER);
        TextView txtMsg = dialogSuccess.findViewById(R.id.txtSuccess);
        txtMsg.setText(msg);
        dialogSuccess.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogSuccess.getWindow().getAttributes());
        lp.width = dpToPx(600);
        lp.height = dpToPx(550);
        dialogSuccess.getWindow().setAttributes(lp);
        dialogSuccess.getWindow().setBackgroundDrawable(ContextCompat.getDrawable(getContext(), R.drawable.rounded_rectangle_white));
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    dialogSuccess.dismiss();
                    if (option.equalsIgnoreCase("Charges"))
                        getPendingBill(patientId);
                    else if (option.equalsIgnoreCase("Payment") && txnId != null)
                        getInvoiceData(txnId);
                } catch (Exception ex) {
                    Log.i("myLog", "exception ex:" + ex.toString());
                }
            }
        }, 3000);

    }

    public void showAddChargesDialog(String option, int chargeid, String section) {
        dialogAddCharges = new Dialog(getActivity());
        System.out.println("checkLogs"+section);
        if (option.equalsIgnoreCase("AddDropdown")){
            View view = getLayoutInflater().inflate(R.layout.dialog_add_charges_dropdown, null);
            dialogAddCharges.setContentView(view);

        }else {
            View view = getLayoutInflater().inflate(R.layout.dialog_add_charges, null);
            dialogAddCharges.setContentView(view);
        }
        spinopdAppointment = dialogAddCharges.findViewById(R.id.spinopdAppointment);
        dialogAddCharges.getWindow().setGravity(Gravity.CENTER);
        dialogAddCharges.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        dialogAddCharges.setCancelable(false);
        ImageView imgClose = dialogAddCharges.findViewById(R.id.imgClose);
        Button btnSave = dialogAddCharges.findViewById(R.id.btnSave);
        Button btnCancel = dialogAddCharges.findViewById(R.id.btnCancel);
        spinChargeType = dialogAddCharges.findViewById(R.id.spinChargeType);

        spinChargeCategory = dialogAddCharges.findViewById(R.id.spinChargeCategory);
        spinChargeName = dialogAddCharges.findViewById(R.id.spinChargeName);
        edtStdCharge = dialogAddCharges.findViewById(R.id.edtStdCharges);
        edtQty = dialogAddCharges.findViewById(R.id.edtQty);
        txtTax = dialogAddCharges.findViewById(R.id.txtTax);
        txtTotal = dialogAddCharges.findViewById(R.id.txtConsultantFee);
        txtTaxPercent = dialogAddCharges.findViewById(R.id.txtTaxpercent);
        txtNetAmt = dialogAddCharges.findViewById(R.id.txtNetAmt);
        TextView txtTitle = dialogAddCharges.findViewById(R.id.txtTitle);
        if (option.equalsIgnoreCase("Add"))
            txtTitle.setText(getString(R.string.add_Charges));
        else if (option.equalsIgnoreCase("Edit"))
            txtTitle.setText(getString(R.string.edit_Charges));
        if (section.equalsIgnoreCase("Appointment"))
            edtQty.setEnabled(false);
        else
            edtQty.setEnabled(true);
        edtQty.setFilters(new InputFilter[]{
                new InputFilter.LengthFilter(4),
                new InputFilterMinMax(1, 1000)
        });
        edtNotes = dialogAddCharges.findViewById(R.id.edtNotes);
        btnAdd = dialogAddCharges.findViewById(R.id.btnAdd);
        linearAddCharges = dialogAddCharges.findViewById(R.id.linearAdditionalCharges);
        txtnewAdditionalCharges = dialogAddCharges.findViewById(R.id.txtnewAdditionalCharges);
        txtRemove = dialogAddCharges.findViewById(R.id.txtRemove);
        edtDiscountRate = dialogAddCharges.findViewById(R.id.edtDiscountRate);
        edtDiscountPercent = dialogAddCharges.findViewById(R.id.edtDiscountPercent);
        edtAddiCharges = dialogAddCharges.findViewById(R.id.edtAmount);
        edtChargeType = dialogAddCharges.findViewById(R.id.edtChargeType);
        edtChargeCategory = dialogAddCharges.findViewById(R.id.edtChargeCategory);
        edtChargeName = dialogAddCharges.findViewById(R.id.edtChargeName);

        txtDiscount = dialogAddCharges.findViewById(R.id.txtDiscount);
        txtDiscountPercent = dialogAddCharges.findViewById(R.id.txtDiscountPercent);
        txtSubTotal = dialogAddCharges.findViewById(R.id.txtSubTotal);
        linearTxtAddiCharges = dialogAddCharges.findViewById(R.id.linearTxtAddiCharges);
        linearTxtNotes = dialogAddCharges.findViewById(R.id.linearTxtNotes);
        txtAddiCharges = dialogAddCharges.findViewById(R.id.txtAdditionalCharges);
        txtNotes = dialogAddCharges.findViewById(R.id.txtNotes);
        getOpdAppintmentDropdown(spinopdAppointment);
        getChargeType(spinChargeType);
        if (option.equalsIgnoreCase("Edit")) {
            edtQty.setEnabled(false);
            edtStdCharge.setEnabled(false);
            edtChargeName.setVisibility(View.VISIBLE);
            edtChargeType.setVisibility(View.VISIBLE);
            edtChargeCategory.setVisibility(View.VISIBLE);
            spinChargeCategory.setVisibility(GONE);
            spinChargeName.setVisibility(GONE);
            spinChargeType.setVisibility(GONE);
            getPatientChargeDetails(chargeid);
//            new Handler().postDelayed(new Runnable() {
//                @Override
//                public void run() {
//
//                }
//            }, 100);

        } else {
            edtStdCharge.setEnabled(false);
        }

        txtRemove.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isAdditCharges = false;

                // Hide UI elements
                linearAddCharges.setVisibility(View.INVISIBLE);
                txtnewAdditionalCharges.setVisibility(View.INVISIBLE);
                linearTxtAddiCharges.setVisibility(View.GONE);
                linearTxtNotes.setVisibility(View.GONE);
                txtRemove.setVisibility(View.GONE);
                btnAdd.setVisibility(View.VISIBLE);

                // Clear input fields
                edtAddiCharges.setText("");
                edtNotes.setText("");

                String stdChargeStr = edtStdCharge.getText().toString();
                String quantityStr = edtQty.getText().toString();

                int qty = 1;
                if (!quantityStr.isEmpty()) {
                    try {
                        qty = Integer.parseInt(quantityStr);
                    } catch (NumberFormatException e) {
                        qty = 1;
                        Log.e("Billing", "Invalid quantity format: " + quantityStr);
                    }
                }

                if (!stdChargeStr.isEmpty()) {
                    try {
                        double stdCharge = Double.parseDouble(stdChargeStr);
                        double discount = 0.0;
                        double additCharges = 0.0;

                        // Handle discount string safely
                        String discountStr = txtDiscount.getText().toString();
                        if (!discountStr.isEmpty()) {
                            String[] disArr = discountStr.trim().split(" ");
                            if (disArr.length > 2) {
                                try {
                                    discount = Double.parseDouble(disArr[2]);
                                } catch (NumberFormatException e) {
                                    discount = 0.0;
                                    Log.e("Billing", "Invalid discount format: " + disArr[2]);
                                }
                            } else {
                                Log.w("Billing", "Unexpected discount format: " + discountStr);
                            }
                        }

                        // Calculate subtotal
                        double charge = stdCharge * qty;
                        double subTotal = charge + additCharges - discount;
                        txtSubTotal.setText("\u20B9 " + df.format(subTotal));

                        // Calculate tax if applicable
                        if (taxPercent != null) {
                            try {
                                double taxVal = subTotal * Double.parseDouble(taxPercent) / 100;
                                Log.i("mylog", "taxVal: " + taxVal);
                                txtTax.setText("\u20B9 " + df.format(taxVal));
                            } catch (NumberFormatException e) {
                                Log.e("Billing", "Invalid taxPercent: " + taxPercent);
                                txtTax.setText("\u20B9 0.00");
                            }
                        }

                        // Calculate net amount
                        String taxStr = txtTax.getText().toString();
                        if (!taxStr.isEmpty()) {
                            String[] taxArr = taxStr.split(" ");
                            if (taxArr.length > 1) {
                                try {
                                    double tax = Double.parseDouble(taxArr[1]);
                                    double netAmt = subTotal + tax;
                                    txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                                } catch (NumberFormatException e) {
                                    Log.e("Billing", "Invalid tax amount: " + taxArr[1]);
                                    txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                                }
                            } else {
                                txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                                Log.w("Billing", "Unexpected tax format: " + taxStr);
                            }
                        } else {
                            txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                        }

                    } catch (NumberFormatException e) {
                        Log.e("Billing", "Invalid stdCharge format: " + stdChargeStr);
                    }
                }
            }
        });



        edtAddiCharges.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (isUpdating) return;
                isUpdating = true;

                String amount = edtAddiCharges.getText().toString();
                Log.i("myLog", "onEditorAction addit charges:  amount:" + amount);
                double additCharges = 0.0;
                if (!amount.isEmpty()) {
                    isAdditCharges = true;
                    linearTxtAddiCharges.setVisibility(View.VISIBLE);
                    additCharges = Double.parseDouble(amount);
                    txtAddiCharges.setText("\u20B9 " + additCharges);
                    String stdCharge = edtStdCharge.getText().toString();
                    String quantity = edtQty.getText().toString();
                    int qty = 1;
                    if (!quantity.isEmpty())
                        qty = Integer.parseInt(quantity);
                    if (stdCharge.length() > 0) {
                        String discountRate = edtDiscountRate.getText().toString();
                        String discountPercent = edtDiscountPercent.getText().toString();
                        double charge = Double.parseDouble(stdCharge) * qty;
                        double subTotal = 0.0;
                        double discount = 0.0;
                        if (!discountRate.isEmpty()) {
                            discount = Double.parseDouble(discountRate);
                            //  txtDiscount.setText(" - \u20B9 " + discount);
                            txtDiscount.setText(" ₹ " + df.format(discount));
                        }
                        if (!discountPercent.isEmpty()) {
                            txtDiscountPercent.setText(discountPercent + "%");
                            double percent = Double.parseDouble(discountPercent);
                            discount = charge * percent / 100;
                            //  txtDiscount.setText(" - \u20B9 " + discount);
                            txtDiscount.setText(" ₹ " + df.format(discount));
                        }
                        subTotal = charge + additCharges - discount;
                        txtSubTotal.setText("\u20B9 " + df.format(subTotal));
                        Log.i("myLog", "taxPercent:" + taxPercent);
                        Log.i("myLog", "subTotal:" + subTotal);
                        if (taxPercent != null) {
                            double taxCalc = subTotal * Double.parseDouble(taxPercent) / 100;
                            Log.i("mylog", "taxCalc1:" + taxCalc);
                            txtTax.setText("\u20B9 " + df.format(taxCalc));
                        }
                        String taxStr = txtTax.getText().toString();
                        if (!taxStr.isEmpty()) {
                            String taxArr[] = taxStr.split(" ");
                            double tax = Double.parseDouble(taxArr[1]);
                            double netAmt = subTotal + tax;
                            txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                        } else {
                            txtNetAmt.setText("\u20B9 " +df.format( subTotal));
                        }
                    }else {
                        txtAddiCharges.setText("-");
                    }
                }
                isUpdating = false;
            }
        });

        edtDiscountRate.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (isUpdating) return;
                isUpdating = true;
                String input = s.toString();
                if (!txtTotal.getText().toString().isEmpty()) {
                    String consultFeeArr[] = txtTotal.getText().toString().split(" ");
                    String consultFee = consultFeeArr[1];

                    Log.i("myLog", "consultFee:" + consultFee);
                    if (!input.isEmpty()) {
                        try {
                            double value = Double.parseDouble(input);
                            Log.i("myLog", "value:" + value);
                            double consultFees = Double.parseDouble(consultFee);
                            Log.i("myLog", "value:" + value + "   consultFees:" + consultFees);
                            if (value > consultFees) {
                                    Log.i("myLog", "inside if");
                                System.out.println("print discount rate3" +consultFees);
                                edtDiscountRate.setText(String.valueOf(consultFees));
                                edtDiscountRate.setSelection(edtDiscountRate.getText().length());
                            }
                        } catch (NumberFormatException e) {
                            // Handle invalid input
                            Log.i("myLog", "NumberFormatException if");
                            // edtDiscountRate.setText("");
                        }
                    }
                    String discountRate = edtDiscountRate.getText().toString();
                    Log.i("myLog", "onEditorAction:  discountRate:" + discountRate);

                    double discount = 0.0;
                    double additCharges = 0.0;
                    int qty = 1;
                    String quantity = edtQty.getText().toString();
                    if (!quantity.isEmpty())
                        qty = Integer.parseInt(quantity);

                    String stdChargeStr = edtStdCharge.getText().toString();

                    Log.i("myLog", "onEditorAction stdChargeStr" + stdChargeStr);

                    if (!stdChargeStr.isEmpty()) {
                        if (isAdditCharges) {
                            String amount = edtAddiCharges.getText().toString();
                            Log.i("myLog", "onEditorAction discunt rate:  amount:" + amount);
                            if (!amount.isEmpty())
                                additCharges = Double.parseDouble(amount);
                            Log.i("myLog", " isAdditCharges  additCharges:" + additCharges);
                        }

                        double charge = Double.parseDouble(stdChargeStr) * qty;
                        //  txtTotal.setText("\u20B9 " + charge);
                        txtTotal.setText("₹ " + df.format(charge));
                        System.out.println("printDisc_Rate"+discountRate);
                        if (!discountRate.isEmpty()) {
                            discount = Double.parseDouble(discountRate);
                            double percent = 100 * discount / charge;
                            //   percent = Math.round(percent * 10) / 10.0;
                            String percentStr = String.format("%.2f", percent);
                            edtDiscountPercent.setText(percentStr);
                            txtDiscountPercent.setText(percentStr + "%");
                        } else {
                            edtDiscountPercent.setText("");
                           // txtDiscountPercent.setText("0.0" + "%");
                            txtDiscountPercent.setText("");
                        }
                        //    txtDiscount.setText(" ₹ " + discount);
                        Log.i("myLog", "discount:" + discount);
                        txtDiscount.setText("₹ " + df.format(discount));
                        Log.i("myLog", "charge:" + charge + "   additCharges:" + additCharges + "  discount:" + discount);
                        double subTotal = charge + additCharges - discount;
                        Log.i("myLog", "subTotal:" + subTotal);
                        txtSubTotal.setText("₹ " + df.format(subTotal));
                        Log.i("myLog", "taxPercent11:" + taxPercent);
                        if (taxPercent != null) {
                            double taxCalc = subTotal * Double.parseDouble(taxPercent) / 100;
                            Log.i("myLog", "taxCalc2:" + taxCalc);
                            txtTax.setText("₹ " + df.format(taxCalc));
                        }
                        String taxStr = txtTax.getText().toString();
                        if (!taxStr.isEmpty()) {
                            String taxArr[] = taxStr.split(" ");
                            double tax = Double.parseDouble(taxArr[1]);
                            double netAmt = subTotal + tax;
                            txtNetAmt.setText("₹ " + String.format("%.2f", netAmt));
                        } else {
                            txtNetAmt.setText("₹ " + df.format(subTotal));
                        }
                    }
                    isUpdating = false;
                }
            }
        });

        edtDiscountPercent.addTextChangedListener(new TextWatcher() {
            private String current = "";

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                if (isUpdating) return;
                isUpdating = true;
                String input = s.toString();
                if (!input.isEmpty()) {
                    try {
                        int value = Integer.parseInt(input);
                        if (value > 100) {
                            edtDiscountPercent.setText("100");
                            edtDiscountPercent.setSelection(edtDiscountPercent.getText().length());
                        }
                    } catch (NumberFormatException e) {
                        // Handle invalid input
                       // edtDiscountPercent.setText("");
                    }
                }
              /*  edtDiscountPercent.removeTextChangedListener(this);

                String input = s.toString().replace("%", "");
                if (!input.equals("")) {
                    current = input + "%";
                    edtDiscountPercent.setText(current);
                    edtDiscountPercent.setSelection(input.length()); // Keep cursor before %
                }

                edtDiscountPercent.addTextChangedListener(this);
*/
                String discountPercent = edtDiscountPercent.getText().toString();

                if (!discountPercent.isEmpty()) {

                    txtDiscountPercent.setText(discountPercent + "%");
                    //   discountPercent = discountPercent.replace("%", "");
                } else {
                   // edtDiscountRate.setText("");
                    txtDiscountPercent.setText("");
                }
                //  Log.i("myLog", " edtDiscountPercent onEditorAction:  edtDiscountPercent:" + discountPercent);
                String stdChargeStr = edtStdCharge.getText().toString();
                double percent = 0.0;
                double discount = 0.0;
                double subTotal = 0.0;
                double additCharges = 0.0;
                int qty = 1;
                String quantity = edtQty.getText().toString();
                if (!quantity.isEmpty())
                    qty = Integer.parseInt(quantity);
                Log.i("myLog", "edtDiscountPercent afterTextChanged111111111");

                if (!stdChargeStr.isEmpty()) {
                    double charge = Double.parseDouble(stdChargeStr) * qty;
                    if (!discountPercent.isEmpty()) {
                        percent = Double.parseDouble(discountPercent);
                        discount = charge * percent / 100;
                    }
                    //   txtTotal.setText("\u20B9 " + charge);
                    txtTotal.setText("₹ " + df.format(charge));
                    Log.i("myLog", "edtDiscountPercent afterTextChanged2222222");
                    System.out.println("print discount rate2" +discount);
                    edtDiscountRate.setText(String.valueOf(discount));
                    //  txtDiscount.setText(" - \u20B9 " + discount);
                    txtDiscount.setText("₹ " + df.format(discount));
                    if (isAdditCharges) {
                        String amount = edtAddiCharges.getText().toString();
                        //  Log.i("myLog", "onEditorAction:  amount:" + amount);
                        if (!amount.isEmpty())
                            additCharges = Double.parseDouble(amount);

                    }
                    subTotal = charge + additCharges - discount;
                    txtSubTotal.setText("\u20B9 " + df.format(subTotal));
                    if (taxPercent != null) {
                        double taxCalc = subTotal * Double.parseDouble(taxPercent) / 100;
                        Log.i("myLog", "taxCalc3:" + taxCalc);
                        txtTax.setText("\u20B9 " + df.format(taxCalc));
                    }
                    String taxStr = txtTax.getText().toString();
                    if (!taxStr.isEmpty()) {
                        String taxArr[] = taxStr.split(" ");
                        double tax = Double.parseDouble(taxArr[1]);
                        double netAmt = subTotal + tax;
                        txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                    } else {
                        txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                    }
                }
                isUpdating = false;
            }
        });

        edtNotes.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                Log.i("myLog", "edtAddiCharges onEditorAction:");
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    String notes = edtNotes.getText().toString();
                    Log.i("myLog", "onEditorAction:  notes:" + notes);
                    if (!notes.isEmpty()) {
                        linearTxtNotes.setVisibility(View.VISIBLE);
                        txtNotes.setText(notes);
                    }
                }
                return false;
            }
        });

        edtDiscountPercent.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                Log.i("myLog", "edtDiscountRate onEditorAction:");
                if (actionId == EditorInfo.IME_ACTION_DONE) {

                }
                return false;
            }
        });

        edtStdCharge.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                int qty = 1;
                String stdCharge = edtStdCharge.getText().toString();
                String quantity = edtQty.getText().toString();
                if (!quantity.isEmpty())
                    qty = Integer.parseInt(quantity);
                if (stdCharge.length() > 0) {
                    String discountRate = edtDiscountRate.getText().toString();
                    String discountPercent = edtDiscountPercent.getText().toString();
                    double additCharges = 0.0;
                    double subTotal = 0.0;
                    double charge = Double.parseDouble(stdCharge) * qty;
                    double discount = 0.0;
                    double percent = 0.0;
                    //     txtTotal.setText("\u20B9 " + charge);
                    txtTotal.setText("₹ " + df.format(charge));
                    if (isAdditCharges) {
                        String amount = edtAddiCharges.getText().toString();
                        Log.i("myLog", "onEditorAction std charge:  amount:" + amount);
                        if (!amount.isEmpty())
                            additCharges = Double.parseDouble(amount);
                    }
                    if (!discountRate.isEmpty()) {
                        discount = Double.parseDouble(discountRate);
                        //  txtDiscount.setText(" - \u20B9 " + discount);
                        txtDiscount.setText("₹ " + df.format(discount));
                    } else {
                        //  txtDiscount.setText(" - \u20B9 " + 0.0);
                        txtDiscount.setText(" ₹ " + df.format(0.0));
                    }
                    if (!discountPercent.isEmpty()) {
                        txtDiscountPercent.setText(discountPercent + "%");
                        percent = Double.parseDouble(discountPercent);
                        discount = charge * percent / 100;
                        //  txtDiscount.setText(" - \u20B9 " + discount);
                        txtDiscount.setText(" ₹ " + df.format(discount));
                    } else {
                        //  txtDiscount.setText(" - \u20B9 " + 0.0);
                        txtDiscount.setText(" ₹ " + df.format(0.0));
                    }
                    subTotal = charge + additCharges - discount;
                    txtSubTotal.setText("\u20B9 " + df.format(subTotal));
                    if (taxPercent != null) {
                        double taxCalc = subTotal * Double.parseDouble(taxPercent) / 100;
                        Log.i("myLog", "taxCalc4:" + taxCalc);
                        txtTax.setText("\u20B9 " + df.format(taxCalc));
                    }
                    String taxStr = txtTax.getText().toString();
                    if (!taxStr.isEmpty()) {
                        String taxArr[] = taxStr.split(" ");
                        double tax = Double.parseDouble(taxArr[1]);
                        double netAmt = subTotal + tax;
                        txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                    } else {
                        txtNetAmt.setText("\u20B9 " +df.format( subTotal));
                    }
                }
            }
        });
        edtQty.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable s) {
                int qty = 1;
                String stdCharge = edtStdCharge.getText().toString();
                String quantity = edtQty.getText().toString();
                if (!quantity.isEmpty())
                    qty = Integer.parseInt(quantity);
                if (!stdCharge.isEmpty()) {
                    String discountRate = edtDiscountRate.getText().toString();
                    String discountPercent = edtDiscountPercent.getText().toString();
                    double additCharges = 0.0;
                    double subTotal = 0.0;
                    double charge = Double.parseDouble(stdCharge) * qty;
                    double discount = 0.0;
                    double percent = 0.0;
                    //  txtTotal.setText("\u20B9 " + charge);
                    txtTotal.setText("₹ " + df.format(charge));
                    if (isAdditCharges) {
                        String amount = edtAddiCharges.getText().toString();
                        Log.i("myLog", "onEditorAction qty:  amount:" + amount);
                        if (!amount.isEmpty())
                            additCharges = Double.parseDouble(amount);
                    }
                    if (!discountRate.isEmpty()) {
                        discount = Double.parseDouble(discountRate);
                        txtDiscount.setText(" - \u20B9 " + df.format(discount));
                    } else {
                        txtDiscount.setText(" - \u20B9 " + df.format(0.0));
                    }
                    if (!discountPercent.isEmpty()) {
                        txtDiscountPercent.setText(discountPercent + "%");
                        percent = Double.parseDouble(discountPercent);
                        discount = charge * percent / 100;
                        txtDiscount.setText(" - \u20B9 " + df.format(discount));
                    } else {
                        txtDiscount.setText(" - \u20B9 " +df.format( 0.0));
                    }
                    subTotal = charge + additCharges - discount;
                    txtSubTotal.setText("\u20B9 " + df.format(subTotal));
                    if (taxPercent != null) {
                        double taxCalc = subTotal * Double.parseDouble(taxPercent) / 100;
                        Log.i("myLog", "taxCalc5:" + taxCalc);
                        txtTax.setText("\u20B9 " + df.format(taxCalc));
                    }
                    String taxStr = txtTax.getText().toString();
                    if (!taxStr.isEmpty()) {
                        String taxArr[] = taxStr.split(" ");
                        double tax = Double.parseDouble(taxArr[1]);
                        double netAmt = subTotal + tax;
                        txtNetAmt.setText("\u20B9 " + String.format("%.2f", netAmt));
                    } else {
                        txtNetAmt.setText("\u20B9 " + df.format(subTotal));
                    }
                }
            }
        });


        btnAdd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isAdditCharges = true;
                linearAddCharges.setVisibility(View.VISIBLE);
                txtnewAdditionalCharges.setVisibility(View.VISIBLE);
                txtRemove.setVisibility(View.VISIBLE);
                btnAdd.setVisibility(GONE);
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogAddCharges.dismiss();
            }
        });

        btnSave.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("myLog", "btn save clickoption"+option);
                if (option.equalsIgnoreCase("Add")||option.equalsIgnoreCase("AddDropdown")) {
                    String chargeType = spinChargeType.getSelectedItem().toString();
                    if (chargeType.equalsIgnoreCase("Select charge type")) {
                        Toast.makeText(getActivity(), "Please select charge type", Toast.LENGTH_SHORT).show();
                        return;
                    }
                    String chargeCat = spinChargeCategory.getSelectedItem().toString();
                    if (chargeCat.equalsIgnoreCase("Select charge category")) {
                        Toast.makeText(getActivity(), "Please select charge category", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    String chargeName = spinChargeName.getSelectedItem().toString();
                    if (chargeName.equalsIgnoreCase("Select charge name")) {
                        Toast.makeText(getActivity(), "Please select charge name", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    chargeIndex = spinChargeName.getSelectedItemPosition();
                    chargeId = chargeNameIdAL.get(chargeIndex);
                    stdCharge = chargeNameStdChargeAL.get(chargeIndex);
                    taxPercent = chargeNameTaxPercentAL.get(chargeIndex);
                }
                Log.i("myLog", "after all validation");
                DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date date = new Date();
                String currDate = dateFormat.format(date);


                String amount = txtNetAmt.getText().toString();
                String[] amt = amount.split(" ");
                amount = amt[1];
                String notes = edtNotes.getText().toString();
                String qty = edtQty.getText().toString();
                String discountPercentStr = edtDiscountPercent.getText().toString();
                String discountStr = edtDiscountRate.getText().toString();
                Log.i("myLog", "b4 calling add charges");
                double additCharges = 0.0;
                if (isAdditCharges) {
                    String additionalCharge = edtAddiCharges.getText().toString();
                    if (!additionalCharge.isEmpty()) {
                        additCharges = Double.parseDouble(additionalCharge);
                    }
                }
                double discount = 0.0;
                if (!discountStr.isEmpty()) {
                    discount = Double.parseDouble(discountStr);
                }
                double discountpercent = 0.0;
                if (!discountPercentStr.isEmpty()) {
                    discountpercent = Double.parseDouble(discountPercentStr);
                }
                if (option.equalsIgnoreCase("Add")||option.equalsIgnoreCase("AddDropdown")) {
                    if (qty.isEmpty()) {
                        qty = "0";
                    }
                    addCharges(option,currDate, Integer.parseInt(qty), chargeId, stdCharge, taxPercent, Double.parseDouble(amount), notes, additCharges, discountpercent, discount);
                } else if (option.equalsIgnoreCase("Edit"))
                    updateCharges(option,Integer.parseInt(qty), chargeId, stdCharge, taxPercent, Double.parseDouble(amount), notes, additCharges, discountpercent, discount);

            }
        });
        spinopdAppointment.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position,
                                       long id) {
                Log.i("myLog", "spin type:  position:" + position);
                String selItem = parent.getSelectedItem().toString();
                Log.i("myLog", "selItem :" + selItem);
                if (!selItem.equalsIgnoreCase("Select Opd/Appt No")) {
                    OpdApptId = opdAppts.get(position);
                    Log.i("myLog", "OpdApptId::" + OpdApptId);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
        spinChargeType.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position,
                                       long id) {
                Log.i("myLog", "spin type:  position:" + position);
                String selItem = parent.getSelectedItem().toString();
                Log.i("myLog", "selItem :" + selItem);
                if (!selItem.equalsIgnoreCase("Select Charge Type")) {
                    int typeId = chargeTypeIdAL.get(position);
                    Log.i("myLog", "typeId::" + typeId);
                    getChargeCategory(spinChargeCategory, typeId);
                    getChargeName(spinChargeName, 0);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        spinChargeCategory.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position,
                                       long id) {
                Log.i("myLog", "spinChargeCategory position:" + position);
                String selItem = parent.getSelectedItem().toString();
                if (!selItem.equalsIgnoreCase("Select charge category")) {
                    int catId = chargeCategoryIdAL.get(position);
                    Log.i("myLog", "catId::" + catId);
                    getChargeName(spinChargeName, catId);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        spinChargeName.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position,
                                       long id) {
                Log.i("myLog", "spinChargeName position:" + position);
                String selItem = parent.getSelectedItem().toString();
                if (!selItem.equalsIgnoreCase("Select charge name")) {
                    edtQty.setText("1");
                    txtNetAmt.setText("\u20B9 " + chargeNameNetAmtAL.get(position));
                    txtTax.setText("\u20B9 " + df.format(chargeNameTaxAmtAL.get(position)));
                    taxPercent = chargeNameTaxPercentAL.get(position);
                    txtTaxPercent.setText(chargeNameTaxPercentAL.get(position) + "%");
                    int stdCharge = chargeNameStdChargeAL.get(position);
                    edtStdCharge.setText(String.valueOf(stdCharge));
                    double tot = Double.parseDouble(edtStdCharge.getText().toString());
                    //   txtTotal.setText("\u20B9 " + tot);
                    txtTotal.setText("₹ " + df.format(tot));
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialogAddCharges.dismiss();
            }
        });
        dialogAddCharges.show();
        WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
        lp.copyFrom(dialogAddCharges.getWindow().getAttributes());
        lp.width = dpToPx(950);
        lp.height = dpToPx(700);
        dialogAddCharges.getWindow().setAttributes(lp);
    }

    private void getOpdAppintmentDropdown(Spinner spinopdAppointment) {
        if (getActivity() == null) return;
        services.getDropDownOpd(patientId, hospId).enqueue(new Callback<OpdDropdownRes>() {
            @Override
            public void onResponse(Call<OpdDropdownRes> call, Response<OpdDropdownRes> response) {
                try {
                    if (!isAdded() || response.body() == null) return;

                    List<OpdDropdownRes.OpdAppintmentDropdownResp> list = response.body().getData();
                    opdAppts = new ArrayList<>();
                    for (OpdDropdownRes.OpdAppintmentDropdownResp item : list) {
                        if (item != null && item.getPendingId() != null) {
                            opdAppts.add(item.getPendingId());
                        }
                    }
                    OPHubUtils.addProdTypeSpinner(getActivity(), opdAppts, spinopdAppointment, "Select SectionID");
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<OpdDropdownRes> call, Throwable t) {
                if (getActivity() != null) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }
        });
    }



    private void getChargeType(Spinner spinnerCharge) {
        Log.i("myLog", "getChargeType");
        services.getChargeType(hospId).enqueue(new Callback<List<OPHubResponse.ChargeTypeResp>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.ChargeTypeResp>> call, Response<List<OPHubResponse.ChargeTypeResp>> response) {
                try {
                    Log.i("myLog", "getChargeType onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.ChargeTypeResp> list = response.body();
                        int size = list.size();
                        chargeTypeAL = new ArrayList<>();
                        chargeTypeIdAL = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            OPHubResponse.ChargeTypeResp resp = list.get(start);
                            chargeTypeAL.add(resp.getChargeType());
                            chargeTypeIdAL.add(resp.getId());
                        }
                        Log.i("myLog", "getChargeType onResponse:");
                        OPHubUtils.addProdTypeSpinner(getActivity(), chargeTypeAL, spinnerCharge, "Select Charge Type");
                        Log.i("myLog", "getChargeType onResponse:::::::::::");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.ChargeTypeResp>> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void getChargeCategory(Spinner spinnerCharge, int chargeTypeId) {
        Log.i("myLog", "getChargeCategory");
        services.getChargeCategory(hospId, chargeTypeId).enqueue(new Callback<List<OPHubResponse.ChargeCateoryResp>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.ChargeCateoryResp>> call, Response<List<OPHubResponse.ChargeCateoryResp>> response) {
                try {
                    Log.i("myLog", "getChargeCategory onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.ChargeCateoryResp> list = response.body();
                        int size = list.size();
                        chargeCategoryAL = new ArrayList<>();
                        chargeCategoryIdAL = new ArrayList<>();


                        for (int start = 0; start < size; start++) {
                            OPHubResponse.ChargeCateoryResp resp = list.get(start);
                            chargeCategoryAL.add(resp.getName());
                            chargeCategoryIdAL.add(resp.getId());
                        }
                        OPHubUtils.addProdTypeSpinner(getActivity(), chargeCategoryAL, spinnerCharge, "Select Charge Category");
                        Log.i("myLog", "getChargeCategory onResponse:::::::::::");
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.ChargeCateoryResp>> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void getChargeName(Spinner spinnerCharge, int catId) {
        Log.i("myLog", "getChargeName");
        services.getChargeName(hospId, catId).enqueue(new Callback<List<OPHubResponse.ChargeNameResp>>() {

            @Override
            public void onResponse(Call<List<OPHubResponse.ChargeNameResp>> call, Response<List<OPHubResponse.ChargeNameResp>> response) {
                try {
                    Log.i("myLog", "getChargeName onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        List<OPHubResponse.ChargeNameResp> list = response.body();
                        int size = list.size();
                        chargeNameAL = new ArrayList<>();
                        chargeNameIdAL = new ArrayList<>();
                        chargeNameStdChargeAL = new ArrayList<>();
                        chargeNameTaxAmtAL = new ArrayList<>();
                        chargeNameTaxPercentAL = new ArrayList<>();
                        chargeNameNetAmtAL = new ArrayList<>();
                        for (int start = 0; start < size; start++) {
                            OPHubResponse.ChargeNameResp resp = list.get(start);
                            chargeNameAL.add(resp.getName());
                            chargeNameIdAL.add(resp.getId());
                            chargeNameStdChargeAL.add(resp.getStandardCharge());
                            chargeNameTaxAmtAL.add(resp.getTaxAmount());
                            chargeNameTaxPercentAL.add(resp.getTaxPercentage());
                            chargeNameNetAmtAL.add(resp.getTotalAmount());
                        }
                        OPHubUtils.addProdTypeSpinner(getActivity(), chargeNameAL, spinnerCharge, "Select Charge Name");
                        Log.i("myLog", "getChargeName onResponse:::::::::::");
                    }
                } catch (Exception e) {

                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<List<OPHubResponse.ChargeNameResp>> call, Throwable t) {
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void addCharges(String option,String date, int qty, int chargeId, int stdCharge, String taxPercent,
                            double amt, String notes, double additionalCharge, double discountPercent, double discountAmt) {

        Log.d("optionss", "addCharges: "+option);
        OPHubRequests.AddChargesReq request = new OPHubRequests.AddChargesReq();
        request.setHospital_id(hospId);
        request.setPatient_id(patientId);
        request.setDate(date);
        request.setQty(qty);
        request.setCharge_id(chargeId);
        request.setStandard_charge(stdCharge);
        request.setTax(taxPercent);
        request.setAmount(amt);
        request.setTotal(amt);
        request.setAdditional_charge_note(notes);
        request.setDiscount_amount(discountAmt);
        request.setDiscount_percentage(discountPercent);
        request.setAdditional_charge(additionalCharge);
            request.setSectionID(OpdApptId);
        Log.i("mylog", "addCharges request:" + new Gson().toJson(request));
        Call<OPHubResponse.UpdateApptStatusResponse> call = services.addV2Charges(request);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {

                try {
                    Log.i("mylog", "addCharges response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "addCharges response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        if (status != null && status.equalsIgnoreCase("success")) {
                            if (dialogAddCharges.isShowing())
                                dialogAddCharges.dismiss();
                            showSuccessDialog(message, null, "Charges");
                        } else {
                            OPHubUtils.showErrorDialog(getActivity(), message);
                        }
                    }else {
                        OPHubUtils.showUnknownErrorDialog(getActivity());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }

            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "addCharges response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

    }

    private void upiPayment() {
        Log.i("mylog", "upiPayment");
        JSONObject obj1 = new JSONObject();
        try {
            obj1.put("amount", String.valueOf(totDueAmt));
            obj1.put("hospital_id", hospId);
            obj1.put("patient_email", patientDet.getEmail());
            obj1.put("patient_mobile", patientDet.getMobileno());
            obj1.put("payment_mode", "UPI");
            obj1.put("transaction_type", "DIRECT");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        JsonParser jsonParser1 = new JsonParser();
        JsonObject jsonObject1 = (JsonObject) jsonParser1.parse(obj1.toString());

        DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        String dateStr = dateFormat.format(date);

        JSONObject obj2 = new JSONObject();
        try {
            obj2.put("patient_id", patientId);
            obj2.put("Hospital_id", hospId);
            obj2.put("payment_date", dateStr);
            obj2.put("payment_mode", "UPI");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        JsonParser jsonParser2 = new JsonParser();
        JsonObject jsonObject2 = (JsonObject) jsonParser2.parse(obj2.toString());
        JSONObject obj = new JSONObject();
        try {
            obj.put("api", BuildConfig.BASE_URL + "billing/makePayment");
            obj.put("method", "post");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        JsonParser jsonParser = new JsonParser();
        JsonObject jsonObject = (JsonObject) jsonParser.parse(obj.toString());
        JsonArray arr = new JsonArray();
        arr.add(jsonObject1);
        arr.add(jsonObject2);
        arr.add(jsonObject);
        Log.i("mylog", "upiPayment request:" + new Gson().toJson(arr));
        Call<BookAppointmentOnlineRes> call = fileServices.bookAppointmentOnline(arr, "OP_HUB");
        call.enqueue(new Callback<BookAppointmentOnlineRes>() {

            @Override
            public void onResponse(Call<BookAppointmentOnlineRes> call, Response<BookAppointmentOnlineRes> response) {
                Log.i("mylog", "upiPayment response:" + new Gson().toJson(response.body()));
                if (response.body() != null) {
                    Log.i("myLog", "upiPayment response isSuccess:" + response.body().toString());
                    BookAppointmentOnlineRes resp = response.body();
                    String merchantId = resp.getMerchantId();
                    String reqData = resp.getReqData();
                    String transNo = resp.getTransactionNumber();
                    Log.i("myLog", "upiPayment merchantId:" + merchantId);
                    Log.i("myLog", "upiPayment reqData:" + reqData);
                    Log.i("myLog", "upiPayment transNo:" + transNo);

                    relContents.setVisibility(GONE);
                    webview.setVisibility(View.VISIBLE);
                    webview.getSettings().setJavaScriptEnabled(true);
                    webview.addJavascriptInterface(new JavaScriptInterface(getActivity()), "Android");
                    if (merchantId != null && reqData != null) {
                        InputStream is = null;
                        try {
                            is = getActivity().getAssets().open("upi.html");
                            int size = is.available();

                            // Read the entire asset into a local byte buffer.
                            byte[] buffer = new byte[size];
                            is.read(buffer);
                            is.close();

                            String str = new String(buffer);
                            str = str.replace("M00", merchantId);
                            str = str.replace("android", reqData);
                            Log.i("myLog", "upiPayment htmlContent strstrstrstrstr after:" + str);
                            webview.loadDataWithBaseURL("file:///android_asset/upi.html", str, "text/html", "UTF-8", null);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }
                } else {
                    OPHubUtils.showErrorDialog(getActivity(), response.message());
                }
            }

            @Override
            public void onFailure(Call<BookAppointmentOnlineRes> call, Throwable t) {
                Log.i("myLog", "upiPayment response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }

    private void getPatientChargeDetails(int chargeid) {
        Log.i("myLog", "getPatientChargeDetails");
        services.getPatientChargeDetails(hospId, chargeid).enqueue(new Callback<GetPatientChargeDetResponse>() {
            @Override
            public void onResponse(Call<GetPatientChargeDetResponse> call, Response<GetPatientChargeDetResponse> response) {
                try {
                    Log.i("myLog", "getPatientChargeDetails onResponse:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        GetPatientChargeDetResponse resp = response.body();
                        String status = resp.getStatus();
                        if (status.equalsIgnoreCase("success")) {
                            GetPatientChargeDetResponse.Details details = resp.getDetails();
                            if (details != null) {
                                double additCharge = details.getAdditional_charge();
                                Log.i("myLog", "additCharge:" + additCharge);
                                stdCharge = details.getStandard_charge();
                                double discount = details.getDiscount_amount();
                                System.out.println("checkDisc"+discount);
                                double discountPercent = details.getDiscount_percentage();
                                chargeId = details.getChargeId();
                                patientChargeId = details.getPatientCharge_id();
                                int chargeTypeId = details.getChargeTypeId();
                                int chargeCatId = details.getChargeCategoryId();
                                String chargeName = details.getChargeName();
                                String chargeType = details.getChargeTypeName();
                                String chargeCategory = details.getChargeCategoryName();
                                int qty = details.getQty();
                                double taxAmt = details.getTaxAmount();
                                int taxPer = details.getTax();
                                taxPercent = String.valueOf(taxPer);

                                String notes = details.getAdditional_charge_note();
                                Log.i("myLog", "additChargeadditCharge:" + additCharge);
                                if (additCharge != 0.0) {
                                    linearAddCharges.setVisibility(View.VISIBLE);
                                    txtnewAdditionalCharges.setVisibility(View.VISIBLE);
                                    linearTxtAddiCharges.setVisibility(View.VISIBLE);
                                    linearTxtNotes.setVisibility(View.VISIBLE);
                                    btnAdd.setVisibility(GONE);
                                    txtRemove.setVisibility(View.VISIBLE);
                                    edtAddiCharges.setText(String.valueOf(additCharge));
                                    txtAddiCharges.setText(String.valueOf(additCharge));
                                    txtNotes.setText(notes);
                                    edtNotes.setText(notes);
                                }
                                double charge = Double.parseDouble(String.valueOf(stdCharge)) * qty;
                                //  txtTotal.setText("\u20B9 " + stdCharge);
                                txtTotal.setText("₹ " + df.format(charge));
                                edtQty.setText(String.valueOf(qty));
                                if (discount != 0.0)
                                    System.out.println("print discount rate1" +discount);
                                    edtDiscountRate.setText(String.valueOf(discount));
                                if (discountPercent != 0 ) {
                                    edtDiscountPercent.setText(String.valueOf(discountPercent));
                                    txtDiscountPercent.setText(discountPercent + "%");
                                }
                                txtDiscount.setText(" - \u20B9 " + df.format(discount));
                                txtTax.setText("\u20B9 " +df.format( taxAmt));
                                Log.i("myLog", "taxAmttaxAmttaxAmt:" + taxAmt);
                                if (taxPer != 0){
                                    txtTaxPercent.setText(taxPer + "%");
                                }

                                edtStdCharge.setText(String.valueOf(stdCharge));

                                edtChargeType.setText(chargeType);
                                edtChargeCategory.setText(chargeCategory);
                                edtChargeName.setText(chargeName);

                            }
                        }

                    } else {
                        // OPHubUtils.showErrorDialog(getActivity(), response.message());
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }
            }

            @Override
            public void onFailure(Call<GetPatientChargeDetResponse> call, Throwable t) {
                Log.i("myLog", "getPendingBill failure:" + t.getMessage());
                //   OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });
    }


    private void updateCharges(String option, int qty, int chargeId, int stdCharge, String taxPercent,
                               double amt, String notes, double additionalCharge, double discountPercent, double discountAmt) {
        OPHubRequests.UpdateChargesReq request = new OPHubRequests.UpdateChargesReq();
        request.setHospital_id(hospId);
        request.setQty(qty);
        request.setCharge_id(chargeId);
        request.setStandard_charge(stdCharge);
        request.setTax(taxPercent);
        request.setAmount(amt);
        request.setTotal(amt);
        request.setAdditional_charge_note(notes);
        request.setDiscount_amount(discountAmt);
        request.setDiscount_percentage(discountPercent);
        request.setAdditional_charge(additionalCharge);
        Log.i("mylog", "updateCharges request:" + new Gson().toJson(request));
        Call<OPHubResponse.UpdateApptStatusResponse> call = services.updatePatientChargeDet(patientChargeId, request);
        call.enqueue(new Callback<OPHubResponse.UpdateApptStatusResponse>() {

            @Override
            public void onResponse(Call<OPHubResponse.UpdateApptStatusResponse> call, Response<OPHubResponse.UpdateApptStatusResponse> response) {

                try {
                    Log.i("mylog", "updateCharges response:" + new Gson().toJson(response.body()));
                    if (response.body() != null) {
                        Log.i("myLog", "updateCharges response isSuccess:" + response.body().toString());
                        OPHubResponse.UpdateApptStatusResponse resp = response.body();
                        String message = resp.getMessage();
                        String status = resp.getStatus();
                        if (status != null && status.equalsIgnoreCase("success")) {
                            if (dialogAddCharges.isShowing())
                                dialogAddCharges.dismiss();
                            showSuccessDialog(message, null, "Charges");
                        } else {
                            // OPHubUtils.showErrorDialog(getActivity(), message);
                        }
                    }
                } catch (Exception e) {
                    OPHubUtils.showUnknownErrorDialog(getActivity());
                }

            }

            @Override
            public void onFailure(Call<OPHubResponse.UpdateApptStatusResponse> call, Throwable t) {
                Log.i("myLog", "addCharges response failure:" + t.toString());
                OPHubUtils.showUnknownErrorDialog(getActivity());
            }
        });

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

    public void showInvoiceDialog(GetInvoiceDataResponse resp, String txnId) {
        dialogInvoice = new Dialog(getActivity());
        View view = getLayoutInflater().inflate(R.layout.dialog_invoice, null);
        dialogInvoice.setContentView(view);
        //   dialogFilter.getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
        dialogInvoice.getWindow().setGravity(Gravity.CENTER);
        dialogInvoice.setCancelable(false); // Disable outside clicks
        dialogInvoice.setCanceledOnTouchOutside(false);

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
        txtInvoiceno.setText(txnId);
        txtAddress.setText(patientDetails.getAddress());
        //  txtDate.setText(date);
        txtMobile.setText(patientDetails.getMobileno());
        txtName.setText(patientDetails.getPatient_name());

        showInvoiceTable(resp);
        if (mIminPrintUtils == null) {
            mIminPrintUtils = IminPrintUtils.getInstance(getActivity());
        }
        mIminPrintUtils.resetDevice();
        imgClose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogInvoice.dismiss();
                gotoBillingMenu();
            }
        });
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialogInvoice.dismiss();
                gotoBillingMenu();
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
                gotoBillingMenu();
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
                txtPrice.setText("\u20B9 " + charge);
                txtPrice.setTypeface(typeface);
                txtPrice.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtPrice.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtPrice.setGravity(Gravity.CENTER);
                trow.addView(txtPrice, invoiceTxtParam);

                double discountAmt = invoiceData.getDiscount_amount();
                TextView txtDiscount = new TextView(getActivity());
                txtDiscount.setText("\u20B9 " + discountAmt);
                txtDiscount.setTypeface(typeface);
                txtDiscount.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtDiscount.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtDiscount.setGravity(Gravity.CENTER);
                trow.addView(txtDiscount, invoiceTxtParam);

                double additionalAmt = invoiceData.getAdditional_charge();
                TextView txtAdditional = new TextView(getActivity());
                txtAdditional.setText("\u20B9 " + additionalAmt);
                txtAdditional.setTypeface(typeface);
                txtAdditional.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtAdditional.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtAdditional.setGravity(Gravity.CENTER);
                trow.addView(txtAdditional, invoiceTxtParam);

                double tax = invoiceData.getTaxAmount();
                TextView txtTaxVal = new TextView(getActivity());
                txtTaxVal.setText("\u20B9 " + tax);
                txtTaxVal.setTypeface(typeface);
                txtTaxVal.setTextColor(ContextCompat.getColor(context, R.color.billing_text));
                txtTaxVal.setTextSize(TypedValue.COMPLEX_UNIT_SP, textSize);
                txtTaxVal.setGravity(Gravity.CENTER);
                trow.addView(txtTaxVal, invoiceTxtParam);


                double amount = invoiceData.getTotal();
                TextView txtAmount = new TextView(getActivity());
                txtAmount.setText("\u20B9 " + amount);
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
            //  txtTotal.setText("\u20B9 " + totalAmt);
            txtTotal.setText("₹ " + df.format(totalAmt));


        }
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
                mIminPrintUtils.printColumnsText(new String[]{"Item", "Qty", "Price", "Discount", "Add Charges", "Tax", "Amount"}, new int[]{2, 1, 2, 2, 2, 2, 2}, new int[]{1, 1, 1, 1, 1, 1, 1}, new int[]{20, 20, 20, 20, 20, 20, 20});
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
                        mIminPrintUtils.printColumnsText(new String[]{details.getChargeName(), String.valueOf(qty), /*"\u20B9 " +*/ String.valueOf(charge), /*"\u20B9 " +*/ String.valueOf(discount), /*"\u20B9 " +*/ String.valueOf(addCharge), /*"\u20B9 " +*/ String.valueOf(tax),/* " \u20B9 " +*/ String.valueOf(amount)}, new int[]{2, 1, 2, 2, 2, 2, 2}, new int[]{0, 1, 1, 1, 1, 1, 1}, new int[]{23, 23, 23, 23, 23, 23, 23});
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

    public void gotoBillingMenu() {
        BillingFragment newFragment = new BillingFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, newFragment, "Billing");
        transaction.addToBackStack(null);
        transaction.commit();
    }

    @Override
    public void onPaymentSuccess(String s) {
        System.out.println("print success");
        System.out.println("print success" + s);
    }

    @Override
    public void onPaymentError(int i, String s) {
        System.out.println("print error");
    }



    public class InputFilterMinMax implements InputFilter {
        private int min, max;

        public InputFilterMinMax(int min, int max) {
            this.min = min;
            this.max = max;
        }

        @Override
        public CharSequence filter(CharSequence source, int start, int end,
                                   Spanned dest, int dstart, int dend) {
            try {
                String newVal = dest.subSequence(0, dstart)
                        + source.toString()
                        + dest.subSequence(dend, dest.length());

                // Prevent leading zeros
                if (newVal.matches("^0\\d+")) {
                    return "";
                }

                if (newVal.isEmpty()) return null;

                int input = Integer.parseInt(newVal);
                if (input >= min && input <= max) {
                    return null;
                }
            } catch (NumberFormatException e) {
            }
            return "";
        }
    }

    public void filterPopover() {
        LayoutInflater inflater = (LayoutInflater) requireContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View popupView = inflater.inflate(R.layout.filter_bill, null, false);

        popupWindow = new PopupWindow(popupView, dpToPx(230), dpToPx(160), true);
        popupWindow.setFocusable(true);
        popupWindow.setOutsideTouchable(true);
        popupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        popupWindow.showAtLocation(requireView(), Gravity.CENTER, 0, 0);

        TextView allTxt = popupView.findViewById(R.id.allTxt);
        TextView opText = popupView.findViewById(R.id.opText);
        TextView apptsTxt = popupView.findViewById(R.id.apptsTxt);

        allTxt.setOnClickListener(view -> {
            filterText.setText("All");
            passFilterTxt = "ALL";
            applyFilter("ALL");
            popupWindow.dismiss();
        });

        opText.setOnClickListener(view -> {
            filterText.setText("Out Patients");
            passFilterTxt = "OPD";
            applyFilter("OPD");
            popupWindow.dismiss();
        });

        apptsTxt.setOnClickListener(view -> {
            filterText.setText("Appointments");
            passFilterTxt = "APPOINTMENT";
            applyFilter("APPOINTMENT");
            popupWindow.dismiss();
        });
    }

    public void applyFilter(String filterType) {
        billingAdapter.filter(filterType);
        updateEmptyViewVisibility();
    }

    private void updateEmptyViewVisibility() {
        if (billingAdapter.getItemCount() == 0) {
            billingRec.setVisibility(View.GONE);
            noDataFound.setVisibility(View.VISIBLE);
        } else {
            billingRec.setVisibility(View.VISIBLE);
            noDataFound.setVisibility(View.GONE);
        }
    }



}
