import React from 'react';
import { Route, Routes } from 'react-router';
// import Approvals from './Approvals';
import { HospitalListProvider } from '../hospitals/hospitalListContext';
import { OGLicensesProvider } from '../hospitals/organContext';
import Approvals from './apprvals-recreate/Approvals';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import { RecipientProvider } from '../recipients/RecipientContext';
import { ALFProvider } from '../alf/ALFContext';

const ApprovalLayout = () => {
  return (
    <div className="w-full p-5">
      <MasterDataProvider>
        <HospitalListProvider>
          <OGLicensesProvider>
            <RecipientProvider>
              <ALFProvider>
                <Routes>
                  <Route path="/" element={<Approvals />} />
                </Routes>
              </ALFProvider>
            </RecipientProvider>
          </OGLicensesProvider>
        </HospitalListProvider>
      </MasterDataProvider>
    </div>
  );
};

export default ApprovalLayout;
