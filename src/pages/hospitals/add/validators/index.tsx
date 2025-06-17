import dayjs from 'dayjs';
import { z } from 'zod';
export const allowedFileTypes = [
  'application/pdf',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/JPG',
  'image/png',
  'image/gif',
  'image/svg+xml',
  'application/docx'
];

export const ntorcHospitalSchema = z.object({
  hospitalName: z.string().optional(),
  hospitalTypeId: z.number().optional(),
  zoneId: z.number().optional(),
  yearOfEstablishment: z
    .number({ invalid_type_error: 'Year of Establishment is Required' })
    .min(1, 'Year of Establishment is Required'),
  ntorcLicenceNumber: z
    .string({ invalid_type_error: 'Enter Hospital license number' })
    .min(1, 'Enter Hospital license number')
    .max(255),
  websiteUrl: z
    .string({ invalid_type_error: 'Enter Website URL' })
    .url({ message: 'Invalid URL, URL should contain http:// or https://' })
    .min(1, 'Enter Website URL')
    .max(255, 'Enter a Valid URL (maximum 255)'),
  email: z.string().email('Invalid mail address'),
  phoneNumber1: z.string().min(10, 'Phone number is Required'),
  phoneNumber2: z.string().min(10, 'Alternative phone number  is Required').max(255),
  isPhoneNumber1Verified: z.boolean(),
  isPhoneNumber2Verified: z.boolean(),
  ntorcLicenceDoc: z.string({ invalid_type_error: 'NTORC Licese is Required' }).min(1, 'NTORC Licese is Required'),
  ntorcLicenceRegistrationDate: z
    .string({ invalid_type_error: 'Enter License Registration Date' })
    .min(1, 'Enter License Registration Date')
    .refine((date) => {
      const selectedDate = dayjs(date);
      return selectedDate.isBefore(dayjs().add(1, 'day'), 'day');
    }, 'Registration date must be today or a past date'),
  ntorcLicenceExpiryDate: z
    .string({ invalid_type_error: 'Enter License Expiry Date' })
    .min(1, 'Enter License Expiry Date')
    .refine((date) => {
      const expiryDate = dayjs(date);
      return expiryDate.isAfter(dayjs(), 'day') && expiryDate.isBefore(dayjs().add(10, 'year'), 'day');
    }, 'Expiry date must be a valid future date'),
  addressLine1: z.string({ invalid_type_error: 'Enter Address Line 1' }).min(1, 'Enter Address line 1 ').max(255),
  addressLine2: z.string({ invalid_type_error: 'Enter Address Line 2' }).min(1, 'EnterAddress line 2').max(255),
  townVillage: z.string({ invalid_type_error: 'Enter Town Or Village' }).min(1, 'Enter Town or Village').max(255),
  landmark: z.any().optional(),
  pincode: z
    .string({ invalid_type_error: 'Enter Pincode' })
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Pincode must contain only numbers')
    .refine((val) => val !== '000000', {
      message: 'Pincode cannot be all zeros'
    }),
  cityId: z.number({ required_error: 'Choose a City', invalid_type_error: 'Choose a City' }),
  stateId: z.number({ required_error: 'Choose a City', invalid_type_error: 'Choose a State' }),
  countryId: z.number({ required_error: 'Choose a City', invalid_type_error: 'Choose a Country' })
});
export type NtorcHospitalType = z.infer<typeof ntorcHospitalSchema>;

export const hospitalDetailsSchema = z
  .object({
    hospitalTypeId: z.number().optional(),
    hospitalName: z.string().optional(),
    zoneId: z.number().optional(),
    email: z.string().email('Invalid mail address'),
    yearOfEstablishment: z.number().min(1, 'Year of establishment is Required'),
    websiteUrl: z
      .string()
      .url({ message: 'Invalid URL, URL should contain http:// or https://' })
      .min(1, 'Enter Website URL')
      .max(255, 'Enter a Valid URL (maximum 255)'),
    phoneNumber1: z.string().min(10, 'Phone number is Required'),
    phoneNumber2: z.string().min(10, 'Alternative phone number  is Required'),
    countryCode1: z.any().optional(),
    countryCode2: z.any().optional(),
    isPhoneNumber1Verified: z.boolean(),
    isPhoneNumber2Verified: z.boolean(),
    addressLine1: z.string().min(1, 'Enter Address line 1'),
    addressLine2: z.string().min(1, 'Enter Address line 2 '),
    townVillage: z.string().min(1, 'Enter Town or village Name'),
    landmark: z.string().optional(),
    cityId: z.number({ required_error: 'Choose a City', invalid_type_error: 'Choose a City' }).min(1, 'Choose a City'),
    stateId: z
      .number({ required_error: 'Choose a State', invalid_type_error: 'Choose a State' })
      .min(1, 'Choose a State'),
    countryId: z
      .number({ required_error: 'Choose a Country', invalid_type_error: 'Choose a Country' })
      .min(1, 'Choose a Country'),
    pincode: z
      .string()
      .length(6, 'Pincode must be exactly 6 digits')
      .regex(/^\d{6}$/, 'Pincode must contain only numbers')
      .refine((val) => val !== '000000', {
        message: 'Pincode cannot be all zeros'
      })
  })
  .refine((data) => data.phoneNumber1 && data.phoneNumber2 && data.phoneNumber1 !== data.phoneNumber2, {
    message: 'Phone number and alternative phone number must be different',
    path: ['phoneNumber2'] // attach error to phoneNumber2 field
  });
export type HospitalDetailsType = z.infer<typeof hospitalDetailsSchema>;

export const hospitalInfraStructureSchema = z
  .object({
    departments: z.array(z.string()).min(1, 'Please select at least one department'),
    numberOfBeds: z.coerce
      .number({
        invalid_type_error: 'Number of beds must be a number'
      })
      .refine((val) => val >= 1 && val <= 10000, {
        message: 'Number of beds must be between 1 and 10000'
      }),
    isTraumaUnitAvailable: z.preprocess((val) => val === 'true', z.boolean()),
    isMedicalCollegeAttached: z.preprocess((val) => val === 'true', z.boolean()),
    firstOrganLicenceRegDate: z
      .string()
      .min(1, 'Enter License Registration Date')
      .refine((date) => {
        const selectedDate = dayjs(date);
        return selectedDate.isBefore(dayjs().add(1, 'day'), 'day');
      }, 'Registration date must be today or a past date'),
    isIsoOrNabhAccredited: z.preprocess((val) => val === 'true', z.boolean()),
    isRegistredClinicalEstablishmentAct: z.preprocess((val) => val === 'true', z.boolean()),
    // clinicalEstablishmentCertificate: z.any().optional(),
    // // nabhCertificate: z.any().optional(),
    // nabhCertificate: z
    //   .string() // Expects a string path after upload
    //   .min(1, 'NABH Certificate is required.') // Ensures it's not an empty string
    //   .refine(
    //     (val) => {
    //       // This refine is mostly for consistency with the actual input.
    //       // The real-time validation will happen in FormFileInput's onChange.
    //       return typeof val === 'string' && val.length > 0;
    //     },
    //     {
    //       message: 'NABH Certificate is required.'
    //     }
    //   ),
    nabhCertificate: z.string().optional(),
    clinicalEstablishmentCertificate: z.string().optional(),
    choosenOptions: z.array(z.string()).min(1, 'Please select at least one department').optional()
  })
  .superRefine((data, ctx) => {
    if (data.isIsoOrNabhAccredited && !data.nabhCertificate) {
      ctx.addIssue({
        path: ['nabhCertificate'],
        message: 'NABH Certificate is required if NABH accreditation is selected',
        code: z.ZodIssueCode.custom
      });
    }

    if (data.isRegistredClinicalEstablishmentAct && !data.clinicalEstablishmentCertificate) {
      ctx.addIssue({
        path: ['clinicalEstablishmentCertificate'],
        message: 'Clinical Act Document is required if Clinical Establishment is selected',
        code: z.ZodIssueCode.custom
      });
    }
  });
export type HospitalInfraStructure = z.infer<typeof hospitalInfraStructureSchema>;

export const approvedOrgansSchema = z.object({
  selectedOrgans: z
    .array(
      z
        .object({
          organId: z.number().optional(),
          organName: z.string().optional(),
          // dms_license: z
          //   .instanceof(File)
          //   .refine((file) => allowedFileTypes.includes(file.type), {
          //     message: 'Unsupported file type. Please upload a PDF, JPG, or PNG file.'
          //   })
          //   .refine((file) => file.size <= 10 * 1024 * 1024, {
          //     message: 'File size should be less than 10MB'
          //   }).optional(),
          dms_license: z.any().optional(),
          // organ_first_level: z.string().min(1, 'Enter Organ First Level Registeration Date'),
          // license_expiry: z.string().min(1, 'Enter License Expiry Date'),
          organ_first_level: z
            .string()
            .min(1, 'Enter License Registration Date')
            .refine((date) => {
              const selectedDate = dayjs(date);
              return selectedDate.isBefore(dayjs().add(1, 'day'), 'day');
            }, 'Registration date must be today or a past date'),
          license_expiry: z
            .string()
            .min(1, 'Enter License Expiry Date')
            .refine((date) => {
              const expiryDate = dayjs(date);
              return expiryDate.isAfter(dayjs(), 'day') && expiryDate.isBefore(dayjs().add(10, 'year'), 'day');
            }, 'Expiry date must be within 10 years from the registration date.'),
          // license_expiry: z.string().min(1, 'Enter License Expiry Date'),

          organ_reference_no: z
            .string()
            .min(8, 'License Number should be minimum 8 Digits')
            .max(12, 'License Number should be maximum 12 Digits '),
          receipt_number: z.string().optional(),
          cost: z.number().optional()
        })
        .superRefine((data, ctx) => {
          const regDate = dayjs(data.organ_first_level);
          const expDate = dayjs(data.license_expiry);

          if (!expDate.isAfter(regDate, 'day')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['license_expiry'],
              message: 'Expiry date must be after registration date'
            });
          }

          if (!expDate.isBefore(regDate.add(20, 'year'), 'day')) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['license_expiry'],
              message: 'Expiry date must be within 20 years of registration date'
            });
          }
        })
    )
    .nonempty({ message: 'Select atleast one Organ' })
});

export type HospitalApprovedOrganType = z.infer<typeof approvedOrgansSchema>;

export const adminDetailsSchema = z
  .object({
    userImage: z.any().optional(),
    aadharNumber: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || undefined),
    passportNumber: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || undefined),
    isAadharNumberVerified: z.boolean().optional(),
    transtanId: z.string().optional(),
    roleId: z.number(),
    firstName: z.string().min(1, 'Enter your first name'),
    lastName: z.string().min(1, 'Enter your last name'),
    genderId: z.number(),
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
    age: z.string().optional(), // Age is calculated dynamically
    uuid: z.string().optional(),
    designationId: z.number(),
    qualification: z.string().min(1, 'Qualification is required'),
    specialization: z.number().optional(),
    phoneNumber1: z.string().min(10, 'Phone Number is required'),
    phoneNumber2: z.string().optional(),
    countryCode1: z.any().optional(),
    countryCode2: z.number().optional(),
    isPhoneNumber1Verified: z.boolean().optional(),
    isPhoneNumber2Verified: z.boolean().optional(),
    email: z.string().email('Invalid email address'),
    dateOfJoining: z.string().optional(),
    practicingSince: z.string().optional(),
    medicalLicence: z.string().optional(),
    addressLine1: z.string().min(1, 'Enter Address Line 1'),
    addressLine2: z.string().optional(),
    townVillage: z.string().min(1, 'Enter town or village name'),
    pincode: z
      .string()
      .length(6, 'Pincode must be exactly 6 digits')
      .regex(/^\d{6}$/, 'Pincode must contain only numbers')
      .refine((val) => val !== '000000', {
        message: 'Pincode cannot be all zeros'
      }),
    landmark: z.string().optional(),
    cityId: z.number({ required_error: 'Choose a City', invalid_type_error: 'Choose a City' }).min(1, 'Choose a City'),
    stateId: z
      .number({ required_error: 'Choose a State', invalid_type_error: 'Choose a State' })
      .min(1, 'Choose a State'),
    countryId: z
      .number({ required_error: 'Choose a Country', invalid_type_error: 'Choose a Country' })
      .min(1, 'Choose a Country'),
    status: z.string().optional(),
    experience: z.number().optional(),
    mPanelNumber: z.string().optional(),
    userExperience: z
      .array(
        z.object({
          role: z.string(),
          hospitalName: z.string(),
          dateofJoin: z.string(),
          dateofRelive: z.string(),
          caseHandled: z.number()
        })
      )
      .optional(),
    organ: z
      .array(
        z.object({
          id: z.number(),
          name: z.string()
        })
      )
      .optional(),
    isIndian: z.boolean().optional()
  })
  .superRefine((data, ctx) => {
    // If Indian, Aadhar is required
    if (data.isIndian) {
      if (!data.aadharNumber?.trim()) {
        ctx.addIssue({
          path: ['aadharNumber'],
          message: 'Aadhar Number is required for Indian nationality',
          code: z.ZodIssueCode.custom
        });
      }
      // Add Aadhar format validation (12 digits) if needed
    }

    // If not Indian, Passport is required
    if (!data.isIndian) {
      if (!data.passportNumber?.trim()) {
        ctx.addIssue({
          path: ['passportNumber'],
          message: 'Passport Number is required for International nationality',
          code: z.ZodIssueCode.custom
        });
      }
    }
  });
// .superRefine((data, ctx) => {
//   if (data.isIndian) {
//     if (!data.aadharNumber) {
//       ctx.addIssue({
//         path: ['aadharNumber'],
//         message: 'Aadhar number is required for Indian users',
//         code: z.ZodIssueCode.custom
//       });
//     }
//   } else {
//     if (!data.passportNumber) {
//       ctx.addIssue({
//         path: ['passportNumber'],
//         message: 'Passport number is required for non-Indian users',
//         code: z.ZodIssueCode.custom
//       });
//     }
//   }
// })

// .superRefine((data, ctx) => {
//   if (data.isIndian) {
//     // Indian nationality
//     if (!data.aadharNumber) {
//       ctx.addIssue({
//         path: ['aadharNumber'],
//         message: 'Aadhar Number is required for Indian nationality',
//         code: z.ZodIssueCode.custom
//       });
//     } else if (data.aadharNumber.length !== 12) {
//       ctx.addIssue({
//         path: ['aadharNumber'],
//         message: 'Aadhar Number must be exactly 12 characters',
//         code: z.ZodIssueCode.custom
//       });
//     }

//     if (data.passportNumber) {
//       ctx.addIssue({
//         path: ['passportNumber'],
//         message: 'Passport Number should not be provided for Indian nationality',
//         code: z.ZodIssueCode.custom
//       });
//     }
//   } else {
//     // International nationality
//     if (!data.passportNumber) {
//       ctx.addIssue({
//         path: ['passportNumber'],
//         message: 'Passport Number is required for International nationality',
//         code: z.ZodIssueCode.custom
//       });
//     } else if (data.aadharNumber.length < 8 || data.passportNumber.length > 12) {
//       ctx.addIssue({
//         path: ['passportNumber'],
//         message: 'Passport Number must be between 8 and 12 characters',
//         code: z.ZodIssueCode.custom
//       });
//     }

//     if (data.aadharNumber) {
//       ctx.addIssue({
//         path: ['aadharNumber'],
//         message: 'Aadhar Number should not be provided for International nationality',
//         code: z.ZodIssueCode.custom
//       });
//     }
//   }
// });

// const ageSchema = z.string().refine(
//   (val) => {
//     Number(val) > 0 && Number(val) < 100;
//   },
//   { message: 'Age should be between 1 and 100' }
// );

export type AdminDetailsType = z.infer<typeof adminDetailsSchema> & {
  nationality?: boolean;
  age?: string;
};
// const result = ageSchema.safeParse('25');
