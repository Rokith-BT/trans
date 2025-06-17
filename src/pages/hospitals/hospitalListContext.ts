/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from 'react';
import { APIService, ContextContainer } from '@services';
import { toast } from '@/utils/toast';
import { ApprovalSummary, Hospital } from '@/types/hospital';
import queryString from 'query-string';
import { ConsultantList, HospitalOrgan, Invite, OrganLicencesSummary, Summary, UsersTable } from '@/types/common.type';
import { OrganLicense } from '@/types/organLicense';
// import { AuthType } from '@/types/auth/auth.response.type';

const ApiRoutes = {
  Base: `/hospitals`,
  ActiveHosBase: `/hospitals/names`,
  hospitalSummary: '/hospitals/summary',
  organsSummary: '/organlicences/summary',
  invite: '/invite',
  users: '/users',
  hospitalApproval: '/pendingapprovals',
  organApproval: '/organlicences/manageapproval',
  restore: '/restore',
  ApprovalSummary: 'approvalssummary',
  summary: 'summary',
  deleteOrgan: '/hospitalID',
  organLicense: '/organlicences',
  approve: '/approve',
  reject: '/reject',
  consultants: '/consultants',
  organs: '/organs'
};

interface StateType {
  list: Hospital[];
  activeHospitalList: Hospital[];
  count: number;
  summarys: Summary[];
  organsSummary: OrganLicencesSummary[];
  invite: Invite[];
  hospitalApprovals: Hospital[];
  organApprovals: OrganLicense[];
  forOrganApprovalCount: number;
  userApproval: UsersTable[];
  approvalSummary: ApprovalSummary[];
  userApprovalCount: number;
  consultants: ConsultantList[];
  hospitalOrgans: HospitalOrgan[];
  hospitalConsultant: ConsultantList[];
}

const initialState: StateType = {
  list: [],
  activeHospitalList: [],
  count: 0,
  summarys: [],
  organsSummary: [],
  invite: [],
  hospitalApprovals: [],
  organApprovals: [],
  forOrganApprovalCount: 0,
  userApproval: [],
  approvalSummary: [],
  userApprovalCount: 0,
  consultants: [],
  hospitalOrgans: [],
  hospitalConsultant: []
};

const reducer = (
  state: StateType,
  action: {
    type: string;
    payload?: any;
  }
) => {
  const { type } = action;
  switch (type) {
    case 'GETALL':
      return { ...state, list: action.payload.hospitals ?? [], count: action.payload.count ?? 0 };
    case 'GETACTIVEHOSPITAL':
      return { ...state, activeHospitalList: action.payload.hospitals ?? [] };

    case 'GETHOSPITALSUMMARY':
      return { ...state, summarys: action.payload ?? [] };

    case 'GETORGANSUMMARY':
      return { ...state, organsSummary: action.payload ?? [] };

    case 'INVITE':
      return { ...state, invite: action.payload ?? [] };
    case 'GETHOSPITALAPPROVALS':
      return { ...state, hospitalApprovals: action.payload.hospitals ?? [], count: action.payload.count ?? 0 };
    case 'GETORGANAPPROVALS':
      return {
        ...state,
        organApprovals: action.payload.hospitalsOrgansLicences ?? [],
        forOrganApprovalCount: action.payload.forOrganApprovalCount ?? 0
      };
    case 'GETUSERAPPROVALS':
      return {
        ...state,
        userApproval: action.payload.hospitalUsers ?? [],
        userApprovalCount: action.payload.userApprovalCount ?? 0
      };
    case 'GETAPPROVESUMMARY':
      return { ...state, approvalSummary: action.payload.approvalsSummary ?? [] };

    case 'DELETEORGANLICENSE':
      return { ...state };

    case 'RESTOREORGANLICENSE':
      return { ...state };
    case 'APPROVEORGANLICENSE':
      return { ...state };
    case 'REJECTORGANLICENSE':
      return { ...state };

    case 'GETCONSULTANT':
      return {
        ...state,
        consultants:
          action.payload.map((p: { userName: string; userID: number }) => ({
            label: p.userName,
            value: p.userID.toString()
          })) ?? []
      };
    case 'GETHOSPITALORGANS':
      return {
        ...state,
        hospitalOrgans:
          action.payload.map((p: { name: string; id: number }) => ({
            label: p.name,
            value: p.id.toString()
          })) ?? []
      };
    case 'GETHOSPITALCONSULTANT':
      return {
        ...state,
        hospitalConsultant:
          action.payload.map((p: { userName: string; userID: number }) => ({
            label: p.userName,
            value: p.userID.toString()
          })) ?? []
      };
    default:
      return state;
  }
};

export const { useContext: useHospitals, Provider: HospitalListProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const getAll = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}?${queryString.stringify(params)}`)
      .then((res: any) => {
        console.log('response from context', res);

        const {
          hospitals: { hospitals, totalCount }
        } = res;
        dispatch({ type: 'GETALL', payload: { hospitals, count: totalCount } });
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
  };
  const getAllActiveHospital = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.ActiveHosBase}?${queryString.stringify(params)}`)
      .then((res: any) => {
        console.log('response from context1212', res);
        const { hospitals } = res;
        dispatch({ type: 'GETACTIVEHOSPITAL', payload: { hospitals } });
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
  };
  const getHospitalApprovals = (params: any, callback?: (_data: any) => void) => {
    console.log('hello from hospital context');

    APIService.get(`${ApiRoutes.Base}${ApiRoutes.hospitalApproval}?${queryString.stringify(params)}`)
      .then((res: any) => {
        console.log('response from context', res);
        const {
          hospitals: { hospitals, totalCount }
        } = res;
        dispatch({ type: 'GETHOSPITALAPPROVALS', payload: { hospitals, count: totalCount } });

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
  };
  const getOrganlApprovals = (params: any, callback?: (_data: any) => void) => {
    console.log('heelo from hospital context');

    APIService.get(`${ApiRoutes.organApproval}?${queryString.stringify(params)}`)
      .then((res: any) => {
        console.log('response from context', res);

        const { hospitalsOrgansLicences, totalCount } = res.organLicences;
        console.log('organ approvals from context ', hospitalsOrgansLicences, totalCount);

        dispatch({
          type: 'GETORGANAPPROVALS',
          payload: { hospitalsOrgansLicences, forOrganApprovalCount: totalCount }
        });

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
  };

  const getUserApproval = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.users}${ApiRoutes.hospitalApproval}?${queryString.stringify(params)}`)

      .then((res: any) => {
        console.log('response from userapproval ', res);
        const { hospitalUsers, totalCount } = res.users;
        dispatch({
          type: 'GETUSERAPPROVALS',
          payload: { hospitalUsers, userApprovalCount: totalCount }
        });
        if (typeof callback === 'function') {
          callback(res);
          console.log('user approval data from context ', res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getHospitalSummary = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.hospitalSummary}?${queryString.stringify(params)}`)

      .then((res: any) => {
        console.log('response from hospital summary', res);

        const { summary } = res;
        dispatch({ type: 'GETHOSPITALSUMMARY', payload: { summary } });
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
  };
  const getorgansSummary = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.organsSummary}?${queryString.stringify(params)}`)

      .then((res: any) => {
        console.log('response from organ summary', res);
        const { organsSummary } = res;
        dispatch({ type: 'GETORGANSUMMARY', payload: { organsSummary } });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.state) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  //for invite
  const postInvite = (params: any, callback?: (_data: any) => void) => {
    APIService.post(ApiRoutes.invite, params)
      .then((res: any) => {
        console.log('response from invite', res);
        // if (Array.isArray(res) && res[0]?.message) {
        //   toast(res[0].message, 'error'); // Show the error message in the toast
        //   return; // Exit the function to avoid executing success logic
        // }
        dispatch({ type: 'INVITE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
        toast('Invitation sent successfully', 'success');
      })
      .catch((error: any) => {
        console.log('error from invite', error?.data?.message);
        if (typeof error === 'object' && error.message) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreHospital = (hospitalId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}${ApiRoutes.restore}`, data)
      .then((res: any) => {
        dispatch({ type: 'HOSPITALRESTORE', payload: res });

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
  };

  const deleteHospital = (hospitalId: number, data: any, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.Base}/${hospitalId}`, data)
      .then((res: any) => {
        dispatch({ type: 'HOSPITALDELETE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        console.log('hospital id from delete ', hospitalId);

        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const deleteOrganLicenses = (hospitalID: number, organId: number, data?: string, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.Base}/${hospitalID}${ApiRoutes.organLicense}/${organId}`, data)
      .then((res: any) => {
        dispatch({ type: 'DELETEORGANLICENSE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        console.log('hospital id from delete ', organId);

        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const restoreOrganLicenses = (hospitalID: number, organId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalID}${ApiRoutes.organLicense}/${organId}${ApiRoutes.restore}`, data)
      .then((res: any) => {
        dispatch({ type: 'RESTOREORGANLICENSE', payload: res });
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
  };

  const getApprovalsSummary = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${ApiRoutes.ApprovalSummary}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { approvalsSummary } = res;
        dispatch({ type: 'GETAPPROVESUMMARY', payload: { approvalsSummary } });
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

  // const getOneHospitalSummary = (hospitalId: number, params?: any, callback?: (_data: any) => void) => {
  //   APIService.get(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.summary}`, params)
  //     .then((res: any) => {
  //       const { summary } = res;
  //       dispatch({ type: 'HOSPITALSUMMARY', payload: { summary } });
  //       if (typeof callback === 'function') {
  //         callback(res);
  //       }
  //     })
  //     .catch((error: any) => {
  //       if (typeof error === 'object' && error.status) {
  //         toast(error.message, 'error');
  //       }
  //     });
  // };

  const approveOrganLicense = (hospitalId: number, organId: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}${ApiRoutes.organLicense}/${organId}${ApiRoutes.approve}`, {})
      .then((res: any) => {
        dispatch({ type: 'APPROVEORGANLICENSE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        console.log('hospital id from delete ', organId);

        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const rejectOrganLicense = (hospitalID: number, organId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalID}${ApiRoutes.organLicense}/${organId}${ApiRoutes.reject}`, data)
      .then((res: any) => {
        dispatch({ type: 'REJECTORGANLICENSE', payload: res });
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
  };
  const getConsultantList = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.consultants}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { doctors } = res;
        dispatch({ type: 'GETCONSULTANT', payload: doctors });
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

  const getHospitalOrganList = (hospitalId?: number, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalId}${ApiRoutes.organs}`)
      .then((res: any) => {
        const { organs } = res;
        dispatch({ type: 'GETHOSPITALORGANS', payload: organs });
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

  const getHospitalConsultantList = (hospitalId?: number, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalId}${ApiRoutes.consultants}`)
      .then((res: any) => {
        const { doctors } = res;
        dispatch({ type: 'GETHOSPITALCONSULTANT', payload: doctors });
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

  useEffect(() => {
    getHospitalSummary({ _all: true });
    getAllActiveHospital({ isGetAll: false });
    getorgansSummary({ _all: true });
    getApprovalsSummary({ _all: true });
    getConsultantList({ _all: true });
  }, []);

  return {
    state,
    actions: {
      getAll,
      getAllActiveHospital,
      getHospitalApprovals,
      getOrganlApprovals,
      postInvite,
      getUserApproval,
      restoreHospital,
      deleteHospital,
      // getOneHospitalSummary
      deleteOrganLicenses,
      restoreOrganLicenses,
      approveOrganLicense,
      rejectOrganLicense,
      getHospitalOrganList,
      getHospitalConsultantList
    }
  };
});
