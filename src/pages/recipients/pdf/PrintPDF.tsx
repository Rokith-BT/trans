import { pdf } from '@react-pdf/renderer';
import PreviewPDF from './PriviewPDF';
import {
  OrganRequestData,
  Organs,
  RecipientBasicDetailsType,
  RecipientFamilyContact,
  RecipientMedicalDetails
} from '@/types/recipient';
import { formatDateAndTime } from '@/utils/dateutils';
interface InfoType {
  label: string;
  value?: string | number;
  fullWidth?: boolean;
}
export const handlePrint = async (
  basicDetails?: RecipientBasicDetailsType,
  familyContact?: RecipientFamilyContact,
  medicalDetails?: RecipientMedicalDetails,
  organsRequest?: OrganRequestData,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  transferRecipient?: any,
  isTransferReciient?: boolean
) => {
  console.log(basicDetails, 'basicDetailsbasicDetails', medicalDetails, organsRequest);

  if (isTransferReciient) {
    const transferRecipientInfo = [
      { label: 'Recipient Name', value: transferRecipient.recipientName },
      { label: 'TRANSTAN ID', value: transferRecipient.transtanId },
      { label: 'Gender', value: 'Male' },
      { label: 'Blood Group', value: transferRecipient.bloodGroup?.id === 3 && 'B+' },
      { label: 'Date Of Birth', value: formatDateAndTime(transferRecipient?.dateOfBirth?.toString())?.formattedDate },
      { label: 'Age', value: transferRecipient.age },
      { label: 'Current Hospital Name', value: transferRecipient.currentHospital?.name },
      { label: 'Transferring Hospital Name', value: transferRecipient?.transferringHospital?.name }
    ];
    const organReciTraInfo = transferRecipient.organMappings?.map(
      (el: { organId: number; currentConsultantId: number }) => [
        {
          label: 'ORGAN',
          value:
            el.organId === 1
              ? 'Heart'
              : el.organId === 2
                ? 'Kidney'
                : el.organId === 3
                  ? 'Liver'
                  : el.organId === 4
                    ? 'Pancreas'
                    : el.organId === 5
                      ? 'Dual lungs'
                      : 'Heart'
        },
        { label: 'CONSULTANT NAME', value: el.currentConsultantId === 1 ? 'DR.Naveen' : 'DR.Suriya' }
      ]
    );
    const blob = await pdf(
      <PreviewPDF
        transferRecipientInfo={transferRecipientInfo}
        organReciTraInfo={organReciTraInfo}
        isTransferReciient={isTransferReciient}
      />
    ).toBlob(); // Generate Blob from PDF

    const blobURL = URL.createObjectURL(blob);
    const printWindow = window.open(blobURL, '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      console.error('Failed to open the print window.');
    }
  } else {
    const basicInfo: InfoType[] = [
      {
        label: 'Recipient Name',
        value: basicDetails?.name
      },
      {
        label: 'Recipient ID',
        value: basicDetails?.id
      },
      {
        label: 'Gender',
        value: basicDetails?.gender?.name
      },
      {
        label: 'DOB',
        value: formatDateAndTime(basicDetails?.dateOfBirth.toString())?.formattedDate
      },
      {
        label: 'Age',
        value: basicDetails?.age
      },
      {
        label: 'Father / spouse name',
        value: basicDetails?.fatherOrSpouseName
      },
      {
        label: 'Phone',
        value: basicDetails?.phoneNumber1
      },
      {
        label: 'Alternative Phone',
        value: basicDetails?.phoneNumber1
      },
      {
        label: 'Email',
        value: basicDetails?.email
      },
      {
        label: 'Blood',
        value: basicDetails?.bloodGroup?.name
      },
      {
        label: 'CM Insurance',
        value: basicDetails?.cminsurance?.name
      }
    ];
    const basicAddress = basicDetails?.address?.map((ele) => [
      { label: 'Address Line 1', value: ele.addressLine1 },
      { label: 'Address Line 2', value: ele.addressLine2 },
      { label: 'Town/Village', value: ele.townOrVillage },
      { label: 'Landmark', value: ele.landmark },
      { label: 'Pincode', value: ele.pincode },
      { label: 'City', value: ele.city?.name },
      { label: 'State', value: ele.state?.name },
      { label: 'Country', value: ele.country?.name }
    ]);
    const familyContInfo = familyContact?.familyContacts?.map((ele) => [
      { label: 'Relation Name', value: ele?.name, fullWidth: true },
      { label: 'Relation Type', value: ele?.relationType?.name },
      { label: 'Gender', value: ele.gender?.name },
      { label: 'DOB', value: formatDateAndTime(ele.dateOfBirth?.toString())?.formattedDate },
      { label: 'Phone', value: ele.mobileNumber }
    ]);
    const physicalInfo = [
      { label: 'Height', value: medicalDetails?.height + ' cm' },
      { label: 'Weight', value: medicalDetails?.weight + ' kg' },
      {
        label: 'BMI',
        value:
          (
            Number(medicalDetails?.weight) /
            (((Number(medicalDetails?.height) / 100) * Number(medicalDetails?.height)) / 100)
          ).toFixed(3) + ' km/m2'
      }
    ];
    const medicalInfo = [
      { label: 'Smoker', value: medicalDetails?.isSmoker === '1' ? 'YES' : 'NO' },
      { label: 'Alcohol', value: medicalDetails?.isAlcohol === '1' ? 'YES' : 'NO' },
      { label: 'Period of Assistance', value: medicalDetails?.periodOfAssistanceId },
      { label: 'Drugs', value: medicalDetails?.isDrugs === '1' ? 'YES' : 'NO' },
      { label: 'Hypertension', value: medicalDetails?.isHypertesnsion === '1' ? 'YES' : 'NO' },
      { label: 'Diabetics', value: medicalDetails?.isDiabetes === '1' ? 'YES' : 'NO' },
      { label: 'CAD', value: medicalDetails?.isCad === '1' ? 'YES' : 'NO' },
      {
        label: 'Bronchial Asthma/COPD/Other Lung Disease',
        value: medicalDetails?.isOtherLungDisease === '1' ? 'YES' : 'NO'
      },
      { label: 'Epilepsy', value: medicalDetails?.isEpilepsy === '1' ? 'YES' : 'NO' },
      { label: 'Hepatitis B', value: medicalDetails?.hepatitisB === '1' ? 'YES' : 'NO' },
      { label: 'hepatitis C', value: medicalDetails?.hepatitisC === '1' ? 'YES' : 'NO' },
      { label: 'History of TB', value: medicalDetails?.historyOfTb === '1' ? 'YES' : 'NO' },
      {
        label: 'History of Peripheral Vascular Disease',
        value: medicalDetails?.historyOfPeripheralvascularDisease === '1' ? 'YES' : 'NO'
      },
      {
        label: 'History of Previous Transplant',
        value: medicalDetails?.historyOfPreviousTransplant === '1' ? 'YES' : 'NO'
      },
      { label: 'Organ Transplanted', value: medicalDetails?.organTransplanted },
      { label: 'History of Covid', value: medicalDetails?.historyOfCovid === '1' ? 'YES' : 'NO' },
      { label: 'Covid Free Period', value: medicalDetails?.covidFreePeriodId }
    ];
    const malignancyInfo = [
      { label: 'History of Malignancy', value: medicalDetails?.historyOfMalignancy === '1' ? 'YES' : 'NO' },
      { label: 'Type of Malignancy', value: medicalDetails?.typeofMalignancy },
      { label: 'Duration of remission', value: medicalDetails?.durationofremissionId }
    ];
    const viralogyInfo = [
      { label: 'HbsAg', value: medicalDetails?.hbsAg === '1' ? 'POSITIVE' : 'NEGATIVE' },
      { label: 'Anti HBsAg', value: medicalDetails?.antiHbsAg === '1' ? 'POSITIVE' : 'NEGATIVE' },
      { label: 'HCV', value: medicalDetails?.hcv === '1' ? 'POSITIVE' : 'NEGATIVE' },
      { label: 'Epstein Barr', value: medicalDetails?.epsteinBarr === '1' ? 'POSITIVE' : 'NEGATIVE' },
      { label: 'HIV', value: medicalDetails?.hiv === '1' ? 'POSITIVE' : 'NEGATIVE' },
      { label: 'CMV', value: medicalDetails?.cmv === '1' ? 'POSITIVE' : 'NEGATIVE' }
    ];
    const vaccinationInfo = medicalDetails?.vaccinationStatus?.map((ele) => [
      { label: 'Vaccination Name', value: ele.vaccination?.name },
      { label: 'Vaccination Date', value: formatDateAndTime(ele.vaccinationDate?.toString())?.formattedDate }
    ]);
    const organreqInfo = organsRequest?.organReq?.map((el: Organs) => [
      {
        label: 'ORGAN',
        value:
          el.organId === '1'
            ? 'Heart'
            : el.organId === '2'
              ? 'Kidney'
              : el.organId === '3'
                ? 'Liver'
                : el.organId === '4'
                  ? 'Pancreas'
                  : el.organId === '5'
                    ? 'Dual lungs'
                    : ''
      },
      { label: 'CONSULTANT NAME', value: el.consultantId }
    ]);

    const heartInfo = [
      { label: 'Cardiac Index', value: organsRequest?.cardiacIndex },
      { label: 'TPG Trans pulmonary Gradient', value: organsRequest?.tpgTransPulmonaryGradient },
      { label: 'PVRI', value: organsRequest?.pvri },
      {
        label: '6 Minute  Walk Test -Able to complete ?',
        value: organsRequest?.sixMinuteWalkTest === '1' ? 'YES' : 'NO'
      },
      { label: '6 Minute Walk Test Distance', value: organsRequest?.sixMinuteWalkTestDistance },
      { label: 'NT Pro BNP', value: organsRequest?.NtProBnp },
      {
        label: 'History of Previous Non-Transplant Heart & Lung Surgery ?',
        value: organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgery === '1' ? 'YES' : 'NO'
      },
      { label: 'Surgery Details', value: organsRequest?.surgeryDetails }
    ];
    const kidneyInfo = [
      { label: 'Urea', value: organsRequest?.ureaKidny },
      { label: 'Creatine', value: organsRequest?.creatineKidny },
      { label: 'Serum Sodium', value: organsRequest?.serumSodiumKidny },
      { label: 'Serum Potassium', value: organsRequest?.serumPotassiumKidny },
      { label: 'Serum Chloride', value: organsRequest?.serumChlorideKidny },
      { label: 'Serum Bicarbonate', value: organsRequest?.serumBicarbonateKidny },
      {
        label: 'First Dialysis Date',
        value: formatDateAndTime(organsRequest?.firstDialysisDateKidny?.toString())?.formattedDate
      },

      { label: 'Period Undergoing Dialysis', value: organsRequest?.periodUndergoingDialysisKidny }
    ];
    const liverInfo = [
      { label: 'ALF Listing Type', value: organsRequest?.alfListingType },
      { label: 'ALF Evaluation Sheet', value: organsRequest?.alfEvaluationSheet },
      { label: 'Additional Hepatology Notes', value: organsRequest?.additionalHepatologyNotes },
      { label: 'Consultant Short Summary', value: organsRequest?.consultantShortSummary },
      { label: 'History of Complications', value: organsRequest?.historyOfComplications },
      { label: 'Complication Description', value: organsRequest?.complicationDescription },
      { label: 'Cancer Screening', value: organsRequest?.cancerScreening },
      { label: 'MELD Score', value: organsRequest?.meldScore },
      { label: 'Bilirubin', value: organsRequest?.bilirubin },
      { label: 'Albumin', value: organsRequest?.albumin },
      { label: 'Globulin', value: organsRequest?.globulin },
      { label: 'GGT', value: organsRequest?.ggt },
      { label: 'AST', value: organsRequest?.ast },
      { label: 'ALT', value: organsRequest?.alt },
      { label: 'Coronary Angiogram', value: organsRequest?.coronaryAngiogram },
      { label: 'Stress Test', value: organsRequest?.stressTest },
      { label: 'Room air- ABG', value: organsRequest?.roomAirAbg },
      { label: 'PFT', value: organsRequest?.pft },
      { label: 'Urea', value: organsRequest?.ureaLiver },
      { label: 'Creatine', value: organsRequest?.creatineLiver },
      { label: 'Uric Acid', value: organsRequest?.uricAcidLiver },
      { label: 'Serum Sodium', value: organsRequest?.serumSodiumLiver },
      { label: 'Serum Potassium', value: organsRequest?.serumPotassiumLiver },
      { label: 'Serum Chloride', value: organsRequest?.serumChlorideLiver },
      { label: 'Serum Bicarbonate', value: organsRequest?.serumBicarbonateLiver },
      { label: 'Serum Magnesium', value: organsRequest?.serumMagnesiumLiver },
      { label: 'Serum Phosphate', value: organsRequest?.serumPhosphateLiver },
      { label: 'INR', value: organsRequest?.inr },
      { label: 'APTT', value: organsRequest?.aptt },
      { label: 'Platelets', value: organsRequest?.platelets },
      { label: 'Fibrinogen', value: organsRequest?.fibrinogen }
    ];
    const pancreasInfo = [
      { label: 'History of Complications', value: organsRequest?.historyOfComplicationsPancreas },
      { label: 'Complication Description', value: organsRequest?.complicationDescriptionPancreas },
      { label: 'Cancer Screening', value: organsRequest?.cancerScreeningPancreas },
      { label: 'MELD Score', value: organsRequest?.meldScorePancreas },
      { label: 'Bilirubin', value: organsRequest?.bilirubinPancreas },
      { label: 'Albumin', value: organsRequest?.albuminPancreas },
      { label: 'Globulin', value: organsRequest?.globulinPancreas },
      { label: 'GGT', value: organsRequest?.ggtPancreas },
      { label: 'AST', value: organsRequest?.astPancreas },
      { label: 'ALT', value: organsRequest?.altPancreas },
      { label: 'Coronary Angiogram', value: organsRequest?.coronaryAngiogramPancreas },
      { label: 'Stress Test', value: organsRequest?.stressTestPancreas },
      { label: 'Room air- ABG', value: organsRequest?.roomAirAbgPancreas },
      { label: 'PFT', value: organsRequest?.pftPancreas },
      { label: 'Urea', value: organsRequest?.ureaPancreas },
      { label: 'Creatine', value: organsRequest?.creatinePancreas },
      { label: 'Uric Acid', value: organsRequest?.uricAcidPancreas },
      { label: 'Serum Sodium', value: organsRequest?.serumSodiumPancreas },
      { label: 'Serum Potassium', value: organsRequest?.serumPotassiumPancreas },
      { label: 'Serum Chloride', value: organsRequest?.serumChloridePancreas },
      { label: 'Serum Bicarbonate', value: organsRequest?.serumBicarbonatePancreas },
      { label: 'Serum Magnesium', value: organsRequest?.serumMagnesiumPancreas },
      { label: 'Serum Phosphate', value: organsRequest?.serumPhosphatePancreas },
      { label: 'INR', value: organsRequest?.inrPancreas },
      { label: 'APTT', value: organsRequest?.apttPancreas },
      { label: 'Platelets', value: organsRequest?.plateletsPancreas },
      { label: 'Fibrinogen', value: organsRequest?.fibrinogenPancreas }
    ];
    const dualLungsInfo = [
      { label: 'Cause of Lung Disease', value: organsRequest?.causeOfLungDisease },
      {
        label: '6 Minute  Walk Test -Able to complete ?',
        value: organsRequest?.sixMinuteWalkTestLungs === '1' ? 'YES' : 'NO'
      },
      { label: '6 Minute Walk Test Distance', value: organsRequest?.sixMinuteWalkTestDistanceLungs },
      {
        label: 'History of Previous Non-Transplant Heart & Lung Surgery ?',
        value: organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgeryLungs === '1' ? 'YES' : 'NO'
      },
      { label: 'Surgery Details', value: organsRequest?.surgeryDetailsLungs },
      { label: 'Forced Expiratory Volume in 1 second (FEV1)', value: organsRequest?.forcedExpiratoryVolumeIn1Second },
      { label: 'Forced Vital Capacity (FVC)', value: organsRequest?.forcedVitalCapacity },
      { label: 'Maximal Voluntary Ventilation (MVV)', value: organsRequest?.maximalVoluntaryVentilation },
      { label: 'DLCO', value: organsRequest?.dlco },
      { label: 'Self on Room air', value: organsRequest?.selfOnRoomAir === '1' ? 'YES' : 'NO' },
      { label: 'Supplement O2', value: organsRequest?.supplement02 === '1' ? 'YES' : 'NO' },
      {
        label: 'Non-invasive ventilation (NIV)',
        value: organsRequest?.nonInvasiveVentilation === '1' ? 'YES' : 'NO'
      },
      { label: 'Mechanical Ventilation', value: organsRequest?.mechanicalVentilation === '1' ? 'YES' : 'NO' },
      { label: 'ECMO', value: organsRequest?.ecmo },
      { label: 'Room air', value: organsRequest?.roomAir },
      { label: 'Room air file', value: organsRequest?.roomAirFile },
      { label: 'On Oxygen', value: organsRequest?.onOxygen },
      { label: 'On Oxygen File', value: organsRequest?.onOxygenFile }
    ];
    const blob = await pdf(
      <PreviewPDF
        basicInfo={basicInfo}
        basicAddress={basicAddress}
        familyContInfo={familyContInfo}
        physicalInfo={physicalInfo}
        medicalInfo={medicalInfo}
        malignancyInfo={malignancyInfo}
        viralogyInfo={viralogyInfo}
        vaccinationInfo={vaccinationInfo}
        organreqInfo={organreqInfo}
        heartInfo={heartInfo}
        kidneyInfo={kidneyInfo}
        liverInfo={liverInfo}
        pancreasInfo={pancreasInfo}
        dualLungsInfo={dualLungsInfo}
      />
    ).toBlob(); // Generate Blob from PDF

    const blobURL = URL.createObjectURL(blob);
    const printWindow = window.open(blobURL, '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      console.error('Failed to open the print window.');
    }
  }
};
export const handleDownload = async (
  basicDetails?: RecipientBasicDetailsType,
  familyContact?: RecipientFamilyContact,
  medicalDetails?: RecipientMedicalDetails,
  organsRequest?: OrganRequestData
) => {
  const basicInfo: InfoType[] = [
    {
      label: 'Recipient Name',
      value: basicDetails?.name,
      fullWidth: true
    },
    {
      label: 'Recipient ID',
      value: basicDetails?.id
    },
    {
      label: 'Gender',
      value: basicDetails?.genderId === 1 ? 'Male' : 'Female'
    },
    {
      label: 'DOB',
      value: formatDateAndTime(basicDetails?.dateOfBirth?.toString())?.formattedDate
    },
    {
      label: 'Age',
      value: basicDetails?.age
    },
    {
      label: 'Father / spouse name',
      value: basicDetails?.fatherOrSpouseName
    },
    {
      label: 'Phone',
      value: basicDetails?.phoneNumber1
    },
    {
      label: 'Alternative Phone',
      value: basicDetails?.phoneNumber1
    },
    {
      label: 'Email',
      value: basicDetails?.email
    },
    {
      label: 'Blood',
      value: basicDetails?.bloodGroupId
    },
    {
      label: 'CM Insurance',
      value: basicDetails?.cminsuranceId
    }
  ];
  const basicAddress = basicDetails?.address?.map((ele) => [
    { label: 'Address Line 1', value: ele.addressLine1 },
    { label: 'Address Line 2', value: ele.addressLine2 },
    { label: 'Town/Village', value: ele.townOrVillage },
    { label: 'Landmark', value: ele.landmark },
    { label: 'Pincode', value: ele.pincode },
    { label: 'City', value: ele.cityId === 1 ? 'Madurai' : 'Chennai' },
    { label: 'State', value: ele.stateId === 1 ? 'Tamil Nadu' : 'Andra Pradesh' },
    { label: 'Country', value: ele.countryId === 1 ? 'India' : 'Sri Lanka' }
  ]);
  const familyContInfo = familyContact?.familyContacts?.map((ele) => [
    { label: 'Relation Name', value: ele.relationTypeId, fullWidth: true },
    { label: 'Relation Type', value: ele.name },
    { label: 'Gender', value: ele.genderId },
    { label: 'DOB', value: formatDateAndTime(ele.dateOfBirth?.toString())?.formattedDate },
    { label: 'Phone', value: ele.mobileNumber }
  ]);
  const physicalInfo = [
    { label: 'Height', value: medicalDetails?.height + ' cm' },
    { label: 'Weight', value: medicalDetails?.weight + ' kg' },
    {
      label: 'BMI',
      value:
        (
          Number(medicalDetails?.weight) /
          (((Number(medicalDetails?.height) / 100) * Number(medicalDetails?.height)) / 100)
        ).toFixed(3) + ' km/m2'
    }
  ];
  const medicalInfo = [
    { label: 'Smoker', value: medicalDetails?.isSmoker === '1' ? 'YES' : 'NO' },
    { label: 'Alcohol', value: medicalDetails?.isAlcohol === '1' ? 'YES' : 'NO' },
    { label: 'Period of Assistance', value: medicalDetails?.periodOfAssistanceId },
    { label: 'Drugs', value: medicalDetails?.isDrugs === '1' ? 'YES' : 'NO' },
    { label: 'Hypertension', value: medicalDetails?.isHypertesnsion === '1' ? 'YES' : 'NO' },
    { label: 'Diabetics', value: medicalDetails?.isDiabetes === '1' ? 'YES' : 'NO' },
    { label: 'CAD', value: medicalDetails?.isCad === '1' ? 'YES' : 'NO' },
    {
      label: 'Bronchial Asthma/COPD/Other Lung Disease',
      value: medicalDetails?.isOtherLungDisease === '1' ? 'YES' : 'NO'
    },
    { label: 'Epilepsy', value: medicalDetails?.isEpilepsy === '1' ? 'YES' : 'NO' },
    { label: 'Hepatitis B', value: medicalDetails?.hepatitisB === '1' ? 'YES' : 'NO' },
    { label: 'hepatitis C', value: medicalDetails?.hepatitisC === '1' ? 'YES' : 'NO' },
    { label: 'History of TB', value: medicalDetails?.historyOfTb === '1' ? 'YES' : 'NO' },
    {
      label: 'History of Peripheral Vascular Disease',
      value: medicalDetails?.historyOfPeripheralvascularDisease === '1' ? 'YES' : 'NO'
    },
    {
      label: 'History of Previous Transplant',
      value: medicalDetails?.historyOfPreviousTransplant === '1' ? 'YES' : 'NO'
    },
    { label: 'Organ Transplanted', value: medicalDetails?.organTransplanted },
    { label: 'History of Covid', value: medicalDetails?.historyOfCovid === '1' ? 'YES' : 'NO' },
    { label: 'Covid Free Period', value: medicalDetails?.covidFreePeriodId }
  ];
  const malignancyInfo = [
    { label: 'History of Malignancy', value: medicalDetails?.historyOfMalignancy === '1' ? 'YES' : 'NO' },
    { label: 'Type of Malignancy', value: medicalDetails?.typeofMalignancy },
    { label: 'Duration of remission', value: medicalDetails?.durationofremissionId }
  ];
  const viralogyInfo = [
    { label: 'HbsAg', value: medicalDetails?.hbsAg === '1' ? 'POSITIVE' : 'NEGATIVE' },
    { label: 'Anti HBsAg', value: medicalDetails?.antiHbsAg === '1' ? 'POSITIVE' : 'NEGATIVE' },
    { label: 'HCV', value: medicalDetails?.hcv === '1' ? 'POSITIVE' : 'NEGATIVE' },
    { label: 'Epstein Barr', value: medicalDetails?.epsteinBarr === '1' ? 'POSITIVE' : 'NEGATIVE' },
    { label: 'HIV', value: medicalDetails?.hiv === '1' ? 'POSITIVE' : 'NEGATIVE' },
    { label: 'CMV', value: medicalDetails?.cmv === '1' ? 'POSITIVE' : 'NEGATIVE' }
  ];
  const vaccinationInfo = medicalDetails?.vaccinationStatus?.map((ele) => [
    { label: 'Vaccination Name', value: ele.vaccinationId },
    { label: 'Vaccination Date', value: formatDateAndTime(ele.vaccinationDate?.toString())?.formattedDate }
  ]);
  const organreqInfo = organsRequest?.organReq?.map((el: Organs) => [
    {
      label: 'ORGAN',
      value:
        el.organId === '1'
          ? 'Heart'
          : el.organId === '2'
            ? 'Kidney'
            : el.organId === '3'
              ? 'Liver'
              : el.organId === '4'
                ? 'Pancreas'
                : el.organId === '5'
                  ? 'Dual lungs'
                  : ''
    },
    { label: 'CONSULTANT NAME', value: el.consultantId }
  ]);

  const heartInfo = [
    { label: 'Cardiac Index', value: organsRequest?.cardiacIndex },
    { label: 'TPG Trans pulmonary Gradient', value: organsRequest?.tpgTransPulmonaryGradient },
    { label: 'PVRI', value: organsRequest?.pvri },
    {
      label: '6 Minute  Walk Test -Able to complete ?',
      value: organsRequest?.sixMinuteWalkTest === '1' ? 'YES' : 'NO'
    },
    { label: '6 Minute Walk Test Distance', value: organsRequest?.sixMinuteWalkTestDistance },
    { label: 'NT Pro BNP', value: organsRequest?.NtProBnp },
    {
      label: 'History of Previous Non-Transplant Heart & Lung Surgery ?',
      value: organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgery === '1' ? 'YES' : 'NO'
    },
    { label: 'Surgery Details', value: organsRequest?.surgeryDetails }
  ];
  const kidneyInfo = [
    { label: 'Urea', value: organsRequest?.ureaKidny },
    { label: 'Creatine', value: organsRequest?.creatineKidny },
    { label: 'Serum Sodium', value: organsRequest?.serumSodiumKidny },
    { label: 'Serum Potassium', value: organsRequest?.serumPotassiumKidny },
    { label: 'Serum Chloride', value: organsRequest?.serumChlorideKidny },
    { label: 'Serum Bicarbonate', value: organsRequest?.serumBicarbonateKidny },
    {
      label: 'First Dialysis Date',
      value: formatDateAndTime(organsRequest?.firstDialysisDateKidny?.toString())?.formattedDate
    },
    { label: 'Period Undergoing Dialysis', value: organsRequest?.periodUndergoingDialysisKidny }
  ];
  const liverInfo = [
    { label: 'ALF Listing Type', value: organsRequest?.alfListingType },
    { label: 'ALF Evaluation Sheet', value: organsRequest?.alfEvaluationSheet },
    { label: 'Additional Hepatology Notes', value: organsRequest?.additionalHepatologyNotes },
    { label: 'Consultant Short Summary', value: organsRequest?.consultantShortSummary },
    { label: 'History of Complications', value: organsRequest?.historyOfComplications },
    { label: 'Complication Description', value: organsRequest?.complicationDescription },
    { label: 'Cancer Screening', value: organsRequest?.cancerScreening },
    { label: 'MELD Score', value: organsRequest?.meldScore },
    { label: 'Bilirubin', value: organsRequest?.bilirubin },
    { label: 'Albumin', value: organsRequest?.albumin },
    { label: 'Globulin', value: organsRequest?.globulin },
    { label: 'GGT', value: organsRequest?.ggt },
    { label: 'AST', value: organsRequest?.ast },
    { label: 'ALT', value: organsRequest?.alt },
    { label: 'Coronary Angiogram', value: organsRequest?.coronaryAngiogram },
    { label: 'Stress Test', value: organsRequest?.stressTest },
    { label: 'Room air- ABG', value: organsRequest?.roomAirAbg },
    { label: 'PFT', value: organsRequest?.pft },
    { label: 'Urea', value: organsRequest?.ureaLiver },
    { label: 'Creatine', value: organsRequest?.creatineLiver },
    { label: 'Uric Acid', value: organsRequest?.uricAcidLiver },
    { label: 'Serum Sodium', value: organsRequest?.serumSodiumLiver },
    { label: 'Serum Potassium', value: organsRequest?.serumPotassiumLiver },
    { label: 'Serum Chloride', value: organsRequest?.serumChlorideLiver },
    { label: 'Serum Bicarbonate', value: organsRequest?.serumBicarbonateLiver },
    { label: 'Serum Magnesium', value: organsRequest?.serumMagnesiumLiver },
    { label: 'Serum Phosphate', value: organsRequest?.serumPhosphateLiver },
    { label: 'INR', value: organsRequest?.inr },
    { label: 'APTT', value: organsRequest?.aptt },
    { label: 'Platelets', value: organsRequest?.platelets },
    { label: 'Fibrinogen', value: organsRequest?.fibrinogen }
  ];
  const pancreasInfo = [
    { label: 'History of Complications', value: organsRequest?.historyOfComplicationsPancreas },
    { label: 'Complication Description', value: organsRequest?.complicationDescriptionPancreas },
    { label: 'Cancer Screening', value: organsRequest?.cancerScreeningPancreas },
    { label: 'MELD Score', value: organsRequest?.meldScorePancreas },
    { label: 'Bilirubin', value: organsRequest?.bilirubinPancreas },
    { label: 'Albumin', value: organsRequest?.albuminPancreas },
    { label: 'Globulin', value: organsRequest?.globulinPancreas },
    { label: 'GGT', value: organsRequest?.ggtPancreas },
    { label: 'AST', value: organsRequest?.astPancreas },
    { label: 'ALT', value: organsRequest?.altPancreas },
    { label: 'Coronary Angiogram', value: organsRequest?.coronaryAngiogramPancreas },
    { label: 'Stress Test', value: organsRequest?.stressTestPancreas },
    { label: 'Room air- ABG', value: organsRequest?.roomAirAbgPancreas },
    { label: 'PFT', value: organsRequest?.pftPancreas },
    { label: 'Urea', value: organsRequest?.ureaPancreas },
    { label: 'Creatine', value: organsRequest?.creatinePancreas },
    { label: 'Uric Acid', value: organsRequest?.uricAcidPancreas },
    { label: 'Serum Sodium', value: organsRequest?.serumSodiumPancreas },
    { label: 'Serum Potassium', value: organsRequest?.serumPotassiumPancreas },
    { label: 'Serum Chloride', value: organsRequest?.serumChloridePancreas },
    { label: 'Serum Bicarbonate', value: organsRequest?.serumBicarbonatePancreas },
    { label: 'Serum Magnesium', value: organsRequest?.serumMagnesiumPancreas },
    { label: 'Serum Phosphate', value: organsRequest?.serumPhosphatePancreas },
    { label: 'INR', value: organsRequest?.inrPancreas },
    { label: 'APTT', value: organsRequest?.apttPancreas },
    { label: 'Platelets', value: organsRequest?.plateletsPancreas },
    { label: 'Fibrinogen', value: organsRequest?.fibrinogenPancreas }
  ];
  const dualLungsInfo = [
    { label: 'Cause of Lung Disease', value: organsRequest?.causeOfLungDisease },
    {
      label: '6 Minute  Walk Test -Able to complete ?',
      value: organsRequest?.sixMinuteWalkTestLungs === '1' ? 'YES' : 'NO'
    },
    { label: '6 Minute Walk Test Distance', value: organsRequest?.sixMinuteWalkTestDistanceLungs },
    {
      label: 'History of Previous Non-Transplant Heart & Lung Surgery ?',
      value: organsRequest?.historyOfPreviousNonTransplantHeartAndLungSurgeryLungs === '1' ? 'YES' : 'NO'
    },
    { label: 'Surgery Details', value: organsRequest?.surgeryDetailsLungs },
    { label: 'Forced Expiratory Volume in 1 second (FEV1)', value: organsRequest?.forcedExpiratoryVolumeIn1Second },
    { label: 'Forced Vital Capacity (FVC)', value: organsRequest?.forcedVitalCapacity },
    { label: 'Maximal Voluntary Ventilation (MVV)', value: organsRequest?.maximalVoluntaryVentilation },
    { label: 'DLCO', value: organsRequest?.dlco },
    { label: 'Self on Room air', value: organsRequest?.selfOnRoomAir === '1' ? 'YES' : 'NO' },
    { label: 'Supplement O2', value: organsRequest?.supplement02 === '1' ? 'YES' : 'NO' },
    {
      label: 'Non-invasive ventilation (NIV)',
      value: organsRequest?.nonInvasiveVentilation === '1' ? 'YES' : 'NO'
    },
    { label: 'Mechanical Ventilation', value: organsRequest?.mechanicalVentilation === '1' ? 'YES' : 'NO' },
    { label: 'ECMO', value: organsRequest?.ecmo },
    { label: 'Room air', value: organsRequest?.roomAir },
    { label: 'Room air file', value: organsRequest?.roomAirFile },
    { label: 'On Oxygen', value: organsRequest?.onOxygen },
    { label: 'On Oxygen File', value: organsRequest?.onOxygenFile }
  ];

  const blob = await pdf(
    <PreviewPDF
      basicInfo={basicInfo}
      basicAddress={basicAddress}
      familyContInfo={familyContInfo}
      physicalInfo={physicalInfo}
      medicalInfo={medicalInfo}
      malignancyInfo={malignancyInfo}
      viralogyInfo={viralogyInfo}
      vaccinationInfo={vaccinationInfo}
      organreqInfo={organreqInfo}
      heartInfo={heartInfo}
      kidneyInfo={kidneyInfo}
      liverInfo={liverInfo}
      pancreasInfo={pancreasInfo}
      dualLungsInfo={dualLungsInfo}
    />
  ).toBlob(); // Generate Blob from PDF

  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = `${'recipient'}_${basicDetails?.id}_details.pdf`;
  a.click();
};
