import { PhoneIcon, VerifyApprovalIcon, ViewIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { ContactList } from '@/pages/hospitals/section/dialogs';
import { OrganLicenseDialog } from '@/pages/hospitals/section/OrganLicenseDialog';
import { Hospital } from '@/types/hospital';
import { OrganLicense } from '@/types/organLicense';
import { formatDateAndTime } from '@/utils/dateutils';
import { getOrganImage } from '@/utils/organimages';
import { truncateTextByLines } from '@/utils/truncateText';
import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeartImg from '@/assets/imgs/heart2.png';
import { useWindowType } from '@/hooks/useWindowType';
import OrganCard from '@/pages/hospitals/section/organ-table/OrganCard';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';

interface HospitalListTableProps {
  list: OrganLicense[];
  totalCount?: number;
}
const OrganListTable: FC<HospitalListTableProps> = ({ list = [], totalCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useWindowType();
  const [selectedData, setSelectedData] = useState<OrganLicense | null>(null);
  const [openLicense, setOpenLicense] = useState(false);
  const [contact, setContact] = useState(false);
  const [currentSerialNumber, setCurrentSerialNumber] = useState<number>(-1);

  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' }
  };
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
    justifyContent: 'left',
    fontSize: '16px',
    fontWeight: '400'
  };
  console.log('bread ', location);

  return (
    <Box>
      {!isMobile ? (
        <DataTable
          rowData={list}
          rowHeight={54}
          columnDefs={[
            {
              field: 'serialNumber',
              headerName: 'S.No',
              sortable: false,
              minWidth: 80,
              maxWidth: 100,
              cellStyle: rowStyle
            },
            {
              field: 'organType',
              headerName: 'Organ ',
              headerTooltip: 'Organ Type',
              cellRenderer: ({ data }: { data: OrganLicense }) => {
                const { organType } = data;
                return (
                  <Box className="flex gap-3 items-center justify-center">
                    <Box className="flex flex-col items-start" style={{ margin: 0 }}>
                      <img
                        src={getOrganImage(organType?.name) || HeartImg}
                        alt={organType?.name}
                        className="w-6 h-6"
                        style={{ display: 'block' }}
                      />
                      <Text className="!text-[11px] !font-[400] textResponse">{organType?.name}</Text>
                    </Box>
                  </Box>
                );
              },
              minWidth: 100,
              cellStyle: rowStyle
            },
            {
              headerName: 'Hospital Name',
              headerTooltip: 'Hospital Name',
              cellRenderer: ({ data }: { data: OrganLicense }) => {
                return (
                  <Box className="flex  items-center justify-between w-full">
                    <Text className="truncate max-w-[calc(100%-32px)] textResponse" title={data.hospitalName ?? ''}>
                      {truncateTextByLines(data.hospitalName, 1, 100) ?? ''}
                    </Text>
                    <PhoneIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedData(data);
                        setContact(true);
                      }}
                    />
                  </Box>
                );
              },
              minWidth: 170,
              cellStyle: rowStyle
            },

            {
              headerName: 'License Expiry Date',
              headerTooltip: 'License Expiry Date',
              cellRenderer: ({ data }: { data: OrganLicense }) => {
                const { serialNumber } = data || {};
                return (
                  <Box className="flex items-center h-[40px] gap-4">
                    {formatDateAndTime(data.licenceExpiryDate)?.formattedDate}
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
              minWidth: 180,
              cellStyle: rowStyle
            },
            {
              headerName: 'Status',
              cellRenderer: ({ data }: { data: Hospital }) => {
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
              },
              headerTooltip: 'Status',
              minWidth: 130,
              cellStyle: rowStyle
            },
            {
              field: 'paymentStatus',
              headerName: 'Payment Status',
              headerTooltip: 'Payment Status',
              minWidth: 150,
              cellStyle: rowStyle
            },
            {
              headerName: 'Actions',
              cellRenderer: ({ data }: { data: OrganLicense }) => {
                return (
                  <Box className="flex items-center h-[40px] gap-2">
                    <VerifyApprovalIcon
                      className="cursor-pointer"
                      onClick={() => {
                        const id = data.hospitalId;
                        navigate(`/hospitals/${id}/license-view`, {
                          state: {
                            organLicense: data,
                            isApproval: true,
                            origin: 'approvals',
                            tab: `${location.hash}`,
                            filter: `${location.search}`
                          }
                        });
                      }}
                    />
                  </Box>
                );
              },
              headerTooltip: 'Actions',
              minWidth: 100,
              maxWidth: 100,
              cellStyle: rowStyle
            }
          ]}
        />
      ) : (
        <>
          {' '}
          <Box className="w-full max-w-full px-2">
            <MobileCardRenderer
              list={list}
              renderCard={(item) => (
                <OrganCard
                  key={item.id}
                  data={item}
                  setSelectedData={setSelectedData}
                  setOpenLicense={setOpenLicense}
                  // setOpenDelete={setOpenDelete}
                  // setOpenRestore={setOpenRestore}
                  setCurrentSerialNumber={setCurrentSerialNumber}
                  isApprove={true}
                />
              )}
            />
          </Box>
        </>
      )}

      <ContactList open={contact} onClose={() => setContact(false)} organData={selectedData} isHospital={false} />
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

export default OrganListTable;
