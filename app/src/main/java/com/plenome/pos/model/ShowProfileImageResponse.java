package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class ShowProfileImageResponse {
    @SerializedName("type")
    String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    @SerializedName("data")
    byte[] data;

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}
