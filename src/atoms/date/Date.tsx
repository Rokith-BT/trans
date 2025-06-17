import * as React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Control, Controller } from 'react-hook-form';
import dayjs, { Dayjs } from 'dayjs';
import { InputProps } from '../input';
import { CalenderIcon } from '@/assets/icons';
import { Text } from '../text';

interface AtomDatePickerProps extends InputProps {
  name: string;
  label: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
}

export const AtomDatePicker: React.FC<AtomDatePickerProps> = ({
  control,
  name,
  label,
  disabled = false,
  readOnly = false,
  required = false,
  minDate,
  maxDate
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label} is required` : false,
          validate: (value) => {
            if (!value) return true;
            const selectedDate = dayjs(value);
            if (minDate && selectedDate.isBefore(minDate)) {
              return `${label} should be greater than ${minDate.format('DD/MM/YYYY')}`;
            }
            if (maxDate && selectedDate.isAfter(maxDate)) {
              return `${label} should be less than ${maxDate.format('DD/MM/YYYY')}`;
            }
            return true;
          }
        }}
        render={({ field, fieldState: { error } }) => {
          const hasValue = !!field.value;
          return (
            <DatePicker
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date: Dayjs | null) => field.onChange(date ? date.toISOString() : null)}
              label={label}
              disabled={disabled}
              readOnly={readOnly}
              minDate={minDate || undefined}
              maxDate={maxDate || undefined}
              slots={{
                openPickerIcon: () => <CalenderIcon />
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: required,
                  error: !!error,
                  helperText: error ? (
                    <Text
                      textAlign={'left'}
                      color={'#DA2424'}
                      fontSize={'12px'}
                      mt="8px"
                      style={{ marginLeft: '-12px' }}
                    >
                      {' '}
                      {error.message}
                    </Text>
                  ) : null,
                  sx: {
                    '& .MuiInputBase-root': {
                      height: '40px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: hasValue ? '2px #804595 solid ' : '1px #c4c4c4 solid'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#804595',
                        borderWidth: '2px'
                      }
                      // '&.MuiPopper-root': {
                      //   width: '300px' // Corrected Popper width
                      // }
                      //MuiPopper-root MuiPickersPopper-root css-1tpmnfm-MuiPopper-root-MuiPickersPopper-root
                    },
                    '& .MuiPickersPopper-paper': {
                      width: '800px'
                    },
                    '& .MuiInputBase-input': {
                      padding: '16px 14px',
                      lineHeight: 'normal'
                    },
                    '& .MuiInputLabel-root': {
                      transform: 'translate(14px, 10px) scale(1)'
                    },
                    '& .MuiInputLabel-shrink': {
                      transform: 'translate(14px, -8px) scale(0.75)'
                    },
                    '& .MuiFormLabel-asterisk': {
                      color: 'red'
                    },
                    '& .MuiOutlinedInput-root': {
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#40a9ff'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#804595',
                        borderWidth: '2px'
                      },
                      '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0'
                      },
                      '&.MuiDateCalendar-root.css-1rtg91x-MuiDateCalendar-root': {
                        width: '100%'
                      }
                    }
                  }
                },
                popper: {
                  // Make the popper (calendar dropdown) match the text field's width
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8] // Optional: Adjust vertical offset of the dropdown
                      }
                    },
                    {
                      name: 'sameWidth',
                      enabled: true,
                      phase: 'beforeWrite',
                      requires: ['computeStyles'],
                      fn: ({ state }) => {
                        state.styles.popper.width = window.innerWidth < 760 ? '100%' : '400px';
                      }
                    }
                  ],
                  sx: {
                    width: '100%',
                    maxWidth: '100%',
                    '@media (max-width: 992px)': {
                      maxWidth: '60vw',
                      padding: '8px'
                    }
                  }
                },
                mobilePaper: {
                  sx: {
                    width: '100%', // Ensure full width on mobile devices
                    margin: 0,
                    padding: '8px',
                    maxWidth: 'none' // Prevent limiting the width on mobile
                  }
                }
              }}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
};

interface CustomAtomDatePickerProps {
  name: string;
  label: string;
  value: Dayjs | null;
  // eslint-disable-next-line no-unused-vars
  onChange: (date: Dayjs | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
}

export const CustomDatePicker: React.FC<CustomAtomDatePickerProps> = ({
  name,
  label,
  value,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  minDate,
  maxDate
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        name={name}
        value={value ? dayjs(value) : null}
        onChange={(date: Dayjs | null) => onChange(date)}
        label={label}
        disabled={disabled}
        readOnly={readOnly}
        minDate={minDate || undefined}
        maxDate={maxDate || undefined}
        slots={{
          openPickerIcon: () => <CalenderIcon />
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            required: required,
            sx: {
              '& .MuiInputBase-root': {
                height: '40px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#c4c4c4'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#804595',
                  borderWidth: '2px'
                }
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 10px) scale(1)'
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(14px, -8px) scale(0.75)'
              },
              '& .MuiFormLabel-asterisk': {
                color: 'red'
              }
            }
          }
        }}
      />
    </LocalizationProvider>
  );
};
