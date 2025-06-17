import {
  DeleteIcon,
  EditIcon,
  FemaleIcon,
  MaleIcon,
  MenuDropDownIcon,
  TerminateIcon,
  TransgenderIcon,
  ViewIcon
} from '@/assets/icons';
import { Box, Text } from '@/atoms';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import React, { Dispatch, SetStateAction } from 'react';
import PopupMenu from './PopupMenu';
import { DonorStatusType, PontentialDonor } from '@/types/donor';
import { useNavigate } from 'react-router';
import { useRole } from '@/hooks/useRole';

interface PotentialTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: any;
  SetOpenDonor: (_data: boolean) => void;
  setOpenReq: Dispatch<SetStateAction<boolean>>;
  setDonorSta: Dispatch<SetStateAction<DonorStatusType | null>>;
  setId: Dispatch<SetStateAction<number>>;
  setDonor: Dispatch<SetStateAction<PontentialDonor | null>>;
  open: boolean;
  //   setDonorSta: (_data: DonorStatusType | null) => void;
  setOpenTerminate: (_data: boolean) => void;
  //   setDonor: (_data: PontentialDonor) => void;
  id: number;
  //   setId: (_data: number) => void;
  setOpen: (_data: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDonorStatuses: any;
}

const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  'Ready For Review': { bgColor: '#CFEEBC', textColor: '#027545' },
  Terminated: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  'Requesting Apnea Details': { bgColor: '#EEDABC', textColor: '#C88726' },
  'Draft Deleted': { bgColor: '#EEDABC', textColor: '#C88726' },
  Draft: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};

const PotentialMobileView: React.FC<PotentialTableProps> = ({
  list,
  setOpenReq,
  SetOpenDonor,
  open,
  setDonorSta,
  setOpenTerminate,
  setDonor,
  id = 0,
  setId,
  setOpen,
  getDonorStatuses
}) => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useRole();
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
  const potentialStatus = list?.statusId ?? 0;
  const renderPotentialStatus = (status: number | string) => {
    switch (status) {
      case 1:
        return 'Draft';
      case 2:
        return 'Ready For Review';
      case 6:
        return 'Requesting Apnea Details';
      case 3:
        return 'Complete Draft Status';
      case 7:
        return 'Requesting More Details';
      case 15:
      case 4:
        return 'Terminated';
      default:
        return potentialStatus; // Returns the number
    }
  };
  const statusTextColor = statusColor[list?.status] ?? { bgColor: '#fff', textColor: '#bbb' };
  function toggleDropdown(e: React.MouseEvent, id: number) {
    console.log(e.currentTarget, 'e.currentTarget');
    setId(id);
    setOpen(true);
  }
  return (
    <Box className="border-[1px] border-[#C967A2] p-3 rounded-lg relative pb-[15%] sm:pb-[10%] ">
      <Box className="flex items-center justify-between mb-[8px]">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">S.No. {list?.serialNumber ?? 0}</Text>
        <Text
          className={`!text-[8px] !font-[500] !bg-[${statusTextColor.bgColor}] text-[${statusTextColor.textColor}] px-1 py-[1px] rounded-[12px]`}
        >
          {renderPotentialStatus(potentialStatus) ?? ''}
        </Text>
        {/* <Text className={`!text-[10px] f!ont-[500] text-[${formattedZoneColor}]`}>
          S.No. {abbreviateZone(list?.zone?.name) ?? 'NA'}
        </Text> */}
      </Box>
      <Box className="flex items-center justify-between mb-[8px]">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          Donor Id <span className="text-[#C967A2]">{list?.transtanId ?? ''}</span>
        </Text>
        <Box className="flex items-center ">
          <Text className="!text-[12px] !font-[600] text-[#C83926]">{list?.bloodGroup ?? ''}</Text>
          <Text className="!text-[10px] !font-[500] text-[#A1999F]">
            {renderGenderIcon(list?.gender?.toLowerCase()) ?? 'NA'}
          </Text>
          <Text
            className={`!text-[10px] !font-[600] px-[2px] py-[2px] rounded-[4px] ${list?.age <= 20 ? 'bg-[#67B1C9] text-[white]' : list?.age >= 60 ? 'bg-[#C96767] text-[white]' : 'text-[black]'}`}
          >
            {list?.age ?? ''}
          </Text>
        </Box>
      </Box>
      <Text className="!text-[10px] !font-[500] text-[#A1999F] !mb-[8px]">
        Donor Name <span className="text-[#C967A2]">{list?.name ?? ''}</span>
      </Text>
      <Text className="!text-[10px] !font-[500] text-[#A1999F] !mb-[8px]">
        Request Note <span className="text-[#1A0616]">{list?.notes ?? ''}</span>
      </Text>
      <Text className="!text-[10px] !font-[500] text-[#1A0616] !mb-[8px]">{list?.hospitalName ?? ''}</Text>
      <Box className="relative">
        <OrganImageswithSlide Organs={list.organConsented ?? []} visibleCount={4} />
      </Box>
      <Box className="mt-[8px] flex items-center gap-1 absolute left-3 bottom-3">
        {potentialStatus === 1 ? (
          <>
            {' '}
            <ViewIcon />
            <EditIcon
              onClick={() =>
                navigate(`/donors/${list.id}/edit/`, {
                  state: { isAddNew: false, isConsentGiven: true, hospitalId: list?.hospitalId }
                })
              }
            />
            <TerminateIcon
              onClick={() => {
                SetOpenDonor(true);
                setOpenTerminate(true);
              }}
            />
          </>
        ) : (
          <>
            <ViewIcon />
            <EditIcon
              onClick={() =>
                navigate(`/donors/${list.id}/edit/`, {
                  state: { isAddNew: false, isConsentGiven: true, hospitalId: list?.hospitalId }
                })
              }
            />
            <TerminateIcon
              onClick={() => {
                SetOpenDonor(true);
                setOpenTerminate(true);
                setDonor(list);
              }}
            />
            <DeleteIcon
              onClick={() => {
                SetOpenDonor(true);
                setOpenTerminate(false);
              }}
            />
          </>
        )}

        {list.statusId === 2 && isSuperAdmin && (
          <>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
              <Box onClick={(e) => toggleDropdown(e, list.id)} sx={{ cursor: 'pointer' }}>
                <MenuDropDownIcon />
              </Box>
              {open && id == list.id && (
                <PopupMenu
                  onClose={() => setOpen(false)}
                  setOpenReq={setOpenReq}
                  setDonorSta={setDonorSta}
                  setId={setId}
                  setDonor={setDonor}
                  data={list}
                  DonorStatuses={getDonorStatuses.filter((e: DonorStatusType) => [6, 7, 3].includes(e.id))}
                />
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PotentialMobileView;
