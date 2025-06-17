import React, { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  adminDetailsSchema,
  AdminDetailsType,
  approvedOrgansSchema,
  HospitalApprovedOrganType,
  hospitalDetailsSchema,
  HospitalDetailsType,
  HospitalInfraStructure,
  hospitalInfraStructureSchema
} from '../../validators';
import { zodResolver } from '@hookform/resolvers/zod';
import FooterButton from '../FooterButton';
import Form from './Form';
import { z } from 'zod';
import { ImageOption } from '../ApprovedOrganDoc';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { City, Country, Department, Designation, Gender, Organ, Qualification, Role, State } from '@/types/common.type';
import { useLocation } from 'react-router';
import { Box } from '@/atoms';

interface DeclareDetailsProps {
  // eslint-disable-next-line no-unused-vars
  onNext: (data: AdminDetailsType & HospitalDetailsType & HospitalInfraStructure & HospitalApprovedOrganType) => void;
  onBack?: () => void;
  reCheck?: boolean;
  adminData?: AdminDetailsType;
  passedData?: HospitalDetailsType;
  detailsData?: HospitalDetailsType;
  infraData?: HospitalInfraStructure;
  organData: HospitalApprovedOrganType | undefined;
  onEdit?: () => void;
}

const DeclareDetails: React.FC<DeclareDetailsProps> = ({
  onNext,
  onBack,
  onEdit,
  reCheck = true,
  adminData,
  detailsData,
  infraData,
  organData
}) => {
  const [indian, setIndian] = useState(adminData?.nationality || false);
  const [selectOptions, setSelectOptions] = useState<string[]>(infraData?.choosenOptions || []);
  const [isNabh, setIsNabh] = useState(infraData?.iso_nabh === 'yes' || false);
  const [isClinical, setIsClinical] = useState(infraData?.clinical_establishment === 'yes' || false);
  const location = useLocation();

  const {
    state: {
      organs,
      departments,
      designations,
      establishedyears,
      genders,
      qualifications,
      roles,
      countries,
      states,
      cities
    }
  } = useMasterData();

  const genderOptions = genders.map((g: Gender) => ({
    label: g.name,
    value: g.id.toString()
  }));
  const designationOptions = designations.map((d: Designation) => ({
    value: d.id.toString(),
    label: d.name
  }));
  const roleOptions = roles.map((r: Role) => ({
    value: r.id.toString(),
    label: r.name
  }));
  const qualificationOptions = qualifications.map((d: Qualification) => ({
    value: d.id.toString(),
    label: d.name
  }));
  const establishedYearsOptions = establishedyears.map((year: string, index: string) => ({
    label: year,
    value: (index + 1).toString()
  }));
  const organoptions = organs.map((a: Organ) => ({
    value: a.id.toString(),
    label: a.name
  }));
  const departmentOptions = departments.map((d: Department) => d.name);
  const stateOptions = states.map((s: State) => ({
    value: s.id.toString(),
    label: s.name
  }));
  const cityOptions = cities.map((c: City) => ({
    value: c.id.toString(),
    label: c.name
  }));
  const countryOptions = countries.map((c: Country) => ({
    value: c.id.toString(),
    label: c.name
  }));
  const handleChange = (value: string[]) => {
    setSelectOptions(value);
  };

  const handleDelete = (organtoDelete: string) => {
    setSelectOptions((prevOptions) => prevOptions.filter((option) => option !== organtoDelete));
  };

  const defaultValues = {
    ...adminData,
    ...detailsData,
    ...infraData,
    choosenOptions: infraData?.choosenOptions || [],
    ...organData
  };
  console.log('recheck/default values ', defaultValues);

  const combinedNormalSchema = z.intersection(
    z.intersection(adminDetailsSchema, hospitalDetailsSchema),
    z.intersection(hospitalInfraStructureSchema, approvedOrgansSchema)
  );
  const combinedEditModeSchema = z.intersection(
    hospitalDetailsSchema,
    z.intersection(hospitalInfraStructureSchema, approvedOrgansSchema)
  );

  const scheamToUse = location.state?.editMode ? combinedEditModeSchema : combinedNormalSchema;

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AdminDetailsType | HospitalDetailsType | HospitalInfraStructure | HospitalApprovedOrganType>({
    resolver: zodResolver(scheamToUse),
    defaultValues
  });

  const handleNationalityChange = (isIndian: boolean) => {
    setIndian(isIndian);
    setValue('nationality', isIndian);
  };

  useEffect(() => {
    setValue('choosenOptions', selectOptions);
  }, [selectOptions, setValue]);

  //for approved organs
  const [selectedValue, setSelectedValue] = useState('');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'selectedOrgans'
  });

  const isOrganSelected = (id: string) => {
    return fields.some((field) => field.organId === id);
  };

  const handleImageClick = (option: ImageOption) => {
    const isSelected = isOrganSelected(option.id);
    if (isSelected) {
      const index = fields.findIndex((field) => field.organId === option.id);
      remove(index);
      setSelectedValue('');
    } else {
      append({
        organId: option.id ?? '',
        organName: option.label ?? '',
        dms_license: new File([], ''),
        license_expiry: '',
        organ_first_level: '',
        organ_reference_no: '',
        receipt_number: ''
      });
      setSelectedValue(option.id);
    }
  };
  console.log(selectedValue, 'selected Value');

  useEffect(() => {
    if (organData && organData.selectedOrgans) {
      organData.selectedOrgans.forEach((organ) => {
        if (organ.organId && !isOrganSelected(organ.organId)) {
          append(organ);
          setSelectedValue(organ.organId);
        }
      });
    }
  }, [organData, append]);

  const dateOfBirth = watch('dateOfBirth');
  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  useEffect(() => {
    const age = calculateAge(dateOfBirth).toString();
    setValue('age', age);
  }, [dateOfBirth, setValue]);

  const onSubmit = (data: HospitalDetailsType & HospitalInfraStructure & HospitalApprovedOrganType) => {
    if (!location.state?.editMode) {
      const fullData: AdminDetailsType & HospitalDetailsType & HospitalInfraStructure & HospitalApprovedOrganType = {
        ...adminData,
        ...data
      };
      console.log('recheck/onsubmit ', data);
      onNext(fullData);
    } else {
      const partialData: HospitalDetailsType & HospitalInfraStructure & HospitalApprovedOrganType = {
        ...data
      };
      onNext(partialData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form
        control={control}
        errors={errors}
        infraData={infraData}
        isIndian={indian}
        handleNationalityChange={handleNationalityChange}
        selectOptions={selectOptions}
        handleChange={handleChange}
        handleDelete={handleDelete}
        isNabh={isNabh}
        isClinical={isClinical}
        setIsNabh={setIsNabh}
        setIsClinical={setIsClinical}
        fields={fields}
        handleImageClick={handleImageClick}
        isOrganSelected={isOrganSelected}
        onEdit={onEdit}
        organOptions={organoptions}
        genderOptions={genderOptions}
        designationOptions={designationOptions}
        roleOptions={roleOptions}
        qualificationOptions={qualificationOptions}
        establishedYearsOptions={establishedYearsOptions}
        departmentOptions={departmentOptions}
        countryOptions={countryOptions}
        stateOptions={stateOptions}
        cityyOptions={cityOptions}
      />
      <Box mt={8}>{reCheck && <FooterButton onBack={onBack} onSubmit={handleSubmit(onSubmit)} />}</Box>
    </form>
  );
};

export default DeclareDetails;
