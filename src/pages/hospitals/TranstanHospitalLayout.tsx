import React from 'react';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';
// import { AddHospital } from './add/AddHospital';
// import Dashboard from './Dashboard';
import OneHospital from './section/OneHospital';
// import AddOrganLicense from './section/AddOrganLicense';
// import AddLicenseByHospital from './section/AddLicenseByHospital';
// import AddDoctor from './section/AddDoctor';
import { HospitalListProvider } from './hospitalListContext';
import { OGLicensesProvider } from './organContext';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import { HospitalProvider, useHospital } from './hospitalContext';
import ViewHospital from './view';
import EditHospital from './edit';
import AddDoctor from './section/AddDoctor';
import EditUser from './section/EditUser';
import EditLicence from './section/EditLicence';
import ViewUser from './section/ViewUser';
import OnBoarding from './add/transtanAdmin/Onboarding';
import Loading from '../components/Loading';
import LicenseView from './view/LicenseView';
import { RecipientProvider } from '../recipients/RecipientContext';
import { RoleProvider } from '../roles_permission/RoleContex';

// Import other hospital-related components as needed

export interface TranstanHospitalLayoutProps {}

export const HospitalRoutes = () => {
  const { id } = useParams();

  return (
    <HospitalProvider hospitalId={id}>
      <HospitalStatusRoutes />
    </HospitalProvider>
  );
};

const HospitalStatusRoutes = () => {
  const {
    state: { loading, hospital }
  } = useHospital();

  if (loading) return <Loading />;

  const { basicDetails } = hospital;
  const { status } = basicDetails;
  // const defaultRoute =
  //   status === 'DetailsPending' || status === 'PendingApproval' || status === 'Rejected' ? 'onboarding' : 'dashboard';

  return (
    <Routes>
      {(status === 'DetailsPending' || status === 'PendingApproval' || status === 'Rejected') && (
        <Route path="onboarding" element={<OnBoarding />} />
      )}
      {status !== 'DetailsPending' && (
        <>
          <Route path="dashboard" element={<OneHospital />} />
          <Route path="view" element={<ViewHospital forView={false} />} />
          <Route path="approvalview" element={<ViewHospital forView={false} forapproval={true} />} />
          <Route path="edit" element={<EditHospital />} />
          <Route path="users" element={<AddDoctor />} />
          <Route path="edit-users" element={<EditUser />} />
          <Route path="organlicense-edit" element={<EditLicence />} />
          <Route path="license-view" element={<LicenseView />} />
          <Route path="view-users" element={<ViewUser />} />
          <Route path="license-view" element={<LicenseView />} />
        </>
      )}
      {/* <Route path="*" element={<Navigate to={defaultRoute} replace />} /> */}
    </Routes>
  );
};

export const TranstanHospitalLayout: React.FC<TranstanHospitalLayoutProps> = () => {
  return (
    <HospitalListProvider>
      <MasterDataProvider>
        <OGLicensesProvider>
          <HospitalProvider>
            <RecipientProvider>
              <RoleProvider>
                <div className="w-full">
                  <Outlet />
                </div>
              </RoleProvider>
            </RecipientProvider>
          </HospitalProvider>
        </OGLicensesProvider>
      </MasterDataProvider>
    </HospitalListProvider>
  );
};

export default TranstanHospitalLayout;
