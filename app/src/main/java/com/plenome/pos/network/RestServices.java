package com.plenome.pos.network;

import com.google.gson.JsonArray;
import com.plenome.pos.model.AbhaAddrCreationRequest;
import com.plenome.pos.model.AbhaAddrCreationResponse;
import com.plenome.pos.model.AbhaAddressCreationResp;
import com.plenome.pos.model.AbhaAddressVerifyResponse;
import com.plenome.pos.model.AbhaLinkResponse;
import com.plenome.pos.model.AbhaProfileInfoResponse;
import com.plenome.pos.model.AbhaProfileResp;
import com.plenome.pos.model.AbhaUserNameOtpVerifyResponse;
import com.plenome.pos.model.AbhaUserNameVerifyResponse;
import com.plenome.pos.model.AbhaUsernameSuggestionResp;
import com.plenome.pos.model.AddNewPatientResp;
import com.plenome.pos.model.BillingHistoryResponse;
import com.plenome.pos.model.BloodGroupResponse;
import com.plenome.pos.model.BookAppointmentOnlineRes;
import com.plenome.pos.model.BookAppointmentResponse;
import com.plenome.pos.model.CaptureModel;
import com.plenome.pos.model.CareContextLinkTokenResponse;
import com.plenome.pos.model.CareContextTokenRequest;
import com.plenome.pos.model.CategoriesResponse;
import com.plenome.pos.model.ClinicalNotesRequestPatch;
import com.plenome.pos.model.ClinicalNotesRequestResponse;
import com.plenome.pos.model.ClinicalSuggestion;
import com.plenome.pos.model.ConsentRequest;
import com.plenome.pos.model.ConsentRequestResponse;
import com.plenome.pos.model.ConsultationStatusResponse;
import com.plenome.pos.model.ConsultationTrackingResponse;
import com.plenome.pos.model.CreateAbhaNoResponse;
import com.plenome.pos.model.DataResponse;
import com.plenome.pos.model.ExistPatientDetResponse;
import com.plenome.pos.model.ExistPatientDetail;
import com.plenome.pos.model.FhirBundleUploadResponse;
import com.plenome.pos.model.GetAppointmentResponse;
import com.plenome.pos.model.GetAppointmentStatusResponse;
import com.plenome.pos.model.GetClinicalNotesResponse;
import com.plenome.pos.model.GetConsentListResp;
import com.plenome.pos.model.GetDoctorResponse;
import com.plenome.pos.model.GetDoctorSlotResponse;
import com.plenome.pos.model.GetInvoiceDataResponse;
import com.plenome.pos.model.GetOtpResponse;
import com.plenome.pos.model.GetPatientChargeDetResponse;
import com.plenome.pos.model.GetPatientProfileResponse;
import com.plenome.pos.model.GetPrescriptionResponse;
import com.plenome.pos.model.GetV2DoctorResponse;
import com.plenome.pos.model.HospitalDetailsResponse;
import com.plenome.pos.model.ImageResponse;
import com.plenome.pos.model.IsMobileLinkedResponse;
import com.plenome.pos.model.LinkCareContextRequest;
import com.plenome.pos.model.LinkCareContextResponse;
import com.plenome.pos.model.LoginResponse;
import com.plenome.pos.model.OPHubRequests;
import com.plenome.pos.model.OPHubResponse;
import com.plenome.pos.model.OpdDropdownRes;
import com.plenome.pos.model.PatientPreviewResponse;
import com.plenome.pos.model.PatientPreviewVoiceResponse;
import com.plenome.pos.model.PatientProfileQR;
import com.plenome.pos.model.PendingBillHistoryResponse;
import com.plenome.pos.model.PendingBillResponse;
import com.plenome.pos.model.PhrProfileResponse;
import com.plenome.pos.model.PostPrescriptionRequest;
import com.plenome.pos.model.PostPrescriptionResponse;
import com.plenome.pos.model.PrescriptionResponse;
import com.plenome.pos.model.PreviewResponse;
import com.plenome.pos.model.SubCategoriesResponse;
import com.plenome.pos.model.TranscriptResponse;
import com.plenome.pos.model.UpdatePatientRequest;
import com.plenome.pos.model.UpdatePatientResponse;
import com.plenome.pos.model.V2BillingHistoryResponse;
import com.plenome.pos.model.V2PendingBillHistoryResponse;
import com.plenome.pos.model.VerifyAadhaarOTPResp;
import com.plenome.pos.model.VerifyEmailOTPResp;
import com.plenome.pos.model.VerifyMobileListStatus;
import com.plenome.pos.model.VerifyMobileNumberList;
import com.plenome.pos.model.VerifyMobileOTPResponse;
import com.plenome.pos.model.VerifyNewMobileOTPResponse;
import com.plenome.pos.model.VerifyOTPLinkABHAResp;
import com.plenome.pos.model.VerifyOtpResponse;
import com.plenome.pos.model.VerifySecondOTPResp;
import com.plenome.pos.model.VibarasensGetResponse;
import com.plenome.pos.model.VibrasenseRequest;
import com.plenome.pos.model.ViewApptInfoResponse;
import com.plenome.pos.model.VitalsRequestResponse;
import com.plenome.pos.model.VitalsResquest;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Multipart;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Part;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface RestServices {

    @POST("login")
    Call<LoginResponse> login(@Body OPHubRequests.LoginRequest request);

    @POST("file_upload/getDocs")
    Call<ResponseBody> getProfileImage(@Body OPHubRequests.ShowProfileImageRequest request);

    @POST("login/forgotPassword")
    Call<LoginResponse> forGotPwd(@Body OPHubRequests.LoginRequest request);

    @POST("login/resetPassword")
    Call<LoginResponse> resetPwd(@Body OPHubRequests.LoginRequest request);

    @POST("abha-v3/retrieve-abha-aadhaarotp")
    Call<GetOtpResponse> getAadhaarOtp(@Body OPHubRequests.GetOtpRequest request);

    @POST("abha-v3/retrieve-abha-verifyotp")
    Call<VerifyOtpResponse> verifyAadhaarOtp(@Body OPHubRequests.VerifyOtpRequest request);

    @POST("abha_check_and_generate_mobile_otp")
    Call<IsMobileLinkedResponse> isMobileLinked(@Body OPHubRequests.IsMobileLinkedRequest request);

    @POST("abha_create_health_id_by_aadhar")
    Call<CreateAbhaNoResponse> createAbhaNo(@Body OPHubRequests.CreateAbhaNoRequest request);

    @POST("abha_verify_mobile_otp")
    Call<GetOtpResponse> verifyMobileOtp(@Body OPHubRequests.VerifyOtpRequest request);

    @POST("download_abha_card_getcard")
    Call<ResponseBody> getAbhaCard(@Body OPHubRequests.GetAbhaCardRequest request);

    @GET("appointment")
    Call<List<GetAppointmentResponse>> getAppointments(@Query("fromDate") String fromDate, @Query("toDate") String toDate,
                                                       @Query("doctorId") String doctorId, @Query("appointStatus") String appointStatus,
                                                       @Query("payment_status") String paymentStatus, @Query("hospital_id") int hospital_id);

    @GET("appointment/history")
    Call<List<GetAppointmentResponse>> getAppointmentHistory(@Query("fromDate") String fromDate, @Query("toDate") String toDate,
                                                             @Query("doctorId") String doctorId, @Query("appointStatus") String appointStatus,
                                                             @Query("payment_status") String paymentStatus, @Query("hospital_id") int hospital_id);

    @GET("internal_appnt_doctors")
    Call<List<GetDoctorResponse>> getDoctors(@Query("hospital_id") String id);

    @GET("doctors")
    Call<List<GetDoctorResponse>> getAllDoctors(@Query("hospital_id") String id, @Query("search") String speciality, @Query("gender") String gender, @Query("date") String date);

    @GET("appointment_status")
    Call<List<GetAppointmentStatusResponse>> getAppointmentStatus(@Query("hospital_id") String id);

    @GET("appointment_status/statusList")
    Call<List<GetAppointmentStatusResponse>> getAppointmentStatusProgress(@Query("hospital_id") String id);

    @GET("blood_group")
    Call<List<BloodGroupResponse>> getBloodGroup();

    @GET("gender")
    Call<List<OPHubResponse.GenderResponse>> getGender();

    @GET("country_code")
    Call<List<OPHubResponse.CountryResponse>> getCountry();

    @GET("patient_salutation")
    Call<List<OPHubResponse.SalutationResponse>> getSalutation();

    @GET("marital-status")
    Call<List<OPHubResponse.MaritalStatusResponse>> getMaritalStatus();

    @POST("patient/AddNewPatient")
    Call<DataResponse> addNewPatient(@Body OPHubRequests.AddNewPatientRequest request);

    @POST("patient/AddNewPatient")
    Call<AddNewPatientResp> addNewPatient1(@Body OPHubRequests.AddNewPatientRequest request);

    @POST("prescription/get")
    Call<List<GetPrescriptionResponse>> getPrescription(@Body OPHubRequests.GetPrescriptionRequest request);

    @POST("internal/slot")
    Call<List<GetDoctorSlotResponse>> getDoctorSlot(@Body OPHubRequests.GetDoctorSlotRequest request);

    @FormUrlEncoded
    @POST("file_upload")
    Call<OPHubResponse.FileUploadResponse> fileUpload(@Field("file") File file);

    @Multipart
    @POST("file_upload")
    Call<OPHubResponse.FileUploadResponse> uploadFile(@Part MultipartBody.Part filePart);

    @Multipart
    @POST("speech-to-text-translate")
    Call<TranscriptResponse> translateSpeech(@Header("api-subscription-key") String key,@Part MultipartBody.Part audioFile);

    @POST("prescription/post")
    Call<OPHubResponse.FileUploadResponse> prescriptionPost(@Body OPHubRequests.PrescriptionPostingReq request);

    @POST("appointment")
    Call<List<BookAppointmentResponse>> bookAppointmentCash(@Body OPHubRequests.BookAppointmentReq request);

    @POST("EncryptForPayment")
    Call<BookAppointmentOnlineRes> bookAppointmentOnline(@Body JsonArray array, @Query("request_from") String cat);

    @PATCH("appointment/status/{id}")
    Call<List<OPHubResponse.UpdateApptStatusResponse>> updateAppointmentStatus(@Path("id") String id, @Body OPHubRequests.UpdateAppointmentStatusReq req);

    @POST("appointment/reshedule/{id}")
    Call<List<OPHubResponse.UpdateApptStatusResponse>> rescheduleAppointment(@Path("id") String id, @Body OPHubRequests.RescheduleApptReq req);

    @GET("patientprofile")
    Call<GetPatientProfileResponse> getPatientProfile(@Query("patientId") int pId, @Query("hospital_id") int hId);

    @POST("patient/AddNewPatient")
    Call<List<DataResponse>> addPatient(@Body OPHubRequests.AddNewPatientRequest req);

    @GET("appointment/info")
    Call<ViewApptInfoResponse> viewApptInfo(@Query("hospital_id") int hId, @Query("token") String token);

    @GET("payment-status")
    Call<List<OPHubResponse.PaymentStatusResponse>> getPaymentStatus();

    @GET("appointment_cancellation_reason")
    Call<List<OPHubResponse.CancellationReasonResponse>> getCancellationReason();

    @GET("consultationstatus/stats")
    Call<List<OPHubResponse.ConsulationStatusCountResp>> getConsultationStatusCount(@Query("hospital_id") int hId, @Query("appointment_id") String apptId);

    @POST("check_old_patient")
    Call<List<ExistPatientDetResponse>> getExistPatientDet(@Body OPHubRequests.GetExistPatientDetReq request);

    @POST("consultationstatus")
    Call<List<OPHubResponse.UpdateApptStatusResponse>> updateConsultationStatus(@Body OPHubRequests.UpdateConsultStatusReq request);

    @POST("patient/scan")
    Call<DataResponse> checkByAbhaQR(@Body OPHubRequests.CheckAbhaQR request);

    @POST("patient/scan")
    Call<List<AbhaLinkResponse>> checkByAbhaQRs(@Body OPHubRequests.CheckAbhaQR request);

    @PATCH("patientprofile")
    Call<List<UpdatePatientResponse>> updatePatient(@Query("patientId") int id, @Query("hospital_id") int hospId, @Body OPHubRequests.AddNewPatientRequest request);

    @GET("appointment_status/tracking")
    Call<List<GetAppointmentStatusResponse>> getAppointmentTracking(@Query("hospital_id") int hId, @Query("appointment_id") String apptId);

    @PATCH("appointment/cancel/{id}")
    Call<List<OPHubResponse.UpdateApptStatusResponse>> cancelAppointment(@Path("id") String id, @Body OPHubRequests.CancelAppointmentReq req);

    @GET("consultationstatus/process")
    Call<List<ConsultationStatusResponse>> getConsultationStatus(@Query("hospital_id") int hId);

    @GET("consultationstatus")
    Call<List<OPHubResponse.ConsulationStatusCountResp>> getConsultStatus(@Query("hospital_id") int hId);

    @GET("consultationstatus/tracking")
    Call<List<ConsultationTrackingResponse>> getConsultationTracking(@Query("hospital_id") int hId, @Query("appointment_id") String apptId);

    @GET("patient_appointment_list/upcoming")
    Call<List<GetAppointmentResponse>> getUpcomingAppts(@Query("hospital_id") int id, @Query("patient_id") int patientId, @Query("doctor") String doctorId, @Query("date") String date);

    @GET("patient_appointment_list/history")
    Call<List<GetAppointmentResponse>> getHistoryAppts(@Query("hospital_id") int id, @Query("patient_id") int patientId, @Query("doctor") String doctorId, @Query("date") String date);

    @GET("patient_appointment_list/today")
    Call<List<GetAppointmentResponse>> getTodayAppts(@Query("hospital_id") int id, @Query("patient_id") int patientId, @Query("doctor") String doctorId, @Query("date") String date);

    @POST("token/verification")
    Call<OPHubResponse.UpdateApptStatusResponse> verifyToken(@Query("hospital_id") int hId, @Query("appointment_number") String apptNo);

    @POST("token/complete")
    Call<OPHubResponse.UpdateApptStatusResponse> closeConsultation(@Query("hospital_id") int hId, @Query("appointment_number") String apptNo);

    @GET("billing")
    Call<BillingHistoryResponse> getBillingHistory(@Query("hospital_id") int hospital_id, @Query("patient_id") String patient_id, @Query("from_date") String fromDate, @Query("to_date") String toDate, @Query("payment_method") String paymentMethod, @Query("date") String date);

    @GET("billing/pending")
    Call<PendingBillHistoryResponse> getPendingBillHistory(@Query("hospital_id") int hospital_id);

    @GET("billing/pending")
    Call<PendingBillResponse> getPendingBill(@Query("hospital_id") int hospital_id, @Query("patient_id") int patient_id);

    @GET("billing/individualpending")
    Call<PendingBillResponse> getPendingBillPatient(@Query("hospital_id") int hospital_id, @Query("patient_id") int patient_id);

    @POST("billing/makePayment")
    Call<OPHubResponse.UpdateApptStatusResponse> cashBillPayment(@Body OPHubRequests.CashBillPayReq request);

    @GET("billing/chargeType")
    Call<List<OPHubResponse.ChargeTypeResp>> getChargeType(@Query("hospital_id") int hospital_id);

    @GET("billing/chargeCategory")
    Call<List<OPHubResponse.ChargeCateoryResp>> getChargeCategory(@Query("hospital_id") int hospital_id, @Query("charge_type_id") int typeId);

    @GET("billing/chargeName")
    Call<List<OPHubResponse.ChargeNameResp>> getChargeName(@Query("hospital_id") int hospital_id, @Query("charge_category_id") int catId);

    @GET("billing/chargeName/{id}")
    Call<List<OPHubResponse.ChargeDetailsResp>> getChargeDetails(@Path("id") int id, @Query("hospital_id") int hospital_id);

    @POST("billing")
    Call<OPHubResponse.UpdateApptStatusResponse> addCharges(@Body OPHubRequests.AddChargesReq request);

    @GET("appointment/getQR")
    Call<OPHubResponse.GetApptQRResponse> getApptQRDetails(@Query("hospital_id") int hId, @Query("token") String apptId);

    @POST("EncryptForPayment")
    Call<BookAppointmentOnlineRes> payPendingBill(@Body JsonArray array, @Query("request_from") String cat);

    @POST("billing/getOnePatCharge")
    Call<GetPatientChargeDetResponse> getPatientChargeDetails(@Query("hospital_id") int hId, @Query("patient_charge_id") int chargeId);

    @PATCH("billing/{chargeId}")
    Call<OPHubResponse.UpdateApptStatusResponse> updatePatientChargeDet(@Path("chargeId") int id, @Body OPHubRequests.UpdateChargesReq req);

    @GET("billing/getInvoice")
    Call<GetInvoiceDataResponse> getBillingInvoiceData(@Query("hospital_id") int hId, @Query("transaction_id") String txnId);

    @PATCH("appointment/add-or-discount-charges/{chargeId}")
    Call<List<OPHubResponse.UpdateApptStatusResponse>> saveDiscounts(@Path("chargeId") int id, @Body OPHubRequests.SaveDiscountsReq saveDiscReq);

    @POST("abha-v3/generate-otp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> generateAadhaarOTP(@Body OPHubRequests.GenerateAadhaarOTPRequest request);

    @POST("abha-v3/enrol-by-aadhaar")
    Call<VerifyAadhaarOTPResp> verifyAadhaarOTP(@Body OPHubRequests.VerifyAadhaarOTPRequest request);

    @POST("abha-v3/change-email/send-otp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> generateEmailOTP(@Body OPHubRequests.GenerateEmailOTPRequest request);

    @POST("abha-v3/change-email/verify-otp")
    Call<VerifyEmailOTPResp> verifyEmailOTP(@Body OPHubRequests.VerifyOtpRequest request);

    @POST("abha-v3/change-phone/verify-otp")
    Call<VerifySecondOTPResp> verifySecondOTP(@Body OPHubRequests.VerifyOtpRequest request);

    @POST("abha-v3/change-phone/send-otp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> generateChangePhoneOTP(@Body OPHubRequests.GenerateEmailOTPRequest request);

    @POST("abha-v3/change-email/verify-otp")
    Call<VerifyEmailOTPResp> verifyChangePhoneOTP(@Body OPHubRequests.VerifyOtpRequest request);

    @GET("abha-v3/enrollment/enrol/suggestion")
    Call<AbhaUsernameSuggestionResp> abhaUsernameSuggestion(@Header("TRANSACTION_ID") String txnId);

    @POST("abha-v3/custom/abha-address")
    Call<AbhaAddressCreationResp> abhaAddressCreation(@Body OPHubRequests.AbhaAddressReq request);

    @GET("abha-v3/profile/abha-card")
    Call<ResponseBody> downloadAbhaCard(@Header("X-token") String token);

    @GET("abha-v3/profile/account")
    Call<AbhaProfileInfoResponse> getAbhaProfileInfo(@Header("X-token") String token);

    @POST("m1-abha-address-verification")
    Call<AbhaAddressVerifyResponse> verifyAbhaAddr(@Body OPHubRequests.verifyAbhaAddr request);

    @POST("m1-verification-of-abha-address-send-otp")
    Call<AbhaUserNameVerifyResponse> sendOtpUserNameVerify(@Body OPHubRequests.sendOtpUserNameVerify request);

    @POST("m1-verification-of-abha-address-verify-otp")
    Call<AbhaUserNameOtpVerifyResponse> verifyOtpResponse(@Body OPHubRequests.verifyAbhaUserNameOtp request);

    @POST("abha-login-request-otp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> getMobileOTP(@Body OPHubRequests.GetMobileOTPRequest request);

    @POST("phr-abha-login-verify-otp")
    Call<VerifyMobileOTPResponse> verifyMobileOTP(@Body OPHubRequests.VerifyOtpRequest request);

    @POST("phr-verify-abha-address")
    Call<VerifyMobileOTPResponse.Tokens> verifyAbhaAddress(@Body OPHubRequests.VerifyAbhaAddress request);

    @POST("m1-verification-of-abha-address-get-abha-card")
    Call<ResponseBody> downloadAbhaCardUserVerify(@Body OPHubRequests.UserNameVerifyCardToken request);

    @POST("abha_state_code")
    Call<List<OPHubResponse.StateResponse>> getStates();

    @POST("abha_district_code")
    Call<List<OPHubResponse.DistrictResponse>> getDistrict(@Body OPHubRequests.DistrictCodeRequest request);

    @POST("phr-creation-of-abha-address-using-mobile-address-create")
    Call<AbhaAddrCreationResponse> createAbhaAddr(@Body AbhaAddrCreationRequest request);

    @POST("abha-v3/retrieve-abha-aadhaarotp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> getOTPLinkABHA(@Body OPHubRequests.GetOTPLinkABHAReq request);

    @POST("abha-v3/retrieve-abha-verifyotp")
    Call<VerifyOTPLinkABHAResp> verifyOTPLinkABHA(@Body OPHubRequests.VerifyOTPLinkABHAReq request);

    @POST("abha-v3/verify/user")
    Call<OPHubResponse.TokenResponse> linkAbhaNo(@Header("T-token") String token, @Body OPHubRequests.LinkAbhaNoRequest request);

    @POST("phr-creation-of-abha-address-using-mobile-address-check")
    Call<Boolean> checkUserName(@Body OPHubRequests.CheckAbhaUsername request);

    @POST("phr-get-card")
    Call<ResponseBody> getPhrAbhaCardDownload(@Body OPHubRequests.GetAbhaCardRequest request);

    @POST("abha-v3/retrieve-abha-mobileotp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> getMobileNoOTP(@Body OPHubRequests.GetMobileOTPRequest request);

    @POST("phr-creation-of-abha-address-using-mobile-otp-verification")
    Call<VerifyMobileOTPResponse> verifyMobileNoOTP(@Body OPHubRequests.VerifyMobileOTPReq request);


    //Mobile number to verify link abha (New flow)
    @POST("find-abha-number-by-mobile-number-verify-otp")
    Call<VerifyNewMobileOTPResponse> verifyNewMobileNoOTP(@Body OPHubRequests.VerifyMobileOTPReq request);


    @POST("phr-creation-of-abha-address-using-mobile-address-suggesstion")
    Call<OPHubResponse.AbhaAddrSuggestionResp> abhaAddressSuggestion(@Body OPHubRequests.AbhaAddrSuggestionReq request);

    @POST("consent-request-initiate")
    Call<List<ConsentRequestResponse>> getConsentRequest(@Body ConsentRequest request);


    @POST("fetched-documents-using-artefact-id")
    Call<ResponseBody> viewConsentReq(@Body OPHubRequests.ViewConsentReq request);

    @POST("m1-verification-of-abha-address-profile-get")
    Call<AbhaProfileResp> getAbhaProfile(@Body OPHubRequests.UserNameVerifyCardToken request);

    @POST("phr-get-profile")
    Call<PhrProfileResponse> getPhrProfile(@Body OPHubRequests.UserNameVerifyCardToken request);

    @GET("clinical-notes-with-abha")
    Call<GetClinicalNotesResponse> getClinicalNotes(@Query("opd_id") String opdId, @Query("hospital_id") int hospitalId);

    @POST("opd-prescription")
    Call<PostPrescriptionResponse> postPrescription(@Body PostPrescriptionRequest request);

    @PATCH("opd-prescription")
    Call<PostPrescriptionResponse> editPrescription(@Body PostPrescriptionRequest request);

    @GET("opd-prescription")
    Call<PrescriptionResponse> getPrescription(@Query("opd_id") int opdId, @Query("hospital_id") int hospitalId);

    @DELETE("opd-prescription")
    Call<PostPrescriptionResponse> deletePrescription(@Query("id") int id, @Query("hospital_id") int hospitalId);

    @POST("clinical-notes-with-abha")
    Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> getClinicalNotesRequest(@Body ClinicalNotesRequestResponse request);


    @GET("diagnosis-category-list")
    Call<CategoriesResponse> getCategoriesResponse(@Query("search") String value);

    @GET("diagnosis-sub-category-list")
    Call<SubCategoriesResponse> getSubCategoriesResponse(@Query("category_id") String opdId);

    @PATCH("clinical-notes-with-abha")
    Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> updateClinicalNotesRequest(@Body ClinicalNotesRequestPatch request);


    @DELETE("clinical-notes-with-abha/diagnosis-report")
    Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> deleteDiagnosisReport(@Query("id") Integer id, @Query("hospital_id") Integer hospitalId);


    @GET("chief-complaints")
    Call<List<ClinicalSuggestion>> getClinicalSuggestion(@Query("search") String search);

    @GET("preview-doc")
    Call<PreviewResponse> getPreview(@Query("opd_id") int opdId, @Query("hospital_id") int hospitalId);

    @POST("upload-doc-previw/get")
    Call<ResponseBody> getPreviewPdf(@Body OPHubRequests.ShowProfileImageRequest req);

    @Multipart
    @POST("upload-doc-previw")
    Call<OPHubResponse.FileUploadResponse> submitForm(@Part MultipartBody.Part filePart);

    @POST("upload-doc-previw")
    Call<ResponseBody> submitForm(@Body OPHubRequests.UploadPreviewPdf filePart);

    @POST("upload-doc-previw/get")
    Call<ResponseBody> getCaseSheet(@Body OPHubRequests.ShowProfileImageRequest req);

    @Multipart
    @POST("upload-doc-previw") // Replace with your actual endpoint
    Call<OPHubResponse.FileUploadResponse> submitForm(
            @Part MultipartBody.Part filePart,
            @Part("opd_id") RequestBody value2,
            @Part("hospital_id") RequestBody value3,
            @Part("abhaAddress") RequestBody value4
    );


    @DELETE("clinical-notes-with-abha/chief-complaint-basic")
    Call<ClinicalNotesRequestResponse.ConsentRequestResponsedata> deleteChiefComplaintBasic(@Query("id") Integer id, @Query("hospital_id") Integer hospitalId);


    @POST("manual-vitals")
    Call<VitalsRequestResponse> postVitals(@Query("opd_id") int opdId, @Query("hospital_id") int hospitalId, @Body VitalsRequestResponse req);



    @GET("manual-vitals")
    Call<VitalsResquest> getVitals(@Query("opd_id") int opdId, @Query("hospital_id") int hospitalId);

    @POST("file_upload")
    Call<FhirBundleUploadResponse> uploadFhirBundle(@Body RequestBody body);

    @POST("hiecm/api/v3/generate-token")
    Call<List<CareContextLinkTokenResponse>> getCareContextToken(@Header("X-HIP-ID") String hipId, @Body CareContextTokenRequest request);

    @POST("link/carecontext")
    Call<List<LinkCareContextResponse>> linkCareContext(@Header("X-LINK-TOKEN") String linkToken, @Header("X-HIP-ID") String hipId, @Body LinkCareContextRequest request);


    @POST("get-pat-details-by-aayush-unique-id/abhaAddress")
    Call<GetPatientProfileResponse.AyusRespons> getAayush(@Body HashMap<String, String> data);

    @POST("get-pat-details-by-aayush-unique-id")
    Call<PatientProfileQR> getQRPatientProfile(@Body HashMap<String, String> data);

    @POST("payments/{payment_id}/capture")
    Call<CaptureModel> capturePayment(@Path("payment_id") String paymentId, @Header("Authorization") String authHeader, @Body CaptureModel.RequestCapture request);

    @POST("login/getHosDetails")
    Call<HospitalDetailsResponse> getHospitalDetails(@Query("hospital_id") Integer hospitalID);

    @POST("check-for-duplicate-appointment")
    Call<HospitalDetailsResponse.CheckDuplicateAppointmentResponse> checkDuplicateAppointment(@Body HospitalDetailsResponse.CheckDuplicateAppointmentRequest request);

    @POST("appointment/updatePaymentDetails")
    Call<HospitalDetailsResponse.AfterPaymentModel> afterPayment(@Body HospitalDetailsResponse.AfterPaymentModel request,@Query("transaction_id") Integer transaction_id);

    @PATCH("appointment/status/{appoinment_no}")
    Call<ResponseBody> updateStatus( @Body HashMap<String, String> data,@Path("appoinment_no") String id);

    //update abha
    @POST("link/update_abha_address")
    Call<HospitalDetailsResponse.UpDateAbhaResponse> UpDateAbha(@Body HashMap<String, String> data);

    //abha unqiid
    @POST("get-pat-details-by-aayush-unique-id/abhaAddress")
    Call<GetPatientProfileResponse.AaysuhUnqicResponse> getAayushId(@Body HashMap<String, String> data);

    @POST("check_old_patient")
    Call<ExistPatientDetail> getExistingPatient(@Body OPHubRequests.GetExistPatientDetReq request);


    //abha list
    @POST("get-abha-address-of-patient")
    Call<GetPatientProfileResponse.AbhaAdderssListResponse> abhaAdderessList(@Body HashMap<String, String> data);

    @GET("appointment/Today")
    Call<List<GetAppointmentResponse>> getAppointmentsToday(@Query("fromDate") String fromDate, @Query("toDate") String toDate,
                                                       @Query("doctorId") String doctorId, @Query("appointStatus") String appointStatus,
                                                       @Query("payment_status") String paymentStatus, @Query("hospital_id") int hospital_id);

    //vibrasense
    @POST("vitals-device")
    Call<VibrasenseRequest.VibrasenseResponse> vibrasenseRequest(@Body VibrasenseRequest request);


    @PATCH("patientprofile/abha-number")
    Call<List<UpdatePatientResponse>> updatePatientAbha(@Query("patientId") int id, @Query("hospital_id") int hospId, @Body UpdatePatientRequest request);

    @POST("find-abha-number-by-mobile-number")
    Call<List<VerifyMobileNumberList>> getMobileList(@Body OPHubRequests.GetMobileListOTPRequest request);

    @POST("find-abha-number-by-mobile-number-send-otp")
    Call<OPHubResponse.GenerateAadhaarOTPResp> getMobileNoVerifyOTP(@Body OPHubRequests.GetMobileOTPRequest request);


    @POST("get-pat-details-by-aayush-unique-id/check/abhaAddress")
    Call<OPHubResponse.VerifyAbhaAddress> getAbhaHospital(@Body OPHubResponse.VerifyRequest request);

    @POST("get-pat-details-by-aayush-unique-id/check/abhaNumber/abhaAddress")
    Call<OPHubResponse.VerifyAbhaAddress> CheckAddressNumber(@Body OPHubResponse.VerifyRequest request);

    //ABHA Mobile verification flow register status check API
    @POST("patientprofile/get-registration-status")
    Call<VerifyMobileListStatus.VerifyMobileListStatusResponse> getMobileListStatus(@Body VerifyMobileListStatus request, @Query("hospital_id") int hospId);

    @GET("vitals-device")
    Call<VibarasensGetResponse> getVitalsdata(@Query("opd_id") int id, @Query("hospital_id") int hospId);


    @POST("unlink-abha-from-patient")
    Call<AbhaUserNameVerifyResponse> getABHAUnlink(@Body Map<String, Object> body);

    @POST("check_old_patient/v2")
    Call<ExistPatientDetail> getExistingPatientV2(@Body OPHubRequests.GetExistPatientDetReq request, @Query("limit") int limit, @Query("page") int page);

    @POST("voice-text-sarvam")
    Call<PatientPreviewVoiceResponse> getClinicalData(@Body Map<String, Object> body);

    @Multipart
    @POST("face/upload")
    Call<ImageResponse> uploadImageUrl(@Part MultipartBody.Part filePart);

    @POST("face/getImage")
    Call<ResponseBody> getProfileImageNew(@Body OPHubRequests.ShowProfileImageRequest request);

    //TODO Version 2 API


    @GET("appointment/v2/Today")
    Call<GetAppointmentResponse> getV2AppointmentsToday(@Query("fromDate") String fromDate, @Query("toDate") String toDate,
                                                                @Query("doctorId") String doctorId, @Query("appointStatus") String appointStatus,
                                                                @Query("payment_status") String paymentStatus, @Query("hospital_id") int hospital_id,@Query("limit") String limit,@Query("page") String page);
    @GET("appointment/v2/upcoming")
    Call<GetAppointmentResponse> getV2Appointments(@Query("fromDate") String fromDate, @Query("toDate") String toDate,
                                                       @Query("doctorId") String doctorId, @Query("appointStatus") String appointStatus,
                                                       @Query("payment_status") String paymentStatus, @Query("hospital_id") int hospital_id,@Query("limit") String limit,@Query("page") String page);
    @GET("appointment/v2/history")
    Call<GetAppointmentResponse> getV2AppointmentHistory(@Query("fromDate") String fromDate, @Query("toDate") String toDate,
                                                             @Query("doctorId") String doctorId, @Query("appointStatus") String appointStatus,
                                                             @Query("payment_status") String paymentStatus, @Query("hospital_id") int hospital_id,@Query("limit") String limit,@Query("page") String page);


    @GET("billing/v2/pending")
    Call<V2PendingBillHistoryResponse> getPendingBillHistory(@Query("hospital_id") int hospital_id, @Query("limit") String limit, @Query("page") String page);


    @GET("billing/v2/findallpaid")
    Call<V2BillingHistoryResponse> getBillingHistory(@Query("hospital_id") int hospital_id, @Query("patient_id") String patient_id, @Query("from_date") String fromDate, @Query("to_date") String toDate, @Query("payment_method") String paymentMethod, @Query("date") String date, @Query("limit") String limit, @Query("page") String page);

    @GET("patient_appointment_list/v2/today")
    Call<GetAppointmentResponse> getTodayAppts(@Query("hospital_id") int id, @Query("patient_id") int patientId, @Query("doctor") String doctorId, @Query("date") String date, @Query("limit") String limit, @Query("page") String page);


    @GET("patient_appointment_list/v2/upcoming")
    Call<GetAppointmentResponse> getUpcomingAppts(@Query("hospital_id") int id, @Query("patient_id") int patientId, @Query("doctor") String doctorId, @Query("date") String date, @Query("limit") String limit, @Query("page") String page);

    @GET("patient_appointment_list/v2/history")
    Call<GetAppointmentResponse> getHistoryAppts(@Query("hospital_id") int id, @Query("patient_id") int patientId, @Query("doctor") String doctorId, @Query("date") String date, @Query("limit") String limit, @Query("page") String page);


    @GET("doctors/v2")
    Call<GetV2DoctorResponse> getAllDoctors(@Query("hospital_id") String id, @Query("search") String speciality, @Query("gender") String gender, @Query("date") String date, @Query("limit") String limit, @Query("page") int page);

    @POST("consent-list")
    Call<GetConsentListResp> getConsentList(@Body OPHubRequests.GetConsentListReq request);

    @GET("billing/v2/getPendingSectionList")
    Call<OpdDropdownRes> getDropDownOpd(@Query("patient_id") int pId, @Query("hospital_id") int hId);

    @POST("billing/v2/addcharge")
    Call<OPHubResponse.UpdateApptStatusResponse> addV2Charges(@Body OPHubRequests.AddChargesReq request);

    @POST("billing/v2/makePayment")
    Call<OPHubResponse.UpdateApptStatusResponse> cashBillPaymentV2(@Body OPHubRequests.CashBillPayReqV2 request);

    @POST("login/getAccessToken")
    Call<OPHubResponse.TokenResponse> getAccessToken(
            @Query("username") String username,
            @Header("authorization") String bearerToken
    );
    @POST("patient/checkExistingPatient")
    Call<List<DataResponse>> checkExistingPatient(@Body HashMap<String, String> data);


    @PATCH("patientprofile/update-abha-number")
    Call<ResponseBody> updateAbhaNumber(@Query("hospital_id") String hospitalId,@Query("aayush_unique_id") String aayushId, @Query("abhaNumber") String abhaNumber);
}

