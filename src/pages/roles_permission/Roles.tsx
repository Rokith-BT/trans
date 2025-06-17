import { AddMoreIcon2, ArrowDown2 } from '@/assets/icons';
import { Box, Button, Text } from '@/atoms';
import React, { useState } from 'react';
import RolesTable from './section/RolesTable';
import AddRoleDialog from './section/AddRoleDialog';
// import { useRole } from './RoleContex';
import { useMasterData } from '../settings/setups/masterCotext';

const Roles = () => {
  const [openAddRoleDialog, setOpenAddDialog] = useState(false);
  const {
    state: { roles }
  } = useMasterData();
  // const {
  //   state: { roleType }
  // } = useRole();

  return (
    <Box mt={5}>
      <Box className="flex items-center justify-between">
        <Text className="!text-[19px] !font-[700] text-[#804595]">Roles</Text>
        <Box className="flex items-center gap-4">
          <Button className="flex gap-2 items-center" variant="outlined">
            Export <ArrowDown2 />
          </Button>
          <Button className="flex gap-2 items-center" variant="contained" onClick={() => setOpenAddDialog(true)}>
            <AddMoreIcon2 /> Add New
          </Button>
        </Box>
      </Box>
      <Box mt={3}>
        <RolesTable list={roles} />
      </Box>
      <AddRoleDialog open={openAddRoleDialog} onClose={() => setOpenAddDialog(false)} />
    </Box>
  );
};

export default Roles;
