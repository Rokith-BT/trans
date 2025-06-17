import { FlagIcon } from '@/assets/icons';
import { Box, Text } from '@/atoms';
import React, { useRef, useState } from 'react';
import './Style.css';
import './MobileView.scss';

interface SummaryBoxProps {
  name: string;
  count: string;
  icon: React.ReactNode;
  isNtorc?: boolean;
  small?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

const SummaryBox: React.FC<SummaryBoxProps> = ({ name, count, icon, isNtorc, small, onClick, isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickPosition, setClickPosition] = useState({ x: '50%', y: '50%' });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = `${((e.clientX - rect.left) / rect.width) * 100}%`;
      const y = `${((e.clientY - rect.top) / rect.height) * 100}%`;
      setClickPosition({ x, y });
    }
    onClick?.();
  };
  return (
    <Box
      ref={containerRef}
      // className={`relative flex w-full  items-center  justify-between  border-[1px] border-[#C967A2]  ${small ? '!pl-3 h-[59px]' : '!pl-[16px] h-[80px]'} rounded-lg shadow-inner-custom-pink active:!bg-[##F1E2F1] ${isActive ? 'bg-[##F1E2F1]' : ''}  transition-all duration-300 cursor-pointer text-nowrap`}
      className={`summary-box ${small ? 'small' : ''} ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      {isActive && (
        <Box
          className="water-fill"
          style={
            {
              '--x': clickPosition.x,
              '--y': clickPosition.y
            } as React.CSSProperties
          }
        />
      )}

      <Box className="summary-content">
        <Text className="summary-title">
          {name} {isNtorc ? <FlagIcon /> : ''}
        </Text>
        <Text className="summary-count">{count}</Text>
      </Box>

      <Box className="summary-icon">{icon}</Box>
    </Box>
  );
};

export default SummaryBox;
