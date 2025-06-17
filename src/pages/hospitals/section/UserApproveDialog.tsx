import { Box, Button, CustomDialog, Text } from '@/atoms';
import { UsersTable } from '@/types/common.type';
import React from 'react';

interface UserApproveDialogProps {
  open: boolean;
  onClose: () => void;
  selectedUser?: UsersTable | null;
  // eslint-disable-next-line no-unused-vars
  onApprove?: (id: number) => void;
}

const UserApproveDialog: React.FC<UserApproveDialogProps> = ({ open, onClose, selectedUser, onApprove }) => {
  const userId = selectedUser?.userID;
  const onSubmit = () => {
    if (userId) {
      onApprove?.(userId);
      onClose();
    } else {
      console.log('something wrong while approving user');
    }
  };
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box p={1}>
        <Text className="text-[#A1999F] !font-[500] !text-[16px] flex !mb-2 gap-1">
          Are you sure, Do want to Mark this User as <Text className="text-[#80C967] "> Active ?</Text>
        </Text>
        <Text className="!text-[16px] !font-[500] text-center">
          {selectedUser?.userName},{selectedUser?.role?.name}
        </Text>
        <Box className="h-[36px] flex items-center justify-center mt-[40px] gap-4">
          <Button onClick={onClose} variant="contained" className="!bg-[#A1999F] text-[white] w-[82px] !rounded ">
            No
          </Button>
          <Button onClick={onSubmit} variant="contained" className="!bg-[#80C967] text-[white] w-[82px] !rounded ">
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default UserApproveDialog;
