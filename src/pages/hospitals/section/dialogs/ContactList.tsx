import { CloseCircleIcon } from '@/assets/icons';
import { Box, CustomDialog, DataTable, Text } from '@/atoms';
import { User } from '@/types/auth';
import { Hospital } from '@/types/hospital';
import React from 'react';
import { HospitalUsersProvider, useHospitalUsers } from '../../HospitalUserContext';
import { OrganLicense } from '@/types/organLicense';

interface ContactListProps {
  open: boolean;
  onClose: () => void;
  data?: Hospital | null;
  organData?: OrganLicense | null;
  users?: Array<User>;
  isHospital?: boolean;
}

export const ContactList: React.FC<ContactListProps> = ({ open, onClose, data, isHospital, organData }) => {
  const hospitalId = isHospital === true ? data?.id : organData?.hospitalId;
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md">
      {/* provider */}
      <HospitalUsersProvider hospitalId={hospitalId}>
        <Box px={3} py={2} className="relative">
          <Text className="text-[#804595] !text-[19px] !font-[600]">Contact List</Text>
          {data && (
            <Text className="text-[#C967A2] !mt-[8px] !mb-[16px] !text-[16px] !font-[500]">
              {isHospital === true ? data.name : organData?.hospitalName}
            </Text>
          )}
          <Box className="absolute -top-2 -right-2">
            <CloseCircleIcon
              toolText=""
              onClick={onClose}
              className="cursor-pointer h-[24px] w-[24px]"
              stroke="#A1999F"
            />
          </Box>
          <ContactTable />
        </Box>
      </HospitalUsersProvider>
    </CustomDialog>
  );
};

const ContactTable = () => {
  const { state } = useHospitalUsers();
  const { users } = state;

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontSize: '16px',
    fontWeight: '400'
  };
  return (
    <Box>
      <DataTable
        rowData={users}
        enableCellTextSelection={true}
        columnDefs={[
          {
            headerName: 'S.No',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            valueGetter: (params: any) => params.node.rowIndex + 1,
            cellStyle: rowStyle,
            maxWidth: 80,
            minWidth: 80
          },
          { field: 'firstName', headerName: 'Name', cellStyle: rowStyle, minWidth: 120 },
          { field: 'mobileNo', headerName: 'Phone', cellStyle: rowStyle, minWidth: 120 },
          {
            // field: 'email',
            headerName: 'Email',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (params: any) => {
              const { email } = params?.data || {};
              return (
                <Box className="w-full">
                  <Text className="overflow-hidden whitespace-nowrap text-ellipsis block max-w-[200px]">
                    {email ?? 'NA'}
                  </Text>
                </Box>
              );
            },
            cellStyle: rowStyle,
            minWidth: 220
          },
          { field: 'contactType', headerName: 'Contact Type', cellStyle: rowStyle, minWidth: 150 }
        ]}
      />
    </Box>
  );
};
