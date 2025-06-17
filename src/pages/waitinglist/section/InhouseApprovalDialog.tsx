import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { ActiveHospital } from '@/types/hospital';
import { useWaitingList } from '../WaitingListContext';
import { useLocation } from 'react-router';
import QS from 'query-string';
import { toast } from '@/utils/toast';

interface InhouseApprovalDialogProps {
  open: boolean;
  onClose: () => void;
}

const InhouseApprovalSchema = z.object({
  hospital: z.number().positive({ message: 'Choose a Hospital' })
  // organs: z.number(),
  // bloodGroup: z.number()
});
type InhouseApprovalType = z.infer<typeof InhouseApprovalSchema>;

const InhouseApprovalDialog: React.FC<InhouseApprovalDialogProps> = ({ open, onClose }) => {
  const location = useLocation();
  const parsedQs = QS.parse(location.search);
  const {
    state: { hospitalNames }
  } = useMasterData();
  const {
    actions: { updateInhouseRank, getInHouseList }
  } = useWaitingList();
  const hospitalOptions = hospitalNames.map((h: ActiveHospital) => ({
    label: h.hospitalName,
    value: h.hospitalId
  }));
  // const organOptions = organs.map((o: Organ) => ({
  //   value: o.id,
  //   label: o.name
  // }));

  const {
    control,
    handleSubmit,
    reset
    // formState: { errors }
  } = useForm<InhouseApprovalType>({
    resolver: zodResolver(InhouseApprovalSchema),
    defaultValues: {
      hospital: 0
      // organs: 0,
      // bloodGroup: 0
    }
  });
  useEffect(() => {
    reset({ hospital: 0 });
  }, [open, reset]);

  const onSubmit = async (data: InhouseApprovalType) => {
    await updateInhouseRank(data.hospital);
    await getInHouseList(parsedQs);
    toast('Successfully Approved', 'success');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Box>
          <Text className="!text-[#804595] !text-[23px] !font-[600]">Final List Approval Details</Text>
          <Box>
            <Box className="mt-[16px]">
              <FormAutoCompleteSelect
                control={control}
                name="hospital"
                menuOptions={hospitalOptions}
                label="Hospital"
                required
              />
            </Box>
            {/* <Box className="mt-[28px]">
              <FormSelect
                control={control}
                name="organs"
                menuOptions={organOptions}
                label="Organs"
                fullWidth
                required
              />
            </Box>
            <Box className="mt-[28px]">
              <FormSelect
                control={control}
                name="bloodGroup"
                menuOptions={bloodGroup}
                label="BloodGroup"
                fullWidth
                required
              />
            </Box> */}
          </Box>
          <Box className="flex items-center justify-between gap-[22px] mt-[60px]">
            <Button variant="outlined" className="w-full" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" className="w-full" type="submit" onClick={handleSubmit(onSubmit)}>
              Apply
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default InhouseApprovalDialog;
