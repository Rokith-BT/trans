import { Box, Button, Input, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';

export interface PrefixProps {}
const Prefix: React.FC<PrefixProps> = () => {
  return (
    <Box p={5}>
      <Text className="!text-[19px] !font-[500] text-[#804595]">Prefix Settings</Text>
      <Box mt={5}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Input label="Transtant Staff ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Recipient ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Donor ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Doctor ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Hospital ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Hospital Staff ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Organ Licence ID" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Hospital Licence ID" fullWidth />
          </Grid>
        </Grid>
      </Box>
      <Box className="absolute bottom-[10%] right-5" px={2}>
        <Button variant="contained" className='w-[150px]'>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Prefix;
