import { Box, BoxProps } from '../box';

export interface GridProps extends BoxProps {
  children?: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({ children, ...props }: GridProps) => {
  return (
    <Box display={'grid'} {...props}>
      {children}
    </Box>
  );
};
