import * as React from 'react';
import { SVGProps } from 'react';
const ClockALFIcon = (props: SVGProps<SVGSVGElement>) => {
  const { color } = props;
  return (
    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g id="Frame 1000004636">
        <rect width={38} height={38} rx={4} fill="#F8F8FF" />
        <g id="vuesax/linear/clock">
          <g id="clock">
            <path
              id="Vector"
              d="M29 19.001C29 24.521 24.52 29.001 19 29.001C13.48 29.001 9 24.521 9 19.001C9 13.481 13.48 9.00098 19 9.00098C24.52 9.00098 29 13.481 29 19.001Z"
              stroke={`${color ? color : '#3A5A96'}`}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M22.7109 22.1788L19.6109 20.3288C19.0709 20.0088 18.6309 19.2388 18.6309 18.6088V14.5088"
              stroke={`${color ? color : '#3A5A96'}`}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
export default ClockALFIcon;
