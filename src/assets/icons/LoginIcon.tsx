import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const LoginIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Login" placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M6.67188 5.66969C6.90438 2.96969 8.29188 1.86719 11.3294 1.86719H11.4269C14.7794 1.86719 16.1219 3.20969 16.1219 6.56219V11.4522C16.1219 14.8047 14.7794 16.1472 11.4269 16.1472H11.3294C8.31438 16.1472 6.92688 15.0597 6.67938 12.4047"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1.5 9H11.16" stroke="#C967A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M9.48438 6.48828L11.9969 9.00078L9.48438 11.5133"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
