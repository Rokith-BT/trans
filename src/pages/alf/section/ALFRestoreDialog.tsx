import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ALFRestoreDialogProps {
  open: boolean;
  onclose: () => void;
}

const alfRestoreSchema = z.object({
  reason: z.string().min(1, 'Reason is required')
});
type ALFRestoreType = z.infer<typeof alfRestoreSchema>;

const ALFRestoreDialog: React.FC<ALFRestoreDialogProps> = ({ open, onclose }) => {
  const { control } = useForm<ALFRestoreType>({
    resolver: zodResolver(alfRestoreSchema),
    defaultValues: {}
  });
  return (
    <CustomDialog open={open} onClose={onclose} maxWidth="xs">
      <Box>
        <Text className="text-[#A1999F] !text-[16px] !font-[500]">
          Are you sure, Do you want to <span className="text-[#C967A2]">Restore</span>?
        </Text>
        <Box className="mt-[16px]">
          <FormInput
            control={control}
            name="reason"
            label="Reason"
            placeholder="Enter Reason"
            fullWidth
            required
            minRows={4}
            multiline
          />
        </Box>
        <Box className="flex justify-center mt-[28px] gap-[16px] h-[36px]">
          <Button variant="contained" className="!bg-[#A1999F]" onClick={onclose}>
            No
          </Button>
          <Button variant="contained" onClick={onclose}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ALFRestoreDialog;
