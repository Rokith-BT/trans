/* eslint-disable @typescript-eslint/no-explicit-any */
import { /* HospitalType, */ Zone, City, Department, Organ, State, Country, HospitalType } from '../common.type';

// eslint-disable-next-line import/export
export interface HospitalDetail {
  hospitalID: number;
  basicDetails: BasicDetails;
  infrastructure: Infrastructure;
  transplantRegistration: OrgansStep;
  organLicences: OrganLicenceItem[];
}

// export enum HospitalStatus {
//     Active,
//     Expired,
//     PendingApproval,
//     DetailsPending,
//     Deleted
// }

export interface BasicDetails {
  hospitalName: string;
  // hospitalType: HospitalType
  hospitalType: HospitalType;
  transtanId: string;
  zone: Zone;
  yearOfEstablishment: number;
  hospitalLicenseNumber: string;
  websiteUrl: string;
  email: string;
  phoneNumber1: string;
  phoneNumber2: string;
  countryCode1: number;
  countryCode2: number;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
  pincode: string;
  city: City;
  state: State;
  country: Country;
  status: string;
  reason: string;
  ntorcLicenceNumber: string;
  ntorcLicenceRegistrationDate: string;
  ntorcLicenceExpiryDate: string;
  ntorcLicenceDoc: string;
}

export interface Infrastructure {
  departments: Department[];
  numberOfBeds: number;
  isTraumaUnitAvailable: boolean;
  isMedicalCollegeAttached: boolean;
  isIsoOrNabhAccredited: boolean;
  isRegistredClinicalEstablishmentAct: boolean;
}
export interface SelectedOrgans {
  dms_license: File;
  organId: number;
  organ_first_level: string;
  license_expiry: string;
  organ_reference_no: string;
  receipt_number: string;
}
export interface OrgansStep {
  selectedOrgans: SelectedOrgans[];
}

export interface OrganLicenceItem {
  organ: Organ;
  dmsLicenseDoc: string;
  organReferenceNumber: string;
  organFirstLevelRegistrationDate: string;
  licenceExpiryDate: string;
  paymentReferenceNumber: string;
  status: string;
  cost: number;
}

export interface Hospital {
  id: number;
  name: string;
  zone: string;
  hospitalType: string;
  organs: Organ[];
  licenceExpiryDate: string;
  status: string;
  notes: any;
}
export interface ActiveHospital {
  hospitalId: number;
  hospitalName: string;
  zone: { id: number; name: string };
  hospitalType: {
    id: number;
    name: string;
  };
}

// eslint-disable-next-line import/export
export interface HospitalDetail {}

export interface HospitalUser {
  aadharNumber: string;
  isAadharNumberVerified: boolean;
  passportNumber: string;
  roleId: number;
  firstName: string;
  lastName: string;
  genderId: number;
  dateOfBirth: string;
  designationId: number;
  qualification: string;
  specialization: Department[];
  phoneNumber1: string;
  phoneNumber2: string;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  countryCode1: number;
  countryCode2: number;
  email: string;
  dateOfJoining: string;
  practicingSince: string;
  medicalLicence: string;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
  pincode: string;
  cityId: number;
  stateId: number;
  countryId: number;
  status: string;
  experience: number;
  mPanelNumber: string;
  userExperience: {
    role: string;
    hospitalName: string;
    dateofJoin: string;
    dateofRelive: string;
    caseHandled: number;
  }[];
  organ: {
    id: number;
    name: string;
  }[];
  tempFilePath: string;
  basePath: string;
}

export interface ApprovalSummary {
  totalHospitals: number;
  totalHospitalUsers: number;
}
export interface HospitalSummary {
  id: number;
  name: string;
  establishedYear: string;
  firstOrganLicenceRegDate: string;
  isMedicalCollege: boolean;
  isTraumaUnitAvailble: boolean;
  isClinicalEstablishmentAct: boolean;
  isISONABH: boolean;
  totalBeds: number;
  totalDoctors: number;
  totalCaseCoordinators: number;
  totalDonors: number;
  totalRecipients: number;
}

export interface PaymentInfo {
  transtanId: string;
  hospitalName: string;
  paymentStatus: string;
  paymentDate: string;
  paymentMode: string;
  paymentReceiptNumber: string;
}
