import { FormControl, InputLabel, OutlinedInput, OutlinedInputProps, styled } from '@mui/material';
import { Box, Button, Flex, Text } from '..';
import { Controller } from 'react-hook-form';
import React, { useState } from 'react';

export type InputProps = OutlinedInputProps & {
  aadhar?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  onAadharVerify?: () => void;
  isVerified?: boolean;
  helperText?: string;
  suffixComponent?: React.ReactNode;
  noBorder?: boolean;
};
const InputBase = styled(OutlinedInput)<{ noBorder?: boolean }>(({ noBorder }) => ({
  ...(noBorder && {
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none' // Removes the border
    }
  })
}));

const returnEndAdornmentCSS = (disabled: boolean, errored: boolean) => {
  if (disabled) {
    return `border-l-[#c4c4c4] bg-[#EDEDED] text-[#A1999F]`;
  }
  if (errored) {
    return `border-l-[#DA2424] bg-[#DA242426] text-[#DA2424]`;
  }
  return `border-l-[#c4c4c4] bg-[#8045954D] text-[#804595]`;
};

export const Input: React.FC<InputProps> = ({ suffixComponent, required, noBorder, ...props }: InputProps) => {
  if (suffixComponent) {
    props.endAdornment = (
      <Flex
        className={`end-adornment px-5 h-[40px] rounded-r-[8px] justify-center items-center text-[12px] text-nowrap border-l-[2px] ${returnEndAdornmentCSS(props.disabled || false, props.error || false)}`}
      >
        {suffixComponent}
      </Flex>
    );
  }
  return (
    <FormControl
      fullWidth={props.fullWidth}
      variant="outlined"
      size="small"
      className={suffixComponent ? 'input-form-control' : ''}
    >
      <InputLabel
        htmlFor="trans-input"
        classes={{ disabled: 'color-black', focused: 'color-black', shrink: 'bg-white' }}
        disabled={props.disabled}
        shrink={props.disabled || undefined}
      >
        {props.label}
        {required ? (
          <Box component={'span'} color={'#DA2424'} sx={{ paddingRight: '4px', backgroundColor: 'white' }}>
            {' '}
            *
          </Box>
        ) : (
          ''
        )}
      </InputLabel>

      <InputBase
        classes={{ notchedOutline: props.value && !props.disabled ? 'border-active' : '' }}
        id="trans-input"
        size="small"
        fullWidth
        noBorder={noBorder}
        className={props.disabled ? 'pointer-events-none' : ''}
        {...props}
      />
      {props.helperText?.length ? (
        <Text textAlign={'left'} color={props.error ? '#DA2424' : '#A1999F'} fontSize={'13px'} mx={'4px'} mt="8px">
          {props.helperText}
        </Text>
      ) : (
        <></>
      )}
    </FormControl>
  );
};

export interface FormInputProps extends InputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  helperText?: string;
}

export const FormInput = ({ name, control, aadhar, onAadharVerify, isVerified = false, ...props }: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canRetry, setCanRetry] = useState(true);
  const [aadharNumber, setAadharNumber] = useState('');
  const handleVerifyClick = () => {
    if (!canRetry || isVerified) return;

    setIsVerifying(true);
    setCanRetry(false);

    onAadharVerify?.(); // Call verification logic

    // Cooldown for 5 seconds
    setTimeout(() => {
      setIsVerifying(false);
      if (!isVerified) {
        setCanRetry(true);
      }
    }, 5000);
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // for masking
        const maskedValue =
          aadhar && typeof value === 'string' && value.length === 12 && !isFocused
            ? 'XXXX-XXXX-' + value.slice(-4)
            : value;
        // console.log('masked value ', maskedValue);

        return (
          <Flex gap={2}>
            <Input
              helperText={error?.message}
              error={!!error}
              onChange={(e) => {
                //   const newValue = props.type === 'number' ? Number(e.target.value) || 0 : e.target.value;
                //   onChange(newValue);
                // }}
                let newValue = e.target.value;
                if (aadhar) {
                  // If it's an Aadhar field, remove all non-digit characters
                  newValue = newValue.replace(/[^0-9]/g, '');
                  // Optional: Enforce max length for Aadhar (12 digits)
                  if (newValue.length > 12) {
                    newValue = newValue.slice(0, 12);
                  }
                } else if (props.type === 'number') {
                  // This is the original logic for general type="number" if you use it elsewhere
                  newValue = String(Number(newValue) || '');
                }
                onChange(newValue);
                setAadharNumber(newValue);
              }}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key) && props.type === 'number') {
                  e.preventDefault();
                }
              }}
              value={aadhar ? maskedValue : value}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              inputMode={aadhar ? 'numeric' : props.inputMode}
              {...props}
            ></Input>
            {aadhar && (
              <Button
                variant="contained"
                className={` !rounded-lg w-[104px] h-[42px] ${isVerified ? '!text-[#80C967] !bg-[#CFEEBC]' : aadharNumber.length === 12 ? '!text-[#F8F8FF] !bg-[#C967A2]' : '!text-[#756f6f] !bg-[#a1999f7b]'}`}
                onClick={handleVerifyClick}
                disabled={isVerifying || isVerified || !canRetry}
              >
                {isVerified ? 'Verified' : ' Verify'}
              </Button>
            )}
          </Flex>
        );
      }}
    />
  );
};
