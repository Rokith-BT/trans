import { BackIconPink, DocumentDownload, NextIcon, PrintIcon } from '@/assets/icons';
import { Box, Button } from '@/atoms';
// import { useHospital } from '@/pages/hospitals/hospitalContext';
import React from 'react';

interface RecipientFooterProps {
  isPrivateHos?: boolean | undefined;
  onNext: () => void;
  onBack?: () => void;
  payment?: boolean;
  isFinalStep?: boolean;
  isFirstStep?: boolean;
  isDeclare?: boolean;
  isRecipientEdit?: boolean;
  isLicense?: boolean;
  forCancel?: boolean;
  handlePrint?: () => void;
  handleDownload?: () => void;
  handlePayLater?: () => void;
  submitDraft?: () => void;
  isPaymentDone?: boolean;
  isLoadingBasic?: boolean;
}

const RecipientFooter: React.FC<RecipientFooterProps> = ({
  onNext,
  onBack,
  isPrivateHos = false,
  payment = false,
  isFinalStep = false,
  isFirstStep = false,
  isDeclare = false,
  isRecipientEdit = false,
  isLicense = false,
  handlePrint,
  handleDownload,
  handlePayLater,
  submitDraft,
  isPaymentDone,
  isLoadingBasic
}) => {
  console.log(isLoadingBasic);
  return (
    <Box className="mt-[60px]">
      {(payment || isFinalStep || isLicense || true) && (
        <Box className="mt-5 flex flex-col md:flex-row flex-wrap items-center md:justify-end justify-center gap-4 md:gap-9 mb-[10%]">
          {payment ? (
            <>
              <Button
                variant="outlined"
                className="w-full md:w-[150px] h-[40px] flex gap-2 items-center !border-[#D876A9] !text-[#D876A9]"
                onClick={onBack}
              >
                <BackIconPink /> Back
              </Button>
              <Button
                onClick={handlePayLater}
                variant="outlined"
                className="w-full md:w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
              >
                Save Draft
              </Button>
              <Button variant="contained" className="w-full md:w-[150px] h-[40px] !bg-[#D876A9]" onClick={onNext}>
                {isPaymentDone ? 'Submit' : 'Make Payment'}
              </Button>
            </>
          ) : isFinalStep ? (
            <>
              <Button
                variant="outlined"
                className="w-full md:w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
                onClick={handlePrint}
              >
                <PrintIcon /> &nbsp; Print
              </Button>
              <Button
                variant="outlined"
                className="w-full md:w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
                onClick={handleDownload}
              >
                <DocumentDownload /> &nbsp; Download
              </Button>
              <Button
                variant="outlined"
                className="w-full md:w-[150px] h-[40px] flex gap-2 items-center !border-[#D876A9] !text-[#D876A9]"
                onClick={onBack}
              >
                <BackIconPink /> Back
              </Button>
              <Button
                variant="contained"
                className={`w-full md:w-[150px] h-[40px] ${isDeclare ? '!bg-[#D876A9]' : '!bg-[#A1999F]'}`}
                onClick={!isPrivateHos ? submitDraft : onNext}
                disabled={!isDeclare}
              >
                {`${!isPrivateHos ? 'Submit' : `${isPaymentDone ? 'Review' : 'Review Payment'}`}`}
              </Button>
            </>
          ) : isLicense ? (
            <Button
              variant="contained"
              className="w-full md:w-[150px] flex gap-2 h-[40px] !bg-[#D876A9]"
              onClick={onNext}
            >
              Submit
            </Button>
          ) : (
            <>
              {!isFirstStep && (
                <Button
                  variant="outlined"
                  className="w-full md:w-[150px] flex gap-2 h-[40px] !border-[#D876A9] !text-[#D876A9]"
                  onClick={onBack}
                >
                  <BackIconPink /> Back
                </Button>
              )}
              {isLoadingBasic ? (
                <Button variant="contained" className="w-full md:w-[150px] flex gap-2 h-[40px] !bg-[#5a5759]">
                  Loading...
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className="w-full md:w-[150px] flex gap-2 h-[40px] !bg-[#D876A9]"
                  onClick={onNext}
                >
                  {isRecipientEdit ? (
                    'Submit'
                  ) : (
                    <>
                      Next <NextIcon />
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default RecipientFooter;
