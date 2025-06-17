export interface Permission {
  id: number;
  name: string;
  selected: boolean;
}

export interface SubMenuRolePermission {
  roleId: number;
  menuId: number;
  menuName: string;
  menuMapName: string;
  settingsPermissions: Permission[];
  subMenuRolePermission: SubMenuRolePermission[];
}

export interface RolePermission {
  roleId: number;
  menuId: number;
  menuName: string;
  menuMapName: string;
  settingsPermissions: Permission[];
  subMenuRolePermission: SubMenuRolePermission[];
}

// Main case admin type
export interface RoleType {
  id: number;
  name: string;
  roleType: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  rolePermissions: RolePermission[];
}

export interface Accesspermission {
  label: string;
  value: number;
}

