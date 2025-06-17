/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router';
import HospitalDetails from './sections/HospitalDetails';
import HospitalInfras from './sections/HospitalInfras';
import ApprovedOrganDoc from './sections/ApprovedOrganDoc';
// import Recheck, { CombinedFormData } from './sections/Recheck';
import AdminDetails from './sections/AdminDetails';
import { AdminDetailsType, HospitalApprovedOrganType, HospitalDetailsType, HospitalInfraStructure } from './validators';
import { Button, Text, Widget } from '@/atoms';
import { BackIcon } from '@/assets/icons';
import PaymentDetail from './sections/PaymentDetail';
import DeclareDetails from '../../hospitals/add/sections/adminDetails/index';
import { useHospital } from '../hospitalContext';
import { useAuth } from '@/routes';
import { toast } from '@/utils/toast';
// import PaymentDetails from './sections/PaymentDetails';

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
  const { state } = useHospital();
  const { hospital } = state || {};

  const {
    state: { currentUser }
  } = useAuth();
  console.log(currentUser);

  const handleEditClick = () => {
    setActiveTab(Tabs.HospitalDetails);
  };
  useEffect(() => {
    if (hospital) {
      toast(`Hospital ID in AddHospital: ${hospital}`, 'info');
    }
  }, []);
  const [formData, setFormData] = useState<{
    adminDetails?: AdminDetailsType;
    hospitalDetails?: HospitalDetailsType;
    hospitalInfras?: HospitalInfraStructure;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hospitalApprovedOrgans?: any;
  }>({});
  const navigate = useNavigate();

  // for edit redirection
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
    setActiveTab(Tabs.ApprovedOrganandDoc);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNextforOrganApprove = (data: any) => {
    const filterData = {
      ...data
    };
    setFormData((prevData) => ({
      ...prevData,
      hospitalApprovedOrgans: {
        ...prevData?.hospitalApprovedOrgans,
        ...filterData
      }
    }));
    setActiveTab(Tabs.Payment);
  };

  const handleBack = () => {
    if (activeTab > Tabs.AdminDetails) {
      setActiveTab((prevTab) => prevTab - 1);
    }
  };

  const handleDeclare = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: AdminDetailsType | HospitalDetailsType | HospitalInfraStructure | HospitalApprovedOrganType | any
  ) => {
    console.log('received data from declaration', data); // Log the received data

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

    // setActiveTab(Tabs.Payment);
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
    step3: 'Hospital Infratstructure',
    step4: 'Approved organs and Documents',
    step5: 'Re-check & De-clare',
    step6: 'Payment Details'
  };

  return (
    <Box>
      <Box component="header" p={3} className="bg-[#6a398c26]">
        <Box className="flex items-center h-[55px]">
          <Text
            style={{
              fontSize: '34px',
              fontWeight: '700',
              fontFamily: 'Sen , sans-serif',
              background: 'linear-gradient(90deg, #770177 21%, #AA027A 84.5%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '8px'
            }}
          ></Text>
        </Box>
      </Box>

      <Box p={2} className={`${location.state?.editMode ? 'hidden' : 'block'}`}>
        <Grid container direction="column" spacing={2} className="relative">
          <Grid item>
            <Box className="absolute top-[-95px] right-10 w-[100%] h-[100%]">
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
                <AdminDetails onBack={handleBack} onNext={handleNextforAdmin} adminData={formData?.adminDetails} />
              )}
              {activeTab === Tabs.HospitalDetails && (
                <HospitalDetails
                  onNext={handleNextforHospitalDetails}
                  onBack={handleBack}
                  detailsData={formData?.hospitalDetails}
                />
              )}
              {activeTab === Tabs.HospitalInfras && (
                <HospitalInfras
                  onBack={handleBack}
                  onNext={handleNextforInfraDetails}
                  infraData={formData.hospitalInfras}
                />
              )}
              {activeTab === Tabs.ApprovedOrganandDoc && (
                <ApprovedOrganDoc
                  onBack={handleBack}
                  onNext={handleNextforOrganApprove}
                  organData={formData?.hospitalApprovedOrgans}
                />
              )}

              {activeTab === Tabs.Recheck && (
                // <Recheck
                //   onBack={handleBack}
                //   onNext={handleSubmit}
                //   formData={formData}
                //   isEditMode={location?.state?.editMode}
                // />
                <DeclareDetails
                  // hospitalData={hospitalData}
                  onEdit={handleEditClick}
                  onBack={handleBack}
                  onNext={handleDeclare}
                  adminData={formData.adminDetails}
                  detailsData={formData.hospitalDetails}
                  infraData={formData.hospitalInfras}
                  organData={formData.hospitalApprovedOrgans}
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
