// import React from 'react'

// const OrganCard = () => {
//   return (
//     <div>OrganCard</div>
//   )
// }

// export default OrganCard

import { Box, Text } from '@/atoms';
import React from 'react';
import { abbreviateHospitalType } from '@/utils/abbrevivations';
import { ViewIcon, DeleteIcon, EditIcon, UndoIcon, FlagIcon, VerifyIcon, VerifyApprovalIcon } from '@/assets/icons';
import { withVisibility } from '@/hoc/Visibility';
import { useLocation, useNavigate } from 'react-router';
import {
  isDeleteforOrgan,
  isEditforOrgan,
  isUndoIconOrgan,
  isVerifyforOrgan,
  isViewforOgran
} from '@/utils/actionButtonStatus';
import { HospitalsOrgansLicences } from '@/types/organLicense';
import './MobileView.scss';
import { getOrganImage } from '@/utils/organimages';
import HeartImg from '@/assets/imgs/heart2.png';
import { formatDateAndTime } from '@/utils/dateutils';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';
// const statusStyles: Record<string, string> = {
//   Active: 'badge active',
//   'Pending Approval': 'badge pending',
//   Expired: 'badge expired',
//   Deleted: 'badge expired',
//   null: 'badge pending'
// };

// const zoneTextColor: { [key: string]: { textColor: string } } = {
//   West: { textColor: '#80C967' },
//   North: { textColor: '#67B1C9' },
//   South: { textColor: '#C96767' }
// };
const hospitalTextColor: { [key: string]: { textColor: string } } = {
  Private: { textColor: '#C88726' },
  Government: { textColor: '#008774' }
};
const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Pending: { bgColor: '#EEDABC', textColor: '#C88726' },
  Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' }
};

interface OrganTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  totalCount?: number;
  setSelectedData: (_row: HospitalsOrgansLicences) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenDelete?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenRestore?: any;
  setOpenLicense: (_open: boolean) => void;
  setCurrentSerialNumber: (_data: number) => void;
  isApprove: boolean;
}

const OrganCard: React.FC<OrganTableProps> = ({
  data,
  setSelectedData,
  setOpenDelete,
  setOpenRestore,
  setOpenLicense,
  setCurrentSerialNumber,
  isApprove
}) => {
  console.log('organData ', data);
  const { roleID } = useRole();
  const { canRead, canDelete, canUpdate } = usePermissions(1, roleID);
  const navigate = useNavigate();
  const location = useLocation();
  //for organ icon
  const ViewIconVisibility = withVisibility(ViewIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const VerifyIconVisibility = withVisibility(VerifyIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const UndoIconVisibility = withVisibility(UndoIcon);

  const status = data.status ?? 'NA';
  const formattedStatus = data.status === 'PendingApproval' ? 'Pending Approval' : data.status;

  const colors = statusColor[status] ?? {
    bgColor: '#E0E0E0',
    textColor: '#333'
  };
  //   const zoneColors = zoneTextColor[data.zone] ?? {
  //     textColor: '#333'
  //   };
  const hospitalTypeColor = hospitalTextColor[data.hospitalType] ?? {
    textColor: '#333'
  };
  const { formattedDate: expiryDate } = formatDateAndTime(data.licenceExpiryDate);
  const { formattedDate: regDate } = formatDateAndTime(data.firstLevelOrganLicenceRegDate);
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

          <Box className="flex flex-col gap-1 ml-2">
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
        </Box>
      </Box>

      <Box className="card-body">
        <Box className="flex items-center justify-between hospital">
          <Text className="hospital_name">{data.hospitalName ?? 'NA'}</Text>
        </Box>
        <Box className="info">
          <Box style={{ marginTop: '8px' }}>
            <Box className="organs">
              {data.organType ? (
                <Box className="flex flex-col items-left justify-start gap-1" style={{ margin: 0 }}>
                  <img
                    src={getOrganImage(data.organType?.name) || HeartImg}
                    alt={data.organType?.name}
                    className="w-6 h-6"
                    style={{ display: 'block' }}
                  />
                  <Text className="!text-[11px] !font-[400]">{data.organType?.name}</Text>
                </Box>
              ) : (
                <Text className="!text-[10px]">No Organs</Text>
              )}
            </Box>
          </Box>
          <Box className="text-center">
            <Text className="text-[#80459580] !text-[10px] !font-[500] text-wrap ">
              Organ License Registration Date
            </Text>
            <Text className="text-[#804595] !text-[10px] !font-[500] ">{regDate ?? 'NA'}</Text>
          </Box>
          <Box className="text-center">
            <Text className="text-[#80459580] !text-[10px] !font-[500] ">License Expiry Date</Text>
            <Text className="text-[#804595] !text-[10px] !font-[500] ">{expiryDate ?? 'NA'}</Text>
          </Box>
        </Box>
        {/* {data.reason && (
          <Box className="footer">
            <Text>Reason: {data.reason}</Text>
          </Box>
        )} */}
        <Box className="flex items-center h-[40px] justify-between">
          {isApprove ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                const id = data.hospitalId;
                navigate(`/hospitals/${id}/license-view`, { state: { organLicense: data, isApproval: true } });
              }}
            />
          ) : (
            <Box className="flex items-center  gap-2">
              <ViewIconVisibility
                className="cursor-pointer"
                isVisible={isViewforOgran(status, canRead)}
                onClick={() => {
                  const id = data.hospitalId;
                  navigate(`/hospitals/${id}/license-view`, {
                    state: {
                      organLicense: data,
                      isView: true,
                      isTranstan: true,
                      origin: 'hospitals',
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
              <DeleteIconVisibility
                className="cursor-pointer"
                onClick={() => {
                  setSelectedData(data);
                  setOpenDelete(true);
                }}
                isVisible={isDeleteforOrgan(status, canDelete)}
              />
              <EditIconVisibility
                className="cursor-pointer"
                isVisible={isEditforOrgan(status, canUpdate)}
                onClick={() => {
                  const id = data.hospitalId;
                  navigate(`/hospitals/${id}/license-view`, {
                    state: {
                      organLicense: data,
                      isEdit: true,
                      isTranstan: true,
                      origin: 'hospitals',
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
              <VerifyIconVisibility className="cursor-pointer" isVisible={isVerifyforOrgan(status)} />
              <UndoIconVisibility
                className="cursor-pointer"
                onClick={() => {
                  setSelectedData(data);
                  setOpenRestore(true);
                }}
                isVisible={isUndoIconOrgan(status, canDelete)}
              />
            </Box>
          )}

          <Box>
            <Text
              className="text-[#67B1C9] !text-[12px] !font-[400] underline cursor-pointer"
              onClick={() => {
                setSelectedData(data);
                setCurrentSerialNumber(data.serialNumber ?? 0);
                setOpenLicense(true);
              }}
            >
              View License
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrganCard;
