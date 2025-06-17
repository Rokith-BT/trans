/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import { Users } from '@/types/common.type';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { useEffect, useReducer } from 'react';

const ApiRoutes = {
  Base: '/hospitals',
  Users: '/contacts'
};
interface StateType {
  users: Users[];
  hospitalId: number | null;
}
const initialState: StateType = {
  users: [],
  hospitalId: null
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
    case 'GETUSERS':
      return { ...state, users: action.payload.contacts ?? [] };
    default:
      return state;
  }
};
//for contacts
export const { useContext: useHospitalUsers, Provider: HospitalUsersProvider } = ContextContainer(
  ({ hospitalId }: StateType) => {
    const [state, dispatch] = useReducer(reducer, {
      ...initialState
    });
    useEffect(() => {
      getAllUsers(hospitalId);
    }, [hospitalId]);
    const getAllUsers = (params: any, callback?: (_data: any) => void) => {
      APIService.get(`${ApiRoutes.Base}/${hospitalId}${ApiRoutes.Users}?${queryString.stringify(params)}`)
        .then((res: any) => {
          const { contacts } = res;
          console.log('contacts list ', contacts);

          dispatch({ type: 'GETUSERS', payload: { contacts } });
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
        getAllUsers
      }
    };
  }
);
