import { Box, Text } from '@/atoms';
import React from 'react';

interface SystemUpdateProps {}

const SystemUpdate: React.FC<SystemUpdateProps> = () => {
  return (
    <Box p={5}>
      <Text className="!text-[19px] !font-bold text-[#804595]">Updates</Text>
      <Box className="text-center absolute top-[50%] right-[45%]">
        <Text className="text-2xl font-bold">Current Version 3.0.1</Text>
        <br />
        <Text className="text-xs font-medium text-[#A1999F]">Upto date</Text>
      </Box>
    </Box>
  );
};

export default SystemUpdate;
