import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';
export const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="Chat icon" placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={16} viewBox="0 0 18 16" fill="none" {...props}>
      <path
        d="M14.334 2.66797H3.66732C2.93398 2.66797 2.33398 3.26797 2.33398 4.0013L9.00065 8.66745L15.6673 4.0013C15.6673 3.26797 15.0673 2.66797 14.334 2.66797Z"
        fill="#C967A2"
      />
      <path
        d="M15.6673 4.0013C15.6673 3.26797 15.0673 2.66797 14.334 2.66797H3.66732C2.93398 2.66797 2.33398 3.26797 2.33398 4.0013M15.6673 4.0013V12.0013C15.6673 12.7346 15.0673 13.3346 14.334 13.3346H3.66732C2.93398 13.3346 2.33398 12.7346 2.33398 12.0013V4.0013M15.6673 4.0013L9.00065 8.66745L2.33398 4.0013"
        stroke="#C967A2"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </CustomTooltip>
);
