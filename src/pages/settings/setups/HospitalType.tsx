import { AddMoreIcon2, ArrowDown } from '@/assets/icons';
import { Box, Button, CustomTable, Text } from '@/atoms';
import React from 'react';

export interface OrganProps {}
const columns = [
  { id: 'id', label: 'S.No' },
  { id: 'hospitaltype', label: 'Hospital Type' },

  { id: 'status', label: 'Status' },
  { id: 'action2', label: 'Action' }
];
const rows = [
  {
    id: '1',
    hospitaltype: 'government',

    status: 'Inactive',
    action2: 8
  },
  {
    id: '2',
    hospitaltype: 'private',

    status: 'Active',
    action2: 8
  },
  {
    id: '3',
    hospitaltype: "NTORC's",

    status: 'Active',
    action2: 8
  }
];

const HospitalType: React.FC<OrganProps> = () => {
  return (
    <Box p={5}>
      <Box className="flex justify-between items-center">
        <Text className="!text-[19px] !font-bold text-[#804595]">Hospital Type</Text>
        <Box className="flex gap-4">
          <Button variant="outlined">
            <span className="flex items-center justify-center gap-x-3 w-[130px]">
              Export <ArrowDown />
            </span>
          </Button>

          <Button variant="contained" className="w-[130px] !bg-[#D876A9]">
            <span className="flex items-center justify-center gap-x-5">
              <AddMoreIcon2 /> Add New
            </span>
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <CustomTable columns={columns} rows={rows} />
      </Box>
    </Box>
  );
};

export default HospitalType;
