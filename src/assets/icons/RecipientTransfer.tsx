import * as React from 'react';
import { SVGProps } from 'react';

interface RecipientTransferIconProps extends SVGProps<SVGSVGElement> {
  color?: string;
}
export const RecipientTransferIcon: React.FC<RecipientTransferIconProps> = ({ color = '#292D32', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
    <path
      d="M2.38672 3.43997H11.6134C12.7201 3.43997 13.6134 4.33331 13.6134 5.43997V7.65331"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.49339 1.33333L2.38672 3.43998L4.49339 5.54667"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.6134 12.56H4.38672C3.28005 12.56 2.38672 11.6667 2.38672 10.56V8.34668"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5066 14.6667L13.6133 12.56L11.5066 10.4533"
      stroke={color}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
