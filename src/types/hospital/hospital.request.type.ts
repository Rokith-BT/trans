interface UserExperience {
  role: string;
  hospitalName: string;
  dateofJoin: string; // ISO Date string
  dateofRelive: string; // ISO Date string
  caseHandled: number | null;
}

export interface Organ {
  id: number;
  name: string;
}

export interface UpdateUser {
  isIndian: boolean;
  uuid: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userImage: any;
  aadharNumber: string;
  isAadharNumberVerified: boolean;
  passportNumber: string;
  roleId: number;
  firstName: string;
  lastName: string;
  genderId: number;
  dateOfBirth: string; // ISO Date string
  designationId: number;
  qualification: string;
  specialization: number[];
  phoneNumber1: string;
  phoneNumber2: string;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  countryCode1: number | string;
  countryCode2: number;
  email: string;
  dateOfJoining: string; // ISO Date string
  practicingSince: string; // ISO Date string
  medicalLicence: string;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
  pincode: string;
  cityId: number;
  stateId: number;
  countryId: number;
  experience: number;
  mPanelNumber: string;
  userExperience: UserExperience[];
  organ: Organ[];
  tempFilePath: string;
  basePath: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  age: any;
}
export interface HospitalDetail {
  hospitalName: string;
  hospitalTypeId: number;
  zoneId: number;
  yearOfEstablishment: number;
  websiteUrl: string;
  email: string;
  phoneNumber1: string;
  phoneNumber2: string;
  countryCode1: number | string;
  countryCode2: number | string;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
  pincode: string;
  cityId: number;
  stateId: number;
  countryId: number;
  ntorcLicenceNumber: string;
  ntorcLicenceRegistrationDate: string;
  ntorcLicenceExpiryDate: string;
  ntorcLicenceDoc: string;
}
