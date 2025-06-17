import { ArrowDown } from '@/assets/icons';
import { Box, Button, CustomTable, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';

export interface NotificationProps {}
const columns = [
  { id: 'id', label: 'S.No' },
  { id: 'event', label: 'Event', align: '' },
  { id: 'notify', label: 'Notify to', align: '' },
  { id: 'category', label: 'Category', align: '' },
  { id: 'email', label: 'Email', align: '' },
  { id: 'mobile', label: 'Mobile', align: '' },
  { id: 'web', label: 'Web', align: '' },
  { id: 'action', label: 'Action', align: '' }
];
const rows = [
  {
    id: '1',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '2',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '3',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '4',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '5',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '6',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '7',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  },
  {
    id: '8',
    event: 'Event Name',
    notify: ['Admin', 'Super Admin'],
    category: 'project',
    email: 4.0,
    mobile: 4.0,
    web: 8,
    action: 0
  }
];

const Notification: React.FC<NotificationProps> = () => {
  return (
    <div>
      <Box py={5} px={5}>
        <Box className="mr-[2%]">
          <Grid container>
            <Grid item xs={12} md={4}>
              <Text className="!font-semibold !text-xl text-[#804595]">Notification Settings</Text>
            </Grid>
            <Grid item xs={12} md={8}>
              <div className="ml-[40%] flex justify-end">
                <Button variant="outlined" fullWidth sx={{ mr: '10px' }}>
                  Export &nbsp; &nbsp; <ArrowDown />
                </Button>
                &nbsp;
                <Button variant="outlined" fullWidth sx={{ mr: '10px' }}>
                  Category &nbsp; &nbsp; <ArrowDown />
                </Button>
                &nbsp;
                {/* <Button variant="contained" fullWidth>
                  <AddMoreIcon2 /> &nbsp;&nbsp; Add New
                </Button> */}
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box mt={3}>
          <CustomTable columns={columns} rows={rows} paginationPosition="bottom" />
        </Box>
      </Box>
    </div>
  );
};

export default Notification;
