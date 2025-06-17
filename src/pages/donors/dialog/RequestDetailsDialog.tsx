/* eslint-disable react/prop-types */
import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDonor } from '../DonorContext';
import { useNavigate } from 'react-router';
import { DonorStatusType, PontentialDonor } from '@/types/donor';

interface RequestDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  donorStaus: DonorStatusType | null;
  donor: PontentialDonor | null;
}

const DonorDeleteSchema = z.object({
  reason: z.string().min(1, 'Reason is required')
});
export type DonorDeleteType = z.infer<typeof DonorDeleteSchema>;

const RequestDetailsDialog: React.FC<RequestDetailsDialogProps> = ({ open, onClose, donorStaus, donor }) => {
  console.log(donorStaus, 'donorStaus', donor);

  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<DonorDeleteType>({
    resolver: zodResolver(DonorDeleteSchema),
    defaultValues: {
      reason: ''
    }
  });
  const {
    state: {},
    action: { updateDonorStatus }
  } = useDonor();
  const onSubmit = (data: DonorDeleteType) => {
    console.log('delete dialog', data);
    const payload = {
      donorId: donor?.id,
      statusId: donorStaus?.id,
      reason: data.reason
    };
    updateDonorStatus(Number(donor?.id), payload, () => {
      navigate('/donors?page=1&perPage=10#ccd');
    });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">{donorStaus?.name}</Text>
          <Box className="flex gap-10 items-left justify-left mt-[16px] mb-6">
            <Text className="text-[#A1999F] !font-[500] !text[16px] ">
              UID : <span className="!text-[#1A0616] !text-[16] !font-[500]"> {donor?.id}</span>
            </Text>
            <Text className="text-[#A1999F] !font-[500] !text[16px] ">
              Donor Name : <span className="!text-[#1A0616] !text-[16] !font-[500]"> {donor?.name}</span>
            </Text>
          </Box>
          <Box>
            <FormInput control={control} name="reason" fullWidth required label="Reason" multiline minRows={4} />
          </Box>
          <Box className="flex gap-4 items-center justify-center mt-[24px]">
            <Button
              className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] !mr-3"
              variant="outlined"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="submit"
              className="!w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
              variant="contained"
              // onClick={onClose}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </CustomDialog>
  );
};

export default RequestDetailsDialog;
