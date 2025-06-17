import { Box, Button, Text } from '@/atoms';
import { useState } from 'react';
import {
  ActiveIcon,
  AddMoreIcon2,
  DeleteIcon2,
  ExportIcon,
  FlagIcon,
  HospitalIcon,
  PendingIcon,
  TargetIcon
} from '@/assets/icons';
import ExpiredImg from '@assets/imgs/expired.png';
import HeartImg from '@assets/imgs/heart.png';
import LungImg from '@assets/imgs/lungs.png';
import LiverImg from '@assets/imgs/liver.png';
import KindneyImg from '@assets/imgs/kidney.png';
import PancreasImg from '@/assets/imgs/pancreas.png';

import { Grid } from '@mui/material';
import AddLicenseDialog from './dialogs/AddLicense';
import { useHospitals } from '../hospitalListContext';

const OrganListDashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const {
    state: { summarys, organsSummary }
  } = useHospitals();
  console.log(summarys);
  console.log(organsSummary);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const hanldeCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Box mb={1} className="flex gap-4">
              <Box className="flex w-full items-center justify-between  border-[1px] border-[#C967A2] p-5  rounded-lg shadow-inner-custom-pink">
                <Box className="flex flex-col">
                  <Text className="text-[16px] font-bold">All Hospitals</Text>
                  <Text className="text-xl    font-bold text-[#C967A2]">134</Text>
                </Box>
                <Box>
                  <HospitalIcon />
                </Box>
              </Box>
              <Box className="flex w-full items-center justify-between  border-[1px] border-[#C967A2]  p-5  rounded-lg shadow-inner-custom-pink">
                <Box className="flex flex-col">
                  <Text className="text-[16px] font-bold">Governemnt</Text>
                  <Text className="text-xl font-bold text-[#C967A2]">{summarys.summary?.governmentHospitals}</Text>
                </Box>
                <Box>
                  <HospitalIcon />
                </Box>
              </Box>
              <Box className="flex w-full items-center justify-between  border-[1px] border-[#C967A2]  p-5 rounded-lg shadow-inner-custom-pink ">
                <Box className="flex flex-col">
                  <Text className="text-[16px] font-bold">Private</Text>
                  <Text className="text-xl font-bold text-[#C967A2]">{summarys.summary?.privateHospitals}</Text>
                </Box>
                <Box>
                  <HospitalIcon />
                </Box>
              </Box>
              <Box className="flex w-full items-center justify-between border-[1px] border-[#C967A2]  p-5 rounded-lg shadow-inner-custom-pink">
                <Box className="flex flex-col">
                  <Text className="text-[16px] font-bold flex items-center ">
                    NTORC&apos;s &nbsp; <FlagIcon />
                  </Text>
                  <Text className="text-xl font-bold text-[#C967A2]">{summarys.summary?.ntorcHospitals}</Text>
                </Box>
                <Box>
                  <HospitalIcon />
                </Box>
              </Box>
              <Box className="flex items-center justify-center w-[50%] relative">
                <span className="flex items-center justify-center absolute bg-[#D876A94D]   rounded-[50%] h-[24px] w-[24px]  left-[5%] shadow-lg    shadow-[#d876a972]">
                  <span className="text-[#C967A2] font-medium  text-sm">W</span>
                </span>
                <span className="flex items-center justify-center absolute bg-[#D876A94D]   rounded-[50%] h-[24px] w-[24px] top-0  left-[38%] shadow-lg    shadow-[#d876a972]">
                  <span className="text-[#C967A2] font-medium text-sm">N</span>
                </span>
                <span>
                  <TargetIcon />
                </span>
                <span className="flex items-center justify-center w-[24px] h-[24px] absolute bg-[#D876A94D]  rounded-[50%] px-1 left-[38%] bottom-[2%]  shadow-lg    shadow-[#d876a972]">
                  <span className="text-[#C967A2] font-medium text-sm">S</span>
                </span>
                <span className="flex items-center justify-center w-[24px] h-[24px] absolute bg-[#6764654d]  rounded-[50%] px-1 right-[5%] top-[37%]  shadow-lg    shadow-[#d876a972]">
                  <span className="text-[#524e51af] font-medium  text-sm">E</span>
                </span>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box className="flex w-full">
              <Box className="flex w-full flex-col gap-y-[11px]">
                <button
                  onClick={handleOpenDialog}
                  className="flex gap-x-3 items-center justify-center  custom-btn btn-11 text-nowrap relative py-2.5  p-2 font-medium text-white transition duration-[1000] ease-in-out transform bg-gradient-to-r from-[#D268A8] via-[#D268A8] to-[#E3B2CF] rounded-md shadow-inset-light   hover:opacity-70 focus:outline-none overflow-hidden"
                >
                  <AddMoreIcon2 /> Add License
                  <div className="dot"></div>
                  <span className="absolute top-0 left-0 w-8 h-full bg-white opacity-0 animate-shinyBtn"></span>
                </button>
                <Button
                  className="flex gap-x-3 !bg-[#D876A94D] !text-[#C967A2] !p-1.55 !font-medium shadow-none"
                  variant="contained"
                >
                  <ExportIcon /> Export Table
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box mt={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box className="flex  gap-3">
                <Box className="flex w-full items-center justify-between border-[1px] px-3 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col ">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Active</Text>
                    <Text className="text-md font-bold text-[#C967A2]">{summarys.summary?.activeHospitals}</Text>
                  </Box>
                  <Box className="flex">
                    <ActiveIcon />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col ">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Pending</Text>
                    <Text className="text-md  font-bold text-[#C967A2]">{summarys.summary?.pendingHospitals}</Text>
                  </Box>
                  <Box className="flex">
                    <PendingIcon />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Deleted</Text>
                    <Text className="text-md  font-bold text-[#C967A2]">{summarys.summary?.deletedHospitals}</Text>
                  </Box>
                  <Box className="flex">
                    <DeleteIcon2 />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col ">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Expired</Text>
                    <Text className="text-md    font-bold text-[#C967A2]">{summarys.summary?.expiredHospitals}</Text>
                  </Box>
                  <Box className="flex">
                    <img src={ExpiredImg} alt="expired" />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Heart</Text>
                    <Text className="text-md    font-bold text-[#C967A2]">{organsSummary.organsSummary?.heart}</Text>
                  </Box>
                  <Box className="flex">
                    <img src={HeartImg} alt="Heart" />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col ">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Lung</Text>
                    <Text className="text-md    font-bold text-[#C967A2]">{organsSummary.organsSummary?.lungs}</Text>
                  </Box>
                  <Box className="flex">
                    <img src={LungImg} alt="Lung" />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Liver</Text>
                    <Text className="text-md    font-bold text-[#C967A2]">{organsSummary.organsSummary?.liver}</Text>
                  </Box>
                  <Box className="flex">
                    <img src={LiverImg} alt="Liver" />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between  border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Kidney</Text>
                    <Text className="text-md    font-bold text-[#C967A2]">{organsSummary.organsSummary?.kidney}</Text>
                  </Box>
                  <Box className="flex">
                    <img src={KindneyImg} alt="Kidney" />
                  </Box>
                </Box>
                <Box className="flex  w-full items-center justify-between  border-[1px] px-5 p-2 border-[#C967A2] shadow-inner-custom-pink  rounded-lg">
                  <Box className="flex flex-col">
                    <Text className="text-[13px] text-[#1A0616] font-[700]">Pancreas</Text>
                    <Text className="text-md    font-bold text-[#C967A2]">0</Text>
                  </Box>
                  <Box className="flex">
                    <img src={PancreasImg} alt="Kidney" />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <AddLicenseDialog open={openDialog} onClose={hanldeCloseDialog} />
    </>
  );
};

export default OrganListDashboard;
