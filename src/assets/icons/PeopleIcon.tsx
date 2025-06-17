import * as React from 'react';
import { SVGProps } from 'react';

interface PeopleIconProps extends SVGProps<SVGSVGElement> {
  stroke?: string;
}
export const PeopleIcon: React.FC<PeopleIconProps> = ({ stroke = '#00008B', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={25} viewBox="0 0 24 25" fill="none" {...props}>
    <path
      d="M15.9987 8.93326C15.9587 8.92659 15.9121 8.92659 15.8721 8.93326C14.9521 8.89992 14.2188 8.14659 14.2188 7.21326C14.2188 6.25992 14.9854 5.49326 15.9387 5.49326C16.8921 5.49326 17.6587 6.26659 17.6587 7.21326C17.6521 8.14659 16.9187 8.89992 15.9987 8.93326Z"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.3117 13.7867C16.2251 13.94 17.2318 13.78 17.9384 13.3067C18.8784 12.68 18.8784 11.6534 17.9384 11.0267C17.2251 10.5534 16.2051 10.3934 15.2917 10.5534"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.98031 8.93326C8.02031 8.92659 8.06698 8.92659 8.10698 8.93326C9.02698 8.89992 9.76031 8.14659 9.76031 7.21326C9.76031 6.25992 8.99365 5.49326 8.04031 5.49326C7.08698 5.49326 6.32031 6.26659 6.32031 7.21326C6.32698 8.14659 7.06031 8.89992 7.98031 8.93326Z"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.6676 13.7866C7.75427 13.9399 6.7476 13.7799 6.04094 13.3066C5.10094 12.6799 5.10094 11.6533 6.04094 11.0266C6.75427 10.5533 7.77427 10.3933 8.6876 10.5533"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.9973 13.9111C11.9573 13.9045 11.9106 13.9045 11.8706 13.9111C10.9506 13.8778 10.2173 13.1245 10.2173 12.1911C10.2173 11.2378 10.984 10.4711 11.9373 10.4711C12.8906 10.4711 13.6573 11.2445 13.6573 12.1911C13.6506 13.1245 12.9173 13.8845 11.9973 13.9111Z"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0578 16.0115C9.11778 16.6382 9.11778 17.6649 10.0578 18.2915C11.1244 19.0049 12.8711 19.0049 13.9378 18.2915C14.8778 17.6649 14.8778 16.6382 13.9378 16.0115C12.8778 15.3049 11.1244 15.3049 10.0578 16.0115Z"
      stroke={stroke}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
