package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class GetAppointmentStatusResponse {
    @SerializedName("status")
    String status;

    @SerializedName("id")
    int id;

    @SerializedName("is_completed")
    int isCompleted;

    @SerializedName("appointment_status_id")
    int apptStatusId;

    public int getApptStatusId() {
        return apptStatusId;
    }

    public void setApptStatusId(int apptStatusId) {
        this.apptStatusId = apptStatusId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(int isCompleted) {
        this.isCompleted = isCompleted;
    }
}
