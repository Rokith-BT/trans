package com.plenome.pos.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;





public class GetClinicalNotesResponse {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("messege")
    @Expose
    private String messege;
    @SerializedName("details")
    @Expose
    private Details details;

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

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public class Details {

        @SerializedName("OpdDetails")
        @Expose
        private OpdDetails opdDetails;
        @SerializedName("chiefComplaintsBasic")
        @Expose
        private List<ChiefComplaintsBasic> chiefComplaintsBasic;
        @SerializedName("chiefComplaintDetails")
        @Expose
        private ChiefComplaintDetails chiefComplaintDetails;
        @SerializedName("pastTreatmentHistory")
        @Expose
        private PastTreatmentHistory pastTreatmentHistory;
        @SerializedName("pastTreatmentHistoryDocs")
        @Expose
        private List<PastTreatmentHistoryDoc> pastTreatmentHistoryDocs;
        @SerializedName("diagnosisReport")
        @Expose
        private List<DiagnosisReport> diagnosisReport;
        @SerializedName("dietPlan")
        @Expose
        private DietPlan dietPlan;
        @SerializedName("treatmentAdvice")
        @Expose
        private TreatmentAdvice treatmentAdvice;
        @SerializedName("followUp")
        @Expose
        private FollowUp followUp;

        public OpdDetails getOpdDetails() {
            return opdDetails;
        }

        public void setOpdDetails(OpdDetails opdDetails) {
            this.opdDetails = opdDetails;
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

        public List<DiagnosisReport> getDiagnosisReport() {
            return diagnosisReport;
        }

        public void setDiagnosisReport(List<DiagnosisReport> diagnosisReport) {
            this.diagnosisReport = diagnosisReport;
        }

        public DietPlan getDietPlan() {
            return dietPlan;
        }

        public void setDietPlan(DietPlan dietPlan) {
            this.dietPlan = dietPlan;
        }

        public TreatmentAdvice getTreatmentAdvice() {
            return treatmentAdvice;
        }

        public void setTreatmentAdvice(TreatmentAdvice treatmentAdvice) {
            this.treatmentAdvice = treatmentAdvice;
        }

        public FollowUp getFollowUp() {
            return followUp;
        }

        public void setFollowUp(FollowUp followUp) {
            this.followUp = followUp;
        }

        public class OpdDetails {

            @SerializedName("date")
            @Expose
            private String date;
            @SerializedName("time")
            @Expose
            private String time;
            @SerializedName("opd_no")
            @Expose
            private String opdNo;
            @SerializedName("consultant")
            @Expose
            private String consultant;

            public String getDate() {
                return date;
            }

            public void setDate(String date) {
                this.date = date;
            }

            public String getTime() {
                return time;
            }

            public void setTime(String time) {
                this.time = time;
            }

            public String getOpdNo() {
                return opdNo;
            }

            public void setOpdNo(String opdNo) {
                this.opdNo = opdNo;
            }

            public String getConsultant() {
                return consultant;
            }

            public void setConsultant(String consultant) {
                this.consultant = consultant;
            }

        }

        public class ChiefComplaintDetails {

            @SerializedName("id")
            @Expose
            private Integer id;
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
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

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

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }

        public class ChiefComplaintsBasic {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("chief_complaints_detail_id")
            @Expose
            private Integer chiefComplaintsDetailId;
            @SerializedName("complaints_name")
            @Expose
            private String complaintsName;
            @SerializedName("filled_using")
            @Expose
            private String filledUsing;
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

            public Integer getOpdId() {
                return opdId;
            }

            public void setOpdId(Integer opdId) {
                this.opdId = opdId;
            }

            public Integer getChiefComplaintsDetailId() {
                return chiefComplaintsDetailId;
            }

            public void setChiefComplaintsDetailId(Integer chiefComplaintsDetailId) {
                this.chiefComplaintsDetailId = chiefComplaintsDetailId;
            }

            public String getComplaintsName() {
                return complaintsName;
            }

            public void setComplaintsName(String complaintsName) {
                this.complaintsName = complaintsName;
            }

            public String getFilledUsing() {
                return filledUsing;
            }

            public void setFilledUsing(String filledUsing) {
                this.filledUsing = filledUsing;
            }

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }



        public class DiagnosisReport {

            @SerializedName("id")
            @Expose
            private Integer id;
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
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
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

            public Integer getOpdId() {
                return opdId;
            }

            public void setOpdId(Integer opdId) {
                this.opdId = opdId;
            }

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }

        public class DietPlan {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("diet_plan")
            @Expose
            private String dietPlan;
            @SerializedName("filled_using")
            @Expose
            private String filledUsing;
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

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

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }

        public class PastTreatmentHistory {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("history")
            @Expose
            private String history;
            @SerializedName("filled_using")
            @Expose
            private String filledUsing;
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

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

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }

        public class PastTreatmentHistoryDoc {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("past_history_id")
            @Expose
            private Integer pastHistoryId;
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("document")
            @Expose
            private String document;
            @SerializedName("filled_using")
            @Expose
            private String filledUsing;
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

            public Integer getPastHistoryId() {
                return pastHistoryId;
            }

            public void setPastHistoryId(Integer pastHistoryId) {
                this.pastHistoryId = pastHistoryId;
            }

            public Integer getOpdId() {
                return opdId;
            }

            public void setOpdId(Integer opdId) {
                this.opdId = opdId;
            }

            public String getDocument() {
                return document;
            }

            public void setDocument(String document) {
                this.document = document;
            }

            public String getFilledUsing() {
                return filledUsing;
            }

            public void setFilledUsing(String filledUsing) {
                this.filledUsing = filledUsing;
            }

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }

        public class TreatmentAdvice {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("treatment_advice")
            @Expose
            private String treatmentAdvice;
            @SerializedName("created_at")
            @Expose
            private String createdAt;
            @SerializedName("filled_using")
            @Expose
            private String filledUsing;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

            public Integer getOpdId() {
                return opdId;
            }

            public void setOpdId(Integer opdId) {
                this.opdId = opdId;
            }

            public String getTreatmentAdvice() {
                return treatmentAdvice;
            }

            public void setTreatmentAdvice(String treatmentAdvice) {
                this.treatmentAdvice = treatmentAdvice;
            }

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

            public String getFilledUsing() {
                return filledUsing;
            }

            public void setFilledUsing(String filledUsing) {
                this.filledUsing = filledUsing;
            }

        }

        public class FollowUp {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("opd_id")
            @Expose
            private Integer opdId;
            @SerializedName("count")
            @Expose
            private String count;
            @SerializedName("duration")
            @Expose
            private String duration;
            @SerializedName("date")
            @Expose
            private String date;
            @SerializedName("remarks")
            @Expose
            private String remarks;
            @SerializedName("filled_using")
            @Expose
            private String filledUsing;
            @SerializedName("created_at")
            @Expose
            private String createdAt;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
                this.id = id;
            }

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

            public String getDuration() {
                return duration;
            }

            public void setDuration(String duration) {
                this.duration = duration;
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

            public String getCreatedAt() {
                return createdAt;
            }

            public void setCreatedAt(String createdAt) {
                this.createdAt = createdAt;
            }

        }

    }

}



