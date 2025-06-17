import { Route, Routes } from 'react-router-dom';
import { FC, Suspense, lazy } from 'react';
import { PageNotFound } from '@/pages/common';
const ComponentPage = lazy(() => import('../pages/components/ComponentPage'));
const SessionLayout = lazy(() => import('../pages/sessions/SessionLayout'));

const OpenRoutes: FC = () => {
  return (
    <Suspense>
      <Routes>
        {import.meta.env.MODE === 'development' && <Route path="/components" element={<ComponentPage />} />}
        <Route path="/page-not-found" element={<PageNotFound />} />
        <Route path="*" element={<SessionLayout />} />
      </Routes>
    </Suspense>
  );
};

export default OpenRoutes;
