import { DashBoardIcon, DonorIcon, HospitalIcon, ReportIcon } from '@/assets/icons';
import { Box, SWitch, Text } from '@/atoms';
import { Button, Grid } from '@mui/material';
import React from 'react';

export interface ModulesProps {}

const Modules: React.FC<ModulesProps> = () => {
  return (
    <div>
      <Box my={5} px={5}>
        <Text className="!text-xl text-[#804595] !font-bold">Manage Modules</Text>
        <br />
        <span className="text-[#7A6F78] font-[500] text-sm">Select the module you want to use</span>
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <DashBoardIcon />
                  &nbsp; Dashboard
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold ">
                  <DonorIcon />
                  &nbsp; Donor <br />
                  &nbsp; Management
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon /> &nbsp; Approval <br />
                  &nbsp; Management
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <HospitalIcon /> &nbsp; Hospital <br />
                  &nbsp; Management
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Recipient <br />
                  &nbsp; Management
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Waiting List <br />
                  &nbsp; Manager
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Acute Liver Failure <br />
                  &nbsp; Manager
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Donor Pledge <br />
                  &nbsp; Management
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Resource <br />
                  &nbsp; Management
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Resource <br />
                  &nbsp; Tickets
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Resource <br />
                  &nbsp; Reports
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className="h-[93px] w-[100%] border-[#CBB3D4] border-2 rounded-lg flex items-center justify-between p-6">
                <span className="flex items-center text-[19px] font-semibold">
                  <ReportIcon />
                  &nbsp; Resource <br />
                  &nbsp; Expenses
                </span>
                <span>
                  <SWitch />
                </span>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box mt={3} className="flex justify-end w-full">
          <Button className="!bg-[#9C539C] w-[150px]" variant='contained'>Save</Button>
        </Box>
      </Box>
    </div>
  );
};

export default Modules;
