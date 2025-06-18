package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class GetOtpResponse {

    @SerializedName("txnId")
    String txnId;

    @SerializedName("mobileNumber")
    String mobileNumber;

    @SerializedName("statusCode")
    String statusCode;
    @SerializedName("message")
    String message;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }
}
