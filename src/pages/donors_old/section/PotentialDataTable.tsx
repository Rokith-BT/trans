import { DeleteIcon, EditIcon, MenuDropDownIcon, TerminateIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Flex, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import DonorDelete from './DonorDelete';
import { withVisibility } from '@/hoc/Visibility';
import {
  isDeleteforPotential,
  isEditforPotential,
  isMenuIconVisible,
  isTerminatforPotential,
  isViewforPotential
} from '@/utils/actionButtonStatus';
import TerminateDialog from './TerminateDialog';

interface Potential {
  id: string;
  donorId: string;
  name: string;
  hospitalName: string;
  notes: string;
  gender: string;
  age: string;
  blood: string;
  organConsents: string[];
  status: string;
}

export const returnFakeData = (): Array<Potential> => {
  return [...Array(15)].map((_, index) => ({
    id: (index + 1).toString(),
    donorId: '1234',
    name: 'maha',
    hospitalName: 'Govt Hospital India',
    notes: 'This is a test notes for the donor',
    gender: 'Female',
    age: '24',
    blood: 'B',
    organConsents: ['liver', 'heart', 'brain'],
    status: RandomStatus()
  }));
};

const potentialStatus = [
  'Ready for Review',
  'Draft',
  'Draft Deleted',
  'Requesting more Details',
  'Terminated',
  'Requesting Apnea Details'
];

const RandomStatus = () => {
  const random = Math.floor(Math.random() * potentialStatus.length);
  return potentialStatus[random];
};
interface PotentialDataTableProps {
  forApproval: boolean;
}

const PotentialDataTable: React.FC<PotentialDataTableProps> = ({ forApproval }) => {
  const [data, setData] = useState<Array<Potential>>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openTerminate, setOpenTerminate] = useState(false);
  const [openMenu, setOpenMenu] = useState<null | number | string>(null);

  useEffect(() => {
    let fetchData = returnFakeData();
    if (forApproval) {
      fetchData = fetchData.filter((item) => item.status === 'Ready for Review');
    }
    setData(fetchData);
  }, [forApproval]);

  const handleDeleteDialog = () => {
    setOpenDelete(false);
  };

  // for icons
  const ViewIconVisibility = withVisibility(ViewIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const TerminateIconVisibility = withVisibility(TerminateIcon);
  const MenuIconVisibility = withVisibility(MenuDropDownIcon);

  // for status color
  const StatusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    'Ready for Review': { bgColor: '#CFEEBC', textColor: '#027545' },
    Terminated: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Draft: { bgColor: '#EDEDED', textColor: '#71717A' },
    'Draft Deleted': { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Requesting Apnea Details': { bgColor: '#EEDABC', textColor: '#C88726' },
    'Requesting more Details': { bgColor: '#EEDABC', textColor: '#C88726' }
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
            headerName: 'Gender / Age / Blood',
            cellRenderer: (params: { data: Potential }) => {
              const { gender, age, blood } = params.data;
              return (
                <Flex justifyItems={'center'} alignItems={'center'} gap={'20px'} height={'44px'}>
                  <Text className="!text-[14px] !font-normal !text-[#1A0616]">{gender}</Text>
                  <Text className="bg-[#C96767] rounded px-[3px] text-[white] text-[13px]">{age}</Text>
                  <Text className="text-[#C83926] !text-[16px] !font-bold">{blood}</Text>
                </Flex>
              );
            }
          },
          { headerName: 'Hospital Name', field: 'hospitalName' },
          {
            headerName: 'Organ Consented',
            cellRenderer: (params: { data: Potential }) => {
              const { organConsents } = params.data;
              return <Box>{organConsents.join(', ')}</Box>;
            }
          },
          { headerName: 'Request Note', field: 'notes' },
          {
            headerName: 'Status',
            sortable: false,
            minWidth: 220,
            cellRenderer: (params: { data: Potential }) => {
              const { status } = params.data;
              const { bgColor, textColor } = StatusColor[status];
              return (
                <Box className="flex items-center h-[40px] justify-center">
                  <Text
                    className="!text-[11px] !font-[500] !px-2 rounded-lg"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor
                    }}
                  >
                    {status}
                  </Text>
                </Box>
              );
            }
          },
          {
            headerName: 'Actions',
            sortable: false,
            cellRenderer: (params: { data: Potential }) => {
              const { status, id } = params.data;
              const isMenuOpen = openMenu === id;
              return (
                <Flex className="h-[40px] justify-center items-center gap-[10px] relative">
                  <ViewIconVisibility className="cursor-pointer" isVisible={isViewforPotential(status)} />
                  <EditIconVisibility className="cursor-pointer" isVisible={isEditforPotential(status)} />
                  <DeleteIconVisibility
                    onClick={() => setOpenDelete(true)}
                    className="cursor-pointer"
                    isVisible={isDeleteforPotential(status)}
                  />
                  <TerminateIconVisibility
                    onClick={() => setOpenTerminate(true)}
                    className="cursor-pointer"
                    isVisible={isTerminatforPotential(status)}
                  />
                  <Box className="relative">
                    <MenuIconVisibility
                      className="cursor-pointer"
                      onClick={() => setOpenMenu(isMenuOpen ? null : id)}
                      isVisible={isMenuIconVisible(status)}
                    />
                    {isMenuOpen && (
                      <Box
                        className="absolute bottom-0 right-0 bg-white shadow-md p-2 rounded"
                        style={{ zIndex: 1000000 }}
                      >
                        <Text className="cursor-pointer">Requesting Apnoea Details</Text>
                        <Text className="cursor-pointer">Requesting More Details</Text>
                        <Text className="cursor-pointer">Draft Status Completed</Text>
                      </Box>
                    )}
                  </Box>
                </Flex>
              );
            }
          }
        ]}
      />
      <DonorDelete open={openDelete} onClose={handleDeleteDialog} />
      <TerminateDialog open={openTerminate} onClose={() => setOpenTerminate(false)} />
    </Box>
  );
};

export default PotentialDataTable;
