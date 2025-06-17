import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="!text-[#1A0616] !text-[16px] !font-[500]">Confirm</Text>
        <Text className="!text-[#A1999F] !text-[16px] !font-[500] !mt-[16px]">
          Are you sure, Do you want to update organ inspection list?
        </Text>
        <Box className="flex items-center justify-center !gap-3 !mt-3">
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" onClick={onClose}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ConfirmDialog;
