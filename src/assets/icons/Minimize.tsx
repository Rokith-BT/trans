import * as React from 'react';
import { SVGProps } from 'react';
export const MinimizeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
    <path
      d="M6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V6.75C16.5 3 15 1.5 11.25 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5Z"
      stroke="#C967A2"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10.5 4.5V7.5H13.5" stroke="#C967A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 13.5V10.5H4.5" stroke="#C967A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
