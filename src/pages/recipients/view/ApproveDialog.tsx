import CloseIcon from '@/assets/icons/Close';
import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';

import React, { useState } from 'react';
import { useRecipient } from '../RecipientContext';
import { useNavigate } from 'react-router';
import { RecipientApprovalTransferType } from '@/types/recipient';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/utils/toast';

interface ApproveDialogProps {
  open: boolean;
  recipientData?: { name: string; recipientId: number };
  cmInsuranceData?: { name: string; recipientId: number };
  transferData?: RecipientApprovalTransferType;
  onClose: () => void;
  isCMInsurance?: boolean;
  isApprove?: boolean;
}
const approvalSchema = z.object({
  reason: z.string().min(1, 'Enter a valid reason')
});
type ApprovalType = z.infer<typeof approvalSchema>;

const ApproveDialog: React.FC<ApproveDialogProps> = ({
  open,
  onClose,
  recipientData,
  cmInsuranceData,
  isCMInsurance,
  transferData,
  isApprove = false
}) => {
  console.log(cmInsuranceData, 'cmInsuranceData');
  const [reason, setReason] = useState('');
  const [validation, setValidation] = useState('');
  const navigate = useNavigate();
  const {
    actions: { recipientApprove, recipientCMInsuranceApprove, approveRecipientTransfer }
  } = useRecipient();
  const { handleSubmit, control } = useForm<ApprovalType>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      reason: ''
    }
  });
  const handleClose = () => {
    onClose();
  };
  const handleSubmitApprove = (id: number) => {
    if (reason === '') {
      setValidation('Reason is required');
      return false;
    }
    if (isCMInsurance) {
      recipientCMInsuranceApprove(id, reason, () => {
        navigate('/recipients?page=1&perPage=10#recipients');
      });
    } else {
      recipientApprove(id, reason, () => {
        navigate('/recipients?page=1&perPage=10#recipients');
      });
    }
  };

  const onSubmit = (data: ApprovalType) => {
    const recipientId = transferData?.recipientId ?? 0;
    const transferId = transferData?.id ?? 0;
    approveRecipientTransfer(recipientId, transferId, data.reason, () => {
      toast('Recipient Transfer Approved Successfully', 'success');
      onClose();
      navigate('/approvals?page=1&perPage=10#recipientstransfer');
    });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      {isApprove ? (
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text className="flex items-center gap-2 text-[#A1999F] !font-[500] text-[16px]">
              Are you sure , Do you want to <Text className="text-[#80C967] !font-[500] !text-[16px]">Transfer ?</Text>
            </Text>
            <Box className="flex flex-col items-center justify-center mt-[16px]">
              <Text className="text-[#A1999F] !font-[500] !text[16px] ">UID: {transferData?.id} </Text>
              <Text className="text-[#A1999F] !font-[500] !text[16px] ">
                Recipient Name: {transferData?.recipientName}
              </Text>
            </Box>
            <Box>
              <FormInput
                className="mt-[12px]"
                control={control}
                name="reason"
                fullWidth
                required
                label="Reason"
                multiline
                minRows={2}
              />
            </Box>
            <Box className="flex gap-4 items-center justify-center mt-[24px]">
              <Button
                className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] !mr-3"
                variant="outlined"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                type="submit"
                className="!w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      ) : (
        <Box className="relative p-[30px]">
          <CloseIcon className="absolute h-[30px]  -right-3 -top-1 cursor-pointer" onClick={handleClose} />
          <Box textAlign={'center'}>
            <Text className="text-[#A1999F] text-center !font-[500] !text-[16px] !mt-[20px]">
              Are you sure, Do you want to <span className="text-[#80C967] !mb-10">Approve</span> ?
            </Text>
            <Text className="!mt-6">
              <span className="text-[#A1999F]">UID</span>{' '}
              {recipientData?.recipientId ? recipientData?.recipientId : cmInsuranceData?.recipientId}
            </Text>
            <Text>
              <span className="text-[#A1999F]">Recipient Name</span>{' '}
              {recipientData?.name ? recipientData?.name : cmInsuranceData?.name}
            </Text>
            <textarea
              onChange={(e) => {
                setReason(e.target.value);
              }}
              placeholder="Reason"
              className="h-18 w-full border-[#804595] border-[2px] mt-6 p-2 rounded-md"
            />
            {validation && <span className="text-[#DD2323] text-sm !text-left">{validation}</span>}
            <Box className="mt-4">
              <Button
                className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] !mr-3"
                variant="outlined"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
                onClick={() => {
                  if (isCMInsurance) {
                    handleSubmitApprove(Number(cmInsuranceData?.recipientId));
                  } else {
                    handleSubmitApprove(Number(recipientData?.recipientId));
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </CustomDialog>
  );
};
export default ApproveDialog;
