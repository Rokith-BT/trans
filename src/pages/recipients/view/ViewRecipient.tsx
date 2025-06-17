/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, MUIContainer } from '@/atoms';
import { useEffect, useState } from 'react';
import BasicDetails from '../add/section/BasicDetails';
import FamilyContact from '../add/section/FamilyContact';
import MedicalDetails from '../add/section/MedicalDetails';
import OrganRequested from '../add/section/OrganRequested';
import Attachments from '../add/section/Attachments';
import { ApproveIcon, DeclineIcon, DocumentDownload, PrintIcon } from '@/assets/icons';
import WaitingApprovalDialog from '@/pages/hospitals/add/sections/WaitingApprovalDialog';
import ApproveDialog from './ApproveDialog';
import DeclainDialog from './DeclainDialog';
import { useLocation, useNavigate, useParams } from 'react-router';
import { handleDownload, handlePrint } from '../pdf/PrintPDF';
import { useRecipient } from '../RecipientContext';
import {
  OrganRequestData,
  RecipientBasicDetailsType,
  RecipientFamilyContact,
  RecipientMedicalDetails
} from '@/types/recipient';
import { AttchmentType } from '../validators';
import { handleRecipientsData } from '@/utils/handleRecipientData';
import LoadingOverlay from '@/pages/components/LoadingOverlay';

const ViewRecipient = () => {
  const [waitingDialog, setWaitingDialog] = useState(false);
  const [approveDialog, setApproveDialog] = useState(false);
  const [declainDialog, setdeclainDialog] = useState(false);
  const [formData, setFormData] = useState<{
    basicDetails?: RecipientBasicDetailsType;
    familyContact?: RecipientFamilyContact;
    medicalDetails?: RecipientMedicalDetails;
    organsRequest?: OrganRequestData;
    attachments?: AttchmentType;
  }>({});
  const location = useLocation();
  const navigate = useNavigate();
  const { recipientId } = useParams();
  const { state } = location;
  console.log(recipientId, 'recipientId');
  const {
    state: { getRecipientById, loading },
    actions: { getRecipientDataByID, recipientPayment }
  } = useRecipient();
  console.log(getRecipientById, '343243245');

  useEffect(() => {
    if (recipientId) {
      getRecipientDataByID(Number(recipientId));
    }
  }, [recipientId]);
  useEffect(() => {
    if (getRecipientById) {
      handleStepperData(getRecipientById);
    }
  }, [getRecipientById]);
  const handleStepperData = async (getRecipientById: any) => {
    const { data, datafc, datamc, dataOrgan, fileDoc } = await handleRecipientsData(getRecipientById);
    await setFormData((Prev) => ({
      ...Prev,
      basicDetails: { ...Prev.basicDetails, ...data },
      familyContact: { ...Prev.familyContact, ...datafc },
      medicalDetails: { ...Prev.medicalDetails, ...datamc },
      organsRequest: { ...Prev.organsRequest, ...dataOrgan },
      attachments: { ...Prev.attachments, ...fileDoc }
    }));
  };
  const { basicDetails, familyContact, medicalDetails, organsRequest, attachments } = formData || {};
  useEffect(() => {
    setTimeout(() => {
      setWaitingDialog(false);
    }, 1500);
  }, []);
  console.log(basicDetails, 'basicDetails');

  const handlePrintPDF = async () => {
    await handlePrint(basicDetails, familyContact, medicalDetails, organsRequest);
  };
  const handleDownloadPDF = async () => {
    await handleDownload(basicDetails, familyContact, medicalDetails, organsRequest);
  };

  function makePayment() {
    if (recipientId) {
      recipientPayment(Number(recipientId));
      navigate('/recipients');
    }
  }

  return (
    <Box>
      <BasicDetails
        onNext={() => {}}
        isPreview={false}
        isPopupShow={false}
        BasicDetails={basicDetails}
        readOnly={true}
        isIndian={getRecipientById?.recipient?.isIndian}
        HospitalData={{
          hospitalID: getRecipientById?.recipient?.hospital?.id,
          hospitalName: getRecipientById?.recipient?.hospital?.name,
          hospitalType: getRecipientById?.recipient?.hospitalType?.name
        }}
        isApprove={state.isApproval}
      />
      <FamilyContact onNext={() => {}} isPreview={false} FamilyContact={familyContact} readOnly={true} />
      <MedicalDetails
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={false}
        MedicalDetails={medicalDetails}
        readOnly={true}
      />
      <OrganRequested
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={false}
        organsRequest={organsRequest}
        readOnly={true}
      />
      <Attachments
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={false}
        readOnly={true}
        attachmentDatas={attachments}
      />
      <MUIContainer maxWidth="xl">
        <Box className="mt-[40px] mb-[6%]">
          <Box className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-end items-center sm:items-stretch">
            <Button
              variant="outlined"
              className="w-full sm:w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
              onClick={handlePrintPDF}
            >
              <PrintIcon /> Print
            </Button>
            <Button
              variant="outlined"
              className="w-full sm:w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
              onClick={handleDownloadPDF}
            >
              <DocumentDownload /> Download
            </Button>
            {!state?.isUnpaid && !state.isApproval && (
              <Button
                variant="outlined"
                className="w-full sm:w-[164px] h-[44px] flex gap-2 border-[1px] !bg-[#D876A9] !text-[#F8F8FF]"
                onClick={makePayment}
              >
                Make Payment
              </Button>
            )}
            {state.isApproval && (
              <>
                <Button
                  variant="outlined"
                  className="w-full sm:w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323]"
                  onClick={() => setdeclainDialog(true)}
                >
                  <DeclineIcon /> Decline
                </Button>
                <Button
                  variant="contained"
                  className="w-full sm:w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
                  onClick={() => setApproveDialog(true)}
                >
                  <ApproveIcon /> Approve
                </Button>
              </>
            )}

            {/* {!state?.onlyView && !state?.isUnpaid ? (
              <>
                <Button
                  variant="outlined"
                  className="w-full sm:w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323]"
                  onClick={() => setdeclainDialog(true)}
                >
                  <DeclineIcon /> Decline
                </Button>
                <Button
                  variant="contained"
                  className="w-full sm:w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967]"
                  onClick={() => setApproveDialog(true)}
                >
                  <ApproveIcon /> Approve
                </Button>
              </>
            ) : !state?.isUnpaid ? (
              <Button
                variant="outlined"
                className="w-full sm:w-[164px] h-[44px] flex gap-2 border-[1px] !bg-[#D876A9] !text-[#F8F8FF]"
                onClick={makePayment}
              >
                Make Payment
              </Button>
            ) : null} */}
          </Box>
        </Box>
      </MUIContainer>

      <ApproveDialog
        open={approveDialog}
        recipientData={{ name: getRecipientById?.recipient?.name, recipientId: getRecipientById?.recipient?.id }}
        onClose={() => {
          setApproveDialog(false);
        }}
      />
      <DeclainDialog
        open={declainDialog}
        recipientData={{ name: getRecipientById?.recipient?.name, recipientId: getRecipientById?.recipient?.id }}
        onClose={() => {
          setdeclainDialog(false);
        }}
      />
      <WaitingApprovalDialog
        open={waitingDialog}
        onClose={() => {
          setWaitingDialog(false);
        }}
      />
      {loading && <LoadingOverlay isLoading={loading} />}
    </Box>
  );
};
export default ViewRecipient;
