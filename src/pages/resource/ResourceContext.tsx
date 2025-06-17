/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import { SingleTranstanUser, TranstanUser } from '@/types/resource';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { useReducer } from 'react';

const ApiRoutes = {
  base: 'settings',
  transtanUsers: 'transtanusers',
  transtanUser: 'transtanuser',
  restore: 'restore',
  hospitals: 'hospitals',
  users: 'users',
  photo: 'photo'
};

interface StateType {
  list: TranstanUser[];
  count: number;
  hospitalUsers: TranstanUser[];
  transtanUser: SingleTranstanUser | null;
}

const initialState: StateType = {
  list: [],
  count: 0,
  hospitalUsers: [],
  transtanUser: null
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
    case 'GETALL':
      return { ...state, list: payload.usersDTOs, count: payload.totalCount };
    case 'GETALLUSERS':
      return { ...state, hospitalUsers: payload.usersDTOs, count: payload.totalCount };
    case 'FETCHUSERBYID':
      return { ...state, transtanUser: payload.users };
    case 'ADDTRANSTANUSER':
      return { ...state };
    case 'EDITTRANSTANUSER':
      return { ...state };
    case 'DELETETRANSTANUSER':
      return { ...state };
    case 'RESTORETRANSTANUSER':
      return { ...state };
    case 'UPDATE_PROFILE_PHOTO':
      return { ...state };
    default:
      return state;
  }
};

export const { useContext: useResource, Provider: ResourceProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const getAll = (params?: any, callBack?: (_data: any) => void) => {
    APIService.get(`/${ApiRoutes.base}/${ApiRoutes.transtanUsers}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          users: { usersDTOs, totalCount }
        } = res;
        dispatch({ type: 'GETALL', payload: { usersDTOs, totalCount } });
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
  const fetchUcerById = (id: string, callBack?: (_data: any) => void) => {
    APIService.get(`/${ApiRoutes.base}/${ApiRoutes.transtanUsers}/${id}`)
      .then((res: any) => {
        const { users } = res || {};
        dispatch({ type: 'FETCHUSERBYID', payload: { users } });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const getAllHospitalUsers = (params?: any, callBack?: (_data: any) => void) => {
    APIService.get(`/${ApiRoutes.hospitals}/${ApiRoutes.users}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          users: { usersDTOs, totalCount }
        } = res || {};
        dispatch({ type: 'GETALLUSERS', payload: { usersDTOs, totalCount } });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const addTranstanUser = (data: any, callBack?: (_data: any) => void) => {
    APIService.post(`/${ApiRoutes.base}/${ApiRoutes.transtanUser}`, data)
      .then((res: any) => {
        dispatch({ type: 'ADDTRANSTANUSER', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
        console.log(res);

        return res;
      })
      .catch((error) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const editTranstanUser = (id: number, data: any, callBack?: (_data: any) => void) => {
    APIService.put(`/${ApiRoutes.base}/${ApiRoutes.transtanUser}/${id}`, data)
      .then((res: any) => {
        dispatch({ type: 'EDITTRANSTANUSER', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
      });
  };

  const deleteTranstanUser = (id: number, reason: string, callBack?: (_data: any) => void) => {
    APIService.delete(`/${ApiRoutes.base}/${ApiRoutes.transtanUser}/${id}`, reason)
      .then((res: any) => {
        dispatch({ type: 'DELETETRANSTANUSER', payload: res });
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
  const restoreTranstanUser = (id: number, reason?: string, callBack?: (_data: any) => void) => {
    APIService.patch(`/${ApiRoutes.base}/${ApiRoutes.transtanUser}/${ApiRoutes.restore}/${id}`, reason)
      .then((res: any) => {
        dispatch({ type: 'RESTORETRANSTANUSER', payload: res });
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
  // for profile photo
  const updateProfilePhoto = (id: number | string, data: any, callBack?: (_data: any) => void) => {
    // const refineData = base64toFile(data, 'profile.jpg');
    APIService.patch(`/${ApiRoutes.base}/${ApiRoutes.transtanUser}/${ApiRoutes.photo}/${id}`, data)
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

  return {
    state,
    actions: {
      getAll,
      getAllHospitalUsers,
      fetchUcerById,
      addTranstanUser,
      editTranstanUser,
      deleteTranstanUser,
      restoreTranstanUser,
      updateProfilePhoto
    }
  };
});
