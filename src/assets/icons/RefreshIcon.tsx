import * as React from 'react';
import { SVGProps } from 'react';
interface RefreshIconProps extends SVGProps<SVGSVGElement> {
  stroke?: string;
}

export const RefreshIcon: React.FC<RefreshIconProps> = ({ stroke = '#C967A2', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 25" fill="none" {...props}>
    <path
      d="M14.1251 20.5916C17.7001 19.65 20.3334 16.4 20.3334 12.5333C20.3334 7.93328 16.6334 4.19995 12.0001 4.19995C6.44175 4.19995 3.66675 8.83328 3.66675 8.83328M3.66675 8.83328V5.03328M3.66675 8.83328H5.34175H7.36675"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 20.8665C9.20834 20.8665 6.7359 19.4916 5.22339 17.3823"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="3 3"
    />
  </svg>
);
export default RefreshIcon;
