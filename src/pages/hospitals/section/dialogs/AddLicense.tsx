import { Box, Button, FormSelect, Text } from '@/atoms';
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useHospitals } from '../../hospitalListContext';
import { Hospital } from '@/types/hospital';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface AddLicenseProps {
  open: boolean;
  onClose: () => void;
}

const addLicenseSchema = z.object({
  hospitalName: z.string().min(1, 'Please select a hospital')
});

interface AddHospitalInput {
  hospitalName: string
}

export const AddLicense: React.FC<AddLicenseProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const {
    state: { list },
    actions: { getAll }
  } = useHospitals();
  useEffect(() => {
    getAll({});
  }, []);
  const hospitalNames = list.map((h: Hospital) => ({
    label: h.name,
    value: h.id.toString()
  }));
  const { control, handleSubmit } = useForm<AddHospitalInput>({
    resolver: zodResolver(addLicenseSchema),
    defaultValues: {
      hospitalName: ''
    }
  });
  const handleSendEmail = (data: AddHospitalInput) => {
    navigate('/hospitals/add-organ-license');
    console.log(data);
    onClose();
  };
  const onSubmit = (data: AddHospitalInput) => {
    handleSendEmail(data);
  };

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
            maxWidth: '400px',
            margin: 'auto',
            padding: '20px'
          }
        }}
      >
        <DialogContent>
          <Box>
            <Text className="!text-[#804595] !text-[16px] !font-[700] !mb-6">Add License</Text>
            <FormSelect
              control={control}
              name="hospitalName"
              menuOptions={hospitalNames}
              label="Hospital Name"
              fullWidth
              required
              placeholder="Enter Here"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box className="flex w-full items-center justify-between p-4  gap-3">
            <Button variant="outlined" className="!border-[#D876A9] !text-[#D876A9]" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button variant="contained" className="!bg-[#D876A9]" onClick={handleSubmit(onSubmit)} fullWidth>
              Send Email
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </form>
  );
};
