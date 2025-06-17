import { Box, Button, CustomDialog, FormFileInput, Text } from '@/atoms';
import { Recipient } from '@/types/recipient';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRecipient } from '../RecipientContext';

interface CMInsuranceDialogProps {
  open: boolean;
  onClose: () => void;
  recipientData: Recipient;
}
export const cmAttachSchema = z.object({
  cminsuranceDoc: z.any().refine((file) => file !== undefined, 'CM Insurance is Required')
});
const CMInsuranceDialog: React.FC<CMInsuranceDialogProps> = ({ open, onClose, recipientData }) => {
  const [file, setFile] = useState('');
  console.log(file);
  const {
    actions: { recipientCMInsuranceInsert },
    state: {}
  } = useRecipient();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(cmAttachSchema),
    defaultValues: {
      cminsuranceDoc: ''
    }
  });
  const onSubmit = (data: { cminsuranceDoc: string }) => {
    recipientCMInsuranceInsert(recipientData?.recipientId, data?.cminsuranceDoc, () => {
      onClose();
    });
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box mt={1} className="relative">
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">Apply CM Insurance</Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormFileInput
            control={control}
            name="cminsuranceDoc"
            label="CM Insurance Approval Document"
            fullWidth
            disabled={false}
            filePath={`recipient/${recipientData?.recipientId}/liver`}
            fileData={''}
            setOpenImgModal={() => {}}
            setFile={setFile}
          />
          <Box mt={3} className="flex items-right justify-right gap-4">
            <Button className="!bg-[#A1999F] !text-[#F8F8FF] !px-8" onClick={onClose}>
              Cancel
            </Button>
            <Button className="!bg-[#D876A9] !text-[#F8F8FF] !px-8" onClick={handleSubmit(onSubmit)}>
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </CustomDialog>
  );
};

export default CMInsuranceDialog;
