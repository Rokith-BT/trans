import { Box, Button, CustomDialog, FormInput, Text } from '@/atoms';
import { CustomFormChip } from '@/pages/components/CustomChip';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMasterData } from '../masterCotext';
import { Organ } from '@/types/common.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MultiOrgansList } from '@/types/setup';
import { toast } from '@/utils/toast';
import { useLocation } from 'react-router';
import QS from 'query-string';
import AtomRadio from '@/atoms/radio/Radio';
import { FormAtomRadioGroup } from '@/pages/components/AtomRadioGroup';

const multiOrganSchema = z.object({
  multiorgan: z.array(z.string().min(1)).min(1, 'Select at least one Organ')
});
// const IsTissueEnum = z.enum(['0', '1']);
const organSchema = z.object({
  name: z.string({ required_error: 'Enter Organ Name' }).min(2, 'Enter Organ Name'),
  // isTissue: z.union([z.literal(0), z.literal(1)], { required_error: 'Choose is tissue or not? ' }),
  // isTissue: IsTissueEnum.transform((val) => parseInt(val)).refine((val) => val === 0 || val === 1, {
  //   message: 'Choose if it is tissue or not'
  // }),
  isTissue: z
    .string()
    .transform((val) => val === 'true')
    .refine((val) => val === true || val === false, { message: 'isTissue is required' }),
  isPaymentRequired: z
    .string()
    .transform((val) => val === 'true')
    .refine((val) => val === true || val === false, { message: 'isPaymentRequired is required' }),
  isLicenceAvailable: z
    .string()
    .transform((val) => val === 'true')
    .refine((val) => val === true || val === false, { message: 'isLicenceAvailable is required' }),
  isAllocationAvailble: z
    .string()
    .transform((val) => val === 'true')
    .refine((val) => val === true || val === false, { message: 'isAllocationAvailble is required' }),

  cost: z.number({ required_error: 'Enter the Cost' })
});
type FormValues = z.infer<typeof multiOrganSchema>;
type OrganFormValues = z.infer<typeof organSchema>;

interface AddNewDialogProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  addNewMultiOrgan?: (organId: string) => void;
  selectedRow?: MultiOrgansList | null;
  selectedOrganData?: Organ | null;
  // eslint-disable-next-line no-unused-vars
  addOrgan?: (data: OrganFormValues) => void;
  isMultiOrgan?: boolean;
}

const AddNewDialog: React.FC<AddNewDialogProps> = ({
  open,
  onClose,
  addNewMultiOrgan,
  selectedRow = null,
  selectedOrganData = null,
  addOrgan,
  isMultiOrgan = false
}) => {
  const location = useLocation();
  const parsedQs = QS.parse(location.search);
  const {
    state: { organs },
    action: { editMultiOrgan, getOrgans, getAllOrganList, patchOrgans }
  } = useMasterData();

  // Single-Organ Form
  const singleForm = useForm<OrganFormValues>({
    resolver: zodResolver(organSchema),
    defaultValues: {
      name: '',
      isTissue: undefined,
      isAllocationAvailble: undefined,
      isLicenceAvailable: undefined,
      isPaymentRequired: undefined,
      cost: 0
    }
  });

  // Multi-Organ Form
  const multiForm = useForm<FormValues>({
    resolver: zodResolver(multiOrganSchema),
    defaultValues: { multiorgan: [] }
  });

  useEffect(() => {
    if (!open) return;

    if (isMultiOrgan) {
      // prepare multi-organ values
      const idArray = selectedRow?.organId.split(',').map(Number) || [];
      const selectedNames = idArray
        .map((id) => organs.find((o: Organ) => o.id === id)?.name)
        .filter((n): n is string => !!n);
      multiForm.reset({ multiorgan: selectedNames });
    } else {
      // prepare single-organ values
      if (selectedOrganData) {
        singleForm.reset({
          name: selectedOrganData.name,
          isTissue: selectedOrganData.isTissue || false,
          isAllocationAvailble: selectedOrganData.isAllocationAvailble || false,
          isLicenceAvailable: selectedOrganData.isLicenceAvailable || false,
          isPaymentRequired: selectedOrganData.isPaymentRequired || false,
          cost: selectedOrganData.cost || 0
        });
      } else {
        singleForm.reset({
          name: '',
          isTissue: undefined,
          isAllocationAvailble: undefined,
          isLicenceAvailable: undefined,
          isPaymentRequired: undefined,
          cost: 0
        });
      }
    }
  }, [open, selectedRow, selectedOrganData, organs]);

  // const organOptions = organs.map((o: Organ) => o.name || []);
  useEffect(() => {
    getOrgans({ _all: true });
  }, []);

  const onSubmitMulti: SubmitHandler<FormValues> = (data) => {
    const selectedIds = data.multiorgan
      .map((name) => organs.find((o: Organ) => o.name === name)?.id)
      .filter((id): id is number => typeof id === 'number');
    const organIdString = selectedIds.join(',');
    if (selectedRow) {
      editMultiOrgan(selectedRow.id, { organId: organIdString, name: selectedRow.name }, () => {
        toast('MultiOrgans Updated Successfully', 'success');
      });
    } else {
      addNewMultiOrgan?.(organIdString);
    }
    onClose();
  };

  const onSubmitSingle: SubmitHandler<OrganFormValues> = (data) => {
    if (data.isPaymentRequired === true && data.cost <= 0) {
      toast('Cost should be greater than 0', 'error');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      name: data.name,
      isTissue: data.isTissue,
      cost: data.cost,
      isActive: data.isTissue,
      isLicenceAvailable: data.isLicenceAvailable,
      isAllocationAvailble: data.isAllocationAvailble,
      isPaymentRequired: data.isPaymentRequired
    };

    if (selectedOrganData) {
      // send edited payload to patchOrgans with the existing id
      patchOrgans?.(payload, selectedOrganData.id, () => {
        toast('Organ Details Updated Successfully', 'success');
        getAllOrganList(parsedQs);
      });
    } else {
      addOrgan?.({ ...payload, id: 0 });
    }
    onClose();
  };
  console.log('selected', selectedRow);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth={isMultiOrgan ? 'sm' : 'xs'}>
      {isMultiOrgan ? (
        <form onSubmit={multiForm.handleSubmit(onSubmitMulti)}>
          <CustomFormChip
            control={multiForm.control}
            name="multiorgan"
            label="MultiOrgan"
            options={organs.map((o: Organ) => o.name || '')}
            isSetup
          />
          <Box className="flex items-center justify-between gap-4 mt-7">
            <Button variant="outlined" onClick={onClose} className="w-full h-11">
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="w-full h-11">
              Save
            </Button>
          </Box>
        </form>
      ) : (
        <form onSubmit={singleForm.handleSubmit(onSubmitSingle)}>
          <Box className="flex flex-col gap-4">
            <Text className="!text-[19px] !font-bold text-[#804595]">
              {selectedOrganData ? 'Edit Organ' : 'Add Organ'}
            </Text>
            <FormInput control={singleForm.control} name="name" label="Organ Name" fullWidth required />
            <Box className="grid grid-cols-2 gap-4">
              <FormAtomRadioGroup control={singleForm.control} name="isTissue" label="Tissue" row>
                <AtomRadio label="Yes" value="true" />
                <AtomRadio label="No" value="false" />
              </FormAtomRadioGroup>
              <FormAtomRadioGroup control={singleForm.control} name="isPaymentRequired" label="Payment Required" row>
                <AtomRadio label="Yes" value="true" />
                <AtomRadio label="No" value="false" />
              </FormAtomRadioGroup>
              <FormAtomRadioGroup control={singleForm.control} name="isLicenceAvailable" label="Licence Available" row>
                <AtomRadio label="Yes" value="true" />
                <AtomRadio label="No" value="false" />
              </FormAtomRadioGroup>
              <FormAtomRadioGroup
                control={singleForm.control}
                name="isAllocationAvailble"
                label="Allocation Availble"
                row
              >
                <AtomRadio label="Yes" value="true" />
                <AtomRadio label="No" value="false" />
              </FormAtomRadioGroup>
            </Box>
            <FormInput control={singleForm.control} type="number" name="cost" label="Cost" fullWidth />
          </Box>
          <Box className="flex items-center justify-between gap-4 mt-7">
            <Button variant="outlined" onClick={onClose} className="w-full h-11">
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="w-full h-11">
              Save
            </Button>
          </Box>
        </form>
      )}
    </CustomDialog>
  );
};

export default AddNewDialog;
