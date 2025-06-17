import { Box, Text } from '@/atoms';
import * as React from 'react';

interface CheckboxGroupProps {
  label: string;
  children: React.ReactNode;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, label }) => {
  return (
    <Box>
      <Text className="text-[16px] text-[black] font-[500]">{label}</Text>
      {children}
    </Box>
  );
};

export default CheckboxGroup;
