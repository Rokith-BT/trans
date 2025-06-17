import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

const ExtendIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title={'Extend for 2 days'} placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M10.8711 16.0013V12.668"
        stroke="#67B1C9"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.4993 14.332H9.16602"
        stroke="#67B1C9"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.83398 5.33203V7.33203"
        stroke="#67B1C9"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.166 5.33203V7.33203"
        stroke="#67B1C9"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0418 6.28125C17.2685 6.36125 18.3952 7.18125 18.4618 10.3146L18.5485 14.4279C18.6018 17.1746 17.9685 18.5546 14.6352 18.6279L10.6352 18.7079C7.30184 18.7746 6.60851 17.4146 6.55518 14.6746L6.46184 10.5546C6.39518 7.42125 7.49518 6.55458 9.70851 6.38792L15.0418 6.28125Z"
        stroke="#67B1C9"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
export default ExtendIcon;
