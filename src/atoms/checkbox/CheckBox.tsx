import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface AtomCheckboxProps {
  label?: string;
  onClick?: () => void;
  isLabel?: boolean;
  checked: boolean;
  onChange?: () => void;
}

export const AtomCheckbox: React.FC<AtomCheckboxProps> = ({ label, onClick, onChange, isLabel = false, checked }) => {
  return (
    <FormControlLabel
      sx={{
        margin: !isLabel ? '0px' : '',
        padding: '0px'
      }}
      control={
        <Checkbox
          onClick={onClick}
          onChange={onChange}
          sx={{
            color: '#C967A2',
            '& .MuiSvgIcon-root': {
              borderRadius: '8px'
            },
            '& .MuiCheckbox-root': {
              borderRadius: '20%'
            },
            '&.Mui-checked': {
              color: '#C967A2',
              '& .MuiSvgIcon-root': {
                borderRadius: '8px'
              }
            }
          }}
        />
      }
      label={label}
      checked={checked}
    />
  );
};
