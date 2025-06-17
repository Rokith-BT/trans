import { Box, BoxProps } from '../box';

export interface FlexProps extends BoxProps {
  children?: React.ReactNode;
}

export const Flex: React.FC<FlexProps> = ({ children, ...props }: FlexProps) => {
  return (
    <Box display={'flex'} {...props}>
      {children}
    </Box>
  );
};
