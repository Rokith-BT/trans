export interface RolePayload {
  id: number;
  name: string;
  roleType: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  rolePermissions: {
    roleId: number;
    menuId: number;
    settingsPermissions: {
      id: number;
      selected: boolean;
    }[];
    subMenuRolePermission?: RolePayload['rolePermissions'][];
  }[];
}
