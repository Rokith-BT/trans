import React, { useEffect, useRef } from 'react';
import OtpInput, { OTPInputProps } from 'react-otp-input';
import './otp.scss';

// export interface OTPProps extends Omit<OTPInputProps, 'renderInput'> {}
export interface OTPProps extends Omit<OTPInputProps, 'renderInput'> {}

export interface OTPRef {
  reset: () => void;
}

const OTP: React.FC<OTPProps> = (props: OTPProps) => {
  // const OTP = forwardRef<OTPRef, OTPProps>((props, ref) => {
  const firstInputRef = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    setTimeout(() => {
      if (firstInputRef.current[0]) {
        firstInputRef.current[0].focus();
      }
    }, 0);
  }, []);
  const handleInputChange = (value: string, index: number) => {
    // Call the parent onChange handler, but ensure you're sending the full OTP value
    const newOtp = [...(props.value || '')];
    newOtp[index] = value;
    const currentOtp = props.value || '';
    const otpArray = currentOtp.split('');
    otpArray[index] = value;
    const updatedOtp = otpArray.join('');

    if (props.onChange) {
      props.onChange(updatedOtp);
    }
    // if (props.onChange) {
    //   props.onChange(newOtp.join('')); // Send the updated OTP value as a string
    // }

    // Move to the next input after a value is entered
    if (value && index < firstInputRef.current.length - 1) {
      firstInputRef.current[index + 1]?.focus(); // Focus the next input
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const otpArray = (props.value || '').split('');

      if (otpArray[index]) {
        // If there's a character, delete it
        otpArray[index] = '';
        props.onChange?.(otpArray.join(''));
      } else if (index > 0) {
        // If empty, move focus back and clear previous input
        firstInputRef.current[index - 1]?.focus();
        otpArray[index - 1] = '';
        props.onChange?.(otpArray.join(''));
      }
    }
  };

  return (
    <OtpInput
      value={props.value}
      numInputs={6}
      renderSeparator={<span className="w-[14px]"> </span>}
      inputStyle={'otp-input'}
      renderInput={(props, index) => (
        <input
          {...props}
          ref={(el) => (firstInputRef.current[index] = el)}
          onChange={(e) => handleInputChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          inputMode="numeric"
          pattern="\d*"
        />
      )}
      {...props}
    />
  );
};

export default OTP;
