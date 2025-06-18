package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class ExistPatientDetResponse {
    @SerializedName("id")
    int id;
    @SerializedName("patient_name")
    String patient_name;

    @SerializedName("message")
    String message;
    @SerializedName("dob")
    String dob;
    @SerializedName("age")
    int age;
    @SerializedName("mobileno")
    String mobileno;
    @SerializedName("email")
    String email;
    @SerializedName("gender")
    String gender;
    @SerializedName("address")
    String address;
    @SerializedName("ABHA_number")
    String abhaNo;
    @SerializedName("abha_address")
    String abha_address;
    @SerializedName("salutation")
    String salutation;
    @SerializedName("dial_code")
    String dial_code;
    @SerializedName("patient_blood_group")
    String bloodGroup;
    @SerializedName("pincode")
    String pincode;
    @SerializedName("emergency_mobile_no")
    String emergency_mobile_no;

    @SerializedName("aayush_unique_id")
    String aayushUniqueId;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmergency_mobile_no() {
        return emergency_mobile_no;
    }

    public void setEmergency_mobile_no(String emergency_mobile_no) {
        this.emergency_mobile_no = emergency_mobile_no;
    }

    public String getSalutation() {
        return salutation;
    }

    public void setSalutation(String salutation) {
        this.salutation = salutation;
    }

    public String getDial_code() {
        return dial_code;
    }

    public void setDial_code(String dial_code) {
        this.dial_code = dial_code;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPatient_name() {
        return patient_name;
    }

    public void setPatient_name(String patient_name) {
        this.patient_name = patient_name;
    }

    public String getAbhaNo() {
        return abhaNo;

    }

    public String getAbhaAddress() {
        return abha_address;

    }

    public void setAbhaAddress(String abhaAddress) {
        this.abha_address = abhaAddress;
    }

    public void setAbhaNo(String abhaNo) {
        this.abhaNo = abhaNo;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
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

    public String getMobileno() {
        return mobileno;
    }

    public void setMobileno(String mobileno) {
        this.mobileno = mobileno;
    }

    public String getAayushUniqueId() {
        return aayushUniqueId;
    }

    public void setAayushUniqueId(String aayushUniqueId) {
        this.aayushUniqueId = aayushUniqueId;
    }
}
