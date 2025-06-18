package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;


public class ClinicalSuggestion {

    @SerializedName("id")
    @Expose
    private Integer id;
    @SerializedName("chief_complaints")
    @Expose
    private String chiefComplaints;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getChiefComplaints() {
        return chiefComplaints;
    }

    public void setChiefComplaints(String chiefComplaints) {
        this.chiefComplaints = chiefComplaints;
    }

}