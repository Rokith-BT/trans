/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormFileInput, MUIContainer, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AttachmentDetailsType, AttatchmentSchema } from '../validators';
import DonorFooterButton from './DonorFooterButton';
import { useDonor } from '../../DonorContext';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import {  Grid } from '@mui/material';
// import { useNavigate } from 'react-router';

interface AttachmentDetailsProps {
  attachmentDetailData: any;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: AttachmentDetailsType) => void;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onBack?: any;
  isPreview: boolean;
  readOnly: boolean;
}
const AttachmentDetails: React.FC<AttachmentDetailsProps> = ({
  attachmentDetailData,
  onNext,
  onBack,
  isPreview,
  readOnly
}) => {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const [fileLabel, setFileLabel] = useState('');
  const { control, reset, handleSubmit } = useForm({
    resolver: zodResolver(AttatchmentSchema),
    defaultValues: {
      form8: attachmentDetailData?.form8 || '',
      form10: attachmentDetailData?.form10 || '',
      urineRoutine: attachmentDetailData?.urineRoutine || '',
      urineCulture: attachmentDetailData?.urineCulture || '',
      completeHemogram: attachmentDetailData?.completeHemogram || '',
      bloodMesures: attachmentDetailData?.bloodMesures || '',
      serumElectrolytes: attachmentDetailData?.serumElectrolytes || '',
      serology: attachmentDetailData?.serology || '',
      liverFunctionTest: attachmentDetailData?.liverFunctionTest || '',
      congalutionProfile: attachmentDetailData?.congalutionProfile || '',
      chestXRay: attachmentDetailData?.chestXRay || '',
      ecg: attachmentDetailData?.ecg || '',
      echo: attachmentDetailData?.echo || '',
      ctChest: attachmentDetailData?.ctChest || '',
      usgAbdomen: attachmentDetailData?.usgAbdomen || '',
      ripCR: attachmentDetailData?.ripCR || '',
      anyOtherInvestigation1: attachmentDetailData?.anyOtherInvestigation1 || '',
      anyOtherInvestigation2: attachmentDetailData?.anyOtherInvestigation2 || '',
      anyOtherInvestigation3: attachmentDetailData?.anyOtherInvestigation3 || '',
      anyOtherInvestigation4: attachmentDetailData?.anyOtherInvestigation4 || ''
    }
  });

  useEffect(() => {
    reset({
      form8: attachmentDetailData?.form8 || '',
      form10: attachmentDetailData?.form10 || '',
      urineRoutine: attachmentDetailData?.urineRoutine || '',
      urineCulture: attachmentDetailData?.urineCulture || '',
      completeHemogram: attachmentDetailData?.completeHemogram || '',
      bloodMesures: attachmentDetailData?.bloodMesures || '',
      serumElectrolytes: attachmentDetailData?.serumElectrolytes || '',
      serology: attachmentDetailData?.serology || '',
      liverFunctionTest: attachmentDetailData?.liverFunctionTest || '',
      congalutionProfile: attachmentDetailData?.congalutionProfile || '',
      chestXRay: attachmentDetailData?.chestXRay || '',
      ecg: attachmentDetailData?.ecg || '',
      echo: attachmentDetailData?.echo || '',
      ctChest: attachmentDetailData?.ctChest || '',
      usgAbdomen: attachmentDetailData?.usgAbdomen || '',
      ripCR: attachmentDetailData?.ripCR || '',
      anyOtherInvestigation1: attachmentDetailData?.anyOtherInvestigation1 || '',
      anyOtherInvestigation2: attachmentDetailData?.anyOtherInvestigation2 || '',
      anyOtherInvestigation3: attachmentDetailData?.anyOtherInvestigation3 || '',
      anyOtherInvestigation4: attachmentDetailData?.anyOtherInvestigation4 || ''
    });
  }, [reset, attachmentDetailData]);
  const {
    action: { updateDonarAttachment },
    state: { currentDonarId }
  } = useDonor();
  const donorDocFilePath = `donor/${currentDonarId}/donorDocs`;
  const onSubmit = (data: AttachmentDetailsType) => {
    console.log('Attachement Details ', data);
    updateDonarAttachment(currentDonarId, data, () => {
      onNext(data);
    });
  };
  return (
    <MUIContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={8}>
          {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
          <Text className="!text-[#804595] !text-[19px] !font-[500]">Donor Legal Form</Text>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="form8"
                label="Form 8"
                fullWidth
                required
                disabled={readOnly}
                filePath={donorDocFilePath}
                fileData={attachmentDetailData?.form8}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Form 8');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="form10"
                label="Form 10"
                fullWidth
                required
                disabled={readOnly}
                filePath={donorDocFilePath}
                fileData={attachmentDetailData?.form10}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Form 10');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
          </Grid>

          <Box className="mt-[32px]">
            <Text className="!text-[#804595] !text-[19px] !font-[700]">Attachments</Text>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="urineRoutine"
                  label="Urine Routine"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.urineRoutine}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Urine Routine');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="urineCulture"
                  label="Urine Culture"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.urineCulture}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Urine Culture');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="completeHemogram"
                  label="Complete Hemogram"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.completeHemogram}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Complete Hemogram');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="bloodMesures"
                  label="Blood Measures, Creatine, Blood Sugar, HBAIC"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.bloodMesures}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Blood Measures, Creatine, Blood Sugar, HBAIC');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="serumElectrolytes"
                  label="Serum Electrolytes"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.serumElectrolytes}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Serum Electrolytes');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="serology"
                  label="Serology(HIV, HbsAg, HCV)"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.serology}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Serology(HIV, HbsAg, HCV)');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="liverFunctionTest"
                  label="Liver Function Test"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.liverFunctionTest}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Liver Function Test');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="congalutionProfile"
                  label="Congalution Profile"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.congalutionProfile}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Congalution Profile');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="chestXRay"
                  label="Chest X Ray"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.chestXRay}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Chest X Ray');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="ecg"
                  label="ECG"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.ecg}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('ECG');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="echo"
                  label="Echo"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.echo}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Echo');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="ctChest"
                  label="CT Chest"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.ctChest}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('CT Chest');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="usgAbdomen"
                  label="USG Abdomen"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.usgAbdomen}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('USG Abdomen');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="ripCR"
                  label="RIPCR"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.ripCR}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('RIPCR');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="anyOtherInvestigation1"
                  label="Any Other Investigation 1"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.anyOtherInvestigation1}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Any Other Investigation 1');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="anyOtherInvestigation2"
                  label="Any Other Investigation 2"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.anyOtherInvestigation2}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Any Other Investigation 2');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="anyOtherInvestigation3"
                  label="Any Other Investigation 3"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.anyOtherInvestigation3}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Any Other Investigation 3');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="anyOtherInvestigation4"
                  label="Any Other Investigation 4"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={donorDocFilePath}
                  fileData={attachmentDetailData?.anyOtherInvestigation4}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('Any Other Investigation 4');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
            </Grid>
          </Box>
          {!isPreview && (
            <>
              <DonorFooterButton
                onSubmit={handleSubmit(onSubmit)}
                onBack={() => onBack(currentDonarId)}
                isFirstStep={false}
                isLastStep={false}
              />
            </>
          )}
        </Box>
      </form>
      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileLabel} />
      <LoadingOverlay isLoading={loader} />
    </MUIContainer>
  );
};

export default AttachmentDetails;
