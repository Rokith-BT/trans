import { z } from 'zod';

export const postTranstanUserSchema = z.object({
  isIndian: z.boolean().optional(),
  aadhaarNumber: z
    .string()
    .min(12, 'Aadhaar Number must be exactly 12 digits.')
    .max(12, 'Aadhaar Number must be exactly 12 digits.')
    .regex(/^\d{12}$/, 'Aadhaar Number must contain only numbers')
    .refine((val) => val !== '000000000000', {
      message: 'Aadhaar Number cannot be all zeros'
    }),
  uuid: z.string().optional(),
  isAadhaarNumberVerified: z.boolean().optional(),
  userImage: z.any().optional(),
  firstName: z.string().min(1, 'First Name is Required').max(255, 'First Name is Required'),
  lastName: z.string().min(1, 'Last Name is Required').max(255, 'Last Name is Required'),
  genderId: z.number().min(1, 'Gender is Required').positive({ message: 'Enter a Valid Count' }).nullable(),
  dateOfBirth: z.string().refine(
    (dob) => {
      const today = new Date();
      const birthDate = new Date(dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 > 0 && age - 1 <= 100;
      }
      return age > 0 && age <= 100;
    },
    { message: 'Choose a valid date of birth (age must be between 1 and 100)' }
  ),
  bloodGroupId: z.number().min(1, 'Blood Group is Required'),
  phoneNumber1: z.string().min(10, 'Phone Number1 is Required'),
  phoneNumber2: z.string().min(1, 'Phone Number2 is Required'),
  isPhoneNumber1Verified: z.boolean().optional(),
  isPhoneNumber2Verified: z.boolean().optional(),
  email: z.string().email('Invalid mail address'),
  designationId: z.number().min(1, 'Designation is Required'),
  roleId: z.number().min(1, 'Role is Required'),
  qualification: z.string().min(1, 'Qualification is Required'),
  addressLine1: z.string().min(1, 'AddressLine1 is Required'),
  addressLine2: z.string().min(1, 'AddressLine2 is Required'),
  townVillage: z.string().min(1, 'Twon / Village is Required'),
  landmark: z.string().min(1, 'Landmark is Required'),
  pincode: z
    .string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Pincode must contain only numbers')
    .refine((val) => val !== '000000', {
      message: 'Pincode cannot be all zeros'
    }),
  cityId: z.number().min(1, 'City is Required'),
  stateId: z.number().min(1, 'State is Required'),
  countryId: z.number().min(1, 'Country is Required')
});
