import { Button, CustomDialog, FormInput, Text } from '@/atoms';
import { RecipientAlfDoctor } from '@/types/alf';
import { deleteSchema, DeleteType } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useALF } from '../ALFContext';
import { toast } from '@/utils/toast';
import { useLocation } from 'react-router';
import QS from 'query-string';

interface ALDDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  isDoctorDelete?: boolean;
  doctorData?: RecipientAlfDoctor;
}
const ALFDeleteDialog: React.FC<ALDDeleteDialogProps> = ({ open, onClose, isDoctorDelete = false, doctorData }) => {
  const location = useLocation();
  const parsedQs = QS.parse(location.search);
  const {
    actions: { deleteALFdoctor, getAddALFDoctors }
  } = useALF();
  const { handleSubmit, control } = useForm<DeleteType>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      reason: ''
    }
  });
  const consultantId = doctorData?.consultant?.id ?? 0;
  const handleDeleteAlfDoctor = () => {
    deleteALFdoctor(consultantId);
    toast('Deleted successfully', 'success');
    getAddALFDoctors(parsedQs);
    onClose(); // Close the dialog after success
  };

  const onSubmit = async (data: DeleteType) => {
    toast('submitting', 'success');
    try {
      await deleteALFdoctor(consultantId);
      toast('Deleted successfully', 'success');
      onClose(); // Close the dialog after success
    } catch (error) {
      toast('Failed to delete', 'error');
    }
    console.log(data);
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">
            Are You Sure, Do You want to <span className="text-[#DD2323] !font-[500] !text-[16px]">delete</span>?
          </Text>
          <Text className="!text-[#A1999F] !text-[16px] !font-[500] text-center">
            UID <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {doctorData?.id}</span>
          </Text>
          <Text className="!text-[#A1999F] !mb-2 !text-[16px] !font-[500] text-center">
            ALF Doctor Name
            <span className="!text-[#1A0616] !text-[16px] !font-[500]"> {doctorData?.consultant?.name}</span>
          </Text>

          {!isDoctorDelete && (
            <FormInput control={control} name="reason" label="Reason" fullWidth required minRows={3} multiline />
          )}
        </Box>
        <Box mt={5} className="flex items-center justify-center gap-4">
          <Button onClick={onClose} className="!bg-[#A1999F] !text-[white]">
            No
          </Button>
          <Button
            type="submit"
            onClick={doctorData ? handleDeleteAlfDoctor : handleSubmit(onSubmit)}
            className="!bg-[#DA2424] !text-[white]"
          >
            Yes
          </Button>
        </Box>
      </form>
    </CustomDialog>
  );
};

export default ALFDeleteDialog;
