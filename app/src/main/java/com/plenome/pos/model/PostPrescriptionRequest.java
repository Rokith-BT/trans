package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class PostPrescriptionRequest {

    @SerializedName("medicine_name")
    private String medicineName;
    @SerializedName("frequency")
    private String frequency;
    @SerializedName("dosage")
    private String dosage;
    @SerializedName("duration_count")
    private String durationCount;
    @SerializedName("duration_limit")
    private String durationLimit;
    @SerializedName("quantity")
    private String quantity;
    @SerializedName("when")
    private String when;
    @SerializedName("remarks")
    private String remarks;
    @SerializedName("filled_using")
    private String filledUsing;
    @SerializedName("opd_id")
    private int opdId;
    @SerializedName("id")
    private int id;
    @SerializedName("hospital_id")
    private Integer hospitalId;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getDurationCount() {
        return durationCount;
    }

    public void setDurationCount(String durationCount) {
        this.durationCount = durationCount;
    }

    public String getDurationLimit() {
        return durationLimit;
    }

    public void setDurationLimit(String durationLimit) {
        this.durationLimit = durationLimit;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getWhen() {
        return when;
    }

    public void setWhen(String when) {
        this.when = when;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getFilledUsing() {
        return filledUsing;
    }

    public void setFilledUsing(String filledUsing) {
        this.filledUsing = filledUsing;
    }

    public Integer getOpdId() {
        return opdId;
    }

    public void setOpdId(Integer opdId) {
        this.opdId = opdId;
    }

    public Integer getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Integer hospitalId) {
        this.hospitalId = hospitalId;
    }

}
