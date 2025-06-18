package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;



public class ConsentRequestResponse {

    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("request_url")
    @Expose
    private String requestUrl;
    @SerializedName("request_id")
    @Expose
    private String requestId;
    @SerializedName("payload")
    @Expose
    private Payload payload;
    @SerializedName("created_at")
    @Expose
    private String createdAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public class Payload {

        @SerializedName("error")
        @Expose
        private Object error;
        @SerializedName("response")
        @Expose
        private Response response;
        @SerializedName("consentRequest")
        @Expose
        private ConsentRequest consentRequest;

        public Object getError() {
            return error;
        }

        public void setError(Object error) {
            this.error = error;
        }

        public Response getResponse() {
            return response;
        }

        public void setResponse(Response response) {
            this.response = response;
        }

        public ConsentRequest getConsentRequest() {
            return consentRequest;
        }

        public void setConsentRequest(ConsentRequest consentRequest) {
            this.consentRequest = consentRequest;
        }

        public class ConsentRequest {

            @SerializedName("id")
            @Expose
            private String id;

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
            }

        }
        public class Response {

            @SerializedName("requestId")
            @Expose
            private String requestId;

            public String getRequestId() {
                return requestId;
            }

            public void setRequestId(String requestId) {
                this.requestId = requestId;
            }

        }

    }



}