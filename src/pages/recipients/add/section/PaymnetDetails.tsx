import { Box, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import RecipientFooter from './RecipientFooter';
import { List, ListItem, Typography } from '@mui/material';
import PaymentDialog from './PaymentDialog';
// import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
// import { toast } from '@/utils/toast';
// import axios from 'axios';
import { useRecipient } from '../../RecipientContext';
import { useNavigate } from 'react-router';

interface PaymantProps {
  readOnly?: boolean;
  onNext: () => void;
  onBack?: () => void;
  isPreview: boolean;
  forCancel?: boolean;
  isPaymentDone?: boolean;
  recipientStatus?: string;
}

const Paymant: React.FC<PaymantProps> = ({ onBack, isPreview, forCancel, isPaymentDone, recipientStatus }) => {
  const navigate = useNavigate();
  // const { Razorpay } = useRazorpay();
  const [openPayDia, setOpenPayDia] = useState(false);
  const { handleSubmit } = useForm({
    // resolver: zodResolver(basicDetailsSchema),
    defaultValues: {}
  });
  const {
    actions: { recipientDraft, recipientPayment, getRecipientPayment },
    state: { currentRecipientID, getRecipientpayments }
  } = useRecipient();

  useEffect(() => {
    if (currentRecipientID) {
      getRecipientPayment(currentRecipientID);
    }
  }, [currentRecipientID]);
  // const amount: string = '1';
  console.log(getRecipientpayments, 'getRecipientpayments');

  const onSubmit = () => {
    if (isPaymentDone) {
      if (recipientStatus === 'ChangeRequest') {
        recipientDraft(currentRecipientID, currentRecipientID);
        navigate('/recipients');
      } else {
        navigate('/recipients');
        return false;
      }
    }
    // const options: RazorpayOrderOptions = {
    //   key: 'rzp_live_E1TEgAPfjZ0OIQ',
    //   amount: Number(amount) * 100, // Amount in paise
    //   currency: 'INR',
    //   name: 'Test Company',
    //   description: 'Test Transaction',
    //   handler: async (response) => {
    //     console.log(response, 'erwerwrwer', response?.razorpay_payment_id);
    //     await handleCapturePayment(response?.razorpay_payment_id);
    //   },
    //   prefill: {
    //     name: 'Naveen Kumar',
    //     email: 'naveen@plenome.com',
    //     contact: '7904573040'
    //   },
    //   theme: {
    //     color: '#F37254'
    //   }
    // };
    // const razorpayInstance = new Razorpay(options);
    // razorpayInstance.open();
    recipientPayment(currentRecipientID);
    navigate('/recipients');
    // setOpenPayDia(true);
    // onNext();
  };
  // const handleCapturePayment = async (paymentId: number) => {
  //   if (!paymentId || !amount) {
  //     alert('Payment ID and Amount are required');
  //     return;
  //   }
  //   const keyId = 'rzp_live_E1TEgAPfjZ0OIQ';
  //   const keySecret = 'eSskg54N7Bulwusbu7dGEMNr';
  //   const url = `https://cors-anywhere.herokuapp.com/https://api.razorpay.com/v1/payments/${paymentId}/capture`;
  //   const encodedAuth = btoa(`${keyId}:${keySecret}`);
  //   const headers = {
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     Authorization: `Basic ${encodedAuth}`
  //   };
  //   const body = new URLSearchParams();
  //   const Amt = Number(amount) * 100;
  //   body.append('amount', Amt.toString());
  //   body.append('currency', 'INR');
  //   try {
  //     const res = await axios.post(url, body, { headers });
  //     console.log(res, 'Capture');
  //     toast('Payment captured successfully', 'success');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handlePayLater = () => {
    recipientDraft(currentRecipientID, currentRecipientID);
    // recipientPayment(currentRecipientID, false);
    navigate('/recipients');
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] ">Payment Details</Text>
          <Text className="text-[#80459580] !font-[600] !mb-7 !text-[19px] ">Amount</Text>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} marginTop={'10px'}>
          <Text className="text-[#804595] !font-[600] !mb-7 !text-[16px] ">Recipient Registration Fee</Text>
          <Text className="text-[#804595] !font-[600] !mb-7 !text-[16px] ">
            {Number(getRecipientpayments?.pendingAmount).toFixed(2)}
          </Text>
        </Box>
        <hr />
        <Box display={'flex'} justifyContent={'space-between'} marginTop={'10px'}>
          <Text className="text-[#C967A2] !font-[600] !mb-7 !text-[16px] ">Total Amount to be Paid</Text>
          <Text className="text-[#C967A2] !font-[600] !mb-7 !text-[16px] ">
            {Number(getRecipientpayments?.pendingAmount).toFixed(2)}
          </Text>
        </Box>
        <Box mt={3} className="relative">
          <Typography fontSize={'16px'} fontWeight={'500'}>
            Note:
          </Typography>
          <List>
            <ListItem>
              <span className="absolute text-5xl left-0 mt-[-26px]">.</span> First verify the Aadhar ID for
              authentication. Patient personal details will be automatically generated.
            </ListItem>
            <ListItem>
              <span className="absolute text-5xl left-0 mt-[-26px]">.</span>Then continue to fill the medical details.
            </ListItem>
            <ListItem>
              <span className="absolute text-5xl left-0 mt-[-26px]">.</span> Payment gateway page will open after you
              submit the registration form.
            </ListItem>
            <ListItem>
              <span className="absolute text-5xl left-0 mt-[-26px]">.</span> Incomplete registration form will not open
              the payment gateway.
            </ListItem>
          </List>
        </Box>
        {isPreview && (
          <RecipientFooter
            onBack={onBack}
            onNext={onSubmit}
            forCancel={forCancel}
            payment={true}
            isPaymentDone={isPaymentDone}
            handlePayLater={handlePayLater}
          />
        )}
      </form>
      <PaymentDialog open={openPayDia} onClose={() => setOpenPayDia(false)} />
    </div>
  );
};
export default Paymant;
