import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const DocumentDownload = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Download" placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 19 19" fill="none" {...props}>
      <path
        d="M7.25 8.75V13.25L8.75 11.75"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 13.25L5.75 11.75"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8V11.75C17 15.5 15.5 17 11.75 17H7.25C3.5 17 2 15.5 2 11.75V7.25C2 3.5 3.5 2 7.25 2H11"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8H14C11.75 8 11 7.25 11 5V2L17 8Z"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
