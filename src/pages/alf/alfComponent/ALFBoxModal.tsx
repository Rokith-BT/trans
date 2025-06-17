import { Box, Text } from '@/atoms';
import { ReactNode } from 'react';

interface ALFBoxModalType {
  bgColor: string;
  color: string;
  title: string;
  count: number;
  Icon: ReactNode;
}

export default function ALFBoxModal({ bgColor, color, title, count, Icon }: ALFBoxModalType) {
  return (
    <Box style={{ backgroundColor: bgColor }} className={` p-2 !rounded-[8px] px-4 py-3`}>
      <Box className="flex gap-4 justify-between">
        <Box className="hidden md:block mt-1">{Icon}</Box>
        <Box className="text-left flex gap-2 align-middle justify-center md:text-right md:block md:justify-end items-center">
          <Text style={{ color: color, fontSize: '16px' }} className={` !font-[600] textResponse`}>
            {count}
          </Text>
          <Text style={{ color: color, fontSize: '14px' }} className={` !font-[500] textResponse`}>
            {title}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
