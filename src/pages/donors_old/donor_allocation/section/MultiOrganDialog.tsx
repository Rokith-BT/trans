import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React from 'react'

interface MultiOrganDialogProps{
    open:boolean;
    onClose:()=>void;
}

export const MultiOrganDialog: React.FC<MultiOrganDialogProps> = ({open,onClose}) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="text-[#804595] !text-[23px] !font-[600] !mb-[28px] ">Create Multi Organ Allocation</Text>
        <Box className="flex flex-col gap-y-[28px] mb-[60px]">
          <Input label="Select Organ" fullWidth required />
          <Input label="Allocation Type" fullWidth required />
        </Box>
        <Box className="flex justify-between">
          <Button
            onClick={onClose}
            variant="outlined"
            className="!border-[1px] !border-[#D876A9] w-[150px] !text-[#D876A9]"
          >
            Cancel
          </Button>
          <Button onClick={onClose} variant="contained" className="!border-[1px] !bg-[#A1999F] w-[150px] !text-[white]">
            Submit
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};
