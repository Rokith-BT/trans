import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

interface UndoIconProps extends SVGProps<SVGSVGElement> {
  toolText?: string;
  color?: string;
}
export const UndoIcon: React.FC<UndoIconProps> = ({ toolText = 'Restore', color = '#C967A2', ...props }) => (
  <CustomTooltip title={toolText} placement="top" arrow>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={19}
      height={19}
      cursor="pointer"
      viewBox="0 0 19 19"
      fill="none"
      {...props}
    >
      <path
        d="M5.84766 14.2324H11.8477C13.9177 14.2324 15.5977 12.5524 15.5977 10.4824C15.5977 8.41242 13.9177 6.73242 11.8477 6.73242H3.59766"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.32234 8.60758L3.40234 6.68758L5.32234 4.76758"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
