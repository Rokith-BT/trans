import { AddMoreIcon2, DeleteIcon, EditIcon, UndoIcon } from '@/assets/icons';
import { Box, Button, Pagination, Text } from '@/atoms';
import { useEffect, useState } from 'react';
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

const rowStyle = {
  display: 'flex',
  // width: '100%',
  alignItems: 'center',
  justifyContent: 'left',
  fontWeight: '400',
  fontSize: '16px'
};

const Zone = () => {
  const [openDialog, SetOpenDialog] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [openEditDialog, SetOpenEditDialog] = useState(false);
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);

  const {
    state: { zones, count ,loading},
    action: { getZones }
  } = useMasterData();
  console.log(zones, 'zone');
  useEffect(() => {
    getZones({ _all: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog, openRestore, openEditDialog, openDeleteDialog]);
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#zone';
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
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(count / currentPageSize);

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
    { headerName: 'Zone', field: 'name', cellStyle: rowStyle },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: { isActive: number } }) => {
        return (
          <Box>
            <Text
              className=" !text-[12px] !font-[600] rounded-lg"
              sx={{
                color: data.isActive === 1 ? '#027545' : '#DD2323',
                backgroundColor: data.isActive === 1 ? '#CFEEBC' : '#FFE1E1',
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
      field: 'name',
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
                      setId(data.id);
                      SetOpenDeleteDialog(true);
                    }}
                  />
                )}
                {canUpdate && (
                  <EditIcon
                    onClick={() => {
                      SetOpenEditDialog(true);
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
                      setId(data.id);
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
        <Text className="!text-[18px] sm:!text-[20px] !font-bold text-[#804595]">Zone</Text>
        <Box className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <Button variant="contained" className="!bg-[#D876A9] w-full sm:w-[130px]" onClick={() => SetOpenDialog(true)}>
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
        <SetupDataTable rowColoum={columns} rowData={zones} />
      </Box>
      <SetupDialog open={openDialog} onClose={() => SetOpenDialog(false)} fieldName="Zone" />
      <SetupEditDialog
        open={openEditDialog}
        onClose={() => SetOpenEditDialog(false)}
        fieldName="Zone"
        id={id}
        nameValue={name}
      />
      <RestoreDialog open={openRestore} onClose={() => setOpenRestore(false)} id={id} fieldName="Zone" />
      <DeleteDialog open={openDeleteDialog} onClose={() => SetOpenDeleteDialog(false)} id={id} fieldName="Zone" />
    </Box>
  );
};

export default Zone;
