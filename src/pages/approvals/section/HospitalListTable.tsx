import { PhoneIcon, VerifyApprovalIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import { ContactList } from '@/pages/hospitals/section/dialogs';
import HospitalCard from '@/pages/hospitals/section/hospital-table/HospitalCard';
import { OrganCellRenderer } from '@/pages/hospitals/section/hospital-table/OrganCellRenderer';
import { OrganLicenseDialog } from '@/pages/hospitals/section/OrganLicenseDialog';
import { Hospital } from '@/types/hospital';
import { truncateTextByLines } from '@/utils/truncateText';
import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useLocation, useNavigate } from 'react-router';

interface HospitalListTableProps {
  list?: Hospital[];
}
const HospitalListTable: FC<HospitalListTableProps> = ({ list = [] }) => {
  const { isMobile } = useWindowType();
  const [selectedRow, setSelectedRow] = useState<Hospital | null>(null);
  const [openLicense, setOpenLicense] = useState(false);
  const [openContact, setContact] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' }
  };
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontSize: '16px',
    fontWeight: '400'
  };
  return (
    <Box>
      {!isMobile ? (
        <>
          <DataTable
            rowHeight={54}
            rowData={list}
            columnDefs={[
              { field: 'serialNumber', headerName: 'S.No', sortable: false, maxWidth: 90, cellStyle: rowStyle },
              {
                headerName: 'Hospital Name',
                headerTooltip: 'Hospital Name',
                cellRenderer: ({ data }: { data: Hospital }) => {
                  const { name } = data;
                  console.log('hospitals from recipient table ', name);
                  return (
                    <Box className="flex h-[40px] items-center justify-between w-full">
                      <Text className="truncate max-w-[calc(100%-32px)] textResponse">
                        {truncateTextByLines(data.name, 2, 100) ?? ''}
                      </Text>
                      <PhoneIcon
                        className="cursor-pointer ml-2"
                        onClick={() => {
                          setSelectedRow(data);
                          setContact(true);
                        }}
                      />
                    </Box>
                  );
                },
                minWidth: 200,
                cellStyle: rowStyle,
                wrapHeaderText: true
              },

              //       </Box>
              //     );
              //   },
              //   sortable: false
              // },
              { field: 'zone', headerName: 'Zone', headerTooltip: 'Zone', minWidth: 100, cellStyle: rowStyle },
              {
                field: 'hospitalType',
                headerName: 'Hospital Type',
                headerTooltip: 'Hospital Type',
                minWidth: 140,
                cellStyle: rowStyle
              },
              {
                headerName: 'Organs',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cellRenderer: (params: any) => {
                  const { organs } = params.data || {};
                  return (
                    <Box
                      className="flex items-center justify-center h-[40px]"
                      onClick={() => {
                        // handleRowClick(params.data);
                        // setOrgan(true);
                      }}
                    >
                      {/* {organs.map((x) => x.name).join(',')} */}
                      <OrganCellRenderer organs={organs ?? []} column={params.column} api={params.api} />
                    </Box>
                  );
                },
                minWidth: 200,
                headerTooltip: 'Organs',
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
                headerName: 'Actions',
                cellRenderer: ({ data }: { data: Hospital }) => {
                  return (
                    <Box className="flex gap-2 items-center h-[40px]">
                      <VerifyApprovalIcon
                        className="cursor-pointer"
                        onClick={() => {
                          if (!data) {
                            return;
                          }
                          navigate(`/hospitals/${data.id}/approvalview`, {
                            state: {
                              data: data,
                              isView: false,
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
        </>
      ) : (
        <>
          <Box className="w-full max-w-full px-2">
            <MobileCardRenderer
              list={list}
              renderCard={(item) => (
                <HospitalCard
                  key={item.id}
                  data={item}
                  setSelectedRow={setSelectedRow}
                  setContact={setContact}
                  isApprove={true}
                  // setOpenDelete={setOpenDelete}
                  // setOpenRestore={setOpenRestore}
                />
              )}
            />
          </Box>
        </>
      )}

      <ContactList open={openContact} onClose={() => setContact(false)} data={selectedRow} isHospital={true} />
      <OrganLicenseDialog open={openLicense} onClose={() => setOpenLicense(false)} />
    </Box>
  );
};

export default HospitalListTable;
