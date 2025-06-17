import { Box, Button } from '@/atoms';
import SingleOrganView from './SingleOrganView';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useState } from 'react';
import { ApproveIcon, BackIcon, DeclineIcon } from '@/assets/icons';
import ApproveDialog from './ApproveDialog';
import DeclineDialog from './DeclineDialog';
import { useHospitals } from '../hospitalListContext';
import { useHospital } from '../hospitalContext';
import { useRole } from '@/hooks/useRole';

const LicenseView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { actions } = useHospitals();
  const { isSuperAdmin } = useRole();
  const {
    state: { hospital }
  } = useHospital();
  const isNTORC = hospital?.basicDetails?.hospitalType?.name === 'NTORC';
  const { approveOrganLicense, rejectOrganLicense } = actions || {};
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  const {
    state: { organLicense, hospitalOrganData, isView, isEdit, isTranstan, isApproval, isFromHospital }
  } = location;
  // console.log('ddd', organLicense);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNext = (data: any) => {
    console.log('Next clicked, data submitted:', data);
  };

  const handleNavigate = () => {
    if (isTranstan) {
      navigate(`/hospitals/${location.hash}`);
    } else if (isApproval) {
      navigate(`/approvals`);
    } else {
      navigate(`/hospitals/${id}/dashboard`);
    }
  };

  return (
    <Box className="px-[40px] mt-[16px]">
      <BackIcon className="hidden" onClick={handleNavigate} />
      <SingleOrganView
        forNTORC={isNTORC}
        organData={!isFromHospital && organLicense}
        fromHospital={hospitalOrganData}
        onNext={handleNext}
        readOnly={isEdit && isSuperAdmin ? false : true}
        isView={!isEdit}
      />
      {!isEdit && (
        <Box className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
          {!isView && (
            <>
              <Button
                variant="outlined"
                className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] "
                onClick={() => setOpenDeclineDialog(true)}
              >
                <DeclineIcon /> Decline
              </Button>
              <Button
                variant="contained"
                className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
                onClick={() => setOpenApproveDialog(true)}
              >
                <ApproveIcon /> Approve
              </Button>
            </>
          )}
        </Box>
      )}
      <ApproveDialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        organLicense={organLicense}
        onApprove={(hospitalId: number, organId: number) => {
          approveOrganLicense(hospitalId, organId);
        }}
      />
      <DeclineDialog
        open={openDeclineDialog}
        onClose={() => setOpenDeclineDialog(false)}
        organLicense={organLicense}
        onRejected={(hospitalId: number, organId: number, reason: string) => {
          rejectOrganLicense(hospitalId, organId, reason);
        }}
      />
    </Box>
  );
};

export default LicenseView;
