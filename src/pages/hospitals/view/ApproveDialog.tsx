import { Box, Button, CustomDialog, Text } from '@/atoms';
import React from 'react';
import { useHospital } from '../hospitalContext';
import { HospitalDetail } from '@/types/hospital';
import { OrganLicense } from '@/types/organLicense';
import { UserData, UsersTable } from '@/types/common.type';
import { toast } from '@/utils/toast';
import { useNavigate } from 'react-router';

interface ApproveDialogProps {
  open: boolean;
  onClose: () => void;
  data?: HospitalDetail;
  organLicense?: OrganLicense;
  user?: UserData | UsersTable;
  // eslint-disable-next-line no-unused-vars
  onApprove?: (hospitalId: number, organId?: number) => void;
}

const ApproveDialog: React.FC<ApproveDialogProps> = ({ open, onClose, data, organLicense, onApprove, user }) => {
  const navigate = useNavigate();
  const {
    actions: { updateHospitalApproval }
  } = useHospital();

  const onApproval = () => {
    if (organLicense) {
      const hospitalId = organLicense ? organLicense.hospitalId : 0;
      const organId = organLicense ? organLicense?.organType?.id : 0;
      onApprove?.(hospitalId, organId);
      toast('License Approved successfully', 'success');
      navigate(-1);
      onClose();
    } else if (user) {
      const organId = user ? user?.userID : 0;
      console.log('hospital id and user id ', organId);
      onApprove?.(organId);
      toast('User Approved successfully', 'success');
      navigate(-1);
      onClose();
    } else {
      console.log('Approving hospital...');
      updateHospitalApproval();
      toast('Hospital Approved successfully', 'success');
      navigate('/approvals');
      onClose();
    }
  };
  console.log('data from big form ', organLicense);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="!text-[16px] text-[#A1999F] !font-[500] flex gap-2">
          Are you sure , Do you want to <Text className="text-[#80C967] ">Approve ? </Text>
        </Text>
        <Text className="text-center !text-[16px] !font-[500] !mt-[8px] ">
          {user ? 'User' : 'Hospital'} Name : &nbsp;
          {data
            ? data.basicDetails.hospitalName
            : organLicense
              ? organLicense.hospitalName
              : user
                ? user?.firstName
                : ''}
        </Text>
        {organLicense && (
          <Text className=" text-center !font-[500]">Organ : {organLicense?.organType?.name ?? 'NA'}</Text>
        )}
        <Box className="flex items-center justify-center gap-4 !mt-[28px]">
          <Button
            variant="contained"
            className="!bg-[#A1999F]  !text-[white] w-[82px] h-[36px] !rounded-[4px]"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            variant="contained"
            className="!bg-[#80C967] !text-[white] w-[82px] h-[36px] !rounded-[4px]"
            onClick={onApproval}
          >
            Yes
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default ApproveDialog;
