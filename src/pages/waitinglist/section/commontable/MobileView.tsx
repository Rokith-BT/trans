import { Box, Text } from '@/atoms';
import { CommonWaitingList } from '@/types/waitinglist';
import React from 'react';
import styles from './CommonWaitList.module.scss';
import { abbreviateZone } from '@/utils/abbrevivations';
import { formatDateAndTime } from '@/utils/dateutils';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import { FemaleIcon, MaleIcon, TransgenderIcon } from '@/assets/icons';

interface CommonWaitlistMobileProps {
  list: CommonWaitingList;
  isFilterApplied?: boolean;
}
const zoneTextColor: { [key: string]: { textColor: string } } = {
  West: { textColor: '#80C967' },
  North: { textColor: '#67B1C9' },
  South: { textColor: '#C96767' }
};

const MobileView: React.FC<CommonWaitlistMobileProps> = ({ list }) => {
  const zoneColors = zoneTextColor[list.zone.name] ?? {
    textColor: '#333'
  };
  const { formattedDate, formattedTime } = formatDateAndTime(list.dateOfRegistration);
  console.log('data from common list ', list);
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
  return (
    <Box>
      <Box className={styles[`common-waitlist-card`]}>
        <Box className={styles['common-card-header']}>
          <Text className={styles['sno']}> S.No {list.serialNumber ?? 0}</Text>
          <Text className={styles['direction']} sx={{ color: zoneColors.textColor }} title={list.zone.name ?? 'NA'}>
            {abbreviateZone(list.zone.name)}
          </Text>
        </Box>
        <Box className="flex items-center justify-between mt-3">
          <Text className="!text-[10px] !font-[500] text-[#A1999F]">
            TRANSTAN ID : <strong className="text-[#804595]">{list.transtanId ?? 'NA'}</strong>
          </Text>
        </Box>
        <Box className="flex items-center justify-between my-2">
          <Text className="text-[#A1999F] !text-[10px] !font-[500] p-[2px] rounded-lg">
            Rank : <strong className="text-[#67B1C9]">{list.currentZoneRank ?? 0}</strong>
          </Text>
          <Text className="!text-[10px] text-[#A1999F] !font-[500]">
            Register D&T :
            <strong className="text-[#1A0616]">
              {formattedDate ?? 'NA'} &nbsp;
              {formattedTime ?? 'NA'}
            </strong>
          </Text>
        </Box>
        <Box className="flex items-center justify-between">
          <Text className="text-[#A1999F] !text-[10px] !font-[500] p-[2px] rounded-lg">
            Recipient City : <strong className="text-[#1A0616]">{list.city?.name ?? 'NA'}</strong>
          </Text>
          <Box className={styles['gender-age-blood']}>
            {/* <Text className={styles['label']}>
              <span className={`${styles['value']} text-[black]`}> {list.gender.name ?? 'NA'}</span>
            </Text> */}
            <Box>{renderGenderIcon(list.gender?.name?.toLowerCase() ?? '')}</Box>
            <Text className={styles['label']}>
              <span
                className={`${styles['value']} px-[2px] rounded-[4px] ${list.age <= 20 ? 'bg-[#67B1C9] text-[white]' : list.age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
              >
                {list.age ?? 'NA'}
              </span>
            </Text>
            <Text className={styles['label']}>
              <span className={`${styles['value']} text-[#C83926]`}> {list.bloodGroup.name ?? 'NA'}</span>
            </Text>
          </Box>
        </Box>
        <Box className="flex flex-col gap-y-1">
          <Text className="!text-[10px] !font-[500]">{list.hospital.name ?? 'NA'}</Text>
        </Box>
        <Box mt={1}>
          <OrganImageswithSlide Organs={list.organs} visibleCount={3} />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileView;
