interface Hospital {
  id: number;
  name: string;
}
interface Consultant {
  id: number;
  name: string;
}

export interface RecipientAlfDoctor {
  id: number;
  serialNumber: number;
  consultant: Consultant;
  name: string;
  transtanID: string;
  role: {
    id: number;
    name: string;
  };
  specialization: [];
  experience: string;
  status: string;
  alfRegistrationDate: string;
  alfDeletedDate: string;
}

export interface RecipientALFDTOs {
  serialNumber: number;
  id: number;
  recipientId: number;
  transtanId: string;
  name: string;
  hospital: Hospital;
  hospitalType: {
    id: number;
    name: string;
  };
  createdAt: string;
  alfListingType: {
    id: number;
    name: string;
  };
  pendingALFApprovalCount: number;
  comment: string;
  reason: string;
  status: string;
  expiryExtendCount: string|number;
  expirationDate: string;
}
export interface ALFSummary {
  pendingTranstanReview: number;
  pendingALFReview: number;
  finalApprovalPending: number;
  delisted: number;
  utilized: number;
  approved: number;
  deleted: number;
}

export interface LiverRequest {
  recipientId: number;
  recipientName: string;
  hospital: Hospital;
}

export interface ALFDocFeedBack {
  serialNumber: number;
  consultant: Consultant;
  comment: string;
  status: string;
}
