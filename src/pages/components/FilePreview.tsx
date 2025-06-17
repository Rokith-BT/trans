import CloseIcon from '@/assets/icons/Close';
import { Box, CustomDialog, Text } from '@/atoms';
import React, { useEffect, useRef, useState } from 'react';
import { DocumentDownload } from '@/assets/icons';
import { useMasterData } from '../settings/setups/masterCotext';

interface FileViewModalProps {
  open: boolean;
  onClose: () => void;
  file: string;
  fileLabel: string;
}

const PreviewFile: React.FC<FileViewModalProps> = ({ open, onClose, file, fileLabel }) => {
  const {
    action: { getFileData },
    state: { fileBlop }
  } = useMasterData();
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const [blobType, setBlobType] = useState<string | null>(null);

  const isBlobUrl = file?.startsWith('blob:');

  // Function to determine blob type
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
    if (file && open) {
      if (!isBlobUrl) {
        getFileData(file); // Fetch if not a blob
      } else {
        fetchBlobType(file); // Identify blob type
      }
    }
  }, [file, open]);

  const handleClose = () => {
    onClose();
  };

  // Determine if it's a PDF or image
  const isPdf = isBlobUrl ? blobType === 'application/pdf' : file?.endsWith('.pdf');
  const previewUrl = isBlobUrl ? file : fileBlop; // Prioritize blob URL if available

  return (
    <CustomDialog open={open} onClose={handleClose} maxWidth="sm">
      <Box className="p-5 relative">
        <CloseIcon className="absolute top-0 -right-1 h-[25px] w-[25px] cursor-pointer" onClick={handleClose} />
        <Box className="flex flex-col gap-y-[5px] items-left justify-left relative">
          {isPdf ? (
            previewUrl ? (
              <>
                <Box className="flex justify-between mt-5 mb-2">
                  <Text className="text-[18px] !font-medium mb-2 text-[#804595]">{fileLabel}</Text>
                  <DocumentDownload
                    onClick={() => {
                      if (previewUrl && downloadRef.current) {
                        downloadRef.current.href = previewUrl;
                        downloadRef.current.download = previewUrl.split('/').pop() || 'download';
                        downloadRef.current.click();
                      }
                    }}
                  />
                </Box>
                <iframe src={previewUrl} style={{ height: '400px' }} title="PDF Viewer"></iframe>
                <Box ref={downloadRef} style={{ display: 'none' }} />
              </>
            ) : (
              <p>Loading PDF...</p>
            )
          ) : previewUrl ? (
            <>
              <Box className="flex justify-between mt-5 mb-2">
                <Text className="text-[18px] !font-medium mb-2 text-[#804595]">{fileLabel}</Text>
                <DocumentDownload
                  onClick={() => {
                    if (previewUrl && downloadRef.current) {
                      downloadRef.current.href = previewUrl;
                      downloadRef.current.download = previewUrl.split('/').pop() || 'download';
                      downloadRef.current.click();
                    }
                  }}
                />
              </Box>
              <img src={previewUrl} alt="Preview" style={{ height: '400px', width: '600px' }} />
              <Box ref={downloadRef} style={{ display: 'none' }} />
            </>
          ) : (
            <p>Loading Image...</p>
          )}
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default PreviewFile;
