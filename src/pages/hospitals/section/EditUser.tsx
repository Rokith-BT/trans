import { Box } from '@/atoms';
import React, { useEffect, useState } from 'react';
import AddDoctor from './AddDoctor';
import { useHospital } from '../hospitalContext';
import { useLocation } from 'react-router';
import Loading from '@/pages/components/Loading';

const EditUser = () => {
  const location = useLocation();
  const {
    state: { data }
  } = location || {};
  const [userState, setUserState] = useState(data);
  useEffect(() => {
    if (location.state) {
      setUserState(data); // Update only if state exists
    }
  }, [location]);
  console.log('userstate', userState);

  const { hospitalID, userID, role } = userState || {};
  console.log('state from user table ', data);
  console.log('state from user table ', hospitalID);
  console.log('state from user table ', userID);
  console.log('state from user table ', role);
  const userType = data.role?.name;
  const {
    state: { singleUser, loading },
    actions: { getHospitalUserById }
  } = useHospital();
  useEffect(() => {
    if (userID) {
      getHospitalUserById(userID);
    }
  }, [userID]);
  console.log('single user ', singleUser);
  return (
    <Box px={5} py={3}>
      {loading ? (
        <Loading />
      ) : (
        <AddDoctor isEditUser={true} editUserType={userType} editValues={singleUser} userId={userID} />
      )}
    </Box>
  );
};

export default EditUser;
