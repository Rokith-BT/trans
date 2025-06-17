import { Box, CustomTable, Text } from '@/atoms';
import React from 'react';
export interface LoginTypeProps {}

const columns = [
  { id: 'id', label: 'S.No.' },
  { id: 'logintype', label: 'Login Type' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' }
];
const rows = [
  { id: '1', logintype: 'Aadhar OTP Login', status: 'Active', action: 'yes' },
  { id: '2', logintype: 'Email & Password', status: 'Active', action: 'yes' },
  { id: '3', logintype: 'Aadhar Fingerprint', status: 'Active', action: 'yes' }
];
const LoginType: React.FC<LoginTypeProps> = () => {
  return (
    <Box p={5}>
      <Text className="!text-[19px] !font-[700] text-[#804595]">Login Type Settings</Text>
      <Box mt={3}>
        <CustomTable columns={columns} rows={rows} paginationPosition="bottom" />
      </Box>
    </Box>
  );
};

export default LoginType;
