type ApiMenuType = {
  menuId: number;
  menuName: string;
  menuMapName: string;
  settingsPermissions: { id: number; name: string; selected: boolean }[];
  subMenuRolePermission?: ApiMenuType[];
};

export const flattenPermissions = (
  menus: ApiMenuType[],
  accumulator: string[] = [],
): string[] => {
  menus.forEach((menu) => {
    // If any permission is true then include this menu (or you can change this logic accordingly)
    const isAllowed = menu.settingsPermissions.some((p) => p.selected);
    if (isAllowed) {
      accumulator.push(menu.menuName.toLowerCase());
    }
    // Recursively process submenus if available
    if (menu.subMenuRolePermission && menu.subMenuRolePermission.length) {
      flattenPermissions(menu.subMenuRolePermission, accumulator);
    }
  });
  return accumulator;
};
