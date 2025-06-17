import React, { useState } from 'react';
import { LocalStorage } from '@/services';
import { Box, Text } from '@/atoms';
import { HospitalGreyIcon, LogoutIcon, PasswordCheckIcon } from '@/assets/icons';
import { useAuth } from '@/routes/RouteContext';
import { useNavigate } from 'react-router';
import { useWindowType } from '@/hooks/useWindowType';

const AccountMenu = () => {
  const navigate = useNavigate();
  const {
    state: { currentUser }
  } = useAuth();
  const { isMobile } = useWindowType();
  const { firstName, lastName } = currentUser;
  const [dropdown, setDropdown] = useState(false);
  console.log('ccc', currentUser);

  const getSessionOut = () => {
    LocalStorage.delete('token');
    LocalStorage.delete('refresh-token');
    window.location.reload();
  };

  return (
    <Box className="flex items-center gap-6">
      {currentUser?.userType?.name === 'Hospital' ? (
        <Text className="text-[#804595] !text-[16px] !font-[400] flex items-center gap-2 bg-[white] rounded-lg px-[12px] py-[10px]">
          {currentUser?.hospital?.name} <HospitalGreyIcon stroke="#804595" />
        </Text>
      ) : (
        ''
      )}
      <Box
        onClick={() => setDropdown(!dropdown)}
        className="bg-[white] p-[6px] pr-[12px] flex gap-2 items-center rounded-2xl cursor-pointer relative"
      >
        <Box className="h-[28px] w-[28px] rounded-full bg-[purple] flex items-center justify-center text-[white] font-[600] ">
          {firstName.charAt(0).toUpperCase() ?? 'T'}
        </Box>
        <Text
          className={`text-[#804595] !text-[13px] !font-[500] ${isMobile ? 'hidden' : 'block'}`}
        >{`${firstName} ${lastName}`}</Text>
        <Box
          className={`${!dropdown && 'hidden'} bg-[white] p-4 py-3 space-y-3 shadow-xl absolute bottom-[-90px] -left-9 z-50 rounded-lg text-nowrap `}
        >
          <Text className="flex items-center gap-1 cursor-pointer" 
          onClick={()=>{navigate('/reset-password')}}
          >
            <PasswordCheckIcon /> Change Password
          </Text>
          <Text onClick={getSessionOut} className="flex items-center gap-1 cursor-pointer">
            <LogoutIcon /> Logout
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountMenu;
