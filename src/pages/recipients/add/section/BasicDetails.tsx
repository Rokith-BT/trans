/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteIcon } from '@/assets/icons';
import { AtomDatePicker, Box, Button, FormFileInput, FormInput, FormSelect, Text, MUIContainer } from '@/atoms';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicDetailsSchema } from '../../validators';
import RecipientFooter from './RecipientFooter';
import dayjs from 'dayjs';
import MobileOtp from '@/pages/components/MobileOtp';
import NoticeAddRecepientDialog from '../../section/NoticeAddRecepientDialog';
import { useParams } from 'react-router';
import { OrganRequestData, RecipientBasicDetailsType } from '@/types/recipient';
import { useRecipient } from '../../RecipientContext';
import { APIService } from '@/services';
import ImageViewer from '@/pages/components/ImageViewer';
import AddALF from '@/pages/alf/section/ADDALF';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import { toast } from '@/utils/toast';
import { formatDateToISO } from '@/utils';
import { ProfileImageField } from '@/pages/components/ProfileImageInput';
import { base64toFile } from '@/utils/base64tofile';
import { Grid } from '@mui/material';
import FileViewModal from './FileViewModal';

interface UploadResponse {
  data: {
    fileResponse: { fullfilepath: string }[];
  };
}

interface BasicDetailsProps {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: any) => void;
  isPreview: boolean;
  forCancel?: boolean;
  isPopupShow?: boolean;
  BasicDetails?: RecipientBasicDetailsType;
  organsRequest?: OrganRequestData;
  isIndian?: boolean;
  alfDetails?: {
    alf: boolean;
    view?: boolean;
    isApprove?: boolean;
    organDetails?: any[];
    alfID?: number | string;
    isALFReview?: boolean;
    isDeleteEnable?: boolean;
  };
  HospitalData?: { hospitalID: number; hospitalName: string; hospitalType?: string };
  isApprove?: boolean;
}

const BasicDetails: React.FC<BasicDetailsProps> = ({
  readOnly,
  onNext,
  isPreview = false,
  forCancel = false,
  isPopupShow,
  BasicDetails,
  organsRequest,
  isIndian,
  HospitalData,
  alfDetails
}) => {
  console.log(BasicDetails, 'BasicDetails171298', alfDetails);
  // eslint-disable-next-line prefer-const

  const { recipientId } = useParams();
  // const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState<any>(null);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [isAadhar, setIsAadhar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openImgModal, setOpenImgModal] = useState(false);
  const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const [aadhaarData, setAadhaarData] = useState<any>(null);

  const [phoneData, setPhoneData] = useState({
    primary: {
      number: BasicDetails?.phoneNumber1 ?? '',
      verified: BasicDetails?.isPhoneNumber1Verified ?? false,
      isDirty: false,
      isEnable: false
    },
    alternate: {
      number: BasicDetails?.phoneNumber2 ?? '',
      verified: BasicDetails?.isPhoneNumber2Verified ?? false,
      isDirty: false,
      isEnable: false
    }
  });
  console.log(phoneData, 'phoneDataphoneDataphoneData12');

  const [currentPhoneType, setCurrentPhoneType] = useState<'primary' | 'alternate' | null>(null);
  console.log(file, 'filefile17', typeof file);

  const {
    state: { genders, countries, cities, states, cmInsurance, bloodGroup, alfListingType, aadhaarResponse },
    action: { getAadhaarResponse, postKycAadharOtp }
  } = useMasterData();
  const {
    actions: { insertRecipientBasic, updateRecipientBasicAddress, updateRecipientBasic, updateRecipientBasicProfile },
    state: {}
  } = useRecipient();

  const genderOptions = genders;
  const stateOptions = states;
  const citiesOptions = cities;
  const countriesOptions = countries;
  const bloodGroupOptions = bloodGroup;
  let cmInsuranceOption = cmInsurance.filter((e: { value: number }) => ![3, 5, 6].includes(e.value));
  if (!BasicDetails || BasicDetails.address === undefined) {
    cmInsuranceOption = cmInsuranceOption.filter((e: { value: number }) => e.value === 2 || e.value === 4);
  }
  console.log(cmInsuranceOption, 'cmInsuranceOption');

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      isLoadingBasic: false,
      isIndian,
      recipientImage: BasicDetails?.recipientImage ?? '',
      aadharNumber: BasicDetails?.aadharNumber ?? '',
      isAadharNumberVerified: BasicDetails?.isAadharNumberVerified ?? false,
      uuid: '',
      passportNumber: BasicDetails?.passportNumber ?? '',
      passportDocument: BasicDetails?.passportDocument ?? '',
      embassyDocument: BasicDetails?.embassyDocument ?? '',
      name: BasicDetails?.name ?? '',
      gender: BasicDetails?.genderId ?? '',
      dateOfBirth: BasicDetails?.dateOfBirth ?? '',
      age: BasicDetails?.age ?? '',
      fatherName: BasicDetails?.fatherOrSpouseName ?? '',
      phoneNumber1: BasicDetails?.phoneNumber1 ?? '',
      countryCode1: BasicDetails?.countryCode1 ?? 0,
      countryCode2: BasicDetails?.countryCode2 ?? 0,
      phoneNumber2: BasicDetails?.phoneNumber2 ?? '',
      email: BasicDetails?.email ?? '',
      bloodGroup: BasicDetails?.bloodGroupId ?? '',
      cminsuranceId: BasicDetails?.cminsuranceId ?? '',
      cminsuranceDoc: BasicDetails?.cminsuranceDoc ?? '',
      isPhoneNumber1Verified: BasicDetails?.isPhoneNumber1Verified ?? false,
      isPhoneNumber2Verified: BasicDetails?.isPhoneNumber2Verified ?? false,
      address: BasicDetails?.address ?? [
        {
          id: 0,
          recipientId: 0,
          addressLine1: '',
          addressLine2: '',
          townOrVillage: '',
          landmark: '',
          pincode: '',
          cityId: 0,
          stateId: 0,
          countryId: 0,
          isPrimary: true
        }
      ]
    }
  });

  const watchPhoneNumber1Verified = watch('isPhoneNumber1Verified');
  const watchPhoneNumber2Verified = watch('isPhoneNumber2Verified');
  const isLoadingBasic = watch('isLoadingBasic');

  useEffect(() => {
    reset({
      isIndian,
      recipientImage: BasicDetails?.recipientImage ?? '',
      uuid: BasicDetails?.uuid ?? '',
      aadharNumber: BasicDetails?.aadharNumber ?? '',
      isAadharNumberVerified: BasicDetails?.isAadharNumberVerified ?? false,
      passportNumber: BasicDetails?.passportNumber ?? '',
      passportDocument: BasicDetails?.passportDocument ?? '',
      embassyDocument: BasicDetails?.embassyDocument ?? '',
      name: BasicDetails?.name ?? '',
      gender: BasicDetails?.genderId ?? '',
      dateOfBirth: BasicDetails?.dateOfBirth ?? '',
      age: BasicDetails?.age ?? '',
      fatherName: BasicDetails?.fatherOrSpouseName ?? '',
      phoneNumber1: BasicDetails?.phoneNumber1 ?? '',
      phoneNumber2: BasicDetails?.phoneNumber2 ?? '',
      countryCode1: BasicDetails?.countryCode1 ?? 91,
      countryCode2: BasicDetails?.countryCode2 ?? 91,
      email: BasicDetails?.email ?? '',
      bloodGroup: BasicDetails?.bloodGroupId ?? '',
      cminsuranceId: BasicDetails?.cminsuranceId ?? '',
      cminsuranceDoc: BasicDetails?.cminsuranceDoc ?? '',
      isPhoneNumber1Verified: (watchPhoneNumber1Verified || BasicDetails?.isPhoneNumber1Verified) ?? false,
      isPhoneNumber2Verified: (watchPhoneNumber2Verified || BasicDetails?.isPhoneNumber2Verified) ?? false,
      address: BasicDetails?.address ?? [
        {
          id: 0,
          recipientId: 0,
          addressLine1: '',
          addressLine2: '',
          townOrVillage: '',
          landmark: '',
          pincode: '',
          cityId: 0,
          stateId: 0,
          countryId: 0,
          isPrimary: true
        }
      ]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset, BasicDetails, recipientId]);

  const { fields, append, remove } = useFieldArray({ control, name: 'address' });

  const dateOfBirth = watch('dateOfBirth');
  const Addresses = watch('address');
  const cminsuranceId = watch('cminsuranceId');
  console.log(cminsuranceId, 'cminsuranceId');

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
    const hasShownPopup = localStorage.getItem('hasShownPopup');

    if (!hasShownPopup && isPopupShow) {
      setOpenModal(true);
      localStorage.setItem('hasShownPopup', 'true'); // Mark as shown
    }
  }, [isPopupShow]);
  useEffect(() => {
    const age: number = calculateAge(dateOfBirth); //.toString()
    setValue('age', age);
  }, [dateOfBirth, setValue]);

  const handleAddNewAddress = () => {
    append({
      id: 0,
      recipientId: 0,
      addressLine1: '',
      addressLine2: '',
      townOrVillage: '',
      landmark: '',
      pincode: '',
      cityId: 0,
      stateId: 0,
      countryId: 0,
      isPrimary: false
    });
  };

  const handlePhoneNumberChange = (value: string, type: 'primary' | 'alternate') => {
    setPhoneData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        number: value,
        isDirty: true,
        isEnable: value.length === 10 && value !== BasicDetails?.[`phoneNumber${type === 'primary' ? '1' : '2'}`],
        verified: false
      }
    }));
  };
  const handleOpenDialog = (type: 'primary' | 'alternate') => {
    setIsAadhar(false);
    console.log(
      phoneData[type].number !== BasicDetails?.[`phoneNumber${type === 'primary' ? '1' : '2'}`] &&
        phoneData[type].isEnable,
      'edfvsrdvfrvgfbgr'
    );

    if (
      phoneData[type].number !== BasicDetails?.[`phoneNumber${type === 'primary' ? '1' : '2'}`] &&
      phoneData[type].isEnable
    ) {
      setCurrentPhoneType(type);
      setOpenOtpDialog(true);
    }
  };
  const handlePhoneVerification = () => {
    console.log(currentPhoneType, 'ewfcefcescfedced1');
    if (currentPhoneType) {
      setPhoneData((prev) => ({
        ...prev,
        [currentPhoneType]: {
          ...prev[currentPhoneType],
          verified: true
        }
      }));
      setValue(currentPhoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', true);
      toast(`${currentPhoneType === 'primary' ? 'Primary' : 'Alternate'} Phone Verified`, 'success');
    }
    setOpenOtpDialog(false);
  };
  useEffect(() => {
    Object.keys(phoneData).forEach((type) => {
      const phoneType = type as 'primary' | 'alternate';
      if (phoneData[phoneType].isDirty && phoneData[phoneType].number.length === 10) {
        setValue(phoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', false);
      }
    });
  }, [phoneData.primary.number, phoneData.alternate.number]);
  const aadhaarNumber = watch('aadharNumber').replace(/\s+/g, '');
  // const handleAadharVerify = async (value: string) => {
  //   const sanitizedValue = value.replace(/\s+/g, '');
  //   if (sanitizedValue.length !== 12) {
  //     toast('Enter a valid Aadhar number', 'error');
  //     return;
  //   }
  //   try {
  //     setIsAadhar(true);
  //     setOpenOtpDialog(true);
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     const response: any = await getAadhaarResponse(sanitizedValue);
  //     console.log('res', response);

  //     if (response?.aadhaarResponse?.result === 'y' && response?.aadhaarResponse?.errorDescription === '') {
  //       toast('OTP sent successfully', 'success');
  //     } else {
  //       toast(response?.aadhaarResponse?.errorDescription || 'Aadhar verification failed', 'error');
  //     }
  //   } catch (error) {
  //     toast('An error occurred during Aadhar verification', 'error');
  //   }
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
  const handleAadhaarOtpVerify = async (otp: string) => {
    //
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
        setOpenOtpDialog(false);
      } else {
        toast(`${otpResponse.errorDescription || 'OTP Verification failed'}`, 'error');
      }
    } catch (error) {
      toast('An error occurred during Aadhar OTP verification', 'error');
    } finally {
      // setLoading(false);
    }

    //
    //   // setLoading(false);
    // }
  };
  useEffect(() => {
    if (!aadhaarData?.name) return;

    setValue('isAadharNumberVerified', true);
    setValue('aadharNumber', aadhaarNumber);
    // const userImage = base64toFile(aadhaarData?.photo, 'aadhaarImage.jpg');
    // setFiles(userImage);
    if (aadhaarData?.photo) {
      let base64String = aadhaarData.photo;

      // Check if it already has 'data:image' or not
      if (!base64String.startsWith('data:image')) {
        // assume it's jpeg if no header
        base64String = `data:image/jpeg;base64,${base64String}`;
      }

      try {
        const userImage: any = base64toFile(base64String, `${aadhaarData.name}_aadhar.jpg`);
        setFiles(userImage);
        setValue('recipientImage', userImage);
      } catch (error) {
        console.error('Failed to convert base64 to file', error);
      }
    }
    // const name = aadhaarData.name;
    // const [firstName, ...rest] = name.split(' ');
    // const lastName = rest.join(' ') || '';
    const formatedDate = formatDateToISO(aadhaarData.dateOfBirth);

    setValue('name', aadhaarData.name);
    // setValue('lastName', lastName);
    setValue('dateOfBirth', formatedDate || '');
    setValue(`address.${0}.addressLine1`, aadhaarData.addressLine1);
    setValue(`address.${0}.addressLine2`, aadhaarData.addressLine2);
    setValue(`address.${0}.pincode`, aadhaarData.pinCode);
    setValue(`address.${0}.landmark`, aadhaarData.landmark);
    setValue(`address.${0}.townOrVillage`, aadhaarData.townorVillage);
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
    console.log(matchedCity, matchedState, matchedCountry, matchGender, matchedCity, 'matchedCity');

    if (matchedCity) setValue(`address.${0}.cityId`, matchedCity.value);
    if (matchedState) setValue(`address.${0}.stateId`, matchedState.value);
    if (matchedCountry) setValue(`address.${0}.countryId`, matchedCountry.value);
    if (matchGender) setValue('gender', matchGender.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aadhaarData]);

  const fileFormDatas = async (files: File, id: number | string) => {
    try {
      // setLoader(true);
      if (!files) {
        console.error('No file provided');
        return '';
      }

      const formData = new FormData();
      formData.append('fileUploadRequests[0].data', files);
      formData.append('fileUploadRequests[0].path', `recipient/${id}/profile`);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    console.log('data', data);
    if (isIndian && !data.isAadharNumberVerified) {
      toast('Please Verify Your Aadhaar Number', 'error');
      return;
    }
    // if (!data?.watchPhoneNumber1Verified) {
    //   toast('Please Verify Your Primary Phone Number', 'error');
    //   return;
    // }
    // if (!data?.watchPhoneNumber1Verified) {
    //   toast('Please Verify Your Alternative Phone Number ', 'error');
    //   return;
    // }
    try {
      // setValue('isLoadingBasic', true);
      const isUpdating = !!BasicDetails?.id;
      const recipientId = isUpdating ? Number(BasicDetails?.id) : undefined;
      const payload = {
        id: recipientId,
        transtanId: isUpdating ? BasicDetails?.transtanId : '',
        hospitalId: HospitalData?.hospitalID,
        isIndian: isIndian,
        aadharNumber: data.aadharNumber,
        isAadharNumberVerified: data.isAadharNumberVerified,
        uuid: isIndian ? (isUpdating ? data?.uuid : aadhaarData?.uuid) : '',
        passportNumber: data.passportNumber,
        name: data.name,
        genderId: data.gender,
        dateOfBirth: data.dateOfBirth || '',
        age: data.age,
        fatherOrSpouseName: data.fatherName,
        phoneNumber1: data.phoneNumber1,
        phoneNumber2: data.phoneNumber2,
        countryCode1: data.countryCode1,
        countryCode2: data.countryCode2,
        isPhoneNumber1Verified: watchPhoneNumber1Verified || data.isPhoneNumber1Verified,
        isPhoneNumber2Verified: watchPhoneNumber2Verified || data.isPhoneNumber2Verified,
        email: data.email,
        bloodGroupId: Number(data.bloodGroup),
        cminsuranceId: data.cminsuranceId,
        cminsuranceDoc: data.cminsuranceDoc
        // recipientImage: files
      };
      const processAddressAndFile = async (id: number) => {
        Addresses?.map((obj, i) => {
          obj.recipientId = id;
          obj.id = BasicDetails?.address?.[i]?.id || 0;
        });
        let basicDocs: {
          passportDoc: string | undefined;
          embassyDocument: string | undefined;
          profilePhoto: string | undefined;
        } = {
          profilePhoto: '',
          passportDoc: '',
          embassyDocument: ''
        };
        if (files || data.passportDocument || data.embassyDocument) {
          console.log(files, 'files121212');

          try {
            basicDocs = {
              profilePhoto: files ? await fileFormDatas(files, id) : BasicDetails?.recipientImage,
              passportDoc:
                typeof data.passportDocument === 'string'
                  ? data.passportDocument
                  : await fileFormDatas(data.passportDocument, id),
              embassyDocument:
                typeof data.embassyDocument === 'string'
                  ? data.embassyDocument
                  : await fileFormDatas(data.embassyDocument, id)
            };
            await updateRecipientBasicProfile(id, basicDocs, () => {});
          } catch (error) {
            console.error('Upload failed', error);
          }
        }
        console.log(Addresses, 'vAddressesAddressesAddresses');

        updateRecipientBasicAddress(id, Addresses, () =>
          onNext({
            ...payload,
            id: id,
            hospitalType: { name: HospitalData?.hospitalType },
            address: Addresses,
            passportDocument: basicDocs?.passportDoc,
            embassyDocument: basicDocs?.embassyDocument,
            recipientImage: basicDocs?.profilePhoto
          })
        );
      };
      isUpdating
        ? updateRecipientBasic(Number(recipientId), payload, () => processAddressAndFile(Number(recipientId)))
        : insertRecipientBasic(payload, (resp) => processAddressAndFile(resp?.id));
    } catch (err) {
      console.log(err);
    }
  };

  const today = dayjs();
  const maxDate = today.subtract(0, 'year');
  const minDate = today.subtract(140, 'year');
  const imageUser = watch('recipientImage');
  console.log(imageUser, 'imageUser');
  console.log('BasicDetails?.recipientImage', BasicDetails?.recipientImage);
  console.log('errors', errors);

  return (
    <MUIContainer maxWidth="xl">
      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {alfDetails?.alf && (
            <AddALF
              readOnly={false}
              getALFListing={alfListingType}
              currentRecipientID={recipientId}
              organsRequest={organsRequest}
              isApprove={alfDetails?.isApprove}
              isALFReview={alfDetails?.isALFReview}
              alfID={alfDetails?.alfID}
              viewOnly={alfDetails?.view}
              isDeleteEnable={alfDetails?.isDeleteEnable}
              recipientName={BasicDetails?.name}
            />
          )}
          <Box className=" h-6"></Box>
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px]">Basic Details</Text>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} md={4}>
              {BasicDetails?.recipientImage ? (
                <ImageViewer file={watch('recipientImage')} setFiles={setFiles} />
              ) : (
                <ProfileImageField
                  control={control}
                  name="recipientImage"
                  setValue={setValue}
                  setFiles={setFiles}
                  aadharBase64={aadhaarData?.photo}
                />
              )}
            </Grid>
            <Grid item md={8}>
              <Grid container spacing={2} className="!mt-[2px]">
                {isIndian ? (
                  <Grid item md={6}>
                    <FormInput
                      control={control}
                      name="aadharNumber"
                      label="Aadhaar Number"
                      aadhar
                      fullWidth
                      required
                      inputProps={{ maxLength: 12 }}
                      disabled={readOnly || watch('isAadharNumberVerified')}
                      onAadharVerify={() => handleAadharVerify(aadhaarNumber)}
                      isVerified={watch('isAadharNumberVerified')}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormInput
                        control={control}
                        name="passportNumber"
                        label="Passport Number"
                        fullWidth
                        required
                        inputProps={{ maxLength: 12 }}
                        disabled={readOnly}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormFileInput
                        control={control}
                        name="passportDocument"
                        label="Passport"
                        fullWidth
                        required
                        disabled={readOnly}
                        filePath={``}
                        fileData={BasicDetails?.passportDocument}
                        setOpenImgModal={setOpenImgModal}
                        setFile={setFile}
                        isPostFile={true}
                        setPreviewName={() => {
                          setFileName(`Passport`);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormFileInput
                        control={control}
                        name="embassyDocument"
                        label="Embassy Document"
                        fullWidth
                        required
                        disabled={readOnly}
                        filePath={``}
                        fileData={BasicDetails?.embassyDocument}
                        setOpenImgModal={setOpenImgModal}
                        setFile={setFile}
                        isPostFile={true}
                        setPreviewName={() => {
                          setFileName(`Embassy Document`);
                        }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={6} mb={2}>
                  <FormInput control={control} required name="name" label="Recipient Name" fullWidth disabled={false} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormSelect
                    menuOptions={genderOptions}
                    control={control}
                    name="gender"
                    label="Gender"
                    fullWidth
                    disabled={false}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AtomDatePicker
                    control={control}
                    name="dateOfBirth"
                    label="Date Of Birth"
                    fullWidth
                    minDate={minDate}
                    maxDate={maxDate}
                    required
                    disabled={false}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="age" label="Age" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="fatherName" label="Father / Spouse Name" required fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <StyledPhoneInput
                control={control}
                name="phoneNumber1"
                countryCodeName="countryCode1"
                setValue={setValue}
                onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'primary')}
                isVerified={phoneData.primary.verified}
                onVerify={() => handleOpenDialog('primary')}
                helperText="Phone Number is Required"
                isEnable={phoneData.primary.isEnable}
                disable={readOnly}
                label="Phone Number"
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <StyledPhoneInput
                control={control}
                name="phoneNumber2"
                countryCodeName="countryCode2"
                setValue={setValue}
                onPhoneNumberChange={(value) => handlePhoneNumberChange(value, 'alternate')}
                isVerified={phoneData.alternate.verified}
                onVerify={() => handleOpenDialog('alternate')}
                helperText="Alternative Phone Number is Required"
                isEnable={phoneData.alternate.isEnable}
                disable={readOnly}
                label="Alternative Phone Number"
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormInput control={control} name="email" label="Email" fullWidth />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={bloodGroupOptions}
                control={control}
                name="bloodGroup"
                label="Blood Group"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              <FormSelect
                menuOptions={
                  Number(cminsuranceId) === 6
                    ? [
                        ...cmInsuranceOption.map((el: any) => ({
                          label: el.label,
                          value: el.value
                        })),
                        { label: 'Rejected', value: 6 }
                      ]
                    : BasicDetails && Number(cminsuranceId) === 5
                      ? [{ label: 'Approved', value: 5 }]
                      : cmInsuranceOption
                }
                control={control}
                name="cminsuranceId"
                label="CM Insurance"
                fullWidth
                disabled={readOnly}
                required
              />
            </Grid>
            <Grid item xs={12} xl={4} md={6}>
              {(Number(cminsuranceId) === 1 || Number(cminsuranceId) === 6 || Number(cminsuranceId) === 5) && (
                <FormFileInput
                  control={control}
                  name="cminsuranceDoc"
                  label="Upload CM Insurance"
                  fullWidth
                  required
                  disabled={readOnly}
                  filePath={`recipient/${BasicDetails?.id}/cminsurance`}
                  fileData={BasicDetails?.cminsuranceDoc}
                  setOpenImgModal={setOpenImgModal}
                  setFile={setFile}
                  setLoader={setLoader}
                  setPreviewName={() => {
                    setFileName(`CM Insurance`);
                  }}
                />
              )}
            </Grid>
          </Grid>

          {fields.map((field, index) => (
            <>
              <Box className="flex items-center justify-between mb-4">
                <Text className="!text-[19px] text-[#804595] !mt-[16px] !font-[700]">
                  {index === 0 ? `${isIndian ? 'Aadhaar' : 'Recipient'}` : 'Addtional'} Address
                </Text>
                {!readOnly && (
                  <>
                    {index < 1 ? (
                      <Button
                        variant="text"
                        className="!bg-transparent !text-[#C967A2] !font-[500] !text-[16px] disabled:opacity-50"
                        onClick={handleAddNewAddress}
                        disabled={readOnly}
                      >
                        + Add Address
                      </Button>
                    ) : (
                      <DeleteIcon onClick={() => remove(index)} />
                    )}
                  </>
                )}
              </Box>
              <Grid key={field.id} container spacing={2} mt={2}>
                <Grid item xs={12} xl={4} md={6}>
                  <FormInput
                    control={control}
                    name={`address.${index}.addressLine1`}
                    label="Address Line 1"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormInput
                    control={control}
                    name={`address.${index}.addressLine2`}
                    label="Address Line 2"
                    fullWidth
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormInput
                    control={control}
                    name={`address.${index}.townOrVillage`}
                    label="Town / Village"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormInput
                    control={control}
                    name={`address.${index}.landmark`}
                    label="Landmark"
                    fullWidth
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormInput
                    control={control}
                    name={`address.${index}.pincode`}
                    label="Pin code"
                    fullWidth
                    required
                    inputProps={{ maxLength: 6 }}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormSelect
                    menuOptions={countriesOptions}
                    control={control}
                    name={`address.${index}.countryId`}
                    label="Country"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormSelect
                    menuOptions={stateOptions}
                    control={control}
                    name={`address.${index}.stateId`}
                    label="State"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={12} xl={4} md={6}>
                  <FormSelect
                    menuOptions={citiesOptions}
                    control={control}
                    name={`address.${index}.cityId`}
                    label="City"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Grid>
              </Grid>
            </>
          ))}

          {/* End Here */}

          {/* Address Section */}
          {/* <Box className="mt-6">
          {fields.map((field, index) => (
            <Box key={field.id} className="mb-6">
              <Box className="flex items-center justify-between mb-4">
                <Text className="!text-[19px] text-[#804595] !mt-[16px] !font-[700]">
                  {index === 0 ? `${isIndian ? 'Aadhaar' : 'Recipient'}` : 'Addtional'} Address
                </Text>
                {!readOnly && (
                  <>
                    {index < 1 ? (
                      <Button
                        variant="text"
                        className="!bg-transparent !text-[#C967A2] !font-[500] !text-[16px] disabled:opacity-50"
                        onClick={handleAddNewAddress}
                        disabled={readOnly}
                      >
                        + Add Address
                      </Button>
                    ) : (
                      <DeleteIcon onClick={() => remove(index)} />
                    )}
                  </>
                )}
              </Box>

              <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Box>
                  <FormInput
                    control={control}
                    name={`address.${index}.addressLine1`}
                    label="Address Line 1"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormInput
                    control={control}
                    name={`address.${index}.addressLine2`}
                    label="Address Line 2"
                    fullWidth
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormInput
                    control={control}
                    name={`address.${index}.townOrVillage`}
                    label="Town / Village"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormInput
                    control={control}
                    name={`address.${index}.landmark`}
                    label="Landmark"
                    fullWidth
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormInput
                    control={control}
                    name={`address.${index}.pincode`}
                    label="Pin code"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormSelect
                    menuOptions={countriesOptions}
                    control={control}
                    name={`address.${index}.countryId`}
                    label="Country"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormSelect
                    menuOptions={stateOptions}
                    control={control}
                    name={`address.${index}.stateId`}
                    label="State"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Box>

                <Box>
                  <FormSelect
                    menuOptions={citiesOptions}
                    control={control}
                    name={`address.${index}.cityId`}
                    label="City"
                    fullWidth
                    required
                    disabled={readOnly}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box> */}

          {isPreview && (
            <RecipientFooter
              onNext={handleSubmit(onSubmit)}
              forCancel={forCancel}
              isFirstStep={true}
              isLoadingBasic={isLoadingBasic}
            />
          )}
          <MobileOtp
            open={openOtpDialog}
            isAadhar={isAadhar}
            onClose={() => {
              setOpenOtpDialog(false);
              setCurrentPhoneType(null);
            }}
            onVerify={isAadhar ? (otp) => handleAadhaarOtpVerify(otp) : handlePhoneVerification}
            phoneNumber={
              !isAadhar && currentPhoneType === 'primary' ? phoneData.primary.number : phoneData.alternate.number
            }
            onResend={() => {
              handleAadharVerify(aadhaarNumber);
            }}
            currentPhoneType={currentPhoneType}
          />
          <NoticeAddRecepientDialog
            open={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
          />

          <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileName} />
          <LoadingOverlay isLoading={loader} />
        </form>
      </div>
    </MUIContainer>
  );
};

export default BasicDetails;
