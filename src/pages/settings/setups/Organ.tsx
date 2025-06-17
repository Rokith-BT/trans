import { AddMoreIcon2, DeleteIcon, EditIcon, UndoIcon } from '@/assets/icons';
import { Box, Button, DataTable, Pagination, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useMasterData } from './masterCotext';
import { useNavigate } from 'react-router';
import QS from 'query-string';
import PaginationOptions from '@/data/pageSizeOptions.json';
import { createSearchParams } from 'react-router-dom';
import type { Organ } from '@/types/common.type';
import AddNewDialog from './Dialog/AddNewDialog';
import { toast } from '@/utils/toast';
import ActionDialog from './Dialog/ActionDialog';
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

const Organ = () => {
  const [openDialog, SetOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Organ | null>(null);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);
  const {
    state: { organList, count,loading },
    action: { postOrgans, getAllOrganList, restoreOrgan, deleteOrgans }
  } = useMasterData();
  useEffect(() => {
    getAllOrganList({ _all: true });
  }, [openDialog, openActionDialog]);

  useEffect(() => {
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#organ';
    }
    if (!parsedQS.page) {
      searchParams = { ...searchParams, page: '1', perPage: '10' };
    }
    if (!parsedQS.perPage) {
      searchParams = { ...searchParams, perPage: '10' };
    }
    newLocation.search = QS.stringify(searchParams);
    navigate(newLocation, { replace: true });
    getAllOrganList(parsedQS);
  }, []);

  useEffect(() => {
    getAllOrganList(parsedQS);
  }, [location.search, location.hash]);

  const columns = [
    {
      headerName: 'S.No',
      cellRenderer: (params: { data: Organ }) => {
        const { serialNo } = params.data || {};
        return <Box>{serialNo ?? 0}</Box>;
      },
      maxWidth: 100,
      cellStyle: rowStyle
    },
    { headerName: 'Organ Name', field: 'name', wrapHeaderText: true, autoHeaderHeight: true, cellStyle: rowStyle },
    { headerName: 'Tissue', field: 'isTissue', cellStyle: rowStyle },
    {
      headerName: 'Payment Available',
      field: 'isPaymentRequired',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: rowStyle
    },
    {
      headerName: 'License Available',
      field: 'isLicenceAvailable',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: rowStyle
    },
    {
      headerName: 'Allocation Available',
      field: 'isAllocationAvailble',
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellStyle: rowStyle
    },
    { headerName: 'Cost', field: 'cost', cellStyle: rowStyle },
    {
      headerName: 'Status',
      cellRenderer: (params: { data: Organ }) => {
        const { isActive } = params.data || {};
        return (
          <Box>
            <Text
              className=" !text-[12px] !font-[600] rounded-lg"
              sx={{
                color: isActive ? '#027545' : '#DD2323',
                backgroundColor: isActive ? '#CFEEBC' : '#FFE1E1',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {isActive ? 'Active' : 'Inactive'}
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
      cellRenderer: (params: { data: Organ }) => {
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

            {isActive ? (
              <>
                {canDelete && (
                  <DeleteIcon
                    onClick={() => {
                      setSelectedRow(params.data);
                      setOpenActionDialog(true);
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
                      setOpenActionDialog(true);
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
    <Box p={5}>
      <Box className="flex flex-col ">
        <Box className="flex gap-4 justify-between">
          <Text className="!text-[19px] !font-bold text-[#804595]">Organs</Text>

          <Button
            variant="contained"
            className="!bg-[#D876A9] !w-[130px] flex items-center justify-center gap-x-3"
            onClick={() => SetOpenDialog(true)}
          >
            <AddMoreIcon2 /> Add New
          </Button>
        </Box>
        <Box className="flex justify-end mt-2">
          <Pagination
            currentPageSize={(parsedQS && Number(parsedQS.perPage)) || 10}
            pageSizeOptions={PaginationOptions}
            totalPages={totalPages}
            onPageSizeChanged={(perPage: string) => {
              navigate({ ...location, search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString() });
            }}
            onChange={(_, page) => {
              navigate({
                ...location,
                search: createSearchParams({ ...parsedQS, page: page.toString() }).toString()
              });
            }}
          />
        </Box>
      </Box>
      <Box mt={2}>
        <DataTable columnDefs={columns} rowData={organList} />
      </Box>
      <AddNewDialog
        open={openDialog}
        onClose={() => {
          setSelectedRow(null);
          SetOpenDialog(false);
        }}
        selectedOrganData={selectedRow}
        addOrgan={(data) => {
          postOrgans(data, () => {
            toast('Organ Added Successfully', 'success');
            getAllOrganList(parsedQS);
          });
        }}
      />
      <ActionDialog
        open={openActionDialog}
        onClose={() => {
          setOpenActionDialog(false);
        }}
        selectedOrganData={selectedRow}
        onRestore={(id) =>
          restoreOrgan(id, () => {
            getAllOrganList(parsedQS);
          })
        }
        onDelte={(id) =>
          deleteOrgans(id, () => {
            getAllOrganList(parsedQS);
          })
        }
      />
    </Box>
  );
};

export default Organ;
