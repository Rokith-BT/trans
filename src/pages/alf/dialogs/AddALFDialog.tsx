import { Box, Button, CustomDialog, FormAutoCompleteSelect, Text } from '@/atoms';
import { useHospitals } from '@/pages/hospitals/hospitalListContext';
import { ActiveHospital } from '@/types/hospital';

import { zodResolver } from '@hookform/resolvers/zod';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { useALF } from '../ALFContext';
import { LiverRequest } from '@/types/alf';
import { useRole } from '@/hooks/useRole';

interface AddALFDialogProps {
  open: boolean;
  onClose: () => void;
}

const addALFSchema = z.object({
  uuid: z.string().min(1, 'UUID is required'),
  hospitalId: z.string().min(1, 'Select Hospital')
});
type AddALFType = z.infer<typeof addALFSchema>;

const AddALFDialog: React.FC<AddALFDialogProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { state } = useHospitals();
  const { activeHospitalList } = state || {};
  const { isHospitalAdmin, hospitalId } = useRole();
  const {
    actions: { getLiverALFRequestList },
    state: { liverReqList }
  } = useALF();
  let liverReqOption =
    liverReqList.map((ct: LiverRequest) => ({ label: ct.recipientName, value: ct.recipientId?.toString() })) ?? [];
  const hospitalOptions = activeHospitalList.map((l: ActiveHospital) => ({
    value: l.hospitalId?.toString(),
    label: l.hospitalName,
    type: l.hospitalType.name
  }));
  const { handleSubmit, control, watch } = useForm<AddALFType>({
    resolver: zodResolver(addALFSchema),
    defaultValues: {
      hospitalId: hospitalId || undefined,
      uuid: undefined
    }
  });
  const hospitalID = watch('hospitalId');
  if (!hospitalID) {
    liverReqOption = [];
  }

  useEffect(() => {
    if (hospitalID) {
      getLiverALFRequestList(Number(hospitalID), () => {});
    }
  }, [hospitalID]);
  console.log(hospitalID, 'hospitalID', liverReqList);

  const onSubmit = (data: AddALFType) => {
    navigate(`/alf/${data.uuid}/add`);
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Text className="text-[#804595] !text-[19px] !font-[600]">Add ALF </Text>
          <Box mt={3}>
            <Box className="mb-4">
              <FormAutoCompleteSelect
                name="hospitalId"
                control={control}
                label="Selet Hospital"
                menuOptions={hospitalOptions}
                required={true}
              />
            </Box>
            {!isHospitalAdmin && (
              <Box className="mb-4 mt-8">
                <FormAutoCompleteSelect
                  name="uuid"
                  control={control}
                  label="Selet Recipient"
                  menuOptions={liverReqOption}
                  required={true}
                />
              </Box>
            )}
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

export default AddALFDialog;
