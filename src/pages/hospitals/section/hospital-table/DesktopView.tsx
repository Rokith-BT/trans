import { FC } from 'react';
import { Box, DataTable, Text } from '@/atoms';
import { Hospital } from '@/types/hospital';
// import { truncateTextByLines } from '@/utils/truncateText';
import { DeleteIcon, EditIcon, FlagIcon, LoginIcon, PhoneIcon, UndoIcon, VerifyIcon, ViewIcon } from '@/assets/icons';
import { withVisibility } from '@/hoc/Visibility';
import { useLocation, useNavigate } from 'react-router';
import {
  isDeleteforHospital,
  isEditforHosptial,
  isLoginIconHospital,
  isUndoIconHospital,
  isVerifyforHospital,
  isViewforHospital
} from '@/utils/actionButtonStatus';
import { OrganCellRenderer } from './OrganCellRenderer';
import { usePermissions } from '@/hooks/usePremission';
import { useRole } from '@/hooks/useRole';

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'left',
  fontSize: '16px',
  fontWeight: '400'
};

const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Details Pending': { bgColor: '#EEDABC', textColor: '#C88726' },
  'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
  Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};

interface DesktopViewProps {
  list: Hospital[];
  setSelectedRow: (_row: Hospital | null) => void;
  setContact: (_open: boolean) => void;
  setOpenDelete: (_open: boolean) => void;
  setOpenRestore: (_open: boolean) => void;
}

const DesktopView: FC<DesktopViewProps> = ({ list, setSelectedRow, setContact, setOpenDelete, setOpenRestore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, roleID } = useRole();
  const {
    canRead: canReadModule1,
    canDelete: canDeleteModule1,
    canUpdate: canUpdateModule1
  } = usePermissions(1, roleID);
  const { canCreate: canCreateModule2 } = usePermissions(1, roleID);
  console.log(canCreateModule2, 'canCreateModule2');

  // const [selectedRow, setSelectedRow] = useState<Hospital | null>(null);
  // const [openContact, setContact] = useState(false);
  // const [openRestore, setOpenRestore] = useState(false);

  //for hospital icon
  const ViewIconVisibility = withVisibility(ViewIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const VerifyIconVisibility = withVisibility(VerifyIcon);
  const UndoIconVisibility = withVisibility(UndoIcon);
  const LoginIconVisibility = withVisibility(LoginIcon);

  return (
    <DataTable
      rowData={list}
      enableCellTextSelection={true}
      rowHeight={74}
      columnDefs={[
        {
          headerName: 'S.No',
          field: 'serialNumber',
          maxWidth: 72,
          sortable: false,
          cellStyle: rowStyle
        },
        {
          headerName: 'Hospital Name',
          headerTooltip: 'Hospital Name',
          minWidth: 300,
          cellRenderer: ({ data }: { data: Hospital }) => {
            return (
              <Box className="flex w-full h-[70px] items-center justify-between gap-4">
                {/* <Text title={data.name}> {truncateTextByLines(data.name, 12, 2)}</Text> */}
                <Text className="truncate max-w-[calc(100%-32px)] textResponse" title={data.name}>
                  {data.name}
                </Text>
                <PhoneIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedRow(data);
                    setContact(true);
                  }}
                />
              </Box>
            );
          },
          valueGetter: ({ data }: { data: Hospital }) => {
            return data.name;
          }
          // cellStyle: {
          //   display: 'flex',
          //   width:"100%",
          //   alignItems: 'center',
          //   justifyContent: 'space-between',
          //   fontSize: '16px',
          //   fontWeight: '400'
          // }
        },
        { field: 'zone', headerName: 'Zone', headerTooltip: 'Zone', cellStyle: rowStyle },
        {
          field: 'hospitalType',
          headerName: 'Hospital Type',
          headerTooltip: 'Hospital Type',
          cellRenderer: ({ data }: { data: Hospital }) => {
            const { hospitalType } = data;
            return (
              <Box className="flex gap-2 items-center">
                {hospitalType} {hospitalType === 'NTORC' ? <FlagIcon /> : ''}
              </Box>
            );
          },
          wrapHeaderText: true,
          minWidth: 120,
          cellStyle: rowStyle
        },
        {
          headerName: 'Organs',
          // cellRenderer: ({ data }: { data: Hospital }) => {
          //   const { organs } = data;
          //   return (
          //     <Box className="h-[50px] flex items-center justify-center flex-1 ">
          //       <OrganImageswithSlide Organs={organs}/>
          //     </Box>
          //   );
          // },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cellRenderer: (params: any) => {
            return <OrganCellRenderer organs={params.data.organs ?? []} column={params.column} api={params.api} />;
          },
          minWidth: 250,
          cellStyle: rowStyle,
          resizable: true,
          sortable: false,
          headerTooltip: 'Organs'
        },
        {
          headerName: 'Status',
          cellRenderer: ({ data }: { data: Hospital }) => {
            let status = data.status && data.status.trim();
            if (status === 'PendingApproval') {
              status = 'Pending Approval';
            } else if (status === 'DetailsPending') {
              status = 'Details Pending';
            }
            if (status) {
              const { bgColor, textColor } = statusColor[status] || { bgColor: '#FFFFFF', textColor: '#000000' };
              return (
                <Box className="flex items-center h-[40px]">
                  <Text
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                      borderRadius: '12px',
                      padding: '0px 8px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    {status}
                  </Text>
                </Box>
              );
            }
            return <></>;
          },
          valueGetter: ({ data }: { data: Hospital }) => {
            return data.status;
          },
          cellStyle: rowStyle,
          headerTooltip: 'Status'
        },
        {
          headerName: 'Actions',
          cellRenderer: ({ data }: { data: Hospital }) => {
            const { status } = data;

            return (
              <Box className="flex gap-2 items-center h-[40px]">
                <ViewIconVisibility
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/hospitals/${data.id}/view`, {
                      state: { data: data, isView: true }
                    });
                  }}
                  isVisible={isViewforHospital(status, canReadModule1)}
                />
                <LoginIconVisibility
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedRow(data);
                    const { status } = data;
                    let path = 'dashboard';
                    if (status === 'DetailsPending') path = 'onboarding';
                    navigate(`/hospitals/${data.id}/${path}`, {
                      state: {
                        allTrue: true,
                        data: data,
                        canCreateModule2: canCreateModule2,
                        origin: 'hospitals',
                        tab: `${location.hash}`,
                        filter: `${location.search}`
                      }
                    });
                  }}
                  isVisible={isLoginIconHospital(status, isSuperAdmin)}
                />
                <EditIconVisibility
                  onClick={() => {
                    setSelectedRow(data);
                    //need to change onboard here for detials pending
                    const { status } = data || {};
                    const route = status === 'DetailsPending' || status === 'PendingApproval' || status === 'Rejected';
                    const path = route ? 'onboarding' : 'edit';
                    navigate(`/hospitals/${data.id}/${path}`, {
                      state: {
                        data: data,
                        isTranstanAdmin: true,
                        origin: 'hospitals',
                        tab: `${location.hash}`,
                        filter: `${location.search}`
                      }
                    });
                  }}
                  className="cursor-pointer"
                  isVisible={isEditforHosptial(status, canUpdateModule1)}
                />
                <VerifyIconVisibility className="cursor-pointer" isVisible={isVerifyforHospital(status)} />
                <UndoIconVisibility
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedRow(data);
                    setOpenRestore(true);
                  }}
                  isVisible={isUndoIconHospital(status, canDeleteModule1)}
                />
                <DeleteIconVisibility
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedRow(data);
                    setOpenDelete(true);
                  }}
                  isVisible={isDeleteforHospital(status, canDeleteModule1)}
                />
              </Box>
            );
          },
          headerTooltip: 'Actions',
          sortable: false,
          cellStyle: rowStyle
        }
      ]}
    />
  );
};

export default DesktopView;
