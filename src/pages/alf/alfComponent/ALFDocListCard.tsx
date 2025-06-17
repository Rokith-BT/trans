import { Box, Text } from '@/atoms';
import React from 'react';
interface ALFDocTableCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
export default function ALFDocListCard({ data }: ALFDocTableCardProps) {
  console.log(data, 'eafedvsezfvedsesfveswr');

  return (
    <Box className="card">
      
      <Box className="mt-2 flex justify-between">
        <Text className="!text-[12px] text-[#A1999F]">
          S.No <span className="text-[#000] text-[12px] font-medium">{data?.serialNumber}</span>
        </Text>
        <Text className="!text-[12px] text-[#A1999F]">
          Doctor Name <span className="text-[#000] text-[12px] font-medium">{data?.consultant?.name}</span>
        </Text>
      </Box>
      <Box className="mt-2 flex justify-between">
        <Text className="!text-[12px] text-[#A1999F]">
          Comment <span className="text-[#000] text-[12px] font-medium">{data?.comment}</span>
        </Text>
        <Text className="!text-[12px] text-[#A1999F]">
          Status{' '}
          <span className="text-[#027545] text-[12px] font-medium py-1 px-2 rounded-full bg-[#CFEEBC]">
            {data?.status}
          </span>
        </Text>
      </Box>
    </Box>
  );
}
