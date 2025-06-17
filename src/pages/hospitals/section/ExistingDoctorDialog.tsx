import { AtomDatePicker, Box, Button, CustomDialog, FormInput, FormSelect, Text } from '@/atoms';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Role } from '@/types/common.type';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface ExistingDoctorDialogProps {
  open: boolean;
  onClose: () => void;
}

const userExpSchema = z.object({
  role: z.string().min(1, 'role is required'),
  hospitalName: z.string().min(1, 'Previous Hospital Name is required'),
  Period: z.string().min(1, 'Period is required'),
  caseHandled: z.string().min(1, 'Case Handled is required')
});
type UserExpType = z.infer<typeof userExpSchema>;

const ExistingDoctorDialog: React.FC<ExistingDoctorDialogProps> = ({ open, onClose }) => {
  const { control, handleSubmit } = useForm<UserExpType>({
    resolver: zodResolver(userExpSchema),
    defaultValues: {}
  });

  const {
    state: { roles }
  } = useMasterData();
 console.log('User role', roles);
 const roleOptions = roles.map((r: Role) => ({
   value: r.id.toString(),
   label: r.name
 }));

  const onSubmit = (data: UserExpType) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box p={2}>
          <Text className="text-[#804595] !text-[19px] !font-[700]">Edit Work Experience</Text>
          <Box mt={5}>
            <Box className="flex flex-col mb-[60px] gap-y-[28px]">
              <FormSelect menuOptions={roleOptions} control={control} name="role" label="Role" fullWidth required />
              <FormInput control={control} name="hospitalName" label="Pervious Hospital Name" fullWidth required />
              <AtomDatePicker control={control} name="Period" label="Period" fullWidth required />
              <FormInput control={control} name="caseHandled" label="Case Handled" fullWidth required />
            </Box>
          </Box>
          <Box className="flex gap-[22px]">
            <Button variant="outlined" className="w-full !text-[#D876A9] !border-[#D876A9] ">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              className="w-full !text-[#F8F8FF] !bg-[#D876A9]"
            >
              Save
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default ExistingDoctorDialog;
