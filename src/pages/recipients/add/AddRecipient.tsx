// eslint-disable prefer-const
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { Box, Widget2 } from '@/atoms';
import { SetStateAction, useEffect, useState } from 'react';
import BasicDetails from './section/BasicDetails';
import FamilyContact from './section/FamilyContact';
import MedicalDetails from './section/MedicalDetails';
import OrganRequested from './section/OrganRequested';
import Attachments from './section/Attachments';
import Preview from './section/Preview';
import Payment from './section/PaymnetDetails';
// import { useAuth } from '@/routes';
import { useLocation, useParams } from 'react-router';
import { AttchmentType } from '../validators';
import {
  RecipientBasicDetailsType,
  RecipientMedicalDetails,
  RecipientFamilyContact,
  OrganRequestData
} from '@/types/recipient';
import { useRecipient } from '../RecipientContext';
import { handleRecipientsData } from '@/utils/handleRecipientData';
import { useWindowType } from '@/hooks/useWindowType';

enum Tabs {
  BasicDetails,
  FamilyContact,
  MedicalDetails,
  OrganRequested,
  Attachments,
  Preview,
  PaymnetDetails
}
const AddRecipient = () => {
  const location = useLocation();
  const { recipientId } = useParams();
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.BasicDetails);
  const [isRecipientEditId, setIsRecipietEditId] = useState(0);
  const { isMobile } = useWindowType();
  const { state } = location;
  

  const hospitalData = {
    hospitalID: state.hospitalID,
    hospitalName: state.hospitalName,
    hospitalType: state?.hospitalType
  };

  const {
    actions: { getRecipientDataByID },
    state: { getRecipientById }
  } = useRecipient();

  useEffect(() => {
    const id = recipientId || isRecipientEditId;
    if (id) {
      getRecipientDataByID(Number(id));
    } else {
      getRecipientDataByID(0);
    }
  }, [state.isAddNew, recipientId, isRecipientEditId]);

  const [formData, setFormData] = useState<{
    basicDetails?: RecipientBasicDetailsType;
    familyContact?: RecipientFamilyContact;
    medicalDetails?: RecipientMedicalDetails;
    organsRequest?: OrganRequestData;
    attachments?: AttchmentType;
  }>({});
  const steps = [
    { number: 1, text: 'Basic Details' },
    { number: 2, text: 'Family Contact' },
    { number: 3, text: 'Medical Details' },
    { number: 4, text: 'Organ Requested' },
    { number: 5, text: 'Attachments' },
    { number: 6, text: 'Preview' }
  ];
  if (
    formData?.basicDetails?.hospitalType?.name?.toLowerCase() === 'private' ||
    state?.hospitalType?.toLowerCase() === 'private'
  ) {
    steps.push({ number: 7, text: 'Payment Details' });
  }

  useEffect(() => {
    if (getRecipientById && recipientId) {
      handleStepperData(getRecipientById);
    }
  }, [getRecipientById, recipientId]);
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
  const handleNextFromBasic = (data: RecipientBasicDetailsType) => {
    const filterData = {
      ...data,
      isIndian: state.nationality === 'indian' ? true : false,
      hospitalName: location.state?.hospitalName
    };
    setFormData((Prev) => ({
      ...Prev,
      basicDetails: { ...Prev?.basicDetails, ...filterData }
    }));
    setActiveTab(Tabs.FamilyContact);
  };

  const handleNextFromFamilyCont = (data: RecipientFamilyContact) => {
    const filterData = {
      ...data
    };
    setFormData((Prev) => ({
      ...Prev,
      familyContact: { ...Prev?.familyContact, ...filterData }
    }));
    setActiveTab(Tabs.MedicalDetails);
  };

  const handleNextFromMedicalDetails = (data: RecipientMedicalDetails) => {
    const filterData = {
      ...data
    };
    setFormData((Prev) => ({
      ...Prev,
      medicalDetails: { ...Prev?.medicalDetails, ...filterData }
    }));
    setActiveTab(Tabs.OrganRequested);
  };

  const handleNextFromOrganReq = (data: OrganRequestData) => {
    const filterData = {
      ...data
    };
    setFormData((Prev) => ({
      ...Prev,
      organsRequest: { ...Prev?.organsRequest, ...filterData }
    }));
    setActiveTab(Tabs.Attachments);
  };

  const handleNextFromAttachment = (data: AttchmentType) => {
    const filterData = {
      ...data
    };
    setFormData((Prev) => ({
      ...Prev,
      attachments: { ...Prev?.attachments, ...filterData }
    }));
    setActiveTab(Tabs.Preview);
  };
  return (
    <Box>
      <Box className="mb-[50px]">{!isMobile && <Widget2 activeTab={activeTab} steps={steps} />}</Box>
      <Box>
        {activeTab === Tabs.BasicDetails && (
          <BasicDetails
            onNext={handleNextFromBasic}
            readOnly={false}
            isPreview={true}
            forCancel={true}
            isPopupShow={true}
            BasicDetails={formData.basicDetails}
            isIndian={
              !recipientId ? (state.nationality === 'indian' ? true : false) : getRecipientById?.recipient?.isIndian
            }
            HospitalData={hospitalData}
          />
        )}
        {activeTab === Tabs.FamilyContact && (
          <FamilyContact
            onNext={handleNextFromFamilyCont}
            onBack={(recipientID: SetStateAction<any>) => {
              getRecipientDataByID(recipientID);
              setIsRecipietEditId(recipientID);
              setActiveTab(Tabs.BasicDetails);
            }}
            isPreview={true}
            FamilyContact={formData.familyContact}
          />
        )}
        {activeTab === Tabs.MedicalDetails && (
          <MedicalDetails
            onNext={handleNextFromMedicalDetails}
            onBack={(recipientID: SetStateAction<any>) => {
              getRecipientDataByID(recipientID);
              setIsRecipietEditId(recipientID);
              setActiveTab(Tabs.FamilyContact);
            }}
            isPreview={true}
            MedicalDetails={formData.medicalDetails}
          />
        )}
        {activeTab === Tabs.OrganRequested && (
          <OrganRequested
            onNext={handleNextFromOrganReq}
            onBack={(recipientID: SetStateAction<any>) => {
              getRecipientDataByID(recipientID);
              setIsRecipietEditId(recipientID);
              setActiveTab(Tabs.MedicalDetails);
            }}
            isPreview={true}
            organsRequest={formData.organsRequest}
            HospitalData={hospitalData}
          />
        )}
        {activeTab === Tabs.Attachments && (
          <Attachments
            onNext={handleNextFromAttachment}
            onBack={(recipientID: SetStateAction<any>) => {
              getRecipientDataByID(recipientID);
              setIsRecipietEditId(recipientID);
              setActiveTab(Tabs.OrganRequested);
            }}
            isPreview={true}
            attachmentDatas={formData.attachments}
          />
        )}
        {activeTab === Tabs.Preview && (
          <Preview
            onNext={() => setActiveTab(Tabs.PaymnetDetails)}
            onBack={() => setActiveTab(Tabs.Attachments)}
            isPreview={true}
          />
        )}
        {formData?.basicDetails?.hospitalType?.name?.toLowerCase() == 'private' && (
          <>
            {activeTab === Tabs.PaymnetDetails && (
              <Payment
                onNext={() => setActiveTab(Tabs.BasicDetails)}
                onBack={() => setActiveTab(Tabs.Preview)}
                isPreview={true}
                isPaymentDone={formData?.basicDetails?.isPaymentCompleted}
                recipientStatus={state.currStatus}
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default AddRecipient;
