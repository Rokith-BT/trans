import { FormControl, InputLabel, OutlinedInput, OutlinedInputProps, styled } from '@mui/material';
import { Box, Button, Flex, Text } from '..';
import { Controller } from 'react-hook-form';
import React, { useEffect, useState } from 'react';

export type InputProps = OutlinedInputProps & {
  aadhar?: boolean;
  onAadharVerify?: () => void;
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

export const AadharInput: React.FC<InputProps> = ({
  suffixComponent,
  required,
  noBorder,
  aadhar,
  onChange,
  value: propValue,
  ...props
}: InputProps) => {
  const [internalValue, setInternalValue] = useState<string>((propValue as string) || '');

  useEffect(() => {
    if (propValue) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullValue = e.target.value;
    if (aadhar) {
      if (fullValue.length > 12) return;
      setInternalValue(fullValue);
      onChange?.(e);
    } else {
      onChange?.(e);
    }
  };

  const getDisplayValue = (value: string) => {
    if (aadhar && value.length > 11) {
      const maskedPart = 'XXXX-XXXX-';
      const visiblePart = value.slice(-4);
      return maskedPart + visiblePart;
    }
    return value;
  };

  return (
    <FormControl
      fullWidth={props.fullWidth}
      variant="outlined"
      size="small"
      className={suffixComponent ? 'input-form-control' : ''}
    >
      <InputLabel
        htmlFor="trans-input"
        classes={{ disabled: 'color-black', focused: 'color-black' }}
        disabled={props.disabled}
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
        classes={{ notchedOutline: internalValue && !props.disabled ? 'border-active' : '' }}
        id="trans-input"
        size="small"
        fullWidth
        noBorder={noBorder}
        className={props.disabled ? 'pointer-events-none' : ''}
        value={getDisplayValue(internalValue)}
        onChange={handleChange}
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

export const FormAadharInput = ({
  name,
  control,
  aadhar,
  onAadharVerify,
  ...props
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
}: InputProps & { control: any; name: string; helperText?: string }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Flex gap={2}>
          <AadharInput
            aadhar={aadhar}
            helperText={error?.message}
            error={!!error}
            onChange={(e) => {
              onChange(e.target.value); // Pass the full value to react-hook-form
            }}
            value={value}
            {...props}
          ></AadharInput>
          {aadhar && (
            <Button className="!bg-[#a1999f7b] rounded-lg w-[104px] h-[42px] !text-[#756f6f]" onClick={onAadharVerify}>
              Verify
            </Button>
          )}
        </Flex>
      )}
    />
  );
};
