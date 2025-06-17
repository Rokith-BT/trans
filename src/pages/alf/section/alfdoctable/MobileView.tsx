import { DeleteIcon, ViewIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { RecipientAlfDoctor } from '@/types/alf';
import { ConsultantList } from '@/types/common.type';
import { formatDateAndTime } from '@/utils/dateutils';
import { toast } from '@/utils/toast';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

interface ALFDataTableProps {
  list: RecipientAlfDoctor;
  isAlfDeleted?: boolean;
  setOpenRestore: (_data: boolean) => void;
  setSelectedRow: (_data: RecipientAlfDoctor) => void;
  setOpenDeleteDialog: (_data: boolean) => void;
}
const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
};
const MobileView: React.FC<ALFDataTableProps> = ({
  isAlfDeleted,
  list,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  setOpenRestore,
  setSelectedRow,
  setOpenDeleteDialog
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    state: { consultant }
  } = useMasterData();

  const selctedConsultant = consultant.find((c: ConsultantList) => c.userID === list.consultant?.id);
  const hospitalID = selctedConsultant?.hospitalID;
  const userID = selctedConsultant?.userID;
  const payload = { hospitalID, userID };
  const status = list.status ?? '';

  const colors = statusColor[list.status] ?? { bgColor: '#fff', textColor: '#000' };
  const { formattedDate: alfRegDate } = formatDateAndTime(list.alfRegistrationDate);
  const { formattedDate: alfDeletedDate } = formatDateAndTime(list.alfDeletedDate);

  return (
    <Box className="border border-[#C967A2] p-3 flex flex-col gap-y-2 rounded-lg">
      <Box className="flex items-center justify-between">
        <Text className="!text-[10px] !font-[500] text-[#A1999F]">
          S.No <strong>{list.serialNumber ?? 'NA'}</strong>
        </Text>
        <Text className="!text-[12px] !font-[500] ">Transtan Id : {list.transtanID ?? 'NA'}</Text>
        <Text
          className="!text-[10px] !font-[400] p-[2px] rounded-md"
          sx={{
            color: colors.textColor,
            background: colors.bgColor
          }}
        >
          {list.status ?? 'NA'}
        </Text>
      </Box>
      <Box className="flex items-center justify-between">
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Name : <strong className="text-[13px] text-[black]">{list.consultant?.name ?? 'NA'}</strong>
        </Text>
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Role : <span className="text-[12px] text-[black] ">{list.role?.name ?? 'NA'}</span>
        </Text>
      </Box>
      <Box className="flex items-center justify-between text-center">
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          Experience : <br /> <strong className="text-[13px] text-[black]">{list.experience ?? 'NA'}</strong>
        </Text>
        <Text className="!text-[11px] !font-[500] text-[#A1999F]">
          ALF Reg Date : <br /> <span className="text-[12px] text-[black] ">{alfRegDate ?? 'NA'}</span>
        </Text>
        {isAlfDeleted && (
          <Text className="!text-[11px] !font-[500] text-[#A1999F]">
            ALF Deleted Date : <br />
            <span className="text-[12px] text-[black] ">{alfDeletedDate ?? 'NA'}</span>
          </Text>
        )}
      </Box>
      <Box className="flex h-[40px] items-center gap-2">
        <ViewIcon
          className="cursor-pointer"
          onClick={() => {
            if (hospitalID === undefined) {
              toast('User Does not map with any Hospital', 'info');
              return;
            }
            navigate(`/hospitals/${hospitalID}/view-users`, {
              state: {
                selectedConsultant: payload,
                isAlfDoctorView: true,
                origin: 'alf/alf-doctor',
                tab: `${location.hash}`
              }
            });
          }}
        />
        {status === 'Active' && (
          <>
            <DeleteIcon
              className="cursor-pointer"
              onClick={() => {
                setOpenDeleteDialog;
                setSelectedRow;
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default MobileView;
