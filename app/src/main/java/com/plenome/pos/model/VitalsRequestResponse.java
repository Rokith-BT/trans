package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class VitalsRequestResponse {

    @SerializedName("spo2")
    @Expose
    private String spo2;
    @SerializedName("respiration")
    @Expose
    private String respiration;
    @SerializedName("temperature")
    @Expose
    private String temperature;
    @SerializedName("pulse")
    @Expose
    private String pulse;
    @SerializedName("weight")
    @Expose
    private String weight;
    @SerializedName("height")
    @Expose
    private String height;
    @SerializedName("bp")
    @Expose
    private String bp;

    public String getSpo2() {
        return spo2;
    }

    public void setSpo2(String spo2) {
        this.spo2 = spo2;
    }

    public String getRespiration() {
        return respiration;
    }

    public void setRespiration(String respiration) {
        this.respiration = respiration;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getPulse() {
        return pulse;
    }

    public void setPulse(String pulse) {
        this.pulse = pulse;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getBp() {
        return bp;
    }

    public void setBp(String bp) {
        this.bp = bp;
    }

}