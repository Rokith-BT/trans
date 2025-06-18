package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class VerifyNewMobileOTPResponse {

    @SerializedName("txnId")
    @Expose
    private String txnId;
    @SerializedName("authResult")
    @Expose
    private String authResult;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("token")
    @Expose
    private String token;
    @SerializedName("expiresIn")
    @Expose
    private Integer expiresIn;
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
        @SerializedName("preferredAbhaAddress")
        @Expose
        private String preferredAbhaAddress;
        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("gender")
        @Expose
        private String gender;
        @SerializedName("dob")
        @Expose
        private String dob;
        @SerializedName("verifiedStatus")
        @Expose
        private String verifiedStatus;
        @SerializedName("verificationType")
        @Expose
        private String verificationType;
        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("profilePhoto")
        @Expose
        private String profilePhoto;
        @SerializedName("kycVerified")
        @Expose
        private Boolean kycVerified;
        @SerializedName("mobileVerified")
        @Expose
        private Boolean mobileVerified;

        public String getABHANumber() {
            return aBHANumber;
        }

        public void setABHANumber(String aBHANumber) {
            this.aBHANumber = aBHANumber;
        }

        public String getPreferredAbhaAddress() {
            return preferredAbhaAddress;
        }

        public void setPreferredAbhaAddress(String preferredAbhaAddress) {
            this.preferredAbhaAddress = preferredAbhaAddress;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getVerifiedStatus() {
            return verifiedStatus;
        }

        public void setVerifiedStatus(String verifiedStatus) {
            this.verifiedStatus = verifiedStatus;
        }

        public String getVerificationType() {
            return verificationType;
        }

        public void setVerificationType(String verificationType) {
            this.verificationType = verificationType;
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

        public Boolean getKycVerified() {
            return kycVerified;
        }

        public void setKycVerified(Boolean kycVerified) {
            this.kycVerified = kycVerified;
        }

        public Boolean getMobileVerified() {
            return mobileVerified;
        }

        public void setMobileVerified(Boolean mobileVerified) {
            this.mobileVerified = mobileVerified;
        }

    }

}