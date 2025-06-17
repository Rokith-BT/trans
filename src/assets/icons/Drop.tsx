import * as React from 'react';
import { SVGProps } from 'react';

interface DropIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
export const DropIcon: React.FC<DropIconProps> = ({ color = '#A1999F', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={17} viewBox="0 0 16 17" fill="none" {...props}>
    <path
      d="M5.00138 13.4819C6.73605 14.8852 9.26472 14.8852 10.9987 13.4819C12.7334 12.0786 13.1734 9.67655 12.0427 7.78455L8.78272 2.94455C8.50272 2.52789 7.92472 2.40922 7.49205 2.67989C7.38344 2.74804 7.29033 2.8382 7.21872 2.94455L3.95672 7.78455C2.82672 9.67655 3.26672 12.0786 5.00138 13.4819Z"
      fill={color}
      stroke={color}
      strokeWidth={1.33333}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
