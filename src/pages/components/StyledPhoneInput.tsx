// import React, { useEffect, useState } from 'react';
// import { Box, Button, Text } from '@/atoms';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { Controller, Control } from 'react-hook-form';

// interface StyledPhoneInputProps {
//   name: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   control: Control<any>;
//   className?: string;
//   error?: boolean;
//   helperText?: string;
//   onVerify?: () => void;
//   isVerified?: boolean;
//   // eslint-disable-next-line no-unused-vars
//   onPhoneNumberChange?: (value: string) => void;
//   onClick?: () => void;
//   disable?: boolean;
//   isEnable?: boolean;
// }

// export const StyledPhoneInput: React.FC<StyledPhoneInputProps> = ({
//   name,
//   control,
//   helperText = '',
//   onVerify,
//   isVerified = false,
//   disable = false,
//   onPhoneNumberChange,
//   onClick,
//   isEnable = false
// }) => {
//   const [enteredNumber, setEnteredNumber] = useState('');
//   // const [isEnable, setIsEnable] = useState(false);
//   // const [is12Digit, setIs12Digit] = useState(false);

//   useEffect(() => {
//     // const isValidLength = enteredNumber.length === 12;
//     // const isSameAsVerified = enteredNumber === (isVerified ? enteredNumber : '');

//     // setIsEnable(isValidLength && !isSameAsVerified);
//     // // setIs12Digit(isValidLength);

//     // if (isSameAsVerified && isVerified) {
//     //   setIsEnable(false); // Disable "Verify" if already verified
//     // }
//     // if (enteredNumber.length >= 12 && isVerified) {
//     //   setIsEnable(true);
//     // } else {
//     //   setIsEnable(false);
//     // }
//   }, [enteredNumber, isVerified]);
//   return (
//     <Box className="w-full flex flex-col">
//       <Controller
//         name={name}
//         control={control}
//         render={({ field, fieldState }) => {
//           const hasValue = !!field.value;
//           return (
//             <>
//               <Box className="flex gap-4">
//                 <div
//                   className={`flex !w-[75%] !gap-4 h-[44px] border-[1px] ${
//                     fieldState.error
//                       ? 'border-red-500 border-[2px]'
//                       : disable
//                         ? '!border-[#A1999F] border-[2px]'
//                         : hasValue
//                           ? 'border-[#804595] border-[2px]'
//                           : '!border-[#A1999F]'
//                   } rounded-lg hover:border-[#804595] active:border-[#804595] hover:border-[2px]`}
//                 >
//                   <PhoneInput
//                     country={'in'}
//                     value={field.value}
//                     onChange={(phoneValue) => {
//                       field.onChange(phoneValue);
//                       setEnteredNumber(phoneValue);
//                       if (onPhoneNumberChange) onPhoneNumberChange(phoneValue);
//                     }}
//                     onClick={onClick}
//                     disabled={disable}
//                     containerStyle={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}
//                     inputStyle={{
//                       display: 'flex',
//                       width: '100%',
//                       height: '100%',
//                       fontSize: '16px',
//                       paddingLeft: '15px',
//                       border: 'none',
//                       borderRadius: '8px'
//                     }}
//                     buttonStyle={{
//                       background: '#8045954D',
//                       padding: '3%',
//                       width: '60px',
//                       borderRadius: '0 7px 7px 0px',
//                       borderLeft: '2px #804595 solid',
//                       border: 'none'
//                     }}
//                     dropdownStyle={{
//                       background: 'white'
//                     }}
//                   />
//                 </div>
//                 <Button
//                   className={`!rounded-lg p-4 w-[104px]
//                   ${isVerified ? '!bg-[#7fc9677e] !text-[#44a025]' : isEnable && !isVerified ? '!bg-[#D876A9] !text-[white]' : '!bg-[#a1999f7b] !text-[#756f6f]'}
//                   `}
//                   disabled={!isEnable}
//                   onClick={onVerify}
//                 >
//                   {isVerified ? 'Verified' : 'Verify'}
//                 </Button>
//               </Box>
//               {fieldState.error && (
//                 <Text variant="caption" color="error" className="mt-1 pl-4">
//                   {helperText || fieldState.error.message}
//                 </Text>
//               )}
//             </>
//           );
//         }}
//       />
//     </Box>
//   );
// };

import React, { useState } from 'react';
import { Box, Button, Text } from '@/atoms';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller, Control, UseFormSetValue } from 'react-hook-form';
import { FormControl, InputLabel } from '@mui/material';

interface StyledPhoneInputProps {
  name: string;
  countryCodeName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  label: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  className?: string;
  error?: boolean;
  helperText?: string;
  onVerify?: () => void;
  isVerified?: boolean;
  // eslint-disable-next-line no-unused-vars
  onPhoneNumberChange?: (number: string, code: string) => void;
  onClick?: () => void;
  disable?: boolean;
  isEnable?: boolean;
  forSearch?: boolean;
  isHandleMulti?: boolean;
}

export const getBorderStyles = (error: boolean, disabled: boolean, hasValue: boolean, isFocused: boolean) => {
  if (error) return 'border-red-500 border-2';
  if (disabled) return '!border-[#A1999F] border-2';
  if (hasValue || isFocused) return 'border-[#804595] border-2';
  return '!border-[#A1999F]';
};

export const StyledPhoneInput: React.FC<StyledPhoneInputProps> = ({
  name,
  countryCodeName,
  setValue,
  label = 'Phone Number',
  required = false,
  control,
  helperText = '',
  onVerify,
  isVerified,
  disable = false,
  onPhoneNumberChange,
  forSearch = false,
  onClick,
  isEnable,
  isHandleMulti
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = `phone-input-${name}`;

  return (
    <Box className="w-full flex flex-col">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState }) => {
          // console.log(control._formValues, 'control._formValues', value);

          const hasValue = !!value;
          const getPhoneNumberValue = () => {
            const formValues = control._formValues;
            if (!value || !formValues) return '';
            if (isHandleMulti) {
              const countryCodeMatch = countryCodeName.match(/^(\w+)\.(\d+)\.(\w+)$/);
              if (!countryCodeMatch) return '';
              const [_, objectName, contactIndex, countryFieldName] = countryCodeMatch;
              console.log(_, '_');
              const index = Number(contactIndex);
              const countryCode = formValues?.[objectName]?.[index]?.[countryFieldName];
              return countryCode ? `+${countryCode}${value}` : '';
            } else {
              const countryCode = formValues?.[countryCodeName];
              return countryCode ? `+${countryCode}${value}` : '';
            }
          };
          return (
            <FormControl fullWidth variant="outlined" error={!!fieldState.error}>
              {label && (
                <InputLabel
                  htmlFor={inputId}
                  shrink={hasValue || isFocused}
                  sx={{
                    backgroundColor: 'white',
                    paddingRight: '4px',
                    paddingLeft: '4px',
                    color: fieldState.error
                      ? '#DA2424'
                      : !hasValue
                        ? '#A1999F'
                        : hasValue && !isFocused
                          ? '#A1999F'
                          : 'inherit',
                    '&.Mui-focused': {
                      color: fieldState.error ? '#DA2424' : '#804595'
                    },
                    transform:
                      hasValue || isFocused ? 'translate(10px, -10px) scale(0.75)' : 'translate(10px, 12px) scale(1)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                >
                  {label}
                  {required && (
                    <Box component="span" color="#DA2424" sx={{ paddingLeft: '4px' }}>
                      *
                    </Box>
                  )}
                </InputLabel>
              )}
              <Box className="flex gap-4">
                <div
                  className={`flex !w-[75%] !gap-4 h-[42px] border-[1px] rounded-lg transition-colors 
                    ${getBorderStyles(!!fieldState.error, disable, !!value, isFocused)}`}
                >
                  <PhoneInput
                    country={'in'}
                    value={getPhoneNumberValue()}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(phone, country: any) => {
                      // Get clean phone value without formatting
                      const rawPhone = phone.replace(/\D/g, '');

                      // Extract country code (first 1-3 digits)
                      const countryCode = rawPhone.slice(0, country.dialCode.length);

                      // Extract actual phone number
                      const phoneNumber = rawPhone.slice(country.dialCode.length);

                      console.log('Cleaned values:', phoneNumber, countryCode);

                      // Update form fields
                      onChange(phoneNumber);
                      setValue(countryCodeName, countryCode, { shouldValidate: true });

                      if (onPhoneNumberChange) onPhoneNumberChange(phoneNumber, countryCode);
                    }}
                    placeholder=""
                    onClick={onClick}
                    disabled={disable}
                    containerStyle={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}
                    inputStyle={{
                      display: 'flex',
                      width: '100%',
                      height: '100%',
                      fontSize: '16px',
                      paddingLeft: '15px',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    buttonStyle={{
                      background: '#8045954D',
                      padding: '3%',
                      width: '60px',
                      borderRadius: '0 7px 7px 0px',
                      borderLeft: '2px #804595 solid',
                      border: 'none'
                    }}
                    dropdownStyle={{
                      background: 'white',
                      zIndex: 9999
                    }}
                    inputProps={{
                      id: inputId,
                      onFocus: () => setIsFocused(true),
                      onBlur: () => setIsFocused(false)
                    }}
                  />
                </div>
                {!forSearch && (
                  <Button
                    variant="contained"
                    className={`!rounded-lg p-4 w-[116px] ${isVerified ? '!bg-[#7fc9677e] !text-[#44a025] ' : !isEnable ? '!bg-[#AEAEB3]' : ''} 
                  `}
                    onClick={onVerify}
                  >
                    {isVerified ? 'Verified' : 'Verify'}
                  </Button>
                )}
              </Box>
              {fieldState.error && (
                <Text variant="caption" color="error" className="mt-1 pl-4" mt={'8px'} ml={'-12px'}>
                  {helperText || fieldState.error.message}
                </Text>
              )}
            </FormControl>
          );
        }}
      />
    </Box>
  );
};
