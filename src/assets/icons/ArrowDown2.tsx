import * as React from 'react';
import { SVGProps } from 'react';
interface ArrowDown2Props extends SVGProps<SVGSVGElement> {
  color?: string;
}
export const ArrowDown2: React.FC<ArrowDown2Props> = ({ color = '#C967A2', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={15} viewBox="0 0 14 15" fill="none" {...props}>
    <path
      d="M11.6209 5.71973L7.81753 9.52306C7.36836 9.97223 6.63336 9.97223 6.18419 9.52306L2.38086 5.71973"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
