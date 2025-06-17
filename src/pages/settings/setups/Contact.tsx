import { AddMoreIcon2, DeleteIcon, EditIcon, UndoIcon } from '@/assets/icons';
import { Box, Button, Pagination, Text } from '@/atoms';
import { useEffect, useState } from 'react';
import SetupDataTable from './Table/SetupDataTable';
import { useMasterData } from './masterCotext';
import { useNavigate } from 'react-router';
import QS from 'query-string';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import { createSearchParams } from 'react-router-dom';
import AddRelationDialog from './Dialog/AddRelationDialog';
import ActionDialog from './Dialog/ActionDialog';
import { RelationTypeList } from '@/types/common.type';
import { toast } from '@/utils/toast';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';

const rowStyle = {
  display: 'flex',
  // width: '100%',
  alignItems: 'center',
  justifyContent: 'left',
  fontWeight: '400',
  fontSize: '16px'
};

const Contact = () => {
  const [openDialog, SetOpenDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RelationTypeList | null>(null);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);

  const {
    state: { relationTypeList, count },
    action: { getRelationTypeList, deleteRelationType, restoreRelationType }
  } = useMasterData();
  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#relationtype';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
    getRelationTypeList(parsedQS);
  }, []);

  useEffect(() => {
    getRelationTypeList(parsedQS);
  }, [location.search, location.hash]);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No',
      cellStyle: rowStyle,
      maxWidth: 120
    },
    { headerName: 'Relation Type', field: 'name', cellStyle: rowStyle },
    {
      headerName: 'Status',
      cellStyle: rowStyle,
      cellRenderer: (params: { data: RelationTypeList }) => {
        const { isActive } = params.data || {};
        return (
          <Box className="flex gap-2">
            <Text
              className=" !text-[12px] !font-[600] rounded-lg"
              sx={{
                color: isActive === 1 ? '#027545' : '#DD2323',
                backgroundColor: isActive === 1 ? '#CFEEBC' : '#FFE1E1',
                borderRadius: '8px',
                padding: '0px 8px',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {isActive === 1 ? 'Active' : 'Inactive'}
            </Text>
          </Box>
        );
      }
    },
    {
      headerName: 'Action',
      cellStyle: rowStyle,
      maxWidth: 120,
      cellRenderer: (params: { data: RelationTypeList }) => {
        const { isActive } = params.data || {};
        return (
          <Box className="flex gap-2">
            {canUpdate && (
              <EditIcon
                onClick={() => {
                  setSelectedRow(params.data);
                  SetOpenDialog(true);
                }}
              />
            )}

            {isActive === 1 ? (
              <>
                {canDelete && (
                  <DeleteIcon
                    onClick={() => {
                      setSelectedRow(params.data);
                      setActionDialog(true);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {canUpdate && (
                  <UndoIcon
                    onClick={() => {
                      setSelectedRow(params.data);
                      setActionDialog(true);
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

  return (
    <Box className="p-4 sm:p-6 md:p-8">
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Text className="!text-[19px] sm:!text-[20px] !font-bold text-[#804595]">Relation Type</Text>
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
        <SetupDataTable rowColoum={columns} rowData={relationTypeList} />
      </Box>
      {/* <SetupDialog open={openDialog} onClose={() => SetOpenDialog(false)} fieldName="Contact" /> */}
      <AddRelationDialog open={openDialog} onClose={() => SetOpenDialog(false)} selectedRow={selectedRow} />
      <ActionDialog
        open={actionDialog}
        onClose={() => {
          setActionDialog(false);
        }}
        selectedRelationData={selectedRow}
        onDelte={(id) =>
          deleteRelationType(id, () => {
            toast('Relation Deleted Successfully', 'success');
            getRelationTypeList(parsedQS);
          })
        }
        onRestore={(id) =>
          restoreRelationType(id, () => {
            toast('Relation Restored Successfully', 'success');
            getRelationTypeList(parsedQS);
          })
        }
      />
      {/* <SetupEditDialog
        open={openContactDialog}
        onClose={() => SetOpenContactDialog(false)}
        fieldName="Contact"
        id={''}
      /> */}
      {/* <DeleteDialog open={openDeleteDialog} onClose={() => SetOpenDeleteDialog(false)} id={''} /> */}
    </Box>
  );
};

export default Contact;
