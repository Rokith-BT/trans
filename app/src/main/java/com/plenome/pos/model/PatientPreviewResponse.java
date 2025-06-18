package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

public class PatientPreviewResponse implements Serializable {

    @SerializedName("status")
    private String status;

    @SerializedName("message")
    private String message;

    @SerializedName("details")
    private Details details;

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

    public Details getDetails() {
        return details;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public static class Details implements Serializable {
        @SerializedName("patient_details")
        private PatientDetails patientDetails;

        @SerializedName("doctor_details")
        private DoctorDetails doctorDetails;

        @SerializedName("clinical_notes")
        private ClinicalNotes clinicalNotes;

        @SerializedName("prescription")
        private List<PrescriptionDetail> prescription;

        @SerializedName("vitals")
        private Vitals vitals;

        @SerializedName("is_document_uploaded")
        private boolean isDocumentUploaded;

        public PatientDetails getPatientDetails() {
            return patientDetails;
        }

        public void setPatientDetails(PatientDetails patientDetails) {
            this.patientDetails = patientDetails;
        }

        public DoctorDetails getDoctorDetails() {
            return doctorDetails;
        }

        public void setDoctorDetails(DoctorDetails doctorDetails) {
            this.doctorDetails = doctorDetails;
        }

        public ClinicalNotes getClinicalNotes() {
            return clinicalNotes;
        }

        public void setClinicalNotes(ClinicalNotes clinicalNotes) {
            this.clinicalNotes = clinicalNotes;
        }

        public List<PrescriptionDetail> getPrescription() {
            return prescription;
        }

        public void setPrescription(List<PrescriptionDetail> prescription) {
            this.prescription = prescription;
        }

        public Vitals getVitals() {
            return vitals;
        }

        public void setVitals(Vitals vitals) {
            this.vitals = vitals;
        }

        public boolean isDocumentUploaded() {
            return isDocumentUploaded;
        }

        public void setDocumentUploaded(boolean documentUploaded) {
            isDocumentUploaded = documentUploaded;
        }
    }

    public static class PatientDetails implements Serializable {
        @SerializedName("id")
        private int id;

        @SerializedName("patientName")
        private String patientName;

        @SerializedName("dob")
        private String dob;

        @SerializedName("age")
        private String age;

        @SerializedName("mobileno")
        private String mobileNo;

        @SerializedName("email")
        private String email;

        @SerializedName("gender")
        private String gender;

        @SerializedName("abha_address")
        private String abhaAddress;

        @SerializedName("address")
        private String address;

        @SerializedName("patient_blood_group")
        private String patientBloodGroup;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public String getDob() {
            return dob;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getAge() {
            return age;
        }

        public void setAge(String age) {
            this.age = age;
        }

        public String getMobileNo() {
            return mobileNo;
        }

        public void setMobileNo(String mobileNo) {
            this.mobileNo = mobileNo;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getPatientBloodGroup() {
            return patientBloodGroup;
        }

        public void setPatientBloodGroup(String patientBloodGroup) {
            this.patientBloodGroup = patientBloodGroup;
        }
    }

    public static class DoctorDetails implements Serializable {
        @SerializedName("doctorName")
        private String doctorName;

        @SerializedName("employee_id")
        private String employeeId;

        @SerializedName("gender")
        private String gender;

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }

    public static class ClinicalNotes implements Serializable {
        @SerializedName("OpdDetails")
        private OpdDetails opdDetails;

        @SerializedName("chiefComplaintsBasic")
        private List<ChiefComplaintsBasic> chiefComplaintsBasic;

        @SerializedName("chiefComplaintDetails")
        private ChiefComplaintDetails chiefComplaintDetails;

        @SerializedName("pastTreatmentHistory")
        private PastTreatmentHistory pastTreatmentHistory;

        @SerializedName("pastTreatmentHistoryDocs")
        private List<PastTreatmentHistoryDocs> pastTreatmentHistoryDocs;

        @SerializedName("diagnosisReport")
        private List<GetClinicalNotesResponse.Details.DiagnosisReport> diagnosisReport;

        @SerializedName("dietPlan")
        private DietPlan dietPlan;

        @SerializedName("treatmentAdvice")
        private TreatmentAdvice treatmentAdvice;

        @SerializedName("followUp")
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

        public List<PastTreatmentHistoryDocs> getPastTreatmentHistoryDocs() {
            return pastTreatmentHistoryDocs;
        }

        public void setPastTreatmentHistoryDocs(List<PastTreatmentHistoryDocs> pastTreatmentHistoryDocs) {
            this.pastTreatmentHistoryDocs = pastTreatmentHistoryDocs;
        }

        public List<GetClinicalNotesResponse.Details.DiagnosisReport> getDiagnosisReport() {
            return diagnosisReport;
        }

        public void setDiagnosisReport(List<GetClinicalNotesResponse.Details.DiagnosisReport> diagnosisReport) {
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
    }

    public static class OpdDetails implements Serializable {
        @SerializedName("opd_id")
        private int opdId;

        public int getOpdId() {
            return opdId;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }
    }

    public static class ChiefComplaintsBasic implements Serializable {
        @SerializedName("id")
        private Integer id;

        @SerializedName("opd_id")
        private Integer opdId;

        @SerializedName("chief_complaints_detail_id")
        private Integer chiefComplaintsDetailId;

        @SerializedName("complaints_name")
        private String complaintsName;

        @SerializedName("filled_using")
        private String filledUsing;

        @SerializedName("created_at")
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

    public static class ChiefComplaintDetails implements Serializable {
        @SerializedName("id")
        private Integer id;

        @SerializedName("opd_id")
        private Integer opdId;

        @SerializedName("count")
        private String count;

        @SerializedName("duration_limit")
        private String durationLimit;
        @SerializedName("remarks")
        private String remarks;
        @SerializedName("filled_using")
        private String filledUsing;
        @SerializedName("created_at")
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

    public static class PastTreatmentHistory implements Serializable {
        @SerializedName("history")
        private String history;

        public String getHistory() {
            return history;
        }

        public void setHistory(String history) {
            this.history = history;
        }
    }

    public static class PastTreatmentHistoryDocs implements Serializable {
        @SerializedName("documentUrl")
        private String documentUrl;

        public String getDocumentUrl() {
            return documentUrl;
        }

        public void setDocumentUrl(String documentUrl) {
            this.documentUrl = documentUrl;
        }
    }

    public static class DiagnosisReport implements Serializable {

        @SerializedName("id")
        private Integer id;
        @SerializedName("test_categories")
        private String testCategories;
        @SerializedName("sub_category")
        private String subCategory;
        @SerializedName("laboratory")
        private String laboratory;
        @SerializedName("remarks")
        private String remarks;
        @SerializedName("filled_using")
        private String filledUsing;
        @SerializedName("opd_id")
        private Integer opdId;
        @SerializedName("created_at")
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

    public static class DietPlan implements Serializable {
        @SerializedName("diet_plan")
        private String plan;

        public String getPlan() {
            return plan;
        }

        public void setPlan(String plan) {
            this.plan = plan;
        }
    }

    public static class TreatmentAdvice implements Serializable {
        @SerializedName("treatment_advice")
        private String advice;

        public String getAdvice() {
            return advice;
        }

        public void setAdvice(String advice) {
            this.advice = advice;
        }
    }

    public static class FollowUp implements Serializable {
        @SerializedName("id")
        private Integer id;
        @SerializedName("opd_id")
        private Integer opdId;
        @SerializedName("count")
        private String count;
        @SerializedName("duration")
        private String duration;
        @SerializedName("date")
        private String date;
        @SerializedName("remarks")
        private String remarks;
        @SerializedName("filled_using")
        private String filledUsing;
        @SerializedName("created_at")
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

    public static class Prescription implements Serializable {
        @SerializedName("id")
        private Integer id;
        @SerializedName("medicine_name")
        private String medicineName;
        @SerializedName("frequency")
        private String frequency;
        @SerializedName("dosage")
        private String dosage;
        @SerializedName("duration_count")
        private String durationCount;
        @SerializedName("duration_limit")
        private String durationLimit;
        @SerializedName("quantity")
        private String quantity;
        @SerializedName("when")
        private String when;
        @SerializedName("remarks")
        private String remarks;
        @SerializedName("filled_using")
        private String filledUsing;
        @SerializedName("opd_id")
        private Integer opdId;
        @SerializedName("created_at")
        private String createdAt;
        @SerializedName("is_from_api")
        private Boolean isFromApi;

        public Boolean getIsFromApi(){return isFromApi;}

        public void setIsFromApi(Boolean isFromApi){
            this.isFromApi = isFromApi;
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public void setMedicineName(String medicineName) {
            this.medicineName = medicineName;
        }

        public String getFrequency() {
            return frequency;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public String getDosage() {
            return dosage;
        }

        public void setDosage(String dosage) {
            this.dosage = dosage;
        }

        public String getDurationCount() {
            return durationCount;
        }

        public void setDurationCount(String durationCount) {
            this.durationCount = durationCount;
        }

        public String getDurationLimit() {
            return durationLimit;
        }

        public void setDurationLimit(String durationLimit) {
            this.durationLimit = durationLimit;
        }

        public String getQuantity() {
            return quantity;
        }

        public void setQuantity(String quantity) {
            this.quantity = quantity;
        }

        public String getWhen() {
            return when;
        }

        public void setWhen(String when) {
            this.when = when;
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

    public static class Vitals implements Serializable {

        @SerializedName("spo2")
        private String spo2;
        @SerializedName("respiration")
        private String respiration;
        @SerializedName("temperature")
        private String temperature;
        @SerializedName("pulse")
        private String pulse;
        @SerializedName("weight")
        private String weight;
        @SerializedName("height")
        private String height;
        @SerializedName("bp")
        private String bp;

        public String getSpo2() {
            return spo2;
        }

        public void setSpo2(String spo2) {
            this.spo2 = spo2;
        }

        public String getRespiration() {
            return respiration;
        }

        public void setRespiration(String respiration) {
            this.respiration = respiration;
        }

        public String getTemperature() {
            return temperature;
        }

        public void setTemperature(String temperature) {
            this.temperature = temperature;
        }

        public String getPulse() {
            return pulse;
        }

        public void setPulse(String pulse) {
            this.pulse = pulse;
        }

        public String getWeight() {
            return weight;
        }

        public void setWeight(String weight) {
            this.weight = weight;
        }

        public String getHeight() {
            return height;
        }

        public void setHeight(String height) {
            this.height = height;
        }

        public String getBp() {
            return bp;
        }

        public void setBp(String bp) {
            this.bp = bp;
        }
    }
}
