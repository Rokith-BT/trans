/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Box, Text, ToolTips } from '@/atoms';
import React, { useState } from 'react';
import './MobileView.scss';
import { formatDateAndTime } from '@/utils/dateutils';
import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import {
  CloseCircleIcon,
  DeleteIcon,
  DocumentDownload,
  EditIcon,
  FemaleIcon,
  FileUploadIcon,
  InforCircleIcon,
  MaleIcon,
  OrganAllocatedIcon,
  TransgenderIcon,
  UndoIcon,
  VerifyApprovalIcon,
  ViewIcon
} from '@/assets/icons';
import {
  isCloseCircleIconRecipientVisible,
  isDeleteIconRecipientVisible,
  isDocumentDownloadIconRecipientVisible,
  iseditIconRecipientVisible,
  isOrganAllocatedRecipientVisible,
  isRestoreIconRecipientVisible,
  isViewIconRecipientVisible
} from '@/utils/actionButtonStatus';
import { useNavigate } from 'react-router';
import { Tooltip } from '@mui/material';
import { withVisibility } from '@/hoc/Visibility';
import { useRecipient } from '../RecipientContext';
import { handleDownload } from '../pdf/PrintPDF';
import { handleRecipientsData } from '@/utils/handleRecipientData';
import DeleteDialog from '@/pages/components/DeleteDialog';
import OrganAllocationDialog from './OrganAllocationDialog';
import RecipientInactiveDialog from './RecipientInactiveDialog';
import RecipientActiveDialog from './RecipientActiveDialog';
import RecipientDocVerifiedDialog from './RecipientDocVerifiedDialog';
import { getHospitalTypes } from '@/utils/hospitalTypeutils';
import Countdown from 'react-countdown';

// const statusColor: { [key: string]: { bgColor: string; textColor: string } } = {
//   Active: { bgColor: '#CFEEBC', textColor: '#027545' },
//   Expired: { bgColor: '#FFE1E1', textColor: '#DD2323' },
//   Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
//   DetailsPending: { bgColor: '#EEDABC', textColor: '#C88726' },
//   PendingApproval: { bgColor: '#EEDABC', textColor: '#C88726' },
//   Rejected: { bgColor: '#FFE1E1', textColor: '#DD2323' }
// };
const zoneTextColor: { [key: string]: { textColor1: string } } = {
  W: { textColor1: '#80C967' },
  N: { textColor1: '#67B1C9' },
  S: { textColor1: '#C96767' }
};

interface RecipientTableCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  isApprove: boolean | undefined;
  isCmInsurance: boolean | undefined;
  isRecipientTranf: boolean | undefined;
  isAlf: boolean | undefined;
  isWaitinglist: boolean | undefined;
  isUnpaid: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCurrentSerialNumber: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenSliderView: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenCmInsurance: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderer: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setOpenCmInsuranceApr: any;
}

const recipientTextColor: { [key: string]: { bgColor: string; textColor: string } } = {
  Draft: { bgColor: '#EDEDED', textColor: '#71717A' },
  'Draft Deleted': { bgColor: '#FFE1E1', textColor: '#DD2323' },
  PendingApproval: { bgColor: '#F4EADA', textColor: '#C88726' },
  Inactive: { bgColor: '#A1999F26', textColor: '#71717A' },
  Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' },
  Organs: { bgColor: '#E0F0FF', textColor: '#67B1C9' },
  DocumentVerified: { bgColor: '#E0F0FF', textColor: '#67B1C9' },
  Active: { bgColor: '#CFEEBC', textColor: '#027545' },
  'Organs Allocated': { bgColor: '#E0F0FF', textColor: '#67B1C9' }
};

const RecipientTableCard: React.FC<RecipientTableCardProps> = ({
  data,
  setCurrentSerialNumber,
  setOpenSliderView,
  setOpenCmInsurance,
  setSelectedData,
  renderer,
  isApprove,
  isCmInsurance,
  isRecipientTranf,
  isAlf,
  setOpenCmInsuranceApr
}) => {
  const {
    actions: { getRecipientDataByID, deleteRecipientByID, recipientChangeInactive }
  } = useRecipient();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [openAction, setOpenAction] = useState(false);
  const [validation, setValidation] = useState('');
  const [dialogType, setDialogType] = useState<string | null>(null);
  const ViewIconRecipientVisibility = withVisibility(ViewIcon);
  const EditIconRecipientVisbility = withVisibility(EditIcon);
  const DocumentDownloadIconRecipientVisibility = withVisibility(DocumentDownload);
  const DeleteIconRecipientVisibility = withVisibility(DeleteIcon);
  const OrganAllocatedRecipientVisibility = withVisibility(() => (
    <OrganAllocatedIcon toolText="Organ Allocated" onClick={() => openDialog('Organ Allocation')} />
  ));
  const CloseCricleIconRecipientVisibility = withVisibility(CloseCircleIcon);
  const RestoreIconRecipientVisibility = withVisibility(UndoIcon);
  console.log(openAction);
  const cmInsuranceColor: { [key: string]: { textColor2: string } } = {
    Applied: { textColor2: '#C88726' },
    NA: { textColor2: '#1A0616' },
    Approved: { textColor2: '#80C967' },
    Rejected: { textColor2: '#DD2323' }
  };
  const { dateOfRegistration } = data || null;
  const { formattedDate, formattedTime } = formatDateAndTime(dateOfRegistration);

  const cmInsurance = data.cmInsurance?.name && data.cmInsurance?.name.trim();
  const { textColor2 } = cmInsuranceColor[cmInsurance] || { textColor: 'black' };

  const openDialog = (type: string) => {
    setDialogType(type);
    setOpenAction(false);
  };
  const closeDialog = () => setDialogType(null);

  const actionsRecipient = (val: string) => {
    if (reason === '') {
      setValidation('Reason Required');
      return false;
    }
    if (val === 'delete') {
      deleteRecipientByID(Number(data.recipientId), reason, () => {
        navigate('/recipients?filter%5Bstatus%5D=Deleted&page=1&perPage=10#deleted');
      });
    } else {
      recipientChangeInactive(data.recipientId, reason, () => {
        navigate('/recipients?filter%5Bstatus%5D=Inactive&page=1&perPage=10#inactive');
      });
    }
  };

  const handleDownloadPDF = async (ID: number | string) => {
    getRecipientDataByID(Number(ID), async (res) => {
      if (res?.recipient) {
        const { data, datafc, datamc, dataOrgan } = await handleRecipientsData(res?.recipient);
        await handleDownload(data, datafc, datamc, dataOrgan);
      }
    });
  };
  const { age, bloodGroup, gender } = data || {};

  const recipientStatus = data.status && data.status.trim();
  const { bgColor, textColor } = recipientTextColor[recipientStatus] || {
    bgColor: '#FFE1E1',
    textColor: '#dd2323'
  };
  const DateVal = new Date(data.activationDate);

  const zone = data.zone?.name?.charAt(0) || '';
  const { currentZoneRank } = data || {};
  const { textColor1 } = zoneTextColor[zone] || { textColor: 'black' };
  const { phoneNumber, countryCode1 } = data || {};

  const formateHospitalType = getHospitalTypes(data?.hospitalType?.name);
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
            {recipientStatus === 'PendingApproval'
              ? 'Pending Approval'
              : recipientStatus === 'DocumentVerified'
                ? 'Document Verified'
                : recipientStatus === 'ChangeRequest'
                  ? 'Change Request'
                  : recipientStatus}
          </Text>
          {data.activationDate && (
            <Box className="text-left absolute mt-8">
              <Countdown date={DateVal} renderer={renderer} />
            </Box>
          )}
          <Text>
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
          </Text>

          {/* <Text className="!text-[16px] !font-[400]">{currentZoneRank || ''}</Text> */}
          <Text
            className="flex flex-col !text-[16px] !font-[600] !mt-[2px]"
            sx={{
              color: textColor1
            }}
          >
            {zone || 'NA'}
          </Text>
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
      <Box className="mt-2 flex justify-between">
        <Text className="!text-[12px] text-[#777]">
          Zonal Rank <span className="text-[#000] text-[12px] font-medium">{currentZoneRank || '0'}</span>
        </Text>
        <Text className="!text-[12px] text-[#777]">
          Reg. D&T{' '}
          <span className="text-[#000] text-[12px] font-medium">
            {formattedDate} {formattedTime}
          </span>
        </Text>
      </Box>
      <Box className="mt-3 flex justify-between">
        <Text className="!text-[12px] text-[#777]">
          Phone{' '}
          <span className="text-[#000] text-[12px] font-medium">
            {countryCode1 === null ? 91 : countryCode1} {phoneNumber}
          </span>
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
            Hospital <span className="text-[#000] text-[12px] font-medium">{data?.hospital?.name}</span>
          </Text>
        </Text>
        <Text
          className={`!font-medium ${data?.hospitalType?.name === 'Private' ? 'text-[#C88726]' : 'text-[#008774]'} !text-[12px] relative -top-0.5`}
        >
          {formateHospitalType}
        </Text>
      </Box>
      <Box className="mt-3">
        {data.organs.length > 0 ? (
          <>
            <OrganImageswithSlide Organs={data.organs} visibleCount={6} />{' '}
          </>
        ) : (
          <Text className="!text-[10px]">No Organs</Text>
        )}
      </Box>
      <Box className="mt-3 flex gap-2 items-center">
        <Text className="!text-[13px] text-[#777]"> CM Insurance</Text>
        <Text
          className="flex items-center gap-2 !text-[12px] !font-medium"
          sx={{
            color: textColor2
          }}
        >
          {cmInsurance}
          {(cmInsurance === 'Approved' || cmInsurance === 'Rejected' || cmInsurance === 'Applied') && (
            <>
              <Tooltip
                title={data?.cmInsuranceNote || ''}
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
                <Box>
                  <InforCircleIcon />
                </Box>
              </Tooltip>
              <ViewIcon
                onClick={() => {
                  setCurrentSerialNumber(data?.serialNumber);
                  setOpenSliderView(true);
                }}
              />
            </>
          )}

          {cmInsurance === 'To be Applied' || cmInsurance === 'Rejected' ? (
            <FileUploadIcon
              isPink={true}
              // className="h-[16px] w-[16px]"
              onClick={() => {
                setOpenCmInsurance(true);
                setSelectedData(data);
              }}
            />
          ) : (
            ''
          )}
        </Text>
      </Box>
      <>
        {/* {(isApprove && !isCmInsurance && !isRecipientTranf) || isAlf ? (
          <VerifyApprovalIcon
            className="cursor-pointer"
            onClick={() => {
              navigate(`/recipients/${data?.data?.recipientId}/view`, {
                state: {
                  isApproval: true,
                  onlyView: true,
                  origin: `approvals`,
                  tab: `${location.hash}`,
                  filter: `${location.search}`
                }
              });
            }}
          />
        ) : isApprove && isCmInsurance ? (
          <VerifyApprovalIcon
            className="cursor-pointer"
            onClick={() => {
              setOpenCmInsuranceApr(true);
              setSelectedData(data?.data);
            }}
          />
        ) : isRecipientTranf ? (
          <VerifyApprovalIcon
            className="cursor-pointer"
            onClick={() => {
              navigate(`/recipients/view-recipient-transfer`, {
                state: {
                  isRecipientTranf: true,
                  origin: `approvals`,
                  tab: `${location.hash}`,
                  filter: `${location.search}`
                }
              });
            }}
          />
        ) : (
          <>
            <Box className="mt-4 flex gap-2">
              <DeleteIconRecipientVisibility
                isVisible={isDeleteIconRecipientVisible(data.status, true)}
                onClick={() => openDialog('delete')}
              />
              <EditIconRecipientVisbility
                isVisible={iseditIconRecipientVisible(data.status, true)}
                onClick={() => {
                  navigate(`/recipients/${data.recipientId}/edit`, {
                    state: {
                      nationality: data?.isIndian ? 'indian' : 'international',
                      hospitalID: data?.hospital?.id,
                      hospitalName: data?.hospital?.name,
                      currStatus: data?.status,
                      isAddNew: false,
                      origin: `recipients`,
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
              <DocumentDownloadIconRecipientVisibility
                isVisible={isDocumentDownloadIconRecipientVisible(data.status)}
                onClick={() => handleDownloadPDF(data.recipientId)}
              />
              <OrganAllocatedRecipientVisibility isVisible={isOrganAllocatedRecipientVisible(data.status)} />
              <CloseCricleIconRecipientVisibility
                isVisible={isCloseCircleIconRecipientVisible(data.status, true)}
                onClick={() => openDialog('inactive')}
              />
              <ViewIconRecipientVisibility
                isVisible={isViewIconRecipientVisible(data.status, true)}
                onClick={() => {
                  navigate(`/recipients/${data?.recipientId}/view`, {
                    state: {
                      onlyView: true,
                      origin: `recipients`,
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
              <RestoreIconRecipientVisibility
                isVisible={isRestoreIconRecipientVisible(data.status)}
                onClick={() => openDialog('restore')}
              />
            </Box>
          </>
        )} */}

        <Box className="mt-4 flex gap-2">
          {(isApprove && !isCmInsurance && !isRecipientTranf) || isAlf ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                navigate(`/recipients/${data?.recipientId}/view`, {
                  state: {
                    isApproval: true,
                    onlyView: true,
                    origin: `approvals`,
                    tab: `${location.hash}`,
                    filter: `${location.search}`
                  }
                });
              }}
            />
          ) : isApprove && isCmInsurance ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                setOpenCmInsuranceApr(true);
                setSelectedData(data);
              }}
            />
          ) : isRecipientTranf ? (
            <VerifyApprovalIcon
              className="cursor-pointer"
              onClick={() => {
                navigate(`/recipients/view-recipient-transfer`, {
                  state: {
                    isRecipientTranf: true,
                    origin: `approvals`,
                    tab: `${location.hash}`,
                    filter: `${location.search}`
                  }
                });
              }}
            />
          ) : (
            <>
              <DeleteIconRecipientVisibility
                isVisible={isDeleteIconRecipientVisible(data.status, true)}
                onClick={() => openDialog('delete')}
              />
              <EditIconRecipientVisbility
                isVisible={iseditIconRecipientVisible(data.status, true)}
                onClick={() => {
                  navigate(`/recipients/${data.recipientId}/edit`, {
                    state: {
                      nationality: data?.isIndian ? 'indian' : 'international',
                      hospitalID: data?.hospital?.id,
                      hospitalName: data?.hospital?.name,
                      currStatus: data?.status,
                      isAddNew: false,
                      origin: `recipients`,
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
              <DocumentDownloadIconRecipientVisibility
                isVisible={isDocumentDownloadIconRecipientVisible(data.status)}
                onClick={() => handleDownloadPDF(data.recipientId)}
              />
              <OrganAllocatedRecipientVisibility isVisible={isOrganAllocatedRecipientVisible(data.status)} />
              <CloseCricleIconRecipientVisibility
                isVisible={isCloseCircleIconRecipientVisible(data.status, true)}
                onClick={() => openDialog('inactive')}
              />
              <ViewIconRecipientVisibility
                isVisible={isViewIconRecipientVisible(data.status, true)}
                onClick={() => {
                  navigate(`/recipients/${data?.recipientId}/view`, {
                    state: {
                      onlyView: true,
                      origin: `recipients`,
                      tab: `${location.hash}`,
                      filter: `${location.search}`
                    }
                  });
                }}
              />
              <RestoreIconRecipientVisibility
                isVisible={isRestoreIconRecipientVisible(data.status)}
                onClick={() => openDialog('restore')}
              />
            </>
          )}
        </Box>
      </>

      {dialogType === 'delete' && (
        <DeleteDialog
          onDelete={(val: string) => {
            actionsRecipient(val);
          }}
          setReason={setReason}
          validation={validation}
          data={data}
          open
          onClose={closeDialog}
        />
      )}
      {dialogType === 'documentVerified' && <RecipientDocVerifiedDialog data={data} open onClose={closeDialog} />}
      {dialogType === 'active' && <RecipientActiveDialog data={data} open onClose={closeDialog} />}
      {dialogType === 'inactive' && (
        <RecipientInactiveDialog
          onInactive={(val: string) => {
            actionsRecipient(val);
          }}
          setReason={setReason}
          validation={validation}
          data={data}
          open
          onClose={closeDialog}
        />
      )}
      {dialogType === 'Organ Allocation' && <OrganAllocationDialog open onClose={closeDialog} />}
    </Box>
  );
};

export default RecipientTableCard;
