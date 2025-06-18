package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;


public class ClinicalNotesRequestResponse {

    @SerializedName("followUp")
    @Expose
    private FollowUp followUp;
    @SerializedName("dietPlan")
    @Expose
    private DietPlan dietPlan;
    @SerializedName("diagnosisReport")
    @Expose
    private List<DiagnosisReport> diagnosisReport;
    @SerializedName("treatmentAdvice")
    @Expose
    private TreatmentAdvice treatmentAdvice;
    @SerializedName("pastTreatmentHistory")
    @Expose
    private PastTreatmentHistory pastTreatmentHistory;
    @SerializedName("pastTreatmentHistoryDocs")
    @Expose
    private List<PastTreatmentHistoryDoc> pastTreatmentHistoryDocs;
    @SerializedName("chiefComplaintsBasic")
    @Expose
    private List<ChiefComplaintsBasic> chiefComplaintsBasic;
    @SerializedName("chiefComplaintDetails")
    @Expose
    private ChiefComplaintDetails chiefComplaintDetails;
    @SerializedName("hospital_id")
    @Expose
    private Integer hospitalId;

    public FollowUp getFollowUp() {
        return followUp;
    }

    public void setFollowUp(FollowUp followUp) {
        this.followUp = followUp;
    }

    public DietPlan getDietPlan() {
        return dietPlan;
    }

    public void setDietPlan(DietPlan dietPlan) {
        this.dietPlan = dietPlan;
    }

    public List<DiagnosisReport> getDiagnosisReport() {
        return diagnosisReport;
    }

    public void setDiagnosisReport(List<DiagnosisReport> diagnosisReport) {
        this.diagnosisReport = diagnosisReport;
    }

    public TreatmentAdvice getTreatmentAdvice() {
        return treatmentAdvice;
    }

    public void setTreatmentAdvice(TreatmentAdvice treatmentAdvice) {
        this.treatmentAdvice = treatmentAdvice;
    }

    public PastTreatmentHistory getPastTreatmentHistory() {
        return pastTreatmentHistory;
    }

    public void setPastTreatmentHistory(PastTreatmentHistory pastTreatmentHistory) {
        this.pastTreatmentHistory = pastTreatmentHistory;
    }

    public List<PastTreatmentHistoryDoc> getPastTreatmentHistoryDocs() {
        return pastTreatmentHistoryDocs;
    }

    public void setPastTreatmentHistoryDocs(List<PastTreatmentHistoryDoc> pastTreatmentHistoryDocs) {
        this.pastTreatmentHistoryDocs = pastTreatmentHistoryDocs;
    }

    public List<ChiefComplaintsBasic> getChiefComplaintsBasic() {
        return chiefComplaintsBasic;
    }

    public void setChiefComplaintsBasic(List<ChiefComplaintsBasic> chiefComplaintsBasic) {
        this.chiefComplaintsBasic = chiefComplaintsBasic;
    }

    public ChiefComplaintDetails getChiefComplaintDetails() {
        return chiefComplaintDetails;
    }

    public void setChiefComplaintDetails(ChiefComplaintDetails chiefComplaintDetails) {
        this.chiefComplaintDetails = chiefComplaintDetails;
    }

    public Integer getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Integer hospitalId) {
        this.hospitalId = hospitalId;
    }

    public static class ChiefComplaintDetails {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("count")
        @Expose
        private String count;
        @SerializedName("duration_limit")
        @Expose
        private String durationLimit;
        @SerializedName("remarks")
        @Expose
        private String remarks;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getCount() {
            return count;
        }

        public void setCount(String count) {
            this.count = count;
        }

        public String getDurationLimit() {
            return durationLimit;
        }

        public void setDurationLimit(String durationLimit) {
            this.durationLimit = durationLimit;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class ChiefComplaintsBasic {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("complaint_name")
        @Expose
        private String complaintName;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getComplaintName() {
            return complaintName;
        }

        public void setComplaintName(String complaintName) {
            this.complaintName = complaintName;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }
    public static class DiagnosisReport {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("test_categories")
        @Expose
        private String testCategories;
        @SerializedName("sub_category")
        @Expose
        private String subCategory;
        @SerializedName("laboratory")
        @Expose
        private String laboratory;
        @SerializedName("remarks")
        @Expose
        private String remarks;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getTestCategories() {
            return testCategories;
        }

        public void setTestCategories(String testCategories) {
            this.testCategories = testCategories;
        }

        public String getSubCategory() {
            return subCategory;
        }

        public void setSubCategory(String subCategory) {
            this.subCategory = subCategory;
        }

        public String getLaboratory() {
            return laboratory;
        }

        public void setLaboratory(String laboratory) {
            this.laboratory = laboratory;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class DietPlan {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("diet_plan")
        @Expose
        private String dietPlan;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getDietPlan() {
            return dietPlan;
        }

        public void setDietPlan(String dietPlan) {
            this.dietPlan = dietPlan;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class FollowUp {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("count")
        @Expose
        private String count;
        @SerializedName("duration_limit")
        @Expose
        private String durationLimit;
        @SerializedName("date")
        @Expose
        private String date;
        @SerializedName("remarks")
        @Expose
        private String remarks;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getCount() {
            return count;
        }

        public void setCount(String count) {
            this.count = count;
        }

        public String getDurationLimit() {
            return durationLimit;
        }

        public void setDurationLimit(String durationLimit) {
            this.durationLimit = durationLimit;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class PastTreatmentHistory {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("history")
        @Expose
        private String history;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getHistory() {
            return history;
        }

        public void setHistory(String history) {
            this.history = history;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class PastTreatmentHistoryDoc {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("documents")
        @Expose
        private String documents;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getDocuments() {
            return documents;
        }

        public void setDocuments(String documents) {
            this.documents = documents;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class TreatmentAdvice {

        @SerializedName("opd_id")
        @Expose
        private Integer opdId;
        @SerializedName("advice")
        @Expose
        private String advice;
        @SerializedName("filled_using")
        @Expose
        private String filledUsing;

        public Integer getOpdId() {
            return opdId;
        }

        public void setOpdId(Integer opdId) {
            this.opdId = opdId;
        }

        public String getAdvice() {
            return advice;
        }

        public void setAdvice(String advice) {
            this.advice = advice;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

    }

    public static class ConsentRequestResponsedata {

        @SerializedName("status")
        @Expose
        private String status;
        @SerializedName("messege")
        @Expose
        private String messege;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getMessege() {
            return messege;
        }

        public void setMessege(String messege) {
            this.messege = messege;
        }

    }

}

