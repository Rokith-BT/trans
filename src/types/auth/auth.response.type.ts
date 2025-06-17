import { Role } from '../common.type';
import { HospitalStatus } from '../hospital';

export interface AuthType {
  hash: string;
  isResetPassword: boolean;
}

export interface User {
  firstName: string;
  lastName: string;
  hospital: {
    hospitalType: string;
    id: number;
    name: string;
    status: HospitalStatus;
  };
  isUserBlocked: boolean;
  status: string;
  transtanId: string;
  userRole: Role;
  userType: {
    id: number;
    name: string;
  };
}
export interface AadhaarOtpLogin {
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
