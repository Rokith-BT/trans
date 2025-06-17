import React from 'react';
import HospitalEdit from './HospitalEdit';
import { Box } from '@/atoms';
import NtorcEdit from './NtorcEdit';
import { useHospital } from '../hospitalContext';

const EditHospital = () => {
  const {
    state: { hospital }
  } = useHospital();
  const hosptalType = hospital?.basicDetails?.hospitalType?.name;

  return <Box>{hosptalType === 'NTORC' ? <NtorcEdit /> : <HospitalEdit />}</Box>;
};

export default EditHospital;
