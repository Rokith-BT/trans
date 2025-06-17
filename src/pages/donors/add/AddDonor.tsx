// eslint-disable prefer-const
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { SetStateAction, useEffect, useState } from 'react';
import DonorDetails from './section/DonorDetails';
import { Box, Widget2 } from '@/atoms';
import OrganConsented from './section/OrganConsented';
import MedicalDetails from './section/MedicalDetails';
import InjuriesDetails from './section/InjuriesDetails';
import ABGTestDetails from './section/ABGTestDetails';
import AttachmentDetails from './section/AttachmentDetails';
import { useLocation, useNavigate, useParams } from 'react-router';
import { toast } from '@/utils/toast';
import Preview from './section/Preview';
import { useDonor } from '../DonorContext';
import { handleDonorsData } from '@/utils/handleDonorData';
import { useWindowType } from '@/hooks/useWindowType';

enum Tabs {
  DonorDetails,
  OrganConsented,
  MedicalDetails,
  InjuriesDetails,
  ABGTestDetails,
  Attachments,
  Preview
}

const AddDonor = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { donorId } = useParams();
  const { isMobile } = useWindowType();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState({
    donorDetails: null,
    organConsent: null,
    medicalDetail: null,
    injuriesDetail: null,
    abgTest: null,
    attachmentDetail: null,
    preview: null
  });
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.DonorDetails);
  const [isDonorEditId, setIsDonarEditId] = useState(0);
  const {
    action: { getDonarDataByID },
    state: { getDonarDetails }
  } = useDonor();
  console.log(getDonarDetails, 'getDonarDetailsgetDonarDetails');

  useEffect(() => {
    const id = donorId || isDonorEditId;
    if (id) {
      getDonarDataByID(Number(id));
    } else {
      console.log('Afcascfscaszcfzdsvfdsvdsvdsfcdscdscfdsfcdsfddfdfsszdsdszfzsf');
      getDonarDataByID(0);
    }
  }, [state.isAddNew, donorId, isDonorEditId]);

  useEffect(() => {
    if (getDonarDetails || donorId) {
      handleStepperData(getDonarDetails);
    }
  }, [getDonarDetails, donorId]);
  const handleStepperData = async (donorDatas: any) => {
    const { donorandConsent, organConsentsDatas, medicalDetails, medicalInjuryData, abgTestes } =
      await handleDonorsData(donorDatas);
    console.log(donorandConsent, 'donorandConsent', organConsentsDatas);
    setFormData((Prev: any) => ({
      ...Prev,
      donorDetails: { ...Prev.donorDetails, ...donorandConsent },
      organConsent: { ...Prev.organConsent, ...organConsentsDatas },
      medicalDetail: { ...Prev.medicalDetail, ...medicalDetails },
      injuriesDetail: { ...Prev.injuriesDetail, ...medicalInjuryData },
      abgTest: { ...Prev.abgTest, ...abgTestes },
      attachmentDetail: { ...Prev.attachmentDetail, ...donorDatas?.attachments }
    }));
  };
  console.log(formData?.donorDetails, 'wefefcdefefewfedfed');

  const handleNextforDonorDetails = (data: any) => {
    setFormData((Prev: any) => ({
      ...Prev,
      donorDetails: { ...Prev.donorDetails, ...data }
    }));
    setActiveTab(Tabs.OrganConsented);
  };
  const handleNextforOrganConsent = (data: any) => {
    setFormData((Prev: any) => ({
      ...Prev,
      organConsent: { ...Prev.organConsent, ...data }
    }));
    setActiveTab(Tabs.MedicalDetails);
  };
  const handleNextforMedicalDetails = (data: any) => {
    setFormData((Prev: any) => ({
      ...Prev,
      medicalDetail: { ...Prev.medicalDetail, ...data }
    }));
    setActiveTab(Tabs.InjuriesDetails);
  };
  const handleNextforInjusriesDetails = (data: any) => {
    setFormData((Prev: any) => ({
      ...Prev,
      injuriesDetail: { ...Prev.injuriesDetail, ...data }
    }));
    setActiveTab(Tabs.ABGTestDetails);
  };
  const handleNextforABGTestDetails = (data: any) => {
    setFormData((Prev: any) => ({
      ...Prev,
      abgTest: { ...Prev.abgTest, ...data }
    }));
    setActiveTab(Tabs.Attachments);
  };
  const handleAttachmentSubmit = (data: any) => {
    setFormData((Prev: any) => ({
      ...Prev,
      preview: { ...Prev.preview, ...data }
    }));
    setActiveTab(Tabs.Preview);
  };
  const handleNextPreview = () => {
    toast('Donor details added was successfully', 'success');
    navigate('/donors');
  };

  // const handleBack = (donorId: number) => {
  //   console.log(donorId, 'donorId1');

  //   if (activeTab > 0) {
  //     getDonarDataByID(donorId);
  //     setIsDonarEditId(donorId);
  //     setActiveTab(activeTab - 1);
  //   }
  //   if (activeTab === 0) {
  //     navigate('/donors');
  //   }
  // };

  const steps = [
    { number: 1, text: 'Donor Details' },
    { number: 2, text: 'Organ Consented' },
    { number: 3, text: 'Medical Details' },
    { number: 4, text: 'Injuries Details' },
    { number: 5, text: 'ABG Test Details' },
    { number: 6, text: 'Attachment Details' },
    { number: 7, text: 'Preview' }
  ];

  return (
    <Box className="relative">
      <Box className="absolute -top-0 right-0 w-[100%]">
        {!isMobile && <Widget2 activeTab={activeTab} steps={steps} />}
      </Box>

      <Box pt={12}>
        {activeTab === Tabs.DonorDetails && (
          <DonorDetails
            donorDetaildata={formData?.donorDetails}
            onNext={handleNextforDonorDetails}
            isPreview={false}
            readOnly={false}
            isConsentGiven={state.isConsentGiven}
            hospitalId={state.hospitalId}
          />
        )}
        {activeTab === Tabs.OrganConsented && (
          <OrganConsented
            OrganConsentData={formData?.organConsent}
            onNext={handleNextforOrganConsent}
            onBack={(donorId: SetStateAction<any>) => {
              getDonarDataByID(donorId);
              setIsDonarEditId(donorId);
              setActiveTab(Tabs.DonorDetails);
            }}
            readOnly={false}
          />
        )}
        {activeTab === Tabs.MedicalDetails && (
          <MedicalDetails
            medicaldetailData={formData?.medicalDetail}
            onNext={handleNextforMedicalDetails}
            onBack={(donorId: SetStateAction<any>) => {
              getDonarDataByID(donorId);
              setIsDonarEditId(donorId);
              setActiveTab(Tabs.OrganConsented);
            }}
          />
        )}
        {activeTab === Tabs.InjuriesDetails && (
          <InjuriesDetails
            injuriesDetailData={formData?.injuriesDetail}
            onNext={handleNextforInjusriesDetails}
            onBack={(donorId: SetStateAction<any>) => {
              getDonarDataByID(donorId);
              setIsDonarEditId(donorId);
              setActiveTab(Tabs.MedicalDetails);
            }}
            readOnly={false}
          />
        )}
        {activeTab === Tabs.ABGTestDetails && (
          <ABGTestDetails
            abgTestData={formData?.abgTest}
            onNext={handleNextforABGTestDetails}
            onBack={(donorId: SetStateAction<any>) => {
              getDonarDataByID(donorId);
              setIsDonarEditId(donorId);
              setActiveTab(Tabs.InjuriesDetails);
            }}
            readOnly={false}
          />
        )}
        {activeTab === Tabs.Attachments && (
          <AttachmentDetails
            attachmentDetailData={formData?.attachmentDetail}
            onNext={handleAttachmentSubmit}
            onBack={(donorId: SetStateAction<any>) => {
              getDonarDataByID(donorId);
              setIsDonarEditId(donorId);
              setActiveTab(Tabs.ABGTestDetails);
            }}
            isPreview={false}
            readOnly={false}
          />
        )}
        {activeTab === Tabs.Preview && (
          <Preview
            isPreview={true}
            donarData={formData}
            onNext={handleNextPreview}
            onBack={(donorId: SetStateAction<any>) => {
              getDonarDataByID(donorId);
              setIsDonarEditId(donorId);
              setActiveTab(Tabs.Attachments);
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AddDonor;
