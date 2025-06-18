package com.plenome.pos.model;

import java.util.List;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class AbhaProfileInfoResponse {

    @SerializedName("ABHANumber")
    @Expose
    private String aBHANumber;
    @SerializedName("preferredAbhaAddress")
    @Expose
    private String preferredAbhaAddress;
    @SerializedName("mobile")
    @Expose
    private String mobile;
    @SerializedName("mobileVerified")
    @Expose
    private Boolean mobileVerified;
    @SerializedName("firstName")
    @Expose
    private String firstName;
    @SerializedName("middleName")
    @Expose
    private String middleName;
    @SerializedName("lastName")
    @Expose
    private String lastName;
    @SerializedName("name")
    @Expose
    private String name;
    @SerializedName("yearOfBirth")
    @Expose
    private String yearOfBirth;
    @SerializedName("dayOfBirth")
    @Expose
    private String dayOfBirth;
    @SerializedName("monthOfBirth")
    @Expose
    private String monthOfBirth;
    @SerializedName("gender")
    @Expose
    private String gender;
    @SerializedName("profilePhoto")
    @Expose
    private String profilePhoto;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("stateCode")
    @Expose
    private String stateCode;
    @SerializedName("districtCode")
    @Expose
    private String districtCode;
    @SerializedName("pincode")
    @Expose
    private String pincode;
    @SerializedName("address")
    @Expose
    private String address;
    @SerializedName("kycPhoto")
    @Expose
    private String kycPhoto;
    @SerializedName("stateName")
    @Expose
    private String stateName;
    @SerializedName("districtName")
    @Expose
    private String districtName;
    @SerializedName("subdistrictName")
    @Expose
    private String subdistrictName;
    @SerializedName("townName")
    @Expose
    private String townName;
    @SerializedName("authMethods")
    @Expose
    private List<String> authMethods;
    @SerializedName("tags")
    @Expose
    private Tags tags;
    @SerializedName("kycVerified")
    @Expose
    private Boolean kycVerified;
    @SerializedName("verificationStatus")
    @Expose
    private String verificationStatus;
    @SerializedName("verificationType")
    @Expose
    private String verificationType;
    @SerializedName("source")
    @Expose
    private String source;
    @SerializedName("localizedDetails")
    @Expose
    private LocalizedDetails localizedDetails;
    @SerializedName("createdDate")
    @Expose
    private String createdDate;
    @SerializedName("imageKey")
    @Expose
    private String imageKey;

    public String getABHANumber() {
        return aBHANumber;
    }

    public void setABHANumber(String aBHANumber) {
        this.aBHANumber = aBHANumber;
    }

    public String getPreferredAbhaAddress() {
        return preferredAbhaAddress;
    }

    public void setPreferredAbhaAddress(String preferredAbhaAddress) {
        this.preferredAbhaAddress = preferredAbhaAddress;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Boolean getMobileVerified() {
        return mobileVerified;
    }

    public void setMobileVerified(Boolean mobileVerified) {
        this.mobileVerified = mobileVerified;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getYearOfBirth() {
        return yearOfBirth;
    }

    public void setYearOfBirth(String yearOfBirth) {
        this.yearOfBirth = yearOfBirth;
    }

    public String getDayOfBirth() {
        return dayOfBirth;
    }

    public void setDayOfBirth(String dayOfBirth) {
        this.dayOfBirth = dayOfBirth;
    }

    public String getMonthOfBirth() {
        return monthOfBirth;
    }

    public void setMonthOfBirth(String monthOfBirth) {
        this.monthOfBirth = monthOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStateCode() {
        return stateCode;
    }

    public void setStateCode(String stateCode) {
        this.stateCode = stateCode;
    }

    public String getDistrictCode() {
        return districtCode;
    }

    public void setDistrictCode(String districtCode) {
        this.districtCode = districtCode;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getKycPhoto() {
        return kycPhoto;
    }

    public void setKycPhoto(String kycPhoto) {
        this.kycPhoto = kycPhoto;
    }

    public String getStateName() {
        return stateName;
    }

    public void setStateName(String stateName) {
        this.stateName = stateName;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }

    public String getSubdistrictName() {
        return subdistrictName;
    }

    public void setSubdistrictName(String subdistrictName) {
        this.subdistrictName = subdistrictName;
    }

    public String getTownName() {
        return townName;
    }

    public void setTownName(String townName) {
        this.townName = townName;
    }

    public List<String> getAuthMethods() {
        return authMethods;
    }

    public void setAuthMethods(List<String> authMethods) {
        this.authMethods = authMethods;
    }

    public Tags getTags() {
        return tags;
    }

    public void setTags(Tags tags) {
        this.tags = tags;
    }

    public Boolean getKycVerified() {
        return kycVerified;
    }

    public void setKycVerified(Boolean kycVerified) {
        this.kycVerified = kycVerified;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getVerificationType() {
        return verificationType;
    }

    public void setVerificationType(String verificationType) {
        this.verificationType = verificationType;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalizedDetails getLocalizedDetails() {
        return localizedDetails;
    }

    public void setLocalizedDetails(LocalizedDetails localizedDetails) {
        this.localizedDetails = localizedDetails;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getImageKey() {
        return imageKey;
    }

    public void setImageKey(String imageKey) {
        this.imageKey = imageKey;
    }

    public class LocalizedDetails {

        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("stateName")
        @Expose
        private String stateName;
        @SerializedName("districtName")
        @Expose
        private String districtName;
        @SerializedName("villageName")
        @Expose
        private String villageName;
        @SerializedName("wardName")
        @Expose
        private String wardName;
        @SerializedName("gender")
        @Expose
        private String gender;
        @SerializedName("localizedLabels")
        @Expose
        private LocalizedLabels localizedLabels;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getStateName() {
            return stateName;
        }

        public void setStateName(String stateName) {
            this.stateName = stateName;
        }

        public String getDistrictName() {
            return districtName;
        }

        public void setDistrictName(String districtName) {
            this.districtName = districtName;
        }

        public String getVillageName() {
            return villageName;
        }

        public void setVillageName(String villageName) {
            this.villageName = villageName;
        }

        public String getWardName() {
            return wardName;
        }

        public void setWardName(String wardName) {
            this.wardName = wardName;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public LocalizedLabels getLocalizedLabels() {
            return localizedLabels;
        }

        public void setLocalizedLabels(LocalizedLabels localizedLabels) {
            this.localizedLabels = localizedLabels;
        }

    }

    public class LocalizedLabels {

        @SerializedName("name")
        @Expose
        private String name;
        @SerializedName("abhaNumber")
        @Expose
        private String abhaNumber;
        @SerializedName("abhaAddress")
        @Expose
        private String abhaAddress;
        @SerializedName("gender")
        @Expose
        private String gender;
        @SerializedName("dob")
        @Expose
        private String dob;
        @SerializedName("mobile")
        @Expose
        private String mobile;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAbhaNumber() {
            return abhaNumber;
        }

        public void setAbhaNumber(String abhaNumber) {
            this.abhaNumber = abhaNumber;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

    }

    public class Tags {

    }
}




