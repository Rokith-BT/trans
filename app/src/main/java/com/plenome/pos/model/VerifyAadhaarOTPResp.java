package com.plenome.pos.model;

import java.util.List;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class VerifyAadhaarOTPResp {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("is_otp_verfication_needed")
    @Expose
    private Boolean isOtpVerficationNeeded;
    @SerializedName("kyc_verified_data")
    @Expose
    private KycVerifiedData kycVerifiedData;

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

    public Boolean getIsOtpVerficationNeeded() {
        return isOtpVerficationNeeded;
    }

    public void setIsOtpVerficationNeeded(Boolean isOtpVerficationNeeded) {
        this.isOtpVerficationNeeded = isOtpVerficationNeeded;
    }

    public KycVerifiedData getKycVerifiedData() {
        return kycVerifiedData;
    }

    public void setKycVerifiedData(KycVerifiedData kycVerifiedData) {
        this.kycVerifiedData = kycVerifiedData;
    }


    public class KycVerifiedData {

        @SerializedName("message")
        @Expose
        private String message;
        @SerializedName("txnId")
        @Expose
        private String txnId;
        @SerializedName("tokens")
        @Expose
        private Tokens tokens;
        @SerializedName("ABHAProfile")
        @Expose
        private ABHAProfile aBHAProfile;
        @SerializedName("isNew")
        @Expose
        private Boolean isNew;
        @SerializedName("imageKey")
        @Expose
        private String imageKey;

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

        public Tokens getTokens() {
            return tokens;
        }

        public void setTokens(Tokens tokens) {
            this.tokens = tokens;
        }

        public ABHAProfile getABHAProfile() {
            return aBHAProfile;
        }

        public void setABHAProfile(ABHAProfile aBHAProfile) {
            this.aBHAProfile = aBHAProfile;
        }

        public Boolean getIsNew() {
            return isNew;
        }

        public void setIsNew(Boolean isNew) {
            this.isNew = isNew;
        }

        public String getImageKey() {
            return imageKey;
        }

        public void setImageKey(String imageKey) {
            this.imageKey = imageKey;
        }

        public class Tokens {

            @SerializedName("token")
            @Expose
            private String token;
            @SerializedName("expiresIn")
            @Expose
            private Integer expiresIn;
            @SerializedName("refreshToken")
            @Expose
            private String refreshToken;
            @SerializedName("refreshExpiresIn")
            @Expose
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

        public class ABHAProfile {

            @SerializedName("firstName")
            @Expose
            private String firstName;
            @SerializedName("middleName")
            @Expose
            private String middleName;
            @SerializedName("lastName")
            @Expose
            private String lastName;
            @SerializedName("dob")
            @Expose
            private String dob;
            @SerializedName("gender")
            @Expose
            private String gender;
            @SerializedName("photo")
            @Expose
            private String photo;
            @SerializedName("mobile")
            @Expose
            private String mobile;
            @SerializedName("mobileVerified")
            @Expose
            private Boolean mobileVerified;
            @SerializedName("email")
            @Expose
            private String email;
            @SerializedName("phrAddress")
            @Expose
            private List<String> phrAddress;
            @SerializedName("address")
            @Expose
            private String address;
            @SerializedName("districtCode")
            @Expose
            private String districtCode;
            @SerializedName("stateCode")
            @Expose
            private String stateCode;
            @SerializedName("pinCode")
            @Expose
            private String pinCode;
            @SerializedName("abhaType")
            @Expose
            private String abhaType;
            @SerializedName("stateName")
            @Expose
            private String stateName;
            @SerializedName("districtName")
            @Expose
            private String districtName;
            @SerializedName("ABHANumber")
            @Expose
            private String aBHANumber;
            @SerializedName("abhaStatus")
            @Expose
            private String abhaStatus;

            public String getFirstName() {
                return firstName;
            }

            public void setFirstName(String firstName) {
                this.firstName = firstName;
            }

            public String getMiddleName() {
                return middleName;
            }

            public void setMiddleName(String middleName) {
                this.middleName = middleName;
            }

            public String getLastName() {
                return lastName;
            }

            public void setLastName(String lastName) {
                this.lastName = lastName;
            }

            public String getDob() {
                return dob;
            }

            public void setDob(String dob) {
                this.dob = dob;
            }

            public String getGender() {
                return gender;
            }

            public void setGender(String gender) {
                this.gender = gender;
            }

            public String getPhoto() {
                return photo;
            }

            public void setPhoto(String photo) {
                this.photo = photo;
            }

            public String getMobile() {
                return mobile;
            }

            public void setMobile(String mobile) {
                this.mobile = mobile;
            }

            public Boolean getMobileVerified() {
                return mobileVerified;
            }

            public void setMobileVerified(Boolean mobileVerified) {
                this.mobileVerified = mobileVerified;
            }

            public String getEmail() {
                return email;
            }

            public void setEmail(String email) {
                this.email = email;
            }

            public List<String> getPhrAddress() {
                return phrAddress;
            }

            public void setPhrAddress(List<String> phrAddress) {
                this.phrAddress = phrAddress;
            }

            public String getAddress() {
                return address;
            }

            public void setAddress(String address) {
                this.address = address;
            }

            public String getDistrictCode() {
                return districtCode;
            }

            public void setDistrictCode(String districtCode) {
                this.districtCode = districtCode;
            }

            public String getStateCode() {
                return stateCode;
            }

            public void setStateCode(String stateCode) {
                this.stateCode = stateCode;
            }

            public String getPinCode() {
                return pinCode;
            }

            public void setPinCode(String pinCode) {
                this.pinCode = pinCode;
            }

            public String getAbhaType() {
                return abhaType;
            }

            public void setAbhaType(String abhaType) {
                this.abhaType = abhaType;
            }

            public String getStateName() {
                return stateName;
            }

            public void setStateName(String stateName) {
                this.stateName = stateName;
            }

            public String getDistrictName() {
                return districtName;
            }

            public void setDistrictName(String districtName) {
                this.districtName = districtName;
            }

            public String getABHANumber() {
                return aBHANumber;
            }

            public void setABHANumber(String aBHANumber) {
                this.aBHANumber = aBHANumber;
            }

            public String getAbhaStatus() {
                return abhaStatus;
            }

            public void setAbhaStatus(String abhaStatus) {
                this.abhaStatus = abhaStatus;
            }

        }

    }

}