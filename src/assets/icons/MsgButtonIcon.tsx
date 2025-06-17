import * as React from 'react';
import { SVGProps } from 'react';
const MsgButtonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M9.92473 5.52584L17.0581 9.09251C20.2581 10.6925 20.2581 13.3092 17.0581 14.9092L9.92473 18.4758C5.12473 20.8758 3.1664 18.9092 5.5664 14.1175L6.2914 12.6758C6.47473 12.3092 6.47473 11.7008 6.2914 11.3342L5.5664 9.88418C3.1664 5.09251 5.13306 3.12584 9.92473 5.52584Z"
      stroke="#C967A2"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6.5332 12H11.0332" stroke="#C967A2" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export default MsgButtonIcon;
