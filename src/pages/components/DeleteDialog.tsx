// eslint-disable no-unused-vars
import { Button, CustomDialog, Text } from '@/atoms';
import { Box } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line no-unused-vars
  onDelete: (val: string) => void;
  // eslint-disable-next-line no-unused-vars
  setReason: Dispatch<SetStateAction<string>>;
  validation: string;
}
const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, data, onDelete, setReason, validation }) => {
  return (
    <CustomDialog open={open} onClose={onClose}>
      <Box>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to <span className="text-[#DD2323] !font-[500] !text-[16px]">Delete</span>?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]">{data.recipientId}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            Recipient Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {data.name}</span>
          </Text>

          <textarea
            onChange={(e) => {
              setReason(e.target.value);
            }}
            placeholder="Reason"
            className="h-18 w-full border-[#804595] border-[2px] mt-6 p-2 rounded-md"
          />
          {validation && <span className="text-[#DA2424] text-sm">{validation}</span>}
        </Box>
        <Box mt={3} className="flex items-center justify-center gap-4">
          <Button
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] !mr-3"
            variant="outlined"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            onClick={() => onDelete('delete')}
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DeleteDialog;
