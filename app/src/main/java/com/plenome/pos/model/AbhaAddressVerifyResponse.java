package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class AbhaAddressVerifyResponse {

    @SerializedName("healthIdNumber")
    private String healthIdNumber;
    @SerializedName("abhaAddress")
    private String abhaAddress;
    @SerializedName("authMethods")
    private List<String> authMethods;
    @SerializedName("blockedAuthMethods")
    private List<Object> blockedAuthMethods;
    @SerializedName("status")
    private String status;
    @SerializedName("message")
    private Object message;
    @SerializedName("fullName")
    private String fullName;
    @SerializedName("mobile")
    private String mobile;

    public String getHealthIdNumber() {
        return healthIdNumber;
    }

    public void setHealthIdNumber(String healthIdNumber) {
        this.healthIdNumber = healthIdNumber;
    }

    public String getAbhaAddress() {
        return abhaAddress;
    }

    public void setAbhaAddress(String abhaAddress) {
        this.abhaAddress = abhaAddress;
    }

    public List<String> getAuthMethods() {
        return authMethods;
    }

    public void setAuthMethods(List<String> authMethods) {
        this.authMethods = authMethods;
    }

    public List<Object> getBlockedAuthMethods() {
        return blockedAuthMethods;
    }

    public void setBlockedAuthMethods(List<Object> blockedAuthMethods) {
        this.blockedAuthMethods = blockedAuthMethods;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Object getMessage() {
        return message;
    }

    public void setMessage(Object message) {
        this.message = message;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

}

