import { Box } from '@/atoms';
import * as React from 'react';
import { SVGProps } from 'react';
export const TickIcon = (props: SVGProps<SVGSVGElement>) => (
  <Box className="p-2">
    <svg xmlns="http://www.w3.org/2000/svg" width={25} height={24} viewBox="0 0 25 24" fill="none" {...props}>
      <path
        d="M12.5039 22C18.0039 22 22.5039 17.5 22.5039 12C22.5039 6.5 18.0039 2 12.5039 2C7.00391 2 2.50391 6.5 2.50391 12C2.50391 17.5 7.00391 22 12.5039 22Z"
        fill="#F8F8FF"
        stroke="#F8F8FF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25391 12L11.0839 14.83L16.7539 9.17004"
        stroke="#804595"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);
