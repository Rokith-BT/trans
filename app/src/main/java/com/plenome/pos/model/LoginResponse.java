package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

public class LoginResponse {

    @SerializedName("messege")
    String message;
    @SerializedName("message")
    String errMsg;
    @SerializedName("status")
    String status;
    @SerializedName("details")
    Details details;

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public class Details {
        @SerializedName("username")
        String userName;
        @SerializedName("password")
        String password;
        @SerializedName("role_name")
        String roleName;

        @SerializedName("staffName")
        String staffName;
        @SerializedName("staffImage")
        String staffImg;

        @SerializedName("employeeID")
        String employeeID;
        @SerializedName("Hospital_name")
        String hospName;

        @SerializedName("Hospital_address")
        String hospAddress;

        @SerializedName("Hospital_logo")
        String HospitalLogo;

        @SerializedName("Hospital_image")
        String HospitalImage;

        @SerializedName("Hospital_id")
        int hospitalId;

        @SerializedName("Staff_id")
        int staffId;

        @SerializedName("resetStatus")
        int resetStatus;
        @SerializedName("hip_id")
        String hipId;

        @SerializedName("accessToken")
        String accessToken;

        public int getResetStatus() {
            return resetStatus;
        }

        public void setResetStatus(int resetStatus) {
            this.resetStatus = resetStatus;
        }

        public int getStaffId() {
            return staffId;
        }

        public void setStaffId(int staffId) {
            this.staffId = staffId;
        }

        public int getHospitalId() {
            return hospitalId;
        }

        public void setHospitalId(int hospitalId) {
            this.hospitalId = hospitalId;
        }

        public String getStaffImg() {
            return staffImg;
        }

        public void setStaffImg(String staffImg) {
            this.staffImg = staffImg;
        }

        public String getEmployeeID() {
            return employeeID;
        }

        public void setEmployeeID(String employeeID) {
            this.employeeID = employeeID;
        }


        public String getStaffName() {
            return staffName;
        }

        public void setStaffName(String staffName) {
            this.staffName = staffName;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRoleName() {
            return roleName;
        }

        public void setRoleName(String roleName) {
            this.roleName = roleName;
        }

        public String getHospName() {
            return hospName;
        }

        public void setHospName(String hospName) {
            this.hospName = hospName;
        }

        public void setHospAddress(String hospAddress) {
            this.hospAddress = hospAddress;
        }

        public String getHospAddress() {
            return hospAddress;
        }

        public String getHospitalLogo() {
            return HospitalLogo;
        }

        public void setHospitalLogo(String hospitalLogo) {
            HospitalLogo = hospitalLogo;
        }

        public String getHospitalImage() {
            return HospitalImage;
        }

        public void setHospitalImage(String hospitalImage) {
            HospitalImage = hospitalImage;
        }

        public String getHipId() {
            return hipId;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public void setHipId(String hipId) {
            this.hipId = hipId;
        }
    }
}
