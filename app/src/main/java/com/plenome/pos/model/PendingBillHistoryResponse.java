package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class PendingBillHistoryResponse {
    @SerializedName("status")
    String status;

    @SerializedName("message")
    String message;

    @SerializedName("Count")
    int count;

    @SerializedName("total")
    double overallTotal;


    @SerializedName("PendingList")
    ArrayList<PendingList> details;

    public ArrayList<PendingList> getDetails() {
        return details;
    }

    public void setDetails(ArrayList<PendingList> details) {
        this.details = details;
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

    public class PendingList{
        @SerializedName("patientID")
        int patientId;
        @SerializedName("patient_name")
        String patient_name;
        @SerializedName("email")
        String email;
        @SerializedName("mobileno")
        String mobileno;
        @SerializedName("balanceAmount")
        String balanceAmount;

        public int getPatientId() {
            return patientId;
        }

        public void setPatient_name(String patient_name) {
            this.patient_name = patient_name;
        }

        public String getPatient_name() {
            return patient_name;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMobileno() {
            return mobileno;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }

        public String getBalanceAmount() {
            return balanceAmount;
        }

        public void setBalanceAmount(String balanceAmount) {
            this.balanceAmount = balanceAmount;
        }

    }

}
