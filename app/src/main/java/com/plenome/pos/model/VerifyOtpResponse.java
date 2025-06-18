package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class VerifyOtpResponse {


    @SerializedName("gender")
    String gender;

    @SerializedName("name")
    String name;

    @SerializedName("email")
    String email;

    @SerializedName("phone")
    String phone;

    @SerializedName("pincode")
    String pincode;

    @SerializedName("birthdate")
    String birthDate;

    @SerializedName("careOf")
    String careof;

    @SerializedName("house")
    String house;

    @SerializedName("street")
    String street;

    @SerializedName("landmark")
    String landmark;

    @SerializedName("locality")
    String locality;

    @SerializedName("villageTownCity")
    String villageTownCity;

    @SerializedName("subDist")
    String subDist;

    @SerializedName("district")
    String district;


    @SerializedName("state")
    String state;

    @SerializedName("postOffice")
    String postOffice;

    @SerializedName("txnId")
    String txnId;

    @SerializedName("healthIdNumber")
    String healthIdNumber;

    @SerializedName("new")
    Boolean newBool;

    @SerializedName("statusCode")
    String statusCode;

    @SerializedName("message")
    String message;

    @SerializedName("photo")
    String photo;
    JwtResponse jwtResponse;

    public JwtResponse getJwtResponse() {
        return jwtResponse;
    }

    public void setJwtResponse(JwtResponse jwtResponse) {
        this.jwtResponse = jwtResponse;
    }

    public String getPhoto() {
        return photo;
    }

    public void getPhoto(String photo) {
        this.photo = photo;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getCareof() {
        return careof;
    }

    public void setCareof(String careof) {
        this.careof = careof;
    }

    public String getHouse() {
        return house;
    }

    public void setHouse(String house) {
        this.house = house;
    }

    public String getHealthIdNumber() {
        return healthIdNumber;
    }

    public void setHealthIdNumber(String healthIdNumber) {
        this.healthIdNumber = healthIdNumber;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getSubDist() {
        return subDist;
    }

    public void setSubDist(String subDist) {
        this.subDist = subDist;
    }

    public String getLandmark() {
        return landmark;
    }

    public void setLandmark(String landmark) {
        this.landmark = landmark;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getVillageTownCity() {
        return villageTownCity;
    }

    public void setVillageTownCity(String villageTownCity) {
        this.villageTownCity = villageTownCity;
    }

    public String getPostOffice() {
        return postOffice;
    }

    public void setPostOffice(String postOffice) {
        this.postOffice = postOffice;
    }

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public Boolean getNewBool() {
        return newBool;
    }

    public void setNewBool(Boolean newBool) {
        this.newBool = newBool;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public class JwtResponse {

        @SerializedName("token")
        String token;

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
