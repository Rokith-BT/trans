import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from '@/atoms';
import { ApproveIcon, DeclineIcon, DocumentDownload, PrintIcon } from '@/assets/icons';
import { useLocation } from 'react-router';
import AdminDetails from '../add/sections/AdminDetails';
import { useHospital } from '../hospitalContext';
import { AdminDetailsType, HospitalApprovedOrganType, HospitalInfraStructure } from '../add/validators';
import HospitalInfras from '../add/sections/HospitalInfras';
import ApprovedOrganDoc from '../add/sections/ApprovedOrganDoc';
import ApproveDialog from './ApproveDialog';
import DeclineDialog from './DeclineDialog';
// import PdfDocument from './pdf/PdfDocument';
import { pdf } from '@react-pdf/renderer'; // Import the pdf function
import HospitalDetailsPdf from './pdf/HospitalDetailsPdf';
import HospitalDetails from '../add/sections/HospitalDetails';
import WaitingApprovalDialog from '../add/sections/WaitingApprovalDialog';
import PaymentDetail from '../add/sections/PaymentDetail';
import { BasicDetails } from '@/types/hospital';
import { User } from '@/types/common.type';
import { useRole } from '@/hooks/useRole';
import './HospitalView.scss';

interface HospitalViewProps {
  isView?: boolean;
  forHospital?: boolean;
  forApproval?: boolean;
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const HospitalView: React.FC<HospitalViewProps> = ({ isView = true, forHospital = false, forApproval = false }) => {
  // const navigate = useNavigate();
  const { isSuperAdmin, status } = useRole();
  const location = useLocation();
  console.log('location', location);

  // const { id } = useParams();
  const { state } = useHospital();
  const { admin, basicDetails, hospital, infrastructure, organlicences } = state || {};
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [adminData, setAdminData] = useState<User>(admin);
  const [basicDetail, setBasicDetail] = useState<BasicDetails>(hospital?.basicDetails);
  const [hospitalInfra, setHospitalInfra] = useState<HospitalInfraStructure>();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [organLicenseData, setOrganLicenseData] = useState<HospitalApprovedOrganType>();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [openWaitingDialog, setOpenWaitingDialog] = useState(false);

  console.log('hospital object from hospital view', admin, hospital, hospital?.basicDetails);
  console.log('basicDetails from hospital view ', infrastructure);

  // const hospitalStatus = hospital?.basicDetails?.status;
  // const hospitalRejectedReason = hospital?.basicDetails?.reason;

  useEffect(() => {
    console.log('admin', hospital);

    const adminFormData: AdminDetailsType = {
      isIndian: admin?.isIndian || true,
      passportNumber: admin?.passportNumber || '',
      aadharNumber: admin?.aadharNumber || '',
      firstName: admin?.firstName || '',
      lastName: admin?.lastName || '',
      dateOfBirth: admin?.dateOfBirth || '',
      designationId: admin?.designation || null,
      genderId: admin?.gender?.id || 0,
      roleId: admin?.role?.id || 0,
      qualification: admin?.qualification || '',
      phoneNumber1: admin?.phoneNumber1 || '',
      countryCode1: admin?.countryCode1 || '',
      email: admin?.email || '',
      addressLine1: admin?.addressLine1 || '',
      addressLine2: admin?.addressLine2 || '',
      pincode: admin?.pincode || '',
      townVillage: admin?.townVillage || '',
      landmark: admin?.landmark || '',
      cityId: admin?.city?.id || 0,
      stateId: admin?.state?.id || 0,
      countryId: admin?.country?.id || 0
    };
    setAdminData(adminFormData);
    const basicDetails = {
      hospitalTypeId: hospital?.basicDetails?.hospitalType?.id ?? 0,
      hospitalName: hospital?.basicDetails?.hospitalName ?? '',
      email: hospital?.basicDetails?.email ?? '',
      zone: hospital?.basicDetails?.zone ?? '',
      websiteUrl: hospital?.basicDetails?.websiteUrl ?? '',
      pincode: hospital?.basicDetails?.pincode ?? '',
      addressLine1: hospital?.basicDetails?.addressLine1 ?? '',
      addressLine2: hospital?.basicDetails?.addressLine2 ?? '',
      phoneNumber2: hospital?.basicDetails?.phoneNumber2 ?? '',
      countryCode1: hospital?.basicDetails?.countryCode1 ?? '',
      countryCode2: hospital?.basicDetails?.countryCode2 ?? '',
      phoneNumber1: hospital?.basicDetails?.phoneNumber1 ?? '',
      townVillage: hospital?.basicDetails?.townVillage ?? '',
      yearOfEstablishment: hospital?.basicDetails?.yearOfEstablishment ?? '',
      landmark: hospital?.basicDetails?.landmark ?? '',
      city: hospital?.basicDetails?.city ?? '',
      state: hospital?.basicDetails?.state ?? '',
      country: hospital?.basicDetails?.country ?? ''
    };
    setBasicDetail(basicDetails);
    const infraData = {
      numberOfBeds: hospital?.infrastructure?.numberOfBeds || 0,
      isTraumaUnitAvailable: hospital?.infrastructure?.isTraumaUnitAvailable ?? false,
      isMedicalCollegeAttached: hospital?.infrastructure?.isMedicalCollegeAttached ?? true,
      firstOrganLicenceRegDate: hospital?.infrastructure?.firstOrganLicenceRegDate ?? '',
      isIsoOrNabhAccredited: hospital?.infrastructure?.isIsoOrNabhAccredited ?? true,
      isRegistredClinicalEstablishmentAct: hospital?.infrastructure?.isRegistredClinicalEstablishmentAct ?? true,
      departments: hospital?.infrastructure?.departments || [],
      clinicalEstablishmentCertificate: hospital?.infrastructure?.clinicalEstablishmentCertificate ?? null,
      nabhCertificate: hospital?.infrastructure?.nabhCertificate ?? null
    };
    setHospitalInfra(infraData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const organViewData = hospital?.organLicences.map((license: any) => {
      return {
        dmsLicenseDoc: license?.dmsLicenseDoc || new File([], ''),
        firstLevelOrganLicenceRegDate: license?.firstLevelOrganLicenceRegDate || '',
        licenceExpiryDate: license?.licenceExpiryDate || '',
        organLicenceNumber: license?.organLicenceNumber || '',
        paymentReceiptNumber: license?.paymentReceiptNumber || '',
        organId: license?.organ?.id ?? null,
        organ: {
          id: license?.organ?.id ?? null,
          name: license?.organ?.name ?? ''
        }
      };
    });
    console.log('organ view data in ', organViewData);

    setOrganLicenseData(organViewData);
  }, [admin, basicDetails, infrastructure, organlicences, hospital]);
  console.log('console from hospital view');
  console.log('organ data from view useeffect ', hospital?.organLicences);
  console.log('organlicensedata ', organLicenseData);

  // const handleNavigate = () => {
  //   if (forApproval) {
  //     navigate('/approvals');
  //   } else {
  //     navigate('/hospitals');
  //   }
  // };
  // for showing waiting dialog
  useEffect(() => {
    if (!isSuperAdmin && status === 'PendingApproval') {
      setOpenWaitingDialog(true);
    }
  }, [forHospital]);

  //for pdf print

  const handlePrint = async () => {
    if (!basicDetail) {
      console.error('No basic details available for the PDF.');
      return;
    }
    const blob = await pdf(
      <HospitalDetailsPdf
        BasicDetails={hospital?.basicDetails}
        HospitalInfra={hospitalInfra}
        OrganLicense={hospital?.organLicences}
      />
    ).toBlob(); // Generate Blob from PDF
    const blobURL = URL.createObjectURL(blob);
    const printWindow = window.open(blobURL, '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      console.error('Failed to open the print window.');
    }
  };
  //for download
  const handleDownload = async () => {
    if (!basicDetail) {
      console.error('No basic details available for the PDF.');
      return;
    }

    try {
      const blob = await pdf(
        <HospitalDetailsPdf
          BasicDetails={basicDetail}
          HospitalInfra={hospitalInfra}
          OrganLicense={hospital?.organLicences}
        />
      ).toBlob(); // Generate Blob from PDF

      const blobURL = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = `${basicDetail.hospitalName || 'HospitalDetails'}.pdf`; // Set the file name
      a.click();

      // Clean up the blob URL
      URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error('Error generating or downloading the PDF:', error);
    }
  };
  const hospitalType = hospital?.basicDetails?.hospitalType?.name;

  return (
    <Box px={5} className={`${isSuperAdmin ? 'my-[29px]' : ''}`}>
      <Box className="flex justify-between items-center mb-4">
        {forHospital && (
          <Text className="flex !ml-[-18px] items-center !text-[19px] text-[#C967A2] !font-[700] ">
            {/* <BackIconPink className="cursor-pointer scale-150" onClick={handleNavigate} /> */}
            Hospital Name : {hospital?.basicDetails?.hospitalName}
          </Text>
        )}
        {!isSuperAdmin && status !== 'Active' && (
          <Text className="flex gap-4 items-center !text-[19px] text-[#C967A2] !font-[700] ">
            Hospital Name : {hospital?.basicDetails?.hospitalName}
          </Text>
        )}
        {/* {!isView && (
          <EditIcon
            className="cursor-pointer"
            onClick={() => {
              {
                navigate(`/hospitals/${id}/edit`, { state: { isTranstanAdmin: true } });
              }
            }}
          />
        )} */}
      </Box>
      <Box>
        <AdminDetails onNext={() => {}} reCheck={false} adminData={admin} readOnly={true} />
        <HospitalDetails onNext={() => {}} reCheck={false} detailsData={hospital?.basicDetails} readOnly={true} />
        <HospitalInfras onNext={() => {}} reCheck={false} infraData={hospitalInfra} readOnly={true} />
        <ApprovedOrganDoc onNext={() => {}} reCheck={false} organData={organLicenseData} readOnly={true} />
        {hospitalType?.toLowerCase() === 'private' && (
          <PaymentDetail reCheck={false} payData={organLicenseData} onNext={() => {}} isView={true} />
        )}
      </Box>
      <Box className="preview-footer-button">
        <Button
          variant="outlined"
          className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px]"
          onClick={handlePrint}
        >
          <PrintIcon /> Print
        </Button>
        <Button
          variant="outlined"
          className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
          onClick={handleDownload}
        >
          <DocumentDownload /> Download
        </Button>

        {forApproval && (
          <Button
            variant="outlined"
            className="sm:w-[164px] w-[100px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] "
            onClick={() => setOpenDeclineDialog(true)}
          >
            <DeclineIcon /> Decline
          </Button>
        )}
        {forApproval && (
          <Button
            variant="contained"
            className="sm:w-[164px] w-[100px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
            onClick={() => setOpenApproveDialog(true)}
          >
            <ApproveIcon /> Approve
          </Button>
        )}
      </Box>

      <ApproveDialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} data={hospital} />
      <DeclineDialog open={openDeclineDialog} onClose={() => setOpenDeclineDialog(false)} data={hospital} />
      <WaitingApprovalDialog
        open={openWaitingDialog}
        onClose={() => {
          setOpenWaitingDialog(false);
        }}
      />
    </Box>
  );
};

export default HospitalView;
