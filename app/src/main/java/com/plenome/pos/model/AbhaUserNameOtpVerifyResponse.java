package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class AbhaUserNameOtpVerifyResponse {

    @SerializedName("message")
    private String message;
    @SerializedName("authResult")
    private String authResult;
    @SerializedName("users")
    private List<User> users;
    @SerializedName("tokens")
    private Tokens tokens;

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

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public Tokens getTokens() {
        return tokens;
    }

    public void setTokens(Tokens tokens) {
        this.tokens = tokens;
    }

    public class Tokens {

        @SerializedName("token")
        private String token;
        @SerializedName("expiresIn")
        private Integer expiresIn;
        @SerializedName("refreshToken")
        private String refreshToken;
        @SerializedName("refreshExpiresIn")
        private Integer refreshExpiresIn;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public Integer getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(Integer expiresIn) {
            this.expiresIn = expiresIn;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }

        public Integer getRefreshExpiresIn() {
            return refreshExpiresIn;
        }

        public void setRefreshExpiresIn(Integer refreshExpiresIn) {
            this.refreshExpiresIn = refreshExpiresIn;
        }

    }

    public class User {

        @SerializedName("abhaAddress")
        private String abhaAddress;
        @SerializedName("fullName")
        private String fullName;
        @SerializedName("profilePhoto")
        private String profilePhoto;
        @SerializedName("abhaNumber")
        private String abhaNumber;
        @SerializedName("status")
        private String status;
        @SerializedName("kycStatus")
        private String kycStatus;

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

        public String getProfilePhoto() {
            return profilePhoto;
        }

        public void setProfilePhoto(String profilePhoto) {
            this.profilePhoto = profilePhoto;
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

    }

}