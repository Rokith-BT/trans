package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;




public class HospitalDetailsResponse {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("details")
    @Expose
    private Details details;

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

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public class Details {

        @SerializedName("Hospital_id")
        @Expose
        private String hospitalId;
        @SerializedName("Hospital_name")
        @Expose
        private String hospitalName;
        @SerializedName("Hospital_address")
        @Expose
        private String hospitalAddress;
        @SerializedName("Hospital_state")
        @Expose
        private String hospitalState;
        @SerializedName("Hospital_district")
        @Expose
        private String hospitalDistrict;
        @SerializedName("Hospital_pincode")
        @Expose
        private String hospitalPincode;
        @SerializedName("Hospital_logo")
        @Expose
        private String hospitalLogo;
        @SerializedName("Hospital_image")
        @Expose
        private String hospitalImage;

        @SerializedName("Hospital_contact_no")
        @Expose
        private String HospitalContactNo;


        @SerializedName("Hospital_website_link")
        @Expose
        private String HospitalWebsiteLink;

        public String getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(String hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getHospitalName() {
            return hospitalName;
        }

        public void setHospitalName(String hospitalName) {
            this.hospitalName = hospitalName;
        }

        public String getHospitalAddress() {
            return hospitalAddress;
        }

        public void setHospitalAddress(String hospitalAddress) {
            this.hospitalAddress = hospitalAddress;
        }

        public String getHospitalState() {
            return hospitalState;
        }

        public void setHospitalState(String hospitalState) {
            this.hospitalState = hospitalState;
        }

        public String getHospitalDistrict() {
            return hospitalDistrict;
        }

        public void setHospitalDistrict(String hospitalDistrict) {
            this.hospitalDistrict = hospitalDistrict;
        }

        public String getHospitalPincode() {
            return hospitalPincode;
        }

        public void setHospitalPincode(String hospitalPincode) {
            this.hospitalPincode = hospitalPincode;
        }

        public String getHospitalLogo() {
            return hospitalLogo;
        }

        public void setHospitalLogo(String hospitalLogo) {
            this.hospitalLogo = hospitalLogo;
        }

        public String getHospitalImage() {
            return hospitalImage;
        }

        public void setHospitalImage(String hospitalImage) {
            this.hospitalImage = hospitalImage;
        }

        public String getHospitalContactNo() {
            return HospitalContactNo;
        }

        public void setHospitalContactNo(String hospitalContactNo) {
            HospitalContactNo = hospitalContactNo;
        }

        public String getHospitalWebsiteLink() {
            return HospitalWebsiteLink;
        }

        public void setHospitalWebsiteLink(String hospitalWebsiteLink) {
            HospitalWebsiteLink = hospitalWebsiteLink;
        }

    }


    public static class CheckDuplicateAppointmentRequest {

        @SerializedName("patient_id")
        @Expose
        private Integer patientId;
        @SerializedName("doctor")
        @Expose
        private Integer doctor;
        @SerializedName("date")
        @Expose
        private String date;
        @SerializedName("Hospital_id")
        @Expose
        private Integer hospitalId;
        @SerializedName("shift_id")
        @Expose
        private Integer shiftId;

        public Integer getPatientId() {
            return patientId;
        }

        public void setPatientId(Integer patientId) {
            this.patientId = patientId;
        }

        public Integer getDoctor() {
            return doctor;
        }

        public void setDoctor(Integer doctor) {
            this.doctor = doctor;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(Integer hospitalId) {
            this.hospitalId = hospitalId;
        }

        public Integer getShiftId() {
            return shiftId;
        }

        public void setShiftId(Integer shiftId) {
            this.shiftId = shiftId;
        }

    }

    public class CheckDuplicateAppointmentResponse {

        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("message")
        @Expose
        private String message;
        @SerializedName("is_duplicate_appointment")
        @Expose
        private Boolean isDuplicateAppointment;

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

        public Boolean getIsDuplicateAppointment() {
            return isDuplicateAppointment;
        }

        public void setIsDuplicateAppointment(Boolean isDuplicateAppointment) {
            this.isDuplicateAppointment = isDuplicateAppointment;
        }

    }

    public static class AfterPaymentModel {

        @SerializedName("Hospital_id")
        @Expose
        private Integer hospitalId;
        @SerializedName("payment_reference_number")
        @Expose
        private String paymentReferenceNumber;
        @SerializedName("payment_id")
        @Expose
        private String paymentId;
        @SerializedName("payment_gateway")
        @Expose
        private String paymentGateway;

        public Integer getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(Integer hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getPaymentReferenceNumber() {
            return paymentReferenceNumber;
        }

        public void setPaymentReferenceNumber(String paymentReferenceNumber) {
            this.paymentReferenceNumber = paymentReferenceNumber;
        }

        public String getPaymentId() {
            return paymentId;
        }

        public void setPaymentId(String paymentId) {
            this.paymentId = paymentId;
        }

        public String getPaymentGateway() {
            return paymentGateway;
        }

        public void setPaymentGateway(String paymentGateway) {
            this.paymentGateway = paymentGateway;
        }

    }

    public class UpDateAbhaResponse {

        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("message")
        @Expose
        private String message;

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

    }

}


