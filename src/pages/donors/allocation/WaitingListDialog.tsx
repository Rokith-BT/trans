import { Box, Button, CustomDialog, FormSelect, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Grid } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import data from '@/data/selectData.json';

interface WaitingListDialogProps {
  open: boolean;
  onClose: () => void;
}

export const WaitingListSchema = z.object({
  nationality: z.string().min(1, 'Nationality is required'),
  bloodGroup: z.string().min(1, 'Blood Group is required'),
  ageType: z.string().min(1, 'Age Type is required')
});
export type WaitingListType = z.infer<typeof WaitingListSchema>;

const WaitingListDialog: React.FC<WaitingListDialogProps> = ({ open, onClose }) => {
  const { control } = useForm<WaitingListType>({
    resolver: zodResolver(WaitingListSchema),
    defaultValues: {
      nationality: '',
      bloodGroup: '',
      ageType: ''
    }
  });
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm">
      <Container maxWidth="xl">
        <Text className="!text-[#804595] !text-[16px] !font-[700]">Generate Wait List</Text>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} xl={4} md={6}>
            <FormSelect
              menuOptions={data.numberOption}
              name="nationality"
              control={control}
              label="Nationality"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} xl={4} md={6}>
            <FormSelect
              menuOptions={data.bloodGroupOptions}
              name="bloodGroup"
              control={control}
              label="Blood Group"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} xl={4} md={6}>
            <FormSelect menuOptions={data.RelationType} name="ageType" control={control} label="Age Type" fullWidth />
          </Grid>
        </Grid>
        <Box className="flex justify-end items-end !gap-[16px] !mt-[40px]">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onClose}>
            Submit
          </Button>
        </Box>
      </Container>
    </CustomDialog>
  );
};

export default WaitingListDialog;
