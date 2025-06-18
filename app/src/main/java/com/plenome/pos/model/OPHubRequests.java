package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.File;
import java.util.List;

public class OPHubRequests {
    public static class LoginRequest {
        @SerializedName("Username")
        String userName;
        @SerializedName("Password")
        String password;

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class GenerateAadhaarOTPRequest {
        @SerializedName("aadhaarNumber")
        String aadhaarNo;

        public String getAadhaarNo() {
            return aadhaarNo;
        }

        public void setAadhaarNo(String aadhaarNo) {
            this.aadhaarNo = aadhaarNo;
        }
    }

    public static class GenerateEmailOTPRequest {
        @SerializedName("txnId")
        String txnId;
        @SerializedName("loginId")
        String loginId;

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getLoginId() {
            return loginId;
        }

        public void setLoginId(String loginId) {
            this.loginId = loginId;
        }
    }

    public static class VerifyAadhaarOTPRequest {
        @SerializedName("txnId")
        String txnId;
        @SerializedName("otpValue")
        String otpValue;
        @SerializedName("mobile")
        String mobile;

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getOtpValue() {
            return otpValue;
        }

        public void setOtpValue(String otpValue) {
            this.otpValue = otpValue;
        }
    }

    public static class GetOtpRequest {
        @SerializedName("aadhaarNumber")
        String aadhaarNo;

        public String getAadhaarNo() {
            return aadhaarNo;
        }

        public void setAadhaarNo(String aadhaarNo) {
            this.aadhaarNo = aadhaarNo;
        }
    }

    public static class VerifyOtpRequest {
        @SerializedName("otpValue")
        String otp;
        @SerializedName("txnId")
        String txnId;
        @SerializedName("mobileOTP")
        String mobileOTP;
        @SerializedName("emailOTP")
        String emailOTP;
        @SerializedName("abhaOTP")
        String abhaOTP;
        @SerializedName("otpFrom")
        String otpFrom;
        @SerializedName("abhaAddressOTP")
        String abhaAddressOTP;

        public String getEmailOTP() {
            return emailOTP;
        }

        public void setEmailOTP(String emailOTP) {
            this.emailOTP = emailOTP;
        }

        public String getAbhaAddressOTP() {
            return abhaAddressOTP;
        }

        public void setAbhaAddressOTP(String abhaAddressOTP) {
            this.abhaAddressOTP = abhaAddressOTP;
        }

        public String getAbhaOTP() {
            return abhaOTP;
        }

        public void setAbhaOTP(String abhaOTP) {
            this.abhaOTP = abhaOTP;
        }

        public String getOtpFrom() {
            return otpFrom;
        }

        public void setOtpFrom(String otpFrom) {
            this.otpFrom = otpFrom;
        }

        public String getMobileOTP() {
            return mobileOTP;
        }

        public void setMobileOTP(String mobileOTP) {
            this.mobileOTP = mobileOTP;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }
    }

    public static class IsMobileLinkedRequest {
        @SerializedName("mobile")
        String mobile;

        @SerializedName("txnId")
        String txnId;

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }
    }


    public static class CreateAbhaNoRequest {

        @SerializedName("txnId")
        String txnId;

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }
    }

    public static class GetAbhaCardRequest {
        @SerializedName("token")
        String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    public static class ShowProfileImageRequest {
        @SerializedName("value")
        String value;
        @SerializedName("key")
        String key;

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    public static class AddNewPatientRequest {
        @SerializedName("patient_name")
        String patientName;
        @SerializedName("dob")
        String dob;
        @SerializedName("image")
        String image;
        @SerializedName("mobileno")
        String mobile;

        @SerializedName("emergency_mobile_no")
        String emergencyNo;
        @SerializedName("email")
        String email;

        @SerializedName("gender")
        String gender;
        @SerializedName("age")
        int age;
        @SerializedName("blood_bank_product_id")
        String bloodBankId;

        @SerializedName("address")
        String address;

        @SerializedName("abha_address")
        String abhaAddress;

        @SerializedName("hospital_id")
        int hospId;

        @SerializedName("ABHA_number")
        String abhaNo;

        @SerializedName("salutation")
        String salutation;

        @SerializedName("dial_code")
        String dialCode;
        @SerializedName("insurance_id")
        String insuranceId;
        @SerializedName("insurance_validity")
        String insuranceValidity;
        @SerializedName("known_allergies")
        String knownAllergies;



        public String getKnownAllergies() {
            return knownAllergies;
        }

        public void setKnownAllergies(String knownAllergies) {
            this.knownAllergies = knownAllergies;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getInsuranceId() {
            return insuranceId;
        }

        public void setInsuranceId(String insuranceId) {
            this.insuranceId = insuranceId;
        }

        public String getInsuranceValidity() {
            return insuranceValidity;
        }

        public void setInsuranceValidity(String insuranceValidity) {
            this.insuranceValidity = insuranceValidity;
        }

        public String getSalutation() {
            return salutation;
        }

        public void setSalutation(String salutation) {
            this.salutation = salutation;
        }

        public String getDialCode() {
            return dialCode;
        }

        public void setDialCode(String dialCode) {
            this.dialCode = dialCode;
        }

        public int getHospId() {
            return hospId;
        }

        public void setHospId(int hospId) {
            this.hospId = hospId;
        }

        public String getAbhaNo() {
            return abhaNo;
        }

        public void setAbhaNo(String abhaNo) {
            this.abhaNo = abhaNo;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getEmergencyNo() {
            return emergencyNo;
        }

        public void setEmergencyNo(String emergencyNo) {
            this.emergencyNo = emergencyNo;
        }

           public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getBloodBankId() {
            return bloodBankId;
        }

        public void setBloodBankId(String bloodBankId) {
            this.bloodBankId = bloodBankId;
        }

        public String getAddress() {
            return address;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String address) {
            this.abhaAddress = address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

    }

    public static class GetPrescriptionRequest {
        @SerializedName("Hospital_id")
        int hospitalId;
        @SerializedName("patient_id")
        int patientId;

        public int getPatientId() {
            return patientId;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }
    }

    public static class GetDoctorSlotRequest {
        @SerializedName("hospital_id")
        int hospId;
        @SerializedName("staff_id")
        int staffId;
        //   @SerializedName("shift_id")
        // int shiftId;
        @SerializedName("date")
        String date;

        public int getHospId() {
            return hospId;
        }

        public void setHospId(int hospId) {
            this.hospId = hospId;
        }

        public void setStaffId(int staffId) {
            this.staffId = staffId;
        }

        public int getStaffId() {
            return staffId;
        }

     /*   public int getShiftId() {
            return shiftId;
        }

        public void setShiftId(int shiftId) {
            this.shiftId = shiftId;
        }*/

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }

    public static class PrescriptionPostingReq {
        @SerializedName("Hospital_id")
        int hospId;
        @SerializedName("patient_id")
        int patientId;
        @SerializedName("record_name")
        String recName;
        @SerializedName("files")
        String files;
        @SerializedName("appointment_id")
        String appointmentId;

        public int getHospId() {
            return hospId;
        }

        public void setHospId(int hospId) {
            this.hospId = hospId;
        }

        public int getPatientId() {
            return patientId;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public String getRecName() {
            return recName;
        }

        public void setAppointmentId(String appointmentId) {
            this.appointmentId = appointmentId;
        }

        public void setRecName(String recName) {
            this.recName = recName;
        }

        public String getAppointmentId() {
            return appointmentId;
        }

        public String getFiles() {
            return files;
        }

        public void setFiles(String files) {
            this.files = files;
        }
    }

    public static class BookAppointmentReq {
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
        @SerializedName("appointment_status_id")
        int apptStatusId;
        @SerializedName("received_by_name")
        String receivedByName;

        public int getApptStatusId() {
            return apptStatusId;
        }

        public void setApptStatusId(int apptStatusId) {
            this.apptStatusId = apptStatusId;
        }

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

        public String getReceivedByName() {
            return receivedByName;
        }

        public void setReceivedByName(String receivedByName) {
            this.receivedByName = receivedByName;
        }
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

    public static class UpdateAppointmentStatusReq {
        @SerializedName("Hospital_id")
        int hospitalId;
        @SerializedName("appointment_status")
        String apptStatus;
        @SerializedName("appointment_status_id")
        int apptStatusId;

        public int getApptStatusId() {
            return apptStatusId;
        }

        public void setApptStatusId(int apptStatusId) {
            this.apptStatusId = apptStatusId;
        }

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getApptStatus() {
            return apptStatus;
        }

        public void setApptStatus(String apptStatus) {
            this.apptStatus = apptStatus;
        }
    }

    public static class RescheduleApptReq {
        @SerializedName("date")
        String date;
        @SerializedName("time")
        String time;
        @SerializedName("doctor")
        int doctorId;
        @SerializedName("shift_id")
        int shiftId;
        @SerializedName("Hospital_id")
        int hospId;
        @SerializedName("live_consult")
        String live_consult;

        @SerializedName("appointment_status")
        String apptStatus;

        @SerializedName("appointment_status_id")
        String apptStatusId;
        @SerializedName("global_shift_id")
        int global_shift_id;
        @SerializedName("payment_mode")
        String paymentMode;

        @SerializedName("payment_date")
        String paymentDate;

        @SerializedName("received_by_name")
        String receivedByName;

        public String getPaymentDate() {
            return paymentDate;
        }

        public void setPaymentDate(String paymentDate) {
            this.paymentDate = paymentDate;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
        }

        public String getApptStatusId() {
            return apptStatusId;
        }

        public void setApptStatusId(String apptStatusId) {
            this.apptStatusId = apptStatusId;
        }

        public String getApptStatus() {
            return apptStatus;
        }

        public void setApptStatus(String apptStatus) {
            this.apptStatus = apptStatus;
        }

        public int getGlobal_shift_id() {
            return global_shift_id;
        }

        public void setGlobal_shift_id(int global_shift_id) {
            this.global_shift_id = global_shift_id;
        }

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

        public int getShiftId() {
            return shiftId;
        }

        public void setShiftId(int shiftId) {
            this.shiftId = shiftId;
        }

        public String getLive_consult() {
            return live_consult;
        }

        public void setLive_consult(String live_consult) {
            this.live_consult = live_consult;
        }

        public int getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(int doctorId) {
            this.doctorId = doctorId;
        }

        public int getHospId() {
            return hospId;
        }

        public void setHospId(int hospId) {
            this.hospId = hospId;
        }

        public String getReceivedByName() {
            return receivedByName;
        }

        public void setReceivedByName(String receivedByName) {
            this.receivedByName = receivedByName;
        }
    }

    public static class GetExistPatientDetReq {
        @SerializedName("hospital_id")
        int hospitalId;
        @SerializedName("search_by")
        String searchBy;
        @SerializedName("value")
        String value;

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getSearchBy() {
            return searchBy;
        }

        public void setSearchBy(String searchBy) {
            this.searchBy = searchBy;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }

    public static class CheckAbhaQR {
        @SerializedName("hidn")
        String hidn;
        @SerializedName("hid")
        String hid;
        @SerializedName("name")
        String name;

        @SerializedName("gender")
        String gender;

        @SerializedName("hospital_id")
        int hospitalId;

        @SerializedName("dob")
        String dob;

        @SerializedName("mobile")
        String mobile;

        @SerializedName("address")
        String address;

        public String getHid() {
            return hid;
        }

        public void setHid(String hid) {
            this.hid = hid;
        }

        public String getHidn() {
            return hidn;
        }

        public void setHidn(String hidn) {
            this.hidn = hidn;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }

    public static class CancelAppointmentReq {
        @SerializedName("Hospital_id")
        int hospitalId;

        @SerializedName("cancellationReason")
        String reason;

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;

        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }


    public static class UpdateConsultStatusReq {
        @SerializedName("patient_id")
        int patientId;
        @SerializedName("appointment_id")
        String apptId;

        @SerializedName("description")
        String description;
        @SerializedName("staff_id")
        int staffId;
        @SerializedName("hospital_id")
        int hospitalId;
        @SerializedName("consultation_process_color_code_id")
        int colorCodeId;
        @SerializedName("consultaiton_process_list_id")
        int processId;

        public int getPatientId() {
            return patientId;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public int getStaffId() {
            return staffId;
        }

        public void setStaffId(int staffId) {
            this.staffId = staffId;
        }

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getApptId() {
            return apptId;
        }

        public void setApptId(String apptId) {
            this.apptId = apptId;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public int getColorCodeId() {
            return colorCodeId;
        }

        public void setColorCodeId(int colorCodeId) {
            this.colorCodeId = colorCodeId;
        }

        public int getProcessId() {
            return processId;
        }

        public void setProcessId(int processId) {
            this.processId = processId;
        }
    }

    public static class CashBillPayReq {
        @SerializedName("Hospital_id")
        int hospId;
        @SerializedName("patient_id")
        int patientId;
        @SerializedName("payment_date")
        String paymentDate;
        @SerializedName("payment_mode")
        String paymentMode;
        @SerializedName("received_by_name")
        String receivedByName;

        public int getHospId() {
            return hospId;
        }

        public void setHospId(int hospId) {
            this.hospId = hospId;
        }

        public int getPatientId() {
            return patientId;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public String getPaymentDate() {
            return paymentDate;
        }

        public void setPaymentDate(String paymentDate) {
            this.paymentDate = paymentDate;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
        }

        public String getReceivedByName() {
            return receivedByName;
        }

        public void setReceivedByName(String receivedByName) {
            this.receivedByName = receivedByName;
        }
    }

    public static class CashBillPayReqV2{
        @SerializedName("Hospital_id")
        @Expose
        private Integer hospitalId;
        @SerializedName("patient_id")
        @Expose
        private Integer patientId;
        @SerializedName("payment_date")
        @Expose
        private String paymentDate;
        @SerializedName("payment_mode")
        @Expose
        private String paymentMode;
        @SerializedName("received_by_name")
        @Expose
        private String receivedByName;
        @SerializedName("paymentDetails")
        @Expose
        private List<PaymentDetail> paymentDetails;

        public Integer getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(Integer hospitalId) {
            this.hospitalId = hospitalId;
        }

        public Integer getPatientId() {
            return patientId;
        }

        public void setPatientId(Integer patientId) {
            this.patientId = patientId;
        }

        public String getPaymentDate() {
            return paymentDate;
        }

        public void setPaymentDate(String paymentDate) {
            this.paymentDate = paymentDate;
        }

        public String getPaymentMode() {
            return paymentMode;
        }

        public void setPaymentMode(String paymentMode) {
            this.paymentMode = paymentMode;
        }

        public String getReceivedByName() {
            return receivedByName;
        }

        public void setReceivedByName(String receivedByName) {
            this.receivedByName = receivedByName;
        }

        public List<PaymentDetail> getPaymentDetails() {
            return paymentDetails;
        }

        public void setPaymentDetails(List<PaymentDetail> paymentDetails) {
            this.paymentDetails = paymentDetails;
        }}

    public static class PaymentDetail {

        @SerializedName("patient_charge_id")
        @Expose
        private Integer patientChargeId;
        @SerializedName("date")
        @Expose
        private String date;
        @SerializedName("section")
        @Expose
        private String section;
        @SerializedName("appointment_status_id")
        @Expose
        private String appointmentStatusId;
        @SerializedName("section_id")
        @Expose
        private String sectionId;
        @SerializedName("chargeDescription")
        @Expose
        private String chargeDescription;
        @SerializedName("qty")
        @Expose
        private Integer qty;
        @SerializedName("charges")
        @Expose
        private Integer charges;
        @SerializedName("taxPercentage")
        @Expose
        private Integer taxPercentage;
        @SerializedName("discount_amount")
        @Expose
        private Integer discountAmount;
        @SerializedName("discount_percentage")
        @Expose
        private Integer discountPercentage;
        @SerializedName("total")
        @Expose
        private Double total;
        @SerializedName("additional_charge")
        @Expose
        private Integer additionalCharge;

        public Integer getPatientChargeId() {
            return patientChargeId;
        }

        public void setPatientChargeId(Integer patientChargeId) {
            this.patientChargeId = patientChargeId;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getSection() {
            return section;
        }

        public void setSection(String section) {
            this.section = section;
        }

        public String getAppointmentStatusId() {
            return appointmentStatusId;
        }

        public void setAppointmentStatusId(String appointmentStatusId) {
            this.appointmentStatusId = appointmentStatusId;
        }

        public String getSectionId() {
            return sectionId;
        }

        public void setSectionId(String sectionId) {
            this.sectionId = sectionId;
        }

        public String getChargeDescription() {
            return chargeDescription;
        }

        public void setChargeDescription(String chargeDescription) {
            this.chargeDescription = chargeDescription;
        }

        public Integer getQty() {
            return qty;
        }

        public void setQty(Integer qty) {
            this.qty = qty;
        }

        public Integer getCharges() {
            return charges;
        }

        public void setCharges(Integer charges) {
            this.charges = charges;
        }

        public Integer getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(Integer taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public Integer getDiscountAmount() {
            return discountAmount;
        }

        public void setDiscountAmount(Integer discountAmount) {
            this.discountAmount = discountAmount;
        }

        public Integer getDiscountPercentage() {
            return discountPercentage;
        }

        public void setDiscountPercentage(Integer discountPercentage) {
            this.discountPercentage = discountPercentage;
        }

        public Double getTotal() {
            return total;
        }

        public void setTotal(Double total) {
            this.total = total;
        }

        public Integer getAdditionalCharge() {
            return additionalCharge;
        }

        public void setAdditionalCharge(Integer additionalCharge) {
            this.additionalCharge = additionalCharge;
        }
    }





    public static class AddChargesReq {
        @SerializedName("date")
        String date;
        @SerializedName("sectionID")
        String sectionID;
        @SerializedName("qty")
        int qty;
        @SerializedName("charge_id")
        int charge_id;
        @SerializedName("standard_charge")
        int standard_charge;
        @SerializedName("tax")
        String tax;
        @SerializedName("amount")
        double amount;
        @SerializedName("total")
        double total;
        @SerializedName("additional_charge_note")
        String additional_charge_note;
        @SerializedName("patient_id")
        int patient_id;
        @SerializedName("Hospital_id")
        int Hospital_id;
        @SerializedName("additional_charge")
        double additional_charge;
        @SerializedName("discount_amount")
        double discount_amount;
        @SerializedName("discount_percentage")
        double discount_percentage;

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }

        public double getAdditional_charge() {
            return additional_charge;
        }

        public void setAdditional_charge(double additional_charge) {
            this.additional_charge = additional_charge;
        }

        public double getDiscount_amount() {
            return discount_amount;
        }

        public void setDiscount_amount(double discount_amount) {
            this.discount_amount = discount_amount;
        }
        public String getSectionID() {
            return sectionID;
        }

        public void setSectionID(String sectionID) {
            this.sectionID = sectionID;
        }
        public double getDiscount_percentage() {
            return discount_percentage;
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

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        public int getCharge_id() {
            return charge_id;
        }

        public void setCharge_id(int charge_id) {
            this.charge_id = charge_id;
        }

        public int getHospital_id() {
            return Hospital_id;
        }

        public void setHospital_id(int hospital_id) {
            Hospital_id = hospital_id;
        }

        public int getPatient_id() {
            return patient_id;
        }

        public void setPatient_id(int patient_id) {
            this.patient_id = patient_id;
        }

        public int getStandard_charge() {
            return standard_charge;
        }

        public void setStandard_charge(int standard_charge) {
            this.standard_charge = standard_charge;
        }
    }


    public static class UpdateChargesReq {

        @SerializedName("qty")
        int qty;
        @SerializedName("charge_id")
        int charge_id;
        @SerializedName("standard_charge")
        int standard_charge;
        @SerializedName("tax")
        String tax;
        @SerializedName("amount")
        double amount;
        @SerializedName("total")
        double total;

        @SerializedName("additional_charge_note")
        String additional_charge_note;
        @SerializedName("Hospital_id")
        int Hospital_id;
        @SerializedName("additional_charge")
        double additional_charge;
        @SerializedName("discount_amount")
        double discount_amount;
        @SerializedName("discount_percentage")
        double discount_percentage;

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }

        public int getCharge_id() {
            return charge_id;
        }

        public void setCharge_id(int charge_id) {
            this.charge_id = charge_id;
        }

        public double getAdditional_charge() {
            return additional_charge;
        }

        public void setAdditional_charge(double additional_charge) {
            this.additional_charge = additional_charge;
        }

        public String getAdditional_charge_note() {
            return additional_charge_note;
        }

        public void setAdditional_charge_note(String additional_charge_note) {
            this.additional_charge_note = additional_charge_note;
        }

        public int getStandard_charge() {
            return standard_charge;
        }

        public void setStandard_charge(int standard_charge) {
            this.standard_charge = standard_charge;
        }

        public String getTax() {
            return tax;
        }

        public void setTax(String tax) {
            this.tax = tax;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public double getDiscount_amount() {
            return discount_amount;
        }

        public void setDiscount_percentage(double discount_percentage) {
            this.discount_percentage = discount_percentage;
        }

        public double getDiscount_percentage() {
            return discount_percentage;
        }

        public void setDiscount_amount(double discount_amount) {
            this.discount_amount = discount_amount;
        }

        public int getHospital_id() {
            return Hospital_id;
        }

        public void setHospital_id(int hospital_id) {
            Hospital_id = hospital_id;
        }
    }

    public static class SaveDiscountsReq {
        @SerializedName("additional_charge")
        double additional_charge;
        @SerializedName("additional_charge_note")
        String additional_charge_note;
        @SerializedName("discount_percentage")
        double discount_percentage;
        @SerializedName("discount_amount")
        double discount_amount;
        @SerializedName("total")
        double total;
        @SerializedName("Hospital_id")
        int Hospital_id;

        public String getAdditional_charge_note() {
            return additional_charge_note;
        }

        public void setAdditional_charge(double additional_charge) {
            this.additional_charge = additional_charge;
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

        public double getAdditional_charge() {
            return additional_charge;
        }

        public void setAdditional_charge_note(String additional_charge_note) {
            this.additional_charge_note = additional_charge_note;
        }

        public void setTotal(double total) {
            this.total = total;
        }

        public double getTotal() {
            return total;
        }

        public int getHospital_id() {
            return Hospital_id;
        }

        public void setHospital_id(int hospital_id) {
            Hospital_id = hospital_id;
        }

    }

    public static class AbhaAddressReq {
        @SerializedName("txnId")
        String txnId;
        @SerializedName("abhaAddress")
        String abhaAddress;
        @SerializedName("preferred")
        int preferred;

        // Getter and Setter for txnId
        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        // Getter and Setter for abhaAddress
        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        // Getter and Setter for preferred
        public int getPreferred() {
            return preferred;
        }

        public void setPreferred(int preferred) {
            this.preferred = preferred;
        }
    }

    public static class verifyAbhaAddr {
        @SerializedName("abhaAddress")
        String abhaAddr;

        // Getter and Setter for txnId
        public String getAbhaAddr() {
            return abhaAddr;
        }

        public void setAbhaAddr(String abhaAddr) {
            this.abhaAddr = abhaAddr;
        }
    }

    public static class sendOtpUserNameVerify {

        @SerializedName("abhaAddress")
        private String abhaAddress;
        @SerializedName("otpSystem")
        private String otpSystem;

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getOtpSystem() {
            return otpSystem;
        }

        public void setOtpSystem(String otpSystem) {
            this.otpSystem = otpSystem;
        }

    }

    public static class verifyAbhaUserNameOtp {

        @SerializedName("otp")
        private String otp;
        @SerializedName("otpSystem")
        private String otpSystem;
        @SerializedName("txnId")
        private String txnId;

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }

        public String getOtpSystem() {
            return otpSystem;
        }

        public void setOtpSystem(String otpSystem) {
            this.otpSystem = otpSystem;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

    }

    public static class GetMobileOTPRequest {
        @SerializedName("mobileNumber")
        String mobileno;
        @SerializedName("abha")
        String abha;
        @SerializedName("otpSystem")
        String otpSystem;
        @SerializedName("txnId")
        String txnId;

        public String getOtpSystem() {
            return otpSystem;
        }

        public void setOtpSystem(String otpSystem) {
            this.otpSystem = otpSystem;
        }

        public String getAbha() {
            return abha;
        }

        public void setAbha(String abha) {
            this.abha = abha;
        }

        public String getMobileno() {
            return mobileno;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }
        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }
    }
    public static class GetMobileListOTPRequest {
        @SerializedName("mobile")
        String mobileno;


        public String getMobileno() {
            return mobileno;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }
    }

    public static class UserNameVerifyCardToken {

        @SerializedName("token")
        private String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

    }

    public static class DistrictCodeRequest {

        @SerializedName("stateCode")
        private String stateCode;

        public String getStateCode() {
            return stateCode;
        }

        public void setStateCode(String stateCode) {
            this.stateCode = stateCode;
        }

    }

    public static class GetOTPLinkABHAReq {
        @SerializedName("abhaNumber")
        String abhaNumber;

        @SerializedName("aadhaarNumber")
        String aadhaarNumber;

        @SerializedName("otpSystem")
        String otpSystem;

        public String getAbhaNumber() {
            return abhaNumber;
        }

        public void setAbhaNumber(String abhaNumber) {
            this.abhaNumber = abhaNumber;
        }

        public String getAadhaarNumber() {
            return aadhaarNumber;
        }

        public void setAadhaarNumber(String aadhaarNumber) {
            this.aadhaarNumber = aadhaarNumber;
        }

        public String getOtpSystem() {
            return otpSystem;
        }

        public void setOtpSystem(String otpSystem) {
            this.otpSystem = otpSystem;
        }
    }

    public static class VerifyOTPLinkABHAReq {
        @SerializedName("txnId")
        String txnId;
        @SerializedName("abhaOTP")
        String abhaOTP;
        @SerializedName("otpSystem")
        String otpSystem;
        @SerializedName("aadhaarOTP")
        String aadhaarOTP;

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getAbhaOTP() {
            return abhaOTP;
        }

        public void setAbhaOTP(String abhaOTP) {
            this.abhaOTP = abhaOTP;
        }

        public String getOtpSystem() {
            return otpSystem;
        }

        public void setOtpSystem(String otpSystem) {
            this.otpSystem = otpSystem;
        }

        public String getAadhaarOTP() {
            return aadhaarOTP;
        }

        public void setAadhaarOTP(String aadhaarOTP) {
            this.aadhaarOTP = aadhaarOTP;
        }

    }


    public static class VerifyAbhaAddress {

        @SerializedName("token")
        private String token;
        @SerializedName("txnId")
        private String txnId;
        @SerializedName("abhaAddress")
        private String abhaAddress;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }


    }


    public static class LinkAbhaNoRequest {
        @SerializedName("txnId")
        String txnId;
        @SerializedName("ABHANumber")
        String ABHANumber;

        public String getABHANumber() {
            return ABHANumber;
        }

        public void setABHANumber(String ABHANumber) {
            this.ABHANumber = ABHANumber;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }
    }

    public static class VerifyMobileOTPReq {
        @SerializedName("otpValue")
        String mobileOtp;
        @SerializedName("txnId")
        String txnId;
        @SerializedName("otp")
        String otp;
        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getMobileOtp() {
            return mobileOtp;
        }

        public void setMobileOtp(String mobileOtp) {
            this.mobileOtp = mobileOtp;
        }
        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }

    public class ConditionRequest {
        private boolean condition;

        public ConditionRequest(boolean condition) {
            this.condition = condition;
        }

        public boolean isCondition() {
            return condition;
        }

        public void setCondition(boolean condition) {
            this.condition = condition;
        }
    }

    public static class CheckAbhaUsername {

        @SerializedName("address")
        private String address;

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

    }

    public static class AbhaAddrSuggestionReq {
        @SerializedName("firstName")
        String firstName;
        @SerializedName("lastName")
        String lastName;
        @SerializedName("txnId")
        String txnId;
        @SerializedName("dayOfBirth")
        String dayOfBirth;
        @SerializedName("monthOfBirth")
        String monthOfBirth;
        @SerializedName("yearOfBirth")
        String yearOfBirth;

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getDayOfBirth() {
            return dayOfBirth;
        }

        public void setDayOfBirth(String dayOfBirth) {
            this.dayOfBirth = dayOfBirth;
        }

        public String getYearOfBirth() {
            return yearOfBirth;
        }

        public void setYearOfBirth(String yearOfBirth) {
            this.yearOfBirth = yearOfBirth;
        }

        public String getMonthOfBirth() {
            return monthOfBirth;
        }

        public void setMonthOfBirth(String monthOfBirth) {
            this.monthOfBirth = monthOfBirth;
        }


    }

    public static class GetConsentListReq {
        @SerializedName("hiuId")
        String hiuId;
        @SerializedName("abhaAddress")
        String abhaAddress;

        @SerializedName("pagenumber")
        Integer pagenumber;

        @SerializedName("limit")
        Integer limit;


        public String getHiuId() {
            return hiuId;
        }

        public void setHiuId(String hiuId) {
            this.hiuId = hiuId;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public Integer getPagenumber() {
            return pagenumber;
        }

        public void setPagenumber(Integer pagenumber) {
            this.pagenumber = pagenumber;
        }

        public Integer getLimit() {
            return limit;
        }

        public void setLimit(Integer limit) {
            this.limit = limit;
        }
    }

    public static class ViewConsentReq {
        @SerializedName("consentArtefactId")
        String consentArtefactId;

        public String getConsentArtefactId() {
            return consentArtefactId;
        }

        public void setConsentArtefactId(String consentArtefactId) {
            this.consentArtefactId = consentArtefactId;
        }
    }


    public static class UploadPreviewPdf {
        @SerializedName("file")
        File file;
        @SerializedName("opd_id")
        String opd_id;
        @SerializedName("hospital_id")
        String hospital_id;

        public String getOpd_id() {
            return opd_id;
        }

        public void setOpd_id(String opd_id) {
            this.opd_id = opd_id;
        }

        public String getHospital_id() {
            return hospital_id;
        }

        public void setHospital_id(String hospital_id) {
            this.hospital_id = hospital_id;
        }

        public File getFile() {
            return file;
        }

        public void setFile(File file) {
            this.file = file;
        }
    }
}