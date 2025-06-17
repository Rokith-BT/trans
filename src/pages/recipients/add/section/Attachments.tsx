/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormFileInput, MUIContainer, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import RecipientFooter from './RecipientFooter';
import { zodResolver } from '@hookform/resolvers/zod';
import { attchmentSchema } from '../../validators';
import { useRecipient } from '../../RecipientContext';
import FileViewModal from './FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
// import { FileSliderDialog } from '@/pages/components/FileSliderDialog';
import { Grid } from '@mui/material';
interface AttachmentsProps {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: any) => void;
  onBack?: any;
  isPreview: boolean;
  forCancel?: boolean;
  attachmentDatas?: any;
}

const Attachments: React.FC<AttachmentsProps> = ({
  readOnly,
  onNext,
  onBack,
  isPreview,
  forCancel,
  attachmentDatas
}) => {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [file, setFile] = useState('');
  const [fileLabel, setFileLabel] = useState('');
  const [loader, setLoader] = useState(false);
  const {
    state: { currentRecipientID },
    actions: { updateRecipientDocuments }
  } = useRecipient();
  const AttachmentFilePath = `recipient/${currentRecipientID}/attachment`;

  const { handleSubmit, control, reset, setValue, watch } = useForm({
    resolver: zodResolver(attchmentSchema),
    defaultValues: {
      isLoadingBasic: false,
      clinicalEstablishmentCertificate: attachmentDatas?.clinicalEstablishmentCertificate ?? undefined,
      uploadDoctorDeclaration: attachmentDatas?.uploadDoctorDeclaration ?? undefined,
      aadhar: attachmentDatas?.aadhar ?? undefined,
      urineCulture: attachmentDatas?.urineCulture ?? undefined,
      completeHemogram: attachmentDatas?.completeHemogram ?? undefined,
      bloodSugarHba1c: attachmentDatas?.bloodSugarHba1c ?? undefined,
      serumElectrolytes: attachmentDatas?.serumElectrolytes ?? undefined,
      echo: attachmentDatas?.echo ?? undefined,
      liverFunctionTests: attachmentDatas?.liverFunctionTests ?? undefined,
      rtpcr: attachmentDatas?.rtpcr ?? undefined,
      chestXRay: attachmentDatas?.chestXRay ?? undefined,
      ecg: attachmentDatas?.ecg ?? undefined,
      CtChest: attachmentDatas?.CtChest ?? undefined,
      UsgAbdomen: attachmentDatas?.UsgAbdomen ?? undefined,
      kubImaging: attachmentDatas?.kubImaging ?? undefined,
      anyOtherInvestigation1: attachmentDatas?.anyOtherInvestigation1 ?? undefined,
      anyOtherInvestigation2: attachmentDatas?.anyOtherInvestigation2 ?? undefined,
      anyOtherInvestigation3: attachmentDatas?.anyOtherInvestigation3 ?? undefined,
      anyOtherInvestigation4: attachmentDatas?.anyOtherInvestigation4 ?? undefined
    }
  });
  const isLoadingBasic = watch('isLoadingBasic');
  useEffect(() => {
    reset({
      clinicalEstablishmentCertificate: attachmentDatas?.clinicalEstablishmentCertificate ?? undefined,
      uploadDoctorDeclaration: attachmentDatas?.uploadDoctorDeclaration ?? undefined,
      aadhar: attachmentDatas?.aadhar ?? undefined,
      urineCulture: attachmentDatas?.urineCulture ?? undefined,
      completeHemogram: attachmentDatas?.completeHemogram ?? undefined,
      bloodSugarHba1c: attachmentDatas?.bloodSugarHba1c ?? undefined,
      serumElectrolytes: attachmentDatas?.serumElectrolytes ?? undefined,
      echo: attachmentDatas?.echo ?? undefined,
      liverFunctionTests: attachmentDatas?.liverFunctionTests ?? undefined,
      rtpcr: attachmentDatas?.rtpcr ?? undefined,
      chestXRay: attachmentDatas?.chestXRay ?? undefined,
      ecg: attachmentDatas?.ecg ?? undefined,
      CtChest: attachmentDatas?.CtChest ?? undefined,
      UsgAbdomen: attachmentDatas?.UsgAbdomen ?? undefined,
      kubImaging: attachmentDatas?.kubImaging ?? undefined,
      anyOtherInvestigation1: attachmentDatas?.anyOtherInvestigation1 ?? undefined,
      anyOtherInvestigation2: attachmentDatas?.anyOtherInvestigation2 ?? undefined,
      anyOtherInvestigation3: attachmentDatas?.anyOtherInvestigation3 ?? undefined,
      anyOtherInvestigation4: attachmentDatas?.anyOtherInvestigation4 ?? undefined
    });
  }, [reset, attachmentDatas]);
  const onSubmit = (data: any) => {
    setValue('isLoadingBasic', true);
    const payload = {
      id: attachmentDatas?.id || 0,
      recipientId: currentRecipientID,
      patientSignedDeclarationDoc: data.clinicalEstablishmentCertificate,
      doctorDeclarationDoc: data.uploadDoctorDeclaration,
      aadharDoc: data.aadhar,
      urineCultureDoc: data.urineCulture,
      completeHemogramDoc: data.completeHemogram,
      bloodSugarHbA1cdoc: data.bloodSugarHba1c,
      serumElectrolytesDoc: data.serumElectrolytes,
      echoDoc: data.echo,
      liverFunctionTestDoc: data.liverFunctionTests,
      rtpcrdoc: data.rtpcr,
      chestXrayDoc: data.chestXRay,
      ecgdoc: data.ecg,
      ctchestDoc: data.CtChest,
      usgabdomenDoc: data.UsgAbdomen,
      kubimagingDoc: data.kubImaging,
      anyOtherInvestigation1Doc: data.anyOtherInvestigation1,
      anyOtherInvestigation2Doc: data.anyOtherInvestigation2,
      anyOtherInvestigation3Doc: data.anyOtherInvestigation3,
      anyOtherInvestigation4Doc: data.anyOtherInvestigation4
    };
    console.log(payload, 'AttachmenrPay');
    updateRecipientDocuments(currentRecipientID, payload, () => onNext(data));
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <MUIContainer maxWidth="xl">
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px] ">Declaration Attachments</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="clinicalEstablishmentCertificate"
                label="Clinical Act Establishment certificate"
                fullWidth
                required
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.clinicalEstablishmentCertificate}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Clinical Act Establishment certificate');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="uploadDoctorDeclaration"
                label="Upload Doctor Declaration"
                fullWidth
                required
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.uploadDoctorDeclaration}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Upload Doctor Declaration');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="aadhar"
                label="Aadhar"
                fullWidth
                required
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.aadhar}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Aadhar');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
          </Grid>
          <Text className="text-[#804595] !font-[600] !mb-7 !text-[19px] !mt-8">Medical Reports</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="urineCulture"
                label="Urine Culture"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.urineCulture}
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
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
                name="bloodSugarHba1c"
                label="Blood Sugar/ HbA1C"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.bloodSugarHba1c}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Blood Sugar/ HbA1C');
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.serumElectrolytes}
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
                name="echo"
                label="Echo"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.echo}
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
                name="liverFunctionTests"
                label="Liver Function Tests"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.liverFunctionTests}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Liver Function Tests');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="rtpcr"
                label="RTPCR"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.rtpcr}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('RTPCR');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="chestXRay"
                label="Chest-X-Ray"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.chestXRay}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Chest-X-Ray');
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.ecg}
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
                name="CtChest"
                label="CT Chest"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.CtChest}
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
                name="UsgAbdomen"
                label="USG Abdomen"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.UsgAbdomen}
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
                name="kubImaging"
                label="KUB Imaging"
                fullWidth
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.kubImaging}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('KUB Imaging');
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.anyOtherInvestigation1}
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.anyOtherInvestigation2}
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.anyOtherInvestigation3}
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
                disabled={readOnly}
                filePath={AttachmentFilePath}
                fileData={attachmentDatas?.anyOtherInvestigation4}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Any Other Investigation 4');
                }}
                setFile={setFile}
                setLoader={setLoader}
              />
            </Grid>
          </Grid>
        </MUIContainer>

        {/* <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Box>
            <FormFileInput
              control={control}
              name="clinicalEstablishmentCertificate"
              label="Clinical Act Establishment certificate"
              fullWidth
              required
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.clinicalEstablishmentCertificate}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="uploadDoctorDeclaration"
              label="Upload Doctor Declaration"
              fullWidth
              required
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.uploadDoctorDeclaration}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="aadhar"
              label="Aadhar"
              fullWidth
              required
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.aadhar}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
        </Box> */}
        {/* <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Box>
            <FormFileInput
              control={control}
              name="urineCulture"
              label="Urine Culture"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.urineCulture}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="completeHemogram"
              label="Complete Hemogram"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.completeHemogram}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="bloodSugarHba1c"
              label="Blood Sugar/ HbA1C"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.bloodSugarHba1c}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="serumElectrolytes"
              label="Serum Electrolytes"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.serumElectrolytes}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="echo"
              label="Echo"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.echo}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="liverFunctionTests"
              label="Liver Function Tests"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.liverFunctionTests}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="rtpcr"
              label="RTPCR"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.rtpcr}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="chestXRay"
              label="Chest-X-Ray"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.chestXRay}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="ecg"
              label="ECG"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.ecg}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="CtChest"
              label="CT Chest"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.CtChest}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="UsgAbdomen"
              label="USG Abdomen"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.UsgAbdomen}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="kubImaging"
              label="KUB Imaging"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.kubImaging}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="anyOtherInvestigation1"
              label="Any Other Investigation 1"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.anyOtherInvestigation1}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="anyOtherInvestigation2"
              label="Any Other Investigation 2"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.anyOtherInvestigation2}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="anyOtherInvestigation3"
              label="Any Other Investigation 3"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.anyOtherInvestigation3}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
          <Box>
            <FormFileInput
              control={control}
              name="anyOtherInvestigation4"
              label="Any Other Investigation 4"
              fullWidth
              disabled={readOnly}
              filePath={AttachmentFilePath}
              fileData={attachmentDatas?.anyOtherInvestigation4}
              setOpenImgModal={setOpenImgModal}
              setFile={setFile}
              setLoader={setLoader}
            />
          </Box>
        </Box> */}
        <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileLabel} />
        {isPreview && (
          <RecipientFooter
            onBack={() => onBack(currentRecipientID)}
            onNext={handleSubmit(onSubmit)}
            forCancel={forCancel}
            isLoadingBasic={isLoadingBasic}
          />
        )}
      </form>
      {/* {openImgModal && (
        <FileSliderDialog
          open={openImgModal}
          onClose={() => {
            setOpenImgModal(false);
            setCurrentSerialNumber(-1);
          }}
          documentName={filteredFilesToShowSlider.find((f) => f.serial === currentSerialNumber)?.label}
          document={filteredFilesToShowSlider.find((f) => f.serial === currentSerialNumber)?.value}
          currentPosition={currentSerialNumber}
          totalItems={filteredFilesToShowSlider.length}
          onNext={handleNext}
          onPrevious={handlePrev}
        />
      )} */}

      <LoadingOverlay isLoading={loader} />
    </div>
  );
};
export default Attachments;
