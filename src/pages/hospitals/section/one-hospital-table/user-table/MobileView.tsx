import { DeleteIcon, EditIcon, UndoIcon, VerifyApprovalIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { withVisibility } from '@/hoc/Visibility';
import { useRole } from '@/hooks/useRole';
import { UsersTable } from '@/types/common.type';
import { isdeleteIconUser, isEditforUser } from '@/utils/actionButtonStatus';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import './UserTable.scss';
import { usePermissions } from '@/hooks/usePremission';

interface UserMobileViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
  hospitalName?: string;
  isUser?: boolean;
  pageSize?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedRow?: ((_data: UsersTable) => void | undefined) | undefined | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenDeletedialog?: ((_open: boolean) => void | undefined) | undefined | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenRestoreDialog?: ((_open: boolean) => void | undefined) | undefined | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenApproveDialog?: ((_open: boolean) => void | undefined) | undefined | any;
  isApprove?: boolean;
}
const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' }
};

const UserMobileView: React.FC<UserMobileViewProps> = ({
  data,
  hospitalName,
  isUser,
  //   pageSize,
  //   setOpenApproveDialog,
  setOpenDeletedialog,
  setOpenRestoreDialog,
  setSelectedRow,
  isApprove
}) => {
  console.log(data, 'datadatadatadesfcesfc');

  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(3, roleID);
  const basePath = isSuperAdmin ? '/hospitals' : '';
  const EditIconVisibility = withVisibility(EditIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const status = data.status ?? 'NA';
  const formattedStatus = data.status === 'PendingApproval' ? 'Pending Approval' : data.status;
  const colors = statusColor[status] ?? {
    bgColor: '#E0E0E0',
    textColor: '#333'
  };
  return (
    <Box className="card">
      <Box className="card-header">
        <Text className="serial">S.No. {data?.serialNumber ?? 0}</Text>
        <Box className="flex items-center gap-2">
          <Box
            sx={{
              backgroundColor: colors.bgColor,
              color: colors.textColor,
              padding: '2px 8px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '10px',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'auto'
            }}
          >
            {formattedStatus ?? 'NA'}
          </Box>
        </Box>
      </Box>

      <Box className="card-body">
        <Box className="flex items-center justify-start gap-1 hospital">
          <Text className="trans-label">Transtan ID: </Text>
          <Text className="trans-value">{data.transtanID ?? 'NA'}</Text>
        </Box>
        <Box className="flex">
          <Box style={{ marginTop: '8px', width: '100%' }}>
            <Box className="info-box flex flex-col gap-2">
              <Text className="row-label">
                Name <span className="row-value">{data.userName ?? 'NA'}</span>
              </Text>
              <Box className="info-row flex justify-between">
                <Box className="info-label">
                  Role <span className="info-value">{data.role.name ?? 'NA'}</span>
                </Box>
                <Box className="info-label-sp">surgeon, consultant</Box>
              </Box>

              <Box className="info-row flex justify-between">
                <Text className="info-label">
                  Specialization <span className="info-value">{'NA'}</span>
                </Text>
                <Text className="info-label">
                  Experience <span className="info-value">{'5 years'}</span>
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="flex items-center justify-between">
          {isApprove ? (
            <VerifyApprovalIcon
              className="cursor-pointer mt-3"
              onClick={() => {
                navigate(`/hospitals/${data?.hospitalID}/view-users`, { state: { data: data, isView: true } });
              }}
            />
          ) : (
            <Box className="h-[40px] flex items-center">
              {isUser ? (
                <Box>
                  <Box className="flex justify-center gap-[12px] cursor-pointer">
                    <EditIconVisibility
                      className="cursor-pointer"
                      isVisible={isEditforUser(status, canUpdate)}
                      onClick={() =>
                        navigate(`${basePath}/${data?.hospitalID}/edit-users`, {
                          state: {
                            data,
                            origin: 'hospitals',
                            hospitalId: `${data.hospitalID}`,
                            hospitalName: `${hospitalName}`,
                            tab: `${location.hash ?? '#users'}`,
                            filter: location.search
                          }
                        })
                      }
                    />
                    <DeleteIconVisibility
                      onClick={() => {
                        setOpenDeletedialog(true);
                        setSelectedRow(data);
                      }}
                      className="cursor-pointer"
                      isVisible={isdeleteIconUser(status, canDelete)}
                    />
                  </Box>
                </Box>
              ) : (
                <>
                  {canDelete && (
                    <UndoIcon
                      className=" cursor-pointer"
                      onClick={() => {
                        setOpenRestoreDialog(true);
                        setSelectedRow(data);
                      }}
                    />
                  )}
                </>
              )}
            </Box>
          )}

          <Box></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserMobileView;
