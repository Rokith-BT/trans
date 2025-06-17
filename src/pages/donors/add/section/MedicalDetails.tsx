import { AtomDatePicker, Box, FormInput, FormSelect, MUIContainer, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MedicalDetailsSchema, MedicalDetailsType } from '../validators';
import { DropDownIcon } from '@/assets/icons';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import data from '@/data/selectData.json';
import DonorFooterButton from './DonorFooterButton';
import { useDonor } from '../../DonorContext';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { causeOfDeath } from '@/types/common.type';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
interface MedicalDetailsProps {
  medicaldetailData: MedicalDetailsType | null;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onBack?: any;
  isPreview?: boolean;
  readOnly?: boolean;
}
const MedicalDetails: React.FC<MedicalDetailsProps> = ({ medicaldetailData, onNext, onBack, isPreview, readOnly }) => {
  console.log(medicaldetailData, 'medicaldetailData');

  const [openCovid, setCovid] = useState(false);
  const {
    state: { periodCategory, causeOfDeath }
  } = useMasterData();
  const causeOfDeathOptions = causeOfDeath.map((c: causeOfDeath) => ({ label: c.name, value: c.id })) ?? [];
 console.log(causeOfDeathOptions,'efvescfe');
 
  const periodOptions = periodCategory;
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: zodResolver(MedicalDetailsSchema),
    defaultValues: {
      pulseRate: medicaldetailData?.pulseRate || '',
      bpSystolic: medicaldetailData?.bpSystolic || '',
      bpDiastolic: medicaldetailData?.bpDiastolic || '',
      map: medicaldetailData?.map || '',
      urineOutput: medicaldetailData?.urineOutput || '',
      cvp: medicaldetailData?.cvp || '',
      spo2: medicaldetailData?.spo2 || '',
      temperature: medicaldetailData?.temperature || '',
      causeOfBrainDeathId: medicaldetailData?.causeOfBrainDeathId || 0,
      noOfDaysInVentilator: medicaldetailData?.noOfDaysInVentilator || '',
      dateOfOnsetIllness: medicaldetailData?.dateOfOnsetIllness || '',
      admissionDate: medicaldetailData?.admissionDate || '',
      tentativeRetrievalDate: medicaldetailData?.tentativeRetrievalDate || '',
      assessmentDate: medicaldetailData?.assessmentDate || '',
      isSmoking: medicaldetailData?.isSmoking || '0',
      isAlcoholic: medicaldetailData?.isAlcoholic || '0',
      isDiabetes: medicaldetailData?.isDiabetes || '0',
      isHt: medicaldetailData?.isHt || '0',
      isCoronaryArterial: medicaldetailData?.isCoronaryArterial || '0',
      isRenal: medicaldetailData?.isRenal || '0',
      isLiverDisease: medicaldetailData?.isLiverDisease || '0',
      isCovid: medicaldetailData?.isCovid || '0',
      covidFreePeriodId: medicaldetailData?.covidFreePeriodId || undefined
    }
  });
  useEffect(() => {
    reset({
      pulseRate: medicaldetailData?.pulseRate || '',
      bpSystolic: medicaldetailData?.bpSystolic || '',
      bpDiastolic: medicaldetailData?.bpDiastolic || '',
      map: medicaldetailData?.map || '',
      urineOutput: medicaldetailData?.urineOutput || '',
      cvp: medicaldetailData?.cvp || '',
      spo2: medicaldetailData?.spo2 || '',
      temperature: medicaldetailData?.temperature || '',
      causeOfBrainDeathId: medicaldetailData?.causeOfBrainDeathId || 0,
      noOfDaysInVentilator: medicaldetailData?.noOfDaysInVentilator || '',
      dateOfOnsetIllness: medicaldetailData?.dateOfOnsetIllness || '',
      admissionDate: medicaldetailData?.admissionDate || '',
      tentativeRetrievalDate: medicaldetailData?.tentativeRetrievalDate || '',
      assessmentDate: medicaldetailData?.assessmentDate || '',
      isSmoking: medicaldetailData?.isSmoking || '0',
      isAlcoholic: medicaldetailData?.isAlcoholic || '0',
      isDiabetes: medicaldetailData?.isDiabetes || '0',
      isHt: medicaldetailData?.isHt || '0',
      isCoronaryArterial: medicaldetailData?.isCoronaryArterial || '0',
      isRenal: medicaldetailData?.isRenal || '0',
      isLiverDisease: medicaldetailData?.isLiverDisease || '0',
      isCovid: medicaldetailData?.isCovid || '0',
      covidFreePeriodId: medicaldetailData?.covidFreePeriodId || undefined
    });
  }, [reset, medicaldetailData]);
  console.log(errors, 'errorserrors');

  const {
    action: { updateDonarMedicalDetails },
    state: { currentDonarId }
  } = useDonor();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log('Medical Details ', data);
    const payload = {
      id: data?.id || 0,
      isSmoking: Number(data?.isSmoking),
      isAlcoholic: Number(data?.isAlcoholic),
      isDiabetes: Number(data?.isDiabetes),
      isHt: Number(data?.isHt),
      isCoronaryArterial: Number(data?.isCoronaryArterial),
      isRenal: Number(data?.isRenal),
      isLiverDisease: Number(data?.isLiverDisease),
      isCovid: Number(data?.isCovid),
      covidFreePeriodId: Number(data?.covidFreePeriodId),
      ...data
    };
    updateDonarMedicalDetails(currentDonarId, payload, () => {
      onNext(payload);
    });
  };
  const today = dayjs();
  const maxDate = today.subtract(0, 'year');
  return (
    <MUIContainer maxWidth="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={8}>
          {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
          <Text className="!text-[#804595] !text-[19px] !font-[500]">Medical Details</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput control={control} name="pulseRate" label="Pluse Rate" fullWidth required />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-[1px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] text-center">
                Per Minute
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput control={control} name="bpSystolic" label="BP Systolic" fullWidth required />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-[1px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
                mmgh
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput control={control} name="bpDiastolic" label="BP Diastolic" fullWidth required />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-0 rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
                mmgh
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="map" label="MAP" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput control={control} name="urineOutput" label="Urine Output" fullWidth required />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-[1px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] w-[70px] text-center flex">
                ml/hr <DropDownIcon />
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput multiline minRows={4} control={control} name="cvp" label="CVP" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput control={control} name="spo2" label="SPO2" fullWidth required />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-[1px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] w-[100px] text-center flex">
                Percentage
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput control={control} name="temperature" label="Temperature" fullWidth required />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-[1px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] w-[100px] text-center flex">
                Farenhite
              </span>
            </Grid>
          </Grid>
          <Text className="!text-[#804595] !text-[16px] !font-[500] !mt-6">Medical Deatils</Text>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={causeOfDeathOptions}
                control={control}
                name={'causeOfBrainDeathId'}
                label="Cause of Brain Death"
                fullWidth
                disabled={readOnly}
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6} className="relative">
              <FormInput
                type="number"
                control={control}
                name="noOfDaysInVentilator"
                label="No of Days in Ventilator"
                fullWidth
                required
              />
              <span className="absolute top-4 p-2 bg-[#8045954D] right-[1px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] w-[100px] text-center ">
                Days
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker control={control} name="dateOfOnsetIllness" label="Date of Accident" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker control={control} name="admissionDate" label="Date of Admission" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker
                control={control}
                name="tentativeRetrievalDate"
                label="Tentative Retrieval Date & Time"
                fullWidth
                required
                // minDate={minDate}
                maxDate={maxDate}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker
                control={control}
                name="assessmentDate"
                label="Assessment Date & Time"
                fullWidth
                required
                maxDate={maxDate}
              />
            </Grid>
          </Grid>
          <Text className="!text-[#804595] !text-[19px] !font-[700] !mt-6">Medical History</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="History of Smoking" name="isSmoking" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="History of Alcohol" name="isAlcoholic" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Diabets" name="isDiabetes" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="HT" name="isHt" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup
                label="Cpronary Arterial Disease"
                name="isCoronaryArterial"
                row
                control={control}
                isRequired
              >
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Renal Disease" name="isRenal" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Liver Disease" name="isLiverDisease" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="History of Covid" name="isCovid" row control={control} isRequired>
                {data.radioOption.map((item, index) => (
                  <AtomRadio
                    key={index}
                    value={item.value}
                    label={item.label}
                    onClick={() => setCovid(item.required)}
                  />
                ))}
              </FormAtomRadioGroup>
            </Grid>
            {openCovid && (
              <Grid item xs={12} xl={4} md={6}>
                <FormSelect
                  menuOptions={periodOptions}
                  control={control}
                  name={`covidFreePeriodId`}
                  label="Covid Free Period"
                  fullWidth
                  disabled={false}
                  required
                />
              </Grid>
            )}
          </Grid>
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
    </MUIContainer>
  );
};

export default MedicalDetails;
