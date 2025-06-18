package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class GetConsentListResp {

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
    private List<Datum> data;
    @SerializedName("total")
    @Expose
    private String total;

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

    public List<Datum> getData() {
        return data;
    }

    public void setData(List<Datum> data) {
        this.data = data;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public class Datum {

        @SerializedName("id")
        @Expose
        private Integer id;
        @SerializedName("requested_HIU_ID")
        @Expose
        private String requestedHIUID;
        @SerializedName("abhaAddress")
        @Expose
        private String abhaAddress;
        @SerializedName("requested_date")
        @Expose
        private String requestedDate;
        @SerializedName("request_status")
        @Expose
        private String requestStatus;
        @SerializedName("expiry_date")
        @Expose
        private String expiryDate;
        @SerializedName("status_change_date")
        @Expose
        private String statusChangeDate;
        @SerializedName("is_status_changed")
        @Expose
        private Integer isStatusChanged;
        @SerializedName("consent_request_from_date")
        @Expose
        private String consentRequestFromDate;
        @SerializedName("consent_request_to_date")
        @Expose
        private String consentRequestToDate;
        @SerializedName("consent_request_id")
        @Expose
        private String consentRequestId;
        @SerializedName("consent_artifacts")
        @Expose
        private List<ConsentArtifact> consentArtifacts;
        @SerializedName("consent_request_purpose")
        @Expose
        private ConsentRequestPurpose consentRequestPurpose;
        @SerializedName("consent_request_hi_types")
        @Expose
        private List<String> consentRequestHiTypes;
        @SerializedName("request_staff_name")
        @Expose
        private String requestStaffName;
        @SerializedName("updated_hi_types")
        @Expose
        private List<String> updatedHiTypes;

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getRequestedHIUID() {
            return requestedHIUID;
        }

        public void setRequestedHIUID(String requestedHIUID) {
            this.requestedHIUID = requestedHIUID;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getRequestedDate() {
            return requestedDate;
        }

        public void setRequestedDate(String requestedDate) {
            this.requestedDate = requestedDate;
        }

        public String getRequestStatus() {
            return requestStatus;
        }

        public void setRequestStatus(String requestStatus) {
            this.requestStatus = requestStatus;
        }

        public String getExpiryDate() {
            return expiryDate;
        }

        public void setExpiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
        }

        public String getStatusChangeDate() {
            return statusChangeDate;
        }

        public void setStatusChangeDate(String statusChangeDate) {
            this.statusChangeDate = statusChangeDate;
        }

        public Integer getIsStatusChanged() {
            return isStatusChanged;
        }

        public void setIsStatusChanged(Integer isStatusChanged) {
            this.isStatusChanged = isStatusChanged;
        }

        public String getConsentRequestFromDate() {
            return consentRequestFromDate;
        }

        public void setConsentRequestFromDate(String consentRequestFromDate) {
            this.consentRequestFromDate = consentRequestFromDate;
        }

        public String getConsentRequestToDate() {
            return consentRequestToDate;
        }

        public void setConsentRequestToDate(String consentRequestToDate) {
            this.consentRequestToDate = consentRequestToDate;
        }

        public String getConsentRequestId() {
            return consentRequestId;
        }

        public void setConsentRequestId(String consentRequestId) {
            this.consentRequestId = consentRequestId;
        }

        public List<ConsentArtifact> getConsentArtifacts() {
            return consentArtifacts;
        }

        public void setConsentArtifacts(List<ConsentArtifact> consentArtifacts) {
            this.consentArtifacts = consentArtifacts;
        }

        public ConsentRequestPurpose getConsentRequestPurpose() {
            return consentRequestPurpose;
        }

        public void setConsentRequestPurpose(ConsentRequestPurpose consentRequestPurpose) {
            this.consentRequestPurpose = consentRequestPurpose;
        }

        public List<String> getConsentRequestHiTypes() {
            return consentRequestHiTypes;
        }

        public void setConsentRequestHiTypes(List<String> consentRequestHiTypes) {
            this.consentRequestHiTypes = consentRequestHiTypes;
        }

        public String getRequestStaffName() {
            return requestStaffName;
        }

        public void setRequestStaffName(String requestStaffName) {
            this.requestStaffName = requestStaffName;
        }

        public List<String> getUpdatedHiTypes() {
            return updatedHiTypes;
        }

        public void setUpdatedHiTypes(List<String> updatedHiTypes) {
            this.updatedHiTypes = updatedHiTypes;
        }

        public class ConsentArtifact {

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

        public class ConsentRequestPurpose {

            @SerializedName("code")
            @Expose
            private String code;
            @SerializedName("text")
            @Expose
            private String text;
            @SerializedName("refUri")
            @Expose
            private String refUri;

            public String getCode() {
                return code;
            }

            public void setCode(String code) {
                this.code = code;
            }

            public String getText() {
                return text;
            }

            public void setText(String text) {
                this.text = text;
            }

            public String getRefUri() {
                return refUri;
            }

            public void setRefUri(String refUri) {
                this.refUri = refUri;
            }

        }

    }

}