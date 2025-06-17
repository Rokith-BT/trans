import * as React from 'react';
import { SVGProps } from 'react';
import { CustomTooltip } from './ViewIcon';

interface FileUploadIconProps extends SVGProps<SVGSVGElement> {
  isPink?: boolean;
}
export const FileUploadIcon: React.FC<FileUploadIconProps> = ({ isPink, ...props }) => {
  const stroke = isPink ? '#D876A9' : '#A1999F';

  return (
    <CustomTooltip title="File" placement="top" arrow>
      <svg
        width={16}
        height={16}
        cursor={'pointer'}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g id="vuesax/linear/document-upload">
          <g id="document-upload">
            <path
              id="Vector"
              d="M7.50065 14.1666V9.16663L5.83398 10.8333"
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M7.5 9.16663L9.16667 10.8333"
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_3"
              d="M18.3327 8.33329V12.5C18.3327 16.6666 16.666 18.3333 12.4993 18.3333H7.49935C3.33268 18.3333 1.66602 16.6666 1.66602 12.5V7.49996C1.66602 3.33329 3.33268 1.66663 7.49935 1.66663H11.666"
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Vector_4"
              d="M18.3327 8.33329H14.9993C12.4993 8.33329 11.666 7.49996 11.666 4.99996V1.66663L18.3327 8.33329Z"
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </CustomTooltip>
  );
};
