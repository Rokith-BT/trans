import * as React from 'react';
import { SVGProps } from 'react';
const CommonWaitlistImg = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      fill="#804595"
      stroke="#804595"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3691 8.87988H17.6191"
      stroke="#F8F8FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.38086 8.87988L7.13086 9.62988L9.38086 7.37988"
      stroke="#F8F8FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3691 15.8799H17.6191"
      stroke="#F8F8FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.38086 15.8799L7.13086 16.6299L9.38086 14.3799"
      stroke="#F8F8FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default CommonWaitlistImg;
