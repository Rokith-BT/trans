import { CloseCircleIcon, EditIcon } from '@/assets/icons';
import { Box, CustomDialog, DataTable, Text } from '@/atoms';
import { Hospital } from '@/types/hospital';
import React, { useEffect, useState } from 'react';

interface OrganListDialogProps {
  open: boolean;
  onClose: () => void;
  data2?: Hospital;
}
interface Organ {
  id: string;
  organ: string;
  cno: string;
  status: string;
}
export const returnFakeData = () => {
  return [...Array(4)].map((_, index) => ({
    id: (index + 1).toString(),
    organ: 'kidney',
    cno: '8785',
    status: 'Active'
  }));
};

export const OrganListDialog: React.FC<OrganListDialogProps> = ({ open, onClose, data2 }) => {
  const [data, setData] = useState<Array<Organ>>([]);
  useEffect(() => {
    setData(returnFakeData());
  }, []);
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md">
      <Box className="relative">
        <Text className="text-[#804595] !text-[19px] !font-[600]">Organ License List</Text>
        {data2 && <Text className="text-[#C967A2] !text-[16px] !font-[500]">{data2.name}</Text>}
        <Box className="absolute -top-3 -right-3">
          <CloseCircleIcon onClick={onClose} className="cursor-pointer" stroke="#A1999F" />
        </Box>
        <Box>
          <DataTable
            onCellClick={() => {}}
            rowData={data}
            columnDefs={[
              { field: 'id', headerName: 'S.No' },
              { field: 'organ', headerName: 'Organ' },
              { field: 'cno', headerName: 'Certificate Number' },
              { field: 'status', headerName: 'Status' },
              {
                headerName: 'Action',
                cellRenderer: () => {
                  return (
                    <Box className="h-[40px] flex items-center">
                      <EditIcon />
                    </Box>
                  );
                }
              }
            ]}
          />
        </Box>
      </Box>
    </CustomDialog>
  );
};
