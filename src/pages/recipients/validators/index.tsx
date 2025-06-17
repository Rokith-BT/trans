import { z } from 'zod';

export const AddRecipientSchema = z.object({
  nationality: z.string().nonempty('Nationality is required'),
  hospitalId: z.number().min(1, 'Hospital is required'),
  hospitalName: z.string().optional(),
  hospitalType: z.object({
    id: z.number(),
    name: z.string()
  })
});

const addressSchema = z.object({
  addressLine1: z.string().nonempty('Address Line 1 is required'),
  addressLine2: z.string().optional(),
  townOrVillage: z.string().nonempty('Town/Village is required'),
  landmark: z.string().optional().nullable(),
  pincode: z
    .string()
    .nonempty('Pin code is required')
    .regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  cityId: z.number({ required_error: 'City is required' }),
  stateId: z.number({ required_error: 'State is required' }),
  countryId: z.number({ required_error: 'Country is required' })
});
export type BasicDetailsType = z.infer<typeof basicDetailsSchema>;
export const basicDetailsSchema = z
  .object({
    isLoadingBasic: z.boolean().optional(),
    isIndian: z.boolean().optional(),
    recipientImage: z.any().optional(),
    basicLoading: z.boolean().optional(),
    aadharNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    isAadharNumberVerified: z.boolean().optional(),
    uuid: z.string().optional(),
    // .refine((val) => !val || /^[A-Z0-9]{6,9}$/.test(val), {
    //   message: 'Passport Number must be 6 to 9 alphanumeric characters',
    //   path: ['passportNumber']
    // }),
    passportDocument: z.any(),
    embassyDocument: z.any(),
    name: z.string().nonempty('Recipient Name is required'),
    gender: z.number({ required_error: 'Gender is required', invalid_type_error: 'Choose a Blood Group' }),
    dateOfBirth: z.string().nonempty('Date of Birth is required'),
    age: z.number(),
    fatherName: z.string().nonempty('Father/Spouse Name is required'),
    phoneNumber1: z.string().nonempty('Primary Phone Number is required'),
    countryCode1: z.any().optional(),
    countryCode2: z.any().optional(),
    phoneNumber2: z.string().nonempty('Alternative Phone Number is required'),
    email: z.string().nonempty('Email is required').email('Invalid email format'),
    bloodGroup: z.number({ required_error: 'Choose a Blood Group', invalid_type_error: 'Choose a Blood Group' }),
    cminsuranceId: z.number({ required_error: 'Choose a CM Insurance', invalid_type_error: 'Choose a CM Insurance' }),
    address: z.array(addressSchema).min(1, 'At least one address is required'),
    cminsuranceDoc: z.any()
  })
  .superRefine((data, ctx) => {
    console.log(data, 'data.isIndiandata.isIndiandata.isIndian');
    if (data.isIndian) {
      if (!data.aadharNumber || data.aadharNumber.trim() === '') {
        ctx.addIssue({
          path: ['aadharNumber'],
          message: 'Aadhar Number is required',
          code: 'custom'
        });
      } else if (!/^\d+$/.test(data.aadharNumber)) {
        ctx.addIssue({
          path: ['aadharNumber'],
          message: 'Aadhar Number must contain only numbers',
          code: 'custom'
        });
      } else if (!/^\d{12}$/.test(data.aadharNumber)) {
        ctx.addIssue({
          path: ['aadharNumber'],
          message: 'Aadhar Number must be exactly 12 digits',
          code: 'custom'
        });
      }
    } else {
      if (!data.passportNumber || data.passportNumber.trim() === '') {
        ctx.addIssue({
          path: ['passportNumber'],
          message: 'Passport Number is required',
          code: 'custom'
        });
      } else if (!/^[A-Z0-9]{8}$/.test(data.passportNumber)) {
        ctx.addIssue({
          path: ['passportNumber'],
          message: 'Passport Number must be 8 alphanumeric characters',
          code: 'custom'
        });
      }

      if (!data.passportDocument || (Array.isArray(data.passportDocument) && data.passportDocument.length === 0)) {
        ctx.addIssue({
          path: ['passportDocument'],
          message: 'Passport Document is required',
          code: 'custom'
        });
      }

      if (!data.embassyDocument || (Array.isArray(data.embassyDocument) && data.embassyDocument.length === 0)) {
        ctx.addIssue({
          path: ['embassyDocument'],
          message: 'Embassy Document is required',
          code: 'custom'
        });
      }
    }

    if (
      data.cminsuranceId === 1 &&
      (!data.cminsuranceDoc || (Array.isArray(data.cminsuranceDoc) && data.cminsuranceDoc.length === 0))
    ) {
      ctx.addIssue({
        path: ['cminsuranceDoc'],
        message: 'CM Insurance Document is required',
        code: 'custom'
      });
    }
  });

//FamilyCOntact
const familiesSchema = z.object({
  relationTypeId: z.number({ required_error: 'Choose a Relation Type', invalid_type_error: 'Choose a Relation Type' }),
  name: z.string().nonempty('Name is required'),
  genderId: z.number({ required_error: 'Gender is required' }),
  dateOfBirth: z.string().nullable().optional(),
  mobileNumber: z.string().nonempty('Phone is required'),
  countryCode1: z.any().optional()
});
export type FamilyContactType = z.infer<typeof familyContactSchema>;
export const familyContactSchema = z.object({
  isLoadingBasic: z.boolean().optional(),
  familyContacts: z.array(familiesSchema).min(1, 'At least one family Contact is required')
});

//MedicalDetails
export type MedicalDetailsType = z.infer<typeof medicalDetailsSchema>;
const vaccinationSchema = z
  .object({
    vaccinationId: z.number().nullable().optional(),
    vaccinationDate: z.string().nullable().optional()
  })
  .superRefine((data, ctx) => {
    if (data.vaccinationId != null && (!data.vaccinationDate || data.vaccinationDate.trim() === '')) {
      ctx.addIssue({
        path: ['vaccinationDate'],
        message: 'Vaccination date is required when vaccination name is present',
        code: 'custom'
      });
    }
  });
export const medicalDetailsSchema = z
  .object({
    height: z.coerce
      .number({
        invalid_type_error: 'Height is required'
      })
      .refine((val) => val >= 1 && val <= 999, {
        message: 'Height must be between 1 and 999'
      }),

    weight: z.coerce
      .number({
        invalid_type_error: 'Weight is required'
      })
      .refine((val) => val >= 1 && val <= 999, {
        message: 'Weight must be between 1 and 999'
      }),
    bmi: z.number().optional(),
    isSmoker: z.string(),
    isAlcohol: z.string().optional(),
    periodOfAssistanceId: z.number().nullable().optional(),
    isDrugs: z.string().optional(),
    isHypertesnsion: z.string().optional(),
    isDiabetes: z.string().optional(),
    isCad: z.string().optional(),
    isOtherLungDisease: z.string().optional(),
    isEpilepsy: z.string().optional(),
    hepatitisB: z.string().nonempty('Hepatitis B is required'),
    hepatitisC: z.string().nonempty('Hepatitis C is required'),
    historyOfTb: z.string().optional(),
    historyOfPeripheralvascularDisease: z.string().optional(),
    historyOfPreviousTransplant: z.string().optional(),
    organTransplanted: z.string().optional(),
    historyOfCovid: z.string().optional(),
    covidFreePeriodId: z.number().nullable().optional(),
    historyOfMalignancy: z.string().optional(),
    typeofMalignancy: z.string().nullable().optional(),
    durationofremissionId: z.number().nullable().optional(),
    hbsAg: z.string().nonempty('HbsAg Transplanted is required'),
    antiHbsAg: z.string().nullable().optional(),
    hcv: z.string().nullable().optional(),
    epsteinBarr: z.string().nullable().optional(),
    hiv: z.string().nonempty('HIV is required'),
    cmv: z.string().nullable().optional(),
    vaccinationStatus: z.array(vaccinationSchema)
  })
  .superRefine((data, ctx) => {
    if (data.isAlcohol === '1' && !data.periodOfAssistanceId) {
      ctx.addIssue({
        path: ['periodOfAssistanceId'],
        message: 'Period of Assistance is required when alcohol is yes',
        code: 'custom'
      });
    }

    if (data.historyOfPreviousTransplant === '1' && (!data.organTransplanted || data.organTransplanted.trim() === '')) {
      ctx.addIssue({
        path: ['organTransplanted'],
        message: 'Organ Transplanted is required',
        code: 'custom'
      });
    }

    if (data.historyOfCovid === '1' && !data.covidFreePeriodId) {
      ctx.addIssue({
        path: ['covidFreePeriodId'],
        message: 'Covid Free Period is required',
        code: 'custom'
      });
    }

    if (data.historyOfMalignancy === '1' && !data.typeofMalignancy) {
      if (!data.typeofMalignancy || data.typeofMalignancy.trim() === '') {
        ctx.addIssue({
          path: ['typeofMalignancy'],
          message: 'Type of Malignancy is required',
          code: 'custom'
        });
      }
    }
    if (data.historyOfMalignancy === '1' && !data.durationofremissionId) {
      ctx.addIssue({
        path: ['durationofremissionId'],
        message: 'Duration of remission is required',
        code: 'custom'
      });
    }
  });

const organReqSchema = z.object({
  organId: z.string().nonempty('Organ is required'),
  consultantId: z.string().nonempty('Consultant Name is required')
});

export type OrganRequestType = z.infer<typeof organRequestSchema>;
export const organRequestSchema = z
  .object({
    isLoadingBasic: z.boolean().optional(),
    organReq: z.array(organReqSchema).min(1, 'At least one organ request is required'),
    cardiacIndex: z.string().nullable().optional(),
    heartID: z.any(),
    kidneyID: z.any(),
    liverID: z.any(),
    pancreasID: z.any(),
    lungsID: z.any(),
    tpgTransPulmonaryGradient: z.string().nullable().optional(),
    pvri: z.coerce.number().min(0).max(999, 'PVRI must be between 0 and 999').optional().nullable(),
    sixMinuteWalkTest: z.string().nullable().optional(),
    sixMinuteWalkTestDistance: z.number().optional().nullable(),
    NtProBnp: z.coerce.number().min(0).max(999, 'NT Pro BNP must be between 0 and 999').optional().nullable(),
    historyOfPreviousNonTransplantHeartAndLungSurgery: z.string().nullable().optional(),
    surgeryDetails: z.string().nullable().optional(),
    ureaKidny: z.coerce
      .number()
      .max(999, 'Urea must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Urea must be a valid number with up to 2 decimal places'
        }
      ),
    creatineKidny: z.coerce
      .number()
      .max(999, 'Creatine must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Creatine must be a valid number with up to 2 decimal places'
        }
      ),

    serumSodiumKidny: z.coerce
      .number()
      .max(999, 'Serum Sodium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Sodium must be a valid number with up to 2 decimal places'
        }
      ),
    serumPotassiumKidny: z.coerce
      .number()
      .max(999, 'Serum Potassium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Potassium must be a valid number with up to 2 decimal places'
        }
      ),
    serumChlorideKidny: z.coerce
      .number()
      .max(999, 'Serum Chloride must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Chloride must be a valid number with up to 2 decimal places'
        }
      ),
    serumBicarbonateKidny: z.coerce
      .number()
      .max(999, 'Serum Bicarbonate must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Bicarbonate must be a valid number with up to 2 decimal places'
        }
      ),
    firstDialysisDateKidny: z.string().nullable().optional(),
    periodUndergoingDialysisKidny: z.coerce
      .number()
      .max(999, 'Period Undergoing Dialysis must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Period Undergoing Dialysis must be a valid number with up to 2 decimal places'
        }
      ),
    isAlf: z.boolean().nullable().optional(),
    alfListingType: z.string().nullable().optional(),
    alfEvaluationSheet: z.any(),
    additionalHepatologyNotes: z.any(),
    consultantShortSummary: z.any(),
    historyOfComplications: z.string().nullable().optional(),
    complicationDescription: z.string().nullable().optional(),
    cancerScreening: z.string().nullable().optional(),
    meldScore: z.coerce
      .number()
      .max(999, 'Meld Score must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Meld Score must be a valid number with up to 2 decimal places'
        }
      ),
    bilirubin: z.coerce
      .number()
      .max(999, 'Bilirubin must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Bilirubin must be a valid number with up to 2 decimal places'
        }
      ),
    albumin: z.coerce
      .number()
      .max(999, 'Albumin must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Albumin must be a valid number with up to 2 decimal places'
        }
      ),
    globulin: z.coerce
      .number()
      .max(999, 'Globulin must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Globulin must be a valid number with up to 2 decimal places'
        }
      ),
    ggt: z.coerce
      .number()
      .max(999, 'GGT must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'GGT must be a valid number with up to 2 decimal places'
        }
      ),
    ast: z.coerce
      .number()
      .max(999, 'AST must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'AST must be a valid number with up to 2 decimal places'
        }
      ),
    alt: z.coerce
      .number()
      .max(999, 'ALT must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'ALT must be a valid number with up to 2 decimal places'
        }
      ),
    coronaryAngiogram: z.any(),
    stressTest: z.any(),
    roomAirAbg: z.any(),
    pft: z.any(),
    serumMagnesiumLiver: z.coerce
      .number()
      .max(999, 'Serum Magnesium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Magnesium must be a valid number with up to 2 decimal places'
        }
      ),
    serumPhosphateLiver: z.coerce
      .number()
      .max(999, 'Serum Phosphate must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Phosphate must be a valid number with up to 2 decimal places'
        }
      ),
    aptt: z.coerce
      .number()
      .max(999, 'APTT must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'APTT must be a valid number with up to 2 decimal places'
        }
      ),
    platelets: z.coerce
      .number()
      .max(999, 'Platelets must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Platelets must be a valid number with up to 2 decimal places'
        }
      ),
    fibrinogen: z.coerce
      .number()
      .max(999, 'Fibrinogen must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Fibrinogen must be a valid number with up to 2 decimal places'
        }
      ),
    complicationDescriptionPancreas: z.string().nullable().optional(),
    cancerScreeningPancreas: z.string().nullable().optional(),
    albuminPancreas: z.coerce
      .number()
      .max(999, 'Albumin must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Albumin must be a valid number with up to 2 decimal places'
        }
      ),
    coronaryAngiogramPancreas: z.string().nullable().optional(),
    stressTestPancreas: z.string().nullable().optional(),
    roomAirAbgPancreas: z.string().nullable().optional(),
    pftPancreas: z.string().nullable().optional(),
    serumMagnesiumPancreas: z.coerce
      .number()
      .max(999, 'Serum Magnesium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Magnesium must be a valid number with up to 2 decimal places'
        }
      ),
    serumPhosphatePancreas: z.coerce
      .number()
      .max(999, 'Serum Phosphate must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Phosphate must be a valid number with up to 2 decimal places'
        }
      ),
    apttPancreas: z.coerce
      .number()
      .max(999, 'APTT must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'APTT must be a valid number with up to 2 decimal places'
        }
      ),
    plateletsPancreas: z.coerce
      .number()
      .max(999, 'Platelets must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Platelets must be a valid number with up to 2 decimal places'
        }
      ),
    fibrinogenPancreas: z.coerce
      .number()
      .max(999, 'Fibrinogen must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Fibrinogen must be a valid number with up to 2 decimal places'
        }
      ),
    historyOfPreviousNonTransplantHeartAndLungSurgeryLungs: z.string().nullable().optional(),
    surgeryDetailsLungs: z.string().nullable().optional(),
    roomAir: z.string().nullable().optional(),
    roomAirFile: z.string().nullable().optional(),
    onOxygen: z.string().nullable().optional(),
    onOxygenFile: z.string().nullable().optional(),
    ureaLiver: z.coerce
      .number()
      .max(999, 'Urea must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Urea must be a valid number with up to 2 decimal places'
        }
      ),
    creatineLiver: z.coerce
      .number()
      .max(999, 'Creatine must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Creatine must be a valid number with up to 2 decimal places'
        }
      ),
    uricAcidLiver: z.coerce
      .number()
      .max(999, 'Uric Acid must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Uric Acid must be a valid number with up to 2 decimal places'
        }
      ),
    serumSodiumLiver: z.coerce
      .number()
      .max(999, 'Serum Sodium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Sodium must be a valid number with up to 2 decimal places'
        }
      ),
    serumPotassiumLiver: z.coerce
      .number()
      .max(999, 'Serum Potassium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Potassium must be a valid number with up to 2 decimal places'
        }
      ),
    serumChlorideLiver: z.coerce
      .number()
      .max(999, 'Serum Chloride must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Chloride must be a valid number with up to 2 decimal places'
        }
      ),
    serumBicarbonateLiver: z.coerce
      .number()
      .max(999, 'Serum Bicarbonate must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Bicarbonate must be a valid number with up to 2 decimal places'
        }
      ),
    inr: z.coerce.number().nullable().optional(),
    historyOfComplicationsPancreas: z.string().nullable().optional(),
    meldScorePancreas: z.coerce
      .number()
      .max(999, 'MELD Score must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'MELD Score must be a valid number with up to 2 decimal places'
        }
      ),
    bilirubinPancreas: z.coerce
      .number()
      .max(999, 'Bilirubin must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Bilirubin must be a valid number with up to 2 decimal places'
        }
      ),
    globulinPancreas: z.coerce
      .number()
      .max(999, 'Globulin must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Globulin must be a valid number with up to 2 decimal places'
        }
      ),
    ggtPancreas: z.coerce
      .number()
      .max(999, 'GGT must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'GGT must be a valid number with up to 2 decimal places'
        }
      ),
    astPancreas: z.coerce
      .number()
      .max(999, 'AST must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'AST must be a valid number with up to 2 decimal places'
        }
      ),
    altPancreas: z.coerce
      .number()
      .max(999, 'ALT must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'ALT must be a valid number with up to 2 decimal places'
        }
      ),
    ureaPancreas: z.coerce
      .number()
      .max(999, 'Urea must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Urea must be a valid number with up to 2 decimal places'
        }
      ),
    creatinePancreas: z.coerce
      .number()
      .max(999, 'Creatine must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Creatine must be a valid number with up to 2 decimal places'
        }
      ),
    uricAcidPancreas: z.coerce
      .number()
      .max(999, 'Uric Acid must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Uric Acid must be a valid number with up to 2 decimal places'
        }
      ),
    serumSodiumPancreas: z.coerce
      .number()
      .max(999, 'Serum Sodium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Sodium must be a valid number with up to 2 decimal places'
        }
      ),
    serumPotassiumPancreas: z.coerce
      .number()
      .max(999, 'Serum Potassium must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Potassium must be a valid number with up to 2 decimal places'
        }
      ),
    serumChloridePancreas: z.coerce
      .number()
      .max(999, 'Serum Chloride must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Chloride must be a valid number with up to 2 decimal places'
        }
      ),
    serumBicarbonatePancreas: z.coerce
      .number()
      .max(999, 'Serum Bicarbonate must be between 0 and 999')
      .nullable()
      .optional()
      .refine(
        (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value?.toString()), // Validates decimal up to two digits
        {
          message: 'Serum Bicarbonate must be a valid number with up to 2 decimal places'
        }
      ),
    inrPancreas: z.coerce.number().nullable().optional(),

    causeOfLungDisease: z.string().nullable().optional(),
    sixMinuteWalkTestLungs: z.string().nullable().optional(),
    sixMinuteWalkTestDistanceLungs: z.number().nullable().optional(),
    forcedExpiratoryVolumeIn1Second: z.any(),
    forcedVitalCapacity: z.any(),
    maximalVoluntaryVentilation: z.any(),
    dlco: z.any(),
    selfOnRoomAir: z.string().nullable().optional(),
    supplement02: z.string().nullable().optional(),
    nonInvasiveVentilation: z.string().nullable().optional(),
    mechanicalVentilation: z.string().nullable().optional(),
    ecmo: z.string().nullable().optional()
  })
  .superRefine((data, ctx) => {
    if (data.organReq.some((req) => req.organId === '11')) {
      if (!data.cardiacIndex) {
        ctx.addIssue({
          path: ['cardiacIndex'],
          message: 'Cardiac Index is required',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.sixMinuteWalkTest) {
        ctx.addIssue({
          path: ['sixMinuteWalkTest'],
          message: '6 Minute Walk Test is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (data.sixMinuteWalkTest === '1' && !data.sixMinuteWalkTestDistance) {
        ctx.addIssue({
          path: ['sixMinuteWalkTestDistance'],
          message: '6 Minute Walk Test Distance is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (data.historyOfPreviousNonTransplantHeartAndLungSurgery === '1' && !data.surgeryDetails) {
        ctx.addIssue({
          path: ['surgeryDetails'],
          message: 'Surgery Details is required',
          code: z.ZodIssueCode.custom
        });
      }
    }
    if (data.organReq.some((req) => req.organId === '1')) {
      if (!data.ureaKidny) {
        ctx.addIssue({
          path: ['ureaKidny'],
          message: 'Urea is required',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.creatineKidny) {
        ctx.addIssue({
          path: ['creatineKidny'],
          message: 'Creatine is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumSodiumKidny) {
        ctx.addIssue({
          path: ['serumSodiumKidny'],
          message: 'Serum Sodium is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumPotassiumKidny) {
        ctx.addIssue({
          path: ['serumPotassiumKidny'],
          message: 'Serum Potassium is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumChlorideKidny) {
        ctx.addIssue({
          path: ['serumChlorideKidny'],
          message: 'Serum Chloride is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumBicarbonateKidny) {
        ctx.addIssue({
          path: ['serumBicarbonateKidny'],
          message: 'Serum Bicarbonate is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.firstDialysisDateKidny) {
        ctx.addIssue({
          path: ['firstDialysisDateKidny'],
          message: 'First Dialysis Date is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.periodUndergoingDialysisKidny) {
        ctx.addIssue({
          path: ['periodUndergoingDialysisKidny'],
          message: 'Period Undergoing Dialysis is required.',
          code: z.ZodIssueCode.custom
        });
      }
    }
    if (data.organReq.some((req) => req.organId === '4')) {
      if (data.isAlf) {
        if (!data.alfListingType) {
          ctx.addIssue({
            path: ['alfListingType'],
            message: 'ALF Listing Type is required.',
            code: z.ZodIssueCode.custom
          });
        }
        if (!data.alfEvaluationSheet) {
          ctx.addIssue({
            path: ['alfEvaluationSheet'],
            message: 'ALF Evaluation Sheet is required.',
            code: z.ZodIssueCode.custom
          });
        }
        if (!data.additionalHepatologyNotes) {
          ctx.addIssue({
            path: ['additionalHepatologyNotes'],
            message: 'Additional Hepatology Notes is required.',
            code: z.ZodIssueCode.custom
          });
        }
        if (!data.consultantShortSummary) {
          ctx.addIssue({
            path: ['consultantShortSummary'],
            message: 'Consultant Short Summary is required.',
            code: z.ZodIssueCode.custom
          });
        }
      }
      if (!data.historyOfComplications) {
        ctx.addIssue({
          path: ['historyOfComplications'],
          message: 'History Of Complications is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.meldScore) {
        ctx.addIssue({
          path: ['meldScore'],
          message: 'MELD Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.bilirubin) {
        ctx.addIssue({
          path: ['bilirubin'],
          message: 'Bilirubin Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.globulin) {
        ctx.addIssue({
          path: ['globulin'],
          message: 'Globulin Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.ggt) {
        ctx.addIssue({
          path: ['ggt'],
          message: 'GGT Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.ast) {
        ctx.addIssue({
          path: ['ast'],
          message: 'AST Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.alt) {
        ctx.addIssue({
          path: ['alt'],
          message: 'ALT Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.ureaLiver) {
        ctx.addIssue({
          path: ['ureaLiver'],
          message: 'Urea is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.creatineLiver) {
        ctx.addIssue({
          path: ['creatineLiver'],
          message: 'Creatine is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumSodiumLiver) {
        ctx.addIssue({
          path: ['serumSodiumLiver'],
          message: 'Serum Sodium is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.uricAcidLiver) {
        ctx.addIssue({
          path: ['uricAcidLiver'],
          message: 'Uric Acid is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumPotassiumLiver) {
        ctx.addIssue({
          path: ['serumPotassiumLiver'],
          message: 'Serum Potassium Liver is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumChlorideLiver) {
        ctx.addIssue({
          path: ['serumChlorideLiver'],
          message: 'Serum Chloride Liver is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumBicarbonateLiver) {
        ctx.addIssue({
          path: ['serumBicarbonateLiver'],
          message: 'Serum Bicarbonate Liver is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.inr) {
        ctx.addIssue({
          path: ['inr'],
          message: 'INR is required.',
          code: z.ZodIssueCode.custom
        });
      }
    }
    if (data.organReq.some((req) => req.organId === '10')) {
      if (!data.historyOfComplicationsPancreas) {
        ctx.addIssue({
          path: ['historyOfComplicationsPancreas'],
          message: 'History Of Complications is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.meldScorePancreas) {
        ctx.addIssue({
          path: ['meldScorePancreas'],
          message: 'MELD Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.bilirubinPancreas) {
        ctx.addIssue({
          path: ['bilirubinPancreas'],
          message: 'Bilirubin Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.globulinPancreas) {
        ctx.addIssue({
          path: ['globulinPancreas'],
          message: 'Globulin Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.ggtPancreas) {
        ctx.addIssue({
          path: ['ggtPancreas'],
          message: 'GGT Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.astPancreas) {
        ctx.addIssue({
          path: ['astPancreas'],
          message: 'AST Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.altPancreas) {
        ctx.addIssue({
          path: ['altPancreas'],
          message: 'ALT Score is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.ureaPancreas) {
        ctx.addIssue({
          path: ['ureaPancreas'],
          message: 'Urea is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.creatinePancreas) {
        ctx.addIssue({
          path: ['creatinePancreas'],
          message: 'Creatine is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumSodiumPancreas) {
        ctx.addIssue({
          path: ['serumSodiumPancreas'],
          message: 'Serum Sodium is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumPotassiumPancreas) {
        ctx.addIssue({
          path: ['serumPotassiumPancreas'],
          message: 'Serum Potassium Pancreas is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumChloridePancreas) {
        ctx.addIssue({
          path: ['serumChloridePancreas'],
          message: 'Serum Chloride Pancreas is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.serumBicarbonatePancreas) {
        ctx.addIssue({
          path: ['serumBicarbonatePancreas'],
          message: 'Serum Bicarbonate Pancreas is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.inrPancreas) {
        ctx.addIssue({
          path: ['inrPancreas'],
          message: 'INR is required.',
          code: z.ZodIssueCode.custom
        });
      }
    }
    if (data.organReq.some((req) => req.organId === '12')) {
      if (!data.causeOfLungDisease) {
        ctx.addIssue({
          path: ['causeOfLungDisease'],
          message: 'Cause Of Lung Disease is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.sixMinuteWalkTestLungs) {
        ctx.addIssue({
          path: ['sixMinuteWalkTestLungs'],
          message: '6 Minute Walk Test is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (data.sixMinuteWalkTestLungs === '1' && !data.sixMinuteWalkTestDistanceLungs) {
        ctx.addIssue({
          path: ['sixMinuteWalkTestDistanceLungs'],
          message: '6 Minute Walk Test Distance is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.forcedExpiratoryVolumeIn1Second) {
        ctx.addIssue({
          path: ['forcedExpiratoryVolumeIn1Second'],
          message: '6 Minute Walk Test Distance is required.',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.forcedVitalCapacity) {
        ctx.addIssue({
          path: ['forcedVitalCapacity'],
          message: 'Forced Expiratory Volume in 1 second (FEV1) is Required',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.maximalVoluntaryVentilation) {
        ctx.addIssue({
          path: ['maximalVoluntaryVentilation'],
          message: 'Maximal Voluntary Ventilation (MVV) is Required',
          code: z.ZodIssueCode.custom
        });
      }
      if (!data.dlco) {
        ctx.addIssue({
          path: ['dlco'],
          message: 'DLCO is Required',
          code: z.ZodIssueCode.custom
        });
      }
    }
  });

export type AttchmentType = z.infer<typeof attchmentSchema>;
export const attchmentSchema = z.object({
  isLoadingBasic: z.boolean().optional(),
  clinicalEstablishmentCertificate: z
    .any()
    .refine((file) => file !== undefined, 'Clinical Act Establishment certificate is Required'),
  uploadDoctorDeclaration: z.any().refine((file) => file !== undefined, 'Upload Doctor Declaration is Required'),
  aadhar: z.any().refine((file) => file !== undefined, 'Aadhar is Required'),
  urineCulture: z.any(),
  completeHemogram: z.any(),
  bloodSugarHba1c: z.any(),
  serumElectrolytes: z.any(),
  echo: z.any(),
  liverFunctionTests: z.any(),
  rtpcr: z.any(),
  chestXRay: z.any(),
  ecg: z.any(),
  CtChest: z.any(),
  UsgAbdomen: z.any(),
  kubImaging: z.any(),
  anyOtherInvestigation1: z.any(),
  anyOtherInvestigation2: z.any(),
  anyOtherInvestigation3: z.any(),
  anyOtherInvestigation4: z.any()
});
