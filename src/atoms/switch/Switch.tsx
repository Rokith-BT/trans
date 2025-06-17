import React from 'react';
import Switch from '@mui/material/Switch';

export interface SwitchProps {
  isPurple?: boolean;
}

export const SWitch: React.FC<SwitchProps> = ({ isPurple }) => {
  return (
    <div>
      <Switch
        defaultChecked={false}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#804595', // Switch knob color
            '&:hover': {
              backgroundColor: 'rgba(128, 69, 149, 0.08)' // Switch knob hover color
            }
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#804595' // Switch track color
          },
          '& .MuiSwitch-track': {
            background: isPurple ? '#804595' : ''
          },
          '& .MuiSwitch-thumb': {
            backgroundColor: isPurple ? '#804595' : ''
          }
        }}
      />
    </div>
  );
};
