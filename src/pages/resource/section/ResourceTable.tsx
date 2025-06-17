import { DeleteIcon, EditIcon, UndoIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { TranstanUser } from '@/types/resource';
import React, { useState } from 'react';
import ActionDialog from './ActionDialog';
import { useLocation, useNavigate } from 'react-router';

interface ResourceTableProps {
  list: TranstanUser[];
  isHospitalUser?: boolean;
  canRead: boolean;
  canDelete: boolean;
  canUpdate?: boolean;
}

const statusColorMapping: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};

const ResourceTable: React.FC<ResourceTableProps> = ({
  list = [],
  isHospitalUser = false,
  canDelete,
  canRead,
  canUpdate
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRow, setSelectedRow] = useState<TranstanUser>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };

  const baseColumnDefs = [
    { field: 'serialNumber', headerName: 'S.No', maxWidth: 100, cellStyle: rowStyle },
    { field: 'userName', headerName: 'Name', cellStyle: rowStyle },
    { field: 'transtanID', headerName: 'Transtan ID', cellStyle: rowStyle },
    isHospitalUser
      ? {
          headerName: 'Hospital',
          cellRenderer: ({ data }: { data: TranstanUser }) => {
            const { hospital } = data || {};
            return (
              <Box>
                <Text>{hospital.name ?? ''}</Text>
              </Box>
            );
          },
          cellStyle: rowStyle
        }
      : null,
    { field: 'primaryMobileNo', headerName: 'Mobile', cellStyle: rowStyle },
    { field: 'email', headerName: 'Eamil', cellStyle: rowStyle },
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
      cellStyle: rowStyle
    },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { status } = data || {};
        const { bgColor, textColor } = statusColorMapping[status] || { bgColor: 'white', textColor: 'black' };
        return (
          <Box>
            <Text
              sx={{
                backgroundColor: bgColor,
                color: textColor
              }}
              className="rounded-[12px] px-2 py-[2px] !text-[11px] !font-[500] "
            >
              {status}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle
    },
    {
      headerName: 'Actions',
      cellRenderer: ({ data }: { data: TranstanUser }) => {
        const { status } = data || {};
        const hospitalId = data.hospital?.id ?? 0;
        return (
          <Box className="flex items-center gap-3">
            {canRead && (
              <ViewIcon
                onClick={() =>
                  !isHospitalUser
                    ? navigate('/resource-management/view-transtan-user', {
                        state: {
                          isView: true,
                          id: data.transtanID,
                          origin: 'resource-management',
                          filter: location.search,
                          tab: location.hash
                        }
                      })
                    : navigate(`/hospitals/${hospitalId}/view-users`, {
                        state: {
                          data: data,
                          isApproval: true,
                          origin: 'resource-management',
                          filter: location.search,
                          tab: location.hash
                        }
                      })
                }
              />
            )}
            {location.hash === '#resourcemanagement' && canUpdate && (
              <EditIcon
                onClick={() =>
                  !isHospitalUser
                    ? navigate('/resource-management/view-transtan-user', {
                        state: {
                          isEdit: true,
                          id: data.transtanID
                        }
                      })
                    : navigate(`/hospitals/${hospitalId}/view-users`, { state: { data: data, isApproval: true } })
                }
              />
            )}

            {/* {location.hash === '#resourcemanagement' && (
              <>
                {canUpdate && (
                  <EditIcon
                    onClick={() =>
                      !isHospitalUser
                        ? navigate('/resource-management/view-transtan-user', {
                            state: { isEdit: true, id: data.transtanID }
                          })
                        : ''
                    }
                  />
                )}
              </>
            )} */}
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
            ) : (
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
            )}
          </Box>
        );
      },
      cellStyle: rowStyle
    }
  ].filter((colDef) => colDef !== null);
  return (
    <Box>
      <DataTable columnDefs={baseColumnDefs} rowData={list} />
      <ActionDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        selectedRow={selectedRow}
      />
    </Box>
  );
};

export default ResourceTable;
