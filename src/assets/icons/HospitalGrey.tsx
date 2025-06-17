import * as React from 'react';
import { SVGProps } from 'react';
interface HospitalGreyIconProps extends SVGProps<SVGSVGElement> {
  stroke?: string;
}
export const HospitalGreyIcon: React.FC<HospitalGreyIconProps> = ({ stroke = '#A1999F', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 17 17" fill="none" {...props}>
    <path
      d="M1.83325 14.7588H15.1666"
      stroke={stroke}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.8333 1.42529H5.16667C3.16667 1.42529 2.5 2.61863 2.5 4.09196V14.7586H14.5V4.09196C14.5 2.61863 13.8333 1.42529 11.8333 1.42529Z"
      fill={stroke}
      stroke={stroke}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.8734 10.092H7.12007C6.78007 10.092 6.49341 10.372 6.49341 10.7187V14.7587H10.4934V10.7187C10.5001 10.372 10.2201 10.092 9.8734 10.092Z"
      fill="#F8F8FF"
      stroke={stroke}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 4.09204V7.42537"
      stroke="#F8F8FF"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.83325 5.75879H10.1666"
      stroke="#F8F8FF"
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
