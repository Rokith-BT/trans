package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class V2PendingBillHistoryResponse {

    @SerializedName("status_code")
    @Expose
    private String statusCode;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("data")
    @Expose
    private List<PendingList> data;
    @SerializedName("totalCount")
    @Expose
    private String totalCount;
    @SerializedName("totalAmount")
    @Expose
    private Double totalAmount;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
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

    public List<PendingList> getData() {
        return data;
    }

    public void setData(List<PendingList> data) {
        this.data = data;
    }

    public String getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(String totalCount) {
        this.totalCount = totalCount;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public class PendingList {

        @SerializedName("patient_name")
        @Expose
        private String patientName;
        @SerializedName("patientID")
        @Expose
        private Integer patientID;
        @SerializedName("mobileno")
        @Expose
        private String mobileno;
        @SerializedName("email")
        @Expose
        private String email;
        @SerializedName("balanceAmount")
        @Expose
        private Double balanceAmount;

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public Integer getPatientID() {
            return patientID;
        }

        public void setPatientID(Integer patientID) {
            this.patientID = patientID;
        }

        public String getMobileno() {
            return mobileno;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Double getBalanceAmount() {
            return balanceAmount;
        }

        public void setBalanceAmount(Double balanceAmount) {
            this.balanceAmount = balanceAmount;
        }

    }

}