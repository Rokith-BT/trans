import React from 'react';
import { Box } from '@/atoms';

interface ChildTab {
  content: React.ReactNode;
}

const ChildContent: React.FC<{ childTabs: ChildTab[] }> = ({ childTabs }) => (
  <Box className="w-full">
    {childTabs.length > 0
      ? childTabs.map((tab, index) => <Box key={index}>{tab.content} </Box>)
      : 'Select a child tab to see content.'}
  </Box>
);

export default ChildContent;
