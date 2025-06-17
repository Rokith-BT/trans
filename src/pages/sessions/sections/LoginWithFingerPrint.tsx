import React, { useState } from 'react';
import { Box, Text, Button } from '@/atoms'; // Ensure the path is correct
import FingerTouchDefault from '@/assets/icons/FingerTouchDefault';

interface LoginWithFingerPrintProps {
  onSuccess: () => void;
  onFailure: () => void;
  onTooMany: () => void;
}
export const LoginWithFingerPrint: React.FC<LoginWithFingerPrintProps> = ({ onSuccess, onFailure, onTooMany }) => {
  const [, setAuthStatus] = useState<null | 'success' | 'failure' | 'tooMany'>(null);
  const handleFingerPrintTouch = () => {
    // Simulate fingerprint authentication
    const randomValue = Math.random();
    let status: 'success' | 'failure' | 'tooMany';
    if (randomValue > 0.7) {
      status = 'success';
    } else if (randomValue > 0.3) {
      status = 'failure';
    } else {
      status = 'tooMany';
    }
    setAuthStatus(status);
    if (status === 'success') {
      onSuccess();
    } else if (status === 'failure') {
      onFailure();
    } else {
      onTooMany();
    }
  };

  return (
    <Box className="text-center  " maxWidth="100%">
      <Box className=" pb-2">
        <Text className="text-[28px]  font-[800] text-[#1A0616]">Welcome!</Text>
      </Box>
      <Text variant="h5" className="text-[16px] font-[500] text-[#7A6F78] my-2">
        Please login to your account
      </Text>
      <Box mt="24px" width="100%" className="flex items-center justify-center">
        <FingerTouchDefault />
      </Box>

      <>
        <span className="text-[#7A6F78] font-[500] text-[13px]">Place your finger on finger print scanner</span>
        <br />
        <Button variant="outlined" onClick={handleFingerPrintTouch}>
          Check
        </Button>
      </>
    </Box>
  );
};
