/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteIcon, EditIcon } from '@/assets/icons';
import { Box, DataTable } from '@/atoms';
import React, { useState } from 'react';
import RotaDeleteDialog from './session/RotaDeleteDialog';

const LiverRotaTable = ({ list, isGovRota }: any) => {
  const [openDialog, setOpenDialog] = useState(false);
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    fontSize: '16px'
  };

  return (
    <Box className="">
      <DataTable
        columnDefs={[
          {
            headerName: 'S.No',
            field: 'serialNumber',
            cellStyle: rowStyle
          },
          {
            headerName: 'Hospital Name',
            field: 'hospitalName',
            cellStyle: rowStyle
          },
          {
            headerName: 'Initial Rank',
            field: 'initialRank',
            cellStyle: rowStyle
          },
          {
            headerName: 'Current Rank',
            field: 'currentRank',
            cellStyle: rowStyle
          },
          isGovRota
            ? {
                headerName: 'Zone',
                field: 'zone',
                cellStyle: rowStyle
              }
            : null,
          {
            headerName: 'Actions',
            cellRenderer: () => (
              <Box className="flex gap-2">
                <EditIcon />
                <DeleteIcon onClick={() => setOpenDialog(true)} />
              </Box>
            ),
            cellStyle: rowStyle
          }
        ].filter(Boolean)}
        rowData={list}
        rowHeight={74}
        headerHeight={80}
      />
      <RotaDeleteDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
};

export default LiverRotaTable;
