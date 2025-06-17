import { AddMoreIcon } from '@/assets/icons';
import { Box, Button, Input, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';

export interface LocalizationProps {}
const Localization: React.FC<LocalizationProps> = () => {
  return (
    <div className='px-[40px] my-[38px]'>
      <div className="!text-[23px] text-[#804595] !font-bold">Localization</div>
      <Box mt={6}>
        <Text className="!font-bold !text-[19px] text-[#804595]">Language</Text>
        <div className="mt-2">
          <Grid container>
            <Grid item xs={12} md={4}>
              <Input label="Language" placeholder="Tamil" fullWidth required />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box mt={6}>
        <Text className="!font-bold !text-[19px] text-[#804595]">Date & Time</Text>
        <div className="mt-2">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Input label="Date Format" placeholder="mm/dd/yyyy" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Time Zone" placeholder="(GMT) UTC" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Time Format" placeholder="24 Hours" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="First Day of Week" placeholder="Monday" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Weekends" placeholder="Sunday & Saturday" fullWidth />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box mt={6}>
        <Text className="!font-bold !text-[19px] text-[#804595]">Currency</Text>
        <div className="mt-2">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Input label="Currency" placeholder="Rupee " fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Currency Symbol" placeholder="₹" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Currency Position" placeholder="Left" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Decimal Seperator" placeholder="Select Here" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="No.of. Decimals" placeholder="Select Here" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="RTL" placeholder="Select Here" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Conversion Rate" placeholder="AED" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Conversion Rate" placeholder="Enter Here" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="flex items-center mt-3 text-sm font-bold text-[#C967A2] cursor-pointer">
                <AddMoreIcon /> &nbsp; Add More
              </div>
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box mt={6}>
        <Text className="!font-bold !text-[19px] text-[#804595]">Mobile Application</Text>
        <div className="mt-2">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Input label="Mobile App URL" placeholder="https://mobile.application" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Mobile App Primary Color Code " placeholder="804595" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Mobile App Secondary Color Code" placeholder="804595" fullWidth required />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box mt={6}>
        <Text className="!font-bold !text-[19px] text-[#804595]">Miscellaneous</Text>
        <div className="mt-2">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Input label="Doctor Restriction Mode" placeholder="Enable ‿ " fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Super Admin Visibility " placeholder="Disable ‿" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Patient Panel" placeholder="Enable ‿" fullWidth required />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box mt={6}>
        <Text className="!font-bold !text-[19px] text-[#804595]">Layout Setting</Text>
        <div className="mt-2">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Input label="Layout Type" placeholder="Horizontal ‿ " fullWidth required />
            </Grid>
          </Grid>
        </div>
      </Box>
      <Box className="flex items-center justify-end mr-[5%] mt-3">
        <Button variant="contained" className="bg-[#9C539C]" sx={{ px: '4%' }}>
          Save
        </Button>
      </Box>
    </div>
  );
};

export default Localization;
