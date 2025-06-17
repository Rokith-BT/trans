import React from 'react';
import { Outlet, Route, Routes } from 'react-router';
import { DonorList } from './DonorsList';
import AddDonor from './add/AddDonor';
import DonorIdenti from './section/DonorIdenti';
import DonorAlocation from './donor_allocation/DonorAllocation';
import DonorStepper from './donor_allocation/section/DonorStepper';

export interface RecipientLayoutProps {}

const RecipientLayout: React.FC<RecipientLayoutProps> = () => {
  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/" element={<DonorList />} />
        <Route path="/add-donor" element={<AddDonor />} />
        <Route path="/identification" element={<DonorIdenti />} />
        <Route path="/allocation" element={<DonorAlocation />} />
        <Route path="/stepper" element={<DonorStepper />} />
      </Routes>
      <Outlet />
    </div>
  );
};

export default RecipientLayout;
