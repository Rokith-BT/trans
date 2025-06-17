import { Box, Text, Widget2 } from '@/atoms';
import React, { useEffect, useState } from 'react';
import AdminDetails from './sections/AdminDetails';
import { AdminDetailsType } from './validators';
import { HospitalApprovedOrganType1 } from './NonNtorcHospital';
import { useHospital } from '../hospitalContext';
import { NtorcTabs } from '@/utils/tab';
import NtorcHospital from './sections/NtorcHospital';
// import { useNavigate } from 'react-router';
// import { BackIcon } from '@/assets/icons';
import ApprovedOrganDoc from './sections/ApprovedOrganDoc';
import Recheck from './sections/Recheck';
import { useRole } from '@/hooks/useRole';
import { BasicDetails } from '@/types/hospital';
import RejectedDialog from './sections/RejectedDialog';

interface NtorcStepperProps {
  isPenidngApproval?: boolean;
}
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const NtorcStepper: React.FC<NtorcStepperProps> = ({ isPenidngApproval = false }) => {
  // const navigate = useNavigate();
  const { isSuperAdmin, status } = useRole();
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const {
    state: { admin, hospital }
  } = useHospital();
  const [activeTab, setActiveTab] = useState<NtorcTabs>(NtorcTabs.AdminDetails);
  const [formData, setFormData] = useState<{
    adminDetails: AdminDetailsType;
    hospitalDetails: BasicDetails;
    hospitalApprovedOrgans: HospitalApprovedOrganType1;
  }>({
    adminDetails: admin,
    hospitalDetails: hospital?.basicDetails,
    hospitalApprovedOrgans: hospital?.organLicences
  });

  useEffect(() => {
    setFormData({
      adminDetails: admin,
      hospitalDetails: hospital?.basicDetails,
      hospitalApprovedOrgans: hospital?.organLicences
    });
  }, [admin, hospital]);
  //rejected reason
  const rejectedReason = hospital?.basicDetails?.reason;
  const isRejected = status === 'Rejected';

  useEffect(() => {
    if (isRejected) {
      setOpenRejectDialog(true);
    }
  }, []);

  const handleNextForNtorcAdmin = (data: AdminDetailsType) => {
    setFormData((prevData) => ({
      ...prevData,
      adminDetails: { ...data }
    }));
    setActiveTab(NtorcTabs.HospitalDetails);
  };
  const handleNextForNtorDetails = (data: BasicDetails) => {
    setFormData((prevData) => ({
      ...prevData,
      hospitalDetails: { ...data }
    }));
    setActiveTab(NtorcTabs.ApprovedOrganandDoc);
  };
  const handleNextForTissues = (data: HospitalApprovedOrganType1) => {
    setFormData((prevData) => ({
      ...prevData,
      hospitalApprovedOrgans: { ...data }
    }));
    setActiveTab(NtorcTabs.Recheck);
  };
  const handleNextForPreview = () => {
    console.log('hello');
  };
  const handleBack = () => {
    if (activeTab > NtorcTabs.AdminDetails) setActiveTab((prevTab) => prevTab - 1);
  };

  const tabTexts = [
    { number: 1, text: 'Admin Details' },
    { number: 2, text: 'Hospital Details' },
    { number: 3, text: 'Tissues' },
    { number: 4, text: 'Preview' }
  ];
  return (
    <Box px={5} py={2} className="relative">
      <Box className="sticky top-0 bg-white py-3 w-full z-10 border-b border-[#E5E5E5]">
        <Text className="!text-[19px] text-[#804595] !mb-[28px] !font-bold flex gap-4 items-center">
          Hospital Name :
          {hospital?.basicDetails?.hospitalName ?? 'NA'}
        </Text>
        <Box
          className={`absolute  w-[100%] ${isSuperAdmin ? '-top-1 right-0' : '-top-5 right-0'} -z-[2] h-[23vh] bg-[white] `}
        >
          <Widget2 activeTab={activeTab} steps={tabTexts} />
        </Box>
      </Box>
      <Box className="mt-[13vh]">
        {activeTab === NtorcTabs.AdminDetails && (
          <AdminDetails onNext={handleNextForNtorcAdmin} adminData={formData.adminDetails} readOnly={false} />
        )}
        {activeTab === NtorcTabs.HospitalDetails && (
          <NtorcHospital
            ntorcData={formData.hospitalDetails}
            readOnly={false}
            onNext={handleNextForNtorDetails}
            onBack={handleBack}
          />
        )}
        {activeTab === NtorcTabs.ApprovedOrganandDoc && (
          <ApprovedOrganDoc
            onNext={handleNextForTissues}
            onBack={handleBack}
            forButton={true}
            forNtorc={true}
            organData={formData.hospitalApprovedOrgans}
            readOnly={false}
            isOnboarding={true}
            isClickable={false}
          />
        )}
        {activeTab === NtorcTabs.Recheck && (
          <Recheck
            formData={formData}
            onNext={handleNextForPreview}
            onBack={handleBack}
            forNtorc={true}
            hospitalType="Government"
          />
        )}
      </Box>
      <RejectedDialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} Reason={rejectedReason} />
    </Box>
  );
};

export default NtorcStepper;
