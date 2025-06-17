import * as React from 'react';
import { SVGProps } from 'react';
const TicketNavImage = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 22 22" fill="none" {...props}>
    <path
      d="M17.5625 11.4375C17.5625 10.23 18.5425 9.25 19.75 9.25V8.375C19.75 4.875 18.875 4 15.375 4H6.625C3.125 4 2.25 4.875 2.25 8.375V8.8125C3.4575 8.8125 4.4375 9.7925 4.4375 11C4.4375 12.2075 3.4575 13.1875 2.25 13.1875V13.625C2.25 17.125 3.125 18 6.625 18H15.375C18.875 18 19.75 17.125 19.75 13.625C18.5425 13.625 17.5625 12.645 17.5625 11.4375Z"
      fill="#804595"
      stroke="#804595"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.25 4L9.25 18"
      stroke="#F8F8FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="3 3"
    />
  </svg>
);
export default TicketNavImage;
