import React, { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

export const CardSlashIcon = ({
  toolText = '',
  color = '#80C967',
  ...props
}: SVGProps<SVGSVGElement> & { toolText?: string; color?: string }) => (
  <CustomTooltip title={toolText} placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" cursor='pointer' width={16} height={16} viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M1.66602 5.45801H9.38935"
        stroke={color}
        strokeWidth={1.17}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 10.125H4.7525"
        stroke={color}
        strokeWidth={1.17}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.91602 10.125H8.95768"
        stroke={color}
        strokeWidth={1.17}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.15625 12.4587H10.7446C12.8213 12.4587 13.3346 11.9454 13.3346 9.89787V4.51953"
        stroke={color}
        strokeWidth={1.17}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.1602 2.68783C11.7985 2.58283 11.3318 2.54199 10.7427 2.54199H4.25602C2.18518 2.54199 1.66602 3.05533 1.66602 5.10283V9.89199C1.66602 11.257 1.89352 11.9395 2.66352 12.2428"
        stroke={color}
        strokeWidth={1.17}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3327 1.66699L1.66602 13.3337"
        stroke={color}
        strokeWidth={1.17}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
