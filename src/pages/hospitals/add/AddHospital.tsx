/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import HospitalDetails from './sections/HospitalDetails';
import HospitalInfras from './sections/HospitalInfras';
import ApprovedOrganDoc from './sections/ApprovedOrganDoc';
import AdminDetails from './sections/AdminDetails';
import { AdminDetailsType, HospitalApprovedOrganType, HospitalDetailsType, HospitalInfraStructure } from './validators';
import { Button, Text, Widget } from '@/atoms';
import { BackIcon } from '@/assets/icons';
import PaymentDetail from './sections/PaymentDetail';
import { useAuth } from '@/routes';
import Recheck from './sections/Recheck';

enum Tabs {
  AdminDetails,
  HospitalDetails,
  HospitalInfras,
  ApprovedOrganandDoc,
  Recheck,
  Payment
}

export interface AddHospitalProps {}

export const AddHospital: React.FC<AddHospitalProps> = () => {
  const location = useLocation();
  const isFiveSteps = location.state?.fiveSteps;
  const [activeTab, setActiveTab] = useState<Tabs>(isFiveSteps ? Tabs.HospitalDetails : Tabs.AdminDetails);

  const {
    state: { currentUser }
  } = useAuth();
  console.log(currentUser);

  const [formData, setFormData] = useState<{
    adminDetails?: AdminDetailsType;
    hospitalDetails?: HospitalDetailsType;
    hospitalInfras?: HospitalInfraStructure;
    hospitalApprovedOrgans?: HospitalApprovedOrganType;
  }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.editMode) {
      setActiveTab(Tabs.Recheck);
    } else if (isFiveSteps) {
      setActiveTab(Tabs.HospitalDetails);
    } else {
      setActiveTab(Tabs.AdminDetails);
    }
  }, [location.state]);

  const handleNextforAdmin = (data: AdminDetailsType) => {
    const filterData = {
      ...data
    };
    setFormData((pervData) => ({
      ...pervData,
      adminDetails: {
        ...pervData?.adminDetails,
        ...filterData
      }
    }));
    setActiveTab(Tabs.HospitalDetails);
  };
  const handleNextforHospitalDetails = (data: HospitalDetailsType) => {
    const filteredData = {
      ...data,
      hospitalType: data.hospitalType || currentUser?.hospital?.hospitalType
    };
    setFormData((prevData) => ({
      ...prevData,
      hospitalDetails: {
        ...prevData?.hospitalDetails,
        ...filteredData
      }
    }));
    console.log(formData);
    setActiveTab(Tabs.HospitalInfras);
  };
  const handleNextforInfraDetails = (data: HospitalInfraStructure) => {
    const filterData = {
      ...data
    };

    setFormData((prevData) => ({
      ...prevData,
      hospitalInfras: {
        ...prevData?.hospitalInfras,
        ...filterData
      }
    }));
    console.log('filter data from infra ', formData.hospitalInfras);

    setActiveTab(Tabs.ApprovedOrganandDoc);
  };
  const hanldeNextforTransplant = (data: HospitalApprovedOrganType) => {
    console.log(data);
    navigate('/hospitals');
  };
  const handleNextforOrganApprove = (data: HospitalApprovedOrganType) => {
    console.log('data for approved organs step ', data);
    setFormData((prevData) => ({
      ...prevData,
      hospitalApprovedOrgans: {
        ...prevData?.hospitalApprovedOrgans,
        ...data
      }
    }));
    console.log('Updated formData after organ approval: ', formData);
    setActiveTab(Tabs.Recheck);
  };
  useEffect(() => {
    if (formData?.hospitalApprovedOrgans) {
      console.log('Hospital Approved Organs:', formData.hospitalApprovedOrgans);
    }
  }, [formData.hospitalApprovedOrgans]);

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);
  const handleBack = () => {
    if (activeTab > Tabs.AdminDetails) {
      setActiveTab((prevTab) => prevTab - 1);
    }
  };
  const handlesubmit = () => {
    setActiveTab(Tabs.Payment);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeclare = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: AdminDetailsType | HospitalDetailsType | HospitalInfraStructure | HospitalApprovedOrganType | any
  ) => {
    console.log('received data from declaration', data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prevData: any) => {
      const updatedFormData = {
        ...prevData,
        adminDetails: {
          ...prevData.adminDetails,
          ...data
        },
        hospitalDetails: {
          ...prevData.hospitalDetails,
          ...data
        },
        hospitalInfras: {
          ...prevData.hospitalInfras,
          ...data
        },
        hospitalApprovedOrgans: {
          ...prevData.hospitalApprovedOrgans,
          ...data
        }
      };

      console.log('Updated formData:', updatedFormData);
      return updatedFormData;
    });
    console.log('Form data after setFormData:', formData);

    setActiveTab(Tabs.Payment);
  };

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleCancel = () => {
    navigate('/hospitals');
  };
  const tabTexts = {
    step1: 'Admin Details',
    step2: 'Hospital Details',
    step3: 'Hospital Infrastructure',
    step4: 'Approved organs and Documents',
    step5: 'Re-check & De-clare',
    step6: 'Payment Details'
  };

  return (
    <Box>
      <Box p={2} className={`${location.state?.editMode ? 'hidden' : 'block'}`}>
        <Grid container direction="column" spacing={2} className="relative">
          <Grid item>
            <Box className="absolute top-[-80px] right-10 w-[100%] h-[100%]">
              <Widget numberOfSteps={!isFiveSteps} tabTexts={tabTexts} activeTab={activeTab} />
            </Box>

            <Button
              className="flex !bg-transparent items-center gap-3 mt-[2%] cursor-pointer"
              onClick={() => navigate('/hospitals')}
            >
              <BackIcon />
              <Text variant="h3" className="text-[#804595] !text-[23px] !font-[600] ">
                {isFiveSteps ? 'Edit Hospital' : ' Add Hospital'}
              </Text>
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box p={2}>
        <Grid container direction="column" spacing={2} className="relative">
          <Grid item>
            <Box px={5}>
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
                />
              )}

              {activeTab === Tabs.Recheck && (
                <Recheck
                  onBack={handleBack}
                  onNext={handlesubmit}
                  formData={formData}
                  isEditMode={location?.state?.editMode}
                />
              )}
              {activeTab === Tabs.Payment && (
                <PaymentDetail
                  onBack={handleCancel}
                  onNext={hanldeNextforTransplant}
                  payData={formData?.hospitalApprovedOrgans}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
