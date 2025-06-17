import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';

interface TransplantDeleteDialogProps {
  open: boolean;
  onClose: () => void;
}


const TransplantDeleteDialog: React.FC<TransplantDeleteDialogProps> = ({ open, onClose }) => {
  return (
    <form>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box>
          <Text className="text-[#A1999F] !font-[500] !text-[16px] !mt-[20px] text-center">
            Are you sure, Do you want to <span className="!text-[red]"> Delete </span>?
          </Text>
          <Box className="flex gap-4 items-center justify-center mt-[26px]">
            <Button variant="outlined" onClick={onClose}>
              No
            </Button>
            <Button variant="contained" onClick={onClose}>
              Yes
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default TransplantDeleteDialog;
