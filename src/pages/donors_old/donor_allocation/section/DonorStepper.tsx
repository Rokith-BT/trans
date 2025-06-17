import { Box, Pagination, Text } from '@/atoms';
import { useEffect, useState } from 'react';
import { FilterIcon } from '@/assets/icons/Filter';
import { ExportIcon } from '@/assets/icons';
import WaitingList from '../../stepper_process/section/WaitingList';

const DonorStepper = () => {
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

  const date = currentTime.getDate();
  const month = currentTime.getMonth();
  const year = currentTime.getFullYear();
  const formatedDate = `${date}/${month}/${year} ${hours}:${minutes}`;

  const steps = [
    { step: 1, title: 'Waiting List' },
    { step: 2, title: 'Generated Waiting List' },
    { step: 3, title: 'Priority List' },
    { step: 4, title: 'Logistics' },
    { step: 5, title: 'Assessment Status' },
    { step: 6, title: 'Allocation' },
    { step: 7, title: 'Organ Retrieval' },
    { step: 8, title: 'Final Allocation' },
    { step: 9, title: 'Transplant Surgery' }
  ];

  const getTitleForStep = (step: string | number) => {
    const foundStep = steps.find((s) => s.step === step);
    return foundStep ? foundStep.title : '';
  };

  return (
    <Box my={3}>
      <Box className="flex ">
        <Box className="flex  flex-col w-full bg-[#F8F8FF]  ">
          <Box className="pt-2 overflow-auto w-full">
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
                <Box mb={2} className="flex  gap-4">
                  <Box
                    onClick={() => setStep(1)}
                    className={`bg-[#A1999F26]   ${step === 1 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%]  py-[8px]  flex flex-col justify-center rounded-lg `}
                  >
                    <Text className={`${step === 1 ? 'text-[white]' : 'text-[#C967A2]'} !font-[500] !text-[16px]`}>
                      Step 1
                    </Text>
                    <Text className={`${step === 1 ? 'text-[white]' : 'text-[#A1999F]'}`}>Waiting List</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(2)}
                    className={`bg-[#A1999F26] ${step === 2 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap  px-[3%] py-[8px] flex flex-col justify-center rounded-lg   `}
                  >
                    <Text className={`${step === 2 ? 'text-[white]' : 'text-[#C967A2]'} !font-[500] !text-[16px]`}>
                      Step 2
                    </Text>
                    <Text className={`${step === 2 ? 'text-[white]' : 'text-[#A1999F]'}`}>Generated Waiting List</Text>
                    <Text className={`${step === 2 ? 'text-[white]' : 'text-[#A1999F]'}`}>{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(3)}
                    className={`bg-[#A1999F26] ${step === 3 ? 'bg-[#D876A9]' : ''}  md:w-full] text-nowrap px-[3%] py-[8px] flex flex-col justify-center rounded-lg  `}
                  >
                    <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 3</Text>
                    <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#A1999F]'}`}>Piriority List </Text>
                    <Text className={` ${step === 3 ? 'text-[white]' : 'text-[#A1999F]'}`}>{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(4)}
                    className={`bg-[#A1999F26] ${step === 4 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%] flex flex-col justify-center rounded-lg `}
                  >
                    <Text className={` ${step === 4 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 4</Text>
                    <Text className={` ${step === 4 ? 'text-[white]' : 'text-[#A1999F]'}`}>Logistics</Text>
                    <Text className={` ${step === 4 ? 'text-[white]' : 'text-[#A1999F]'}`}>{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(5)}
                    className={`bg-[#A1999F26] ${step === 5 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[3%] flex flex-col justify-center rounded-lg `}
                  >
                    <Text className={` ${step === 5 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 5</Text>
                    <Text className={` ${step === 5 ? 'text-[white]' : 'text-[#A1999F]'}`}>Assessment Status</Text>
                    <Text className={` ${step === 5 ? 'text-[white]' : 'text-[#A1999F]'}`}>{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(6)}
                    className={`bg-[#A1999F26] ${step === 6 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[4%] py-[8px] flex flex-col justify-center rounded-lg  `}
                  >
                    <Text className={` ${step === 6 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 6</Text>
                    <Text className={` ${step === 6 ? 'text-[white]' : 'text-[#A1999F]'}`}>Allocation</Text>
                    <Text className={` ${step === 6 ? 'text-[white]' : 'text-[#A1999F]'}`}>{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(7)}
                    className={` bg-[#A1999F26] ${step === 7 ? 'bg-[#D876A9]' : ''} md:w-full] text-nowrap px-[4%] py-[8px] flex flex-col justify-center rounded-lg  `}
                  >
                    <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#C967A2]'}`}>Step 7</Text>
                    <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#A1999F]'}`}>Organ Retrival </Text>
                    <Text className={` ${step === 7 ? 'text-[white]' : 'text-[#A1999F]'}`}>{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(8)}
                    className="bg-[#A1999F26]  text-nowrap  md:w-full]  px-[4%] py-[8px] flex flex-col justify-center rounded-lg  "
                  >
                    <Text className="text-[#C967A2] !font-[500] !text-[16px]">Step 8</Text>
                    <Text className="text-[#A1999F]">Final Allocation</Text>
                    <Text className="text-[#A1999F]">{formatedDate}</Text>
                  </Box>
                  <Box
                    onClick={() => setStep(9)}
                    className="bg-[#A1999F26]  text-nowrap  md:w-full]  px-[4%] py-[8px] flex flex-col justify-center rounded-lg  "
                  >
                    <Text className="text-[#C967A2] !font-[500] !text-[16px]">Step 9</Text>
                    <Text className="text-[#A1999F]">Transplant Surgery</Text>
                    <Text className="text-[#A1999F]">{formatedDate}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box>
            <Box px={5} className="flex items-center justify-between">
              <Text className="text-[#804595] !text-[19px] !font-[600]">{getTitleForStep(step)}</Text>
              <Box className="flex gap-5 items-center">
                <FilterIcon />
                <ExportIcon />
                <Pagination
                  count={10}
                  onPageSizeChanged={() => {}}
                  pageSize="10"
                  pageSizeOptions={[{ value: '10', label: '10' }]}
                />
              </Box>
            </Box>
            <Box px={5}>{(step === 2 || step === 3) && <WaitingList steps={step} />}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DonorStepper;
