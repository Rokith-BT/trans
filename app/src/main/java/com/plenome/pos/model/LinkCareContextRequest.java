package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

public class LinkCareContextRequest  implements Serializable {

    @SerializedName("abhaAddress")
    private String abhaAddress;

    @SerializedName("patient")
    private List<Patient> patient;

    // Getters and setters
    public String getAbhaAddress() {
        return abhaAddress;
    }

    public void setAbhaAddress(String abhaAddress) {
        this.abhaAddress = abhaAddress;
    }

    public List<Patient> getPatient() {
        return patient;
    }

    public void setPatient(List<Patient> patient) {
        this.patient = patient;
    }

    // Inner class representing the Patient object
    public static class Patient implements Serializable {
        @SerializedName("display")
        private String display;

        @SerializedName("careContexts")
        private List<CareContext> careContexts;

        @SerializedName("hiType")
        private String hiType;

        @SerializedName("count")
        private int count;

        // Getters and setters
        public String getDisplay() {
            return display;
        }

        public void setDisplay(String display) {
            this.display = display;
        }

        public List<CareContext> getCareContexts() {
            return careContexts;
        }

        public void setCareContexts(List<CareContext> careContexts) {
            this.careContexts = careContexts;
        }

        public String getHiType() {
            return hiType;
        }

        public void setHiType(String hiType) {
            this.hiType = hiType;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }
    }

    // Inner class representing the CareContext object
    public static class CareContext implements Serializable {
        @SerializedName("display")
        private String display;

        @SerializedName("doc_key")
        private String docKey;

        // Getters and setters
        public String getDisplay() {
            return display;
        }

        public void setDisplay(String display) {
            this.display = display;
        }

        public String getDocKey() {
            return docKey;
        }

        public void setDocKey(String docKey) {
            this.docKey = docKey;
        }
    }
}
