import { CardSlashIcon, DeleteIcon, EditIcon, ReportIcon, UndoIcon, ViewIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { withVisibility } from '@/hoc/Visibility';
import { useHospitalId } from '@/hooks/useHospitalID';
import { useRole } from '@/hooks/useRole';
import { HospitalOrganDocumnets } from '@/types/organLicense';
import HeartImg from '@/assets/imgs/heart2.png';

import {
  isDeletedLicense,
  isEditLicense,
  isRenewLicense,
  isRestoreLicense,
  isRewokeLicense,
  isViewLicense
} from '@/utils/actionButtonStatus';
import { getOrganImage } from '@/utils/organimages';
import React, { SVGProps } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { formatDateAndTime } from '@/utils/dateutils';
import { usePermissions } from '@/hooks/usePremission';

interface LicenseDesktopViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  hospitalName?: string;
  setSelectedData: (_data: HospitalOrganDocumnets) => void;
  setCurrentSerialNumber: (_data: number) => void;
  setOpenLicenseView: (_data: boolean) => void;
  setOpenDeleteDialog: (_data: boolean) => void;
  setOpenRestoreDialog: (_data: boolean) => void;
}

const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Details Pending': { bgColor: '#EEDABC', textColor: '#C88726' },
  'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
  Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};
const LicenseMobileView: React.FC<LicenseDesktopViewProps> = ({
  data,
  hospitalName,
  setSelectedData,
  setCurrentSerialNumber,
  setOpenLicenseView,
  setOpenDeleteDialog,
  setOpenRestoreDialog
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalId = useHospitalId();
  const { isSuperAdmin, roleID } = useRole();
  const { canRead, canDelete, canUpdate } = usePermissions(3, roleID);
  const basePath = isSuperAdmin ? '/hospitals' : '';
  const ViewIconVisibility = withVisibility(ViewIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const UndoIconVisibility = withVisibility(UndoIcon);
  const RevokeIconVisibility = withVisibility((props: SVGProps<SVGSVGElement> & { color?: string }) => (
    <CardSlashIcon {...props} color="#C967A2" toolText="Revoke" className="h-[24px]" />
  ));
  const RenewIconVisibility = withVisibility((props: SVGProps<SVGSVGElement>) => (
    <ReportIcon {...props} color="#C967A2" className="!h-[16px] !w-[16px] " strokeWidth={3} toolText="Renew" />
  ));
  const status = data.status ?? 'NA';
  const formattedStatus = data.status === 'PendingApproval' ? 'Pending Approval' : data.status;

  const colors = statusColor[status] ?? {
    bgColor: '#E0E0E0',
    textColor: '#333'
  };
  const { formattedDate: licenseDate } = formatDateAndTime(data?.firstLevelOrganLicenceRegDate) || {};
  const { formattedDate: licenseExpiryDate } = formatDateAndTime(data?.licenseExpiryDate) || {};
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
          <Text className="!text-[12px] !font-[500]">Organ License Number: </Text>
          <Text className="hospital_name">{data.organLicenceNumber ?? 'NA'}</Text>
        </Box>
        <Box className="info">
          <Box style={{ marginTop: '8px' }}>
            <Box className="organs">
              {data.organs ? (
                <Box className="flex flex-col items-left justify-start gap-1" style={{ margin: 0 }}>
                  <img
                    src={getOrganImage(data.organs?.name) || HeartImg}
                    alt={data.organs?.name}
                    className="w-6 h-6"
                    style={{ display: 'block' }}
                  />
                  <Text className="!text-[11px] !font-[400]">{data.organs?.name}</Text>
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
            <Text className="text-[#804595] !text-[10px] !font-[500] ">{licenseDate ?? 'NA'}</Text>
          </Box>
          <Box className="text-center">
            <Text className="text-[#80459580] !text-[10px] !font-[500] ">License Expiry Date</Text>
            <Text className="text-[#804595] !text-[10px] !font-[500] ">{licenseExpiryDate ?? 'NA'}</Text>
          </Box>
        </Box>
        {/* {data.reason && (
      <Box className="footer">
        <Text>Reason: {data.reason}</Text>
      </Box>
    )} */}
        <Box className="flex items-center justify-between">
          <Box className="flex h-[40px]  gap-4 items-center">
            <ViewIconVisibility
              className="cursor-pointer"
              isVisible={isViewLicense(status, canRead)}
              onClick={() => {
                navigate(`${basePath}/${hospitalId}/license-view`, {
                  state: {
                    hospitalOrganData: data,
                    isView: true,
                    isFromHospital: true,
                    origin: 'hospitals',
                    hospitalId: `${data.hospitalID}`,
                    hospitalName: `${hospitalName}`,
                    tab: `${location.hash}`,
                    filter: location.search
                  }
                });
              }}
            />
            {isSuperAdmin && (
              <EditIconVisibility
                className="cursor-pointer"
                isVisible={isEditLicense(status, canUpdate)}
                onClick={() => {
                  navigate(`${basePath}/${hospitalId}/license-view`, {
                    state: {
                      hospitalOrganData: data,
                      isEdit: true,
                      isFromHospital: true,
                      origin: 'hospitals',
                      hospitalId: `${data.hospitalID}`,
                      hospitalName: `${hospitalName}`,
                      tab: `${location.hash}`,
                      filter: location.search
                    }
                  });
                }}
              />
            )}
            <RevokeIconVisibility
              className="cursor-pointer"
              isVisible={isRewokeLicense(status, canUpdate)}
              onClick={() => {
                setSelectedData(data);
                setOpenDeleteDialog(true);
              }}
            />
            <DeleteIconVisibility className="cursor-pointer" isVisible={isDeletedLicense(status, canDelete)} />
            <RenewIconVisibility
              isVisible={isRenewLicense(status, canUpdate)}
              onClick={() => {
                navigate(`${basePath}/${hospitalId}/license-view`, {
                  state: {
                    organLicense: data,
                    isEdit: true,
                    origin: 'hospitals',
                    hospitalId: `${data.hospitalID}`,
                    hospitalName: `${hospitalName}`,
                    tab: `${location.hash}`,
                    filter: location.search
                  }
                });
              }}
            />
            <UndoIconVisibility
              className="cursor-pointer"
              isVisible={isRestoreLicense(status, canDelete)}
              onClick={() => {
                setSelectedData(data);
                setOpenRestoreDialog(true);
              }}
            />
          </Box>
          <Box>
            <Text
              className="text-[#67B1C9] !text-[12px] !font-[400] underline cursor-pointer"
              onClick={() => {
                setSelectedData(data);
                setCurrentSerialNumber(data.serialNumber ?? 0);
                setOpenLicenseView(true);
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

export default LicenseMobileView;
