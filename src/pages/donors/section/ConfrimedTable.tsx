import { EditIcon, FemaleIcon, MaleIcon, TerminateIcon, TransgenderIcon, ViewIcon } from '@/assets/icons';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { Box, DataTable, Text } from '@/atoms';
// import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import { PontentialDonor } from '@/types/donor';
import React, { useState } from 'react';
import CaseOffAllocationDialog from '../dialog/CaseOffAllocationDialog';
import TerminationDialog from '../dialog/TerminationDialog';
import { OrganCellRenderer } from '@/pages/hospitals/section/hospital-table/OrganCellRenderer';

interface ConfrimedTableProps {
  list: [];
}

const ConfrimedTable: React.FC<ConfrimedTableProps> = ({ list = [] }) => {
  const [openCA, setOpenCA] = useState(false);
  const [openter, setOpenter] = useState(false);
  const [id, setID] = useState(0);
  const rowHeight = 74;
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };
  const PotentialTextColor: { [key: string]: { bgColor: string; textColor: string } } = {
    8: { bgColor: '#E0F0FF', textColor: '#67B1C9' },
    9: { bgColor: '#F4EADA', textColor: '#C88726' }
  };
  return (
    <Box>
      <DataTable
        headerHeight={80}
        columnDefs={[
          { headerName: 'S.No', field: 'serialNumber', cellStyle: rowStyle, minWidth: 80, maxWidth: 90 },
          { headerName: 'Donor ID', field: 'id', cellStyle: rowStyle, minWidth: 120 },
          { headerName: 'Donor Name', field: 'name', cellStyle: rowStyle, minWidth: 130 },
          {
            headerName: 'Gender/ Age/ Blood',
            cellRenderer: (parmas: { data: PontentialDonor }) => {
              const { age, bloodGroup, gender } = parmas.data;
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
            minWidth: 150,
            wrapHeaderText: true,
            cellStyle: rowStyle
          },

          { headerName: 'Hospital Name', field: 'hospitalName', cellStyle: rowStyle, minWidth: 150 },
          {
            headerName: 'Organ Consented',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (params: any) => {
              const { organConsented } = params.data || {};
              return (
                <Box>
                  {/* <OrganImageswithSlide Organs={organConsented} visibleCount={2} /> */}
                  <OrganCellRenderer organs={organConsented} column={params.column} api={params.api} />
                </Box>
              );
            },
            minWidth: 210,
            cellStyle: rowStyle
          },
          {
            headerName: 'Status',
            cellRenderer: ({ data }: { data: PontentialDonor }) => {
              const potentialStatus = data.statusId;
              const { bgColor, textColor } = PotentialTextColor[potentialStatus] || {
                bgColor: 'white',
                textColor: 'red'
              };

              return (
                <Box>
                  <Text
                    className="  rounded-lg"
                    sx={{
                      bgcolor: bgColor,
                      color: textColor,
                      borderRadius: '8px',
                      padding: '0px 8px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {potentialStatus === 8
                      ? 'Case Officer Allocation Pending'
                      : potentialStatus === 9
                        ? 'Case Officer Allocated'
                        : ''}
                  </Text>
                </Box>
              );
            },
            minWidth: 200,
            cellStyle: rowStyle
          },
          // { headerName: 'Case Officer Name', field: 'caseOfficerName', cellStyle: rowStyle },
          // { headerName: 'Case Officer Phone', field: 'caseOfficerPhone', cellStyle: rowStyle },
          // { headerName: 'Donor Case Officer', field: 'donorCaseOfficer', cellStyle: rowStyle },
          // { headerName: 'Donor Case OfficerPhone', field: 'donorCaseOfficerPhone', cellStyle: rowStyle },
          // { headerName: 'Date of Registration', field: 'donorCaseOfficerPhone', cellStyle: rowStyle },
          {
            headerName: 'Case Officer Name',
            field: 'caseOfficerName',
            cellStyle: rowStyle,
            minWidth: 150,
            wrapHeaderText: true
          },
          {
            headerName: 'Case Officer Phone',
            field: 'caseOfficerPhone',
            cellStyle: rowStyle,
            minWidth: 150,
            wrapHeaderText: true
          },
          {
            headerName: 'Donor Case Officer',
            field: 'donorCaseOfficer',
            cellStyle: rowStyle,
            minWidth: 150,
            wrapHeaderText: true
          },
          {
            headerName: 'Donor Case Officer Phone',
            field: 'donorCaseOfficerPhone',
            cellStyle: rowStyle,
            minWidth: 150,
            wrapHeaderText: true
          },
          {
            headerName: 'Action',
            cellRenderer: ({ data }: { data: PontentialDonor }) => {
              return (
                <Box className="flex gap-1">
                  <ViewIcon className="mt-[2px]" />
                  <EditIcon className="mt-1" />
                  {data.statusId === 8 ? (
                    <>
                      <TerminateIcon
                        className="mt-[3px]"
                        title="Termination"
                        onClick={() => {
                          setOpenCA(true);
                          setID(data.id);
                        }}
                      />
                      <ArrowIcon
                        className="mt-[1px]"
                        onClick={() => {
                          setOpenter(true);
                          setID(data.id);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <ArrowIcon
                        className="mt-[1px]"
                        // onClick={() => {
                        //   setOpenter(true);
                        //   setID(data.id);
                        // }}
                        title="Request Local Organ"
                      />
                    </>
                  )}
                </Box>
              );
            },
            pinned: 'right',
            minWidth: 130,
            maxWidth: 140,
            cellStyle: rowStyle
          }
        ]}
        rowData={list}
        rowHeight={rowHeight}
      />
      <CaseOffAllocationDialog
        open={openter}
        onClose={() => {
          setOpenter(false);
        }}
        id={id}
      />
      <TerminationDialog
        open={openCA}
        onClose={() => {
          setOpenCA(false);
        }}
        id={id}
      />
    </Box>
  );
};

export default ConfrimedTable;
