import * as React from 'react';
import { SVGProps } from 'react';
export const DeactivatedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={30} height={30} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M15.5 28C22.4036 28 28 22.4036 28 15.5C28 8.59644 22.4036 3 15.5 3C8.59644 3 3 8.59644 3 15.5C3 22.4036 8.59644 28 15.5 28Z"
      fill="#FFE1E1"
    />
    <path
      d="M27 15.5C27 21.8513 21.8513 27 15.5 27C9.14873 27 4 21.8513 4 15.5C4 9.14873 9.14873 4 15.5 4C21.8513 4 27 9.14873 27 15.5Z"
      stroke="#DD2323"
      strokeOpacity={0.15}
      strokeWidth={2}
    />
    <path d="M15.5 10.4775V16.4775" stroke="#DA2424" strokeWidth={2} strokeLinecap="round" />
    <circle cx={15.5} cy={19.5225} r={1} fill="#DA2424" />
  </svg>
);
