/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Box, FormFileInput, FormInput, FormSelect, Text } from '@/atoms';
import { OrganRequestData } from '@/types/recipient';
import FileViewModal from '../section/FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
// import DepartmentSelect from '@/pages/components/CustomChip';

interface PancreasProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: any;
  readOnly?: boolean;
  isAlf?: boolean;
  getHistoryOfComplications?: { label: string; value: string }[];
  getCancerScreening?: { label: string; value: string }[];
  currentRecipientID?: number | string;
  organsRequest: OrganRequestData;
  file: string;
  setFile: React.Dispatch<React.SetStateAction<string>>;
  openImgModal: boolean;
  setOpenImgModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Pancreas: React.FC<PancreasProps> = ({
  control,
  readOnly,
  getHistoryOfComplications,
  getCancerScreening,
  currentRecipientID,
  organsRequest,
  file,
  setFile,
  openImgModal,
  setOpenImgModal
}) => {
  // const [openImgModal, setOpenImgModal] = useState(false);
  // const [file, setFile] = useState('');
  const [fileLabel, setFileLabel] = useState('');
  const [fileName, setFileName] = useState('');
  const [loader, setLoader] = useState(false);
  const pancreasFilePath = `recipient/${currentRecipientID}/pancreas`;
  // const [selectOptions, setSelectOptions] = useState<string[]>([]);
  // const handleChange = (value: string[]) => {
  //   console.log(value, 'valuevaluevalue');

  //   setSelectOptions(value);
  // };
  // const handleDelete = (organtoDelete: string) => {
  //   setSelectOptions((prevOptions) => prevOptions.filter((option) => option !== organtoDelete));
  // };
  const CacerScrOptions = getCancerScreening;
  return (
    <div>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Evaluation Specific to Pancreas</Text>
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
            name={`historyOfComplicationsPancreas`}
            label="History of Complications"
            fullWidth
            disabled={readOnly}
            required
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="complicationDescriptionPancreas"
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
            menuOptions={CacerScrOptions || []}
            control={control}
            name={`cancerScreeningPancreas`}
            label="Cancer Screening"
            fullWidth
            disabled={readOnly}
            // required
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Pancreas Function</Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput
            control={control}
            name="meldScorePancreas"
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
            name="bilirubinPancreas"
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
            name="albuminPancreas"
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
            name="globulinPancreas"
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
            name="ggtPancreas"
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
            name="astPancreas"
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
            name="altPancreas"
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
            name="coronaryAngiogramPancreas"
            label="Coronary Angiogram"
            fullWidth
            disabled={readOnly}
            filePath={pancreasFilePath}
            fileData={organsRequest.coronaryAngiogramPancreas}
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
            name="stressTestPancreas"
            label="Stress Test"
            fullWidth
            disabled={readOnly}
            filePath={pancreasFilePath}
            fileData={organsRequest.stressTestPancreas}
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
            name="roomAirAbgPancreas"
            label="Room air- ABG"
            fullWidth
            disabled={readOnly}
            filePath={pancreasFilePath}
            fileData={organsRequest.roomAirAbgPancreas}
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
            name="pftPancreas"
            label="PFT"
            fullWidth
            disabled={readOnly}
            filePath={pancreasFilePath}
            fileData={organsRequest.pftPancreas}
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
            name="ureaPancreas"
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
            name="creatinePancreas"
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
            name="uricAcidPancreas"
            label="Uric Acid"
            suffixComponent="mg/dL"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumSodiumPancreas"
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
            name="serumPotassiumPancreas"
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
            name="serumChloridePancreas"
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
            name="serumBicarbonatePancreas"
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
            name="serumMagnesiumPancreas"
            label="Serum Magnesium"
            suffixComponent="mg/dL"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="serumPhosphatePancreas"
            label="Serum Phosphate"
            suffixComponent="mg/dL"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
      </Box>
      <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Coagulation Profile </Text>
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Box>
          <FormInput
            control={control}
            name="inrPancreas"
            label="INR"
            fullWidth
            required
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput control={control} name="apttPancreas" label="APTT" fullWidth disabled={readOnly} type={'number'} />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="plateletsPancreas"
            label="Platelets"
            fullWidth
            disabled={readOnly}
            type={'number'}
          />
        </Box>
        <Box>
          <FormInput
            control={control}
            name="fibrinogenPancreas"
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

export default Pancreas;
