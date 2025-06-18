package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class GetDoctorSlotResponse {
    @SerializedName("slotId")
    int slotId;

    @SerializedName("slot_timing")
    String slotTime;
    @SerializedName("day")
    String day;
    @SerializedName("shiftId")
    int shiftId;
    @SerializedName("shiftName")
    String shiftName;
    @SerializedName("global_shift_id")
    int globalShiftId;

    public int getGlobalShiftId() {
        return globalShiftId;
    }

    public void setGlobalShiftId(int globalShiftId) {
        this.globalShiftId = globalShiftId;
    }

    public int getSlotId() {
        return slotId;
    }

    public void setSlotId(int slotId) {
        this.slotId = slotId;
    }

    public String getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(String slotTime) {
        this.slotTime = slotTime;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public int getShiftId() {
        return shiftId;
    }

    public void setShiftId(int shiftId) {
        this.shiftId = shiftId;
    }

    public String getShiftName() {
        return shiftName;
    }

    public void setShiftName(String shiftName) {
        this.shiftName = shiftName;
    }
}