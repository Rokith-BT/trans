import React from 'react';
import { Route, Routes } from 'react-router';
import Roles from './Roles';
import { Box } from '@/atoms';
import { RoleProvider } from './RoleContex';
import { MasterDataProvider } from '../settings/setups/masterCotext';

const RolesLayout = () => {
  return (
    <Box px={5} className="w-full h-full">
      <MasterDataProvider>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<Roles />} />
          </Routes>
        </RoleProvider>
      </MasterDataProvider>
    </Box>
  );
};

export default RolesLayout;
