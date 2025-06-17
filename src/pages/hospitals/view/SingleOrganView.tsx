// import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { approvedOrgansSchema } from '../add/validators';
import { AtomDatePicker, Box, Button, FormFileInput, FormInput, Text } from '@/atoms';
import { useNavigate } from 'react-router';
import { useHospital } from '../hospitalContext';
import { toast } from '@/utils/toast';
import { organOptions, tissueOptions } from '../add/sections/ApprovedOrganDoc';
import { useHospitalId } from '@/hooks/useHospitalID';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { HospitalOrganDocumnets, HospitalsOrgansLicences } from '@/types/organLicense';
import PreviewFile from '@/pages/components/FilePreview';
export interface ImageOption {
  src: string;
  label: string;
  id: string;
}

const organsSchema = z.object({
  dmsLicenseDoc: z.any(),
  // organ_first_level: z
  //   .string()
  //   .min(1, 'Enter License Registration Date')
  //   .refine((date) => {
  //     const selectedDate = dayjs(date);
  //     return selectedDate.isBefore(dayjs().add(1, 'day'), 'day');
  //   }, 'Registration date must be today or a past date'),

  // license_expiry: z
  //   .string()
  //   .min(1, 'Enter License Expiry Date')
  //   .refine((date) => {
  //     const expiryDate = dayjs(date);
  //     return expiryDate.isAfter(dayjs(), 'day') && expiryDate.isBefore(dayjs().add(20, 'year'), 'day');
  //   }, 'Expiry date must be a valid future date'),
  // organ_first_level: z
  //   .string()
  //   .min(1, 'Enter License Registration Date')
  //   .refine((date) => {
  //     const selectedDate = dayjs(date);
  //     return selectedDate.isBefore(dayjs(), 'day');
  //   }, 'Registration date must be a past date'),
  // license_expiry: z
  //   .string()
  //   .min(1, 'Enter License Expiry Date')
  //   .refine((date) => {
  //     const expiryDate = dayjs(date);
  //     return expiryDate.isAfter(dayjs(), 'day') && expiryDate.isBefore(dayjs().add(10, 'year'), 'day');
  //   }, 'Expiry date must be a valid  date'),
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

  organ_reference_no: z.string().min(8, 'Enter a Valid Value').max(12, 'Enter a Valid Value'),
  receipt_number: z.any().optional()
});

const SingleOrganView: React.FC<{
  organData: HospitalsOrgansLicences;
  //for hospital organ data
  fromHospital?: HospitalOrganDocumnets;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  onNext: (data: any) => void;
  readOnly?: boolean;
  isView?: boolean;
  forNTORC?: boolean;
}> = ({ organData, fromHospital, onNext, readOnly = false, isView, forNTORC = false }) => {
  const [selectedOrganId, setSelectedOrganId] = useState<number | null | string>(null);
  const navigate = useNavigate();
  const [openPreview, setOpenPreview] = useState(false);
  const [filePreview, setFilePreview] = useState('');
  const [fileName, setFileName] = useState('');
  // console.log('organ data from single organ view', organData);
  const hospitalID = useHospitalId();
  const {
    state: { hospital },
    actions: { editOrganLicense }
  } = useHospital();
  // console.log('organ license data ', hospital?.organLicences);
  //form fields disable logics
  const organStatus = organData?.status === 'Expired';
  const {
    control,
    handleSubmit,
    // watch,
    reset,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    formState: { errors }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<any>({
    resolver: zodResolver(organsSchema),
    defaultValues: {
      dmsLicenseDoc: '',
      organ_first_level: '',
      license_expiry: '',
      organ_reference_no: '',
      receipt_number: ''
    }
  });
  // const watchDmsLicense = watch(organData?.dmsLicenseDoc);
  // const watchDmsLicesePath = watch(fromHospital?.dmsLicensePath ?? '');
  useEffect(() => {
    if (organData) {
      setSelectedOrganId(organData.organType?.id);
      // Set form values based on the provided organ data
      reset({
        dmsLicenseDoc: organData?.dmsLicenseDoc, // Replace with actual file if available
        organ_first_level: organData.firstLevelOrganLicenceRegDate,
        license_expiry: organData.licenceExpiryDate,
        organ_reference_no: organData.organLicenceNumber,
        receipt_number: organData.paymentReceiptNumber
      });
    }
    if (fromHospital) {
      setSelectedOrganId(fromHospital?.organs?.id);
      // Set form values based on the provided organ data
      reset({
        dmsLicenseDoc: fromHospital?.dmsLicensePath,
        organ_first_level: fromHospital?.firstLevelOrganLicenceRegDate,
        license_expiry: fromHospital?.licenseExpiryDate,
        organ_reference_no: fromHospital?.organLicenceNumber,
        receipt_number: fromHospital?.paymentReceiptNumber
      });
    }
  }, [organData, reset, fromHospital]);

  // const handleSelectOrgan = (id: string) => {
  //   if (readOnly) return;
  //   setSelectedOrganId(id);
  // };
  useEffect(() => {
    if (organData) {
      const { name } = organData?.organType || {};
      if (name) {
        setSelectedOrganId(name.toLowerCase().replace(/\s+/g, ''));
      }
    }
    if (fromHospital) {
      const { name } = fromHospital?.organs || {};
      if (name) {
        setSelectedOrganId(name.toLowerCase().replace(/\s+/g, ''));
      }
    }
  }, [organData, fromHospital]);
  const convertToISOFormat = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (!hospital?.organLicences) return;
    console.log('ddd', data);
    const organID = organData ? organData?.organType?.id : fromHospital?.organs?.id;
    const payload = {
      organId: organID,
      dmsLicenseDoc: data.dmsLicenseDoc,
      organLicenceNumber: data.organ_reference_no,
      firstLevelOrganLicenceRegDate: convertToISOFormat(data.organ_first_level),
      licenceExpiryDate: convertToISOFormat(data.license_expiry),
      paymentReceiptNumber: ''
    };
    await editOrganLicense(hospitalID, organID, payload, () => {
      toast('Organ License Details Updated', 'success');
      onNext(payload);
    });
    navigate(-1);
    // organ.organ?.id === organData.organs?.id;
    // Update only the selected organ while keeping the others unchanged

    // const formattedOrganData = hospital.organLicences
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   .map((organ: any) => {
    //     console.log('ddd', organ);
    //     console.log('ddd', organData);

    //     if (organ.organ?.id === (organData?.organType?.id || fromHospital?.organs?.id)) {
    //       return {
    //         organId: organ.organ?.id,
    //         dmsLicenseDoc: data?.dmsLicenseDoc,
    //         organLicenceNumber: data.organ_reference_no || organ.organLicenceNumber,
    //         firstLevelOrganLicenceRegDate:
    //           convertToISOFormat(data.organ_first_level) || organ.firstLevelOrganLicenceRegDate,
    //         licenceExpiryDate: convertToISOFormat(data.license_expiry) || organ.licenceExpiryDate,
    //         paymentReceiptNumber: data.receipt_number || organ.paymentReceiptNumber
    //       };
    //     }

    //     //  Always return the original organ object if it's not the edited one
    //     return {
    //       organId: organ.organ?.id,
    //       dmsLicenseDoc: organ?.dmsLicenseDoc || 'wrong',
    //       organLicenceNumber: organ.organLicenceNumber,
    //       firstLevelOrganLicenceRegDate: organ.firstLevelOrganLicenceRegDate,
    //       licenceExpiryDate: organ.licenceExpiryDate,
    //       paymentReceiptNumber: organ.paymentReceiptNumber
    //     };
    //   })
    //   .filter(Boolean); // Remove null values
    // console.log('ddd', JSON.stringify(formattedOrganData, null, 2));
    // return;
    // await updateOrganLicense(formattedOrganData, () => {
    //   toast('Organ License Details Updated', 'success');
    //   onNext(formattedOrganData);
    // });

    // onNext(formattedOrganData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <Box>
        <Box className="flex gap-4">
          <Text className="!text-xl !-ml-[18px] !font-bold text-[#804595]">Organ & Document</Text>
        </Box>

        {/* Organ Selection Box */}
        {!forNTORC && (
          <Box mt={4} className="">
            <Box display="flex" className="border-[2px] border-[#804595] rounded-[10px] relative mt-[28px] -mx-[18px]">
              <Text className="flex absolute -top-3 left-3 bg-white gap-2 px-2 !text-[16px] !font-[600]">
                Select Organ <Text color="red">*</Text>
              </Text>
              <Box className="approved-organ-box">
                {organOptions.map((organ) => (
                  <Box
                    key={organ.id}
                    p={2}
                    borderRadius="8px"
                    m={2}
                    className="h-[104px] w-[104px] md:w-[140px] "
                    sx={{
                      backgroundColor: selectedOrganId === organ.id ? '#c587dbcf' : '',
                      clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: selectedOrganId === organ.id ? '#D4C2DF' : ''
                      }
                    }}
                  >
                    {/* className={selectedOrganId !== organ.id ? 'grayscale' : ''} */}
                    <img src={organ.src} alt={organ.src} className="h-[24px] w-[24px] md:h-[33px] md:w-[33px] " />
                    <Text className={`text-center ${selectedOrganId === organ.id ? 'text-black' : 'text-gray-400'}`}>
                      {organ.label}
                    </Text>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Tissue Selection Box */}
        <Box mt={4} className="">
          <Box
            display="flex"
            flexWrap="wrap"
            className="border-[2px] border-[#804595] rounded-[10px] relative mt-[28px] -mx-[18px]"
          >
            <Text className="flex absolute -top-3 left-3 bg-white gap-2 px-2 !text-[16px] !font-[600]">
              Select Tissue <Text color="red">*</Text>
            </Text>
            {tissueOptions.map((tissue) => (
              <Box
                key={tissue.id}
                p={2}
                borderRadius="8px"
                m={2}
                className="h-[104px] w-[104px] md:w-[140px] "
                sx={{
                  backgroundColor: selectedOrganId === tissue.id ? '#c587dbcf' : '',
                  clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.3s ease, border-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: selectedOrganId === tissue.id ? '#D4C2DF' : ''
                  }
                }}
              >
                <img
                  // className={`h-[35px] ${selectedOrganId === tissue.id ? '!h-[30px]' : ''}`}
                  className="h-[24px] w-[24px] md:h-[33px] md:w-[33px] "
                  src={tissue.src}
                  alt={tissue.src}
                />
                <Text className={`text-center ${selectedOrganId === tissue.id ? 'text-black' : 'text-gray-400'}`}>
                  {tissue.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Organ Details Form */}
        <Box mt={4}>
          <Text className="hospital-form-sub-title">
            Organ: {organData ? organData.organType?.name : fromHospital?.organs?.name}
          </Text>
          <Box className="details-section">
            <Box className="">
              <FormFileInput
                control={control}
                name="dmsLicenseDoc"
                filePath={`hospital/${hospitalID}/organlicense`}
                fileData={organData ? organData.dmsLicenseDoc : fromHospital?.dmsLicensePath}
                label="DMS license"
                setOpenImgModal={setOpenPreview}
                setFile={setFilePreview}
                setPreviewName={() => {
                  setFileName(`${organData ? organData.organType?.name : fromHospital?.organs?.name} - DMS License`);
                }}
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <AtomDatePicker
                control={control}
                name="organ_first_level"
                label="Organ First Level Registration Date"
                maxDate={dayjs()}
                fullWidth
                required
                disabled={organStatus}
              />
            </Box>
            <Box className="">
              <AtomDatePicker
                control={control}
                name="license_expiry"
                label="License Expiry Date"
                minDate={dayjs()}
                fullWidth
                required
                disabled={readOnly}
              />
            </Box>
            <Box className="">
              <FormInput
                control={control}
                name="organ_reference_no"
                label="Organ License Number"
                fullWidth
                required
                disabled={organStatus}
              />
            </Box>
            {/* <Box className="">
              <FormInput
                control={control}
                name="receipt_number"
                label="Payment Receipt Number"
                fullWidth
                required
                disabled={true}
              />
            </Box> */}
          </Box>
        </Box>
        {!isView && (
          <Box className="flex gap-4 justify-end mb-[30px] md:mb-[60px] hospital-footer-section">
            <Button
              variant="outlined"
              className="!border-[#D876A9] !text-[#D876A9] buttons-width"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="!bg-[#D876A9] !text-[white] buttons-width"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
      <PreviewFile
        open={openPreview}
        onClose={() => {
          setOpenPreview(false);
        }}
        file={filePreview}
        fileLabel={fileName}
      />
    </form>
  );
};

export default SingleOrganView;
