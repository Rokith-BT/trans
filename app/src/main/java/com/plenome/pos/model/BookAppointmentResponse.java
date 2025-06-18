package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class BookAppointmentResponse {
    @SerializedName("status")
    String status;
    @SerializedName("messege")
    String message;
    @SerializedName("inserted_details")
    InsertedDetails insertedDetails;

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

    public InsertedDetails getInsertedDetails() {
        return insertedDetails;
    }

    public void setInsertedDetails(InsertedDetails insertedDetails) {
        this.insertedDetails = insertedDetails;
    }

    public class InsertedDetails {
        @SerializedName("appointment_id")
        String id;
        @SerializedName("patient_id")
        int patient_id;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public int getPatient_id() {
            return patient_id;
        }

        public void setPatient_id(int patient_id) {
            this.patient_id = patient_id;
        }
    }
}
