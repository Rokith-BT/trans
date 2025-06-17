import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';

interface OrganAllocationDialogProps {
  open: boolean;
  onClose: () => void;
}

const OrganAllocationDialog: React.FC<OrganAllocationDialogProps> = ({ open, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth='xs'>
      <Box>
        <Box>
          <Text>Are you want to organ allocation ?</Text>
        </Box>
        <Box mt={3} className="flex items-center justify-center gap-4">
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

export default OrganAllocationDialog;
