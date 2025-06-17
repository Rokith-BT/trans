import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  SelectProps as MUISelectProps,
  styled
} from '@mui/material';
import { Box, Text } from '..';
import { ArrowDownGrey } from '@/assets/icons';
import { Control, Controller } from 'react-hook-form';
import React from 'react';

const SelectBase = styled(MUISelect)(({}) => ({}));

export type MenuOption = {
  value: string | number;
  label: string;
};
export type FormSelectProps = SelectProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  menuOptions: MenuOption[];
  label: string;
};

export type SelectProps = MUISelectProps & { helperText?: string; menuOptions: MenuOption[] };
const returnSelectCSS = (disabled: boolean, hasValue: boolean, errored: boolean) => {
  if (disabled) {
    return {
      borderColor: '#c4c4c4',
      // backgroundColor: '#EDEDED',
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

export const Select: React.FC<SelectProps> = ({ helperText, menuOptions = [], ...props }: SelectProps) => {
  const hasValue = !!props.value;
  const styles = returnSelectCSS(props.disabled || false, hasValue, props.error || false);

  return (
    <FormControl
      size="small"
      fullWidth={props.fullWidth}
      variant="outlined"
      className="select-form-control"
      sx={{
        '& .MuiOutlinedInput-root': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: styles.borderColor,
            borderWidth: hasValue ? '2px' : '1px'
          },
          color: styles.color
        },
        '& .MuiSelect-icon': {
          right: '16px',
          color: styles.color
        }
      }}
    >
      <InputLabel
        htmlFor="trans-input"
        classes={{ disabled: 'color-black', focused: 'color-black' }}
        disabled={props.disabled}
      >
        {props.label}{' '}
        {props.required ? (
          <Box component="span" color="#DA2424">
            *
          </Box>
        ) : (
          ''
        )}
      </InputLabel>
      <SelectBase
        labelId="trans-select"
        id="trans-select"
        classes={{ filled: props.value && !props.disabled ? 'border-active' : '' }}
        className={props.disabled ? 'pointer-events-none' : ''}
        IconComponent={ArrowDownGrey}
        {...props}
      >
        {menuOptions.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </SelectBase>
      {helperText?.length ? (
        <Text color={props.error ? '#DA2424' : '#A1999F'} fontSize="13px" mx="4px" mt="8px">
          {helperText}
        </Text>
      ) : (
        <></>
      )}
    </FormControl>
  );
};

export const FormSelect: React.FC<FormSelectProps> = ({
  control,
  name,
  menuOptions,
  label,
  ...props
}: FormSelectProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <Select
            {...props}
            {...field}
            error={!!error}
            helperText={error?.message}
            menuOptions={menuOptions}
            label={label}
          />
        );
      }}
    />
  );
};

// return (
//   <FormControl fullWidth={props.fullWidth} variant="outlined" size="small" className={suffixComponent ? 'input-form-control' : ''}>
//     <InputLabel htmlFor="trans-input" classes={{ disabled: "color-black", focused: "color-black" }} disabled={props.disabled}>{props.label} {props.required ? <Box component={"span"} color={"#DA2424"}>*</Box> : ''}</InputLabel>
//     <SelectBase
//       classes={{ notchedOutline: props.value && !props.disabled ? "border-active" : "" }}
//       id="trans-input"
//       size="small"
//       fullWidth
//       className={props.disabled ? 'pointer-events-none' : ''}
//       {...props}
//     />
//     {props.helperText?.length ? (
//       <Text color={props.error ? '#DA2424' : '#A1999F'} fontSize={'13px'} mx={'14px'} mt="4px">
//         {props.helperText}
//       </Text>
//     ) : (
//       <></>
//     )}
//   </FormControl>
// );
