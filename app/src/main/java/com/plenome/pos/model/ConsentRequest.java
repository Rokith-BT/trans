package com.plenome.pos.model;

import java.util.List;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;


public class ConsentRequest {

    @SerializedName("purpose")
    @Expose
    private Purpose purpose;
    @SerializedName("abhaAddress")
    @Expose
    private String abhaAddress;
    @SerializedName("hiuId")
    @Expose
    private String hiuId;
    @SerializedName("permission")
    @Expose
    private Permission permission;
    @SerializedName("hiTypes")
    @Expose
    private List<String> hiTypes;
    @SerializedName("employeeId")
    @Expose
    private String employeeId;
    @SerializedName("staffName")
    @Expose
    private String staffName;

    public Purpose getPurpose() {
        return purpose;
    }

    public void setPurpose(Purpose purpose) {
        this.purpose = purpose;
    }

    public String getAbhaAddress() {
        return abhaAddress;
    }

    public void setAbhaAddress(String abhaAddress) {
        this.abhaAddress = abhaAddress;
    }

    public String getHiuId() {
        return hiuId;
    }

    public void setHiuId(String hiuId) {
        this.hiuId = hiuId;
    }

    public Permission getPermission() {
        return permission;
    }

    public void setPermission(Permission permission) {
        this.permission = permission;
    }

    public List<String> getHiTypes() {
        return hiTypes;
    }

    public void setHiTypes(List<String> hiTypes) {
        this.hiTypes = hiTypes;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }
    public static class Purpose {

        @SerializedName("text")
        @Expose
        private String text;
        @SerializedName("code")
        @Expose
        private String code;
        @SerializedName("refUri")
        @Expose
        private String refUri;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getRefUri() {
            return refUri;
        }

        public void setRefUri(String refUri) {
            this.refUri = refUri;
        }

    }
    public static class Permission {

        @SerializedName("accessMode")
        @Expose
        private String accessMode;
        @SerializedName("dataEraseAt")
        @Expose
        private String dataEraseAt;
        @SerializedName("dateRange")
        @Expose
        private DateRange dateRange;
        @SerializedName("frequency")
        @Expose
        private Frequency frequency;

        public String getAccessMode() {
            return accessMode;
        }

        public void setAccessMode(String accessMode) {
            this.accessMode = accessMode;
        }

        public String getDataEraseAt() {
            return dataEraseAt;
        }

        public void setDataEraseAt(String dataEraseAt) {
            this.dataEraseAt = dataEraseAt;
        }

        public DateRange getDateRange() {
            return dateRange;
        }

        public void setDateRange(DateRange dateRange) {
            this.dateRange = dateRange;
        }

        public Frequency getFrequency() {
            return frequency;
        }

        public void setFrequency(Frequency frequency) {
            this.frequency = frequency;
        }
        public static class DateRange {

            @SerializedName("from")
            @Expose
            private String from;
            @SerializedName("to")
            @Expose
            private String to;

            public String getFrom() {
                return from;
            }

            public void setFrom(String from) {
                this.from = from;
            }

            public String getTo() {
                return to;
            }

            public void setTo(String to) {
                this.to = to;
            }

        }
        public static class Frequency {

            @SerializedName("repeats")
            @Expose
            private Integer repeats;
            @SerializedName("unit")
            @Expose
            private String unit;
            @SerializedName("value")
            @Expose
            private Integer value;

            public Integer getRepeats() {
                return repeats;
            }

            public void setRepeats(Integer repeats) {
                this.repeats = repeats;
            }

            public String getUnit() {
                return unit;
            }

            public void setUnit(String unit) {
                this.unit = unit;
            }

            public Integer getValue() {
                return value;
            }

            public void setValue(Integer value) {
                this.value = value;
            }

        }

    }
}







