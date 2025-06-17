// src/templates/LoginOptionBox.tsx
import React from 'react';
import { Box } from '@/atoms';
import FingerPrint from '@/assets/icons/FingerPrint';
import AadharOTP from '@/assets/icons/AadharOTP';
import MailAdress from '@/assets/icons/MailAdress';

type LoginMethod = 'fingerprint' | 'otp' | 'mail';
interface LoginOptionBoxProps {
  onFingerPrintClick: () => void;
  onOtpClick: () => void;
  onMailClick?: () => void;
  exclude?: LoginMethod[];
}

// export const LoginEmailOTPFinger: React.FC<LoginOptionBoxProps> = ({ onFingerPrintClick, onOtpClick, onMailClick }) => (
//   <Box className="text-center mt-2 ">
//     <span>or</span>
//     <Box className="flex items-center justify-between text-[13px] font-[500] mt-6 text-[#9C539C]">
//       {onFingerPrintClick && (
//         <div className="flex-row items-center">
//           <span className="flex justify-center mb-2 cursor-pointer">
//             <FingerPrint onClick={onFingerPrintClick} />
//           </span>
//           <span>Via Aadhar Fingerprint</span>
//         </div>
//       )}
//       {onOtpClick && (
//         <div>
//           <span className="flex justify-center mb-2 cursor-pointer">
//             <AadharOTP onClick={onOtpClick} />
//           </span>
//           Via Aadhar Number OTP
//         </div>
//       )}
//       {onMailClick && (
//         <div className="flex-row items-center">
//           <span className="flex justify-center mb-2 cursor-pointer">
//             <MailAdress onClick={onMailClick} />
//           </span>
//           <span>Via Mail Address</span>
//         </div>
//       )}
//     </Box>
//   </Box>
// );
export const LoginEmailOTPFinger: React.FC<LoginOptionBoxProps> = ({
  onFingerPrintClick,
  onOtpClick,
  onMailClick,
  exclude = []
}) => (
  <Box className="text-center mt-2 ">
    <span>or</span>
    <Box className="flex items-center justify-between text-[13px] font-[500] mt-6 text-[#9C539C]">
      {!exclude.includes('fingerprint') && onFingerPrintClick && (
        <div className="flex-row items-center">
          <span className="flex justify-center mb-2 cursor-pointer">
            <FingerPrint onClick={onFingerPrintClick} />
          </span>
          <span>Via Aadhar Fingerprint</span>
        </div>
      )}
      {!exclude.includes('otp') && onOtpClick && (
        <div>
          <span className="flex justify-center mb-2 cursor-pointer">
            <AadharOTP onClick={onOtpClick} />
          </span>
          Via Aadhar Number OTP
        </div>
      )}
      {!exclude.includes('mail') && onMailClick && (
        <div className="flex-row items-center">
          <span className="flex justify-center mb-2 cursor-pointer">
            <MailAdress onClick={onMailClick} />
          </span>
          <span>Via Mail Address</span>
        </div>
      )}
    </Box>
  </Box>
);
