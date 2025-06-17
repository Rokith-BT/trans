import { DeleteIcon, EditIcon, UndoIcon, ViewIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { TranstanUser } from '@/types/resource';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

interface ResourceTableProps {
  list: TranstanUser | unknown;
  isHospitalUser?: boolean;
  setSelectedRow: (_data: TranstanUser) => void;
  setOpenDeleteDialog: (_data: boolean) => void;
  canDelete?: boolean;
  canUpdate?: boolean;
  canRead?: boolean;
}
const statusColorMapping: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};
const MobileView: React.FC<ResourceTableProps> = ({
  list,
  isHospitalUser,
  setOpenDeleteDialog,
  setSelectedRow,
  canRead,
  canUpdate,
  canDelete
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const colors = statusColorMapping[list.status] ?? {
    bgColor: '#E0E0E0',
    textColor: '#333'
  };
  const status = list.status ?? '';
  const hospitalId = list.hospital?.id ?? 0;
  return (
    <Box className="border border-[#C967A2] p-3 flex flex-col gap-y-2 rounded-lg">
      <Box className="flex items-center justify-between">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          S.No <strong>{list.serialNumber ?? 'NA'}</strong>
        </Text>
        <Text className="!text-[12px] !font-[500] ">Transtan Id : {list.transtanID ?? 'NA'}</Text>
        <Text
          className="!text-[10px] !font-[400] p-[2px] rounded-md"
          sx={{
            color: colors.textColor,
            background: colors.bgColor
          }}
        >
          {list.status ?? 'NA'}
        </Text>
      </Box>
      <Box className="flex items-center justify-between">
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Name : <strong className="text-[13px] text-[black]">{list.userName ?? 'NA'}</strong>
        </Text>
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Role : <span className="text-[12px] text-[black] ">{list.role?.name ?? 'NA'}</span>
        </Text>
      </Box>
      <Box className="flex items-center justify-between">
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Mobile : <strong className="text-[13px] text-[black]">{list.primaryMobileNo ?? 'NA'}</strong>
        </Text>
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Email : <span className="text-[12px] text-[black] ">{list.email ?? 'NA'}</span>
        </Text>
      </Box>
      <Box className="flex items-center gap-3">
        {canRead && (
          <ViewIcon
            onClick={() =>
              !isHospitalUser
                ? navigate('/resource-management/view-transtan-user', {
                    state: {
                      isView: true,
                      id: list.transtanID,
                      origin: 'resource-management',
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  })
                : navigate(`/hospitals/${hospitalId}/view-users`, {
                    state: {
                      data: list,
                      isApproval: true,
                      origin: 'resource-management',
                      tab: `${location.hash}`,
                      filter: `${location.search}`
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
                      id: list.transtanID,
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
                    setSelectedRow(list);
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
                    setSelectedRow(list);
                    setOpenDeleteDialog(true);
                  }
                }}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default MobileView;
