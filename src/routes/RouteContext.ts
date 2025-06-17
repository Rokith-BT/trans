/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from 'react';
import { APIService, ContextContainer, LocalStorage } from '@services';
import { toast } from '@/utils/toast';
import { AadhaarOtpLogin, AuthType, User } from '@/types/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChangePasswordRequestType,
  CreateSessionRequestType,
  ForgotPasswordRequestType,
  LoginRequestType
} from '@/types/auth/auth.request.type';
import { Hospital } from '@/types/hospital';
import { Role } from '@/types/common.type';
// import { Role } from '@/types/common.type';

const ApiRoutes = {
  Base: `/auth/email`,
  GetCurrentUser: '/auth/currentuser',
  auth: '/auth',
  aadhaarOtp: '/aadhaar-otp',
  verifyaadhaarOtp: '/verify-aadhaar-otp',
  roles: `/role`
};

export type StateType = {
  hasSession: boolean;
  currentUser: User | null;
  hospital: Hospital | null;
  aadhaarOtpLogin: AadhaarOtpLogin | null;
  otpResponse: any;
  roles: Role[];
};

const initialState: StateType = {
  hasSession: false,
  currentUser: null,
  hospital: null,
  aadhaarOtpLogin: null,
  otpResponse: null,
  roles: []
};

const reducer = (
  state: StateType,
  action: {
    type: string;
    payload?: any;
  }
) => {
  const { type, payload } = action;
  switch (type) {
    case 'LOGIN':
      return { ...state, hasSession: true, currentUser: payload };
    case 'GET_TOKEN':
      return { ...state, hasSession: !!payload, currentUser: payload };
    case 'AADHAAR_LOGIN':
      return { ...state, hasSession: true, aadhaarOtpLogin: payload };
    case 'AADHAAR_VERIFY':
      return { ...state, hasSession: true, otpResponse: payload };
    case 'GETROLES':
      return { ...state, roles: payload ?? [] };
    default:
      return state;
  }
};

export const { useContext: useAuth, Provider: AuthProvider } = ContextContainer(() => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    hasSession: !!LocalStorage.read('token')
    // hasSession: true
  });
  const location = useLocation();
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('token from local storage ', token);
    if (!token && location.pathname === '/reset-password') {
      toast('hi', 'error');
      return;
    }
    if (token) {
      getToken();
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  const onforgotPassword = (data: ForgotPasswordRequestType, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.Base}/forgot-password`, data)
      .then((res: any) => {
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          if (error.status === 404) {
            toast('User not Found', 'error');
            return;
          }
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  const getToken = (callback?: (_data: any) => void) => {
    APIService.get(ApiRoutes.GetCurrentUser)
      .then((res: any) => {
        if (res.user) {
          dispatch({ type: 'GET_TOKEN', payload: res.user });
          navigate('/dashboard', { replace: true });
        } else {
          dispatch({ type: 'GET_TOKEN', payload: null });
          localStorage.removeItem('token'); // Clear token if invalid
          navigate('/login', { replace: true });
        }

        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch(() => {
        dispatch({ type: 'GET_TOKEN', payload: null });
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      });
  };

  const onLogin = (data: LoginRequestType, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.Base}/login`, data)
      .then((res: any) => {
        //Route based on the isResetpassword Key
        const auth: AuthType = res.auth as AuthType;
        if (auth.isResetPassword) {
          navigate(`/change-password?hash=${auth.hash}`, { replace: true });
        } else {
          navigate(`/mfa?hash=${auth.hash}`, { replace: true });
        }
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          if (error.status === 401) {
            toast(error.message, 'error');
            return;
          }
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };
  //for aadhaar login with mobile or email
  const onAadhaarLogin = (mobileOremail: string, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.auth}${ApiRoutes.aadhaarOtp}?emailormobile=${mobileOremail}`)
      .then((res: any) => {
        dispatch({ type: 'AADHAAR_LOGIN', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        console.log('error from login', error);
        dispatch({ type: 'GET_TOKEN', payload: null });
        localStorage.removeItem('token');
        if (typeof error === 'object' && error.status) {
          if (error.status === 401) {
            toast(error.message, 'error');
            return;
          }
          if (error.status === 404) {
            toast('Aadhaar Information is not found', 'error');
            return;
          }
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const onAadharLoginOtpVerify = (data: any, callback?: (_data: any) => void) => {
    // APIService.post(`${ApiRoutes.auth}${ApiRoutes.verifyaadhaarOtp}`, data)
    //   .then((res: any) => {
    //     const token = res.headers['authorization'] || res.headers['Authorization'] || res.headers['x-access-token'];

    //     if (token) {
    //       // 2) persist it so your initial useEffect sees hasSession=true
    //       LocalStorage.write('token', token);

    //       // 3) update React state immediately
    //       //    (switch “LOGIN” to whatever your reducer uses to mark a session)
    //       dispatch({ type: 'LOGIN', payload: res.data.user || res.user });

    //       // 4) navigate into your protected “home” or dashboard
    //       navigate('/dashboard', { replace: true });
    //     }
    //     dispatch({ type: 'AADHAAR_VERIFY', payload: res });
    //     if (typeof callback === 'function') {
    //       callback(res);
    //     }
    //   })
    APIService.post(`${ApiRoutes.auth}${ApiRoutes.verifyaadhaarOtp}`, data)
      .then((res: any) => {
        // ← Axios lower-cases all header names
        // const token = res.headers['x-access-token'] || res.headers['authorization'] || res.headers['Authorization'];

        // if (token) {
        //   // persist it
        //   LocalStorage.write('refresh-token', token);

        //   // re-use your existing login→dashboard logic
        //   getToken();
        // }
        dispatch({ type: 'AADHAAR_VERIFY', payload: res });
        getToken();
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        if (error.status === 500) {
          toast('Invalid OTP value', 'error');
          return;
        }
        console.log(error);
      });
  };

  const onChangePassword = (data: ChangePasswordRequestType, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.auth}/reset-password`, data)
      .then((res: any) => {
        // getToken()
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          if (error.status === 401) {
            toast('Password change failed', 'error');
            return;
          }
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  // const onResetPassword = (data: ChangePasswordRequestType, callback?: (_data: any) => void) => {
  //   APIService.post(`${ApiRoutes.Base}/change-password`, data)
  //     .then((res: any) => {
  //       if (typeof callback === 'function') {
  //         callback(res);
  //       }
  //     })
  //     .catch((error: any) => {
  //       if (typeof error === 'object' && error.status) {
  //         if (error.status === 401) {
  //           toast('Password change failed', 'error');
  //           return;
  //         }
  //         toast(error.message, 'error');
  //       }
  //       console.log(error);
  //     });
  // };

  const onCreateSession = (data: CreateSessionRequestType, callback?: (_data: any) => void) => {
    APIService.post(`${ApiRoutes.Base}/validate`, data)
      .then((res: any) => {
        console.log('res: ', res);
        dispatch({ type: 'LOGIN', payload: res.user });
        if (typeof callback === 'function') {
          callback(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          if (error.status === 401) {
            toast('Invalid Email password', 'error');
            return;
          }
          toast(error.message, 'error');
        }
        console.log(error);
      });
  };

  const getUserRolesPermissions = (roleId: number, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.roles}/${roleId}`)
      .then((res: any) => {
        const { roles } = res;
        console.log(roles, 'rolesroles231312313');
        dispatch({ type: 'GETROLES', payload: roles });
        if (typeof callback === 'function') {
          callback(res);
          return res;
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
      onforgotPassword,
      onLogin,
      onChangePassword,
      onCreateSession,
      getToken,
      logout: () => {
        dispatch({ type: 'LOGOUT' });
      },
      onAadhaarLogin,
      onAadharLoginOtpVerify,
      getUserRolesPermissions
    }
  };
});
