package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class VerifySecondOTPResp {

    @SerializedName("txnId")
    @Expose
    private String txnId;
    @SerializedName("authResult")
    @Expose
    private String authResult;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("accounts")
    @Expose
    private List<Account> accounts;

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public String getAuthResult() {
        return authResult;
    }

    public void setAuthResult(String authResult) {
        this.authResult = authResult;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    public class Account {

        @SerializedName("ABHANumber")
        @Expose
        private String aBHANumber;
        @SerializedName("name")
        @Expose
        private String name;

        public String getABHANumber() {
            return aBHANumber;
        }

        public void setABHANumber(String aBHANumber) {
            this.aBHANumber = aBHANumber;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }

}