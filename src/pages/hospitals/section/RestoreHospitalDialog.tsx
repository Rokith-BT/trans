import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hospital } from '@/types/hospital';
import { UsersTable } from '@/types/common.type';

interface RestoreHospitalDialogProps {
  open: boolean;
  onClose: () => void;
  hospital?: Hospital | null;
  user?: UsersTable | null;
  // eslint-disable-next-line no-unused-vars
  onRestore?: (id: number, reason: string) => void;
}

const restoreHospitalSchema = z.object({
  restoreHospital: z.string().min(1, 'resotre field is required')
});
type RestoreHospitalType = z.infer<typeof restoreHospitalSchema>;

export const RestoreHospitalDialog: React.FC<RestoreHospitalDialogProps> = ({ open, onClose, hospital, user, onRestore }) => {
  const { control, handleSubmit } = useForm<RestoreHospitalType>({
    resolver: zodResolver(restoreHospitalSchema),
    defaultValues: {
      restoreHospital: ''
    }
  });
  const onSubmit = (data: RestoreHospitalType) => {
    console.log(data);
    if (user) {
      onRestore?.(user.userID, data.restoreHospital);
      onClose();
    }
    if(hospital){
     onRestore?.(hospital.id,data.restoreHospital)
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box p={2}>
          <Text className="!text-[16px] !font-medium !mb-[8px] !text-[grey]">
            Are you Sure, Do you want to <span className="text-[#C967A2]">Restore</span>?
          </Text>
          {hospital && <Text className="text-center !text-[16px] !font-medium !mb-[12px] text-[#1A0616]">{hospital.name}</Text>}
          {user && (
            <Text className="text-center !text-[16px] !font-medium  text-[#1A0616]">Name : {user.userName}</Text>
          )}
          {user && (
            <Text className="text-center !text-[16px] !font-medium !mb-[16px] text-[#1A0616]">
              Role : {user.role?.name}
            </Text>
          )}

          <Box>
            <FormInput
              control={control}
              name="restoreHospital"
              label="Reason"
              fullWidth
              required
              minRows={4}
              multiline
            />
          </Box>
          <Box className="flex justify-center mt-[28px] gap-[16px] h-[36px]">
            <Button className="!text-[white] !bg-[#A1999F] w-[82px] !p-[10px]" onClick={onClose}>
              No
            </Button>
            <Button className="!text-[white] !bg-[#D876A9]  w-[82px] !p-[10px]" onClick={handleSubmit(onSubmit)}>
              Yes
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};
