import { AtomDatePicker, Box, FormFileInput, FormInput, Text } from '@/atoms';
import AtomRadio from '@/atoms/radio/Radio';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HospitalInfraStructure, hospitalInfraStructureSchema } from '../validators';
import FooterButton from './FooterButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomFormChip } from '@/pages/components/CustomChip';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Department } from '@/types/common.type';
import { useHospital } from '../../hospitalContext';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { useHospitalId } from '@/hooks/useHospitalID';
import PreviewFile from '@/pages/components/FilePreview';
import { toast } from '@/utils/toast';

export interface HospitalInfrasProps {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  onBack?: () => void;
  reCheck?: boolean;
  infraData?: HospitalInfraStructure;
  choosenData?: string[];
  readOnly: boolean;
  isEdit?: boolean;
}

export type CombinedData = {
  choosenOptions: string[];
} & HospitalInfraStructure;

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const HospitalInfras: React.FC<HospitalInfrasProps> = ({
  onNext,
  onBack,
  reCheck = true,
  infraData,
  readOnly = false,
  isEdit = false
}) => {
  // const [hospitalInfra, setHospitalInfra] = useState<HospitalInfraStructure>();
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [isNabh, setIsNabh] = useState(false);
  const [isClinical, setIsClinical] = useState(false);
  const [isTraumaUnitAvailable, setIsTraumaUnitAvailable] = useState(false);
  const [isMedicalCollegeAttached, setIsMedicalCollegeAttached] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [filePreview, setFilePreview] = useState('');
  const [fileName, setFileName] = useState('');
  const hospitalID = useHospitalId();
  const filePath = `hospital/${hospitalID}/organlicense`;

  const {
    state: { departments }
  } = useMasterData();
  const departmentOptions = departments ? departments.map((d: Department) => d.name) : [];
  console.log('dep', departmentOptions);

  const {
    actions: { updateInfraStructure }
  } = useHospital();
  const navigate = useNavigate();
  useEffect(() => {
    if (infraData?.departments) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingDepartments = infraData.departments.map((dept: any) => dept.name);
      setSelectOptions(existingDepartments);
    }
  }, [infraData?.departments]);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
    setValue
  } = useForm<HospitalInfraStructure>({
    resolver: zodResolver(hospitalInfraStructureSchema),
    defaultValues: {
      numberOfBeds: infraData?.numberOfBeds ?? 0,
      isTraumaUnitAvailable: infraData?.isTraumaUnitAvailable ?? false,
      isMedicalCollegeAttached: infraData?.isMedicalCollegeAttached ?? false,
      firstOrganLicenceRegDate: infraData?.firstOrganLicenceRegDate ?? '',
      isIsoOrNabhAccredited: infraData?.isIsoOrNabhAccredited ?? false,
      isRegistredClinicalEstablishmentAct: infraData?.isRegistredClinicalEstablishmentAct ?? false,
      departments: selectOptions,
      clinicalEstablishmentCertificate: infraData?.clinicalEstablishmentCertificate ?? '',
      nabhCertificate: infraData?.nabhCertificate ?? ''
    }
  });
  console.log(errors, 'uuuu');
  //for files
  const watchedNabhCertificate = watch('nabhCertificate');
  const watchedClinicalCertificate = watch('clinicalEstablishmentCertificate');

  useEffect(() => {
    console.log('iii', infraData);
    reset({
      numberOfBeds: infraData?.numberOfBeds ?? 0,
      isTraumaUnitAvailable: infraData?.isTraumaUnitAvailable ?? false,
      isMedicalCollegeAttached: infraData?.isMedicalCollegeAttached ?? false,
      firstOrganLicenceRegDate: infraData?.firstOrganLicenceRegDate ?? '',
      isIsoOrNabhAccredited: infraData?.isIsoOrNabhAccredited ?? false,
      isRegistredClinicalEstablishmentAct: infraData?.isRegistredClinicalEstablishmentAct ?? false,
      departments: selectOptions,
      clinicalEstablishmentCertificate: infraData?.clinicalEstablishmentCertificate ?? undefined,
      nabhCertificate: infraData?.nabhCertificate ?? undefined
    });
  }, [infraData]);
  useEffect(() => {
    setValue('numberOfBeds', Number(infraData?.numberOfBeds) || 0);
  }, [infraData, setValue]);
  // useEffect(() => {
  //   setValue('departments', selectOptions);
  // }, [selectOptions, setValue]);
  useEffect(() => {
    if (infraData?.departments) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existingDepartments = infraData.departments.map((dept: any) => dept.name);
      setValue('departments', existingDepartments); // No selectOptions here
    }
  }, [infraData?.departments, setValue]);
  // const handleChange = (value: string[]) => {
  //   setSelectOptions(value);
  // };
  // const handleDelete = (organtoDelete: string) => {
  //   setSelectOptions((prevOptions) => prevOptions.filter((option) => option !== organtoDelete));
  // };

  useEffect(() => {
    setIsNabh(infraData?.isIsoOrNabhAccredited ?? false);
    setIsClinical(infraData?.isRegistredClinicalEstablishmentAct ?? false);
    setIsTraumaUnitAvailable(infraData?.isTraumaUnitAvailable ?? false);
    setIsMedicalCollegeAttached(infraData?.isMedicalCollegeAttached ?? false);
  }, [infraData]);

  const onSubmit = (data: HospitalInfraStructure) => {
    const transformedData = {
      ...data,
      numberOfBeds: Number(data.numberOfBeds)
    };
    // setHospitalInfra(transformedData);

    const selectedDepartments = data.departments
      .map((name) => {
        const department = departments.find((d: Department) => d.name === name);
        return department ? { id: department.id, name: department.name } : null;
      })
      .filter(Boolean) as Department[];
    const payload = {
      departments: selectedDepartments,
      numberOfBeds: transformedData.numberOfBeds,
      isTraumaUnitAvailable,
      isMedicalCollegeAttached,
      isIsoOrNabhAccredited: isNabh,
      isRegistredClinicalEstablishmentAct: isClinical,
      firstOrganLicenceRegDate: new Date(transformedData.firstOrganLicenceRegDate).toISOString(),
      nabhCertificate: isNabh ? data.nabhCertificate : '',
      clinicalEstablishmentCertificate: isClinical ? data.clinicalEstablishmentCertificate : ''
    };
    console.log('ppp', payload);

    updateInfraStructure(payload, () => {
      onNext(payload);
      isEdit ? navigate(-1) : '';
      isEdit ? toast('Hospital Details Updated Successfully', 'success') : '';
    });
    // onNext(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mt={2}>
        <Text className="hospital-form-sub-title">Hospital Infrastructure</Text>
        <Box>
          {/* <Controller
            name="departments"
            control={control}
            defaultValue={infraData?.departments.map((d) => d.name) ?? []}
            render={({ field, fieldState: { error } }) => (
              <>
                <DepartmentSelect
                  label="Departments"
                  selectOptions={field.value || []}
                  options={departmentOptions || []}
                  handleChange={(value) => {
                    field.onChange(value);
                    setSelectOptions(value);
                  }}
                  handleDelete={(org) => {
                    const newValues = field.value.filter((item: string) => item !== org);
                    field.onChange(newValues);
                    setSelectOptions(newValues);
                  }}
                  disable={readOnly}
                />
                {error && <p className="text-red-500 text-sm">{error.message}</p>}
              </>
            )}
          /> */}
          <Box className="organ-input">
            <CustomFormChip control={control} name="departments" label="Department" options={departmentOptions || []} />
          </Box>
          <Box mt={6} className="details-section">
            <Box className="">
              <FormInput
                control={control}
                helperText={errors.numberOfBeds?.message}
                name="numberOfBeds"
                label="Number Of Beds"
                placeholder="Enter Here"
                type="number"
                required
                fullWidth
                disabled={readOnly}
              />
            </Box>

            <Box className="">
              <FormAtomRadioGroup
                control={control}
                name="isTraumaUnitAvailable"
                label="Whether Trauma unit available?"
                row
                isRequired
              >
                <AtomRadio
                  label="Yes"
                  value={true}
                  onClick={() => setIsTraumaUnitAvailable(true)}
                  disabled={readOnly}
                />
                <AtomRadio
                  label="No"
                  value={false}
                  onClick={() => setIsTraumaUnitAvailable(false)}
                  disabled={readOnly}
                />
              </FormAtomRadioGroup>
            </Box>

            <Box className="">
              <FormAtomRadioGroup
                control={control}
                name="isMedicalCollegeAttached"
                label="Whether Medical College attached?"
                row
                isRequired
              >
                <AtomRadio
                  label="Yes"
                  value={true}
                  onClick={() => setIsMedicalCollegeAttached(true)}
                  disabled={readOnly}
                />
                <AtomRadio
                  label="No"
                  value={false}
                  onClick={() => setIsMedicalCollegeAttached(false)}
                  disabled={readOnly}
                />
              </FormAtomRadioGroup>
            </Box>

            <Box className="">
              <FormAtomRadioGroup
                control={control}
                name="isIsoOrNabhAccredited"
                label="Whether ISO/NABH accredited?"
                row
                isRequired
              >
                <AtomRadio label="Yes" value={true} onClick={() => setIsNabh(true)} disabled={readOnly} />
                <AtomRadio label="No" value={false} onClick={() => setIsNabh(false)} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Box>

            <Box className="">
              <FormAtomRadioGroup
                control={control}
                name="isRegistredClinicalEstablishmentAct"
                label="Whether registered under clinical establishment act?"
                row
                isRequired
              >
                <AtomRadio label="Yes" value={true} onClick={() => setIsClinical(true)} disabled={readOnly} />
                <AtomRadio label="No" value={false} onClick={() => setIsClinical(false)} disabled={readOnly} />
              </FormAtomRadioGroup>
            </Box>
            <Box className="">
              <AtomDatePicker
                control={control}
                name="firstOrganLicenceRegDate"
                label="Date of first organ license Registration"
                maxDate={dayjs()}
                required
                fullWidth
                disabled={readOnly}
              />
            </Box>

            {isNabh && (
              <Box className="">
                <FormFileInput
                  control={control}
                  name="nabhCertificate"
                  label="NABH certificate"
                  filePath={filePath}
                  fileData={watchedNabhCertificate || infraData?.nabhCertificate}
                  setOpenImgModal={setOpenPreview}
                  setFile={setFilePreview}
                  setPreviewName={() => setFileName('NABH certificate')}
                  fullWidth
                  disabled={readOnly}
                  allowedTypes={[
                    'application/pdf',
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/gif',
                    'image/svg+xml',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel'
                  ]}
                />
              </Box>
            )}

            {isClinical && (
              <Box className="">
                <FormFileInput
                  control={control}
                  name="clinicalEstablishmentCertificate"
                  label="Clinical Act Establishment certificate"
                  fileData={watchedClinicalCertificate || infraData?.clinicalEstablishmentCertificate}
                  filePath={filePath}
                  setOpenImgModal={setOpenPreview}
                  setFile={setFilePreview}
                  setPreviewName={() => setFileName('Clinical Act Establishment certificate')}
                  fullWidth
                  disabled={readOnly}
                  allowedTypes={[
                    'application/pdf',
                    'image/png',
                    'image/jpeg',
                    'image/jpg',
                    'image/gif',
                    'image/svg+xml',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel'
                  ]}
                />
              </Box>
            )}
          </Box>
        </Box>

        {reCheck && <FooterButton onSubmit={handleSubmit(onSubmit)} onBack={onBack} isHospitalEdit={isEdit} />}
        <PreviewFile
          open={openPreview}
          onClose={() => {
            setOpenPreview(false);
          }}
          file={filePreview}
          fileLabel={fileName}
        />
        {/* <FileViewModal
          open={openPreview}
          onClose={() => {
            setOpenPreview(false);
          }}
          file={filePreview}
          fileLabel=''
        /> */}
      </Box>
    </form>
  );
};

export default HospitalInfras;
