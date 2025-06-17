import HospitalView from './HospitalView';
import { useHospital } from '../hospitalContext';
import { useLocation } from 'react-router';
import { Box } from '@/atoms';
// import { ApproveIcon, DeclineIcon, DocumentDownload, PrintIcon } from '@/assets/icons';
// import ApproveDialog from './ApproveDialog';
// import DeclineDialog from './DeclineDialog';
import NtorcView from './NtorcView';
import Loading from '@/pages/components/Loading';
import React from 'react';
import { useAuth } from '@/routes';
interface ViewHospitalProps {
  forView?: boolean;
  forapproval?: boolean;
}

const ViewHospital: React.FC<ViewHospitalProps> = ({ forView = false, forapproval = false }) => {
  // const { id } = useParams();
  const location = useLocation();
  const { data, isView } = location.state || {};
  console.log(' Extracted Data:', data, isView);

  const {
    state: { hospital, currentUser }
  } = useAuth();
  console.log('hospital from auth', hospital, currentUser);
  const {
    state: { hospital: forType }
  } = useHospital();
  // const [openApproveDialog, setOpenApproveDialog] = useState(false);
  // const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const hospitalType = forType?.basicDetails?.hospitalType?.name;
  const {
    state: { loading }
  } = useHospital();

  return (
    <Box px={3} className="my-[29px]">
      {loading ? (
        <Loading />
      ) : (
        <>
          {hospitalType === 'NTORC' ? (
            <NtorcView isView={isView} forHospital={!forView} />
          ) : (
            <HospitalView isView={forView} forHospital={!forView} forApproval={forapproval} />
          )}
        </>
      )}

      {/* <Box px={5} className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
        >
          <PrintIcon /> Print
        </Button>
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
        >
          <DocumentDownload /> Download
        </Button>
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] "
          onClick={() => setOpenDeclineDialog(true)}
        >
          <DeclineIcon /> Decline
        </Button>
        <Button
          variant="contained"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
          onClick={() => setOpenApproveDialog(true)}
        >
          <ApproveIcon /> Approve
        </Button>
      </Box>
      <ApproveDialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} data={state} />
      <DeclineDialog open={openDeclineDialog} onClose={() => setOpenDeclineDialog(false)} data={state} /> */}
    </Box>
  );
};

export default ViewHospital;
