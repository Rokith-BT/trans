import { BackIconPink, NextIcon } from '@/assets/icons';
import { Box, Button } from '@/atoms';
import React from 'react';
import { useNavigate } from 'react-router';

interface DonorFooterButtonProps {
  onSubmit: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  handlePrintPdf?: () => void;
  handleDownload?: () => void;
}

const DonorFooterButton: React.FC<DonorFooterButtonProps> = ({
  onSubmit,
  onBack,
  isFirstStep,
  isLastStep,
  handlePrintPdf,
  handleDownload
}) => {
  const navigate = useNavigate();
  return (
    <Box className="mt-10 mb-16 flex flex-wrap md:flex-nowrap items-center justify-center md:justify-end gap-4 md:gap-[22px] px-4 sm:px-8">
      {isFirstStep ? (
        <Button
          onClick={() => navigate('/donors?page=1&perPage=10#pdl')}
          variant="outlined"
          className="w-full sm:w-[180px] md:w-[164px]"
        >
          <Box className="flex gap-2 items-center justify-center">Cancel</Box>
        </Button>
      ) : (
        <Button onClick={onBack} variant="outlined" className="w-full sm:w-[180px] md:w-[164px]">
          <Box className="flex gap-2 items-center justify-center">
            <BackIconPink /> Back
          </Box>
        </Button>
      )}

      {isLastStep ? (
        <>
          <Button
            onClick={handlePrintPdf}
            variant="outlined"
            className="w-full sm:w-[180px] md:w-[164px] flex gap-2 items-center justify-center"
          >
            Print
          </Button>
          <Button
            onClick={handleDownload}
            variant="outlined"
            className="w-full sm:w-[180px] md:w-[164px] flex gap-2 items-center justify-center"
          >
            Download
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            className="w-full sm:w-[180px] md:w-[164px] flex gap-2 items-center justify-center"
          >
            Submit
          </Button>
        </>
      ) : (
        <Button
          onClick={onSubmit}
          variant="contained"
          className="w-full sm:w-[180px] md:w-[164px] flex gap-2 items-center justify-center"
        >
          Next <NextIcon />
        </Button>
      )}
    </Box>
  );
};

export default DonorFooterButton;
