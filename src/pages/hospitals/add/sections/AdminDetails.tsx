import { CircleGreyIcon, TickCircle } from '@/assets/icons';
import { AtomDatePicker, Box, FormAutoCompleteSelect, FormInput, FormSelect, Text } from '@/atoms';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { adminDetailsSchema, AdminDetailsType } from '../validators';
import { zodResolver } from '@hookform/resolvers/zod';
import FooterButton from './FooterButton';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Designation, Role, User } from '@/types/common.type';
import MobileOtp from '@/pages/components/MobileOtp';
import { useHospital } from '../../hospitalContext';
// import ProfileImg from '@/pages/components/ProfileImg';
import dayjs from 'dayjs';
import Loading from '@/pages/components/Loading';
import { toast } from '@/utils/toast';
import { APIService } from '@/services';
import { formatDateToISO } from '@/utils';
import { base64toFile } from '@/utils/base64tofile';
import { ProfileImageField } from '@/pages/components/ProfileImageInput';

interface UploadResponse {
  data: {
    fileResponse: { fullfilepath: string }[];
  };
}
interface AdminDetailsProps {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  onBack?: () => void;
  reCheck?: boolean;
  adminData?: User;
  readOnly: boolean;
}

const AdminDetails: React.FC<AdminDetailsProps> = ({ onNext, reCheck = true, adminData, readOnly = false }) => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const parsedQS = QS.parse(location.search);
  const [indian, setIndian] = useState<boolean>(false);
  // const [adminDetailsData, setAdminDetailsData] = useState<AdminDetailsType>();
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // const [aadhaarNumber, setAadhaarNumber] = useState(adminData?.aadharNumber || '');
  // const [passportNumber, setPassportNumber] = useState(adminData?.passportNumber || '');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aadharData, setAadharData] = useState<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars, @typescript-eslint/no-unused-vars
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [tempPassport, setTempPassport] = useState<string>('');
  const [tempAadhar, setTempAadhar] = useState<string>('');
  //for mobile
  const [enteredPhoneNumber, setEnteredNumber] = useState(adminData?.phoneNumber1 ?? '');
  const isExistingPhoneNumber =
    enteredPhoneNumber === adminData?.phoneNumber1 ? adminData?.isPhoneNumber1Verified : false;
  const [phoneVerified, setPhoneVerified] = useState(isExistingPhoneNumber || false);
  const [isEnable, setIsEnable] = useState(false);
  const [isAadhar, setIsAadhar] = useState(false);

  const {
    state: { genders, designations, roles, countries, cities, states, aadhaarResponse },
    action: { getAadhaarResponse, postKycAadharOtp }
  } = useMasterData();
  const {
    state: { hospitalId },
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    actions: { updateAdminDetails, updateProfilePhoto }
  } = useHospital();

  const designationOptions = designations.map((d: Designation) => ({
    value: d.id,
    label: d.name
  }));

  const roleOptions = roles.map((r: Role) => ({
    value: r.id,
    label: r.name
  }));

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    resetField,
    formState: { errors, dirtyFields }
  } = useForm<AdminDetailsType>({
    resolver: zodResolver(adminDetailsSchema),
    defaultValues: {
      uuid: '',
      userImage: '',
      isIndian: adminData?.isIndian ?? false,
      passportNumber: adminData?.passportNumber ?? '',
      firstName: adminData?.firstName ?? '',
      lastName: adminData?.lastName ?? '',
      dateOfBirth: adminData?.dateOfBirth ?? '',
      age: '',
      designationId: adminData?.designation?.id ?? 0,
      genderId: adminData?.gender?.id ?? 0,
      roleId: adminData?.role?.id ?? 0,
      qualification: adminData?.qualification ?? '',
      phoneNumber1: adminData?.phoneNumber1 ?? '',
      countryCode1: adminData?.countryCode1 ?? 91,
      isPhoneNumber1Verified: adminData?.isPhoneNumber1Verified ?? false,
      email: adminData?.email ?? '',
      aadharNumber: adminData?.aadharNumber ?? '',
      addressLine1: adminData?.addressLine1 ?? '',
      addressLine2: adminData?.addressLine2 ?? '',
      pincode: adminData?.pincode ?? '',
      townVillage: adminData?.townVillage ?? '',
      landmark: adminData?.landmark ?? '',
      cityId: adminData?.city?.id ?? 0,
      stateId: adminData?.state?.id ?? 0,
      countryId: adminData?.country?.id ?? 0
    }
  });
  // const watchedAadhar = watch('aadharNumber');
  // const watchedPassport = watch('passportNumber');
  const watchPhoneNUmberVerified = watch('isPhoneNumber1Verified');
  const isDirtyPhoneNumber = dirtyFields.phoneNumber1;
  useEffect(() => {
    if (adminData) {
      const isIndian = adminData?.isIndian ?? false;
      const adminName = adminData?.firstName?.toLowerCase();
      const reSetAdminName = adminName === 'admin' && adminData?.lastName === '' ? '' : adminData?.firstName;

      reset({
        isIndian: isIndian,
        uuid: adminData?.uuid ?? '',
        userImage: adminData?.userImage ?? '',
        aadharNumber: adminData.aadharNumber,
        isAadharNumberVerified: adminData?.isAadharNumberVerified || false,
        passportNumber: adminData.passportNumber,
        firstName: reSetAdminName || '',
        lastName: adminData?.lastName || '',
        dateOfBirth: adminData?.dateOfBirth || '',
        qualification: adminData?.qualification || '',
        phoneNumber1: adminData?.phoneNumber1 || '',
        countryCode1: adminData?.countryCode1 || 91,
        isPhoneNumber1Verified: watchPhoneNUmberVerified || adminData?.isPhoneNumber1Verified || false,
        email: adminData?.email || '',
        addressLine1: adminData?.addressLine1 || '',
        addressLine2: adminData?.addressLine2 || '',
        pincode: adminData?.pincode || '',
        townVillage: adminData?.townVillage || '',
        landmark: adminData?.landmark || '',
        genderId: adminData?.gender?.id || 0,
        designationId: adminData?.designation?.id || 0,
        roleId: adminData?.role?.id || 0,
        cityId: adminData?.city?.id || 0,
        stateId: adminData?.state?.id || 0,
        countryId: adminData?.country?.id || 0
      });
      setIndian(isIndian);
    }
  }, [adminData, reset, genders, cities, states]);

  useEffect(() => {
    if (indian) {
      resetField('passportNumber');
      resetField('aadharNumber', { defaultValue: adminData?.aadharNumber || '' });
    } else {
      resetField('aadharNumber');
      resetField('passportNumber', { defaultValue: adminData?.passportNumber || '' });
    }
  }, [indian]);

  const dateOfBirth = watch('dateOfBirth');
  // const isInvalidDOB = dateOfBirth === '0001-01-01T00:00:00';
  // if (isInvalidDOB) {
  //   setValue('dateOfBirth', '');
  // }
  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  useEffect(() => {
    const age = calculateAge(dateOfBirth).toString();
    setValue('age', age);
  }, [dateOfBirth, setValue, adminData]);

  const aadharNumber = watch('aadharNumber')?.replace(/\s+/g, '');

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const fileFormDatas = async (files: File | null, id: number | string) => {
    try {
      if (!files) {
        console.error('No file provided');
        return '';
      }

      const formData = new FormData();
      formData.append('fileUploadRequests[0].data', files);
      formData.append('fileUploadRequests[0].path', `hospitals/${hospitalId}/users/${id}/profile`);
      formData.append('fileUploadRequests[0].filename', files.name);
      formData.append('fileUploadRequests[0].fieldName', 'profile');
      const response = (await APIService.upload('/files', formData)) as UploadResponse;
      console.log('response from file upload ', response);

      return response?.data?.fileResponse?.[0]?.fullfilepath || '';
    } catch (error) {
      console.error('File upload failed', error);
      return '';
    }
  };

  const handleNationalityChange = (isIndian: boolean) => {
    setIndian(isIndian);
    setValue('isIndian', isIndian, { shouldValidate: true });
    // const updatedQs = { ...parsedQS, isIndian }; // Update query param
    // navigate({ search: QS.stringify(updatedQs) }); // Update URL query params

    if (isIndian) {
      setTempPassport(watch('passportNumber') || ''); // Save passport value
      setValue('passportNumber', '');
      setValue('aadharNumber', tempAadhar || watch('aadharNumber') || '');
    } else {
      setTempAadhar(watch('aadharNumber') || ''); // Save Aadhar value
      setValue('aadharNumber', '');
      setValue('passportNumber', tempPassport || watch('passportNumber') || '');
    }
  };

  const handlePhoneVerification = () => {
    setPhoneVerified(true);
    setValue('isPhoneNumber1Verified', true);
    setOpenOtpDialog(false);
  };

  useEffect(() => {
    if (isDirtyPhoneNumber && enteredPhoneNumber.length === 10) {
      setPhoneVerified(false);
      setValue('isPhoneNumber1Verified', false);
      setIsEnable(true);
    } else {
      setIsEnable(false);
    }
  }, [enteredPhoneNumber, adminData?.phoneNumber1, isDirtyPhoneNumber]);

  const handleOpenDialog = () => {
    setIsAadhar(false);
    if (enteredPhoneNumber !== adminData?.phoneNumber1 && isEnable) {
      setOpenOtpDialog(true);
    }
  };
  // const handleAadharVerify = () => {
  //   setIsAadhar(true);
  //   setOpenOtpDialog(true);
  // };
  const handleAadharVerify = async (value: string) => {
    const sanitizedValue = value.replace(/\s+/g, ''); // removes all spaces

    // Basic validation: 12 digits and numeric
    if (!/^\d{12}$/.test(sanitizedValue)) {
      toast('Please enter a valid 12-digit Aadhar number', 'error');
      return;
    }

    try {
      // Call the API only if the basic validation passes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await getAadhaarResponse(sanitizedValue);
      console.log('response from handle verify', response);

      const result = response?.aadhaarResponse?.result;
      const errorDescription = response?.aadhaarResponse?.errorDescription;

      if (result === 'y' && errorDescription === '') {
        toast('OTP sent successfully', 'success');
        setIsAadhar(true);
        setOpenOtpDialog(true); // Open dialog only on successful verification
      } else {
        toast(errorDescription || 'Aadhar verification failed', 'error');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast('An error occurred during Aadhar verification', 'error');
    }
  };

  console.log('aadhar response ', aadhaarResponse);
  const handleAadhaarOtpVerify = async (otp: string) => {
    setLoading(true);
    const payload = {
      txId: aadhaarResponse?.txId,
      otp: otp,
      aadhaarNumber: aadharNumber
    };
    try {
      const res = await postKycAadharOtp(payload);
      setAadharData(res);
      console.log('aadhar data', aadharData, res);

      const { otpResponse } = res || {};

      console.log('otp response', otpResponse);

      if (otpResponse.result === 'y' && otpResponse.errorDescription === '') {
        toast('Aadhar OTP verified successfully', 'success');
        setOpenOtpDialog(false);
      } else {
        toast(`${otpResponse.errorDescription || 'OTP Verification failed'}`, 'error');
      }
    } catch (error) {
      toast('An error occurred during Aadhar OTP verification', 'error');
    } finally {
      setLoading(false);
    }

    //
    //   // setLoading(false);
    // }
  };
  useEffect(() => {
    if (!aadharData?.name) return;

    setValue('isAadharNumberVerified', true);
    setValue('aadharNumber', aadharNumber);

    const name = aadharData.name;
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || '';
    const formatedDate = formatDateToISO(aadharData.dateOfBirth);
    if (aadharData?.photo) {
      let base64String = aadharData.photo;

      // Check if it already has 'data:image' or not
      if (!base64String.startsWith('data:image')) {
        // assume it's jpeg if no header
        base64String = `data:image/jpeg;base64,${base64String}`;
      }

      try {
        const userImage = base64toFile(base64String, `${name}_aadhar.jpg`);
        setProfileImg(userImage);
        setValue('userImage', userImage);
      } catch (error) {
        console.error('Failed to convert base64 to file', error);
      }
    }
    setValue('uuid', aadharData.uuid);
    setValue('firstName', firstName);
    setValue('lastName', lastName);
    setValue('dateOfBirth', formatedDate || '');
    setValue('addressLine1', aadharData.addressLine1);
    setValue('addressLine2', aadharData.addressLine2);
    setValue('pincode', aadharData.pinCode);
    setValue('landmark', aadharData.landmark);
    setValue('townVillage', aadharData.townorVillage);

    const addressCity = aadharData.district?.toLowerCase();
    const addressState = aadharData.state?.toLowerCase();
    const addressCountry = aadharData.country?.toLowerCase();
    const addressGender = aadharData.gender?.toLowerCase();

    const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
    const findMatch = (list: { label: string; value: number }[], target: string) => {
      const normalizedTarget = normalize(target);
      return (
        list.find((item) => normalizedTarget.includes(normalize(item.label))) ||
        list.find((item) => normalize(item.label).toLowerCase().includes(normalizedTarget))
      );
    };

    const matchedCity = findMatch(cities, addressCity);
    const matchedState = findMatch(states, addressState);
    const matchedCountry = findMatch(countries, addressCountry);
    const matchGender = findMatch(genders, addressGender);

    if (matchedCity) setValue('cityId', matchedCity.value);
    if (matchedState) setValue('stateId', matchedState.value);
    if (matchedCountry) setValue('countryId', matchedCountry.value);
    if (matchGender) setValue('genderId', matchGender.value);
  }, [aadharData]);

  useEffect(() => {
    setAadharData(null);
    setProfileImg(null);
  }, [location.search]);
  console.log('error', errors);
  const watchAadharVerified = watch('isAadharNumberVerified') ?? adminData?.isAadharNumberVerified;
  console.log('aadhar', watchAadharVerified);
  const onSubmit = (data: AdminDetailsType) => {
    console.log('admin data ',data);
    
    if (data.isIndian && !watchAadharVerified) {
      toast('Please verify your Aadhar number', 'error');
      return;
    }

    if (!data.isPhoneNumber1Verified) {
      toast('Please verify your primary phone number', 'error');
      return;
    }

    // setAdminDetailsData(data);
    const formattedData = {
      isIndian: data.isIndian ?? true,
      uuid: data.uuid ?? '',
      userImage: data?.userImage ?? '',
      aadharNumber: indian ? (data.aadharNumber ?? '') : '',
      isAadharNumberVerified: indian ? watchAadharVerified : false,
      passportNumber: !indian ? (data.passportNumber ?? '') : '',
      roleId: data.roleId,
      firstName: data.firstName,
      lastName: data.lastName,
      genderId: data.genderId,
      dateOfBirth: data.dateOfBirth,
      designationId: data.designationId,
      qualification: data.qualification,
      phoneNumber1: data.phoneNumber1, //phoneNumber1.number
      phoneNumber2: data.phoneNumber2 || '',
      isPhoneNumber1Verified: data.isPhoneNumber1Verified,
      isPhoneNumber2Verified: false,
      countryCode1: data.countryCode1 ?? 91, //phoneNumber1.countryCode
      countryCode2: 91,
      email: data.email,
      dateOfJoining: '2024-10-19T16:52:01.906Z',
      practicingSince: '2024-10-19T16:52:01.906Z',
      medicalLicence: 'yup',
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      townVillage: data.townVillage,
      landmark: data.landmark,
      pincode: data.pincode,
      cityId: data.cityId,
      city: {
        id: data.cityId
      },
      state: {
        id: data.stateId
      },
      country: {
        id: data.countryId
      },
      stateId: data.stateId,
      countryId: data.countryId,
      status: 'pendingApproval',
      experience: 1,
      mPanelNumber: 'panel',
      userExperience: [
        {
          role: 'role',
          hospitalName: 'hospitalName',
          dateofJoin: '2024-10-19T16:52:01.906Z',
          dateofRelive: '2024-10-19T16:52:01.906Z',
          caseHandled: 0
        }
      ],
      organ: [
        {
          id: 1,
          name: 'Kidney'
        }
      ],
      tempFilePath: 'tempfile',
      basePath: 'base'
    };

    updateAdminDetails(formattedData, { isIndian: indian }, () => {
      onNext(formattedData);
    });
    // onNext(formattedData);
  };
  // Calculate the min and max dates for the age constraint
  const today = dayjs();
  const maxDate = today.subtract(18, 'year'); // 18 years old is the latest valid date
  const minDate = today.subtract(70, 'year'); // 70 years old is the earliest valid date

  if (!adminData) return <Loading />;

  return (
    <Box className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text className="hospital-form-sub-title">Admin Details</Text>
        <Box className="profile-section">
          <Box className="w-full">
            <ProfileImageField
              control={control}
              name="userImage"
              setValue={setValue}
              setFiles={setProfileImg}
              defaultUrl={adminData?.userImage ?? ''}
              aadharBase64={aadharData?.photo}
            />
          </Box>
          <Box className="nation-section">
            <Box className="flex flex-col ">
              <Text className="!text-[13px] !mb-[0px] !font-[500]">
                Select Nationality <span className="text-[red]">*</span>
              </Text>
              <Box className="flex gap-4 ">
                <Box
                  className={`flex items-center w-full rounded-[20px] px-[8px] ${indian ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
                  onClick={() => handleNationalityChange(true)}
                >
                  {indian ? <TickCircle toolText="" /> : <CircleGreyIcon />}
                  <Text className="pl-[4px] !text-[13px] !font-[500]">Indian</Text>
                </Box>
                <Box
                  onClick={() => handleNationalityChange(false)}
                  className={`flex items-center w-full rounded-[20px] px-[8px] ${!indian ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
                >
                  {indian ? <CircleGreyIcon /> : <TickCircle toolText="" />}
                  <Text className="pl-[4px] !text-[13px] !font-[500]">International</Text>
                </Box>
              </Box>
            </Box>
            <Box className="">
              {!indian ? (
                <FormInput
                  control={control}
                  name="passportNumber"
                  error={!!errors.passportNumber}
                  label="Passport Number"
                  inputProps={{ maxLength: 12 }}
                  required
                  fullWidth
                  disabled={readOnly}
                />
              ) : (
                <FormInput
                  control={control}
                  name="aadharNumber"
                  error={!!errors.aadharNumber}
                  label="Aadhaar Number"
                  inputProps={{ maxLength: 12 }}
                  onAadharVerify={() => handleAadharVerify(aadharNumber || '')}
                  isVerified={adminData?.isAadharNumberVerified || watch('isAadharNumberVerified')}
                  required
                  className="appearance-none"
                  aadhar
                  fullWidth
                  disabled={readOnly}
                />
              )}
            </Box>
            <Box className="">
              <FormInput control={control} name="firstName" label="First Name" required fullWidth disabled={readOnly} />
            </Box>
            <Box className="">
              <FormInput control={control} name="lastName" label="Last Name" required fullWidth disabled={readOnly} />
            </Box>
          </Box>
        </Box>
        <Box className="details-section">
          <Box className="relative">
            <AtomDatePicker
              control={control}
              name="dateOfBirth"
              label="Date Of Birth"
              fullWidth
              required
              minDate={minDate}
              maxDate={maxDate}
              disabled={readOnly}
            />
          </Box>
          <Box className="">
            <FormInput control={control} name="age" label="Age" readOnly fullWidth disabled={readOnly} />
          </Box>
          <Box className="">
            <FormSelect
              menuOptions={genders}
              control={control}
              name="genderId"
              label="Gender"
              fullWidth
              required
              disabled={readOnly}
            />
          </Box>
          <Box className="">
            <FormSelect
              menuOptions={designationOptions}
              control={control}
              name="designationId"
              label="Designation"
              fullWidth
              required
              disabled
            />
          </Box>
          <Box className="">
            <FormSelect
              control={control}
              name="roleId"
              menuOptions={roleOptions}
              label="Role"
              fullWidth
              required
              disabled
            />
          </Box>
          <Box className="">
            <FormInput
              control={control}
              name="qualification"
              label="Qualification"
              fullWidth
              required
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
              onVerify={handleOpenDialog}
              onPhoneNumberChange={setEnteredNumber}
              isVerified={phoneVerified}
              isEnable={isEnable}
              disable={readOnly}
              required
            />
          </Box>
          <Box className="">
            <FormInput control={control} name="email" label="Email" disabled fullWidth required />
          </Box>
        </Box>
        <Box className="address-section">
          <Text className="hospital-form-sub-title">Admin Address</Text>
          <Box className="details-section">
            <Box className="">
              <FormInput
                control={control}
                name="addressLine1"
                label="Address Line 1"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput control={control} name="addressLine2" label="Address Line 2" fullWidth disabled={readOnly} />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="townVillage"
                label="Town / Village"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput control={control} name="landmark" label="Landmark" fullWidth disabled={readOnly} />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="pincode"
                label="Pin code"
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
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              {/* <FormSelect
              menuOptions={stateOptions}
              control={control}
              name="stateId"
              label="State"
              fullWidth
              required
              disabled={readOnly}
            /> */}
              <FormAutoCompleteSelect
                name="stateId"
                control={control}
                label="State"
                menuOptions={states}
                disabled={readOnly}
                required={true}
              />
            </Box>
            <Box className="">
              <FormSelect
                menuOptions={countries}
                control={control}
                name="countryId"
                label="Country"
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
          </Box>
        </Box>
        {reCheck && <FooterButton isFirstStep={true} onSubmit={handleSubmit(onSubmit)} />}
        <MobileOtp
          open={openOtpDialog}
          isAadhar={isAadhar}
          onClose={() => setOpenOtpDialog(false)}
          onVerify={
            isAadhar
              ? (otp) => {
                  handleAadhaarOtpVerify(otp);
                }
              : handlePhoneVerification
          }
          phoneNumber={enteredPhoneNumber}
          onResend={() => {
            handleAadharVerify(aadharNumber || '');
          }}
          currentPhoneType={'primary'}
        />
      </form>
    </Box>
  );
};

export default AdminDetails;
