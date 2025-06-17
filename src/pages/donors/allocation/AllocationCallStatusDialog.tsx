import { Box, DataTable, Pagination, Text } from '@/atoms';
import CustomSearch from '@/pages/components/CustomSearch';
import React from 'react';
import QS from 'query-string';
import PageSizeOptions from '@/data/pageSizeOptions.json';
import { createSearchParams, useNavigate } from 'react-router-dom';

const TableData = [
  {
    serialNumber: '1',
    contactname: 'Maha',
    phone: '7947879578',
    hospitalname: 'CMC Hospital',
    callstatus: 'Pending'
  },
  {
    serialNumber: '2',
    contactname: 'Maha',
    phone: '7947879578',
    hospitalname: 'CMC Hospital',
    callstatus: 'Pending'
  },
  {
    serialNumber: '3',
    contactname: 'Maha',
    phone: '7947879578',
    hospitalname: 'CMC Hospital',
    callstatus: 'Pending'
  },
  {
    serialNumber: '4',
    contactname: 'Maha',
    phone: '7947879578',
    hospitalname: 'CMC Hospital',
    callstatus: 'Pending'
  },
  {
    serialNumber: '5',
    contactname: 'Maha',
    phone: '7947879578',
    hospitalname: 'CMC Hospital',
    callstatus: 'Pending'
  }
];

const AllocationCallStatusDialog = () => {
  const rowHeight = 74;
  const rowStyle = {
    display: 'flex',
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '400',
    fontSize: '16px'
  };
  const navigate = useNavigate();
  const parsedQS = QS.parse(location.search);
  const currentPageSize = parsedQS.perPage ? Number(parsedQS.perPage) : 10;
  const totalPages = Math.ceil(currentPageSize);
  return (
    <Box>
      <Box>
        <Text className="!text-[#804595] !text-[19px] !font-[600]">Allocation Call Status</Text>
        <Text className="!text-[#C967A2] !text-[16px] !font-[500]">Hospital Contact List</Text>
        <Box className="flex">
          <CustomSearch name="Search" />
          <Pagination
            totalPages={totalPages}
            onPageSizeChanged={(perPage: string) => {
              navigate({
                ...location,
                search: createSearchParams({ ...parsedQS, perPage, page: '1' }).toString()
              });
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
      <Box>
        <DataTable
          columnDefs={[
            { headerName: 'S.No', field: 'serialNumber', cellStyle: rowStyle },
            { headerName: 'Contact Name', field: 'contactname', cellStyle: rowStyle },
            { headerName: 'Phone', field: 'phone', cellStyle: rowStyle },
            { headerName: 'Hospital Name', field: 'hospitalname', cellStyle: rowStyle },
            { headerName: 'Call Status', field: 'callstatus', cellStyle: rowStyle }
          ]}
          rowData={TableData}
          rowHeight={rowHeight}
        />
      </Box>
    </Box>
  );
};

export default AllocationCallStatusDialog;
