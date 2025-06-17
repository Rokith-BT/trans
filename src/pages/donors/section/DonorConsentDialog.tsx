import { CircleGreyIcon, CloseCircleIcon, TickCircle } from '@/assets/icons';
import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import { ActiveHospital } from '@/types/hospital';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { useDonor } from '../DonorContext';

interface DonorConsentDialogProps {
  open: boolean;
  onClose: () => void;
}
const DonorAddSchema = z.object({
  hospitalId: z.number({ required_error: 'Choose a Hospital', invalid_type_error: 'Choose a Hospital' })
});

const DonorConsentDialog: React.FC<DonorConsentDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [consent, setconsent] = useState<string>('yes');
  const { state } = useHospitals();
  const { activeHospitalList } = state || {};
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(DonorAddSchema),
    defaultValues: {
      hospitalId: 0
    }
  });
  console.log(activeHospitalList, 'activeHospitalList');
  const {
    action: { getDonarDataByID }
  } = useDonor();

  const hospitalOptions = activeHospitalList
    .filter((l: ActiveHospital) => l.hospitalType.name !== 'NTORC') // Exclude NTORC type hospitals
    .map((l: ActiveHospital) => ({
      value: l.hospitalId,
      label: `${l.hospitalName} (${l.hospitalType.name})`,
      type: l.hospitalType.name
    }));
  const onSubmit = (data: { hospitalId: number }) => {
    getDonarDataByID(0);
    if (consent === 'no') {
      navigate('/donors/donor-basic-details', { state: { isConsentGiven: false, hospitalId: data.hospitalId } });
    } else {
      navigate('/donors/add-donor', {
        state: { isAddNew: true, isConsentGiven: true, hospitalId: data.hospitalId }
      });
    }
  };
  const handleConsentChange = (consent: string) => {
    setconsent(consent);
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="relative">
        <CloseCircleIcon className="absolute top-[-10px] right-[-10px]" onClick={onClose} toolText="" />
        <Text className="!text-[#A1999F] !text-[16px] !font-[500] !mb-6">Dose the Consent Given for the Donor?</Text>
        <FormAutoCompleteSelect
          name="hospitalId"
          control={control}
          label="Selet Hospital"
          menuOptions={hospitalOptions}
          required={true}
        />
        <Box mb={4} className="flex items-center !mb-7 !mt-4">
          <Box className="flex gap-4 mt-3">
            <Box
              className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${consent === 'yes' ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
              onClick={() => handleConsentChange('yes')}
            >
              {consent === 'yes' ? <TickCircle toolText="" /> : <CircleGreyIcon />}
              <Text className="pl-[4px] !text-[13px] !font-[500]">Yes</Text>
            </Box>
            <Box
              onClick={() => handleConsentChange('no')}
              className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${consent !== 'yes' ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
            >
              {consent === 'yes' ? <CircleGreyIcon /> : <TickCircle toolText="" />}
              <Text className="pl-[4px] !text-[13px] !font-[500]">No</Text>
            </Box>
          </Box>
        </Box>
        <Box mt={2} className="flex items-center justify-center gap-4 mt-4">
          
          <Box className="flex gap-[10px] justify-between px-0 items-center">
            <Button variant="outlined" className="!border-[#D876A9] !text-[#D876A9] w-[144px]" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              className="!bg-[#D876A9] !text-white w-[144px]"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DonorConsentDialog;
