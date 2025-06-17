import { Box, Button, CustomDialog, Text } from '@/atoms';
import { RecipientALFDTOs } from '@/types/alf';
import { Recipient } from '@/types/recipient';
import React from 'react';

interface RecipientRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  data?: Recipient | RecipientALFDTOs;
}
const RecipientRestoreDialog: React.FC<RecipientRestoreDialogProps> = ({ open, onClose, data }) => {
  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are you sure, Do you want to undo the delete for this
            <span className="!text-[#C9A267] !text-[16px] !font-[500]"> Recipient</span> ?
          </Text>

          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{data ? data.id : 'NA'}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {data ? data?.name : 'NA'}</span>
          </Text>
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button className="!bg-[#A1999F] !text-[#F8F8FF]" onClick={onClose}>
            No
          </Button>
          <Button className="!bg-[#C9A267] !text-[#F8F8FF]" onClick={onClose}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default RecipientRestoreDialog;
