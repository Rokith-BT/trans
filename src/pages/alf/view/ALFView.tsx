/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@/atoms';
import { useEffect, useState } from 'react';
import BasicDetails from '../../recipients/add/section/BasicDetails';
import FamilyContact from '../../recipients/add/section/FamilyContact';
import MedicalDetails from '../../recipients/add/section/MedicalDetails';
import OrganRequested from '../../recipients/add/section/OrganRequested';
import Attachments from '../../recipients/add/section/Attachments';
import { DocumentDownload, PrintIcon } from '@/assets/icons';
import { useLocation, useParams } from 'react-router';
import { handleDownload, handlePrint } from '../../recipients/pdf/PrintPDF';

import {
  OrganRequestData,
  RecipientBasicDetailsType,
  RecipientFamilyContact,
  RecipientMedicalDetails
} from '@/types/recipient';
import { AttchmentType } from '../../recipients/validators';
import { useRecipient } from '@/pages/recipients/RecipientContext';
import { handleRecipientsData } from '@/utils/handleRecipientData';
// import LoadingSmall from '@/pages/components/LoadingSmall';
import LoadingOverlay from '@/pages/components/LoadingOverlay';

const ALFView = () => {
  const [formData, setFormData] = useState<{
    basicDetails?: RecipientBasicDetailsType;
    familyContact?: RecipientFamilyContact;
    medicalDetails?: RecipientMedicalDetails;
    organsRequest?: OrganRequestData;
    attachments?: AttchmentType;
  }>({});
  const location = useLocation();
  const { recipientId } = useParams();
  console.log(recipientId, 'recipientId1212121212121212', location?.state?.isApprove, location?.state?.alfID);
  const {
    state: { getRecipientById, loading },
    actions: { getRecipientDataByID }
  } = useRecipient();

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

  const handlePrintPDF = async () => {
    await handlePrint(basicDetails, familyContact, medicalDetails, organsRequest);
  };
  const handleDownloadPDF = async () => {
    await handleDownload(basicDetails, familyContact, medicalDetails, organsRequest);
  };

  return (
    <Box>
      <BasicDetails
        onNext={() => {}}
        isPreview={false}
        isPopupShow={false}
        BasicDetails={basicDetails}
        organsRequest={organsRequest}
        readOnly={true}
        isIndian={getRecipientById?.recipient?.isIndian}
        HospitalData={{
          hospitalID: getRecipientById?.recipient?.hospital?.id,
          hospitalName: getRecipientById?.recipient?.hospital?.name,
          hospitalType: getRecipientById?.recipient?.hospitalType?.name
        }}
        alfDetails={{
          alf: true,
          view: location?.state?.onlyView,
          isApprove: location?.state?.isApprove,
          isALFReview: location?.state?.isAlfReview,
          alfID: location?.state?.alfID,
          isDeleteEnable: location?.state?.isDeleteEnable
        }}
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
      </Box>
      {loading && <LoadingOverlay isLoading={loading} />}
    </Box>
  );
};
export default ALFView;
