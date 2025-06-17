/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@/atoms';
import { useWindowType } from '@/hooks/useWindowType';
import React from 'react';
import styles from './MobileCardRender.module.scss';

interface MobileCardRendererProps<T> {
  list: T[] | any;
  // eslint-disable-next-line no-unused-vars
  renderCard: (item: T) => React.ReactNode;
}

export function MobileCardRenderer<T>({ list, renderCard }: MobileCardRendererProps<T>) {
  const isSidebarOpen = document.body.classList.contains('sidebar-open');
  console.log('issidebar', isSidebarOpen);

  const { isTablet } = useWindowType();
  const gridClass = isTablet ? 'mobile-card' : 'tablet-card';
  return list?.length > 0 ? (
    <Box sx={{ width: '100%' }} className={` ${styles[`${gridClass}`]} pr-2`}>
      {list?.map((item) => renderCard(item))}
    </Box>
  ) : (
    <Box className="mt-4 text-center animate-float">No Data</Box>
  );
}
