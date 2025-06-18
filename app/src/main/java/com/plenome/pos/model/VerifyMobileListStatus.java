package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class VerifyMobileListStatus {

    @SerializedName("abhaDetails")
    @Expose

    private List<AbhaDetail> abhaDetails;
    public List<AbhaDetail> getAbhaDetails() {
        return abhaDetails;
    }

    public void setAbhaDetails(List<AbhaDetail> abhaDetails) {
        this.abhaDetails = abhaDetails;
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

        @SerializedName("RegistrationStatus")
        @Expose
        private String RegistrationStatus;


        public String getRegistrationStatus() {
            return RegistrationStatus;
        }

        public void setRegistrationStatus(String registrationStatus) {
            RegistrationStatus = registrationStatus;
        }

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
    public static class AbhaDetail {

        @SerializedName("txnId")
        @Expose
        private String txnId;
        @SerializedName("ABHA")
        @Expose
        private List<Abha> abha;
        @SerializedName("mobile")
        @Expose
        private String mobile;

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

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

    }



    public class VerifyMobileListStatusResponse {

        @SerializedName("data")
        @Expose
        private List<Datum> data;
        @SerializedName("status")
        @Expose
        private String status;

        public List<Datum> getData() {
            return data;
        }

        public void setData(List<Datum> data) {
            this.data = data;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public class Datum {

            @SerializedName("ABHA")
            @Expose
            private List<Abha> abha;
            @SerializedName("mobile")
            @Expose
            private String mobile;
            @SerializedName("txnId")
            @Expose
            private String txnId;

            public List<Abha> getAbha() {
                return abha;
            }

            public void setAbha(List<Abha> abha) {
                this.abha = abha;
            }

            public String getMobile() {
                return mobile;
            }

            public void setMobile(String mobile) {
                this.mobile = mobile;
            }

            public String getTxnId() {
                return txnId;
            }

            public void setTxnId(String txnId) {
                this.txnId = txnId;
            }

            public class Abha {

                @SerializedName("RegistrationStatus")
                @Expose
                private String registrationStatus;
                @SerializedName("ABHANumber")
                @Expose
                private String aBHANumber;
                @SerializedName("gender")
                @Expose
                private String gender;
                @SerializedName("index")
                @Expose
                private Integer index;
                @SerializedName("name")
                @Expose
                private String name;

                public String getRegistrationStatus() {
                    return registrationStatus;
                }

                public void setRegistrationStatus(String registrationStatus) {
                    this.registrationStatus = registrationStatus;
                }

                public String getABHANumber() {
                    return aBHANumber;
                }

                public void setABHANumber(String aBHANumber) {
                    this.aBHANumber = aBHANumber;
                }

                public String getGender() {
                    return gender;
                }

                public void setGender(String gender) {
                    this.gender = gender;
                }

                public Integer getIndex() {
                    return index;
                }

                public void setIndex(Integer index) {
                    this.index = index;
                }

                public String getName() {
                    return name;
                }

                public void setName(String name) {
                    this.name = name;
                }

            }

        }

    }

}