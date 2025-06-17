import { CardRemoveIcon, FileUploadIcon, InforCircleIcon, VerifyApprovalIcon } from '@/assets/icons';
import { Box, DataTable, Text } from '@/atoms';
import { useRecipient } from '@/pages/recipients/RecipientContext';

import SnoCellRender from '@/pages/recipients/section/SnoCellRender';
import { Recipient } from '@/types/recipient';
import { getOrganImage } from '@/utils/organimages';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import HeartImg from '@/assets/imgs/heart.png';

interface RecipientDataProps {
  id: number;
  uID: string;
  zRank: string;
  regDate: string;
  patientName: string;
  patientStatus: string;
  gender: string;
  age: string;
  blood: string;
  hospitalName: string;
  organRequested: string;
  paymentStatus: string;
  cmInsurance: string;
  phoneNumber: string;
  inactive: string;
  fromHospital: string;
  toHospital: string;
}

const status = ['Expired ', 'Medicaly Unfit', 'Not Willing of transplant', 'Transplanted elsewhere'];
const paymentStatus = ['Unpaid', '123456', 'GH'];
const getStatus = () => {
  return status[Math.floor(Math.random() * status.length)];
};
const getPaymentStatus = () => {
  return paymentStatus[Math.floor(Math.random() * paymentStatus.length)];
};

export const RecipientData = () => {
  return [...Array(10)].map((_, index) => ({
    id: index + 1,
    uID: '1224',
    zRank: '01',
    regDate: '13.08.2024',
    patientName: 'xyz',
    patientStatus: 'pending approval',
    gender: 'Female',
    age: '24',
    blood: 'a',
    hospitalName: 'private isHospital',
    organRequested: 'kidney',
    paymentStatus: getPaymentStatus(),
    cmInsurance: 'not applied',
    phoneNumber: '12345678899',
    inactive: getStatus(),
    fromHospital: 'GH',
    toHospital: 'Private Hospital'
  }));
};

interface RecipientTableProps {
  isInactiveStatus?: boolean;
  isHospital?: boolean;
  isInsurance?: boolean;
  isCmInsurance?: boolean;
  isPaymentStatus?: boolean;
  isInactive?: boolean;
  isUnpaid?: boolean;
}

const zoneTextColor: { [key: string]: { textColor: string } } = {
  W: { textColor: '#80C967' },
  N: { textColor: '#67B1C9' },
  S: { textColor: '#C96767' }
};
const cmInsuranceColor: { [key: string]: { textColor: string } } = {
  Applied: { textColor: '#C88726' },
  NA: { textColor: '#1A0616' },
  Approved: { textColor: '#80C967' }
};

const recipientTextColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Draft: { bgColor: '#EDEDED', textColor: '#71717A' },
  'Draft Deleted': { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Pending Approval': { bgColor: '#F4EADA', textColor: '#C88726' },
  Inactive: { bgColor: '#A1999F26', textColor: '#71717A' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Organs: { bgColor: '#E0F0FF', textColor: '#67B1C9' },
  'Document Verified': { bgColor: '#E0F0FF', textColor: '#67B1C9' },
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  'Organs Allocated': { bgColor: '#E0F0FF', textColor: '#67B1C9' }
};

const paymentStatusColor: { [Key: string]: { textColor: string } } = {
  Unpaid: { textColor: '#C96767' },
  GH: { textColor: '#80C967' },
  '123456': { textColor: '#67B1C9' }
};

export const RecipientTable: React.FC<RecipientTableProps> = ({ isCmInsurance, isPaymentStatus }) => {
  const [data, setdata] = useState<Array<RecipientDataProps>>([]);
  const [openCmInsurance, setOpenCmInsurance] = useState(false);
  const navigate = useNavigate();
  console.log(openCmInsurance, data);

  const rowHeight = 74;
  useEffect(() => {
    setdata(RecipientData());
  }, []);

  const {
    actions: { getAll },
    state: { list }
  } = useRecipient();
  useEffect(() => {
    getAll({ _all: true });
  }, []);

  const baseColumnDef = [
    {
      headerName: 'S.No',
      maxWidth: 90,
      cellRenderer: ({ data }: { data: Recipient }) => {
        return <SnoCellRender data={data} />;
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'left' }
    },
    {
      headerName: 'Register Date & Time',
      field: 'date',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Unique ID',
      field: 'uniqueId',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Zonal Rank',
      wrapText: true,
      cellRenderer: ({ data }: { data: Recipient }) => {
        const zonalRank = data.zone && data.zone?.name.trim();

        const { textColor } = zoneTextColor[zonalRank] || { textColor: 'black' };

        return (
          <Box className=" text-center ">
            <Text
              className="flex flex-col !text-[16px] !font-[600]"
              sx={{
                color: textColor
              }}
            >
              {zonalRank}
            </Text>
            <Text className="!text-[16px] !font-[400]">121</Text>
          </Box>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Recipient Name',
      field: 'recipientName',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Gender / Age / Blood',
      cellRenderer: (parmas: { data: Recipient }) => {
        const { age, bloodGroup, gender } = parmas.data;
        return (
          <Box className="flex gap-[4px] h-[40px] items-center">
            <Text>{gender?.name}</Text>
            <Text>{age}</Text>
            <Text className="text-[#C83926] !text-[16px] !font-[700]">{bloodGroup?.name}</Text>
          </Box>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'left' }
    },
    {
      headerName: 'Status',
      cellRenderer: ({ data }: { data: Recipient }) => {
        const recipientStatus = data.status && data.status.trim();
        const { bgColor, textColor } = recipientTextColor[recipientStatus] || { bgColor: 'white', textColor: 'red' };

        return (
          <Box className="flex items-center gap-2">
            <Text
              className=" !text-[12px] !font-[600] rounded-lg"
              sx={{
                color: textColor,
                backgroundColor: bgColor,
                borderRadius: '8px',
                padding: '0px 8px',
                fontSize: '11px',
                fontWeight: '500'
              }}
            >
              {recipientStatus}
            </Text>
            {recipientStatus === 'Deleted' || recipientStatus === 'Inactive' ? <InforCircleIcon /> : ''}
          </Box>
        );
      },
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Hospital Name',
      field: 'hospitalName',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    {
      headerName: 'Organ Requested',
      field: 'organRequested',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      cellRenderer: ({ data }: { data: Recipient }) => {
        const { organs } = data;
        console.log(organs, 'organsorgansorgansorgans');

        return (
          <Box className="flex py-[20px] w-full px-[16px] gap-3 items-center justify-center">
            {organs.map((organ) => (
              <Box className="flex flex-col  items-center justify-center gap-1" key={organ.name} style={{ margin: 0 }}>
                <img
                  src={getOrganImage(organ.name) || HeartImg}
                  alt={organ.name}
                  className="w-6 h-6"
                  style={{ display: 'block' }}
                />
                <Text className="!text-[11px] !font-[400]">{organ.name}</Text>
              </Box>
            ))}
          </Box>
        );
      }
    },
    isCmInsurance
      ? {
          headerName: 'CM Insurance',
          cellRenderer: ({ data }: { data: Recipient }) => {
            const cmInsurance = data.cmInsurance && data.cmInsurance?.name;

            const { textColor } = cmInsuranceColor[cmInsurance] || { textColor: 'black' };

            return (
              <Box className=" text-center ">
                <Text
                  className="flex items-center gap-2 !text-[16px] !font-[400]"
                  sx={{
                    color: textColor
                  }}
                >
                  {cmInsurance}
                  {cmInsurance === 'Applied' ? (
                    <FileUploadIcon
                      isPink={true}
                      className="h-[16px] w-[16px]"
                      onClick={() => {
                        setOpenCmInsurance(true);
                      }}
                    />
                  ) : (
                    ''
                  )}
                </Text>
              </Box>
            );
          },
          cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }
      : null,
    {
      headerName: 'Phone Number',
      field: 'phoneNumber',
      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    },
    isPaymentStatus
      ? {
          headerName: 'Payment Status',
          cellRenderer: ({ data }: { data: Recipient }) => {
            const paymentStatus = data.isPaymentCompleted ? 'Paid' : 'Unpaid';

            const { textColor } = paymentStatusColor[paymentStatus] || { textColor: '#C96767' };
            return (
              <Box className="">
                <Text
                  className="flex items-center gap-2 !text-[16px] !font-[400]"
                  sx={{
                    color: textColor
                  }}
                >
                  <CardRemoveIcon /> {paymentStatus}
                </Text>
              </Box>
            );
          },
          cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
        }
      : null,
    {
      headerName: 'Actions',
      width: 150,
      minWidth: 150,
      cellRenderer: () => (
        <VerifyApprovalIcon
          className="cursor-pointer"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(params: any) => {
            navigate(`/recipients/${params?.data?.recipientId}/view`, { state: { isApproval: true } });
          }}
        />
      ),

      cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' }
    }
  ].filter((colDef) => colDef !== null);

  return (
    <Box>
      <DataTable
        onCellClick={() => {}}
        gridOptions={{
          suppressCellFocus: true
        }}
        rowData={list.filter((ee: { recipientStatus: string }) => ee.recipientStatus === 'PendingApproval')}
        columnDefs={baseColumnDef}
        rowHeight={rowHeight}
      />
    </Box>
  );
};
