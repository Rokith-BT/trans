import { AtomDatePicker, Box, Button, FormFileInput, FormInput, FormSelect, Text } from '@/atoms';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import { ntorcHospitalSchema } from '../validators';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { useHospital } from '../../hospitalContext';
import { HospitalType, Zone } from '@/types/common.type';
// import SubmittedDialog from '../../view/SubmitDialog';
// import WaitingApprovalDialog from './WaitingApprovalDialog';
// import { useNavigate } from 'react-router';
import { BackIconPink, NextIcon } from '@/assets/icons';
// import { PhoneDetails, updatePhoneNumber, verifyPhoneNumber } from '@/utils/phoneVerification';
import MobileOtp from '@/pages/components/MobileOtp';
import dayjs from 'dayjs';
import { BasicDetails } from '@/types/hospital';
import { HospitalDetail } from '@/types/hospital/hospital.request.type';
import { useNavigate } from 'react-router';
import { useHospitalId } from '@/hooks/useHospitalID';
import { toast } from '@/utils/toast';
import PreviewFile from '@/pages/components/FilePreview';

interface NtorcHospitalProps {
  isApprove?: boolean;
  readOnly: boolean;
  ntorcData?: BasicDetails;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  onBack?: () => void;
  isEdit?: boolean;
}
const NtorcHospital: React.FC<NtorcHospitalProps> = ({
  ntorcData,
  onNext,
  onBack,
  isApprove = false,
  readOnly = false,
  isEdit = false
}) => {
  // const navigate = useNavigate();
  // const [submitDialog, setSubmitDialog] = useState(false);
  // const [waitingDialog, setWaitingDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [file, setFile] = useState(ntorcData?.ntorcLicenceDoc ?? '');
  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState(false);
  const {
    state: { establishedyears, hospitalTypes, cities, states, countries, zones }
  } = useMasterData();
  const establishedYearsOptions = establishedyears.map((year: string) => ({
    label: year,
    value: year
  }));
  const hospitalTypesOptions = hospitalTypes.map((h: HospitalType) => ({
    label: h.name,
    value: h.id
  }));

  const zoneOptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.id
  }));

  // const [formData, setFormData] = useState<NtorcHospitalType>();
  // console.log(formData);

  const {
    state: { hospital },
    actions: { updateBasicDetails }
  } = useHospital();
  console.log('ntorc details ', hospital);
  console.log('ntorc data ', ntorcData);
  const hospitalID = useHospitalId();
  const [currentPhoneType, setCurrentPhoneType] = useState<'primary' | 'alternate' | null>(null);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);

  //states for handle the phone number and verifcation
  const [phoneData, setPhoneData] = useState({
    primary: {
      number: ntorcData?.phoneNumber1 ?? '',
      verified: ntorcData?.isPhoneNumber1Verified ?? false,
      isDirty: false,
      isEnable: false
    },
    alternate: {
      number: ntorcData?.phoneNumber2 ?? '',
      verified: ntorcData?.isPhoneNumber2Verified ?? false,
      isDirty: false,
      isEnable: false
    }
  });
  // const [lastVerifiedNumber, setLastVerifiedNumber] = useState({
  //   primary: ntorcData?.phoneNumber1 ?? '',
  //   alternate: ntorcData?.phoneNumber2 ?? ''
  // });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<HospitalDetail>({
    resolver: zodResolver(ntorcHospitalSchema),
    defaultValues: {
      hospitalName: ntorcData?.hospitalName || '',
      hospitalTypeId: ntorcData?.hospitalTypeId || 0,
      zoneId: ntorcData?.zoneId || 0,
      yearOfEstablishment: 0,
      ntorcLicenceNumber: ntorcData?.ntorcLicenceNumber || '',
      websiteUrl: ntorcData?.websiteUrl || '',
      email: ntorcData?.email || '',
      phoneNumber1: ntorcData?.phoneNumber1 || '',
      phoneNumber2: ntorcData?.phoneNumber2 || '',
      isPhoneNumber1Verified: false,
      isPhoneNumber2Verified: false,
      countryCode1: ntorcData?.countryCode1 || '',
      countryCode2: ntorcData?.countryCode2 || '',
      // ntorc_license: undefined,
      ntorcLicenceRegistrationDate: ntorcData?.ntorcLicenceRegistrationDate || '',
      ntorcLicenceExpiryDate: ntorcData?.ntorcLicenceExpiryDate || '',
      ntorcLicenceDoc: ntorcData?.ntorcLicenceDoc || '',
      addressLine1: ntorcData?.addressLine1 || '',
      addressLine2: ntorcData?.addressLine2 || '',
      townVillage: ntorcData?.townVillage || '',
      landmark: ntorcData?.landmark || '',
      pincode: ntorcData?.pincode || '',
      cityId: ntorcData?.city?.id ?? (ntorcData?.cityId || 0),
      stateId: ntorcData?.state?.id ?? (ntorcData?.stateId || 0),
      countryId: ntorcData?.country?.id ?? (ntorcData?.countryId || 0)
    }
  });
  //  const [] = useState(false);
  // const handlePhoneVerify = ()=>{
  const watchPhoneNumber1Verified = watch('isPhoneNumber1Verified');
  const watchPhoneNumber2Verified = watch('isPhoneNumber2Verified');
  // }
  // const [phoneDetails, setPhoneDetails] = useState<PhoneDetails>({
  //   phoneNumber1: ntorcData?.phoneNumber1 || '',
  //   isPhoneNumber1Verified: Boolean(hospital?.basicDetails?.isPhoneNumber1Verified),
  //   phoneNumber2: ntorcData?.phoneNumber2 || '',
  //   isPhoneNumber2Verified: Boolean(hospital?.basicDetails?.isPhoneNumber2Verified),
  //   verifiedPhoneNumber1: ntorcData?.phoneNumber1 || '',
  //   verifiedPhoneNumber2: ntorcData?.phoneNumber2 || ''
  // });

  // const handlePhoneNumberChange = (type: 'primary' | 'alternate', newNumber: string) => {
  //   setPhoneDetails((prev) => updatePhoneNumber(prev, type, newNumber));
  // };

  // const handlePhoneVerification = () => {
  //   setPhoneDetails((prev) => verifyPhoneNumber(prev, currentPhoneType!));
  //   setOpenOtpDialog(false); // Close OTP dialog
  // };
  console.log('ntorc data ', ntorcData);
  useEffect(() => {
    if (ntorcData) {
      reset({
        hospitalName: ntorcData?.hospitalName,
        hospitalTypeId: ntorcData?.hospitalType?.id,
        zoneId: ntorcData?.zone?.id,
        yearOfEstablishment: ntorcData?.yearOfEstablishment,
        ntorcLicenceNumber: ntorcData?.ntorcLicenceNumber,
        websiteUrl: ntorcData?.websiteUrl,
        email: ntorcData?.email,
        phoneNumber1: ntorcData?.phoneNumber1,
        phoneNumber2: ntorcData?.phoneNumber2,
        isPhoneNumber1Verified: (watchPhoneNumber1Verified || ntorcData?.isPhoneNumber1Verified) ?? false,
        isPhoneNumber2Verified: (watchPhoneNumber2Verified || ntorcData?.isPhoneNumber2Verified) ?? false,
        countryCode1: ntorcData?.countryCode1 ?? 91,
        countryCode2: ntorcData?.countryCode2 ?? 91,
        ntorcLicenceRegistrationDate: ntorcData?.ntorcLicenceRegistrationDate,
        ntorcLicenceExpiryDate: ntorcData?.ntorcLicenceExpiryDate,
        ntorcLicenceDoc: ntorcData?.ntorcLicenceDoc,
        addressLine1: ntorcData?.addressLine1,
        addressLine2: ntorcData?.addressLine2,
        townVillage: ntorcData?.townVillage,
        landmark: ntorcData?.landmark,
        pincode: ntorcData?.pincode,
        cityId: ntorcData?.city?.id,
        stateId: ntorcData?.state?.id,
        countryId: ntorcData?.country?.id
      });
    }
    // setValue(
    //   'ntorcLicenceRegistrationDate',
    //   dayjs(ntorcData?.ntorcLicenceRegistrationDate).startOf('day').toISOString()
    // );
    // setValue('ntorcLicenceExpiryDate', dayjs(ntorcData?.ntorcLicenceExpiryDate).startOf('day').toISOString());
  }, [ntorcData, hospital]);

  const watchNtorcLicense = watch('ntorcLicenceDoc');

  const handlePhoneNumberChange = (value: string, type: 'primary' | 'alternate') => {
    setPhoneData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        number: value,
        isDirty: true,
        isEnable: value.length === 10 && value !== ntorcData?.[`phoneNumber${type === 'primary' ? '1' : '2'}`],
        verified: false
      }
    }));
  };
  const handleOpenDialog = (type: 'primary' | 'alternate') => {
    if (
      phoneData[type].number !== ntorcData?.[`phoneNumber${type === 'primary' ? '1' : '2'}`] &&
      phoneData[type].isEnable
    ) {
      setCurrentPhoneType(type);
      setOpenOtpDialog(true);
    }
  };
  const handlePhoneVerification = () => {
    if (currentPhoneType) {
      setPhoneData((prev) => ({
        ...prev,
        [currentPhoneType]: {
          ...prev[currentPhoneType],
          verified: true
        }
      }));
      // setLastVerifiedNumber((prev) => ({
      //   ...prev,
      //   [currentPhoneType]: phoneData[currentPhoneType].number
      // }));
      setValue(currentPhoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', true);
      toast(`${currentPhoneType === 'primary' ? 'Primary' : 'Alternate'} Phone Verified`, 'success');
    }
    setOpenOtpDialog(false);
  };
  // useEffect(() => {
  //   Object.keys(phoneData).forEach((type) => {
  //     const phoneType = type as 'primary' | 'alternate';
  //     if (phoneData[phoneType].isDirty && phoneData[phoneType].number.length === 10) {
  //       setValue(phoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', false);
  //     }
  //   });
  // }, [phoneData.primary.number, phoneData.alternate.number]);

  // useEffect(() => {
  //   (['primary', 'alternate'] as const).forEach((type) => {
  //     const currentNumber = phoneData[type].number;
  //     const originalNumber = ntorcData?.[`phoneNumber${type === 'primary' ? '1' : '2'}`];
  //     const isVerified = phoneData[type].verified;
  //     const fieldName = type === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified';

  //     const isSameAsOriginal = currentNumber === originalNumber;

  //     // Only reset if number changed *and* was previously verified
  //     // if (!isSameAsOriginal && isVerified) {
  //       if (!isSameAsOriginal && isVerified) {
  //       setValue(fieldName, false);
  //       setPhoneData((prev) => ({
  //         ...prev,
  //         [type]: {
  //           ...prev[type],
  //           verified: false
  //         }
  //       }));
  //     }
  //   });
  // }, [phoneData.primary.number, phoneData.alternate.number]);
  useEffect(() => {
    if (phoneData.primary.isDirty && phoneData.primary.number.length === 10) {
      setValue('isPhoneNumber1Verified', false);
    }
  }, [phoneData.primary.number]);

  useEffect(() => {
    if (phoneData.alternate.isDirty && phoneData.alternate.number.length === 10) {
      setValue('isPhoneNumber2Verified', false);
    }
  }, [phoneData.alternate.number]);

  const onSubmit = async (data: HospitalDetail) => {
    console.log(data, 'data from ntorc');
    if (data?.isPhoneNumber1Verified === false) {
      toast('Please Verify Primary Phone Number', 'error');
      return;
    }
    if (data?.isPhoneNumber2Verified === false) {
      toast('Please Verify Alternative Phone Number', 'error');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      hospitalName: data?.hospitalName,
      hospitalTypeId: data?.hospitalTypeId,
      zoneId: data?.zoneId,
      yearOfEstablishment: data.yearOfEstablishment,
      websiteUrl: data.websiteUrl,
      email: data.email,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: data.phoneNumber2,
      countryCode1: data.countryCode1 ?? 91,
      countryCode2: data.countryCode2 ?? 91,
      isPhoneNumber1Verified: data.isPhoneNumber1Verified || false,
      isPhoneNumber2Verified: data.isPhoneNumber2Verified || false,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      townVillage: data.townVillage,
      landmark: data.landmark,
      pincode: data.pincode,
      cityId: data.cityId,
      stateId: data.stateId,
      countryId: data.countryId,
      ntorcLicenceDoc: data.ntorcLicenceDoc,
      ntorcLicenceNumber: data.ntorcLicenceNumber,
      ntorcLicenceRegistrationDate: data.ntorcLicenceRegistrationDate,
      ntorcLicenceExpiryDate: data.ntorcLicenceExpiryDate
    };
    if (!readOnly) {
      await updateBasicDetails(payload, () => {
        onNext(payload);
        isEdit && toast('Hospital Details Updated Successfully', 'success');
        isEdit ? navigate(-1) : '';
      });
    }
  };
  const handleBackClick = () => {
    if (isEdit) {
      navigate(-1);
    } else {
      onBack?.();
    }
  };

  const getBackButtonContent = () => {
    return isEdit ? (
      'Cancel'
    ) : (
      <>
        <BackIconPink />
        Back
      </>
    );
  };

  const getNextButtonContent = () => {
    return isEdit ? (
      'Submit'
    ) : (
      <>
        Next <NextIcon />
      </>
    );
  };
  console.log('errors', errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {/* {Object.keys(errors).length > 1 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
        <Box>
          <Text className="!text-[19px] text-[#804595] !mt-[32px] !mb-[28px] !font-bold">Hospital Basic Details</Text>
          <Box className="flex flex-col ">
            <Box className="flex flex-wrap gap-y-[48px] -mx-[27px]">
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormSelect
                  control={control}
                  name="hospitalTypeId"
                  label="Hospital Type"
                  menuOptions={hospitalTypesOptions}
                  fullWidth
                  disabled
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput name="hospitalName" control={control} label="Hospital Name" fullWidth disabled />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormSelect menuOptions={zoneOptions} name="zoneId" control={control} label="Zone" fullWidth disabled />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormSelect
                  control={control}
                  name="yearOfEstablishment"
                  label="Year of Establishment"
                  menuOptions={establishedYearsOptions}
                  fullWidth
                  required
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput
                  control={control}
                  label="Hospital License Number"
                  fullWidth
                  required
                  name="ntorcLicenceNumber"
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput
                  control={control}
                  label="Websit URL"
                  fullWidth
                  required
                  name="websiteUrl"
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput control={control} name="email" label="Email" fullWidth required disabled={readOnly} />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <StyledPhoneInput
                  control={control}
                  name="phoneNumber1"
                  countryCodeName="countryCode1"
                  setValue={setValue}
                  label="Phone Number"
                  helperText="Phone Number is Required"
                  onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'primary')}
                  onVerify={() => handleOpenDialog('primary')}
                  isVerified={phoneData.primary.verified}
                  isEnable={phoneData.primary.isEnable}
                  disable={readOnly}
                  required
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <StyledPhoneInput
                  control={control}
                  label="Alternate Phone Number"
                  name="phoneNumber2"
                  countryCodeName="countryCode2"
                  setValue={setValue}
                  helperText="phone number is required"
                  onVerify={() => handleOpenDialog('alternate')}
                  onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'alternate')}
                  isVerified={phoneData.alternate.verified}
                  isEnable={phoneData.alternate.isEnable}
                  disable={readOnly}
                  required
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Text className="!text-[19px] !mt-[32px] !font-bold text-[#804595] !mb-[28px]">TRANSTAN License Details</Text>
          <Box className="flex flex-wrap gap-y-[48px] -mx-[27px]">
            <Box className="w-full md:w-1/3 md:px-[27px]">
              <FormFileInput
                control={control}
                name="ntorcLicenceDoc"
                label="NTORC License"
                filePath={`/hospitals/${hospitalID}/ntorclicense`}
                fileData={watchNtorcLicense ?? ntorcData?.ntorcLicenceDoc}
                setFile={setFile}
                setOpenImgModal={setOpenPreview}
                required
                fullWidth
                disabled={readOnly}
              />
            </Box>
            <Box className="w-full md:w-1/3 md:px-[27px]">
              <AtomDatePicker
                control={control}
                label="NTORC License Registeration Date"
                name="ntorcLicenceRegistrationDate"
                helperText="Registeration Date is Required"
                maxDate={dayjs()}
                disabled={readOnly}
              />
            </Box>
            <Box className="w-full md:w-1/3 md:px-[27px]">
              <AtomDatePicker
                control={control}
                label="NTORC License Expiry Date"
                fullWidth
                required
                name="ntorcLicenceExpiryDate"
                helperText="Expiry Date is Required"
                minDate={dayjs().add(1, 'day')}
                disabled={readOnly}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <Text className="!text-[19px] text-[#804595] !mt-[32px] !mb-[28px] !font-bold">Hospital Address</Text>
          <Box className="flex flex-col ">
            <Box className="flex flex-wrap gap-y-[48px] -mx-[27px]">
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput
                  control={control}
                  label="Address Line 1"
                  fullWidth
                  required
                  name="addressLine1"
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput
                  control={control}
                  label="Address Line 2"
                  fullWidth
                  required
                  name="addressLine2"
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput
                  control={control}
                  label="Town/Village"
                  fullWidth
                  required
                  name="townVillage"
                  disabled={readOnly}
                />
              </Box>

              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput control={control} label="Landmark" fullWidth name="landmark" disabled={readOnly} />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormInput
                  control={control}
                  label="Pin code"
                  fullWidth
                  required
                  inputProps={{ maxLength: 6 }}
                  name="pincode"
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormSelect
                  control={control}
                  name="cityId"
                  label="City"
                  menuOptions={cities}
                  fullWidth
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormSelect
                  name="stateId"
                  control={control}
                  label="State"
                  menuOptions={states}
                  fullWidth
                  disabled={readOnly}
                />
              </Box>
              <Box className="w-full md:w-1/3 md:px-[27px]">
                <FormSelect
                  label="Country"
                  control={control}
                  menuOptions={countries}
                  name="countryId"
                  fullWidth
                  disabled={readOnly}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <>
            {!isApprove && (
              <Box>
                <Box className="mt-5 flex items-center justify-end gap-9 mb-[5%]">
                  <Button
                    variant="outlined"
                    className="w-[150px] flex h-[40px] gap-x-4 !border-[#D876A9] !text-[#D876A9]"
                    onClick={handleBackClick}
                  >
                    {getBackButtonContent()}
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    className="w-[150px] flex gap-2 h-[40px] gap-x-4 !bg-[#D876A9] "
                    disabled={readOnly}
                    //need to work here for the buttons
                  >
                    {getNextButtonContent()}
                  </Button>
                </Box>
              </Box>
            )}
          </>
        </Box>

        <MobileOtp
          open={openOtpDialog}
          onClose={() => {
            setOpenOtpDialog(false);
            setCurrentPhoneType(null);
          }}
          onVerify={handlePhoneVerification}
          phoneNumber={currentPhoneType === 'primary' ? phoneData.primary.number : phoneData.alternate.number}
          currentPhoneType={currentPhoneType}
        />
        <PreviewFile open={openPreview} onClose={() => setOpenPreview(false)} file={file} fileLabel="NTORC License" />
      </Box>
    </form>
  );
};

export default NtorcHospital;
