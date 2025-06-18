package com.plenome.pos.model;

import java.util.List;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;


public class CategoriesResponse {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("details")
    @Expose
    private List<Detail> details;

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

    public List<Detail> getDetails() {
        return details;
    }

    public void setDetails(List<Detail> details) {
        this.details = details;
    }

    public class Detail {

        @SerializedName("id")
        @Expose
        private Integer id;
        @SerializedName("diagnosis_test_category")
        @Expose
        private String diagnosisTestCategory;

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getDiagnosisTestCategory() {
            return diagnosisTestCategory;
        }

        public void setDiagnosisTestCategory(String diagnosisTestCategory) {
            this.diagnosisTestCategory = diagnosisTestCategory;
        }

    }

}

