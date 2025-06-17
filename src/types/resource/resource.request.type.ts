export interface PostTranstanUser {
  isIndian: boolean;
  aadhaarNumber: string;
  isAadhaarNumberVerified: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userImage: any;
  uuid: string;
  firstName: string;
  lastName: string;
  genderId: number | undefined;
  dateOfBirth: string;
  bloodGroupId: number | undefined;
  phoneNumber1: string;
  phoneNumber2: string;
  countryCode1: string;
  countryCode2: string;
  isPhoneNumber1Verified: boolean;
  isPhoneNumber2Verified: boolean;
  email: string;
  designationId: number;
  roleId: number;
  qualification: string;
  addressLine1: string;
  addressLine2: string;
  townVillage: string;
  landmark: string;
  pincode: string;
  cityId: number;
  stateId: number;
  countryId: number;
}
