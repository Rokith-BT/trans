package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class DataResponse {

    @SerializedName("status")
    String status;
    @SerializedName("messege")
    String message;
    @SerializedName("message")
    String errorMessage;

    @SerializedName("patient_type")
    String patientType;
    @SerializedName("details")
    Details details;

    @SerializedName("existing_patient_details")
    ExistingPatientDetails existingPatientDetails;

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public String getPatientType() {
        return patientType;
    }

    public void setPatientType(String patientType) {
        this.patientType = patientType;
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

    public ExistingPatientDetails getExistingPatientDetails() {
        return existingPatientDetails;
    }

    public void setExistingPatientDetails(ExistingPatientDetails existingPatientDetails) {
        this.existingPatientDetails = existingPatientDetails;
    }

    public class Details {
        @SerializedName("id")
        int patientId;

        @SerializedName("patient_name")
        String patientName;

        @SerializedName("age")
        int age;

        @SerializedName("gender")
        String gender;

        @SerializedName("dial_code")
        String dialCode;

        @SerializedName("salutation")
        String salutation;

        @SerializedName("patient_blood_group")
        String blood_group;
        @SerializedName("aayush_unique_id")
        private String aayushUniqueId;
        @SerializedName("mobileno")
        String phone;

        @SerializedName("email")
        String email;

        @SerializedName("pincode")
        String pincode;

        @SerializedName("dob")
        String dob;

        @SerializedName("address")
        String address;

        @SerializedName("emergency_mobile_no")
        String emergencyNo;

        @SerializedName("ABHA_number")
        String abhaNo;

        @SerializedName("abha_address")
        String abha_address;

        public String getAbhaAddress() {
            return abha_address;

        }
        public void setAbhaAddress(String abhaAddress) {
            this.abha_address = abhaAddress;
        }

        public String getEmergencyNo() {
            return emergencyNo;
        }

        public void setEmergencyNo(String emergencyNo) {
            this.emergencyNo = emergencyNo;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
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

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getBlood_group() {
            return blood_group;
        }

        public void setBlood_group(String blood_group) {
            this.blood_group = blood_group;
        }

        public String getAayushUniqueId() {
            return aayushUniqueId;
        }

        public void setAayushUniqueId(String aayushUniqueId) {
            this.aayushUniqueId = aayushUniqueId;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
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
    }

    public class ExistingPatientDetails {

        @SerializedName("id")

        private String id;
        @SerializedName("patient_name")

        private String patientName;
        @SerializedName("dob")

        private String dob;
        @SerializedName("age")

        private String age;
        @SerializedName("month")

        private String month;
        @SerializedName("day")

        private String day;
        @SerializedName("image")

        private String image;
        @SerializedName("mobileno")

        private String mobileno;
        @SerializedName("email")

        private String email;
        @SerializedName("gender")

        private String gender;
        @SerializedName("marital_status")

        private String maritalStatus;
        @SerializedName("blood_group")

        private String bloodGroup;
        @SerializedName("address")

        private String address;
        @SerializedName("guardian_name")

        private String guardianName;
        @SerializedName("patient_type")

        private String patientType;
        @SerializedName("ABHA_number")

        private String aBHANumber;
        @SerializedName("known_allergies")

        private String knownAllergies;
        @SerializedName("insurance_id")

        private String insuranceId;
        @SerializedName("insurance_validity")

        private String insuranceValidity;
        @SerializedName("is_active")

        private String isActive;
        @SerializedName("aayush_unique_id")

        private String aayushUniqueId;
        @SerializedName("dial_code")

        private String dialCode;
        @SerializedName("salutation")

        private String salutation;
        @SerializedName("emergency_dial_code")

        private String emergencyDialCode;
        @SerializedName("emergency_mobile_no")

        private String emergencyMobileNo;
        @SerializedName("patient_blood_group")

        private String patientBloodGroup;
        @SerializedName("is_kyc_verified")

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
