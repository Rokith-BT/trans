// import { allowedFileTypes } from '@/pages/hospitals/add/validators';
import { z } from 'zod';

export const recipientFilterSchema = z.object({
  hospitalName: z.string().min(1, 'Hospital name is required'),
  gender: z.number().min(1, 'Gender is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  organRequested: z.string().min(1, 'Organ requested is required'),
  patientStatus: z.string().min(1, 'Patient status is required'),
  age: z.string().min(1, 'Age is required'),
  Zone: z.string().min(1, 'Zone is required'),
  cmInsurance: z.string().min(1, 'CMInsurance is required'),
  paymentStatus: z.string().min(1, 'Payment status is required')
});

export type RecipientFilterType = z.infer<typeof recipientFilterSchema>;
// const fileValidation = z.any().refine((files) => files instanceof FileList && files.length === 1, {
//   message: 'File is required and only one file should be uploaded.'
// });

export const recipientTransferBasicSchema = z.object({
  transtanID: z.string().min(1, 'TRANSTAN ID is required'),
  recipientName: z.string().min(1, 'Enter Recipient Name is required'),
  genderId: z.number(),
  bloodGroupId: z.number(),
  dateofBirth: z.string().min(1, 'DOB is required'),
  age: z.string().min(1, 'Age is required'),
  currentHospitalName: z.string().min(1, 'Current Hospital Name is required'),
  transferringHospitalName: z.number({ invalid_type_error: 'Transferring Hospital Name is required' }),
  organMappings: z.array(
    z
      .object({
        organId: z.object({ id: z.number(), name: z.string() }),
        currentConsultantId: z.number().optional(),
        transferringConsultantId: z.number().min(1, 'Transferring Consultant is required')
      })
      .optional() // for demo
  ),
  patientDeclarationDoc: z.string({ invalid_type_error: '' }).min(1, 'Patient Declaration Document is required'),
  doctorDeclarationDoc: z.string({ invalid_type_error: '' }).min(1, 'Doctor Declaration Document is required')
  // patientDeclarationDoc: z
  //   .instanceof(File)
  //   .refine((file) => allowedFileTypes.includes(file.type), {
  //     message: 'Unsupported file type. Please upload a PDF, JPG, or PNG file.'
  //   })
  //   .refine((file) => file.size <= 10 * 1024 * 1024, {
  //     message: 'File size should be less than 10MB'
  //   }),
  // doctorDeclarationDoc: z
  //   .instanceof(File)
  //   .refine((file) => allowedFileTypes.includes(file.type), {
  //     message: 'Unsupported file type. Please upload a PDF, JPG, or PNG file.'
  //   })
  //   .refine((file) => file.size <= 10 * 1024 * 1024, {
  //     message: 'File size should be less than 10MB'
  //   })
});
export type RecipientTransferBasicType = z.infer<typeof recipientTransferBasicSchema>;

export const recipientTransferSchema = z.object({
  registerPhone: z.string().optional(),
  isTranstan: z.boolean().optional(),
  transtanId: z.string().optional(),
  enterOTP: z.string().min(1, 'Enter OTP')
});
