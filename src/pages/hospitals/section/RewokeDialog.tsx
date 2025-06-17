import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React from 'react';
import { Licience } from './OneHospital';

interface RewokeDialogProps {
  open: boolean;
  onClose: () => void;
  data?: Licience;
}

export const RewokeDialog: React.FC<RewokeDialogProps> = ({ open, onClose, data }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="text-[#A1999F] !mb-[16px] !font-[500] !text-[16px]">
          Are you sure, Do you want to <span className="text-[#DD2323] font-[500] text-[16px]">Rewoke License</span>?
        </Text>
        {data && <Text className="!text-[16px] !mb-[12px] !font-[500]">{data.organs} License</Text>}
        <Input label="Reason" fullWidth required multiline minRows={5} />
        <Text className="text-[#A1999F] !mt-[4px] !font-[400] !text-[13px]">
          License will be Rewoked in <span className="text-[#804595]">24 hours</span>
        </Text>
        <Box className="mt-[28px] flex justify-center gap-4">
          <Button onClick={onClose} className="!text-[white] !bg-[#A1999F] !p-[10px] ">
            No
          </Button>
          <Button onClick={onClose} className="!text-[white] !bg-[#DA2424] !p-[10px]">
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};
