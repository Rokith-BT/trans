package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class VerifyMobileOTPResponse {
    @SerializedName("txnId")
    String txnId;
    @SerializedName("message")
    String message;
    @SerializedName("authResult")
    String authResult;
    @SerializedName("tokens")
    Tokens tokens;
    @SerializedName("users")
    List<Users> users;

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

    public Tokens getTokens() {
        return tokens;
    }

    public void setTokens(Tokens tokens) {
        this.tokens = tokens;
    }

    public List<Users> getUsers() {
        return users;
    }

    public void setUsers(List<Users> users) {
        this.users = users;
    }

    public class Users {
        @SerializedName("abhaAddress")
        String abhaAddress;
        @SerializedName("fullName")
        String fullName;
        @SerializedName("abhaNumber")
        String abhaNumber;
        @SerializedName("status")
        String status;
        @SerializedName("kycStatus")
        String kycStatus;
        @SerializedName("profilePhoto")
        String profilePhoto;

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
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

        public String getKycStatus() {
            return kycStatus;
        }

        public void setKycStatus(String kycStatus) {
            this.kycStatus = kycStatus;
        }

        public String getProfilePhoto() {
            return profilePhoto;
        }

        public void setProfilePhoto(String profilePhoto) {
            this.profilePhoto = profilePhoto;
        }
    }

    public class Tokens {
        @SerializedName("token")
        String token;
        @SerializedName("refreshToken")
        String refreshToken;
        @SerializedName("expiresIn")
        int expiresIn;
        @SerializedName("refreshExpiresIn")
        int refreshExpiresIn;

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
    }

}
