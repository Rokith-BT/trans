/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router';
import BasicDetails from './BasicDetails';
import FamilyContact from './FamilyContact';
import MedicalDetails from './MedicalDetails';
import OrganRequested from './OrganRequested';
import Attachments from './Attachments';

import { useNavigate } from 'react-router';
import { handleDownload, handlePrint } from '../../pdf/PrintPDF';

import {
  OrganRequestData,
  RecipientBasicDetailsType,
  RecipientFamilyContact,
  RecipientMedicalDetails
} from '@/types/recipient';
import { AttchmentType } from '../../validators';
import { useRecipient } from '../../RecipientContext';
import { Checkbox } from '@mui/material';
import RecipientFooter from './RecipientFooter';
import { handleRecipientsData } from '@/utils/handleRecipientData';
interface PreviewProps {
  readOnly?: boolean;
  onNext: () => void;
  onBack?: () => void;
  isPreview: boolean;
  forCancel?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ onNext, onBack, isPreview, forCancel }) => {
  const navigate = useNavigate();
  const [isDeclare, setIsDeclare] = useState(false);

  const [formData, setFormData] = useState<{
    basicDetails?: RecipientBasicDetailsType;
    familyContact?: RecipientFamilyContact;
    medicalDetails?: RecipientMedicalDetails;
    organsRequest?: OrganRequestData;
    attachments?: AttchmentType;
  }>({});

  const {
    state: { getRecipientById, currentRecipientID },
    actions: { getRecipientDataByID, recipientDraft }
  } = useRecipient();
  console.log(getRecipientById, '343243245');

  useEffect(() => {
    if (currentRecipientID) {
      getRecipientDataByID(currentRecipientID);
    }
  }, [currentRecipientID]);
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

  const submitDraft = () => {
    recipientDraft(currentRecipientID, currentRecipientID);
    navigate('/recipients');
  };
  return (
    <Box >
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
        readOnly={true}
        isPreview={false}
        attachmentDatas={attachments}
      />
      <div className="mt-10">
        <Text className="!text-xl !font-bold text-[#804595] !ml-1 !mt-4">Declare</Text>
        <Box mt={2} className="flex items-center">
          <Checkbox onClick={() => setIsDeclare(!isDeclare)} /> &nbsp;
          <Text>
            I accept all the <span className="text-[#C967A2] underline">Terms & Conditions</span>
          </Text>
        </Box>
      </div>
      {isPreview && (
        <RecipientFooter
          submitDraft={submitDraft}
          isPrivateHos={getRecipientById?.recipient?.hospitalType?.name?.toLowerCase() === 'private'}
          onBack={onBack}
          onNext={onNext}
          forCancel={forCancel}
          isFinalStep={true}
          handlePrint={handlePrintPDF}
          handleDownload={handleDownloadPDF}
          isDeclare={isDeclare}
          isPaymentDone={formData?.basicDetails?.isPaymentCompleted}
        />
      )}
    </Box>
  );
};
export default Preview;
