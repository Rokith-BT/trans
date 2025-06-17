import { Box, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import HospitalDetails from './HospitalDetails';
import HospitalInfras from './HospitalInfras';
import ApprovedOrganDoc from './ApprovedOrganDoc';
import { Checkbox } from '@mui/material';
import FooterButton from './FooterButton';
import AdminDetails from './AdminDetails';
import { AdminDetailsType, HospitalDetailsType, HospitalInfraStructure } from '../validators';
import { useForm } from 'react-hook-form';
// import PaymentDetail from './PaymentDetail';
import SubmittedDialog from '../../view/SubmitDialog';
import { useHospital } from '../../hospitalContext';
import { HospitalApprovedOrganType1 } from '../NonNtorcHospital';
// import WaitingApprovalDialog from './WaitingApprovalDialog';
import { useNavigate } from 'react-router';
import { useRole } from '@/hooks/useRole';

interface RecheckProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line no-unused-vars
  onNext: (data: CombinedFormData) => void;
  onBack: () => void;
  isEditMode?: boolean;
  hospitalType?: string;
  isPenidng?: boolean;
  isTranstan?: boolean;
  forNtorc?: boolean;
}
export type CombinedFormData = {
  adminDetails: AdminDetailsType;
  hospitalDetails: HospitalDetailsType;
  hospitalInfras: HospitalInfraStructure;
  hospitalApprovedOrgans: HospitalApprovedOrganType1;
};

const Recheck: React.FC<RecheckProps> = ({
  onNext,
  onBack,
  formData,
  // isEditMode = false,
  hospitalType,
  // isTranstan,
  forNtorc = false
  // isPenidng = false
}) => {
  const navigate = useNavigate();
  const { isSuperAdmin } = useRole() || {};
  const [isDeclare, setIsDeclare] = useState(false);
  // const [desclareData, setDeclareData] = useState<CombinedFormData>();
  const [openSubmitDialog, setOptenSubmitDialog] = useState(false);
  // const [openWaitingDialog, setOpenWaitingDialog] = useState(false);

  const {
    state: { hospitalId, hospital },
    actions: { updatePaymnetStatus }
  } = useHospital();
  console.log('hospital id ', hospitalId);
  console.log('preview data ', hospital, formData);

  const { handleSubmit, reset } = useForm<CombinedFormData>({
    defaultValues: {
      adminDetails: formData?.adminDetails || {},
      hospitalDetails: hospital?.basicDetails || {},
      hospitalInfras: formData?.hospitalInfras || {},
      hospitalApprovedOrgans: formData?.hospitalApprovedOrgans || {}
    }
  });
  useEffect(() => {
    reset(formData);
    reset({
      hospitalApprovedOrgans: formData?.hospitalApprovedOrgans
    });
  }, [formData, reset]);

  const onSubmit = (data: CombinedFormData) => {
    if (hospitalType === 'Government' || hospitalType === 'NTORC') {
      updatePaymnetStatus((response) => {
        console.log('payment info ', response);
      });
      setOptenSubmitDialog(true);
    } else {
      // setDeclareData(data);
      onNext(data);
    }
  };
  const onCancel = () => {
    onBack();
  };

  const handleClose = () => {
    if (isSuperAdmin) {
      setOptenSubmitDialog(false);
    } else {
      setOptenSubmitDialog(false);
      navigate(0);
      // setOpenWaitingDialog(true);
    }
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    <Box>
      <Box mt={2} px={3}>
        <Text className="!text-xl !font-bold text-[#804595]">Recheck all the Details and Declare</Text>
        <Box>
          <AdminDetails onNext={() => {}} reCheck={false} adminData={formData?.adminDetails} readOnly={true} />
          <HospitalDetails onNext={() => {}} reCheck={false} detailsData={formData?.hospitalDetails} readOnly={true} />
          {!forNtorc && (
            <HospitalInfras
              onBack={() => {}}
              onNext={() => {}}
              reCheck={false}
              infraData={formData?.hospitalInfras}
              readOnly={true}
            />
          )}
          <ApprovedOrganDoc
            onNext={() => {}}
            reCheck={false}
            organData={formData?.hospitalApprovedOrgans}
            readOnly={true}
            isClickable={true}
            isAddLicense={true}
            isOnboarding={false}
            forNtorc={forNtorc}
          />
          {/* {isEditMode && hospitalType !== 'Government' && (
            <PaymentDetail onNext={() => {}} reCheck={false} payData={formData?.hospitalApprovedOrgans} />
          )} */}
        </Box>

        {/* {isPendingApproval && ( */}
        <>
          <Text className="!text- xl !font-bold text-[#804595] !ml-1 !mt-4">Declare</Text>
          <Box mt={2} className="flex items-center">
            <Checkbox onClick={() => setIsDeclare(!isDeclare)} /> &nbsp;
            <Text>
              I accept all the <span className="text-[#C967A2] underline">Terms & Conditions</span>
            </Text>
          </Box>
        </>
        {/* )} */}
      </Box>
      <FooterButton onSubmit={handleSubmit(onSubmit)} isDeclare={isDeclare} isFinalStep={true} onBack={onCancel} />
      <SubmittedDialog open={openSubmitDialog} onClose={handleClose} />
      {/* <WaitingApprovalDialog open={openWaitingDialog} onClose={() => setOpenWaitingDialog(false)} /> */}
    </Box>
    // </form>
  );
};

export default Recheck;
