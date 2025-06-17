import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { TranstanUser } from '@/types/resource';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useResource } from '../ResourceContext';
import { toast } from '@/utils/toast';

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow?: TranstanUser;
}

const ActionSchema = z.object({
  reason: z.string().min(1, 'Reason is Required')
});
type ActionSchemaType = z.infer<typeof ActionSchema>;

const ActionDialog: React.FC<ActionDialogProps> = ({ open, onClose, selectedRow }) => {
  const {
    actions: { deleteTranstanUser, getAll, restoreTranstanUser }
  } = useResource();
  const { control, handleSubmit } = useForm<ActionSchemaType>({
    resolver: zodResolver(ActionSchema),
    defaultValues: {
      reason: ''
    }
  });
  const isActive = selectedRow?.status === 'Active';
  const userID = selectedRow?.userID ?? 0;
  const onSubmit = async (data: ActionSchemaType) => {
    try {
      if (isActive) {
        await deleteTranstanUser(userID, data.reason);
        toast('User Deleted Successfully', 'success');
      } else {
        await restoreTranstanUser(userID, 'restore');
        toast('User Restored Successfully', 'success');
      }
    } catch (error) {
      toast('Something went wrong', 'error');
      console.error(error);
    } finally {
      await getAll();
      onClose();
    }
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomDialog open={open} onClose={onClose} maxWidth="xs">
        <Text className="flex gap-2 items-center">
          Are You sure, Do you want to<Text className="text-[#DD2323]">{isActive ? 'Delete' : 'Restore'}</Text> the
          User?
        </Text>
        <Text className="!mt-4">User Name: {selectedRow?.userName ?? 'NA'}</Text>
        {isActive && (
          <Box className="mt-7">
            <FormInput control={control} name="reason" label="Reason" fullWidth multiline minRows={3} />
          </Box>
        )}
        <Box className="flex justify-center items-center gap-4 mt-7">
          <Button variant="outlined" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Yes
          </Button>
        </Box>
      </CustomDialog>
    </form>
  );
};

export default ActionDialog;
