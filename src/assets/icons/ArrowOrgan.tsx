import * as React from 'react';
import { SVGProps } from 'react';
export const ArrowOrgan = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={70} viewBox="0 0 12 70" fill="none" {...props}>
    <rect width={12} height={70} rx={4} fill="#EDEDED" />
    <path
      d="M5 32.1719L7.12132 34.2932C7.51184 34.6837 7.51184 35.3169 7.12132 35.7074L5 37.8287"
      stroke="#71717A"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);
