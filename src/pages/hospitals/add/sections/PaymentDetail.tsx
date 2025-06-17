import { Box, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { HospitalApprovedOrganType } from '../validators';
import FooterButton from './FooterButton';

import PaymentDialog from './PaymentDialog';
import { InforCircleIcon } from '@/assets/icons';
import { HospitalApprovedOrganType1 } from '../NonNtorcHospital';
import { useHospital } from '../../hospitalContext';

export interface TransplantRegisterDeatilsProps {
  // eslint-disable-next-line no-unused-vars
  onNext: (data: HospitalApprovedOrganType) => void;
  onBack?: () => void;
  reCheck?: boolean;
  payData?: HospitalApprovedOrganType;
  isMakePayment?: boolean;
  isView?: boolean;
}

const PaymentDetail: React.FC<TransplantRegisterDeatilsProps> = ({
  onNext,
  onBack,
  reCheck = true,
  payData,
  isView = false
}) => {
  const [transplantData, setTransPlantData] = useState<HospitalApprovedOrganType1>();
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paidStatus, setPaidStatus] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState();
  const {
    // state: { hospital },
    actions: { updatePaymnetStatus }
  } = useHospital();

  const selectedOrgans = payData ? Object.values(payData) : [];
  const organFee = selectedOrgans.reduce((sum, organ) => sum + (organ?.cost || 0), 0);
  const updateRegFee = selectedOrgans.length >= 2 ? 500000 : 200000;
  const updatedTotalAmount = updateRegFee + organFee;
  useEffect(() => {
    if (payData) {
      setTransPlantData(Object.values(payData));
    }
  }, [payData]);

  const handleSubmit = () => {
    if (transplantData) {
      onNext(transplantData);
    }
  };

  return (
    <Box>
      <Box mt={5} mb={10} className="">
        <Box className="!text-[#804595]">
          <Box mb={3} className="flex justify-between items-center ">
            <Text className="!font-[600] !text-[19px]">Payment Details</Text>
            <Text className="!font-[600] !text-[#80459580] !text-[19px]">Amount INR </Text>
          </Box>
          <Box className="flex justify-between items-center ">
            <Text className="!font-[600] !text-[16px]">Hospital Registration Fee</Text>
            <Text className="!font-[600] !text-[16px]">₹ {updateRegFee}</Text>
          </Box>
          {selectedOrgans.map((organ, index) => (
            <Box key={index} className="flex justify-between items-center">
              <Text className="!font-[600] !text-[16px]">{organ?.organ?.name || 'Unknown Organ'}</Text>
              <Text className="!font-[600] !text-[16px]">{organ?.organ?.cost || '1'}</Text>
            </Box>
          ))}
          <Box mt={3}>
            <hr className="!border-[#A1999F] border-[1px]" />
          </Box>
          <Box mt={2} className="flex justify-between items-center !text-[#C967A2]">
            <Text className="!font-[600] !text-[16px]">{!isView ? 'Total amount to be paid' : 'Paid'}</Text>
            <Text className="!font-[600] !text-[16px]">₹ {updatedTotalAmount}</Text>
          </Box>
          {paidStatus && (
            <Box className="flex justify-end items-center gap-1">
              <InforCircleIcon className="cursor-pointer" onClick={() => setOpenPaymentDialog(true)} />
              <Text className="!text-[11px] rounded-xl text-[#027545] px-2 py-[2px] bg-[#CFEEBC] !font-[500]">
                Paid
              </Text>
            </Box>
          )}
        </Box>
        {!isView && (
          <Box className="mt-[48px] ">
            <Text className="!text-[16px] !font-[500]">Note:-</Text>
            <Box mt={2}>
              <ul className="list-disc pl-8 !text-[13px] !font-[400]">
                <li>
                  First verify the Aadhar ID for authentication. Patient personal details will be automatically
                  generated.
                </li>
                <li>Then continue to fill the medical details.</li>
                <li>Payment gateway page will open after you submit the registration form.</li>
                <li>Incomplete registration form will not open the payment gateway.</li>
              </ul>
            </Box>
          </Box>
        )}
        {reCheck && (
          <FooterButton
            onSubmit={() => {
              handleSubmit;
              updatePaymnetStatus((res) => {
                setPaymentResponse(res?.paymentinfo);
              });
              setOpenPaymentDialog(true);
              setPaidStatus(true);
            }}
            payment={true}
            onBack={onBack}
          />
        )}
      </Box>
      <PaymentDialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        data={payData}
        paymentResponse={paymentResponse}
      />
    </Box>
  );
};

export default PaymentDetail;
