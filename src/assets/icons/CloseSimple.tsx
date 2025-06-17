import * as React from 'react';
import { SVGProps } from 'react';
interface CloseSimpleIconProps extends SVGProps<SVGSVGElement> {
  isColor?: boolean;
}

export const CloseSimpleIcon: React.FC<CloseSimpleIconProps> = ({ isColor, ...props }) => {
  const WhiteColor = isColor ? '#A1999F' : '#F8F8FF';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={25}
      cursor={'pointer'}
      viewBox="0 0 24 25"
      fill="none"
      {...props}
    >
      <path d="M16.0016 8.53271L8.00159 16.5327" stroke={WhiteColor} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.00159 8.53271L16.0016 16.5327" stroke={WhiteColor} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
