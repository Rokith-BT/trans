import { Box, Button, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import NtorcHospital from '../add/sections/NtorcHospital';
import { ApproveIcon, DeclineIcon, DocumentDownload, PrintIcon } from '@/assets/icons';
import ApproveDialog from './ApproveDialog';
import DeclineDialog from './DeclineDialog';
import { useHospital } from '../hospitalContext';
// import { useNavigate } from 'react-router';
import AdminDetails from '../add/sections/AdminDetails';
import ApprovedOrganDoc from '../add/sections/ApprovedOrganDoc';
import WaitingApprovalDialog from '../add/sections/WaitingApprovalDialog';
import HospitalDetailsPdf from './pdf/HospitalDetailsPdf';
import { pdf } from '@react-pdf/renderer';
import { useAuth } from '@/routes';
interface NtorcViewProps {
  isView: boolean;
  forHospital?: boolean;
}
const NtorcView: React.FC<NtorcViewProps> = ({ isView = true, forHospital = false }) => {
  // const navigate = useNavigate();
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openDeclineDialog, setOpenDeclineDialog] = useState(false);
  const [openWaitingDialog, setOpenWaitingDialog] = useState(false);
  const {
    state: { currentUser }
  } = useAuth();
  const { state } = useHospital();
  const { hospital, admin } = state;
  const isTranstan = currentUser?.userType?.name || '';
  useEffect(() => {
    if (!isView && forHospital && isTranstan !== 'Transtan') {
      setOpenWaitingDialog(true);
    }
  }, [forHospital]);
  //for print
  const handlePrint = async () => {
    const blob = await pdf(
      <HospitalDetailsPdf
        BasicDetails={hospital?.basicDetails}
        HospitalInfra={hospital?.infrastructure}
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
    try {
      const blob = await pdf(
        <HospitalDetailsPdf
          BasicDetails={hospital?.basicDetails}
          HospitalInfra={hospital?.infrastructure}
          OrganLicense={hospital?.organLicences}
        />
      ).toBlob(); // Generate Blob from PDF

      const blobURL = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = blobURL;
      a.download = `${hospital?.basicDetails?.hospitalName || 'HospitalDetails'}.pdf`; // Set the file name
      a.click();

      // Clean up the blob URL
      URL.revokeObjectURL(blobURL);
    } catch (error) {
      console.error('Error generating or downloading the PDF:', error);
    }
  };
  // const handleBack = () => {
  //   const isHospital = location.pathname.includes('hospitals');
  //   if (isHospital) {
  //     navigate('/hospitals');
  //   } else {
  //     navigate(-1);
  //   }
  // };
  return (
    <Box className="px-[20px] md:px-[40px]">
      <Box className="flex items-center gap-2 mb-2">
        {/* <BackIcon className="cursor-pointer" onClick={handleBack} /> */}
        <Text className="text-[#804595] !-ml-[18px] !font-[600] !text-[16px] flex gap-2 items-center">
          Hospital Name:
          <Text className="!text-[19px] !font-[600]">{hospital?.basicDetails?.hospitalName ?? 'NA'}</Text>
        </Text>
      </Box>
      <AdminDetails onNext={() => {}} adminData={admin} readOnly={true} reCheck={false} />
      <NtorcHospital isApprove={true} readOnly={true} ntorcData={hospital?.basicDetails} onNext={() => {}} />
      <Box className="mt-4"></Box>
      <ApprovedOrganDoc
        readOnly={true}
        organData={hospital?.organLicences}
        onNext={() => {}}
        forNtorc={true}
        reCheck={false}
      />
      <Box className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
          onClick={handlePrint}
        >
          <PrintIcon /> Print
        </Button>
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] "
          onClick={handleDownload}
        >
          <DocumentDownload /> Download
        </Button>
        {!isView && (
          <>
            <Button
              variant="outlined"
              className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] "
              onClick={() => setOpenDeclineDialog(true)}
            >
              <DeclineIcon /> Decline
            </Button>
            <Button
              variant="contained"
              className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
              onClick={() => setOpenApproveDialog(true)}
            >
              <ApproveIcon /> Approve
            </Button>
          </>
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

export default NtorcView;
