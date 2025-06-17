import { Box, Button, CustomDialog, Text } from '@/atoms';
import { Organ, RelationTypeList } from '@/types/common.type';
import { MultiOrgansList } from '@/types/setup';
import React from 'react';

interface ActionDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow?: MultiOrgansList | null;
  selectedOrganData?: Organ | null;
  selectedRelationData?: RelationTypeList | null;
  // eslint-disable-next-line no-unused-vars
  onDelte?: (id: number) => void;
  // eslint-disable-next-line no-unused-vars
  onRestore?: (id: number) => void;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
  open,
  onClose,
  selectedRow,
  onDelte,
  onRestore,
  selectedOrganData,
  selectedRelationData
}) => {
  const isActive = selectedRow?.status === 1 || selectedRelationData?.isActive === 1;
  const onSubmit = () => {
    const selectedId = selectedRow?.id ?? 0;
    if (selectedRow) {
      if (isActive) {
        onDelte?.(selectedId);
      } else {
        onRestore?.(selectedId);
      }
    } else if (selectedRelationData) {
      const selectedRelationId = selectedRelationData.id ?? 0;
      if (isActive) {
        onDelte?.(selectedRelationId);
      } else {
        onRestore?.(selectedRelationId);
      }
    } else {
      const selectedOrganId = selectedOrganData?.id ?? 0;
      const isActiveOrgan = selectedOrganData?.isActive === true;
      if (isActiveOrgan) {
        onDelte?.(selectedOrganId);
      } else {
        onRestore?.(selectedOrganId);
      }
    }
    onClose();
  };
  const organName = selectedRow ? selectedRow.name : selectedOrganData?.name;
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="text-[#A1999F] !font-[500] !text-[16px] ">
          Are you sure want to {isActive ? 'delete?' : 'restore?'}
        </Text>
        <Text className="!font-[500] !text-[16px] ">{organName ?? ''}</Text>
        <Box className="flex items-center justify-center mt-[28px] gap-4">
          <Button variant="contained" className="!bg-[#A1999F] !rounded-[4px]" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" className="!bg-[#DA2424] !rounded-[4px]" onClick={onSubmit}>
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ActionDialog;
