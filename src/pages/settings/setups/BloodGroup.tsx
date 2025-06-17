import { AddMoreIcon2, DeleteIcon, EditIcon, UndoIcon } from '@/assets/icons';
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
import RestoreDialog from './RestoreDialog';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';
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

const BloodGroup: React.FC<OrganProps> = () => {
  const [openDialog, SetOpenDialog] = useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [openRestore, setOpenRestore] = useState(false);
  const [openBloodGroupDialog, SetOpenBloodGroupDialog] = useState(false);
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);
  const {
    state: { bloodGroupData, count, loading },
    action: { getBloodGroupList }
  } = useMasterData();
  useEffect(() => {
    getBloodGroupList({ _all: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog, openRestore, openBloodGroupDialog, openDeleteDialog]);
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#bloodgroup';
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
    getBloodGroupList(parsedQS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const columns = [
    {
      headerName: 'S.No',
      cellStyle: rowStyle,
      maxWidth: 120,
      cellRenderer: (params: {
        node: { rowIndex: never };
        api: { paginationGetPageSize: () => never; paginationGetCurrentPage: () => never };
      }) => {
        const rowIndex = params.node.rowIndex;
        const pageSize = params.api.paginationGetPageSize();
        const currentPage = params.api.paginationGetCurrentPage();
        return <>{currentPage * pageSize + rowIndex + 1}</>;
      }
    },
    { headerName: 'BloodGroup Name', field: 'name', cellStyle: rowStyle },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: { isActive: number } }) => {
        return (
          <Box>
            <Text
              className=" !text-[12px] !font-[600] rounded-lg"
              sx={{
                color: data.isActive === 1 ? '#027545' : '#FFE1E1',
                backgroundColor: data.isActive === 1 ? '#CFEEBC' : '#dd2323',
                borderRadius: '8px',
                padding: '0px 8px',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {data.isActive === 1 ? 'Active' : 'Inactive'}
            </Text>
          </Box>
        );
      },
      cellStyle: rowStyle
    },
    {
      headerName: 'Action',
      // field: 'name',
      cellStyle: rowStyle,
      maxWidth: 120,
      cellRenderer: ({ data }: { data: { isActive: number; id: number; name: string } }) => {
        return (
          <Box className="flex gap-1">
            {data?.isActive === 1 ? (
              <>
                {canDelete && (
                  <DeleteIcon
                    onClick={() => {
                      SetOpenDeleteDialog(true);
                      setId(data?.id);
                    }}
                  />
                )}
                {canUpdate && (
                  <EditIcon
                    onClick={() => {
                      SetOpenBloodGroupDialog(true);
                      setId(data.id);
                      setName(data.name);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {canUpdate && (
                  <UndoIcon
                    onClick={() => {
                      setOpenRestore(true);
                      setId(data?.id);
                    }}
                  />
                )}
              </>
            )}
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
        <Text className="!text-[18px] sm:!text-[20px] !font-bold text-[#804595]">Blood Group</Text>
        <Box className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <Button variant="contained" className="!bg-[#D876A9] w-full sm:w-[130px]" onClick={() => SetOpenDialog(true)}>
            <span className="flex items-center justify-center gap-x-2">
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
        <SetupDataTable rowColoum={columns} rowData={bloodGroupData} />
      </Box>
      <SetupDialog open={openDialog} onClose={() => SetOpenDialog(false)} fieldName="Blood Group" />
      <SetupEditDialog
        open={openBloodGroupDialog}
        onClose={() => SetOpenBloodGroupDialog(false)}
        fieldName="Blood Group"
        id={id}
        nameValue={name}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => SetOpenDeleteDialog(false)}
        id={id}
        fieldName="Blood Group"
      />
      <RestoreDialog open={openRestore} onClose={() => setOpenRestore(false)} id={id} fieldName="Blood Group" />
    </Box>
  );
};

export default BloodGroup;
