import CloseIcon from '@/assets/icons/Close';
import { Box, Button, Flex, Text } from '@/atoms';
import React, { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/routes';
import OTP from '@/atoms/otp/OTP';

export interface MFAProps { }


export const MFA: React.FC<MFAProps> = () => {
  const [searchParams] = useSearchParams();
  const { actions: { onCreateSession } } = useAuth()
  const [otpValue, setOtpValue] = useState("")

  if (!searchParams.get("hash"))
    return <Navigate to="/page-not-found" replace={true} />

  return (
    <Flex className="w-[100vW] h-[100vH] justify-center items-center">
      <Link to="/login" replace>
        <Box className="absolute top-7 right-10">
          <CloseIcon />
        </Box>
      </Link>
      <Box className="w-[400px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreateSession({ hash: searchParams.get('hash') ?? '', otp: otpValue });
          }}
        >
          <Flex className="gap-[24px] flex-col justify-center items-center">
            <Flex className="flex-col justify-center items-center gap-[8px]">
              <Text className="text-[#1A0616]" fontSize={'19px'} fontWeight={'600'}>
                OTP Verification
              </Text>
              <Text component="p" fontSize={'13px'} className="text-[#A1999F]">
                OTP has been send to your registered email id and phone number
              </Text>
            </Flex>
            <OTP onChange={setOtpValue} value={otpValue} />
            <Button
              variant="contained"
              className="!bg-[#9C539C]"
              fullWidth
              type="submit"
              disabled={!(otpValue.length >= 6)}
            >
              Verify
            </Button>
            {/* {secondsLeft > 0 && (
              <Typography variant="subtitle2" className="text-start text-[#A1999F] cursor-wait">
                Resend OTP in <strong className="text-[#804595] font-[600]">{secondsLeft} sec</strong>
              </Typography>
            )}
            {secondsLeft === 0 && (
              <Typography variant="subtitle2" className="text-end text-[#A1999F]">
                Resend ?
              </Typography>
            )} */}
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
