import { CircleGreyIcon, DeleteIcon, TickCircle } from '@/assets/icons';
import { AtomDatePicker, Box, Button, FormFileInput, FormInput, FormSelect, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router';
import { CoordinatorType, DoctorType, getSchemabyUserType, HospitalUserType } from '../validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Department, Designation, Organ, Role, User } from '@/types/common.type';
import UserExperienceTable from './UserExperienceTable';
import { useHospital } from '../hospitalContext';
import { UpdateUser } from '@/types/hospital/hospital.request.type';
import dayjs from 'dayjs';
import { DepartmentSelect } from '@/pages/components/CustomChip';
import { useHospitalId } from '@/hooks/useHospitalID';
import MobileOtp from '@/pages/components/MobileOtp';
import { toast } from '@/utils/toast';
import Loading from '@/pages/components/Loading';
import { formatDateToISO } from '@/utils';
import { ProfileImageField } from '@/pages/components/ProfileImageInput';
import { base64toFile } from '@/utils/base64tofile';
import { APIService } from '@/services';
import './AddDoctor.scss';
import PreviewFile from '@/pages/components/FilePreview';

interface UploadResponse {
  data: {
    fileResponse: { fullfilepath: string }[];
  };
}
export interface AddDoctorProps {
  editValues?: User;
  isEditUser?: boolean;
  editUserType?: string;
  userId?: number | null;
  isApproval?: boolean;
  readonly?: boolean;
  isAlf?: boolean;
}
type CombinedDoctorType = Partial<HospitalUserType & DoctorType & CoordinatorType>;

const AddDoctor: React.FC<AddDoctorProps> = ({
  editValues,
  isEditUser,
  editUserType,
  userId,
  isApproval,
  isAlf = false,
  readonly = false
}) => {
  const [formData, setFormData] = useState<CombinedDoctorType>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [aadharData, setAadharData] = useState<any | null>(null);
  // const [indian, setIndian] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const [selectOptions, setSelectOptions] = useState<any[]>([]);
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [aadhaarNumber, setAadhaarNumber] = useState(editValues?.aadharNumber || '');
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [passportNumber, setPassportNumber] = useState(editValues?.passportNumber || '');
  const [openOtp, setOpenOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [enteredPhoneNumber, setEnteredNumber] = useState(editValues?.phoneNumber1 ?? '');
  // // const isExistingPhoneNumber =
  // //   enteredPhoneNumber === editValues?.phoneNumber1 ? editValues?.isPhoneNumber1Verified : false;
  // const [phoneVerified, setPhoneVerified] = useState(editValues?.isPhoneNumber1Verified || false);
  // const [isEnable, setIsEnable] = useState(false);
  const [isAadhar, setIsAadhar] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profileImg, setProfileImg] = useState<any>(editValues?.userImage ?? '');
  //for mobile number verification
  const [phoneData, setPhoneData] = useState<{
    primary: {
      number: string;
      verified: boolean;
      isDirty: boolean;
      isEnable: boolean;
    };
    alternate: {
      number: string;
      verified: boolean;
      isDirty: boolean;
      isEnable: boolean;
    };
  }>({
    primary: {
      number: editValues?.phoneNumber1 ?? '',
      verified: editValues?.isPhoneNumber1Verified ?? false,
      isDirty: false,
      isEnable: false
    },
    alternate: {
      number: editValues?.phoneNumber2 ?? '',
      verified: editValues?.isPhoneNumber2Verified ?? false,
      isDirty: false,
      isEnable: false
    }
  });

  const [currentPhoneType, setCurrentPhoneType] = useState<'primary' | 'alternate' | null>(null);
  // const [tempPassport, setTempPassport] = useState<string>('');
  // const [tempAadhar, setTempAadhar] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const userType = isAlf ? 'Doctor' : isEditUser ? editUserType : state?.userType;
  const { id } = useParams();
  const schema = getSchemabyUserType(userType);
  const [openFile, setOpenFile] = useState(false);
  const [file, setFile] = useState('');
  // const handleDelete = (orgToDelete: string) => {
  //   setSelectOptions((prevOptions) => prevOptions.filter((option) => option.name !== orgToDelete));
  //   setValue(
  //     'organ',
  //     selectOptions.filter((option) => option.name !== orgToDelete)
  //   );
  // };
  const hospitalID = useHospitalId();
  const filePath = `/hospitals/${hospitalID}/users`;
  // const handleChange = (value: string[]) => {
  //   const selectedOrgans = value.map(
  //     (name) => organOptions.find((org: Organ) => org.name === name) || { label: 0, name }
  //   );
  //   console.log('handleChange / selectedOrgans: ', selectedOrgans);
  //   setSelectOptions(selectedOrgans);
  //   setValue('organ', selectedOrgans);
  // };

  const {
    state: { genders, designations, roles, organs, states, cities, countries, departments }
  } = useMasterData();
  console.log('state', state);

  const designationOptions = designations.map((d: Designation) => ({
    value: d.id,
    label: d.name
  }));
  const roleOptions = roles
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((r: any) => r.roleType === 'Hospital')
    .map((r: Role) => ({
      value: r.id,
      label: r.name
    }));
  const organOptions = organs.map((o: Organ) => ({
    name: o.name,
    id: o.id
  }));
  const departmentOptions = departments.map((d: Department) => ({
    label: d.name,
    value: d.id
  }));

  const {
    state: { aadhaarResponse },
    action: { getAadhaarResponse, postKycAadharOtp }
  } = useMasterData();

  const {
    actions: { postUsers, updateHospitalUsers, updateProfilePhoto },
    state: { singleUser, hospitalId }
  } = useHospital();
  console.log('single user ', singleUser);
  console.log('single user ', editValues);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    formState: { errors, dirtyFields }
  } = useForm<UpdateUser>({
    resolver: zodResolver(schema),
    defaultValues: {
      uuid: '',
      userImage: '',
      isIndian: editValues?.isIndian ?? false,
      dateOfBirth: editValues?.dateOfBirth ?? '',
      designationId: editValues?.designation?.id ?? 0,
      roleId: editValues?.role?.id || 0,
      userExperience: editValues?.userExperience?.length
        ? editValues?.userExperience.map((exp) => ({
            caseHandled: exp.caseHandled ?? 0,
            dateofJoin: exp.dateofJoin || '',
            dateofRelive: exp.dateofRelive || '',
            hospitalName: exp.hospitalName || '',
            role: exp.role || ''
          }))
        : [{ caseHandled: 0, dateofJoin: '', dateofRelive: '', hospitalName: '', role: '' }],
      organ: selectOptions || [],
      genderId: editValues?.gender?.id || 0,
      cityId: editValues?.city?.id || 0,
      stateId: editValues?.state?.id || 0,
      countryId: editValues?.country?.id || 0,
      aadharNumber: editValues?.aadharNumber || '',
      passportNumber: editValues?.passportNumber || '',
      addressLine1: editValues?.addressLine1 || '',
      addressLine2: editValues?.addressLine2 || '',
      firstName: editValues?.firstName || '',
      lastName: editValues?.lastName || '',
      townVillage: editValues?.townVillage || '',
      email: editValues?.email || '',
      qualification: editValues?.qualification || '',
      dateOfJoining: editValues?.dateOfJoining || '',
      practicingSince: editValues?.practicingSince || '',
      phoneNumber1: editValues?.phoneNumber1 || '',
      isPhoneNumber1Verified: editValues?.isPhoneNumber1Verified,
      countryCode1: editValues?.countryCode1 || '91',
      landmark: editValues?.landmark || '',
      pincode: editValues?.pincode || '',
      experience: Number(editValues?.experience) ?? null,
      mPanelNumber: editValues?.mPanelNumber || '',
      specialization: editValues?.specialization?.map((s) => s.id) || [],
      medicalLicence: editValues?.medicalLicence || '',
      age: 0
    }
  });
  // const watchIsindian = watch('isIndian');
  const isIndian = watch('isIndian');
  const dateOfBirth = watch('dateOfBirth') || '';
  const watchMedicalLicese = watch('medicalLicence');
  console.log('form errors', errors);
  const watchPhoneNumber1Verified = watch('isPhoneNumber1Verified');
  const watchPhoneNumber2Verified = watch('isPhoneNumber2Verified');
  useEffect(() => {
    if (editValues) {
      // setIndian(editValues?.isIndian ?? true);
      // const updateQS = { ...parsedQS, isIndian: indian };
      // navigate({ search: QS.stringify(updateQS) });
      setAadhaarNumber(editValues?.aadharNumber || '');
      setPassportNumber(editValues?.passportNumber || '');
      // setSelectOptions(editValues?.organ?.map((o) => ({ id: o.id, name: o.name })) || []);
      reset({
        userImage: editValues?.userImage || '',
        uuid: editValues?.uuid ?? '',
        dateOfBirth: editValues?.dateOfBirth ?? '',
        designationId: editValues?.designation?.id ?? 0,
        roleId: editValues?.role?.id || 0,
        isIndian: editValues.isIndian ?? false,
        // userExperience: editValues?.userExperience?.length
        //   ? editValues?.userExperience.map((exp) => ({
        //       dateofJoin: exp.dateofJoin || '',
        //       dateofRelive: exp.dateofRelive || '',
        //       hospitalName: exp.hospitalName || '',
        //       caseHandled: exp.caseHandled ?? 0,
        //       role: exp.role || ''
        //     }))
        userExperience: editValues?.userExperience?.length
          ? editValues.userExperience.map((exp) => ({
              ...exp, // Preserve all properties
              caseHandled: exp.caseHandled ?? 0,
              dateofJoin: exp.dateofJoin ?? '',
              dateofRelive: exp.dateofRelive ?? '',
              hospitalName: exp.hospitalName ?? '',
              role: exp.role ?? ''
            }))
          : [{ caseHandled: 0, dateofJoin: '', dateofRelive: '', hospitalName: '', role: '' }],
        // organ: editValues?.organ?.map((o) => ({ id: o.id, name: o.name })) || [],
        organ: editValues?.organ || [],
        genderId: editValues?.gender?.id || 0,
        cityId: editValues?.city?.id || 0,
        stateId: editValues?.state?.id || 0,
        countryId: editValues?.country?.id || 0,
        aadharNumber: editValues?.aadharNumber || '',
        passportNumber: editValues?.passportNumber || '',
        addressLine1: editValues?.addressLine1 || '',
        addressLine2: editValues?.addressLine2 || '',
        firstName: editValues?.firstName || '',
        lastName: editValues?.lastName || '',
        isPhoneNumber1Verified: editValues ? editValues?.isPhoneNumber1Verified : watchPhoneNumber1Verified,
        isAadharNumberVerified: editValues?.isAadharNumberVerified,
        townVillage: editValues?.townVillage || '',
        email: editValues?.email || '',
        qualification: editValues?.qualification || '',
        dateOfJoining: editValues?.dateOfJoining || '',
        practicingSince: editValues?.practicingSince || '',
        landmark: editValues?.landmark || '',
        pincode: editValues?.pincode || '',
        // experience: Number(editValues?.experience) ?? null,
        experience: Number(editValues?.experience) || 0,
        mPanelNumber: editValues?.mPanelNumber || '',
        specialization: editValues?.specialization?.map((s) => s.id) || [],
        // specialization: editValues?.specialization?.map((s) => s.id) || [],
        phoneNumber1: editValues?.phoneNumber1 || '',
        countryCode1: editValues?.countryCode1 || '91',
        medicalLicence: editValues?.medicalLicence || ''
      });

      // const formattedSpecialization = editValues?.specialization?.map((s) => s.id) || [];
      // setValue('specialization', formattedSpecialization);
    }
  }, [editValues, reset]);

  useEffect(() => {
    if (editValues?.organ) {
      setSelectOptions(editValues.organ.map((o) => ({ id: o.id, name: o.name })));
    }
  }, [editValues]);
  console.log('eee', editValues?.specialization);

  // useEffect(() => {
  //   setValue('isIndian', editValues?.isIndian ?? true);
  // }, [editValues?.isIndian]);

  const handleNationalityChange = (isIndian: boolean) => {
    // setIndian(isIndian);
    setValue('isIndian', isIndian, { shouldValidate: true });
    // const updatedQs = { ...parsedQS, isIndian }; // Update query param
    // navigate({ search: QS.stringify(updatedQs) }); // Update URL query params

    // if (isIndian) {
    //   setTempPassport(watch('passportNumber') || ''); // Save passport value
    //   setValue('passportNumber', '');
    //   setValue('aadharNumber', tempAadhar || watch('aadharNumber') || '');
    // } else {
    //   setTempAadhar(watch('aadharNumber') || ''); // Save Aadhar value
    //   setValue('aadharNumber', '');
    //   setValue('passportNumber', tempPassport || watch('passportNumber') || '');
    // }
  };
  // const handleNationalityChange = (isIndianValue: boolean) => {
  //   setValue('isIndian', isIndianValue, { shouldValidate: true });

  //   // Switch between Aadhar/Passport while preserving values
  //   if (isIndianValue) {
  //     setValue('passportNumber', '', { shouldValidate: true });
  //   } else {
  //     setValue('aadharNumber', '', { shouldValidate: true });
  //   }
  // };

  useEffect(() => {
    if (userType) {
      // Find the matching designation from the dropdown options
      const matchingDesination = designationOptions.find(
        (option: { label: string; value: number }) => option.label.toLowerCase() === userType.toLowerCase()
      );
      const matchingRole = roleOptions.find(
        (option: { label: string; value: number }) => option.label.toLowerCase() === userType.toLowerCase()
      );
      if (matchingDesination || matchingRole) {
        reset({ roleId: matchingRole?.value, designationId: matchingDesination?.value });
      }
    }
  }, [userType, reset]);

  // useEffect(() => {
  //   const updatedOptions = editValues?.organ?.map((org) => ({ id: org.id, name: org.name })) || [];
  //   setSelectOptions(updatedOptions); // Sync the state
  // }, [editValues?.organ]);
  // const watchAadharNumber = watch('aadharNumber');
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
    setValue('aadharNumber', aadhaarNumber);

    // reset({aadharNumber:editValues?.aadharNumber})
  }, [dateOfBirth, setValue, reset, editValues]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'userExperience'
  });

  console.log('userExperience / fields: ', fields);

  const handleAddNewExp = () => {
    append({
      role: '',
      hospitalName: '',
      dateofJoin: '',
      dateofRelive: '',
      caseHandled: 0
    });
  };

  const aadharNumber = watch('aadharNumber')?.replace(/\s+/g, '');

  const fileFormDatas = async (files: File | null, id: number | string) => {
    try {
      if (!files) {
        console.error('No file provided');
        return '';
      }
      console.log(files, 'file');

      const formData = new FormData();
      formData.append('fileUploadRequests[0].data', files);
      formData.append('fileUploadRequests[0].path', `hospitals/${hospitalID}/users/${id}/profile`);
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
        setOpenOtp(true); // Open dialog only on successful verification
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
    setValue('landmark', aadharData.landmark ?? '');
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
  const watchAadharVerified = watch('isAadharNumberVerified') ?? editValues?.isAadharNumberVerified;

  useEffect(() => {
    if (editValues?.phoneNumber1) {
      setPhoneData((prev) => ({
        primary: {
          number: editValues.phoneNumber1,
          verified: editValues.isPhoneNumber1Verified ?? false,
          isDirty: false,
          isEnable: false
        },
        alternate: {
          ...prev.alternate
        }
      }));
    }
  }, [editValues?.phoneNumber1, editValues?.isPhoneNumber1Verified]);

  const handlePhoneNumberChange = (value: string, type: 'primary' | 'alternate') => {
    setPhoneData((prev) => ({
      ...prev,
      [type]: {
        ...prev['primary'],
        number: value,
        isDirty: true,
        isEnable: value.length === 10 && value !== editValues?.[`phoneNumber${type === 'primary' ? '1' : '2'}`],
        verified: false
      }
    }));
  };

  const handleOpenDialog = (type: 'primary') => {
    setIsAadhar(false);
    if (
      phoneData[type].number !== editValues?.[`phoneNumber${type === 'primary' ? '1' : '2'}`] &&
      phoneData[type].isEnable
    ) {
      setCurrentPhoneType(type);
      setOpenOtp(true);
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
      setValue(currentPhoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', true);
      toast(`${currentPhoneType === 'primary' ? 'Primary' : 'Alternate'} Phone Verified`, 'success');
    }
    setOpenOtp(false);
  };

  // useEffect(() => {
  //   Object.keys(phoneData).forEach((type) => {
  //     const phoneType = type as 'primary';
  //     if (phoneData['primary'].isDirty && phoneData['primary'].number.length === 10) {
  //       setValue(phoneType === 'primary' ? 'isPhoneNumber1Verified' : 'isPhoneNumber2Verified', false);
  //     }
  //   });
  // }, [phoneData]);
  useEffect(() => {
    if (phoneData.primary.isDirty && phoneData.primary.number.length === 10) {
      setValue('isPhoneNumber1Verified', false);
    }
  }, [phoneData.primary.number, phoneData.primary.isDirty]);
  useEffect(() => {
    // Trigger validation after initial data load
    if (editValues) {
      setTimeout(() => {
        trigger(['aadharNumber', 'passportNumber', 'isIndian']);
      }, 100);
    }
  }, [editValues, trigger]);

  console.log('profile', profileImg);
  // toast(userType, 'info');
  const onSubmit = async (data: UpdateUser) => {
    console.log('userData ', data);

    setFormData(data);
    console.log('data after submit  ', formData);
    if (data.isIndian && data.isAadharNumberVerified === false) {
      toast('Please verify your Aadhar number', 'error');
      return;
    }
    if (watchPhoneNumber1Verified === false) {
      toast('Please verify your phone number', 'error');
      return;
    }
    if ((userType === 'SurgeonOrConsultant' || userType === 'Doctor') && data.organ?.length <= 0) {
      toast('Please select atleast one organ', 'error');
      return;
    }

    // const formattedExperience =
    //   'userExperience' in data && Array.isArray(data.userExperience)
    //     ? data.userExperience.map((exp) => ({
    //         role: exp.role,
    //         hospitalName: exp.hospitalName,
    //         dateofJoin: exp.dateofJoin,
    //         dateofRelive: exp.dateofRelive,
    //         caseHandled: exp.caseHandled
    //       }))
    //     : [];
    // const rawSpecialization = Array.isArray(data.specialization) ? data.specialization : [];
    // console.log('raw specialization ', rawSpecialization);
    // console.log('specialization ', data.specialization);
    // const formattedSpecialization = rawSpecialization.map((spec) => ({
    //   id: spec
    // }));
    // console.log('Formatted specialization:', formattedSpecialization);

    // const formattedOrgan = selectOptions.map((org) => ({
    //   id: org.id || 0, // Use actual ID or fallback to 0
    //   name: org.name
    // }));
    // const formattedOrgan = data.organ?.map((o) => ({
    //   id: o.id || 0,
    //   name: o.name
    // }));

    // console.log('Formatted organ:', formattedOrgan);
    // Fix experience conversion
    // const experienceValue = data.experience ? Number(data.experience) : 0;

    // Fix specialization
    const formattedSpecialization = Array.isArray(data.specialization)
      ? data.specialization.map((id: number) => ({ id }))
      : [];

    // Fix organs - use form data instead of selectOptions
    const formattedOrgan = (data.organ || []).map((org) => ({
      id: org.id,
      name: org.name
    }));

    // Fix experience array
    const formattedExperience =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.userExperience?.map((exp: any) => ({
        role: exp.role,
        hospitalName: exp.hospitalName,
        dateofJoin: exp.dateofJoin,
        dateofRelive: exp.dateofRelive,
        caseHandled: exp.caseHandled ? Number(exp.caseHandled) : 0
      })) || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedData: any = {
      isIndian: data.isIndian || false,
      uuid: data.uuid,
      userImage: data.userImage || '',
      aadharNumber: data.isIndian ? data.aadharNumber : '',
      isAadharNumberVerified: data.isIndian ? watchAadharVerified : false,
      passportNumber: !data.isIndian ? data.passportNumber : '',
      roleId: data.roleId,
      firstName: data.firstName,
      lastName: data.lastName,
      genderId: data.genderId,
      dateOfBirth: data.dateOfBirth,
      designationId: data.designationId,
      qualification: data.qualification,
      phoneNumber1: data.phoneNumber1,
      phoneNumber2: '',
      isPhoneNumber1Verified: watchPhoneNumber1Verified ?? data.isPhoneNumber1Verified,
      isPhoneNumber2Verified: watchPhoneNumber2Verified || data.isPhoneNumber2Verified,
      countryCode1: data.countryCode1 || '91',
      countryCode2: data.countryCode2 || '91',
      email: data.email,
      dateOfJoining: data.dateOfJoining || '2024-10-19T16:52:01.906Z',
      practicingSince: data.practicingSince || '2024-10-19T16:52:01.906Z',
      medicalLicence: data.medicalLicence || '',
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      townVillage: data.townVillage,
      landmark: data.landmark,
      pincode: data.pincode,
      cityId: data.cityId,
      stateId: data.stateId,
      countryId: data.countryId,
      experience: data.experience || 0,
      mPanelNumber: data.mPanelNumber || '',
      organ: formattedOrgan,
      userExperience: formattedExperience,
      specialization: formattedSpecialization,
      tempFilePath: '',
      basePath: ''
    };
    console.log('final data ', formattedData);
    try {
      if (editValues && userId) {
        updateHospitalUsers(userId, formattedData, { isIndian: isIndian }, async () => {
          // const profileImgPath = await fileFormDatas(profileImg, userId);
          // console.log('profile image path', profileImgPath);
          await updateProfilePhoto(hospitalID, userId, profileImg, () => {
            toast('Profile Image Updated Successfully', 'success');
            navigate(`/hospitals/${id}/dashboard?page=1&perPage=10#users`);
          });
          toast('user updated successfully', 'success');
          navigate(`/hospitals/${id}/dashboard?page=1&perPage=10#users`);
        });
        return;
      } else {
        await postUsers(formattedData, { isIndian: isIndian }, async (res) => {
          const newUserId = res?.id;
          const profileImgPath = await fileFormDatas(profileImg, newUserId);
          console.log('profile image path', profileImgPath);
          await updateProfilePhoto(hospitalID, newUserId, profileImgPath, () => {
            toast('Profile Image Updated Successfully', 'success');
            navigate(`/hospitals/${id}/dashboard`);
          });
        });
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
    console.log('userImage', data.userImage);

    console.log('data after submit ', formattedData);
  };
  // const handleNavigate = () => {
  //   if (isApproval) {
  //     navigate('/approvals');
  //   } else {
  //     navigate(`/hospitals/${id}/dashboard`);
  //   }
  // };
  // console.log('userImage',);

  // Calculate the min and max dates for the age constraint
  const today = dayjs();
  const maxDate = today.subtract(18, 'year'); // 18 years old is the latest valid date
  const minDate = today.subtract(70, 'year'); // 70 years old is the earliest valid date
  //for disable
  // const isAadharVerified = watch('isAadharNumberVerified') && indian;

  // const shouldDisableField = (fieldName: keyof UpdateUser) => {
  //   const value = watch(fieldName); // current form value
  //   return isAadharVerified && value !== '' && value !== null && value !== undefined;
  // };
  // console.log('op', shouldDisableField('firstName'));

  return (
    <Box>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="add-doctor-container">
            {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
            <Text className="!text-[#804595] !text-[19px] !font-[600] !mb-7 flex gap-4 items-center">
              {/* {!isAlf && !isEditUser ? <BackIcon className="cursor-pointer" onClick={handleNavigate} /> : ''} */}
              {state?.existUser ? (
                'User Profile'
              ) : editValues ? (
                <Text className="flex gap-2 items-center !text-[19px] !font-[600] ">
                  {/* <BackIcon
                  onClick={() => {
                    isAlf ? navigate(-2) : navigate(-3);
                  }}
                /> */}
                  {`${userType} ${editValues?.firstName?.toLocaleUpperCase()}`}
                </Text>
              ) : isAlf && isEditUser ? (
                'Add ALF Doctor'
              ) : isEditUser ? (
                `Edit ${userType} `
              ) : (
                ` Add New ${userType}`
              )}
            </Text>
            <Box className="profile-section">
              <Box className="w-full">
                <ProfileImageField
                  control={control}
                  name="userImage"
                  setFiles={setProfileImg}
                  setValue={setValue}
                  defaultUrl={editValues?.userImage ?? ''}
                  aadharBase64={aadharData?.photo}
                />
              </Box>
              <Box className="nation-section">
                <Box className="flex flex-col">
                  <Text className="!text-[13px] !mb-[0px] !font-[500]">
                    Select Nationality <span className="text-[red]">*</span>
                  </Text>
                  <Box className="flex gap-4">
                    <Box
                      className={`flex items-center w-full rounded-[20px] px-[8px] ${isIndian ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
                      onClick={() => handleNationalityChange(true)}
                    >
                      {isIndian ? <TickCircle /> : <CircleGreyIcon />}
                      <Text className="pl-[4px] !text-[13px] !font-[500]">Indian</Text>
                    </Box>
                    <Box
                      onClick={() => handleNationalityChange(false)}
                      className={`flex items-center w-full rounded-[20px] px-[8px] ${!isIndian ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
                    >
                      {isIndian ? <CircleGreyIcon /> : <TickCircle />}
                      <Text className="pl-[4px] !text-[13px] !font-[500]">Internatioanal</Text>
                    </Box>
                  </Box>
                </Box>
                <Box className="">
                  {!isIndian ? (
                    <FormInput
                      control={control}
                      name="passportNumber"
                      label="Passport Number"
                      value={watch('passportNumber') || ''}
                      inputProps={{ maxLength: 12 }}
                      onChange={(e) => setValue('passportNumber', e.target.value)}
                      required
                      fullWidth
                      disabled={readonly}
                    />
                  ) : (
                    <FormInput
                      control={control}
                      name="aadharNumber"
                      label="Aadhaar Number"
                      aadhar={true}
                      // value={watch('aadharNumber') || ''}
                      // onChange={(e) => setValue('aadharNumber', e.target.value)}
                      inputProps={{ maxLength: 12 }}
                      onAadharVerify={() => handleAadharVerify(aadharNumber)}
                      isVerified={editValues?.isAadharNumberVerified || watch('isAadharNumberVerified')}
                      // value={aadharNumber}
                      required
                      fullWidth
                      disabled={readonly}
                    />
                  )}
                </Box>

                <Box className="">
                  <FormInput
                    control={control}
                    name="firstName"
                    label="First Name"
                    required
                    fullWidth
                    // disabled={shouldDisableField('firstName') ?? readonly}
                    disabled={readonly}
                  />
                </Box>
                <Box className=" ">
                  <FormInput
                    control={control}
                    name="lastName"
                    label="Last Name"
                    required
                    fullWidth
                    // disabled={shouldDisableField('lastName') ?? readonly}
                    disabled={readonly}
                  />
                </Box>
              </Box>
            </Box>
            <Box>
              <Box className="details-section">
                <Box className="">
                  <AtomDatePicker
                    control={control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    fullWidth
                    required
                    minDate={minDate}
                    maxDate={maxDate}
                    // disabled={shouldDisableField('dateOfBirth') ?? readonly}
                    disabled={readonly}
                  />
                </Box>
                <Box className=" ">
                  <FormInput readOnly control={control} name="age" label="Age" fullWidth disabled={readonly} />
                </Box>
                <Box className="">
                  <FormSelect
                    control={control}
                    name="genderId"
                    menuOptions={genders}
                    label="Gender"
                    fullWidth
                    required
                    // disabled={shouldDisableField('firstName') ?? readonly}
                  />
                </Box>
                <Box className="">
                  <FormSelect
                    control={control}
                    name="designationId"
                    menuOptions={designationOptions}
                    label="Designation"
                    fullWidth
                    readOnly
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
                    disabled={readonly}
                  />
                </Box>

                <Box className="">
                  <FormInput
                    control={control}
                    name="qualification"
                    label="Qualification"
                    fullWidth
                    required
                    disabled={readonly}
                  />
                </Box>
                {(userType === 'Doctor' || userType === 'SurgeonOrConsultant') && (
                  <Box className="multiple-select">
                    <FormSelect
                      className=""
                      menuOptions={departmentOptions}
                      control={control}
                      name="specialization"
                      label="Specialization"
                      fullWidth
                      type="number"
                      required
                      multiple
                      disabled={readonly}
                    />
                  </Box>
                )}
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
                    disable={readonly}
                    required
                  />
                </Box>
                <Box className="">
                  <FormInput control={control} name="email" label="Email" fullWidth required disabled={readonly} />
                </Box>
                {(userType === 'Doctor' || userType === 'SurgeonOrConsultant') && (
                  <>
                    <Box className="">
                      <AtomDatePicker
                        control={control}
                        name="dateOfJoining"
                        label="Date of Joining"
                        fullWidth
                        required
                        maxDate={dayjs()}
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <AtomDatePicker
                        control={control}
                        name="practicingSince"
                        label="Practice Since"
                        fullWidth
                        required
                        maxDate={dayjs()}
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormInput
                        control={control}
                        name="experience"
                        label="Experience in Years"
                        fullWidth
                        type="number"
                        required
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormFileInput
                        control={control}
                        name="medicalLicence"
                        label="Medical License"
                        filePath={filePath}
                        fileData={watchMedicalLicese || editValues?.medicalLicence}
                        setOpenImgModal={setOpenFile}
                        setFile={setFile}
                        fullWidth
                        required
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormInput
                        control={control}
                        name="mPanelNumber"
                        label="M Panel Number"
                        fullWidth
                        required
                        disabled={readonly}
                      />
                    </Box>
                  </>
                )}
              </Box>
              {(userType === 'Doctor' || userType === 'SurgeonOrConsultant' || userType === 'Case Co-ordinators') && (
                <Box className="organ-input">
                  <Controller
                    name="organ"
                    control={control}
                    render={({ field: { value, onChange }, fieldState }) => (
                      <DepartmentSelect
                        label="Organ"
                        selectOptions={value.map((o: { id: number; name: string }) => o.name)}
                        options={organOptions.map((o: Organ) => o.name)}
                        handleChange={(names) => {
                          const sel = names
                            .map((n) => organOptions.find((o: Organ) => o.name === n))
                            .filter(Boolean) as Organ[];
                          onChange(sel);
                        }}
                        handleDelete={(name) => {
                          const sel = (value as Organ[]).filter((o) => o.name !== name);
                          onChange(sel);
                        }}
                        disable={readonly}
                        error={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* <Controller
                  name="organ"
                  control={control}
                  render={({ field: { value = [], onChange } }) => {
                    // const selectedOrgNames = value.map((org: Organ) => org.id);

                    // const handleChange = (selectedNames: string[]) => {
                    //   const selectedOrgans = organOptions.filter((o) => selectedNames.includes(o.name));
                    //   onChange(selectedOrgans);
                    // };

                    // const handleDelete = (name: string) => {
                    //   const updated = value.filter((org: Organ) => org.name !== name);
                    //   onChange(updated);
                    // };

                    return (
                      <DepartmentSelect
                        label="Organs"
                        selectOptions={selectOptions.map((org) => org.name)}
                        options={organOptions.map((o: Organ) => o.name)}
                        handleChange={handleChange}
                        handleDelete={handleDelete}
                        disable={readonly}
                        isSetup
                      />
                    );
                  }}
                /> */}

                  {/* <CustomFormChip2
                  control={control}
                  name="organ"
                  label="Organs"
                  // selectOptions={selectOptions.map((org) => org.name)}
                  options={organOptions}
                  // handleChange={handleChange}
                  // handleDelete={handleDelete}
                  disable={readonly}
                /> */}
                </Box>
              )}

              <Box className="address-section mt-4">
                <Box className="">
                  <Text className="address-title">{userType} Address</Text>
                  <Box className="details-section">
                    <Box className="">
                      <FormInput
                        control={control}
                        name="addressLine1"
                        label="Address Line 1"
                        fullWidth
                        required
                        // disabled={shouldDisableField('addressLine1') ?? readonly}
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormInput
                        control={control}
                        name="addressLine2"
                        label="Address Line 2"
                        fullWidth
                        // disabled={shouldDisableField('addressLine2') ?? readonly}
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormInput
                        control={control}
                        name="townVillage"
                        label="Town / Village"
                        fullWidth
                        required
                        // disabled={shouldDisableField('townVillage') ?? readonly}
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormInput control={control} name="landmark" label="Landmark" fullWidth disabled={readonly} />
                    </Box>

                    <Box className="">
                      <FormInput
                        control={control}
                        name="pincode"
                        label="Pincode"
                        fullWidth
                        required
                        inputProps={{ maxLength: 6 }}
                        // disabled={shouldDisableField('pincode') ?? readonly}
                        disabled={readonly}
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
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormSelect
                        menuOptions={states}
                        control={control}
                        name="stateId"
                        label="State"
                        fullWidth
                        required
                        // disabled={shouldDisableField('stateId') ?? readonly}
                        disabled={readonly}
                      />
                    </Box>
                    <Box className="">
                      <FormSelect
                        menuOptions={countries}
                        control={control}
                        name="countryId"
                        label="Country"
                        required
                        fullWidth
                        // disabled={shouldDisableField('countryId') ?? readonly}
                        disabled={readonly}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            {state?.existUser &&
              (userType === 'Doctor' || userType === 'SurgeonOrConsultant' || userType === 'Case Co-ordinators') && (
                <Box mt={3}>
                  <Text className="address-title !mb-[8px]">Work Experience</Text>
                  <UserExperienceTable />
                </Box>
              )}
            {(userType === 'Doctor' || userType === 'SurgeonOrConsultant' || userType === 'Case Co-ordinators') && (
              <>
                <Box className=" flex flex-col ">
                  {fields.map((field, index) => (
                    <>
                      <Box key={field.id} className="exp-title !mb-[16px]">
                        <Text className="!text-[19px] text-[#804595] !font-[600]">
                          {state?.existUser
                            ? 'Add New Experience (Optional)'
                            : `Experience ${index > 0 ? index + 1 : ''}`}
                        </Text>

                        {!isApproval && (
                          <>
                            {index < 1 ? (
                              <Button
                                variant="text"
                                className="!bg-transparent !text-[#C967A2]"
                                onClick={handleAddNewExp}
                              >
                                + Add New
                              </Button>
                            ) : (
                              <DeleteIcon onClick={() => remove(index)} className="cursor-pointer" />
                            )}
                          </>
                        )}
                      </Box>
                      <Box className="exp-section">
                        <Box className="">
                          <FormInput
                            control={control}
                            name={`userExperience.${index}.role`}
                            defaultValue={field.role}
                            label="Role"
                            fullWidth
                            required
                            disabled={readonly}
                          />
                        </Box>
                        <Box className="">
                          <FormInput
                            control={control}
                            name={`userExperience.${index}.hospitalName`}
                            defaultValue={field.hospitalName}
                            label="Hospital Name"
                            fullWidth
                            required
                            disabled={readonly}
                          />
                        </Box>
                        <Box className="">
                          <AtomDatePicker
                            control={control}
                            name={`userExperience.${index}.dateofJoin`}
                            defaultValue={field.dateofJoin}
                            label="Date of Joining"
                            fullWidth
                            required
                            disabled={readonly}
                          />
                        </Box>
                        <Box className="">
                          <AtomDatePicker
                            control={control}
                            name={`userExperience.${index}.dateofRelive`}
                            defaultValue={field.dateofRelive}
                            label="Date of Relieving"
                            fullWidth
                            required
                            disabled={readonly}
                          />
                        </Box>
                        <Box className="">
                          <FormInput
                            control={control}
                            name={`userExperience.${index}.caseHandled`}
                            defaultValue={field.caseHandled}
                            label="Cases Handled"
                            fullWidth
                            type="number"
                            required
                            disabled={readonly}
                          />
                        </Box>
                      </Box>
                    </>
                  ))}
                </Box>
              </>
            )}

            {!isApproval && (
              <Box className="flex items-center justify-end p-1 gap-3 mt-[24px] md:mt-[48px] mb-[12px] md:mb-[24px] ">
                <Button
                  variant="outlined"
                  className="!border-[#D876A9] !text-[#D876A9] w-[75px] md:w-[150px]"
                  onClick={() => navigate(`/hospitals/${hospitalId}/dashboard`)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  className="!bg-[#D876A9] w-[75px] md:w-[150px] "
                  onClick={handleSubmit(onSubmit)}
                >
                  {editValues ? 'Update' : 'Submit'}
                </Button>
              </Box>
            )}
            <MobileOtp
              open={openOtp}
              onClose={() => {
                setOpenOtp(false);
              }}
              isAadhar={isAadhar}
              onVerify={
                isAadhar
                  ? (otp) => {
                      handleAadhaarOtpVerify(otp);
                    }
                  : handlePhoneVerification
              }
              onResend={() => {
                isAadhar ? handleAadharVerify(aadharNumber) : '';
              }}
              phoneNumber={currentPhoneType === 'primary' ? phoneData.primary.number : ''}
              currentPhoneType={currentPhoneType}
            />
            <PreviewFile
              open={openFile}
              onClose={() => {
                setOpenFile(false);
              }}
              file={file}
              fileLabel="Medical License"
            />
          </Box>
        </form>
      )}
    </Box>
  );
};

export default AddDoctor;
