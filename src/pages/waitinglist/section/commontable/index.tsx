import { Box } from '@/atoms';
import { useWindowType } from '@/hooks/useWindowType';
import { CommonWaitingList } from '@/types/waitinglist';
import React from 'react';
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
interface CommonTableProps {
  list: CommonWaitingList[];
  isFilterApplied?: boolean;
}

const CommonTable: React.FC<CommonTableProps> = ({ list = [], isFilterApplied = false }) => {
  const { isMobile, isTablet } = useWindowType();

  return (
    <Box>
      {!isTablet && !isMobile ? (
        <DesktopView list={list} isFilterApplied={isFilterApplied} />
      ) : (
        <Box className="w-full max-w-full px-2">
          <MobileCardRenderer
            list={list}
            renderCard={(item) => <MobileView list={item} isFilterApplied={isFilterApplied} />}
          />
        </Box>
      )}
    </Box>
  );
};

export default CommonTable;
