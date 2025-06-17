import React from 'react';
import { Route, Routes } from 'react-router';
import { Box } from '@/atoms';
import AddLiveTransplantTable from './LiveTransplantTable';
import { DonorProvider } from '../DonorContext';
import TransplantDetails from './section/TransplantDetails';
import { MasterDataProvider } from '../../settings/setups/masterCotext';
import { HospitalListProvider } from '../../hospitals/hospitalListContext';
import LiveTransplant from './LiveTransplant';

const LiveTransplantLayout = () => {
  return (
    <Box px={5} className="w-full ">
      <HospitalListProvider>
        <MasterDataProvider>
          <DonorProvider>
            <Routes>
              <Route path="/" element={<LiveTransplant list={[]} />} />
              <Route path="/addlivetransplanttable" element={<AddLiveTransplantTable list={[]} />} />
              <Route path="/transplantdetails" element={<TransplantDetails />} />
              <Route path="/transplantdetails/:id/edit" element={<TransplantDetails />} />
            </Routes>
          </DonorProvider>
        </MasterDataProvider>
      </HospitalListProvider>
    </Box>
  );
};

export default LiveTransplantLayout;
