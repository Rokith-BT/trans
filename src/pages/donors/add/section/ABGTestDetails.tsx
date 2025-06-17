/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormFileInput, FormInput, MUIContainer, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ABGTestDetailsType, ABGTestSchema } from '../validators';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import DonorFooterButton from './DonorFooterButton';
import { DeleteIcon } from '@/assets/icons';
import { useDonor } from '../../DonorContext';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import { Grid } from '@mui/material';
interface ABGTestDetailsProps {
  abgTestData: any;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: ABGTestDetailsType) => void;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onBack?: any;
  isPreview?: boolean;
  readOnly: boolean;
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const ABGTestDetails: React.FC<ABGTestDetailsProps> = ({ abgTestData, onNext, onBack, isPreview, readOnly }) => {
  console.log(abgTestData, 'abgTestData');

  const [openImgModal, setOpenImgModal] = useState(false);
  const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const [fileLabel, setFileLabel] = useState('');
  const {
    action: { updateDonarABGBolldTest },
    state: { currentDonarId, currentMedicalId }
  } = useDonor();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm({
    resolver: zodResolver(ABGTestSchema),
    defaultValues: {
      abgTestResult: abgTestData?.abgTestResult || [
        {
          id: 0,
          donorId: currentDonarId,
          testReport: '',
          fio2: ''
        }
      ],

      isSteroids: abgTestData?.isSteroids || '0',
      isVasopressin: abgTestData?.isVasopressin || '0',
      isThyroxin: abgTestData?.isThyroxin || '0',
      inotropeData: abgTestData?.inotropeData || [
        {
          id: 0,
          donorId: currentDonarId,
          inotrope: ''
        }
      ]
    }
  });
  const abgTestResult = watch('abgTestResult');
  const inotropeData = watch('inotropeData');
  useEffect(() => {
    reset({
      abgTestResult: abgTestData?.abgTestResult
        ? abgTestData?.abgTestResult
        : [
            {
              id: 0,
              donorId: currentDonarId,
              testReport: '',
              fio2: ''
            }
          ],

      isSteroids: abgTestData?.isSteroids || '0',
      isVasopressin: abgTestData?.isVasopressin || '0',
      isThyroxin: abgTestData?.isThyroxin || '0',
      inotropeData: abgTestData?.inotropeData
        ? abgTestData?.inotropeData
        : [
            {
              id: 0,
              donorId: currentDonarId,
              inotrope: ''
            }
          ]
    });
  }, [reset, abgTestData]);
  const { fields: abgFields, append: abgAppend, remove: abgRemove } = useFieldArray({ control, name: 'abgTestResult' });

  const ABGFilePath = `donor/${currentDonarId}/abgTest`;
  const handleABGAppend = () => {
    append({
      id: 0,
      donorId: currentDonarId,
      inotrope: ''
    });
  };
  const { fields, append, remove } = useFieldArray({ control, name: 'inotropeData' });

  const handleInotropes = () => {
    append({
      id: 0,
      donorId: currentDonarId,
      inotrope: ''
    });
  };
  useEffect(() => {
    abgAppend({
      id: 0,
      donorId: currentDonarId,
      testReport: '',
      fio2: ''
    });
  }, []);
  // useEffect(() => {
  //   append({
  //     id: 0,
  //     donorId: currentDonarId,
  //     inotrope: ''
  //   });
  // }, []);
  console.log('errors ', errors);

  const onSubmit = (data: ABGTestDetailsType) => {
    const payload = {
      medicalHistoryId: currentMedicalId,
      donorId: currentDonarId,
      abgTestResult: abgTestResult || data.abgTestResult,
      inotropeData: inotropeData || data.inotropeData,
      isSteroids: data.isSteroids,
      isVasopressin: data.isVasopressin,
      isThyroxin: data.isThyroxin
    };
    updateDonarABGBolldTest(currentDonarId, payload, () => {
      onNext(payload);
    });
  };

  return (
    <MUIContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className=" !mt-[80px]">
          {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
          <Box className="flex items-center justify-between">
            <Text className="text-[#804595] !text-[19px] !font-[500]">ABG Test</Text>
            <Text
              className="!text-[#C967A2] !text-[19px] !font-[500] flex gap-2 items-center cursor-pointer"
              onClick={handleABGAppend}
            >
              + Add ABG
            </Text>
          </Box>
          {abgFields.map((field, index) => (
            <Box key={field.id}>
              <Box mt={2} className="flex gap-4 w-full items-center justify-evenly">
                <Box className="w-full">
                  <Text className="!bg-[#C967A226] relative !text-[#C967A2] !text-[13px] !font-[600] text-center rounded-lg !mb-[28px] p-[8px]">
                    {` ABG Test  ${index + 1}`}
                    {index >= 1 && (
                      <Box className="absolute right-[1%] top-[15%]">
                        <DeleteIcon onClick={() => abgRemove(index)} />
                      </Box>
                    )}
                  </Text>

                  <Grid container spacing={2} mt={2}>
                    <Grid item xs={12} xl={4} md={6}>
                      <FormFileInput
                        control={control}
                        name={`abgTestResult.${index}.testReport`}
                        label="Test Report "
                        fullWidth
                        // required
                        disabled={readOnly}
                        filePath={ABGFilePath}
                        fileData={abgTestData?.abgTestResult?.[index]?.testReport}
                        setOpenImgModal={(val) => {
                          setOpenImgModal(val);
                          setFileLabel('Test Report');
                        }}
                        setFile={setFile}
                        setLoader={setLoader}
                      />
                    </Grid>
                    <Grid item xs={12} xl={4} md={6}>
                      <FormInput
                        control={control}
                        name={`abgTestResult.${index}.fio2`}
                        label={
                          <span>
                            FiO<sub>2</sub>
                            {" "}{index + 1}
                          </span>
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          ))}
          <Box className="mt-[32px] flex flex-col">
            <Box className="flex items-center justify-between">
              <Text className="!text-[#804595] !text-[19px] !font-[500]">Medications - Inotropes</Text>
              <Text
                className="!text-[#C967A2] !text-[19px] !font-[500] flex gap-2 items-center cursor-pointer"
                onClick={handleInotropes}
              >
                + Add Intropes
              </Text>
            </Box>
            {fields.map((fields, index) => (
              <Box key={fields.id} className="flex flex-col mt-[16px]">
                <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px] relative">
                  <Box className="w-full md:w-[calc(33.33%-40px)] ">
                    <FormInput control={control} name={`inotropeData.${index}.inotrope`} label="Inotrope" fullWidth />
                  </Box>
                  {index >= 1 && (
                    <Box className="absolute top-3 right-[67%]">
                      <DeleteIcon onClick={() => remove(index)} />
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          <Box className="mt-[32px]">
            <Text className="!text-[#804595] !text-[16px] !font-[600] !mt-6">Hormone Replacement Therapy</Text>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} xl={4} md={6}>
                <FormAtomRadioGroup label="Steroids" name="isSteroids" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormAtomRadioGroup label="Vasopressin" name="isVasopressin" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Grid>
              <Grid item xs={12} xl={4} md={6}>
                <FormAtomRadioGroup label="Thyroxine" name="isThyroxin" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Grid>
            </Grid>
          </Box>
          {!isPreview && (
            <>
              <DonorFooterButton
                onSubmit={handleSubmit(onSubmit)}
                onBack={() => onBack(currentDonarId)}
                isFirstStep={false}
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

export default ABGTestDetails;
