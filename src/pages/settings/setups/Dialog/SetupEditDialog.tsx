/* eslint-disable react/prop-types */
import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CloseCircleIcon } from '@/assets/icons';
import { useMasterData } from '../masterCotext';
import { useEffect } from 'react';

interface AddRecipientDialogProps {
  open: boolean;
  onClose: () => void;
  fieldName: string;
  id: string | number;
  nameValue?: string;
}

const addSchema = z.object({
  name: z.string().optional()
});

const SetupEditDialog: React.FC<AddRecipientDialogProps> = ({ open, onClose, fieldName, id, nameValue }) => {
  const {
    action: { patchCauseOfDeath, patchTerminateReason, patchZones, patchOrgans, patchBloodGroup ,patchDepartment}
  } = useMasterData();
  console.log(nameValue, 'nameValue');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addSchema),
    defaultValues: {
      name: nameValue ? nameValue : ''
    }
  });
  useEffect(() => {
    reset({
      name: nameValue ? nameValue : ''
    });
  }, [reset, nameValue]);
  console.log(errors, 'errors');
console.log(nameValue, 'nameValue');

  const onSubmit = (data: { name: string }) => {
    console.log('data ', data);
    if (fieldName === 'Cause Of Death') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      patchCauseOfDeath(payload, Number(id), () => {
        onClose();
      });
    } else if (fieldName === 'Termination Reason') {
      const payload = {
        name: data.name,
        stageId: 1,
        isActive: 1
      };
      patchTerminateReason(payload, Number(id), () => {
        onClose();
      });
    } else if (fieldName === 'Zone') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      patchZones(payload, Number(id), () => {
        onClose();
      });
    } else if (fieldName === 'Organ') {
      const payload = {
        id: id,
        name: data.name,
        isActive: true,
        isTissue: true,
        isPaymentRequired: true,
        cost: 0,
        serialNo: 0
      };
      patchOrgans(payload, Number(id), () => {
       onClose();
      });
    } else if (fieldName === 'Blood Group') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      patchBloodGroup(payload, Number(id), () => {
        onClose();
      });
    } if (fieldName === 'Department') {
      const payload = {
        name: data.name,
        isActive: 1
      };
      patchDepartment(payload, Number(id), () => {
       onClose();
      });
    }
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="p-5 relative">
        <CloseCircleIcon className="absolute top-0 right-0" toolText="" onClick={onClose} />
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-8">Edit {fieldName}</Text>
        <FormInput control={control} name="name" label={`${fieldName}`} required fullWidth />
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

export default SetupEditDialog;
