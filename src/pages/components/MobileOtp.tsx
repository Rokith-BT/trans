import { CloseCircleIcon } from '@/assets/icons';
import { Box, Button, CustomDialog, Text } from '@/atoms';
import React, { useEffect, useRef, useState } from 'react';
import OTPInput from 'react-otp-input';

interface MobileOtpProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onVerify?: (otp: string) => void;
  phoneNumber?: string;
  isAadhar?: boolean;
  altPhoneNumber?: string;
  currentPhoneType?: 'primary' | 'alternate' | null;
  timeDuration?: number;
  onResend?: () => void;
}

const MobileOtp: React.FC<MobileOtpProps> = ({
  open,
  onClose,
  phoneNumber,
  isAadhar = false,
  currentPhoneType = null,
  onVerify = () => {},
  timeDuration = 60,
  onResend
}) => {
  const [value, setValue] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(timeDuration);
  const [isResend, setIsResend] = useState(false);
  const [hasVerifiedOnce, setHasVerifiedOnce] = useState(false);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
  const [lastOtp, setLastOtp] = useState('');
  const [cooldown, setCooldown] = useState(5);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const enteredOtp = value.length === 6;

  // const handleChange = (otp: string) => {
  //   setValue(otp);
  //   if (otp.length < 6 && otpInputRefs.current[otp.length]) {
  //     otpInputRefs.current[otp.length]?.focus();
  //   }
  // };
  const handleChange = (otp: string) => {
    setValue(otp);

    if (isVerifyDisabled && otp !== lastOtp) {
      setIsVerifyDisabled(false);
    }

    if (otp.length < 6 && otpInputRefs.current[otp.length]) {
      otpInputRefs.current[otp.length]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };
  // const handleVerify = () => {
  //   if (enteredOtp) {
  //     onVerify(value);
  //   } else if (isAadhar) {
  //     onClose();
  //   }
  // };
  const handleVerify = () => {
    if (!enteredOtp || isVerifyDisabled) return;

    onVerify(value);
    setLastOtp(value);
    setHasVerifiedOnce(true);
    setIsVerifyDisabled(true);

    // Start OTP resend timer (only once)
    if (!hasVerifiedOnce) {
      setTimeLeft(timeDuration);
    }
    const cooldownId = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownId);
          setIsVerifyDisabled(false);
          return 5; // Reset cooldown
        }
        return prev - 1;
      });
    }, 1000);
  };

  // const handleResend = () => {
  //   setValue('');
  //   setIsResend(false);
  //   setIsVerifyDisabled(false);
  //   handleVerify();
  //   setTimeLeft(timeDuration);
  //   if (onResend) {
  //     onResend();
  //   }
  // };
  const handleResend = () => {
    setValue('');
    setIsResend(false);
    setIsVerifyDisabled(false);
    setLastOtp('');
    setHasVerifiedOnce(false);
    setCooldown(5);
    setTimeLeft(timeDuration);

    if (onResend) {
      onResend();
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timeId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timeId);
    } else {
      setIsResend(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!open) {
      setValue('');
      setTimeLeft(timeDuration);
      setIsResend(false);
      currentPhoneType == null;
    }
  }, [open]);
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 0);
    }
  }, [open]);

  return (
    <CustomDialog open={open} onClose={() => {}} maxWidth="xs">
      <Box className="py-[20px] relative">
        <Box className="absolute -top-1 -right-1">
          <CloseCircleIcon toolText="" onClick={onClose} className="cursor-pointer" />
        </Box>
        <Text className="text-center !mb-5 !text-[19px] !font-bold ">
          Please enter the OTP sent to Phone <br />
          {isAadhar ? '' : ` Number ${phoneNumber}`}
        </Text>
        <Box className="flex item-center justify-center">
          <OTPInput
            onChange={handleChange}
            value={value}
            numInputs={6}
            renderSeparator={<span className="pr-4"></span>}
            renderInput={(props, index) => (
              <input
                {...props}
                ref={(input) => (otpInputRefs.current[index] = input)}
                className="text-[28px] font-bold border-b-2 border-[grey] focus:outline-none "
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            )}
          />
        </Box>
        <Box mt={7} mb={2} className="flex justify-center">
          <Button
            className="!bg-[#D876A9] !text-[white] w-[85%]"
            disabled={!enteredOtp || isVerifyDisabled}
            onClick={handleVerify}
          >
            {isVerifyDisabled ? `Wait ${cooldown}s` : 'Verify'}
          </Button>
        </Box>
        <Text className="text-[#804595] flex justify-center items-center gap-4 text-center !text-[13px] !font-[400] ">
          {!isResend && <> {` Resend code in 00: ${timeLeft < 10 ? `0${timeLeft}` : timeLeft} sec `}</>}
          {isResend && (
            <Box className="text-[#C967A2] !font-[500] cursor-pointer" onClick={handleResend}>
              Re-Send OTP
            </Box>
          )}
        </Text>
      </Box>
    </CustomDialog>
  );
};

export default MobileOtp;
