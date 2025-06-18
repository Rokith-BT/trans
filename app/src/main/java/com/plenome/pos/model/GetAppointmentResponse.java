package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class GetAppointmentResponse {

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

        @SerializedName("patient_name")
        @Expose
        private String patientName;
        @SerializedName("patient_id")
        @Expose
        private Integer patientId;
        @SerializedName("appointment_date")
        @Expose
        private String appointmentDate;
        @SerializedName("comp")
        @Expose
        private String comp;
        @SerializedName("Mobile")
        @Expose
        private String mobile;
        @SerializedName("case_sheet_document")
        @Expose
        private String caseSheetDoc;
        @SerializedName("doctorSpecialist")
        @Expose
        private String doctorSpecialist;
        @SerializedName("dial_code")
        @Expose
        private String dialCode;
        @SerializedName("opd_id")
        @Expose
        private String opdId;
        @SerializedName("doctor")
        @Expose
        private Integer doctor;
        @SerializedName("salutation")
        @Expose
        private String salutation;
        @SerializedName("consultant")
        @Expose
        private String consultant;
        @SerializedName("appointment_status")
        @Expose
        private String appointmentStatus;
        @SerializedName("appointment_status_id")
        @Expose
        private String appointmentStatusId;
        @SerializedName("module")
        @Expose
        private String module;
        @SerializedName("color_code")
        @Expose
        private String colorCode;
        @SerializedName("appointment_id")
        @Expose
        private String appointmentId;
        @SerializedName("payment_status")
        @Expose
        private String paymentStatus;
        @SerializedName("apptFees")
        @Expose
        private double apptFees;
        @SerializedName("appointment_token")
        @Expose
        private String appointmentToken;

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public Integer getPatientId() {
            return patientId;
        }

        public void setPatientId(Integer patientId) {
            this.patientId = patientId;
        }

        public String getAppointmentDate() {
            return appointmentDate;
        }

        public void setAppointmentDate(String appointmentDate) {
            this.appointmentDate = appointmentDate;
        }

        public String getComp() {
            return comp;
        }

        public void setComp(String comp) {
            this.comp = comp;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getCaseSheetDoc() {
            return caseSheetDoc;
        }

        public void setCaseSheetDoc(String caseSheetDoc) {
            this.caseSheetDoc = caseSheetDoc;
        }

        public String getDoctorSpecialist() {
            return doctorSpecialist;
        }

        public void setDoctorSpecialist(String doctorSpecialist) {
            this.doctorSpecialist = doctorSpecialist;
        }

        public String getDialCode() {
            return dialCode;
        }

        public void setDialCode(String dialCode) {
            this.dialCode = dialCode;
        }

        public String getOpdId() {
            return opdId;
        }

        public void setOpdId(String opdId) {
            this.opdId = opdId;
        }

        public Integer getDoctor() {
            return doctor;
        }

        public void setDoctor(Integer doctor) {
            this.doctor = doctor;
        }

        public String getSalutation() {
            return salutation;
        }

        public void setSalutation(String salutation) {
            this.salutation = salutation;
        }

        public String getConsultant() {
            return consultant;
        }

        public void setConsultant(String consultant) {
            this.consultant = consultant;
        }

        public String getAppointmentStatus() {
            return appointmentStatus;
        }

        public void setAppointmentStatus(String appointmentStatus) {
            this.appointmentStatus = appointmentStatus;
        }

        public String getAppointmentStatusId() {
            return appointmentStatusId;
        }

        public void setAppointmentStatusId(String appointmentStatusId) {
            this.appointmentStatusId = appointmentStatusId;
        }

        public String getModule() {
            return module;
        }

        public void setModule(String module) {
            this.module = module;
        }

        public String getColorCode() {
            return colorCode;
        }

        public void setColorCode(String colorCode) {
            this.colorCode = colorCode;
        }

        public String getAppointmentId() {
            return appointmentId;
        }

        public void setAppointmentId(String appointmentId) {
            this.appointmentId = appointmentId;
        }

        public String getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public double getApptFees() {
            return apptFees;
        }

        public void setApptFees(double apptFees) {
            this.apptFees = apptFees;
        }

        public String getAppointmentToken() {
            return appointmentToken;
        }

        public void setAppointmentToken(String appointmentToken) {
            this.appointmentToken = appointmentToken;
        }

    }

}