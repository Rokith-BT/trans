import { Box, FormInput, FormSelect, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import { useForm } from 'react-hook-form';
import { hospitalDetailsSchema, HospitalDetailsType } from '../validators';
import FooterButton from './FooterButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import MobileOtp from '@/pages/components/MobileOtp';
import { HospitalType, Zone } from '@/types/common.type';
import { useHospital } from '../../hospitalContext';
import { BasicDetails } from '@/types/hospital';
import { HospitalDetail } from '@/types/hospital/hospital.request.type';
import { toast } from '@/utils/toast';
// import { isDirty } from 'zod';

interface HospitalDetailsProps {
  // eslint-disable-next-line no-unused-vars
  onNext: (data: HospitalDetailsType) => void;
  onBack?: () => void;
  reCheck?: boolean;
  detailsData?: BasicDetails;
  readOnly: boolean;
}

const HospitalDetails: React.FC<HospitalDetailsProps> = ({
  onNext,
  reCheck = true,
  detailsData,
  onBack,
  readOnly = false
}) => {
  // const [hospitalDetailsData, setHospitalDetailsData] = useState<HospitalDetailsType>();

  //states for handle the phone number and verifcation
  const [phoneData, setPhoneData] = useState({
    primary: {
      number: detailsData?.phoneNumber1 ?? '',
      verified: detailsData?.isPhoneNumber1Verified ?? false,
      isDirty: false,
      isEnable: false
    },
    alternate: {
      number: detailsData?.phoneNumber2 ?? '',
      verified: detailsData?.isPhoneNumber2Verified ?? false,
      isDirty: false,
      isEnable: false
    }
  });
  const [currentPhoneType, setCurrentPhoneType] = useState<'primary' | 'alternate' | null>(null);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const {
    state: { establishedyears, cities, states, countries, hospitalTypes, zones }
  } = useMasterData();

  const hospitalTypeOptions = hospitalTypes.map((t: HospitalType) => ({
    label: t.name,
    value: t.id
  }));
  const zoneOptions = zones.map((z: Zone) => ({
    label: z.name,
    value: z.id
  }));
  const establishedYearsOptions = establishedyears.map((year: string) => ({
    label: year,
    value: year
  }));

  const {
    actions: { updateBasicDetails }
  } = useHospital();

  const {
    handleSubmit,
    control,
    // formState: { dirtyFields },
    setValue,
    watch,
    reset
  } = useForm<HospitalDetail>({
    resolver: zodResolver(hospitalDetailsSchema),
    defaultValues: {
      hospitalTypeId: detailsData?.hospitalType?.id ?? detailsData?.hospitalTypeId ?? 0,
      hospitalName: detailsData?.hospitalName ?? '',
      email: detailsData?.email ?? '',
      zoneId: detailsData?.zone?.id ?? detailsData?.zoneId ?? 0,
      websiteUrl: detailsData?.websiteUrl ?? '',
      pincode: detailsData?.pincode ?? '',
      addressLine1: detailsData?.addressLine1 ?? '',
      addressLine2: '',
      phoneNumber2: '',
      phoneNumber1: detailsData?.phoneNumber1 ?? '',
      countryCode1: detailsData?.countryCode1 ?? '',
      countryCode2: detailsData?.countryCode2 ?? '',
      isPhoneNumber1Verified: detailsData?.isPhoneNumber1Verified ?? false,
      isPhoneNumber2Verified: detailsData?.isPhoneNumber2Verified ?? false,
      townVillage: detailsData?.townVillage ?? '',
      yearOfEstablishment: detailsData?.yearOfEstablishment ?? 0,
      landmark: detailsData?.landmark ?? '',
      cityId: detailsData?.city?.id ?? detailsData?.cityId ?? 0,
      stateId: detailsData?.state?.id ?? detailsData?.stateId ?? 0,
      countryId: detailsData?.country?.id ?? detailsData?.countryId ?? 0
    }
  });
  const watchPhoneNumber1Verified = watch('isPhoneNumber1Verified');
  const watchPhoneNumber2Verified = watch('isPhoneNumber2Verified');

  useEffect(() => {
    console.log('details data from parent ', detailsData);
    if (detailsData) {
      reset({
        hospitalTypeId: detailsData?.hospitalType?.id ?? detailsData?.hospitalTypeId ?? 0,
        hospitalName: detailsData?.hospitalName ?? '',
        email: detailsData?.email ?? '',
        zoneId: detailsData?.zone?.id ?? detailsData?.zoneId ?? 0,
        websiteUrl: detailsData?.websiteUrl ?? '',
        pincode: detailsData?.pincode ?? '',
        addressLine1: detailsData?.addressLine1 ?? '',
        addressLine2: detailsData?.addressLine2 ?? '',
        phoneNumber2: detailsData?.phoneNumber2 ?? '',
        countryCode1: detailsData?.countryCode1 ?? '',
        countryCode2: detailsData?.countryCode2 ?? '',
        isPhoneNumber1Verified: (watchPhoneNumber1Verified || detailsData?.isPhoneNumber1Verified) ?? false,
        isPhoneNumber2Verified: (watchPhoneNumber2Verified || detailsData?.isPhoneNumber2Verified) ?? false,
        phoneNumber1: detailsData?.phoneNumber1 ?? '',
        townVillage: detailsData?.townVillage ?? '',
        yearOfEstablishment: detailsData?.yearOfEstablishment ?? 0,
        landmark: detailsData?.landmark ?? '',
        cityId: detailsData?.city?.id ?? detailsData?.cityId ?? 0,
        stateId: detailsData?.state?.id ?? detailsData?.stateId ?? 0,
        countryId: detailsData?.country?.id ?? detailsData?.countryId ?? 0
      });
    }
  }, [detailsData, reset]);

  const handlePhoneNumberChange = (value: string, type: 'primary' | 'alternate') => {
    setPhoneData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        number: value,
        isDirty: true,
        isEnable: value.length === 10 /* compare to original */,
        verified: false // reset only *this* type
      }
    }));
    setValue(type === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', false);
  };

  const handleOpenDialog = (type: 'primary' | 'alternate') => {
    if (
      // phoneData[type].number !== detailsData?.[`phoneNumber${type === 'primary' ? '1' : '2'}`] &&
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
          verified: true,
          isDirty: false
        }
      }));
      setValue(currentPhoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', true);
      toast(`${currentPhoneType === 'primary' ? 'Primary' : 'Alternate'} Phone Verified`, 'success');
    }
    setOpenOtpDialog(false);
  };

  // useEffect(() => {
  //   Object.keys(phoneData).forEach((type) => {
  //     const phoneType = type as 'primary' | 'alternate';

  //     if (phoneData[phoneType].isDirty && phoneData[phoneType].number.length === 10) {
  //       toast(`${phoneType}`, 'success');
  //       setValue(phoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', false);
  //     }
  //   });
  // }, [phoneData.primary.number, phoneData.alternate.number]);
  console.log('phone number ', watchPhoneNumber1Verified, watchPhoneNumber2Verified);

  const onSubmit = (data: HospitalDetail) => {
    console.log('onSubmit: ', data);
    // setHospitalDetailsData(data);
    if (!data.isPhoneNumber1Verified) {
      toast('Please Verify your Primary Phone Number', 'error');
      return;
    }

    if (!data.isPhoneNumber2Verified) {
      toast('Please Verify your Alternative Phone Number', 'error');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      hospitalName: data.hospitalName,
      hospitalTypeId: data.hospitalTypeId,
      hospitalType: {
        id: data.hospitalTypeId
      },
      zoneId: data.zoneId,
      zone: {
        id: data.zoneId
      },
      yearOfEstablishment: data.yearOfEstablishment,
      websiteUrl: data.websiteUrl,
      email: data.email,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: data.phoneNumber2,
      countryCode1: data.countryCode1,
      countryCode2: data.countryCode2,
      isPhoneNumber1Verified: watchPhoneNumber1Verified || data.isPhoneNumber1Verified,
      isPhoneNumber2Verified: watchPhoneNumber2Verified || data.isPhoneNumber2Verified,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      townVillage: data.townVillage,
      landmark: data.landmark,
      pincode: data.pincode,
      cityId: data.cityId,
      stateId: data.stateId,
      countryId: data.countryId,
      city: {
        id: data.cityId
      },
      state: {
        id: data.stateId
      },
      country: {
        id: data.countryId
      },
      ntorcLicenceNumber: data?.ntorcLicenceNumber ?? 'number',
      ntorcLicenceRegistrationDate: data?.ntorcLicenceRegistrationDate ?? '2024-10-07T09:37:08.379Z',
      ntorcLicenceExpiryDate: data?.ntorcLicenceExpiryDate ?? '2024-10-07T09:37:08.379Z'
    };
    updateBasicDetails(payload, () => {
      onNext(payload);
    });
    console.log('payloda data ', payload);

    // console.log('hospital id from basic details ', hospitalDetailsData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className="mt-[32px]">
        <Text className="hospital-form-sub-title">Hospital Basic Details</Text>

        <Box className="details-section">
          <Box className="">
            <FormSelect
              menuOptions={hospitalTypeOptions}
              control={control}
              name="hospitalTypeId"
              label="Hospital Type"
              fullWidth
              disabled
            />
          </Box>
          <Box className="">
            <FormInput
              control={control}
              name="hospitalName"
              label="Hospital Name"
              placeholder="Enter Here"
              fullWidth
              disabled
            />
          </Box>
          <Box className="">
            <FormSelect
              menuOptions={zoneOptions}
              control={control}
              name="zoneId"
              label="Zone"
              placeholder="Enter Here"
              fullWidth
              disabled
            />
          </Box>
          <Box className="">
            <FormSelect
              control={control}
              name="yearOfEstablishment"
              label="Year Of Establishment"
              menuOptions={establishedYearsOptions}
              fullWidth
              required
              disabled={readOnly}
            />
          </Box>
          <Box className="">
            <FormInput
              control={control}
              name="websiteUrl"
              label="Website URL"
              placeholder="Enter Here"
              fullWidth
              required
              disabled={readOnly}
            />
          </Box>
          <Box className="">
            <FormInput
              control={control}
              name="email"
              label="Email"
              placeholder="Enter Mail"
              fullWidth
              disabled={readOnly}
            />
          </Box>
          <Box className="">
            <StyledPhoneInput
              control={control}
              name="phoneNumber1"
              countryCodeName="countryCode1"
              setValue={setValue}
              label="Phone Number"
              helperText="Phone Number is Required"
              onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'primary')}
              isVerified={phoneData.primary.verified}
              onVerify={() => handleOpenDialog('primary')}
              isEnable={phoneData.primary.isEnable}
              disable={readOnly}
              required
            />
          </Box>
          <Box className="">
            <StyledPhoneInput
              label="Alternative Phone Number"
              control={control}
              name="phoneNumber2"
              countryCodeName="countryCode2"
              setValue={setValue}
              helperText="Alternative Phone Number is Required"
              onVerify={() => handleOpenDialog('alternate')}
              onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'alternate')}
              isVerified={phoneData.alternate.verified}
              isEnable={phoneData.alternate.isEnable}
              disable={readOnly}
              required
            />
          </Box>
        </Box>

        <Box>
          <Text className="hospital-form-sub-title">Hospital Address</Text>
          <Box className="details-section">
            <Box className="">
              <FormInput
                control={control}
                name="addressLine1"
                label="Address Line 1"
                placeholder="Enter Address"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="addressLine2"
                label="Address Line 2"
                placeholder="Enter Here"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="townVillage"
                label="Town/Village"
                placeholder="Enter Here"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="landmark"
                label="Landmark"
                placeholder="Enter Here"
                fullWidth
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="pincode"
                label="Pincode"
                placeholder="Enter Here"
                fullWidth
                required
                inputProps={{ maxLength: 6 }}
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormSelect
                menuOptions={cities}
                control={control}
                name="cityId"
                label="City"
                placeholder="Enter Here"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormSelect
                menuOptions={states}
                control={control}
                name="stateId"
                label="State"
                placeholder="Enter Here"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormSelect
                menuOptions={countries}
                control={control}
                name="countryId"
                label="Country"
                placeholder="Enter Here"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
          </Box>
        </Box>
        <Box>{reCheck && <FooterButton onBack={onBack} onSubmit={handleSubmit(onSubmit)} />}</Box>
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
      </Box>
    </form>
  );
};

export default HospitalDetails;
