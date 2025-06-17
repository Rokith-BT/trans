import { Box, Button } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useHospital } from '../hospitalContext';
import AddDoctor from './AddDoctor';
import { ApproveIcon, DeclineIcon } from '@/assets/icons';
import ApproveDialog from '../view/ApproveDialog';
import DeclineDialog from '../view/DeclineDialog';
import Loading from '@/pages/components/Loading';
import { addDoc, collection } from 'firebase/firestore';
import { dataBase } from '../../../firebase-config';
import { useRole } from '@/pages/roles_permission/RoleContex';
const permissionPayload = {
  id: 4,
  name: 'SurgeonOrConsultant',
  roleType: 'Hospital',
  isActive: true,
  createdAt: '2025-03-26T19:45:36',
  createdBy: '1',
  rolePermissions: [
    {
      roleId: 4,
      menuId: 6,
      settingsPermissions: [
        {
          id: 5,
          selected: true
        }
      ]
    }
  ]
};
const ViewUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const userRef = collection(dataBase, 'Users');
  const [userState, setuserState] = useState(location.state);
  const {
    actions: { createRole }
  } = useRole();
  useEffect(() => {
    if (location.state) {
      setuserState(location.state);
    }
  }, [location.state]);
  const { role } = state?.data || {};
  const { isAlfDoctor, selectedConsultant, isAlfDoctorView, isView } = userState || {};
  const hospitalID = isAlfDoctor || isAlfDoctorView ? selectedConsultant?.hospitalID : userState?.data?.hospitalID;
  const userID = isAlfDoctor || isAlfDoctorView ? selectedConsultant?.userID : userState?.data?.userID;

  console.log(isAlfDoctor, 'sfcsfcdecf', isView);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { isApproval } = state || {};

  const {
    actions: { approveHospitalUser, declineHospitalUser }
  } = useHospital();

  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [OpenDeclineDialog, setOpenDeclineDialog] = useState(false);

  const userType = role?.name;
  const {
    state: { singleUser, loading },
    actions: { getHospitalUserById, getAlfDoctorsDetails, addALFdoctor }
  } = useHospital();
  useEffect(() => {
    if (isAlfDoctor || isAlfDoctorView) {
      getAlfDoctorsDetails(hospitalID, userID);
    } else {
      getHospitalUserById(userID);
    }
  }, []);
  const userWithId = { ...singleUser, hospitalID, userID };
  console.log(singleUser, 'singleUser');

  return (
    <Box px={5} py={3}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <AddDoctor
            isEditUser={true}
            isAlf={isAlfDoctor || isAlfDoctorView}
            editUserType={userType}
            editValues={singleUser}
            isApproval={true}
            readonly={true}
          />
          {(isView || isAlfDoctor) && (
            <Box className="mt-[60px] mb-[10%] flex gap-[22px] justify-end">
              {isAlfDoctor ? (
                <>
                  <Button
                    variant="outlined"
                    className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px]"
                    onClick={() => navigate('/alf/alf-doctor')}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px] "
                    onClick={() => {
                      try {
                        addALFdoctor(userID, '', async () => {
                          await addDoc(userRef, {
                            firstName: singleUser.firstName,
                            lastName: singleUser.lastName,
                            email: singleUser.email,
                            phoneNumber1: singleUser.phoneNumber1
                          });
                          const payload = permissionPayload;
                          createRole(payload, () => {
                            navigate('/alf/alf-doctor');
                          });
                        });
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    Add
                  </Button>
                </>
              ) : isAlfDoctorView ? (
                <></>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px] !text-[#DD2323] !border-[#DD2323]"
                    onClick={() => setOpenDeclineDialog(true)}
                  >
                    <DeclineIcon /> Decline
                  </Button>
                  <Button
                    variant="contained"
                    className="sm:w-[164px] w-[100px] h-[44px] flex gap-2 border-[1px] !text-[white] !bg-[#80C967] "
                    onClick={() => setOpenApproveDialog(true)}
                  >
                    <ApproveIcon /> Approve
                  </Button>
                </>
              )}
            </Box>
          )}
          <ApproveDialog
            open={openApproveDialog}
            onClose={() => setOpenApproveDialog(false)}
            user={userWithId}
            onApprove={(userID: number) => {
              approveHospitalUser(userID);
            }}
          />
          <DeclineDialog
            open={OpenDeclineDialog}
            onClose={() => setOpenDeclineDialog(false)}
            user={userWithId}
            onUserReject={(userID: number, data: string) => {
              declineHospitalUser(userID, data);
            }}
          />
        </>
      )}
    </Box>
  );
};

export default ViewUser;
