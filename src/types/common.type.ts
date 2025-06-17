export interface Organ {
  id: number;
  name: string;
  isActive: boolean;
  isTissue: boolean;
  isPaymentRequired: boolean;
  isLicenceAvailable: boolean;
  isAllocationAvailble: boolean;
  cost: number;
  serialNo: number;
}

export interface Department {
  id: number;
  name: string;
  isActive: number;
}
export interface Designation {
  id: number;
  name: string;
}
export interface PaymentConfigType {
  id: number;
  paymentType: string;
  description: string;
  amount: number;
  modifiedBy: number;
  modifiedAt: string; // or `Date` if you plan to parse it
}

export interface causeOfDeath {
  id: number;
  name: string;
  isActive: number;
}

export interface Role {
  id: number;
  name: string;
}
export interface Roles {
  id: number;
  name: string;
  roleType: string;
  isActive: number;
}
export interface Qualification {
  id: number;
  name: string;
}

export interface HospitalType {
  id: number;
  name: string;
}

export interface Zone {
  id: number;
  name: string;
}
export interface Gender {
  id: number;
  name: string;
}
export interface HospitalNames {
  hospitalId: number;
  hospitalName: string;
  zone: Zone;
}

export interface TerminateReason {
  id: number;
  name: string;
  stageId: number;
  isActive: number;
  serialNo: number;
}
export interface City {
  id: number;
  name: string;
}
export interface MultiOrgans {
  id: string;
  name: string;
}

export interface State {
  id: number;
  name: string;
}
export interface CMInsurance {
  id: number;
  name: string;
}
export interface BloodGroup {
  id: number;
  name: string;
  isActive: number;
}
export interface Age {
  id: number;
  name: string;
  isActive: number;
}
export interface RelationType {
  id: number;
  name: string;
}
export interface PeriodCategory {
  id: number;
  name: string;
}
export interface Status {
  id: number;
  name: string;
}
export interface Vaccinations {
  id: number;
  name: string;
}
export interface Complications {
  id: number;
  name: string;
}
export interface Cancerscreening {
  id: number;
  name: string;
}
export interface Lungdiseasecause {
  id: number;
  name: string;
}

export interface ALFListing {
  id: number;
  name: string;
}
export interface Country {
  id: number;
  name: string;
}
export interface Consultants {
  id: number;
  name: string;
}

export interface HospitalDeleteReason {
  id: number;
  reason: string;
}
export interface causeOfDeathDelete {
  id: number;
  reason: string;
}
export interface DeleteTerminationReasons {
  id: number;
  reason: string;
}

export interface Summary {
  id: number;
  name: string;
}

export interface OrganLicencesSummary {
  id: number;
  name: string;
}
export interface Invite {
  hospitalName: string;
  zoneId: number;
  hospitalTypeId: number;
  email: string;
}
export interface HospitalStatus {
  id: number;
  name: string;
}
export interface Users {
  id: number;
  name: string;
}

export interface UsersTable {
  hospitalID: number;
  userID: number;
  userName: string;
  transtanID: string;
  role: {
    id: number;
    name: string;
  };
  specialization: number;
  experience: string;
  status: string;
}
export interface User {
  uuid: string;
  userImage: string | null;
  aadharNumber: string;
  isIndian: boolean;
  isAadharNumberVerified: boolean;
  passportNumber: string;
  transtanId: string;
  role: {
    id: number;
    name: string;
  };
  firstName: string;
  lastName: string;
  gender: {
    id: number;
    name: string;
  };
  dateOfBirth: string;
  designation: {
    id: number;
    name: string;
  };
  qualification: string;
  specialization: {
    id: number;
    name: string;
  }[];
  phoneNumber1: string;
  phoneNumber2: string;
  countryCode1: number;
  countryCode2: number;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  email: string;
  dateOfJoining: string; // Date can be used if you want a Date object instead of string
  practicingSince: string; // Date can be used if you want a Date object instead of string
  medicalLicence: string;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
  pincode: string;
  city: {
    id: number;
    name: string;
  };
  state: {
    id: number;
    name: string;
  };
  country: {
    id: number;
    name: string;
  };
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
}
export interface ConsultantList {
  hospitalID: number;
  userID: number;
  userName: string;
}
export interface HospitalOrgan {
  id: number;
  name: string;
}
//for aadhar
export interface aadhaarResponse {
  result: string;
  code: string;
  txId: string;
  timeStamp: string;
  error: string;
  errorDescription: string;
  requestTxId: string;
  reference: string;
  responseXML: string;
  aadhaarNumber: string;
}

export interface RelationTypeList {
  id: number;
  name: string;
  contactTypeId: number;
  contactType: {
    id: number;
    name: string;
  };
  isActive: number;
  serialNo: number;
}

export interface OrganList {
  id: number;
  name: string;
  isActive: boolean;
  isTissue: boolean;
  isPaymentRequired: boolean;
  isLicenceAvailable: boolean;
  isAllocationAvailble: boolean;
  cost: number;
  serialNo: number;
}

export interface ContactTypes {
  id: number;
  name: string;
  isActive: number;
  serialNo: number;
}
