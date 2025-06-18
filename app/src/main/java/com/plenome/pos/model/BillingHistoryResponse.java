package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class BillingHistoryResponse {

    @SerializedName("status")
    String status;

    @SerializedName("message")
    String message;

    @SerializedName("count")
    int count;

    @SerializedName("overallTotal")
    double overallTotal;

    @SerializedName("details")
    ArrayList<Details> details;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public double getOverallTotal() {
        return overallTotal;
    }

    public void setOverallTotal(double overallTotal) {
        this.overallTotal = overallTotal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public ArrayList<Details> getDetails() {
        return details;
    }

    public void setDetails(ArrayList<Details> details) {
        this.details = details;
    }

    public class Details {

        @SerializedName("patientId")
        int patientId;
        @SerializedName("patient_name")
        String patient_name;
        @SerializedName("payment_mode")
        String paymentMode;
        @SerializedName("transaction_id")
        String transaction_id;
        @SerializedName("amount")
        double amount;

        @SerializedName("payment_date")
        String payment_date;


        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }


        public String getPayment_date() {
            return payment_date;
        }

        public void setPayment_date(String payment_date) {
            this.payment_date = payment_date;
        }

        public String getTransaction_id() {
            return transaction_id;
        }

        public void setTransaction_id(String transaction_id) {
            this.transaction_id = transaction_id;
        }

        public int getId() {
            return patientId;
        }

        public void setId(int id) {
            this.patientId = id;
        }

        public String getPatient_name() {
            return patient_name;
        }

        public void setPatient_name(String patient_name) {
            this.patient_name = patient_name;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
        }
    }

}
