import { Box, Button, CustomDialog, Input, Text } from '@/atoms';
import { Recipient } from '@/types/recipient';
import React from 'react';

interface deleteDialogProps {
  open: boolean;
  onClose: () => void;
  data: Recipient;
}

const RecipientDeleteDialog: React.FC<deleteDialogProps> = ({ open, onClose, data }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to <span className="text-[#DD2323] !font-[500] !text-[16px]">delete</span>?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{data.id}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {data.recipientName}</span>
          </Text>

          <Input label="Reason" fullWidth required minRows={4} multiline />
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button onClick={onClose} className="!bg-[#A1999F] !text-[white]">
            No
          </Button>
          <Button onClick={onClose} className="!bg-[#DA2424] !text-[white]">
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default RecipientDeleteDialog;
