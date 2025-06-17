import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useALF } from '../ALFContext';

interface ALFRejectDialogProps {
  open: boolean;
  onClose: () => void;
  alfID: number | string;
  recipientName?: string;
}

const ALFRejectDialog: React.FC<ALFRejectDialogProps> = ({ open, onClose, alfID, recipientName }) => {
  const navigate = useNavigate();
  const [validation, setValidation] = useState('');
  const [reason, setReason] = useState('');
  const {
    state: {},
    actions: { alfReject }
  } = useALF();
  const handleSubmitTransanApprove = () => {
    if (!reason) {
      setValidation('Required');
      return false;
    }
    alfReject(Number(alfID), reason, () => {
      navigate('/alf');
    });
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to <span className="text-[#DD2323] !font-[500] !text-[16px]">Reject</span>?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{alfID}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {recipientName}</span>
          </Text>

          <Input label="Reason" fullWidth required minRows={4} multiline onChange={(e) => setReason(e.target.value)} />
          {validation && <Box className="!text-[#DD2323]">{validation}</Box>}
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button onClick={onClose} className="!bg-[#A1999F] !text-[white]">
            No
          </Button>
          <Button onClick={() => handleSubmitTransanApprove()} className="!bg-[#DA2424] !text-[white]">
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ALFRejectDialog;
