/* eslint-disable @typescript-eslint/no-explicit-any */

import { APIService, ContextContainer } from '@/services';
import { DonorConsentType, DonorStatusType, LiveTransplantDTO } from '@/types/donor';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
// import { toast } from '@/utils/toast';
import { useReducer } from 'react';

//routes
const APIRoutes = {
  Base: '/donors',
  getID: '/Id',
  category: '/category',
  potential: '/potential',
  confirmed: '/confirmed',
  bsdi: '/bsdi',
  bsdnp: '/bsdnp',
  registration: '/registration',
  organCconsent: '/organ-consent',
  medicalHistory: '/medical-history',
  bloodTest: '/blood-test',
  attachment: '/attachment',
  liveTransplant: '/live-transplant',
  status: '/status',
  masterStatus: '/master-status',
  caseOfficerList: '/case-officer-list',
  caseOfficer: '/case-officer',
  masterTermination: '/master-termination-reason',
  identification: '/identification'
};
interface StateType {
  potensialDonarList: any;
  ccdDonarList: any;
  bsdiDonarlist: any;
  bsdnpDonarList: any;
  currentDonarId: number;
  getDonarDetails: DonorConsentType[];
  currentMedicalId: number;
  potensialCount: number;
  currentConsentId: number;
  liveTransplant: LiveTransplantDTO[];
  liveTransplantID: LiveTransplantDTO | null;
  getDonorStatuses: DonorStatusType[] | null;
  caseOfficerList: { id: number; name: string }[];
  getTerminations: { id: number; name: string }[];
}
const initialState: StateType = {
  potensialDonarList: [],
  ccdDonarList: [],
  bsdiDonarlist: [],
  bsdnpDonarList: [],
  currentDonarId: 0,
  getDonarDetails: [],
  currentMedicalId: 0,
  potensialCount: 0,
  liveTransplant: [],
  liveTransplantID: null,
  currentConsentId: 0,
  getDonorStatuses: null,
  caseOfficerList: [],
  getTerminations: []
};

const reducer = (
  state: StateType,
  action: {
    type: string;
    payload: any;
  }
) => {
  const { type, payload } = action;
  switch (type) {
    case 'GETPOTENSIALDONAR':
      return { ...state, potensialDonarList: payload.donors, potensialCount: payload.totalCount };
    case 'GETCCDDONAR':
      return { ...state, ccdDonarList: payload };
    case 'GETBSDIDONAR':
      return { ...state, bsdiDonarlist: payload };
    case 'GETBSDNPDONAR':
      return { ...state, bsdnpDonarList: payload };
    case 'INSERTDONAR':
      return { ...state };
    case 'DONORCONSENTDOC':
      return { ...state };
    case 'CURRDONARID':
      return { ...state, currentDonarId: payload };
    case 'CURRCONSENTID':
      return { ...state, currentConsentId: payload };
    case 'CURRDONARMEDICALID':
      return { ...state, currentMedicalId: payload };
    case 'ORGANCONSENT':
      return { ...state };
    case 'ORGANMEDICALHIS':
      return { ...state };
    case 'ORGANMEDICALINJURY':
      return { ...state };
    case 'ORGANABGBLOOD':
      return { ...state };
    case 'ORGANDOCUMENTS':
      return { ...state };
    case 'UPDATEDONORSTATUS':
      return { ...state };
    case 'GETDONARBYID':
      return { ...state, getDonarDetails: payload };
    case 'GETLIVEETRANPLANT':
      return { ...state, liveTransplant: payload };
    case 'GETLIVEETRANPLANTID':
      return { ...state, liveTransplantID: payload };
    case 'INSERTLIVETRANSPLANT':
      return { ...state };
    case 'INSERTCONSENTINDENTITY':
      return { ...state };
    case 'UPDATECONSENTINDENTITY':
      return { ...state };
    case 'LIVETRANSPLANT':
      return { ...state };
    case 'GETDONORSTATUS':
      return { ...state, getDonorStatuses: payload };
    case 'GETCASEOFFICER':
      return { ...state, caseOfficerList: payload };
    case 'PUTCASEOFFICER':
      return { ...state };
    case 'GETTERMINATION':
      return { ...state, getTerminations: payload };
    default:
      return { ...state };
  }
};

// create contenxt
export const { useContext: useDonor, Provider: DonorProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });
  const getPotensialDonarList = (params: any, hash: string, callback?: (_data: any) => void) => {
    if (hash === '#pdl') {
      APIService.get(`${APIRoutes.Base}${APIRoutes.category}${APIRoutes.potential}?${queryString.stringify(params)}`)
        .then((res: any) => {
          const { donors, totalCount } = res || {};
          console.log(donors, totalCount, 'donors, totalCount');

          dispatch({ type: 'GETPOTENSIALDONAR', payload: { donors, totalCount } });
          if (typeof callback === 'function') {
            callback(res);
          }
        })
        .catch((error: any) => {
          if (typeof error === 'object' && error.Status) {
            toast(error.message, 'error');
          }
        });
    } else if (hash === '#ccd') {
      APIService.get(`${APIRoutes.Base}${APIRoutes.category}${APIRoutes.confirmed}?${queryString.stringify(params)}`)
        .then((res: any) => {
          dispatch({ type: 'GETCCDDONAR', payload: res.donors });
          if (typeof callback === 'function') {
            callback(res);
          }
        })
        .catch((error: any) => {
          if (typeof error === 'object' && error.Status) {
            toast(error.message, 'error');
          }
        });
    } else if (hash === '#bsd_i') {
      APIService.get(`${APIRoutes.Base}${APIRoutes.category}${APIRoutes.bsdi}?${queryString.stringify(params)}`)
        .then((res: any) => {
          dispatch({ type: 'GETBSDIDONAR', payload: res.donors });
          if (typeof callback === 'function') {
            callback(res);
          }
        })
        .catch((error: any) => {
          if (typeof error === 'object' && error.Status) {
            toast(error.message, 'error');
          }
        });
    } else {
      APIService.get(`${APIRoutes.Base}${APIRoutes.category}${APIRoutes.bsdnp}?${queryString.stringify(params)}`)
        .then((res: any) => {
          dispatch({ type: 'GETBSDNPDONAR', payload: res.donors });
          if (typeof callback === 'function') {
            callback(res);
          }
        })
        .catch((error: any) => {
          if (typeof error === 'object' && error.Status) {
            toast(error.message, 'error');
          }
        });
    }
  };
  const insertDonarDetails = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${APIRoutes.Base}${APIRoutes.registration}`, data)
      .then((res: any) => {
        dispatch({ type: 'INSERTDONAR', payload: res });
        dispatch({ type: 'CURRDONARID', payload: res.id });
        dispatch({ type: 'CURRCONSENTID', payload: res.consentId });
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
  const updateDonarConsentDoc = (donorId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}/consent-document`, data)
      .then((res: any) => {
        dispatch({ type: 'DONORCONSENTDOC', payload: res });
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
  const updateDonarDetails = (donorId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}`, data)
      .then((res: any) => {
        dispatch({ type: 'INSERTDONAR', payload: res });
        dispatch({ type: 'CURRDONARID', payload: donorId });
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
  const updateDonarOrganConsent = (donorId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.organCconsent}`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANCONSENT', payload: res });
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
  const updateDonarMedicalDetails = (donorId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.medicalHistory}`, data)
      .then((res: any) => {
        console.log(res, 'resresresres1212');

        dispatch({ type: 'ORGANMEDICALHIS', payload: res });
        dispatch({ type: 'CURRDONARMEDICALID', payload: res?.data?.donor?.medicalHistoryId });
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
  const updateDonarMedicalDetailsInjury = (
    donorId: number,
    historyId: number,
    data: any,
    callback?: (_data: any) => void
  ) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.medicalHistory}/${historyId}/injury`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANMEDICALINJURY', payload: res });
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
  const updateDonarABGBolldTest = (donorId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.bloodTest}`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANABGBLOOD', payload: res });
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
  const updateDonarAttachment = (donorId: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.attachment}`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANDOCUMENTS', payload: res });
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
  const getDonarDataByID = (recipientId: number, callback?: (_data: any) => void) => {
    if (recipientId) {
      dispatch({ type: 'GETDONARBYID', payload: null });
      APIService.get(`${APIRoutes.Base}/${recipientId}`)
        .then((res: any) => {
          const { donor } = res;
          console.log(donor,'donordonordonordonordonordonor');
          
          dispatch({ type: 'GETDONARBYID', payload: donor });
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
      dispatch({ type: 'GETDONARBYID', payload: null });
    }
  };

  const updateDonorStatus = (
    donorId: number,
    data: { donorId: any; statusId: any; reason: string },
    callback?: (_data: any) => void
  ) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.status}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATEDONORSTATUS', payload: res });
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
  const getLiveTransplantList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.liveTransplant}?${queryString.stringify(params)}`)
      .then((res: any) => {
        console.log(res, 'resresresresresresresqWEDWD');

        dispatch({ type: 'GETLIVEETRANPLANT', payload: res.liveTransplantDTOs });
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
  const getLiveTransplantListId = (id: number, callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.liveTransplant}/${id}`)
      .then((res: any) => {
        console.log(res, 'resresresresresresresqWEDWD');
        dispatch({ type: 'GETLIVEETRANPLANTID', payload: res });
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
  const insertLiveTransplantDetails = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${APIRoutes.Base}${APIRoutes.liveTransplant}`, data)
      .then((res: any) => {
        dispatch({ type: 'INSERTLIVETRANSPLANT', payload: res });
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
  const updateLiveTransplant = (data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}${APIRoutes.liveTransplant}`, data)
      .then((res: any) => {
        dispatch({ type: 'LIVETRANSPLANT', payload: res });
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
  const getDonorStatus = (callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.masterStatus}`)
      .then((res: any) => {
        dispatch({ type: 'GETDONORSTATUS', payload: res });
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
  const getCaseOfficer = (callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.caseOfficerList}`)
      .then((res: any) => {
        dispatch({ type: 'GETCASEOFFICER', payload: res });
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
  const putCaseOfficer = (donorId: number, caseOfficerId: number, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}/${donorId}${APIRoutes.caseOfficer}/${caseOfficerId}`)
      .then((res: any) => {
        dispatch({ type: 'PUTCASEOFFICER', payload: res });
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
  const getMasterTerminations = (callback?: (_data: any) => void) => {
    APIService.get(`${APIRoutes.Base}${APIRoutes.masterTermination}`)
      .then((res: any) => {
        dispatch({ type: 'GETTERMINATION', payload: res });
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
  const insertDonorConsentBasicDetails = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`${APIRoutes.Base}${APIRoutes.identification}`, data)
      .then((res: any) => {
        dispatch({ type: 'INSERTCONSENTINDENTITY', payload: res });
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
  const updateDonorConsentBasicDetails = (donorID: number, data: any, callback?: (_data: any) => void) => {
    APIService.put(`${APIRoutes.Base}${APIRoutes.identification}/${donorID}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATECONSENTINDENTITY', payload: res });
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
  return {
    state,
    action: {
      getPotensialDonarList,
      insertDonarDetails,
      updateDonarDetails,
      updateDonarConsentDoc,
      updateDonarOrganConsent,
      updateDonarMedicalDetails,
      updateDonarMedicalDetailsInjury,
      updateDonarABGBolldTest,
      updateDonarAttachment,
      getDonarDataByID,
      getLiveTransplantList,
      insertLiveTransplantDetails,
      updateLiveTransplant,
      getLiveTransplantListId,
      updateDonorStatus,
      getDonorStatus,
      getCaseOfficer,
      putCaseOfficer,
      getMasterTerminations,
      insertDonorConsentBasicDetails,
      updateDonorConsentBasicDetails
    }
  };
});
