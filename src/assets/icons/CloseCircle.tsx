import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

interface CloseCircleIconProps extends SVGProps<SVGSVGElement> {
  stroke?: string;
  toolText?: string;
  isColor?: boolean;
}

export const CloseCircleIcon: React.FC<CloseCircleIconProps> = ({
  isColor,
  stroke,
  toolText = 'Mark as Inactive',
  ...props
}) => {
  const greyColor = stroke ? stroke : isColor ? '#D876A9' : '#A1999F';
  return (
    <CustomTooltip title={toolText} placement="top" arrow>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={19}
        height={19}
        cursor={'pointer'}
        viewBox="0 0 19 19"
        fill="none"
        {...props}
      >
        <path
          d="M9.5 17.0005C13.625 17.0005 17 13.6255 17 9.50049C17 5.37549 13.625 2.00049 9.5 2.00049C5.375 2.00049 2 5.37549 2 9.50049C2 13.6255 5.375 17.0005 9.5 17.0005Z"
          stroke={greyColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.37695 11.6229L11.622 7.37793"
          stroke={greyColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.622 11.6229L7.37695 7.37793"
          stroke={greyColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CustomTooltip>
  );
};
