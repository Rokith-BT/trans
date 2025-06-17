import CloseIcon from '@/assets/icons/Close';
import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import React, { useState } from 'react';
import { useRecipient } from '../RecipientContext';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RecipientApprovalTransferType } from '@/types/recipient';
import { toast } from '@/utils/toast';

interface DeclainDialogProps {
  open: boolean;
  recipientData?: { name: string; recipientId: number };
  cmInsuranceData?: { name: string; recipientId: number };
  onClose: () => void;
  isCMInsurance?: boolean;
  isApprove?: boolean;
  transferData?: RecipientApprovalTransferType;
}

const declineSchema = z.object({
  reason: z.string().min(1, 'Enter a valid reason')
});
type DeclineType = z.infer<typeof declineSchema>;

const DeclainDialog: React.FC<DeclainDialogProps> = ({
  open,
  onClose,
  recipientData,
  cmInsuranceData,
  isCMInsurance,
  isApprove = false,
  transferData
}) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [validation, setValidation] = useState('');
  const {
    actions: { recipientReject, recipientCMInsuranceReject, rejectRecipientTransfer }
  } = useRecipient();

  const { handleSubmit, control } = useForm<DeclineType>({
    resolver: zodResolver(declineSchema),
    defaultValues: {
      reason: ''
    }
  });

  const handleClose = () => {
    onClose();
  };
  const handleSubmitReject = (id: number) => {
    if (reason === '') {
      setValidation('Reason is required');
      return false;
    }
    if (isCMInsurance) {
      recipientCMInsuranceReject(id, reason, () => {
        navigate('/recipients?page=1&perPage=10#recipients');
      });
    } else {
      recipientReject(id, reason, () => {
        toast('Recipient Rejected Successfully', 'success');
        navigate('/recipients?page=1&perPage=10#recipients');
      });
    }
  };

  const onSubmit = (data: DeclineType) => {
    const recipientId = transferData?.recipientId ?? 0;
    const transferId = transferData?.id ?? 0;
    rejectRecipientTransfer(recipientId, transferId, data.reason, () => {
      toast('Recipient Transfer Rejected Successfully', 'success');
      onClose();
      navigate('/approvals?page=1&perPage=10#recipientstransfer');
    });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      {isApprove ? (
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Text className="text-[#A1999F] text-center !font-[500] !text-[16px] !mt-[20px]">
              Are you sure, Do you want to <span className="text-[#DD2323] !mb-10">Reject</span> ?
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
              Are you sure, Do you want to <span className="text-[#DD2323] !mb-10">Reject</span> ?
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
                    handleSubmitReject(Number(cmInsuranceData?.recipientId));
                  } else {
                    handleSubmitReject(Number(recipientData?.recipientId));
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
export default DeclainDialog;
