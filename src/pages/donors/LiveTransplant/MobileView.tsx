import { EditIcon, FemaleIcon, MaleIcon, TransgenderIcon, ViewIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { getAgeFromDOB } from '@/utils';
import { formatDateAndTime } from '@/utils/dateutils';
// import { abbreviateZone } from '@/utils/abbrevivations';
import React from 'react';

interface LiveTransplantProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list?: any;
}

// const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
//   Active: { bgColor: '#CFEEBC', textColor: '#027545' },
//   Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
//   Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
//   'Details Pending': { bgColor: '#EEDABC', textColor: '#C88726' },
//   'Pending Approval': { bgColor: '#EEDABC', textColor: '#C88726' },
//   Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
// };
// const zoneTextColor: { [key: string]: { textColor: string } } = {
//   West: { textColor: '#80C967' },
//   North: { textColor: '#67B1C9' },
//   South: { textColor: '#C96767' }
// };

const MobileView: React.FC<LiveTransplantProps> = ({ list = [] }) => {
  //   const statusTextColor = statusColor[list?.status] ?? { bgColor: '#fff', textColor: '#bbb' };
  const renderGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return <MaleIcon />;
      case 'female':
        return <FemaleIcon />;
      // case 'transgender':
      //   return <TransgenderIcon />;
      default:
        return <TransgenderIcon />;
    }
  };
  const { formattedDate: transplantationDate } = formatDateAndTime(list?.dateOfSurgery);
  const recipientDob = getAgeFromDOB(list?.recipientDateOfBirth) ?? '';
  const donorDob = getAgeFromDOB(list?.donorDateOfBirth) ?? '';

  return (
    <Box className="border-[1px] border-[#C967A2] p-3 rounded-lg">
      <Text className="!text-[10px] !font-[500] text-[#A1999F] !mb-[6px]">S.No. {list?.serialNumber ?? 0}</Text>
      {/* <Text
          className={`!text-[8px] !font-[500] bg-[${statusTextColor.bgColor} text-[${statusTextColor.textColor}] px-[2px] py-[1px]`}
        >
          {list?.status ?? ''}
        </Text> */}
      {/* <Text className={`!text-[10px] f!ont-[500] text-[${formattedZoneColor}]`}>
          S.No. {abbreviateZone(list?.zone?.name) ?? 'NA'}
        </Text> */}
      <Box className="flex items-center justify-between mb-[6px]">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          Donor Relationship <span className="text-[#000000]">{list?.relationship?.name ?? ''}</span>
        </Text>
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          Transplanted Organ <span className="text-[#000000]">{list?.organ?.name ?? ''}</span>
        </Text>
      </Box>
      <Text className="!text-[10px] !font-[500] text-[#A1999F] !mb-[12px]">
        Transplantation Date <span className="text-[#000000]">{transplantationDate ?? ''}</span>
      </Text>
      <Box className="flex items-center justify-between">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          Recipient Name <span className="text-[#C967A2]">{list?.recipientName ?? ''}</span>
        </Text>
        <Box className="flex items-center j">
          <Text className="!text-[12px] !font-[600] text-[#C83926]">{list?.recipientBloodGroup?.name ?? ''}</Text>
          <Text className="!text-[10px] !font-[500] text-[#A1999F]">
            {renderGenderIcon(list?.recipientGender?.name) ?? 'NA'}
          </Text>
          <Text
            className={`!text-[10px] !font-[600] px-[2px] py-[2px] rounded-[4px] ${recipientDob <= 20 ? 'bg-[#67B1C9] text-[white]' : recipientDob >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
          >
            {recipientDob ?? ''}
          </Text>
        </Box>
      </Box>
      <Box className="mb-[6px]">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          Recipient Hospital <span className="text-[#C967A2]">{list?.hospital?.name ?? ''}</span>
        </Text>
        <Text className="!text-[10px] !font-[500] text-[#A1999F] !mb-1">
          Recipient Address{' '}
          <span className="text-[#000]">
            {list?.recipientAddressLine1 ?? ''},{list?.recipientAddressLine2 ?? ''},{list?.recipientTownVillage ?? ''},
            {list?.recipientLandmark ?? ''}, {list?.recipientCity?.name ?? ''},{list?.recipientState?.name ?? ''},
            {list?.recipientCountry?.name ?? ''}
          </span>
        </Text>
      </Box>
      <hr className="border-dotted" />
      <Box className="mt-[6px]">
        <Box className="flex items-center justify-between">
          <Text className="!text-[10px] !font-[500] text-[#A1999F]">
            Donor Name <span className="text-[#C967A2]">{list?.donorName ?? ''}</span>
          </Text>
          <Box className="flex items-center j">
            <Text className="!text-[12px] !font-[600] text-[#C83926]">{list?.donorBloodGroup?.name ?? ''}</Text>
            <Text className="!text-[10px] !font-[500] text-[#A1999F]">
              {renderGenderIcon(list?.donorGender?.name) ?? 'NA'}
            </Text>
            <Text
              className={`!text-[10px] !font-[600] px-[2px] py-[2px] rounded-[4px] ${donorDob <= 20 ? 'bg-[#67B1C9] text-[white]' : donorDob >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
            >
              {donorDob ?? ''}
            </Text>
          </Box>
        </Box>
        <Box className="mb-[6px]">
          <Text className="!text-[10px] !font-[500] text-[#A1999F]">
            Donor Hospital <span className="text-[#C967A2]">{list?.hospital?.name ?? ''}</span>
          </Text>
          <Text className="!text-[10px] !font-[500] text-[#A1999F] !mb-1">
            Recipient Address{' '}
            <span className="text-[#000]">
              {list?.donorAddressLine1 ?? ''},{list?.donorAddressLine2 ?? ''},{list?.donorTownVillage ?? ''},
              {list?.donorLandmark ?? ''}, {list?.donorCity?.name ?? ''},{list?.donorState?.name ?? ''},
              {list?.donorCountry?.name ?? ''}
            </span>
          </Text>
        </Box>
        <Box className="flex items-center gap-2">
          <ViewIcon
            onClick={() => {
              alert('Under Construction');
            }}
          />
          <EditIcon
            onClick={() => {
              alert('Under Construction');
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileView;
