package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class CreateAbhaNoResponse {

    @SerializedName("token")
    String token;

    @SerializedName("refreshToken")
    String refreshToken;

    @SerializedName("healthIdNumber")
    String healthIdNumber;
    @SerializedName("name")
    String name;

    @SerializedName("gender")
    String gender;

    @SerializedName("statusCode")
    String statusCode;
    @SerializedName("message")
    String message;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getHealthIdNumber() {
        return healthIdNumber;
    }

    public void setHealthIdNumber(String healthIdNumber) {
        this.healthIdNumber = healthIdNumber;
    }
}
