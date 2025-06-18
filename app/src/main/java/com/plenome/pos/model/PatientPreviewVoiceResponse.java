package com.plenome.pos.model;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import java.util.List;

public class PatientPreviewVoiceResponse {

    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("message")
    @Expose
    private String message;
    @SerializedName("details")
    @Expose
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

    public class Details {

        @SerializedName("patient_details")
        @Expose
        private PatientDetails patientDetails;
        @SerializedName("doctor_details")
        @Expose
        private DoctorDetails doctorDetails;
        @SerializedName("clinical_notes")
        @Expose
        private ClinicalNotes clinicalNotes;
        @SerializedName("prescription")
        @Expose
        private List<Prescription> prescription;
        @SerializedName("vitals")
        @Expose
        private Vitals vitals;
        @SerializedName("is_document_uploaded")
        @Expose
        private Boolean isDocumentUploaded;

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

        public List<Prescription> getPrescription() {
            return prescription;
        }

        public void setPrescription(List<Prescription> prescription) {
            this.prescription = prescription;
        }

        public Vitals getVitals() {
            return vitals;
        }

        public void setVitals(Vitals vitals) {
            this.vitals = vitals;
        }

        public Boolean getIsDocumentUploaded() {
            return isDocumentUploaded;
        }

        public void setIsDocumentUploaded(Boolean isDocumentUploaded) {
            this.isDocumentUploaded = isDocumentUploaded;
        }

        public class PatientDetails {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("patientName")
            @Expose
            private String patientName;
            @SerializedName("dob")
            @Expose
            private String dob;
            @SerializedName("bundleDate")
            @Expose
            private String bundleDate;
            @SerializedName("age")
            @Expose
            private String age;
            @SerializedName("mobileno")
            @Expose
            private String mobileno;
            @SerializedName("email")
            @Expose
            private String email;
            @SerializedName("gender")
            @Expose
            private String gender;
            @SerializedName("abha_address")
            @Expose
            private String abhaAddress;
            @SerializedName("address")
            @Expose
            private String address;
            @SerializedName("patient_blood_group")
            @Expose
            private String patientBloodGroup;

            public Integer getId() {
                return id;
            }

            public void setId(Integer id) {
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

            public String getBundleDate() {
                return bundleDate;
            }

            public void setBundleDate(String bundleDate) {
                this.bundleDate = bundleDate;
            }

            public String getAge() {
                return age;
            }

            public void setAge(String age) {
                this.age = age;
            }

            public String getMobileno() {
                return mobileno;
            }

            public void setMobileno(String mobileno) {
                this.mobileno = mobileno;
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
        public class DoctorDetails {

            @SerializedName("doctorName")
            @Expose
            private String doctorName;
            @SerializedName("employee_id")
            @Expose
            private String employeeId;
            @SerializedName("gender")
            @Expose
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

        public class ClinicalNotes {

            @SerializedName("OpdDetails")
            @Expose
            private OpdDetails opdDetails;
            @SerializedName("chiefComplaintsBasic")
            @Expose
            private List<ChiefComplaintsBasic> chiefComplaintsBasic;
            @SerializedName("chiefComplaintDetails")
            @Expose
            private ChiefComplaintDetails chiefComplaintDetails;
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
                @SerializedName("bundleDate")
                @Expose
                private String bundleDate;
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

                public String getBundleDate() {
                    return bundleDate;
                }

                public void setBundleDate(String bundleDate) {
                    this.bundleDate = bundleDate;
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
                @SerializedName("bundleDate")
                @Expose
                private String bundleDate;
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

                public String getBundleDate() {
                    return bundleDate;
                }

                public void setBundleDate(String bundleDate) {
                    this.bundleDate = bundleDate;
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

        public class Prescription {

            @SerializedName("id")
            @Expose
            private Integer id;
            @SerializedName("medicine_name")
            @Expose
            private String medicineName;
            @SerializedName("frequency")
            @Expose
            private String frequency;
            @SerializedName("dosage")
            @Expose
            private String dosage;
            @SerializedName("duration_count")
            @Expose
            private String durationCount;
            @SerializedName("duration_limit")
            @Expose
            private String durationLimit;
            @SerializedName("quantity")
            @Expose
            private String quantity;
            @SerializedName("when")
            @Expose
            private String when;
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

        public class Vitals {

            @SerializedName("spo2")
            @Expose
            private String spo2;
            @SerializedName("respiration")
            @Expose
            private String respiration;
            @SerializedName("temperature")
            @Expose
            private String temperature;
            @SerializedName("pulse")
            @Expose
            private String pulse;
            @SerializedName("weight")
            @Expose
            private String weight;
            @SerializedName("height")
            @Expose
            private String height;
            @SerializedName("bp")
            @Expose
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

}





