import { LockIcon } from '@/assets/icons';
import { Box, Button, CustomDialog, Text } from '@/atoms';
import { Roles } from '@/types/common.type';
import React, { useEffect, useState } from 'react';
import { useRole } from '../RoleContex';
import PermissionBlock from './PermissionBlock';
import { Permission, RolePermission, SubMenuRolePermission } from '@/types/role';
import { toast } from '@/utils/toast';

interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roleData?: Roles;
}

const PermissionDialog: React.FC<PermissionDialogProps> = ({ open, onClose, roleData }) => {
  console.log('roleDAta', roleData?.id);
  const {
    state: { selectedRole },
    actions: { fetchRoleById, updatePermissions }
  } = useRole();

  useEffect(() => {
    const roleId = roleData?.id ?? 0;
    fetchRoleById(roleId);
  }, [roleData]);

  const [localPermissions, setLocalPermissions] = useState<RolePermission[] | undefined>(selectedRole?.rolePermissions);

  useEffect(() => {
    if (selectedRole?.rolePermissions) {
      setLocalPermissions(selectedRole.rolePermissions);
    }
  }, [selectedRole, roleData]);

  console.log('abc', selectedRole);

  // Handle Checkbox Click to Update Permissions
  const handlePermissionChange = (menuId: number, permId: number, isSubMenu: boolean, subMenuId?: number) => {
    const updatedPermissions = localPermissions?.map((rolePermission: RolePermission) => {
      // Clone the rolePermission to avoid mutation
      // eslint-disable-next-line prefer-const
      let updatedRolePermission = { ...rolePermission };
      // Update main menu permissions
      if (rolePermission.menuId === menuId && !isSubMenu) {
        updatedRolePermission.settingsPermissions = tooglePermissions(rolePermission.settingsPermissions, permId);
      }

      // Update sub-menu permissions
      if (isSubMenu) {
        updatedRolePermission.subMenuRolePermission = rolePermission.subMenuRolePermission.map(
          (subMenu: SubMenuRolePermission) => {
            // Clone the subMenu to avoid mutation
            // eslint-disable-next-line prefer-const
            let updatedSubMenu = { ...subMenu };
            if (subMenu.menuId === subMenuId) {
              updatedSubMenu.settingsPermissions = tooglePermissions(subMenu.settingsPermissions, permId);
            }
            return updatedSubMenu;
          }
        );
      }
      return updatedRolePermission;
    });

    // Update State or Call API to Save Changes
    setLocalPermissions(updatedPermissions);
  };
  //toggle update the selection
  const tooglePermissions = (permission: Permission[], permId: number) => {
    console.log('permission', permission, permId);

    return permission.map((perm) => (perm.id === permId ? { ...perm, selected: !perm.selected } : perm));
  };
  // const tooglePermissions = (permission: Permission[], permId: number) => {
  //   return permission.map((perm) => (perm.id === permId ? { ...perm, selected: !perm.selected } : perm));
  // };

  //generate payload
  const generatePayload = () => {
    return {
      id: selectedRole?.id,
      name: selectedRole?.name,
      roleType: selectedRole?.roleType,
      isActive: selectedRole?.isActive,
      createdAt: selectedRole?.createdAt,
      createdBy: selectedRole?.createdBy,
      rolePermissions: localPermissions?.flatMap((rolePermission: RolePermission) => {
        // Map Parent Permissions
        const parentPermissions = mapPermissions(rolePermission.settingsPermissions);
        // Map SubMenu Permissions
        const subMenuPermissions = rolePermission.subMenuRolePermission?.flatMap((subMenu: SubMenuRolePermission) =>
          mapSubMenuPermissions(subMenu, rolePermission.roleId)
        );

        // Combine Parent & SubMenu Permissions
        const allPermissions = [
          ...(parentPermissions.length > 0
            ? [
                {
                  roleId: rolePermission.roleId,
                  menuId: rolePermission.menuId,
                  settingsPermissions: parentPermissions
                }
              ]
            : []),
          ...(subMenuPermissions || [])
        ];

        return allPermissions;
      })
    };
  };
  const mapPermissions = (permission: Permission[]) => {
    return permission
      .filter((perm) => perm.selected)
      .map((perm) => ({
        id: perm.id,
        selected: perm.selected
      }));
  };
  const mapSubMenuPermissions = (subMenu: SubMenuRolePermission, roleId: number) => {
    const selectedPermissions = mapPermissions(subMenu.settingsPermissions);
    return selectedPermissions.length > 0
      ? [{ roleId: roleId, menuId: subMenu.menuId, settingsPermissions: selectedPermissions }]
      : [];
  };

  const handleSave = async () => {
    const payload = generatePayload();
    console.log('payload', payload);
    await updatePermissions(payload, () => {
      toast('Permission Updated Successfully', 'success');
    });
    onClose();
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md">
      <Box>
        <Text className="!text-[23px] !font-[600] flex gap-2 items-center">
          <LockIcon className="pb-1" /> Permission: {roleData?.name}
        </Text>

        {/*Map Main Role Permissions */}
        {localPermissions?.map((rolePermission: RolePermission, index: number) => {
          return (
            <Box key={index}>
              <PermissionBlock
                name={rolePermission.menuName}
                Permission={rolePermission.settingsPermissions}
                menuId={rolePermission.menuId}
                onPermissionChange={(permId) => handlePermissionChange(rolePermission.menuId, permId, false)}
              />

              {/*Map Submenu Role Permissions */}
              {rolePermission?.subMenuRolePermission?.map((subPermission: SubMenuRolePermission, subIndex: number) => (
                <Box key={subIndex}>
                  <PermissionBlock
                    name={subPermission.menuName}
                    Permission={subPermission.settingsPermissions}
                    menuId={subPermission.menuId}
                    onPermissionChange={(permId) =>
                      handlePermissionChange(rolePermission.menuId, permId, true, subPermission.menuId)
                    }
                  />
                </Box>
              ))}
            </Box>
          );
        })}
        <Box mt={5} className="flex items-center justify-end gap-4">
          <Button className="!px-4" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button className="!px-6" variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default PermissionDialog;
