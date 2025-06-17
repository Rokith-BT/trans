import { styled, Tooltip, TooltipProps } from '@mui/material';
import { ReactElement, SVGProps } from 'react';

interface CustomTooltipProps extends TooltipProps {
  color?: string;
  text?: string;
  children: ReactElement;
}

export const CustomTooltip = styled(({ className, ...props }: CustomTooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))<CustomTooltipProps>(({ color = '#333', text = '#fff' }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: color,
    color: text,
    fontSize: '0.875rem',
    padding: '8px 12px',
    borderRadius: '6px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    '& *': {
      color: text // Ensures nested elements follow text color
    }
  },
  [`& .MuiTooltip-arrow`]: {
    color: color
  }
}));

export const ViewIcon = (props: SVGProps<SVGSVGElement>) => (
  <CustomTooltip title="View" placement="top" arrow>
    <svg xmlns="http://www.w3.org/2000/svg" width={23} height={23} cursor="pointer" fill="none" {...props}>
      <g stroke="#C967A2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
        <path d="M2.945 11.496s3.111-6.223 8.556-6.223c5.444 0 8.555 6.223 8.555 6.223s-3.11 6.222-8.555 6.222-8.556-6.222-8.556-6.222Z" />
        <path d="M11.5 13.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </g>
    </svg>
  </CustomTooltip>
);
