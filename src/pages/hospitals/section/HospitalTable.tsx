/* Deprecated */
import { Box, DataTable, Text } from '@/atoms';
import { FC, useState } from 'react';
import { withVisibility } from '@/hoc/Visibility';
import { DeleteIcon, EditIcon, FlagIcon, LoginIcon, PhoneIcon, UndoIcon, VerifyIcon, ViewIcon } from '@/assets/icons';
import {
  isDeleteforHospital,
  isEditforHosptial,
  isLoginIconHospital,
  isUndoIconHospital,
  isVerifyforHospital,
  isViewforHospital
} from '@/utils/actionButtonStatus';
import { useNavigate } from 'react-router';
import { Hospital } from '@/types/hospital';
import { DeleteHospitalDialog } from './DeleteHospitalDialog';
import { RestoreHospitalDialog } from './RestoreHospitalDialog';
// import { OrganLicenseDialog } from './OrganLicenseDialog';
import { useHospitals } from '../hospitalListContext';
// import { useHospital } from '../hospitalContext';
import QS from 'query-string';
import { ContactList } from './dialogs';
import { truncateTextByLines } from '@/utils/truncateText';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';

interface HospitalTableProps {
  list?: Hospital[];
}

const HospitalTable: FC<HospitalTableProps> = ({ list = [] }) => {
  const parsedQS = QS.parse(location.search);
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Hospital | null>(null);
  const [openRestore, setOpenRestore] = useState(false);
  // const [openLicense, setOpenLicense] = useState(false);
  const [openContact, setContact] = useState(false);
  // const [openorgan, setOrgan] = useState(false);
  // const [selectRow, setSelectRow] = useState<Hospital | undefined>(undefined);
  const {
    actions: { restoreHospital, deleteHospital, getAll }
  } = useHospitals();
  const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    'Details Pending': { bgColor: '#EEDABC', textColor: '#C88726' },
    'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
    Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };

  //for hospital icon
  const ViewIconVisibility = withVisibility(ViewIcon);
  const DeleteIconVisibility = withVisibility(DeleteIcon);
  const EditIconVisibility = withVisibility(EditIcon);
  const VerifyIconVisibility = withVisibility(VerifyIcon);
  const UndoIconVisibility = withVisibility(UndoIcon);
  const LoginIconVisibility = withVisibility(LoginIcon);
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '400'
  };
  return (
    <Box>
      <Box>
        <DataTable
          rowData={list}
          enableCellTextSelection={true}
          rowHeight={74}
          columnDefs={[
            { headerName: 'S.No', field: 'serialNumber', maxWidth: 72, sortable: false, cellStyle: rowStyle },
            {
              headerName: 'Hospital Name',
              headerTooltip: 'Hospital Name',
              minWidth: 300,
              cellRenderer: ({ data }: { data: Hospital }) => {
                return (
                  <Box className="flex w-full items-center justify-between gap-4">
                    <Text title={data.name}> {truncateTextByLines(data.name, 14, 2)}</Text>
                    <PhoneIcon
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRow(data);
                        setContact(true);
                      }}
                    />
                  </Box>
                );
              },
              valueGetter: ({ data }: { data: Hospital }) => {
                return data.name;
              },
              cellStyle: {
                display: 'flex',
                alignItems: 'center',
                fontSize: '16px',
                fontWeight: '400'
              }
            },
            { field: 'zone', headerName: 'Zone', headerTooltip: 'Zone', cellStyle: rowStyle },
            {
              field: 'hospitalType',
              headerName: 'Hospital Type',
              headerTooltip: 'Hospital Type',
              cellRenderer: ({ data }: { data: Hospital }) => {
                const { hospitalType } = data;
                return (
                  <Box className="flex gap-2 items-center">
                    {hospitalType} {hospitalType === 'NTORC' ? <FlagIcon /> : ''}
                  </Box>
                );
              },
              cellStyle: rowStyle
            },
            {
              headerName: 'Organs',
              cellRenderer: ({ data }: { data: Hospital }) => {
                const { organs } = data;
                return (
                  <Box className="h-[50px] flex items-center justify-center">
                    <OrganImageswithSlide Organs={organs} visibleCount={6} />
                  </Box>
                );
              },
              minWidth: 250,
              cellStyle: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '400'
              },
              sortable: false,
              headerTooltip: 'Organs'
            },
            {
              headerName: 'Status',
              cellRenderer: ({ data }: { data: Hospital }) => {
                let status = data.status && data.status.trim();
                if (status === 'PendingApproval') {
                  status = 'Pending Approval';
                } else if (status === 'DetailsPending') {
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
                return <></>;
              },
              valueGetter: ({ data }: { data: Hospital }) => {
                return data.status;
              },
              cellStyle: rowStyle,
              headerTooltip: 'Status'
            },
            {
              headerName: 'Actions',
              cellRenderer: ({ data }: { data: Hospital }) => {
                const { status } = data;

                return (
                  <Box className="flex gap-2 items-center h-[40px]">
                    <ViewIconVisibility
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/hospitals/${data.id}/view`, {
                          state: { data: data, isView: true }
                        });
                      }}
                      isVisible={isViewforHospital(status)}
                    />
                    <LoginIconVisibility
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRow(data);
                        const { status } = data;
                        let path = 'dashboard';
                        if (status === 'DetailsPending') path = 'onboarding';
                        navigate(`/hospitals/${data.id}/${path}`, { state: data });
                      }}
                      isVisible={isLoginIconHospital(status)}
                    />
                    <EditIconVisibility
                      onClick={() => {
                        setSelectedRow(data);
                        //need to change onboard here for detials pending
                        const { status } = data || {};
                        const route =
                          status === 'DetailsPending' || status === 'PendingApproval' || status === 'Rejected';
                        const path = route ? 'onboarding' : 'edit';
                        navigate(`/hospitals/${data.id}/${path}`, { state: { data: data, isTranstanAdmin: true } });
                      }}
                      className="cursor-pointer"
                      isVisible={isEditforHosptial(status)}
                    />
                    <VerifyIconVisibility className="cursor-pointer" isVisible={isVerifyforHospital(status)} />
                    <UndoIconVisibility
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRow(data);
                        setOpenRestore(true);
                      }}
                      isVisible={isUndoIconHospital(status)}
                    />
                    <DeleteIconVisibility
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedRow(data);
                        setOpenDelete(true);
                      }}
                      isVisible={isDeleteforHospital(status)}
                    />
                  </Box>
                );
              },
              headerTooltip: 'Actions',
              sortable: false,
              cellStyle: rowStyle
            }
          ]}
        />
        <DeleteHospitalDialog
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setSelectedRow(null);
          }}
          hospital={selectedRow}
          onDelete={(id: number, reason: string) => {
            deleteHospital(id, reason);
            getAll(parsedQS);
          }}
        />
        <RestoreHospitalDialog
          open={openRestore}
          onClose={() => setOpenRestore(false)}
          hospital={selectedRow}
          onRestore={(id: number, reason: string) => {
            restoreHospital(id, reason);
            getAll(parsedQS);
          }}
        />
        {/* <OrganLicenseDialog open={openLicense} onClose={() => setOpenLicense(false)} hospital={selectedHospital} /> */}
        <ContactList open={openContact} onClose={() => setContact(false)} data={selectedRow} isHospital={true} />
        {/*
      <OrganListDialog open={openorgan} onClose={() => setOrgan(false)} data2={selectRow} /> */}
      </Box>
    </Box>
  );
};

export default HospitalTable;
