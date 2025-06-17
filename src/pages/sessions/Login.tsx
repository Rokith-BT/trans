/* eslint-disable no-unused-vars */
// src/pages/session/Login.tsx
import { Box } from '@/atoms';
import { LoginEmailOTPFinger, UnProtectedLayout } from '@/templates';
// import { useState } from 'react';
import { LoginWithEmailPassword } from './sections/LoginWithEmailPassword';
import { LoginWithAadharOTP } from './sections/LoginWithAadharOTP';
// import { LoginWithFingerPrint } from './sections/LoginWithFingerPrint';
// import { LoginEmailOTPFinger } from '@/templates/LoginEmailOTPFinger';
// import Mailotp from './sections/Mailotp';
// import { ForgotPassword } from './ForgotPassword';
// import { ResetPassword } from './ResetPassword';
// import { FingerFailed, FingerSuccess } from '@/assets/icons';
// import CloseIcon from '@/assets/icons/Close';
// import { useNavigate } from 'react-router';
import { useAuth } from '@/routes';
import { useState } from 'react';
import { LoginWithFingerPrint } from './sections/LoginWithFingerPrint';
import Mailotp from './sections/Mailotp';
import { toast } from '@/utils/toast';
// import { LoginWithFingerPrint } from './sections/LoginWithFingerPrint';

export interface LoginProps {}
enum LoginStage {
  Login,
  Otp,
  FingerPrint,
  ShowOtp
  // ForgotPass,
  // ResetPass,
  // FingerPrintSuccess,
  // FingerPrintFailure,
  // FingerPrintTooManyAttempt
}

export const Login: React.FC<LoginProps> = () => {
  const [currentStage, setCurrentStage] = useState<LoginStage>(LoginStage.Login);
  const [userInput, setUserInput] = useState<string>('');

  // const navigate = useNavigate();
  const {
    actions: { onAadhaarLogin }
  } = useAuth();

  const handleResendOtp = () => {
    if (!userInput) return;
    onAadhaarLogin(userInput, () => {
      toast('OTP resent successfully', 'success');
    });
  };

  const renderStage = () => {
    switch (currentStage) {
      case LoginStage.Login:
        return (
          <>
            <LoginWithEmailPassword />
            <LoginEmailOTPFinger
              onFingerPrintClick={() => setCurrentStage(LoginStage.FingerPrint)}
              onOtpClick={() => setCurrentStage(LoginStage.Otp)}
              exclude={['mail']}
            />
          </>
        );
      case LoginStage.Otp:
        return (
          <>
            <LoginWithAadharOTP
              onOtpClick={() => {
                setCurrentStage(LoginStage.ShowOtp);
              }}
              onCaptureInput={(val: string) => setUserInput(val)}
            />
            <LoginEmailOTPFinger
              onFingerPrintClick={() => setCurrentStage(LoginStage.FingerPrint)}
              onMailClick={() => setCurrentStage(LoginStage.Login)}
              onOtpClick={() => {}}
              exclude={['otp']}
            />
          </>
        );
      case LoginStage.FingerPrint:
        return (
          <>
            <LoginWithFingerPrint onSuccess={() => {}} onFailure={() => {}} onTooMany={() => {}} />
            <LoginEmailOTPFinger
              onOtpClick={() => setCurrentStage(LoginStage.Otp)}
              onMailClick={() => setCurrentStage(LoginStage.Login)}
              onFingerPrintClick={() => {}}
              exclude={['fingerprint']}
            />
          </>
        );
      // case LoginStage.FingerPrintSuccess:
      //   return (
      //     <>
      //       <Box className="absolute top-7 right-10 cursor-pointer" onClick={() => navigate('./login')}>
      //         <CloseIcon />
      //       </Box>
      //       <Box className="text-center">
      //         <FingerSuccess />

      //         <Text className="text-[#7A6F78] font-[500] text-[19px]">Fingerprint Verified</Text>
      //       </Box>
      //     </>
      //   );
      // case LoginStage.FingerPrintFailure:
      //   return (
      //     <>
      //       <Box className="absolute top-7 right-10 cursor-pointer" onClick={() => navigate('./login')}>
      //         <CloseIcon />
      //       </Box>
      //       <Box className="text-center">
      //         <Box className="mb-6">
      //           <FingerFailed />
      //           <Text className="text-[#7A6F78] font-[500] text-[19px]">Fingerprint not matched</Text>
      //         </Box>
      //         <Text
      //           component="span"
      //           onClick={() => navigate('./login')}
      //           className="text-[#C967A2] font-[600] mt-2 cursor-pointer "
      //         >
      //           Try Again
      //         </Text>
      //       </Box>
      //     </>
      //   );
      // case LoginStage.FingerPrintTooManyAttempt:
      //   return (
      //     <>
      //       <Box className="absolute top-7 right-10 cursor-pointer" onClick={() => navigate('./login')}>
      //         <CloseIcon />
      //       </Box>
      //       <Box className="text-center">
      //         <Box className="mb-6">
      //           <FingerFailed className="ml-[15%]" />
      //           <Text className="text-[#7A6F78] font-[500] text-[19px]">Fingerprint not matched</Text>
      //         </Box>
      //         <Text
      //           component="span"
      //           onClick={() => navigate('./login')}
      //           className="text-[#C967A2] font-[600] mt-2 cursor-pointer "
      //         >
      //           Too many attempts, please Try Again later
      //         </Text>
      //       </Box>
      //     </>
      //   );
      case LoginStage.ShowOtp:
        return (
          <>
            <Mailotp onResendOtpClick={handleResendOtp} />
          </>
        );
      // case LoginStage.ForgotPass:
      //   return (
      //     <>
      //       <ForgotPassword />
      //     </>
      //   );
      // case LoginStage.ResetPass:
      //   return (
      //     <>
      //       <ResetPassword />
      //     </>
      //   );
      default:
        return null;
    }
  };

  return (
    <UnProtectedLayout showHeaderAndSide>
      <Box className="min-w-[350px]">
        {/* {isViaAadhaar ? <LoginWithAadharOTP onOtpClick={() => {}} /> : <LoginWithEmailPassword />} */}
        {renderStage()}
        {/* <LoginEmailOTPFinger
          onFingerPrintClick={() => {}}
          onOtpClick={() => {
            setCurrentStage(LoginStage.Otp);
          }}
        /> */}
      </Box>
    </UnProtectedLayout>
  );
};
