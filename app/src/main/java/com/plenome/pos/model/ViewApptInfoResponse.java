package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class ViewApptInfoResponse {

    @SerializedName("QR_Type")
    String qrType;

    @SerializedName("Appointment_details")
    AppointmentDetails details;

    public String getQrType() {
        return qrType;
    }

    public void setQrType(String qrType) {
        this.qrType = qrType;
    }

    public AppointmentDetails getDetails() {
        return details;
    }

    public void setDetails(AppointmentDetails details) {
        this.details = details;
    }

    public class AppointmentDetails {

        @SerializedName("patient_id")
        int patientId;

        @SerializedName("patient_name")
        String patientName;

        @SerializedName("gender")
        String gender;

        @SerializedName("opd_id")
        String opdId;

        @SerializedName("age")
        int age;

        @SerializedName("mobileno")
        String mobileno;

        @SerializedName("email")
        String email;

        @SerializedName("doctorName")
        String doctorName;

        @SerializedName("doctorSpecialist")
        String doctorSpecialist;

        @SerializedName("doctor_id")
        int doctorId;

        @SerializedName("source")
        String source;

        @SerializedName("ABHA_number")
        String abhaNo;

        @SerializedName("abha_address")
        String abhaAddress;

        @SerializedName("appointment_id")
        String appointment_id;

        @SerializedName("appointmentDate")
        String appointmentDate;

        @SerializedName("date")
        String date;

        @SerializedName("slot")
        String slot;

        @SerializedName("patientChargeId")
        int patientChargeId;

        @SerializedName("appointment_status")
        String appointment_status;

        @SerializedName("appointmentTime")
        String appointmentTime;

        @SerializedName("time")
        String time;
        @SerializedName("is_token_verified")
        int isTokenVerified;

        @SerializedName("consultingType")
        String consultingType;

        @SerializedName("message")
        String message;

        @SerializedName("tokenNumber")
        String token;

        @SerializedName("consultFees")
        double consultFees;

        @SerializedName("taxPercentage")
        double taxPercentage;

        @SerializedName("taxAmount")
        double taxAmount;

        @SerializedName("netAmount")
        double netAmount;

        @SerializedName("payment_status")
        String paymentStatus;

        @SerializedName("payment_mode")
        String payment_mode;

        @SerializedName("color_code")
        String color_code;

        @SerializedName("appointment_status_id")
        String apptStatusId;

        @SerializedName("transactionID")
        String transactionID;

        @SerializedName("shift_id")
        int shiftId;

        @SerializedName("global_shift_id")
        int globalShiftId;

        @SerializedName("phr_appointment_id")
        int phrApptId;
        @SerializedName("additional_charge")
        double additional_charge;
        @SerializedName("additional_charge_note")
        String additional_charge_note;
        @SerializedName("discount_amount")
        double discount_amount;
        @SerializedName("discount_percentage")
        double discount_percentage;

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getOpdId() {
            return opdId;
        }

        public void setOpdId(String opdId) {
            this.opdId = opdId;
        }

        public double getDiscount_percentage() {
            return discount_percentage;
        }

        public void setDiscount_amount(double discount_amount) {
            this.discount_amount = discount_amount;
        }

        public double getDiscount_amount() {
            return discount_amount;
        }

        public void setDiscount_percentage(double discount_percentage) {
            this.discount_percentage = discount_percentage;
        }

        public String getAdditional_charge_note() {
            return additional_charge_note;
        }

        public void setAdditional_charge_note(String additional_charge_note) {
            this.additional_charge_note = additional_charge_note;
        }

        public double getAdditional_charge() {
            return additional_charge;
        }

        public void setAdditional_charge(double additional_charge) {
            this.additional_charge = additional_charge;
        }

        public int getPatientChargeId() {
            return patientChargeId;
        }

        public void setPatientChargeId(int patientChargeId) {
            this.patientChargeId = patientChargeId;
        }

        public int getPhrApptId() {
            return phrApptId;
        }

        public void setPhrApptId(int phrApptId) {
            this.phrApptId = phrApptId;
        }

        public int getIsTokenVerified() {
            return isTokenVerified;
        }

        public void setIsTokenVerified(int isTokenVerified) {
            this.isTokenVerified = isTokenVerified;
        }

        public String getColor_code() {
            return color_code;
        }

        public void setColor_code(String color_code) {
            this.color_code = color_code;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getPayment_mode() {
            return payment_mode;
        }

        public void setPayment_mode(String payment_mode) {
            this.payment_mode = payment_mode;
        }

        public String getTransactionID() {
            return transactionID;
        }

        public void setTransactionID(String transactionID) {
            this.transactionID = transactionID;
        }

        public double getTaxAmount() {
            return taxAmount;
        }

        public void setTaxAmount(double taxAmount) {
            this.taxAmount = taxAmount;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public double getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(double taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public double getNetAmount() {
            return netAmount;
        }

        public void setNetAmount(double netAmount) {
            this.netAmount = netAmount;
        }

        public String getPaymentStatus() {
            return paymentStatus;
        }

        public void setPaymentStatus(String paymentStatus) {
            this.paymentStatus = paymentStatus;
        }

        public double getConsultFees() {
            return consultFees;
        }

        public void setConsultFees(double consultFees) {
            this.consultFees = consultFees;
        }

        public String getConsultingType() {
            return consultingType;
        }

        public void setConsultingType(String consultingType) {
            this.consultingType = consultingType;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getSlot() {
            return slot;
        }

        public void setSlot(String slot) {
            this.slot = slot;
        }

        public String getAppointment_status() {
            return appointment_status;
        }

        public void setAppointment_status(String appointment_status) {
            this.appointment_status = appointment_status;
        }

        public String getAppointmentTime() {
            return appointmentTime;
        }

        public void setAppointmentTime(String appointmentTime) {
            this.appointmentTime = appointmentTime;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getAppointmentDate() {
            return appointmentDate;
        }

        public void setAppointmentDate(String appointmentDate) {
            this.appointmentDate = appointmentDate;
        }

        public String getAppointment_id() {
            return appointment_id;
        }

        public void setAppointment_id(String appointment_id) {
            this.appointment_id = appointment_id;
        }

        public String getAbhaNo() {
            return abhaNo;
        }

        public void setAbhaNo(String abhaNo) {
            this.abhaNo = abhaNo;
        }

        public int getPatientId() {

            return patientId;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public String getPatientName() {
            return patientName;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getMobileno() {
            return mobileno;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public int getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(int doctorId) {
            this.doctorId = doctorId;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }

        public String getDoctorSpecialist() {
            return doctorSpecialist;
        }

        public void setDoctorSpecialist(String doctorSpecialist) {
            this.doctorSpecialist = doctorSpecialist;
        }

        public String getApptStatusId() {
            return apptStatusId;
        }

        public void setApptStatusId(String apptStatusId) {
            this.apptStatusId = apptStatusId;
        }

        public int getShiftId() {
            return shiftId;
        }

        public void setShiftId(int shiftId) {
            this.shiftId = shiftId;
        }

        public void setGlobalShiftId(int globalShiftId) {
            this.globalShiftId = globalShiftId;
        }

        public int getGlobalShiftId() {
            return globalShiftId;
        }
    }
}

