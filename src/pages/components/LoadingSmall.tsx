import { LoadingIcon } from '@/assets/icons';
import { Box } from '@/atoms';
import { useEffect } from 'react';
import './Loadin.css';

const LoadingSmall = () => {
  useEffect(() => {}, []);
  return (
    <Box className="flex items-center justify-center gap-2">
      <Box className="">
        <LoadingIcon className="infinite-rotate" />
      </Box>
    </Box>
  );
};

export default LoadingSmall;
