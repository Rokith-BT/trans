package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class PendingBillResponse {
    @SerializedName("patientDetails")
    ArrayList<PatientDetails> patientDetailsAL;
    @SerializedName("pendingDetails")
    ArrayList<PendingDetails> pendingDetailsAL;
    @SerializedName("totalDue")
    double totalDue;

    public double getTotalDue() {
        return totalDue;
    }

    public void setTotalDue(double totalDueAL) {
        this.totalDue = totalDueAL;
    }

    public ArrayList<PatientDetails> getPatientDetailsAL() {
        return patientDetailsAL;
    }

    public void setPatientDetailsAL(ArrayList<PatientDetails> patientDetailsAL) {
        this.patientDetailsAL = patientDetailsAL;
    }

    public ArrayList<PendingDetails> getPendingDetailsAL() {
        return pendingDetailsAL;
    }

    public void setPendingDetailsAL(ArrayList<PendingDetails> pendingDetailsAL) {
        this.pendingDetailsAL = pendingDetailsAL;
    }


    public class PatientDetails {
        @SerializedName("patient_name")
        String patientName;
        @SerializedName("gender")
        String gender;
        @SerializedName("age")
        int age;
        @SerializedName("id")
        int id;
        @SerializedName("mobileno")
        String mobileno;
        @SerializedName("email")
        String email;

        public String getMobileno() {
            return mobileno;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getEmail() {
            return email;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }

    public class PendingDetails {
        @SerializedName("section")
        String section;
        @SerializedName("section_id")
        String sectionId;
        @SerializedName("date")
        String date;
        @SerializedName("chargeDescription")
        String chargeDescription;
        @SerializedName("qty")
        int qty;
        @SerializedName("discount_amount")
        double discount;
        @SerializedName("charges")
        double charges;
        @SerializedName("taxPercentage")
        double taxPercentage;
        @SerializedName("total")
        double total;
        @SerializedName("patient_charge_id")
        int patientChargeId;



        @SerializedName("additional_charge")
        int additionalCharge;

        public double getDiscount() {
            return discount;
        }

        public void setDiscount(double discount) {
            this.discount = discount;
        }

        public String getSectionId() {
            return sectionId;
        }

        public void setSectionId(String sectionId) {
            this.sectionId = sectionId;
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

        public double getCharges() {
            return charges;
        }

        public void setCharges(double charges) {
            this.charges = charges;
        }

        public String getChargeDescription() {
            return chargeDescription;
        }

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }

        public int getPatientChargeId() {
            return patientChargeId;
        }

        public void setPatientChargeId(int id) {
            this.patientChargeId = id;
        }

        public double getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(double taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }
        public int getAdditionalCharge() {
            return additionalCharge;
        }

        public void setAdditionalCharge(int additionalCharge) {
            this.additionalCharge = additionalCharge;
        }
    }

    public class TotalDue {
        @SerializedName("total")
        double total;

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }
    }
}
