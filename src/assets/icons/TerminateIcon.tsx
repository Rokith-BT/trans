/* eslint-disable react/prop-types */
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
interface TerminateIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}
export const TerminateIcon: React.FC<TerminateIconProps> = ({ title, ...props }) => (
  <CustomTooltip title={title} placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} fill="none" {...props}>
      <g stroke="#C967A2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
        <path d="M11.675 2h-4.35c-.51 0-1.23.3-1.59.66L2.66 5.735c-.36.36-.66 1.08-.66 1.59v4.35c0 .51.3 1.23.66 1.59l3.075 3.075c.36.36 1.08.66 1.59.66h4.35c.51 0 1.23-.3 1.59-.66l3.075-3.075c.36-.36.66-1.08.66-1.59v-4.35c0-.51-.3-1.23-.66-1.59L13.265 2.66c-.36-.36-1.08-.66-1.59-.66ZM6.875 12.125l5.25-5.25M12.125 12.125l-5.25-5.25" />
      </g>
    </svg>
  </CustomTooltip>
);
