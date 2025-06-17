import { Box, DataTable, Text } from '@/atoms';
import React, { useState } from 'react';
import { Licience } from './OneHospital';
import { withVisibility } from '@/hoc/Visibility';
import { isRenewLicense, isRestoreLicense, isRewokeLicense } from '@/utils/actionButtonStatus';
import { ViewIcon } from '@/assets/icons';
import { RewokeDialog } from './RewokeDialog';
import { RenewLicense } from './RenewLicenseDialog';
import { LicenseRestoreDialog } from './LicenseRestoreDialog';

interface HospitalLicenseTableProps {
  pageSize: number;
  data: Array<Licience>;
}

const HospitalLicenseTable: React.FC<HospitalLicenseTableProps> = ({ pageSize, data }) => {
  const [dialogState, setDialogState] = useState({
    open: false,
    type: '' as 'rewoke' | 'renew' | 'restore' | '',
    selectedRow: undefined as Licience | undefined
  });

  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };
  const handleOpenDialog = (type: 'rewoke' | 'renew' | 'restore', row?: Licience) => {
    setDialogState({ open: true, type, selectedRow: row });
  };

  const rewoke = (row: Licience) => {
    return (
      <Box>
        <Text
          onClick={() => handleOpenDialog('rewoke', row)}
          className="text-[#804595] !text-[16px] !font-[400]  underline underline-offset-4 cursor-pointer"
        >
          Rewoke
        </Text>
      </Box>
    );
  };
  const renew = (row: Licience) => {
    return (
      <Box>
        <Text
          onClick={() => handleOpenDialog('renew', row)}
          className="text-[#C967A2] !text-[16px] !font-[400]  underline underline-offset-4  cursor-pointer"
        >
          Renew
        </Text>
      </Box>
    );
  };
  const restore = (row: Licience) => {
    return (
      <Box>
        <Text
          onClick={() => handleOpenDialog('restore', row)}
          className="text-[#C967A2] !text-[16px] !font-[400]  underline underline-offset-4  cursor-pointer"
        >
          Restore
        </Text>
      </Box>
    );
  };

  const RewokeVisibility = withVisibility(({ data }: { data: Licience }) => rewoke(data));
  const RenewVisibility = withVisibility(({ data }: { data: Licience }) => renew(data));
  const RestoreVisibility = withVisibility(({ data }: { data: Licience }) => restore(data));

  return (
    <Box>
      <DataTable
        onCellClick={() => {}}
        rowData={data}
        paginationPageSize={pageSize}
        columnDefs={[
          { field: 'id', headerName: 'S.No' },
          { field: 'organs', headerName: 'Organs & Tissues' },
          { field: 'refno', headerName: 'Organs Ref.no' },
          {
            headerName: 'DMS License',
            cellRenderer: (params: { data: Licience }) => {
              const { dmslis } = params.data;
              return (
                <Box className="flex gap-4 items-center !text-[16px] !font-[400]">
                  {dmslis}
                  <ViewIcon className="cursor-pointer" />
                </Box>
              );
            }
          },
          { field: 'lid', headerName: 'License Issue Date' },
          { field: 'led', headerName: 'License Expiry Date' },
          {
            headerName: 'Status',
            cellRenderer: (params: { data: Licience }) => {
              const { status } = params.data;
              const { bgColor, textColor } = statusColor[status];
              return (
                <Box className="h-[40px] flex items-center">
                  <Text
                    className="!text-[11px] !font-[500] rounded-xl px-2"
                    sx={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {status}
                  </Text>
                </Box>
              );
            }
          },
          {
            headerName: 'Action',
            cellRenderer: (params: { data: Licience }) => {
              const { status } = params.data;
              return (
                <Box className="flex gap-4 h-[40px] items-center">
                  <RewokeVisibility isVisible={isRewokeLicense(status)} data={params.data} />
                  <RenewVisibility isVisible={isRenewLicense(status)} data={params.data} />
                  <RestoreVisibility isVisible={isRestoreLicense(status)} data={params.data} />
                </Box>
              );
            }
          }
        ]}
      />
      <RewokeDialog
        open={dialogState.open && dialogState.type === 'rewoke'}
        onClose={() => setDialogState({ ...dialogState, open: false })}
        data={dialogState.selectedRow}
      />
      <RenewLicense
        open={dialogState.open && dialogState.type === 'renew'}
        onClose={() => setDialogState({ ...dialogState, open: false })}
        data2={dialogState.selectedRow}
      />
      <LicenseRestoreDialog
        open={dialogState.open && dialogState.type === 'restore'}
        onClose={() => setDialogState({ ...dialogState, open: false })}
        data2={dialogState.selectedRow}
      />
    </Box>
  );
};

export default HospitalLicenseTable;
