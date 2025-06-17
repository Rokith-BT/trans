export interface TranstanUser {
  serialNumber: number;
  userID: number;
  userName: string;
  hospital: { id: number; name: string };
  transtanID: string;
  primaryMobileNo: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  status: string;
  reason: string;
}
export interface SingleTranstanUser {
  serialNumber: number;
  aadharNumber: string;
  isAadharNumberVerified: boolean;
  uuid: string;
  userImage: string;
  userID: number;
  firstName: string;
  lastName: string;
  userName: string;
  hospital: string;
  gender: {
    id: number;
    name: string;
  };
  bloodGroup: {
    id: number;
    name: string;
  };
  designation: {
    id: number;
    name: string;
  };
  qualification: string;
  dateOfBirth: string;
  transtanID: string;
  primaryMobileNo: string;
  secondaryMobileNo: string;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  email: string;
  role: {
    id: number;
    name: string;
  };
  status: string;
  reason: string;
  countryCode1: string;
  countryCode2: string;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
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
  pinCode: string;
}
