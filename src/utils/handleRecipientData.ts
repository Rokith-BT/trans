/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleRecipientsData = async (getRecipientById: any) => {
  const organIDs = {
    Heart: "11",
    Kidney: "1",
    Liver: "4",
    Pancreas: "10",
    Lungs: "12",
  };
  const rcipientMedical = getRecipientById?.recipientMedicalDetails;
  const data = {
    ...getRecipientById?.recipient,
    address: getRecipientById?.recipientAddresses,
  };
  const datafc = {
    familyContacts: getRecipientById.recipientFamilyContacts,
  };
  const datamc = {
    ...getRecipientById.recipientMedicalDetails,
    height: rcipientMedical?.height,
    weight: rcipientMedical?.weight,
    bmi: rcipientMedical?.bmi,
    isSmoker: rcipientMedical?.isSmoker ? "1" : "0",
    isAlcohol: rcipientMedical?.isAlcohol ? "1" : "0",
    periodOfAssistanceId: rcipientMedical?.periodOfAssistanceId,
    isDrugs: rcipientMedical?.isDrugs ? "1" : "0",
    isHypertesnsion: rcipientMedical?.isHypertesnsion ? "1" : "0",
    isDiabetes: rcipientMedical?.isDiabetes ? "1" : "0",
    isCad: rcipientMedical?.isCad ? "1" : "0",
    isOtherLungDisease: rcipientMedical?.isOtherLungDisease ? "1" : "0",
    isEpilepsy: rcipientMedical?.isEpilepsy ? "1" : "0",
    hepatitisB: rcipientMedical?.hepatitisB,
    hepatitisC: rcipientMedical?.hepatitisC,
    historyOfTb: rcipientMedical?.historyOfTb ? "1" : "0",
    historyOfPeripheralvascularDisease:
      rcipientMedical?.historyOfPeripheralvascularDisease ? "1" : "0",
    historyOfPreviousTransplant: rcipientMedical?.historyOfPreviousTransplant
      ? "1"
      : "0",
    organTransplanted: rcipientMedical?.organTransplanted,
    historyOfCovid: rcipientMedical?.historyOfCovid ? "1" : "0",
    covidFreePeriodId: rcipientMedical?.covidFreePeriodId,
    historyOfMalignancy: rcipientMedical?.historyOfMalignancy ? "1" : "0",
    typeofMalignancy: rcipientMedical?.typeofMalignancy,
    durationofremissionId: rcipientMedical?.durationofremissionId,
    hbsAg: rcipientMedical?.hbsAg,
    antiHbsAg: rcipientMedical?.antiHbsAg,
    hcv: rcipientMedical?.hcv,
    epsteinBarr: rcipientMedical?.epsteinBarr,
    hiv: rcipientMedical?.hiv,
    cmv: rcipientMedical?.cmv,
    vaccinationStatus: getRecipientById?.recipientVaccinationDetails,
  };
  const dataOrgan: any = { organReq: [] };
  getRecipientById?.recipientOrganMappings?.map((ele: any) => {
    if (ele?.organId === Number(organIDs.Heart)) {
      dataOrgan.organReq.push({
        recipientId: ele?.recipientId,
        organId: ele?.organId.toString(),
        organName: ele.organ?.name,
        consultantId: ele?.consultantId.toString(),
      });
      dataOrgan.cardiacIndex =
        ele?.recipientHeartEvaluation.cardiacIndex.toString();
      dataOrgan.tpgTransPulmonaryGradient =
        ele?.recipientHeartEvaluation.tpgtransPulmonaryGradient.toString();
      dataOrgan.pvri = ele?.recipientHeartEvaluation?.pvri;
      dataOrgan.sixMinuteWalkTest = ele?.recipientHeartEvaluation
        ?.sixMinuteWalkTestAble
        ? "1"
        : "0";
      dataOrgan.sixMinuteWalkTestDistance =
        ele?.recipientHeartEvaluation?.sixMinuteWalkTestDistance;
      dataOrgan.NtProBnp = ele?.recipientHeartEvaluation?.ntproBnppercentage;
      dataOrgan.historyOfPreviousNonTransplantHeartAndLungSurgery = ele
        ?.recipientHeartEvaluation?.historyNonTransplantSurgery
        ? "1"
        : "0";
      dataOrgan.surgeryDetails =
        ele?.recipientHeartEvaluation?.surgeryDetails?.toString();
      dataOrgan.heartID = ele?.recipientHeartEvaluation?.id
        ? ele?.recipientHeartEvaluation?.id
        : 0;
    } else if (ele?.organId === Number(organIDs.Kidney)) {
      dataOrgan.organReq.push({
        recipientId: ele?.recipientId,
        organId: ele?.organId.toString(),
        consultantId: ele?.consultantId.toString(),
      });
      dataOrgan.ureaKidny = ele?.recipientKidneyEvaluation?.urea;
      dataOrgan.creatineKidny = ele?.recipientKidneyEvaluation?.creatine;
      dataOrgan.serumSodiumKidny = ele?.recipientKidneyEvaluation?.serumSodium;
      dataOrgan.serumPotassiumKidny =
        ele?.recipientKidneyEvaluation?.serumPotassium;
      dataOrgan.serumChlorideKidny =
        ele?.recipientKidneyEvaluation?.serumChloride;
      dataOrgan.serumBicarbonateKidny =
        ele?.recipientKidneyEvaluation?.serumBicarbonate;
      dataOrgan.firstDialysisDateKidny =
        ele?.recipientKidneyEvaluation?.firstDialysisDate?.toString();
      dataOrgan.periodUndergoingDialysisKidny =
        ele?.recipientKidneyEvaluation?.periodUndergoingDialysis;
      dataOrgan.kidneyID = ele?.recipientKidneyEvaluation?.id
        ? ele?.recipientKidneyEvaluation?.id
        : 0;
    } else if (ele?.organId === Number(organIDs.Liver)) {
      dataOrgan.organReq.push({
        recipientId: ele?.recipientId,
        organId: ele?.organId.toString(),
        consultantId: ele?.consultantId.toString(),
      });
      dataOrgan.isAlf = ele?.isAlf;
      dataOrgan.alfListingType =
        ele?.recipientALFBasicDetail?.alfListingTypeId.toString();
      dataOrgan.alfEvaluationSheet =
        ele?.recipientALFBasicDetail?.alfEvlouationSheetDoc;
      dataOrgan.additionalHepatologyNotes =
        ele?.recipientALFBasicDetail?.additionalHepatologyNotesDoc;
      dataOrgan.consultantShortSummary =
        ele?.recipientALFBasicDetail?.consulatantShortSummaryDoc;
      dataOrgan.alfId = ele?.recipientALFBasicDetail?.id;
      dataOrgan.historyOfComplications =
        ele?.recipientLiverEvaluation?.historyOfComplicationsId.toString();
      dataOrgan.complicationDescription =
        ele?.recipientLiverEvaluation?.complicationDescription.toString();
      dataOrgan.cancerScreening =
        ele?.recipientLiverEvaluation?.cancerScreeningId?.toString();
      dataOrgan.meldScore = ele?.recipientLiverEvaluation?.meldScore;
      dataOrgan.bilirubin = ele?.recipientLiverEvaluation?.bilirubin;
      dataOrgan.albumin = ele?.recipientLiverEvaluation?.albumin;
      dataOrgan.globulin = ele?.recipientLiverEvaluation?.globulin;
      dataOrgan.ggt = ele?.recipientLiverEvaluation?.ggt;
      dataOrgan.ast = ele?.recipientLiverEvaluation?.ast;
      dataOrgan.alt = ele?.recipientLiverEvaluation?.alt;
      dataOrgan.coronaryAngiogram =
        ele?.recipientLiverEvaluation?.coronaryAngiogram;
      dataOrgan.stressTest = ele?.recipientLiverEvaluation?.stressTest;
      dataOrgan.roomAirAbg = ele?.recipientLiverEvaluation?.roomAirAbg;
      dataOrgan.pft = ele?.recipientLiverEvaluation?.pft;
      dataOrgan.ureaLiver = ele?.recipientLiverEvaluation?.urea;
      dataOrgan.creatineLiver = ele?.recipientLiverEvaluation?.creatine;
      dataOrgan.uricAcidLiver = ele?.recipientLiverEvaluation?.uricAcid;
      dataOrgan.serumSodiumLiver = ele?.recipientLiverEvaluation?.serumSodium;
      dataOrgan.serumPotassiumLiver =
        ele?.recipientLiverEvaluation?.serumPotassium;
      dataOrgan.serumChlorideLiver =
        ele?.recipientLiverEvaluation?.serumChloride;
      dataOrgan.serumBicarbonateLiver =
        ele?.recipientLiverEvaluation?.serumBicarbonate;
      dataOrgan.serumMagnesiumLiver =
        ele?.recipientLiverEvaluation?.serumMagnesium;
      dataOrgan.serumPhosphateLiver =
        ele?.recipientLiverEvaluation?.serumPhosphate;
      dataOrgan.inr = ele?.recipientLiverEvaluation?.inr;
      dataOrgan.aptt = ele?.recipientLiverEvaluation?.aptt;
      dataOrgan.platelets = ele?.recipientLiverEvaluation?.platelets;
      dataOrgan.fibrinogen = ele?.recipientLiverEvaluation?.fibrinogen;
      dataOrgan.liverID = ele?.recipientLiverEvaluation?.id
        ? ele?.recipientLiverEvaluation?.id
        : 0;
    } else if (ele?.organId === Number(organIDs.Pancreas)) {
      dataOrgan.organReq.push({
        recipientId: ele?.recipientId,
        organId: ele?.organId.toString(),
        consultantId: ele?.consultantId.toString(),
      });
      dataOrgan.historyOfComplicationsPancreas =
        ele?.recipientLiverEvaluation?.historyOfComplicationsId.toString();
      dataOrgan.complicationDescriptionPancreas =
        ele?.recipientLiverEvaluation?.complicationDescription.toString();
      dataOrgan.cancerScreeningPancreas =
        ele?.recipientLiverEvaluation?.cancerScreeningId?.toString();
      dataOrgan.meldScorePancreas = ele?.recipientLiverEvaluation?.meldScore;
      dataOrgan.bilirubinPancreas = ele?.recipientLiverEvaluation?.bilirubin;
      dataOrgan.albuminPancreas = ele?.recipientLiverEvaluation?.albumin;
      dataOrgan.globulinPancreas = ele?.recipientLiverEvaluation?.globulin;
      dataOrgan.ggtPancreas = ele?.recipientLiverEvaluation?.ggt;
      dataOrgan.astPancreas = ele?.recipientLiverEvaluation?.ast;
      dataOrgan.altPancreas = ele?.recipientLiverEvaluation?.alt;
      dataOrgan.coronaryAngiogramPancreas =
        ele?.recipientLiverEvaluation?.coronaryAngiogram;
      dataOrgan.stressTestPancreas = ele?.recipientLiverEvaluation?.stressTest;
      dataOrgan.roomAirAbgPancreas = ele?.recipientLiverEvaluation?.roomAirAbg;
      dataOrgan.pftPancreas = ele?.recipientLiverEvaluation?.pft;
      dataOrgan.ureaPancreas = ele?.recipientLiverEvaluation?.urea;
      dataOrgan.creatinePancreas = ele?.recipientLiverEvaluation?.creatine;
      dataOrgan.uricAcidPancreas = ele?.recipientLiverEvaluation?.uricAcid;
      dataOrgan.serumSodiumPancreas =
        ele?.recipientLiverEvaluation?.serumSodium;
      dataOrgan.serumPotassiumPancreas =
        ele?.recipientLiverEvaluation?.serumPotassium;
      dataOrgan.serumChloridePancreas =
        ele?.recipientLiverEvaluation?.serumChloride;
      dataOrgan.serumBicarbonatePancreas =
        ele?.recipientLiverEvaluation?.serumBicarbonate;
      dataOrgan.serumMagnesiumPancreas =
        ele?.recipientLiverEvaluation?.serumMagnesium;
      dataOrgan.serumPhosphatePancreas =
        ele?.recipientLiverEvaluation?.serumPhosphate;
      dataOrgan.inrPancreas = ele?.recipientLiverEvaluation?.inr;
      dataOrgan.apttPancreas = ele?.recipientLiverEvaluation?.aptt;
      dataOrgan.plateletsPancreas = ele?.recipientLiverEvaluation?.platelets;
      dataOrgan.fibrinogenPancreas = ele?.recipientLiverEvaluation?.fibrinogen;
      dataOrgan.pancreasID = ele?.recipientLiverEvaluation?.id
        ? ele?.recipientLiverEvaluation?.id
        : 0;
    } else if (ele?.organId === Number(organIDs.Lungs)) {
      dataOrgan.organReq.push({
        recipientId: ele?.recipientId,
        organId: ele?.organId.toString(),
        consultantId: ele?.consultantId.toString(),
      });
      dataOrgan.causeOfLungDisease =
        ele?.recipientLungEvaluation?.causeofLungDiseaseId.toString();
      dataOrgan.sixMinuteWalkTestLungs = ele?.recipientLungEvaluation
        ?.sixMinWalkTestComp
        ? "1"
        : "0";
      dataOrgan.sixMinuteWalkTestDistanceLungs =
        ele?.recipientLungEvaluation?.sixMWalkTestDist;
      dataOrgan.historyOfPreviousNonTransplantHeartAndLungSurgeryLungs = ele
        ?.recipientLungEvaluation?.histPrevNonTxHrtLungSurg
        ? "1"
        : "0";
      dataOrgan.surgeryDetailsLungs =
        ele?.recipientLungEvaluation?.surgeryDetails;
      dataOrgan.forcedExpiratoryVolumeIn1Second =
        ele?.recipientLungEvaluation?.fev1;
      dataOrgan.forcedVitalCapacity = ele?.recipientLungEvaluation?.fvc;
      dataOrgan.maximalVoluntaryVentilation = ele?.recipientLungEvaluation?.mvv;
      dataOrgan.dlco = ele?.recipientLungEvaluation?.dlco;
      dataOrgan.selfOnRoomAir = ele?.recipientLungEvaluation?.selfonRoomAir
        ? "1"
        : "0";
      dataOrgan.supplement02 = ele?.recipientLungEvaluation?.supplement02
        ? "1"
        : "0";
      dataOrgan.nonInvasiveVentilation = ele?.recipientLungEvaluation?.niv
        ? "1"
        : "0";
      dataOrgan.mechanicalVentilation = ele?.recipientLungEvaluation
        ?.mechanicalVentilation
        ? "1"
        : "0";
      dataOrgan.ecmo = ele?.recipientLungEvaluation?.ecmo ? "1" : "0";
      dataOrgan.roomAir = ele?.recipientLungEvaluation?.roomAir?.toString();
      dataOrgan.roomAirFile = ele?.recipientLungEvaluation?.roomAirFile;
      dataOrgan.onOxygen = ele?.recipientLungEvaluation?.onOxygen?.toString();
      dataOrgan.onOxygenFile = ele?.recipientLungEvaluation?.onOxygenFile;
      dataOrgan.lungsID = ele?.recipientLungEvaluation?.id
        ? ele?.recipientLungEvaluation?.id
        : 0;
    } else {
      dataOrgan.organReq.push({
        recipientId: ele?.recipientId,
        organId: ele?.organId.toString(),
        consultantId: ele?.consultantId.toString(),
      });
    }
  });
  const fileAttachDocs = getRecipientById?.recipientDocuments;
  const fileDoc = {
    ...fileAttachDocs,
    clinicalEstablishmentCertificate:
      fileAttachDocs?.patientSignedDeclarationDoc,
    uploadDoctorDeclaration: fileAttachDocs?.doctorDeclarationDoc,
    aadhar: fileAttachDocs?.aadharDoc,
    urineCulture: fileAttachDocs?.urineCultureDoc,
    completeHemogram: fileAttachDocs?.completeHemogramDoc,
    bloodSugarHba1c: fileAttachDocs?.bloodSugarHbA1cdoc,
    serumElectrolytes: fileAttachDocs?.serumElectrolytesDoc,
    echo: fileAttachDocs?.echoDoc,
    liverFunctionTests: fileAttachDocs?.liverFunctionTestDoc,
    rtpcr: fileAttachDocs?.rtpcrdoc,
    chestXRay: fileAttachDocs?.chestXrayDoc,
    ecg: fileAttachDocs?.ecgdoc,
    CtChest: fileAttachDocs?.ctchestDoc,
    UsgAbdomen: fileAttachDocs?.usgabdomenDoc,
    kubImaging: fileAttachDocs?.kubimagingDoc,
    anyOtherInvestigation1: fileAttachDocs?.anyOtherInvestigation1Doc,
    anyOtherInvestigation2: fileAttachDocs?.anyOtherInvestigation2Doc,
    anyOtherInvestigation3: fileAttachDocs?.anyOtherInvestigation3Doc,
    anyOtherInvestigation4: fileAttachDocs?.anyOtherInvestigation4Doc,
  };

  return { data, datafc, datamc, dataOrgan, fileDoc };
};
