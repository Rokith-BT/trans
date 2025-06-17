import { EditIcon, FemaleIcon, MaleIcon, TransgenderIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { DonorDetailsTypes, PontentialDonor } from '@/types/donor';
import { formatDateAndTime } from '@/utils/dateutils';
import React from 'react';
import { useNavigate } from 'react-router-dom';
interface BSCIdentifiedTableProps {
  list: [];
}

const BSCIdentifiedTable: React.FC<BSCIdentifiedTableProps> = ({ list = [] }) => {
  const navigate = useNavigate();
  const rowHeight = 74;
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };
  console.log(list, 'listlist12');

  return (
    <Box>
      <DataTable
        headerHeight={80}
        columnDefs={[
          { headerName: 'S.No', field: 'serialNumber', cellStyle: rowStyle, minWidth: 80, maxWidth: 90 },
          { headerName: 'Donor ID', field: 'id', minWidth: 100, cellStyle: rowStyle },
          { headerName: 'Donor Name', field: 'name', minWidth: 130, cellStyle: rowStyle },
          {
            headerName: 'Blood / Age / Gender',
            cellRenderer: (parmas: { data: PontentialDonor }) => {
              const { age, bloodGroup, gender } = parmas.data || {};
              return (
                <Box className="flex gap-[8px] h-[70px] items-center  w-full">
                  <Text className="text-[#C83926] !text-[16px] !font-[700]">{bloodGroup}</Text>
                  <Text
                    className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600] ${age <= 20 ? 'bg-[#67B1C9] text-[white]' : age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
                  >
                    {age}
                  </Text>
                  <Box>
                    {gender === 'Female' ? <FemaleIcon /> : ''}
                    {gender === 'Male' ? <MaleIcon /> : ''}
                    {gender === 'TransGender' ? <TransgenderIcon /> : ''}
                  </Box>
                </Box>
              );
            },
            wrapHeaderText: true,
            minWidth: 120,
            cellStyle: rowStyle
          },
          {
            headerName: 'Hospital Name',
            field: 'hospitalName',
            cellRenderer: ({ data }: { data: DonorDetailsTypes }) => {
              const { hospitalName } = data || {};
              return (
                <Box className="w-full" title={hospitalName ?? 'NA'}>
                  <Text className="truncate max-w-[calc(100%-32px)]">{hospitalName ?? 'NA'}</Text>
                </Box>
              );
            },
            minWidth: 140,
            wrapHeaderText: true,
            cellStyle: rowStyle
          },
          // { headerName: 'MLC / Non-MLC', field: 'mlcandnonmlc', cellStyle: rowStyle },
          {
            headerName: 'Cause of Death',
            field: 'causeOfBrainDeath',
            cellRenderer: ({ data }: { data: DonorDetailsTypes }) => {
              const { causeOfBrainDeath } = data || {};
              return (
                <Box className="w-full" title={causeOfBrainDeath ?? 'NA'}>
                  <Text className="truncate max-w-[calc(100%-32px)]">{causeOfBrainDeath ?? 'NA'}</Text>
                </Box>
              );
            },
            minWidth: 100,
            wrapHeaderText: true,
            cellStyle: rowStyle
          },
          {
            headerName: 'Date of Accident',
            field: 'dateOfAccident',
            cellRenderer: ({ data }: { data: DonorDetailsTypes }) => {
              const { dateOfAccident } = data || {};
              const { formattedDate, formattedTime } = formatDateAndTime(dateOfAccident);
              return (
                <Box>
                  <Text>{formattedDate}</Text>
                  <Text className="!text-[13px] !fomt-[400]">{formattedTime}</Text>
                </Box>
              );
            },
            cellStyle: rowStyle,
            wrapHeaderText: true,
            minWidth: 120
          },
          {
            headerName: 'Date of Admission',
            // field: 'admissionDate',
            cellRenderer: ({ data }: { data: DonorDetailsTypes }) => {
              const { admissionDate } = data || {};
              const { formattedDate, formattedTime } = formatDateAndTime(admissionDate);
              return (
                <Box>
                  <Text>{formattedDate}</Text>
                  <Text className="!text-[13px] !fomt-[400]">{formattedTime}</Text>
                </Box>
              );
            },
            cellStyle: rowStyle,
            wrapHeaderText: true,
            minWidth: 120
          },
          {
            headerName: 'No of Days in Ventilator',
            field: 'noOfDaysOnVentilator',
            minWidth: 120,
            wrapHeaderText: true,
            cellStyle: rowStyle
          },
          // { headerName: 'Apnoea Status', field: 'apnoeaStatus', cellStyle: rowStyle },
          {
            headerName: 'Apnoea Date & Time',
            field: 'apnoeaDateandTime',
            cellRenderer: ({ data }: { data: DonorDetailsTypes }) => {
              const apnoeaDate = data?.apnoeaDetails?.[0]?.datetime;
              const { formattedDate, formattedTime } = formatDateAndTime(apnoeaDate);
              return (
                <Box>
                  <Text>{formattedDate ?? 'NA'}</Text>
                  <Text className="!text-[13px] !font-[400]">{formattedTime ?? 'NA'}</Text>
                </Box>
              );
            },
            wrapHeaderText: true,
            minWidth: 120,
            cellStyle: rowStyle
          },
          {
            headerName: 'Action',
            cellRenderer: ({ data }: { data: DonorDetailsTypes }) => {
              console.log(data, 'datadatadata112');
              return (
                <Box
                  className="flex gap-1"
                  onClick={() =>
                    navigate(`/donors/${data.id}/edit/`, {
                      state: { isAddNew: false, isConsentGiven: true, hospitalId: data?.hospitalId }
                    })
                  }
                  // onClick={() => {
                  //   navigate(`/donors/donor-basic-details/${data.id}/edit`);
                  // }}
                >
                  <EditIcon />
                </Box>
              );
            },
            minWidth: 80,
            maxWidth: 90,
            pinned: 'right',
            cellStyle: rowStyle
          }
        ]}
        rowData={list}
        rowHeight={rowHeight}
      />
    </Box>
  );
};

export default BSCIdentifiedTable;
