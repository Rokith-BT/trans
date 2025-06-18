package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class AddNewPatientResp {
    @SerializedName("id")
    int patientId;

    @SerializedName("patient_name")
    String patientName;

    @SerializedName("dob")
    String dob;

    @SerializedName("age")
    int age;


    @SerializedName("gender")
    String gender;


    @SerializedName("patient_blood_group")
    String blood_group;


    @SerializedName("mobileno")
    String phone;

    @SerializedName("email")
    String email;

    @SerializedName("address")
    String address;

    @SerializedName("ABHA_number")
    String abhaNo;

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
