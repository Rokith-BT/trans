import { DeleteIcon, EditIcon, UndoIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import LoadingSmall from '@/pages/components/LoadingSmall';
import { TranstanUser } from '@/types/resource';
import { toast } from '@/utils/toast';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ResourceTableProps {
  list: TranstanUser[];
  isHospitalUser?: boolean;
  setSelectedRow: (_data: TranstanUser) => void;
  setOpenDeleteDialog: (_data: boolean) => void;
  canDelete?: boolean;
  canUpdate?: boolean;
  canRead?: boolean;
}
const statusColorMapping: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
  Rejected: { bgColor: '#F5C6CB', textColor: '#842029' }
};
const DeskTopView: React.FC<ResourceTableProps> = ({
  list = [],
  isHospitalUser = false,
  setSelectedRow,
  setOpenDeleteDialog,
  canDelete,
  canUpdate,
  canRead
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseColumnDefs: any = [
    { field: 'serialNumber', headerName: 'S.No', maxWidth: 90, minWidth: 80, cellStyle: rowStyle },
    {
      headerName: 'Name',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { userName } = data || {};
        return (
          <Box className="w-full">
            <Text className="truncate max-w-[calc(100%-0px)] textResponse">{userName ?? 'NA'}</Text>
          </Box>
        );
      },
      minWidth: 150,
      cellStyle: rowStyle
    },
    {
      headerName: 'Transtan ID',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { transtanID } = data || {};
        return (
          <Box className="w-full">
            <Text className="truncate max-w-[calc(100%-0px)] textResponse">{transtanID ?? 'NA'}</Text>
          </Box>
        );
      },
      minWidth: 150,
      cellStyle: rowStyle
    },
    isHospitalUser
      ? {
          headerName: 'Hospital',
          cellRenderer: ({ data }: { data: TranstanUser }) => {
            const { hospital } = data || {};
            return (
              <Box className="w-full">
                <Text className="truncate max-w-[calc(100%-0px)] textResponse">{hospital.name ?? ''}</Text>
              </Box>
            );
          },
          minWidth: 150,
          cellStyle: rowStyle
        }
      : null,
    { field: 'primaryMobileNo', headerName: 'Mobile', minWidth: 130, cellStyle: rowStyle },
    {
      field: 'email',
      headerName: 'Eamil',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { email } = data || {};
        return (
          <Box className="w-full">
            <Text className="truncate max-w-[calc(100%-0px)] textResponse">{email ?? ''}</Text>
          </Box>
        );
      },
      minWidth: 170,
      cellStyle: rowStyle
    },
    {
      headerName: 'Role',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { role } = data || {};
        return (
          <Box>
            <Text className="textResponse">{role === null ? 'NA' : (role.name ?? '')}</Text>
          </Box>
        );
      },
      minWidth: 170,
      cellStyle: rowStyle
    },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { status } = data || {};
        const formatStatus = status === 'PendingApproval' || status === 'pendingApproval' ? 'Pending Approval' : status;
        const { bgColor, textColor } = statusColorMapping[formatStatus] || { bgColor: 'white', textColor: 'black' };
        return (
          <Box>
            <Text
              sx={{
                backgroundColor: bgColor,
                color: textColor
              }}
              className="rounded-[12px] px-2 py-[2px] !text-[11px] !font-[500] "
            >
              {formatStatus}
            </Text>
          </Box>
        );
      },
      minWidth: 120,
      cellStyle: rowStyle
    },
    {
      headerName: 'Actions',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { status } = data || {};
        const hospitalId = data.hospital?.id ?? 0;

        const handleViewClick = () => {
          if (location.hash === '#usermanagement' && data.userID === null) {
            toast('User Not Found, cannot view', 'error');
            return;
          }

          if (!isHospitalUser) {
            navigate('/resource-management/view-transtan-user?', {
              state: {
                isView: true,
                id: data.transtanID,
                origin: 'resource-management',
                tab: 'resourcemanagement',
                filter: `${location.search}`
              }
            });
          } else {
            navigate(`/hospitals/${hospitalId}/view-users`, {
              state: {
                data,
                isApproval: true,
                origin: 'resource-management',
                tab: 'usermanagement',
                filter: `${location.search}`
              }
            });
          }
        };
        return (
          <Box className="flex items-center gap-3">
            {canRead && <ViewIcon onClick={handleViewClick} />}
            {location.hash === '#resourcemanagement' && canUpdate && (
              <EditIcon
                onClick={() =>
                  !isHospitalUser
                    ? navigate('/resource-management/view-transtan-user', {
                        state: {
                          isEdit: true,
                          id: data.transtanID,
                          origin: 'resource-management',
                          tab: `${location.hash}`,
                          filter: `${location.search}`
                        }
                      })
                    : ''
                }
              />
            )}
            {status === 'Active' ? (
              <>
                {canDelete && (
                  <DeleteIcon
                    onClick={() => {
                      if (!isHospitalUser) {
                        setSelectedRow(data);
                        setOpenDeleteDialog(true);
                      }
                    }}
                  />
                )}
              </>
            ) : status === 'Deleted' ? (
              <>
                {canDelete && (
                  <UndoIcon
                    onClick={() => {
                      if (!isHospitalUser) {
                        setSelectedRow(data);
                        setOpenDeleteDialog(true);
                      }
                    }}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </Box>
        );
      },
      minWidth: 120,
      maxWidth: 120,
      pinned: 'right',
      cellStyle: rowStyle
    }
  ].filter((colDef) => colDef !== null);
  return (
    <Box>
      {list.length <= 0 ? (
        <Box className="mt-[30%]">
          <LoadingSmall />
        </Box>
      ) : (
        <DataTable columnDefs={baseColumnDefs} rowData={list} />
      )}
    </Box>
  );
};

export default DeskTopView;
