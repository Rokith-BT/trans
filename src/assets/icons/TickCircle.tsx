import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

interface TickCircleProps extends SVGProps<SVGSVGElement> {
  color?: string;
  toolText?: string;
}

export const TickCircle: React.FC<TickCircleProps> = ({ color = '#C967A2', toolText = 'Mark as Active', ...props }) => {
  return (
    <CustomTooltip title={toolText} placement="top" arrow>
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
        <path
          d="M9.5 17.0005C13.625 17.0005 17 13.6255 17 9.50049C17 5.37549 13.625 2.00049 9.5 2.00049C5.375 2.00049 2 5.37549 2 9.50049C2 13.6255 5.375 17.0005 9.5 17.0005Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.3125 9.50043L8.435 11.6229L12.6875 7.37793"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomTooltip>
  );
};
