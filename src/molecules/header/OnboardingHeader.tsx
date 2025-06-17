import { TranstantLogo } from '@/assets/logo'
import { Box } from '@/atoms'
import AccountMenu from './AccountMenu'

export const OnboardingHeader: React.FC = () => {
    return (
        <Box gridArea={'header'} className="bg-[#6A398C26] h-[120px]">
            <Box className="flex w-full items-center justify-between px-5">
                <TranstantLogo />
                <AccountMenu />
            </Box>
        </Box>
    )
}