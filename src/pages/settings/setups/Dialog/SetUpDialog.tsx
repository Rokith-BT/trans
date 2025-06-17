/* eslint-disable react/prop-types */
import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloseCircleIcon } from '@/assets/icons';
import { useMasterData } from '../masterCotext';

interface AddRecipientDialogProps {
  open: boolean;
  onClose: () => void;
  fieldName: string;
  nameValue?: string;
  addMultiOrgan?: () => void;
}

const addSchema = z.object({
  name: z.string().optional()
});

const SetupDialog: React.FC<AddRecipientDialogProps> = ({ open, onClose, fieldName }) => {
  const {
    action: { postCauseOfDeath, postTerminateReason, postZones, postOrgans, postBloodGroup, postDepartment }
  } = useMasterData();
  const {
    control,
    handleSubmit,

    formState: { errors }
  } = useForm({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: ''
    }
  });
  console.log(errors, 'errors');

  const onSubmit = (data: { name: string }) => {
    console.log('data ', data);
    if (fieldName === 'Cause Of Death') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      postCauseOfDeath(payload, () => {
        onClose();
      });
    }
    if (fieldName === 'Termination Reason') {
      const payload = {
        name: data.name,
        stageId: 1,
        isActive: 1
      };
      postTerminateReason(payload, () => {
        onClose();
      });
    }
    if (fieldName === 'Zone') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      postZones(payload, () => {
        onClose();
      });
    }
    if (fieldName === 'Blood Group') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      postBloodGroup(payload, () => {
        onClose();
      });
    }
    if (fieldName === 'Organs') {
      const payload = {
        name: data.name,
        isActive: true,
        isTissue: true,
        isPaymentRequired: true,
        cost: 0
      };
      postOrgans(payload, () => {
        onClose();
      });
    } else if (fieldName === 'Department') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      postDepartment(payload, () => {
        onClose();
      });
    }
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="p-5 relative">
        <CloseCircleIcon className="absolute top-0 right-0" toolText="" onClick={onClose} />
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-8">Add {fieldName}</Text>
        <FormInput control={control} name="name" label={`${fieldName}`} required fullWidth />
        {/* Buttons */}
        <Box className="mt-[30px] flex gap-[10px] justify-between px-0">
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

export default SetupDialog;
