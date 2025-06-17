import { AtomDatePicker, Box, Button, FormInput, FormSelect, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DonorApnoeaSchema } from '../validators';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import dayjs from 'dayjs';
import { toast } from '@/utils/toast';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useDonor } from '../../DonorContext';
import { DonorBasicConsentType } from '@/types/donor';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { causeOfDeath } from '@/types/common.type';
import { Container, Grid } from '@mui/material';

interface DonorApnoeaDetailsProps {
  isPopupShow?: boolean;
}

const DonorApnoeaDetails: React.FC<DonorApnoeaDetailsProps> = () => {
  const { donorId } = useParams();
  const { state } = useLocation();
  console.log(state, 'locationlocation');
  const {
    state: { genders, causeOfDeath, states }
  } = useMasterData();
  const {
    action: { insertDonorConsentBasicDetails, getDonarDataByID, updateDonorConsentBasicDetails },
    state: { getDonarDetails }
  } = useDonor();
  console.log(getDonarDetails, 'getDonarDetails');

  useEffect(() => {
    if (donorId) {
      getDonarDataByID(Number(donorId));
    }
  }, [donorId]);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(DonorApnoeaSchema),
    defaultValues: {
      name: '',
      dateOfBirth: '',
      age: 0,
      genderId: 0,
      isMlc: '0',
      arcaseNumber: '',
      causeOfBrainDeathId: 0,
      dateOfAccident: '',
      admissionDate: '',
      noOfDaysOnVentilator: '',
      stateId: 0,
      firstApnoea: '0',
      apnoeaDateandTime: ''
    }
  });
  useEffect(() => {
    const { donor, medicalHistory, apnoeaTest } = getDonarDetails || {};
    reset({
      name: donor?.name,
      dateOfBirth: donor?.dateOfBirth,
      age: donor?.age,
      genderId: donor?.genderId,
      isMlc: donor?.isMlc === 1 ? '1' : '0',
      arcaseNumber: donor?.arcaseNumber,
      causeOfBrainDeathId: medicalHistory?.medicalHistory?.causeofBrainDeathId,
      dateOfAccident: medicalHistory?.medicalHistory?.dateOfOnsetIllness,
      admissionDate: medicalHistory?.medicalHistory?.admissionDate,
      noOfDaysOnVentilator: medicalHistory?.medicalHistory?.noOfDaysInVentilator,
      stateId: donor?.stateId,
      firstApnoea: apnoeaTest?.length > 0 ? '1' : '0',
      apnoeaDateandTime: apnoeaTest?.[0]?.datetime
    });
  }, [reset, getDonarDetails]);
  console.log(errors, 'errors');

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const dateOfBirth = watch('dateOfBirth');
  const isMlc = watch('isMlc');
  const firstApnoea = watch('firstApnoea');
  const navigate = useNavigate();

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Number(age) || 0;
  };

  useEffect(() => {
    const age: number = calculateAge(dateOfBirth); //.toString()
    setValue('age', age);
  }, [dateOfBirth, setValue]);
  const today = dayjs();
  const maxDate = today.subtract(0, 'year');
  const minDate = today.subtract(140, 'year');

  const onSubmit = (data: DonorBasicConsentType) => {
    console.log(data, 'datadata');
    const payload = {
      hospitalId: state.hospitalId,
      name: data.name,
      genderId: data.genderId,
      dateOfBirth: data.dateOfBirth,
      bloodGroupId: 4,
      isMlc: data.isMlc,
      arcaseNumber: data.arcaseNumber,
      height: 0,
      weight: 0,
      bmi: 0,
      isConsentGiven: 0,
      statusId: 1,
      stateId: 1,
      apnoeaDetails: [
        {
          preAbg: '',
          postAbg: '',
          datetime: data.apnoeaDateandTime
        }
      ],
      noOfDaysOnVentilator: data.noOfDaysOnVentilator,
      admissionDate: data.admissionDate,
      dateOfAccident: data.dateOfAccident,
      causeOfBrainDeathId: data.causeOfBrainDeathId
    };
    console.log(payload, 'payload1');
    return
    if (donorId) {
      updateDonorConsentBasicDetails(Number(donorId), payload, () => {
        toast('Donor details updated was successfully', 'success');
        navigate('/donors');
      });
    } else {
      insertDonorConsentBasicDetails(payload, () => {
        toast('Donor details added was successfully', 'success');
        navigate('/donors');
      });
    }
  };

  return (
    <Container maxWidth="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mt={3}>
          <Text className="!text-[#804595] !text-[19px] !font-[500]">Donor Details</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="name" label="Donor Name" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker
                control={control}
                minDate={minDate}
                maxDate={maxDate}
                name="dateOfBirth"
                label="Date of Birth"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="age" type="number" label="Age" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect menuOptions={genders} control={control} name="genderId" label="Gender" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Is MLC Case?" name="isMlc" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>
            {isMlc === '1' && (
              <Grid item xs={12} xl={4} md={6}>
                <FormInput control={control} name="arcaseNumber" label="AR Case Number" fullWidth required />
              </Grid>
            )}
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={causeOfDeath.map((c: causeOfDeath) => ({ label: c.name, value: c.id })) ?? []}
                control={control}
                name="causeOfBrainDeathId"
                label="Cause of Brain Death"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker control={control} name="dateOfAccident" label="Date of Accident" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <AtomDatePicker control={control} name="admissionDate" label="Date of Admission" fullWidth required />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                control={control}
                name="noOfDaysOnVentilator"
                label="No of Days on Ventilator"
                fullWidth
                required
              />
              <span className="absolute top-0 p-2 bg-[#8045954D] right-0 rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] w-[70px] text-center">
                Days
              </span>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={states}
                control={control}
                name={`stateId`}
                label="State"
                fullWidth
                required
                // disabled={readOnly}
              />
            </Grid>
          </Grid>
          <Text className="!text-[#80459580] !text-[16px] !font-[600]">First Apnoea Details</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="First Apnoea Status" name="firstApnoea" row control={control} isRequired>
                <AtomRadio label="Yes" value="1" />
                <AtomRadio label="No" value="0" />
              </FormAtomRadioGroup>
            </Grid>

            {firstApnoea === '1' && (
              <Grid item xs={12} xl={4} md={6}>
                <AtomDatePicker control={control} name="apnoeaDateandTime" label="Date of Apnoea" fullWidth required />
              </Grid>
            )}
          </Grid>

          {/* <Box className=" flex flex-col mt-[28px]">
            <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="name" label="Donor Name" fullWidth required />
              </Box>
              <Box className=" w-full md:w-[calc(33.33%-40px)]">
                <AtomDatePicker
                  control={control}
                  minDate={minDate}
                  maxDate={maxDate}
                  name="dateOfBirth"
                  label="Date of Birth"
                  required
                  fullWidth
                />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="age" type="number" label="Age" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormSelect menuOptions={genders} control={control} name="genderId" label="Gender" fullWidth required />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormAtomRadioGroup label="Is MLC Case?" name="isMlc" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Box>
              {isMlc === '1' && (
                <Box className="w-full md:w-[calc(33.33%-40px)] ">
                  <FormInput control={control} type='number' name="arcaseNumber" label="AR Case Number" fullWidth required />
                </Box>
              )}

              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormSelect
                  menuOptions={causeOfDeath.map((c: causeOfDeath) => ({ label: c.name, value: c.id })) ?? []}
                  control={control}
                  name="causeOfBrainDeathId"
                  label="Cause of Brain Death"
                  fullWidth
                  required
                />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <AtomDatePicker control={control} name="dateOfAccident" label="Date of Accident" fullWidth required />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <AtomDatePicker control={control} name="admissionDate" label="Date of Admission" fullWidth required />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] relative">
                <FormInput
                  control={control}
                  name="noOfDaysOnVentilator"
                  label="No of Days on Ventilator"
                  fullWidth
                  required
                />
                <span className="absolute top-0 p-2 bg-[#8045954D] right-0 rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] w-[70px] text-center">
                  Days
                </span>
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormSelect
                  menuOptions={states}
                  control={control}
                  name={`stateId`}
                  label="State"
                  fullWidth
                  required
                  disabled={readOnly}
                />
                <FormInput control={control} name="stateId" label="State" fullWidth required />
              </Box>
            </Box>
          </Box> */}
        </Box>
        {/* <Box className="mt-[32px]">
          <Text className="!text-[#80459580] !text-[16px] !font-[600]">First Apnoea Details</Text>
          <Box className="flex flex-col mt-[16px]">
            <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormAtomRadioGroup label="First Apnoea Status" name="firstApnoea" row control={control} isRequired>
                  <AtomRadio label="Yes" value="1" />
                  <AtomRadio label="No" value="0" />
                </FormAtomRadioGroup>
              </Box>
              {firstApnoea === '1' && (
                <Box className="w-full md:w-[calc(33.33%-40px)] ">
                  <AtomDatePicker
                    control={control}
                    name="apnoeaDateandTime"
                    label="Date of Apnoea"
                    fullWidth
                    required
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box> */}
        <Box className="mt-[50px] flex items-center justify-end gap-[22px] !mb-[50px]">
          <Button variant="outlined" className="w-[164px]" onClick={() => navigate('/donors')}>
            Cancel
          </Button>
          {donorId ? (
            <Button variant="contained" className="w-[164px]" onClick={handleSubmit(onSubmit)}>
              Update
            </Button>
          ) : (
            <Button variant="contained" className="w-[164px]" onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default DonorApnoeaDetails;
