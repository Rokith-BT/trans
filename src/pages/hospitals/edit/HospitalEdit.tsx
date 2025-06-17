import { Box, Widget2 } from '@/atoms';
import React, { useEffect, useState } from 'react';
import HospitalDetails from '../add/sections/HospitalDetails';
import HospitalInfras from '../add/sections/HospitalInfras';
import { useHospital } from '../hospitalContext';
import { useLocation, useNavigate } from 'react-router';
// import { BackIcon } from '@/assets/icons';
import { HospitalDetailsType, HospitalInfraStructure } from '../add/validators';

const HospitalEdit = () => {
  const {
    state: { admin, hospital }
  } = useHospital();

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<{
    hospitalDetails?: HospitalDetailsType;
    hospitalInfras?: HospitalInfraStructure;
  }>({
    hospitalDetails: hospital?.basicDetails,
    hospitalInfras: hospital?.infrastructure
  });

  const steps = [
    { number: 1, text: 'Hospital Details' },
    { number: 2, text: 'Hospital Infrastructure' }
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { isTranstanAdmin } = state || {};
  useEffect(() => {
    setFormData({
      hospitalDetails: hospital?.basicDetails,
      hospitalInfras: hospital?.infrastructure
    });
  }, [hospital, admin]);
  // const handleNavigate = () => {
  //   if (isTranstanAdmin) {
  //     navigate(`/hospitals`);
  //   } else {
  //     navigate(`/hospitals/${hospital?.hospitalID}/dashboard`);
  //   }
  // };
  const handleHospitalDetailsChange = (data: HospitalDetailsType) => {
    const filteredData = {
      ...data
    };
    setFormData((prevData) => ({
      ...prevData,
      hospitalDetails: {
        ...prevData?.hospitalDetails,
        ...filteredData
      }
    }));
    setActiveTab(1);
  };

  const handleHospitalInfraChange = (data: HospitalInfraStructure) => {
    setFormData((prevData) => ({
      ...prevData,
      hospitalInfras: {
        ...prevData?.hospitalInfras,
        ...data
      }
    }));
  };

  const handleBackforHospital = () => {
    if (isTranstanAdmin) {
      navigate('/hospitals');
    } else {
      navigate(`/hospitals/${hospital?.hospitalID}/dashboard`);
    }
  };

  return (
    <Box px={5} className="relative">
      <Widget2 activeTab={activeTab} steps={steps} />
      <Box className=" absolute -top-3 flex items-center gap-2">
        {/* <BackIcon className="cursor-pointer" onClick={handleNavigate} /> */}
        {/* <Text className="!text-[16px] text-[#804595] !font-[500]">Back To Hospital Management</Text> */}
      </Box>

      <Box>
        {activeTab === 0 && (
          <HospitalDetails
            readOnly={false}
            detailsData={formData?.hospitalDetails}
            onNext={handleHospitalDetailsChange}
            onBack={handleBackforHospital}
          />
        )}
        {activeTab === 1 && (
          <Box>
            <HospitalInfras
              readOnly={false}
              isEdit={true}
              infraData={formData?.hospitalInfras}
              onNext={handleHospitalInfraChange}
              onBack={() => setActiveTab(0)}
            />
          </Box>
        )}
      </Box>
      {/* {activeTab === 2 && (
        <Box className=" flex gap-4 justify-end my-[60px]">
          <Button className="!border-[#D876A9] !text-[#D876A9] !w-[164px] " variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" className="!bg-[#D876A9] w-[164px] !text-[white]">
            Update
          </Button>
        </Box>
      )} */}
    </Box>
  );
};

export default HospitalEdit;
