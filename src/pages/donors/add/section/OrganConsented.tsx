/* eslint-disable @typescript-eslint/no-explicit-any */
import { AtomDatePicker, Box, FormFileInput, Text } from '@/atoms';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { OrganConsentedSchema, OrganConsentedType } from '../validators';
import { DeleteIcon } from '@/assets/icons';
import DonorFooterButton from './DonorFooterButton';
import { ToggleButtonComponent } from '@/pages/components/CustomToggleButton';
import { useEffect } from 'react';
import { useDonor } from '../../DonorContext';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import LoadingOverlay from '@/pages/components/LoadingOverlay';
import FileViewModal from '@/pages/recipients/add/section/FileViewModal';

interface OrganConsentedProps {
  OrganConsentData: any;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: OrganConsentedType) => void;
  onBack?: any;
  isPreview?: boolean;
  readOnly?: boolean;
}
const OrganConsented: React.FC<OrganConsentedProps> = ({ OrganConsentData, onNext, onBack, isPreview, readOnly }) => {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [file, setFile] = useState('');
  const [loader, setLoader] = useState(false);
  const [fileLabel, setFileLabel] = useState('');
  console.log(OrganConsentData, 'OrganConsentData');

  const {
    action: {},
    state: { organs }
  } = useMasterData();
  const {
    action: { updateDonarOrganConsent },
    state: { currentDonarId }
  } = useDonor();
  const ConsetFilePath = `donor/${currentDonarId}/organConsent`;
  const {
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
    handleSubmit
  } = useForm<OrganConsentedType>({
    resolver: zodResolver(OrganConsentedSchema),
    defaultValues: {
      organConsent: OrganConsentData?.organConsent?.length
        ? OrganConsentData.organConsent.map((consentItem: any) => {
            const organInfo = organs.find((organ: { id: number }) => organ.id === consentItem.organId);
            return {
              organId: consentItem.organId,
              isConsentGiven: consentItem.isConsentGiven,
              name: organInfo?.name || '',
              isTissue: organInfo?.isTissue ?? false,
              isSelected: false
            };
          })
        : organs.map((organ: { id: number; name: string; isTissue: boolean }) => ({
            organId: organ.id,
            isConsentGiven: 0,
            name: organ.name,
            isTissue: organ.isTissue,
            isSelected: false
          })),
      apnoeaTest: OrganConsentData?.apnoeaTest || [
        {
          id: 0,
          donorId: currentDonarId,
          datetime: '',
          preAbg: '',
          postAbg: ''
        }
      ]
    }
  });
  console.log(errors, 'errorserrors12');

  useEffect(() => {
    reset({
      organConsent: OrganConsentData?.organConsent?.length
        ? OrganConsentData.organConsent.map((consentItem: any) => {
            const organInfo = organs.find((organ: { id: number }) => organ.id === consentItem.organId);
            return {
              organId: consentItem.organId,
              isConsentGiven: consentItem.isConsentGiven,
              name: organInfo?.name || '',
              isTissue: organInfo?.isTissue ?? false,
              isSelected: false
            };
          })
        : organs.map((organ: { id: number; name: string; isTissue: boolean }) => ({
            organId: organ.id,
            isConsentGiven: 0,
            name: organ.name,
            isTissue: organ.isTissue,
            isSelected: false
          })),
      apnoeaTest: OrganConsentData?.apnoeaTest || [
        {
          id: 0,
          donorId: currentDonarId,
          datetime: '',
          preAbg: '',
          postAbg: ''
        }
      ]
    });
  }, [reset, OrganConsentData]);
  const organConsents = watch('organConsent');
  console.log(organConsents, 'organConsent');

  const { fields, append, remove } = useFieldArray({ control, name: 'apnoeaTest' });
  const { fields: organField } = useFieldArray<OrganConsentedType, 'organConsent', 'id'>({
    control,
    name: 'organConsent'
  });

  useEffect(() => {
    if (fields.length < 2) {
      for (let i = fields.length; i < 2; i++) {
        append({
          id: 0,
          donorId: currentDonarId,
          datetime: '',
          preAbg: '',
          postAbg: ''
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddApnoea = () => {
    append({
      id: 0,
      donorId: currentDonarId,
      datetime: '',
      preAbg: '',
      postAbg: ''
    });
  };
  const onSubmit = (data: OrganConsentedType) => {
    console.log('Organ Consented details ', data);
    const payload = {
      id: 0,
      donorId: 0,
      organConsent: data.organConsent,
      apnoeaTestResult: data.apnoeaTest
    };
    console.log(payload, 'payloadpayloadpayloadpayload');
    updateDonarOrganConsent(currentDonarId, payload, () => {
      onNext(data);
    });
  };
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="!mt-[80px]">
          <Text className="!text-[#804595] !text-[19px] !font-[500] !mb-2">Organs Consented</Text>
          <Box className="px-[20px]">
            {/* Non-tissue organs section */}

            <Box className="flex flex-wrap -mx-[24px]">
              {organField
                .filter((organ) => !organ.isTissue)
                .map((organ) => {
                  // Find the original index in the organField array
                  const originalIndex = organField.findIndex((item) => item.id === organ.id);

                  const handleToggleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
                    const isSelected = Number(value.target.value) === 1;
                    setValue(`organConsent.${originalIndex}.isConsentGiven`, isSelected ? 1 : 0);
                  };

                  return (
                    <Box className="flex w-full md:w-1/5 p-2" key={organ.id}>
                      <ToggleButtonComponent
                        control={control}
                        name={`organConsent.${originalIndex}.isConsentGiven`}
                        submitted={false}
                        label={organ.name || ''}
                        required={true}
                        onChange={handleToggleChange}
                        options={[
                          { value: 1, label: 'Yes' },
                          { value: 0, label: 'No' }
                        ]}
                      />
                    </Box>
                  );
                })}
            </Box>

            {/* Tissue organs section */}
            <Text className="!text-[#804595] !text-[19px] !font-[500] !mb-2">Tissues</Text>
            <Box className="flex flex-wrap -mx-[24px]">
              {organField
                .filter((organ) => organ.isTissue)
                .map((organ) => {
                  // Find the original index in the organField array
                  const originalIndex = organField.findIndex((item) => item.id === organ.id);

                  const handleToggleChange = (value: React.ChangeEvent<HTMLInputElement>) => {
                    const isSelected = Number(value.target.value) === 1;
                    setValue(`organConsent.${originalIndex}.isConsentGiven`, isSelected ? 1 : 0);
                  };

                  return (
                    <Box className="flex w-full md:w-1/5 p-2" key={organ.id}>
                      <ToggleButtonComponent
                        control={control}
                        name={`organConsent.${originalIndex}.isConsentGiven`}
                        submitted={false}
                        label={organ.name || ''}
                        required={true}
                        onChange={handleToggleChange}
                        options={[
                          { value: 1, label: 'Yes' },
                          { value: 0, label: 'No' }
                        ]}
                      />
                    </Box>
                  );
                })}
              {errors?.organConsent?.organConsent?.message && (
                <Text className="text-red-500 text-sm mt-2">{errors.organConsent?.organConsent.message}</Text>
              )}
            </Box>
          </Box>

          <Box>
            <Box className="!mt-[28px] flex flex-col">
              <Box className="flex items-center justify-between">
                <Text className="!text-[#804595] !text-[19px] !font-[700]">Apnoea Test Details</Text>
                <Text
                  className="!text-[#C967A2] !text-[19px] !font-[700] flex gap-2 items-center cursor-pointer"
                  onClick={handleAddApnoea}
                >
                  + Add Aponea
                </Text>
              </Box>
              {fields.map((field, index) => (
                <Box key={field.id} className="flex flex-wrap gap-x-[57px] gap-y-[28px]">
                  <Box className="w-full flex gap-10 !mt-[16px]">
                    <Box className="flex w-full flex-col ">
                      <Text className="!text-[#C967A2] !text-[16px] relative !font-[500] text-center rounded-lg !bg-[#c967a226] p-[8px]">
                        {`Apnoea Test ${index + 1}`}
                        {index >= 1 && (
                          <Box className="absolute right-[1%] top-[15%]">
                            <DeleteIcon onClick={() => remove(index)} />
                          </Box>
                        )}
                      </Text>
                    </Box>
                  </Box>
                  <Box className="w-full md:w-[calc(33.33%-200px)]">
                    <AtomDatePicker
                      control={control}
                      name={`apnoeaTest.${index}.datetime`}
                      label="Apnoea Date & Time"
                      fullWidth
                      required
                    />
                  </Box>
                  <Box className="w-full md:w-[calc(33.33%-200px)]">
                    <FormFileInput
                      control={control}
                      name={`apnoeaTest.${index}.preAbg`}
                      label="Pre Apnoea ABG"
                      fullWidth
                      disabled={readOnly}
                      filePath={ConsetFilePath}
                      fileData={OrganConsentData?.apnoeaTest?.[index]?.preAbg}
                      setOpenImgModal={(val) => {
                        setOpenImgModal(val);
                        setFileLabel('Pre Apnoea ABG');
                      }}
                      setFile={setFile}
                      setLoader={setLoader}
                    />
                  </Box>
                  <Box className="w-full md:w-[calc(33.33%-200px)] mb-2">
                    <FormFileInput
                      control={control}
                      name={`apnoeaTest.${index}.postAbg`}
                      label="Post Apnoea ABG"
                      fullWidth
                      disabled={readOnly}
                      filePath={ConsetFilePath}
                      fileData={OrganConsentData?.apnoeaTest?.[index]?.postAbg}
                      setOpenImgModal={(val) => {
                        setOpenImgModal(val);
                        setFileLabel('Post Apnoea ABG');
                      }}
                      setFile={setFile}
                      setLoader={setLoader}
                    />
                  </Box>
                </Box>
              ))}
              {errors?.apnoeaTest?.root?.message && (
                <Text className="text-red-500 text-sm mt-2">{errors.apnoeaTest.root?.message}</Text>
              )}
              {errors?.apnoeaTest?.apnoeaTest?.message && (
                <Text className="text-red-500 text-sm mt-2">{errors.apnoeaTest?.apnoeaTest.message}</Text>
              )}
            </Box>
          </Box>
          {!isPreview && (
            <Box>
              <DonorFooterButton
                onSubmit={handleSubmit(onSubmit)}
                onBack={() => onBack(currentDonarId)}
                isFirstStep={false}
              />
            </Box>
          )}
        </Box>
      </form>
      <FileViewModal open={openImgModal} onClose={() => setOpenImgModal(false)} file={file} fileLabel={fileLabel} />
      <LoadingOverlay isLoading={loader} />
    </Box>
  );
};

export default OrganConsented;
