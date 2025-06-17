import { Button, CustomDialog, DataTable, Text } from '@/atoms';

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useALF } from '../ALFContext';
import { RecipientALFDTOs } from '@/types/alf';
import { useRole } from '@/hooks/useRole';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import ALFDocListCard from './ALFDocListCard';
import { CloseCircleIcon } from '@/assets/icons';
import ALFFinialRejectDialog from './ALFFinialRejectDialog';

interface ALFDoctorProps {
  open: boolean;
  onClose: () => void;
  alfData: RecipientALFDTOs | undefined;
}
const StatusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Approved: { bgColor: '#CFEEBC', textColor: '#027545' },
  Declined: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Hold: { bgColor: '#F4EADA', textColor: '#C88726' },
  RequestedALFReview: { bgColor: '#E0F0FF', textColor: '#67B1C9' }
};

const ALFDoctorListDialog: React.FC<ALFDoctorProps> = ({ open, onClose, alfData }) => {
  // const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState('');
  const { isMobile } = useWindowType();
  const {
    actions: { getALFConsultantFeedback },
    state: { alfDocFeedbacks }
  } = useALF();
  const { isDoctor, isSuperAdmin } = useRole();
  console.log(isDoctor, 'isHospitalAdmin');

  useEffect(() => {
    if (alfData?.id) {
      getALFConsultantFeedback(alfData?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alfData?.id]);
  // const handleApproveFinalReview = () => {
  //   approveALFFinalReview(Number(alfData?.id), 'approve', () => {
  //     navigate('/alf');
  //   });
  // };
  // const handleRejectFinalReview = () => {
  //   rejectALFFinalReview(Number(alfData?.id), 'reject', () => {
  //     navigate('/alf');
  //   });
  // };
  const columnDef = [
    {
      headerName: 'S.No',
      maxWidth: 90,
      field: 'serialNumber',
      // cellRenderer: ({ data }: { data }) => {
      //   return <SnoCellRender data={data} />;
      // },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Doctor Name',
      field: 'name',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: ({ data }: { data }) => {
        return data?.consultant?.name;
      }
    },
    {
      headerName: 'Comment',
      field: 'comment',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Status',
      field: 'status',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: ({ data }) => {
        console.log(data, 'datadatadatadatadata');

        const { bgColor, textColor } = StatusColor[data.status] || { bgColor: '#D0DDF9', textColor: '#3A5A96' };
        return (
          <Box
            className={`flex items-center gap-2 ${data.status === 'Pending Transtan Review' ? 'flex-col relative' : ''}`}
          >
            <Text
              className=" !text-[12px] !font-[600] rounded-lg"
              sx={{
                color: textColor,
                backgroundColor: bgColor,
                borderRadius: '8px',
                padding: '0px 8px',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {data.status === 'PendingALFReview'
                ? 'Pending ALF Review'
                : data.status === 'RequestedALFReview'
                  ? 'Requested ALF Review'
                  : data.status}
            </Text>
          </Box>
        );
      }
    }
  ];
  console.log(alfDocFeedbacks, 'alfDocFeedbacks', alfData);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md">
      <Box className="flex  justify-between">
        <Text className="!text-[#A1999F] !mb-4 !text-[16px] !font-[500]">ALF Doctor List</Text>
        <CloseCircleIcon onClick={onClose} />
      </Box>
      {!isMobile ? (
        <DataTable onCellClick={() => {}} rowData={alfDocFeedbacks} columnDefs={columnDef} />
      ) : (
        <>
          <Box className="w-full max-w-full">
            <MobileCardRenderer
              list={alfDocFeedbacks}
              renderCard={(item) => {
                return (
                  <ALFDocListCard data={item} />
                  // <ALFTableCard
                  //   key={item.id}
                  //   data={item}
                  //   isApprove={isApprove}
                  //   setOpenChat={setOpenChat}
                  //   setAlfDocList={setAlfDocList}
                  //   setAlf={setAlf}
                  //   renderer={renderer}
                  //   isSuperAdmin={isSuperAdmin}
                  //   canApprove={canApprove}
                  //   canRead={canRead}
                  // />
                );
              }}
            />
          </Box>
        </>
      )}

      {isSuperAdmin && alfData?.status === 'FinalReview' && (
        <Box mt={5} className="flex items-center justify-center gap-4 float-right">
          <Button
            variant="contained"
            className="!bg-[#C96767] !text-[white]"
            onClick={() => {
              setOpenDialog(true);
              setStatus('Decline');
            }}
          >
            Decline
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="!bg-[#80C967] !text-[white]"
            onClick={() => {
              setOpenDialog(true);
              setStatus('Approve');
            }}
          >
            Approve
          </Button>
        </Box>
      )}
      <ALFFinialRejectDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
        }}
        alfID={alfData?.id}
        recipientName={alfData?.name}
        alfFlog={status}
      />
    </CustomDialog>
  );
};

export default ALFDoctorListDialog;
