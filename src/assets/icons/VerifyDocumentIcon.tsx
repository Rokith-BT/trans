import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const VerifyDocumentIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Verify Document" placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={19} height={18} viewBox="0 0 19 18" fill="none" {...props}>
      <path
        d="M7.65234 11.0249L8.77734 12.1499L11.7773 9.1499"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.16797 4.5H11.168C12.668 4.5 12.668 3.75 12.668 3C12.668 1.5 11.918 1.5 11.168 1.5H8.16797C7.41797 1.5 6.66797 1.5 6.66797 3C6.66797 4.5 7.41797 4.5 8.16797 4.5Z"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.668 3.01465C15.1655 3.14965 16.418 4.07215 16.418 7.49965V11.9996C16.418 14.9996 15.668 16.4996 11.918 16.4996H7.41797C3.66797 16.4996 2.91797 14.9996 2.91797 11.9996V7.49965C2.91797 4.07965 4.17047 3.14965 6.66797 3.01465"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
