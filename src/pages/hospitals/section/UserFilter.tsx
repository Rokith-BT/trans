import { Box, Button, CustomDialog, FormInput, FormSelect, Text } from '@/atoms';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Role } from '@/types/common.type';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface UserFilterProps {
  open: boolean;
  onClose: () => void;
  isUser?: boolean;
}

const UserFilterSchema = z.object({
  role: z.string().min(1, 'role is required'),
  specialization: z.string().min(1, 'specialization is required'),
  experience: z.string().min(1, 'experience is required'),
  status: z.string().optional()
});
type UserFilterType = z.infer<typeof UserFilterSchema>;

const onSubmit = (data: UserFilterType) => {
  console.log(data);
};

const UserFilter: React.FC<UserFilterProps> = ({ open, onClose, isUser }) => {
  const { control, handleSubmit } = useForm<UserFilterType>({
    resolver: zodResolver(UserFilterSchema),
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box p={2}>
          <Text className="text-[#804595] !text-[16px] !font-[700]">Smart Filter</Text>
          <Box mt={5}>
            <Box className="flex flex-col mb-[60px] gap-y-[28px]">
              <FormSelect control={control} menuOptions={roleOptions} name="role" label="Role" fullWidth required />
              <FormInput control={control} name="specialization" label="Specialization" fullWidth required />
              <FormInput control={control} name="experience" label="Experience" fullWidth required />
              {isUser && <FormInput control={control} name="status" label="Status" fullWidth required />}
            </Box>
          </Box>
          <Box className="flex gap-[22px]">
            <Button variant="outlined" className="w-full !text-[#D876A9] !border-[#D876A9]  " onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              className="w-full !text-[#F8F8FF] !bg-[#D876A9]"
            >
              Apply
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default UserFilter;
