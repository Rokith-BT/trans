import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const ExportIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Export" placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={17} viewBox="0 0 16 17" fill="none" {...props}>
      <path
        d="M10.96 6.43359C13.36 6.64026 14.34 7.87359 14.34 10.5736V10.6603C14.34 13.6403 13.1467 14.8336 10.1667 14.8336H5.82665C2.84665 14.8336 1.65332 13.6403 1.65332 10.6603V10.5736C1.65332 7.89359 2.61999 6.66026 4.97999 6.44026"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 10.5017V2.91504" stroke="#C967A2" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.2333 4.4013L7.99994 2.16797L5.7666 4.4013"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
