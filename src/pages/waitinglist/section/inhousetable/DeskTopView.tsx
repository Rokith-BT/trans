import { EditIcon, FemaleIcon, MaleIcon, RefreshTableIcon, TransgenderIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { CountdownTimer } from '@/pages/components/CustomTimer';
import { OrganCellRenderer } from '@/pages/hospitals/section/hospital-table/OrganCellRenderer';
import { Organ } from '@/types/common.type';
import { InhouseWaitingList } from '@/types/waitinglist';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { formatDateAndTime } from '@/utils/dateutils';
import React from 'react';

interface InhouseTableProps {
  list: InhouseWaitingList[];
  isInhouseFinal?: boolean;
  setOpendialog: (_data: boolean) => void;
  setSelectedRow: (_data: InhouseWaitingList) => void;
  canUpdate?: boolean;
}

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'left',
  fontSize: '14px',
  fontWeight: '400'
};

const DeskTopView: React.FC<InhouseTableProps> = ({
  list,
  isInhouseFinal,
  setOpendialog,
  setSelectedRow,
  canUpdate
}) => {
  const baseColumnDefs = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      sortable: false,
      minWidth: 72,
      maxWidth: 72,
      cellStyle: rowStyle
    },
    { headerName: 'Unique ID', field: 'transtanId', cellStyle: rowStyle, wrapHeaderText: true, minWidth: 110 },
    {
      headerName: 'Zonal Rank',
      cellRenderer: ({ data }: { data: InhouseWaitingList }) => {
        const { zone, currentZoneRank } = data || {};
        return (
          <Box>
            <Text title={zone?.name} className="text-[#67B1C9] !text-[16px] !font-[600] textResponse ">
              {zone.name.charAt(0)}
            </Text>
            <Text>{currentZoneRank}</Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      minWidth: 100
    },
    isInhouseFinal
      ? { headerName: 'Final Rank', field: 'finalRank', cellStyle: rowStyle, wrapHeaderText: true, minWidth: 105 }
      : {
          headerName: 'Current Rank',
          field: 'currentRank',
          cellStyle: rowStyle,
          wrapHeaderText: true,
          minWidth: 105
        },
    !isInhouseFinal
      ? {
          headerName: 'Proposed Rank',
          cellRenderer: ({ data }: { data: InhouseWaitingList }) => {
            const { proposedRank, proposedRankUpdatedDate } = data || {};
            const isoDateString = proposedRankUpdatedDate;
            return (
              <Box className="flex flex-col items-center">
                {proposedRank && (
                  <Text>
                    <CountdownTimer is24Hour={true} targetDate={isoDateString} />
                  </Text>
                )}
                <Box className="flex flex-col items-center gap-x-[8px]">
                  <Text className="text-[#C83926] !text-[16px] !font-[700]">{proposedRank}</Text>
                  <RefreshTableIcon />
                </Box>
              </Box>
            );
          },
          minWidth: 120,
          cellStyle: rowStyle,
          wrapHeaderText: true
        }
      : null,
    {
      headerName: 'Recipient Name',
      field: 'name',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      minWidth: 130
    },
    {
      headerName: 'Blood / Gender / Age',
      cellRenderer: ({ data }: { data: InhouseWaitingList }) => {
        const { age, bloodGroup, gender } = data || {};
        return (
          <Box className="flex p-5 gap-[8px] h-[40px] items-center justify-left">
            <Text className="text-[#C83926] !text-[16px] !font-[700]">{bloodGroup.name}</Text>
            <Box>
              {gender.name === 'Female' ? <FemaleIcon /> : ''}
              {gender.name === 'Male' ? <MaleIcon /> : ''}
              {gender.name === 'Transgender' ? <TransgenderIcon /> : ''}
            </Box>
            <Text
              className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600] ${age <= 20 ? 'bg-[#67B1C9] text-[white]' : age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
            >
              {age}
            </Text>
          </Box>
        );
      },
      minWidth: 150,
      cellStyle: rowStyle,
      wrapHeaderText: true
    },
    {
      headerName: 'Registered Date & Time',
      cellRenderer: ({ data }: { data: InhouseWaitingList }) => {
        const { dateOfRegistration } = data || null;
        const { formattedDate, formattedTime } = formatDateAndTime(dateOfRegistration) || null;
        return (
          <Box>
            <Text className='textResponse'>{formattedDate}</Text>
            <Text className='textResponse'>{formattedTime}</Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      minWidth: 150
    },
    {
      headerName: 'Hospital Name',
      cellRenderer: ({ data }: { data: InhouseWaitingList }) => {
        const { hospital } = data || {};

        return (
          <Box className="w-full" title={hospital?.name ?? ''} onClick={() => copyToClipboard(hospital.name)}>
            <Text className="truncate max-w-[calc(100%-32px)] textResponse" title={hospital.name}>
              {hospital.name}
            </Text>
          </Box>
        );
      },
      enableCellTextSelection: true,
      enableClipboard: true,
      processCellForClipboard: ({ data }: { data: InhouseWaitingList }) => {
        // Customize the value here
        const { hospital } = data || {};
        return hospital.name ? hospital.name.toUpperCase() : '';
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      minWidth: 150
    },
    {
      headerName: 'Organ Requested',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        // Get all organ names as a comma-separated string
        const { organs } = params.data || {};
        const organNames = organs.map((organ: Organ) => organ.name.trim()).join(', ');
        return (
          <Box className="flex flex-col items-center">
            <Box title={organNames} className="flex gap-2 justify-center">
              {/* <OrganImageswithSlide Organs={organs} visibleCount={2} /> */}
              <OrganCellRenderer organs={organs} api={params.api} column={params.column} />
            </Box>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      minWidth: 130
    },
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      minWidth: 110
    },
    isInhouseFinal
      ? { headerName: 'Reason', field: 'reason', cellStyle: rowStyle, minWidth: 150 }
      : {
          headerName: 'Actions',
          cellRenderer: ({ data }: { data: InhouseWaitingList }) => {
            return (
              <Box>
                {canUpdate && (
                  <EditIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedRow(data);
                      setOpendialog(true);
                    }}
                  />
                )}
              </Box>
            );
          },
          cellStyle: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '400'
          },
          minWidth: 100,
          maxWidth: 100,
          pinned: 'right'
        }
  ].filter((colDef) => colDef !== null);

  return (
    <Box>
      <DataTable rowData={list} rowHeight={74} headerHeight={80} columnDefs={baseColumnDefs} />
    </Box>
  );
};

export default DeskTopView;
