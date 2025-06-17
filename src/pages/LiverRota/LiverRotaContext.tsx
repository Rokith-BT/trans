/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContextContainer } from '@/services';
import { returnLiverRotaFakeData } from '@/utils/liverRotaList';
import { useReducer } from 'react';

interface StateType {
  listRota: any;
}
const initialState: StateType = {
  listRota: []
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
    case 'GETALL':
      console.log(payload, 'payloadpayloadpayload');

      return { ...state, listRota: payload.liverRota, count: payload.totalCount };
    default:
      return { ...state };
  }
};

export const { useContext: useLiverRota, Provider: LiverRotaProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });
  const getAll = (callback?: (_data: any) => void) => {
    //     APIService.get(`${ApiRoutes.base}`)
    //       .then((res: any) => {
    //         const {
    //           donors: { donors, totalCount }
    //         } = res;
    //         dispatch({ type: 'GETALL', payload: { donors, totalCount } });
    //         if (typeof callback === 'function') {
    //           callback(res);
    //         }
    //       })
    //       .catch((error: any) => {
    //         if (typeof error === 'object' && error.Status) {
    //           toast(error.message, 'error');
    //         }
    //       });
    //   };
    // Instead of calling API, use fake data
    const fakeData = returnLiverRotaFakeData();

    const {
      liverRota: { liverRota, totalCount }
    } = fakeData;

    dispatch({ type: 'GETALL', payload: { liverRota, totalCount } });

    if (typeof callback === 'function') {
      callback(fakeData);
    }
  };

  return {
    state,
    action: {
      getAll
    }
  };
});
