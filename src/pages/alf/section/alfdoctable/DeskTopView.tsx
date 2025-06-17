import { DeleteIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { RecipientAlfDoctor } from '@/types/alf';
import { ConsultantList, Gender } from '@/types/common.type';
import { formatDateAndTime } from '@/utils/dateutils';
import { toast } from '@/utils/toast';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ALFDataTableProps {
  list: RecipientAlfDoctor[];
  isAlfDeleted?: boolean;
  setOpenRestore: (_data: boolean) => void;
  setSelectedRow: (_data: RecipientAlfDoctor) => void;
  setOpenDeleteDialog: (_data: boolean) => void;
}
const DeskTopView: React.FC<ALFDataTableProps> = ({
  isAlfDeleted,
  list,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  setOpenRestore,
  setSelectedRow,
  setOpenDeleteDialog
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [fontSize, setFontSize] = useState('16px');
  const {
    state: { consultant }
  } = useMasterData();
  useEffect(() => {
    const updateFontSize = () => {
      if (window.innerWidth >= 1280 && window.innerWidth < 1600) {
        setFontSize('13px');
      } else {
        setFontSize('16px');
      }
    };

    updateFontSize(); // on mount
    window.addEventListener('resize', updateFontSize);

    return () => window.removeEventListener('resize', updateFontSize);
  }, []);
  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    active: { bgColor: '#CFEEBC', textColor: '#027545' },
    deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontSize: fontSize,
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
      minWidth: 120
    },
    {
      headerName: 'Name',
      flex: 1,
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { consultant } = data || {};
        return (
          <Box className="w-full">
            <Text className="truncate max-w-[calc(100%-10px)] textResponse">{consultant?.name}</Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      minWidth: 150
    },
    {
      field: 'transtanID',
      headerName: 'Transtan ID',
      cellStyle: rowStyle,
      minWidth: 200
    },
    {
      headerName: 'Role',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { role } = data || {};
        return (
          <Box className="flex flex-col items-start  py-[20px] ">
            <Text className="textResponse">{role?.name}</Text>
            {/* <Text className="text-[#A1999F] !text-[13px] !font-[400]">{subRole}</Text> */}
          </Box>
        );
      },
      cellStyle: rowStyle,
      minWidth: 180
    },

    {
      headerName: 'Specialization',
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { specialization } = data || {};
        const formattedSpecialization = specialization.map((s: Gender) => s.name.trim()).join(',');
        return (
          <Box className="w-full">
            <Text className="truncate max-w-[calc(100%-0px)] textResponse" title={formattedSpecialization}>
              {formattedSpecialization}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      minWidth: 190
    },
    {
      field: 'experience',
      headerName: 'Experience',
      cellStyle: rowStyle,
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
              className=""
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
      minWidth: 120
    },
    {
      headerName: 'ALF Reg Date',
      flex: 1,
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { alfRegistrationDate } = data || {};
        const { formattedDate } = formatDateAndTime(alfRegistrationDate);
        return (
          <Box>
            <Text className="textResponse">{formattedDate}</Text>
          </Box>
        );
      },
      cellStyle: rowStyle,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      minWidth: 150
    },
    isAlfDeleted
      ? {
          headerName: 'ALF Deleted Date',
          cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
            const { alfDeletedDate } = data || {};
            const { formattedDate } = formatDateAndTime(alfDeletedDate);
            return (
              <Box>
                <Text className="textResponse">{formattedDate}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle,
          minWidth: 180
        }
      : null,
    {
      headerName: 'Action',
      pinned: 'right',
      maxWidth: 150,
      cellRenderer: ({ data }: { data: RecipientAlfDoctor }) => {
        const { status } = data || {};
        const selctedConsultant = consultant.find((c: ConsultantList) => c.userID === data.consultant?.id);
        const hospitalID = selctedConsultant?.hospitalID;
        const userID = selctedConsultant?.userID;
        const payload = { hospitalID, userID };

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
                  state: {
                    selectedConsultant: payload,
                    isAlfDoctorView: true,
                    origin: 'alf/alf-doctor',
                    tab: `${location.hash}`
                  }
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
    </Box>
  );
};

export default DeskTopView;
