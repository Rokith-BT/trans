import React, { FC } from 'react';
import NonNtorcHospital from '../NonNtorcHospital';
import { useHospital } from '../../hospitalContext';
import NtorcStepper from '../NtorcStepper';

const OnBoarding: FC = () => {
  const {
    state: { hospital }
  } = useHospital();
  const { status } = hospital;
  console.log('hospital type from onboarding ', hospital);
  const hospitalType = hospital?.basicDetails?.hospitalType?.name || {};

  if (hospitalType === 'NTORC') return <NtorcStepper isPenidngApproval={status === 'PendingApproval'} />;
  else return <NonNtorcHospital />;
};

export default OnBoarding;
