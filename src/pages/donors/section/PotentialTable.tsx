/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteIcon,
  EditIcon,
  FemaleIcon,
  MaleIcon,
  MenuDropDownIcon,
  TerminateIcon,
  TransgenderIcon,
  ViewIcon
} from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { DonorStatusType, PontentialDonor } from '@/types/donor';
import React, { useEffect, useState } from 'react';
import DonorDeleteDialog from '../add/section/DonorDeleteDialog';
import { useNavigate } from 'react-router';
// import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import RequestDetailsDialog from '../dialog/RequestDetailsDialog';
import PopupMenu from './PopupMenu';
import { useRole } from '@/hooks/useRole';
import { useDonor } from '../DonorContext';
import { OrganCellRenderer } from '@/pages/hospitals/section/hospital-table/OrganCellRenderer';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import PotentialMobileView from './PotentialMobileView';

interface PotentialTableProps {
  list: [];
}

const PotentialTable: React.FC<PotentialTableProps> = ({ list = [] }) => {
  const [openDonor, SetOpenDonor] = useState(false);
  const [openReq, setOpenReq] = useState(false);
  const [donorStaus, setDonorSta] = useState<DonorStatusType | null>(null);
  const [id, setId] = useState(0);
  const [donor, setDonor] = useState<PontentialDonor | null>(null);
  const [openTerminate, setOpenTerminate] = useState(false);
  const [open, setOpen] = useState(false);
  const { isSuperAdmin } = useRole();
  console.log(isSuperAdmin, 'rolerolerolerolerolerole');

  const {
    state: { getDonorStatuses },
    action: { getDonorStatus }
  } = useDonor();
  useEffect(() => {
    getDonorStatus();
  }, []);
  function toggleDropdown(e: React.MouseEvent, id: number) {
    console.log(e.currentTarget, 'e.currentTarget');
    setId(id);
    setOpen(true);
  }
  const { isMobile, isTablet } = useWindowType();

  const rowHeight = 74;
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };

  const navigate = useNavigate();

  const PotentialTextColor: { [key: string]: { bgColor: string; textColor: string } } = {
    2: { bgColor: '#CFEEBC', textColor: '#027545' },
    6: { bgColor: '#F4EADA', textColor: '#C88726' },
    7: { bgColor: '#F4EADA', textColor: '#C88726' },
    4: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    1: { bgColor: '#EDEDED', textColor: '#71717A' },
    3: { bgColor: '#EDEDED', textColor: '#71717A' }
    // draftDeleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
  };

  return (
    <Box>
      {!isMobile && !isTablet ? (
        <DataTable
          headerHeight={70}
          columnDefs={[
            { headerName: 'S.No', field: 'serialNumber', cellStyle: rowStyle, minWidth: 80, maxWidth: 90 },
            { headerName: 'Donor ID', field: 'id', minWidth: 100, cellStyle: rowStyle },
            {
              headerName: 'Donor Name',
              cellRenderer: (parmas: { data: PontentialDonor }) => {
                const { name } = parmas.data || {};
                return (
                  <Box className="w-full" title={name ?? 'NA'}>
                    <Text className="truncate ma-w-[calc(100%-32px)]">{name ?? 'NA'}</Text>
                  </Box>
                );
              },
              cellStyle: rowStyle,
              minWidth: 140
            },
            {
              headerName: 'Gender/ Age/ Blood',
              cellRenderer: (parmas: { data: PontentialDonor }) => {
                const { age, bloodGroup, gender } = parmas.data;
                return (
                  <Box className="flex gap-[8px] h-[70px] items-center  w-full">
                    <Text className="text-[#C83926] !text-[16px] !font-[700]">{bloodGroup}</Text>
                    <Text
                      className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600] ${age <= 20 ? 'bg-[#67B1C9] text-[white]' : age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
                    >
                      {age}
                    </Text>
                    <Box>
                      {gender === 'Female' ? <FemaleIcon /> : ''}
                      {gender === 'Male' ? <MaleIcon /> : ''}
                      {gender === 'TransGender' ? <TransgenderIcon /> : ''}
                    </Box>
                  </Box>
                );
              },
              cellStyle: rowStyle,
              minWidth: 180
            },
            {
              headerName: 'Hospital Name',
              cellRenderer: (parmas: { data: PontentialDonor }) => {
                const { hospitalName } = parmas.data || {};
                return (
                  <Box className="w-full" title={hospitalName ?? 'NA'}>
                    <Text className="truncate ma-w-[calc(100%-32px)]">{hospitalName ?? 'NA'}</Text>
                  </Box>
                );
              },
              cellStyle: rowStyle,
              minWidth: 140
            },
            {
              headerName: 'Organ Consented',
              cellRenderer: (params: any) => {
                const { organConsented } = params.data || {};
                return (
                  <Box>
                    {/* <OrganImageswithSlide Organs={organConsented} visibleCount={2} /> */}
                    <OrganCellRenderer api={params.api} column={params.column} organs={organConsented} />
                  </Box>
                );
              },
              minWidth: 200,
              cellStyle: rowStyle
            },
            // { headerName: 'Requested Note', field: 'notes', cellStyle: rowStyle },
            {
              headerName: 'Status',
              cellRenderer: ({ data }: { data: PontentialDonor }) => {
                const potentialStatus = data.statusId;
                const { bgColor, textColor } = PotentialTextColor[potentialStatus] || {
                  bgColor: 'white',
                  textColor: 'red'
                };
                return (
                  <Box>
                    <Text
                      className="rounded-lg"
                      sx={{
                        bgcolor: bgColor,
                        color: textColor,
                        borderRadius: '8px',
                        padding: '0px 8px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {potentialStatus === 1
                        ? 'Draft'
                        : potentialStatus === 2
                          ? 'Ready For Review'
                          : potentialStatus === 6
                            ? 'Requesting Apnea Details'
                            : potentialStatus === 3
                              ? 'Complete Draft Status'
                              : potentialStatus === 7
                                ? 'Requesting More Details'
                                : potentialStatus === 15 || potentialStatus === 4
                                  ? 'Terminated'
                                  : potentialStatus}
                    </Text>
                  </Box>
                );
              },
              minWidth: 140,
              cellStyle: rowStyle
            },
            {
              headerName: 'Action',
              cellRenderer: ({ data }: { data: PontentialDonor }) => {
                console.log(data, id, 'datadatadatadatadatadata12121');
                const potentialStatus = data.statusId;
                return (
                  <Box
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      cursor: 'pointer',
                      gap: 8
                    }}
                  >
                    {potentialStatus === 1 ? (
                      <>
                        {' '}
                        <ViewIcon />
                        <EditIcon
                          onClick={() =>
                            navigate(`/donors/${data.id}/edit/`, {
                              state: { isAddNew: false, isConsentGiven: true, hospitalId: data?.hospitalId }
                            })
                          }
                        />
                        <TerminateIcon
                          onClick={() => {
                            SetOpenDonor(true);
                            setOpenTerminate(true);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <ViewIcon />
                        <EditIcon
                          onClick={() =>
                            navigate(`/donors/${data.id}/edit/`, {
                              state: { isAddNew: false, isConsentGiven: true, hospitalId: data?.hospitalId }
                            })
                          }
                        />
                        <TerminateIcon
                          onClick={() => {
                            SetOpenDonor(true);
                            setOpenTerminate(true);
                            setDonor(data);
                          }}
                        />
                        <DeleteIcon
                          onClick={() => {
                            SetOpenDonor(true);
                            setOpenTerminate(false);
                          }}
                        />
                      </>
                    )}

                    {data.statusId === 2 && isSuperAdmin && (
                      <>
                        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
                          <Box onClick={(e) => toggleDropdown(e, data.id)} sx={{ cursor: 'pointer' }}>
                            <MenuDropDownIcon />
                          </Box>
                          {open && id == data.id && (
                            <PopupMenu
                              onClose={() => setOpen(false)}
                              setOpenReq={setOpenReq}
                              setDonorSta={setDonorSta}
                              setId={setId}
                              setDonor={setDonor}
                              data={data}
                              DonorStatuses={getDonorStatuses.filter((e: DonorStatusType) => [6, 7, 3].includes(e.id))}
                            />
                          )}
                        </Box>
                      </>
                    )}
                  </Box>
                );
              },
              minWidth: 160,
              maxWidth: 180,
              pinned: 'right',
              cellStyle: rowStyle
            }
          ]}
          rowData={list}
          rowHeight={rowHeight}
        />
      ) : (
        <MobileCardRenderer
          list={list}
          renderCard={(item) => (
            <PotentialMobileView
              list={item}
              SetOpenDonor={SetOpenDonor}
              setOpenReq={setOpenReq}
              open={open}
              setDonor={setDonor}
              setDonorSta={setDonorSta}
              setOpenTerminate={setOpenTerminate}
              getDonorStatuses={getDonorStatuses}
              id={id}
              setId={setId}
              setOpen={setOpen}
            />
          )}
        />
      )}
      <DonorDeleteDialog
        open={openDonor}
        onClose={() => SetOpenDonor(false)}
        isTerminate={openTerminate}
        // donorStaus={donorStaus}
        donor={donor}
      />
      <RequestDetailsDialog
        open={openReq}
        onClose={() => {
          setOpenReq(false);
        }}
        donorStaus={donorStaus}
        donor={donor}
      />
    </Box>
  );
};

export default PotentialTable;
