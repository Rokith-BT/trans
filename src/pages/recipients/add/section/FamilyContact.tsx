/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtomDatePicker, Box, Button, FormInput, FormSelect, MUIContainer, Text } from '@/atoms';
import React, { useEffect } from 'react';
import RecipientFooter from './RecipientFooter';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import { DeleteIcon } from '@/assets/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { familyContactSchema } from '../../validators';
import { useRecipient } from '../../RecipientContext';
import { RecipientFamilyContact } from '@/types/recipient';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import { Grid } from '@mui/material';
interface FamilyContactProps {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onNext: (data: any) => void;
  onBack?: any;
  isPreview: boolean;
  forCancel?: boolean;
  FamilyContact?: RecipientFamilyContact;
}

const FamilyContact: React.FC<FamilyContactProps> = ({
  readOnly,
  onNext,
  onBack,
  isPreview,
  forCancel,
  FamilyContact
}) => {
  console.log(FamilyContact, 'FamilyContact1232');
  const { recipientId } = useParams();
  const familyContactsData = FamilyContact?.familyContacts ?? [];
  const {
    state: { genders, relationType }
  } = useMasterData();
  const {
    actions: { updateRecipientFamilyCont },
    state: { currentRecipientID }
  } = useRecipient();
  console.log(currentRecipientID, 'currentRecipientID1212121212');

  const genderOptions = genders;
  const relationOptions = relationType;
  const { handleSubmit, setValue, control, watch, reset } = useForm({
    resolver: zodResolver(familyContactSchema),
    defaultValues: {
      isLoadingBasic: false,
      familyContacts:
        familyContactsData.length > 0
          ? familyContactsData
          : [
              {
                id: 0,
                recipientId: 0,
                relationTypeId: undefined,
                name: '',
                genderId: undefined,
                dateOfBirth: null,
                mobileNumber: '',
                countryCode1: 91
              }
            ]
    }
  });
  useEffect(() => {
    reset({
      familyContacts:
        familyContactsData.length > 0
          ? familyContactsData
          : [
              {
                id: 0,
                recipientId: 0,
                relationTypeId: undefined,
                name: '',
                genderId: undefined,
                dateOfBirth: null,
                mobileNumber: '',
                countryCode1: 91
              }
            ]
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FamilyContact, reset]);
  const { fields, append, remove } = useFieldArray({ control, name: 'familyContacts' });
  const familyContacts = watch('familyContacts');
  const isLoadingBasic = watch('isLoadingBasic');
  console.log(familyContacts, 'familyContactsfamilyContactsfamilyContacts');

  const handleNewFamilyCont = () => {
    append({
      id: 0,
      recipientId: 0,
      relationTypeId: undefined,
      name: '',
      genderId: undefined,
      dateOfBirth: null,
      mobileNumber: '',
      countryCode1: 91
    });
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setValue('isLoadingBasic', true);
    if (recipientId) {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      familyContacts?.map((obj: any) => (obj.recipientId = Number(recipientId)));
      updateRecipientFamilyCont(Number(recipientId), familyContacts, () => {
        onNext(data);
      });
    } else {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      familyContacts?.map((obj: any) => (obj.recipientId = currentRecipientID));
      updateRecipientFamilyCont(currentRecipientID, familyContacts, () => {
        onNext(data);
      });
    }
  };
  const today = dayjs();
  const maxDate = today.subtract(0, 'year');
  const minDate = today.subtract(140, 'year');
  return (
    <div className="">
      <MUIContainer maxWidth="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="my-[30px]">
            {fields.length > 0 &&
              fields.map((field, index) => {
                return (
                  <Box key={field.id} className="mb-4">
                    <Box className="flex items-center justify-between">
                      <Text className="!text-[19px] text-[#804595] !mt-[16px] !font-[700]">
                        {index + 1}. Family Contact
                      </Text>
                      {!readOnly && (
                        <>
                          {index < 1 ? (
                            <Button
                              variant="text"
                              className=" !bg-transparent !text-[#C967A2] !font-[500] !text-[16px] disabled:opacity-50"
                              onClick={handleNewFamilyCont}
                              disabled={readOnly}
                            >
                              + Add New
                            </Button>
                          ) : (
                            <DeleteIcon onClick={() => remove(index)} />
                          )}
                        </>
                      )}
                    </Box>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} xl={4} md={6}>
                        <FormSelect
                          menuOptions={relationOptions}
                          control={control}
                          name={`familyContacts.${index}.relationTypeId`}
                          label="Relation Type"
                          fullWidth
                          disabled={readOnly}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} xl={4} md={6}>
                        <FormInput
                          control={control}
                          name={`familyContacts.${index}.name`}
                          label="Name"
                          fullWidth
                          disabled={readOnly}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} xl={4} md={6}>
                        <FormSelect
                          menuOptions={genderOptions}
                          control={control}
                          name={`familyContacts.${index}.genderId`}
                          label="Gender"
                          fullWidth
                          disabled={readOnly}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} xl={4} md={6}>
                        <AtomDatePicker
                          control={control}
                          name={`familyContacts.${index}.dateOfBirth`}
                          label="Date Of Birth"
                          minDate={minDate}
                          maxDate={maxDate}
                          fullWidth
                          disabled={readOnly}
                        />
                      </Grid>
                      <Grid item xs={12} xl={4} md={6}>
                        <StyledPhoneInput
                          control={control}
                          name={`familyContacts.${index}.mobileNumber`}
                          countryCodeName={`familyContacts.${index}.countryCode1`}
                          disable={readOnly}
                          label={'Mobile Number'}
                          setValue={setValue}
                          isHandleMulti={true}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
          </Box>

          {isPreview && (
            <RecipientFooter
              onBack={() => onBack(currentRecipientID)}
              onNext={handleSubmit(onSubmit)}
              forCancel={forCancel}
              isLoadingBasic={isLoadingBasic}
            />
          )}
        </form>
      </MUIContainer>
    </div>
    // <Box>
    //   FamilyContact
    //   <RecipientFooter onNext={handleSubmit(onSubmit)} onBack={onBack} />
    // </Box>
  );
};

export default FamilyContact;
