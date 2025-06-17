import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useALF } from '../ALFContext';

interface ALFFinialRejectDialogProps {
  open: boolean;
  onClose: () => void;
  alfID: number | string;
  recipientName?: string;
  alfFlog: string;
}

const ALFFinialRejectDialog: React.FC<ALFFinialRejectDialogProps> = ({
  open,
  onClose,
  alfID,
  recipientName,
  alfFlog
}) => {
  const navigate = useNavigate();
  const [validation, setValidation] = useState('');
  const [reason, setReason] = useState('');
  const {
    state: {},
    actions: { rejectALFFinalReview, approveALFFinalReview }
  } = useALF();
  const handleRejectFinalReview = () => {
    if (!reason) {
      setValidation('Required');
      return false;
    }
    alert(reason);
    rejectALFFinalReview(Number(alfID), reason, () => {
      navigate('/alf');
    });
  };
  const handleApproveFinalReview = () => {
    if (!reason) {
      setValidation('Required');
      return false;
    }
    approveALFFinalReview(Number(alfID), reason, () => {
      navigate('/alf');
    });
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to{' '}
            <span className="text-[#DD2323] !font-[500] !text-[16px]">
              {alfFlog === 'Decline' ? 'Reject' : 'Approve'}
            </span>
            ?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{alfID || 0}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {recipientName || ''}</span>
          </Text>

          <Input label="Reason" fullWidth required minRows={4} multiline onChange={(e) => setReason(e.target.value)} />
          {validation && <Box className="!text-[#DD2323]">{validation}</Box>}
        </Box>
        {alfFlog === 'Decline' ? (
          <Box mt={5} className="flex items-center justify-center gap-4">
            <Button onClick={onClose} className="!bg-[#A1999F] !text-[white]">
              No
            </Button>
            <Button onClick={() => handleRejectFinalReview()} className="!bg-[#DA2424] !text-[white]">
              Yes
            </Button>
          </Box>
        ) : (
          <Box mt={5} className="flex items-center justify-center gap-4">
            <Button onClick={onClose} className="!bg-[#A1999F] !text-[white]">
              No
            </Button>
            <Button onClick={() => handleApproveFinalReview()} className="!bg-[#DA2424] !text-[white]">
              Yes
            </Button>
          </Box>
        )}
      </Box>
    </CustomDialog>
  );
};

export default ALFFinialRejectDialog;
