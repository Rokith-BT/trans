import { AddMoreIcon2, DeleteIcon, EditIcon } from '@/assets/icons';
import { Box, Button, Pagination, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import SetupDialog from './Dialog/SetUpDialog';
import SetupDataTable from './Table/SetupDataTable';
import { useMasterData } from './masterCotext';
import DeleteDialog from './DeleteDialog';
import { useNavigate } from 'react-router';
import QS from 'query-string';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import { createSearchParams } from 'react-router-dom';
import SetupEditDialog from './Dialog/SetupEditDialog';
import { usePermissions } from '@/hooks/usePremission';
import { useRole } from '@/hooks/useRole';
import LoadingSmall from '@/pages/components/LoadingSmall';

export interface OrganProps {}

const rowStyle = {
  display: 'flex',
  // width: '100%',
  alignItems: 'center',
  justifyContent: 'left',
  fontWeight: '400',
  fontSize: '16px'
};

const Designation: React.FC<OrganProps> = () => {
  const [openDialog, SetOpenDialog] = useState(false);
  const [openDesDialog, SetOpenDesDialog] = useState(false);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);

  const {
    state: { designations, count ,loading},
    action: { getDesignation }
  } = useMasterData();
  console.log(designations, 'designations');
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#designation';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDesignation(parsedQS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const columns = [
    {
      headerName: 'S.No',
      field: 'serialNo',
      cellStyle: rowStyle,
      maxWidth: 120
    },
    { headerName: 'Designation', field: 'name', cellStyle: rowStyle },
    {
      headerName: 'Action',
      field: 'name',
      cellStyle: rowStyle,
      maxWidth: 120,
      cellRenderer: () => {
        return (
          <Box className="flex gap-1">
            {canDelete && <DeleteIcon onClick={() => SetOpenDeleteDialog(true)} />}
            {canUpdate && <EditIcon onClick={() => SetOpenDesDialog(true)} />}
          </Box>
        );
      }
    }
  ];
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);
  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen w-full">
        <LoadingSmall />
      </Box>
    );
  }
 

  return (
    <Box className="p-4 sm:p-6 md:p-8">
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Text className="!text-[19px] sm:!text-[20px] !font-bold text-[#804595]">Designation</Text>
        <Box className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <Button
            variant="contained"
            className="!bg-[#D876A9] w-[130px] sm:w-[130px]"
            onClick={() => SetOpenDialog(true)}
          >
            <span className="flex items-center justify-center gap-x-3">
              <AddMoreIcon2 /> Add New
            </span>
          </Button>
          <Pagination
            totalPages={totalPages}
            onPageSizeChanged={(perPage: string) => {
              navigate({ ...location, search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString() });
            }}
            page={(parsedQS && Number(parsedQS.page)) || 1}
            onChange={(_, page) => {
              navigate({
                ...location,
                search: createSearchParams({ ...parsedQS, page: page.toString() }).toString()
              });
            }}
            currentPageSize={(parsedQS && Number(parsedQS.perPage)) || 10}
            pageSizeOptions={PageSizeOptions}
          />
        </Box>
      </Box>
      <Box className="mt-4 overflow-x-auto">
        {/* <CustomTable columns={columns} rows={rows} paginationPosition="bottom" /> */}
        <SetupDataTable rowColoum={columns} rowData={designations} />
      </Box>
      <SetupDialog open={openDialog} onClose={() => SetOpenDialog(false)} fieldName="Designation" />
      <SetupEditDialog open={openDesDialog} onClose={() => SetOpenDesDialog(false)} fieldName="Designation" id={''} />
      <DeleteDialog open={openDeleteDialog} onClose={() => SetOpenDeleteDialog(false)} id={''} fieldName={''} />
    </Box>
  );
};

export default Designation;
