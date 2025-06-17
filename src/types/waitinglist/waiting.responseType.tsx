import { BloodGroup, City, Gender, Organ, Zone } from '../common.type';

export interface CommonWaitingList {
  serialNumber: number;
  recipientId: number;
  transtanId: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  age: number;
  hospital: {
    id: number;
    name: string;
  };
  organs: Organ[];
  city: City;
  dateOfRegistration: string;
  zone: Zone;
  currentZoneRank: string;
}

export interface InhouseWaitingList {
  serialNumber: number;
  recipientId: number;
  name: string;
  transtanId: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  age: number;
  hospital: {
    id: number;
    name: string;
  };
  organs: Organ[];
  city: City;
  dateOfRegistration: string;
  zone: Zone;
  currentZoneRank: number;
  proposedRank: null;
  proposedRankUpdatedDate:Date;
  finalRank: number;
  phoneNumber: string;
  status: string;
}
export interface TranstanWaitingList {
  serialNumber: number;
  recipientId: number;
  name: string;
  transtanId: number;
  gender: Gender;
  bloodGroup: BloodGroup;
  age: number;
  hospital: {
    id: number;
    name: string;
  };
  organs: Organ[];
  city: City;
  dataofRegistration: number;
  zone: Zone;
  currentZoneRank: number;
  cmInsurance: {
    id: number;
    name: string;
  };
  phoneNumber: number;
}

export type TranstanWaitingSummary = {
  organSummaries: {
    organ: {
      id: number;
      name: string;
    };
    totalCount: number;
  }[];
  bloodGroupSummaries: {
    bloodGroup: {
      id: number;
      name: string;
    };
    totalCount: number;
  }[];
  totalCount: number;
  totalActiveCount: number;
  totalInactiveCount: number;
};
