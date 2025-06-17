/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormFileInput, FormInput, MUIContainer, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InjuriesDetailsSchema, InjuriesDetailsType } from '../validators';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import data from '@/data/selectData.json';
import DonorFooterButton from './DonorFooterButton';
import { useDonor } from '../../DonorContext';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import { Grid } from '@mui/material';
interface InjuriesDetailsProps {
  injuriesDetailData: any;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: InjuriesDetailsType) => void;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onBack?: any;
  isPreview?: boolean;
  readOnly: boolean;
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const InjuriesDetails: React.FC<InjuriesDetailsProps> = ({
  injuriesDetailData,
  onNext,
  onBack,
  isPreview,
  readOnly
}) => {
  console.log(injuriesDetailData, 'injuriesDetailData');
  const [isVentialtion, setIsventialtion] = useState(false);
  const [openImgModal, setOpenImgModal] = useState(false);
  const [fileLabel, setFileLabel] = useState('');
  const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const {
    control,
    reset,
    // formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    resolver: zodResolver(InjuriesDetailsSchema),
    defaultValues: {
      isChestInjury: injuriesDetailData?.isChestInjury || '0',
      isAbdomenInjury: injuriesDetailData?.isAbdomenInjury || '0',
      notes: injuriesDetailData?.notes || '',
      isCprGiven: injuriesDetailData?.isCprGiven || '0',
      cprFileName: injuriesDetailData?.cprFileName || '',
      isHypotensiveEpisodes: injuriesDetailData?.isHypotensiveEpisodes || '0',
      isOnVentilation: injuriesDetailData?.isOnVentilation || '0',
      vcv: injuriesDetailData?.vcv || '',
      pcv: injuriesDetailData?.pcv || '',
      fio2: injuriesDetailData?.fio2 || '',
      peep: injuriesDetailData?.peep || '',
      pip: injuriesDetailData?.pip || '',
      tv: injuriesDetailData?.tv || '',
      respiratoryRate: injuriesDetailData?.respiratoryRate || '',
      pressureSupport: injuriesDetailData?.pressureSupport || '',
      others: injuriesDetailData?.others || ''
    }
  });
  useEffect(() => {
    reset({
      isChestInjury: injuriesDetailData?.isChestInjury || '0',
      isAbdomenInjury: injuriesDetailData?.isAbdomenInjury || '0',
      notes: injuriesDetailData?.notes || '',
      isCprGiven: injuriesDetailData?.isCprGiven || '0',
      cprFileName: injuriesDetailData?.cprFileName || '',
      isHypotensiveEpisodes: injuriesDetailData?.isHypotensiveEpisodes || '0',
      isOnVentilation: injuriesDetailData?.isOnVentilation || '0',
      vcv: injuriesDetailData?.vcv || '',
      pcv: injuriesDetailData?.pcv || '',
      fio2: injuriesDetailData?.fio2 || '',
      peep: injuriesDetailData?.peep || '',
      pip: injuriesDetailData?.pip || '',
      tv: injuriesDetailData?.tv || '',
      respiratoryRate: injuriesDetailData?.respiratoryRate || '',
      pressureSupport: injuriesDetailData?.pressureSupport || '',
      others: injuriesDetailData?.others || ''
    });
  }, [reset, injuriesDetailData]);
  const isCprGiven = watch('isCprGiven');
  const {
    action: { updateDonarMedicalDetailsInjury },
    state: { currentDonarId, currentMedicalId }
  } = useDonor();
  const MedicalInjuryFilePath = `donor/${currentDonarId}/medicalInjury`;
  const onSubmit = (data: InjuriesDetailsType) => {
    console.log('Injuries details ', data);
    const payload = {
      ...data,
      pressureSupport: data.pressureSupport || 0,
      pip: data.pip || 0
    };
    updateDonarMedicalDetailsInjury(currentDonarId, currentMedicalId, payload, () => {
      onNext(data);
    });
  };
  return (
    <MUIContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={8}>
          {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
          <Text className="!text-[#804595] !text-[19px] !font-[700]">InjuriesDetails</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Chest Injuries" name="isChestInjury" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Abdomen Injuries" name="isAbdomenInjury" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="notes" label="Notes" fullWidth />
            </Grid>
          </Grid>
          <Text className="!text-[#804595] !text-[19px] !font-[700] !mt-6">Resuscitative Measures</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="CPR Given" name="isCprGiven" row control={control} isRequired>
                {data.radioOption.map((item, index) => (
                  <AtomRadio
                    key={index}
                    value={item.value}
                    label={item.label}
                    // onClick={() => setCpr(item.required)}
                  />
                ))}
              </FormAtomRadioGroup>
            </Grid>
            {isCprGiven === '1' && (
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="cprFileName"
                  label="CPR File"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={MedicalInjuryFilePath}
                  fileData={injuriesDetailData?.cprFileName}
                  setOpenImgModal={(val) => {
                    setOpenImgModal(val);
                    setFileLabel('CPR File');
                  }}
                  setFile={setFile}
                  setLoader={setLoader}
                />
              </Grid>
            )}
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup
                label="Hypotnesive Episodes"
                name="isHypotensiveEpisodes"
                row
                control={control}
                isRequired
              >
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
          </Grid>
          <Text className="!text-[#804595] !text-[19px] !font-[500] !mt-6">Ventilator Settings</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Is On Ventilation" name="isOnVentilation" row control={control} isRequired>
                {data.radioOption.map((item, index) => (
                  <AtomRadio
                    key={index}
                    value={item.value}
                    label={item.label}
                    onClick={() => setIsventialtion(item.required)}
                  />
                ))}
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                type="number"
                control={control}
                name="vcv"
                label="Volume Controle Venttilation (VCV)"
                fullWidth
                required={isVentialtion ? true : false}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                type="number"
                control={control}
                name="pcv"
                label="Pressure Controle Venttilation (PCV)"
                fullWidth
                required={isVentialtion ? true : false}
              />
            </Grid>
          </Grid>
          <Text className="!text-[#804595] !text-[16px] !font-[600] !mt-6">Other Settings</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                type="number"
                control={control}
                name="fio2"
                label={
                  <>
                    FiO<sup>2</sup>
                  </>
                }
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="peep" label="PEEP" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="pip" label="PIP" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="tv" label="TV" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="respiratoryRate" label="Respiratory Rate" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="pressureSupport" label="Presure Support" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="others" label="Others" fullWidth />
            </Grid>
          </Grid>

          {/* <Box className=" flex flex-col mt-[28px]">
            <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormAtomRadioGroup label="Chest Injuries" name="isChestInjury" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormAtomRadioGroup label="Abdomen Injuries" name="isAbdomenInjury" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="notes" label="Notes" fullWidth />
              </Box>
            </Box>
          </Box>
          <Box className="mt-[32px]">
            <Text className="!text-[#804595] !text-[19px] !font-[700]">Resuscitative Measures</Text>
            <Box className="flex flex-col mt-[28px]">
              <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormAtomRadioGroup label="CPR Given" name="isCprGiven" row control={control} isRequired>
                    {data.radioOption.map((item, index) => (
                      <AtomRadio
                        key={index}
                        value={item.value}
                        label={item.label}
                        onClick={() => setCpr(item.required)}
                      />
                    ))}
                  </FormAtomRadioGroup>
                </Box>
                {isCprGiven === '1' && (
                  <Box className="w-full md:w-[calc(33.33%-40px)]">
                    <FormFileInput
                      control={control}
                      name="cprFileName"
                      label="CPR File"
                      fullWidth
                      required
                      disabled={readOnly}
                      filePath={MedicalInjuryFilePath}
                      fileData={injuriesDetailData?.cprFileName}
                      setOpenImgModal={(val) => {
                        setOpenImgModal(val);
                        setFileLabel('CPR File');
                      }}
                      setFile={setFile}
                      setLoader={setLoader}
                    />
                  </Box>
                )}

                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormAtomRadioGroup
                    label="Hypotnesive Episodes"
                    name="isHypotensiveEpisodes"
                    row
                    control={control}
                    isRequired
                  >
                    <AtomRadio label="Yes" value="1" />
                    <AtomRadio label="No" value="0" />
                  </FormAtomRadioGroup>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="mt-[32px]">
            <Text className="!text-[#804595] !text-[19px] !font-[500]">Ventilator Settings</Text>
            <Box className="flex flex-col mt-[28px]">
              <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormAtomRadioGroup label="Is On Ventilation" name="isOnVentilation" row control={control} isRequired>
                    {data.radioOption.map((item, index) => (
                      <AtomRadio
                        key={index}
                        value={item.value}
                        label={item.label}
                        onClick={() => setIsventialtion(item.required)}
                      />
                    ))}
                  </FormAtomRadioGroup>
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput
                    control={control}
                    name="vcv"
                    label="Volume Controle Venttilation (VCV)"
                    fullWidth
                    required={isVentialtion ? true : false}
                  />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput
                    control={control}
                    name="pcv"
                    label="Pressure Controle Venttilation (PCV)"
                    fullWidth
                    required={isVentialtion ? true : false}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="mt-[32px]">
            <Text className="!text-[#804595] !text-[16px] !font-[600]">Other Settings</Text>
            <Box className="flex flex-col mt-[28px]">
              <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput
                    control={control}
                    name="fio2"
                    label={
                      <>
                        FiO<sup>2</sup>
                      </>
                    }
                    fullWidth
                    required
                  />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput control={control} name="peep" label="PEEP" fullWidth required />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput control={control} name="pip" label="PIP" fullWidth />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput control={control} name="tv" label="TV" fullWidth required />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput control={control} name="respiratoryRate" label="Respiratory Rate" fullWidth required />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput control={control} name="pressureSupport" label="Presure Support" fullWidth />
                </Box>
                <Box className="w-full md:w-[calc(33.33%-40px)]">
                  <FormInput control={control} name="others" label="Others" fullWidth />
                </Box>
              </Box>
            </Box>
          </Box> */}
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

export default InjuriesDetails;
