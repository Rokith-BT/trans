import { Organ } from '../common.type';

export interface OrganLicense {
  hospitalId: number;
  organType: Organ;
  hospitalName: string;
  hospitalType: string;
  licenceExpiryDate: string;
  pendingUpdate: string;
  status: string;
  dmsLicenseDoc: string;
  paymentStatus: string;
  id: number;
  serialNumber: number;
}
export interface HospitalsOrgansLicences {
  serialNumber: number;
  organType: Organ;
  id: number;
  hospitalId: number;
  hospitalName: string;
  hospitalType: string;
  firstLevelOrganLicenceRegDate: string;
  licenceExpiryDate: string;
  pendingUpdate: string;
  status: string;
  paymentStatus: string;
  dmsLicenseDoc: string;
  organLicenceNumber: string;
  paymentReceiptNumber: string;
  reason: string;
}
export interface HospitalOrganDocumnets {
  serialNumber: number;
  id: number;
  hospitalID: number;
  organs: {
    id: number;
    name: string;
  };
  organLicenceNumber: string;
  dmsLicensePath: string;
  firstLevelOrganLicenceRegDate: string;
  licenseExpiryDate: string;
  paymentReceiptNumber: string;
  status: string;
  reason: null;
}
