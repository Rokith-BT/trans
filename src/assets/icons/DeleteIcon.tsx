import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

interface DeleteIconProps extends SVGProps<SVGSVGElement> {
  isRed?: boolean;
}

export const DeleteIcon: React.FC<DeleteIconProps> = ({ isRed, ...props }) => {
  const strokeColor = isRed ? '#C96767' : '#C967A2';
  return (
    <CustomTooltip title="Delete" placement="top" arrow>
      <svg
        width={19}
        height={18}
        cursor={'pointer'}
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g id="delete">
          <g id="trash">
            <path
              id="Vector"
              d="M16.6934 4.48486C14.1959 4.23736 11.6834 4.10986 9.17836 4.10986C7.69336 4.10986 6.20836 4.18486 4.72336 4.33486L3.19336 4.48486"
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M7.31836 3.7275L7.48336 2.745C7.60336 2.0325 7.69336 1.5 8.96086 1.5H10.9259C12.1934 1.5 12.2909 2.0625 12.4034 2.7525L12.5684 3.7275"
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_3"
              d="M15.0807 6.85498L14.5932 14.4075C14.5107 15.585 14.4432 16.5 12.3507 16.5H7.53566C5.44316 16.5 5.37566 15.585 5.29316 14.4075L4.80566 6.85498"
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_4"
              d="M8.69092 12.375H11.1884"
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_5"
              d="M8.06836 9.375H11.8184"
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </CustomTooltip>
  );
};
