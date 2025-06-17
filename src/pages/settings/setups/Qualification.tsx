import { AddMoreIcon2, ArrowDown } from '@/assets/icons';
import { Box, Button, CustomTable, Text } from '@/atoms';
import React from 'react';

export interface OrganProps {}
const columns = [
  { id: 'id', label: 'S.No' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'status', label: 'Status' },
  { id: 'action2', label: 'Action' }
];
const rows = [
  {
    id: '1',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '2',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '3',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '4',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '5',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '6',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '7',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  },
  {
    id: '8',
    qualification: 'Event Name',

    status: 4.0,
    action2: 8
  }
];

const Qualification: React.FC<OrganProps> = () => {
  return (
    <Box p={5}>
      <Box className="flex justify-between items-center">
        <Text className="!text-[19px] !font-bold text-[#804595]">Qualification</Text>
        <Box className="flex gap-4">
          <Button variant="outlined">
            <span className="flex items-center justify-center gap-x-3 w-[130px]">
              Export <ArrowDown />
            </span>
          </Button>

          <Button variant="contained" className="!bg-[#D876A9] w-[130px]">
            <span className="flex items-center justify-center gap-x-3">
              <AddMoreIcon2 /> Add New
            </span>
          </Button>
        </Box>
      </Box>
      <Box mt={2}>
        <CustomTable columns={columns} rows={rows} paginationPosition="bottom" />
      </Box>
    </Box>
  );
};

export default Qualification;
