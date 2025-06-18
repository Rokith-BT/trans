package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;
import java.util.List;

public class OPHubResponse {
    public class GenderResponse {
        @SerializedName("gender")
        String gender;

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }

    public class CountryResponse {
        @SerializedName("name")
        String name;
        @SerializedName("id")
        int id;
        @SerializedName("dial_code")
        String dial_code;
        @SerializedName("iso")
        String iso;
        @SerializedName("country_flag")
        String countryFlag;

        public String getCountryFlag() {
            return countryFlag;
        }

        public void setCountryFlag(String countryFlag) {
            this.countryFlag = countryFlag;
        }

        public String getDial_code() {
            return dial_code;
        }

        public void setDial_code(String dial_code) {
            this.dial_code = dial_code;
        }

        public String getIso() {
            return iso;
        }

        public void setIso(String iso) {
            this.iso = iso;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public class SalutationResponse {
        @SerializedName("salutation")
        String salutation;
        @SerializedName("id")
        int id;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getSalutation() {
            return salutation;
        }

        public void setSalutation(String salutation) {
            this.salutation = salutation;
        }
    }

    public class MaritalStatusResponse {
        @SerializedName("marital_status")
        String maritalStatus;

        public String getMaritalStatus() {
            return maritalStatus;
        }

        public void setMaritalStatus(String maritalStatus) {
            this.maritalStatus = maritalStatus;
        }
    }

    public class FileUploadResponse {
        @SerializedName("status")
        String status;
        @SerializedName("message")
        String message;
        @SerializedName("messege")
        String messege;
        @SerializedName("data")
        String data;

        public String getMessege() {
            return messege;
        }

        public void setMessege(String messege) {
            this.messege = messege;
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

        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }
    }

    public class UpdateApptStatusResponse {
        @SerializedName("status")
        String status;

        @SerializedName("message")
        String message;

        @SerializedName("transactionId")
        String txnId;

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
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
    }

    public class PaymentStatusResponse {
        @SerializedName("id")
        int id;
        @SerializedName("PaymentStatus")
        String status;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }


    public class CancellationReasonResponse {
        @SerializedName("reason")
        String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public class ConsulationStatusCountResp {
        @SerializedName("id")
        int id;
        @SerializedName("name")
        String name;
        @SerializedName("color_code")
        String colorCode;
        @SerializedName("count")
        String count;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getColorCode() {
            return colorCode;
        }

        public void setColorCode(String colorCode) {
            this.colorCode = colorCode;
        }

        public String getCount() {
            return count;
        }

        public void setCount(String count) {
            this.count = count;
        }
    }

    public class GetApptQRResponse {
        @SerializedName("QR_Type_ID")
        int qrTypeId;
        @SerializedName("QR_Type")
        String qrType;
        @SerializedName("Appointment_details")
        ApptDetails apptDetails;

        public class ApptDetails {
            @SerializedName("doctor_id")
            int doctor_id;
            @SerializedName("patient_id")
            int patientId;
            @SerializedName("tokenNumber")
            int tokenNumber;
            @SerializedName("phr_appointment_id")
            int phrAppointmentId;
            @SerializedName("id")
            String id;
            @SerializedName("appointment_id")
            String appointment_id;

            @SerializedName("mobileno")
            String mobileNo;

            @SerializedName("Hospital_id")
            int hospitalId;

            public String getMobileNo() {
                return mobileNo;
            }

            public void setMobileNo(String mobileNo) {
                this.mobileNo = mobileNo;
            }

            public int getHospitalId() {
                return hospitalId;
            }

            public void setHospitalId(int hospitalId) {
                this.hospitalId = hospitalId;
            }

            public int getDoctor_id() {
                return doctor_id;
            }

            public void setDoctor_id(int doctor_id) {
                this.doctor_id = doctor_id;
            }

            public int getPatientId() {
                return patientId;
            }

            public void setPatientId(int patientId) {
                this.patientId = patientId;
            }

            public int getTokenNumber() {
                return tokenNumber;
            }

            public void setTokenNumber(int tokenNumber) {
                this.tokenNumber = tokenNumber;
            }

            public int getPhrAppointmentId() {
                return phrAppointmentId;
            }

            public void setPhrAppointmentId(int phrAppointmentId) {
                this.phrAppointmentId = phrAppointmentId;
            }

            public String getAppointment_id() {
                return appointment_id;
            }

            public void setAppointment_id(String appointment_id) {
                this.appointment_id = appointment_id;
            }

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
            }
        }

    }

    public class ChargeTypeResp {
        @SerializedName("id")
        int id;
        @SerializedName("charge_type")
        String chargeType;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getChargeType() {
            return chargeType;
        }

        public void setChargeType(String chargeType) {
            this.chargeType = chargeType;
        }
    }






    public class ChargeCateoryResp {
        @SerializedName("id")
        int id;
        @SerializedName("charge_type_id")
        int chargeTypeId;
        @SerializedName("name")
        String name;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public int getChargeTypeId() {
            return chargeTypeId;
        }

        public void setChargeTypeId(int chargeTypeId) {
            this.chargeTypeId = chargeTypeId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public class ChargeNameResp {
        @SerializedName("id")
        int id;
        @SerializedName("standard_charge")
        int standardCharge;
        @SerializedName("name")
        String name;
        @SerializedName("taxPercentage")
        String taxPercentage;
        @SerializedName("taxAmount")
        double taxAmount;
        @SerializedName("totalAmount")
        double totalAmount;

        public double getTaxAmount() {
            return taxAmount;
        }

        public void setTaxPercentage(String taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public String getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxAmount(double taxAmount) {
            this.taxAmount = taxAmount;
        }

        public double getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(double totalAmount) {
            this.totalAmount = totalAmount;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public int getStandardCharge() {
            return standardCharge;
        }

        public void setStandardCharge(int standardCharge) {
            this.standardCharge = standardCharge;
        }
    }

    public class ChargeDetailsResp {
        @SerializedName("id")
        int id;
        @SerializedName("standard_charge")
        int standardCharge;
        @SerializedName("name")
        String name;
        @SerializedName("taxPercentage")
        int taxPercentage;
        @SerializedName("taxAmount")
        double taxAmount;
        @SerializedName("totalAmount")
        double totAmount;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public int getStandardCharge() {
            return standardCharge;
        }

        public void setStandardCharge(int standardCharge) {
            this.standardCharge = standardCharge;
        }

        public int getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(int taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public double getTaxAmount() {
            return taxAmount;
        }

        public void setTaxAmount(double taxAmount) {
            this.taxAmount = taxAmount;
        }

        public double getTotAmount() {
            return totAmount;
        }

        public void setTotAmount(double totAmount) {
            this.totAmount = totAmount;
        }
    }

    public class GenerateAadhaarOTPResp {

        @SerializedName("txnId")
        String txnId;
        @SerializedName("message")
        String message;
        @SerializedName("statusCode")
        int statusCode;

        public int getStatusCode() {
            return statusCode;
        }

        public void setStatusCode(int statusCode) {
            this.statusCode = statusCode;
        }

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public class StateResponse {

        @SerializedName("code")
        private String code;
        @SerializedName("name")
        private String name;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }


    public class DistrictResponse {

        @SerializedName("code")
        private String code;
        @SerializedName("name")
        private String name;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

    }

    public class TokenResponse {
        @SerializedName("token")
        String token;
        @SerializedName("refreshToken")
        String refreshToken;
        @SerializedName("expiresIn")
        int expiresIn;
        @SerializedName("refreshExpiresIn")
        int refreshExpiresIn;

        @SerializedName("accessToken")
        String accessToken;

        public int getExpiresIn() {
            return expiresIn;
        }

        public void setExpiresIn(int expiresIn) {
            this.expiresIn = expiresIn;
        }

        public int getRefreshExpiresIn() {
            return refreshExpiresIn;
        }

        public void setRefreshExpiresIn(int refreshExpiresIn) {
            this.refreshExpiresIn = refreshExpiresIn;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }
    }

    public class AbhaAddrSuggestionResp {

        @SerializedName("txnId")
        String txnId;
        @SerializedName("abhaAddressList")
        ArrayList<String> abhaAddrlist;

        public String getTxnId() {
            return txnId;
        }

        public void setTxnId(String txnId) {
            this.txnId = txnId;
        }

        public ArrayList<String> getAbhaAddrlist() {
            return abhaAddrlist;
        }

        public void setAbhaAddrlist(ArrayList<String> abhaAddrlist) {
            this.abhaAddrlist = abhaAddrlist;
        }
    }



    public class GetConsentList {

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
        private List<GetConsentListResp> data;
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

        public List<GetConsentListResp> getData() {
            return data;
        }

        public void setData(List<GetConsentListResp> data) {
            this.data = data;
        }

        public String getTotal() {
            return total;
        }

        public void setTotal(String total) {
            this.total = total;
        }

    }

    public class GetConsentListResp {

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




    public class VerifyAbhaAddress {

        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("message")
        @Expose
        private String message;
        @SerializedName("patientDetails")
        @Expose
        private List<PatientDetail> patientDetails;

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

        public List<PatientDetail> getPatientDetails() {
            return patientDetails;
        }

        public void setPatientDetails(List<PatientDetail> patientDetails) {
            this.patientDetails = patientDetails;
        }

        public class PatientDetail {

            @SerializedName("id")
            @Expose
            private String id;
            @SerializedName("patient_name")
            @Expose
            private String patientName;
            @SerializedName("dob")
            @Expose
            private String dob;
            @SerializedName("age")
            @Expose
            private String age;
            @SerializedName("month")
            @Expose
            private String month;
            @SerializedName("day")
            @Expose
            private String day;
            @SerializedName("image")
            @Expose
            private String image;
            @SerializedName("mobileno")
            @Expose
            private String mobileno;
            @SerializedName("email")
            @Expose
            private String email;
            @SerializedName("gender")
            @Expose
            private String gender;
            @SerializedName("marital_status")
            @Expose
            private String maritalStatus;
            @SerializedName("blood_group")
            @Expose
            private String bloodGroup;
            @SerializedName("address")
            @Expose
            private String address;
            @SerializedName("state_name")
            @Expose
            private String stateName;
            @SerializedName("district_name")
            @Expose
            private String districtName;
            @SerializedName("state_code")
            @Expose
            private String stateCode;
            @SerializedName("district_code")
            @Expose
            private String districtCode;
            @SerializedName("pincode")
            @Expose
            private String pincode;
            @SerializedName("guardian_name")
            @Expose
            private String guardianName;
            @SerializedName("patient_type")
            @Expose
            private String patientType;
            @SerializedName("ABHA_number")
            @Expose
            private String aBHANumber;
            @SerializedName("known_allergies")
            @Expose
            private String knownAllergies;
            @SerializedName("insurance_id")
            @Expose
            private String insuranceId;
            @SerializedName("insurance_validity")
            @Expose
            private String insuranceValidity;
            @SerializedName("is_active")
            @Expose
            private String isActive;
            @SerializedName("aayush_unique_id")
            @Expose
            private String aayushUniqueId;
            @SerializedName("dial_code")
            @Expose
            private String dialCode;
            @SerializedName("salutation")
            @Expose
            private String salutation;
            @SerializedName("emergency_dial_code")
            @Expose
            private String emergencyDialCode;
            @SerializedName("emergency_mobile_no")
            @Expose
            private String emergencyMobileNo;
            @SerializedName("blood_bank_product_id")
            @Expose
            private String bloodBankProductId;
            @SerializedName("patient_blood_group")
            @Expose
            private String patientBloodGroup;
            @SerializedName("is_kyc_verified")
            @Expose
            private Integer isKycVerified;

            public String getId() {
                return id;
            }

            public void setId(String id) {
                this.id = id;
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

            public String getAge() {
                return age;
            }

            public void setAge(String age) {
                this.age = age;
            }

            public String getMonth() {
                return month;
            }

            public void setMonth(String month) {
                this.month = month;
            }

            public String getDay() {
                return day;
            }

            public void setDay(String day) {
                this.day = day;
            }

            public String getImage() {
                return image;
            }

            public void setImage(String image) {
                this.image = image;
            }

            public String getMobileno() {
                return mobileno;
            }

            public void setMobileno(String mobileno) {
                this.mobileno = mobileno;
            }

            public String getEmail() {
                return email;
            }

            public void setEmail(String email) {
                this.email = email;
            }

            public String getGender() {
                return gender;
            }

            public void setGender(String gender) {
                this.gender = gender;
            }

            public String getMaritalStatus() {
                return maritalStatus;
            }

            public void setMaritalStatus(String maritalStatus) {
                this.maritalStatus = maritalStatus;
            }

            public String getBloodGroup() {
                return bloodGroup;
            }

            public void setBloodGroup(String bloodGroup) {
                this.bloodGroup = bloodGroup;
            }

            public String getAddress() {
                return address;
            }

            public void setAddress(String address) {
                this.address = address;
            }

            public String getStateName() {
                return stateName;
            }

            public void setStateName(String stateName) {
                this.stateName = stateName;
            }

            public String getDistrictName() {
                return districtName;
            }

            public void setDistrictName(String districtName) {
                this.districtName = districtName;
            }

            public String getStateCode() {
                return stateCode;
            }

            public void setStateCode(String stateCode) {
                this.stateCode = stateCode;
            }

            public String getDistrictCode() {
                return districtCode;
            }

            public void setDistrictCode(String districtCode) {
                this.districtCode = districtCode;
            }

            public String getPincode() {
                return pincode;
            }

            public void setPincode(String pincode) {
                this.pincode = pincode;
            }

            public String getGuardianName() {
                return guardianName;
            }

            public void setGuardianName(String guardianName) {
                this.guardianName = guardianName;
            }

            public String getPatientType() {
                return patientType;
            }

            public void setPatientType(String patientType) {
                this.patientType = patientType;
            }

            public String getABHANumber() {
                return aBHANumber;
            }

            public void setABHANumber(String aBHANumber) {
                this.aBHANumber = aBHANumber;
            }

            public String getKnownAllergies() {
                return knownAllergies;
            }

            public void setKnownAllergies(String knownAllergies) {
                this.knownAllergies = knownAllergies;
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

            public String getIsActive() {
                return isActive;
            }

            public void setIsActive(String isActive) {
                this.isActive = isActive;
            }

            public String getAayushUniqueId() {
                return aayushUniqueId;
            }

            public void setAayushUniqueId(String aayushUniqueId) {
                this.aayushUniqueId = aayushUniqueId;
            }

            public String getDialCode() {
                return dialCode;
            }

            public void setDialCode(String dialCode) {
                this.dialCode = dialCode;
            }

            public String getSalutation() {
                return salutation;
            }

            public void setSalutation(String salutation) {
                this.salutation = salutation;
            }

            public String getEmergencyDialCode() {
                return emergencyDialCode;
            }

            public void setEmergencyDialCode(String emergencyDialCode) {
                this.emergencyDialCode = emergencyDialCode;
            }

            public String getEmergencyMobileNo() {
                return emergencyMobileNo;
            }

            public void setEmergencyMobileNo(String emergencyMobileNo) {
                this.emergencyMobileNo = emergencyMobileNo;
            }

            public String getBloodBankProductId() {
                return bloodBankProductId;
            }

            public void setBloodBankProductId(String bloodBankProductId) {
                this.bloodBankProductId = bloodBankProductId;
            }

            public String getPatientBloodGroup() {
                return patientBloodGroup;
            }

            public void setPatientBloodGroup(String patientBloodGroup) {
                this.patientBloodGroup = patientBloodGroup;
            }

            public Integer getIsKycVerified() {
                return isKycVerified;
            }

            public void setIsKycVerified(Integer isKycVerified) {
                this.isKycVerified = isKycVerified;
            }

        }

    }


    public static class VerifyRequest{

        @SerializedName("hospital_id")
        @Expose
        private String hospitalId;
        @SerializedName("abhaAddress")
        @Expose
        private String abhaAddress;

        @SerializedName("abhaNumber")
        @Expose
        private String abhaNumber;


        public String getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(String hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getAbhaNumber() {
            return abhaNumber;
        }

        public void setAbhaNumber(String abhaNumber) {
            this.abhaNumber = abhaNumber;
        }

    }


}