import { CircleGreyIcon, TickCircle } from '@/assets/icons';
import { Box, Button, CustomDialog, FormFileInput, FormInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UpdateStatusDialogProps {
  open: boolean;
  onClose: () => void;
}

export const UpdateStatusSchema = z.object({
  report: z.string().min(1, 'Report is required'),
  reason: z.string().min(1, 'Reason is required')
});
export type UpdateStatusType = z.infer<typeof UpdateStatusSchema>;

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({ open, onClose }) => {
  const { control, setValue } = useForm<UpdateStatusType>({
    resolver: zodResolver(UpdateStatusSchema),
    defaultValues: {
      report: '',
      reason: ''
    }
  });
  const [status, setStatus] = useState<string>('accept');
  const handleChange = (isStatus: string) => {
    setStatus(isStatus);
    setValue('report', isStatus, { shouldValidate: true });
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Container maxWidth="xl">
        <Text className="!text-[#1A0616] !text-[16px] !font-[500]">Update Status</Text>
        <Text className="flex">
          Status <span className="text-[red] !text-[13px] !font-[500] ">*</span>
        </Text>
        <Box mb={2} className="flex items-center !mb-7">
          <Box className="flex gap-4 mt-3">
            <Box
              className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${status === 'accept' ? 'bg-[#CFEEBC] text-[#027545]' : ' bg-[#CFEEBC] text-[#027545]'}`}
              onClick={() => handleChange('accept')}
            >
              {status === 'accept' ? <TickCircle toolText="" stroke="#027545" /> : <CircleGreyIcon stroke="#027545" />}
              <Text className="pl-[4px] !text-[13px] !font-[500] ">Accept</Text>
            </Box>
            <Box
              onClick={() => handleChange('decline')}
              className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${status !== 'accept' ? 'bg-[#FFE1E1] text-[#DD2323]' : ' bg-[#FFE1E1] text-[#DD2323]'}`}
            >
              {status === 'accept' ? <CircleGreyIcon stroke="#DD2323" /> : <TickCircle toolText="" stroke="#DD2323" />}
              <Text className="pl-[4px] !text-[13px] !font-[500]">Decline</Text>
            </Box>
          </Box>
        </Box>
        <Grid container spacing={1} mt={2}>
          <Grid item xs={12} xl={12}>
            {status === 'accept' ? (
              <FormFileInput control={control} name="report" label="Report" required fullWidth />
            ) : (
              <FormInput control={control} name="reason" label="Reason" required fullWidth />
            )}
          </Grid>
        </Grid>
        <Box className="flex justify-center items-center gap-3 mt-[28px]">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onClose}>
            Accept
          </Button>
        </Box>
      </Container>
    </CustomDialog>
  );
};

export default UpdateStatusDialog;
