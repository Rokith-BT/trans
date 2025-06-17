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
  alignItems: 'center',
  justifyContent: 'left',
  fontWeight: '400',
  fontSize: '16px'
};

const CauseOfDeath = () => {
  const [openDialog, SetOpenDialog] = useState(false);
  const [openDiaEdit, setOpenDiaEdit] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [id, SetID] = useState(0);
  const [name, setName] = useState('');
  const [openDeleteDialog, SetOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);
  const {
    state: { causeOfDeath, count ,loading},
    action: { getCauseOfDeath }
  } = useMasterData();

  useEffect(() => {
    getCauseOfDeath(parsedQS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#cod';
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

  const columns = [
    {
      headerName: 'S.No',
      field: 'serialNo',
      cellStyle: rowStyle,
      maxWidth: 100,
      cellRenderer: (params: {
        node: { rowIndex: number };
        api: { paginationGetPageSize: () => number; paginationGetCurrentPage: () => number };
      }) => {
        const rowIndex = params.node.rowIndex;
        const pageSize = params.api.paginationGetPageSize();
        const currentPage = params.api.paginationGetCurrentPage();
        return <>{currentPage * pageSize + rowIndex + 1}</>;
      }
    },
    { headerName: 'Cause Of Death', field: 'name', cellStyle: rowStyle },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: { isActive: number } }) => (
        <Box>
          <Text
            className="!text-[12px] !font-[600] rounded-lg"
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
      ),
      cellStyle: rowStyle
    },
    {
      headerName: 'Action',
      field: 'name',
      cellStyle: rowStyle,
      maxWidth: 120,
      cellRenderer: ({ data }: { data: { isActive: number; id: number; name: string } }) => (
        <Box className="flex gap-1 justify-center">
          {data.isActive === 1 ? (
            <>
              {canDelete && (
                <DeleteIcon
                  onClick={() => {
                    SetOpenDeleteDialog(true);
                    SetID(data.id);
                  }}
                />
              )}
              {canUpdate && (
                <EditIcon
                  onClick={() => {
                    setOpenDiaEdit(true);
                    SetID(data.id);
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
                    SetID(data.id);
                  }}
                />
              )}
            </>
          )}
        </Box>
      )
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
      {/* Header Section */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Text className="!text-[18px] sm:!text-[20px] !font-bold text-[#804595]">Cause Of Death</Text>
        <Box className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
          <Button variant="contained" className="!bg-[#D876A9] w-full sm:w-[130px]" onClick={() => SetOpenDialog(true)}>
            <span className="flex items-center justify-center gap-x-2">
              <AddMoreIcon2 /> Add New
            </span>
          </Button>

          <Pagination
            totalPages={totalPages}
            onPageSizeChanged={(perPage: string) => {
              navigate({
                ...location,
                search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString()
              });
            }}
            page={Number(parsedQS.page) || 1}
            onChange={(_, page) => {
              navigate({
                ...location,
                search: createSearchParams({ ...parsedQS, page: page.toString() }).toString()
              });
            }}
            currentPageSize={Number(parsedQS.perPage) || 10}
            pageSizeOptions={PageSizeOptions}
          />
        </Box>
      </Box>

      {/* Table Section */}
      <Box className="mt-4 overflow-x-auto">
        <SetupDataTable rowColoum={columns} rowData={causeOfDeath} />
      </Box>

      {/* Dialogs */}
      <SetupDialog open={openDialog} onClose={() => SetOpenDialog(false)} fieldName="Cause Of Death" />
      <RestoreDialog open={openRestore} onClose={() => setOpenRestore(false)} id={id} fieldName="Cause Of Death" />
      <SetupEditDialog
        open={openDiaEdit}
        onClose={() => {
          setOpenDiaEdit(false);
          SetID(0);
        }}
        id={id}
        fieldName="Cause Of Death"
        nameValue={name}
      />
      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => SetOpenDeleteDialog(false)}
        id={id}
        fieldName="Cause Of Death"
      />
    </Box>
  );
};

export default CauseOfDeath;
