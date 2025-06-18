package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class GetDoctorResponse {

    @SerializedName("doctorId")
    int internalDoctorId;
    @SerializedName("doctorName")
    String internalDoctorName;
    @SerializedName("doctor_id")
    int doctorId;
    @SerializedName("doctor_name")
    String doctorName;
    @SerializedName("image")
    String image;
    @SerializedName("experience")
    String experience;

    @SerializedName("qualification")
    String qualification;
    @SerializedName("rating")
    String rating;
    @SerializedName("specialist_names")
    String specialist_names;
    @SerializedName("hospital_opening_timing")
    String timings;
    @SerializedName("day")
    String day;
    @SerializedName("tax_percentage")
    String tax_percentage;
    @SerializedName("standard_charge")
    double standard_charge;
    @SerializedName("charge_id")
    int charge_id;
    @SerializedName("tax")
    double tax;
    @SerializedName("Totalamount")
    double Totalamount;

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public int getInternalDoctorId() {
        return internalDoctorId;
    }

    public void setInternalDoctorId(int internalDoctorId) {
        this.internalDoctorId = internalDoctorId;
    }

    public String getInternalDoctorName() {
        return internalDoctorName;
    }

    public void setInternalDoctorName(String internalDoctorName) {
        this.internalDoctorName = internalDoctorName;
    }

    public int getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(int doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getSpecialist_names() {
        return specialist_names;
    }

    public void setSpecialist_names(String specialist_names) {
        this.specialist_names = specialist_names;
    }

    public String getTimings() {
        return timings;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getTax() {
        return tax;
    }

    public void setTimings(String timings) {
        this.timings = timings;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public double getStandard_charge() {
        return standard_charge;
    }

    public void setStandard_charge(double standard_charge) {
        this.standard_charge = standard_charge;
    }

    public String getTax_percentage() {
        return tax_percentage;
    }

    public void setTax_percentage(String tax_percentage) {
        this.tax_percentage = tax_percentage;
    }

    public int getCharge_id() {
        return charge_id;
    }

    public void setCharge_id(int charge_id) {
        this.charge_id = charge_id;
    }

    public double getTotalamount() {
        return Totalamount;
    }

    public void setTotalamount(double totalamount) {
        Totalamount = totalamount;
    }
}
