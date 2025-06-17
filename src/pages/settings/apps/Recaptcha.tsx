import { WarningIcon } from '@/assets/icons';
import { Box, Button, Input, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';

export interface RecaptchaProps {}

const Recaptcha: React.FC<RecaptchaProps> = () => {
  return (
    <Box p={5} className="">
      <Text className="!text-[19px] !font-[500] text-[#804595]">reCAPTCHA</Text>
      <Box mt={3}>
        <Text className="!text-[19px] !font-[500] text-[#7A6F78]">
          Get your key from here:
          <span className="text-[19px] font-bold text-[#C967A2]"> Google reCAPTCHA</span>
        </Text>
      </Box>
      <Box mt={3} mb={3}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Input label="Site Key" fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Secret Key" fullWidth />
          </Grid>
        </Grid>
      </Box>
      <Text className="bg-[#FAB684] p-1 rounded-lg !text-[13px] !font-[400] flex w-[50%] py-1">
        <WarningIcon /> &nbsp; Before you logout, please open a new browser and make sure the reCAPTCHA is working
      </Text>
      <Button className="!absolute !top-[85%] right-10 w-[150px]" variant="contained">
        Save
      </Button>
    </Box>
  );
};

export default Recaptcha;
