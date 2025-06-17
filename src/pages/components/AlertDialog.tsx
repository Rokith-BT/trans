import { Box, Button, CustomDialog } from '@/atoms';
import React from 'react';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  content: React.ReactNode;
  dialogWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onClose, content, dialogWidth = 'xs' }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth={dialogWidth}>
      <Box>{content}</Box>
      <Box className="!mt-[20px] flex items-center justify-center gap-[16px]">
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" onClick={onClose}>
          Retry
        </Button>
      </Box>
    </CustomDialog>
  );
};

export default AlertDialog;
