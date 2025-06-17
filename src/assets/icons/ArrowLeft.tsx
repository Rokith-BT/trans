// import { SVGProps } from 'react';
// export const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" {...props}>
//     <path
//       stroke="#804595"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={1.5}
//       d="M11 19.403a8.403 8.403 0 1 0 0-16.805 8.403 8.403 0 0 0 0 16.805ZM13.94 11H8.9"
//     />
//     <path
//       stroke="#804595"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={1.5}
//       d="M10.58 8.48 8.06 11l2.52 2.521"
//     />
//   </svg>
// );
import * as React from 'react';
import { SVGProps } from 'react';
export const ArrowLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
    <path
      d="M11.0007 20.1663C16.0633 20.1663 20.1673 16.0623 20.1673 10.9997C20.1673 5.93706 16.0633 1.83301 11.0007 1.83301C5.93804 1.83301 1.83398 5.93706 1.83398 10.9997C1.83398 16.0623 5.93804 20.1663 11.0007 20.1663Z"
      stroke="#804595"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14.209 11H8.70898" stroke="#804595" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M10.541 8.25L7.79102 11L10.541 13.75"
      stroke="#804595"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
