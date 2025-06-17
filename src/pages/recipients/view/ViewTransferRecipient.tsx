import { Box, Button } from '@/atoms';
import React, { useState } from 'react';
import RecipientBasicDeatils from '../section/RecipientBasicDeatils';
// import { useRecipient } from '../RecipientContext';
import { useLocation } from 'react-router';
import { CloseCircleIcon } from '@/assets/icons';
import ApproveDialog from './ApproveDialog';
import DeclainDialog from './DeclainDialog';

const ViewTransferRecipient = () => {
  const location = useLocation();
  const { state } = location || '';
  const { data } = state || {};
  console.log('ddd', data);
  const transtanId = data?.transtanId;
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);

  //   const {
  //     state: { recipientVerifyOTP },
  //     actions: { getRecipientVerifyOTP }
  //   } = useRecipient();
  const isApprovalPage = location.pathname.includes('/recipients/approval-transfer');

  return (
    <Box>
      <RecipientBasicDeatils recipientData={data} setOtpVerified={() => {}} transtanID={transtanId} readOnly={true} />
      {isApprovalPage && (
        <Box className="flex items-center justify-end gap-4 mb-[60px]">
          {/* <Button className="w-[164px] gap-2" variant="outlined">
            <PrintIcon />
            Print
          </Button>
          <Button className="w-[164px] gap-2" variant="outlined">
            <DocumentDownload />
            Download
          </Button> */}
          <Button
            className="sm:w-[164px] w-[100px] h-[44px] gap-2 !text-[#DD2323] !border-[#DD2323] "
            variant="outlined"
            onClick={() => setOpenDeclineDialog(true)}
          >
            <CloseCircleIcon stroke="#DD2323" />
            Decline
          </Button>
          <Button
            className="!bg-[#80C967] sm:w-[164px] w-[100px] h-[44px]"
            variant="contained"
            onClick={() => setOpenApproveDialog(true)}
          >
            Approve
          </Button>
        </Box>
      )}
      <ApproveDialog
        open={openApproveDialog}
        onClose={() => {
          setOpenApproveDialog(false);
        }}
        transferData={data}
        isApprove={true}
      />
      <DeclainDialog
        open={openDeclineDialog}
        onClose={() => {
          setOpenDeclineDialog(false);
        }}
        isApprove={true}
        transferData={data}
      />
    </Box>
  );
};

export default ViewTransferRecipient;
