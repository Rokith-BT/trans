package com.plenome.pos.views;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.gson.Gson;
import com.imin.image.ILcdManager;
import com.plenome.pos.R;
import com.plenome.pos.model.CaptureModel;
import com.plenome.pos.network.RestServices;
import com.plenome.pos.network.RetrofitInstance;
import com.razorpay.Checkout;
import com.razorpay.PaymentResultListener;

import org.json.JSONObject;

import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;



public class RazorpayActivity extends AppCompatActivity implements PaymentResultListener {

    RestServices services;
    String amount = "";
    private TextToSpeech textToSpeech;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        services = RetrofitInstance.createRazorpayService(RestServices.class);

        // Get data passed from the fragment
        Intent intent = getIntent();
        amount = intent.getStringExtra("amount");
        String name = intent.getStringExtra("name");

        // Initialize Razorpay Checkout
        Checkout checkout = new Checkout();
        checkout.setKeyID("rzp_live_E1TEgAPfjZ0OIQ");

        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("name", name);
            jsonObject.put("description", "Payment for Order #1234");
            jsonObject.put("currency", "INR");
            jsonObject.put("amount", amount);

            // Open Razorpay Checkout
            checkout.open(this, jsonObject);

        } catch (Exception e) {
            e.printStackTrace();
            Toast.makeText(this, "Error in payment: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            finishWithResult("failed", null,null);
        }

        textToSpeech = new TextToSpeech(RazorpayActivity.this, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    // Set language for TTS
                    int result = textToSpeech.setLanguage(Locale.UK);
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        Log.e("TTS", "Language not supported");
                        Toast.makeText(RazorpayActivity.this, "Language not supported", Toast.LENGTH_SHORT).show();
                    } else {

                    }
                } else {
                    Log.e("TTS", "Initialization failed");
                }
            }
        });
    }

    @Override
    public void onPaymentSuccess(String razorpayPaymentID) {
        Toast.makeText(this, "Payment Successful", Toast.LENGTH_SHORT).show();
        System.out.println("print success " + razorpayPaymentID);
        try {
            String paise = amount;
            int numericAmount = Integer.parseInt(paise);
            int result = numericAmount / 100;
            textToSpeech.speak("Payment received " + result + " rupees", TextToSpeech.QUEUE_FLUSH, null, null);
        }catch (Exception e){

        }



        ILcdManager.getInstance(getApplicationContext()).sendLCDFillStringWithSize("Payment Success",28);
        callCaptureApi(razorpayPaymentID);

    }

    public void callCaptureApi(String razorpayPaymentID){
        String credentials = Base64.encodeToString(("rzp_live_E1TEgAPfjZ0OIQ:eSskg54N7Bulwusbu7dGEMNr").getBytes(), Base64.NO_WRAP);

        Log.i("myLog","check payment success");
        CaptureModel.RequestCapture request = new CaptureModel.RequestCapture();
        request.setAmount(amount);
        request.setCurrency("INR");


        Log.i("myLog", "message request  :  " + new Gson().toJson(request));
        Call<CaptureModel> call = services.capturePayment(razorpayPaymentID, "Basic " + credentials, request);
        call.enqueue(new Callback<CaptureModel>() {
            @Override
            public void onResponse(Call<CaptureModel> call, Response<CaptureModel> response) {
                if (response.isSuccessful()) {
                    String ReferenceNumber = response.body().getAcquirerData().getRrn();
                    finishWithResult("success", razorpayPaymentID,ReferenceNumber);
                } else {
                    System.out.println("Payment Capture Failed: " + response.errorBody());
                }
            }

            @Override
            public void onFailure(Call<CaptureModel> call, Throwable t) {
                t.printStackTrace();
            }
        });
    }

    @Override
    public void onPaymentError(int code, String response) {
        Toast.makeText(this, "Payment Failed", Toast.LENGTH_SHORT).show();
        ILcdManager.getInstance(getApplicationContext()).sendLCDFillStringWithSize("Payment Failed",28);
        finishWithResult("failed", null, null);
    }

    private void finishWithResult(String status, @Nullable String razorpayPaymentID,@Nullable String  ReferenceNumber) {
        Intent resultIntent = new Intent();
        resultIntent.putExtra("status", status);
        resultIntent.putExtra("razorpayPaymentID", razorpayPaymentID);
        resultIntent.putExtra("referenceNumber", ReferenceNumber);
        setResult(Activity.RESULT_OK, resultIntent);
        finish();
        Bitmap bitmap1 = BitmapFactory.decodeResource(getResources(), R.drawable.plenome_icon);
        ILcdManager.getInstance(getApplicationContext()).sendLCDBitmap(bitmap1);
    }
}
