import { CloseCircleIcon } from '@/assets/icons';
import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useMasterData } from './masterCotext';
import QS from 'query-string';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  id: number | string;
  fieldName: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ open, onClose, id, fieldName }) => {
  const {
    state: {},
    action: {
      deleteTerminateReason,
      deleteOrgans,
      deleteCauseOfDeath,
      deleteZones,
      deleteBloodGroup,
      deleteDepartment,
      getZones,
      getCauseOfDeath,
      getTerminationReason,
      getBloodGroupList,
      getDepartments
    }
  } = useMasterData();

  const parsedQs = QS.parse(location.search);

  const handleDelete = async () => {
    if (fieldName === 'Cause Of Death') {
      deleteCauseOfDeath(Number(id), () => {
        getCauseOfDeath(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Termination Reason') {
      deleteTerminateReason(Number(id), () => {
        getTerminationReason(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Organs') {
      deleteOrgans(Number(id), () => {
        onClose();
      });
    } else if (fieldName === 'Zone') {
      deleteZones(Number(id), () => {
        getZones(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Blood Group') {
      deleteBloodGroup(Number(id), () => {
        getBloodGroupList(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Department') {
      deleteDepartment(Number(id), () => {
        getDepartments(parsedQs);
        onClose();
      });
    }
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="relative">
        <CloseCircleIcon className="absolute top-0 right-0" toolText="" onClick={onClose} />
        <Text>
          Are you sure, Do you want <span className="text-[red]">Delete</span>?
        </Text>
        <Box className="flex gap-4 items-center justify-center mt-[40px]">
          <Button variant="outlined" className="" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" className="" onClick={handleDelete}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default DeleteDialog;
