import { DeleteIcon, EditIcon, ProfileIcon, UndoIcon } from '@/assets/icons';
import { DataTable, Text, Box } from '@/atoms';
import React, { useState } from 'react';
import { RestoreHospitalDialog } from './RestoreHospitalDialog';
import { withVisibility } from '@/hoc/Visibility';
// import { isdeleteIconUser, isEditforUser } from '@/utils/actionButtonStatus';
import { DeleteHospitalDialog } from './DeleteHospitalDialog';
import { UsersTable } from '@/types/common.type';
import { useHospital } from '../hospitalContext';
import { useLocation, useNavigate } from 'react-router';
import UserApproveDialog from './UserApproveDialog';
import { isdeleteIconUser, isEditforUser } from '@/utils/actionButtonStatus';
import { useHospitalId } from '@/hooks/useHospitalID';
import { useRole } from '@/hooks/useRole';
import QS from 'query-string';

interface DeleteUserTableProps {
  pageSize?: number;
  data?: Array<UsersTable>;
  isUser?: boolean;
  list: UsersTable[] | null;
}

const DeleteUserTable: React.FC<DeleteUserTableProps> = ({ pageSize, isUser, list = [] }) => {
  const location = useLocation();
  const parsedQS = QS.parse(location.search);
  const {
    actions: { deleteHospitalUsers, getHospitalUsers, restoreHospitalUsers, approveHospitalUser },
    state: { hospitalUsers }
  } = useHospital();
  const hospitalId = useHospitalId();
  const { isSuperAdmin } = useRole();
  const basePath = isSuperAdmin ? '/hospitals' : '';

  const navigate = useNavigate();
  console.log('hosptial usrs from user table ', hospitalUsers);

  const [selectedRow, setSelectedRow] = useState<UsersTable | null>(null);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openDeleteDialog, setOpenDeletedialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' }
  };
  const EditIconVisibility = withVisibility(EditIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '400'
  };
  return (
    <Box>
      <DataTable
        rowData={list}
        rowHeight={52}
        columnDefs={[
          { headerName: 'S.No', field: 'serialNumber', maxWidth: 72, sortable: false, cellStyle: rowStyle },
          {
            headerName: 'User Name',
            cellRenderer: (params: { data: UsersTable }) => {
              const { userName } = params.data;
              return (
                <Box className="flex gap-2 h-[40px] items-center ">
                  <Box className="bg-[#80459553] p-2 rounded-full">
                    <ProfileIcon className="h-4 w-4 " />
                  </Box>
                  <Text>{userName}</Text>
                </Box>
              );
            },
            cellStyle: { ...rowStyle, justifyContent: 'flex-start' }
          },
          { field: 'transtanID', headerName: 'TRANSTAN ID', cellStyle: rowStyle },
          {
            headerName: 'Role',
            field: 'role',
            cellRenderer: (params: { data: UsersTable }) => {
              const { role } = params.data;
              const roleName = role?.name || 'No roles assigned';
              return (
                <Box className="h-[40px] flex items-center justify-center">
                  <Text>{roleName}</Text>
                </Box>
              );
            },
            cellStyle: rowStyle
          },
          {
            headerName: 'Specialization',
            cellRenderer: (params: { data: UsersTable }) => {
              const { specialization } = params.data;
              return (
                <Box className="h-[40px] flex items-center justify-center">
                  <Text>{specialization ? specialization : 'NA'}</Text>
                </Box>
              );
            },
            cellStyle: rowStyle
          },
          {
            headerName: 'Experience',
            cellRenderer: (params: { data: UsersTable }) => {
              const { experience } = params.data;
              return (
                <Box className="h-[40px] flex items-center justify-center">
                  <Text>{experience ? experience : 'NA'}</Text>
                </Box>
              );
            },
            cellStyle: rowStyle
          },
          {
            headerName: 'Status',
            cellRenderer: ({ data }: { data: UsersTable }) => {
              let status = data.status && data.status.trim();
              if (status === 'pendingApproval') {
                status = 'Pending Approval';
              }
              if (status === 'PendingApproval') {
                status = 'Pending Approval';
              }
              if (status === 'DetailsPending') {
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
            cellStyle: rowStyle
          },
          {
            headerName: 'Actions',
            cellRenderer: (params: { data: UsersTable }) => {
              const { status } = params.data;

              return (
                <Box className="h-[40px] flex items-center">
                  {isUser ? (
                    <Box>
                      <Box className="flex justify-center gap-[12px] cursor-pointer">
                        <EditIconVisibility
                          className="cursor-pointer"
                          isVisible={isEditforUser(status)}
                          onClick={() => navigate(`${basePath}/${hospitalId}/edit-users`, { state: params.data })}
                        />
                        <DeleteIconVisibility
                          onClick={() => {
                            setOpenDeletedialog(true);
                            setSelectedRow(params.data);
                          }}
                          className="cursor-pointer"
                          isVisible={isdeleteIconUser(status)}
                        />
                        {/* <VerifyIconVisibility
                          onClick={() => {
                            setOpenApproveDialog(true);
                            setSelectedRow(params.data);
                          }}
                          className="cursor-pointer"
                          isVisible={isPendingApproval(status)}
                        /> */}
                      </Box>
                    </Box>
                  ) : (
                    <UndoIcon
                      className=" cursor-pointer"
                      onClick={() => {
                        setOpenRestoreDialog(true);
                        setSelectedRow(params.data);
                      }}
                    />
                  )}
                </Box>
              );
            },
            cellStyle: rowStyle
          }
        ]}
        pageSize={pageSize}
      />
      <RestoreHospitalDialog
        open={openRestoreDialog}
        onClose={() => setOpenRestoreDialog(false)}
        user={selectedRow}
        onRestore={(id: number, reason: string) => {
          restoreHospitalUsers(id, reason);
          getHospitalUsers(parsedQS);
        }}
      />
      <DeleteHospitalDialog
        open={openDeleteDialog}
        onDelete={(id: number, reason: string) => {
          deleteHospitalUsers(id, reason);
          getHospitalUsers(parsedQS);
        }}
        onClose={() => setOpenDeletedialog(false)}
        user={selectedRow}
      />
      <UserApproveDialog
        open={openApproveDialog}
        onClose={() => {
          setOpenApproveDialog(false);
        }}
        selectedUser={selectedRow}
        onApprove={(id: number) => {
          approveHospitalUser(id);
        }}
      />
    </Box>
  );
};

export default DeleteUserTable;
