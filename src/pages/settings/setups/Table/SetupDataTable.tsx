/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, DataTable } from '@/atoms';

const SetupDataTable = ({ rowColoum, rowData }: any) => {
  return (
    <Box>
      <DataTable columnDefs={rowColoum} rowData={rowData} />
    </Box>
  );
};

export default SetupDataTable;
