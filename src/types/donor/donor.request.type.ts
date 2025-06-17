interface Relationship {
  id: number;
  name: string;
}

interface Hospital {
  id: number;
  name: string;
}

interface HospitalType {
  id: number;
  name: string;
}

interface Gender {
  id: number;
  name: string;
}

interface BloodGroup {
  id: number;
  name: string;
}

export interface DonorConsentType {
  consentId: number;
  donorId: number;
  relationshipId: number;
  relationship: Relationship;
  firstName: string;
  lastName: string;
  email: string;
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
  createdAt: string; // ISO date string
  createdBy: number;
  modifiedAt: string; // ISO date string
  modifiedBy: number;
  transtanId: string;
  hospitalId: number;
  hospital: Hospital;
  hospitalType: HospitalType;
  name: string;
  genderId: number;
  gender: Gender;
  dateOfBirth: string; // ISO date string
  bloodGroupId: number;
  bloodGroup: BloodGroup;
  isMlc: number;
  height: number;
  weight: number;
  bmi: number;
  arcaseNumber: number;
  isConsentGiven: number;
  status: string;
  reason: string;
  approvedAt: string; // ISO date string
  approvedBy: number;
}

export interface LiveTransplantDTO {
  serialNumber: number;
  id: number;
  hospitalId: number;
  hospital: {
    id: number;
    name: string;
  };
  donorName: string;
  donorGenderId: number;
  donorGender: {
    id: number;
    name: string;
  };
  donorDateOfBirth: string;
  donorBloodGroupId: number;
  donorBloodGroup: {
    id: number;
    name: string;
  };
  relationshipId: number;
  relationship: {
    id: number;
    name: string;
  };
  donorAddressLine1: string;
  donorAddressLine2: string;
  donorTownVillage: string;
  donorLandmark: string;
  donorCityId: number;
  donorCity: {
    id: number;
    name: string;
  };
  donorStateId: number;
  donorState: {
    id: number;
    name: string;
  };
  donorCountryId: number;
  donorCountry: {
    id: number;
    name: string;
  };
  recipientName: string;
  recipientGenderId: number;
  recipientGender: {
    id: number;
    name: string;
  };
  recipientDateOfBirth: string;
  recipientBloodGroupId: number;
  recipientBloodGroup: {
    id: number;
    name: string;
  };
  recipientAddressLine1: string;
  recipientAddressLine2: string;
  recipientTownVillage: string;
  recipientLandmark: string;
  recipientCityId: number;
  recipientCity: {
    id: number;
    name: string;
  };
  recipientStateId: number;
  recipientState: {
    id: number;
    name: string;
  };
  recipientCountryId: number;
  recipientCountry: {
    id: number;
    name: string;
  };
  organId: number;
  organ: {
    id: number;
    name: string;
  };
  dateOfSurgery: string;
  surgeryDuration: string;
  surgeryEndDate: string;
  ischaemiaWarm: string;
  ischaemiaCold: string;
  remarks: string;
}
export interface DonorStatusType {
  id: number;
  stateId: number;
  stateName: string;
  name: string;
  isActive: number;
}

export interface OrganConsentItem {
  organId: number;
  isConsentGiven: number;
  name: string;
  isTissue: boolean;
  isSelected: boolean;
}

interface ApnoeaData {
  id: number;
  donorId: number | string; // Adjust type of donorId based on actual usage
  datetime: string;
  preAbg: string;
  postAbg: string;
}

export interface OrganConsentFormData {
  organConsent: OrganConsentItem[];
  apnoea: ApnoeaData[];
}

export interface DonorBasicConsentType {
  name: string;
  dateOfBirth: string;
  age: number;
  genderId: number;
  isMlc: string; // likely "0" or "1" as strings
  arcaseNumber: string;
  causeOfBrainDeathId: number;
  dateOfAccident: string;
  admissionDate: string;
  noOfDaysOnVentilator: string;
  stateId: number;
  firstApnoea: string; // "0" or "1"
  apnoeaDateandTime: string;
}
