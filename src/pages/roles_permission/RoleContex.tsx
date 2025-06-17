/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIService, ContextContainer } from '@/services';
import { Role } from '@/types/common.type';
import { Accesspermission, RoleType } from '@/types/role';
import { toast } from '@/utils/toast';
import { useEffect, useReducer } from 'react';

const OrganizationTypes = [
  { value: 1, label: 'Transtan' },
  { value: 2, label: 'Hospital' }
];

const PermissionOptions = [
  { label: 'Create', value: 1 },
  { label: 'Read', value: 2 },
  { label: 'Update', value: 3 },
  { label: 'Delete', value: 4 },
  { label: 'Approve', value: 5 }
];

const ApiRoutes = {
  role: 'role'
};

interface StateType {
  organizationTypes: Role[];
  selectedRole: RoleType | null;
  accessPermissions: Accesspermission[];
}
const initialState: StateType = {
  organizationTypes: [],
  selectedRole: null,
  accessPermissions: []
};

const reducer = (state: StateType, action: { type: string; payload?: any }) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_ORGANIZATION_TYPES':
      return { ...state, organizationTypes: payload };
    case 'CREATE_ROLE':
      return { ...state };
    case 'SET_SELECTED_ROLE':
      return { ...state, selectedRole: payload };
    case 'SET_PERMISSIONS':
      return { ...state, accessPermissions: payload };
    case 'UPDATE_PERMISSIONS':
      return { ...state };
    default:
      return state;
  }
};

export const { useContext: useRole, Provider: RoleProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  const fetchOrganizationTypes = () => {
    const roleTypeList = OrganizationTypes;
    dispatch({ type: 'SET_ORGANIZATION_TYPES', payload: roleTypeList });
  };
  const fetchPermissions = () => {
    const permissions = PermissionOptions;
    dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
  };

  const createRole = (data: any, callBack?: (_data: any) => void) => {
    APIService.post(`/${ApiRoutes.role}`, data)
      .then((res: any) => {
        dispatch({ type: 'CREATE_ROLE', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log('error', error);
      });
  };
  const fetchRoleById = (roleID: number, callBack?: (_data: any) => void) => {
    APIService.get(`/${ApiRoutes.role}/${roleID}`)
      .then((res: any) => {
        dispatch({ type: 'SET_SELECTED_ROLE', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log('error', error);
      });
  };

  const updatePermissions = (data: any, callBack?: (_data: any) => void) => {
    APIService.post(`/${ApiRoutes.role}`, data)
      .then((res) => {
        dispatch({ type: 'UPDATE_PERMISSIONS', payload: res });
        if (typeof callBack === 'function') {
          callBack(res);
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast(error.message, 'error');
        }
        console.log('error ', error);
      });
  };

  useEffect(() => {
    fetchOrganizationTypes();
    fetchPermissions();
  }, []);
  return {
    state,
    actions: {
      fetchOrganizationTypes,
      createRole,
      fetchRoleById,
      updatePermissions
    }
  };
});
