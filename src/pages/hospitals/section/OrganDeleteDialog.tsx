import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { HospitalOrganDocumnets, HospitalsOrgansLicences } from '@/types/organLicense';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useHospitals } from '../hospitalListContext';
import { toast } from '@/utils/toast';
import { useHospital } from '../hospitalContext';

interface OrganDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  data?: HospitalsOrgansLicences | null;
  hospitalData?: HospitalOrganDocumnets | null;
}

const deleteDialogSchema = z.object({
  organDeleteReason: z.string().min(1, 'fill the reason for delete')
});
type DeleteDialogType = z.infer<typeof deleteDialogSchema>;

export const OrganDeleteDialog: React.FC<OrganDeleteDialogProps> = ({ open, onClose, data, hospitalData }) => {
  const {
    actions: { deleteOrganLicenses }
  } = useHospitals();
  const{actions:{getOrganLicenses}}=useHospital()

  const { control, reset, handleSubmit } = useForm<DeleteDialogType>({
    resolver: zodResolver(deleteDialogSchema),
    defaultValues: {
      organDeleteReason: ''
    }
  });
  const hospitalId = data?.hospitalId || hospitalData?.hospitalID;
  const organId = data?.organType?.id || hospitalData?.organs?.id;

  const onSubmit = (reason: DeleteDialogType) => {
    if (!hospitalId || !organId) {
      toast('Error: Missing required data to delete organ license.', 'error');
      return;
    }

    deleteOrganLicenses(hospitalId, organId, reason.organDeleteReason, () => {
      getOrganLicenses({ _all: true });
      toast('Organ deleted successfully', 'success');
      onClose();
    });
  };
  useEffect(() => {
    reset({ organDeleteReason: '' });
  }, [open]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box>
          <Text className="text-[#A1999F] !text-[16px] !mb-[16px] !font-[500]">
            Are you sure, Do you want to <span className="text-[#DD2323]">{hospitalData ? 'Revoke' : 'Delete'}</span>?
          </Text>
          {(data || hospitalData) && (
            <Text className="text-[#1A0616] !text-[16px] !mb-[16px] !font-[500] text-center">
              {data?.organType?.name ?? hospitalData?.organs?.name}
            </Text>
          )}
          <Box>
            <FormInput
              control={control}
              name="organDeleteReason"
              multiline
              minRows={4}
              label="Reason"
              fullWidth
              required
            />
          </Box>
          <Box mt={5} className="flex justify-center gap-[16px]">
            <Button className="!text-[white] w-[82px] !p-[10px]  !bg-[#A1999F]" onClick={onClose}>
              No
            </Button>
            <Button className="!text-[white] w-[82px] !p-[10px] !bg-[#DA2424]" onClick={handleSubmit(onSubmit)}>
              Yes
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};
