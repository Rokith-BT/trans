/* eslint-disable @typescript-eslint/no-explicit-any */
import { BloodGroup, Gender, Zone } from '../common.type';

export interface RecipientPaymentInfo {
  recipientId: number;
  recipientName: string;
  totalAmount: number;
  totalPaidAmount: number;
  pendingAmount: number;
  description: string;
}

export interface RecipientTransfer {
  registerPhone: string;
  transtanId: string;
  enterOTP: string;
  isTranstan: boolean;
}

export interface RecipientApprovalTransferType {
  id: number;
  recipientId: number;
  recipientName: string;
  transtanId: number;
  currentHospital: {
    id: number;
    name: string;
  };
  transferringHospital: {
    id: number;
    name: string;
  };
  transferRegDate: string;
  patientDeclarationDoc: string;
  doctorDeclarationDoc: string;
  isPhoneNumber1Verified: string;
  isPaymentCompleted: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  dateofBirth: number;
  dateOfRegistration: string;
  age: number;
  phoneNumber1: number;
  organMappings: [
    {
      organId: {
        id: number;
        name: string;
      };
      currentConsultantId: number;
      transferringConsultantId: number;
    }
  ];
  createdAt: string;
  transferStatus: string;
  activationDate: string;
  reason: string;
}

export interface TransferData {
  recipientId: number;
  currentHospitalId: number;
  transferringHospitalId: number;
  patientDeclarationDoc: string;
  doctorDeclarationDoc: string;
  isPhoneNumber1Verified: boolean;
  isPaymentCompleted: boolean;
  organMappings: [
    {
      organId: {
        id: number;
        name: string;
      };
      currentConsultantId: number;
      transferringConsultantId: number;
    }
  ];
}
export interface RecipientBasicDetailsType {
  nationality: string;
  id: number;
  transtanId: string;
  isIndian: boolean;
  recipientImage: any;
  isAadharNumberVerified: boolean;
  uuid: string;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  hospitalName: string;
  aadharNumber: string;
  passportNumber: string;
  passportDocument: string;
  embassyDocument: string;
  name: string;
  genderId: number;
  dateOfBirth: string;
  hospitalType: { id: number; name: string };
  // hospitalType: string;
  age: number;
  fatherOrSpouseName: string;
  phoneNumber1: string;
  phoneNumber2: string;
  countryCode1: number | string;
  countryCode2: number | string;
  email: string;
  bloodGroup: { name: string; id: number };
  bloodGroupId: string;
  cminsurance: { name: string; id: number };
  cminsuranceId: string | number;
  cminsuranceDoc: string;
  isPaymentCompleted: boolean;
  gender: { id: number; name: string };
  address: {
    // city: number;
    id: number;
    recipientId: number;
    addressLine1: string;
    addressLine2: string;
    townOrVillage: string;
    landmark: string;
    pincode: string;
    city: { id: number; name: string };
    state: { id: number; name: string };
    country: { id: number; name: string };
    cityId: number;
    stateId: number;
    countryId: number;
    isPrimary: boolean;
  }[];
}
export interface RecipientMedicalDetails {
  id: number;
  recipientId: number;
  height: number;
  weight: number;
  bmi: number;
  isSmoker: string;
  isAlcohol: string;
  periodOfAssistanceId: number;
  isDrugs: string;
  isHypertesnsion: string;
  isDiabetes: string;
  isCad: string;
  isOtherLungDisease: string;
  isEpilepsy: string;
  hepatitisB: string;
  hepatitisC: string;
  historyOfTb: string;
  historyOfPeripheralvascularDisease: string;
  historyOfPreviousTransplant: string;
  organTransplanted: string;
  historyOfCovid: string;
  covidFreePeriodId: number;
  historyOfMalignancy: string;
  typeofMalignancy: string;
  durationofremissionId: number;
  hbsAg: string;
  antiHbsAg: string;
  hcv: string;
  epsteinBarr: string;
  hiv: string;
  cmv: string;
  vaccinationStatus: {
    id: number;
    recipientId: number;
    vaccination: { name: string };
    vaccinationId: number;
    vaccinationDate: string;
  }[];
}

export interface HospitalName {
  hospitalId: number;
  hospitalName: string;
  zone: Zone;
}

export interface RecipientsSearch {
  recipientId: number;
  transtanId: string;
  recipientName: string;
  hospital: {
    id: number;
    name: string;
  };
  zone: Zone;
  gender: Gender;
}
export interface RecipientVerifyOTP {
  recipientId: number;
  recipientName: string;
  transtanId: string;
  currentHospital: {
    id: number;
    name: string;
  };
  transferringHospital: string;
  transferRegDate: string;
  patientDeclarationDoc: string;
  doctorDeclarationDoc: string;
  isPhoneNumber1Verified: boolean;
  isPaymentCompleted: boolean;
  bloodGroup: {
    id: number;
    name: string;
  };
  gender: {
    id: number;
    name: string;
  };
  dateofBirth: string;
  age: number;
  phoneNumber1: string;
  createdAt: string;
  organMappings: [
    {
      organId: number;
      currentConsultantId: number;
      transferringConsultantId: number;
    }
  ];
  activationDate: number;
}

interface FamilyContact {
  relationTypeId: number;
  relationType: { id: number; name: string };
  name: string;
  genderId: number;
  gender: { id: number; name: string };
  dateOfBirth: string; // Can be changed to Date if needed
  mobileNumber: string;
}

export interface RecipientFamilyContact {
  familyContacts: FamilyContact[];
}
export interface Organs {
  organId: string | number;
  consultantId: string | number;
  recipientId?: string | number;
}
export interface OrganRequestData {
  organReq: Organs[];
  heartID: number | string;
  kidneyID: number | string;
  liverID: number | string;
  alfId: number | string;
  pancreasID: number | string;
  lungsID: number | string;
  cardiacIndex: string;
  tpgTransPulmonaryGradient: string;
  pvri: string;
  sixMinuteWalkTest: string;
  sixMinuteWalkTestDistance: string;
  NtProBnp: string;
  historyOfPreviousNonTransplantHeartAndLungSurgery: string;
  surgeryDetails: string;
  ureaKidny: string;
  creatineKidny: string;
  serumSodiumKidny: string;
  serumPotassiumKidny: string;
  serumChlorideKidny: string;
  serumBicarbonateKidny: string;
  firstDialysisDateKidny: string;
  periodUndergoingDialysisKidny: string;
  isAlf: boolean;
  alfListingType: string;
  alfEvaluationSheet: string;
  additionalHepatologyNotes: string;
  consultantShortSummary: string;
  historyOfComplications: string;
  complicationDescription: string;
  cancerScreening: string;
  meldScore: string;
  bilirubin: string;
  albumin: string;
  globulin: string;
  ggt: string;
  ast: string;
  alt: string;
  coronaryAngiogram: string;
  stressTest: string;
  roomAirAbg: string;
  pft: string;
  serumMagnesiumLiver: string;
  serumPhosphateLiver: string;
  aptt: string;
  platelets: string;
  fibrinogen: string;
  complicationDescriptionPancreas: string;
  cancerScreeningPancreas: string;
  albuminPancreas: string;
  coronaryAngiogramPancreas: string;
  stressTestPancreas: string;
  roomAirAbgPancreas: string;
  pftPancreas: string;
  serumMagnesiumPancreas: string;
  serumPhosphatePancreas: string;
  apttPancreas: string;
  plateletsPancreas: string;
  fibrinogenPancreas: string;
  historyOfPreviousNonTransplantHeartAndLungSurgeryLungs: string;
  surgeryDetailsLungs: string;
  roomAir: string;
  roomAirFile: string;
  onOxygen: string;
  onOxygenFile: string;
  ureaLiver: string;
  creatineLiver: string;
  serumSodiumLiver: string;
  serumPotassiumLiver: string;
  serumChlorideLiver: string;
  serumBicarbonateLiver: string;
  uricAcidLiver: string;
  uricAcidPancreas: string;
  inr: string;
  historyOfComplicationsPancreas: string;
  meldScorePancreas: string;
  bilirubinPancreas: string;
  globulinPancreas: string;
  ggtPancreas: string;
  astPancreas: string;
  altPancreas: string;
  ureaPancreas: string;
  creatinePancreas: string;
  serumSodiumPancreas: string;
  serumPotassiumPancreas: string;
  serumChloridePancreas: string;
  serumBicarbonatePancreas: string;
  inrPancreas: string;
  causeOfLungDisease: string;
  sixMinuteWalkTestLungs: string;
  sixMinuteWalkTestDistanceLungs: string;
  forcedExpiratoryVolumeIn1Second: string;
  forcedVitalCapacity: string;
  maximalVoluntaryVentilation: string;
  dlco: string;
  selfOnRoomAir: string;
  supplement02: string;
  nonInvasiveVentilation: string;
  mechanicalVentilation: string;
  ecmo: string;
}
