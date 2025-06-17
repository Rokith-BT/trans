import * as React from 'react';
import { SVGProps } from 'react';
export const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    cursor={'pointer'}
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    {...props}
  >
    <path
      d="M11.1656 6.91797L4.08398 13.9996L11.1656 21.0813"
      stroke="#804595"
      strokeWidth={2.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23.9143 14H4.2793"
      stroke="#804595"
      strokeWidth={2.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
