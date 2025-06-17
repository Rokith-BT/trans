import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React from 'react';

interface DonorDelteProps {
  open: boolean;
  onClose: () => void;
}

const DonorDelete: React.FC<DonorDelteProps> = ({ open, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="!text-[#A1999F] !text-[16px] !font-[500] !mb-[16px]">
          Are you sure, Do you want to <span className="text-[#DD2323]">Delete</span> ?
        </Text>
        <Text className="!text-[#A1999F] !text-[16px] !font-[500] !mb-[12px]">
          Donor Name <span className="text-[black]">Shanlini</span>
        </Text>
        <Input label="Reason" fullWidth required />
        <Box mt={5} className="flex gap-4 justify-center">
          <Button onClick={onClose} variant="contained" className="!bg-[#A1999F] w-[82px]">
            No
          </Button>
          <Button onClick={onClose} variant="contained" className="!bg-[#DA2424] w-[82px]">
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DonorDelete;
