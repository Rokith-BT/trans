import { Box, CustomDialog, Text } from '@/atoms';
import React, { useEffect, useRef, useState } from 'react';
import { CloseCircleIcon, PlayIcon } from '@/assets/icons';
import { useRecipient } from '../recipients/RecipientContext';
import CloseIcon from '@/assets/icons/Close';
import { Button } from '@mui/material';

interface OrganLicenseDialogProps {
  open: boolean;
  onClose: () => void;
  documentName?: string;
  document?: string;
  onNext: () => void;
  onPrevious: () => void;
  currentPosition: number;
  totalItems: number;
}

export const FileSliderDialog: React.FC<OrganLicenseDialogProps> = ({
  open,
  onClose,
  documentName,
  document,
  onNext,
  onPrevious,
  currentPosition,
  totalItems
}) => {
  const {
    actions: { getFileData, dispatch },
    state: { fileBlop }
  } = useRecipient();
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const [blobType, setBlobType] = useState<string | null>(null);

  const isBlobUrl = document?.startsWith('blob:');
  const fetchBlobType = async (blobUrl: string) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      setBlobType(blob.type); // Set MIME type (e.g., application/pdf or image/png)
    } catch (error) {
      console.error('Error fetching blob type:', error);
    }
  };
  useEffect(() => {
    if (document && open) {
      if (isBlobUrl) {
        fetchBlobType(document);
      }
    }
  }, [document, open]);

  useEffect(() => {
    if (!document || !open) {
      dispatch({ type: 'GETFILE', payload: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, open]);
  console.log(document, 'documentdocumentdocument');

  useEffect(() => {
    if (document) {
      getFileData(document);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, open, currentPosition]);
  console.log('fff121212', fileBlop);

  const isPdf = isBlobUrl ? blobType === 'application/pdf' : document?.endsWith('.pdf');
  const previewUrl = isBlobUrl ? document : fileBlop; // Prioritize blob URL if available

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm" customWidth="100%">
      {isBlobUrl ? (
        <>
          <Box className="p-5 relative">
            <CloseIcon className="absolute right-0 top-0 h-[25px] w-[25px] cursor-pointer" onClick={onClose} />
            <Box className="flex justify-between">
              <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">Preview</Text>
            </Box>
            <Box className="flex flex-col gap-y-[5px] items-center justify-center relative">
              {isPdf ? (
                previewUrl ? (
                  <iframe src={previewUrl} width="100%" height="600px" title="PDF Viewer"></iframe>
                ) : (
                  <p>Loading PDF...</p>
                )
              ) : previewUrl ? (
                <img src={previewUrl} alt="Preview" />
              ) : (
                <p>Loading Image...</p>
              )}
            </Box>
            <Button
              className="float-right !mt-4 !text-[#c967a2]"
              onClick={() => {
                if (previewUrl && downloadRef.current) {
                  downloadRef.current.href = previewUrl;
                  downloadRef.current.download = previewUrl.split('/').pop() || 'download';
                  downloadRef.current.click();
                }
              }}
            >
              Download
            </Button>
          </Box>
          <Box ref={downloadRef} style={{ display: 'none' }} />
        </>
      ) : (
        <Box px={2} className="relative">
          <Text className="text-[#804595] !mb-[8px] !text-[19px] !font-[600] ">
            {documentName} ({currentPosition}/{totalItems})
          </Text>

          <Box mt={2} px={1} className="flex items-center justify-center gap-6">
            <Box>
              <PlayIcon onClick={onPrevious} className="h-[28px] w-[28px] cursor-pointer" />
            </Box>
            {document ? (
              <>
                {document?.split('.').pop() === 'pdf' ? (
                  <iframe src={fileBlop} width="100%" height="400px" title="PDF Viewer"></iframe>
                ) : (
                  <img key={fileBlop} src={fileBlop} alt="" className="w-[90%] " />
                )}
              </>
            ) : (
              <Text>Loading file...</Text>
            )}
            <Box>
              <PlayIcon onClick={onNext} className="h-[28px] w-[28px] rotate-[180deg] cursor-pointer" />
            </Box>
          </Box>
          <Text className="text-center text-[#A1999F] !font-[600] !text-[16px] !mt-[16px]">{documentName}</Text>
          <Box className="absolute -top-1 -right-1">
            <CloseCircleIcon toolText="" onClick={onClose} className="cursor-pointer " stroke="#A1999F" />
          </Box>
        </Box>
      )}
    </CustomDialog>
  );
};
