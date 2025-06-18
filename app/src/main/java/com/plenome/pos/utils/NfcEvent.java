package com.plenome.pos.utils;

public class NfcEvent {

    private String aayushNo;
    private String action;

    // Constructor to initialize both fields
    public NfcEvent(String action) {
        this.action = action;
    }

    public String getAction() {
        return action;
    }


    public void setAction(String action) {
        this.action = action;
    }
}
