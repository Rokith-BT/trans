package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PrescriptionResponse {

    @SerializedName("status")
    private String status;
    @SerializedName("messege")
    private String messege;
    @SerializedName("details")
    private List<PrescriptionDetail> details;
    @SerializedName("OpdDetails")
    OpdDetails opdDetails;

    public OpdDetails getOpdDetails() {
        return opdDetails;
    }

    public void setOpdDetails(OpdDetails opdDetails) {
        this.opdDetails = opdDetails;
    }

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

    public List<PrescriptionDetail> getDetails() {
        return details;
    }

    public void setDetails(List<PrescriptionDetail> details) {
        this.details = details;
    }

    public class OpdDetails {
        @SerializedName("date")
        private String date;
        @SerializedName("time")
        private String time;
        @SerializedName("opd_no")
        private String opdNo;
        @SerializedName("consultant")
        private String consultant;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getOpdNo() {
            return opdNo;
        }

        public void setOpdNo(String opdNo) {
            this.opdNo = opdNo;
        }

        public String getConsultant() {
            return consultant;
        }

        public void setConsultant(String consultant) {
            this.consultant = consultant;
        }
    }

}


