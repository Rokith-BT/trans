package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class ConsultationTrackingResponse {
    @SerializedName("doctor")
    String doctorName;

    @SerializedName("description")
    String description;

    @SerializedName("Consultation_Process")
    String consultProcessName;

    @SerializedName("color_code")
    String colorCode;

    @SerializedName("status")
    String status;

    @SerializedName("timing")
    String time;

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getConsultProcessName() {
        return consultProcessName;
    }

    public void setConsultProcessName(String consultProcessName) {
        this.consultProcessName = consultProcessName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDoctorName() {
        return doctorName;
    }


    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }
}
