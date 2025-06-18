package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class BloodGroupResponse {
    @SerializedName("name")
    String name;

    @SerializedName("id")
    int id;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
