import { FC } from 'react';
import { useAuth } from './RouteContext';
import { UserType } from '@/utils';
import HospitalUserRoutes from './HospitalUserRoutes';
import TranstanRoutes from './TranstanRoutes';
import OpenRoutes from './OpenRoutes';

export interface RootProps {}

export const RootRoutes: FC<RootProps> = () => {
  const {
    state: { currentUser }
  } = useAuth();
  console.log('currentUser: ', currentUser);

  // Check if currentUser exists and safely access userRole and name
  if (currentUser) {
    const name = currentUser?.userRole?.name;

    if (name && name !== UserType.TranstanAdmin) {
      return <HospitalUserRoutes />;
    } else {
      return <TranstanRoutes />;
    }
  } else {
    return <OpenRoutes />;
  }
};
