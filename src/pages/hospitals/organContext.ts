/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer } from 'react';
import { APIService, ContextContainer } from '@services';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { OrganLicense } from '@/types/organLicense';
// import { AuthType } from '@/types/auth/auth.response.type';
// import { useNavigate } from 'react-router';

const ApiRoutes = {
  Base: `/organlicences`
};

type StateType = {
  list: OrganLicense[];
  count: number;
};

const initialState: StateType = {
  list: [],
  count: 0
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
      return { ...state, list: action.payload.organLicences ?? [], count: action.payload.count ?? 0 };
    default:
      return state;
  }
};

export const { useContext: useOGLicense, Provider: OGLicensesProvider } = ContextContainer(() => {
  // const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const getAll = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}?${queryString.stringify(params)}`)
      .then((res: any) => {
        console.log('response from context', res);
        const {
          organLicences: { hospitalsOrgansLicences: organLicences, totalCount }
        } = res;
        console.log(totalCount);

        dispatch({ type: 'GETALL', payload: { organLicences, count: totalCount } });
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
      getAll
    }
  };
});
