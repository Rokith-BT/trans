import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

interface AtomRadioProps {
  value: boolean | string | number;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  checked?: boolean;
}

const AtomRadio: React.FC<AtomRadioProps> = ({ value, label, disabled = false, onClick, checked }) => {
  return (
    <FormControlLabel
      value={value}
      control={
        <Radio
          sx={{
            color: (theme) => theme.palette.secondary.main,
            '&.Mui-checked.Mui-disabled': {
              color: (theme) => theme.palette.secondary.main
            }
          }}
          color="secondary"
          onClick={onClick}
        />
      }
      label={label}
      disabled={disabled}
      checked={checked}
    />
  );
};

export default AtomRadio;
