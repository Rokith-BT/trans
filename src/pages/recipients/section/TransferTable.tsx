/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, DataTable, Text } from '@/atoms';
import React from 'react';
import './Style.css';
import { EditIcon, FemaleIcon, InforCircleIcon, MaleIcon, TransgenderIcon, VerifyApprovalIcon } from '@/assets/icons';
import { Recipient, RecipientApprovalTransferType } from '@/types/recipient';
import { truncateTextByLines } from '@/utils/truncateText';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatDateAndTime } from '@/utils/dateutils';
// import Countdown from 'react-countdown';
import { CountdownTimer } from '@/pages/components/CustomTimer';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import TransferTableCard from './TransferTableCard';

interface RecipientListTableProps {
  list: Recipient[] | RecipientApprovalTransferType[];
  isApprove?: boolean;
  isCmInsurance?: boolean;
  isUnpaid?: boolean;
  isWaitinglist?: boolean;
  isAlf?: boolean;
  isRecipientTranf?: boolean;
}

const transferStatusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  TransferInitiated: { bgColor: '#EDEDED', textColor: '#71717A' },
  TransferCompleted: { bgColor: '#80C96740', textColor: '#80C967' },
  TransferRejected: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  TransferApproved: { bgColor: '#E0F0FF', textColor: '#67B1C9' }
};
// { bgColor: '#80C96740', textColor: '#80C967' },

const TransferTable: React.FC<RecipientListTableProps> = ({ list = [], isApprove }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, isSmallLaptop } = useWindowType();

  const rowHeight = 74;

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };

  const baseColumnDef: any = [
    {
      headerName: 'S.No',
      maxWidth: 90,
      field: 'serialNumber',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },

    {
      headerName: 'Unique ID',
      field: 'transtanId',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    {
      headerName: 'Register Date & Time',
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const { createdAt } = data || null;

        const { formattedDate, formattedTime } = formatDateAndTime(createdAt);
        console.log('formatted date and time ', formattedDate, formattedTime);

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
      minWidth: 150
    },

    {
      headerName: 'Recipient Name',
      field: 'recipientName',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    {
      headerName: ' Blood/ Gender /Age ',
      cellRenderer: (parmas: { data: Recipient }) => {
        const { age, bloodGroup, gender } = parmas.data;
        console.log('gender form recipient table ', gender);

        return (
          <Box className="flex gap-[8px] h-[40px] items-center  w-full">
            <Text className="text-[#C83926] !text-[16px] !font-[700]">{bloodGroup?.name}</Text>
            <Box>
              {gender?.name === 'Female' ? <FemaleIcon /> : ''}
              {gender?.name === 'Male' ? <MaleIcon /> : ''}
              {gender?.name === 'TransGender' ? <TransgenderIcon /> : ''}
            </Box>
            <Text
              className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600] ${age <= 20 ? 'bg-[#67B1C9] text-[white]' : age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
            >
              {age}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },

    {
      headerName: 'Transfer Reg. Date',
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const { transferRegDate } = data || null;
        const { formattedDate, formattedTime } = formatDateAndTime(transferRegDate);

        if (!formattedDate || !formattedTime) {
          return (
            <Box>
              <Text className="textResponse">{transferRegDate}</Text>
            </Box>
          );
        }
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
      minWidth: 120
    },
    {
      headerName: 'Hospital Name',
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const { currentHospital } = data;
        const truncateHospital = truncateTextByLines(currentHospital?.name ?? 'NA', 2, 60);
        return (
          <Box className="flex w-[100%] gap-2 justify-between">
            <Box>
              <Text
                title={currentHospital?.name ?? 'NA'}
                className="line-clamp-2 max-w-[calc(100%-0px)] overflow-hidden break-words textResponse"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  whiteSpace: 'normal'
                }}
              >
                {truncateHospital}
              </Text>
            </Box>
          </Box>
        );
      },
      minWidth: 100,
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    {
      headerName: 'Transfer Status',
      minWidth: 140,
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const { activationDate, transferStatus, reason } = data || {};
        const formattedStatus =
          transferStatus === 'TransferInitiated'
            ? 'Transfer Initiated'
            : transferStatus === 'TransferRejected'
              ? 'Transfer Rejected'
              : transferStatus === 'TransferCompleted'
                ? 'Transfer Completed'
                : transferStatus === 'TransferApproved'
                  ? 'Transfer Approved'
                  : transferStatus;
        const { bgColor, textColor } = transferStatusColor[transferStatus] || { bgColor: 'white', textColor: 'red' };
        // const { formattedDate, formattedTime } = formatDateAndTime(activationDate);
        const targetDate = new Date(activationDate);
        const isValidDate = !isNaN(targetDate.getTime());

        return (
          <Box className="flex items-center flex-col gap-1">
            <Box className="flex items-center gap-1">
              <Text
                className=""
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  backgroundColor: bgColor,
                  color: textColor,
                  borderRadius: '8px',
                  paddingInline: '4px'
                }}
              >
                {formattedStatus}
              </Text>
              {transferStatus === 'TransferRejected' ? <InforCircleIcon title={reason ?? ''} /> : ''}
            </Box>
            {isValidDate && targetDate > new Date() && <CountdownTimer targetDate={targetDate} />}
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    {
      headerName: 'Organ Requested',
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const organs = data?.organMappings ? data.organMappings.map((organ) => organ.organId) : [];
        const organNames = organs.join(', ');
        return (
          <Box title={organNames} className="flex items-center justify-center flex-col">
            <OrganImageswithSlide Organs={organs} visibleCount={2} />
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    {
      headerName: 'Transferring  Hospital Name',
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const { transferringHospital } = data;
        console.log('hospitals from recipient table ', transferringHospital);
        const truncateHospital = truncateTextByLines(transferringHospital?.name ?? 'NA', 2, 60);
        return (
          <>
            <Box className="relative w-full">
              <Text
                title={transferringHospital?.name ?? 'NA'}
                className="line-clamp-2 max-w-[calc(100%-32px)] overflow-hidden break-words textResponse"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  whiteSpace: 'normal'
                }}
              >
                {truncateHospital}
              </Text>
            </Box>
          </>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },

    {
      headerName: 'Phone Number',
      field: 'phoneNumber1',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },

    {
      headerName: 'Actions',
      pinned: 'right',
      minWidth: 80,
      maxWidth: 100,
      cellRenderer: ({ data }: { data: RecipientApprovalTransferType }) => {
        const { transferStatus } = data || {};
        return (
          <>
            {transferStatus === 'TransferRejected' ? (
              <EditIcon
                className="cursor-pointer"
                onClick={() => {
                  navigate(`/recipients/view-recipient-transfer`, {
                    state: {
                      data,
                      isEdit: true,
                      origin: 'recipients/manage-transfer',
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
            ) : (
              <VerifyApprovalIcon
                className="cursor-pointer"
                onClick={() => {
                  if (isApprove) {
                    navigate(`/recipients/approval-transfer`, {
                      state: {
                        data,
                        isApprove,
                        origin: 'approvals',
                        tab: `${location.hash}`,
                        filter: `${location.search}`
                      }
                    });
                  } else {
                    navigate(`/recipients/view-recipient-transfer`, {
                      state: {
                        data,
                        isApprove,
                        origin: 'recipients/manage-transfer',
                        tab: `${location.hash}`,
                        filter: `${location.search}`
                      }
                    });
                  }
                }}
              />
            )}
          </>
        );
      },

      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '400',
        fontSize: '16px'
      }
    }
  ].filter((colDef) => colDef !== null);
  return (
    <Box>
      {!isMobile ? (
        <DataTable
          popupParent={document.body}
          gridOptions={{
            suppressCellFocus: true
          }}
          rowData={list}
          columnDefs={baseColumnDef}
          rowHeight={isSmallLaptop ? 60 : rowHeight}
        />
      ) : (
        <>
          <Box className="">
            <MobileCardRenderer
              list={list}
              renderCard={(item: any) => <TransferTableCard key={item.id} data={item} />}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TransferTable;
