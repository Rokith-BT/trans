/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@/atoms';
import DonorDetails from './DonorDetails';
import OrganConsented from './OrganConsented';
import MedicalDetails from './MedicalDetails';
import InjuriesDetails from './InjuriesDetails';
import ABGTestDetails from './ABGTestDetails';
import AttachmentDetails from './AttachmentDetails';
import { useNavigate } from 'react-router';
import DonorFooterButton from './DonorFooterButton';
import { pdf } from '@react-pdf/renderer';
import PreviewPDF from '../../pfd/PreviewPDF';
import { useDonor } from '../../DonorContext';
import { useEffect, useState } from 'react';
import { handleDonorsData } from '@/utils/handleDonorData';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Preview = ({ donarData, isPreview, onBack }: any) => {
  const [formData, setFormData] = useState({
    donorDetails: null,
    organConsent: null,
    medicalDetail: null,
    injuriesDetail: null,
    abgTest: null,
    attachmentDetail: null,
    preview: null
  });
  const navigate = useNavigate();
  const {
    state: { currentDonarId, getDonarDetails },
    action: { updateDonorStatus, getDonarDataByID }
  } = useDonor();
  useEffect(() => {
    if (currentDonarId) {
      getDonarDataByID(currentDonarId);
    }
  }, [currentDonarId]);
  useEffect(() => {
    if (getDonarDetails) {
      handleStepperData(getDonarDetails);
    }
  }, [getDonarDetails]);
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
  const handlePrintPdf = async () => {
    console.log(donarData, 'donarDatadonarData');
    const organGiven = donarData?.organConsent?.organConsent.filter(
      (e: { isConsentGiven: number }) => e.isConsentGiven === 1
    );
    const donarDetails = [
      {
        label: 'Donar Name',
        value: donarData?.donorDetails?.name
      },
      {
        label: 'DateofBirth',
        value: donarData?.donorDetails?.dateOfBirth
      },
      {
        label: 'Age',
        value: donarData?.donorDetails?.age
      },
      {
        label: 'Gender',
        value: donarData?.donorDetails?.gender?.name
      },
      {
        label: 'BloodGroup',
        value: donarData?.donorDetails?.bloodGroup?.name
      },
      {
        label: 'Height',
        value: donarData?.donorDetails?.height
      },
      {
        label: 'Weight',
        value: donarData?.donorDetails?.weight
      },
      {
        label: 'BMI',
        value: donarData?.donorDetails?.bmi
      },
      {
        label: 'MLC Case',
        value: donarData?.donorDetails?.isMlc === '1' ? 'Yes' : 'No'
      },
      {
        label: 'AR Case Number',
        value: donarData?.donorDetails?.arcaseNumber
      },
      {
        label: 'Select Consent',
        value: donarData?.donorDetails?.isConsentGiven === 1 ? 'Yes' : 'No'
      },
      {
        label: 'Donor Relationship',
        value: donarData?.donorDetails?.relationship?.name
      },
      {
        label: 'First Name',
        value: donarData?.donorDetails?.firstName
      },
      {
        label: 'Last Name',
        value: donarData?.donorDetails?.lastName
      },
      {
        label: 'Email',
        value: donarData?.donorDetails?.email
      },
      {
        label: 'Phone Number 1',
        value: donarData?.donorDetails?.countryCode1 + ' ' + donarData?.donorDetails?.phoneNumber1
      },
      {
        label: 'Phone Number 1',
        value: donarData?.donorDetails?.countryCode2 + ' ' + donarData?.donorDetails?.phoneNumber2
      }
    ];
    const organConsent = [
      ...organGiven.map((ee: { organId: any }) => ({
        label: ee.organId,
        value: 'Yes'
      }))
    ];
    const apnoeaDetails = donarData?.organConsent?.apnoeaTest?.map((ele: any) => [
      { label: 'Apnoea Date and Time', value: ele.datetime }
    ]);
    const injuriesDetail = [
      {
        label: 'Chest Injuries',
        value: donarData?.injuriesDetail?.isChestInjury === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Abdomen Injuries',
        value: donarData?.injuriesDetail?.isAbdomenInjury === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Notes',
        value: donarData?.injuriesDetail?.notes
      },
      // {
      //   label: 'CRP Given',
      //   value: donarData?.injuriesDetail?.isCPRGiven
      // },
      // {
      //   label: 'CPR File',
      //   value: donarData?.injuriesDetail?.cprFile
      // },
      {
        label: 'Hypotnesive Episodes',
        value: donarData?.injuriesDetail?.isHypotensiveEpisodes === '1' ? 'Yes' : 'No'
      },
      {
        label: 'On Ventilation',
        value: donarData?.injuriesDetail?.isOnVentilation === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Volume Control Ventilation',
        value: donarData?.injuriesDetail?.vcv
      },
      {
        label: 'Pressure Control Ventilation',
        value: donarData?.injuriesDetail?.pcv
      },
      {
        label: 'Fio',
        value: donarData?.injuriesDetail?.fio2
      },
      {
        label: 'Peep',
        value: donarData?.injuriesDetail?.peep
      },
      {
        label: 'Pip',
        value: donarData?.injuriesDetail?.pip
      },
      {
        label: 'TV',
        value: donarData?.injuriesDetail?.tv
      },
      {
        label: 'Respiratory Rate',
        value: donarData?.injuriesDetail?.respiratoryRate
      },
      {
        label: 'Presure Support',
        value: donarData?.injuriesDetail?.pressureSupport
      },
      {
        label: 'Others',
        value: donarData?.injuriesDetail?.others
      }
    ];
    const abgTest = [
      // {
      //   label: 'Test Report',
      //   value: donarData?.abgTest?.testReport
      // },

      {
        label: 'Steroids',
        value: donarData?.abgTest?.isSteroids === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Vasopressin',
        value: donarData?.abgTest?.isVasopressin === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Thyroxine',
        value: donarData?.abgTest?.isThyroxin === '1' ? 'Yes' : 'No'
      }
      // {
      //   label: 'Inotrope',
      //   value: donarData?.abgTest?.inotrope
      // }
    ];

    const fiodetails = donarData?.abgTest?.abgTestResult?.map((ele: any) => [{ label: 'Fio', value: ele.fio2 }]);
    const inotropes = donarData?.abgTest?.inotropeData?.map((ele: any) => [{ label: 'Inotrope', value: ele.inotrope }]);

    const blob = await pdf(
      <PreviewPDF
        donarDetails={donarDetails}
        apnoeaDetails={apnoeaDetails}
        organConsent={organConsent}
        injuriesDetail={injuriesDetail}
        abgTest={abgTest}
        fiodetails={fiodetails}
        inotropes={inotropes}
      />
    ).toBlob();
    const blobURL = URL.createObjectURL(blob);
    const printWindow = window.open(blobURL, '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      console.error('Failed to open the print window.');
    }
  };

  const handleDownload = async () => {
    const organGiven = donarData?.organConsent?.organConsent.filter(
      (e: { isConsentGiven: number }) => e.isConsentGiven === 1
    );
    const donarDetails = [
      {
        label: 'Donar Name',
        value: donarData?.donorDetails?.name
      },
      {
        label: 'DateofBirth',
        value: donarData?.donorDetails?.dateOfBirth
      },
      {
        label: 'Age',
        value: donarData?.donorDetails?.age
      },
      {
        label: 'Gender',
        value: donarData?.donorDetails?.gender?.name
      },
      {
        label: 'BloodGroup',
        value: donarData?.donorDetails?.bloodGroup?.name
      },
      {
        label: 'Height',
        value: donarData?.donorDetails?.height
      },
      {
        label: 'Weight',
        value: donarData?.donorDetails?.weight
      },
      {
        label: 'BMI',
        value: donarData?.donorDetails?.bmi
      },
      {
        label: 'MLC Case',
        value: donarData?.donorDetails?.isMlc === '1' ? 'Yes' : 'No'
      },
      {
        label: 'AR Case Number',
        value: donarData?.donorDetails?.arcaseNumber
      },
      {
        label: 'Select Consent',
        value: donarData?.donorDetails?.isConsentGiven === 1 ? 'Yes' : 'No'
      },
      {
        label: 'Donor Relationship',
        value: donarData?.donorDetails?.relationship?.name
      },
      {
        label: 'First Name',
        value: donarData?.donorDetails?.firstName
      },
      {
        label: 'Last Name',
        value: donarData?.donorDetails?.lastName
      },
      {
        label: 'Email',
        value: donarData?.donorDetails?.email
      },
      {
        label: 'Phone Number 1',
        value: donarData?.donorDetails?.countryCode1 + ' ' + donarData?.donorDetails?.phoneNumber1
      },
      {
        label: 'Phone Number 1',
        value: donarData?.donorDetails?.countryCode2 + ' ' + donarData?.donorDetails?.phoneNumber2
      }
    ];
    const organConsent = [
      ...organGiven.map((ee: { organId: any }) => ({
        label: ee.organId,
        value: 'Yes'
      }))
    ];
    const apnoeaDetails = donarData?.organConsent?.apnoeaTest?.map((ele: any) => [
      { label: 'Apnoea Date and Time', value: ele.datetime }
    ]);
    const injuriesDetail = [
      {
        label: 'Chest Injuries',
        value: donarData?.injuriesDetail?.isChestInjury === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Abdomen Injuries',
        value: donarData?.injuriesDetail?.isAbdomenInjury === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Notes',
        value: donarData?.injuriesDetail?.notes
      },
      // {
      //   label: 'CRP Given',
      //   value: donarData?.injuriesDetail?.isCPRGiven
      // },
      // {
      //   label: 'CPR File',
      //   value: donarData?.injuriesDetail?.cprFile
      // },
      {
        label: 'Hypotnesive Episodes',
        value: donarData?.injuriesDetail?.isHypotensiveEpisodes === '1' ? 'Yes' : 'No'
      },
      {
        label: 'On Ventilation',
        value: donarData?.injuriesDetail?.isOnVentilation === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Volume Control Ventilation',
        value: donarData?.injuriesDetail?.vcv
      },
      {
        label: 'Pressure Control Ventilation',
        value: donarData?.injuriesDetail?.pcv
      },
      {
        label: 'Fio',
        value: donarData?.injuriesDetail?.fio2
      },
      {
        label: 'Peep',
        value: donarData?.injuriesDetail?.peep
      },
      {
        label: 'Pip',
        value: donarData?.injuriesDetail?.pip
      },
      {
        label: 'TV',
        value: donarData?.injuriesDetail?.tv
      },
      {
        label: 'Respiratory Rate',
        value: donarData?.injuriesDetail?.respiratoryRate
      },
      {
        label: 'Presure Support',
        value: donarData?.injuriesDetail?.pressureSupport
      },
      {
        label: 'Others',
        value: donarData?.injuriesDetail?.others
      }
    ];
    const abgTest = [
      // {
      //   label: 'Test Report',
      //   value: donarData?.abgTest?.testReport
      // },

      {
        label: 'Steroids',
        value: donarData?.abgTest?.isSteroids === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Vasopressin',
        value: donarData?.abgTest?.isVasopressin === '1' ? 'Yes' : 'No'
      },
      {
        label: 'Thyroxine',
        value: donarData?.abgTest?.isThyroxin === '1' ? 'Yes' : 'No'
      }
      // {
      //   label: 'Inotrope',
      //   value: donarData?.abgTest?.inotrope
      // }
    ];

    const fiodetails = donarData?.abgTest?.abgTestResult?.map((ele: any) => [{ label: 'Fio', value: ele.fio2 }]);
    const inotropes = donarData?.abgTest?.inotropeData?.map((ele: any) => [{ label: 'Inotrope', value: ele.inotrope }]);
    const blob = await pdf(
      <PreviewPDF
        donarDetails={donarDetails}
        apnoeaDetails={apnoeaDetails}
        organConsent={organConsent}
        injuriesDetail={injuriesDetail}
        abgTest={abgTest}
        fiodetails={fiodetails}
        inotropes={inotropes}
        // attachmentDetail={attachmentDetail}
      />
    ).toBlob();
    const blobURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobURL;
    a.download = `${'donar'}_details.pdf`;
    a.click();
  };

  const onSubmit = () => {
    const payload = {
      donorId: currentDonarId,
      statusId: 2,
      reason: ''
    };
    updateDonorStatus(currentDonarId, payload, () => {
      navigate('/donors');
    });
  };
  return (
    <Box>
      <DonorDetails
        donorDetaildata={formData.donorDetails}
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={isPreview}
        readOnly={false}
        isConsentGiven={false}
        hospitalId={''}
      />
      <OrganConsented
        OrganConsentData={formData.organConsent}
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={isPreview}
      />
      <MedicalDetails
        medicaldetailData={formData.medicalDetail}
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={isPreview}
      />
      <InjuriesDetails
        injuriesDetailData={formData.injuriesDetail}
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={isPreview}
        readOnly={false}
      />
      <ABGTestDetails
        abgTestData={formData.abgTest}
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={isPreview}
        readOnly={false}
      />
      <AttachmentDetails
        attachmentDetailData={formData.attachmentDetail}
        onNext={function (): void {
          throw new Error('Function not implemented.');
        }}
        isPreview={isPreview}
        readOnly={false}
      />
      <>
        <DonorFooterButton
          onSubmit={onSubmit}
          onBack={() => onBack()}
          isFirstStep={false}
          isLastStep={true}
          handlePrintPdf={handlePrintPdf}
          handleDownload={handleDownload}
        />
      </>
    </Box>
  );
};

export default Preview;
