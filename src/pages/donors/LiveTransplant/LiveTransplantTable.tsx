/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditIcon, FemaleIcon, MaleIcon, TransgenderIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { TransplantTable } from '@/types/livetransplant/transplant.request.type';
import React, { useEffect, useState } from 'react';
import QS from 'query-string';
import { useDonor } from '../DonorContext';
import { useLocation, useNavigate } from 'react-router';
import TransplantDeleteDialog from './section/TransplantDeleteDialog';
import OrganImageswithSlide from '../../components/OrganImageswithSlide';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import MobileView from './MobileView';

interface LiveTransplantProps {
  list: [];
}

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: '400'
};

const AddLiveTransplantTable: React.FC<LiveTransplantProps> = () => {
  const location = useLocation();
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const parsedQS = QS.parse(location.search);
  const navigate = useNavigate();

  const baseColumnDefs = [
    { headerName: 'S.No', field: 'serialNumber', cellStyle: rowStyle },
    {
      headerName: 'Donor Hospital Name',
      cellStyle: rowStyle,
      cellRenderer: (parmas: { data: TransplantTable }) => {
        return <Box>{parmas?.data?.hospital?.name}</Box>;
      }
    },
    { headerName: 'Donor Name', field: 'donorName', cellStyle: rowStyle },
    {
      headerName: 'Gender/ Age/ Blood',
      cellRenderer: (parmas: { data: TransplantTable }) => {
        const { donorBloodGroup, donorGender } = parmas.data;
        return (
          <Box className="flex gap-[8px] h-[70px] items-center  w-full">
            <Text className="text-[#C83926] !text-[16px] !font-[700]">{donorBloodGroup.name}</Text>
            <Text
              className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600]`}
              // className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600] ${true ? 'bg-[#67B1C9] text-[white]' : false ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
            >
              {20}
            </Text>
            <Box>
              {donorGender?.name === 'Female' ? <FemaleIcon /> : ''}
              {donorGender?.name === 'Male' ? <MaleIcon /> : ''}
              {donorGender?.name === 'TransGender' ? <TransgenderIcon /> : ''}
            </Box>
          </Box>
        );
      },
      cellStyle: rowStyle
    },
    {
      headerName: 'Donor Address',
      cellStyle: rowStyle,
      cellRenderer: (parmas: { data: TransplantTable }) => {
        return (
          <Box>
            {parmas?.data?.donorAddressLine1 +
              ', ' +
              parmas?.data?.donorAddressLine2 +
              ', ' +
              parmas?.data?.donorTownVillage +
              ', ' +
              parmas.data.donorLandmark}
          </Box>
        );
      }
    },
    { headerName: 'Recipient Name', field: 'recipientName', cellStyle: rowStyle },
    {
      headerName: 'Gender/ Age/ Blood',
      cellRenderer: (parmas: { data: TransplantTable }) => {
        const { recipientBloodGroup, recipientGender } = parmas.data;
        return (
          <Box className="flex gap-[8px] h-[70px] items-center  w-full">
            <Text className="text-[#C83926] !text-[16px] !font-[700]">{recipientBloodGroup.name}</Text>
            <Text className={` px-[3px] py-[1px] rounded-[4px] text-center !text-[13px] !font-[600]`}>{20}</Text>
            <Box>
              {recipientGender?.name === 'Female' ? <FemaleIcon /> : ''}
              {recipientGender?.name === 'Male' ? <MaleIcon /> : ''}
              {recipientGender?.name === 'TransGender' ? <TransgenderIcon /> : ''}
            </Box>
          </Box>
        );
      },
      cellStyle: rowStyle
    },
    {
      headerName: 'Recipient Address',
      cellStyle: rowStyle,
      cellRenderer: (parmas: { data: TransplantTable }) => {
        return (
          <Box>
            {parmas?.data?.recipientAddressLine1 +
              ', ' +
              parmas?.data?.recipientAddressLine2 +
              ', ' +
              parmas?.data?.recipientTownVillage +
              ', ' +
              parmas.data.recipientLandmark}
          </Box>
        );
      }
    },
    {
      headerName: 'Donor Relationship',
      cellStyle: rowStyle,
      cellRenderer: (parmas: { data: TransplantTable }) => {
        return <Box>{parmas?.data?.relationship?.name}</Box>;
      }
    },
    {
      headerName: 'Transplant Organ',
      field: 'transplantOrgan',
      cellRenderer: ({ data }: { data: any }) => {
        const { organ } = data || {};
        const array = [];
        array.push(organ);
        return (
          <Box>
            <OrganImageswithSlide Organs={array} visibleCount={2} />
          </Box>
        );
      },
      cellStyle: rowStyle
    },
    {
      headerName: 'Date of Transplantation',
      field: 'dateOfSurgery',
      cellStyle: rowStyle
    },
    // {
    //   headerName: 'Status',
    //   cellRenderer: () => {
    //     return (
    //       <Box>
    //         <Text
    //           className="rounded-lg"
    //           sx={{
    //             borderRadius: '8px',
    //             padding: '0px 8px',
    //             fontSize: '11px',
    //             fontWeight: '600',
    //             color: '#027545',
    //             background: '#CFEEBC'
    //           }}
    //         >
    //           Active
    //         </Text>
    //       </Box>
    //     );
    //   },
    //   cellStyle: rowStyle
    // },

    {
      headerName: 'Action',
      cellRenderer: ({ data }: { data: TransplantTable }) => {
        return (
          <Box className="flex gap-1">
            <EditIcon
              onClick={() => {
                navigate(`/donors/livetransplant/transplantdetails/${data.id}/edit/`);
              }}
            />
            {/* <DeleteIcon onClick={() => SetOpenDeleteDialog(true)} /> */}
          </Box>
        );
      },
      cellStyle: rowStyle
    }
  ];

  const {
    action: { getLiveTransplantList },
    state: { liveTransplant }
  } = useDonor();
  console.log(liveTransplant, 'liveTransplant');

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };

    if (location.hash.trim().length === 0) {
      newLocation.hash = '#pdl';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', size: '10' };
    }
    if (!parsedQS.size) {
      searchParams = { ...searchParams, size: '10' };
    }
    console.log(searchParams, 'searchParams');

    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
  }, []);
  useEffect(() => {
    getLiveTransplantList(parsedQS);
  }, [location.search]);
  const { isMobile, isTablet } = useWindowType();

  return (
    <Box>
      {!isMobile && !isTablet ? (
        <DataTable rowData={liveTransplant} rowHeight={74} headerHeight={80} columnDefs={baseColumnDefs} />
      ) : (
        <MobileCardRenderer list={liveTransplant} renderCard={(item) => <MobileView list={item} />} />
      )}
      <TransplantDeleteDialog open={openDeleteDialog} onClose={() => SetOpenDeleteDialog(false)} />
    </Box>
  );
};

export default AddLiveTransplantTable;
