import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDonor } from '../../DonorContext';
import { useNavigate } from 'react-router';
import { PontentialDonor } from '@/types/donor';

interface DonorDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  isTerminate?: boolean;
  donor: PontentialDonor | null;
}

export const DonorDeleteSchema = z.object({
  reason: z.string().min(1, 'reason is required')
});
export type DonorDeleteType = z.infer<typeof DonorDeleteSchema>;

const DonorDeleteDialog: React.FC<DonorDeleteDialogProps> = ({ open, onClose, isTerminate, donor }) => {
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
      statusId: 4,
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
          <Text className="text-[#A1999F] !font-[500] !text-[16px] !mt-[20px]">
            Are you sure, Do you want to
            {!isTerminate ? (
              <span className="text-[#DD2323] !mb-10"> Delete</span>
            ) : (
              <span className="text-[#DD2323] !mb-10"> Terminate</span>
            )}
            ?
          </Text>
          <Box className="flex flex-col items-center justify-center mt-[16px]">
            <Text className="text-[#A1999F] !font-[500] !text[16px] ">
              UID <span className="!text-[#1A0616] !text-[16] !font-[500]"> {donor?.id}</span>
            </Text>
            <Text className="text-[#A1999F] !font-[500] !text[16px] ">
              Recipient Name <span className="!text-[#1A0616] !text-[16] !font-[500]"> {donor?.name}</span>
            </Text>
          </Box>
          <Box>
            <FormInput
              className="mt-[12px]"
              control={control}
              name="reason"
              fullWidth
              required
              label="Reason"
              multiline
              minRows={4}
            />
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
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </CustomDialog>
  );
};

export default DonorDeleteDialog;
