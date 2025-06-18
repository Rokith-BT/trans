package com.plenome.pos.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PreviewResponse {

    @SerializedName("status")
    String status;

    @SerializedName("message")
    String message;

    @SerializedName("details")
    Details details;

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setDetails(Details details) {
        this.details = details;
    }

    public Details getDetails() {
        return details;
    }


    public class Details {

        @SerializedName("is_document_uploaded")
        boolean isDocUploaded;

        @SerializedName("patient_details")
        PatientDetails patientDetails;

        @SerializedName("doctor_details")
        DoctorDetails doctorDetails;

        @SerializedName("clinical_notes")
        ClinicalNotes clinicalNotes;

        @SerializedName("prescription")
        List<Prescription> prescription;

        @SerializedName("vitals")
        Vitals vitals;

        public boolean isDocUploaded() {
            return isDocUploaded;
        }

        public void setPatientDetails(PatientDetails patientDetails) {
            this.patientDetails = patientDetails;
        }

        public PatientDetails getPatientDetails() {
            return patientDetails;
        }

        public void setDoctorDetails(DoctorDetails doctorDetails) {
            this.doctorDetails = doctorDetails;
        }

        public DoctorDetails getDoctorDetails() {
            return doctorDetails;
        }

        public void setClinicalNotes(ClinicalNotes clinicalNotes) {
            this.clinicalNotes = clinicalNotes;
        }

        public ClinicalNotes getClinicalNotes() {
            return clinicalNotes;
        }

        public void setPrescription(List<Prescription> prescription) {
            this.prescription = prescription;
        }

        public List<Prescription> getPrescription() {
            return prescription;
        }

        public void setVitals(Vitals vitals) {
            this.vitals = vitals;
        }

        public Vitals getVitals() {
            return vitals;
        }

    }

    public class PatientDetails {

        @SerializedName("patientName")
        String patientName;
        @SerializedName("id")
        int id;
        @SerializedName("dob")
        String dob;

        @SerializedName("age")
        String age;

        @SerializedName("mobileno")
        String mobileno;

        @SerializedName("email")
        String email;

        @SerializedName("gender")
        String gender;

        @SerializedName("address")
        String address;

        @SerializedName("abha_address")
        String abhaAddress;

        @SerializedName("patient_blood_group")
        String patientBloodGroup;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setAbhaAddress(String abhaAddress) {
            this.abhaAddress = abhaAddress;
        }

        public String getAbhaAddress() {
            return abhaAddress;
        }

        public void setDob(String dob) {
            this.dob = dob;
        }

        public String getDob() {
            return dob;
        }

        public void setAge(String age) {
            this.age = age;
        }

        public String getAge() {
            return age;
        }

        public void setMobileno(String mobileno) {
            this.mobileno = mobileno;
        }

        public String getMobileno() {
            return mobileno;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getEmail() {
            return email;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getGender() {
            return gender;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getAddress() {
            return address;
        }

        public void setPatientBloodGroup(String patientBloodGroup) {
            this.patientBloodGroup = patientBloodGroup;
        }

        public String getPatientBloodGroup() {
            return patientBloodGroup;
        }

    }

    public class DoctorDetails {

        @SerializedName("doctorName")
        String doctorName;

        @SerializedName("employee_id")
        String employeeId;

        @SerializedName("gender")
        String gender;


        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public String getDoctorName() {
            return doctorName;
        }

        public void setEmployeeId(String employeeId) {
            this.employeeId = employeeId;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getGender() {
            return gender;
        }

    }


    public class OpdDetails {

        @SerializedName("date")
        String date;

        @SerializedName("time")
        String time;

        @SerializedName("opd_no")
        String opdNo;

        @SerializedName("consultant")
        String consultant;


        public void setDate(String date) {
            this.date = date;
        }

        public String getDate() {
            return date;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getTime() {
            return time;
        }

        public void setOpdNo(String opdNo) {
            this.opdNo = opdNo;
        }

        public String getOpdNo() {
            return opdNo;
        }

        public void setConsultant(String consultant) {
            this.consultant = consultant;
        }

        public String getConsultant() {
            return consultant;
        }

    }

    public class ChiefComplaintDetails {

        @SerializedName("id")
        int id;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("count")
        String count;

        @SerializedName("duration_limit")
        String durationLimit;

        @SerializedName("remarks")
        String remarks;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setCount(String count) {
            this.count = count;
        }

        public String getCount() {
            return count;
        }

        public void setDurationLimit(String durationLimit) {
            this.durationLimit = durationLimit;
        }

        public String getDurationLimit() {
            return durationLimit;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }


    }

    public class PastTreatmentHistory {

        @SerializedName("id")
        int id;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("history")
        String history;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setHistory(String history) {
            this.history = history;
        }

        public String getHistory() {
            return history;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }

    public class Vitals {

        @SerializedName("spo2")
        String spo2;

        @SerializedName("respiration")
        String respiration;

        @SerializedName("temperature")
        String temperature;

        @SerializedName("pulse")
        String pulse;

        @SerializedName("weight")
        String weight;

        @SerializedName("height")
        String height;

        @SerializedName("bp")
        String bp;


        public void setSpo2(String spo2) {
            this.spo2 = spo2;
        }

        public String getSpo2() {
            return spo2;
        }

        public void setRespiration(String respiration) {
            this.respiration = respiration;
        }

        public String getRespiration() {
            return respiration;
        }

        public void setTemperature(String temperature) {
            this.temperature = temperature;
        }

        public String getTemperature() {
            return temperature;
        }

        public void setPulse(String pulse) {
            this.pulse = pulse;
        }

        public String getPulse() {
            return pulse;
        }

        public void setWeight(String weight) {
            this.weight = weight;
        }

        public String getWeight() {
            return weight;
        }

        public void setHeight(String height) {
            this.height = height;
        }

        public String getHeight() {
            return height;
        }

        public void setBp(String bp) {
            this.bp = bp;
        }

        public String getBp() {
            return bp;
        }

    }

    public class ClinicalNotes {

        @SerializedName("OpdDetails")
        OpdDetails OpdDetails;

        @SerializedName("chiefComplaintsBasic")
        List<ChiefComplaintsBasic> chiefComplaintsBasic;

        @SerializedName("chiefComplaintDetails")
        ChiefComplaintDetails chiefComplaintDetails;

        @SerializedName("pastTreatmentHistory")
        PastTreatmentHistory pastTreatmentHistory;

        @SerializedName("pastTreatmentHistoryDocs")
        List<PastTreatmentHistoryDocs> pastTreatmentHistoryDocs;

        @SerializedName("diagnosisReport")
        List<DiagnosisReport> diagnosisReport;

        @SerializedName("dietPlan")
        DietPlan dietPlan;

        @SerializedName("treatmentAdvice")
        TreatmentAdvice treatmentAdvice;

        @SerializedName("followUp")
        FollowUp followUp;


        public void setOpdDetails(OpdDetails OpdDetails) {
            this.OpdDetails = OpdDetails;
        }

        public OpdDetails getOpdDetails() {
            return OpdDetails;
        }

        public void setChiefComplaintsBasic(List<ChiefComplaintsBasic> chiefComplaintsBasic) {
            this.chiefComplaintsBasic = chiefComplaintsBasic;
        }

        public List<ChiefComplaintsBasic> getChiefComplaintsBasic() {
            return chiefComplaintsBasic;
        }

        public void setChiefComplaintDetails(ChiefComplaintDetails chiefComplaintDetails) {
            this.chiefComplaintDetails = chiefComplaintDetails;
        }

        public ChiefComplaintDetails getChiefComplaintDetails() {
            return chiefComplaintDetails;
        }

        public void setPastTreatmentHistory(PastTreatmentHistory pastTreatmentHistory) {
            this.pastTreatmentHistory = pastTreatmentHistory;
        }

        public PastTreatmentHistory getPastTreatmentHistory() {
            return pastTreatmentHistory;
        }

        public void setPastTreatmentHistoryDocs(List<PastTreatmentHistoryDocs> pastTreatmentHistoryDocs) {
            this.pastTreatmentHistoryDocs = pastTreatmentHistoryDocs;
        }

        public List<PastTreatmentHistoryDocs> getPastTreatmentHistoryDocs() {
            return pastTreatmentHistoryDocs;
        }

        public void setDiagnosisReport(List<DiagnosisReport> diagnosisReport) {
            this.diagnosisReport = diagnosisReport;
        }

        public List<DiagnosisReport> getDiagnosisReport() {
            return diagnosisReport;
        }

        public void setDietPlan(DietPlan dietPlan) {
            this.dietPlan = dietPlan;
        }

        public DietPlan getDietPlan() {
            return dietPlan;
        }

        public void setTreatmentAdvice(TreatmentAdvice treatmentAdvice) {
            this.treatmentAdvice = treatmentAdvice;
        }

        public TreatmentAdvice getTreatmentAdvice() {
            return treatmentAdvice;
        }

        public void setFollowUp(FollowUp followUp) {
            this.followUp = followUp;
        }

        public FollowUp getFollowUp() {
            return followUp;
        }

    }

    public class TreatmentAdvice {

        @SerializedName("id")
        int id;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("treatment_advice")
        String treatmentAdvice;

        @SerializedName("created_at")
        String createdAt;

        @SerializedName("filled_using")
        String filledUsing;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setTreatmentAdvice(String treatmentAdvice) {
            this.treatmentAdvice = treatmentAdvice;
        }

        public String getTreatmentAdvice() {
            return treatmentAdvice;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

    }

    public class ChiefComplaintsBasic {

        @SerializedName("id")
        int id;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("chief_complaints_detail_id")
        int chiefComplaintsDetailId;

        @SerializedName("complaints_name")
        String complaintsName;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setChiefComplaintsDetailId(int chiefComplaintsDetailId) {
            this.chiefComplaintsDetailId = chiefComplaintsDetailId;
        }

        public int getChiefComplaintsDetailId() {
            return chiefComplaintsDetailId;
        }

        public void setComplaintsName(String complaintsName) {
            this.complaintsName = complaintsName;
        }

        public String getComplaintsName() {
            return complaintsName;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }

    public class PastTreatmentHistoryDocs {

        @SerializedName("id")
        int id;

        @SerializedName("past_history_id")
        int pastHistoryId;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("document")
        String document;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setPastHistoryId(int pastHistoryId) {
            this.pastHistoryId = pastHistoryId;
        }

        public int getPastHistoryId() {
            return pastHistoryId;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setDocument(String document) {
            this.document = document;
        }

        public String getDocument() {
            return document;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }

    public class DiagnosisReport {

        @SerializedName("id")
        int id;

        @SerializedName("test_categories")
        String testCategories;

        @SerializedName("sub_category")
        String subCategory;

        @SerializedName("laboratory")
        String laboratory;

        @SerializedName("remarks")
        String remarks;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setTestCategories(String testCategories) {
            this.testCategories = testCategories;
        }

        public String getTestCategories() {
            return testCategories;
        }

        public void setSubCategory(String subCategory) {
            this.subCategory = subCategory;
        }

        public String getSubCategory() {
            return subCategory;
        }

        public void setLaboratory(String laboratory) {
            this.laboratory = laboratory;
        }

        public String getLaboratory() {
            return laboratory;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }

    public class DietPlan {

        @SerializedName("id")
        int id;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("diet_plan")
        String dietPlan;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setDietPlan(String dietPlan) {
            this.dietPlan = dietPlan;
        }

        public String getDietPlan() {
            return dietPlan;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }

    public class Prescription {

        @SerializedName("id")
        int id;

        @SerializedName("medicine_name")
        String medicineName;

        @SerializedName("frequency")
        String frequency;

        @SerializedName("dosage")
        String dosage;

        @SerializedName("duration_count")
        String durationCount;

        @SerializedName("duration_limit")
        String durationLimit;

        @SerializedName("quantity")
        String quantity;

        @SerializedName("when")
        String when;

        @SerializedName("remarks")
        String remarks;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setMedicineName(String medicineName) {
            this.medicineName = medicineName;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public String getFrequency() {
            return frequency;
        }

        public void setDosage(String dosage) {
            this.dosage = dosage;
        }

        public String getDosage() {
            return dosage;
        }

        public void setDurationCount(String durationCount) {
            this.durationCount = durationCount;
        }

        public String getDurationCount() {
            return durationCount;
        }

        public void setDurationLimit(String durationLimit) {
            this.durationLimit = durationLimit;
        }

        public String getDurationLimit() {
            return durationLimit;
        }

        public void setQuantity(String quantity) {
            this.quantity = quantity;
        }

        public String getQuantity() {
            return quantity;
        }

        public void setWhen(String when) {
            this.when = when;
        }

        public String getWhen() {
            return when;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }


    public class FollowUp {

        @SerializedName("id")
        int id;

        @SerializedName("opd_id")
        int opdId;

        @SerializedName("count")
        String count;

        @SerializedName("duration")
        String duration;

        @SerializedName("date")
        String date;

        @SerializedName("remarks")
        String remarks;

        @SerializedName("filled_using")
        String filledUsing;

        @SerializedName("created_at")
        String createdAt;


        public void setId(int id) {
            this.id = id;
        }

        public int getId() {
            return id;
        }

        public void setOpdId(int opdId) {
            this.opdId = opdId;
        }

        public int getOpdId() {
            return opdId;
        }

        public void setCount(String count) {
            this.count = count;
        }

        public String getCount() {
            return count;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getDuration() {
            return duration;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getDate() {
            return date;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setFilledUsing(String filledUsing) {
            this.filledUsing = filledUsing;
        }

        public String getFilledUsing() {
            return filledUsing;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public String getCreatedAt() {
            return createdAt;
        }

    }
}
