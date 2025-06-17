import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useNavigate } from 'react-router';

interface RejectedDialogProps {
  open: boolean;
  onClose: () => void;
  //   isRejected: boolean;
  Reason: string;
}

const RejectedDialog: React.FC<RejectedDialogProps> = ({ open, onClose, Reason }) => {
  const navigate = useNavigate();
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        {' '}
        <>
          <Box className="flex flex-col items-center justify-center">
            <Text className="flex gap-2">
              Your Hospital has been <Text className="text-[#DA2424] !font-[700] !text-[16px]"> Rejected ?</Text>
            </Text>
            <Text className="!mt-[18px] !font-[500] border-[gray] p-4">Reason : {Reason}</Text>
            <Button
              variant="contained"
              className="!bg-[#D876A9] !mt-4"
              onClick={() => {
                navigate('/onboarding');
                onClose();
              }}
            >
              Edit
            </Button>
          </Box>
        </>
      </Box>
    </CustomDialog>
  );
};

export default RejectedDialog;
