/* eslint-disable no-unused-vars */
import React from 'react';
import {
  AutocompleteProps as MUIAutocompleteProps,
  FormControl,
  TextField,
  Autocomplete,
  TextFieldProps,
  InputAdornment
} from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { ArrowDownGrey } from '@/assets/icons';

export type MenuOption = {
  value: string | number;
  label: string;
};

export type AutoCompleteSelectProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  name: string;
  menuOptions: MenuOption[];
  label: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  textFieldProps?: TextFieldProps;
  onChange?: (value: MenuOption | null) => void;
  onSelectOption?: (value: MenuOption | null) => void; // New prop
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // For click events
  startIcon?: React.ReactNode; // <-- Optional icon prop
  isWaitlist?: boolean;
};

export type AutoCompleteProps = {
  helperText?: string;
  menuOptions: MenuOption[];
  error?: boolean;
  label: string;
  disabled?: boolean;
  required?: boolean;
  value: MenuOption | null;
  startIcon?: React.ReactNode; // <-- Optional icon prop
  isWaitlist?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: MenuOption | null) => void;
  textFieldProps?: TextFieldProps;
} & Omit<MUIAutocompleteProps<MenuOption, false, false, false>, 'onChange' | 'value' | 'options' | 'renderInput'>;

const returnAutoCompleteCSS = (disabled: boolean, hasValue: boolean, errored: boolean) => {
  if (disabled) {
    return {
      borderColor: '#c4c4c4',
      color: '#A1999F'
    };
  }
  if (errored) {
    return {
      borderColor: '#DA2424',
      color: '#DA2424'
    };
  }

  return {
    borderColor: hasValue ? '#804595' : '#c4c4c4'
  };
};

export const AutoComplete: React.FC<AutoCompleteProps> = ({
  helperText,
  menuOptions = [],
  error = false,
  label,
  disabled = false,
  value,
  required = false,
  startIcon,
  onChange,
  isWaitlist = false,
  textFieldProps,
  ...rest
}) => {
  const hasValue = !!value;
  const styles = returnAutoCompleteCSS(disabled, hasValue, error);

  return (
    <FormControl
      fullWidth
      size="small"
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: styles.borderColor,
            borderWidth: hasValue ? '2px' : '1px'
          },
          color: styles.color,
          height: '42px'
        },
        '& .MuiSelect-icon': {
          right: '16px',
          color: styles.color
        },
        '& .MuiAutocomplete-popupIndicator': {
          right: '9px'
        },
        '& .MuiAutocomplete-endAdornment': {},
        '& .MuiAutocomplete-clearIndicator': {
          marginRight: '9px'
        }
      }}
    >
      <Autocomplete
        {...rest}
        sx={{ height: '44px', width: '100%' }}
        options={menuOptions}
        popupIcon={<ArrowDownGrey />}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            {...textFieldProps}
            label={label}
            error={error}
            required={required}
            helperText={helperText}
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: startIcon ? (
                <InputAdornment position="start">{startIcon}</InputAdornment>
              ) : (
                params.InputProps.startAdornment
              ),
              style: {
                color: isWaitlist && hasValue ? '#C967A2' : params.inputProps.style?.color
              }
            }}
            InputLabelProps={{
              shrink: hasValue || undefined,
              sx: {
                top: hasValue ? '0px' : '-5px',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          />
        )}
      />
    </FormControl>
  );
};

export const FormAutoCompleteSelect: React.FC<AutoCompleteSelectProps> = ({
  control,
  name,
  menuOptions,
  label,
  disabled = false,
  className = '',
  startIcon,
  isWaitlist = false,
  onChange,
  onClick,
  // onSelectOption,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange: fieldOnChange, value, ...fieldProps }, fieldState: { error } }) => {
        return (
          <AutoComplete
            className={className}
            {...fieldProps}
            error={!!error}
            helperText={error?.message}
            menuOptions={menuOptions}
            label={label}
            startIcon={startIcon}
            isWaitlist={isWaitlist}
            disabled={disabled}
            value={menuOptions.find((option) => option.value === value) ?? null}
            onClick={onClick}
            onChange={(newValue) => {
              if (newValue && typeof newValue === 'object') {
                fieldOnChange(newValue.value);
              } else {
                fieldOnChange(newValue);
              }
              onChange?.(newValue);
            }}
            {...rest}
          />
        );
      }}
    />
  );
};
