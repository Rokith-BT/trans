import { Box, Button, Input, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';

export interface EmailProps {}
const Email: React.FC<EmailProps> = () => {
  return (
    <div>
      <Box p={5}>
        <Text className="!text-xl !font-bold text-[#804595]">Email Settings</Text>
        <Box mt={5} px={2}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Input label="Select Service Provider" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Email sent from address" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Email sent from name" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="SMTP Host" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="SMTP User" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="SMTP password" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="SMTP Port" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Security Type" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Send a test mail to" fullWidth />
            </Grid>
          </Grid>
        </Box>
        <Box className="absolute bottom-[5%] right-10" px={2}>
          <Button variant="contained" className='w-[150px]'>
            Save
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Email;
