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
