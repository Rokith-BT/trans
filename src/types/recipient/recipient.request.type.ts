import { BloodGroup, Gender, Organ, Zone } from '../common.type';

// interface hospital {
//   hospitalName: string;
//   hospitalId: number;
//   hospitalType: string;
// }
// [];
export interface Recipient {
  currentZoneRank: string | number;
  passportDocument: string;
  embassyDocument: string;
  cmInsuranceNote: string;
  recipientId: number;
  transtanId: string;
  serialNumber: number;
  id: number;
  name: string;
  zone: Zone;
  zoneRank: number;
  gender: Gender;
  age: number;
  bloodGroup: BloodGroup;
  hospital: { id: number; name: string };
  hospitalType: {
    id: number;
    name: string;
  };
  activationDate: string;
  organs: Organ[];
  cmInsurance: { id: number; name: string };
  phoneNumber: string;
  status: string;
  dateOfRegistration: string;
  isPaymentCompleted: boolean|undefined;
  reason: string;
  cmInsuranceDoc: string;
  isIndian: boolean;
  countryCode1: string;
}

export interface SelectFieldType {
  label: string;
  value: number;
}

export interface RecipientFullType {
  isIndian: boolean;
  hospitalName: string;
  aadharNumber: string;
  passportNumber: string;
  passport: string;
  embassyDocument: string;
  name: string;
  gender: number;
  dateOfBirth: string;
  age: number;
  fatherName: string;
  phoneNumber1: string;
  phoneNumber2: string;
  email: string;
  bloodGroup: string;
  cmInsurance: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    townVillage: string;
    landmark: string;
    pincode: string;
    city: number;
    state: number;
    country: number;
  }[];
}
// export interface TranstanConsultant {
//   doctors: {
//     hospitalID: number;
//     userID: number;
//     userName: string;
//   };
// }
