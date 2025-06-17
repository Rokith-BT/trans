import { PaymentActive } from '@/assets/icons';
import CloseIcon from '@/assets/icons/Close';
import { Box, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useHospital } from '../../hospitalContext';
import { useNavigate } from 'react-router';
import { useAuth } from '@/routes';
import { PaymentInfo } from '@/types/hospital';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  paymentResponse?: PaymentInfo;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, paymentResponse }) => {
  const navigate = useNavigate();
  const { state } = useHospital();

  const { hospital } = state || {};
  const { state: auth } = useAuth();
  const { currentUser } = auth || {};
  console.log('current user ', currentUser);
  const isTranstan = currentUser?.userType?.name === 'Transtan';
  const hospitalName = hospital?.basicDetails?.hospitalName ?? 'NA';

  const isoDate = paymentResponse?.paymentDate;

  // Create a Date object
  const dateObj = new Date(isoDate);

  // Format the date and time
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const handleClose = () => {
    if (isTranstan) {
      const isRecipient = location.pathname.includes('/recipients');
      if (isRecipient) {
        navigate('/recipients/manage-transfer');
      } else {
        navigate('/hospitals');
      }
      onClose();
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
          <Text className="text-[#A1999F] !text-[16px] !font-[500]">Waiting for TRANSTAN Approval</Text>
        </Box>
        <Box className="flex w-full mt-[24px]">
          <Box className="w-1/2">
            <Text className="text-[#A1999F] !text-[16px] font-[500]">TRANSTAN ID</Text>
            <Text className="text-[#A1999F] !text-[16px] font-[500]">Hospital Name</Text>
            <Text className="text-[#A1999F] !text-[16px] font-[500]">Date & Time</Text>
            <Text className="text-[#A1999F] !text-[16px] font-[500]">Payment Mode</Text>
            <Text className="text-[#A1999F] !text-[16px] font-[500]">Payment Receipt Number</Text>
          </Box>
          <Box className="w-1/2 ">
            <Text className="!text-[16px] !font-[500]">{paymentResponse?.transtanId || 'NA'}</Text>
            <Text className="!text-[16px] !font-[500] truncate" title={hospitalName}>
              {paymentResponse?.hospitalName || 'NA'}
            </Text>
            <Text className="!text-[16px] !font-[500] text-nowrap">{`${formattedDate} &  ${formattedTime}`}</Text>
            <Text className="!text-[16px] !font-[500]">{paymentResponse?.paymentMode || 'NA'}</Text>
            <Text className="!text-[16px] !font-[500]">{paymentResponse?.paymentReceiptNumber || 'NA'}</Text>
          </Box>
        </Box>
        {isTranstan ? (
          <Text
            className="!mt-[10px] underline text-center text-[purple] cursor-pointer"
            onClick={() => {
              navigate('/approvals');
            }}
          >
            Approval Management
          </Text>
        ) : (
          ''
        )}
      </Box>
    </CustomDialog>
  );
};

export default PaymentDialog;
