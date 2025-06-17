import { Hospital } from '../hospital';

export interface ALF {
  id: string;
  transtanID: string;
  expericence: string;
  name: string;
  role: string;
  specialization: string;
  alfRegDate: string;
}

export interface AlfTypes {
  id: string;
  alfID: number;
  uniqueId: string;
  recipientName: string;
  hospital: Hospital;
  date: Date;
  category: string;
  createdAt:string;
  notificationStatus: string;
  pendingAlfAppr: string;
  status: string;
  comment: string;
}
