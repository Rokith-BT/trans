// components/ConfirmDialog.tsx
import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onConfirm, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="text-center">
        <Text className=" !text-[16px] !font-[500] ">
          Are you sure, do you want to <strong>unselect?</strong>
        </Text>
        <Box className="flex justify-center items-center gap-4 mt-5">
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ConfirmDialog;
