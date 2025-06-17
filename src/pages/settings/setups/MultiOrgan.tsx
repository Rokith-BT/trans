import { AddMoreIcon2, DeleteIcon, EditIcon, UndoIcon } from '@/assets/icons';
import { Box, Button, DataTable, Pagination, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useMasterData } from './masterCotext';
import { MultiOrgansList } from '@/types/setup';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import PaginationOptions from '@/data/pageSizeOptions.json';
import QS from 'query-string';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import AddNewDialog from './Dialog/AddNewDialog';
import { toast } from '@/utils/toast';
import ActionDialog from './Dialog/ActionDialog';
import { useRole } from '@/hooks/useRole';
import { usePermissions } from '@/hooks/usePremission';
import LoadingSmall from '@/pages/components/LoadingSmall';

export interface OrganProps {}

const MultiOrgan: React.FC<OrganProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MultiOrgansList | null>(null);
  const { roleID } = useRole();
  const { canDelete, canUpdate } = usePermissions(11, roleID);
  const {
    state: { multiOrganCombinations, count, loading },
    action: { getMultiOrgansList, postMultiOrgan, restoreMultiOrgan, deleteMultiOrgan }
  } = useMasterData();

  const parsedQS = QS.parse(location.search);

  useEffect(() => {
    getMultiOrgansList(parsedQS);
    const newLocation = {
      ...location
    };
    let searchParams = {
      ...parsedQS
    };
    if (location.hash.trim().length === 0) {
      newLocation.hash = '#multiorgans';
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
    getMultiOrgansList(parsedQS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash, location.search]);

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    fontWeight: '400',
    fontSize: '16px'
  };

  const columnDefs = [
    { headerName: 'S.No', field: 'serialNo', maxWidth: 100, cellStyle: rowStyle },
    {
      headerName: 'Organs Name',
      cellRenderer: (params: { data: MultiOrgansList }) => {
        const { name } = params.data || {};
        const organNames = name?.split(',') || [];
        const organForImage = organNames.map((o, index) => ({
          id: index + 1,
          name: o
        }));
        return (
          <Box className="">
            <OrganImageswithSlide Organs={organForImage} visibleCount={8} />
          </Box>
        );
      },
      cellStyle: rowStyle
    },
    {
      headerName: 'Status',
      cellRenderer: (params: { data: MultiOrgansList }) => {
        const { status } = params.data || {};
        const formattedStatus = status === 1 ? 'Active' : 'Inactive';
        return (
          <Box>
            <Text
              className="px-[8px] py-[2px] !font-[500] !text-[11px] rounded-[12px]"
              sx={
                status === 1
                  ? { backgroundColor: '#CFEEBC', color: '#027545' }
                  : { backgroundColor: '#FFE1E1', color: '#DD2323' }
              }
            >
              {formattedStatus}
            </Text>
          </Box>
        );
      },
      maxWidth: 300,
      cellStyle: rowStyle
    },
    {
      headerName: 'Action',
      cellRenderer: (params: { data: MultiOrgansList }) => {
        const { status } = params.data || {};
        return (
          <Box className="flex gap-2 items-center">
            {canUpdate && (
              <EditIcon
                onClick={() => {
                  setOpenAddDialog(true);
                  setSelectedRow(params.data);
                }}
              />
            )}

            {status === 1 ? (
              <>
                {canDelete && (
                  <DeleteIcon
                    onClick={() => {
                      setOpenActionDialog(true);
                      setSelectedRow(params.data);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {canUpdate && (
                  <UndoIcon
                    onClick={() => {
                      setOpenActionDialog(true);
                      setSelectedRow(params.data);
                    }}
                  />
                )}
              </>
            )}
          </Box>
        );
      },
      maxWidth: 120,
      cellStyle: rowStyle
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
      <Box className="flex flex-col">
        <Box className="flex justify-between items-center">
          <Text className="!text-[19px] !font-bold text-[#804595]">Multi Organ</Text>

          <Box className="flex gap-4">
            {/* <Button variant="outlined" className="w-[130px]">
            <span className="flex items-center justify-center gap-x-10">
              Export <ArrowDown />
            </span>
          </Button> */}

            <Button variant="contained" className="!bg-[#D876A9] w-[130px]" onClick={() => setOpenAddDialog(true)}>
              <span className="flex items-center justify-center gap-x-3">
                <AddMoreIcon2 /> Add New
              </span>
            </Button>
          </Box>
        </Box>
        <Box className="flex items-center justify-end mt-2">
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
      <Box mt={3}>
        <DataTable rowHeight={64} columnDefs={columnDefs} rowData={multiOrganCombinations} />
      </Box>
      <AddNewDialog
        open={openAddDialog}
        isMultiOrgan={true}
        onClose={() => {
          {
            setSelectedRow(null);
            setOpenAddDialog(false);
          }
        }}
        addNewMultiOrgan={(organId) => {
          postMultiOrgan({ organId, name: 'string', status: 1 }, () => {
            toast('MultiOrgans Combination Added Successfully', 'success');
            getMultiOrgansList(parsedQS);
          });
        }}
        selectedRow={selectedRow}
      />
      <ActionDialog
        open={openActionDialog}
        onClose={() => {
          setSelectedRow(null);
          setOpenActionDialog(false);
        }}
        selectedRow={selectedRow}
        onDelte={(id) => {
          deleteMultiOrgan(id, () => {
            toast('MultiOrgans deleted Successfully', 'success');
            getMultiOrgansList(parsedQS);
          });
        }}
        onRestore={(id) => {
          restoreMultiOrgan(id, () => {
            toast('MultiOrgans Restored Successfully', 'success');
            getMultiOrgansList(parsedQS);
          });
        }}
      />
    </Box>
  );
};

export default MultiOrgan;
