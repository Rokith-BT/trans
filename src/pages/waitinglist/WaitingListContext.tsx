/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import {
  CommonWaitingList,
  InhouseWaitingList,
  TranstanWaitingList,
  TranstanWaitingSummary
} from '@/types/waitinglist';
import { toast } from '@/utils/toast';
import queryString from 'query-string';
import { useReducer } from 'react';

const ApiRoutes = {
  Base: '/recipients/waitinglist',
  transtan: '/transtan',
  common: '/common',
  inHouse: '/inhouse',
  summary: '/summary',
  proposedrank: '/proposedrank',
  updateinhouserank: '/updateinhouserank'
};
interface StateType {
  list: CommonWaitingList[];
  inHouseList: InhouseWaitingList[];
  transtan: TranstanWaitingList[];
  commonList: CommonWaitingList[];
  summary: TranstanWaitingSummary[];
  count: number;
  loading: boolean;
}

const initialState: StateType = {
  list: [],
  inHouseList: [],
  transtan: [],
  commonList: [],
  summary: [],
  count: 0,
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
      return { ...state, list: payload.list, count: payload.totalCount };
    case 'GETINHOUSELIST':
      return { ...state, inHouseList: payload.recipients, count: payload.totalCount, loading: false };
    case 'GETTRANSTAN':
      return { ...state, transtan: payload.recipients, count: payload.totalCount, loading: false };
    case 'GETCOMMONLIST':
      return { ...state, commonList: payload.recipients, count: payload.totalCount, loading: false };
    case 'GETTRANSTANWAITINGSUMMARY':
      return { ...state, summary: payload, count: payload.totalCount };
    case 'CHANGERANK':
      return { ...state };
    case 'UPDATEHOSPITALRANK':
      return { ...state };
    default:
      return state;
  }
};

export const { useContext: useWaitingList, Provider: WaitingListProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState
  });

  const getTranstanWaitingList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.transtan}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipients: { recipients, totalCount }
        } = res || {};
        dispatch({ type: 'GETTRANSTAN', payload: { recipients, totalCount } });
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
  const getCommonWaitingList = (params: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.common}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipients: { recipients, totalCount }
        } = res || {};
        console.log('common waiting list ', res);
        dispatch({ type: 'GETCOMMONLIST', payload: { recipients, totalCount } });
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
  const getInHouseList = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.inHouse}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          recipients: { recipients, totalCount }
        } = res || {};
        dispatch({ type: 'GETINHOUSELIST', payload: { recipients, totalCount } });
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
  const getSummary = (params?: any, callback?: (_data: any) => void) => {
    APIService.get(`${ApiRoutes.Base}${ApiRoutes.transtan}${ApiRoutes.summary}?${queryString.stringify(params)}`)
      .then((res: any) => {
        const {
          summary: { organSummaries, bloodGrouopSummaries, totalCount, totalActiveCount, totalInactiveCount }
        } = res || {};
        dispatch({
          type: 'GETTRANSTANWAITINGSUMMARY',
          payload: { organSummaries, bloodGrouopSummaries, totalCount, totalActiveCount, totalInactiveCount }
        });
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
  const changeProposedReank = (data: any, recipientId: number, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}${ApiRoutes.inHouse}/${recipientId}${ApiRoutes.proposedrank}`, data)
      .then((res: any) => {
        dispatch({ type: 'CHANGERANK', payload: res });
        if (typeof callback === 'function') {
          callback(res);
        }
        getInHouseList();
        toast('Rank changed successfully', 'success');
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error?.message, 'error');
        }
      });
  };
  const updateInhouseRank = (hospitalId: number, data?: any, callback?: (_data: any) => void) => {
    APIService.patch(`${ApiRoutes.Base}${ApiRoutes.inHouse}/${hospitalId}${ApiRoutes.updateinhouserank}`, data)
      .then((res: any) => {
        dispatch({ type: 'UPDATEHOSPITALRANK', payload: res });
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

  return {
    state,
    actions: {
      getTranstanWaitingList,
      getCommonWaitingList,
      getInHouseList,
      getSummary,
      changeProposedReank,
      updateInhouseRank
    }
  };
});
