import { Box } from '@/atoms';
import React, { useEffect, useState } from 'react';
import NtorcHospital from '../add/sections/NtorcHospital';
import { useHospital } from '../hospitalContext';
// import { useNavigate } from 'react-router';
// import { toast } from '@/utils/toast';

const NtorcEdit = () => {
  // const navigate = useNavigate();
  const {
    state: { hospital }
  } = useHospital();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [hospitlDetails, setHospitalDetails] = useState({ hospitalDetails: hospital?.basicDetails });
  useEffect(() => {
    setHospitalDetails({ hospitalDetails: hospital?.basicDetails });
  }, [hospital]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any) => {
    setHospitalDetails((prevData) => ({
      ...prevData,
      hospitalDetails: {
        ...prevData?.hospitalDetails,
        ...data
      }
    }));
  };

  return (
    <Box px={5}>
      <NtorcHospital isEdit={true} ntorcData={hospital?.basicDetails} readOnly={false} onNext={handleSubmit} />
    </Box>
  );
};

export default NtorcEdit;
