import { Box } from '@/atoms';
import React from 'react';
import { Route, Routes } from 'react-router';
import LiverRota from './session/LiverRota';
import { LiverRotaProvider } from './LiverRotaContext';
// import LiverRotaTable from './LiverRotaTable';

const LiverRotaLayout = () => {
  return (
    <Box px={5} className="w-full">
      <LiverRotaProvider>
        <Routes>
          <Route path="/" element={<LiverRota />} />
          {/* <Route path="/liverrota" element={<LiverRotaTable />} /> */}
        </Routes>
      </LiverRotaProvider>
    </Box>
  );
};

export default LiverRotaLayout;
