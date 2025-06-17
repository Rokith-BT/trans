/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text } from '@/atoms';
import React, { useState } from 'react';
import './MobileView.scss';
import { formatDateAndTime } from '@/utils/dateutils';
import { VerifyApprovalIcon, ViewIcon } from '@/assets/icons';
import ChatIcon1 from '@/assets/icons/ChatIcon1';
import TodoVerify from '@/assets/icons/TodoVerify';
import { MessageDialog } from '../dialogs/MessageDialog';
import ALFDoctorListDialog from '../alfComponent/ALFDoctorList';
import ALFExtendDialog from '../dialogs/ALFExtendDialog';
import { withVisibility } from '@/hoc/Visibility';
import { isALFApproveAdminIconVisible, isALFVerifyIcon, isALFViewIconVisible } from '@/utils/actionButtonStatus';
import Countdown from 'react-countdown';
import ExtendIcon from '@/assets/icons/ExtendIcon';
import { RecipientALFDTOs } from '@/types/alf';
import { useLocation, useNavigate } from 'react-router';
import { useRole } from '@/hooks/useRole';

interface ALFTableCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  isApprove: boolean | undefined;
  setOpenChat: (_open: boolean) => void;
  setAlfDocList: (_open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer: any;
  isSuperAdmin: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setAlf: (_raw: any) => void;
  canApprove: any;
  canRead: any;
}
const StatusColor: { [key: string]: { bgColor: string; textColor: string } } = {
  PendingALFReview: { bgColor: '#D7D2F880', textColor: '#4E3395' },
  PendingTranstanReview: { bgColor: '#D0DDF980', textColor: '#3A5A96' },
  Delisted: { bgColor: '#F4EADA', textColor: '#C88726' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Approved: { bgColor: '#CFEEBC', textColor: '#027545' }
};
const ALFTableCard: React.FC<ALFTableCardProps> = ({
  data,
  renderer,
  isSuperAdmin,
  canApprove,
  canRead,
  isApprove
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const status = data.status && data.status.trim();
  const { bgColor, textColor } = StatusColor[data.status] || { bgColor: '#D0DDF9', textColor: '#3A5A96' };
  const DateVal = new Date(data?.expirationDate);
  const [openChat, setOpenChat] = useState(false);
  const [alfDocList, setAlfDocList] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [alf, setAlf] = useState<RecipientALFDTOs>();
  const { isDoctor } = useRole();

  const { createdAt } = data || null;
  if (!createdAt) {
    return null;
  }
  const { formattedDate, formattedTime } = formatDateAndTime(createdAt);

  const ALFTodoVerifyVisisbility = withVisibility(TodoVerify);
  const ALFVerifyAdminIconVisibility = withVisibility(TodoVerify);
  const ALFViewIconVisibility = withVisibility(ViewIcon);

  return (
    <Box className="card ">
      <Box className="flex justify-between items-center mb-4">
        <Box>
          S.No. <span className="text-[#C967A2]">{data?.serialNumber}</span>
        </Box>
        <Box className="flex gap-1 justify-center align-middle items-center">
          <Text
            className="!text-left !text-[12px] !font-[600] rounded-lg"
            sx={{
              color: textColor,
              backgroundColor: bgColor,
              borderRadius: '8px',
              padding: '0px 8px',
              fontSize: '11px',
              fontWeight: '500'
            }}
          >
            {status === 'PendingALFReview'
              ? 'Pending ALF Review'
              : status === 'PendingTranstanReview'
                ? 'Pending Transtan Review'
                : status === 'FinalReview'
                  ? 'Final Review'
                  : status}
          </Text>
          {isSuperAdmin &&
            (status === 'Approved' || status === 'PendingALFReview' || status === 'PendingTranstanReview') &&
            (data?.expiryExtendCount === null || data?.expiryExtendCount === 0) && (
              <ExtendIcon
                onClick={() => {
                  setExtendOpen(true);
                  setAlf(data);
                }}
              />
            )}
          {data.expirationDate && (
            <Box className="text-left absolute mt-8">
              <Countdown date={DateVal} renderer={renderer} />
            </Box>
          )}
          {/* <Text>
            {(recipientStatus === 'Deleted' ||
              recipientStatus === 'Inactive' ||
              recipientStatus === 'ChangeRequest' ||
              recipientStatus === 'Active' ||
              recipientStatus === 'DocumentVerified') && (
              <ToolTips
                title={data?.reason}
                arrow
                placement="top"
                sx={{
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'black',
                    color: 'white',
                    fontSize: '12px',
                    borderRadius: '8px',
                    padding: '8px'
                  },
                  '& .MuiTooltip-arrow': {
                    color: 'black'
                  }
                }}
              >
                <Box className="">
                  <InforCircleIcon />
                </Box>
              </ToolTips>
            )}
          </Text> */}
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
          Transtan Name <span className="text-[#C967A2] text-[12px] font-medium">{data?.name}</span>
        </Text>
      </Box>
      <Box className="mt-2">
        <Text
          onClick={() => {
            setAlfDocList(true);
            setAlf(data);
          }}
          className="!text-[12px]  cursor-pointer font-medium"
        >
          Pending ALF Approval
          <span className="text-[#C967A2] text-[12px] font-medium">{data?.pendingALFApprovalCount}</span>
        </Text>
      </Box>
      <Box className="mt-2 flex justify-between items-center">
        <Text className="!text-[12px] text-[#777] cursor-pointer font-medium">
          ALF ID <span className="text-[#C967A2] text-[12px] font-medium">{data?.id}</span>
        </Text>
        <Text className="!text-[12px] text-[#777] cursor-pointer font-medium">
          Listing D&T
          <span className="text-[#000] text-[12px] font-medium">
            {formattedDate} {formattedTime}
          </span>
        </Text>
      </Box>
      <Box className="mt-2">
        <Text className="!text-[12px] text-[#777] cursor-pointer font-medium">
          Category <span className="text-[#000] text-[12px] font-medium">{data?.alfListingType?.name}</span>
        </Text>
      </Box>
      <Box className="mt-2 flex gap-2 items-center">
        <Text className="!text-[12px] text-[#000] !font-semibold">
          <Text className="text-[#777] !text-[12px] font-medium break-words overflow-hidden whitespace-pre-wrap max-w-[250px] sm:max-w-full inline-block">
            Hospital <span className="text-[#000] text-[12px] font-medium">{data?.hospital?.name}</span>
          </Text>
        </Text>
      </Box>

      <Box className="mt-4 flex gap-2">
        {isApprove ? (
          <VerifyApprovalIcon
            className="cursor-pointer"
            onClick={() => {
              navigate(`/alf/${data?.recipientId}/view`, {
                state: { isApprove: true, alfID: data?.id, origin: 'approvals', tab: `${location.hash}` }
              });
            }}
          />
        ) : (
          <>
            {' '}
            {isDoctor && (
              <ALFTodoVerifyVisisbility
                isVisible={isALFVerifyIcon(data.status, canApprove)}
                onClick={() => {
                  navigate(`/alf/${data?.recipientId}/view`, {
                    state: {
                      isAlfReview: true,
                      alfID: data?.id,
                      origin: `alf`,
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
            )}
            <ALFVerifyAdminIconVisibility
              isVisible={isALFApproveAdminIconVisible(data.status, canApprove)}
              onClick={() => {
                setAlfDocList(true);
                setAlf(data);
              }}
            />
            <ALFViewIconVisibility
              isVisible={isALFViewIconVisible(data.status, canRead)}
              onClick={() => {
                navigate(`/alf/${data?.recipientId}/view`, {
                  state: { onlyView: true, origin: `alf`, tab: `${location.hash}`, filter: `${location.search}` }
                });
              }}
            />
            <Box
              className="relative cursor-pointer"
              onClick={() => {
                setOpenChat(true);
                setAlf(data);
              }}
            >
              <ChatIcon1 />
            </Box>
          </>
        )}
      </Box>

      <MessageDialog
        open={openChat}
        onClose={() => {
          setOpenChat(false);
        }}
        alfData={alf}
      />
      {alfDocList && (
        <ALFDoctorListDialog
          open={alfDocList}
          onClose={() => {
            setAlfDocList(false);
          }}
          alfData={alf}
        />
      )}

      <ALFExtendDialog
        open={extendOpen}
        onClose={() => {
          setExtendOpen(false);
        }}
        alfData={alf}
      />
    </Box>
  );
};

export default ALFTableCard;
