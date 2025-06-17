import { ChatIcon2, ViewDocIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';


const DonorProfile = () => {
  return (
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
  );
}

export default DonorProfile