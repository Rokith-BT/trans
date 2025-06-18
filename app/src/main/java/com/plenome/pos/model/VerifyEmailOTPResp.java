package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class VerifyEmailOTPResp {
    @SerializedName("txnId")
    String txnId;
    @SerializedName("authResult")
    String authResult;
    @SerializedName("message")
    String message;
    @SerializedName("accounts")
    List<Accounts> accounts;

    public List<Accounts> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Accounts> accounts) {
        this.accounts = accounts;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAuthResult() {
        return authResult;
    }

    public void setAuthResult(String authResult) {
        this.authResult = authResult;
    }

    public static class Accounts {
        @SerializedName("ABHANumber")
        String ABHANumber;

        public String getABHANumber() {
            return ABHANumber;
        }

        public void setABHANumber(String ABHANumber) {
            this.ABHANumber = ABHANumber;
        }
    }
}
