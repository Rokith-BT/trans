import { z } from 'zod';

export const AddDonorSchema = z
  .object({
    name: z.string().min(1, 'Donor name is required'),
    dateOfBirth: z.string().refine(
      (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 > 0 && age - 1 <= 100;
        }
        return age >= 0 && age <= 200;
      },
      { message: 'Choose a valid date of birth' }
    ),
    age: z.string().optional().nullable(),
    genderId: z.number({ required_error: 'Gender is required', invalid_type_error: 'Choose a Gender' }),
    bloodGroupId: z
      .number({ required_error: 'Choose a Blood Group', invalid_type_error: 'Choose a Blood Group' })
      .nullable()
      .refine((val) => val !== null, { message: 'Choose a Blood Group' }),
    // height: z.number().min(1, 'Height is required').max(220, 'Height must be between 0 and 220'),
    height: z
      .string()
      .refine((val) => val.trim() !== '', {
        message: 'Height is required'
      })
      .refine((val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val), {
        message: 'Height must be a valid number with up to 2 decimal places'
      })
      .transform((val) => parseFloat(val))
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Height must be between 1 and 220'
      }),
    // weight: z.number().min(1, 'Weight is required').max(200, 'Weight must be between 0 and 200'),
    weight: z
      .string()
      .refine((val) => val.trim() !== '', {
        message: 'Weight is required'
      })
      .refine((val) => /^[0-9]+(\.[0-9]{1,2})?$/.test(val), {
        message: 'Weight must be a valid number with up to 2 decimal places'
      })
      .transform((val) => parseFloat(val))
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Weight must be between 1 and 220'
      }),
    bmi: z.number().optional(),
    isMlc: z.string().optional(),
    arcaseNumber: z.coerce.number().min(0).max(100000000, 'AR Case Number Required').optional().nullable(),
    relationshipId: z
      .number({
        required_error: 'Choose a Relation Type',
        invalid_type_error: 'Choose a Relation Type'
      })
      .nullable()
      .refine((val) => val !== null, { message: 'Choose a Relation Type' }),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().nonempty('Email is required').email('Invalid email format'),
    phoneNumber1: z.string().min(1, 'Phone number is required'),
    phoneNumber2: z.string().min(1, 'Alternative number is required').nullable(),
    // .refine(
    //   (data: any) => {
    //     // Only validate if both phone numbers are non-null and non-empty
    //     return !data.phoneNumber2 || data.phoneNumber1 !== data.phoneNumber2;
    //   },
    //   {
    //     message: 'Phone number and alternative number must not be the same',
    //     path: ['phoneNumber2'] // attach the error to phoneNumber2
    //   }
    // ),
    countryCode1: z.any(),
    countryCode2: z.any(),
    letter1: z.any(),
    letter2: z.any(),
    written: z.any(),
    audio: z.any(),
    video: z.any(),
    isWritten: z.boolean().optional().nullable(),
    isAudio: z.boolean().optional().nullable(),
    isVideo: z.boolean().optional().nullable(),
    consent: z
      .object({
        written: z.boolean(),
        audio: z.boolean(),
        video: z.boolean()
      })
      .refine((data) => data.written || data.audio || data.video, {
        message: 'At least one consent option must be selected',
        path: ['written'] // Show error near the first checkbox
      })
  })
  .superRefine((data, ctx) => {
    if (data.consent.written && !data.written) {
      ctx.addIssue({
        path: ['written'],
        message: 'Written consent detail is required',
        code: z.ZodIssueCode.custom
      });
    }

    if (data.consent.audio && !data.audio) {
      ctx.addIssue({
        path: ['audio'],
        message: 'Audio consent detail is required',
        code: z.ZodIssueCode.custom
      });
    }

    if (data.consent.video && !data.video) {
      ctx.addIssue({
        path: ['video'],
        message: 'Video consent detail is required',
        code: z.ZodIssueCode.custom
      });
    }

    if (data.isMlc === '1' && !data.arcaseNumber) {
      ctx.addIssue({
        path: ['arcaseNumber'],
        message: 'AR Case Number is required',
        code: 'custom'
      });
    }
    if (data.isMlc === '1' && typeof data.arcaseNumber !== 'number') {
      ctx.addIssue({
        path: ['arcaseNumber'],
        message: 'AR Case Number must be a number',
        code: 'custom'
      });
      return;
    }
    console.log(data.phoneNumber1, 'data.phoneNumber1', data.phoneNumber2);

    if (data.phoneNumber1 === data.phoneNumber2) {
      ctx.addIssue({
        path: ['phoneNumber2'],
        message: 'Phone number and alternative number must not be the same',
        code: 'custom'
      });
      return;
    }
  });
export type AddDonorType = z.infer<typeof AddDonorSchema>;

export const DonorApnoeaSchema = z
  .object({
    name: z.string().min(1, 'Donor name is required'),
    dateOfBirth: z.string().min(1, 'Date of Birth  is required'),
    age: z.number().optional().nullable(),
    genderId: z.number().min(1, 'Gender is required'),
    isMlc: z.string().optional(),
    arcaseNumber: z.any().optional().nullable(),
    causeOfBrainDeathId: z.number().min(1, 'Case of Brain Death required'),
    dateOfAccident: z.string().min(1, 'Date of Accident is required'),
    admissionDate: z.string().min(1, 'Date of Admission is required'),
    noOfDaysOnVentilator: z.string().min(1, 'Ventilator is requirede'),
    stateId: z.number().min(1, 'State is required'),
    firstApnoea: z.string().optional(),
    apnoeaDateandTime: z.string().optional().nullable()
  })
  .superRefine((data, ctx) => {
    const { dateOfAccident, admissionDate } = data;
    if (dateOfAccident && admissionDate) {
      const onset = new Date(dateOfAccident);
      const admission = new Date(admissionDate);
      if (admission <= onset) {
        ctx.addIssue({
          path: ['admissionDate'],
          code: z.ZodIssueCode.custom,
          message: 'Admission date must be after onset of Accident'
        });
      }
    }
    if (data.isMlc === '1' && !data.arcaseNumber) {
      ctx.addIssue({
        path: ['arcaseNumber'],
        message: 'AR Case Number is required',
        code: 'custom'
      });
    }
    // if (data.isMlc === '1' && typeof data.arcaseNumber !== 'number') {
    //   ctx.addIssue({
    //     path: ['arcaseNumber'],
    //     message: 'AR Case Number must be a number',
    //     code: 'custom'
    //   });
    //   return;
    // }
    if (data.firstApnoea === '1' && !data.apnoeaDateandTime) {
      ctx.addIssue({
        path: ['apnoeaDateandTime'],
        message: 'Apnoea Date and Time is required',
        code: 'custom'
      });
    }
  });

export type DonorApnoeaType = z.infer<typeof DonorApnoeaSchema>;

export const OrganConsentedSchema = z.object({
  organConsent: z
    .array(
      z.object({
        organId: z.number(),
        isConsentGiven: z.number().nullable().optional(),
        name: z.string().nullable().optional(),
        isTissue: z.boolean().nullable().optional()
      })
    )
    .refine((organs) => organs.some((o) => o.isConsentGiven === 1), {
      message: 'At least one organ must be consented',
      path: ['organConsent']
    }),

  apnoeaTest: z
    .array(
      z.object({
        id: z.number().nullable().optional(),
        donorId: z.number().nullable().optional(),
        datetime: z.string().min(1, 'Apnoea Date & Time is required'),
        preAbg: z.any(),
        postAbg: z.any()
      })
    )
    .min(2, 'At least two sets of Apnoea test data are required')
    .refine(
      (tests) => {
        // Loop through pairs: [0-1], [1-2], etc.
        for (let i = 1; i < tests.length; i++) {
          const prev = new Date(tests[i - 1].datetime);
          const current = new Date(tests[i].datetime);
          if (isNaN(prev.getTime()) || isNaN(current.getTime())) continue; // Ignore invalid dates — let .min(1) handle empty
          if (current <= prev) {
            return false; // Invalid: not strictly increasing
          }
        }
        return true;
      },
      {
        message: 'Each Apnoea Date & Time must be later than the previous one',
        path: ['apnoeaTest'] // Array-level error
      }
    )
});

export type OrganConsentedType = z.infer<typeof OrganConsentedSchema>;

export const MedicalDetailsSchema = z
  .object({
    pulseRate: z.coerce
      .number({
        invalid_type_error: 'Pulse rate must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Pulse rate must be between 1 and 220'
      }),

    bpSystolic: z.coerce
      .number({
        invalid_type_error: 'BP Systolic must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'BP Systolic must be between 1 and 220'
      }),

    bpDiastolic: z.coerce
      .number({
        invalid_type_error: 'BP Diastolic must be a number'
      })
      .refine((val) => val >= 1 && val <= 240, {
        message: 'BP Diastolic must be between 1 and 240'
      }),

    map: z.coerce
      .number({
        invalid_type_error: 'MAP must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'MAP must be between 1 and 220'
      }),

    urineOutput: z.coerce
      .number({
        invalid_type_error: 'Urine output must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Urine output must be between 1 and 220'
      }),

    cvp: z.coerce
      .number({
        invalid_type_error: 'CVP must be a number'
      })
      .refine((val) => val >= 1 && val <= 999, {
        message: 'CVP must be between 1 and 999'
      }),

    spo2: z.coerce
      .number({
        invalid_type_error: 'SPo2 must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'SPo2 must be between 1 and 220'
      }),

    temperature: z.coerce
      .number({
        invalid_type_error: 'Temperature must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Temperature must be between 1 and 220'
      }),

    noOfDaysInVentilator: z.coerce
      .number({
        invalid_type_error: 'Days in ventilator must be a number'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Days in ventilator must be between 1 and 220'
      }),
    causeOfBrainDeathId: z.number().min(1, 'Case of Brain Death required'),
    dateOfOnsetIllness: z.string().min(1, 'Onset of illness is required'),
    admissionDate: z.string().min(1, 'Date of Admission is required'),
    tentativeRetrievalDate: z.string().nullable().optional(),
    assessmentDate: z.string().nullable().optional(),
    isSmoking: z.string().optional(),
    isAlcoholic: z.string().optional(),
    isDiabetes: z.string().optional(),
    isHt: z.string().optional(),
    isCoronaryArterial: z.string().optional(),
    isRenal: z.string().optional(),
    isLiverDisease: z.string().optional(),
    isCovid: z.string().optional(),
    covidFreePeriodId: z.number().optional().nullable()
  })
  .superRefine((data, ctx) => {
    {
      const { dateOfOnsetIllness, admissionDate } = data;
      console.log(dateOfOnsetIllness, admissionDate, 'dateOfOnsetIllness, admissionDate');

      if (dateOfOnsetIllness && admissionDate) {
        const onset = new Date(dateOfOnsetIllness);
        const admission = new Date(admissionDate);
        if (admission <= onset) {
          ctx.addIssue({
            path: ['admissionDate'],
            code: z.ZodIssueCode.custom,
            message: 'Admission date must be after onset of illness'
          });
        }
      }
      if (data.isCovid === '1' && !data.covidFreePeriodId) {
        ctx.addIssue({
          path: ['covidFreePeriodId'],
          message: 'Coivd Free Period is required',
          code: 'custom'
        });
      }
    }
  });
export type MedicalDetailsType = z.infer<typeof MedicalDetailsSchema>;

export const InjuriesDetailsSchema = z
  .object({
    isChestInjury: z.string().min(1, 'Chest Injuries is required'),
    isAbdomenInjury: z.string().min(1, 'Abdomen Injuires is required'),
    notes: z.string().nullable().optional(),
    isCprGiven: z.string().min(1, 'CPR Given is required'),
    cprFileName: z.string().optional().nullable(),
    isHypotensiveEpisodes: z.string().min(1, 'Hypothnesive Episode is required'),
    isOnVentilation: z.string().min(1, 'OnVentilation is required'),
    vcv: z.coerce.number({
      invalid_type_error: 'VCV must be a number'
    }),
    pcv: z.coerce.number({
      invalid_type_error: 'PCV must be a number'
    }),
    fio2: z.coerce
      .number({
        invalid_type_error: 'FiO2 is required'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'FiO2 must be between 1 and 220'
      }),

    peep: z.coerce
      .number({
        invalid_type_error: 'PEEP is required'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'PEEP must be between 1 and 220'
      }),

    pip: z.coerce
      .number({
        invalid_type_error: 'PIP is required'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'PIP must be between 1 and 220'
      }),

    tv: z.coerce
      .number({
        invalid_type_error: 'TV is required'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'TV must be between 1 and 220'
      }),

    respiratoryRate: z.coerce
      .number({
        invalid_type_error: 'Respiratory Rate is required'
      })
      .refine((val) => val >= 1 && val <= 220, {
        message: 'Respiratory Rate must be between 1 and 220'
      }),
    pressureSupport: z.string().nullable().optional(),
    others: z.string().nullable().optional()
  })
  .superRefine((data, ctx) => {
    {
      if (data.isOnVentilation === '1' && !data.vcv) {
        ctx.addIssue({
          path: ['vcv'],
          message: 'Volume Controle Venttilation (VCV) is required',
          code: 'custom'
        });
      }
      if (data.isOnVentilation === '1' && !data.pcv) {
        ctx.addIssue({
          path: ['pcv'],
          message: 'Pressure Controle Venttilation (PCV) is required',
          code: 'custom'
        });
      }
      if (data.isCprGiven === '1' && !data.cprFileName) {
        ctx.addIssue({
          path: ['cprFileName'],
          message: 'CPR Given is required',
          code: 'custom'
        });
      }
    }
  });
export type InjuriesDetailsType = z.infer<typeof InjuriesDetailsSchema>;

export const ABGTestSchema = z.object({
  isSteroids: z.string().min(1, 'Steriods is required'),
  isVasopressin: z.string().min(1, 'Vasopressin is required'),
  isThyroxin: z.string().min(1, 'Thyroxine is required'),
  abgTestResult: z
    .array(
      z.object({
        testReport: z.string().min(1, 'Test report is required'),
        fio2: z.coerce.number({
          invalid_type_error: 'FiO2 must be a number'
        })
      })
    )
    .min(1, 'Abg Test Required'),
  inotropeData: z.array(
    z.object({
      inotrope: z.string().nullable().optional()
    })
  )
});
export type ABGTestDetailsType = z.infer<typeof ABGTestSchema>;

export const AttatchmentSchema = z.object({
  form8: z.string().nullable().optional(),
  form10: z.string().nullable().optional(),
  urineRoutine: z.string().nullable().optional(),
  urineCulture: z.string().nullable().optional(),
  completeHemogram: z.string().nullable().optional(),
  bloodMesures: z.string().nullable().optional(),
  serumElectrolytes: z.string().nullable().optional(),
  serology: z.string().nullable().optional(),
  liverFunctionTest: z.string().nullable().optional(),
  congalutionProfile: z.string().nullable().optional(),
  chestXRay: z.string().nullable().optional(),
  ecg: z.string().nullable().optional(),
  echo: z.string().nullable().optional(),
  ctChest: z.string().nullable().optional(),
  usgAbdomen: z.string().nullable().optional(),
  ripCR: z.string().nullable().optional(),
  anyOtherInvestigation1: z.string().nullable().optional(),
  anyOtherInvestigation2: z.string().nullable().optional(),
  anyOtherInvestigation3: z.string().nullable().optional(),
  anyOtherInvestigation4: z.string().nullable().optional()
});
export type AttachmentDetailsType = z.infer<typeof AttatchmentSchema>;
