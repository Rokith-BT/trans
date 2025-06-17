import * as React from 'react';
import { SVGProps } from 'react';
const InactiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={39} height={38} viewBox="0 0 39 38" fill="none" {...props}>
    <rect x={0.570312} width={38} height={38} rx={4} fill="#F8F8FF" />
    <path
      d="M27.8203 19C27.8203 24.1086 23.6789 28.25 18.5703 28.25C13.4617 28.25 9.32031 24.1086 9.32031 19C9.32031 13.8914 13.4617 9.75 18.5703 9.75C23.6789 9.75 27.8203 13.8914 27.8203 19Z"
      stroke="#71717A"
      strokeWidth={1.5}
    />
    <path
      d="M14.5598 21.95C13.8751 22.6347 14.9358 23.6953 15.6204 23.0106L22.5827 16.0484C23.2674 15.3637 22.2067 14.303 21.5221 14.9877L14.5598 21.95Z"
      fill="#71717A"
    />
    <path
      d="M21.5222 23.0105C22.2069 23.6952 23.2676 22.6346 22.5829 21.9499L15.6206 14.9876C14.9359 14.3029 13.8753 15.3636 14.56 16.0482L21.5222 23.0105Z"
      fill="#71717A"
    />
  </svg>
);
export default InactiveIcon;
