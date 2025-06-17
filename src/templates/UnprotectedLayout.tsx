import { Box, Flex, Grid, Text } from '@/atoms';
import TnGovt from '@/assets/icons/TnGovt';
import Transtant from '@/assets/icons/Transtant';

export interface UnProtectedLayoutProps {
  children?: React.ReactNode;
  showHeaderAndSide?: boolean;
}

const returnGridProps = (canShow: boolean) => {
  return canShow
    ? { gridTemplateAreas: `"header header" "background main"` }
    : { gridTemplateAreas: `"main main" "main main"` };
};

export const UnProtectedLayout: React.FC<UnProtectedLayoutProps> = ({
  children,
  showHeaderAndSide = true
}: UnProtectedLayoutProps) => {
  return (
    <Grid
      className="w-[100vW] h-[100vH]"
      gridTemplateColumns="1fr 1fr"
      gridTemplateRows="70px 1fr"
      {...returnGridProps(showHeaderAndSide)}
    >
      <Box
        px={5}
        gridArea={'header'}
        className={`${showHeaderAndSide ? 'block' : 'hidden'} bg-[#6A398C26] flex items-center justify-between p-5`}
      >
        <Box className="flex items-center justify-between">
          <Transtant />
          <Text
            style={{
              fontSize: '28px',
              fontWeight: '700',
              fontFamily: 'poppins, sans-serif',
              background: 'linear-gradient(90deg, #770177 21%, #AA027A 84.5%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '8px'
            }}
          >
            TRANSTAN
          </Text>
        </Box>
        <Box>
          <TnGovt />
        </Box>
      </Box>
      <Flex
        className="bg-[url('../src/assets/imgs/Login-img.jpg')] bg-center bg-cover !hidden md:!flex"
        justifyContent={'center'}
        alignItems={'center'}
        gridArea={'background'}
      ></Flex>
      <Flex className="!hidden md:!flex" gridArea={'main'} justifyContent={'center'} alignItems={'center'}>
        {children}
      </Flex>
      <Flex className="w-screen h-screen bg-[url('../src/assets/imgs/Login-img.jpg')] bg-center bg-cover justify-center items-center !flex md:!hidden">
        <Box className="z-10 bg-[#f7f7f7]  p-5 rounded">{children}</Box>
      </Flex>
    </Grid>
  );
};
