/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/routes';
import { useEffect, useState } from 'react';
// import { useAuth } from './path-to-auth-context'; // adjust this import

const ACTION_MAP: Record<string, string> = {
  1: 'canCreate',
  2: 'canRead',
  3: 'canUpdate',
  4: 'canDelete',
  5: 'canApprove'
};

type PermissionBooleans = {
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canApprove: boolean;
};

export const usePermissions = (menuId: number, roleID: number): PermissionBooleans => {
  const {
    actions: { getUserRolesPermissions }
  } = useAuth();
  // const { roleID } = useRole();
  console.log(roleID, 'roleIDqdeqdwwefrewfew');
  const [permissions, setPermissions] = useState<PermissionBooleans>({
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
    canApprove: false
  });
  function fullyFlattenPermissions(
    permissionsArray: { [x: string]: any; subMenuRolePermission?: never[] | undefined }[]
  ) {
    return permissionsArray.flatMap(({ subMenuRolePermission = [], ...rest }) => {
      const mainItem = { ...rest };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const subItems = subMenuRolePermission.map(({ subMenuRolePermission: _, ...subRest }) => subRest);
      return [mainItem, ...subItems];
    });
  }

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await new Promise<any>((resolve) => {
          getUserRolesPermissions(roleID, resolve);
        });
        const completelyFlattened = fullyFlattenPermissions(res?.rolePermissions);
        const menuPermissions = completelyFlattened?.find((perm: any) => perm.menuId === menuId)?.settingsPermissions;
        if (Array.isArray(menuPermissions)) {
          const newPermissions = { ...permissions };
          for (const perm of menuPermissions) {
            const key = ACTION_MAP[perm.id];
            if (key && perm.selected) {
              newPermissions[key as keyof PermissionBooleans] = true;
            }
          }
          setPermissions(newPermissions);
        }
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, [roleID, menuId]);

  return permissions;
};
