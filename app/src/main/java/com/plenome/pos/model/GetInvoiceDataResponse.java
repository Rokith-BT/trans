package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class GetInvoiceDataResponse {

    @SerializedName("status")
    String status;
    @SerializedName("message")
    String message;
    @SerializedName("total")
    double total;
    @SerializedName("patientDetails")
    PatientDetails patientDetails;
    @SerializedName("hospitalDetails")
    HospitalDetails hospitalDetails;
    @SerializedName("invoiceDetails")
    ArrayList<InvoiceDetails> invoiceDetails;

    public ArrayList<InvoiceDetails> getInvoiceDetails() {
        return invoiceDetails;
    }

    public void setInvoiceDetails(ArrayList<InvoiceDetails> invoiceDetails) {
        this.invoiceDetails = invoiceDetails;
    }

    public PatientDetails getPatientDetails() {
        return patientDetails;
    }

    public void setPatientDetails(PatientDetails patientDetails) {
        this.patientDetails = patientDetails;
    }

    public HospitalDetails getHospitalDetails() {
        return hospitalDetails;
    }

    public void setHospitalDetails(HospitalDetails hospitalDetails) {
        this.hospitalDetails = hospitalDetails;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
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

    public class PatientDetails {

        @SerializedName("patient_name")
        String patient_name;
        @SerializedName("mobileno")
        String mobileno;
        @SerializedName("email")
        String email;
        @SerializedName("address")
        String address;

        public String getPatient_name() {
            return patient_name;
        }

        public void setPatient_name(String patient_name) {
            this.patient_name = patient_name;
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

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public class HospitalDetails {

        @SerializedName("hospital_name")
        String hospital_name;
        @SerializedName("contact_no")
        String contact_no;
        @SerializedName("address")
        String address;
        @SerializedName("website")
        String website;

        public String getHospital_name() {
            return hospital_name;
        }

        public void setHospital_name(String hospital_name) {
            this.hospital_name = hospital_name;
        }

        public String getContact_no() {
            return contact_no;
        }

        public void setContact_no(String contact_no) {
            this.contact_no = contact_no;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getWebsite() {
            return website;
        }

        public void setWebsite(String website) {
            this.website = website;
        }
    }

    public class InvoiceDetails {
        @SerializedName("qty")
        int qty;
        @SerializedName("standard_charge")
        double standard_charge;
        @SerializedName("taxPercentage")
        double taxPercentage;
        @SerializedName("taxAmount")
        double taxAmount;
        @SerializedName("additional_charge")
        double additional_charge;
        @SerializedName("discount_amount")
        double discount_amount;
        @SerializedName("discount_percentage")
        double discount_percentage;
        @SerializedName("total")
        double total;
        @SerializedName("chargeName")
        String chargeName;

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }

        public double getStandard_charge() {
            return standard_charge;
        }

        public void setStandard_charge(double standard_charge) {
            this.standard_charge = standard_charge;
        }

        public double getAdditional_charge() {
            return additional_charge;
        }

        public void setAdditional_charge(double additional_charge) {
            this.additional_charge = additional_charge;
        }

        public double getDiscount_amount() {
            return discount_amount;
        }

        public void setDiscount_amount(double discount_amount) {
            this.discount_amount = discount_amount;
        }

        public double getDiscount_percentage() {
            return discount_percentage;
        }

        public void setDiscount_percentage(double discount_percentage) {
            this.discount_percentage = discount_percentage;
        }

        public double getTotal() {
            return total;
        }

        public void setTotal(double total) {
            this.total = total;
        }

        public String getChargeName() {
            return chargeName;
        }

        public void setChargeName(String chargeName) {
            this.chargeName = chargeName;
        }

        public double getTaxAmount() {
            return taxAmount;
        }

        public void setTaxAmount(double taxAmount) {
            this.taxAmount = taxAmount;
        }

        public double getTaxPercentage() {
            return taxPercentage;
        }

        public void setTaxPercentage(double taxPercentage) {
            this.taxPercentage = taxPercentage;
        }

    }
}
