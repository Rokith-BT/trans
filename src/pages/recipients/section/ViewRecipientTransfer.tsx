import { AtomDatePicker, Box, Button, FormFileInput, FormInput, FormSelect, Text } from '@/atoms';
import { useEffect } from 'react';
import data from '@/data/selectData.json';

import ProfileImg from '@/pages/components/ProfileImg';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipientTransferBasicSchema, RecipientTransferBasicType } from './Validators';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { Gender, Organ } from '@/types/common.type';
import { ApproveIcon, DeclineIcon, DocumentDownload, PrintIcon } from '@/assets/icons';
import { useRecipient } from '../RecipientContext';
import { handlePrint } from '../pdf/PrintPDF';

const ViewRecipientTransfer = () => {
  const {
    state: { genders }
  } = useMasterData();
  const genderOptions = genders.map((g: Gender) => ({
    label: g.name,
    value: g.id
  }));
  const {
    state,
    actions: { getRecipientTransferID }
  } = useRecipient();
  const { transferRecipient } = state || {};
  console.log('selectedRecipient', transferRecipient);

  useEffect(() => {
    getRecipientTransferID('1001');
  }, []);

  const { control, watch, setValue, reset } = useForm<RecipientTransferBasicType>({
    resolver: zodResolver(recipientTransferBasicSchema),
    defaultValues: {
      transtanID: '',
      recipientName: '',
      genderId: 1,
      age: '',
      bloodGroup: '',
      currentHospitalName: '',
      transferringHospitalName: '1',
      requestedOrgans: [
        {
          organ: '',
          consultantName: undefined
        }
      ],
      patientDeclaration: undefined,
      doctorDeclaration: undefined,
      dateofBirth: ''
    }
  });
  const { fields, append } = useFieldArray({ control, name: 'requestedOrgans' });
  useEffect(() => {
    if (transferRecipient) {
      console.log('selected recipient gender ', transferRecipient?.gender);
      reset({
        transtanID: transferRecipient.transtanId || '',
        recipientName: transferRecipient.recipientName || '',
        genderId: 2,
        age: transferRecipient.age ? transferRecipient.age.toString() : '',
        bloodGroup: (transferRecipient.bloodGroup?.id === 3 && 'B+') || '',
        currentHospitalName: transferRecipient.currentHospital?.name || '',
        transferringHospitalName: transferRecipient?.transferringHospital?.name || '',
        requestedOrgans: transferRecipient.organMappings?.map(
          (organ: Organ & { organId: number; currentConsultantId: number }) => ({
            organ: organ.organId,
            consultantName: organ.currentConsultantId
          })
        ),
        dateofBirth: transferRecipient.dateOfBirth || ''
      });
    }
  }, [transferRecipient, reset, append]);

  const dateOfBirth = watch('dateofBirth');

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

  //   useEffect(() => {
  //     setTimeout(() => {
  //       setWaitingDialog(false);
  //     }, 1500);
  //   }, []);

  const handlePrintPDF = async () => {
    await handlePrint([], [], [], [], transferRecipient, true);
  };

  return (
    <Box px={5} className="mt-16">
      <Box className="flex flex-wrap w-full ">
        <Box className="flex w-full md:w-1/3  justify-center  ">
          <ProfileImg />
        </Box>
        <Box className="w-full md:w-2/3 gap-y-[32px] mb-[38px] flex flex-wrap">
          <Box className="flex flex-col w-full md:w-1/2 gap-x-4 md:px-[20px]">
            <FormInput
              control={control}
              name="recipientName"
              label="Recipient Name"
              placeholder="Enter Recipient Name"
              fullWidth
            />
          </Box>
          <Box className=" md:w-1/2 w-full  md:px-[28px] md:pr-[18px]">
            <FormInput
              control={control}
              name="transtanID"
              label="TRANSTAN ID"
              placeholder="Enter TRANSTAN ID"
              fullWidth
            />
          </Box>
          <Box className=" md:w-1/2 w-full  md:px-[18px] md:pr-[18px]">
            <FormSelect menuOptions={genderOptions} control={control} name="genderId" label="Gender" fullWidth />
          </Box>
          <Box className=" md:w-1/2 w-full  md:px-[28px] md:pr-[18px]">
            <FormSelect
              menuOptions={data.bloodGroupOptions}
              control={control}
              name="bloodGroup"
              label="Blood group"
              fullWidth
            />
          </Box>
        </Box>
        <Box className="w-full gap-y-[32px]  flex flex-wrap">
          <Box className="md:w-1/3 w-full  md:pr-[18px]">
            <AtomDatePicker control={control} name="dateofBirth" label="Date Of Birth" fullWidth />
          </Box>
          <Box className="md:w-1/3 w-full   md:px-[18px] md:pr-[18px]">
            <FormInput control={control} name="age" label="Age" fullWidth />
          </Box>
          <Box className="md:w-1/3 w-full md:px-[28px] md:pr-[18px]">
            <FormInput control={control} name="currentHospitalName" label="Current Hospital Name" fullWidth />
          </Box>
          <Box className="md:w-1/3 w-full  md:pr-[18px]">
            <FormSelect
              menuOptions={[{ label: 'Kumaran Hospitals P Ltd', value: 'Kumaran Hospitals P Ltd' }]}
              control={control}
              name="transferringHospitalName"
              label="Transferring Hospital Name"
              //   onChange={(e) => {
              //     console.log('optionsss', e.target.value);

              //     e.target.value === '2' ? setOpenAlertDialog(true) : '';
              //   }}
              fullWidth
            />
          </Box>
        </Box>
        <Text className="text-[#804595] w-full !text-[19px] !mb-[28px] !mt-[40px]  !font-[700]">Organ Requested</Text>
        <Box className="w-full mb-[40px] flex flex-col">
          {fields.map((field, index) => (
            <Box key={field.id} className=" mb-[28px] md:w-2/3 flex flex-wrap  gap-y-[32px]">
              <Box className="md:w-1/2 w-full md:pr-[18px]">
                <FormInput control={control} name={`requestedOrgans.${index}.organ`} label="Organ" fullWidth />
              </Box>
              <Box className="md:w-1/2 w-full md:px-[18px]">
                <FormSelect
                  menuOptions={data.numberOption}
                  control={control}
                  name={`requestedOrgans.${index}.consultantName`}
                  label="Consultant Name"
                  fullWidth
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Text className="text-[#804595] w-full !font-[700] !mb-[28px] !text-[19px]">Attachments</Text>
        <Box className=" md:w-2/3  flex flex-wrap  gap-y-[32px]">
          <Box className="md:w-1/2 w-full md:pr-[18px] ">
            <FormFileInput control={control} name="patientDeclaration" label="Patient Declaration" fullWidth />
          </Box>
          <Box className="md:w-1/2 w-full md:px-[18px]">
            <FormFileInput control={control} name="doctorDeclaration" label="Doctor Declaration" fullWidth />
          </Box>
        </Box>
      </Box>
      <Box className="my-[60px]">
        <Box className="flex items-center justify-between ">
          <Text className="text-[#804595]  !font-[700] !mb-[28px] !text-[19px]">Payment Details</Text>
          <Text className="text-[#80459580]  !font-[700] !mb-[28px] !text-[19px]"> Amount (₹)</Text>
        </Box>
        <Box className="flex items-center justify-between ">
          <Text className="text-[#804595]  !font-[700] !mb-[28px] !text-[16px]">Transferring Fees</Text>
          <Text className="text-[#804595]  !font-[700] !mb-[28px] !text-[16px]">3,000.00</Text>
        </Box>

        <hr className="!h-[2px]  !bg-[#A1999F]" />
        <Box className="flex items-center justify-between  mt-[16px]">
          <Text className="text-[#C967A2]  !font-[700] !mb-[28px] !text-[16px]">Total Amount to be Paid</Text>
          <Text className="text-[#C967A2]  !font-[700] !mb-[28px] !text-[16px]">₹ 3,000.00</Text>
        </Box>
        <Box>
          <Text>Note:-</Text>
          <ul className="mt-[18px] !pl-[18px] list-disc">
            <li>
              First verify the Aadhar ID for authentication. Patient personal details will be automatically generated.
            </li>
            <li> Then continue to fill the medical details.</li>
            <li> Payment gateway page will open after you submit the registration form.</li>
            <li> Incomplete registration form will not open the payment gateway.</li>
          </ul>
        </Box>
      </Box>
      <Box className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
        <Button
          variant="outlined"
          className="w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]"
          onClick={handlePrintPDF}
        >
          <PrintIcon /> Print
        </Button>
        <Button variant="outlined" className="w-[150px] h-[40px] !border-[#D876A9] !text-[#D876A9]">
          <DocumentDownload /> Download
        </Button>
        <Button
          variant="outlined"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323]"
          // onClick={() => setdeclainDialog(true)}
        >
          <DeclineIcon /> Decline
        </Button>
        <Button
          variant="contained"
          className="w-[164px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
          // onClick={() => setApproveDialog(true)}
        >
          <ApproveIcon /> Approve
        </Button>
      </Box>
    </Box>
  );
};
export default ViewRecipientTransfer;
