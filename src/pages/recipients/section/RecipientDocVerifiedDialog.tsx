import { Box, Button, CustomDialog, Text } from '@/atoms';
import { RecipientALFDTOs } from '@/types/alf';
import { Recipient } from '@/types/recipient';
import React from 'react';

interface documentVerifiedProps {
  open: boolean;
  onClose: () => void;
  data: Recipient | RecipientALFDTOs;
}

const RecipientDocVerifiedDialog: React.FC<documentVerifiedProps> = ({ open, onClose, data }) => {
  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Do want to mark this recipient as
            <span className="!text-[#67B1C9] !text-[16px] !font-[500]"> Document Verified</span> ?
          </Text>

          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{data.id}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {data?.name}</span>
          </Text>
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button className="!bg-[#A1999F] !text-[#F8F8FF]" onClick={onClose}>
            No
          </Button>
          <Button className="!bg-[#67B1C9] !text-[#F8F8FF]" onClick={onClose}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default RecipientDocVerifiedDialog;
