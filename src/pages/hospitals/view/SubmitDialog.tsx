import { SuccessIcon } from '@/assets/icons';
import CloseIcon from '@/assets/icons/Close';
import { Box, CustomDialog, Text } from '@/atoms';
import { useAuth } from '@/routes';
import React from 'react';
import { useNavigate } from 'react-router';

interface SubmittedDialogProps {
  open: boolean;
  onClose: () => void;
}

const SubmittedDialog: React.FC<SubmittedDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const {
    state: { currentUser }
  } = useAuth();
  const isTranstan = currentUser?.userType?.name === 'Transtan';
  const handleClose = () => {
    if (isTranstan) {
      onClose();
      navigate('/hospitals');
    } else {
      onClose();
      window.location.reload();
    }
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="relative p-[30px]">
        <CloseIcon className="absolute h-[30px]  -right-3 -top-1 cursor-pointer" onClick={handleClose} />
        <Box className="flex items-center justify-center flex-col">
          <SuccessIcon />
          <Text className="text-[#A1999F] text-center !font-[500] !text-[16px] !mt-[20px]">Submitted Successfully</Text>
          {isTranstan && (
            <Text
              onClick={() => {
                navigate('/approvals');
              }}
              className="text-[#aa2aaa] underline text-center cursor-pointer !font-[500] !text-[16px] !mt-[20px]"
            >
              Approval Management
            </Text>
          )}
        </Box>
      </Box>
    </CustomDialog>
  );
};
export default SubmittedDialog;
