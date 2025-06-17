import { Box, Button, Input, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React from 'react';
import logo1 from '@/assets/imgs/site-logo1.png';
import { UploadIcon } from '@/assets/icons';
import Background1 from '@/assets/imgs/background1.png';
import Background2 from '@/assets/imgs/background2.png';

import Background3 from '@/assets/imgs/background3.png';
import Background4 from '@/assets/imgs/background4.png';
import Background5 from '@/assets/imgs/background5.png';
import Background6 from '@/assets/imgs/background6.png';
import Background7 from '@/assets/imgs/background7.png';
import Background8 from '@/assets/imgs/background8.png';
import ThemeColor1 from '@/assets/imgs/Theme Color 1.png';
import ThemeColor2 from '@/assets/imgs/Theme Color 2.png';
import ThemeColor3 from '@/assets/imgs/Theme Color 3.png';

export interface GeneralSettinProps {}
const GeneralSetting: React.FC<GeneralSettinProps> = () => {
  const colors = ['#804595', '#FA0F0FCC', '#1FE592', '#5E64F3', '#E5E834', '#ACDA4A', '#E55DF1', '#ED8D47'];
  return (
    <div>
      <Box mt={3} px={5}>
        <Text className="!text-[23px] !font-[600] text-[#804595]">General Settings</Text>
        <Box>
          <Grid container py={3} spacing={4} className="">
            <Grid item xs={12} md={4}>
              <Input label="App Title" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Accepted File Format" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Rows per Page" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Item Purchase Code" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Enable Rich text editor in comments" fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <Input label="Show logo in sign in page" fullWidth />
            </Grid>
          </Grid>
        </Box>
        <Box className="mt-[10%]">
          <Grid container spacing={8} className="flex justify-between">
            <Grid item xs={6} sm={5}>
              <Box>
                <Text className="!text-[16px] !font-[600] text-[#804595]">Site Logo</Text>
                <Box className="mt-[2%] flex items-center gap-10 mr-10 sm:mr-0">
                  <img src={logo1} alt="" />

                  <Button variant="outlined" className="w-[169px] h-[44px] flex items-center gap-3" fullWidth>
                    <UploadIcon className="p-[2px]" /> Upload
                  </Button>
                  <Button
                    variant="outlined"
                    className="w-[169px] h-[44px] flex  items-center gap-3 text-nowrap"
                    fullWidth
                  >
                    <UploadIcon className="p-[2px]" /> Upload & Crop
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} sm={5}>
              <Box>
                <Text className="!text-[16px] !font-[600] text-[#804595]">Favicon</Text>
                <Box className="mt-[2%] flex items-center gap-10">
                  <img src={logo1} alt="" />

                  <Button variant="outlined" className="w-[169px] h-[44px] flex items-center gap-3" fullWidth>
                    <UploadIcon className="p-[2px]" /> Upload
                  </Button>
                  <Button
                    variant="outlined"
                    className="w-[169px] h-[44px] flex items-center gap-3 text-nowrap"
                    fullWidth
                  >
                    <UploadIcon className="p-[2px]" /> Upload & Crop
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box className="mt-[3%]">
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <Input label="show background image in sign page" placeholder="select here" fullWidth />
            </Grid>
          </Grid>
        </Box>
        <Box className="mt-[3%]">
          <Box className="">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <img src={Background1} alt="" className="h-[178px] pr-2 w-full" />
              </Grid>
              <Grid item container md={8} spacing={2}>
                <Grid item xs={3}>
                  <img src={Background2} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <img src={Background3} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <img src={Background4} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <img src={Background5} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <img src={Background6} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <img src={Background7} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <img src={Background8} className="w-full h-[83px]" alt="" />
                </Grid>
                <Grid item xs={3}>
                  <Button variant="outlined" className="w-full h-[83px]">
                    <span>
                      <Box pl={6}>
                        <UploadIcon />
                      </Box>
                      Upload from device
                    </span>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className="mt-[3%]">
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <Input label="show theme color changer" placeholder="select here" fullWidth />
            </Grid>
          </Grid>
        </Box>
        <Box className="mt-[3%]">
          <Grid container spacing={5}>
            <Grid item xs={4}>
              <div className="mt-3"></div>
              <Text className="text-[#804595] !text-1xl !font-bold">
                Organization Color Theme <span className="text-red-600">*</span>
              </Text>
            </Grid>
            <Grid item xs={4}>
              <div className="flex space-x-2">
                {colors.map((color, index) => (
                  <span
                    key={index}
                    className="w-10 h-10 p-4 rounded-lg border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box mt={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <img className="h-[177px] w-full" src={ThemeColor1} alt="" />
            </Grid>
            <Grid item xs={12} md={4}>
              <img className="h-[177px] w-full" src={ThemeColor2} alt="" />
            </Grid>
            <Grid item xs={12} md={4}>
              <img className="h-[177px] w-full" src={ThemeColor3} alt="" />
            </Grid>
          </Grid>
        </Box>
        <Box mb={4} mt={4} className="flex  justify-end mr-6 w-full">
          <Button className="!bg-[#9C539C] w-[150px]" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default GeneralSetting;
