package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class OpdDropdownRes {
    @SerializedName("status_code")
    @Expose
    private String statusCode;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("data")
    @Expose
    private List<OpdAppintmentDropdownResp> data;

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

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

    public List<OpdAppintmentDropdownResp> getData() {
        return data;
    }

    public void setData(List<OpdAppintmentDropdownResp> data) {
        this.data = data;
    }
    public class  OpdAppintmentDropdownResp{

        @SerializedName("pendingId")
        @Expose
        private String pendingId;

        public String getPendingId() {
            return pendingId;
        }

        public void setPendingId(String pendingId) {
            this.pendingId = pendingId;
        }

    }
}


