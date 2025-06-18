package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class ExistPatientDetail {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("details")
    @Expose
    private List<Detail> details;

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

    public List<Detail> getDetails() {
        return details;
    }

    public void setDetails(List<Detail> details) {
        this.details = details;
    }

    public class Detail {

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
        @SerializedName("abha_address")
        @Expose
        private String abhaAddress;
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
        @SerializedName("patient_blood_group")
        @Expose
        private String patientBloodGroup;

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

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
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

        public String getPatientBloodGroup() {
            return patientBloodGroup;
        }

        public void setPatientBloodGroup(String patientBloodGroup) {
            this.patientBloodGroup = patientBloodGroup;
        }

    }
}