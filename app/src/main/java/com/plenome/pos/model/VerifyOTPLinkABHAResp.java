package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class VerifyOTPLinkABHAResp {
    @SerializedName("txnId")
    String txnId;
    @SerializedName("message")
    String message;
    @SerializedName("authResult")
    String authResult;
    @SerializedName("token")
    String token;
    @SerializedName("refreshToken")
    String refreshToken;
    @SerializedName("expiresIn")
    int expiresIn;
    @SerializedName("refreshExpiresIn")
    int refreshExpiresIn;

    @SerializedName("accounts")
    List<VerifyOTPLinkABHAResp.Accounts> accounts;

    public List<Accounts> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Accounts> accounts) {
        this.accounts = accounts;
    }

    public int getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(int expiresIn) {
        this.expiresIn = expiresIn;
    }

    public int getRefreshExpiresIn() {
        return refreshExpiresIn;
    }

    public void setRefreshExpiresIn(int refreshExpiresIn) {
        this.refreshExpiresIn = refreshExpiresIn;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
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

    public class Accounts {
        @SerializedName("preferredAbhaAddress")
        String abhaAddress;
        @SerializedName("name")
        String name;
        @SerializedName("ABHANumber")
        String abhaNumber;
        @SerializedName("status")
        String status;

        @SerializedName("profilePhoto")
        String profilePhoto;

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAbhaNumber() {
            return abhaNumber;
        }

        public void setAbhaNumber(String abhaNumber) {
            this.abhaNumber = abhaNumber;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getProfilePhoto() {
            return profilePhoto;
        }

        public void setProfilePhoto(String profilePhoto) {
            this.profilePhoto = profilePhoto;
        }
    }
}


