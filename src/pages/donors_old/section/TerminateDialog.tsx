import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React from 'react';

interface TerminateDialogProps {
  open: boolean;
  onClose: () => void;
}

const TerminateDialog: React.FC<TerminateDialogProps> = ({open,onClose}) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth='xs'>
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to <span className="text-[red] !font-[500] !text-[16px]">Terminate</span>?
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500]">
            Donor Name <span className="!text-[#1A0616] !font-[500]">Franklin Paul</span>
          </Text>

          <Input label="Reason" fullWidth required />
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button onClick={onClose} className="!bg-[#A1999F] !text-[white]">
            No
          </Button>
          <Button onClick={onClose} className="!bg-[#DA2424] !text-[white]">
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default TerminateDialog;
