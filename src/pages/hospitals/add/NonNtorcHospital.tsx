import React, { useEffect, useState } from 'react';
import { Box, Widget } from '@/atoms';
import { Grid } from '@mui/material';
import AdminDetails from './sections/AdminDetails';
import { AdminDetailsType, HospitalApprovedOrganType, HospitalDetailsType, HospitalInfraStructure } from './validators';
import HospitalDetails from './sections/HospitalDetails';
import { useAuth } from '@/routes/RouteContext';
import HospitalInfras from './sections/HospitalInfras';
import ApprovedOrganDoc from './sections/ApprovedOrganDoc';
import Recheck from './sections/Recheck';
import PaymentDetail from './sections/PaymentDetail';
import { useHospital } from '../hospitalContext';
import { Tabs } from '@/utils/tab';
import WaitingApprovalDialog from './sections/WaitingApprovalDialog';
import { useLocation } from 'react-router';
// import { BackIcon } from '@/assets/icons';
import { useRole } from '@/hooks/useRole';
import RejectedDialog from './sections/RejectedDialog';

const tabTexts = {
  step1: 'Admin Details',
  step2: 'Hospital Details',
  step3: 'Hospital Infratstructure',
  step4: 'Organs Documents',
  step5: 'Preview',
  step6: 'Payment Details'
};
export interface OrganDetails {
  dms_license: File;
  organ_first_level: string;
  license_expiry: string;
  organ_reference_no: string;
  receipt_number: string;
  organId?: number;
  organName?: string;
  cost?: number;
}

export interface HospitalApprovedOrganType1 {
  selectedOrgans: OrganDetails[];
}
interface NonNtorcHospitalProps {
  isPendingApproval?: boolean;
}
const NonNtorcHospital: React.FC<NonNtorcHospitalProps> = ({ isPendingApproval = false }) => {
  const location = useLocation();
  // const navigate = useNavigate();
  const { isSuperAdmin, status } = useRole();
  const { state } = location;
  const { isTranstanAdmin } = state || {};
  console.log('isTranstanAdmin', isTranstanAdmin);

  const {
    state: { currentUser }
  } = useAuth();
  console.log('state from current user ', currentUser);

  const {
    state: { admin, hospital }
  } = useHospital();

  const hospitalType = hospital?.basicDetails?.hospitalType?.name;
  // const [activeTab, setActiveTab] = useState<Tabs>(isFiveSteps ? Tabs.HospitalDetails : Tabs.AdminDetails);

  const [activeTab, setActiveTab] = useState<Tabs>(isPendingApproval ? Tabs.Recheck : Tabs.AdminDetails);
  // const [activeTab, setActiveTab] = useState<Tabs>(isPendingApproval ? Tabs.Recheck : Tabs.AdminDetails);

  const [formData, setFormData] = useState<{
    adminDetails?: AdminDetailsType;
    hospitalDetails?: HospitalDetailsType;
    hospitalInfras?: HospitalInfraStructure;
    hospitalApprovedOrgans?: HospitalApprovedOrganType1;
  }>({
    adminDetails: admin,
    hospitalDetails: hospital?.basicDetails,
    hospitalInfras: hospital?.infrastructure,
    hospitalApprovedOrgans: hospital?.organLicences
  });
  const [openWaitingDialog, setOpenWaitingDialog] = useState(false);
  const [openRejectedDialog, setOpenRejectedDialog] = useState(false);
  const [hositalStatus, setHospitalStatus] = useState<string>('PendingApproval');

  useEffect(() => {
    const hospitalStatus = hospital?.basicDetails?.status;
    setHospitalStatus(hospitalStatus);
  }, [hospital, hositalStatus]);

  const hospitalRejectedReason = hospital?.basicDetails?.reason;

  useEffect(() => {
    setFormData({
      adminDetails: admin,
      hospitalDetails: hospital?.basicDetails,
      hospitalInfras: hospital?.infrastructure,
      hospitalApprovedOrgans: hospital?.organLicences
    });
  }, [admin, hospital]);

  useEffect(() => {
    if (!isSuperAdmin && isPendingApproval) {
      setOpenWaitingDialog(true);
    }
  }, [hospital]);
  useEffect(() => {
    if (status === 'Rejected' && !isSuperAdmin) {
      setOpenRejectedDialog(true);
    }
  }, []);
  const handleBack = () => {
    if (activeTab > Tabs.AdminDetails) setActiveTab((prevTab) => prevTab - 1);
  };
  const handleNextforAdmin = (data: AdminDetailsType) => {
    setFormData((prevData) => ({
      ...prevData,
      adminDetails: { ...data }
    }));
    setActiveTab(Tabs.HospitalDetails);
  };
  const handleNextforHospitalDetails = (data: HospitalDetailsType) => {
    const filteredData = {
      ...data,
      hospitalType: data?.hospitalType || currentUser?.hospital?.hospitalType
    };
    setFormData((prevData) => ({
      ...prevData,
      hospitalDetails: {
        ...prevData?.hospitalDetails,
        ...filteredData
      }
    }));
    setActiveTab(Tabs.HospitalInfras);
  };

  const handleNextforInfraDetails = (data: HospitalInfraStructure) => {
    setFormData((prevData) => ({
      ...prevData,
      hospitalInfras: {
        ...prevData?.hospitalInfras,
        ...data
      }
    }));

    setActiveTab(Tabs.ApprovedOrganandDoc);
  };

  const handleNextforOrganApprove = (data: HospitalApprovedOrganType1) => {
    setFormData((prevData) => ({
      ...prevData,
      hospitalApprovedOrgans: data
    }));
    setActiveTab(Tabs.Recheck);
  };

  const handlesubmit = () => {
    if (!isPendingApproval) {
      setActiveTab(Tabs.Payment);
    } else {
      console.log('no need submit while waiting');
    }
  };

  // const handleCancel = () => {
  //   console.log('Not yet implemented');
  // };

  const hanldeNextforTransplant = (data: HospitalApprovedOrganType) => {
    console.log('Not yet implemented: ', data);
  };
  const hosptialStatus =
    hospital?.basicDetails?.status === 'DetailsPending' ||
    hospital?.basicDetails?.status === 'PendingApproval' ||
    hospital?.basicDetails?.status === 'Rejected';
  const isAdmin = currentUser?.userType?.name === 'Transtan';
  const isGovt = hospital?.basicDetails?.hospitalType?.name === 'Private' ? false : true;
  return (
    <Box>
      <Box p={2} className={`${hosptialStatus && isAdmin ? 'mt-[100px]' : ''}`}>
        {!isPendingApproval && (
          <Grid container direction="column" spacing={2} className="relative">
            <Grid item>
              <Box className="absolute top-[-100px] right-10 w-[100%] h-[100%]">
                <Widget numberOfSteps={true} tabTexts={tabTexts} activeTab={activeTab} isGovt={isGovt} />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Box p={2}>
        <Grid container direction="column" spacing={2} className="relative">
          <Grid item>
            <Box px={5}>
              {/* {isSuperAdmin && (
                <BackIcon
                  className="cursor-pointer absolute mb-4 -top-[70px] scale-x-150"
                  onClick={() => navigate('/hospitals')}
                />
              )} */}
              {activeTab === Tabs.AdminDetails && (
                <AdminDetails
                  readOnly={false}
                  onBack={handleBack}
                  onNext={handleNextforAdmin}
                  adminData={formData?.adminDetails}
                />
              )}
              {activeTab === Tabs.HospitalDetails && (
                <HospitalDetails
                  readOnly={false}
                  onNext={handleNextforHospitalDetails}
                  onBack={handleBack}
                  detailsData={formData?.hospitalDetails}
                />
              )}
              {activeTab === Tabs.HospitalInfras && (
                <HospitalInfras
                  readOnly={false}
                  onBack={handleBack}
                  onNext={handleNextforInfraDetails}
                  infraData={formData.hospitalInfras}
                />
              )}
              {activeTab === Tabs.ApprovedOrganandDoc && (
                <ApprovedOrganDoc
                  readOnly={false}
                  onBack={handleBack}
                  onNext={handleNextforOrganApprove}
                  organData={formData?.hospitalApprovedOrgans}
                  isClickable={false}
                  isAddLicense={true}
                  isOnboarding={true}
                  forButton={true}
                />
              )}
              {activeTab === Tabs.Recheck && (
                <Recheck
                  onBack={handleBack}
                  onNext={handlesubmit}
                  formData={formData}
                  isEditMode={true}
                  hospitalType={hospitalType}
                  isPenidng={isPendingApproval}
                  isTranstan={!!currentUser.userRole.id}
                  // Need to re-work on the above value
                />
              )}
              {activeTab === Tabs.Payment && hospitalType !== 'Government' && (
                <PaymentDetail
                  onBack={handleBack}
                  onNext={hanldeNextforTransplant}
                  payData={formData?.hospitalApprovedOrgans}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <WaitingApprovalDialog
        open={openWaitingDialog}
        onClose={() => {
          setOpenWaitingDialog(false);
        }}
      />
      <RejectedDialog
        open={openRejectedDialog}
        onClose={() => setOpenRejectedDialog(false)}
        Reason={hospitalRejectedReason}
      />
    </Box>
  );
};

export default NonNtorcHospital;
