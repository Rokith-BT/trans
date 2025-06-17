import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { FC, Suspense, lazy } from 'react';
import { ProtectedLayout } from '@/templates';
import { ProtectedHeaderProvider } from '@/templates/protectedLayoutContext';
// import DonorLayout from '@/pages/donors/DonorLayout';
import Loading from '@/pages/components/Loading';
import TranstanHospitalLayout, { HospitalRoutes } from '@/pages/hospitals/TranstanHospitalLayout';
import Dashboard from '@/pages/hospitals/Dashboard';
import { ResetPassword } from '@/pages/sessions/ResetPassword';
const AppSettingLayout = lazy(() => import('../pages/settings/apps/AppsLayout'));
const MasterSettingLayout = lazy(() => import('../pages/settings/setups/SetupsLayout'));
// const RecipientLayout = lazy(() => import('@/pages/recipient/RecipientLayout'));
const DonorLayout = lazy(() => import('@/pages/donors/DonorLayout'));
const ApprovalLayout = lazy(() => import('@/pages/approvals/ApprovalLayout'));
const ALFLayout = lazy(() => import('@/pages/alf/ALFLayout'));
// const ALFLayout = lazy(() => import('@/pages/alf_old/ALFLayout'));
const RecipientLayout = lazy(() => import('@/pages/recipients/RecipientLayout'));
const WaitingListLayout = lazy(() => import('@/pages/waitinglist/WaitingLayout'));
const RolesLayout = lazy(() => import('@/pages/roles_permission/RolesLayout'));
// const LiveTransplantLayout = lazy(() => import('@/pages/donors/LiveTransplant/LiveTransplantLayout'));
// const LiverRotaLayout = lazy(() => import('@/pages/LiverRota/LiverRotaLayout'));
const ResourceLayout = lazy(() => import('@/pages/resource/ResourceLayout'));

const TranstanRoutes: FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <ProtectedHeaderProvider>
        <ProtectedLayout>
          <Routes>
            <Route path="/settings/apps/*" element={<AppSettingLayout />} />
            <Route path="/settings/setups/*" element={<MasterSettingLayout />} />
            <Route path="/hospitals/*" element={<TranstanHospitalLayout />}>
              <Route path="" element={<Dashboard />} />
              <Route path=":id/*" element={<HospitalRoutes />} />
            </Route>
            <Route path="/approvals/*" element={<ApprovalLayout />} />
            <Route path="/recipients/*" element={<RecipientLayout />} />
            <Route path="/waitinglist/*" element={<WaitingListLayout />} />
            {/* <Route path="/recipients/*" element={<RecipientLayout />} />
             */}
            {/* <Route path="/acute-liver/*" element={<ALFLayout />} /> */}
            <Route path="/donors/*" element={<DonorLayout />} />
            {/* <Route path="/livetransplant/*" element={<LiveTransplantLayout />} /> */}
            {/* <Route path="/liverrota/*" element={<LiverRotaLayout />} /> */}
            <Route path="/alf/*" element={<ALFLayout />} />
            <Route path="/settings/permissions/roles/*" element={<RolesLayout />} />
            <Route path="/resource-management/*" element={<ResourceLayout />} />
            <Route
              path="/dashboard"
              element={
                <>
                  Welcome to the Dashboard <Link to="/donors/generate-waiting-list"></Link>
                </>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ProtectedLayout>
      </ProtectedHeaderProvider>
    </Suspense>
  );
};

export default TranstanRoutes;
