import { Box } from '@/atoms';
import React from 'react';
import './Loadin.css';

const Loading = () => {
  return (
    <Box className="h-[100vh] w-[100vw] flex justify-center items-center relative">
      <Box className="spinner h-[158px] w-[158px]  rounded-full border-t-[purple] border-[10px] flex items-center justify-center "></Box>
      <Box className="loading-dots absolute top-[50%] text-[#804595] right-[50%] !font-[500] translate-x-[50%] translate-y-[-50%]">
        Loading
      </Box>
    </Box>
  );
};

export default Loading;
