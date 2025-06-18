package com.plenome.pos.model;

public class AbhaAddressCreationResp {

    private String txnId;
    private String healthIdNumber;
    private String preferredAbhaAddress;

    // Default constructor
    public AbhaAddressCreationResp() {
    }

    // Parameterized constructor
    public AbhaAddressCreationResp(String txnId, String healthIdNumber, String preferredAbhaAddress) {
        this.txnId = txnId;
        this.healthIdNumber = healthIdNumber;
        this.preferredAbhaAddress = preferredAbhaAddress;
    }

    // Getter and Setter for txnId
    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    // Getter and Setter for healthIdNumber
    public String getHealthIdNumber() {
        return healthIdNumber;
    }

    public void setHealthIdNumber(String healthIdNumber) {
        this.healthIdNumber = healthIdNumber;
    }

    // Getter and Setter for preferredAbhaAddress
    public String getPreferredAbhaAddress() {
        return preferredAbhaAddress;
    }

    public void setPreferredAbhaAddress(String preferredAbhaAddress) {
        this.preferredAbhaAddress = preferredAbhaAddress;
    }

    @Override
    public String toString() {
        return "ApiResponseData{" +
                "txnId='" + txnId + '\'' +
                ", healthIdNumber='" + healthIdNumber + '\'' +
                ", preferredAbhaAddress='" + preferredAbhaAddress + '\'' +
                '}';
    }
}