import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const EditIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Edit" placement="top" arrow>
    <svg
      width={19}
      height={18}
      cursor="pointer"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="edit">
        <g id="edit_2">
          <path
            id="Vector"
            d="M8.75 1.5H7.25C3.5 1.5 2 3 2 6.75L2 11.25C2 15 3.5 16.5 7.25 16.5H11.75C15.5 16.5 17 15 17 11.25V9.75"
            stroke="#C967A2"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_2"
            d="M12.5299 2.26592L6.61991 8.17592C6.39491 8.40092 6.16991 8.84342 6.12491 9.16592L5.80241 11.4234C5.68241 12.2409 6.25991 12.8109 7.07741 12.6984L9.33491 12.3759C9.64991 12.3309 10.0924 12.1059 10.3249 11.8809L16.2349 5.97092C17.2549 4.95092 17.7349 3.76592 16.2349 2.26592C14.7349 0.765922 13.5499 1.24592 12.5299 2.26592Z"
            stroke="#C967A2"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            id="Vector_3"
            d="M11.6826 3.11328C12.1851 4.90578 13.5876 6.30828 15.3876 6.81828"
            stroke="#C967A2"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  </CustomTooltip>
);
