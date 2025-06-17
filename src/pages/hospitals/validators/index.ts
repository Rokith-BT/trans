import { z } from 'zod';
const commonSchema = z.object({
  nationality: z.boolean().optional(),
  uuid: z.string().optional(),
  userImage: z.any().optional(),
  firstName: z.string().min(1, 'First Name is Required'),
  lastName: z.string().min(1, 'Last Name is Required'),
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
  isIndian: z.boolean().optional(),
  genderId: z.number().min(1, 'Gender is Required'),
  phoneNumber1: z.string().min(10, 'Phone Number is Required'),
  email: z.string().email('Invalid email address'),
  addressLine1: z.string().min(1, 'Enter Address Line 1 '),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  townVillage: z.string().min(1, 'Enter town or village name'),
  cityId: z.number().min(1, 'Choose a City'),
  stateId: z.number().min(1, 'Choose a State'),
  countryId: z.number().min(1, 'Choose a Country'),
  pincode: z
    .string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Pincode must contain only numbers')
    .refine((val) => val !== '000000', {
      message: 'Pincode cannot be all zeros'
    }),
  designationId: z.number().min(1, 'Designation is Required'),
  roleId: z.number().min(1, 'Role is Required'),
  qualification: z.string().min(1, 'Qualification is Required')
});

export const doctorSchema = commonSchema.extend({
  organ: z.array(z.object({ id: z.number(), name: z.string() })).nonempty('Select at least one organ'),
  specialization: z.array(z.number()).nonempty('Select Specialization'),
  dateOfJoining: z.string().min(1, 'Date of Joining is Required'),
  practicingSince: z.string().min(1, 'Practice Since is Required'),
  experience: z.coerce
    .number({
      invalid_type_error: 'Experience must be a number'
    })
    .refine((val) => val >= 1 && val <= 999, {
      message: 'Experience must be between 1 and 999'
    }),
  medicalLicence: z.string({ invalid_type_error: '' }).min(1, 'Medical License is REquired'),
  mPanelNumber: z.string().min(1, 'm panel number is Required'),
  userExperience: z
    .array(
      z.object({
        role: z.string().min(1, 'Role is Required'),
        hospitalName: z.string().min(1, 'Enter Hospital Name'),
        dateofJoin: z.string().min(1, 'Date of Joining is Required'),
        dateofRelive: z.string().min(1, 'Date of Relieving is Required'),
        caseHandled: z.coerce
          .number({
            invalid_type_error: 'Case handle must be a number'
          })
          .refine((val) => val >= 1 && val <= 9999, {
            message: 'Case handle must be between 1 and 999'
          })
      })
    )
    .optional(),
  nationality: z.boolean().optional(),
  aadharNumber: z.string().optional(),
  passportNumber: z.string().optional()
});
// .superRefine((data, ctx) => {
//   if (data.nationality && data.aadharNumber) {
//     ctx.addIssue({
//       path: ['aadharNumber'],
//       message: 'Aadhar Number is required for Indian users',
//       code: 'custom'
//     });
//   }
//   if (!data.nationality && data.passportNumber) {
//     ctx.addIssue({
//       path: ['passportNumber'],
//       message: 'Passport Number is required for International users',
//       code: 'custom'
//     });
//   }
// });

export const coOrdinatorSchema = commonSchema.extend({
  organ: z.any().optional(),
  userExperience: z
    .array(
      z.object({
        role: z.string().min(1, 'Role is required'),
        hospitalName: z.string().min(1, 'Enter Hospital Name'),
        dateofJoin: z.string().min(1, 'Date of Joining is Required'),
        dateofRelive: z.string().min(1, 'Date of Relieving is Required'),
        caseHandled: z.preprocess(
          (val) => (val === '' ? null : Number(val)),
          z
            .number({ invalid_type_error: 'Enter a valid number' })
            .min(1, 'Enter a valid number greater than 0')
            .max(120, 'Enter a number less than or equal to 120')
        )
      })
    )
    .optional(),
  nationality: z.boolean().optional(),
  aadharNumber: z.string().optional(),
  passportNumber: z.string().optional()
});
// .superRefine((data, ctx) => {
//   if (data.nationality && !data.aadharNumber) {
//     ctx.addIssue({
//       path: ['aadharNumber'],
//       message: 'Aadhar Number is required for Indian users',
//       code: 'custom'
//     });
//   }
//   if (!data.nationality && !data.passportNumber) {
//     ctx.addIssue({
//       path: ['passportNumber'],
//       message: 'Passport Number is required for International users',
//       code: 'custom'
//     });
//   }
// });

export const hospitalUserSchema = commonSchema
  .extend({
    isIndian: z.boolean().optional(),
    aadharNumber: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || undefined),
    passportNumber: z
      .string()
      .optional()
      .nullable()
      .transform((val) => val || undefined)
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
  //   console.log('scheam data ', data);

  //   // If Indian, Aadhar is required
  //   if (data.isIndian) {
  //     if (!data.aadharNumber?.trim()) {
  //       ctx.addIssue({
  //         path: ['aadharNumber'],
  //         message: 'Aadhar Number is required for Indian nationality',
  //         code: z.ZodIssueCode.custom
  //       });
  //     }
  //     // Add Aadhar format validation (12 digits) if needed
  //   }
  //   // If not Indian, Passport is required
  //   if (!data.isIndian) {
  //     if (!data.passportNumber?.trim()) {
  //       ctx.addIssue({
  //         path: ['passportNumber'],
  //         message: 'Passport Number is required for International nationality',
  //         code: z.ZodIssueCode.custom
  //       });
  //     }
  //   }
  // });

// .superRefine((data, ctx) => {
//   if (data.nationality && !data.aadharNumber) {
//     ctx.addIssue({
//       path: ['aadharNumber'],
//       message: 'Aadhar Number is required for Indian users',
//       code: 'custom'
//     });
//   }
//   if (!data.nationality && !data.passportNumber) {
//     ctx.addIssue({
//       path: ['passportNumber'],
//       message: 'Passport Number is required for International users',
//       code: 'custom'
//     });
//   }
// });

export const getSchemabyUserType = (userType: string) => {
  switch (userType) {
    case 'Doctor':
      return doctorSchema;
    case 'SurgeonOrConsultant':
      return doctorSchema;
    case 'Case Co-ordinators':
      return coOrdinatorSchema;
    default:
      return hospitalUserSchema;
  }
};

export type HospitalUserType = z.infer<typeof hospitalUserSchema>;
export type DoctorType = z.infer<typeof doctorSchema>;
export type CoordinatorType = z.infer<typeof coOrdinatorSchema>;
