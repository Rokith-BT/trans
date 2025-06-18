package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class PrescriptionDetail {

    @SerializedName("id")
    private Integer id;
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
    private Integer opdId;
    @SerializedName("created_at")
    private String createdAt;
    @SerializedName("is_from_api")
    private Boolean isFromApi;

    public Boolean getIsFromApi(){return isFromApi;}

    public void setIsFromApi(Boolean isFromApi){
        this.isFromApi = isFromApi;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

}
