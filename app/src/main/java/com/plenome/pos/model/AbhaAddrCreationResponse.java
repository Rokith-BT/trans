package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class AbhaAddrCreationResponse {

    @SerializedName("txnId")
    private String txnId;
    @SerializedName("message")
    private String message;
    @SerializedName("phrDetails")
    private PhrDetails phrDetails;
    @SerializedName("tokens")
    private Tokens tokens;

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

    public PhrDetails getPhrDetails() {
        return phrDetails;
    }

    public void setPhrDetails(PhrDetails phrDetails) {
        this.phrDetails = phrDetails;
    }

    public Tokens getTokens() {
        return tokens;
    }

    public void setTokens(Tokens tokens) {
        this.tokens = tokens;
    }


    public static class PhrDetails {

        @SerializedName("firstName")
        private String firstName;
        @SerializedName("middleName")
        private String middleName;
        @SerializedName("lastName")
        private String lastName;
        @SerializedName("fullName")
        private String fullName;
        @SerializedName("dayOfBirth")
        private String dayOfBirth;
        @SerializedName("monthOfBirth")
        private String monthOfBirth;
        @SerializedName("yearOfBirth")
        private String yearOfBirth;
        @SerializedName("dateOfBirth")
        private String dateOfBirth;
        @SerializedName("gender")
        private String gender;
        @SerializedName("email")
        private String email;
        @SerializedName("mobile")
        private String mobile;
        @SerializedName("address")
        private String address;
        @SerializedName("stateName")
        private String stateName;
        @SerializedName("districtName")
        private String districtName;
        @SerializedName("pinCode")
        private String pinCode;
        @SerializedName("abhaAddress")
        private List<String> abhaAddress;
        @SerializedName("stateCode")
        private String stateCode;
        @SerializedName("districtCode")
        private String districtCode;

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

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getDayOfBirth() {
            return dayOfBirth;
        }

        public void setDayOfBirth(String dayOfBirth) {
            this.dayOfBirth = dayOfBirth;
        }

        public String getMonthOfBirth() {
            return monthOfBirth;
        }

        public void setMonthOfBirth(String monthOfBirth) {
            this.monthOfBirth = monthOfBirth;
        }

        public String getYearOfBirth() {
            return yearOfBirth;
        }

        public void setYearOfBirth(String yearOfBirth) {
            this.yearOfBirth = yearOfBirth;
        }

        public String getDateOfBirth() {
            return dateOfBirth;
        }

        public void setDateOfBirth(String dateOfBirth) {
            this.dateOfBirth = dateOfBirth;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
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

        public String getPinCode() {
            return pinCode;
        }

        public void setPinCode(String pinCode) {
            this.pinCode = pinCode;
        }

        public List<String> getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(List<String> abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getStateCode() {
            return stateCode;
        }

        public void setStateCode(String stateCode) {
            this.stateCode = stateCode;
        }

        public String getDistrictCode() {
            return districtCode;
        }

        public void setDistrictCode(String districtCode) {
            this.districtCode = districtCode;
        }

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
}