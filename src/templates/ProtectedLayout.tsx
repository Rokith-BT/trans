import { Box, Flex, Grid } from '@/atoms';
import { ProtectedHeader, Sidebar } from '@/molecules';
import { useProtectedHeader } from './protectedLayoutContext';
import { useWindowType } from '@/hooks/useWindowType';
import { useEffect } from 'react';

export interface ProtectedLayoutProps {
  children?: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }: ProtectedLayoutProps) => {
  const {
    state: { showSidebar }
  } = useProtectedHeader();
  const { isMobile } = useWindowType();

  useEffect(() => {
    if (showSidebar) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }, [showSidebar]);

  return (
    <Grid
      className="w-[100vW] h-[100vH] transition duration-300 ease overflow-x-hidden relative"
      gridTemplateColumns={isMobile ? `0px 1fr` : showSidebar ? `260px 1fr` : `70px 1fr`}
      gridTemplateRows="100px 1fr"
      gridTemplateAreas={showSidebar ? `"header header" "sidebar main"` : `"header header" "sidebar main"`}
    >
      <ProtectedHeader />
      {/* {showSidebar ? <Sidebar showSidebar={showSidebar} /> : <Sidebar showSidebar={showSidebar} />} */}
      {/* <Sidebar showSidebar={isMobile ? false : showSidebar} /> */}
      <Box className={`${isMobile ? 'absolute right-5 bg-white z-50 top-[100px]' : ''}`}>
        <Sidebar showSidebar={showSidebar} />
      </Box>
      <Flex
        gridArea={'main'}
        justifyContent={'center'}
        style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
      >
        {children}
      </Flex>
    </Grid>
  );
};
