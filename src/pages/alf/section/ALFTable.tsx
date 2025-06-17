/* eslint-disable @typescript-eslint/no-explicit-any */
import { InforCircleIcon, VerifyApprovalIcon } from '@/assets/icons';
import ChatIcon1 from '@/assets/icons/ChatIcon1';
import { Box, DataTable, Text, ToolTips } from '@/atoms';
import SnoCellRender from '@/pages/recipients/section/SnoCellRender';
import { AlfTypes, RecipientALFDTOs } from '@/types/alf';
import { useState } from 'react';
import { MessageDialog } from '../dialogs/MessageDialog';
import { formatDateAndTime } from '@/utils/dateutils';
import { useLocation, useNavigate } from 'react-router';
import ALFDoctorListDialog from '../alfComponent/ALFDoctorList';
import { Recipient } from '@/types/recipient';
import { getHospitalTypes } from '@/utils/hospitalTypeutils';
import ActionsCellRenderer from '@/pages/recipients/section/ActionCellRender';
import Countdown from 'react-countdown';
import ExtendIcon from '@/assets/icons/ExtendIcon';
import ALFExtendDialog from '../dialogs/ALFExtendDialog';
import { useWindowType } from '@/hooks/useWindowType';
import ALFTableCard from './ALFTableCard';
// import { Hospital } from '@/types/hospital';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';

interface RecipientListTableProps {
  list: AlfTypes[];
  isApprove?: boolean;
  alfID?: string | number;
}
const StatusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  PendingALFReview: { bgColor: '#D7D2F880', textColor: '#4E3395' },
  PendingTranstanReview: { bgColor: '#D0DDF980', textColor: '#3A5A96' },
  Delisted: { bgColor: '#F4EADA', textColor: '#C88726' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Approved: { bgColor: '#CFEEBC', textColor: '#027545' },
  Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  FinalReviewRejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};
const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  if (completed) {
    return <span className="text-[red] text-[13px] font-medium">00:00:00:00</span>;
  } else {
    // Render a countdown
    return (
      <span className="text-[13px] font-medium">
        {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </span>
    );
  }
};
const rowStyle = {
  display: 'flex',
  // width: '100%',
  alignItems: 'center',
  justifyContent: 'left',
  fontWeight: '400',
  fontSize: '16px'
};
const ALFTable = ({ list, isApprove, alfID }: RecipientListTableProps) => {
  console.log(alfID, 'alfID');
  const { isMobile, isSmallLaptop } = useWindowType();
  const location = useLocation();
  const { isSuperAdmin, roleID } = useRole();
  const [openChat, setOpenChat] = useState(false);
  const [alfDocList, setAlfDocList] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [alf, setAlf] = useState<RecipientALFDTOs>();
  const navigate = useNavigate();
  const { canRead, canApprove, canUpdate } = usePermissions(6, roleID);

  // useEffect(() => {
  //   if (alfID && list) {
  //     console.log(list.filter((el: AlfTypes) => el.id === alfID),'efcewfcecf');

  //     setOpenChat(true);
  //     setAlf(list.filter((el: AlfTypes) => el.id === alfID));
  //   }
  // }, [alfID, list]);

  const rowHeight = 74;
  const columnDef: any = [
    {
      headerName: 'S.No',
      maxWidth: 90,
      cellRenderer: ({ data }: { data: RecipientALFDTOs }) => {
        return <SnoCellRender data={data} />;
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 80
    },
    {
      headerName: 'ALF ID',
      field: 'id',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 100
    },
    {
      headerName: 'Transtan ID',
      field: 'transtanId',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 140
    },
    {
      headerName: 'Recipient Name',
      field: 'name',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },
    {
      headerName: 'Hospital Name',
      cellRenderer: ({ data }: { data: Recipient }) => {
        const { hospital, hospitalType } = data;
        console.log('hospitals from recipient table ', hospital);
        const formateHospitalType = getHospitalTypes(hospitalType?.name);
        return (
          <Box className="flex w-[100%] gap-2 justify-between">
            <Box>
              <Text
                title={hospital?.name ?? 'NA'}
                className="line-clamp-2 max-w-[200px]  overflow-hidden break-words textResponse"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  whiteSpace: 'normal'
                }}
              >
                {hospital?.name}
              </Text>
            </Box>

            <Box className="relative ml-2">
              <Text
                className={`absolute textResponse !font-medium ${hospitalType?.name === 'Private' ? 'text-[#C88726]' : 'text-[#008774]'} top-0 right-0 !text-sm`}
              >
                {formateHospitalType}
              </Text>
            </Box>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },
    {
      headerName: 'Listing Date & Time',
      cellRenderer: ({ data }: { data: RecipientALFDTOs }) => {
        const { createdAt } = data || null;
        if (!createdAt) {
          return null;
        }
        const { formattedDate, formattedTime } = formatDateAndTime(createdAt); // Formatting time
        return (
          <Box>
            <Text className="textResponse">{formattedDate}</Text>
            <Text className="textResponse">{formattedTime}</Text>
          </Box>
        );
      },

      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 140
    },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: RecipientALFDTOs }) => {
        const status = data.status && data.status.trim();
        const { bgColor, textColor } = StatusColor[data.status] || { bgColor: '#D0DDF9', textColor: '#3A5A96' };
        const DateVal = new Date(data?.expirationDate);
        return (
          <Box className="mt-3">
            <Box
              className={`flex items-center gap-2 ${status === 'Pending Transtan Review' ? 'flex-col relative' : ''}`}
            >
              <Text
                className="!text-left !text-[12px] !font-[600] rounded-lg"
                sx={{
                  color: textColor,
                  backgroundColor: bgColor,
                  borderRadius: '8px',
                  padding: '0px 8px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}
              >
                {status === 'PendingALFReview'
                  ? 'Pending ALF Review'
                  : status === 'PendingTranstanReview'
                    ? 'Pending Transtan Review'
                    : status === 'FinalReview'
                      ? 'Final Review'
                      : status === 'FinalReviewRejected'
                        ? 'Final Review Rejected'
                        : status}
              </Text>
              {isSuperAdmin &&
                (status === 'Approved' || status === 'PendingALFReview' || status === 'PendingTranstanReview') &&
                (data?.expiryExtendCount === null || data?.expiryExtendCount === 0) && (
                  <ExtendIcon
                    onClick={() => {
                      setExtendOpen(true);
                      setAlf(data);
                    }}
                  />
                )}
              {status === 'Rejected' || status === 'FinalReviewRejected' || status === 'Approved' ? (
                <ToolTips
                  title={data?.reason || ''}
                  arrow
                  placement="top"
                  sx={{
                    '& .MuiTooltip-tooltip': {
                      backgroundColor: 'black',
                      color: 'white',
                      fontSize: '12px',
                      borderRadius: '8px',
                      padding: '8px'
                    },
                    '& .MuiTooltip-arrow': {
                      color: 'black'
                    }
                  }}
                >
                  <Box className="">
                    <InforCircleIcon />
                  </Box>
                </ToolTips>
              ) : (
                ''
              )}
            </Box>
            {data?.expirationDate ? (
              <Box className="text-left !-mt-2">
                <Countdown date={DateVal} renderer={renderer} />
              </Box>
            ) : (
              ''
            )}
          </Box>
        );
      },

      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 180
    },
    {
      headerName: 'Pending ALF Approval',
      field: 'pendingALFApprovalCount',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 140,
      cellRenderer: ({ data }: { data: RecipientALFDTOs }) => {
        const { pendingALFApprovalCount } = data;
        return (
          <>
            <Box
              onClick={() => {
                setAlfDocList(true);
                setAlf(data);
              }}
              className="text-[#0000EE] cursor-pointer font-medium textResponse"
            >
              {pendingALFApprovalCount}
            </Box>
          </>
        );
      }
    },
    {
      headerName: 'Category',
      field: 'category',
      cellRenderer: ({ data }: { data: RecipientALFDTOs }) => {
        const { alfListingType } = data;
        return (
          <Box className="relative">
            <Text
              title={alfListingType?.name ?? 'NA'}
              className=" textResponse line-clamp-2 max-w-[200px] overflow-hidden break-words"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                whiteSpace: 'normal'
              }}
            >
              {alfListingType?.name}
            </Text>
          </Box>
        );
      },

      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 140
    },

    {
      headerName: 'Notification Status',
      field: 'category',
      cellRenderer: () => {
        return (
          <>
            <InforCircleIcon />
          </>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'left' },
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 140
    },

    {
      headerName: 'Actions',
      pinned: 'right',
      maxWidth: 100,
      cellRenderer: (params: { data: RecipientALFDTOs & Recipient }) => {
        const { data } = params;
        // const status = data?.status && data?.status.trim();
        return (
          <Box className="flex gap-4">
            {isApprove ? (
              <>
                <VerifyApprovalIcon
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/alf/${data?.recipientId}/view`, {
                      state: { isApprove: true, alfID: data?.id, origin: 'approvals', tab: `${location.hash}` }
                    });
                  }}
                />
              </>
            ) : (
              <Box className="flex gap-1">
                <Box>
                  <ActionsCellRenderer
                    data={data}
                    canApprove={canApprove}
                    canRead={canRead}
                    canUpdate={canUpdate}
                    setAlfDocList={setAlfDocList}
                    setAlf={setAlf}
                  />
                </Box>
                <Box
                  className="relative cursor-pointer"
                  onClick={() => {
                    setOpenChat(true);
                    setAlf(data);
                  }}
                >
                  <ChatIcon1 />
                </Box>
              </Box>
            )}
          </Box>
        );
      },

      cellStyle: rowStyle
    }
  ];
  return (
    <Box>
      {!isMobile ? (
        <DataTable
          onCellClick={() => {}}
          rowData={list}
          columnDefs={columnDef}
          rowHeight={isSmallLaptop ? 60 : rowHeight}
        />
      ) : (
        <Box className="w-full max-w-full">
          <MobileCardRenderer
            list={list}
            renderCard={(item: any) => (
              <ALFTableCard
                key={item.id}
                data={item}
                isApprove={isApprove}
                setOpenChat={setOpenChat}
                setAlfDocList={setAlfDocList}
                setAlf={setAlf}
                renderer={renderer}
                isSuperAdmin={isSuperAdmin}
                canApprove={canApprove}
                canRead={canRead}
              />
            )}
          />
        </Box>
      )}

      <MessageDialog
        open={openChat}
        onClose={() => {
          setOpenChat(false);
        }}
        alfData={alf}
      />
      {alfDocList && (
        <ALFDoctorListDialog
          open={alfDocList}
          onClose={() => {
            setAlfDocList(false);
          }}
          alfData={alf}
        />
      )}

      <ALFExtendDialog
        open={extendOpen}
        onClose={() => {
          setExtendOpen(false);
        }}
        alfData={alf}
      />
    </Box>
  );
};

export default ALFTable;
