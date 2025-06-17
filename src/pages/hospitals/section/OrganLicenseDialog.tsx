import { Box, Button, CustomDialog, Text } from '@/atoms';
import React, { useEffect } from 'react';
import { CloseCircleIcon, PlayIcon } from '@/assets/icons';
import { HospitalsOrgansLicences } from '@/types/organLicense';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { HospitalApprovedOrganType1 } from '../add/NonNtorcHospital';
import { Organ } from '@/types/common.type';

interface OrganLicence {
  organ: Organ;
  dmsLicenseDoc: File;
  organLicenceNumber: string;
  firstLevelOrganLicenceRegDate: string;
  licenceExpiryDate: string;
  paymentReceiptNumber: string;
  status: string;
}
interface OrganLicenseDialogProps {
  open: boolean;
  onClose: () => void;
  hospital?: HospitalsOrgansLicences | null;
  documentUrl?: string;
  organLicense?: HospitalApprovedOrganType1 | Array<OrganLicence> | undefined;
  onNext?: () => void;
  onPrevious?: () => void;
  currentPosition?: number;
  totalItems?: number;
}

export const OrganLicenseDialog: React.FC<OrganLicenseDialogProps> = ({
  open,
  onClose,
  hospital,
  documentUrl,
  onNext,
  onPrevious,
  currentPosition,
  totalItems
}) => {
  const {
    state: { file },
    action: { getFiles, dispatch }
  } = useMasterData();

  useEffect(() => {
    if (!documentUrl || !open) {
      dispatch({ type: 'GETFILES', payload: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentUrl, open]);

  useEffect(() => {
    if (documentUrl) {
      getFiles(documentUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentUrl, open, currentPosition]);
  //for download
  const handleDownload = () => {
    if (file && documentUrl) {
      const urlParts = documentUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      const filename = lastPart?.split('?')[0] || 'document';
      const link = document.createElement('a');
      link.href = file;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  //open file new tab
  const handleOpenInNewTab = () => {
    if (file) {
      window.open(file, '_blank');
    }
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm" customWidth="100%">
      <Box px={2} className="relative">
        <Text className="text-[#804595] !mb-[8px] !text-[19px] !font-[600] ">
          Lisence View ({currentPosition}/{totalItems})
        </Text>
        <Text className="text-[#C967A2] !text-[16px] !font-[500]">{hospital?.organType?.name} </Text>
        <Box mt={2} px={1} className="flex items-center justify-center gap-6">
          <Box>
            <PlayIcon onClick={onPrevious} className="h-[28px] w-[28px] cursor-pointer" />
          </Box>
          {/* {documentUrl ? (
            <>
              {documentUrl?.split('.').pop() === 'pdf' ? (
                <iframe src={file} width="100%" height="500px" title="PDF Viewer"></iframe>
              ) : (
                <img key={file} src={file} alt="" className="w-[90%]" />
              )}
            </>
          ) : (
            <Text>Loading file...</Text>
          )} */}
          {!documentUrl || !documentUrl.includes('/') ? (
            <Text className="text-center text-[14px] text-gray-500 font-medium">No file to show</Text>
          ) : (
            <>
              {documentUrl?.split('.').pop() === 'pdf' ? (
                <iframe src={file} width="100%" height="500px" title="PDF Viewer"></iframe>
              ) : (
                <img key={file} src={file} alt="" className="w-[90%]" />
              )}
            </>
          )}

          <Box>
            <PlayIcon onClick={onNext} className="h-[28px] w-[28px] rotate-[180deg] cursor-pointer" />
          </Box>
        </Box>
        <Text className="text-center text-[#A1999F] !font-[600] !text-[16px] !mt-[16px]">{hospital?.hospitalName}</Text>
        {!documentUrl || !documentUrl.includes('/') ? (
          <></>
        ) : (
          <Box className="flex items-center justify-center gap-4 mt-4">
            <Button variant="outlined" className="" onClick={handleOpenInNewTab}>
              Open in New Tab
            </Button>
            <Button variant="contained" className="" onClick={handleDownload}>
              Download
            </Button>
          </Box>
        )}
        <Box className="absolute -top-1 -right-1">
          <CloseCircleIcon toolText="" onClick={onClose} className="cursor-pointer " stroke="#A1999F" />
        </Box>
      </Box>
    </CustomDialog>
  );
};
