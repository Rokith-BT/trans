/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from 'react';
import { APIService, ContextContainer } from '@services';
import { SidebarItemType } from '@/types/SidebarType';
import SidebarData from '../data/sidebar.json';
import { useAuth } from '@/routes';
import { toast } from '@/utils/toast';
import { flattenPermissions } from '@/utils';
import { filterSidebarByCustomConditions } from '@/utils/filterSideBar';

export type StateType = {
  showSidebar: boolean;
  sidebarItems: SidebarItemType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nestedMenus: any[];
  userPermissons: string[] | null;
};

const initialState: StateType = {
  showSidebar: true,
  nestedMenus: [],
  sidebarItems: [],
  userPermissons: null
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
  const nestedMenus = state.nestedMenus;
  switch (type) {
    case 'SPLICE_SIDEBAR_NESTED':
      nestedMenus.pop();
      return { ...state, nestedMenus: [...nestedMenus] };
    case 'UPDATE_SIDEBAR':
      return { ...state, ...returnSidebarItems(state, payload.item) };
    case 'SET_SIDEBAR_ITEMS':
      // Directly set the sidebar items with the filtered list.
      return {
        ...state,
        sidebarItems: action.payload.items,
        nestedMenus: [{ currentItem: null, items: action.payload.items }]
      };

    case 'TOGGLE':
      return { ...state, showSidebar: !state.showSidebar };
    case 'SET_PERMISSIONS':
      return { ...state, userPermissions: payload.permissions };
    case 'CHANGE_PASSWORD':
      return { ...state };
    default:
      return state;
  }
};

const returnSidebarItems = (existingState: StateType, sidebarItem?: SidebarItemType) => {
  if (sidebarItem) {
    let state = {};
    if (sidebarItem.children.length) {
      state = {
        nestedMenus: [...existingState.nestedMenus, { currentItem: sidebarItem, items: sidebarItem.children }],
        sidebarItems: sidebarItem.children,
        showSidebar: existingState.showSidebar ? true : !existingState.showSidebar
      };
    } else {
      state = {};
    }
    return { currentItem: sidebarItem, ...state };
  }
  return { nestedMenus: [{ currentItem: null, items: SidebarData }], sidebarItems: SidebarData };
};

export const { useContext: useProtectedHeader, Provider: ProtectedHeaderProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...returnSidebarItems(initialState)
  });

  const {
    state: { currentUser }
  } = useAuth();
  console.log('currentUserfromlayout', currentUser);
  const CurrentUserId = currentUser.id ?? 0;
  // const getCurrentUserPermissions = () => {
  //   APIService.get(`/role/user/${CurrentUserId}`)
  //     .then((res: any) => {
  //       // Simplify or flatten the API response.
  //       const flattenedPermissions = flattenPermissions(res.rolePermissions || []);
  //       console.log('flattenedPermissions', flattenedPermissions);

  //       dispatch({ type: 'SET_PERMISSIONS', payload: { permissions: flattenedPermissions } });

  //       // Create a Set for easier lookups
  //       const allowedSet = new Set(flattenedPermissions.map((p) => p.toLowerCase()));
  //       console.log('allowedSet', allowedSet);

  //       // Apply the custom filter without altering the original SidebarData.
  //       const filteredSidebarItems = filterSidebarByCustomConditions(SidebarData, allowedSet);
  //       console.log('filteredSidebarItems', filteredSidebarItems);

  //       // And then update the sidebar state if necessary.
  //       dispatch({ type: 'UPDATE_SIDEBAR', payload: { item: { children: filteredSidebarItems } } });
  //     })
  //     .catch((error: any) => {
  //       if (typeof error === 'object' && error.status) {
  //         if (error.status === 401) {
  //           toast(error.message, 'error');
  //           return;
  //         }
  //         toast(error.message, 'error');
  //       }
  //       console.log(error);
  //     });
  // };
  const getCurrentUserPermissions = () => {
    APIService.get(`/role/user/${CurrentUserId}`)
      .then((res: any) => {
        const flattenedPermissions = flattenPermissions(res.rolePermissions || []);
        dispatch({ type: 'SET_PERMISSIONS', payload: { permissions: flattenedPermissions } });

        // Create a Set for easier lookups
        const allowedSet = new Set(flattenedPermissions.map((p) => p.toLowerCase()));
        console.log('allowedSet', allowedSet);

        // Apply your custom filter using your custom conditions.
        const filteredSidebarItems = filterSidebarByCustomConditions(SidebarData, allowedSet);
        console.log('filteredSidebarItems', filteredSidebarItems);

        // Dispatch the filtered list directly.
        dispatch({ type: 'SET_SIDEBAR_ITEMS', payload: { items: filteredSidebarItems } });
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

  const onChangePasswordLoggedIn = (data: any, callback?: (_data: any) => void) => {
    APIService.post(`/auth/change-password`, data)
      .then((res: any) => {
        dispatch({ type: 'CHANGE_PASSWORD', payload: res });
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
        console.log('error', error);
      });
  };

  useEffect(() => {
    if (CurrentUserId) {
      getCurrentUserPermissions();
    }
  }, []);

  return {
    state,
    actions: {
      goBackOnSidebar: () => {
        dispatch({ type: 'SPLICE_SIDEBAR_NESTED' });
      },
      updateCurrentItem: (index: number, item: SidebarItemType) => {
        dispatch({ type: 'UPDATE_SIDEBAR', payload: { index, item } });
      },
      sidebarToggle: () => {
        dispatch({ type: 'TOGGLE' });
      },
      onChangePasswordLoggedIn
    }
  };
});
