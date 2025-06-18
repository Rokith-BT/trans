package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class AbhaUserNameVerifyResponse {

    @SerializedName("txnId")
    private String txnId;
    @SerializedName("message")
    private String message;
    @Expose
    private String abhaAddress;
    @SerializedName("abhaAddress")

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public String getMessage() {
        return message;
    }

    public String getAbhaAddress() {
        return abhaAddress;
    }
    public void setAbhaAddress(String abhaAddress) {
        this.abhaAddress = abhaAddress;
    }

    public void setMessage(String message) {
        this.message = message;
    }



}
