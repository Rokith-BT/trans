import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Resource from './Resource';
import { Box } from '@/atoms';
import AddTranstanUser from './section/AddTranstanUser';
import { ResourceProvider } from './ResourceContext';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import ViewTranstanUser from './section/ViewTranstanUser';

const ResourceLayout = () => {
  return (
    <MasterDataProvider>
      <ResourceProvider>
        <Box className="w-full px-[20px] md:px-[40px] py-[14px] md:py-[28px] h-full">
          <Routes>
            <Route path="/" element={<Resource />} />
            <Route path="add-transtan-user" element={<AddTranstanUser />} />
            <Route path="view-transtan-user" element={<ViewTranstanUser />} />
          </Routes>
        </Box>
      </ResourceProvider>
    </MasterDataProvider>
  );
};

export default ResourceLayout;
