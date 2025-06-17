import { Box, Button, CustomDialog, Text } from '@/atoms';
import PaymentDialog from '@/pages/hospitals/add/sections/PaymentDialog';
import { TransferData } from '@/types/recipient';
import React, { useState } from 'react';
import { useRecipient } from '../RecipientContext';

interface RecipientPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  TransferData?: TransferData;
}

const RecipientPaymentDialog: React.FC<RecipientPaymentDialogProps> = ({ open, onClose, TransferData }) => {
  const {
    actions: { recipientTransfer }
  } = useRecipient();
  const PaymentInfo = {
    transtanId: 'GEMTN1234',
    hospitalName: 'Maha',
    paymentStatus: 'Health Care Hospital, Perungudi',
    paymentDate: '08/01/2025 12:47',
    paymentMode: 'UPI',
    paymentReceiptNumber: '5345365'
  };
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const recipientId = TransferData?.recipientId ?? 0;
  const handleTransferClick = () => {
    setOpenPaymentDialog(true);
    recipientTransfer(recipientId, TransferData);
  };

  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Text className="text-[#A1999F] !text-[16px] !font-[500] ">
          Are you sure, Do you want to make the payment and initiate transfer?
        </Text>
        <Box className=" flex items-center justify-center gap-[16px] !mt-[28px]">
          <Button variant="contained" className="!bg-[#A1999F] !text-[#F8F8FF]" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" className="!bg-[#D876A9] !text-[#F8F8FF]" onClick={handleTransferClick}>
            Yes
          </Button>
        </Box>
      </Box>
      <PaymentDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        paymentResponse={PaymentInfo}
      />
    </CustomDialog>
  );
};

export default RecipientPaymentDialog;
