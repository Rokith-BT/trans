import { DeleteIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import React, { useState } from 'react';
import ALFRestoreDialog from './ALFRestoreDialog';
import ALFDeleteDialog from './ALFDeleteDialog';
import { RecipientAlfDoctor } from '@/types/alf';
import { formatDateAndTime } from '@/utils/dateutils';
import { ConsultantList, Gender } from '@/types/common.type';
import { useNavigate } from 'react-router';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { toast } from '@/utils/toast';

interface ALFDataTableProps {
  list: RecipientAlfDoctor[];
  isAlfDeleted?: boolean;
}

const ALFDataTable: React.FC<ALFDataTableProps> = ({ isAlfDeleted, list }) => {
  const navigate = useNavigate();
  const {
    state: { consultant }
  } = useMasterData();
  const [openRestore, setOpenRestore] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RecipientAlfDoctor>();
  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    active: { bgColor: '#CFEEBC', textColor: '#027545' },
    deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontSize: '16px',
    fontWeight: '400'
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columnDef: any = [
    {
      field: 'serialNumber',
      headerName: 'S.No',
      sortable: false,
      maxWidth: 72,
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    {
      headerName: 'Name',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { consultant } = data || {};
        return (
          <Box>
            <Text>{consultant?.name}</Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },
    {
      field: 'transtanID',
      headerName: 'TRANSTANID',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 200
    },
    {
      headerName: 'Role',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { role } = data || {};
        return (
          <Box className="flex flex-col items-start  py-[20px] ">
            <Text className="">{role?.name}</Text>
            {/* <Text className="text-[#A1999F] !text-[13px] !font-[400]">{subRole}</Text> */}
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 180
    },

    {
      headerName: 'Specialization',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { specialization } = data || {};
        const formattedSpecialization = specialization.map((s: Gender) => s.name.trim()).join(',');
        return (
          <Box className="w-full">
            <Text className="truncate max-w-[calc(100%-0px)]" title={formattedSpecialization}>
              {formattedSpecialization}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },
    {
      field: 'experience',
      headerName: 'Experience',
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { status } = data || {};
        const { bgColor, textColor } = statusColor[status.toLowerCase()] || { bgColor: '#fff', textColor: '#000' };

        return (
          <Box className="flex items-center justify-center h-[40px]">
            <Text
              sx={{
                background: bgColor,
                color: textColor,
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {status}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    {
      headerName: 'ALF Reg Date',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { alfRegistrationDate } = data || {};
        const { formattedDate } = formatDateAndTime(alfRegistrationDate);
        return (
          <Box>
            <Text>{formattedDate}</Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 120
    },
    isAlfDeleted
      ? {
          headerName: 'ALF Deleted Date',
          cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
            const { alfDeletedDate } = data || {};
            const { formattedDate } = formatDateAndTime(alfDeletedDate);
            return (
              <Box>
                <Text>{formattedDate}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          minWidth: 120
        }
      : null,
    {
      headerName: 'Action',
      pinned: 'right',
      maxWidth: 100,
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { status } = data || {};
        const selctedConsultant = consultant.find((c: ConsultantList) => c.userID === data.consultant?.id);
        const hospitalID = selctedConsultant?.hospitalID;
        const userID = selctedConsultant?.userID;
        const payload = { hospitalID, userID };
        console.log('hhh', hospitalID, selctedConsultant, consultant, userID);

        return (
          <Box className="flex h-[40px] items-center gap-2">
            <ViewIcon
              className="cursor-pointer"
              onClick={() => {
                if (hospitalID === undefined) {
                  toast('User Does not map with any Hospital', 'info');
                  return;
                }
                navigate(`/hospitals/${hospitalID}/view-users`, {
                  state: { selectedConsultant: payload, isAlfDoctorView: true }
                });
              }}
            />
            {status === 'Active' && (
              <>
                <DeleteIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setOpenDeleteDialog(true);
                    setSelectedRow(data);
                  }}
                />
              </>
            )}
          </Box>
        );
      },
      cellStyle: rowStyle
    }
  ].filter((col) => col !== null);
  return (
    <Box>
      <DataTable rowHeight={74} rowData={list} columnDefs={columnDef} />
      <ALFRestoreDialog open={openRestore} onclose={() => setOpenRestore(false)} />
      <ALFDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        isDoctorDelete={true}
        doctorData={selectedRow}
      />
    </Box>
  );
};

export default ALFDataTable;
