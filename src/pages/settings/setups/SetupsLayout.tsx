import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CauseOfDeath from './CauseOfDeath';
import TerminationReason from './TerminationReason';
import Zone from './Zone';
import Organ from './Organ';
import MultiOrgan from './MultiOrgan';
import Department from './Department';
import Qualification from './Qualification';
// import FileUpload from './FileUpload';
import BloodGroup from './BloodGroup';
// import HospitalType from './HospitalType';
// import Event from './Event';
// import HospitalGroup from './HospitalGroup';
import Contact from './Contact';
import { MasterDataProvider } from './masterCotext';
import Designation from './Designation';

interface LayoutProps {}

const SetupLayout: React.FC<LayoutProps> = () => {
  return (
    <div className="w-full">
      <MasterDataProvider>
        <Routes>
          <Route path="cause-of-deaths" element={<CauseOfDeath />} />
          <Route path="termination-reasons" element={<TerminationReason />} />
          <Route path="zones" element={<Zone />} />
          <Route path="organs" element={<Organ />} />
          <Route path="multi-organs" element={<MultiOrgan />} />
          <Route path="departments" element={<Department />} />
          <Route path="qualifications" element={<Qualification />} />
          {/* <Route path="file-uploads" element={<FileUpload />} /> */}
          <Route path="blood-groups" element={<BloodGroup />} />
          {/* <Route path="hospital-types" element={<HospitalType />} />
          <Route path="events" element={<Event />} /> */}
          {/* <Route path="hospital-groups" element={<HospitalGroup />} /> */}
          <Route path="contacts" element={<Contact />} />
          <Route path="designations" element={<Designation />} />
        </Routes>
      </MasterDataProvider>
    </div>
  );
};

export default SetupLayout;
