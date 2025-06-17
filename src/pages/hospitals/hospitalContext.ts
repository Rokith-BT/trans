/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import { User, UsersTable } from '@/types/common.type';
import {
  BasicDetails,
  HospitalDetail /* HospitalStatus */,
  HospitalSummary,
  HospitalUser,
  Infrastructure,
  OrganLicenceItem,
  PaymentInfo
} from '@/types/hospital';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { useEffect, useReducer } from 'react';

const ApiRoutes = {
  Base: `/hospitals`,
  BasicDetails: `basicdetails`,
  InfraStructure: `infrastructure`,
  OrganLicense: `organlicences`,
  Users: 'users',
  Approve: 'approve',
  Restore: 'restore',
  hospitalReject: 'reject',
  paymentstatus: 'paymentstatus',
  summary: 'summary',
  alf: 'alf',
  alfDoctor: 'alfdoctor',
  consultantId: 'consultantId',
  profilephoto: 'profilephoto'
};
interface StateType {
  hospital: HospitalDetail | null;
  hospitalId: number | null;
  basicDetails: BasicDetails | null;
  infrastructure: Infrastructure | null;
  organlicences: OrganLicenceItem | null;
  getOrganLicense: OrganLicenceItem[] | null;
  count: number;
  admin: User | null; // user object need to place here
  hospitalUsers: UsersTable[] | null;
  totalCount: number | null;
  singleUser: HospitalUser | null;
  loading: boolean;
  oneHospitalSummary: HospitalSummary | null;
  paymentInfo: PaymentInfo | null;
}

const initialState: StateType = {
  hospital: null,
  hospitalId: null,
  basicDetails: null,
  infrastructure: null,
  organlicences: null,
  getOrganLicense: null,
  count: 0,
  admin: null,
  hospitalUsers: null,
  totalCount: null,
  singleUser: null,
  loading: true,
  oneHospitalSummary: null,
  paymentInfo: null
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
    case 'HOSPITALDETAILS':
      return {
        ...state,
        loading: false,
        hospital: payload.hospital,
        admin: payload.admin,
        hospitalId: payload.hospitalId
      };
    case 'BASICDETAILS':
      return { ...state, basicDetails: payload };
    case 'INFRASTRUCTURE':
      return { ...state, infrastructure: payload };
    case 'ORGANLICENSE':
      return { ...state, organlicences: payload };
    case 'GETORGANLICENSE':
      return {
        ...state,
        getOrganLicense: action.payload.hospitalOrgansDocuments,
        totalCount: action.payload.count ?? 0
      };
    case 'UPDATEADMINDETAILS':
      return { ...state, admin: payload };
    case 'UPDATEPAYMENTSTATUS':
      return { ...state, hospital: { ...state.hospital, paymentInfo: payload, status: 'PendingApproval' } };
    case 'HOSPITALAPPROVAL':
      return { ...state };
    case 'HOSPITALREJECT':
      return { ...state };
    case 'HOSPITALDELETE':
      return { ...state };
    case 'HOSPITALRESTORE':
      return { ...state };
    case 'POSTHOSPITALUSER':
      return { ...state, hospitalUser: payload };
    case 'GETHOSPITALUSERS':
      return {
        ...state,
        hospitalUsers: action.payload.hospitalUsers ?? [],
        totalCount: action.payload.totalCount ?? 0
      };
    case 'DELETEHOSPITALUSERS':
      return { ...state };
    case 'RESTOREHOSPITALUSERS':
      return { ...state };
    case 'GETSINGLEUSER':
      return { ...state, Loading: false, singleUser: action.payload.user ?? [] };
    case 'UPDATEUSER':
      return { ...state, singleUser: payload };
    case 'APPROVEUSR':
      return { ...state };
    case 'HOSPITALSUMMARY':
      return { ...state, oneHospitalSummary: action.payload.summary ?? [] };
    case 'DECLINEUSERS':
      return { ...state };
    case 'ADDALFDOCTOR':
      return { ...state };
    case 'EDITORGANLICENSE':
      return { ...state };
    //for profile photo
    case 'UPDATE_PROFILE_PHOTO':
      return { ...state };
    default:
      return state;
  }
};

export const { useContext: useHospital, Provider: HospitalProvider } = ContextContainer(({ hospitalId }: StateType) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  // const navigate = useNavigate();
  useEffect(() => {
    if (hospitalId) {
      getHospitalDetails(hospitalId);
    }
  }, [hospitalId]);
  const getHospitalDetails = (hospitalId: number, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalId}`)
      .then((res: any) => {
        const hospital = res.hospital[0]; // Extract hospital details
        const { adminId } = hospital;

        if (adminId === '0') {
          // Handle case where adminId is 0
          toast('Admin does not exist. Admin data will be empty.', 'warning');
          dispatch({
            type: 'HOSPITALDETAILS',
            payload: { hospital, admin: {}, hospitalId }
          });
        } else {
          // Fetch admin details if adminId is valid
          getAdminDetails(hospitalId, adminId, (adminDetails) => {
            dispatch({
              type: 'HOSPITALDETAILS',
              payload: { hospital, admin: adminDetails?.user || {}, hospitalId }
            });
          });
        }

        // Trigger callback if provided
        if (typeof callback === 'function') {
          callback(res);
          toast('Successfully fetched hospital details', 'success');
        }
      })
      .catch((error: any) => {
        // Handle errors from API
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

  const getHospitalUsers = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { hospitalUsers, totalCount } = res.users;
        dispatch({ type: 'GETHOSPITALUSERS', payload: { hospitalUsers, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
          console.log('response from context hospital users ', res);
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
  const getAdminDetails = (hospitalId: number, adminId: number | string, callback?: (_data: any) => void) => {
    console.log('adminId:', adminId, 'Type:', typeof adminId);
    if (adminId === '0') {
      toast('Admin does not exist.', 'error');
    }
    APIService.get(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${adminId}`)
      .then((res: any) => {
        if (typeof callback === 'function') {
          callback(res);
          console.log('admin get api datas from hospital context ', res);
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
  const updateAdminDetails = (data: any, params?: any, callback?: (_data: any) => void) => {
    const adminId = state?.hospital?.adminId;
    const admin = state.admin;

    APIService.patch(
      `${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${adminId}?${queryString.stringify(params)}`,
      data
    )

      .then((res: any) => {
        dispatch({ type: 'UPDATEADMINDETAILS', payload: { ...admin, ...data } });
        if (typeof callback === 'function') {
          callback(res);
          console.log('response in context for update admin details ', res);
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
  const updateBasicDetails = (data: BasicDetails, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.BasicDetails}`, data)
      .then((res: any) => {
        dispatch({ type: 'BASICDETAILS', payload: res });
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
  const updateInfraStructure = (data: Infrastructure, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.InfraStructure}`, data)
      .then((res: any) => {
        dispatch({ type: 'INFRASTRUCTURE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, error);
        } else if (error.request) {
          toast('No response from the server,Please try again later ', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateOrganLicense = (data: OrganLicenceItem, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.OrganLicense}`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANLICENSE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, error);
        } else if (error.request) {
          toast('No response from the server,Please try again later ', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const addOrganLicense = (data: OrganLicenceItem, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.OrganLicense}`, data)
      .then((res: any) => {
        dispatch({ type: 'ORGANLICENSE', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, error);
        } else if (error.request) {
          toast('No response from the server,Please try again later ', 'error');
        } else {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getOrganLicenses = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.OrganLicense}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { hospitalOrgansDocuments, totalCount } = res.organsLicences;
        dispatch({ type: 'GETORGANLICENSE', payload: { hospitalOrgansDocuments, totalCount } });
        if (typeof callback === 'function') {
          callback(res);
        }
        console.log('response from license ', res);
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const updateHospitalReject = (data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.hospitalReject}`, data)
      .then((res: any) => {
        dispatch({ type: 'HOSPITALREJECT', payload: res });
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
  const updatePaymnetStatus = (callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.paymentstatus}`, {})
      .then((res: any) => {
        dispatch({ type: 'UPDATEPAYMENTSTATUS', payload: res?.paymnetInfo });
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
  const restoreHospital = (hospitalId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Restore}`, data)
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
  const updateHospitalApproval = (callback?: (_data: any) => void) => {
    if (!hospitalId) {
      toast('Error: hospitalId is missing!', 'error');
      return;
    }

    console.log(`Making POST request to: ${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Approve}`);
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Approve}`, {})
      .then((res: any) => {
        dispatch({ type: 'HOSPITALAPPROVAL', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (error.response) {
          console.error(`Error Response:`, error.response);
          toast(`Error ${error.response.status}: ${error.response.data?.message}`, 'error');
        } else if (error.request) {
          console.error('Error Request:', error.request);
          toast('No response from the server. Please try again later.', 'error');
        } else {
          console.error('Error:', error.message);
          toast(error.message, 'error');
        }
      });
  };
  const postUsers = (data: any, params: any, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}?${queryString.stringify(params)}`, data)
      .then((res: any) => {
        dispatch({ type: 'POSTHOSPITALUSER', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
        toast('User Details Submitted Successfully', 'success');
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  //for profile photo upload
  const updateProfilePhoto = (
    hospitalId: number | string,
    userId: number | string,
    data: any,
    callBack?: (_data: any) => void
  ) => {
    // const refineData = base64toFile(data, 'profile.jpg');
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}/${ApiRoutes.profilephoto}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATE_PROFILE_PHOTO', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.Status) {
          toast(error.message, 'error');
        }
      });
  };
  const deleteHospitalUsers = (userId: number, data: any, callback?: (_data: any) => void) => {
    APIService.delete(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}`, data)
      .then((res: any) => {
        dispatch({ type: 'DELETEHOSPITALUSERS', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
        toast('User Deleted Successfully', 'success');
        getHospitalUsers();
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const restoreHospitalUsers = (userId: number, data: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}/${ApiRoutes.Restore}`, data)
      .then((res: any) => {
        dispatch({ type: 'RESTOREHOSPITALUSERS', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
        toast('User Restored Successfully', 'success');
        getHospitalUsers();
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getHospitalUserById = (userId: number, callback?: (_dat: any) => void) => {
    if (userId === 0) {
      toast('User does not exist.', 'error');
      return;
    }
    APIService.get(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}`)
      .then((res: any) => {
        const { user } = res;
        dispatch({ type: 'GETSINGLEUSER', payload: { user } });
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
  const updateHospitalUsers = (userId: number, data: any, params?: any, callback?: (_data: any) => void) => {
    APIService.patch(
      `${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}?${queryString.stringify(params)}`,
      data
    )
      .then((res: any) => {
        dispatch({ type: 'UPDATEUSER', payload: res });
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
  const approveHospitalUser = (userId: number, params?: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}/${ApiRoutes.Approve}`, params)
      .then((res: any) => {
        dispatch({ type: 'APPROVEUSR', payload: res });
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
  const declineHospitalUser = (userId: number, data: string, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.Users}/${userId}/${ApiRoutes.hospitalReject}`, data)
      .then((res: any) => {
        dispatch({ type: 'DECLINEUSERS', payload: res });
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

  const getOneHospitalSummary = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.summary}`, params)
      .then((res: any) => {
        const { summary } = res;
        console.log('summary from context ', summary);

        dispatch({ type: 'HOSPITALSUMMARY', payload: { summary } });
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
  const getAlfDoctorsDetails = (hospitalID: number, userId: number, params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}/${hospitalID}/${ApiRoutes.Users}/${userId}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const { user } = res;
        dispatch({ type: 'GETSINGLEUSER', payload: { user } });
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
  const addALFdoctor = (consultantId: number, data?: any, callback?: (_data: any) => void) => {
    ///alf/alfdoctor/consltantId?consultantId=105
    
    APIService.post(`/${ApiRoutes.alf}/${ApiRoutes.alfDoctor}/${consultantId}`, data)
      .then((res: any) => {
        dispatch({ type: 'ADDALFDOCTOR', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        console.log('Error Response:', error);
        let errorMessage = 'Something went wrong!'; // Default error message
        if (error?.response?.data?.message) {
          // Extract the error message from API response
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          // If there's a general error message
          errorMessage = error.message;
        }
        toast(errorMessage, 'error');
      });
  };
  //for single organ edit
  const editOrganLicense = (hospitalId: number, organID?: number, data?: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}/${hospitalId}/${ApiRoutes.OrganLicense}/${organID}`, data)
      .then((res: any) => {
        dispatch({ type: 'EDITORGANLICENSE', payload: res });
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

  return {
    state,
    actions: {
      getHospitalDetails,
      updateBasicDetails,
      updateInfraStructure,
      updateOrganLicense,
      addOrganLicense,
      getOrganLicenses,
      getAdminDetails,
      updateAdminDetails,
      postUsers,
      getHospitalUsers,
      deleteHospitalUsers,
      restoreHospitalUsers,
      getHospitalUserById,
      updateHospitalUsers,
      approveHospitalUser,
      declineHospitalUser,
      updatePaymnetStatus,
      restoreHospital,
      deleteHospital,
      updateHospitalApproval,
      getOneHospitalSummary,
      updateHospitalReject,
      getAlfDoctorsDetails,
      addALFdoctor,
      editOrganLicense,
      updateProfilePhoto
    }
  };
});
