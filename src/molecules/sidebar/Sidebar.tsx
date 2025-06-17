import { Box, Flex, Text } from '@/atoms';
import { SidebarItem } from './sections/SidebarItem';
import { useProtectedHeader } from '@/templates';
import { ArrowLeftIcon } from '@/assets/icons/ArrowLeft';
import PropTypes from 'prop-types';
import { useWindowType } from '@/hooks/useWindowType';
import { MobileSideBar } from './sections/MobileSideBarItem';
export interface SidebarProps {
  showSidebar: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ showSidebar }) => {
  const {
    state: { nestedMenus },
    actions: { updateCurrentItem, goBackOnSidebar, sidebarToggle }
  } = useProtectedHeader();
  const { items, currentItem } = nestedMenus[nestedMenus.length - 1];
  const { isMobile } = useWindowType();
  console.log(items, 'itemsitemsitemsitemsitemsasdasd', nestedMenus);

  return (
    <Box gridArea={'sidebar'} className="border-[1px] border-b-[0px] h-full border-[#8000802e]">
      {currentItem && !isMobile && (
        <Flex
          className="p-[8px] px-[24px] mt-2 mb-2 gap-[16px] cursor-pointer"
          onClick={() => {
            goBackOnSidebar();
            // sidebarToggle();
          }}
        >
          <ArrowLeftIcon />
          {showSidebar && (
            <Text className="text-[19px] text-nowrap text-[#804595] font-medium" fontWeight={600}>
              {currentItem.name}
            </Text>
          )}
        </Flex>
      )}
      <Box>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {items.map((sidebarItem: any, index: number) => (
          <Box key={index}>
            {isMobile ? (
              <MobileSideBar />
            ) : (
              <SidebarItem
                key={index}
                item={sidebarItem}
                onClick={() => {
                  updateCurrentItem(index, sidebarItem);
                }}
                toogleSidebar={sidebarToggle}
                showSidebar={showSidebar}
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
Sidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired
};
