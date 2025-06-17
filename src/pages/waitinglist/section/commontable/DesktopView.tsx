import { FemaleIcon, MaleIcon, TransgenderIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import { CommonWaitingList } from '@/types/waitinglist';
import { formatDateAndTime } from '@/utils/dateutils';
import React, { useMemo } from 'react';

interface CommonTableProps {
  list: CommonWaitingList[];
  isFilterApplied?: boolean;
}

const DesktopView: React.FC<CommonTableProps> = ({ list = [], isFilterApplied = false }) => {
  const overlayMessage = useMemo(() => {
    return isFilterApplied
      ? '<div class="custom-no-rows">No results match your filter.</div>'
      : '<div class="custom-no-rows">To find data, filter or search using a Unique ID or Phone Number.</div>';
  }, [isFilterApplied]);

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontSize: '14px',
    fontWeight: '400'
  };
  return (
    <DataTable
      rowData={list}
      rowHeight={74}
      overlayNoRowsTemplate={overlayMessage}
      columnDefs={[
        { headerName: 'S.No', field: 'serialNumber', sortable: false, maxWidth: 72, cellStyle: rowStyle },
        { headerName: 'Unique Id', field: 'transtanId', cellStyle: rowStyle },
        {
          headerName: ' Blood / Gender / Age',
          cellRenderer: (parmas: { data: CommonWaitingList }) => {
            const { age, bloodGroup, gender } = parmas.data;
            console.log('gender form recipient table ', gender);
            return (
              <Box className="flex p-5     gap-[8px] h-[40px] items-center justify-evenly">
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
          cellStyle: rowStyle
        },
        {
          headerName: 'Hospital Name',
          cellRenderer: ({ data }: { data: CommonWaitingList }) => {
            const { hospital } = data || {};
            return (
              <Box>
                <Text className='textResponse'>{hospital.name}</Text>
              </Box>
            );
          },
          maxWidth: 250,
          cellStyle: rowStyle
        },
        {
          headerName: 'Organ',
          cellRenderer: ({ data }: { data: CommonWaitingList }) => {
            const { organs } = data || {};

            return (
              <Box>
                <OrganImageswithSlide Organs={organs} />
              </Box>
            );
          },
          cellStyle: rowStyle
        },
        {
          headerName: 'Recipient City',
          cellRenderer: ({ data }: { data: CommonWaitingList }) => {
            const { city } = data || {};
            return (
              <Box>
                <Text className='textResponse'>{city.name}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle
        },
        {
          headerName: 'Reg. Date',
          cellRenderer: ({ data }: { data: CommonWaitingList }) => {
            const { dateOfRegistration } = data || null;
            const { formattedDate, formattedTime } = formatDateAndTime(dateOfRegistration) || null;
            return (
              <Box>
                <Text className='textResponse'>{formattedDate}</Text>
                <Text className='textResponse'>{formattedTime}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle
        },
        {
          headerName: 'Zone',
          cellRenderer: ({ data }: { data: CommonWaitingList }) => {
            const { zone } = data || {};
            return (
              <Box>
                <Text className='textResponse'>{zone.name}</Text>
              </Box>
            );
          },
          maxWidth: 90,
          cellStyle: rowStyle
        },
        { headerName: 'Rank', field: 'currentZoneRank', maxWidth: 90, cellStyle: rowStyle }
      ]}
    />
  );
};

export default DesktopView;
