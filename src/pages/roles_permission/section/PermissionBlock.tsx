import { KeyIcon } from '@/assets/icons';
import { AtomCheckbox, Box, Text } from '@/atoms';
import React from 'react';
// import { useRole } from '../RoleContex';
import { Permission } from '@/types/role';

interface PermissionBlockProps {
  Permission: Permission[];
  name: string;
  menuId: number;
  // eslint-disable-next-line no-unused-vars
  onPermissionChange: (id: number) => void;
}

const PermissionBlock: React.FC<PermissionBlockProps> = ({
  Permission = [],
  name = '',
  onPermissionChange
}) => {
  //   const {
  //     state: { accessPermissions }
  //   } = useRole();
  const sortedPermissions = Permission ? [...Permission].sort((a, b) => a.id - b.id) : [];

  return (
    <Box mt={3}>
      <Text className="!text-[16px] !font-[500] flex gap-2 items-center">
        <KeyIcon /> {`Set ${name} Permissions`}
      </Text>
      <Box mt={3} className="flex gap-y-[24px] flex-wrap w-full">
        {sortedPermissions?.map((access: Permission, index: number) => {
          return (
            <Box key={index} className="flex w-full  md:w-1/5 gap-2 items-center">
              <AtomCheckbox
                label={access.name}
                checked={access.selected}
                onChange={() => onPermissionChange(access.id)}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PermissionBlock;
