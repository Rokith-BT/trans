/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@/atoms';
import { useEffect, useState } from 'react';
import BasicDetails from '../../recipients/add/section/BasicDetails';
import FamilyContact from '../../recipients/add/section/FamilyContact';
import MedicalDetails from '../../recipients/add/section/MedicalDetails';
import OrganRequested from '../../recipients/add/section/OrganRequested';
import Attachments from '../../recipients/add/section/Attachments';
import { DocumentDownload, PrintIcon } from '@/assets/icons';
import { useParams } from 'react-router';
import { handleDownload, handlePrint } from '../../recipients/pdf/PrintPDF';
import { useRecipient } from '../../recipients/RecipientContext';
import {
  OrganRequestData,
  RecipientBasicDetailsType,
  RecipientFamilyContact,
  RecipientMedicalDetails
} from '@/types/recipient';
import { AttchmentType } from '../../recipients/validators';
import { handleRecipientsData } from '@/utils/handleRecipientData';

const ADDALFDetails = () => {
  const [formData, setFormData] = useState<{
    basicDetails?: RecipientBasicDetailsType;
    familyContact?: RecipientFamilyContact;
    medicalDetails?: RecipientMedicalDetails;
    organsRequest?: OrganRequestData;
    attachments?: AttchmentType;
  }>({});
  const { recipientId } = useParams();

  console.log(recipientId, 'recipientId');
  const {
    state: { getRecipientById },
    actions: { getRecipientDataByID }
  } = useRecipient();

  useEffect(() => {
    if (recipientId) {
      getRecipientDataByID(Number(recipientId));
    }
  }, [recipientId]);
  console.log(getRecipientById, '343243245');
  useEffect(() => {
    if (getRecipientById) {
      handleStepperData(getRecipientById);
    }
  }, [getRecipientById]);
  const { basicDetails, familyContact, medicalDetails, organsRequest, attachments } = formData || {};
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

  const handlePrintPDF = async () => {
    await handlePrint(basicDetails, familyContact, medicalDetails, organsRequest);
  };
  const handleDownloadPDF = async () => {
    await handleDownload(basicDetails, familyContact, medicalDetails, organsRequest);
  };

  return (
    <Box px={5}>
      <BasicDetails
        onNext={() => {}}
        isPreview={false}
        isPopupShow={false}
        BasicDetails={basicDetails}
        readOnly={true}
        isIndian={getRecipientById?.recipient?.isIndian}
        HospitalData={{
          hospitalID: getRecipientById?.recipient?.hospital?.id,
          hospitalName: getRecipientById?.recipient?.hospital?.name
        }}
        alfDetails={{ alf: true, organDetails: organsRequest?.organReq?.filter((e) => e.organId === '4') }}
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
      <Box className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
        <Button
          variant="outlined"
          className="w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
          onClick={handlePrintPDF}
        >
          <PrintIcon /> Print
        </Button>
        <Button
          variant="outlined"
          className="w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
          onClick={handleDownloadPDF}
        >
          <DocumentDownload /> Download
        </Button>
        {/* {!state?.onlyView && (
          <>
            <Button
              variant="outlined"
              className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323]"
              onClick={() => setdeclainDialog(true)}
            >
              <DeclineIcon /> Decline
            </Button>
            <Button
              variant="contained"
              className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
              onClick={() => setApproveDialog(true)}
            >
              <ApproveIcon /> Approve
            </Button>
          </>
        )} */}
      </Box>

      {/* <ApproveDialog
        open={approveDialog}
        recipientData={{ name: getRecipientById.recipient?.name, recipientId: getRecipientById.recipient?.id }}
        onClose={() => {
          setApproveDialog(false);
        }}
      />
      <DeclainDialog
        open={declainDialog}
        recipientData={{ name: getRecipientById.recipient?.name, recipientId: getRecipientById.recipient?.id }}
        onClose={() => {
          setdeclainDialog(false);
        }}
      />
      <WaitingApprovalDialog
        open={waitingDialog}
        onClose={() => {
          setWaitingDialog(false);
        }}
      /> */}
    </Box>
  );
};
export default ADDALFDetails;
