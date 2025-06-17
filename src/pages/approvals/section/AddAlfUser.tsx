import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React from 'react';

interface AddAlfUserProps {
  open: boolean;
  onClose: () => void;
}

export const AddALFUser: React.FC<AddAlfUserProps> = ({ open, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="text-[#804595] !text-[16px] !font-[700]">Add Doctor</Text>
        <Box mt={2}>
          <Box className="w-full">
            <Input label="Doctor UID" fullWidth required />
          </Box>
        </Box>
        <Box className="flex justify-between gap-4 mt-[60px]">
          <Button variant="outlined" className="!text-[#D876A9] !border-[#D876A9] p-[10px] w-full h-[44px]" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" className="!text-[white] !bg-[#D876A9] p-[10px] w-full h-[44px]" onClick={onClose}>
            Add
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};
