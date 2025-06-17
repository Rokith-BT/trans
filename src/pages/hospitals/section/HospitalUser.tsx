import { Box, DataTable, Text } from '@/atoms';
import React, { SVGProps, useState } from 'react';
import { withVisibility } from '@/hoc/Visibility';
import { CardSlashIcon, DeleteIcon, EditIcon, EyePink, ReportIcon, UndoIcon, ViewIcon } from '@/assets/icons';
// import { isEditLicense, isRestoreLicense, isViewLicense, isDeletedLicense } from '@/utils/actionButtonStatus';
import { UsersTable } from '@/types/common.type';
import { useNavigate } from 'react-router';
import { getOrganImage } from '@/utils/organimages';
import HeartImg from '@/assets/imgs/heart.png';
import {
  isDeletedLicense,
  isEditLicense,
  isRestoreLicense,
  isViewLicense,
  isRewokeLicense,
  isRenewLicense
} from '@/utils/actionButtonStatus';
import { useHospitalId } from '@/hooks/useHospitalID';
import { useRole } from '@/hooks/useRole';
import { OrganDeleteDialog } from './OrganDeleteDialog';
import { HospitalOrganDocumnets } from '@/types/organLicense';
import { OrganRestoreDialog } from './OrganRestoreDialog';
import { OrganLicenseDialog } from './OrganLicenseDialog';
import { formatDateAndTime } from '@/utils/dateutils';

interface HospitalUserTableProps {
  list?: HospitalOrganDocumnets[];
}

const HospitalLicenseTable: React.FC<HospitalUserTableProps> = ({ list = [] }) => {
  const navigate = useNavigate();
  const hospitalId = useHospitalId();
  const { isSuperAdmin } = useRole();
  const basePath = isSuperAdmin ? '/hospitals' : '';
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openLicenceView, setOpenLicenseView] = useState(false);
  const [currentSerialNumber, setCurrentSerialNumber] = useState<number>(-1);

  const [selectedData, setSelectedData] = useState<HospitalOrganDocumnets>();
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

  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Details Pending': { bgColor: '#EEDABC', textColor: '#C88726' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
    Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };

  //for file view
  const handleNext = () => {
    if (list.length === 0) return;
    const nextSerail = currentSerialNumber < list.length ? currentSerialNumber + 1 : 1;
    setCurrentSerialNumber(nextSerail);
  };
  const handlePrevious = () => {
    if (list.length === 0) return;
    const previousSerial = currentSerialNumber > 1 ? currentSerialNumber - 1 : list.length;
    setCurrentSerialNumber(previousSerial);
  };
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
          {
            headerName: 'S.No',
            field: 'serialNumber',
            maxWidth: 72,
            cellStyle: rowStyle,
            sortable: false
          },
          {
            headerName: 'Organs & Tissues',
            cellRenderer: (params: { data: HospitalOrganDocumnets }) => {
              const { organs } = params.data;
              return (
                <Box className="h-[40px] flex gap-4 items-center">
                  <img src={getOrganImage(organs?.name) || HeartImg} alt={organs?.name} className="w-7 h-7" />
                  <Text>{organs?.name}</Text>
                </Box>
              );
            },
            cellStyle: { ...rowStyle, justifyContent: 'flex-start' }
          },
          { field: 'organLicenceNumber', headerName: 'Organ Ref.No', cellStyle: rowStyle },
          {
            field: 'dmsLicensePath',
            headerName: 'Dms License',
            cellRenderer: (params: { data: HospitalOrganDocumnets }) => {
              const { serialNumber } = params.data || {};
              return (
                <Box className="h-[40px] flex items-center gap-2 ">
                  {/* {params.data?.dmsLicensePath} */}
                  <Text>View </Text>{' '}
                  <EyePink
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedData(params.data);
                      setCurrentSerialNumber(serialNumber);
                      setOpenLicenseView(true);
                    }}
                  />
                </Box>
              );
            },
            cellStyle: rowStyle
          },
          {
            headerName: 'License Issue Date',
            cellRenderer: (params: { data: HospitalOrganDocumnets }) => {
              const { formattedDate: licenseDate } =
                formatDateAndTime(params.data?.firstLevelOrganLicenceRegDate) || {};
              return (
                <Box className="h-[40px] flex items-center gap-2 ">
                  {/* {params.data?.dmsLicensePath} */}
                  <Text>{licenseDate ?? 'NA'} </Text>{' '}
                </Box>
              );
            },
            cellStyle: rowStyle
          },
          {
            field: 'licenseExpiryDate',
            headerName: 'License Expiry Date ',
            cellRenderer: (params: { data: HospitalOrganDocumnets }) => {
              const { formattedDate: licenseExpiryDate } = formatDateAndTime(params.data?.licenseExpiryDate);
              return (
                <Box className="h-[40px] flex items-center gap-2 ">
                  {/* {params.data?.dmsLicensePath} */}
                  <Text>{licenseExpiryDate ?? 'NA'} </Text>{' '}
                </Box>
              );
            },
            cellStyle: rowStyle
          },

          {
            headerName: 'Status',
            cellRenderer: (params: { data: UsersTable }) => {
              let status = params.data.status && params.data.status.trim();

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
                      sx={{
                        backgroundColor: bgColor,
                        color: textColor,
                        borderRadius: '8px',
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
            headerName: 'Action',
            cellRenderer: (params: { data: HospitalOrganDocumnets }) => {
              const { status } = params.data;

              return (
                <Box className="flex h-[40px]  gap-4 items-center">
                  <ViewIconVisibility
                    className="cursor-pointer"
                    isVisible={isViewLicense(status)}
                    onClick={() => {
                      navigate(`${basePath}/${hospitalId}/license-view`, {
                        state: { hospitalOrganData: params.data, isView: true, isFromHospital: true }
                      });
                    }}
                  />
                  {isSuperAdmin && (
                    <EditIconVisibility
                      className="cursor-pointer"
                      isVisible={isEditLicense(status)}
                      onClick={() => {
                        navigate(`${basePath}/${hospitalId}/license-view`, {
                          state: { hospitalOrganData: params.data, isEdit: true, isFromHospital: true }
                        });
                      }}
                    />
                  )}
                  <RevokeIconVisibility
                    className="cursor-pointer"
                    isVisible={isRewokeLicense(status)}
                    onClick={() => {
                      setSelectedData(params.data);
                      setOpenDeleteDialog(true);
                    }}
                  />
                  <DeleteIconVisibility className="cursor-pointer" isVisible={isDeletedLicense(status)} />
                  <RenewIconVisibility
                    isVisible={isRenewLicense(status)}
                    onClick={() => {
                      navigate(`${basePath}/${hospitalId}/license-view`, {
                        state: { organLicense: params.data, isEdit: true }
                      });
                    }}
                  />
                  <UndoIconVisibility
                    className="cursor-pointer"
                    isVisible={isRestoreLicense(status)}
                    onClick={() => {
                      setSelectedData(params.data);
                      setOpenRestoreDialog(true);
                    }}
                  />
                </Box>
              );
            },
            cellStyle: rowStyle
          }
        ]}
      />
      <OrganDeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        hospitalData={selectedData}
      />
      <OrganRestoreDialog
        open={openRestoreDialog}
        onClose={() => {
          setOpenRestoreDialog(false);
        }}
        hospitalData={selectedData}
      />
      <OrganLicenseDialog
        open={openLicenceView}
        onClose={() => {
          setOpenLicenseView(false);
          setCurrentSerialNumber(-1);
        }}
        documentUrl={list?.find((item) => item.serialNumber === currentSerialNumber)?.dmsLicensePath}
        currentPosition={currentSerialNumber}
        onNext={handleNext}
        onPrevious={handlePrevious}
        totalItems={list?.length}
      />
    </Box>
  );
};

export default HospitalLicenseTable;
