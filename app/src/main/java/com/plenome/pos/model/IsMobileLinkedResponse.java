package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class IsMobileLinkedResponse {
    @SerializedName("txnId")
    String txnId;

    @SerializedName("mobileLinked")
    Boolean mobileLinked;

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
    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public Boolean getMobileLinked() {
        return mobileLinked;
    }

    public void setMobileLinked(Boolean mobileLinked) {
        this.mobileLinked = mobileLinked;
    }
}
