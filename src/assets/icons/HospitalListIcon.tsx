import * as React from 'react';
import { SVGProps } from 'react';
export const HospitalListIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
    <path
      d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
      stroke="#C967A2"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12.5 8.5V5.5H9.5" stroke="#C967A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 9.5V12.5H8.5" stroke="#C967A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 5.5L5.5 12.5" stroke="#C967A2" strokeWidth={1.5} />
  </svg>
);
