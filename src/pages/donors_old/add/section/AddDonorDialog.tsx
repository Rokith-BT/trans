import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useNavigate } from 'react-router';

interface AddDonorDialogProps {
  open: boolean;
  onClose: () => void;
}

const AddDonorDialog: React.FC<AddDonorDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="p-2">
        <Text className="text-[#A1999F] !mb-[40px] !text-[16px] !font-[500]">Are you sure, If you cancel this process this details wont be saved ?</Text>
        <Box className="flex justify-center gap-[16px]">
          <Button className="!text-[#F8F8FF] !bg-[#A1999F]" onClick={onClose}>
            No
          </Button>
          <Button className="!text-[#F8F8FF] !bg-[#D876A9]" onClick={() => navigate('/donors')}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default AddDonorDialog;
