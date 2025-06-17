import * as React from 'react';
import { SVGProps } from 'react';
const HeartBeatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={39} height={38} viewBox="0 0 39 38" fill="none" {...props}>
    <rect x={0.429688} width={38} height={38} rx={4} fill="#F8F8FF" />
    <path
      d="M16.3984 29H22.3984C27.3984 29 29.3984 27 29.3984 22V16C29.3984 11 27.3984 9 22.3984 9H16.3984C11.3984 9 9.39844 11 9.39844 16V22C9.39844 27 11.3984 29 16.3984 29Z"
      stroke="#2B9650"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.39844 19.7001L15.3984 19.6801C16.1484 19.6801 16.9884 20.2501 17.2684 20.9501L18.4084 23.8301C18.6684 24.4801 19.0784 24.4801 19.3384 23.8301L21.6284 18.0201C21.8484 17.4601 22.2584 17.4401 22.5384 17.9701L23.5784 19.9401C23.8884 20.5301 24.6884 21.0101 25.3484 21.0101H29.4084"
      stroke="#2B9650"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default HeartBeatIcon;
