import { PaymentActive } from '@/assets/icons';
import CloseIcon from '@/assets/icons/Close';
import { Box, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/routes';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const {
    state: { currentUser }
  } = useAuth();
  console.log('current user ', currentUser);
  const isTranstan = currentUser?.userType?.name === 'Transtan';

  const handleClose = () => {
    if (isTranstan) {
      onClose();
      navigate('/recipients');
    } else {
      onClose();
      window.location.reload();
    }
  };
  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="sm">
      <Box className="p-5 relative">
        <CloseIcon className="absolute top-0 -right-1 h-[25px] w-[25px] cursor-pointer" onClick={handleClose} />
        <Box className="flex flex-col gap-y-[5px] items-center justify-center relative">
          <Box className="absolute inset-0">
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className={`absolute bg-[#42e942] rounded-full w-2 h-2
                  animate-float`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></span>
            ))}
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className={`absolute bg-[#eb9b08] rounded-full w-2 h-2
                  animate-float`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></span>
            ))}
          </Box>
          <PaymentActive className="relative z-10" />
          <Text className="text-[#A1999F] !text-[16px] !font-[500]">Payment Successful</Text>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default PaymentDialog;
