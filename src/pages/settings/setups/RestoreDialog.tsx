import { CloseCircleIcon } from '@/assets/icons';
import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useMasterData } from './masterCotext';
import QS from 'query-string';

interface RestoreDialogProps {
  open: boolean;
  onClose: () => void;
  fieldName: string;
  id: string | number;
}

const RestoreDialog: React.FC<RestoreDialogProps> = ({ open, onClose, fieldName, id }) => {
  const {
    action: {
      restoreCauseOfDeath,
      restoreTerminationReason,
      restoreZoens,
      restoreOrgan,
      restoreBloodGroup,
      restoreDepartment,
      getCauseOfDeath,
      getTerminationReason,
      getZones,
      getAllOrganList,
      getBloodGroupList,
      getDepartments
    }
  } = useMasterData();
  const parsedQs = QS.parse(location.search);
  const onSubmit = () => {
    if (fieldName === 'Cause Of Death') {
      restoreCauseOfDeath(Number(id), () => {
        getCauseOfDeath(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Termination Reason') {
      restoreTerminationReason(Number(id), () => {
        getTerminationReason(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Zone') {
      restoreZoens(Number(id), () => {
        getZones(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Organs') {
      restoreOrgan(Number(id), () => {
        getAllOrganList(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Blood Group') {
      restoreBloodGroup(Number(id), () => {
        getBloodGroupList(parsedQs);
        onClose();
      });
    } else if (fieldName === 'Department') {
      restoreDepartment(Number(id), () => {
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
          Are you sure, Do you want <span className="text-[#C967A2]">Resotre</span>?
        </Text>
        <Box className="flex gap-4 items-center justify-center mt-[40px]">
          <Button variant="outlined" className="" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default RestoreDialog;
