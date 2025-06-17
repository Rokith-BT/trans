import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const VerifyApprovalIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Preview" arrow placement="top">
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M12.0547 4.53743L13.1172 5.59994L15.9505 2.7666"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.46094 9.7085H9.0026"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.46094 12.5415H11.8359"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4141 1.9165H6.8724C3.33073 1.9165 1.91406 3.33317 1.91406 6.87484V11.1248C1.91406 14.6665 3.33073 16.0832 6.8724 16.0832H11.1224C14.6641 16.0832 16.0807 14.6665 16.0807 11.1248V7.58317"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
