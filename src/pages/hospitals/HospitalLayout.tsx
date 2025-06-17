// src/pages/hospitals/HospitalLayout.tsx
import React from 'react';
import { Outlet, Navigate, Route, Routes } from 'react-router-dom';
// import { AddHospital } from './add/AddHospital';
import Dashboard from './Dashboard';
import OneHospital from './section/OneHospital';
import AddOrganLicense from './section/AddOrganLicense';
import AddLicenseByHospital from './section/AddLicenseByHospital';
import AddDoctor from './section/AddDoctor';
// import NtorcHospital from './add/sections/NtorcHospital';
import { HospitalListProvider } from './hospitalListContext';
import { OGLicensesProvider } from './organContext';
import { MasterDataProvider } from '../settings/setups/masterCotext';
// import NtorcHospital from './add/sections/NtorcHospital';
import ViewHospital from './view';
import EditLicence from './section/EditLicence';
import EditHospital from './edit';
// Import other hospital-related components as needed

export interface HospitalLayoutProps {}

export const HospitalLayout: React.FC<HospitalLayoutProps> = () => {
  return (
    <HospitalListProvider>
      <MasterDataProvider>
        <OGLicensesProvider>
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route pa ital" element={<AddHospital />} />
              <Route path="/add-ntorc-hospital" element={<NtorcHospital />} /> */}
              {/* <Route path="/hospital-dashboard" element={<OneHospital />} />
              <Route path="/add-organ-license" element={<AddOrganLicense />} />
              <Route path="/add-licenseby-hospital" element={<AddLicenseByHospital />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/add-co-ordinator" element={<AddDoctor />} />
              <Route path="/add-director" element={<AddDoctor />} /> */}
              <Route path="/:id/dashboard" element={<OneHospital />} />
              <Route path="/:id/view" element={<ViewHospital />} />
              <Route path="/:id/edit" element={<EditHospital />} />
              {/* <Route path="/:id/profile" element={<Component />} /> */}
              <Route path="/:id/organlicense" element={<AddOrganLicense />} />
              <Route path="/:id/organlicense-edit" element={<EditLicence />} />
              <Route path="/:id/license" element={<AddLicenseByHospital />} />
              <Route path="/:id/add-doctor" element={<AddDoctor />} />
              <Route path="/:id/add-co-ordinator" element={<AddDoctor />} />
              <Route path="/:id/add-director" element={<AddDoctor />} />
              <Route path="*" element={<Navigate to="/add-hospital" replace />} />
            </Routes>
            <Outlet />
          </div>
        </OGLicensesProvider>
      </MasterDataProvider>
    </HospitalListProvider>
  );
};

export default HospitalLayout;
