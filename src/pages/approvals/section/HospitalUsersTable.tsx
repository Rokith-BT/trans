import { PhoneIcon, ProfileIcon, VerifyApprovalIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import UserMobileView from '@/pages/hospitals/section/one-hospital-table/user-table/MobileView';
import { UsersTable } from '@/types/common.type';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface HospitalUsersTableProps {
  userRole: string;
  specialization?: string;
  isALFRole?: boolean;
  isExp?: boolean;
  showPhone?: boolean;
  list?: UsersTable[];
}

const HospitalUsersTable: React.FC<HospitalUsersTableProps> = ({
  // userRole,
  specialization,
  isALFRole,
  isExp,
  showPhone,
  list = []
}) => {
  const { isMobile } = useWindowType();

  const [data, setData] = useState<UsersTable[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Update state when the `list` prop changes
  useEffect(() => {
    setData(list);
  }, [list]);

  const baseColumnDefs = [
    { field: 'serialNumber', headerName: 'S.No', maxWidth: 100 },
    {
      headerName: 'Name',
      minWidth: 290,
      cellRenderer: (params: { data: UsersTable }) => {
        const { userName } = params.data;
        return (
          <Box className="flex h-[40px] items-center gap-3">
            <Box className="flex items-center justify-center h-[28px] w-[28px] rounded-full bg-[#8045954D]">
              <ProfileIcon className="h-[16px] w-[16px]" />
            </Box>
            <Text className="text-[16px] !font-[400] textResponse">{userName}</Text>
          </Box>
        );
      }
    },
    {
      headerName: 'Hospital Name',
      minWidth: 200,
      cellRenderer: (params: { data: UsersTable }) => {
        const { hospitalID } = params.data;
        return (
          <Box className="flex gap-3 h-[40px] items-center">
            <Text className='textResponse'>Hospital {hospitalID}</Text> {showPhone && <PhoneIcon />}
          </Box>
        );
      }
    },
    { field: 'transtanID', headerName: 'TRANSTAN ID' },
    {
      headerName: 'Role',
      cellRenderer: (params: { data: UsersTable }) => {
        const { role } = params.data;
        return (
          <>
            {isALFRole ? (
              <Box className="h-[40px] -m-1 flex flex-col items-start">
                <Text className="!text-[16px] !font-[400]">Doctor</Text>
                <Text className="!text-[13px] !text-[#A1999F] !font-[400]">Surgeon</Text>
              </Box>
            ) : (
              <Box className="flex items-center h-[40px]">
                <Text className='textResponse'>{role?.name}</Text>
              </Box>
            )}
          </>
        );
      }
    },
    isExp ? { field: 'experience', headerName: 'Experience' } : null,
    {
      headerName: 'Status',
      cellRenderer: (params: { data: UsersTable }) => {
        let status = params.data.status && params.data.status.trim();
        if (status === 'pendingApproval') {
          status = 'Pending Approval';
        }
        if (status === 'PendingApproval') {
          status = 'Pending Approval';
        }
        if (status === 'DetailsPending') {
          status = 'Details Pending';
        }
        return (
          <Box className="flex items-center h-[40px]">
            <Text className="!text-[#C88726] bg-[#EEDABC] rounded-xl !text-[11px] !font-[500] !px-[8px] !py-[2px]">
              {status}
            </Text>
          </Box>
        );
      }
    }
  ];

  const actionColumnDef = {
    headerName: 'Action',
    maxWidth: 110,
    cellRenderer: (params: { data: UsersTable }) => {
      const hospitalId = params.data.hospitalID ?? 0;
      return (
        <Box className="flex gap-3 h-[40px] items-center">
          <VerifyApprovalIcon
            className="cursor-pointer"
            onClick={() => {
              navigate(`/hospitals/${hospitalId}/view-users`, {
                state: {
                  data: params.data,
                  isView: true,
                  origin: `approvals`,
                  tab: `${location.hash}`,
                  filter: `${location.search}`
                }
              });
            }}
          />
        </Box>
      );
    }
  };

  const specializationColumnDef = specialization ? { field: 'specialization', headerName: 'Specialization' } : null;

  const columnDefs = [...baseColumnDefs, specializationColumnDef, actionColumnDef].filter((colDef) => colDef !== null);

  return (
    <Box>
      {!isMobile ? (
        <DataTable onCellClick={() => {}} rowData={data} columnDefs={columnDefs} />
      ) : (
        <Box className="w-full max-w-full px-2">
          <MobileCardRenderer
            list={list}
            renderCard={(item) => <UserMobileView data={item} pageSize={12} isUser={true} isApprove={true} />}
          />
        </Box>
      )}
    </Box>
  );
};

export default HospitalUsersTable;
