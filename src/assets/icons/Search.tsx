import * as React from 'react';
import { SVGProps } from 'react';
interface SEarchIconProps extends SVGProps<SVGSVGElement> {
  stroke?: string;
}
export const SearchIcon: React.FC<SEarchIconProps> = ({ stroke = '#804595', ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M8.66287 15.0265C12.1759 15.0265 15.0237 12.1787 15.0237 8.66568C15.0237 5.15267 12.1759 2.30481 8.66287 2.30481C5.14986 2.30481 2.302 5.15267 2.302 8.66568C2.302 12.1787 5.14986 15.0265 8.66287 15.0265Z"
        stroke={stroke}
        strokeWidth={1.81176}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6934 15.6961L14.3542 14.3569"
        stroke={stroke}
        strokeWidth={1.81176}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
