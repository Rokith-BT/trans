import {
  AtomDatePicker,
  Box,
  Button,
  FormAutoCompleteSelect,
  FormFileInput,
  FormInput,
  FormSelect,
  Text
} from '@/atoms';
import ProfileImg from '@/pages/components/ProfileImg';
import { recipientTransferBasicSchema, RecipientTransferBasicType } from './Validators';
import { useFieldArray, useForm } from 'react-hook-form';
import { CloseCircleIcon, DeactivatedIcon, FailedIcon, InforCircleIcon } from '@/assets/icons';
import { useMasterData } from '@/pages/settings/setups/masterCotext';
import { ConsultantList, Gender } from '@/types/common.type';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import RecipientPaymentDialog from './RecipientPaymentDialog';
import AlertDialog from '@/pages/components/AlertDialog';
import { RecipientVerifyOTP, TransferData } from '@/types/recipient';
import { useLocation, useNavigate } from 'react-router';
import { toast } from '@/utils/toast';
import { useRecipient } from '../RecipientContext';
import PreviewFile from '@/pages/components/FilePreview';

interface RecipientBasicDeatilsProps {
  // eslint-disable-next-line no-unused-vars
  setOtpVerified: (value: boolean) => void;
  transtanID: string;
  recipientData: RecipientVerifyOTP;
  readOnly?: boolean;
}
//for transfering hospital error
const Content = () => {
  return (
    <Box className="relative">
      <CloseCircleIcon toolText="Close" className="absolute -right-3 -top-3" />
      <Box className="flex items-center justify-center flex-col gap-[28px]">
        <DeactivatedIcon className="cursor-pointer h-[120px] w-[120px] " />
        <Text className="text-[#A1999F] !text-[16px] font-[500]">
          Transferring Hospital does not have Heart License
        </Text>
      </Box>
    </Box>
  );
};
console.log('content for dialog ', Content);

//payment error
const PaymentRetry = () => {
  return (
    <Box>
      <Box className="flex items-center justify-center flex-col gap-[8px]">
        <FailedIcon />
        <Text className="text-[#1A0616] !text-[16px] !font-[400]">Transaction Failed</Text>
      </Box>
    </Box>
  );
};

//for otpfailed dialod
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const OtpFailed = () => {
  return (
    <Box className="relative">
      <CloseCircleIcon toolText="Close" className="absolute -right-3 -top-3" />
      <DeactivatedIcon />
      <Text className="text-[#1A0616]">You have entered an invalid OTP more than three times.</Text>
      <Text className="text-[#1A0616]">Contact TRANSTAN Admin</Text>
    </Box>
  );
};

const RecipientBasicDeatils: React.FC<RecipientBasicDeatilsProps> = ({
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  setOtpVerified,
  // eslint-disable-next-line react/prop-types
  transtanID,
  recipientData,
  readOnly
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isEdit } = location.state || {};
  const [openPayment, setOpenPayment] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [transHospitalId, setTransHospitalId] = useState<number | string | undefined>(
    recipientData?.transferringHospital?.id
  );
  const [fileUpload, setFileUpload] = useState('');
  const [transferData, setTransferData] = useState<TransferData>();
  const [openPreview, setOpenPreview] = useState(false);
  //  const [filePreview, setFilePreview] = useState('');
  const [fileName, setFileName] = useState('');
  console.log(fileUpload);

  const {
    state: { genders, bloodGroup, consultants },
    action: { getConsultantByHospitalId }
  } = useMasterData();
  const {
    state: { transferHospitals },
    actions: { getAllAvailbaleHospitals, editRecipientTransfer }
  } = useRecipient();

  const hospitalNamesOption = transferHospitals?.map((h: Gender) => ({
    label: h.name,
    value: h.id
  }));

  //recipient get by id
  console.log('selected Recipient ', transtanID);
  const consultataOptions =
    Array.isArray(consultants) && consultants.length > 0
      ? consultants.map((c: ConsultantList) => ({
          label: c.userName,
          value: c.userID
        }))
      : [];
  const [selectedConsultant, setSelectedConsultant] = useState(consultataOptions);
  const recipientID = recipientData.recipientId ?? 0;
  useEffect(() => {
    getAllAvailbaleHospitals(recipientID);
    console.log('ttt', transferHospitals);

    if (transHospitalId) {
      getConsultantByHospitalId(transHospitalId, (res) => {
        if (Array.isArray(res.doctors)) {
          const consultantOptions = res.doctors.map((c: ConsultantList) => ({
            label: c.userName,
            value: c.userID
          }));
          setSelectedConsultant(consultantOptions);
        } else {
          setSelectedConsultant([]); // Set empty array if no consultants are available
        }
      });
    }
  }, [transHospitalId, recipientData]);

  const filteredHospitalNames = hospitalNamesOption.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (hospital: any) => hospital.value !== recipientData?.currentHospital?.id
  );

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    formState: { errors }
  } = useForm<RecipientTransferBasicType>({
    resolver: zodResolver(recipientTransferBasicSchema),
    defaultValues: {
      transtanID: '',
      recipientName: '',
      genderId: 0,
      age: '',
      bloodGroupId: 0,
      currentHospitalName: '',
      transferringHospitalName: 0,
      organMappings: [
        {
          organId: { id: 0, name: '' },
          currentConsultantId: 0,
          transferringConsultantId: 0
        }
      ],
      patientDeclarationDoc: '',
      doctorDeclarationDoc: '',
      dateofBirth: ''
    }
  });

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { fields, append } = useFieldArray({ control, name: 'organMappings' });
  const watchPatientDeclartaion = recipientData?.patientDeclarationDoc;
  const watchDoctorDeclaration = recipientData?.doctorDeclarationDoc;

  useEffect(() => {
    if (recipientData) {
      console.log('ddd', recipientData);
      console.log('Organ mappings from recipientData:', recipientData?.organMappings);
      reset({
        transtanID: recipientData?.transtanId || '',
        recipientName: recipientData?.recipientName || '',
        genderId: recipientData?.gender?.id,
        age: recipientData.age ? recipientData?.age.toString() : '',
        bloodGroupId: recipientData?.bloodGroup?.id || undefined,
        currentHospitalName: recipientData?.currentHospital?.name || '',
        // transferringHospitalName: 0,
        organMappings:
          recipientData?.organMappings?.map((mapping) => ({
            organId: { id: mapping?.organId?.id, name: mapping?.organId?.name },
            currentConsultantId: mapping.currentConsultantId || 0,
            transferringConsultantId: mapping.transferringConsultantId || 0
          })) || [],
        patientDeclarationDoc: recipientData?.patientDeclarationDoc ?? '',
        doctorDeclarationDoc: recipientData?.doctorDeclarationDoc ?? '',
        dateofBirth: recipientData?.dateofBirth || '',
        transferringHospitalName: recipientData?.transferringHospital?.id || ''
      });
    }
    setValue('bloodGroupId', recipientData?.bloodGroup?.id);
    setValue('genderId', recipientData?.gender?.id);
  }, [recipientData, reset]);

  const dateOfBirth = watch('dateofBirth');
  // const isInvalidDOB = dateOfBirth === '0001-01-01T00:00:00';
  // if (isInvalidDOB) {
  //   setValue('dateOfBirth', '');
  // }

  const getAvailableConsultants = (index: number) => {
    const selectedConsultantIds = watch('organMappings').map((field) => field?.transferringConsultantId) || [];
    return selectedConsultant.filter(
      (consultant) =>
        !selectedConsultantIds.includes(consultant.value) ||
        consultant.value === watch(`organMappings.${index}.transferringConsultantId`)
    );
  };

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: RecipientTransferBasicType) => {
    console.log('transfer data ', data);
    if (data?.organMappings?.length === 0) {
      toast('There is no Organ Requested', 'error');
      return;
    }

    const payload: TransferData = {
      recipientId: recipientData?.recipientId || 0,
      currentHospitalId: recipientData?.currentHospital?.id || 0,
      transferringHospitalId: data.transferringHospitalName || 0,
      patientDeclarationDoc: data.patientDeclarationDoc,
      doctorDeclarationDoc: data.doctorDeclarationDoc,
      isPhoneNumber1Verified: true,
      isPaymentCompleted: true,
      organMappings: data.organMappings.map((mapping) => ({
        organId: { id: mapping?.organId.id, name: mapping?.organId?.name },
        currentConsultantId: mapping?.currentConsultantId,
        transferringConsultantId: mapping?.transferringConsultantId
      }))
    };
    if (isEdit) {
      editRecipientTransfer(recipientData?.recipientId, payload, () => {
        navigate('/recipients/manage-transfer');
      });
    } else {
      setOpenPayment(true);
    }
    console.log('payload from recipient transfer submit ', payload);
    setTransferData(payload);
    // recipientTransfer(recipientData.recipientId, payload);
  };

  const filePath = `/recipients/${recipientData?.recipientId}/transfer`;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mt={2}>
        {/* {Object.keys(errors).length > 0 && <pre>{JSON.stringify(errors, null, 2)}</pre>} */}
        <Box className="flex gap-2 items-center mb-[40px]">
          {/* <BackIcon
            onClick={() => {
              setOtpVerified(false);
              navigate(-1);
            }}
          /> */}
          <Text className="text-[#804595] !text-[19px]  !font-[700]">Recipient Transfer Details</Text>
        </Box>
        <Box className="flex flex-wrap w-full ">
          <Box className="flex w-full md:w-1/3 mb-[16px] md:mb-[0px] justify-center  ">
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
                disabled
              />
            </Box>
            <Box className=" md:w-1/2 w-full  md:px-[28px] md:pr-[18px]">
              <FormInput
                control={control}
                name="transtanID"
                label="TRANSTAN ID"
                placeholder="Enter TRANSTAN ID"
                fullWidth
                disabled
              />
            </Box>
            <Box className=" md:w-1/2 w-full  md:px-[18px] md:pr-[18px]">
              <FormSelect menuOptions={genders} control={control} name="genderId" label="Gender" fullWidth disabled />
            </Box>
            <Box className=" md:w-1/2 w-full  md:px-[28px] md:pr-[18px]">
              <FormSelect
                menuOptions={bloodGroup}
                control={control}
                name="bloodGroupId"
                label="Blood group"
                fullWidth
                disabled
              />
            </Box>
          </Box>
          <Box className="w-full gap-y-[32px]  flex flex-wrap">
            <Box className="md:w-1/3 w-full  md:pr-[18px]">
              <AtomDatePicker control={control} name="dateofBirth" label="Date Of Birth" fullWidth disabled />
            </Box>
            <Box className="md:w-1/3 w-full   md:px-[18px] md:pr-[18px]">
              <FormInput control={control} name="age" label="Age" fullWidth disabled />
            </Box>
            <Box className="md:w-1/3 w-full md:px-[28px] md:pr-[18px]">
              <FormInput
                control={control}
                name="currentHospitalName"
                label="Current Hospital Name"
                fullWidth
                disabled
              />
            </Box>
            <Box className="md:w-1/3 w-full  md:pr-[18px]">
              {/* <FormSelect
                menuOptions={hospitalNamesOption}
                control={control}
                name="transferringHospitalName"
                label="Transferring Hospital Name"
                fullWidth
              /> */}
              <FormAutoCompleteSelect
                menuOptions={filteredHospitalNames}
                control={control}
                name="transferringHospitalName"
                label="Transferring Hospital Name"
                onChange={(e) => {
                  setTransHospitalId(e?.value);
                }}
                disabled={readOnly}
              />
            </Box>
          </Box>
          <Text className="text-[#804595] w-full !text-[19px] !mb-[28px] !mt-[40px]  !font-[700]">Organ Requested</Text>
          <Box className="w-full mb-[40px] flex flex-col">
            {fields.length > 0
              ? fields.map((field, index) => {
                  console.log('Rendering field:', field);
                  return (
                    <Box key={field.id} className="mb-[28px] md:w-2/3 flex flex-wrap gap-y-[32px]">
                      <Box className="md:w-1/2 w-full md:pr-[18px] ">
                        <FormInput
                          control={control}
                          name={`organMappings.${index}.organId.name`}
                          label="Organ"
                          fullWidth
                          disabled
                        />
                      </Box>
                      <Box className="md:w-1/2 w-full md:px-[18px]">
                        <FormSelect
                          menuOptions={getAvailableConsultants(index)}
                          control={control}
                          name={`organMappings.${index}.transferringConsultantId`}
                          onChange={(selectedOption) => {
                            setValue(`organMappings.${index}.transferringConsultantId`, selectedOption?.value);
                          }}
                          label="Consultant Name"
                          fullWidth
                          disabled={readOnly}
                        />
                      </Box>
                    </Box>
                  );
                })
              : 'Currently requested organs are not available'}
          </Box>
          <Text className="text-[#804595] w-full !font-[700] !mb-[28px] !text-[19px]">Attachments</Text>
          <Box className=" md:w-2/3  flex flex-wrap  gap-y-[32px]">
            <Box className="md:w-1/2 w-full md:pr-[18px] ">
              <FormFileInput
                control={control}
                name="patientDeclarationDoc"
                label="Patient Declaration"
                filePath={filePath}
                setOpenImgModal={setOpenPreview}
                setFile={setFileUpload}
                setPreviewName={() => setFileName('Patient Declaration')}
                fileData={watchPatientDeclartaion || recipientData?.patientDeclarationDoc}
                fullWidth
                required
                disabled={isEdit ? false : readOnly}
              />
            </Box>
            <Box className="md:w-1/2 w-full md:px-[18px]">
              <FormFileInput
                control={control}
                name="doctorDeclarationDoc"
                label="Doctor Declaration"
                filePath={filePath}
                fileData={watchDoctorDeclaration || recipientData?.doctorDeclarationDoc}
                setOpenImgModal={setOpenPreview}
                setFile={setFileUpload}
                setPreviewName={() => setFileName('Doctor Declaration')}
                fullWidth
                required
                disabled={isEdit ? false : readOnly}
              />
            </Box>
          </Box>
        </Box>
        {!isEdit ? (
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
              <Text className="text-[#C967A2]  !font-[700] !mb-[28px] !text-[16px] flex flex-col">
                ₹ 3,000.00
                {readOnly && (
                  <Box className="flex items-center gap-2">
                    <InforCircleIcon className="cursor-pointer" />
                    <Text className="text-[#027545] bg-[#CFEEBC] px-[8px] py-[2px] rounded-[12px]"> Paid</Text>
                  </Box>
                )}
              </Text>
            </Box>
            {!readOnly && (
              <Box>
                <Text>Note:-</Text>
                <ul className="mt-[18px] !pl-[18px] list-disc">
                  <li>
                    First verify the Aadhar ID for authentication. Patient personal details will be automatically
                    generated.
                  </li>
                  <li> Then continue to fill the medical details.</li>
                  <li> Payment gateway page will open after you submit the registration form.</li>
                  <li> Incomplete registration form will not open the payment gateway.</li>
                </ul>
              </Box>
            )}
          </Box>
        ) : (
          <Box className="flex items-center justify-end my-[40px] gap-4">
            <Button variant="outlined" className="w-[150px]" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              className="w-[150px] !bg-[#D876A9] !text-[#F8F8FF]"
              onClick={handleSubmit(onSubmit)}
            >
              Update
            </Button>
          </Box>
        )}
        {!readOnly && (
          <Box className="flex items-center justify-end mb-[40px]">
            <Button
              variant="contained"
              className="w-[350px] !bg-[#D876A9] !text-[#F8F8FF]"
              type="submit"
              onClick={handleSubmit(onSubmit)}
            >
              Make Payment
            </Button>
          </Box>
        )}
      </Box>
      <RecipientPaymentDialog open={openPayment} onClose={() => setOpenPayment(false)} TransferData={transferData} />
      <AlertDialog
        // openAlertDialog
        open={openAlertDialog}
        onClose={() => {
          setOpenAlertDialog(false);
        }}
        // content={<Content />}
        content={<PaymentRetry />}
        dialogWidth="xs"
      />
      <PreviewFile open={openPreview} onClose={() => setOpenPreview(false)} file={fileUpload} fileLabel={fileName} />
    </form>
  );
};

export default RecipientBasicDeatils;
