import { ViewIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';

interface Waiting {
  id: string;
  uid: string;
  gender: string;
  age: string;
  blood: string;
  height: string;
  weight: string;
  bmi: string;
  regDate: string;
  zonal: string;
  hName: string;
  organsReq: string;
  status: string;
  reason: string;
}

export const returnFakeData = () => {
  return [...Array(15)].map((_, index) => ({
    id: (index + 1).toString(),
    uid: (index + 923).toString(),
    gender: 'Male',
    age: '25',
    blood: 'B',
    height: '155 cm',
    weight: '50 kg',
    bmi: '20',
    regDate: '30-07-2024',
    zonal: '02',
    hName: 'Private',
    organsReq: 'Lungs(R)',
    status: RandomStatus(),
    reason: '-',
    allocation:'allocation',
    covid:'view'
  }));
};
const status = ['Accepted', 'Declined', 'Pending'];

const RandomStatus = () => {
  const random = Math.floor(Math.random() * status.length);
  return status[random];
};

interface WaitingListProps {
  steps: string | number;
}

const WaitingList: React.FC<WaitingListProps> = ({ steps }) => {
  const [data, setData] = useState<Array<Waiting>>([]);
  useEffect(() => {
    setData(returnFakeData);
  }, []);

  const StatusMap: { [key: string]: { bgColor: string; textColor: string } } = {
    Accepted: { bgColor: '#CFEEBC', textColor: '#027545' },
    Declined: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    Pending: { bgColor: '#EEDABC', textColor: '#C88726' }
  };

  const baseColumns = [
    { field: 'id', headerName: 'S.No', sortable: false },
    { field: 'uid', headerName: 'UID' },
    {
      headerName: 'Patient Details',
      cellRenderer: (params: { data: Waiting }) => {
        const { gender, age, blood } = params.data;
        return (
          <Box className="flex items-center h-[40px] justify-center gap-4">
            <Text className="!text-[16px] !font-[500]">{gender}</Text>
            <Text className="bg-[#C96767] text-[white] !text-[13px] rounded-[4px] px-[3px] !font-[600]">{age}</Text>
            <Text className="text-[#C83926] !font-[700] !text-[16px]">{blood}</Text>
          </Box>
        );
      }
    },
    { field: 'regDate', headerName: 'Reg. Date' },
    { field: 'zonal', headerName: 'Zonal Rank' },
    { field: 'hName', headerName: 'Hospital Name' },
    { field: 'organsReq', headerName: 'Organs Requested' },
    {
      headerName: 'Status',
      cellRenderer: (params: { data: Waiting }) => {
        const { status } = params.data;
        const { bgColor, textColor } = StatusMap[status];
        return (
          <Box className="flex items-center h-[40px]">
            <Text
              style={{
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '11px',
                fontWeight: '500',
                borderRadius: '12px',
                padding: '0px 8px'
              }}
            >
              {status}
            </Text>
          </Box>
        );
      }
    },
    { field: 'reason', headerName: 'Rejection Reason' },
    {
      headerName: 'Action',
      cellRenderer: () => {
        return (
          <Box>
            <ViewIcon className="cursor-pointer" />
          </Box>
        );
      }
    }
  ];

  const getColumns = (steps: string | number) => {
    let columns = [...baseColumns];
    switch (steps) {
      case 2:
        columns = [...baseColumns.slice(0, 2), { field: 'height', headerName: 'Height' }, ...baseColumns.slice(2)];
        break;
      case 3:
        columns = columns
          .filter((column) => column.field !== 'reason' && column.headerName !== 'Action')
          .concat([
            { field: 'covid', headerName: 'Covid Report' },
            { field: 'allocation', headerName: 'Allocation Status' }
          ]);
        break;
      default:
        break;
    }
    return columns;
  };

  return (
    <Box>
      <DataTable onCellClick={() => {}} rowData={data} columnDefs={getColumns(steps)} />
    </Box>
  );
};

export default WaitingList;
