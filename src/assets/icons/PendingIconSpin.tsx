import * as React from 'react';
import { SVGProps } from 'react';
import './PendingIconSpin.css';

export const PendingSpinIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={31} height={30} viewBox="0 0 31 30" fill="none" {...props}>
    <path
      d="M15.5 27.5C22.4036 27.5 28 21.9036 28 15C28 8.09644 22.4036 2.5 15.5 2.5C8.59644 2.5 3 8.09644 3 15C3 21.9036 8.59644 27.5 15.5 27.5Z"
      fill="#EEDABC"
    />
    <path
      d="M27 15C27 21.3513 21.8513 26.5 15.5 26.5C9.14873 26.5 4 21.3513 4 15C4 8.64873 9.14873 3.5 15.5 3.5C21.8513 3.5 27 8.64873 27 15Z"
      stroke="#C88726"
      strokeOpacity={0.15}
      strokeWidth={2}
    />
    {/* Slow spinning clock hand */}
    <g className="spin-slow">
      <path
        d="M15.5 9.5V15.5L19.5 17.5 18.5"
        stroke="#C88726"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    {/* Fast spinning clock hand */}
    {/* <g className="spin-fast">
      <path d="M15.5 15.5L11.5 17.5" stroke="#C88726" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </g> */}
  </svg>
);
