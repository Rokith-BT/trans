import React from 'react';
import { Box, Button } from '@/atoms';
import { BackIconPink, DocumentDownload, NextIcon, PrintIcon } from '@/assets/icons';
import { useHospital } from '../../hospitalContext';
import { pdf } from '@react-pdf/renderer';
import HospitalDetailsPdf from '../../view/pdf/HospitalDetailsPdf';
import { toast } from '@/utils/toast';

interface FooterButtonProps {
  onSubmit: () => void;
  onBack?: () => void;
  payment?: boolean;
  isFinalStep?: boolean;
  isFirstStep?: boolean;
  isDeclare?: boolean;
  isHospitalEdit?: boolean;
  isLicense?: boolean;
}

const FooterButton: React.FC<FooterButtonProps> = ({
  onSubmit,
  onBack,
  payment = false,
  isFinalStep = false,
  isFirstStep = false,
  isDeclare = false,
  isHospitalEdit = false,
  isLicense = false
}) => {
  const {
    state: { hospital }
  } = useHospital();
  const hospitalType = hospital?.basicDetails?.hospitalType?.name;
  console.log('hospital type form footer button ', hospital);

  const handlePrint = async () => {
    const blob = await pdf(
      <HospitalDetailsPdf
        BasicDetails={hospital?.basicDetails}
        HospitalInfra={hospital?.infrastructure}
        OrganLicense={hospital?.organLicences}
      />
    ).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const printWindow = window.open(blobUrl, '_blank');
    if (printWindow) {
      printWindow.focus();
    } else {
      console.log('failed to open print window');
      toast('failed to open print window ', 'error');
    }
  };

  const handleDownload = async () => {
    const blob = await pdf(
      <HospitalDetailsPdf
        BasicDetails={hospital?.basicDetails}
        HospitalInfra={hospital?.infrastructure}
        OrganLicense={hospital?.organLicences}
      />
    ).toBlob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${hospital?.basicDetails?.hospitalName || 'hospital'}_details.pdf`;
    a.click();
  };

  return (
    <Box className="hospital-footer-section">
      {payment ? (
        <Box className="md:mt-5 mt-3 flex items-center justify-end md:gap-9 gap-4 mr-[5%] mb-[10%]">
          <Button
            onClick={onBack}
            variant="outlined"
            className="buttons-width h-[40px] !border-[#D876A9] !text-[#D876A9] flex gap-4"
          >
            <BackIconPink /> Back
          </Button>
          <Button variant="contained" className="buttons-width h-[40px] !bg-[#D876A9]" onClick={onSubmit}>
            Make Payment
          </Button>
        </Box>
      ) : isFinalStep ? (
        <Box className="md:mt-5 mt-3 flex items-center justify-end md:gap-9 gap-4 mr-[5%] mb-[10%]">
          <Button variant="outlined" className="buttons-width h-[40px]" onClick={handlePrint}>
            <PrintIcon /> &nbsp; Print
          </Button>
          <Button
            variant="outlined"
            className="buttons-width h-[40px] !border-[#D876A9] !text-[#D876A9]"
            onClick={handleDownload}
          >
            <DocumentDownload /> &nbsp; Download
          </Button>

          <Button
            variant="outlined"
            className="buttons-width h-[40px] flex gap-2 items-center !border-[#D876A9] !text-[#D876A9]"
            onClick={onBack}
          >
            <BackIconPink /> Back
          </Button>

          <Button
            variant="contained"
            className={`buttons-width h-[40px] bg-[#A1999F] ${isDeclare ? '!bg-[#D876A9]' : '!bg-[#A1999F]'} `}
            onClick={onSubmit}
            disabled={!isDeclare}
          >
            {`${hospitalType === 'Government' || hospitalType === 'NTORC' ? 'Submit' : 'Review Payment'} `}
          </Button>
        </Box>
      ) : isLicense ? (
        <Box className="md:mt-5 mt-3 flex items-center justify-end md:gap-9 gap-4 mb-[4%]">
          <Button variant="contained" className="buttons-width flex gap-2 h-[40px] !bg-[#D876A9]" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      ) : isLicense ? (
        <Box className="mt-5 flex items-center justify-end gap-9  mb-[4%]">
          <Button variant="contained" className="buttons-width flex gap-2 h-[40px] !bg-[#D876A9]" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      ) : (
        <Box className="md:mt-5 mt-3 flex items-center justify-end gap-4 md:gap-9  mb-[4%]">
          {!isFirstStep && (
            <Button
              variant="outlined"
              className="buttons-width flex gap-2 h-[40px] !border-[#D876A9] !text-[#D876A9]"
              onClick={onBack}
            >
              <BackIconPink /> Back
            </Button>
          )}
          <Button variant="contained" className="buttons-width flex gap-2 h-[40px]" onClick={onSubmit}>
            {isHospitalEdit ? (
              <>Submit</>
            ) : (
              <>
                Next <NextIcon />
              </>
            )}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FooterButton;
