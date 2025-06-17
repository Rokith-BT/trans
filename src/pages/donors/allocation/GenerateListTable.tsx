import { FemaleIcon, MaleIcon, TransgenderIcon } from '@/assets/icons';
import { Box, Button, DataTable, Text } from '@/atoms';
import { GeneratedListTable } from '@/types/donorallocation';
import React, { useState } from 'react';
import UpdateStatusDialog from './UpdateStatusDialog';

const FakeData = [
  {
    sno: '1',
    uniqueid: '1234',
    regdateandTime: '26-05-2025  00:00',
    zonalrank: '456',
    heightweight: '123 57',
    gender: 'TransGender',
    bloodGroup: 'A+',
    age: '  57',
    bmi: '12.3',
    hospitalname: 'CMC',
    organrequested: 'Kidney',
    acceptdeclinestatus: 'Pending'
  },
  {
    sno: '2',
    uniqueid: '1234',
    regdateandTime: '26-05-2025  00:00',
    zonalrank: '456',
    heightweight: '123 57',
    gender: 'Female',
    bloodGroup: 'A+',
    age: '  57',
    bmi: '12.3',
    hospitalname: 'CMC',
    organrequested: 'Liver',
    acceptdeclinestatus: 'Accepted'
  },
  {
    sno: '3',
    uniqueid: '1234',
    regdateandTime: '26-05-2025  00:00',
    zonalrank: '456',
    heightweight: '123 57',
    gender: 'Male',
    bloodGroup: 'A+',
    age: '  57',
    bmi: '12.3',
    hospitalname: 'CMC',
    organrequested: 'Stomach',
    acceptdeclinestatus: 'Pending'
  },
  {
    sno: '4',
    uniqueid: '1234',
    regdateandTime: '26-05-2025  00:00',
    zonalrank: '456',
    heightweight: '123 57',
    gender: 'Female',
    bloodGroup: 'A+',
    age: '  57',
    bmi: '12.3',
    hospitalname: 'CMC',
    organrequested: 'Lung',
    acceptdeclinestatus: 'Accepted'
  },
  {
    sno: '5',
    uniqueid: '1234',
    regdateandTime: '26-05-2025  00:00',
    zonalrank: '456',
    heightweight: '123 57',
    gender: 'Male',
    bloodGroup: 'A+',
    age: '  57',
    bmi: '12.3',
    hospitalname: 'CMC',
    organrequested: 'Kidney',
    acceptdeclinestatus: 'Declined'
  }
];

interface GenerateListTableProps {
  list: [];
  isTable: boolean;
  step: number;
}

const GenerateListTable: React.FC<GenerateListTableProps> = ({ step }) => {
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const rowHeight = 74;
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };
  const AcceptDeclineStatus: { [key: string]: { bgColor: string; textColor: string } } = {
    Accepted: { bgColor: '#CFEEBC', textColor: '#027545' },
    Pending: { bgColor: '#F4EADA', textColor: '#C88726' },
    Declined: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };

  return (
    <Box>
      <DataTable
        columnDefs={[
          { headerName: 'S.No', field: 'sno', cellStyle: rowStyle },
          { headerName: 'Unique Id', field: 'uniqueid', cellStyle: rowStyle },
          { headerName: 'Register Date and Time', field: 'regdateandTime', cellStyle: rowStyle },
          { headerName: 'ZonalRank', field: 'zonalrank', cellStyle: rowStyle },
          { headerName: 'Height/Weight', field: 'heightweight', cellStyle: rowStyle },
          {
            headerName: 'Gender/ Age/ Blood',
            cellRenderer: (parmas: { data: GeneratedListTable }) => {
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
            cellStyle: rowStyle
          },
          { headerName: 'BMI', field: 'bmi', cellStyle: rowStyle },
          { headerName: 'HospitalName', field: 'hospitalname', cellStyle: rowStyle },
          { headerName: 'Organ Requested', field: 'organrequested', cellStyle: rowStyle },
          step === 3
            ? {
                headerName: 'Accept / Decline Status',
                cellRenderer: ({ data }: { data: GeneratedListTable }) => {
                  const { acceptdeclinestatus } = data;
                  const { bgColor, textColor } = AcceptDeclineStatus[acceptdeclinestatus] || {
                    bgColor: 'white',
                    textColor: 'red'
                  };

                  return (
                    <Box>
                      <Text
                        className="rounded-lg"
                        sx={{
                          bgcolor: bgColor,
                          color: textColor,
                          borderRadius: '8px',
                          padding: '0px 8px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {acceptdeclinestatus}
                      </Text>
                    </Box>
                  );
                },
                cellStyle: rowStyle
              }
            : null,
          step === 3 ? { headerName: 'Reject Reason', field: 'rejectreason', cellStyle: rowStyle } : null,
          step === 3
            ? {
                headerName: 'Action',
                cellRenderer: () => {
                  return (
                    <Box>
                      <Button variant="contained" onClick={() => setOpenUpdateDialog(true)}>
                        Update
                      </Button>
                    </Box>
                  );
                },
                cellStyle: rowStyle
              }
            : null
        ].filter((colDef) => colDef !== null)}
        rowData={FakeData}
        rowHeight={rowHeight}
      />
      <Box className="flex justify-end mt-3">
        <Button variant="contained" className="!bg-[#67B1C9]">
          Confirm
        </Button>
      </Box>
      <UpdateStatusDialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} />
    </Box>
  );
};

export default GenerateListTable;
