/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import {
  HospitalName,
  Recipient,
  RecipientsSearch,
  // RecipientTransferType,
  RecipientVerifyOTP,
  RecipientApprovalTransferType,
  RecipientTransfer,
  RecipientPaymentInfo
  // SelectFieldType
} from '@/types/recipient';
import { returnRecipientTrasferFake } from '@/utils/recipientList';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { useReducer } from 'react';

const APIRoutes = {
  Base: '/recipients',
  BasicAddr: `/addresses`,
  FamilyCont: '/familycontact',
  Medical: '/medical',
  Vaccination: '/vaccination',
  OrganReq: '/organmapping',
  getID: '/Id',
  draft: '/draft',
  paymant: '/payment',
  approval: '/approval',
  transfer: '/transfer',
  transfers: '/transfers',
  hospitalNames: '/hospitals/names',
  recipientSearch: '/search',
  verifyotp: '/verifyotp',
  files: '/files',
  approve: '/approve',
  reject: '/reject',
  document: '/document',
  approveCMInsurance: '/approve',
  rejectCMInsurance: '/reject',
  cminsurance: '/cminsurance',
  basicdocuments: '/basicdocuments',
  apply: '/apply',
  summary: '/summary',
  inactive: '/inactive',
  active: '/activate'
};

interface StateType {
  list: Recipient[];
  hospitalId: number | null;
  count: number;
  selectedRecipient?: Recipient | null;
  transferRecipient?: any;
  currentRecipientID?: number;
  getRecipientById?: [];
  hospitalNames: HospitalName[];
  recipientSearch: RecipientsSearch[];
  recipientVerifyOTP: RecipientVerifyOTP[];
  recipientTransfer: RecipientTransfer[];
  recipientTransfers: RecipientApprovalTransferType[];
  fileFullPath: string;
  fileBlop: any;
  recipientSummary: any;
  getRecipientpayments: RecipientPaymentInfo | null;
  transferHospitals: HospitalName[];
  loading: boolean;
}
const initialState: StateType = {
  list: [],
  hospitalId: 0,
  count: 0,
  selectedRecipient: null,
  transferRecipient: [],
  recipientTransfers: [],
  currentRecipientID: 0,
  getRecipientById: [],
  hospitalNames: [],
  recipientSearch: [],
  recipientVerifyOTP: [],
  recipientTransfer: [],
  fileFullPath: '',
  fileBlop: '',
  recipientSummary: [],
  getRecipientpayments: null,
  transferHospitals: [],
  loading: true
};
const reducer = (
  state: StateType,
  action: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any;
  }
) => {
  const { type, payload } = action;
  switch (type) {
    case 'GETALL':
      return { ...state, list: payload.recipients, count: payload.totalCount, loading: false };
    case 'DELETEBYID':
      return { ...state };
    case 'GETRECIPIENTTRANSFERBYID':
      return { ...state, transferRecipient: payload };
    case 'GETRECIPIENTAPPROVAL':
      return { ...state, list: payload.recipients, count: payload.totalCount };
    case 'GETRECIPIENTTRANSFERS':
      return { ...state, recipientTransfers: payload.recipientTransfers, count: payload.totalCount };
    case 'CURRRECIPIENTID':
      return { ...state, currentRecipientID: payload };
    case 'INSERTRECIPIENT':
      return { ...state };
    case 'UPDATERECIPIENT':
      return { ...state };
    case 'UPDATERECIPIENTPROFILE':
      return { ...state };
    case 'UPDRECIPIENTBASICADDR':
      return { ...state };
    case 'FAMILYCONTACT':
      return { ...state };
    case 'RECIPIENTMEDICAL':
      return { ...state };
    case 'RECIPIENTVACC':
      return { ...state };
    case 'ORGANREQUEST':
      return { ...state };
    case 'RECIPIENTDOCUMENT':
      return { ...state };
    case 'GETRECIPIENTBYID':
      return { ...state, getRecipientById: payload, loading: false };
    case 'GETAPPROVAL':
      return { ...state, list: payload.recipients, count: payload.totalCount };
    case 'RECIPIENTDRAFT':
      return { ...state };
    case 'RECIPIENTPAYMENT':
      return { ...state };
    case 'GETRECIPIENTPAYMENT':
      return { ...state, getRecipientpayments: payload.paymentinfo };
    case 'GETHOSPITALNAMES':
      return { ...state, hospitalNames: payload }; //for hospital name
    case 'GETRECIPIENTSEARCH':
      return { ...state, recipientSearch: payload }; //for recipient search
    case 'RECIPIENTVERIFYOTP':
      return { ...state, recipientVerifyOTP: payload }; //for recipient verify OTP
    case 'RECIPIENTTRANSFER':
      return { ...state, recipientTransfer: payload };
    case 'GETTRANSFERRECIPIENTLIST':
      return { ...state, list: payload.recipientTransfers, count: payload.totalCount, loading: false };
    case 'FILEUPLOADRECIPIENT':
      return { ...state, fileFullPath: payload };
    case 'GETFILE':
      return { ...state, fileBlop: payload };
    case 'RECIPIENTAPPROVE':
      return { ...state };
    case 'RECIPIENTREJECT':
      return { ...state };
    case 'RECIPIENTCMIAPPROVE':
      return { ...state };
    case 'RECIPIENTCMIREJECT':
      return { ...state };
    case 'RECIPIENTCMIINSERT':
      return { ...state };
    case 'GETRECIPIENTSUMMARY':
      return { ...state, recipientSummary: payload.summary };
    case 'RECIPIENTINACTIVE':
      return { ...state };
    case 'RECIPIENTACTIVE':
      return { ...state };
    case 'APPROVERECIPIENTTRANSFER':
      return { ...state };
    case 'REJECTRECIPIENTTRANSFER':
      return { ...state };
    case 'GETTRANSFERHOSPITALs':
      return { ...state, transferHospitals: payload };
    default:
      return state;
  }
};
export const { useContext: useRecipient, Provider: RecipientProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const getAll = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipients: { recipients, totalCount }
        } = res;
        dispatch({ type: 'GETALL', payload: { recipients, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };

  const getRecipientApproval = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.approval}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipients: { recipients, totalCount }
        } = res || {};
        // dispatch({ type: 'GETRECIPIENTAPPROVAL', payload: { recipients, totalCount } });
        dispatch({
          type: 'GETAPPROVAL',
          payload: { recipients, totalCount }
        });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const getTransferApproval = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`get${APIRoutes.Base}${APIRoutes.approval}${APIRoutes.transfer}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipientTransfers: { recipientTransfers, totalCount }
        } = res || {};
        dispatch({
          type: 'GETTRANSTANAPPROVAL',
          payload: { recipientTransfers, totalCount }
        });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const getRecipientTransferList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.transfer}${APIRoutes.approval}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipient: { recipientTransfers, totalCount }
        } = res || {};
        dispatch({ type: 'GETRECIPIENTTRANSFERS', payload: { recipientTransfers, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const deleteRecipientByID = (transtanId: number, data: string, callback?: (_data: any) => void) => {
    APIService.delete(`${APIRoutes.Base}/${transtanId}`, data)
      .then((res: any) => {
        dispatch({ type: 'DELETEBYID', payload: { recipient: res } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const getRecipientTransferID = () => {
    const recipient = returnRecipientTrasferFake();

    if (recipient) {
      dispatch({ type: 'GETRECIPIENTTRANSFERBYID', payload: recipient });
    } else {
      console.error('Recipient not found');
    }
  };
  //for recipient Transfer hospital names
  const getHospitalNames = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.hospitalNames}?isGetAll=false${queryString.stringify(params)}`)
      .then((res: any) => {
        const { hospitals } = res || {};
        dispatch({ type: 'GETHOSPITALNAMES', payload: hospitals });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const getRecipientSearch = (searchValue: string, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.recipientSearch}?${queryString.stringify({ searchValue })}`)
      .then((res: any) => {
        const { recipient } = res || {};
        dispatch({ type: 'GETRECIPIENTSEARCH', payload: recipient });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.status === 400) {
          toast('Recipient not found. Please check the recipient status', 'error');
        }
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  //for recipient verify OTP
  const getRecipientVerifyOTP = (transtanId: string, data?: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${transtanId}${APIRoutes.transfer}${APIRoutes.verifyotp}`, data)
      .then((res: any) => {
        const { recipient } = res || {};
        dispatch({ type: 'RECIPIENTVERIFYOTP', payload: recipient });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const recipientTransfer = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.post(`${APIRoutes.Base}/${recipientId}${APIRoutes.transfer}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTTRANSFER' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };

  const insertRecipientBasic = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${APIRoutes.Base}`, data)
      .then((res: any) => {
        dispatch({ type: 'INSERTRECIPIENT', payload: res });
        dispatch({ type: 'CURRRECIPIENTID', payload: res.id });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientBasic = (transtanId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${transtanId}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATERECIPIENT', payload: res });
        dispatch({ type: 'CURRRECIPIENTID', payload: transtanId });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientBasicProfile = (transtanId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${transtanId}${APIRoutes.basicdocuments}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATERECIPIENTPROFILE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientBasicAddress = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.BasicAddr}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDRECIPIENTBASICADDR', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientFamilyCont = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.FamilyCont}`, data)
      .then((res: any) => {
        dispatch({ type: 'FAMILYCONTACT', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientMediacalDetails = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.Medical}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTMEDICAL', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientMediVaccination = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.Vaccination}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTVACC', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const updateRecipientOrganReq = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.OrganReq}`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANREQUEST', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getRecipientDataByID = (recipientId: number, callback?: (_data: any) => void) => {
    if (recipientId) {
      dispatch({ type: 'GETRECIPIENTBYID', payload: null });
      APIService.get(`${APIRoutes.Base}/${recipientId}`)
        .then((res: any) => {
          const { recipient } = res;
          dispatch({ type: 'GETRECIPIENTBYID', payload: recipient });
          if (typeof callback === 'function') {
            callback(res);
          }
        })
        .catch((error: any) => {
          if (typeof error === 'object' && error.status) {
            toast(error.message, 'error');
          }
          console.log(error);
        });
    } else {
      dispatch({ type: 'GETRECIPIENTBYID', payload: null });
    }
  };

  const recipientDraft = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.draft}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTDRAFT', payload: res });
        toast('Recipient was added successfully.', 'success');
        if (typeof callback === 'function') {
          callback(res);
          console.log('response in context for insert recipietn details ', res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const recipientPayment = (recipientId: number, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.paymant}`)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTPAYMENT', payload: res });
        toast('Payment has been completed and the recipient was added successfully.', 'success');
        if (typeof callback === 'function') {
          callback(res);
          console.log('response in context for insert recipietn details ', res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getRecipientPayment = (recipientId: number, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}/${recipientId}${APIRoutes.paymant}`)
      .then((res: any) => {
        dispatch({ type: 'GETRECIPIENTPAYMENT', payload: res });
        if (typeof callback === 'function') {
          callback(res);
          console.log('response in context for insert recipietn details ', res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getTransferRecipinetList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.transfers}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { recipientTransfers, totalCount } = res.recipient;
        dispatch({ type: 'GETTRANSFERRECIPIENTLIST', payload: { recipientTransfers, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const recipientFileUpload = (data: any, callback?: (_data: any) => void) => {
    APIService.upload(`${APIRoutes.files}`, data)
      .then((res: any) => {
        dispatch({ type: 'FILEUPLOADRECIPIENT', payload: res?.data?.fileResponse?.fullfilepath });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getFileData = (data: any, callback?: (_data: any) => void) => {
    APIService.getFile(`${APIRoutes.files}?path=${data}`)
      .then((res: any) => {
        dispatch({ type: 'GETFILE', payload: URL.createObjectURL(res) });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const recipientApprove = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}${APIRoutes.approve}/${recipientId}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTAPPROVE', payload: res });
        toast('Recipient was approved successfully.', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const recipientReject = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}${APIRoutes.reject}/${recipientId}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTREJECT', payload: res });
        toast('Recipient was rejected successfully.', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateRecipientDocuments = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.document}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTDOCUMENT', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const recipientCMInsuranceApprove = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.cminsurance}${APIRoutes.approveCMInsurance}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTCMIAPPROVE', payload: res });
        toast('CM Insurance was approved successfully.', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const recipientCMInsuranceReject = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.cminsurance}${APIRoutes.rejectCMInsurance}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTCMIREJECT', payload: res });
        toast('CM Insurance was rejected successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const recipientCMInsuranceInsert = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.cminsurance}${APIRoutes.apply}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTCMIINSERT', payload: res });
        toast('CM Insurance was applied successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getAllRecipientSummary = (callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.summary}`)
      .then((res: any) => {
        dispatch({ type: 'GETRECIPIENTSUMMARY', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const recipientChangeInactive = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}${APIRoutes.inactive}/${recipientId}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTINACTIVE', payload: res });
        toast('Recipient was inactived successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const recipientChangeActive = (recipientId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}${APIRoutes.active}/${recipientId}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTACTIVE', payload: res });
        toast('Recipient was actived successfully.', 'success');
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  //for transfer appraoval
  const approveRecipientTransfer = (
    recipientId: number,
    transferId: number,
    data: string,
    callback?: (_data: any) => void
  ) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.transfer}/${transferId}${APIRoutes.approve}`, data)
      .then((res: any) => {
        dispatch({ type: 'APPROVERECIPIENTTRANSFER', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const rejectRecipientTransfer = (
    recipientId: number,
    transferId: number,
    data: string,
    callback?: (_data: any) => void
  ) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.transfer}/${transferId}${APIRoutes.reject}`, data)
      .then((res: any) => {
        dispatch({ type: 'REJECTRECIPIENTTRANSFER', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getAllAvailbaleHospitals = (recipeintId: number | string, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}/${recipeintId}${APIRoutes.transfer}/hospital`)
      .then((res: any) => {
        const { hospitals } = res || {};
        dispatch({ type: 'GETTRANSFERHOSPITALs', payload: hospitals });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          toast('No response from the server. Please try again later.', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const editRecipientTransfer = (recipientId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${APIRoutes.Base}/${recipientId}${APIRoutes.transfer}`, data)
      .then((res: any) => {
        dispatch({ type: 'RECIPIENTTRANSFER' });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };

  return {
    state,
    actions: {
      getAll,
      deleteRecipientByID,
      getRecipientTransferID,
      insertRecipientBasic,
      updateRecipientBasic,
      updateRecipientBasicProfile,
      updateRecipientBasicAddress,
      updateRecipientFamilyCont,
      updateRecipientMediacalDetails,
      updateRecipientMediVaccination,
      updateRecipientOrganReq,
      getRecipientDataByID,
      getRecipientApproval,
      getTransferApproval,
      getRecipientTransferList,
      recipientDraft,
      recipientPayment,
      getRecipientPayment,
      getHospitalNames,
      getRecipientSearch,
      getRecipientVerifyOTP,
      recipientTransfer,
      getTransferRecipinetList,
      recipientFileUpload,
      getFileData,
      recipientApprove,
      recipientReject,
      updateRecipientDocuments,
      recipientCMInsuranceApprove,
      recipientCMInsuranceReject,
      recipientCMInsuranceInsert,
      getAllRecipientSummary,
      recipientChangeInactive,
      recipientChangeActive,
      approveRecipientTransfer,
      rejectRecipientTransfer,
      dispatch,
      getAllAvailbaleHospitals,
      editRecipientTransfer
    }
  };
});
