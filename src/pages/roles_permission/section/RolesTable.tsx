import { DeleteIcon, EditIcon, SliderIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import React, { useState } from 'react';
import AddRoleDialog from './AddRoleDialog';
import PermissionDialog from './PermissionDialog';
import { Roles } from '@/types/common.type';

interface RolesTablesProps {
  list: Roles[];
}

const RolesTable: React.FC<RolesTablesProps> = ({ list = [] }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Roles>({
    id: 0,
    isActive: 0,
    name: '',
    roleType: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const statusColorMapping: { [key: string]: { bgColor: string; textColor: string } } = {
    Active: { bgColor: '#CFEEBC', textColor: '#027545' },
    Inactive: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Deleted: { bgColor: 'purple', textColor: 'white' }
  };
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '500'
  };

  return (
    <Box>
      <DataTable
        rowData={list}
        columnDefs={[
          { headerName: 'S.No', field: 'id', cellStyle: rowStyle, maxWidth: 100 },
          { headerName: 'Role', field: 'name', cellStyle: rowStyle },
          { headerName: 'Role Type', field: 'roleType', cellStyle: rowStyle },
          {
            headerName: 'Status',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (parms: { data: Roles }) => {
              const { isActive } = parms.data || {};
              const statusMapping = isActive === 1 ? 'Active' : 'Inactive';
              const { bgColor, textColor } = statusColorMapping[statusMapping] || {
                bgColor: 'white',
                textColor: 'black'
              };
              return (
                <Box className="flex h-[40px] gap-2 items-center justify-center">
                  <Text
                    className="rounded-[12px] px-[8px] py-[2px] !text-[11px] !font-[500]"
                    style={{
                      backgroundColor: bgColor,
                      color: textColor
                    }}
                  >
                    {statusMapping}
                  </Text>
                </Box>
              );
            },
            cellStyle: rowStyle
          },
          {
            headerName: 'Action',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cellRenderer: (params: { data: Roles }) => {
              return (
                <Box className="flex h-[40px] gap-2 items-center justify-center">
                  <SliderIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenPermissionDialog(true);
                      setSelectedRow(params.data);
                    }}
                  />
                  <EditIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setIsEdit(true);
                      setOpenEditDialog(true);
                      setSelectedRow(params.data);
                    }}
                  />
                  <DeleteIcon
                    className="cursor-pointer"
                    onClick={() => {
                      setIsEdit(false);
                      setOpenEditDialog(true);
                      setSelectedRow(params.data);
                    }}
                  />
                </Box>
              );
            },
            cellStyle: rowStyle
          }
        ]}
      />
      <AddRoleDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
        }}
        // isEditDialog={isEdit}
        isDeleteDialog={!isEdit}
        roleData={selectedRow}
      />
      <PermissionDialog
        open={openPermissionDialog}
        onClose={() => setOpenPermissionDialog(false)}
        roleData={selectedRow}
      />
    </Box>
  );
};

export default RolesTable;
