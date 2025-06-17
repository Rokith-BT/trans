import * as React from 'react';
import { SVGProps } from 'react';
const ManageDonorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M22 11V17C22 21 21 22 17 22H7C3 22 2 21 2 17V7C2 3 3 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C21 6 22 7 22 11Z"
      fill="#804595"
      stroke="#804595"
      strokeWidth={1.5}
      strokeMiterlimit={10}
    />
    <path
      d="M9.20436 14.2853L11.7844 16.5453C11.9044 16.6553 12.0944 16.6553 12.2144 16.5453L14.7944 14.2853C15.4644 13.6953 15.5544 12.6953 14.9944 11.9953C14.4344 11.2953 13.4144 11.1653 12.7044 11.7053L12.0044 12.2453L11.2944 11.7153C10.5744 11.1753 9.56436 11.3053 9.00436 12.0053C8.44436 12.6953 8.53436 13.7053 9.20436 14.2853Z"
      fill="#F8F8FF"
      stroke="#F8F8FF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default ManageDonorIcon;
