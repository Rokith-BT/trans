import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
const VerifyTick = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="ALF Approver" arrow placement="top">
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <path
        d="M12.0547 4.53743L13.1172 5.59994L15.9505 2.7666"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.45703 9.70825H8.9987"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.45703 12.5417H11.832"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.418 1.91675H6.8763C3.33464 1.91675 1.91797 3.33341 1.91797 6.87508V11.1251C1.91797 14.6667 3.33464 16.0834 6.8763 16.0834H11.1263C14.668 16.0834 16.0846 14.6667 16.0846 11.1251V7.58341"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
export default VerifyTick;
