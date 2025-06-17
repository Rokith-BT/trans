import { EyeClose, EyeOpen } from '@/assets/icons';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
  styled
} from '@mui/material';
import { useState } from 'react';
import { Box, Text } from '..';
import { Controller } from 'react-hook-form';

const Input = styled(OutlinedInput)(({}) => ({}));

export type PasswordProps = OutlinedInputProps & { helperText?: string; defaultShow?: boolean };

export const Password: React.FC<PasswordProps> = ({
  defaultShow = false,
  required,
  label = 'Password',
  ...props
}: PasswordProps) => {
  const [show, setShow] = useState(defaultShow);
  return (
    <FormControl fullWidth={props.fullWidth} variant="outlined" size="small">
      <InputLabel classes={{ disabled: 'color-black', focused: 'color-black' }} htmlFor="outlined-adornment-password">
        {label}{' '}
        {required ? (
          <Box component={'span'} color={'#DA2424'} sx={{ paddingRight: '4px', backgroundColor: 'white' }}>
            *
          </Box>
        ) : (
          ''
        )}
      </InputLabel>
      <Input
        classes={{ notchedOutline: props.value && !props.disabled ? 'border-active' : '' }}
        id="outlined-adornment-password"
        type={show ? 'text' : 'password'}
        size="small"
        className={props.disabled ? 'pointer-events-none' : ''}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setShow(!show);
              }}
              edge="end"
            >
              {show ? <EyeClose /> : <EyeOpen />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
        {...props}
      />
      {props.helperText?.length ? (
        <Text textAlign={'left'} color={props.error ? '#DA2424' : '#A1999F'} fontSize={'13px'} mx={'14px'} mt="4px">
          {props.helperText}
        </Text>
      ) : (
        <></>
      )}
    </FormControl>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormPassword = ({ name, control, ...props }: PasswordProps & { control: any; name: string }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Password helperText={error?.message} error={!!error} onChange={onChange} value={value} {...props}></Password>
      )}
    />
  );
};
