import { FC, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import OneHospital from '@/pages/hospitals/section/OneHospital';
import { ProtectedHeaderProvider, ProtectedLayout } from '@/templates';
import { PageNotFound } from '@/pages/common';
import { MasterDataProvider } from '@/pages/settings/setups/masterCotext';
import { HospitalProvider } from '@/pages/hospitals/hospitalContext';
import { useAuth } from './RouteContext';
import { OnboardingLayout } from '@/templates/OnboardingLayout';
import OnBoarding from '@/pages/hospitals/add/Onboarding';
import EditHospital from '@/pages/hospitals/edit';
import ViewHospital from '@/pages/hospitals/view';
import AddDoctor from '@/pages/hospitals/section/AddDoctor';
import EditUser from '@/pages/hospitals/section/EditUser';
import EditLicence from '@/pages/hospitals/section/EditLicence';
import LicenseView from '@/pages/hospitals/view/LicenseView';
import ViewUser from '@/pages/hospitals/section/ViewUser';
import { HospitalListProvider } from '@/pages/hospitals/hospitalListContext';
import Recipient from '@/pages/recipients/Recipient';
import { RecipientProvider } from '@/pages/recipients/RecipientContext';
import ADDALF from '@/pages/alf/ALF';
import { ALFProvider } from '@/pages/alf/ALFContext';
import ALFView from '@/pages/alf/view/ALFView';
import RecipientLayout from '@/pages/recipients/RecipientLayout';
import { ResetPassword } from '@/pages/sessions/ResetPassword';

const OnBoardingRoutes: FC = () => {
  return (
    <OnboardingLayout>
      <Routes>
        <Route path="/onboarding" element={<OnBoarding />} />
        {/* <Route path="/onboarding" element={<AddHospital />} /> */}
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </OnboardingLayout>
  );
};

const MainRoutes: FC = () => {
  return (
    <ProtectedHeaderProvider>
      <ProtectedLayout>
        <div className="w-full">
          <Routes>
            {/* <Route path="/recipients/*" element={<RecipientLayout />} />
                    <Route path="/donors/*" element={<DonorLayout />} /> */}
            <Route path="/dashboard" element={<OneHospital />} />
            <Route path="/:id/edit" element={<EditHospital />} />
            <Route path="/:id/view" element={<ViewHospital />} />
            <Route path="/:id/users" element={<AddDoctor />} />
            <Route path="/:id/edit-users" element={<EditUser />} />
            <Route path="/:id/organlicense-edit" element={<EditLicence />} />
            <Route path="/:id/license-view" element={<LicenseView />} />
            <Route path="/:id/view-users" element={<ViewUser />} />
            <Route path="/profile" element={<OnBoarding />} /> {/* Need to rework on this route */}
            <Route path="/page-not-found" element={<PageNotFound />} />
            {/* for recipient */}
            <Route path="/recipients/*" element={<RecipientLayout />} />
            <Route path="/:id/recipients" element={<Recipient />} />
            <Route path="/alf/" element={<ADDALF />} />
            <Route path="/alf/:recipientId/view" element={<ALFView />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </ProtectedLayout>
    </ProtectedHeaderProvider>
  );
};

const HospitalUserRoutes: FC = () => {
  const {
    state: {
      currentUser: { hospital }
    }
  } = useAuth();
  const { id, status } = hospital || {};

  return (
    <Suspense>
      <MasterDataProvider>
        <HospitalListProvider>
          <HospitalProvider hospitalId={id}>
            <RecipientProvider hospitalId={id}>
              <ALFProvider>
                {status === 'DetailsPending' || status === 'PendingApproval' || status === 'Rejected' ? (
                  <OnBoardingRoutes />
                ) : (
                  <MainRoutes />
                )}
              </ALFProvider>
            </RecipientProvider>
          </HospitalProvider>
        </HospitalListProvider>
      </MasterDataProvider>
    </Suspense>
  );
};

export default HospitalUserRoutes;
