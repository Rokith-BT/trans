package com.plenome.pos.utils;

public class MessageEvent {

    private String aayushNo;
    private String action;

    // Constructor to initialize both fields
    public MessageEvent(String aayushNo, String action) {
        this.aayushNo = aayushNo;
        this.action = action;
    }

    // Getters
    public String getAayushNo() {
        return aayushNo;
    }

    public String getAction() {
        return action;
    }

    // Setters (if needed)
    public void setAayushNo(String aayushNo) {
        this.aayushNo = aayushNo;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
