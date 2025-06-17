import React, { FC } from 'react';
import { useAuth } from '@/routes/RouteContext';
import NonNtorcHospital from './NonNtorcHospital';
import ViewHospital from '../view';
import NtorcStepper from './NtorcStepper';
import NtorcView from '../view/NtorcView';
import { Box } from '@/atoms';

const OnBoarding: FC = () => {
  const {
    state: {
      currentUser: { hospital }
    }
  } = useAuth();
  console.log('OnBoarding / hospital: ', hospital);

  const { hospitalType, status } = hospital;

  if (hospitalType === 'NTORC')
    return (
      <>
        {status === 'PendingApproval' ? (
          <Box px={5}>
            <NtorcView isView={false} forHospital={true} />
          </Box>
        ) : (
          <NtorcStepper isPenidngApproval={status === 'PendingApproval'} />
        )}
      </>
    );
  else
    return (
      <>
        {status === 'PendingApproval' ? (
          <>
            <ViewHospital forView={true} />
          </>
        ) : (
          <NonNtorcHospital isPendingApproval={status === 'PendingApproval'} />
        )}
      </>
    );
};

export default OnBoarding;
