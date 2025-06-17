/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtomDatePicker, Box, Button, FormFileInput, FormInput, FormSelect, MUIContainer, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AddDonorSchema } from '../validators';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import DonorFooterButton from './DonorFooterButton';
import dayjs from 'dayjs';
import data from '@/data/selectData.json';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { useDonor } from '../../DonorContext';
import { DonorDetailsTypes } from '@/types/donor';
import { APIService } from '@/services';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';
import VideoRecordingDialog from '../../dialog/VideoRecordingDialog';
import VideoIcon from '@/assets/icons/VideoIcon';
import AudioIcon from '@/assets/icons/AudioIcon';
import { Checkbox, FormControlLabel, FormGroup, FormHelperText, Grid } from '@mui/material';

interface DonorDetailsProps {
  donorDetaildata: DonorDetailsTypes | null;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: any) => void;
  readOnly: boolean;
  isPreview: boolean;
  isConsentGiven: boolean;
  hospitalId: string | number;
}
interface UploadResponse {
  data: {
    fileResponse: { fullfilepath: string }[];
  };
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const DonorDetails: React.FC<DonorDetailsProps> = ({
  onNext,
  donorDetaildata,
  isPreview,
  readOnly,
  isConsentGiven,
  hospitalId
}) => {
  console.log(donorDetaildata, 'donorDetaildata', hospitalId);
  const [openImgModal, setOpenImgModal] = useState(false);
  const [fileLabel, setFileLabel] = useState('');
  const [file, setFile] = useState('');
  const [openVidRec, setOpenVidRec] = useState(false);
  const [audOrVid, setAudOrVid] = useState(false);
  const {
    state: { relationType, genders, bloodGroup }
  } = useMasterData();
  const {
    action: { insertDonarDetails, updateDonarDetails, updateDonarConsentDoc }
  } = useDonor();
  const {
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm({
    resolver: zodResolver(AddDonorSchema),
    defaultValues: {
      name: donorDetaildata?.name || '',
      dateOfBirth: donorDetaildata?.dateOfBirth || '',
      age: donorDetaildata?.age || '',
      genderId: donorDetaildata?.genderId || '',
      bloodGroupId: donorDetaildata?.bloodGroupId || '',
      height: donorDetaildata?.height || '',
      weight: donorDetaildata?.weight || '',
      bmi: donorDetaildata?.bmi || 0,
      isMlc: donorDetaildata?.isMlc || '0',
      arcaseNumber: donorDetaildata?.arcaseNumber || '',
      relationshipId: donorDetaildata?.relationshipId || '',
      firstName: donorDetaildata?.firstName || '',
      lastName: donorDetaildata?.lastName || '',
      email: donorDetaildata?.email || '',
      phoneNumber1: donorDetaildata?.phoneNumber1 || '',
      phoneNumber2: donorDetaildata?.phoneNumber2 || '',
      countryCode1: donorDetaildata?.countryCode1 || '',
      countryCode2: donorDetaildata?.countryCode2 || '',
      letter1: donorDetaildata?.letter1 || '',
      letter2: donorDetaildata?.letter2 || '',
      written: donorDetaildata?.written || '',
      audio: donorDetaildata?.audio || '',
      video: donorDetaildata?.video || '',
      consent: {
        written: false,
        audio: false,
        video: false
      }
    }
  });
  const video = watch('video');
  const audio = watch('audio');
  useEffect(() => {
    reset({
      name: donorDetaildata?.name || '',
      dateOfBirth: donorDetaildata?.dateOfBirth || '',
      age: donorDetaildata?.age || '',
      genderId: donorDetaildata?.genderId || '',
      bloodGroupId: donorDetaildata?.bloodGroupId || '',
      height: donorDetaildata?.height || '',
      weight: donorDetaildata?.weight || '',
      bmi: donorDetaildata?.bmi || 0,
      isMlc: donorDetaildata?.isMlc || '0',
      arcaseNumber: donorDetaildata?.arcaseNumber || '',
      relationshipId: donorDetaildata?.relationshipId || '',
      firstName: donorDetaildata?.firstName || '',
      lastName: donorDetaildata?.lastName || '',
      email: donorDetaildata?.email || '',
      phoneNumber1: donorDetaildata?.phoneNumber1 || '',
      phoneNumber2: donorDetaildata?.phoneNumber2 || '',
      countryCode1: donorDetaildata?.countryCode1 || '',
      countryCode2: donorDetaildata?.countryCode2 || '',
      letter1: donorDetaildata?.letter1 || '',
      letter2: donorDetaildata?.letter2 || '',
      written: donorDetaildata?.written || '',
      audio: donorDetaildata?.audio || '',
      video: donorDetaildata?.video || '',
      consent: {
        written: donorDetaildata?.written ? true : false,
        audio: donorDetaildata?.audio ? true : false,
        video: donorDetaildata?.video ? true : false
      }
    });
  }, [reset, donorDetaildata]);

  const dateOfBirth = watch('dateOfBirth');
  const isMlc = watch('isMlc');
  const consent = watch('consent');
  useEffect(() => {
    if (isMlc === '0') setValue('arcaseNumber', '');
  }, [isMlc]);
  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age || 0;
  };

  useEffect(() => {
    const age: number = calculateAge(dateOfBirth); //.toString()
    setValue('age', age.toString());
  }, [dateOfBirth, setValue]);

  const today = dayjs();
  const maxDate = today.subtract(0, 'year');
  const minDate = today.subtract(140, 'year');
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const weight: any = watch('weight');
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const height: any = watch('height');
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const [bmi, setBmi] = useState<number>(0);
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(3);
      setBmi(Number(calculatedBmi));
    } else {
      setBmi(0);
    }
  }, [height, weight]);

  console.log('errors121218888 ', errors);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    console.log('donor details ', data);
    const isUpdating = !!donorDetaildata?.id;
    const donorId = isUpdating ? Number(donorDetaildata?.id) : undefined;
    const payload = {
      // id: donorDetaildata?.id || 0,
      consentId: donorDetaildata?.consentId || 0,
      donorId: donorDetaildata?.id || 0,
      relationshipId: data?.relationshipId,
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data.email,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: data.phoneNumber2,
      countryCode1: data.countryCode1,
      countryCode2: data.countryCode2,
      isPhone1Verified: 0,
      isPhone2Verified: 0,
      audio: '',
      video: '',
      written: '',
      transtanId: '',
      hospitalId: hospitalId,
      name: data.name,
      genderId: data?.genderId,
      dateOfBirth: data.dateOfBirth || '',
      bloodGroupId: Number(data.bloodGroupId),
      isMlc: data.isMlc,
      height: data.height,
      weight: data.weight,
      bmi: bmi,
      arcaseNumber: data.arcaseNumber || 0,
      isConsentGiven: isConsentGiven ? 1 : 0,
      status: ''
    };

    const fileFormDatas = async (files: File, id: number | string) => {
      try {
        // setLoader(true);
        if (!files) {
          console.error('No file provided');
          return '';
        }
        const formData = new FormData();
        formData.append('fileUploadRequests[0].data', files);
        formData.append('fileUploadRequests[0].path', `donor/${id}/profile`);
        formData.append('fileUploadRequests[0].filename', files.name);
        formData.append('fileUploadRequests[0].fieldName', 'profile');
        const response = (await APIService.upload('/files', formData)) as UploadResponse;
        return response?.data?.fileResponse?.[0]?.fullfilepath || '';
      } catch (error) {
        console.error('File upload failed', error);
        return '';
      }
      // finally {
      //   setLoader(false);
      // }
    };
    const processFileUpload = async (id: number, consentId: number) => {
      let basicDocs: {
        isWritten: number;
        isAudio: number;
        isVideo: number;
        letter1: string | undefined;
        letter2: string | undefined;
        written: string | undefined;
        video: string | undefined;
        audio: string | undefined;
      } = {
        isWritten: 0,
        isAudio: 0,
        isVideo: 0,
        letter1: '',
        letter2: '',
        written: '',
        video: '',
        audio: ''
      };
      console.log(data.written, 'data.writtenqe2qeqwed');

      if (data.letter1 || data.letter2 || data.written || data.video || data.audio) {
        try {
          basicDocs = {
            isWritten: consent?.written ? 1 : 0,
            isAudio: consent?.audio ? 1 : 0,
            isVideo: consent?.video ? 1 : 0,
            letter1: typeof data.letter1 === 'string' ? data.letter1 : await fileFormDatas(data.letter1, id),
            letter2: typeof data.letter2 === 'string' ? data.letter2 : await fileFormDatas(data.letter2, id),
            written: typeof data.written === 'string' ? data.written : await fileFormDatas(data.written, id),
            video: typeof data.video === 'string' ? data.video : await fileFormDatas(data.video, id),
            audio: typeof data.audio === 'string' ? data.audio : await fileFormDatas(data.audio, id)
          };
          updateDonarConsentDoc(id, basicDocs, () => {
            onNext({
              ...payload,
              donorId: id,
              consentId: consentId
            });
          });
        } catch (error) {
          console.error('Upload failed', error);
        }
      }
    };
    !isUpdating
      ? insertDonarDetails(payload, (resp) => processFileUpload(resp?.id, resp?.consentId))
      : updateDonarDetails(Number(donorId), payload, () => processFileUpload(Number(donorId), 0));
  };

  return (
    <MUIContainer maxWidth="xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
        <Box mt={8}>
          <Text className="!text-[#804595] !text-[19px] !font-[500]">Donor Details</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="name" label="Donor Name" required fullWidth />
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
              <FormInput control={control} name="age" label="Age" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={genders}
                control={control}
                name="genderId"
                label="Gender"
                required
                fullWidth
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={bloodGroup}
                control={control}
                name="bloodGroupId"
                label="BloodGroup"
                required
                fullWidth
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="height" label="Height" required fullWidth suffixComponent={'cm'} />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="weight" label="Weight" required fullWidth suffixComponent={'kg'} />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput
                control={control}
                name="bmi"
                value={bmi}
                type="number"
                label="BMI"
                required
                fullWidth
                suffixComponent={'kg/m2'}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormAtomRadioGroup label="Is MLC Case?" name="isMlc" row control={control} isRequired>
                {data.radioOption.map((item, index) => (
                  <AtomRadio key={index} value={item.value} label={item.label} />
                ))}
              </FormAtomRadioGroup>
            </Grid>
            {isMlc === '1' && (
              <Grid item xs={12} xl={4} md={6}>
                <FormInput
                  control={control}
                  name="arcaseNumber"
                  type="number"
                  label="AR Case Number"
                  required
                  fullWidth
                />
              </Grid>
            )}
          </Grid>
          <Text className="!text-[#804595] !text-[19px] !font-[500] !mt-6">Consent Details</Text>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12} xl={4} md={6}>
              <FormGroup>
                <Box className="flex flex-wrap">
                  <Controller
                    name="consent.written"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Written" />
                    )}
                  />
                  <Controller
                    name="consent.audio"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Audio" />
                    )}
                  />
                  <Controller
                    name="consent.video"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel control={<Checkbox {...field} checked={field.value} />} label="Video" />
                    )}
                  />
                </Box>
                {errors.consent?.written && <FormHelperText error>{errors.consent.written.message}</FormHelperText>}
              </FormGroup>
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={relationType}
                control={control}
                name="relationshipId"
                label="Donor Relationship"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="firstName" label="First Name" required fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="lastName" label="Last Name" required fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="email" label="Email" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <StyledPhoneInput
                countryCodeName="countryCode1"
                setValue={setValue}
                control={control}
                name="phoneNumber1"
                label="Phone Number"
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <StyledPhoneInput
                countryCodeName="countryCode2"
                setValue={setValue}
                control={control}
                name="phoneNumber2"
                label="Alternative Number"
              />
            </Grid>
          </Grid>
          <Text className="!text-[#804595] !text-[19px] !font-[500] !mt-6">Consent Attachments</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="letter1"
                label="Consent Letter 1"
                fullWidth
                filePath={``}
                fileData={donorDetaildata?.letter1}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Consent Letter 1');
                }}
                setFile={setFile}
                isPostFile={true}
                // required
                disabled={readOnly}
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormFileInput
                control={control}
                name="letter2"
                label="Consent Letter 2"
                fullWidth
                filePath={``}
                fileData={donorDetaildata?.letter2}
                setOpenImgModal={(val) => {
                  setOpenImgModal(val);
                  setFileLabel('Consent Letter 2');
                }}
                setFile={setFile}
                isPostFile={true}
                // required
                disabled={readOnly}
              />
            </Grid>
            {consent?.written && (
              <Grid item xs={12} xl={4} md={6}>
                <FormFileInput
                  control={control}
                  name="written"
                  label="Written Consent"
                  fullWidth
                  filePath={``}
                  fileData={donorDetaildata?.written}
                  setOpenImgModal={setOpenImgModal}
                  setFile={setFile}
                  isPostFile={true}
                  required
                  disabled={readOnly}
                />
              </Grid>
            )}
            {consent?.audio && (
              <Grid item xs={12} xl={4} md={6}>
                <Box className="flex gap-2">
                  <FormFileInput
                    control={control}
                    name="audio"
                    label="Audio Consent"
                    fullWidth
                    filePath={``}
                    fileData={donorDetaildata?.audio || audio}
                    setOpenImgModal={setOpenImgModal}
                    setFile={setFile}
                    isPostFile={true}
                    required
                    disabled={readOnly}
                    allowedTypes={['image/webp', 'video/mp3']}
                  />
                  <Text className="!mt-2">|</Text>{' '}
                  <Button
                    className="!bg-green-600 hover:!bg-green-700 !text-white gap-2"
                    onClick={() => {
                      setOpenVidRec(true);
                      setAudOrVid(true);
                    }}
                  >
                    <AudioIcon className="w-5 h-5" />
                  </Button>
                </Box>
              </Grid>
            )}
            {consent?.video && (
              <Grid item xs={12} xl={4} md={6}>
                <Box className="flex gap-2">
                  <FormFileInput
                    control={control}
                    name="video"
                    label="Video Consent"
                    fullWidth
                    filePath={``}
                    fileData={donorDetaildata?.video || video}
                    setOpenImgModal={setOpenImgModal}
                    setFile={setFile}
                    isPostFile={true}
                    required
                    allowedTypes={['image/webp', 'video/mp4']}
                    disabled={readOnly}
                  />
                  <Text className="!mt-2">|</Text>{' '}
                  <Button
                    className="!bg-green-600 hover:!bg-green-700 !text-white gap-2"
                    onClick={() => {
                      setOpenVidRec(true);
                      setAudOrVid(false);
                    }}
                  >
                    <VideoIcon className="w-5 h-5" />
                  </Button>
                </Box>
                {/* Record<VideoIcon onClick={() => setOpenVidRec(true)} className="mt-1.5 cursor-pointer" /> */}
              </Grid>
            )}
          </Grid>
        </Box>
        {!isPreview && (
          <>
            <DonorFooterButton isFirstStep={true} onSubmit={handleSubmit(onSubmit)} />
          </>
        )}
      </form>
      {openVidRec && (
        <VideoRecordingDialog
          open={openVidRec}
          onClose={() => {
            setOpenVidRec(false);
          }}
          setValue={setValue}
          isVideo={!audOrVid}
        />
      )}
      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileLabel} />
    </MUIContainer>
  );
};

export default DonorDetails;
