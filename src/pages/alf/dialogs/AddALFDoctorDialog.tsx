import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { RecipientAlfDoctor } from '@/types/alf';
import { ConsultantList } from '@/types/common.type';
import { zodResolver } from '@hookform/resolvers/zod';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

interface AddALFDoctorDialogProps {
  open: boolean;
  onClose: () => void;
  AllConsultants: RecipientAlfDoctor[];
}

const addALFSchema = z.object({
  selectConsultant: z.number({
    required_error: 'Choose a Consultant',
    invalid_type_error: 'Type error'
  })
});
type AddALFType = z.infer<typeof addALFSchema>;

const AddALFDoctorDialog: React.FC<AddALFDoctorDialogProps> = ({ open, onClose, AllConsultants }) => {
  const navigate = useNavigate();
  const { state } = useMasterData();
  console.log('con', AllConsultants);

  const { consultant } = state || {};
  // console.log('ccc', consultants);
  console.log('ccc', consultant, AllConsultants);

  const consultantOptions = consultant
    ?.filter(
      (c: ConsultantList) =>
        Array.isArray(AllConsultants) &&
        !AllConsultants.some(
          (existingConsultant: RecipientAlfDoctor) => existingConsultant?.consultant?.id === c.userID
        )
    )
    .map((c: ConsultantList) => ({
      label: c.userName,
      value: c.userID
    }));

  const { handleSubmit, control } = useForm<AddALFType>({
    resolver: zodResolver(addALFSchema),
    defaultValues: {
      selectConsultant: undefined
    }
  });

  //   const handleChangebySearch = (value: boolean) => {
  //     setIsTranstanId(value);
  //     setIsRegPhone(true);
  //   };
  const onSubmit = (data: AddALFType) => {
    console.log('data', data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const consultantId: string | number = data.selectConsultant || '';
    const selectedConsultant = consultant.find((c: ConsultantList) => c.userID === consultantId);
    console.log('sss', selectedConsultant, consultant);

    const hospitalId = selectedConsultant.hospitalID;
    navigate(`/hospitals/${hospitalId}/view-users`, { state: { selectedConsultant, isAlfDoctor: true } });
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Text className="text-[#804595] !text-[19px] !font-[600]">Add ALF Doctor</Text>
          <Box mt={3}>
            {/* <FormSelect
              name="selectConsultant"
              menuOptions={consultantOptions}
              control={control}
              label="Select Consultant"
              fullWidth
              required
            /> */}
            <FormAutoCompleteSelect
              name="selectConsultant"
              control={control}
              label="Select Consultant"
              menuOptions={consultantOptions}
              required
            />
          </Box>
          <Box mt={5} className="flex items-center justify-center gap-4">
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          </Box>
        </Box>
      </form>
    </CustomDialog>
  );
};

export default AddALFDoctorDialog;
