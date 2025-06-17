// eslint-disable no-unused-vars, @typescript-eslint/no-explicit-any
import { AtomDatePicker, Box, Button, FormInput, FormSelect, Input, MUIContainer, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import RecipientFooter from './RecipientFooter';
import AtomRadio from '@/atoms/radio/Radio';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import { DeleteIcon } from '@/assets/icons';
import { medicalDetailsSchema } from '../../validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRecipient } from '../../RecipientContext';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { RecipientMedicalDetails } from '@/types/recipient';
import { Grid } from '@mui/material';
// import { useParams } from 'react-router';
interface MedicalDetailsProps {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onBack?: any;
  isPreview: boolean;
  forCancel?: boolean;
  MedicalDetails?: RecipientMedicalDetails;
}

const MedicalDetails: React.FC<MedicalDetailsProps> = ({
  readOnly,
  onNext,
  onBack,
  isPreview,
  forCancel,
  MedicalDetails
}) => {
  console.log(MedicalDetails, 'MedicalDetails');
  const VaccinationStatus = MedicalDetails?.vaccinationStatus ?? [];
  const {
    state: { periodCategory, vaccinations }
  } = useMasterData();
  const periodOptions = periodCategory;
  const vaccineOptions = vaccinations;

  const {
    actions: { updateRecipientMediacalDetails, updateRecipientMediVaccination },
    state: { currentRecipientID }
  } = useRecipient();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(medicalDetailsSchema),
    defaultValues: {
      isLoadingBasic: false,
      height: MedicalDetails?.height ?? '',
      weight: MedicalDetails?.weight ?? '',
      bmi: MedicalDetails?.bmi ?? 0,
      isSmoker: MedicalDetails?.isSmoker ?? '0',
      isAlcohol: MedicalDetails?.isAlcohol ?? '0',
      periodOfAssistanceId: MedicalDetails?.periodOfAssistanceId ?? undefined,
      isDrugs: MedicalDetails?.isDrugs ?? '0',
      isHypertesnsion: MedicalDetails?.isHypertesnsion ?? '0',
      isDiabetes: MedicalDetails?.isDiabetes ?? '0',
      isCad: MedicalDetails?.isCad ?? '0',
      isOtherLungDisease: MedicalDetails?.isOtherLungDisease ?? '0',
      isEpilepsy: MedicalDetails?.isEpilepsy ?? '0',
      hepatitisB: MedicalDetails?.hepatitisB ?? 'NoHistory',
      hepatitisC: MedicalDetails?.hepatitisC ?? 'NoHistory',
      historyOfTb: MedicalDetails?.historyOfTb ?? '0',
      historyOfPeripheralvascularDisease: MedicalDetails?.historyOfPeripheralvascularDisease ?? '0',
      historyOfPreviousTransplant: MedicalDetails?.historyOfPreviousTransplant ?? '0',
      organTransplanted: MedicalDetails?.organTransplanted ?? '',
      historyOfCovid: MedicalDetails?.historyOfCovid ?? '0',
      covidFreePeriodId: MedicalDetails?.covidFreePeriodId ?? undefined,
      historyOfMalignancy: MedicalDetails?.historyOfMalignancy ?? '0',
      typeofMalignancy: MedicalDetails?.typeofMalignancy ?? '',
      durationofremissionId: MedicalDetails?.durationofremissionId ?? undefined,
      hbsAg: MedicalDetails?.hbsAg ?? 'Negative',
      antiHbsAg: MedicalDetails?.antiHbsAg ?? 'Negative',
      hcv: MedicalDetails?.hcv ?? 'Negative',
      epsteinBarr: MedicalDetails?.epsteinBarr ?? 'Negative',
      hiv: MedicalDetails?.hiv ?? 'Negative',
      cmv: MedicalDetails?.cmv ?? 'Negative',
      vaccinationStatus:
        VaccinationStatus.length > 0
          ? VaccinationStatus
          : [
              {
                id: 0,
                recipientId: 0,
                vaccinationId: undefined,
                vaccinationDate: null
              }
            ]
    }
  });

  useEffect(() => {
    if (MedicalDetails) {
      reset({
        height: MedicalDetails?.height ?? '',
        weight: MedicalDetails?.weight ?? '',
        bmi: MedicalDetails?.bmi ?? 0,
        isSmoker: MedicalDetails?.isSmoker ?? '0',
        isAlcohol: MedicalDetails?.isAlcohol ?? '0',
        periodOfAssistanceId: MedicalDetails?.periodOfAssistanceId ?? undefined,
        isDrugs: MedicalDetails?.isDrugs ?? '0',
        isHypertesnsion: MedicalDetails?.isHypertesnsion ?? '0',
        isDiabetes: MedicalDetails?.isDiabetes ?? '0',
        isCad: MedicalDetails?.isCad ?? '0',
        isOtherLungDisease: MedicalDetails?.isOtherLungDisease ?? '0',
        isEpilepsy: MedicalDetails?.isEpilepsy ?? '0',
        hepatitisB: MedicalDetails?.hepatitisB ?? 'NoHistory',
        hepatitisC: MedicalDetails?.hepatitisC ?? 'NoHistory',
        historyOfTb: MedicalDetails?.historyOfTb ?? '0',
        historyOfPeripheralvascularDisease: MedicalDetails?.historyOfPeripheralvascularDisease ?? '0',
        historyOfPreviousTransplant: MedicalDetails?.historyOfPreviousTransplant ?? '0',
        organTransplanted: MedicalDetails?.organTransplanted ?? '',
        historyOfCovid: MedicalDetails?.historyOfCovid ?? '0',
        covidFreePeriodId: MedicalDetails?.covidFreePeriodId ?? undefined,
        historyOfMalignancy: MedicalDetails?.historyOfMalignancy ?? '0',
        typeofMalignancy: MedicalDetails?.typeofMalignancy ?? '',
        durationofremissionId: MedicalDetails?.durationofremissionId ?? undefined,
        hbsAg: MedicalDetails?.hbsAg ?? 'Negative',
        antiHbsAg: MedicalDetails?.antiHbsAg ?? 'Negative',
        hcv: MedicalDetails?.hcv ?? 'Negative',
        epsteinBarr: MedicalDetails?.epsteinBarr ?? 'Negative',
        hiv: MedicalDetails?.hiv ?? 'Negative',
        cmv: MedicalDetails?.cmv ?? 'Negative',
        vaccinationStatus:
          VaccinationStatus.length > 0
            ? VaccinationStatus
            : [
                {
                  id: 0,
                  recipientId: 0,
                  vaccinationId: undefined,
                  vaccinationDate: null
                }
              ]
      });
    }
  }, [MedicalDetails, reset]);
  const isAlcohol = watch('isAlcohol');
  const historyOfPreviousTransplant = watch('historyOfPreviousTransplant');
  const historyOfCovid = watch('historyOfCovid');
  const historyOfMalignancy = watch('historyOfMalignancy');

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const weight: any = watch('weight');
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const height: any = watch('height');
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const vaccinationStatus: any = watch('vaccinationStatus');
  const isLoadingBasic = watch('isLoadingBasic');
  console.log(vaccinationStatus, 'vaccinationStatus', isAlcohol, typeof isAlcohol);

  const [bmi, setBmi] = useState<number>(0);
  console.log(bmi, 'bmibmibmibmibmi', typeof bmi);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(Number(calculatedBmi));
    } else {
      setBmi(0);
    }
  }, [height, weight]);

  const { fields, append, remove } = useFieldArray({ control, name: 'vaccinationStatus' });
  const handleAddVaccinStatus = () => {
    append({
      id: 0,
      recipientId: 0,
      vaccinationId: undefined,
      vaccinationDate: null
    });
  };
  const getFilteredOptions = (index: number) => {
    const selectedConsultantIds = watch('vaccinationStatus').map((field) => field?.vaccinationId) || [];
    return vaccineOptions.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (option: { value: string | number | any }) =>
        !selectedConsultantIds.includes(option.value) ||
        option.value === watch(`vaccinationStatus.${index}.vaccinationId`)
    );
  };

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setValue('isLoadingBasic', true);
    if (MedicalDetails?.id) {
      const recipientID = Number(MedicalDetails?.recipientId);
      const payload = {
        id: MedicalDetails?.id,
        recipientId: MedicalDetails?.recipientId,
        height: data.height,
        weight: data.weight,
        bmi: bmi,
        isSmoker: data.isSmoker === '1' ? true : false,
        isAlcohol: data.isAlcohol === '1' ? true : false,
        periodOfAssistanceId: data.periodOfAssistanceId,
        isDrugs: data.isDrugs === '1' ? true : false,
        isHypertesnsion: data.isHypertesnsion === '1' ? true : false,
        isDiabetes: data.isDiabetes === '1' ? true : false,
        isCad: data.isCad === '1' ? true : false,
        isOtherLungDisease: data.isOtherLungDisease === '1' ? true : false,
        isEpilepsy: data.isEpilepsy === '1' ? true : false,
        hepatitisB: data.hepatitisB,
        hepatitisC: data.hepatitisC,
        historyOfTb: data.historyOfTb === '1' ? true : false,
        historyOfPeripheralvascularDisease: data.historyOfPeripheralvascularDisease === '1' ? true : false,
        historyOfPreviousTransplant: data.historyOfPreviousTransplant === '1' ? true : false,
        organTransplanted: data.organTransplanted,
        historyOfCovid: data.historyOfCovid === '1' ? true : false,
        covidFreePeriodId: data.covidFreePeriodId,
        historyOfMalignancy: data.historyOfMalignancy === '1' ? true : false,
        typeofMalignancy: data.typeofMalignancy,
        durationofremissionId: data.durationofremissionId,
        hbsAg: data.hbsAg,
        antiHbsAg: data.antiHbsAg,
        hcv: data.hcv,
        epsteinBarr: data.epsteinBarr,
        hiv: data.hiv,
        cmv: data.cmv
      };
      updateRecipientMediacalDetails(recipientID, payload, () => {
        if (vaccinationStatus?.[0]?.vaccinationId !== undefined) {
          vaccinationStatus?.map((obj: { recipientId: number; id: number }, i: number) => {
            obj.recipientId = recipientID ? recipientID : 0;
            obj.id = MedicalDetails?.vaccinationStatus?.[i]?.id ? MedicalDetails?.vaccinationStatus?.[i]?.id : 0;
          });
          console.log(vaccinationStatus, 'vaccinationStatus`');

          updateRecipientMediVaccination(recipientID, vaccinationStatus, () => {
            onNext(data);
          });
        } else {
          onNext(data);
        }
      });
    } else {
      const payload = {
        recipientId: currentRecipientID,
        height: data.height,
        weight: data.weight,
        bmi: bmi,
        isSmoker: data.isSmoker === '1' ? true : false,
        isAlcohol: data.isAlcohol === '1' ? true : false,
        periodOfAssistanceId: data.periodOfAssistanceId,
        isDrugs: data.isDrugs === '1' ? true : false,
        isHypertesnsion: data.isHypertesnsion === '1' ? true : false,
        isDiabetes: data.isDiabetes === '1' ? true : false,
        isCad: data.isCad === '1' ? true : false,
        isOtherLungDisease: data.isOtherLungDisease === '1' ? true : false,
        isEpilepsy: data.isEpilepsy === '1' ? true : false,
        hepatitisB: data.hepatitisB,
        hepatitisC: data.hepatitisC,
        historyOfTb: data.historyOfTb === '1' ? true : false,
        historyOfPeripheralvascularDisease: data.historyOfPeripheralvascularDisease === '1' ? true : false,
        historyOfPreviousTransplant: data.historyOfPreviousTransplant === '1' ? true : false,
        organTransplanted: data.organTransplanted,
        historyOfCovid: data.historyOfCovid === '1' ? true : false,
        covidFreePeriodId: data.covidFreePeriodId,
        historyOfMalignancy: data.historyOfMalignancy === '1' ? true : false,
        typeofMalignancy: data.typeofMalignancy,
        durationofremissionId: data.durationofremissionId,
        hbsAg: data.hbsAg,
        antiHbsAg: data.antiHbsAg,
        hcv: data.hcv,
        epsteinBarr: data.epsteinBarr,
        hiv: data.hiv,
        cmv: data.cmv
      };
      updateRecipientMediacalDetails(currentRecipientID, payload, () => {
        if (vaccinationStatus?.[0]?.vaccinationId !== undefined) {
          vaccinationStatus?.map((obj: { recipientId: number }) => (obj.recipientId = currentRecipientID));
          updateRecipientMediVaccination(currentRecipientID, vaccinationStatus, () => {
            onNext(data);
          });
        } else {
          onNext(data);
        }
      });
    }
  };
  console.log(errors, 'errrrrrrrrrrrrrrrrrrrrrrr');

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <MUIContainer maxWidth="xl">
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px] ">Physic Details</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                control={control}
                name="height"
                label="Height"
                suffixComponent={'cm'}
                fullWidth
                required
                disabled={readOnly}
                type={'number'}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                control={control}
                name="weight"
                label="Weight"
                suffixComponent={'kg'}
                fullWidth
                required
                disabled={readOnly}
                type={'number'}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <Input
                className="!text-[#A1999F]"
                label="BMI"
                value={Number(bmi)}
                placeholder="Enter here"
                fullWidth
                type={'number'}
              />
            </Grid>
          </Grid>
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px] !mt-6">Medical History</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Smoker" name={'isSmoker'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Alcohol" name={'isAlcohol'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              {isAlcohol === '1' && (
                <FormSelect
                  menuOptions={periodOptions}
                  control={control}
                  name={`periodOfAssistanceId`}
                  label="Period of Abstinence"
                  fullWidth
                  disabled={readOnly}
                  required
                />
              )}
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Drugs" name={'isDrugs'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Hypertension" name={'isHypertesnsion'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Diabetes" name={'isDiabetes'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="CAD" name={'isCad'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup
                label="Bronchial Asthma/COPD/Other Lung Disease"
                name={'isOtherLungDisease'}
                row
                control={control}
              >
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Epilepsy" name={'isEpilepsy'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Hepatitis B" name={'hepatitisB'} row control={control}>
                <AtomRadio label="Current" value={'Current'} disabled={readOnly} />
                <AtomRadio label="Healed" value={'Healed'} disabled={readOnly} />
                <AtomRadio label="No History" value={'NoHistory'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Hepatitis C" name={'hepatitisC'} row control={control}>
                <AtomRadio label="Current" value={'Current'} disabled={readOnly} />
                <AtomRadio label="Healed" value={'Healed'} disabled={readOnly} />
                <AtomRadio label="No History" value={'NoHistory'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="History of TB" name={'historyOfTb'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup
                label="History of Peripheral Vascular Disease"
                name={'historyOfPeripheralvascularDisease'}
                row
                control={control}
              >
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup
                label="History of Previous Transplant"
                name={'historyOfPreviousTransplant'}
                row
                control={control}
              >
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              {historyOfPreviousTransplant === '1' && (
                <FormInput
                  control={control}
                  name="organTransplanted"
                  label="Organ Transplanted"
                  fullWidth
                  required
                  disabled={readOnly}
                  minRows={3}
                  multiline
                />
              )}
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="History of Covid" name={'historyOfCovid'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              {historyOfCovid === '1' && (
                <FormSelect
                  menuOptions={periodOptions}
                  control={control}
                  name={`covidFreePeriodId`}
                  label="Covid Free Period"
                  fullWidth
                  disabled={readOnly}
                  required
                />
              )}
            </Grid>
          </Grid>
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px] !mt-8 ">Malignancy Status</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="History of Malignancy" name={'historyOfMalignancy'} row control={control}>
                <AtomRadio label="Yes" value={'1'} disabled={readOnly} />
                <AtomRadio label="No" value={'0'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            {historyOfMalignancy === '1' && (
              <>
                <Grid item xs={12} xl={4} md={6}>
                  <FormInput
                    control={control}
                    name="typeofMalignancy"
                    label="Type of Malignancy"
                    fullWidth
                    disabled={readOnly}
                    required
                    minRows={3}
                    multiline
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormSelect
                    menuOptions={periodOptions}
                    control={control}
                    name={`durationofremissionId`}
                    label="Duration of remission"
                    fullWidth
                    disabled={readOnly}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px] !mt-8 ">Virology Status</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="HbsAg" name={'hbsAg'} row control={control} isRequired>
                <AtomRadio label="Positive" value={'Positive'} disabled={readOnly} />
                <AtomRadio label="Negative" value={'Negative'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Anti HBsAg" name={'antiHbsAg'} row control={control}>
                <AtomRadio label="Positive" value={'Positive'} disabled={readOnly} />
                <AtomRadio label="Negative" value={'Negative'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="HCV" name={'hcv'} row control={control}>
                <AtomRadio label="Positive" value={'Positive'} disabled={readOnly} />
                <AtomRadio label="Negative" value={'Negative'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Epstein Barr" name={'epsteinBarr'} row control={control}>
                <AtomRadio label="Positive" value={'Positive'} disabled={readOnly} />
                <AtomRadio label="Negative" value={'Negative'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="HIV" name={'hiv'} row control={control} isRequired>
                <AtomRadio label="Positive" value={'Positive'} disabled={readOnly} />
                <AtomRadio label="Negative" value={'Negative'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="CMV" name={'cmv'} row control={control}>
                <AtomRadio label="Positive" value={'Positive'} disabled={readOnly} />
                <AtomRadio label="Negative" value={'Negative'} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Grid>
          </Grid>
          <Text className="text-[#804595] !font-[600] !text-[19px] !mt-8 !mb-4">Vaccination Status</Text>
          <Grid container spacing={2} mt={2}>
            {fields.map((field, index) => {
              return (
                <Box key={field.id} className="w-full">
                  <Grid container spacing={2} className="relative left-4 !mt-[0px]">
                    <Grid item xs={12} xl={4} md={6}>
                      <FormSelect
                        menuOptions={getFilteredOptions(index)}
                        control={control}
                        name={`vaccinationStatus.${index}.vaccinationId`}
                        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
                        onChange={(selectedOption: any) => {
                          setValue(`vaccinationStatus.${index}.vaccinationId`, selectedOption?.value);
                        }}
                        label="Vaccination Name"
                        fullWidth
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12} xl={4} md={6}>
                      <AtomDatePicker
                        control={control}
                        name={`vaccinationStatus.${index}.vaccinationDate`}
                        label="Vaccination Date"
                        fullWidth
                        disabled={readOnly}
                      />
                    </Grid>

                    <Grid item xs={12} xl={4} md={12}>
                      <Box className="flex items-center gap-4">
                        {!readOnly && (
                          <>
                            {index > 0 && <DeleteIcon onClick={() => remove(index)} className="cursor-pointer" />}
                            {index === 0 && (
                              <Button
                                variant="text"
                                className="!bg-transparent !text-[#C967A2] !font-[500] !text-[16px] disabled:opacity-50"
                                onClick={handleAddVaccinStatus}
                                disabled={readOnly}
                              >
                                + Add Vaccination
                              </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Grid>
        </MUIContainer>

        {isPreview && (
          <RecipientFooter
            onBack={() => onBack(currentRecipientID)}
            onNext={handleSubmit(onSubmit)}
            forCancel={forCancel}
            isLoadingBasic={isLoadingBasic}
          />
        )}
      </form>
    </div>
  );
};
export default MedicalDetails;
