import { Box, Button, Text } from '@/atoms';
import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { WarningIcon } from '@/assets/icons';

export interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  return (
    <Box p={5}>
      <Text className="!text-[19px] !font-[500] text-[#804595]">Footer</Text>
      <Box mt={3} mb={3}>
        <Text className="text-base font-medium">Do you want to enable footer</Text>
        <span>
          <Checkbox className="!rounded-lg !border-[#A1999F]" />
        </span>
      </Box>
      <span className="flex items-center  p-1 px-3">
        <span className="bg-[#A1999F66] flex items-center px-3 rounded ">
          <WarningIcon />
          &nbsp;This footer will be visible on all public pages
        </span>
      </span>
      <Box className="absolute bottom-[10%] right-5" px={2}>
        <Button variant="contained" className='w-[150px]'>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Footer;
