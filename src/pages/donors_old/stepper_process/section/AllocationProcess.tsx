import { Box, Button, Text } from '@/atoms';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { BackupAllocatDialog } from '../../donor_allocation/section/BackupAllocatDialog';
import { MultiOrganDialog } from '../../donor_allocation/section/MultiOrganDialog';

const AllocationProcess = () => {
  const location = useLocation();
  const state = location.state;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const [openBackup, setOpenBackup] = useState(false);
  const [openMultiorgan, setMultiOrgan] = useState(false);
  return (
    <Box className="border-r-[1px] border-[#80808020] shadow-xl">
      {state && (
        <Box className="pl-[20%] space-y-3 mb-5">
          <Button onClick={() => setOpenBackup(true)} className="!bg-[#D876A9] !text-[white] !text-[13px] w-full">
            Create Backup Allocation
          </Button>
          <Button
            onClick={() => setMultiOrgan(true)}
            className="!bg-[#D876A9] !text-[white] !text-[13px] w-full text-nowrap"
          >
            Create Multi Organ Allocation
          </Button>
        </Box>
      )}
      <Box p={2} className="bg-[#D876A933] flex flex-col gap-y-2 justify-center relative  w-[249px] h-[102px] ">
        <Text className="text-[#C967A2] !text-[16px] ">Allocation Process</Text>
        <Text className="text-[#A1999F] !text-[13px] text-nowrap">Case Officer Allocation Pending </Text>
        <Text className="absolute top-1 right-1 text-[#A1999F]">{`${hours}:${minutes}:${seconds}`}</Text>
      </Box>
      <Box className="pl-4">
        <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]  ">
          <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
            Kidney (L) <span className="text-[#027545] bg-[#CFEEBC] rounded-lg px-2 text-[11px] ">Local</span>
          </Text>
          <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Priority list Generated</Text>
          <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Reson</Text>
        </Box>
        <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
          <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
            Kidney (L)
            <span className="text-[#67B1C9] bg-[#E0F0FF] rounded-lg px-2 text-[11px]">Share Pool</span>
          </Text>
          <Text className="text-[#027545] !text-[13px] !font-[500] text-nowrap">Genreated Waitlist</Text>
          <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Recipient Hospital Requested</Text>
        </Box>  
        <Box className="flex flex-col gap-y-2 relative justify-center w-[249px] h-[102px]">
          <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
            Kidney (L)
            <span className="text-[#67B1C9] bg-[#E0F0FF] rounded-lg px-2 text-[11px]">Share Pool</span>
            <Text className="!absolute -top-2 right-1 text-[#A1999F]">00:00:01</Text>
          </Text>
          <Text className="text-[#DD2323] !text-[13px] !font-[500] text-nowrap">Process Closed</Text>
          <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Same Blood Group For Standby </Text>
          <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">
            Declined The Offer Due To Size M...
          </Text>
        </Box>
        <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
          <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
            Liver <span className="text-[#C88726] bg-[#EEDABC] rounded-lg px-2 text-[11px]">Rota</span>
          </Text>
          <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Transplant Complete</Text>
        </Box>
      </Box>
      <BackupAllocatDialog open={openBackup} onClose={() => setOpenBackup(false)} />
      <MultiOrganDialog open={openMultiorgan} onClose={() => setMultiOrgan(false)} />
    </Box>
  );
};

export default AllocationProcess;
