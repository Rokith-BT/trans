package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class VerifyMobileNumberList {

    @SerializedName("txnId")
    @Expose
    private String txnId;
    @SerializedName("ABHA")
    @Expose
    private List<Abha> abha;

    public String getTxnId() {
        return txnId;
    }

    public void setTxnId(String txnId) {
        this.txnId = txnId;
    }

    public List<Abha> getAbha() {
        return abha;
    }

    public void setAbha(List<Abha> abha) {
        this.abha = abha;
    }
    public static class Abha {

        @SerializedName("index")
        @Expose
        private Integer index;
        @SerializedName("ABHANumber")
        @Expose
        private String aBHANumber;
        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("gender")
        @Expose
        private String gender;

        public Integer getIndex() {
            return index;
        }

        public void setIndex(Integer index) {
            this.index = index;
        }

        public String getABHANumber() {
            return aBHANumber;
        }

        public void setABHANumber(String aBHANumber) {
            this.aBHANumber = aBHANumber;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

    }

}