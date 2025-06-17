import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { HospitalOrganDocumnets, HospitalsOrgansLicences } from '@/types/organLicense';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useHospitals } from '../hospitalListContext';
import { toast } from '@/utils/toast';
import { useHospital } from '../hospitalContext';

interface OrganRestoreDialogProps {
  open: boolean;
  onClose: () => void;
  data?: HospitalsOrgansLicences | null;
  hospitalData?: HospitalOrganDocumnets | null;
}
const restoreDialogSchema = z.object({
  organRestoreReason: z.string().min(1, 'fill the reason for restore')
});
type RestoreDialogType = z.infer<typeof restoreDialogSchema>;

export const OrganRestoreDialog: React.FC<OrganRestoreDialogProps> = ({ open, onClose, data, hospitalData }) => {
  const {
    actions: { restoreOrganLicenses }
  } = useHospitals();
  const {
    actions: { getOrganLicenses }
  } = useHospital();
  console.log('data from restore dialog - organ license ', data);

  const { control, handleSubmit, reset } = useForm<RestoreDialogType>({
    resolver: zodResolver(restoreDialogSchema),
    defaultValues: {
      organRestoreReason: ''
    }
  });
  const hospitalID = data?.hospitalId ?? hospitalData?.hospitalID;
  const organId = data?.organType.id ?? hospitalData?.organs?.id;

  const onSubmit = (reason: RestoreDialogType) => {
    if (!hospitalID || !organId) {
      toast('Error: Missing required data to delete organ license.', 'error');
      return;
    }
    restoreOrganLicenses(hospitalID, organId, reason.organRestoreReason, () => {
      getOrganLicenses({ _all: true });
      toast('Organ restored successfully ', 'success');
      onClose();
    });
  };
  useEffect(() => {
    reset({ organRestoreReason: '' });
  }, [open]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box>
          <Text className="text-[#A1999F] !text-[16px] !font-[500] !mb-[16px]">
            Are you sure, Do you want to <span className="text-[#D876A9]">Restore</span>?
          </Text>
          {(data || hospitalData) && (
            <Text className="text-[#1A0616] !text-[16px] !font-[500] text-center !mb-[16px]">
              {data?.organType?.name || hospitalData?.organs?.name}
            </Text>
          )}
          <Box>
            <FormInput
              control={control}
              name="organRestoreReason"
              label="Reason"
              multiline
              minRows={4}
              fullWidth
              required
            />
          </Box>
          <Box mt={5} className="flex justify-center gap-[16px]">
            <Button className="!text-[white] w-[28px] px-[10px] !bg-[#A1999F]" onClick={onClose}>
              No
            </Button>
            <Button className="!text-[white] w-[28px] px-[10px] !bg-[#D876A9]" onClick={handleSubmit(onSubmit)}>
              Yes
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};
