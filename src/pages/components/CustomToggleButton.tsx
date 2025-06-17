/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Text } from '@/atoms';
import { Control, Controller } from 'react-hook-form';

interface CustomToggleButtonProps {
  submitted: boolean;
}

const CustomToggleButton = styled(ToggleButton)<CustomToggleButtonProps>(({ submitted }) => ({
  '&.Mui-selected': {
    backgroundColor: submitted ? '#804595' : '#D876A9',
    color: 'white',
    '&:hover': {
      backgroundColor: '#ff69b4'
    }
  },
  textTransform: 'none'
}));

interface ToggleButtonComponentProps {
  label: string;
  control: Control<any>;
  name: string;
  options: { value: string | number; label: string }[];
  //eslint-disable-next-line no-unused-vars
  onChange: (event: any, newValue: string | null | number) => void;
  submitted: boolean;
  required?: boolean;
}

export const ToggleButtonComponent: React.FC<ToggleButtonComponentProps> = ({
  label,
  control,
  name,
  options,
  submitted,
  required = false,
  onChange
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: 'This field is required' } : undefined}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        return (
          <Box>
            <Text className="!mb-2 !text-[13px]">{label}</Text>
            <ToggleButtonGroup
              color="secondary"
              value={field.value}
              exclusive
              onChange={(value) => {
                field.onChange(value);
                onChange && onChange(value);
              }}
              aria-label={`${label} selection`}
              sx={{ width: `${options.length * 64}px` }}
            >
              {options.map((option, index) => (
                <CustomToggleButton
                  key={option.value}
                  submitted={submitted}
                  sx={{
                    color: submitted ? '#804595' : '#C967A2',
                    border: submitted ? '1px  #804595 solid' : '1px  #C967A2 solid',
                    width: '64px',
                    ...(index === 0 && { borderBottomLeftRadius: '18px' }),
                    ...(index === options.length - 1 && { borderTopRightRadius: '18px' })
                  }}
                  value={option.value}
                >
                  {option.label}
                </CustomToggleButton>
              ))}
            </ToggleButtonGroup>
            {required && error && (
              <Text color="#DA2424" fontSize="12px" mt="4px" style={{ marginLeft: '2px' }}>
                {error.message}
              </Text>
            )}
          </Box>
        );
      }}
    />
  );
};
