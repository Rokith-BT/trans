package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class PostPrescriptionResponse {

    @SerializedName("status")
    private String status;
    @SerializedName("messege")
    private String messege;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessege() {
        return messege;
    }

    public void setMessege(String messege) {
        this.messege = messege;
    }

}
