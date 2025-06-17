import { Box, Button, CustomDialog, FormInput, FormSelect, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMasterData } from '../masterCotext';
import { ContactTypes, RelationTypeList } from '@/types/common.type';
import { toast } from '@/utils/toast';
import { useLocation } from 'react-router';
import QS from 'query-string';

interface AddRelationDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow?: RelationTypeList | null;
}

const relationSchema = z.object({
  name: z.string().min(1, 'Enter Relation Name'),
  contactTypeId: z.number().min(1, 'Select Contact Type')
});
type RelationType = z.infer<typeof relationSchema>;

const AddRelationDialog: React.FC<AddRelationDialogProps> = ({ open, onClose, selectedRow }) => {
  const location = useLocation();
  const parsedQs = QS.parse(location.search);
  const {
    state: { contactTypes },
    action: { addRelationType, getRelationTypeList, editRelationType }
  } = useMasterData();

  const { handleSubmit, control, setValue, reset } = useForm<RelationType>({
    resolver: zodResolver(relationSchema),
    defaultValues: {
      name: '',
      contactTypeId: undefined
    }
  });
  const ContactTypeOptions = contactTypes.map((c: ContactTypes) => ({
    label: c.name,
    value: c.id
  }));

  useEffect(() => {
    reset({
      name: '',
      contactTypeId: undefined
    });
  }, [!open]);
  useEffect(() => {
    if (selectedRow) {
      setValue('name', selectedRow.name);
      setValue('contactTypeId', selectedRow.contactTypeId);
    }
  }, [selectedRow]);

  const onSubmit = (data: RelationType) => {
    const reltaionId = selectedRow?.id ?? 0;
    const payload = {
      name: data.name,
      contactTypeId: data.contactTypeId,
      isActive: 1
    };
    selectedRow
      ? editRelationType(reltaionId, payload, () => {
          toast('Relation Updated Successfully', 'success');
          getRelationTypeList(parsedQs);
          onClose();
        })
      : addRelationType(payload, () => {
          toast('Relation Added Successfully', 'success');
          getRelationTypeList(parsedQs);
          onClose();
        });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Text className="!text-[19px] !font-bold text-[#804595]">Add New Relation Type</Text>
        <Box className="mt-2 flex flex-col gap-4">
          <FormInput control={control} name="name" label="Realtion Name" fullWidth required />
          <FormSelect
            menuOptions={ContactTypeOptions}
            control={control}
            name="contactTypeId"
            label="Contact Type"
            fullWidth
            required
          />
        </Box>
        <Box className="flex items-center justify-center mt-2 ">
          <Button className="w-full" variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button type="submit" className="w-full" variant="contained" onClick={handleSubmit(onSubmit)}>
            Yes
          </Button>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default AddRelationDialog;
