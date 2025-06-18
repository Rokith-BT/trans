package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class GetV2DoctorResponse {

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
    private List<Datum> data;
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

    public List<Datum> getData() {
        return data;
    }

    public void setData(List<Datum> data) {
        this.data = data;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public class Datum {

        @SerializedName("doctor_name")
        @Expose
        private String doctorName;
        @SerializedName("email")
        @Expose
        private String email;
        @SerializedName("doctor_id")
        @Expose
        private Integer doctorId;
        @SerializedName("gender")
        @Expose
        private String gender;
        @SerializedName("image")
        @Expose
        private String image;
        @SerializedName("qualification")
        @Expose
        private String qualification;
        @SerializedName("experience")
        @Expose
        private String experience;
        @SerializedName("rating")
        @Expose
        private String rating;
        @SerializedName("specialist_names")
        @Expose
        private String specialistNames;
        @SerializedName("standard_charge")
        @Expose
        private Double standardCharge;
        @SerializedName("hospital_name")
        @Expose
        private String hospitalName;
        @SerializedName("hospital_opening_timing")
        @Expose
        private String hospitalOpeningTiming;
        @SerializedName("charge_id")
        @Expose
        private Integer chargeId;
        @SerializedName("tax_percentage")
        @Expose
        private String taxPercentage;
        @SerializedName("tax")
        @Expose
        private Double tax;
        @SerializedName("Totalamount")
        @Expose
        private Double totalamount;

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Integer getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(Integer doctorId) {
            this.doctorId = doctorId;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getQualification() {
            return qualification;
        }

        public void setQualification(String qualification) {
            this.qualification = qualification;
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

        public String getSpecialistNames() {
            return specialistNames;
        }

        public void setSpecialistNames(String specialistNames) {
            this.specialistNames = specialistNames;
        }

        public Double getStandardCharge() {
            return standardCharge;
        }

        public void setStandardCharge(Double standardCharge) {
            this.standardCharge = standardCharge;
        }

        public String getHospitalName() {
            return hospitalName;
        }

        public void setHospitalName(String hospitalName) {
            this.hospitalName = hospitalName;
        }

        public String getHospitalOpeningTiming() {
            return hospitalOpeningTiming;
        }

        public void setHospitalOpeningTiming(String hospitalOpeningTiming) {
            this.hospitalOpeningTiming = hospitalOpeningTiming;
        }

        public Integer getChargeId() {
            return chargeId;
        }

        public void setChargeId(Integer chargeId) {
            this.chargeId = chargeId;
        }

        public String getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(String taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public Double getTax() {
            return tax;
        }

        public void setTax(Double tax) {
            this.tax = tax;
        }

        public Double getTotalamount() {
            return totalamount;
        }

        public void setTotalamount(Double totalamount) {
            this.totalamount = totalamount;
        }

    }

}