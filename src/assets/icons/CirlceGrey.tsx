import * as React from 'react';
import { SVGProps } from 'react';
interface CircleGrayProps extends SVGProps<SVGSVGElement> {
  isRed?: boolean;
}
export const CircleGreyIcon: React.FC<CircleGrayProps> = ({ stroke = '#71717A', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M12 18C15.3 18 18 15.3 18 12C18 8.7 15.3 6 12 6C8.7 6 6 8.7 6 12C6 15.3 8.7 18 12 18Z"
      stroke={stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
