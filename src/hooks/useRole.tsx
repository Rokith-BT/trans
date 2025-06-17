import { useAuth } from '@/routes';

export const useRole = () => {
  const {
    state: {
      currentUser: { userRole, userType, hospital }
    }
  } = useAuth();
  console.log('current user12121212121', userRole, userType, hospital);

  const isSuperAdmin = userType?.name === 'Transtan'; // Super Admin check
  const isHospitalAdmin = userType?.name === 'Hospital' || userRole?.name === 'Hospital Admin'; // Hospital Admin check
  const isDoctor = userRole?.name === 'SurgeonOrConsultant'; //Doctor Chek
  const roleID = userRole?.id;
  return {
    role: userRole?.name,
    isSuperAdmin,
    isHospitalAdmin,
    isDoctor,
    hospitalId: hospital?.id, // Only available for hospital-related users
    status: hospital?.status,
    roleID: roleID
  };
};
