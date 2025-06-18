package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

public class GetPatientProfileResponse {
    @SerializedName("patient")
    Patient patient;

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @SerializedName("Records")
    List<Records> records;

    public List<Records> getRecords() {
        return records;
    }

    public void setRecords(List<Records> records) {
        this.records = records;
    }

    public class Patient {
        @SerializedName("id")
        int id;
        @SerializedName("patient_name")
        String patientName;

        @SerializedName("dob")
        String dob;

        @SerializedName("age")
        int age;

        @SerializedName("gender")
        String gender;

        @SerializedName("mobileno")
        String mobileno;

        @SerializedName("email")
        String email;

        @SerializedName("address")
        String address;

        @SerializedName("patient_blood_group")
        String bloodGroup;

        @SerializedName("ABHA_number")
        String abhaNo;
        @SerializedName("image")
        String imageName;
        @SerializedName("salutation")
        String salutation;
        @SerializedName("dial_code")
        String dialCode;

        @SerializedName("known_allergies")
        String knownAllergies;

        @SerializedName("marital_status")
        String marital_status;

        @SerializedName("emergency_mobile_no")
        String emergencyNo;

        @SerializedName("abha_address")
        String abhaAddress;

        @SerializedName("aayush_unique_id")
        String aayushUniqueId;

        @SerializedName("is_kyc_verified")
        Integer iskycverified;

        @SerializedName("insurance_id")
        String insuranceId;

        @SerializedName("insurance_validity")
        String insurance_validity;



        public String getInsurance_validity() {
            return insurance_validity;
        }

        public void setInsurance_validity(String insurance_validity) {
            this.insurance_validity = insurance_validity;
        }

        public String getInsuranceId() {
            return insuranceId;
        }

        public void setInsuranceId(String insuranceId) {
            this.insuranceId = insuranceId;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getEmergencyNo() {
            return emergencyNo;
        }

        public void setEmergencyNo(String emergencyNo) {
            this.emergencyNo = emergencyNo;
        }

        public String getMarital_status() {
            return marital_status;
        }

        public void setMarital_status(String marital_status) {
            this.marital_status = marital_status;
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

        public String getKnownAllergies() {
            return knownAllergies;
        }

        public void setKnownAllergies(String knownAllergies) {
            this.knownAllergies = knownAllergies;
        }

        public String getImageName() {
            return imageName;
        }

        public void setImageName(String imageName) {
            this.imageName = imageName;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
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

        public String getAbhaNo() {
            return abhaNo;
        }

        public void setAbhaNo(String abhaNo) {
            this.abhaNo = abhaNo;
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

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getBloodGroup() {
            return bloodGroup;
        }

        public void setBloodGroup(String bloodGroup) {
            this.bloodGroup = bloodGroup;
        }

        public String getAayushUniqueId() {
            return aayushUniqueId;
        }

        public void setAayushUniqueId(String aayushUniqueId) {
            this.aayushUniqueId = aayushUniqueId;
        }

        public Integer getIskycverified() {
            return iskycverified;
        }

        public void setIskycverified(Integer iskycverified) {
            this.iskycverified = iskycverified;
        }
    }

    public class Records {
        @SerializedName("appointmentNumber")
        String apptNo;

        @SerializedName("appointmentDate")
        String apptDate;

        @SerializedName("appointmentTime")
        String apptTime;

        @SerializedName("patient_id")
        String patientId;

        @SerializedName("record_type_id")
        String recordTypeId;

        @SerializedName("consultingDoctor")
        String consultDoctor;

        @SerializedName("recordType")
        String recordType;
        @SerializedName("records")
        String records;

        public String getRecords() {
            return records;
        }

        public void setRecords(String records) {
            this.records = records;
        }

        public String getApptDate() {
            return apptDate;
        }

        public void setApptDate(String apptDate) {
            this.apptDate = apptDate;
        }

        public String getApptNo() {
            return apptNo;
        }

        public void setApptNo(String apptNo) {
            this.apptNo = apptNo;
        }

        public String getApptTime() {

            return apptTime;
        }

        public void setApptTime(String apptTime) {
            this.apptTime = apptTime;
        }

        public String getConsultDoctor() {
            return consultDoctor;
        }

        public void setConsultDoctor(String consultDoctor) {
            this.consultDoctor = consultDoctor;
        }

        public String getPatientId() {
            return patientId;
        }

        public void setPatientId(String patientId) {
            this.patientId = patientId;
        }

        public String getRecordType() {
            return recordType;
        }

        public void setRecordType(String recordType) {
            this.recordType = recordType;
        }

        public String getRecordTypeId() {
            return recordTypeId;
        }

        public void setRecordTypeId(String recordTypeId) {
            this.recordTypeId = recordTypeId;
        }
    }



    public class AyusRespons {

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

            public Integer getIsKycVerified() {
                return isKycVerified;
            }

            public void setIsKycVerified(Integer isKycVerified) {
                this.isKycVerified = isKycVerified;
            }

        }

    }









    public class AaysuhResponse{

        @SerializedName("status")
        String status;

        @SerializedName("message")
        String message;

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

    public class AaysuhUnqicResponse {

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

        }

    }


    public class AbhaAdderssListResponse {

        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("message")
        @Expose
        private String message;
        @SerializedName("abha_address")
        @Expose
        private List<AbhaAddress> abhaAddress;

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

        public List<AbhaAddress> getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(List<AbhaAddress> abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public class AbhaAddress {

            @SerializedName("abhaAddress")
            @Expose
            private String abhaAddress;

            public String getAbhaAddress() {
                return abhaAddress;
            }

            public void setAbhaAddress(String abhaAddress) {
                this.abhaAddress = abhaAddress;
            }

        }

    }



}