/* eslint-disable react/prop-types */
import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDonor } from '../DonorContext';
import { useEffect } from 'react';

interface TerminationDialogProps {
  open: boolean;
  onClose: () => void;
  id: number;
}
const DonorTerminationSchema = z.object({
  termination: z.number().min(1, 'Termination is required')
});
const TerminationDialog: React.FC<TerminationDialogProps> = ({ open, onClose, id }) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(DonorTerminationSchema),
    defaultValues: {
      termination: 0
    }
  });
  const {
    state: { getTerminations },
    action: { getMasterTerminations, updateDonorStatus }
  } = useDonor();

  useEffect(() => {
    getMasterTerminations();
  }, [open]);
  const termination = getTerminations.map((l: { id: number; name: string }) => ({
    value: l.id,
    label: `${l.name}`
  }));
  const onSubmit = (data: { termination: number }) => {
    console.log(data, 'fcece');
    const payload = {
      donorId: id,
      statusId: 15,
      reason: ''
    };
    updateDonorStatus(id, payload, () => {
      onClose();
    });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="p-5">
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">Termination</Text>
        <FormAutoCompleteSelect
          name="termination"
          control={control}
          label="Termination"
          menuOptions={termination}
          required={true}
        />
        {/* Buttons */}
        <Box className="mt-[40px] flex gap-[10px] justify-between px-0">
          <Button variant="outlined" className="!border-[#D876A9] !text-[#D876A9] w-[164px]" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" className="!bg-[#D876A9] !text-white w-[164px]" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default TerminationDialog;
