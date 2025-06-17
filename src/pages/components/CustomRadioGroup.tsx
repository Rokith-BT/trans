/* eslint-disable no-unused-vars */
import { CircleGreyIcon, TickCircle } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import React from 'react';

interface CustomRadioGroupProps {
  label: string;
  isTranstanId: boolean;
  // eslint-disable-next-line no-unused-vars
  handleChange: (isTranstanId: boolean) => void;
  option1: string;
  option2: string;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ label, isTranstanId, handleChange, option1, option2 }) => {
  return (
    <Box className="flex flex-col w-full justify-between gap-x-4 ">
      <Text className="!text-[13px] !mb-[0px] !font-[500]">
        {label} <span className="text-[red]">*</span>
      </Text>
      <Box className="flex gap-4 mt-[6px] ">
        <Box
          className={`flex items-center cursor-pointer w-full rounded-[20px] px-[8px] ${isTranstanId ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
          onClick={() => handleChange(true)}
        >
          {isTranstanId ? <TickCircle toolText=""  /> : <CircleGreyIcon />}
          <Text className="pl-[4px] !text-[13px] !font-[500] text-nowrap">{option1}</Text>
        </Box>
        <Box
          onClick={() => handleChange(false)}
          className={`flex items-center w-full cursor-pointer rounded-[20px] px-[8px] ${!isTranstanId ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
        >
          {isTranstanId ? <CircleGreyIcon /> : <TickCircle toolText="" />}
          <Text className="pl-[4px] !text-[13px] !font-[500] text-nowrap">{option2}</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomRadioGroup;
