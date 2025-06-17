import { AtomDatePicker, Box, Button, FormInput, FormSelect, Text } from '@/atoms';
import { PostTranstanUser, SingleTranstanUser } from '@/types/resource';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { postTranstanUserSchema } from '../validators';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { useResource } from '../ResourceContext';
import { toast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import { Designation, Role } from '@/types/common.type';
import MobileOtp from '@/pages/components/MobileOtp';
import { formatDateToISO } from '@/utils';
import Loading from '@/pages/components/Loading';
import { ProfileImageField } from '@/pages/components/ProfileImageInput';
import { base64toFile } from '@/utils/base64tofile';
import { APIService } from '@/services';
import { addDoc, collection } from 'firebase/firestore';
import { dataBase } from '../../../firebase-config';

interface UploadResponse {
  data: {
    fileResponse: { fullfilepath: string }[];
  };
}
interface AddTranstanUserProps {
  userData?: SingleTranstanUser;
  title?: string;
  isView?: boolean;
  isEdit?: boolean;
}
const AddTranstanUser: React.FC<AddTranstanUserProps> = ({
  userData = null,
  title = 'Add Transtan User',
  isView = false,
  isEdit = false
}) => {
  const navigate = useNavigate();
  const userRef = collection(dataBase, 'Users');

  const [openOtp, setOpenOtp] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileImg, setProfileImg] = useState<any>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aadhaarData, setAadhaarData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneData, setPhoneData] = useState({
    primary: {
      number: userData?.primaryMobileNo ?? '',
      verified: userData?.isPhoneNumber1Verified ?? false,
      isDirty: false,
      isEnable: false
    },
    alternate: {
      number: userData?.secondaryMobileNo ?? '',
      verified: userData?.isPhoneNumber2Verified ?? false,
      isDirty: false,
      isEnable: false
    }
  });
  const [currentPhoneType, setCurrentPhoneType] = useState<'primary' | 'alternate' | null>(null);
  const [isAadhar, setIsAadhar] = useState(false);
  const {
    state: { genders, bloodGroup, designations, roles, cities, states, countries, aadhaarResponse },
    action: { getAadhaarResponse, postKycAadharOtp }
  } = useMasterData();

  const DeginationOptions = designations.map((d: Designation) => ({
    label: d.name,
    value: d.id
  }));
  const RoleOptions = roles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((d: any) => d.roleType === 'Transtan')
    .map((r: Role) => ({
      label: r.name,
      value: r.id
    }));
  const {
    actions: { addTranstanUser, editTranstanUser, updateProfilePhoto }
  } = useResource();
  const { control, handleSubmit, setValue, reset, watch } = useForm<PostTranstanUser>({
    resolver: zodResolver(postTranstanUserSchema),
    defaultValues: {
      isIndian: true,
      aadhaarNumber: '',
      uuid: '',
      isAadhaarNumberVerified: false,
      userImage: '',
      firstName: '',
      lastName: '',
      genderId: 0,
      dateOfBirth: '',
      bloodGroupId: 0,
      phoneNumber1: '',
      phoneNumber2: '',
      countryCode1: '',
      countryCode2: '',
      isPhoneNumber1Verified: false,
      isPhoneNumber2Verified: false,
      email: '',
      designationId: 0,
      roleId: 0,
      qualification: '',
      addressLine1: '',
      addressLine2: '',
      townVillage: '',
      landmark: '',
      pincode: '',
      cityId: 0,
      stateId: 0,
      countryId: 0
    }
  });
  const aadhaarNumber = watch('aadhaarNumber')?.replace(/\s+/g, '');
  const watchPhoneNumber1Verified = watch('isPhoneNumber1Verified');
  const watchPhoneNumber2Verified = watch('isPhoneNumber2Verified');

  useEffect(() => {
    if (userData) {
      reset({
        aadhaarNumber: userData.aadharNumber,
        isAadhaarNumberVerified: userData.isAadharNumberVerified,
        uuid: userData.uuid ?? '',
        userImage: userData.userImage || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        dateOfBirth: userData.dateOfBirth,
        genderId: userData.gender.id,
        bloodGroupId: userData.bloodGroup.id,
        phoneNumber1: userData.primaryMobileNo,
        phoneNumber2: userData.secondaryMobileNo,
        isPhoneNumber1Verified: userData?.isPhoneNumber1Verified ?? watchPhoneNumber1Verified,
        isPhoneNumber2Verified: userData?.isPhoneNumber2Verified ?? watchPhoneNumber2Verified,
        countryCode1: userData.countryCode1 ?? 91,
        countryCode2: userData.countryCode2 ?? 91,
        email: userData.email,
        designationId: userData.designation?.id,
        roleId: userData.role?.id,
        qualification: userData.qualification,
        addressLine1: userData.addressLine1,
        addressLine2: userData.addressLine2,
        townVillage: userData.townVillage,
        landmark: userData.landmark,
        pincode: userData.pinCode,
        cityId: userData.city.id,
        stateId: userData.state.id,
        countryId: userData.country.id
      });
    }
  }, [userData]);

  //for aadhaar verification
  const handleAadharVerify = async (value: string) => {
    const sanitizedValue = value.replace(/\s+/g, '');
    if (sanitizedValue.length !== 12) {
      toast('Enter a valid Aadhar number', 'error');
      return;
    }
    try {
      setOpenOtp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await getAadhaarResponse(sanitizedValue);
      console.log('res', response);

      if (response?.aadhaarResponse?.result === 'y' && response?.aadhaarResponse?.errorDescription === '') {
        setIsAadhar(true);
        setOpenOtp(true);
        toast('OTP sent successfully', 'success');
      } else {
        toast(response?.aadhaarResponse?.errorDescription || 'Aadhar verification failed', 'error');
      }
    } catch (error) {
      toast('An error occurred during Aadhar verification', 'error');
    }
  };

  const fileFormDatas = async (files: File, id: number | string) => {
    try {
      if (!files) {
        console.error('No file provided');
        return '';
      }

      const formData = new FormData();
      formData.append('fileUploadRequests[0].data', files);
      formData.append('fileUploadRequests[0].path', `transtan/${id}/profile`);
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

  const handleAadhaarOtpVerify = async (otp: string) => {
    setLoading(true);
    const payload = {
      txId: aadhaarResponse?.txId,
      otp: otp,
      aadhaarNumber: aadhaarNumber
    };
    try {
      const res = await postKycAadharOtp(payload);
      setAadhaarData(res);
      console.log('aadhar data', aadhaarData, res);

      const { otpResponse } = res || {};

      console.log('otp response', otpResponse);

      if (otpResponse.result === 'y' && otpResponse.errorDescription === '') {
        toast('Aadhar OTP verified successfully', 'success');
        setOpenOtp(false);
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
    if (!aadhaarData?.name) return;

    setValue('isAadhaarNumberVerified', true);
    setValue('aadhaarNumber', aadhaarNumber);

    const name = aadhaarData.name;
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || '';
    const formatedDate = formatDateToISO(aadhaarData.dateOfBirth);

    //for image
    if (aadhaarData?.photo) {
      let base64String = aadhaarData.photo;

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
    setValue('firstName', firstName);
    setValue('lastName', lastName);
    setValue('dateOfBirth', formatedDate || '');
    setValue('addressLine1', aadhaarData.addressLine1);
    setValue('addressLine2', aadhaarData.addressLine2);
    setValue('pincode', aadhaarData.pinCode);
    setValue('landmark', aadhaarData.landmark);
    setValue('townVillage', aadhaarData.townorVillage);
    setValue('uuid', aadhaarData.uuid);

    const addressCity = aadhaarData.district?.toLowerCase();
    const addressState = aadhaarData.state?.toLowerCase();
    const addressCountry = aadhaarData.country?.toLowerCase();
    const addressGender = aadhaarData.gender?.toLowerCase();

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
  }, [aadhaarData]);

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
    setIsAadhar(false);
    if (
      // phoneData[type].number !== detailsData?.[`phoneNumber${type === 'primary' ? '1' : '2'}`] &&
      phoneData[type].isEnable
    ) {
      setCurrentPhoneType(type);
      setOpenOtp(true);
    }
  };
  const handlePhoneVerification = () => {
    setIsAadhar(false);
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
    setOpenOtp(false);
  };

  const onSubmit = async (data: PostTranstanUser) => {
    console.log('data', data);

    // let uploadedImagePath = '';

    // // 1️⃣ Check if data.userImage is a File
    // if (data.userImage && data.userImage instanceof File) {
    //   uploadedImagePath = await fileFormDatas(data.userImage, userData?.userID || ''); // pass id or uuid
    // }
    // eslint-disable-next-line prefer-const
    // let userImageFile = data.userImage instanceof File ? data.userImage : null;
    const payload = {
      userImage: data.userImage ?? '',
      isIndian: true,
      aadharNumber: data.aadhaarNumber,
      isAadharNumberVerified: data.isAadhaarNumberVerified ?? false,
      uuid: data.uuid,
      firstName: data.firstName,
      lastName: data.lastName,
      genderId: data.genderId,
      dateOfBirth: data.dateOfBirth,
      bloodGroupId: data.bloodGroupId,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: data.phoneNumber2,
      countryCode1: data.countryCode1 || 91,
      countryCode2: data.countryCode2 || 91,
      isPhoneNumber1Verified: data.isPhoneNumber1Verified ?? false,
      isPhoneNumber2Verified: data.isPhoneNumber2Verified ?? false,
      email: data.email,
      designationId: data.designationId,
      roleId: data.roleId,
      qualification: data.qualification,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      townVillage: data.townVillage,
      landmark: data.landmark,
      pincode: data.pincode,
      cityId: data.cityId,
      stateId: data.stateId,
      countryId: data.countryId
    };
    console.log('payload', payload);
    isEdit
      ? editTranstanUser(userData?.userID ?? 0, payload, async () => {
          toast('Transtan User Added Successfully', 'success');
          navigate('/resource-management');
        })
      : addTranstanUser(payload, async (res) => {
          const newUserId = res?.id;
          const profileImgPath = await fileFormDatas(profileImg, newUserId);
          console.log('profile image path ', profileImgPath);
          await addDoc(userRef, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber1: data.phoneNumber1
          });
          await updateProfilePhoto(newUserId, profileImgPath, () => {
            toast('Profile Image Updated Successfully', 'success');
          });
          toast('Transtan User Added Successfully', 'success');
          navigate('/resource-management');
        });
  };

  return (
    <Box>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text className="!text-[19px] !font-bold text-[#804595]">{title}</Text>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-7">
            <Box className="col-span-1 row-span-2 flex items-center justify-center">
              <ProfileImageField
                control={control}
                name="userImage"
                setValue={setValue}
                setFiles={setProfileImg}
                defaultUrl={userData?.userImage ?? ''}
                aadharBase64={aadhaarData?.photo}
              />
            </Box>
            <Box className="col-span-2 grid-cols-1 grid md:grid-cols-2 gap-10">
              <FormInput
                control={control}
                name="aadhaarNumber"
                label="Aadhaar Number"
                required
                fullWidth
                aadhar={true}
                isVerified={watch('isAadhaarNumberVerified')}
                onAadharVerify={() => handleAadharVerify(aadhaarNumber)}
                // value={watch('aadhaarNumber')}
                // onChange={(e) => {
                //   setValue('aadhaarNumber', e.target.value);
                // }}
              />
              <FormInput control={control} name="firstName" label="First Name" required fullWidth />
              <FormInput control={control} name="lastName" label="Last Name" required fullWidth />
              <FormSelect menuOptions={genders} control={control} name="genderId" label="Gender" required fullWidth />
            </Box>
          </Box>
          <Box className="col-span-2 grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-3 gap-10">
            <AtomDatePicker control={control} name="dateOfBirth" label="Date Of Birth" fullWidth required />
            <FormSelect
              menuOptions={bloodGroup}
              control={control}
              name="bloodGroupId"
              label="Blood Group"
              required
              fullWidth
            />
            <StyledPhoneInput
              control={control}
              name="phoneNumber1"
              label="Phone"
              countryCodeName="countryCode1"
              setValue={setValue}
              helperText="Phone Number is Required"
              onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'primary')}
              isVerified={phoneData.primary.verified}
              onVerify={() => handleOpenDialog('primary')}
              isEnable={phoneData.primary.isEnable}
              required
            />
            <StyledPhoneInput
              control={control}
              name="phoneNumber2"
              label="Alternative Phone"
              countryCodeName="countryCode2"
              setValue={setValue}
              helperText="Alternative Phone Number is Required"
              onVerify={() => handleOpenDialog('alternate')}
              onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'alternate')}
              isVerified={phoneData.alternate.verified}
              isEnable={phoneData.alternate.isEnable}
              required
            />
            <FormInput control={control} name="email" label="Email" required fullWidth />
            <FormSelect
              menuOptions={DeginationOptions}
              control={control}
              name="designationId"
              label="Designation"
              required
              fullWidth
            />
            <FormSelect menuOptions={RoleOptions} control={control} name="roleId" label="Role" required fullWidth />
            <FormInput control={control} name="qualification" label="Qualification" required fullWidth />
          </Box>
          <Text className="!text-[19px] !font-bold text-[#804595] !mt-8 !mb-7">User Address</Text>
          <Box className="col-span-2 grid grid-cols-1 mt-10 md:mt-0 md:grid-cols-3 gap-10">
            <FormInput control={control} name="addressLine1" label="Address Line 1" required fullWidth />
            <FormInput control={control} name="addressLine2" label="Address Line 1" required fullWidth />
            <FormInput control={control} name="townVillage" label="Town/Village" required fullWidth />
            <FormInput control={control} name="landmark" label="Landmark" required fullWidth />
            <FormInput
              control={control}
              name="pincode"
              label="Pincode"
              inputProps={{ maxLength: 6 }}
              required
              fullWidth
            />
            <FormSelect menuOptions={cities} control={control} name="cityId" label="City" required fullWidth />
            <FormSelect menuOptions={states} control={control} name="stateId" label="State" required fullWidth />
            <FormSelect menuOptions={countries} control={control} name="countryId" label="Country" required fullWidth />
          </Box>
          {!isView && (
            <Box className="flex justify-end gap-4 mt-10 ">
              <Button
                className="w-[15%]"
                variant="outlined"
                onClick={() => {
                  navigate('/resource-management');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-[15%]" variant="contained" onClick={handleSubmit(onSubmit)}>
                {isEdit ? 'Update' : 'Submit'}
              </Button>
            </Box>
          )}
        </form>
      )}
      <MobileOtp
        open={openOtp}
        onClose={() => {
          setOpenOtp(false);
          // setCurrentPhoneType(null);
        }}
        onVerify={
          isAadhar
            ? (otp) => {
                handleAadhaarOtpVerify(otp);
              }
            : handlePhoneVerification
        }
        onResend={() => {
          handleAadharVerify(aadhaarNumber);
        }}
        phoneNumber={currentPhoneType === 'primary' ? phoneData.primary.number : phoneData.alternate.number}
        currentPhoneType={currentPhoneType}
        isAadhar={isAadhar}
      />
    </Box>
  );
};

export default AddTranstanUser;
