import React, { useState } from 'react';
import { Box, FormFileInput, FormSelect, Text } from '@/atoms';
import { OrganRequestData } from '@/types/recipient';
import FileViewModal from '../section/FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';

interface LiverALFProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  readOnly?: boolean;
  getALFListing?: { label: string; value: string }[];
  currentRecipientID?: number | string;
  organsRequest?: OrganRequestData;
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
  openImgModal: boolean;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LiverALF: React.FC<LiverALFProps> = ({
  control,
  readOnly,
  getALFListing,
  currentRecipientID,
  organsRequest,
  file,
  setFile,
  openImgModal,
  setOpenImgModal
}) => {
  // const [openImgModal, setOpenImgModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [fileName, setFileName] = useState('');
  // const [file, setFile] = useState('');
  const liverALFFilePath = `recipient/${currentRecipientID}/liver-alf`;
  return (
    <div>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">ALF Details</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormSelect
            menuOptions={getALFListing || []}
            control={control}
            name={`alfListingType`}
            label="ALF Listing Type"
            fullWidth
            required
            disabled={readOnly}
          />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="alfEvaluationSheet"
            label="ALF Evaluation Sheet"
            fullWidth
            required
            disabled={readOnly}
            filePath={liverALFFilePath}
            fileData={organsRequest?.alfEvaluationSheet}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`ALF Evaluation Sheet`);
            }}
          />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="additionalHepatologyNotes"
            label="Additional Hepatology Notes"
            fullWidth
            required
            disabled={readOnly}
            filePath={liverALFFilePath}
            fileData={organsRequest?.additionalHepatologyNotes}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Additional Hepatology Notes`);
            }}
          />
        </Box>

        <Box>
          <FormFileInput
            control={control}
            name="consultantShortSummary"
            label="Consultant Short Summary"
            fullWidth
            required
            disabled={readOnly}
            filePath={liverALFFilePath}
            fileData={organsRequest?.consultantShortSummary}
            setOpenImgModal={setOpenImgModal}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Consultant Short Summary`);
            }}
          />
        </Box>
      </Box>
      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileName} />
      <LoadingOverlay isLoading={loader} />
    </div>
  );
};

export default LiverALF;
