/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { useReducer } from 'react';
import { Recipient } from '@/types/recipient';
import { ALFDocFeedBack, ALFSummary, LiverRequest, RecipientALFDTOs } from '@/types/alf';

const ApiRoutes = {
  Base: '/alf',
  RecipientBase: '/recipients',
  alfDoctors: '/alfdoctors',
  alfDoctor: '/alfdoctor',
  deleted: '/deleted',
  summary: '/summary',
  consultant: '/hospitals/consultants',
  approve: '/approve',
  reject: '/reject',
  liverrequested: '/liverrequested',
  alfconsultant: '/consultant',
  consultantId: '/consultantId',
  feedback: '/feedback',
  finalreview: '/finalreview',
  transtan: '/transtan',
  extend: '/extend',
  pendingApproval: '/pending-transtan-review',
  finalReview: '/final-review'
};

interface StateType {
  list: Recipient[];
  deleteList: Recipient[];
  selectedRecipient?: Recipient | null;
  alfList: RecipientALFDTOs[];
  alfDoctorsList: Recipient[];
  alfDeletedList: Recipient[];
  alfSummary: ALFSummary[];
  count: number;
  liverReqList: LiverRequest[];
  alfDocFeedbacks: ALFDocFeedBack[];
  loading: boolean;
}
const initialState: StateType = {
  list: [],
  deleteList: [],
  selectedRecipient: null,
  alfDoctorsList: [],
  alfDeletedList: [],
  alfList: [],
  alfSummary: [],
  count: 0,
  liverReqList: [],
  alfDocFeedbacks: [],
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
      return { ...state, list: payload.list };
    case 'GETBYID':
      return { ...state, selectedRecipient: payload.recipient };
    case 'GETALFLIST':
      return { ...state, alfList: payload.recipientALFDTOs, count: payload.totalCount, loading: false };
    case 'GETADDALFDOCTORS':
      return { ...state, list: payload.recipientsALFDoctors, count: payload.totalCount, loading: false };
    case 'GETALFDELETEDDOCTORS':
      return { ...state, deleteList: payload.recipientsALFDoctors, count: payload.totalCount };
    case 'GETALFSUMMARY':
      return { ...state, alfSummary: payload.summary };
    case 'ALFAPPROVE':
      return { ...state };
    case 'ALFREJECT':
      return { ...state };
    case 'GETLIVERPATIENT':
      return { ...state, liverReqList: payload };
    case 'UPDATEALFCONSULTANT':
      return { ...state };
    case 'DELETEALFDOCTOR':
      return { ...state };
    case 'GETCONSULTANTFEEDBACK':
      return { ...state, alfDocFeedbacks: payload };
    case 'APPROVEFINALREVIEW':
      return { ...state };
    case 'REJECTFINALREVIEW':
      return { ...state };
    case 'ALFEXTEND':
      return { ...state };
    case 'ALFUPDATE':
      return { ...state };
    case 'ALFDELETE':
      return { ...state };
    case 'ALFFINALREVERT':
      return { ...state };
    default:
      return state;
  }
};
export const { useContext: useALF, Provider: ALFProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const getRecipientTransferID = (transtanId: string) => {
    const recipient = state.list.find((recipient: Recipient) => recipient.transtanId === transtanId);
    if (recipient) {
      dispatch({ type: 'GETBYID', payload: { recipient: recipient } });
    } else {
      console.error('Recipient not found');
    }
  };

  const getLiverALFRequestList = (hospitalId?: number, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.RecipientBase}/${hospitalId}${ApiRoutes.liverrequested}`)
      .then((res: any) => {
        console.log(res, 'wffffffffffffffrsrfsdfd');

        dispatch({ type: 'GETLIVERPATIENT', payload: res?.recipients });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error?.message, 'error');
        }
      });
  };

  const getALFList = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipients: { recipientALFDTOs, totalCount }
        } = res || {};
        dispatch({ type: 'GETALFLIST', payload: { recipientALFDTOs, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error?.message, 'error');
        }
      });
  };

  const getAddALFDoctors = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.alfDoctors}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          alfdoctors: { recipientsALFDoctors, totalCount }
        } = res || {};
        dispatch({ type: 'GETADDALFDOCTORS', payload: { recipientsALFDoctors, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error?.message, 'error');
        }
      });
  };
  const getALFDeletedDoctors = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.alfDoctors}${ApiRoutes.deleted}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          alfdoctors: { recipientsALFDoctors, totalCount }
        } = res || {};
        dispatch({ type: 'GETALFDELETEDDOCTORS', payload: { recipientsALFDoctors, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error?.message, 'error');
        }
      });
  };
  const getALFSummary = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.summary}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { summary } = res || {};
        dispatch({ type: 'GETALFSUMMARY', payload: { summary } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error?.message, 'error');
        }
      });
  };
  const alfApprove = (alfId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.approve}`, data)
      .then((res: any) => {
        dispatch({ type: 'ALFAPPROVE', payload: res });
        toast('ALF Approved Successfully', 'success');
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
  const alfReject = (alfId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.reject}`, data)
      .then((res: any) => {
        dispatch({ type: 'ALFREJECT', payload: res });
        toast('ALF Rejected Successfully', 'success');
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
  const updateALFConsultant = (alfId: number, data: string, status: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.alfconsultant}/${status}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATEALFCONSULTANT', payload: res });
        toast(`${status} Successfully`, 'success');
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
  const deleteALFdoctor = (consultantId: number, reason?: string, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.Base}${ApiRoutes.alfDoctor}/${consultantId}`, reason)
      .then((res: any) => {
        dispatch({ type: 'DELETEALFDOCTOR', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error?.message, 'error');
        }
      });
  };

  const getALFConsultantFeedback = (alfId?: number, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${alfId}${ApiRoutes.alfconsultant}${ApiRoutes.feedback}`)
      .then((res: any) => {
        const { recipient } = res || {};
        dispatch({ type: 'GETCONSULTANTFEEDBACK', payload: recipient });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error?.message, 'error');
        }
      });
  };
  const approveALFFinalReview = (alfId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(
      `${ApiRoutes.Base}/${alfId}${ApiRoutes.transtan}${ApiRoutes.finalreview}${ApiRoutes.approve}`,
      data
    )
      .then((res: any) => {
        dispatch({ type: 'APPROVEFINALREVIEW', payload: res });
        toast('ALF Final Review Approved Successfully', 'success');
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
  const rejectALFFinalReview = (alfId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.transtan}${ApiRoutes.finalreview}${ApiRoutes.reject}`, data)
      .then((res: any) => {
        dispatch({ type: 'REJECTFINALREVIEW', payload: res });
        toast('ALF Final Review Rejected Successfully', 'success');
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

  const extendALF = (alfId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.extend}`, data)
      .then((res: any) => {
        dispatch({ type: 'ALFEXTEND', payload: res });
        toast('Extended Successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
          toast(res.message, 'success');
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

  const alfUpdate = (alfId: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.pendingApproval}`)
      .then((res: any) => {
        dispatch({ type: 'ALFUPDATE', payload: res });
        toast('Updated Successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
          toast(res.message, 'success');
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
  const alfFinalRevert = (alfId: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${alfId}${ApiRoutes.finalReview}`)
      .then((res: any) => {
        dispatch({ type: 'ALFUPDATE', payload: res });
        // toast('Updated Successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
          toast(res.message, 'success');
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
  const alfDelete = (alfId: number, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.Base}/${alfId}`)
      .then((res: any) => {
        dispatch({ type: 'ALFDELETE', payload: res });
        toast('Deleted Successfully', 'success');
        if (typeof callback === 'function') {
          callback(res);
          toast(res.message, 'success');
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

  return {
    state,
    actions: {
      getRecipientTransferID,
      getALFList,
      getAddALFDoctors,
      getALFDeletedDoctors,
      getALFSummary,
      alfApprove,
      alfReject,
      getLiverALFRequestList,
      updateALFConsultant,
      deleteALFdoctor,
      getALFConsultantFeedback,
      approveALFFinalReview,
      rejectALFFinalReview,
      extendALF,
      alfUpdate,
      alfFinalRevert,
      alfDelete
    }
  };
});
