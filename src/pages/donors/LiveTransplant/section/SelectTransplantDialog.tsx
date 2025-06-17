import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import { ActiveHospital } from '@/types/hospital';

interface SelectTransplantDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SelectTransplantScheme = z.object({
  hospitalId: z.string().min(1, 'Select Hospital'),
  hospitalName: z.string().optional()
});
export type SelectTransplantType = z.infer<typeof SelectTransplantScheme>;

const SelectTransplantDialog: React.FC<SelectTransplantDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { state } = useHospitals();
  const [hosType, setHosType] = useState('');

  const { activeHospitalList } = state || {};
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SelectTransplantType>({
    resolver: zodResolver(SelectTransplantScheme),
    defaultValues: {
      hospitalId: '',
      hospitalName: ''
    }
  });
  const selectedHospital = watch('hospitalId');

  const hospitalOptions = activeHospitalList
    .filter((l: ActiveHospital) => l.hospitalType.name !== 'NTORC') // Exclude NTORC type hospitals
    .map((l: ActiveHospital) => ({
      value: l.hospitalId,
      label: `${l.hospitalName} (${l.hospitalType.name})`,
      type: l.hospitalType.name
    }));

  useEffect(() => {
    if (selectedHospital) {
      const hospital =
        hospitalOptions.find((e: { value: string | number }) => e.value === selectedHospital)?.label || '';
      const hospitalType =
        hospitalOptions.find((e: { value: string | number }) => e.value === selectedHospital)?.type || '';
      setValue('hospitalName', hospital);
      setHosType(hospitalType);
    }
  }, [selectedHospital, hospitalOptions, setValue]);

  const onSubmit = (data: { hospitalId: number; hospitalName: string; hospitalType: { id: number; name: string } }) => {
    if (!data.hospitalId) {
      return;
    }
    navigate('/livetransplant', {
      state: {
        hospitalID: data.hospitalId,
        hospitalName: data.hospitalName,
        isAddNew: true,
        hospitalType: hosType
      }
    });
  };
  console.log('errors ', errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
        <Box>
          <Text className="!text-[#804595] !text-[19px] !font-[700]">Select Hospital</Text>
          <Box mt={2}>
            <FormAutoCompleteSelect
              name="hospitalId"
              control={control}
              label="Selet Hospital"
              menuOptions={hospitalOptions}
              required={true}
            />
          </Box>
          <Box className="flex gap-4 items-center justify-center mt-[60px]">
            <Button
              className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] !mr-3"
              variant="outlined"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="submit"
              className="!w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#D876A9]"
              variant="contained"
              onClick={() => navigate('/livetransplant/transplantdetails')}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default SelectTransplantDialog;
