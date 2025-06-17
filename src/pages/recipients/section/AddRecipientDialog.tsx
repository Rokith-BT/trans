import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import { ActiveHospital } from '@/types/hospital';
import { useForm } from 'react-hook-form';
import { AddRecipientSchema } from '../validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleGreyIcon, TickCircle } from '@/assets/icons';
import { useRole } from '@/hooks/useRole';

interface AddRecipientDialogProps {
  open: boolean;
  onClose: () => void;
  onChange: () => void;
}

const AddRecipientDialog: React.FC<AddRecipientDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { state } = useHospitals();
  const { activeHospitalList } = state || {};
  const [hosType, setHosType] = useState('');
  const [indian, setIndian] = useState<string>('indian');
  const { isHospitalAdmin, hospitalId } = useRole();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(AddRecipientSchema),
    defaultValues: {
      nationality: 'indian',
      hospitalId: hospitalId || 0,
      hospitalName: '',
      hospitalType: { id: 0, name: '' }
    }
  });
  console.log(errors, 'errors');

  const hospitalOptions = activeHospitalList
    .filter((l: ActiveHospital) => l.hospitalType.name !== 'NTORC') // Exclude NTORC type hospitals
    .map((l: ActiveHospital) => ({
      value: l.hospitalId,
      label: `${l.hospitalName} (${l.hospitalType.name})`,
      type: l.hospitalType.name
    }));
  const selectedHospital = watch('hospitalId');
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

  const onSubmit = (data: {
    nationality: string;
    hospitalId: number;
    hospitalName: string;
    hospitalType: { id: number; name: string };
  }) => {
    if (!data.hospitalId) {
      return;
    }
    // const hospitalTypes = ['Private', 'Government'];
    navigate('/recipients/add-recipient', {
      state: {
        nationality: data.nationality,
        hospitalID: data.hospitalId,
        hospitalName: data.hospitalName,
        isAddNew: true,
        hospitalType: hosType
      }
    });
  };
  const handleNationalityChange = (isIndian: string) => {
    setIndian(isIndian);
    setValue('nationality', isIndian, { shouldValidate: true });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="p-5">
        <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">Add Recipient</Text>
        <Text>
          Select Patient Nationality <span className="text-[red] !text-[13px] !font-[500]">*</span>
        </Text>
        {/* Radio Group */}
        <Box mb={2} className="flex items-center !mb-7">
          <Box className="flex gap-4 mt-3">
            <Box
              className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${indian === 'indian' ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
              onClick={() => handleNationalityChange('indian')}
            >
              {indian === 'indian' ? <TickCircle toolText="" /> : <CircleGreyIcon />}
              <Text className="pl-[4px] !text-[13px] !font-[500]">Indian</Text>
            </Box>
            <Box
              onClick={() => handleNationalityChange('international')}
              className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${indian !== 'indian' ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
            >
              {indian === 'indian' ? <CircleGreyIcon /> : <TickCircle toolText="" />}
              <Text className="pl-[4px] !text-[13px] !font-[500]">International</Text>
            </Box>
          </Box>
        </Box>
        {!isHospitalAdmin && (
          <FormAutoCompleteSelect
            name="hospitalId"
            control={control}
            label="Selet Hospital"
            menuOptions={hospitalOptions}
            required={true}
          />
        )}

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

export default AddRecipientDialog;
