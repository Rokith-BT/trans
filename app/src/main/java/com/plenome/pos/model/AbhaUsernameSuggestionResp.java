package com.plenome.pos.model;

import java.util.ArrayList;

public class AbhaUsernameSuggestionResp {
    private String txnId;
    private ArrayList<String> abhaAddressList;

    // Default constructor
    public AbhaUsernameSuggestionResp() {}

    // Parameterized constructor
    public AbhaUsernameSuggestionResp(String txnId, ArrayList<String> abhaAddressList) {
        this.txnId = txnId;
        this.abhaAddressList = abhaAddressList;
    }

    // Getter for txnId
    public String getTxnId() {
        return txnId;
    }

    // Setter for txnId
    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    // Getter for abhaAddressList
    public ArrayList<String> getAbhaAddressList() {
        return abhaAddressList;
    }

    // Setter for abhaAddressList
    public void setAbhaAddressList(ArrayList<String> abhaAddressList) {
        this.abhaAddressList = abhaAddressList;
    }

    @Override
    public String toString() {
        return "ApiResponse{" +
                "txnId='" + txnId + '\'' +
                ", abhaAddressList=" + abhaAddressList +
                '}';
    }
}
