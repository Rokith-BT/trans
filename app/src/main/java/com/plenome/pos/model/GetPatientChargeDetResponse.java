package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class GetPatientChargeDetResponse {

    @SerializedName("status")
    String status;

    @SerializedName("message")
    String message;

    @SerializedName("details")
    Details details;

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
        @SerializedName("patientCharge_id")
        int patientCharge_id;
        @SerializedName("standard_charge")
        int standard_charge;
        @SerializedName("tax")
        int tax;
        @SerializedName("taxAmount")
        double taxAmount;
        @SerializedName("discount_amount")
        double discount_amount;
        @SerializedName("discount_percentage")
        double discount_percentage;
        @SerializedName("additional_charge")
        double additional_charge;
        @SerializedName("additional_charge_note")
        String additional_charge_note;
        @SerializedName("qty")
        int qty;
        @SerializedName("chargeName")
        String chargeName;
        @SerializedName("chargeId")
        int chargeId;
        @SerializedName("chargeCategoryName")
        String chargeCategoryName;
        @SerializedName("chargeCategoryId")
        int chargeCategoryId;
        @SerializedName("chargeTypeName")
        String chargeTypeName;
        @SerializedName("chargeTypeId")
        int chargeTypeId;

        public int getPatientCharge_id() {
            return patientCharge_id;
        }

        public void setPatientCharge_id(int patientCharge_id) {
            this.patientCharge_id = patientCharge_id;
        }

        public int getStandard_charge() {
            return standard_charge;
        }

        public void setStandard_charge(int standard_charge) {
            this.standard_charge = standard_charge;
        }

        public double getTaxAmount() {
            return taxAmount;
        }

        public void setTax(int tax) {
            this.tax = tax;
        }

        public int getTax() {
            return tax;
        }

        public void setTaxAmount(double taxAmount) {
            this.taxAmount = taxAmount;
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

        public String getAdditional_charge_note() {
            return additional_charge_note;
        }

        public void setAdditional_charge_note(String additional_charge_note) {
            this.additional_charge_note = additional_charge_note;
        }

        public double getAdditional_charge() {
            return additional_charge;
        }

        public void setAdditional_charge(double additional_charge) {
            this.additional_charge = additional_charge;
        }

        public int getQty() {
            return qty;
        }

        public void setQty(int qty) {
            this.qty = qty;
        }

        public String getChargeName() {
            return chargeName;
        }

        public void setChargeName(String chargeName) {
            this.chargeName = chargeName;
        }

        public int getChargeId() {
            return chargeId;
        }

        public void setChargeId(int chargeId) {
            this.chargeId = chargeId;
        }

        public int getChargeCategoryId() {
            return chargeCategoryId;
        }

        public void setChargeCategoryId(int chargeCategoryId) {
            this.chargeCategoryId = chargeCategoryId;
        }

        public int getChargeTypeId() {
            return chargeTypeId;
        }

        public void setChargeTypeId(int chargeTypeId) {
            this.chargeTypeId = chargeTypeId;
        }

        public String getChargeCategoryName() {
            return chargeCategoryName;
        }

        public void setChargeCategoryName(String chargeCategoryName) {
            this.chargeCategoryName = chargeCategoryName;
        }

        public String getChargeTypeName() {
            return chargeTypeName;
        }

        public void setChargeTypeName(String chargeTypeName) {
            this.chargeTypeName = chargeTypeName;
        }

    }
}
