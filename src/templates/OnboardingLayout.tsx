import { Box, Flex, Grid } from '@/atoms';
import { OnboardingHeader } from '@/molecules';
import { ReactNode } from 'react';
interface OnboardingLayoutProps {
    children: ReactNode;
}
export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }: OnboardingLayoutProps) => {
    return (
        <Grid
            className="w-[100vW] h-[100vH] transition duration-300 ease overflow-x-hidden"
            gridTemplateColumns="1fr 1fr"
            gridTemplateRows="120px 1fr"
            gridTemplateAreas={ `"header header" "main main"` }
        >
            <Box
                gridArea={'header'}
                justifyContent={'center'}
                style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
            >
                <OnboardingHeader />
            </Box>
            <Flex
                gridArea={'main'}
                justifyContent={'center'}
                style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
            >
                {children}
            </Flex>
        </Grid>
    )
}