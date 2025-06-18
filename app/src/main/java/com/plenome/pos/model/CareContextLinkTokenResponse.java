package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

public class CareContextLinkTokenResponse implements Serializable {
    @SerializedName("status")
    private Status status;

    @SerializedName("response")
    private List<ResponseItem> response;

    // Getters and setters
    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public List<ResponseItem> getResponse() {
        return response;
    }

    public void setResponse(List<ResponseItem> response) {
        this.response = response;
    }

    // Inner classes representing nested objects
    public static class Status implements Serializable {
        @SerializedName("status")
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class ResponseItem implements Serializable {
        @SerializedName("id")
        private int id;

        @SerializedName("request_url")
        private String requestUrl;

        @SerializedName("request_id")
        private String requestId;

        @SerializedName("payload")
        private Payload payload;

        @SerializedName("created_at")
        private String createdAt;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getRequestUrl() {
            return requestUrl;
        }

        public void setRequestUrl(String requestUrl) {
            this.requestUrl = requestUrl;
        }

        public String getRequestId() {
            return requestId;
        }

        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }

        public Payload getPayload() {
            return payload;
        }

        public void setPayload(Payload payload) {
            this.payload = payload;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }
    }

    public static class Payload implements Serializable {
        @SerializedName("error")
        private Error error;

        @SerializedName("linkToken")
        private String linkToken;

        @SerializedName("abhaAddress")
        private String abhaAddress;

        @SerializedName("response")
        private Response response;

        public Error getError() {
            return error;
        }

        public void setError(Error error) {
            this.error = error;
        }

        public String getLinkToken() {
            return linkToken;
        }

        public void setLinkToken(String linkToken) {
            this.linkToken = linkToken;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public Response getResponse() {
            return response;
        }

        public void setResponse(Response response) {
            this.response = response;
        }
    }

    public static class Error implements Serializable {
        @SerializedName("code")
        private String code;

        @SerializedName("message")
        private String message;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class Response implements Serializable {
        @SerializedName("requestId")
        private String requestId;

        public String getRequestId() {
            return requestId;
        }

        public void setRequestId(String requestId) {
            this.requestId = requestId;
        }
    }
}
