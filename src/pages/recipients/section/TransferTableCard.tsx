/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Box, Text } from '@/atoms';
import React from 'react';
import './MobileView.scss';
import { formatDateAndTime } from '@/utils/dateutils';
import { CountdownTimer } from '@/pages/components/CustomTimer';
import { EditIcon, FemaleIcon, MaleIcon, TransgenderIcon, VerifyApprovalIcon } from '@/assets/icons';
import { truncateTextByLines } from '@/utils/truncateText';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import { useNavigate } from 'react-router';
import Countdown from 'react-countdown';

interface TransferTableCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  isApprove?: boolean;
}

const TransferTableCard: React.FC<TransferTableCardProps> = ({ data, isApprove }) => {
  const navigate = useNavigate();

  const transferStatusColor: { [key: string]: { bgColor: string; textColor: string } } = {
    TransferInitiated: { bgColor: '#EDEDED', textColor: '#71717A' },
    TransferCompleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
    TransferRejected: { bgColor: '#F4EADA', textColor: '#C88726' }
  };

  console.log(data, 'datadatadatadatadatadata112e32241');
  const { activationDate, transferStatus } = data || {};
  const formattedStatus =
    transferStatus === 'TransferInitiated'
      ? 'Transfer Initiated'
      : transferStatus === 'TransferRejected'
        ? 'Transfer Rejected'
        : transferStatus === 'TransferCompleted'
          ? 'Transfer Completed'
          : transferStatus;
  const { bgColor, textColor } = transferStatusColor[transferStatus] || { bgColor: 'white', textColor: 'red' };
  // const { formattedDate, formattedTime } = formatDateAndTime(activationDate);
  const targetDate = new Date(activationDate);
  const isValidDate = !isNaN(targetDate.getTime());
  const { currentHospital } = data;
  const { transferringHospital } = data;
  const truncateHospital = truncateTextByLines(currentHospital?.name ?? 'NA', 2, 12);
  const { age, bloodGroup, gender } = data || {};
  const transferHospital = truncateTextByLines(transferringHospital?.name ?? 'NA', 2, 12);

  const { transferRegDate } = data || null;
  const { formattedDate, formattedTime } = formatDateAndTime(transferRegDate);

  const organs = data?.organMappings ? data.organMappings.map((organ) => organ.organId) : [];
  const organNames = organs.join(', ');

  return (
    <Box className="card">
      {/* A1999F */}
      <Box className="flex justify-between items-center mb-4">
        <Box>
          <Text className="text-[#777] !text-[13px] !font-medium">S.No. {data.serialNumber}</Text>
        </Box>
        <Box className="flex gap-1 justify-center align-middle items-center">
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
            {formattedStatus}
          </Text>
          <Box className="text-left absolute mt-8">
            {isValidDate && targetDate > new Date() && <CountdownTimer targetDate={targetDate} />}
          </Box>
        </Box>
      </Box>
      <hr />
      <Box className="mt-3">
        <Text className="!text-[12px] text-[#777]">
          Transtan ID <span className="text-[#804595] text-[12px] font-medium">{data?.transtanId}</span>
        </Text>
      </Box>
      <Box className="mt-2">
        <Text className="!text-[12px] text-[#777]">
          Transtan Name <span className="text-[#C967A2] text-[12px] font-medium">{data?.recipientName}</span>
        </Text>
      </Box>
      <Box className="mt-2 ">
        <Text className="!text-[12px] text-[#777]">
          Reg. D&T{' '}
          <span className="text-[#000] text-[12px] font-medium">
            {formattedDate} {formattedTime}
          </span>
        </Text>
      </Box>
      <Box className="mt-3 flex justify-between">
        <Text className="!text-[12px] text-[#777]">
          Phone <span className="text-[#000] text-[12px] font-medium">{data?.phoneNumber1}</span>
        </Text>
        <Text className="!text-[12px] text-[#777]">
          <Box className="flex gap-[2px] items-center w-full">
            <Text className="text-[#C83926] !text-[13px] !font-[700]">{bloodGroup?.name}</Text>
            <Box>
              {gender?.name === 'Female' ? <FemaleIcon /> : ''}
              {gender?.name === 'Male' ? <MaleIcon /> : ''}
              {gender?.name === 'TransGender' ? <TransgenderIcon /> : ''}
            </Box>
            <Text
              className={` px-[2px] py-[0px] rounded-[4px] text-center !text-[13px] !font-[600] ${age <= 20 ? 'bg-[#67B1C9] text-[white]' : age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
            >
              {age}
            </Text>
          </Box>
        </Text>
      </Box>
      <Box className="mt-2 flex gap-2 items-center">
        <Text className="!text-[12px] text-[#000] !font-semibold">
          <Text className="text-[#777] !text-[12px] font-medium break-words overflow-hidden whitespace-pre-wrap max-w-[250px] sm:max-w-full inline-block">
            Hospital <span className="text-[#000] text-[12px] font-medium">{data?.currentHospital?.name}</span>
          </Text>
        </Text>
      </Box>
      <Box className="mt-2 flex gap-2 items-center">
        <Text className="!text-[12px] text-[#000] !font-semibold">
          <Text className="text-[#777] !text-[12px] font-medium break-words overflow-hidden whitespace-pre-wrap max-w-[250px] sm:max-w-full inline-block">
            Transfer Hospital{' '}
            <span className="text-[#000] text-[12px] font-medium">{data?.transferringHospital?.name}</span>
          </Text>
        </Text>
      </Box>
      <Box className="mt-3 flex justify-between items-center">
        <Box title={organNames} className="flex items-left justify-left flex-col">
          <OrganImageswithSlide Organs={organs} visibleCount={6} />
        </Box>
        <Box className="flex gap-2">
          {transferStatus === 'TransferRejected' ? (
            <EditIcon
              className="cursor-pointer"
              onClick={() => {
                navigate(`/recipients/view-recipient-transfer`, { state: { data, isEdit: true } });
              }}
            />
          ) : (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                if (isApprove) {
                  navigate(`/recipients/approval-transfer`, { state: { data, isApprove } });
                } else {
                  navigate(`/recipients/view-recipient-transfer`, { state: { data, isApprove } });
                }
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TransferTableCard;
