import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import React from 'react';
import { Hospital } from '@/types/hospital';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsersTable } from '@/types/common.type';

interface DeleteHospitalDialogProps {
  open: boolean;
  onClose: () => void;
  hospital?: Hospital | null;
  user?: UsersTable | null;
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: number, reason: string) => void;
}
const deleteReasonSchema = z.object({
  deletedReason: z.string().min(1, 'fill the reason for delete')
});
type DeleteReasonType = z.infer<typeof deleteReasonSchema>;
export const DeleteHospitalDialog: React.FC<DeleteHospitalDialogProps> = ({
  open,
  onClose,
  hospital,
  user,
  onDelete
}) => {
  // const {
  //   actions: { deleteHospitalUsers }
  // } = useHospital();
  const { control, handleSubmit } = useForm<DeleteReasonType>({
    resolver: zodResolver(deleteReasonSchema),
    defaultValues: {
      deletedReason: ''
    }
  });

  const onSubmit = (data: DeleteReasonType) => {
    console.log(data);
    if (user) {
      const userId = user ? user.userID : 0;
      onDelete?.(userId, data.deletedReason);
      onClose();
    } else if (hospital) {
      const hospitalId = hospital ? hospital.id : 0;
      onDelete?.(hospitalId, data.deletedReason);
      onClose();
    }

    // if (deleteHospitalUsers) {
    //   const userId = user ? user?.userID : 0;
    //   deleteHospitalUsers(data.deletedReason, userId);
    // }
  };

  const isInvalid = hospital ? hospital == null : user == null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box p={2}>
          <Text className="!text-[16px] !font-medium !mb-[16px] !text-[grey]">
            Are you sure, Do you want to <span className="text-[#DD2323]">delete</span>?
          </Text>

          {!isInvalid && (
            <Text className="text-center !text-[16px] !font-medium !mb-[12px] text-[#1A0616]">
              {hospital?.name} {user ? `User Name : ${user.userName}` : ''}
            </Text>
          )}
          <Box className="">
            <FormInput minRows={4} multiline control={control} name="deletedReason" label="Reason" fullWidth required />
          </Box>
          <Box className="flex mt-[40px] gap-[16px] justify-center">
            <Button className="!text-[white] h-[36px] w-[82px] !p-[10px] !bg-[#A1999F]" onClick={onClose}>
              No
            </Button>
            <Button
              className="!text-[white] h-[36px] w-[82px] !p-[10px] !bg-[#DA2424]"
              disabled={isInvalid}
              onClick={handleSubmit(onSubmit)}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};
