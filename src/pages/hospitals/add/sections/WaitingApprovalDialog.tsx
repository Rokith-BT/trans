import { PendingSpinIcon } from '@/assets/icons';
import CloseIcon from '@/assets/icons/Close';
import { Box,  CustomDialog, Text } from '@/atoms';
import React from 'react';

interface WaitingApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  // forRejected?: string;
  // Rejected?: string;
}
const WaitingApprovalDialog: React.FC<WaitingApprovalDialogProps> = ({ open, onClose }) => {
  // const {
  //   state: { hospital, currentUser }
  // } = useAuth();
  // console.log('hospital from auth', hospital, currentUser);

  return (
    <CustomDialog open={open} onClose={() => {}} maxWidth="xs">
      <Box className="flex flex-col">
        <Box className="relative flex flex-col items-center justify-center">
          <CloseIcon className="absolute -top-2 -right-3 h-[20px] cursor-pointer" onClick={onClose} />
          <PendingSpinIcon className="h-[60px] w-[60px] mb-[20px]" />
          <Text className="!text-[16px] !font-[500]">Waiting for TRANSTAN Approval</Text>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default WaitingApprovalDialog;
