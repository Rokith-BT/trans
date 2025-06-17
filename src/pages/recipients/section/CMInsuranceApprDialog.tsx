/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CustomDialog, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
// import sampleLicense from '@/assets/imgs/organ_license.png';
// import sampleLicense1 from '@/assets/imgs/organ_license.png';
import { ApproveIcon, DeclineIcon } from '@/assets/icons';
// import MUICarousel from '@/pages/components/MUICarousel';
import CloseIcon from '@/assets/icons/Close';
import { useRecipient } from '../RecipientContext';
import ApproveDialog from '../view/ApproveDialog';
import DeclainDialog from '../view/DeclainDialog';

interface CMInsuranceApprDialogProps {
  open: boolean;
  onClose: () => void;
  cmInsuranceData?: any;
}

const CMInsuranceApprDialog: React.FC<CMInsuranceApprDialogProps> = ({ open, onClose, cmInsuranceData }) => {
  const [openCmi, setOpenCmi] = useState(false);
  const [openDecCmi, setOpenDecCmi] = useState(false);
  const {
    actions: { getFileData },
    state: { fileBlop }
  } = useRecipient();
  useEffect(() => {
    if (open) {
      getFileData(cmInsuranceData?.cmInsuranceDoc);
    }
  }, [cmInsuranceData, open]);

  return (
    <>
      <CustomDialog open={open} onClose={onClose} maxWidth="md">
        <Box className="flex justify-between">
          <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">CM Insurance Approval Document</Text>
          <CloseIcon className=" h-[25px] w-[25px] cursor-pointer" onClick={onClose} />
        </Box>
        <Box className="mb-4 float-right">
          <Button
            variant="outlined"
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323] !mr-3"
            onClick={() => setOpenDecCmi(true)}
          >
            <DeclineIcon /> Decline
          </Button>
          <Button
            variant="contained"
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
            onClick={() => setOpenCmi(true)}
          >
            <ApproveIcon /> Approve
          </Button>
        </Box>
        <Box mb={2} className="text-center">
          {fileBlop ? (
            cmInsuranceData?.cmInsuranceDoc?.endsWith('.pdf') ? (
              <iframe src={fileBlop} width="100%" height="600px" title="PDF Viewer"></iframe>
            ) : (
              <img src={fileBlop} alt="Img" />
            )
          ) : (
            <p>Loading {cmInsuranceData?.cmInsuranceDoc?.endsWith('.pdf') ? 'PDF' : 'Image'}...</p>
          )}
          {/* <MUICarousel imgArr={imgArr} /> */}
          <Text className="!text-[15px] !font-[500] !mb-4 !mt-6">
            Recipient Name:<span className="text-[#804595]"> {cmInsuranceData?.name}</span>
          </Text>
        </Box>
      </CustomDialog>
      <ApproveDialog
        open={openCmi}
        onClose={() => setOpenCmi(false)}
        cmInsuranceData={cmInsuranceData}
        isCMInsurance={true}
      />
      <DeclainDialog
        open={openDecCmi}
        onClose={() => setOpenDecCmi(false)}
        cmInsuranceData={cmInsuranceData}
        isCMInsurance={true}
      />
    </>
  );
};

export default CMInsuranceApprDialog;
