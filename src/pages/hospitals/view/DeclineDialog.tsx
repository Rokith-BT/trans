import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import React, { useEffect } from 'react';
import { useHospital } from '../hospitalContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HospitalDetail } from '@/types/hospital';
import { OrganLicense } from '@/types/organLicense';
import { User, UsersTable } from '@/types/common.type';
import { toast } from '@/utils/toast';
import { useNavigate } from 'react-router';

interface DeclineDialogProps {
  open: boolean;
  onClose: () => void;
  data?: HospitalDetail;
  user?: User | UsersTable;
  organLicense?: OrganLicense;
  // eslint-disable-next-line no-unused-vars
  onRejected?: (hospitalId: number, organId: number, reason: string) => void;
  // eslint-disable-next-line no-unused-vars
  onUserReject?: (userId: number, data: string) => void;
}

const rejectSchema = z.object({
  reject: z.string().min(1, 'rejection reason should be filled')
});
export type RejectType = z.infer<typeof rejectSchema>;

const DeclineDialog: React.FC<DeclineDialogProps> = ({
  open,
  onClose,
  data,
  onRejected,
  onUserReject,
  organLicense,
  user
}) => {
  const navigate = useNavigate();
  const {
    actions: { updateHospitalReject }
  } = useHospital();

  const { handleSubmit, control, reset } = useForm<RejectType>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reject: ''
    }
  });
  useEffect(() => {
    if (!open) {
      reset({
        reject: ''
      });
    }
  }, [!open]);

  const onSubmit = (data: RejectType) => {
    if (organLicense) {
      const hospitalId = organLicense ? organLicense.hospitalId : 0;
      const organId = organLicense ? organLicense?.organType?.id : 0;
      onRejected?.(hospitalId, organId, data.reject);
      toast('License Declined Successfully ', 'success');
      onClose();
    } else if (user) {
      const userId = user ? user?.userID : 0;
      onUserReject?.(userId, data.reject);
      toast('User Declined Successfully ', 'success');
      onClose();
    } else {
      updateHospitalReject(data.reject);
      toast('Hospital Declined Successfully ', 'success');
      onClose();
    }

    navigate('/approvals');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box>
          <Text className="!text-[16px] text-[#A1999F] !font-[500] flex gap-2">
            Are you sure , Do you want to <Text className="text-[#DD2323] ">Decline ? </Text>
          </Text>
          <Text className="text-center !text-[16px] !font-[500] !mt-[16px] !mb-[12px]">
            Hospital Name :{' '}
            {data
              ? data.basicDetails?.hospitalName
              : organLicense
                ? organLicense.hospitalName
                : user
                  ? user?.firstName
                  : ''}
          </Text>
          <FormInput control={control} name="reject" label="Reason" fullWidth required multiline minRows={3} />
          <Box className="flex items-center justify-center gap-4 mt-[40px]">
            <Button
              variant="contained"
              className="!bg-[#A1999F] !text-[white] w-[82px] h-[36px] !rounded-[4px]"
              onClick={onClose}
            >
              No
            </Button>
            <Button
              variant="contained"
              className="!bg-[#DD2323] !text-[white] w-[82px] h-[36px] !rounded-[4px]"
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

export default DeclineDialog;
