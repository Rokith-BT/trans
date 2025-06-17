import { Box, Button, FormInput, FormSelect, Text } from '@/atoms';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { HospitalType, Zone } from '@/types/common.type';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHospitals } from '../../hospitalListContext';

export interface AddHospitalProps {
  open: boolean;
  onClose: () => void;
}

const inviteHospitalSchema = z.object({
  hospitalName: z.string().min(1, 'Hospital name is required'),
  zoneId: z.number().min(1, 'Zone is required'),
  hospitalTypeId: z.number().min(1, 'Hospital Type is required'),
  email: z.string().min(1, 'Email is required')
});

interface InviteHospital {
  hospitalName: string;
  zoneId: number;
  hospitalTypeId: number;
  email: string;
}

export const AddHospital: React.FC<AddHospitalProps> = ({ open, onClose }) => {
  const { handleSubmit, control, reset } = useForm<InviteHospital>({
    resolver: zodResolver(inviteHospitalSchema),
    defaultValues: {
      hospitalName: '',
      zoneId: undefined,
      hospitalTypeId: undefined,
      email: ''
    }
  });
  const {
    actions: { postInvite, getAll }
  } = useHospitals();

  const onSubmit = (data: InviteHospital) => {
    const inviteParams = {
      hospitalName: data.hospitalName,
      zoneId: data.zoneId,
      hospitalTypeId: data.hospitalTypeId,
      email: data.email
    };

    postInvite(inviteParams, () => {
      reset({
        // hospitalName: '',
        // zoneId: -1,
        // hospitalTypeId: -1,
        // email: ''
      });
      getAll('?page=1&perPage=10');
      onClose();
    });
  };

  const {
    state: { zones, hospitalTypes }
  } = useMasterData();
  const zoneOptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.id
  }));

  const hospitalTypeOptions = hospitalTypes.map((z: HospitalType) => ({
    label: z.name,
    value: z.id
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
        fullWidth={true}
        PaperProps={{
          style: {
            width: '90%',
            maxWidth: '480px',
            margin: 'auto',
            padding: '20px'
          }
        }}
      >
        <DialogContent>
          <Box>
            <Text className="!text-[#804595] !text-[16px] !font-[700] !mb-6">Add Hospital</Text>
            <Box className="flex flex-col gap-y-7">
              <FormInput
                control={control}
                name="hospitalName"
                label="Hospital Name"
                fullWidth
                required
                placeholder="Enter Here"
              />
              <FormSelect
                control={control}
                name="zoneId"
                menuOptions={zoneOptions}
                label="Zone"
                fullWidth
                required
                placeholder="Enter Here"
              />
              <FormSelect
                control={control}
                name="hospitalTypeId"
                menuOptions={hospitalTypeOptions}
                label="Hospital Type"
                fullWidth
                required
                placeholder="Enter Here"
              />
              <FormInput control={control} name="email" label="Email" fullWidth required placeholder="Enter Here" />
            </Box>
            <Text className="!text-[#A1999F] !font-[400]  !text-[13px]">
              Link will be sent to this Email ID for adding Hospital Details
            </Text>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box className="flex w-full items-center justify-between p-4  gap-3">
            <Button variant="outlined" className="!border-[#D876A9] !text-[#D876A9]" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              className="!bg-[#D876A9]"
              onClick={handleSubmit(onSubmit)}
              fullWidth
            >
              Send Email
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </form>
  );
};
