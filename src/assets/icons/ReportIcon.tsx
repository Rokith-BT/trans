import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

interface ReportIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
  strokeWidth?: number;
  toolText?: string;
}

export const ReportIcon: React.FC<ReportIconProps> = ({
  toolText = '',
  color = 'black',
  strokeWidth = 2,
  ...props
}) => (
  <CustomTooltip title={toolText} arrow placement="top">
    <svg
      width={32}
      height={33}
      viewBox="0 0 32 33"
      cursor="pointer"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Group">
        <path
          id="Vector"
          d="M26 1.5C27.3261 1.5 28.5979 2.02678 29.5355 2.96447C30.4732 3.90215 31 5.17392 31 6.5V10.0717C31 10.6283 31 10.9067 30.8717 11.11C30.8052 11.2157 30.7157 11.3052 30.61 11.3717C30.4067 11.5 30.1283 11.5 29.5717 11.5H21M26 1.5C24.6739 1.5 23.4021 2.02678 22.4645 2.96447C21.5268 3.90215 21 5.17392 21 6.5V11.5M26 1.5H7.66667C4.52333 1.5 2.95333 1.5 1.97667 2.47667C1 3.45333 1 5.02333 1 8.16667V31.5L6 29.8333L11 31.5L16 29.8333L21 31.5V11.5"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <path
          id="Vector_2"
          d="M7.6665 8.16602H14.3332M9.33317 14.8327H7.6665M7.6665 21.4993H12.6665"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>
    </svg>
  </CustomTooltip>
);
