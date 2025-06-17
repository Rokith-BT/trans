/* eslint-disable no-unused-vars */
import { CameraIcon, CircleGreyIcon, EditIcon, ProfileIcon, TickCircle } from '@/assets/icons';
import { AtomDatePicker, Box, FormFileInput, FormInput, FormSelect, MultiImageInput, Text } from '@/atoms';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import React, { useEffect, useState } from 'react';
import { Control, Controller, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import AtomRadio from '@/atoms/radio/Radio';
import DepartmentSelect from '@/pages/components/CustomChip';
import { CombinedData } from '../HospitalInfras';
import { HospitalInfraStructure } from '../../validators';
import { Grid } from '@mui/material';
import { ApprovedOrganField, ImageOption, organOptions, tissueOptions } from '../ApprovedOrganDoc';
import { useLocation, useNavigate } from 'react-router';
import MobileOtp from '@/pages/components/MobileOtp';

interface FormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  errors: FieldErrors;
  isIndian: boolean;
  handleNationalityChange: (isIndian: boolean) => void;
  InfraData: CombinedData | undefined | HospitalInfraStructure;
  selectOptions: string[];
  handleChange: (value: string[]) => void;
  handleDelete: (value: string) => void;
  isNabh: boolean;
  isClinical: boolean;
  setIsNabh: (value: boolean) => void;
  setIsClinical: (value: boolean) => void;
  handleImageClick: (option: ImageOption) => void;
  isOrganSelected: (id: string) => boolean;
  fields: FieldArrayWithId<ApprovedOrganField>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit: any;
  organOptions: { value: string; label: string }[];
  genderOptions: { value: string; label: string }[];
  designationOptions: { value: string; label: string }[];
  roleOptions: { value: string; label: string }[];
  qualificationOptions: { value: string; label: string }[];
  establishedYearsOptions: { value: string; label: string }[];
  departmentOptions: string[];
  countryOptions: { value: string; label: string }[];
  cityOptions: { value: string; label: string }[];
  stateOptions: { value: string; label: string }[];
}

const Form: React.FC<FormProps> = ({
  control,
  errors,
  isIndian = false,
  handleNationalityChange,
  selectOptions,
  handleChange,
  handleDelete,
  isNabh,
  isClinical,
  setIsNabh,
  setIsClinical,
  handleImageClick,
  isOrganSelected,
  fields,
  onEdit,
  genderOptions,
  designationOptions,
  roleOptions,
  establishedYearsOptions,
  departmentOptions,
  cityOptions,
  stateOptions,
  countryOptions
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [enteredPhoneNumber, setEnteredNumber] = useState('');
  const [alterPhoneNumber, setAlterPhoneNumber] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [altVerified, setAltVerified] = useState(false);
  const { hospital, editMode } = location.state || {};
  console.log('hospital data from table ', hospital, editMode);
  const handlePhoneVerification = () => {
    if (enteredPhoneNumber) {
      setPhoneVerified(true);
    }
    if (alterPhoneNumber) {
      setAltVerified(true);
    }
  };

  useEffect(() => {
    if (enteredPhoneNumber.length < 12) {
      setPhoneVerified(false);
    }
    if (alterPhoneNumber.length < 12) {
      setAltVerified(false);
    }
  }, [enteredPhoneNumber, alterPhoneNumber]);
  return (
    <div>
      {location.state?.editMode && (
        <Box className="flex justify-between items-center mb-4">
          <Text className=" !text-[19px] text-[#C967A2] !font-[700] "> {hospital.name}</Text>
          <EditIcon
            className="cursor-pointer"
            onClick={() => {
              {
                navigate('/hospitals/add-hospital', { state: { fiveSteps: true } });
              }
              onEdit();
            }}
          />
        </Box>
      )}
      {!location.state?.editMode && (
        <>
          <Text className="text-[#804595] !font-[600] !mb-4 !text-[19px]">Admin Details</Text>
          <Box className="flex flex-wrap w-full ">
            <Box className="flex w-full md:w-1/3  justify-center relative ">
              <ProfileIcon className="bg-[#8045954D] rounded-full h-[124px] w-[124px] p-7" />
              <Box className="absolute right-[35%] bottom-[55px]">
                <Box className="h-[28px] w-[28px] absolute right-[5px] bottom-[5px]  bg-[#fefdfd] rounded-full">
                  <Box className=" bg-[#D876A926] rounded-full ">
                    <CameraIcon />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="w-full md:w-2/3 gap-y-[48px] mb-[48px] flex flex-wrap">
              <Box className="flex flex-col w-full md:w-1/2 gap-x-4 md:px-[20px]">
                <Text className="!text-[13px] !mb-[0px] !font-[500]">
                  Select Nationality <span className="text-[red]">*</span>
                </Text>
                <Box className="flex gap-4 ">
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
              <Box className=" md:w-1/2 w-full  md:px-[28px] md:pr-[0]">
                {!isIndian ? (
                  <FormInput
                    control={control}
                    name="adminPassportNumber"
                    error={!!errors.adminPassportNumber}
                    label="Passport Number"
                    required
                    fullWidth
                  />
                ) : (
                  <FormInput
                    control={control}
                    name="adminAadharNumber"
                    error={!!errors.adminAadharNumber}
                    label="Aadhaar Number"
                    required
                    fullWidth
                  />
                )}
              </Box>
              <Box className=" md:w-1/2 w-full  md:px-[18px] md:pr-[18px]">
                <FormInput control={control} name="firstName" label="First Name" required fullWidth />
              </Box>
              <Box className=" md:w-1/2 w-full  md:px-[28px] md:pr-[0]">
                <FormInput control={control} name="lastName" label="Last Name" required fullWidth />
              </Box>
            </Box>
          </Box>
          <Box className="flex flex-wrap gap-y-[48px] -mx-[27px] ">
            <Box className=" w-full md:w-1/3 md:px-[27px] relative">
              <AtomDatePicker control={control} name="dateOfBirth" label="Date Of Birth" fullWidth required />
            </Box>
            <Box className="md:w-1/3 w-full md:px-[27px]">
              <FormInput control={control} name="age" label="Age" fullWidth />
            </Box>
            <Box className=" md:w-1/3 w-full  md:px-[20px] md:pr-[27px] ">
              <FormSelect
                control={control}
                name="gender"
                menuOptions={genderOptions}
                label="Gender"
                required
                fullWidth
              />
            </Box>
            <Box className="md:w-1/3 w-full md:px-[27px]">
              <FormSelect
                control={control}
                name="designation"
                menuOptions={designationOptions}
                label="Designation"
                fullWidth
              />
            </Box>
            <Box className="md:w-1/3 w-full md:px-[27px]">
              <FormSelect control={control} name="role" menuOptions={roleOptions} label="Role" fullWidth />
            </Box>
            <Box className="md:w-1/3 w-full md:px-[20px] md:pr-[27px]">
              <FormInput control={control} name="qualification" label="Qualification" fullWidth required />
            </Box>
            <Box className="flex w-full gap-4 md:w-1/3  md:px-[27px]">
              <StyledPhoneInput
                control={control}
                name="phone"
                helperText="Alternative Phone Number is Required"
                onVerify={() => setOpenOtpDialog(true)} // Open OTP dialog when verifying
                onPhoneNumberChange={setEnteredNumber}
                isVerified={phoneVerified}
              />
            </Box>
            <Box className="md:w-1/3 w-full md:px-[27px]">
              <FormInput control={control} name="adminEmail" label="Email" fullWidth required />
            </Box>
          </Box>
          <Box className="mt-[36px]">
            <Text className="!text-[19px] text-[#804595] !font-[700]">Admin Address</Text>
            <Box mt={6} className="flex flex-col gap-y-[48px] gap-x-[57px]">
              <Box className="flex w-full gap-y-[48px] gap-x-[57px]">
                <FormInput control={control} name="addressLine1" label="Address Line 1" fullWidth required />
                <FormInput control={control} name="addressLine2" label="Address Line 2" fullWidth />
                <FormInput control={control} name="townVillage" label="Town / Village" fullWidth required />
              </Box>
              <Box className="flex w-full gap-y-[48px] gap-x-[57px]">
                <FormInput control={control} name="landmark" label="Landmark" fullWidth />
                <FormInput control={control} name="adminPincode" label="Pin code" fullWidth required />
                <FormSelect menuOptions={cityOptions} control={control} name="adminCity" label="City" fullWidth />
              </Box>
              <Box className="flex w-[65%] gap-y-[48px] gap-x-[57px]">
                <FormSelect menuOptions={cityOptions} control={control} name="adminState" label="State" fullWidth />
                <FormSelect
                  menuOptions={countryOptions}
                  control={control}
                  name="adminCountry"
                  label="Country"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
      <Box className="mt-[2%]">
        <Text className="mt-[2%] text-[#804595] !font-[700] !text-[19px] !mb-[28px]">Hospital Basic Details</Text>
        <Box className="flex flex-col">
          <Box className="flex flex-wrap -mx-[27px]">
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <FormInput
                control={control}
                name="hospitalType"
                label="Hospital Type"
                placeholder="Government"
                fullWidth
              />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <FormInput
                control={control}
                name="hospitalName"
                label="Hospital Name"
                placeholder="Enter Here"
                fullWidth
              />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <FormInput control={control} name="zone" label="Zone" placeholder="Enter Here" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <FormSelect
                control={control}
                name="year_of_establishment"
                menuOptions={establishedYearsOptions}
                label="Years of Establishment"
                placeholder="Select"
                fullWidth
                required
              />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <FormInput
                control={control}
                name="website_url"
                label="Website URL"
                placeholder="Enter Here"
                fullWidth
                required
              />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <FormInput control={control} name="email" label="Email" placeholder="Gems@gmail.com" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <StyledPhoneInput
                control={control}
                name="phone_number"
                helperText="Alternative Phone Number is Required"
                onVerify={() => setOpenOtpDialog(true)} // Open OTP dialog when verifying
                onPhoneNumberChange={setEnteredNumber}
                isVerified={phoneVerified}
              />
            </Box>
            <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
              <StyledPhoneInput
                control={control}
                name="alt_phone_number"
                helperText="Alternative Phone Number is Required"
                onPhoneNumberChange={setAlterPhoneNumber}
                isVerified={altVerified}
                onVerify={() => {
                  if (altVerified) {
                    setOpenOtpDialog(false);
                  } else {
                    setOpenOtpDialog(true);
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box>
          <Text className="mt-[2%] text-[#804595] !font-[700] !text-[19px] !mb-[28px]">Hospital Address</Text>
          <Box className="mt-[2%] flex flex-col">
            <Box className="flex flex-wrap -mx-[27px]">
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormInput
                  control={control}
                  name="address_line1"
                  label="Address Line 1"
                  placeholder="Gems Hospital"
                  fullWidth
                  required
                />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormInput
                  control={control}
                  name="address_line2"
                  label="Address Line 2"
                  placeholder="Enter Here"
                  fullWidth
                  required
                />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormInput
                  control={control}
                  name="town_village"
                  label="Town/Village"
                  placeholder="Enter Here"
                  fullWidth
                  required
                />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormInput control={control} name="landmark" label="Landmark" placeholder="Enter Here" fullWidth />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormInput
                  control={control}
                  name="pincode"
                  label="Pincode"
                  placeholder="Enter Here"
                  fullWidth
                  required
                />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormSelect
                  menuOptions={cityOptions}
                  control={control}
                  name="city"
                  label="City"
                  placeholder="Enter Here"
                  fullWidth
                />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormSelect
                  menuOptions={stateOptions}
                  control={control}
                  name="state"
                  label="State"
                  placeholder="Enter Here"
                  fullWidth
                />
              </Box>
              <Box className="w-full md:w-1/3 px-[27px] mb-[48px]">
                <FormSelect
                  menuOptions={countryOptions}
                  control={control}
                  name="country"
                  label="Country"
                  placeholder="Enter Here"
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={5} mb={6}>
        <Text className="!text-[19px] !mb-[28px] !font-bold text-[#804595]">Hospital Infrastructure</Text>
        <Box mt={3}>
          <DepartmentSelect
            selectOptions={selectOptions}
            options={departmentOptions}
            handleChange={handleChange}
            handleDelete={handleDelete}
          />

          <Box mt={6} className="flex flex-wrap -mx-[57px]">
            <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
              <FormInput
                control={control}
                name="no_of_beds"
                label="Number Of Beds"
                placeholder="Enter Here"
                required
                fullWidth
              />
            </Box>

            <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
              <FormAtomRadioGroup
                control={control}
                name="trauma_unit"
                label="Whether trauma unit available?"
                isRequired={true}
                row
              >
                <AtomRadio label="Yes" value={true} />
                <AtomRadio label="No" value={false} />
              </FormAtomRadioGroup>
            </Box>

            <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
              <FormAtomRadioGroup
                control={control}
                name="ismedical_college"
                label="Whether medical college attached?"
                isRequired={true}
                row
              >
                <AtomRadio label="Yes" value={true} />
                <AtomRadio label="No" value={false} />
              </FormAtomRadioGroup>
            </Box>

            <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
              <FormAtomRadioGroup
                control={control}
                name="iso_nabh"
                label="Whether ISO/NABH accredited?"
                isRequired={true}
                row
              >
                <AtomRadio label="Yes" value={true} onClick={() => setIsNabh(true)} />
                <AtomRadio label="No" value={false} onClick={() => setIsNabh(false)} />
              </FormAtomRadioGroup>
            </Box>

            <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
              <FormAtomRadioGroup
                control={control}
                name="clinical_establishment"
                label="Whether registered under clinical establishment act?"
                isRequired={true}
                row
              >
                <AtomRadio label="Yes" value={true} onClick={() => setIsClinical(true)} />
                <AtomRadio label="No" value={false} onClick={() => setIsClinical(false)} />
              </FormAtomRadioGroup>
            </Box>
            <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
              <AtomDatePicker
                control={control}
                name="dateOfFirstOrgan"
                label="Date of first organ license Registeration"
                required
                fullWidth
              />
            </Box>
            {isNabh && (
              <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
                <FormFileInput control={control} name="nabh_certificate" label="NABH Certificate" required fullWidth />
              </Box>
            )}

            {isClinical && (
              <Box className="w-full md:w-1/3 px-[57px] mb-[48px]">
                <FormFileInput
                  control={control}
                  name="clinical_act_document"
                  label="Clinical establishment Act certificate"
                  required
                  fullWidth
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box mt={5}>
        <Text className="!text-xl !font-bold text-[#804595]">Approved Organs & Documents</Text>
        <Box mt={3} className="relative">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <MultiImageInput
                id="outlined-full-width"
                label="Select Organs"
                fullWidth
                variant="outlined"
                value=""
                InputProps={{
                  readOnly: true,
                  style: {
                    cursor: 'pointer'
                  },
                  onClick: () => {}
                }}
              />
            </Grid>
          </Grid>

          <Box className="flex w-[70%] items-center justify-evenly absolute top-[35%] left-[-4%] ">
            {organOptions.map((option, index) => (
              <Box className={`flex-col text-center `} key={index} onClick={() => handleImageClick(option)}>
                <img
                  src={option.src}
                  alt={`Organ ${index}`}
                  className={`h-[70px] w-[70px] p-3 cursor-pointer ${isOrganSelected(option.id) ? '!bg-[#8045954D] !border-[#804595] !border-2 !rounded-full' : ''} hover:bg-[#8045954D] hover:border-[#804595] hover:border-2 hover:rounded-full`}
                />
                <span className="text-lg font-semibold ">{option.label}</span>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className="mt-[28px] relative">
          <Box className="w-full flex items-center justify-evenly">
            <MultiImageInput
              id="outlined-full-width"
              label="Select Tissues"
              fullWidth
              variant="outlined"
              value=""
              InputProps={{
                readOnly: true,
                style: {
                  cursor: 'pointer'
                },
                onClick: () => {}
              }}
            />
          </Box>
          <Box className="flex w-[100%] items-center justify-evenly absolute top-[25%] left-[-2%] ">
            {tissueOptions.map((option, index) => (
              <Box className={`flex-col text-center `} key={index} onClick={() => handleImageClick(option)}>
                <img
                  src={option.src}
                  alt={`Organ ${index}`}
                  className={`h-[70px] w-[70px] p-3 cursor-pointer ${isOrganSelected(option.id) ? 'bg-[#8045954D] border-[#804595] border-2 rounded-full' : ''} hover:bg-[#8045954D] hover:border-[#804595] hover:border-2 hover:rounded-full`}
                />
                <span className="text-lg font-semibold ">{option.label}</span>
              </Box>
            ))}
          </Box>
        </Box>
        <Box mt={3} mb={3}>
          {fields.map((field, index) => {
            const organField = field as ApprovedOrganField; // Type assertion

            return (
              <Box key={organField.id} className="flex flex-col mt-3">
                <Controller
                  control={control}
                  name={`selectedOrgans.${index}.organName`}
                  render={() => (
                    <Text className="!text-[19px] !font-bold text-[#804595] !mb-[28px]">
                      {organField.organName ?? 'Unknown'}
                    </Text>
                  )}
                />

                <Box className="flex flex-wrap -mx-[57px]">
                  <Box className="w-full md:w-1/3 px-[48px] mb-[32px]">
                    <FormFileInput
                      control={control}
                      name={`selectedOrgans.${index}.dms_license`}
                      label="DMS license"
                      fullWidth
                      required
                    />
                  </Box>
                  <Box className="w-full md:w-1/3 px-[48px] mb-[32px]">
                    <AtomDatePicker
                      control={control}
                      name={`selectedOrgans.${index}.organ_first_level`}
                      required
                      fullWidth
                      label="Organ first level Registeration Date"
                    />
                  </Box>
                  <Box className="w-full md:w-1/3 px-[48px] mb-[32px]">
                    <AtomDatePicker
                      control={control}
                      name={`selectedOrgans.${index}.license_expiry`}
                      required
                      fullWidth
                      label="Liscense Expiry Date"
                    />
                  </Box>
                  <Box className="w-full md:w-1/3 px-[48px] mb-[32px]">
                    <FormInput
                      control={control}
                      name={`selectedOrgans.${index}.organ_reference_no`}
                      required
                      fullWidth
                      label="Organ License Number"
                    />
                  </Box>
                  <Box className="w-full md:w-1/3 px-[48px] mb-[32px]">
                    <FormInput
                      control={control}
                      name={`selectedOrgans.${index}.receipt_number`}
                      required
                      fullWidth
                      label="Payment Receipt Number"
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
      <MobileOtp
        open={openOtpDialog}
        onClose={() => setOpenOtpDialog(false)}
        phoneNumber={enteredPhoneNumber}
        onVerify={handlePhoneVerification}
      />
    </div>
  );
};

export default Form;
