package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class GetPrescriptionResponse {
    @SerializedName("record_name")
    String recordName;

    @SerializedName("files")
    String files;

    @SerializedName("tags")
    String tags;

    @SerializedName("doctorName")
    String doctorName;

    @SerializedName("appointDate")
    String appointmentDate;


    @SerializedName("hos_opd_id")
    int hospOPDId;

    public int getHospOPDId() {
        return hospOPDId;
    }

    public void setHospOPDId(int hospOPDId) {
        this.hospOPDId = hospOPDId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getRecordName() {
        return recordName;
    }

    public void setRecordName(String recordName) {
        this.recordName = recordName;
    }

    public String getFiles() {
        return files;
    }

    public void setFiles(String files) {
        this.files = files;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }
}
