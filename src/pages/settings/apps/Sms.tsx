import { Box, Button, Input, TabView, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';

export interface SmsProps {}
const tabs = [
  { id: 'smsgateway', label: 'Clikatell SMS Gateway' },
  { id: 'msg91', label: 'MSG91' },
  { id: 'textlocal', label: 'Text Local' },
  { id: 'smscountry', label: 'SMS Country' },
  { id: 'bulksms', label: 'Bulk SMS' },
  { id: 'mobireach', label: 'Mobireach' }
];
const Sms: React.FC<SmsProps> = () => {
  return (
    <div>
      <Box p={5} className="relative">
        <Text className="!text-xl !font-bold text-[#804595]">SMS Settings</Text>
        <Box mt={5} mb={5}>
          <TabView tabs={tabs} defaultActiveTab="msg91" />
        </Box>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Input label="Aunthentication Key" placeholder="Enter Here" required fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Sender Id" placeholder="Enter Here" required fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Status " placeholder="Enter Here" required fullWidth />
            </Grid>
          </Grid>
        </Box>
        <Box className="absolute bottom-[-100%] right-10">
          <Button variant="contained" className="w-[150px]">
            Save
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Sms;
