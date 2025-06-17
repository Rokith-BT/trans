import { RadioGroup } from '@/atoms';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import React, { ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';

interface AtomRadioGroupProps {
  label: string;
  row?: boolean;
  isRequired?: boolean;
  children: ReactNode;
  error?: boolean;
  value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AtomRadioGroup: React.FC<AtomRadioGroupProps> = ({
  label,
  row = false,
  isRequired = false,
  children,
  error = false,
  value,
  onChange
}) => {
  return (
    <FormControl error={error}>
      <FormLabel className="!text-[#000000]">
        {label} {isRequired && <span className="text-[red]">*</span>}
      </FormLabel>
      <RadioGroup row={row} value={value} onChange={onChange}>
        {children}
      </RadioGroup>
      {error && <FormHelperText className='!mx-0.5'>{label} is required</FormHelperText>}
    </FormControl>
  );
};

export default AtomRadioGroup;

interface FormAtomRadioGroupProps extends AtomRadioGroupProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
}

export const FormAtomRadioGroup: React.FC<FormAtomRadioGroupProps> = ({
  control,
  name,
  label,
  children,
  isRequired,
  row
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AtomRadioGroup
          label={label}
          row={row}
          isRequired={isRequired}
          value={field.value}
          onChange={field.onChange}
          error={!!fieldState.error}
        >
          {children}
        </AtomRadioGroup>
      )}
    />
  );
};
