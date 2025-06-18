package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class ConsultationStatusResponse {
    @SerializedName("id")
    int id;
    @SerializedName("process_description")
    String process_description;
    @SerializedName("created_at")
    String created_at;
    @SerializedName("process_name")
    String process_name;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProcess_description() {
        return process_description;
    }

    public void setProcess_description(String process_description) {
        this.process_description = process_description;
    }

    public String getProcess_name() {
        return process_name;
    }

    public void setProcess_name(String process_name) {
        this.process_name = process_name;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }
}
