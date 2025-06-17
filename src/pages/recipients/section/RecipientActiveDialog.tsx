import { Box, Button, CustomDialog, Text } from '@/atoms';
import { Recipient } from '@/types/recipient';
import React from 'react';
import { useRecipient } from '../RecipientContext';
import { useNavigate } from 'react-router';
import { RecipientALFDTOs } from '@/types/alf';

interface ActiveDialogProps {
  open: boolean;
  onClose: () => void;
  data: Recipient | RecipientALFDTOs;
}

const RecipientActiveDialog: React.FC<ActiveDialogProps> = ({ open, onClose, data }) => {
  const navigate = useNavigate();
  const {
    state: {},
    actions: { recipientChangeActive }
  } = useRecipient();
  const handleSubmit = () => {
    recipientChangeActive(data.recipientId, 'acive', () => {
      navigate('/recipients?filter%5Bstatus%5D=Active%2CDocumentVerified&page=1&perPage=10#recipients');
    });
  };
  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Do want to mark this recipient as
            <span className="!text-[#80C967] !text-[16px] !font-[500]"> Active</span> ?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{data.recipientId}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {data.name}</span>
          </Text>
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button className="!bg-[#A1999F] !text-[#F8F8FF]" onClick={onClose}>
            No
          </Button>
          <Button className="!bg-[#80C967] !text-[#F8F8FF]" onClick={handleSubmit}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default RecipientActiveDialog;
