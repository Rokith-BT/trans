/* eslint-disable no-unused-vars */
import { CircleGreyIcon, TickCircle } from '@/assets/icons';
import { AtomDatePicker, Box, Button, FormInput, FormSelect, Text } from '@/atoms';
import { toast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { useDonor } from '@/pages/donors/DonorContext';

interface TransplantDetailsProps {
  isPopupShow?: boolean;
}

export const TransplantDetailsSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required'),
  donorDateOfBirth: z.string().min(1, 'Date of Birth  is required'),
  age: z.number().optional().nullable(),
  donorGenderId: z.number({ required_error: 'Gender is required', invalid_type_error: 'Choose a Gender' }),
  donorBloodGroupId: z.number({
    required_error: 'Blood Gruoup is required',
    invalid_type_error: 'Choose a Blood Gruoup'
  }),
  relationshipId: z.number({ required_error: 'Relation is required', invalid_type_error: 'Choose a Relation' }),
  donorAddressLine1: z.string().min(1, 'Address Line 1 is required'),
  donorAddressLine2: z.string().optional().nullable(),
  donorTownVillage: z.string().min(1, 'Town Or Village is required'),
  donorLandmark: z.string().optional().nullable(),
  pincode: z
    .string()
    .nonempty('Pin code is required')
    .regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  donorCityId: z.number().optional().nullable(),
  donorStateId: z.number().optional().nullable(),
  donorCountryId: z.number().optional().nullable(),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientDateOfBirth: z.string().min(1, 'Date of Birth  is required'),
  recipientAge: z.number().optional().nullable(),
  recipientGenderId: z.number().min(1, 'Gender is required'),
  recipientBloodGroupId: z.number().min(1, 'Bloodgroup is required'),
  recipientAddressLine1: z.string().min(1, 'Address Line 1 is required'),
  recipientAddressLine2: z.string().optional().nullable(),
  recipientTownVillage: z.string().min(1, 'Town Or Village is required'),
  recipientLandmark: z.string().optional().nullable(),
  recipientPincode: z
    .string()
    .nonempty('Pin code is required')
    .regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  recipientCityId: z.number().optional().nullable(),
  recipientStateId: z.number().optional().nullable(),
  recipientCountryId: z.number().optional().nullable(),
  organId: z.any(),
  dateOfSurgery: z.string().min(1, 'Date of Surgery is required'),
  surgeryDuration: z.string().min(1, 'Duration Of Surgery is required'),
  remarks: z.string().min(1, 'Remark is Any is required'),
  ischaemiaWarm: z.string().min(1, 'Ischaemia Warm is required'),
  ischaemiaCold: z.string().min(1, 'Ischaemia Cold is required'),
  surgeryEndDate: z.string().min(1, 'Surgery Date is required'),
  surgeryTime: z.string().min(1, 'Surgery Time is required')
});
export type TransplantDetailsType = z.infer<typeof TransplantDetailsSchema>;

const TransplantDetails: React.FC<TransplantDetailsProps> = ({ isPopupShow }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openModal, setOpenModal] = useState(false);
  const [organ, setOrgan] = useState<string>('organ');
  const {
    action: { insertLiveTransplantDetails, getLiveTransplantListId, updateLiveTransplant },
    state: { liveTransplantID }
  } = useDonor();
  console.log(liveTransplantID, 'liveTransplantID');

  useEffect(() => {
    getLiveTransplantListId(Number(id), () => {});
  }, [id]);
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
  const {
    state: { genders, bloodGroup, relationType, cities, states, countries }
  } = useMasterData();

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm<TransplantDetailsType>({
    resolver: zodResolver(TransplantDetailsSchema),
    defaultValues: {
      donorName: liveTransplantID.donorName || '',
      donorDateOfBirth: liveTransplantID.donorDateOfBirth || '',
      age: liveTransplantID.age || undefined,
      donorGenderId: liveTransplantID.donorGenderId || '',
      donorBloodGroupId: liveTransplantID.donorBloodGroupId || '',
      relationshipId: liveTransplantID.relationshipId || '',
      donorAddressLine1: liveTransplantID.donorAddressLine1 || '',
      donorAddressLine2: liveTransplantID.donorAddressLine2 || '',
      donorTownVillage: liveTransplantID.donorTownVillage || '',
      donorLandmark: liveTransplantID.donorLandmark || '',
      pincode: liveTransplantID.pincode || '',
      donorCityId: liveTransplantID.donorCityId || '',
      donorStateId: liveTransplantID.donorStateId || '',
      donorCountryId: liveTransplantID.donorCountryId || '',
      recipientName: liveTransplantID.recipientName || '',
      recipientDateOfBirth: liveTransplantID.recipientDateOfBirth || '',
      recipientAge: liveTransplantID.liveTransplantID || undefined,
      recipientGenderId: liveTransplantID.recipientGenderId || '',
      recipientBloodGroupId: liveTransplantID.recipientBloodGroupId || '',
      recipientAddressLine1: liveTransplantID.recipientAddressLine1 || '',
      recipientAddressLine2: liveTransplantID.recipientAddressLine2 || '',
      recipientTownVillage: liveTransplantID.recipientTownVillage || '',
      recipientLandmark: liveTransplantID.recipientLandmark || '',
      recipientPincode: liveTransplantID.recipientPincode || '',
      recipientStateId: liveTransplantID.recipientStateId || '',
      recipientCountryId: liveTransplantID.recipientCountryId || '',
      recipientCityId: liveTransplantID.recipientCityId || '',
      organId: liveTransplantID.organId || 1,
      dateOfSurgery: liveTransplantID.dateOfSurgery || '',
      surgeryDuration: liveTransplantID.surgeryDuration || '',
      remarks: liveTransplantID.remarks || '',
      ischaemiaWarm: liveTransplantID.ischaemiaWarm || '',
      ischaemiaCold: liveTransplantID.ischaemiaCold || '',
      surgeryEndDate: liveTransplantID.surgeryEndDate || '',
      surgeryTime: liveTransplantID.surgeryTime || ''
    }
  });
  useEffect(() => {
    reset({
      donorName: liveTransplantID.donorName || '',
      donorDateOfBirth: liveTransplantID.donorDateOfBirth || '',
      age: liveTransplantID.age || undefined,
      donorGenderId: liveTransplantID.donorGenderId || '',
      donorBloodGroupId: liveTransplantID.donorBloodGroupId || '',
      relationshipId: liveTransplantID.relationshipId || '',
      donorAddressLine1: liveTransplantID.donorAddressLine1 || '',
      donorAddressLine2: liveTransplantID.donorAddressLine2 || '',
      donorTownVillage: liveTransplantID.donorTownVillage || '',
      donorLandmark: liveTransplantID.donorLandmark || '',
      pincode: liveTransplantID.pincode || '',
      donorCityId: liveTransplantID.donorCityId || '',
      donorStateId: liveTransplantID.donorStateId || '',
      donorCountryId: liveTransplantID.donorCountryId || '',
      recipientName: liveTransplantID.recipientName || '',
      recipientDateOfBirth: liveTransplantID.recipientDateOfBirth || '',
      recipientAge: liveTransplantID.liveTransplantID || undefined,
      recipientGenderId: liveTransplantID.recipientGenderId || '',
      recipientBloodGroupId: liveTransplantID.recipientBloodGroupId || '',
      recipientAddressLine1: liveTransplantID.recipientAddressLine1 || '',
      recipientAddressLine2: liveTransplantID.recipientAddressLine2 || '',
      recipientTownVillage: liveTransplantID.recipientTownVillage || '',
      recipientLandmark: liveTransplantID.recipientLandmark || '',
      recipientPincode: liveTransplantID.recipientPincode || '',
      recipientStateId: liveTransplantID.recipientStateId || '',
      recipientCountryId: liveTransplantID.recipientCountryId || '',
      recipientCityId: liveTransplantID.recipientCityId || '',
      organId: liveTransplantID.organId || '',
      dateOfSurgery: liveTransplantID.dateOfSurgery || '',
      surgeryDuration: liveTransplantID.surgeryDuration || '',
      remarks: liveTransplantID.remarks || '',
      ischaemiaWarm: liveTransplantID.ischaemiaWarm || '',
      ischaemiaCold: liveTransplantID.ischaemiaCold || '',
      surgeryEndDate: liveTransplantID.surgeryEndDate || '',
      surgeryTime: liveTransplantID.surgeryTime || ''
    });
  }, [reset, liveTransplantID]);
  const donorDateOfBirth = watch('donorDateOfBirth');
  const recipientDateOfBirth = watch('recipientDateOfBirth');

  const handleOrganName = (organ: string) => {
    setOrgan(organ);
    setValue('organId', organ, { shouldValidate: true });
  };
  useEffect(() => {
    const hasShownPopup = localStorage.getItem('hasShownPopup');

    if (!hasShownPopup && isPopupShow) {
      setOpenModal(true);
      localStorage.setItem('hasShownPopup', 'true'); // Mark as shown
    }
  }, [isPopupShow]);
  useEffect(() => {
    const age: number = calculateAge(donorDateOfBirth); //.toString()
    setValue('age', age);
  }, [donorDateOfBirth, setValue]);
  useEffect(() => {
    const recipientAge: number = calculateAge(recipientDateOfBirth); //.toString()
    setValue('recipientAge', recipientAge);
  }, [recipientDateOfBirth, setValue]);
  const today = dayjs();
  const maxDate = today.subtract(0, 'year');
  const minDate = today.subtract(140, 'year');

  const onSubmit = (data: TransplantDetailsType) => {
    console.log('transplant details ', data);
    const paylaod = {
      ...data,
      id: liveTransplantID.id || 0,
      hospitalId: 2
    };
    if (id) {
      updateLiveTransplant(paylaod, () => {
        toast('Transplant Details Successfullu updated', 'success');
        navigate('/livetransplant');
      });
    } else {
      insertLiveTransplantDetails(paylaod, () => {
        toast('Transplant Details Successfullu added', 'success');
        navigate('/livetransplant');
      });
    }
    insertLiveTransplantDetails(paylaod, () => {
      toast('Transplant Details Successfullu added', 'success');
      navigate('/livetransplant');
    });
  };
  console.log('errors', errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        <Box className=" flex flex-col mt-[28px]">
          <Text className="!text-[#804595] !text-[19px] !font-[700]">Donor Details</Text>
          <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px] !mt-[28px]">
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormInput control={control} name="donorName" label="Donor Name" required fullWidth />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <AtomDatePicker
                control={control}
                minDate={minDate}
                maxDate={maxDate}
                name="donorDateOfBirth"
                label="Date of Birth"
                fullWidth
              />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormInput control={control} name="age" label="Age" required fullWidth />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormSelect
                menuOptions={bloodGroup}
                control={control}
                name="donorBloodGroupId"
                label="Blood Group"
                fullWidth
              />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormSelect menuOptions={genders} control={control} name="donorGenderId" label="Gender" fullWidth />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormSelect
                menuOptions={relationType}
                control={control}
                name="relationshipId"
                label="Donor RelationShip"
                fullWidth
              />
            </Box>
          </Box>
        </Box>
        <Box className="mt-[32px]">
          <Text className="!text-[#804595] !text-[19px] !font-[700]">Donor Address</Text>
          <Box className="flex flex-col mt-[16px]">
            <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="donorAddressLine1" label="Address Line 1" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="donorAddressLine2" label="Address Line 2" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="donorTownVillage" label="Town / Village" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="donorLandmark" label="Land Mark" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="pincode" label="Pincode" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormSelect menuOptions={cities} control={control} name="donorCityId" label="City" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormSelect menuOptions={states} control={control} name="donorStateId" label="State" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormSelect menuOptions={countries} control={control} name="donorCountryId" label="Contry" fullWidth />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className=" flex flex-col mt-[28px]">
          <Text className="!text-[#804595] !text-[19px] !font-[700]">Recipient Details</Text>
          <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px] !mt-[28px]">
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormInput control={control} name="recipientName" label="Recipient Name" required fullWidth />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <AtomDatePicker
                control={control}
                minDate={minDate}
                maxDate={maxDate}
                name="recipientDateOfBirth"
                label="Date of Birth"
                fullWidth
              />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormInput control={control} name="recipientAge" label="Age" required fullWidth />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormSelect
                menuOptions={bloodGroup}
                control={control}
                name="recipientBloodGroupId"
                label="Blood Group"
                fullWidth
              />
            </Box>
            <Box className="w-full md:w-[calc(33.33%-40px)] ">
              <FormSelect menuOptions={genders} control={control} name="recipientGenderId" label="Gender" fullWidth />
            </Box>
          </Box>
        </Box>
        <Box className="mt-[32px]">
          <Text className="!text-[#804595] !text-[19px] !font-[700]">Recipient Address</Text>
          <Box className="flex flex-col mt-[16px]">
            <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="recipientAddressLine1" label="Address Line 1" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="recipientAddressLine2" label="Address Line 2" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="recipientTownVillage" label="Town / Village" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="recipientLandmark" label="Land Mark" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormInput control={control} name="recipientPincode" label="Pincode" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormSelect menuOptions={cities} control={control} name="recipientCityId" label="City" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormSelect menuOptions={states} control={control} name="recipientStateId" label="State" fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <FormSelect
                  menuOptions={countries}
                  control={control}
                  name="recipientCountryId"
                  label="Contry"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="mt-[32px]">
          <Text className="!text-[#804595] !text-[19px] !font-[700]">Surgery Details</Text>
          <Box className="flex flex-col mt-[16px]">
            <Box className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <Box className="flex gap-4 mt-3 w-full">
                  <Box
                    className={`flex items-center w-full rounded-[20px] py-[1px] px-[18px] ${organ === 'organ' ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
                    onClick={() => handleOrganName('4')}
                  >
                    {organ === 'organ' ? <TickCircle toolText="" /> : <CircleGreyIcon />}
                    <Text className="pl-[4px] !text-[13px] !font-[500]">Liver</Text>
                  </Box>
                  <Box
                    onClick={() => handleOrganName('1')}
                    className={`flex items-center w-full  rounded-[20px] py-[1px] px-[18px] ${organ !== 'organ' ? 'bg-[#D876A94D] text-[#C967A2]' : ' bg-[#EDEDED] text-[#71717A]'}`}
                  >
                    {organ === 'organ' ? <CircleGreyIcon /> : <TickCircle toolText="" />}
                    <Text className="pl-[4px] !text-[13px] !font-[500]">Kidney</Text>
                  </Box>
                </Box>
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)]">
                <AtomDatePicker
                  control={control}
                  minDate={minDate}
                  maxDate={maxDate}
                  name="dateOfSurgery"
                  label="Date of Surgery"
                  fullWidth
                />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="surgeryDuration" label="Duration of Surgery" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="remarks" label="Remark is Any" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="ischaemiaWarm" label="Ischaemia Warm" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="ischaemiaCold" label="Ischaemia Cold" required fullWidth />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <AtomDatePicker
                  control={control}
                  minDate={minDate}
                  maxDate={maxDate}
                  name="surgeryEndDate"
                  label="Surgery End Date"
                  fullWidth
                />
              </Box>
              <Box className="w-full md:w-[calc(33.33%-40px)] ">
                <FormInput control={control} name="surgeryTime" label="Surgery Time" required fullWidth />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="my-[60px] flex items-center justify-end gap-[22px]">
          <Button
            className="w-[140px] h-[40px] flex gap-2 border-[1px] !text-[#D876A9] !border-[#D876A9] !mr-3"
            variant="outlined"
            onClick={() => navigate('/livetransplant')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="!w-[140px] h-[40px] flex gap-2 border-[1px] !text-[white] !bg-[#D876A9]"
            variant="contained"
            onSubmit={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default TransplantDetails;
