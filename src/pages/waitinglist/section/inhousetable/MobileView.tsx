import { Box, Text } from '@/atoms';
import { InhouseWaitingList } from '@/types/waitinglist';
import React from 'react';
import { abbreviateZone } from '@/utils/abbrevivations';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import { formatDateAndTime } from '@/utils/dateutils';
import styles from './InhouseWaitlist.module.scss';
import { EditIcon, FemaleIcon, MaleIcon, TransgenderIcon } from '@/assets/icons';
interface InhouseTableProps {
  list: InhouseWaitingList;
  isInhouseFinal?: boolean;
  setOpendialog: (_data: boolean) => void;
  setSelectedRow: (_data: InhouseWaitingList) => void;
}
const zoneTextColor: { [key: string]: { textColor: string } } = {
  West: { textColor: '#80C967' },
  North: { textColor: '#67B1C9' },
  South: { textColor: '#C96767' }
};

const MobileView: React.FC<InhouseTableProps> = ({ list, isInhouseFinal, setOpendialog, setSelectedRow }) => {
  const { formattedDate, formattedTime } = formatDateAndTime(list.dateOfRegistration);

  const zoneColors = zoneTextColor[list.zone?.name] ?? {
    textColor: '#333'
  };
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
      <Box className={styles[`inhouse-waitlist-card`]}>
        <Box className={styles['inhouse-card-header']}>
          <Text className={styles['sno']}> S.No {list.serialNumber ?? 0}</Text>
          {/* <Text className={styles['direction']} sx={{ color: zoneColors.textColor }} title={list.zone.name ?? 'NA'}>
            {abbreviateZone(list.zone.name)}
          </Text> */}
          <Text className={`text-[${zoneColors.textColor}] !text-[12px] !font-[600]`}>
            {abbreviateZone(list.zone?.name)}
          </Text>
        </Box>
        <Box className="flex flex-col items-start justify-between gap-y-2">
          <Text className="text-[#A1999F] !text-[10px] !font-[500] rounded-lg">
            Unique Id : <strong className="text-[#804595]">{list.recipientId ?? 0}</strong>
          </Text>
          <Text className="!text-[10px] text-[#A1999F] !font-[500]">
            Recipient Name : <strong className="text-[#C967A2]">{list.name ?? 'NA'}</strong>
          </Text>
        </Box>
        <Box className={styles['rank-container']}>
          <Text className={styles['label']}>
            {isInhouseFinal ? 'Final' : 'Current'} Rank <br />{' '}
            <span className={`${styles['value']} text-[#804595]`}>
              {isInhouseFinal ? (list.finalRank ?? 0) : (list?.currentRank ?? 0)}
            </span>
          </Text>
          {!isInhouseFinal ? (
            <Text className={styles['label']}>
              Proposed Rank <br /> <span className={`${styles['value']} text-[#C88726]`}>{list.proposedRank ?? 0}</span>
            </Text>
          ) : (
            <Text className="!text-[10px] !font-[500] text-[#A1999F]">
              Reason <span className="text-[#804595]">{list?.reason ?? 'NA'}</span>
            </Text>
          )}
        </Box>
        <Box className="flex items-center justify-between mt-2">
          <Text className="!text-[10px] !font-[500] text-[#A1999F]">
            Zonal Rank &nbsp;
            <strong className={`text-[#1A0616]`}>{list.currentZoneRank ?? 0}</strong>
          </Text>
          <Text className={`!text-[10px] !font-[500] text-[#A1999F] `}>
            Reg. D&T :
            <strong className={`text-[#1A0616]`}>
              {formattedDate ?? 'NA'} &nbsp; <span className="text-[10px] font-[400]">{formattedTime ?? 'NA'}</span>
            </strong>
          </Text>
        </Box>

        <Box className={`flex items-center justify-between mt-2`}>
          <Text className={`!text-[10px] !font-[500] text-[#A1999F]`}>
            Phone &nbsp;
            <span className={`text-[#1A0616]`}>{list.phoneNumber ?? 'NA'}</span>
          </Text>
          <Box className={`${styles['gender-age-blood']}`}>
            <Text className={styles['label']}>
              <span className={`${styles['value']} text-[black]`}>
                {' '}
                {renderGenderIcon(list.gender?.name?.toLowerCase()) ?? ''}
              </span>
            </Text>
            <Text className={styles['label']}>
              <span
                className={`${styles['value']} px-[2px] py-[2px] rounded-[4px] ${list.age <= 20 ? 'bg-[#67B1C9] text-[white]' : list.age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
              >
                {list.age ?? 'NA'}
              </span>
            </Text>
            <Text className={`${styles['label']}`}>
              <span className={`${styles['value']} text-[#C83926] !text-[14px] !font-[600]`}>
                {list.bloodGroup?.name ?? 'NA'}
              </span>
            </Text>
          </Box>
        </Box>
        <Text className="!text-[10px] !font-[500] !my-3">{list.hospital?.name ?? 'NA'}</Text>
        <Box className="flex items-center justify-between ">
          <OrganImageswithSlide Organs={list.organs} visibleCount={3} />
          {!isInhouseFinal && (
            <EditIcon
              className={styles['action-icon']}
              onClick={() => {
                setOpendialog(true);
                setSelectedRow(list);
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MobileView;
