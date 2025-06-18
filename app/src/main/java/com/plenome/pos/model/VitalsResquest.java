package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;



public class VitalsResquest {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("details")
    @Expose
    private Details details;

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

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public class Details {

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

        @SerializedName("date_time")
        @Expose
        private String date_time;

        @SerializedName("consultant")
        @Expose
        private String consultant;

        @SerializedName("opd_details_id")
        @Expose
        private String opd_details_id;

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

        public String getDate_time() {
            return date_time;
        }

        public void setDate_time(String date_time) {
            this.date_time = date_time;
        }

        public String getConsultant() {
            return consultant;
        }

        public void setConsultant(String consultant) {
            this.consultant = consultant;
        }

        public String getOpd_details_id() {
            return opd_details_id;
        }

        public void setOpd_details_id(String opd_details_id) {
            this.opd_details_id = opd_details_id;
        }

    }

}