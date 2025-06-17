import { ChatIcon2, ViewDocIcon } from '@/assets/icons';
import { Box, Button, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import OrganConsent from './section/OrganConsent';
import DonorDetails from './section/DonorDetails';
import ApnoeaAllocation from './section/ApnoeaAllocation';
import MedicalAllocation from './section/MedicalAllocation';
import { ABGAllocation } from './section/ABGAllocation';
import AttachmentAllocation from './section/AttachmentAllocation';
import InitiationAllocation from './section/InitiationAllocation';
import { useLocation } from 'react-router';
import { BackupAllocatDialog } from './section/BackupAllocatDialog';
import { MultiOrganDialog } from './section/MultiOrganDialog';
import DonorStepper from './section/DonorStepper';

const keytoNameMapping: { [key: string]: string } = {
  spinal: 'Spinal',
  stomach: 'Stomach',
  lbowel: 'Large Bowel',
  cornea: 'Cornea',
  skin: 'Skin',
  bone: 'Bone',
  tissue: 'Tissue',
  hvalves: 'Heart Valves'
};

interface SubmitedData {
  key: string;
  value: string | null;
}

const DonorAlocation = () => {
  const location = useLocation();
  const state = location.state;

  const [step, setStep] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const [openBackup, setOpenBackup] = useState(false);
  const [openMultiorgan, setMultiOrgan] = useState(false);
  const [submittedData, setSubmittedData] = useState<SubmitedData[]>([]);

  const handleSubmit = (selection: { [key: string]: string | null }) => {
    const formattedData = Object.keys(selection).map((key) => ({
      key,
      value: selection[key]
    }));
    setSubmittedData(formattedData);
    console.log('Submitted selection', formattedData);
  };

  const [stepper, setStepper] = useState(false);

  return (
    <Box>
      <Box mt={4} px={5}>
        <Box className="flex gap-[18px] ">
          <Box className="p-3 flex w-[30%] items-center justify-center gap-2 text-nowrap bg-[#80459526] rounded-l-[500px] !rounded-r-[100px]">
            <Box className="bg-[#804595] rounded-full h-[80px] w-[80px] p-8"></Box>
            <Box className="flex w-full flex-col pr-5">
              <Box className="flex w-full justify-between mb-4 items-center">
                <Text className="text-[#804595]">Maha</Text> <Text className="text-[#C83926]">A+</Text>
              </Box>
              <Box className="flex gap-3">
                <Box className="flex flex-col">
                  <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">
                    Gender <span className="text-[#804595] !text-[13px] !font-[500]">Female</span>
                  </Text>

                  <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">
                    Height <span className="text-[#804595]  !text-[13px] !font-[500]">175 cm</span>
                  </Text>
                </Box>
                <Box className="flex flex-col">
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

          <Box className="bg-[#80459526] flex flex-col w-full rounded-lg p-4">
            <Text className="text-[#804595] !mb-[16px] !text-[19px] !font-semibold">
              Apollo Speciality Hospital, Trichy
            </Text>
            <Box className="flex gap-x-3 text-nowrap items-center justify-between">
              <Box pr={1}>
                <Text className="text-[#80459580] !mb-[12px] !text-[13px] !font-[500]">MLC</Text>
                <Text className="text-[#80459580] !text-[13px] !font-[500]">DOA</Text>
              </Box>
              <Box>
                <Text className="text-[#804595] !mb-[12px]  !text-[13px] !font-[500]">Yes</Text>
                <Text className="text-[#804595] !text-[13px] !font-[500]">12-03-2024</Text>
              </Box>
              <Box pr={1}>
                <Text className="text-[#80459580] !mb-[12px]  !text-[13px] !font-[500]">AR Case Number</Text>
                <Text className="text-[#80459580] !text-[13px] !font-[500]">Tentative Retrival D&T</Text>
              </Box>
              <Box>
                <Text className="text-[#804595] !mb-[12px]  !text-[13px] !font-[500]">110</Text>
                <Text className="text-[#804595] !text-[13px] !font-[500]">26.04.2303 07:00</Text>
              </Box>
              <Box pr={1}>
                <Text className="text-[#80459580] !mb-[12px]  !text-[13px] !font-[500]">Cause Of Death</Text>
                <Text className="text-[#80459580] !text-[13px] !font-[500]">Assessment D&T</Text>
              </Box>
              <Box>
                <Text className="text-[#804595] !mb-[12px]   !text-[13px] !font-[500]">hanging</Text>
                <Text className="text-[#804595] !text-[13px] !font-[500]">26.04.2303 07:00</Text>
              </Box>
            </Box>
          </Box>

          <Box className="space-y-[18px] w-[25%] flex flex-col text-nowrap">
            <Box className="bg-[#80459526] flex w-full items-center py-[11px] pr-[71px] pl-[8px] gap-[8px]  rounded-r-[24px] rounded-l-[8px]">
              <ChatIcon2 />
              <Text className="!text-[13px] text-[#804595] !font-[600]">Chat</Text>
            </Box>
            <Box className="bg-[#80459526] w-full flex py-[11px] pr-[71px] pl-[8px] gap-[8px] items-center rounded-r-[24px] rounded-l-[8px]">
              <ViewDocIcon />
              <Text className="!text-[13px] text-[#804595] !font-[600]">View Reports</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="flex  w-full bg-[#F8F8FF]  " mt={4}>
        <Box className="border-r-[1px] border-[#80808020] shadow-xl">
          {state && !stepper && (
            <Box className="pl-[15%] space-y-3 mb-5">
              <Button onClick={() => setOpenBackup(true)} className="!bg-[#D876A9] !text-[white] !text-[13px] w-[75%]">
                Create Backup Allocation
              </Button>
              <Button
                onClick={() => setMultiOrgan(true)}
                className="!bg-[#D876A9] !text-[white] !text-[13px]  w-[75%] text-nowrap"
              >
                Create Multi Organ Allocation
              </Button>
            </Box>
          )}
          <Box p={2} className="bg-[#D876A933] flex flex-col gap-y-2 justify-center relative  w-[249px] h-[102px] ">
            <Text className="text-[#C967A2] !text-[16px] ">Allocation Process</Text>
            {state ? (
              <>
                <Text className="text-[#A1999F] !text-[13px] text-nowrap">Local Organ Choosen </Text>
                <Text className="text-[#A1999F] !text-[13px] text-nowrap">Case Officer Name : praveen </Text>
              </>
            ) : stepper ? (
              <>
                <Text className="text-[#C967A2] !text-[16px] ">Allocation Process</Text>
                <Text className="text-[#A1999F] !text-[13px] text-nowrap"></Text>
                <Text className="text-[#A1999F] !text-[13px] text-nowrap">Case Officer Name : praveen </Text>
              </>
            ) : (
              <>
                <Text className="text-[#C967A2] !text-[16px] ">Allocation Process</Text>
                <Text className="text-[#A1999F] !text-[13px] text-nowrap">Case Officer Allocation Pending </Text>
              </>
            )}

            <Text className="absolute top-1 right-1 text-[#A1999F]">{`${hours}:${minutes}:${seconds}`}</Text>
          </Box>
          {/* upcomig tabs are need to be set in logic */}
          {submittedData && (
            <Box className="pl-4">
              {submittedData.map((data, index) => (
                <Box key={index}>
                  <Box
                    className="flex flex-col gap-y-2 justify-center w-[249px] h-[102px]  "
                    onClick={() => setStepper(true)}
                  >
                    <Text className="text-[#C967A2] !text-[16px] !font-[500] text-nowrap flex gap-[16px] items-center">
                      {keytoNameMapping[data.key]}
                      <span
                        className={`${data.value === 'local' ? 'text-[#027545] bg-[#CFEEBC] ' : 'bg-[#E0F0FF] text-[#67B1C9]'}  rounded-lg px-2 text-[11px]`}
                      >
                        {data.value}
                      </span>
                    </Text>
                    <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Generate List</Text>
                    <Text className="text-[#A1999F] !text-[13px] !font-[500] text-nowrap">Reason</Text>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Box className="mx-[28px] overflow-auto w-full">
          <Box className="flex flex-col w-full ">
            <Box
              className="overflow-x-auto w-full flex-wrap"
              sx={{
                'scrollbar-width': 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }}
            >
              {stepper ? (
                <DonorStepper />
              ) : (
                <Box className="flex  gap-4">
                  <Box
                    onClick={() => setStep(1)}
                    className={`bg-[#A1999F26]   ${step === 1 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%]  py-[8px]  flex flex-col justify-center rounded-lg `}
                  >
                    <Text className={`${step === 1 ? 'text-[white]' : 'text-[#C967A2]'} !font-[500] !text-[16px]`}>
                      Step 1
                    </Text>
                    <Text className={`${step === 1 ? 'text-[white]' : 'text-[#A1999F]'}`}>Organs & Tissue</Text>
                    <Text className={`${step === 1 ? 'text-[white]' : 'text-[#A1999F]'}`}>Consented</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(2)}
                    className={`bg-[#A1999F26] ${step === 2 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap  px-[3%] py-[8px] flex flex-col justify-center rounded-lg   `}
                  >
                    <Text className={`${step === 2 ? 'text-[white]' : 'text-[#C967A2]'} !font-[500] !text-[16px]`}>
                      Step 2
                    </Text>
                    <Text className={`${step === 2 ? 'text-[white]' : 'text-[#A1999F]'}`}>Donor Meidcal</Text>
                    <Text className={`${step === 2 ? 'text-[white]' : 'text-[#A1999F]'}`}>Details</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(3)}
                    className={`bg-[#A1999F26] ${step === 3 ? 'bg-[#D876A9]' : ''}  md:w-full] text-nowrap px-[3%] py-[8px] flex flex-col justify-center rounded-lg  `}
                  >
                    <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 3</Text>
                    <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#A1999F]'}`}>Apnoea & </Text>
                    <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#A1999F]'}`}> Consent Details</Text>
                  </Box>
                  <Box
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
                  {state && (
                    <Box
                      onClick={() => setStep(7)}
                      className={` bg-[#A1999F26] ${step === 7 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[4%] py-[8px] flex flex-col justify-center rounded-lg  `}
                    >
                      <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 7</Text>
                      <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#A1999F]'}`}>Process </Text>
                      <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#A1999F]'}`}>Initiation</Text>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          {!stepper && (
            <Box mt={2} className="bg-[#F8F8FF] w-full overflow-hidden">
              {step === 1 && <OrganConsent />}
              {step === 2 && <DonorDetails />}
              {step === 3 && <ApnoeaAllocation />}
              {step === 4 && <MedicalAllocation />}
              {step === 5 && <ABGAllocation />}
              {step === 6 && <AttachmentAllocation />}
              {step === 7 && <InitiationAllocation onSelectionSubmit={handleSubmit} />}
            </Box>
          )}
        </Box>
      </Box>
      <BackupAllocatDialog open={openBackup} onClose={() => setOpenBackup(false)} />
      <MultiOrganDialog open={openMultiorgan} onClose={() => setMultiOrgan(false)} />
    </Box>
  );
};

export default DonorAlocation;
