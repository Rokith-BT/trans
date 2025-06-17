export interface TransplantTable {
  serialNumber: number;
  donorHospitalName: string;
  donorName: string;
  donorGender: string;
  donorBloodGroup: string;
  donorAge: number;
  donorAddress: string;
  recipientName: string;
  recipientGender: string;
  recipientBloodGroup: string;
  recipientAge: number;
  recipientAddress: string;
  donorRelationship: string;
  transplantOrgan: string;
  createdAt: string;
  dateOfTransplantation: number;
  status: string;
}
