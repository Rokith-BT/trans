import { SVGProps } from 'react';
export const EyeClose = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#A1999F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 12s2.545-5.092 7-5.092c4.454 0 7 5.091 7 5.091s-2.546 5.091-7 5.091C7.545 17.09 5 12 5 12Z"
    />
    <path
      stroke="#A1999F"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 13.636a1.636 1.636 0 1 0 0-3.273 1.636 1.636 0 0 0 0 3.273Z"
    />
    <path stroke="#A1999F" strokeLinecap="round" strokeWidth={1.5} d="M6 18 18 6" />
  </svg>
);
