/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState } from 'react';
import { Box, FormFileInput, FormInput, FormSelect, Text } from '@/atoms';
import LiverALF from './LiverALF';
import { OrganRequestData } from '@/types/recipient';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import FileViewModal from '../section/FileViewModal';
// import { FileSliderDialog } from '@/pages/components/FileSliderDialog';

interface LiverProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  readOnly?: boolean;
  isAlf?: boolean;
  getHistoryOfComplications?: { label: string; value: string }[];
  getCancerScreening?: { label: string; value: string }[];
  getALFListing?: { label: string; value: string }[];
  currentRecipientID?: number | string;
  organsRequest: OrganRequestData;
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
  openImgModal: boolean;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Liver: React.FC<LiverProps> = ({
  control,
  readOnly,
  isAlf,
  getHistoryOfComplications,
  getCancerScreening,
  getALFListing,
  currentRecipientID,
  organsRequest,
  file,
  setFile,
  openImgModal,
  setOpenImgModal
}) => {
  const [loader, setLoader] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileLabel, setFileLabel] = useState('');
  const liverFilePath = `recipient/${currentRecipientID}/liver`;

  return (
    <div>
      {isAlf && (
        <LiverALF
          control={control}
          readOnly={readOnly}
          getALFListing={getALFListing}
          currentRecipientID={currentRecipientID}
          organsRequest={organsRequest}
          file={file}
          setFile={setFile}
          openImgModal={openImgModal}
          setOpenImgModal={setOpenImgModal}
        />
      )}
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Evaluation Specific to Liver</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          {/* <DepartmentSelect
            label="History of Complications"
            selectOptions={selectOptions || []}
            options={getHistoryOfComplications || []}
            handleChange={handleChange}
            handleDelete={handleDelete}
            disable={readOnly}
          /> */}
          <FormSelect
            menuOptions={getHistoryOfComplications || []}
            control={control}
            name={`historyOfComplications`}
            label="History of Complications"
            fullWidth
            disabled={readOnly}
            required
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="complicationDescription"
            label="Complication Description"
            fullWidth
            // required
            disabled={readOnly}
            multiline
            minRows={3}
          />
        </Box>
        <Box>
          <FormSelect
            menuOptions={getCancerScreening || []}
            control={control}
            name={`cancerScreening`}
            label="Cancer Screening"
            fullWidth
            disabled={readOnly}
            // required
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Liver Function</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput
            control={control}
            name="meldScore"
            label="MELD Score"
            fullWidth
            required
            disabled={readOnly}
            suffixComponent="mg/dL"
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="bilirubin"
            label="Bilirubin"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="albumin"
            label="Albumin"
            suffixComponent="g/dL"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="globulin"
            label="Globulin"
            fullWidth
            required
            disabled={readOnly}
            suffixComponent="g/dL"
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="ggt"
            label="GGT"
            fullWidth
            required
            disabled={readOnly}
            suffixComponent="IU/L"
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="ast"
            label="AST"
            fullWidth
            required
            disabled={readOnly}
            suffixComponent="IU/L"
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="alt"
            label="ALT"
            fullWidth
            required
            disabled={readOnly}
            suffixComponent="IU/L"
            type={'number'}
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Cardiac Evaluation </Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormFileInput
            control={control}
            name="coronaryAngiogram"
            label="Coronary Angiogram"
            fullWidth
            disabled={readOnly}
            filePath={liverFilePath}
            fileData={organsRequest.coronaryAngiogram}
            setOpenImgModal={(val) => {
              setOpenImgModal(val);
              setFileLabel('Coronary Angiogram');
            }}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Coronary Angiogram`);
            }}
          />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="stressTest"
            label="Stress Test"
            fullWidth
            disabled={readOnly}
            filePath={liverFilePath}
            fileData={organsRequest.stressTest}
            setOpenImgModal={(val) => {
              setOpenImgModal(val);
              setFileLabel('Stress Test');
            }}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Stress Test`);
            }}
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Pulmonary Evaluation </Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormFileInput
            control={control}
            name="roomAirAbg"
            label="Room air- ABG"
            fullWidth
            disabled={readOnly}
            filePath={liverFilePath}
            fileData={organsRequest.roomAirAbg}
            setOpenImgModal={(val) => {
              setOpenImgModal(val);
              setFileLabel('Room air- ABG');
            }}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`Room air- ABG`);
            }}
          />
        </Box>
        <Box>
          <FormFileInput
            control={control}
            name="pft"
            label="PFT"
            fullWidth
            disabled={readOnly}
            filePath={liverFilePath}
            fileData={organsRequest.pft}
            setOpenImgModal={(val) => {
              setOpenImgModal(val);
              setFileLabel('PFT');
            }}
            setFile={setFile}
            setLoader={setLoader}
            setPreviewName={() => {
              setFileName(`PFT`);
            }}
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Renal Evaluation </Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput
            control={control}
            name="ureaLiver"
            label="Urea"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="creatineLiver"
            label="Creatinine"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="uricAcidLiver"
            label="Uric Acid"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumSodiumLiver"
            label="Serum Sodium"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumPotassiumLiver"
            label="Serum Potassium"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumChlorideLiver"
            label="Serum Chloride"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumBicarbonateLiver"
            label="Serum Bicarbonate"
            suffixComponent="mg/dL"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumMagnesiumLiver"
            label="Serum Magnesium"
            suffixComponent="mg/dL"
            fullWidth
            // required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumPhosphateLiver"
            label="Serum Phosphate"
            suffixComponent="mg/dL"
            fullWidth
            // required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Coagulation Profile </Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput control={control} name="inr" label="INR" fullWidth required disabled={readOnly} type={'number'} />
        </Box>
        <Box>
          <FormInput control={control} name="aptt" label="APTT" fullWidth disabled={readOnly} type={'number'} />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="platelets"
            label="Platelets"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="fibrinogen"
            label="Fibrinogen"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
      </Box>
      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileName} />
      <LoadingOverlay isLoading={loader} />
    </div>
  );
};

export default Liver;
