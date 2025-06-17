import { AtomDatePicker, Box, FormFileInput, FormInput, Input, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { approvedOrgansSchema, HospitalApprovedOrganType } from '../validators';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import heartImage from '@/assets/imgs/heart.png';
import kidneyImage from '@/assets/imgs/kidney.png';
import liverImage from '@/assets/imgs/liver.png';
import lungImage from '@/assets/imgs/lungs.png';
import pancreasImage from '@/assets/imgs/pancreas.png';
import stomach from '@assets/imgs/stomach.png';
import smallbowl from '@assets/imgs/intestine.png';
import hand from '@assets/imgs/hand.png';
import heartvalves from '@assets/imgs/heart2.png';
import corner from '@assets/imgs/eye.png';
import skin from '@assets/imgs/skin.png';
// import bloodvessels from '@assets/imgs/blood-vessel.png';
// import spine from '@assets/imgs/spine.png';
import bone from '@assets/imgs/bone.png';
import abdominal from '@assets/imgs/abdomanal-flap.png';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FooterButton from './FooterButton';
import { useHospital } from '../../hospitalContext';
import { Organ } from '@/types/common.type';
import { HospitalApprovedOrganType1 } from '../NonNtorcHospital';
import { OrganLicenceItem } from '@/types/hospital';
import { ImageOption } from '@/utils/organs';
import dayjs from 'dayjs';
import { useRole } from '@/hooks/useRole';
import { useHospitalId } from '@/hooks/useHospitalID';
import { OrganLicenseDialog } from '../../section/OrganLicenseDialog';
import PreviewFile from '@/pages/components/FilePreview';
import ConfirmDialog from './ConfirmationDialog';
import { toast } from '@/utils/toast';
// import { useHospitalId } from '@/hooks/useHospitalID';

interface OrganLicence {
  organ: Organ;
  dmsLicenseDoc: File;
  organLicenceNumber: string;
  firstLevelOrganLicenceRegDate: string;
  licenceExpiryDate: string;
  paymentReceiptNumber: string;
  status: string;
}
export interface ApprovedOrganDocProps {
  // eslint-disable-next-line no-unused-vars
  onNext: (data: HospitalApprovedOrganType1) => void;
  onBack?: () => void;
  reCheck?: boolean;
  organData?: HospitalApprovedOrganType1 | Array<OrganLicence> | undefined;
  readOnly: boolean;
  isAddLicense?: boolean;
  isClickable?: boolean;
  isOnboarding?: boolean;
  forButton?: boolean;
  forNtorc?: boolean;
}

export interface ApprovedOrganField {
  id: string;
  organId: string;
  organName: string;
  dms_license: File;
  license_expiry: string;
  organ_first_level: string;
  organ_reference_no: string;
  receipt_number: string;
}

export const organOptions: ImageOption[] = [
  { src: heartImage, label: 'Heart', id: 'heart' },
  { src: kidneyImage, label: 'Kidney', id: 'kidney' },
  { src: liverImage, label: 'Liver', id: 'liver' },
  { src: lungImage, label: 'Lungs', id: 'duallungs' },
  { src: pancreasImage, label: 'Pancreas', id: 'pancreas' },
  { src: stomach, label: 'Stomach', id: 'stomach' },
  { src: smallbowl, label: 'Small Bowel', id: 'smallbowel' },
  { src: abdominal, label: 'Abdominal Flap', id: 'abdominalflap' },
  { src: bone, label: 'Bone', id: 'bone' },
  { src: hand, label: 'Hand', id: 'hand' }
];
export const tissueOptions: ImageOption[] = [
  { src: corner, label: 'Cornea', id: 'cornea' },
  { src: skin, label: 'Skin', id: 'skin' },
  { src: heartvalves, label: 'Heart Valves', id: 'heartvalves' }
  // { src: bloodvessels, label: 'Blood Vessel', id: 'bloodvessel' },
  // { src: spine, label: 'Spine', id: 'spine' }
];

export interface OrgansType {
  id: number;
  cost: number;
  isActive: boolean;
  isPaymentRequired: boolean;
  isTissue: boolean;
  name: string;
}

const ApprovedOrganDoc: React.FC<ApprovedOrganDocProps> = ({
  organData,
  reCheck = true,
  onNext,
  onBack,
  readOnly = false,
  isAddLicense = false,
  // isClickable = true,
  isOnboarding = false,
  forButton = false,
  forNtorc = false
}) => {
  const {
    state: { organs }
  } = useMasterData();
  console.log('organs ', organs);
  const {
    state,
    actions: { updateOrganLicense, addOrganLicense }
  } = useHospital();
  const hospitalID = useHospitalId();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { isSuperAdmin, status: hospitalStatus } = useRole();
  const { organLicences } = state.hospital || {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const isDetailPending = hospitalStatus === 'DetailsPending' || hospitalStatus === 'PendingApproval';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedOrganId, setSelectedOrganId] = useState<string[]>([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [filePreview, setFilePreview] = useState('');
  const [fileName, setFileName] = useState('');
  // const []=useState()
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const forOrgans = organOptions.map((o) => o.id);
  const forTissues = tissueOptions.map((t) => t.id);

  const filteredOrgans = organs.filter((o: OrgansType) =>
    forOrgans.includes(o.name?.toLowerCase().replace(/\s+/g, ''))
  );
  const filteredTissues = organs.filter((t: OrgansType) =>
    forTissues.includes(t.name?.toLowerCase().replace(/\s+/g, ''))
  );

  const selectedOrganNames = selectedOrganId
    .map((id) => organs.find((organ: OrgansType) => organ.id?.toString() === id)?.name)
    .filter(Boolean);

  useEffect(() => {
    if (Array.isArray(organData)) {
      const organIds = organData.map((license) => license.organ.id?.toString());
      setSelectedOrganId(organIds);
    } else {
      setSelectedOrganId([]);
    }
  }, [organData]);

  const { control, handleSubmit, watch, reset } = useForm<HospitalApprovedOrganType>({
    resolver: zodResolver(approvedOrgansSchema),
    defaultValues: {
      selectedOrgans: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'selectedOrgans'
  });
  const selectedOrgans = watch('selectedOrgans') || [];

  useEffect(() => {
    if (organData) {
      const formattedData = Object.values(organData).map((organ, index) => ({
        dms_license: selectedOrgans[index]?.dms_license || organ.dmsLicenseDoc || new File([], ''),
        organ_first_level: organ.firstLevelOrganLicenceRegDate || '',
        license_expiry: organ.licenceExpiryDate || '',
        organ_reference_no: organ.organLicenceNumber || '',
        receipt_number: organ.paymentReceiptNumber || '',
        organId: organ.organ?.id ?? null
      }));

      setSelectedOrganId(
        formattedData.map((o) => (o.organId ? o.organId.toString() : null)).filter((id) => id !== null)
      );

      reset({ selectedOrgans: formattedData });
      remove();
      append(formattedData);
    }
  }, [organData, reset, append, remove]);

  // const selectedOrganIds = watch('selectedOrgans').map((organ) => organ.organId?.toString());
  // console.log('handleSelectOrgan / selectedOrganIds ', selectedOrganId);

  const isRejected = hospitalStatus === 'Rejected';

  const handleSelectOrgan = async (id: string) => {
    console.log('handleSelectOrgan / id: ', id, typeof id);
    if (readOnly) {
      console.log(`Selection is disabled because ready is true.`);
      return;
    }
    const organExists = selectedOrganId.includes(id);
    console.log('handleSelectOrgan / organExists: ', organExists);

    // Check if organ is already in API's licensed organs
    const isPreSelected = organLicences?.some((license) => license.organ?.id.toString() === id);

    // Case 1: If hospital status is "Rejected", allow full selection/deselection
    if (isRejected) {
      if (organExists) {
        // console.log(`Removing organ ${id} in rejected status.`);

        // // Remove from selectedOrganId state
        // setSelectedOrganId((prev) => prev.filter((organId) => organId !== id));
        // console.log('selected organ id from is rejected ', selectedOrganId);

        // // Find index of organ to remove from form
        // const indexToRemove = fields.findIndex((field) => field.organId === Number(id));

        // if (indexToRemove > -1) {
        //   remove(indexToRemove);
        // }
        // return;
        setPendingRemoveId(id);
        setConfirmDialogOpen(true); // Ask before removing
        return;
      } else {
        // Add organ
        const selectedOrgan = organs.find((o: OrgansType) => o.id.toString() === id);
        if (selectedOrgan) {
          append({
            organId: selectedOrgan.id,
            dms_license: new File([], ''),
            organ_first_level: '',
            license_expiry: '',
            organ_reference_no: '',
            receipt_number: ''
          });
          setSelectedOrganId((prev) => [...prev, selectedOrgan.id.toString()]);
        }
      }
      return; // Exit function since logic for "Rejected" is handled
    }

    // Case 2: If status is NOT "Rejected"
    if (isPreSelected) {
      console.log(`Organ ${id} is pre-selected and cannot be deselected`);
      return; // Prevent deselecting API-selected organs
    }

    // Case 3: Handle selection/deselection for organs that are NOT from API
    if (organExists) {
      // Remove organ
      // setSelectedOrganId((prev) => prev.filter((organId) => organId !== id));
      // const indexToRemove = fields.findIndex((field) => field.organId === Number(id));
      // if (indexToRemove > -1) remove(indexToRemove);
      // console.log(`Organ ${id} removed successfully`);
      setPendingRemoveId(id);
      setConfirmDialogOpen(true);
    } else {
      // Add organ
      const selectedOrgan = organs.find((o: OrgansType) => o.id.toString() === id);
      if (selectedOrgan) {
        append({
          organId: selectedOrgan.id,
          dms_license: new File([], ''),
          organ_first_level: '',
          license_expiry: '',
          organ_reference_no: '',
          receipt_number: ''
        });
        setSelectedOrganId((prev) => [...prev, selectedOrgan.id.toString()]);
      }
    }
  };
  // const handleConfirmDialogClose = (confirmed: boolean) => {
  //   setConfirmDialogOpen(false);

  //   if (confirmed && pendingRemoveId) {
  //     // Actually remove the organ
  //     setSelectedOrganId((prev) => prev.filter((organId) => organId !== pendingRemoveId));
  //     const indexToRemove = fields.findIndex((field) => field.organId === Number(pendingRemoveId));
  //     if (indexToRemove > -1) remove(indexToRemove);
  //   }

  //   setPendingRemoveId(null); // Clear state either way
  // };

  const onSubmit = (data: HospitalApprovedOrganType) => {
    if (isOnboarding) {
      // On onboarding: send both existing (with any edited values) and new organs.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = data.selectedOrgans.map((organFieldData) => {
        const organ = organs.find((o: OrgansType) => o.id === organFieldData.organId);
        return {
          organId: organ?.id,
          organ: {
            id: organ?.id,
            name: organ?.name
          },
          organName: organ?.name || '',
          cost: organ?.cost || 0,
          dmsLicenseDoc: organFieldData.dms_license,
          organLicenceNumber: organFieldData.organ_reference_no, // always use the current (edited) form value
          firstLevelOrganLicenceRegDate: organFieldData.organ_first_level,
          licenceExpiryDate: organFieldData.license_expiry,
          paymentReceiptNumber: organFieldData.receipt_number
        };
      });

      console.log('Payload for Onboarding (Updated + New):', payload);

      updateOrganLicense(payload, () => {
        onNext(payload);
      });
    } else {
      // Not onboarding: only add new organs. Ignore any updated values of existing ones.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newOrganPayload: any = data.selectedOrgans
        .filter((organFieldData) => {
          // Check if the organ id exists in any of the existing licenses.
          return !organLicences.some((license: OrganLicenceItem) => license.organ?.id === organFieldData.organId);
        })
        .map((organFieldData) => {
          const organ = organs.find((o: OrgansType) => o.id === organFieldData.organId);
          return {
            organId: organ?.id,
            organ: {
              id: organ?.id,
              name: organ?.name
            },
            organName: organ?.name || '',
            cost: organ?.cost || 0,
            dmsLicenseDoc: organFieldData.dms_license,
            organLicenceNumber: organFieldData.organ_reference_no,
            firstLevelOrganLicenceRegDate: organFieldData.organ_first_level,
            licenceExpiryDate: organFieldData.license_expiry,
            paymentReceiptNumber: organFieldData.receipt_number
          };
        });

      console.log('Payload for Non-Onboarding (New Only):', newOrganPayload);

      addOrganLicense(newOrganPayload, () => {
        toast('Organ License Requested Successfully', 'success');
        onNext(newOrganPayload);
      });
    }
  };

  const handleDisabled = (
    isRejected: boolean,
    isOnboarding: boolean,
    isSuperAdmin: boolean,
    isExistingOrgan: boolean,
    readOnly: boolean
  ) => {
    if (isRejected) {
      return false;
    }
    if (isOnboarding && isSuperAdmin) {
      return false;
    }
    if (isExistingOrgan) {
      return true;
    }

    return readOnly;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className={`${!isSuperAdmin ? '!w-[90vw] mt-4' : ''}`}>
        <Text className="hospital-form-sub-title">{isAddLicense ? 'Add License' : 'Approved Organs & Documents'}</Text>
        <Box>
          {!forNtorc && (
            <Box
              display="flex"
              className={`border-[2px] border-[#804595] rounded-[10px] relative mt-[28px] mx-[-18px] ${readOnly ? 'border-[#A1999F] !border-[1px]' : ''}`}
            >
              <Text className="flex absolute -top-3 left-3 bg-white gap-x-2 px-2 !text-[16px] !font-[600]">
                Select Organ <Text color="red">*</Text>
              </Text>
              <Box className="approved-organ-box">
                {filteredOrgans.map((organ: OrgansType) => {
                  const isPreSelected = // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    organLicences?.some((license: any) => license?.organ?.id === organ?.id);
                  return (
                    <Box
                      key={organ.id}
                      onClick={() => {
                        if (!isPreSelected || isRejected) handleSelectOrgan(organ.id.toString());
                      }}
                      p={2}
                      borderRadius="8px"
                      mx={2}
                      className="h-[104px] w-[104px] md:w-[140px] "
                      sx={{
                        backgroundColor: isPreSelected
                          ? '#A1999F66'
                          : selectedOrganId.includes(organ.id.toString())
                            ? '#D4C2DF'
                            : '',
                        clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                        '&:hover': { backgroundColor: !readOnly ? '#D4C2DF' : '' }
                      }}
                    >
                      <img
                        src={organOptions.find((o) => o.id === organ.name.toLowerCase().replace(/\s+/g, ''))?.src}
                        alt={organ.name}
                        className="h-[24px] w-[24px] md:h-[33px] md:w-[33px] "
                      />
                      <Text className="text-center !text-[11px] !font-[500] md:!text-[16px] md:!font-[500]">
                        {organ.name}
                      </Text>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}

          <Box
            display="flex"
            flexWrap="wrap"
            className={`border-[2px] mt-[18px] border-[#804595] rounded-[10px] mx-[-18px] relative  ${readOnly ? 'border-[#A1999F] !border-[1px]' : ''}`}
          >
            <Text className="flex absolute -top-3 left-3 bg-white gap-2 px-2 !text-[16px] !font-[600]">
              Select Tissue
            </Text>
            {filteredTissues.map((tissue: OrgansType) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const isPreSelected = organLicences?.some((license: any) => license.organ.id === tissue?.id);
              return (
                <Box
                  key={tissue.id}
                  onClick={() => {
                    if (!isPreSelected || isRejected) handleSelectOrgan(tissue.id.toString());
                  }}
                  p={2}
                  borderRadius="8px"
                  mx={2}
                  className="h-[104px] w-[104px] md:w-[140px] "
                  sx={{
                    backgroundColor:
                      isPreSelected && !isRejected
                        ? '#A1999F66'
                        : selectedOrganId.includes(tissue.id.toString())
                          ? '#D4C2DF'
                          : '',
                    clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',

                    transition: 'background-color 0.3s ease, border-color 0.3s ease',
                    '&:hover': { backgroundColor: !readOnly ? '#D4C2DF' : '' }
                  }}
                >
                  <img
                    src={tissueOptions.find((t) => t.id === tissue.name.toLowerCase().replace(/\s+/g, ''))?.src}
                    alt={tissue.name}
                    className="h-[24px] w-[24px] md:h-[33px] md:w-[33px] "
                  />
                  <Text className="text-center !text-[11px] !font-[500] md:!text-[16px] md:!font-[500]">
                    {tissue.name}
                  </Text>
                </Box>
              );
            })}
            <Box className="absolute -bottom-6 left-0">
              <FormInput control={control} name="selectedOrgans" readOnly className=" opacity-0" />
            </Box>
          </Box>

          {selectedOrganNames.length > 0 && (
            <Box className="mt-[28px]">
              <Text className="hospital-form-sub-title ">Selected Organs</Text>
              {fields.map((field, index) => {
                const isExistingOrgan = organLicences?.some(
                  (license: OrganLicenceItem) => license.organ?.id === field.organId
                );
                return (
                  <Box key={field.id}>
                    <Text className="!text-[12px] md:!text-[16px] !font-[500] md:!font-[600] !-mx-[18px] !my-[12px] ">
                      {selectedOrganNames[index]}
                    </Text>
                    <Box className="details-section">
                      <Box className="">
                        <FormFileInput
                          control={control}
                          name={`selectedOrgans.${index}.dms_license`}
                          label="DMS license"
                          filePath={`hospital/${hospitalID}/organlicense`}
                          fileData={
                            selectedOrgans[index]?.dms_license instanceof File
                              ? selectedOrgans[index]?.dms_license.name
                              : selectedOrgans[index]?.dms_license || ''
                          }
                          setFile={setFilePreview}
                          setOpenImgModal={setOpenPreview}
                          setPreviewName={() => {
                            setFileName(`${selectedOrganNames[index]} - DMS License`);
                          }}
                          fullWidth
                          required
                          disabled={handleDisabled(isRejected, isOnboarding, isSuperAdmin, isExistingOrgan, readOnly)}
                        />
                      </Box>
                      <Box className="">
                        <AtomDatePicker
                          control={control}
                          name={`selectedOrgans.${index}.organ_first_level`}
                          label="Organ First Level Registration Date"
                          maxDate={dayjs()}
                          fullWidth
                          required
                          disabled={handleDisabled(isRejected, isOnboarding, isSuperAdmin, isExistingOrgan, readOnly)}
                        />
                      </Box>
                      <Box className="">
                        <AtomDatePicker
                          control={control}
                          name={`selectedOrgans.${index}.license_expiry`}
                          label="License Expiry Date"
                          minDate={dayjs()}
                          fullWidth
                          required
                          disabled={handleDisabled(isRejected, isOnboarding, isSuperAdmin, isExistingOrgan, readOnly)}
                        />
                      </Box>

                      <Box className="">
                        <FormInput
                          control={control}
                          name={`selectedOrgans.${index}.organ_reference_no`}
                          label="Organ License Number"
                          fullWidth
                          required
                          disabled={handleDisabled(isRejected, isOnboarding, isSuperAdmin, isExistingOrgan, readOnly)}
                        />
                      </Box>
                      {/* <Box className="">
                        <FormInput
                          control={control}
                          name={`selectedOrgans.${index}.receipt_number`}
                          label="Payment Receipt Number"
                          fullWidth
                          disabled
                          helperText={
                            !isExistingOrgan ? 'Payment Receipt Number will Generated after the Payment Completed' : ''
                          }
                        />
                      </Box> */}
                      <Input className="!hidden" label="" fullWidth />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
        {reCheck && <FooterButton onSubmit={handleSubmit(onSubmit)} onBack={onBack} isLicense={!forButton} />}
        <OrganLicenseDialog
          open={false}
          organLicense={organData}
          onClose={() => {}}
          currentPosition={1}
          onNext={() => {}}
          onPrevious={() => {}}
          totalItems={2}
        />

        <PreviewFile
          open={openPreview}
          onClose={() => {
            setOpenPreview(false);
          }}
          file={filePreview}
          fileLabel={fileName}
        />
        <ConfirmDialog
          open={confirmDialogOpen}
          message="Are you sure you want to remove this organ from the list?"
          onConfirm={() => {
            if (pendingRemoveId) {
              setSelectedOrganId((prev) => prev.filter((organId) => organId !== pendingRemoveId));
              const indexToRemove = fields.findIndex((field) => field.organId === Number(pendingRemoveId));
              console.log('remove', indexToRemove);

              if (indexToRemove > -1) {
                remove(indexToRemove);
              }
            }
            setPendingRemoveId(null);
            setConfirmDialogOpen(false);
          }}
          onClose={() => {
            setPendingRemoveId(null);
            setConfirmDialogOpen(false);
          }}
        />
      </Box>
    </form>
  );
};

export default ApprovedOrganDoc;
