/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  CloseCircleIcon,
  DeleteIcon,
  DocumentDownload,
  EditIcon,
  RefreshIcon,
  TickCircle,
  UndoIcon,
  VerifyApprovalIcon,
  ViewIcon
} from '@/assets/icons';
import { ActionIcon } from '@/assets/icons/ActionIcon';
import { MenuIcon } from '@/assets/icons/MenuIcon';
import { VerifyDocumentIcon } from '@/assets/icons/VerifyDocumentIcon';
import { Box } from '@/atoms';
import RecipientDocVerifiedDialog from './RecipientDocVerifiedDialog';
import { OrganAllocatedIcon } from '@/assets/icons/OrganAllocatedIcon';
import { withVisibility } from '@/hoc/Visibility';
import {
  isALFApproveAdminIconVisible,
  isALFEditIconVisible,
  isALFRevokeIconVisible,
  isALFVerifyIcon,
  isALFViewIconVisible,
  isCloseCircleIconRecipientVisible,
  isDeleteIconRecipientVisible,
  isDocumentDownloadIconRecipientVisible,
  iseditIconRecipientVisible,
  isOrganAllocatedRecipientVisible,
  isRestoreIconRecipientVisible,
  isTickCircleIconRecipientVisible,
  isVerifyDocumentIconRecipientVisible,
  isViewIconRecipientVisible
} from '@/utils/actionButtonStatus';
import RecipientActiveDialog from './RecipientActiveDialog';
import RecipientInactiveDialog from './RecipientInactiveDialog';
import DeleteDialog from '@/pages/components/DeleteDialog';
import RecipientRestoreDialog from './RecipientRestoreDialog';
import { useLocation, useNavigate } from 'react-router-dom';
// import VerifyTick from '@/assets/icons/VerifyTick';
import TodoVerify from '@/assets/icons/TodoVerify';
import { useRecipient } from '../RecipientContext';
import { useRole } from '@/hooks/useRole';
import OrganAllocationDialog from './OrganAllocationDialog';
import { Recipient } from '@/types/recipient';
import { handleRecipientsData } from '@/utils/handleRecipientData';
import { handleDownload } from '../pdf/PrintPDF';
import { RecipientALFDTOs } from '@/types/alf';
import { useALF } from '@/pages/alf/ALFContext';
import { toast } from '@/utils/toast';

interface ActionCellRenderProps {
  data: Recipient & RecipientALFDTOs;
  isInactive?: boolean;
  isUnpaid?: boolean;
  isWaitinglist?: boolean;
  canRead?: boolean | undefined;
  canApprove?: boolean | undefined;
  canDelete?: boolean | undefined;
  canUpdate?: boolean | undefined;
  canRead13?: boolean | undefined;
  setAlfDocList?: any;
  setAlf?: any;
}

const ActionsCellRenderer: React.FC<ActionCellRenderProps> = ({
  data,
  isInactive,
  isUnpaid,
  isWaitinglist,
  canRead,
  canDelete,
  canUpdate,
  canApprove,
  setAlfDocList,
  setAlf,
  canRead13
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location from action ', location);

  const [openAction, setOpenAction] = useState(false);
  const [dialogType, setDialogType] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [validation, setValidation] = useState('');
  const {
    actions: { deleteRecipientByID, recipientChangeInactive, getRecipientDataByID }
  } = useRecipient();
  const {
    actions: { alfFinalRevert }
  } = useALF();
  const { isDoctor } = useRole();
  const handleToggle = () => setOpenAction(!openAction);
  const openDialog = (type: string) => {
    setDialogType(type);
    setOpenAction(false);
  };
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

  const closeDialog = () => setDialogType(null);
  const ViewIconRecipientVisibility = withVisibility(ViewIcon);
  const EditIconRecipientVisbility = withVisibility(EditIcon);
  const VerifyDocumentIconRecipientVisbility = withVisibility(VerifyDocumentIcon);
  const DocumentDownloadIconRecipientVisibility = withVisibility(DocumentDownload);
  const DeleteIconRecipientVisibility = withVisibility(DeleteIcon);
  const OrganAllocatedRecipientVisibility = withVisibility(() => (
    <OrganAllocatedIcon toolText="Organ Allocated" onClick={() => openDialog('Organ Allocation')} />
  ));
  const CloseCricleIconRecipientVisibility = withVisibility(CloseCircleIcon);
  const RestoreIconRecipientVisibility = withVisibility(UndoIcon);
  const TickCircleIconRecipientVisibility = withVisibility(TickCircle);
  // const ALFVerifyVisibility = withVisibility(VerifyTick);
  const ALFTodoVerifyVisisbility = withVisibility(TodoVerify);
  const ALFVerifyAdminIconVisibility = withVisibility(TodoVerify);
  const ALFViewIconVisibility = withVisibility(ViewIcon);
  const ALFEditIconVisibility = withVisibility(EditIcon);
  const ALFRevokeIconVisibility = withVisibility(RefreshIcon);

  return (
    <Box
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        cursor: 'pointer'
      }}
    >
      {isInactive ? (
        <TickCircle
          onClick={() => {
            openDialog('active');
          }}
        />
      ) : isWaitinglist ? (
        <Box className="flex items-center justify-center">
          {canRead13 && (
            <ViewIcon
              onClick={() => {
                navigate(`/recipients/${data?.recipientId}/view`, {
                  state: {
                    data: data,
                    isApproval: true,
                    onlyView: true,
                    origin: `waitinglist/transtan`,
                    tab: `${location.hash}`,
                    filter: `${location.search}`
                  }
                });
              }}
            />
          )}
        </Box>
      ) : isUnpaid ? (
        <VerifyApprovalIcon
          onClick={() => {
            navigate(`/recipients/${data?.recipientId}/view`, {
              state: {
                // state: { isUnpaid: data?.isPaymentCompleted, onlyView: true }
                isUnpaid: data?.isPaymentCompleted,
                origin: `recipients`,
                tab: `${location.hash}`,
                filter: `${location.search}`
              }
            });
          }}
        />
      ) : (
        <>{!openAction ? <ActionIcon className={`actionOpenIcon`} onClick={handleToggle} /> : ''}</>
      )}
      {openAction && (
        <Box
          className="action-icon"
          style={{
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            gap: '8px',
            top: '18px',
            right: '2%',
            zIndex: 1000,
            backgroundColor: '#F3E5F2',
            borderRadius: '16px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '8px'
          }}
        >
          <DeleteIconRecipientVisibility
            isVisible={isDeleteIconRecipientVisible(data.status, canDelete)}
            onClick={() => openDialog('delete')}
          />
          <VerifyDocumentIconRecipientVisbility
            isVisible={isVerifyDocumentIconRecipientVisible(data.status)}
            onClick={() => openDialog('documentVerified')}
          />
          <EditIconRecipientVisbility
            isVisible={iseditIconRecipientVisible(data.status, canUpdate)}
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
            isVisible={isCloseCircleIconRecipientVisible(data.status, canDelete)}
            onClick={() => openDialog('inactive')}
          />
          <ViewIconRecipientVisibility
            isVisible={isViewIconRecipientVisible(data.status, canRead)}
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
          {!data?.activationDate && (
            <TickCircleIconRecipientVisibility
              isVisible={isTickCircleIconRecipientVisible(data.status)}
              onClick={() => openDialog('active')}
            />
          )}
          {isDoctor && (
            <ALFTodoVerifyVisisbility
              isVisible={isALFVerifyIcon(data.status, canApprove)}
              onClick={() => {
                navigate(`/alf/${data?.recipientId}/view`, {
                  state: { isAlfReview: true, alfID: data?.id }
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
          <ALFEditIconVisibility
            isVisible={isALFEditIconVisible(data.status, canUpdate)}
            onClick={() => {
              // navigate(`/alf/${data?.recipientId}/view`);
              navigate(`/alf/${data?.recipientId}/view`, {
                state: {
                  origin: `alf`,
                  tab: `${location.hash}`,
                  filter: `${location.search}`,
                  alfID: data?.id,
                  isDeleteEnable: true
                }
              });
            }}
          />
          <ALFRevokeIconVisibility
            isVisible={isALFRevokeIconVisible(data.status, canUpdate)}
            onClick={() => {
              alfFinalRevert(Number(data?.id), () => {
                toast('Final review reverted', 'success');
                navigate('/alf?filter%5Bstatus%5D=FinalReview&page=1&perPage=10#finalreview');
              });
            }}
          />
          <MenuIcon className="actionCloseIcon bg-[#F3E5F2]  rounded-[32px]" onClick={handleToggle} />
        </Box>
      )}
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
      {dialogType === 'restore' && <RecipientRestoreDialog data={data} open onClose={closeDialog} />}
      {dialogType === 'Organ Allocation' && <OrganAllocationDialog open onClose={closeDialog} />}
    </Box>
  );
};
export default ActionsCellRenderer;
