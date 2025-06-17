/* eslint-disable react/prop-types */
import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDonor } from '../DonorContext';
import { useEffect } from 'react';

interface CaseOffAllocationDialogProps {
  open: boolean;
  onClose: () => void;
  id: number;
}
const DonorCaseAllSchema = z.object({
  caseOfficer: z.number().min(1, 'Case Officer is required')
});
const CaseOffAllocationDialog: React.FC<CaseOffAllocationDialogProps> = ({ open, onClose, id }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(DonorCaseAllSchema),
    defaultValues: {
      caseOfficer: 0
    }
  });
  const {
    state: { caseOfficerList },
    action: { getCaseOfficer, putCaseOfficer }
  } = useDonor();
  console.log(errors, 'errors');
  useEffect(() => {
    getCaseOfficer();
  }, [open]);
  const caseOff = caseOfficerList.map((l: { id: number; name: string }) => ({
    value: l.id,
    label: `${l.name}`
  }));
  const onSubmit = (data: { caseOfficer: number }) => {
    console.log(data, 'fcece');
    putCaseOfficer(id, Number(data.caseOfficer), () => {
      onClose();
    });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="p-5">
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">Allocate Case Officer</Text>
        <FormAutoCompleteSelect
          name="caseOfficer"
          control={control}
          label="Case Officer"
          menuOptions={caseOff}
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

export default CaseOffAllocationDialog;
