import { EditIcon } from '@/assets/icons';
import { Box, DataTable, Flex, Text } from '@/atoms';
import React, { useState } from 'react';
import DonorDelete from './DonorDelete';
import { useNavigate } from 'react-router';

export const returnFakeData = () => {
  return [...Array(15)].map((_, index) => ({
    id: (index + 1).toString(),
    createdOn: '29-07-2024',

    name: 'maha',
    hospitalName: 'Govt Hospital India',
    notes: 'This is a test notes for the donor',
    gender: 'Female',
    age: '24',
    blood: 'B',
    hospitalType: 'Government',
    mlcNonmlc: 'Yes',
    causeofdeath: 'Other (Specify)',
    dateofaccident: '29.07.2024',
    dateofadmission: '29.07.2024',
    noofdaysinventilator: '3',
    firstapnoeastatus: 'Yes',
    firstapnoeadatetime: '29.07.2024 16:39',
    state: 'TamilNadu'
  }));
};

const DonorDataTable = () => {
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteDialog = () => {
    setOpenDelete(false);
  };
  return (
    <Box>
      <DataTable
        onCellClick={() => {}}
        rowData={returnFakeData()}
        columnDefs={[
          { field: 'id', headerName: 'S.No', sortable: false },
          { field: 'createdOn', headerName: 'Created On' },

          { headerName: 'Donor Name', field: 'name' },
          {
            headerName: 'Gender/Age/Blood',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: ({ data }: any) => {
              return (
                <Flex justifyItems={'center'} alignItems={'center'} gap={'20px'} height={'44px'}>
                  <Text className="!text-[14px] !font-normal !text-[#1A0616]">{data.gender}</Text>
                  <Text className="bg-[#C96767] rounded px-[3px] text-[white] text-[13px]">{data.age}</Text>
                  <Text className="text-[#C83926] !text-[16px] !font-bold">{data.blood}</Text>
                </Flex>
              );
            }
          },

          { headerName: 'Hospital Name', field: 'hospitalName' },
          {
            headerName: 'Hospital Type',
            field: 'hospitalType'
          },
          { headerName: 'MLC/Non-MLC', field: 'mlcNonmlc' },
          { headerName: 'Cause Of Death', field: 'causeofdeath' },
          { headerName: 'Date Of Accident', field: 'dateofaccident' },
          { headerName: 'Date Of Admission', field: 'dateofadmission' },
          { headerName: 'No Of Days in ventilator', field: 'noofdaysinventilator' },
          { headerName: 'First Apnoea Status', field: 'firstapnoeastatus' },
          { headerName: 'First Apnoea Date & Time', field: 'firstapnoeadatetime' },
          { headerName: 'State', field: 'state' },

          {
            headerName: 'Actions',
            sortable: false,
            minWidth: 190,
            cellRenderer: () => {
              return (
                <Flex className="h-[40px] justify-center items-center gap-[10px]">
                  <EditIcon
                    className="cursor-pointer"
                    onClick={() => {
                     navigate('/donors/identification');
                    }}
                  />
                </Flex>
              );
            }
          }
        ]}
      />
      <DonorDelete open={openDelete} onClose={handleDeleteDialog} />
    </Box>
  );
};

export default DonorDataTable;
