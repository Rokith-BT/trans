import { ChatIcon2, CloseSimpleIcon, ExportIcon, ViewDocIcon } from '@/assets/icons';
import AddCircleIcon from '@/assets/icons/AddCircleIcon';
import ListIcon from '@/assets/icons/ListIcon';
import { Box, Button, Pagination, Text } from '@/atoms';
import { Grid } from '@mui/material';
import QS from 'query-string';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import React, { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import GenerateListTable from './GenerateListTable';
import CustomSearch from '@/pages/components/CustomSearch';
import WaitingListDialog from './WaitingListDialog';

const GenerateWaitingList = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const parsedQS = QS.parse(location.search);
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(currentPageSize);
  const [openWaitingList, setOpenWaitingList] = useState(false);
  return (
    <Box maxWidth="xl">
      <Box className="flex flex-col md:flex-row gap-4 md:gap-[18px] mt-6">
        <Box className="p-3 flex w-full md:w-[35%] items-center justify-center gap-2 text-nowrap bg-[#80459526] rounded-xl md:rounded-l-[500px] md:!rounded-r-[100px]">
          <Box className="bg-[#804595] rounded-full h-[80px] w-[80px] p-8"></Box>
          <Box className="flex w-full flex-col pr-5">
            <Box className="flex w-full justify-between mb-2 mt-2 items-center">
              <Text className="text-[#804595]">Maha</Text>
              <Text className="text-[#C83926]">A+</Text>
            </Box>
            <Box className="flex gap-3 flex-wrap">
              <Box className="flex gap-3 mb-[-13px]">
                <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">
                  Gender <span className="text-[#804595] !text-[13px] !font-[500]">Female</span>
                </Text>
                <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">
                  Height <span className="text-[#804595] !text-[13px] !font-[500]">155 cm</span>
                </Text>
              </Box>
              <Box className="flex gap-3">
                <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">
                  Age <span className="text-[#804595] !text-[13px] !font-[500]">22</span>
                </Text>
                <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">
                  Weight <span className="text-[#804595] !text-[13px] !font-[500]">57 Kg</span>
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="bg-[#80459526] flex flex-col w-full rounded-lg p-4 mt-4 md:mt-0">
          <Text className="text-[#804595] !mb-[16px] !text-[19px] !font-semibold text-center md:text-left">
            Apollo Speciality Hospital, Trichy
          </Text>
          <Box className="grid grid-cols-2 gap-y-4 md:flex md:gap-x-3 text-nowrap items-center justify-between">
            <Box pr={1}>
              <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">MLC</Text>
              <Text className="text-[#80459580] !text-[13px] !font-[500]">DOA</Text>
            </Box>
            <Box>
              <Text className="text-[#804595] !mb-[12px] !text-[13px] !font-[500]">Yes</Text>
              <Text className="text-[#804595] !text-[13px] !font-[500]">12-03-2024</Text>
            </Box>
            <Box pr={1}>
              <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">AR Case Number</Text>
              <Text className="text-[#80459580] !text-[13px] !font-[500]">Tentative Retrival D&T</Text>
            </Box>
            <Box>
              <Text className="text-[#804595] !mb-[12px] !text-[13px] !font-[500]">110</Text>
              <Text className="text-[#804595] !text-[13px] !font-[500]">24.05.2025 07:00</Text>
            </Box>
            <Box pr={1}>
              <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">Cause Of Death</Text>
              <Text className="text-[#80459580] !text-[13px] !font-[500]">Assessment D&T</Text>
            </Box>
            <Box>
              <Text className="text-[#804595] !mb-[12px] !text-[13px] !font-[500]">hanging</Text>
              <Text className="text-[#804595] !text-[13px] !font-[500]">24.05.2025 07:00</Text>
            </Box>
          </Box>
        </Box>
        <Box className="space-y-[12px] w-full md:w-[25%] flex flex-row md:flex-col gap-2 mt-4 md:mt-0 text-nowrap">
          <Box className="bg-[#80459526] flex w-full items-center py-[11px] pr-[16px] pl-[8px] gap-[8px] rounded-r-[24px] rounded-l-[8px]">
            <ChatIcon2 />
            <Text className="!text-[13px] text-[#804595] !font-[600]">Chat</Text>
          </Box>
          <Box className="bg-[#80459526] w-full flex py-[11px] pr-[16px] pl-[8px] gap-[8px] items-center rounded-r-[24px] rounded-l-[8px]">
            <ViewDocIcon />
            <Text className="!text-[13px] text-[#804595] !font-[600]">View Reports</Text>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} xl={2.5} md={2.5}>
          <Box className="shadow-md p-4">
            <Box p={2} className="flex flex-col gap-y-2 justify-center relative  w-[249px] h-[102px] ">
              <Text className="text-[#C967A2] !text-[16px] !font-[500] ">Allocation Process</Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[500] ">Case Officer Allocated </Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[400]">Case Officer:Maha</Text>
            </Box>
            <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
              <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
                Kidney (1) <span className="text-[#027545] bg-[#CFEEBC] rounded-lg px-2 text-[11px] ">Local</span>
              </Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[400]">Organ Allocation Initiated</Text>
            </Box>
            <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
              <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
                Kidney (2)
                <span className="text-[#67B1C9] bg-[#E0F0FF] rounded-lg px-2 text-[11px]">Share Pool</span>
              </Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[400]">Organ Allocation Initiated</Text>
            </Box>
            <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
              <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
                Liver <span className="text-[#027545] bg-[#CFEEBC] rounded-lg px-2 text-[11px] ">Local</span>
              </Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[400]">Organ Allocation Initiated</Text>
            </Box>
            <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
              <Text className="text-[#C967A2] !text-[16px] !font-[500]  flex gap-[16px] items-center">
                Split Liver 1 <span className="text-[#C88726] bg-[#EEDABC] rounded-lg px-2 text-[11px]">Rota</span>
              </Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[400] ">Organ Allocation Initiated</Text>
            </Box>
            <Box className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]">
              <Text className="text-[#C967A2] !text-[16px] !font-[400] flex gap-[16px] items-center">
                Split Liver 2 <span className="text-[#C88726] bg-[#EEDABC] rounded-lg px-2 text-[11px]">Rota</span>
              </Text>
              <Text className="text-[#A1999F] !text-[13px] !font-[500] ">Organ Allocation Initiated</Text>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} xl={9.5} md={9.5}>
          <Box className="flex gap-3">
            {/* <Box mt={3}>
              <Box className="bg-[#D876A9] text-nowrap text-center w-[110px] h-[80px] flex flex-col justify-center rounded-lg mx-auto md:mx-0">
                <Text className={'!text-[#F8F8FFCC] !text-[13px] !font-[500]'}>Step 1</Text>
                <Text className="!text-[#F8F8FFCC] !text-[11px] !font-[500]">Waiting List</Text>
                <Text className="!text-[#F8F8FFCC] !text-[11px] !font-[400] ">28-05-2025 00:00</Text>
              </Box>
            </Box>
            <Box mt={3}>
              <Box className="bg-[#D876A9] text-nowrap text-center w-[110px] h-[80px] flex flex-col justify-center rounded-lg mx-auto md:mx-0">
                <Text className="!text-[#F8F8FFCC] !text-[13px] !font-[500]">Step 2</Text>
                <Text className="!text-[#F8F8FFCC] !text-[11px] !font-[500] !text-wrap">Generate Waiting List</Text>
                <Text className="!text-[#F8F8FFCC] !text-[11px] !font-[400]">28-05-2025 00:00</Text>
              </Box>
            </Box>
            <Box mt={3}>
              <Box className="bg-[#D876A9] text-nowrap text-center w-[110px] h-[80px] flex flex-col justify-center rounded-lg mx-auto md:mx-0">
                <Text className="!text-[#F8F8FFCC] !text-[13px] !font-[500]">Step 3</Text>
                <Text className="!text-[#F8F8FFCC] !text-[13px] !font-[500]">Updated List</Text>
                <Text className="!text-[#F8F8FFCC] !text-[11px] !font-[400]">28-05-2025 00:00</Text>
              </Box> */}
            {/* </Box> */}
            <Box className="flex  gap-4">
              <Box
                onClick={() => setStep(1)}
                className={`bg-[#A1999F26]   ${step === 1 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%]  py-[8px]  flex flex-col justify-center rounded-lg `}
              >
                <Text className={`${step === 1 ? 'text-[white]' : 'text-[#C967A2]'} !font-[500] !text-[16px]`}>
                  Step 1
                </Text>
                <Text className={`${step === 1 ? 'text-[white]' : 'text-[#A1999F]'}`}>Waiting List</Text>
                <Text className={`${step === 1 ? 'text-[white]' : 'text-[#A1999F]'}`}>30-05-2025 00:00</Text>
              </Box>
              <Box
                onClick={() => setStep(2)}
                className={`bg-[#A1999F26] ${step === 2 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap  px-[3%] py-[8px] flex flex-col justify-center rounded-lg   `}
              >
                <Text className={`${step === 2 ? 'text-[white]' : 'text-[#C967A2]'} !font-[500] !text-[16px]`}>
                  Step 2
                </Text>
                <Text className={`${step === 2 ? 'text-[white]' : 'text-[#A1999F]'}`}>Generated Waiting List</Text>
                <Text className={`${step === 2 ? 'text-[white]' : 'text-[#A1999F]'}`}>30-05-2025 00:00</Text>
              </Box>
              <Box
                onClick={() => setStep(3)}
                className={`bg-[#A1999F26] ${step === 3 ? 'bg-[#D876A9]' : ''}  md:w-full] text-nowrap px-[3%] py-[8px] flex flex-col justify-center rounded-lg  `}
              >
                <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 3</Text>
                <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#A1999F]'}`}>Updated List </Text>
                <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#A1999F]'}`}> 30-05-2025 00:00</Text>
              </Box>
              {/* <Box
                onClick={() => setStep(4)}
                className={`bg-[#A1999F26] ${step === 4 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%] flex flex-col justify-center rounded-lg `}
              >
                <Text className={` ${step === 4 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 4</Text>
                <Text className={` ${step === 4 ? 'text-[white]' : 'text-[#A1999F]'}`}>History, Injuries,</Text>
                <Text className={` ${step === 4 ? 'text-[white]' : 'text-[#A1999F]'}`}>Rescue, Ventilator</Text>
              </Box>
              <Box
                onClick={() => setStep(5)}
                className={`bg-[#A1999F26] ${step === 5 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%] flex flex-col justify-center rounded-lg `}
              >
                <Text className={` ${step === 5 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 5</Text>
                <Text className={` ${step === 5 ? 'text-[white]' : 'text-[#A1999F]'}`}>ABG Inotropes,</Text>
                <Text className={` ${step === 5 ? 'text-[white]' : 'text-[#A1999F]'}`}>Hormone</Text>
              </Box>
              <Box
                onClick={() => setStep(6)}
                className={`bg-[#A1999F26] ${step === 6 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[4%] py-[8px] flex flex-col justify-center rounded-lg  `}
              >
                <Text className={` ${step === 6 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 6</Text>
                <Text className={` ${step === 6 ? 'text-[white]' : 'text-[#A1999F]'}`}>Form & </Text>
                <Text className={` ${step === 6 ? 'text-[white]' : 'text-[#A1999F]'}`}>Attachment</Text>
              </Box>
              <Box
                onClick={() => setStep(7)}
                className={` bg-[#A1999F26] ${step === 7 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[4%] py-[8px] flex flex-col justify-center rounded-lg  `}
              >
                <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 7</Text>
                <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#A1999F]'}`}>Process </Text>
                <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#A1999F]'}`}>Initiation</Text>
              </Box> */}
            </Box>
          </Box>
          <Box className="flex flex-col md:flex-row justify-between gap-4 mt-4">
            <Box className="flex flex-col sm:flex-row gap-3">
              <Button className="!bg-[#C96767] !text-[#F8F8FF] h-9">
                <CloseSimpleIcon />
                Close Process
              </Button>
              <Button className="!bg-[#C96767] !text-[#F8F8FF] h-9">
                <AddCircleIcon />
                Terminate List
              </Button>
            </Box>
            <Box className="flex flex-col sm:flex-row gap-3">
              <CustomSearch name="SerachAny" />
              <Button
                className="!bg-[#67B1C9] !text-[#F8F8FF] !h-[36px] !w-[160px]"
                onClick={() => setOpenWaitingList(true)}
              >
                <ListIcon />
                Generate List
              </Button>
            </Box>
          </Box>
          <Box mt={4} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <Text className="!text-[#804595] !text-[19px] !font-[600]">Generated Waiting List</Text>
            <Box className="relative w-full md:w-auto">
              <ExportIcon className="absolute top-0 right-0 md:top-4 md:right-[450px] cursor-pointer" />
              <Pagination
                totalPages={totalPages}
                onPageSizeChanged={(perPage: string) => {
                  navigate({
                    ...location,
                    search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString()
                  });
                }}
                page={(parsedQS && Number(parsedQS.page)) || 1}
                onChange={(_, page) => {
                  navigate({
                    ...location,
                    search: createSearchParams({ ...parsedQS, page: page.toString() }).toString()
                  });
                }}
                currentPageSize={(parsedQS && Number(parsedQS.perPage)) || 10}
                pageSizeOptions={PageSizeOptions}
              />
            </Box>
          </Box>
          <GenerateListTable list={[]} isTable={false} step={step} />
          <WaitingListDialog open={openWaitingList} onClose={() => setOpenWaitingList(false)} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenerateWaitingList;
