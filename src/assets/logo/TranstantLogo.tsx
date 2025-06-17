import { Box, Text } from '@/atoms';
import React from 'react';
import { Transtant } from '../icons';
import { useWindowType } from '@/hooks/useWindowType';

export const TranstantLogo: React.FC = () => {
  const { isMobile } = useWindowType();
  return (
    <Box
      className="flex items-center justify-start h-[70px]"
      sx={{
        paddingLeft: isMobile ? '20px' : '28px'
      }}
    >
      <Transtant />
      <Text
        style={{
          fontSize: '34px',
          fontWeight: '700',
          fontFamily: 'Sen , sans-serif',
          background: 'linear-gradient(90deg, #770177 21%, #AA027A 84.5%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginLeft: '8px',
          display: isMobile ? 'none' : 'block'
        }}
      >
        TRANSTAN
      </Text>
    </Box>
  );
};

export default TranstantLogo;
