package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class UpdatePatientResponse {

    @SerializedName("status")
    String status;
    @SerializedName("message")
    String message;

    @SerializedName("updated_Patient_Profile")
    Details details;

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

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

    public class Details {
        @SerializedName("id")
        int patientId;

        @SerializedName("patient_name")
        String patientName;

        @SerializedName("age")
        int age;
        @SerializedName("image")
        @Expose
        private String image;
        @SerializedName("gender")
        String gender;

        @SerializedName("patient_blood_group")
        String blood_group;

        @SerializedName("mobileno")
        String phone;

        @SerializedName("email")
        String email;

        @SerializedName("ABHA_number")
        String abhaNo;

        @SerializedName("address")
        String address;

        @SerializedName("emergency_mobile_no")
        String emergencyMobileNo;

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getEmergencyMobileNo() {
            return emergencyMobileNo;
        }
        public String getImage() {
            return image;
        }

        public void setEmergencyMobileNo(String emergencyMobileNo) {
            this.emergencyMobileNo = emergencyMobileNo;
        }

        public String getAbhaNo() {
            return abhaNo;
        }

        public void setAbhaNo(String abhaNo) {
            this.abhaNo = abhaNo;
        }

        public int getPatientId() {
            return patientId;
        }

        public void setPatientId(int patientId) {
            this.patientId = patientId;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getBlood_group() {
            return blood_group;
        }

        public void setBlood_group(String blood_group) {
            this.blood_group = blood_group;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }
    }

}
