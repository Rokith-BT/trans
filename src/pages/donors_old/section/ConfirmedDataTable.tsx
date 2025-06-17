import { CaseOverViewIcon, EditIcon, NextStepIcon, PrintIcon, TerminateIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Flex, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import DonorDelete from './DonorDelete';
import TerminateDialog from './TerminateDialog';
import { useNavigate } from 'react-router';
import { withVisibility } from '@/hoc/Visibility';
import {
  isCaseOverViewIconConfirm,
  isChangeStatusIconConfirm,
  isEditIconConfirm,
  isPrintIconConfirm,
  isTerminateIconConfirm,
  isViewforConfirm
} from '@/utils/actionButtonStatus';

const statusForConfirmed = [
  'Case Officer Allocation Pending',
  'Case Officer Allocation',
  'Local Organ Chosen',
  'Local Organ Requested',
  'Case Completed'
] as const;

type Status = (typeof statusForConfirmed)[number];
const RandomStatus = (): Status => {
  const randomStatus = Math.floor(Math.random() * statusForConfirmed.length);
  return statusForConfirmed[randomStatus];
};

interface Donor {
  id: string;
  donorId: string;
  name: string;
  hospitalName: string;
  notes: string;
  gender: string;
  age: string;
  blood: string;
  organConsents: string[];
  status: Status;
}

export const returnFakeData = (): Array<Donor> => {
  return [...Array(15)].map((_, index) => ({
    id: (index + 1).toString(),
    donorId: 'ram12',
    name: 'Ramachandran',
    hospitalName: 'Govt Hospital India',
    notes: 'This is a test notes for the donor',
    gender: 'Male',
    age: '24',
    blood: 'B',
    organConsents: ['liver', 'heart', 'brain'],
    status: RandomStatus()
  }));
};

const ConfirmedDataTable = () => {
  const navigate = useNavigate();

  const [openDelete, setOpenDelete] = useState(false);
  const [openTerminate, setOpenTerminate] = useState(false);
  const [data, setData] = useState<Array<Donor>>([]);

  useEffect(() => {
    setData(returnFakeData());
  }, []);

  const handleDeleteDialog = () => {
    setOpenDelete(false);
  };
  const handleCloseTerminate = () => {
    setOpenTerminate(false);
  };

  //for Icon
  const ViewIconVisibility = withVisibility(ViewIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const TerminateVisibility = withVisibility(TerminateIcon);
  const ChangeStatusVisibility = withVisibility(NextStepIcon);
  const PrintIconVisibility = withVisibility(PrintIcon);
  const CaseOverViewIconVisibility = withVisibility(CaseOverViewIcon);

  // eslint-disable-next-line no-unused-vars
  const statusColorMap: { [key in Status]: { bgColor: string; textColor: string } } = {
    'Case Officer Allocation Pending': { bgColor: '#E0F0FF', textColor: '#67B1C9' },
    'Case Officer Allocation': { bgColor: '#E0F0FF', textColor: '#67B1C9' },
    'Local Organ Chosen': { bgColor: '#EEDABC', textColor: '#C88726' },
    'Local Organ Requested': { bgColor: '#EEDABC', textColor: '#C88726' },
    'Case Completed': { bgColor: '#CFEEBC', textColor: '#027545' }
  };

  // eslint-disable-next-line no-unused-vars
  const statusToPathMap: { [key in Status]?: string } = {
    'Case Officer Allocation Pending': '/donors/allocation',
    'Case Officer Allocation': '/donors/stepper',
    'Local Organ Chosen': '/donors/stepper',
    'Local Organ Requested': '/donors/stepper',
    'Case Completed': '/donors/stepper'
  };

  const handleChangeStatusClick = (status: Status) => {
    const path = statusToPathMap[status] || '/default-path';
    navigate(path);
  };

  return (
    <Box>
      <DataTable
        onCellClick={() => {}}
        rowData={data}
        columnDefs={[
          { field: 'id', headerName: 'S.No', sortable: false },
          { headerName: 'Donor ID', field: 'donorId', filter: true },
          { headerName: 'Donor Name', field: 'name' },
          {
            headerName: 'Gender/Age/Blood',
            cellRenderer: (params: { data: Donor }) => {
              const { age, gender, blood } = params.data;
              return (
                <Flex justifyItems={'center'} alignItems={'center'} gap={'20px'} height={'44px'}>
                  <Text className="!text-[14px] !font-normal !text-[#1A0616]">{gender}</Text>
                  <Text className="bg-[#C96767] rounded px-[3px] text-[white] !text-[13px]">{age}</Text>
                  <Text className="text-[#C83926] !text-[16px] !font-bold">{blood}</Text>
                </Flex>
              );
            }
          },
          { headerName: 'Hospital Name', field: 'hospitalName' },
          {
            headerName: 'Organ Consented',
            cellRenderer: (params: { data: Donor }) => {
              const { organConsents } = params.data;
              return <Box>{organConsents.join(', ')}</Box>;
            }
          },
          { headerName: 'Request Note', field: 'notes' },
          {
            headerName: 'Status',
            sortable: false,
            minWidth: 250,
            cellRenderer: (params: { data: Donor }) => {
              const { status } = params.data;
              const { bgColor, textColor } = statusColorMap[status];
              return (
                <Flex className="justify-center items-center h-[40px]">
                  <Flex
                    className="rounded-xl px-[10px] py-[10px]   h-[13px] justify-center items-center"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    <Text className="!text-[11px] !font-medium">{status}</Text>
                  </Flex>
                </Flex>
              );
            }
          },
          {
            headerName: 'Actions',
            sortable: false,
            minWidth: 200,
            cellRenderer: (params: { data: Donor }) => {
              const { status } = params.data;
              return (
                <Box className="flex gap-2 items-center h-[40px]">
                  <ViewIconVisibility className="cursor-pointer" isVisible={isViewforConfirm(status)} />
                  <EditIconVisibility
                    className="cursor-pointer"
                    onClick={() => navigate('/donors/add-donor')}
                    isVisible={isEditIconConfirm(status)}
                  />
                  <TerminateVisibility
                    className="cursor-pointer"
                    onClick={() => setOpenTerminate(true)}
                    isVisible={isTerminateIconConfirm(status)}
                  />
                  <ChangeStatusVisibility
                    className="cursor-pointer"
                    onClick={() => handleChangeStatusClick(status)}
                    isVisible={isChangeStatusIconConfirm(status)}
                  />
                  <PrintIconVisibility className="cursor-pointer" isVisible={isPrintIconConfirm(status)} />
                  <CaseOverViewIconVisibility
                    className="cursor-pointer"
                    isVisible={isCaseOverViewIconConfirm(status)}
                  />
                </Box>
              );
            }
          }
        ]}
      />
      <DonorDelete open={openDelete} onClose={handleDeleteDialog} />
      <TerminateDialog open={openTerminate} onClose={handleCloseTerminate} />
    </Box>
  );
};

export default ConfirmedDataTable;
