import { useAuth } from '@/routes';
import { useParams } from 'react-router-dom';

export const useHospitalId = () => {
  const { id } = useParams(); // Get ID from URL (Super Admin)
  const { state } = useAuth(); // Get from Auth (Other Users)
  const { currentUser } = state || {};

  return currentUser?.userType?.name === 'Transtan' ? id : currentUser?.hospital?.id;
};
