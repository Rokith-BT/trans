// src/pages/YourPage.tsx
import { Box, Button, FormInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMasterData } from '../setups/masterCotext';
import { toast } from '@/utils/toast';

const PaymentSchema = z.object({
  hospitalRegFees: z.number({ required_error: 'required' }),
  hospitalOrganFees: z.number({ required_error: 'required' }),
  dualOrganFees: z.number({ required_error: 'required' }),
  recipientRegFees: z.number({ required_error: 'required' }),
  recipientTransferFees: z.number({ required_error: 'required' })
});
type PaymentType = z.infer<typeof PaymentSchema>;

const Payments: React.FC = () => {
  const {
    state: { paymentConfig },
    action: { patchPayment }
  } = useMasterData();
  const hospitalSingle = paymentConfig?.[0]?.amount;
  const hospitalMultiOrgan = paymentConfig?.[1]?.amount;
  const recipientSingle = paymentConfig?.[2]?.amount;
  const recipientMultiOrgan = paymentConfig?.[3]?.amount;
  console.log(paymentConfig, 'paymentConfig', hospitalSingle, hospitalMultiOrgan, recipientSingle, recipientMultiOrgan);

  const { control, reset, watch } = useForm<PaymentType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      hospitalRegFees: hospitalSingle || '',
      hospitalOrganFees: hospitalSingle || '',
      dualOrganFees: hospitalMultiOrgan || '',
      recipientRegFees: recipientSingle || '',
      recipientTransferFees: recipientMultiOrgan || ''
    }
  });
  useEffect(() => {
    reset({
      hospitalOrganFees: hospitalSingle || '',
      dualOrganFees: hospitalMultiOrgan || '',
      recipientRegFees: recipientSingle || '',
      recipientTransferFees: recipientMultiOrgan || ''
    });
  }, [reset, hospitalSingle, hospitalMultiOrgan, recipientSingle, recipientMultiOrgan]);
  const hospitalOrganFees = watch('hospitalOrganFees');
  const dualOrganFees = watch('dualOrganFees');
  const recipientRegFees = watch('recipientRegFees');
  const recipientTransferFees = watch('recipientTransferFees');

  const hospitalSingleId = paymentConfig?.[0]?.id;
  const hospitalMultiOrganId = paymentConfig?.[1]?.id;
  const recipientSingleId = paymentConfig?.[2]?.id;
  const recipientMultiOrganId = paymentConfig?.[3]?.id;

  const handleSubmitAmount = (id: number, amount: number) => {
    const payload = {
      id: id,
      amount: amount
    };
    patchPayment(payload, id, () => {
      toast('Success', 'success');
    });
  };

  return (
    <form>
      <Box p={5}>
        <Text className="text-[#804595] !font-semibold !text-lg">Payment Configuration</Text>
        <Box className="w-full">
          <Box className="!flex !gap-[56px] !align-middle mt-[28px]">
            <Text className="!text-[#000] !text-[16px] !font-[500] !mt-2">Hospital Registration Fees</Text>
            <FormInput control={control} name="hospitalRegFees" label="Amount" type="number" fullWidth />
            <Box>
              <Button className="!mr-4" variant="contained">
                Save Changes
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Box>

          <Box className="!flex !gap-[56px] !align-middle mt-[28px]">
            <Text className="!text-[#000] !text-[16px] !font-[500] !mt-2">Hospital Single Organ Fees</Text>
            <FormInput control={control} name="hospitalOrganFees" label="Amount" type="number" fullWidth />
            <Box>
              <Button
                className="!mr-4"
                variant="contained"
                onClick={() => handleSubmitAmount(hospitalSingleId, hospitalOrganFees)}
              >
                Save Changes
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Box>

          {/*  */}
          <Box className="!flex !gap-[70px] !align-middle mt-[28px]">
            <Text className="!text-[#000] !text-[16px] !font-[500] !mt-2">Hospital Dual Organ Fees</Text>

            <FormInput control={control} name="dualOrganFees" label="Amount" type="number" fullWidth />
            <Box>
              <Button
                className="!mr-4 "
                variant="contained"
                onClick={() => handleSubmitAmount(hospitalMultiOrganId, dualOrganFees)}
              >
                Save Changes
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Box>
          {/*  */}

          {/*  */}
          <Box className="!flex !gap-[56px] !align-middle mt-[28px]">
            <Text className="!text-[#000] !text-[16px] !font-[500] !mt-2">Recipient Registration Fees</Text>
            <FormInput control={control} name="recipientRegFees" label="Amount" type="number" fullWidth />
            <Box>
              <Button
                className="!mr-4"
                variant="contained"
                onClick={() => handleSubmitAmount(recipientSingleId, recipientRegFees)}
              >
                Save Changes
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Box>
          {/*  */}

          {/*  */}
          <Box className="!flex !gap-[85px] !align-middle mt-[28px]">
            <Text className="!text-[#000] !text-[16px] !font-[500] !mt-2">Recipient Transfer Fees</Text>
            <FormInput control={control} name="recipientTransferFees" label="Amount" type="number" fullWidth />
            <Box>
              <Button
                className="!mr-4"
                variant="contained"
                onClick={() => handleSubmitAmount(recipientMultiOrganId, recipientTransferFees)}
              >
                Save Changes
              </Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </Box>
          {/*  */}
        </Box>
      </Box>
    </form>
  );
};

export default Payments;
