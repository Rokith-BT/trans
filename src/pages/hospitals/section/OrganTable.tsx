import { FC, useState } from 'react';
import { Box, DataTable, Text } from '@/atoms';
import { withVisibility } from '@/hoc/Visibility';
import { DeleteIcon, EditIcon, UndoIcon, VerifyIcon, ViewIcon } from '@/assets/icons';
import {
  isDeleteforOrgan,
  isEditforOrgan,
  isUndoIconOrgan,
  isVerifyforOrgan,
  isViewforOgran
} from '@/utils/actionButtonStatus';
import { OrganDeleteDialog } from './OrganDeleteDialog';
import { OrganRestoreDialog } from './OrganRestoreDialog';
import { HospitalsOrgansLicences } from '@/types/organLicense';
import { OrganLicenseDialog } from './OrganLicenseDialog';
import { useNavigate } from 'react-router';
import { getOrganImage } from '@/utils/organimages';
import HeartImg from '@/assets/imgs/heart.png';
interface OrganTableProps {
  list?: HospitalsOrgansLicences[];
  totalCount?: number;
}
const OrganTable: FC<OrganTableProps> = ({ list = [], totalCount = 0 }: OrganTableProps) => {
  const navigate = useNavigate();
  const [selectedData, setSelectedData] = useState<HospitalsOrgansLicences | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [openLicense, setOpenLicense] = useState(false);
  const [currentSerialNumber, setCurrentSerialNumber] = useState<number>(-1);

  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Pending: { bgColor: '#EEDABC', textColor: '#C88726' },
    Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' }
  };

  //for organ icon
  const ViewIconVisibility = withVisibility(ViewIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const VerifyIconVisibility = withVisibility(VerifyIcon);
  const UndoIconVisibility = withVisibility(UndoIcon);
  //for files view -> handlenext and handle Previous

  const handleNext = () => {
    if (list.length === 0) return;
    const nextSerail = currentSerialNumber < totalCount ? currentSerialNumber + 1 : 1;
    setCurrentSerialNumber(nextSerail);
  };
  const handlePrevious = () => {
    if (list.length === 0) return;
    const previousSerial = currentSerialNumber > 1 ? currentSerialNumber - 1 : totalCount;
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
        enableCellTextSelection={true}
        rowHeight={74}
        columnDefs={[
          { field: 'serialNumber', maxWidth: 72, headerName: 'S.No', sortable: false, cellStyle: rowStyle },
          {
            field: 'organType',
            headerName: 'Organ Type',
            cellStyle: rowStyle,
            headerTooltip: 'Organ Type',
            cellRenderer: ({ data }: { data: HospitalsOrgansLicences }) => {
              const { organType } = data;

              return (
                <Box className="flex py-[20px] px-[16px] gap-3 items-center justify-center">
                  <Box className="flex flex-col items-center justify-center gap-2" style={{ margin: 0 }}>
                    <img
                      src={getOrganImage(organType?.name) || HeartImg}
                      alt={organType?.name}
                      className="w-6 h-6"
                      style={{ display: 'block' }}
                    />
                    <Text className="!text-[11px] !font-[400]">{organType?.name}</Text>
                  </Box>
                </Box>
              );
            }
          },
          { field: 'hospitalName', headerName: 'Hospital Name', headerTooltip: 'Hospital Name', cellStyle: rowStyle },
          {
            headerName: 'License Expiry Date',
            headerTooltip: 'License Expiry Date',
            cellRenderer: ({ data }: { data: HospitalsOrgansLicences }) => {
              const { serialNumber } = data || {};
              return (
                <Box>
                  <ViewIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedData(data);
                      setCurrentSerialNumber(serialNumber);
                      setOpenLicense(true);
                    }}
                  />
                </Box>
              );
            },
            cellStyle: rowStyle
          },

          {
            headerName: 'Status',
            cellRenderer: ({ data }: { data: HospitalsOrgansLicences }) => {
              let status = data.status && data.status.trim();

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
            headerTooltip: 'Status',
            valueGetter: ({ data }: { data: HospitalsOrgansLicences }) => {
              return data.status;
            },
            cellStyle: rowStyle
          },
          {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            headerTooltip: 'Payment Status',
            cellStyle: rowStyle
          },
          {
            headerName: 'Actions',
            cellRenderer: ({ data }: { data: HospitalsOrgansLicences }) => {
              const { status } = data;

              return (
                <Box className="flex items-center h-[40px] gap-2">
                  <ViewIconVisibility
                    className="cursor-pointer"
                    isVisible={isViewforOgran(status)}
                    onClick={() => {
                      const id = data.hospitalId;
                      navigate(`/hospitals/${id}/license-view`, {
                        state: { organLicense: data, isView: true, isTranstan: true }
                      });
                    }}
                  />
                  <DeleteIconVisibility
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedData(data);
                      setOpenDelete(true);
                    }}
                    isVisible={isDeleteforOrgan(status)}
                  />
                  <EditIconVisibility
                    className="cursor-pointer"
                    isVisible={isEditforOrgan(status)}
                    onClick={() => {
                      const id = data.hospitalId;
                      navigate(`/hospitals/${id}/license-view`, {
                        state: { organLicense: data, isEdit: true, isTranstan: true }
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
                    isVisible={isUndoIconOrgan(status)}
                  />
                </Box>
              );
            },
            headerTooltip: 'Actions',
            cellStyle: rowStyle
          }
        ]}
      />
      <OrganDeleteDialog open={openDelete} onClose={() => setOpenDelete(false)} data={selectedData} />
      <OrganRestoreDialog open={openRestore} onClose={() => setOpenRestore(false)} data={selectedData} />
      <OrganLicenseDialog
        open={openLicense}
        onClose={() => {
          setOpenLicense(false);
          setCurrentSerialNumber(-1);
        }}
        hospital={list.find((item) => item.serialNumber === currentSerialNumber)}
        documentUrl={list.find((item) => item.serialNumber === currentSerialNumber)?.dmsLicenseDoc}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentPosition={currentSerialNumber}
        totalItems={totalCount}
      />
    </Box>
  );
};

export default OrganTable;
