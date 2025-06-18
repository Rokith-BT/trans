package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class BookAppointmentReq {
    BookAppointmentOnlineReq1 req1;
    BookAppointmentOnlineReq2 req2;
    BookAppointmentOnlineReq3 req3;

    public BookAppointmentReq(BookAppointmentOnlineReq2 request2,BookAppointmentOnlineReq3 request3) {
      //  req1 = request1;
        req2 = request2;
        req3 = request3;
    }



    public static class BookAppointmentOnlineReq1 {
        @SerializedName("amount")
        String amount;

        @SerializedName("hospital_id")
        int hospital_id;

        @SerializedName("patient_mobile")
        String patient_mobile;

        @SerializedName("patient_email")
        String patient_email;

        @SerializedName("transaction_type")
        String transaction_type;

        @SerializedName("payment_mode")
        String payment_mode;

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public int getHospital_id() {
            return hospital_id;
        }

        public void setHospital_id(int hospital_id) {
            this.hospital_id = hospital_id;
        }

        public String getPayment_mode() {
            return payment_mode;
        }

        public void setPayment_mode(String payment_mode) {
            this.payment_mode = payment_mode;
        }

        public String getPatient_email() {
            return patient_email;
        }

        public void setPatient_email(String patient_email) {
            this.patient_email = patient_email;
        }

        public String getPatient_mobile() {
            return patient_mobile;
        }

        public void setPatient_mobile(String patient_mobile) {
            this.patient_mobile = patient_mobile;
        }

        public String getTransaction_type() {
            return transaction_type;
        }

        public void setTransaction_type(String transaction_type) {
            this.transaction_type = transaction_type;
        }
    }

    public static class BookAppointmentOnlineReq2 {
        @SerializedName("date")
        String date;
        @SerializedName("time")
        String time;
        @SerializedName("doctor")
        int doctorId;
        @SerializedName("shift_id")
        int shiftId;
        @SerializedName("patient_id")
        int patientId;
        @SerializedName("Hospital_id")
        int hospitalId;
        @SerializedName("live_consult")
        String live_consult;
        @SerializedName("payment_date")
        String payment_date;
        @SerializedName("payment_mode")
        String payment_mode;
        @SerializedName("global_shift_id")
        int global_shift_id;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getTime() {
            return time;
        }

        public int getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(int doctorId) {
            this.doctorId = doctorId;
        }

        public int getShiftId() {
            return shiftId;
        }

        public void setShiftId(int shiftId) {
            this.shiftId = shiftId;
        }

        public int getPatientId() {
            return patientId;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public int getGlobal_shift_id() {
            return global_shift_id;
        }

        public void setGlobal_shift_id(int global_shift_id) {
            this.global_shift_id = global_shift_id;
        }

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getLive_consult() {
            return live_consult;
        }

        public void setLive_consult(String live_consult) {
            this.live_consult = live_consult;
        }

        public String getPayment_date() {
            return payment_date;
        }

        public void setPayment_date(String payment_date) {
            this.payment_date = payment_date;
        }

        public String getPayment_mode() {
            return payment_mode;
        }

        public void setPayment_mode(String payment_mode) {
            this.payment_mode = payment_mode;
        }

    }

    public static class BookAppointmentOnlineReq3 {
        @SerializedName("api")
        String api;

        @SerializedName("method")
        String method;

        public String getApi() {
            return api;
        }

        public void setApi(String api) {
            this.api = api;
        }

        public String getMethod() {
            return method;
        }

        public void setMethod(String method) {
            this.method = method;
        }
    }


}
