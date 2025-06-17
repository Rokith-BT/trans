// export interface PontentialDonor {
//   id: number;
//   serialNumber: number;
//   donorId: number;
//   donorName: string;
//   gender: string;
//   age: number;
//   bloodGroup: string;
//   hospitalName: string;
//   organConsented: string;
//   requestNote: string;
//   caseOfficerName: string;
//   caseOfficerPhone: string;
//   donorCaseOfficer: string;
//   donorCaseOfficerPhone: string;
//   hospitalType: string;
//   mlcornonmlc: string;
//   causeofDeath: string;
//   dateofAccident: string;
//   dateofAdmission: string;
//   noofDaysinVentilator: string;
//   apnoeaStatus: string;
//   apnoeaDateandTime: string;
//   status: string;
//   statusId:number
// }
interface Organ {
  id: number;
  name: string;
}

export interface PontentialDonor {
  id: number;
  transtanId: string;
  serialNumber: number;
  hospitalId: number;
  name: string;
  hospitalName: string;
  hospitalType: string;
  bloodGroup: string;
  gender: string;
  age: number;
  organConsented: Organ[];
  notes: string;
  status: string;
  statusId: number;
}

export interface DonorDetailsTypes {
  id: number;
  transtanId: string;
  medicalHistoryId: number;
  hospitalId: number;
  hospital: {
    id: number;
    name: string;
  };
  hospitalType: {
    id: number;
    name: string;
  };
  name: string;
  genderId: number;
  gender: {
    id: number;
    name: string;
  };
  dateOfBirth: string; // ISO format
  age: number;
  bloodGroupId: number;
  bloodGroup: {
    id: number;
    name: string;
  };
  isMlc: string; // '1' or '0'
  arcaseNumber: number;
  height: number;
  weight: number;
  bmi: number;
  isConsentGiven: number;
  status: string | null;
  reason: string | null;
  approvedAt: string;
  approvedBy: number;
  consentId: number;
  donorId: number;
  relationshipId: number;
  relationship: {
    id: number;
    name: string;
  };
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber1: string;
  phoneNumber2: string;
  countryCode1: string;
  countryCode2: string;
  isPhone1Verified: number;
  isPhone2Verified: number;
  isWritten: number;
  isAudio: number;
  isVideo: number;
  letter1: string;
  letter2: string;
  written: string;
  audio: string;
  video: string;
  createdAt: string;
  createdBy: number;
  modifiedAt: string;
  modifiedBy: number;
  apnoeaDetails: { datetime: string }[];
}
