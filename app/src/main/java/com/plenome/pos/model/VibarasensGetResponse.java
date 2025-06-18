package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class VibarasensGetResponse {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("details")
    @Expose
    private List<Detail> details;

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

    public List<Detail> getDetails() {
        return details;
    }

    public void setDetails(List<Detail> details) {
        this.details = details;
    }


    public static class DeviceReading {

        @SerializedName("leftp1")
        @Expose
        private Integer leftp1;
        @SerializedName("leftp2")
        @Expose
        private Integer leftp2;
        @SerializedName("leftp3")
        @Expose
        private Integer leftp3;
        @SerializedName("leftp4")
        @Expose
        private Integer leftp4;
        @SerializedName("leftp5")
        @Expose
        private Integer leftp5;
        @SerializedName("leftp6")
        @Expose
        private Integer leftp6;
        @SerializedName("leftvpt")
        @Expose
        private Double leftvpt;
        @SerializedName("legtype")
        @Expose
        private String legtype;
        @SerializedName("imageleft")
        @Expose
        private String imageleft;
        @SerializedName("right1")
        @Expose
        private Integer right1;
        @SerializedName("right2")
        @Expose
        private Integer right2;
        @SerializedName("right3")
        @Expose
        private Integer right3;
        @SerializedName("right4")
        @Expose
        private Integer right4;
        @SerializedName("right5")
        @Expose
        private Integer right5;
        @SerializedName("right6")
        @Expose
        private Integer right6;
        @SerializedName("rightvpt")
        @Expose
        private Double rightvpt;
        @SerializedName("imageright")
        @Expose
        private String imageright;

        public Integer getLeftp1() {
            return leftp1;
        }

        public void setLeftp1(Integer leftp1) {
            this.leftp1 = leftp1;
        }

        public Integer getLeftp2() {
            return leftp2;
        }

        public void setLeftp2(Integer leftp2) {
            this.leftp2 = leftp2;
        }

        public Integer getLeftp3() {
            return leftp3;
        }

        public void setLeftp3(Integer leftp3) {
            this.leftp3 = leftp3;
        }

        public Integer getLeftp4() {
            return leftp4;
        }

        public void setLeftp4(Integer leftp4) {
            this.leftp4 = leftp4;
        }

        public Integer getLeftp5() {
            return leftp5;
        }

        public void setLeftp5(Integer leftp5) {
            this.leftp5 = leftp5;
        }

        public Integer getLeftp6() {
            return leftp6;
        }

        public void setLeftp6(Integer leftp6) {
            this.leftp6 = leftp6;
        }

        public Double getLeftvpt() {
            return leftvpt;
        }

        public void setLeftvpt(Double leftvpt) {
            this.leftvpt = leftvpt;
        }

        public String getLegtype() {
            return legtype;
        }

        public void setLegtype(String legtype) {
            this.legtype = legtype;
        }

        public String getImageleft() {
            return imageleft;
        }

        public void setImageleft(String imageleft) {
            this.imageleft = imageleft;
        }

        public Integer getRight1() {
            return right1;
        }

        public void setRight1(Integer right1) {
            this.right1 = right1;
        }

        public Integer getRight2() {
            return right2;
        }

        public void setRight2(Integer right2) {
            this.right2 = right2;
        }

        public Integer getRight3() {
            return right3;
        }

        public void setRight3(Integer right3) {
            this.right3 = right3;
        }

        public Integer getRight4() {
            return right4;
        }

        public void setRight4(Integer right4) {
            this.right4 = right4;
        }

        public Integer getRight5() {
            return right5;
        }

        public void setRight5(Integer right5) {
            this.right5 = right5;
        }

        public Integer getRight6() {
            return right6;
        }

        public void setRight6(Integer right6) {
            this.right6 = right6;
        }

        public Double getRightvpt() {
            return rightvpt;
        }

        public void setRightvpt(Double rightvpt) {
            this.rightvpt = rightvpt;
        }

        public String getImageright() {
            return imageright;
        }

        public void setImageright(String imageright) {
            this.imageright = imageright;
        }

    }
    public class Detail {

        @SerializedName("id")
        @Expose
        private Integer id;
        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("patient_id")
        @Expose
        private Integer patientId;
        @SerializedName("device_reading")
        @Expose
        private List<DeviceReading> deviceReading;
        @SerializedName("created_at")
        @Expose
        private String createdAt;
        @SerializedName("device_name")
        @Expose
        private String deviceName;
        @SerializedName("device_id")
        @Expose
        private Object deviceId;

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public Integer getPatientId() {
            return patientId;
        }

        public void setPatientId(Integer patientId) {
            this.patientId = patientId;
        }

        public List<DeviceReading> getDeviceReading() {
            return deviceReading;
        }

        public void setDeviceReading(List<DeviceReading> deviceReading) {
            this.deviceReading = deviceReading;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getDeviceName() {
            return deviceName;
        }

        public void setDeviceName(String deviceName) {
            this.deviceName = deviceName;
        }

        public Object getDeviceId() {
            return deviceId;
        }

        public void setDeviceId(Object deviceId) {
            this.deviceId = deviceId;
        }

    }
}