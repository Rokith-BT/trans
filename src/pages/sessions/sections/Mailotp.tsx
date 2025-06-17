import CloseIcon from '@/assets/icons/Close';
import { Box, Button } from '@/atoms';
import OTP from '@/atoms/otp/OTP';
import { useAuth } from '@/routes';
import { toast } from '@/utils/toast';
import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface MailotpProps {
  onResendOtpClick: () => void;
}

const Mailotp: React.FC<MailotpProps> = ({ onResendOtpClick }) => {
  const {
    state: { otpResponse, aadhaarOtpLogin },
    actions: { onAadharLoginOtpVerify }
  } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(59);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft > 0) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSecond) => prevSecond - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [secondsLeft]);
  const handleResend = () => {
    setSecondsLeft(59);
    onResendOtpClick();
    setOtp('');
    // Logic to resend OTP
  };

  console.log('otpresponse', otpResponse);
  const handleVerify = () => {
    const payload = {
      otp: otp,
      aadhaarNumber: aadhaarOtpLogin?.aadhaarNumber,
      txId: aadhaarOtpLogin?.txId,
      emailOrMobile: aadhaarOtpLogin?.emailOrMobile
    };
    onAadharLoginOtpVerify(payload, () => {
      toast('OTP verified successfully', 'success');
    });
  };

  return (
    <Box className="text-center">
      <div className=" absolute top-[10%] right-10">
        <CloseIcon onClick={() => navigate('./login')} className=" cursor-pointer" />
      </div>
      <Box className="flex items-center justify-center flex-col">
        <Typography className="text-[19px] font-[700] mb-2 ">OTP Verification</Typography>
        <Typography variant="h5" className="!text-[13px] !font-[400] !mb-2 text-[#A1999F]">
          {/* OTP has been send to your srixxxxxxx@transtant.com and <br /> xxxxxx7223 */}
          OTP has been sent to your registered email address and mobile number
        </Typography>
        <OTP onChange={setOtp} value={otp} />

        <Button sx={{ marginTop: '15%', marginBottom: '2%' }} variant="contained" fullWidth onClick={handleVerify}>
          Verify
        </Button>
        {secondsLeft > 0 && (
          <Typography variant="subtitle2" className="text-start text-[#A1999F] cursor-wait">
            Resend OTP in <strong className="text-[#804595] font-[600]">{secondsLeft} sec</strong>
          </Typography>
        )}
        {secondsLeft === 0 && (
          <Typography variant="subtitle2" className="text-end text-[#A1999F] cursor-pointer" onClick={handleResend}>
            Resend ?
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Mailotp;
