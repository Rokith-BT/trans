import { Box, Text } from '@/atoms';
import React from 'react';
import './MobileView.scss';
import { abbreviateHospitalType, abbreviateZone } from '@/utils/abbrevivations';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import {
  PhoneIcon,
  ViewIcon,
  DeleteIcon,
  EditIcon,
  UndoIcon,
  LoginIcon,
  FlagIcon,
  VerifyApprovalIcon
} from '@/assets/icons';
import { withVisibility } from '@/hoc/Visibility';
import { useLocation, useNavigate } from 'react-router';
import {
  isDeleteforHospital,
  isEditforHosptial,
  isLoginIconHospital,
  isUndoIconHospital,
  isViewforHospital
} from '@/utils/actionButtonStatus';
import { Hospital } from '@/types/hospital';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';

// const statusStyles: Record<string, string> = {
//   Active: 'badge active',
//   'Pending Approval': 'badge pending',
//   Expired: 'badge expired',
//   Deleted: 'badge expired',
//   null: 'badge pending'
// };
const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  DetailsPending: { bgColor: '#EEDABC', textColor: '#C88726' },
  PendingApproval: { bgColor: '#EEDABC', textColor: '#C88726' },
  Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};
const zoneTextColor: { [key: string]: { textColor: string } } = {
  West: { textColor: '#80C967' },
  North: { textColor: '#67B1C9' },
  South: { textColor: '#C96767' }
};
const hospitalTextColor: { [key: string]: { textColor: string } } = {
  Private: { textColor: '#C88726' },
  Government: { textColor: '#008774' }
};
interface HospitalCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  setSelectedRow: (_row: Hospital | null) => void;
  setContact: (_open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenDelete?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenRestore?: any;
  isApprove?: boolean;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  data,
  setContact,
  setOpenDelete,
  setOpenRestore,
  setSelectedRow,
  isApprove
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSuperAdmin, roleID } = useRole();
  const {
    canRead: canReadModule1,
    canDelete: canDeleteModule1,
    canUpdate: canUpdateModule1
  } = usePermissions(1, roleID);
  const { canCreate: canCreateModule2 } = usePermissions(1, roleID);
  const ViewIconVisibility = withVisibility(ViewIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  // const VerifyIconVisibility = withVisibility(VerifyIcon);
  const UndoIconVisibility = withVisibility(UndoIcon);
  const LoginIconVisibility = withVisibility(LoginIcon);

  const status = data.status ?? 'NA';
  const formattedStatus =
    data.status === 'PendingApproval'
      ? 'Pending Approval'
      : data.status === 'DetailsPending'
        ? 'Details Pending'
        : data.status;

  const colors = statusColor[status] ?? {
    bgColor: '#E0E0E0',
    textColor: '#333'
  };
  const zoneColors = zoneTextColor[data.zone] ?? {
    textColor: '#333'
  };
  const hospitalTypeColor = hospitalTextColor[data.hospitalType] ?? {
    textColor: '#333'
  };

  return (
    <Box className="card">
      <Box className="card-header">
        <Text className="serial">S.No. {data.serialNumber}</Text>
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

          <Box className="flex flex-col gap-1 ml-2">
            <Text
              sx={{
                color: zoneColors.textColor,
                fontWeight: 600,
                fontSize: '12px'
              }}
            >
              {abbreviateZone(data.zone)}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box className="card-body">
        <Box className="flex items-center justify-between hospital">
          <Text className="hospital_name">{data.name}</Text>
          <Text
            sx={{
              color: hospitalTypeColor.textColor,
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            {abbreviateHospitalType(data.hospitalType) === 'N' ? (
              <FlagIcon />
            ) : (
              abbreviateHospitalType(data.hospitalType)
            )}
          </Text>
        </Box>
        <Box className="info">
          <Box style={{ marginTop: '8px' }}>
            <Box className="organs">
              {data.organs.length > 0 ? (
                <>
                  <OrganImageswithSlide Organs={data.organs} />{' '}
                </>
              ) : (
                <Text className="!text-[10px]">No Organs</Text>
              )}
            </Box>
          </Box>
        </Box>
        {/* {data.reason && (
          <Box className="footer">
            <Text>Reason: {data.reason}</Text>
          </Box>
        )} */}
        <Box className="flex gap-2 items-center">
          <PhoneIcon
            className="cursor-pointer"
            onClick={() => {
              setSelectedRow(data);
              setContact(true);
            }}
          />
          {!isApprove ? (
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
              {/* <VerifyIconVisibility className="cursor-pointer" isVisible={isVerifyforHospital(status)} /> */}
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
          ) : (
            <Box className="flex gap-2 items-center h-[40px]">
              <VerifyApprovalIcon
                className="cursor-pointer"
                onClick={() => {
                  if (!data) {
                    return;
                  }
                  navigate(`/hospitals/${data.id}/approvalview`, { state: { data: data, isView: false } });
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default HospitalCard;
