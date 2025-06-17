import { Box } from '@/atoms';
import React from 'react';
import { Outlet, Route, Routes } from 'react-router';
import WaitingList from './WaitingList';
import CommonWaitingList from './CommonWaitingList';
import InhouseWaitingList from './InhouseWaitingList';
import { RecipientProvider } from '../recipients/RecipientContext';
import { WaitingListProvider } from './WaitingListContext';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import { ALFProvider } from '../alf/ALFContext';

const WaitingLayout = () => {
  return (
    <MasterDataProvider>
      <RecipientProvider>
        <WaitingListProvider>
          <ALFProvider>
            <Box className="w-full py-[14px] md:py-[28px] px-[16px] md:px-[48px]">
              <Routes>
                <Route path="transtan" element={<WaitingList />} />
                <Route path="/common" element={<CommonWaitingList />} />
                <Route path="/inhouse" element={<InhouseWaitingList />} />
              </Routes>
              <Outlet />
            </Box>
          </ALFProvider>
        </WaitingListProvider>
      </RecipientProvider>
    </MasterDataProvider>
  );
};

export default WaitingLayout;
