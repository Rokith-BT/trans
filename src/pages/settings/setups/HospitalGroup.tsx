import { AddMoreIcon2 } from '@/assets/icons';
import { Box, Button, CustomTable, Text } from '@/atoms';
import React from 'react';

export interface OrganProps {}
const columns = [
  { id: 'id', label: 'S.No' },
  { id: 'title', label: 'Title' },
  { id: 'action2', label: 'Action' }
];
const rows = [
  {
    id: '1',
    title: 'name',
    action2: 8
  },
  {
    id: '2',
    title: 'name3',
    action2: 8
  },
  {
    id: '3',
    title: 'name5',
    action2: 8
  }
];

const HospitalGroup: React.FC<OrganProps> = () => {
  return (
    <Box p={5}>
      <Box className="flex justify-between items-center">
        <Text className="!text-[19px] !font-bold text-[#804595]">Hospital Groups</Text>
        <Box className="flex gap-4">
          <Button variant="contained" className="w-[130px] !bg-[#D876A9]">
            <span className="flex items-center justify-center gap-x-3">
              <AddMoreIcon2 /> Add New
            </span>
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <CustomTable columns={columns} rows={rows} paginationPosition="bottom" extras={[]} />
      </Box>
    </Box>
  );
};

export default HospitalGroup;
