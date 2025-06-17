import { ToolTips } from '@/atoms';
import * as React from 'react';
import { SVGProps } from 'react';
interface InforCircleIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

export const InforCircleIcon: React.FC<InforCircleIconProps> = ({ title = '', ...props }) => (
  <ToolTips title={title} placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8.0026 14.6673C11.6693 14.6673 14.6693 11.6673 14.6693 8.00065C14.6693 4.33398 11.6693 1.33398 8.0026 1.33398C4.33594 1.33398 1.33594 4.33398 1.33594 8.00065C1.33594 11.6673 4.33594 14.6673 8.0026 14.6673Z"
        stroke="#A1999F"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 5.33398V8.66732" stroke="#A1999F" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10.666H8.00599" stroke="#A1999F" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </ToolTips>
);
