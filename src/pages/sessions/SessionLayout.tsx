import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { SessionProvider } from './sessionContext';
import { Login } from './Login';
import { ForgotPassword } from './ForgotPassword';
import { ChangePassword } from './ChangePassword';
import { MFA } from './MFA';
// import { ResetPassword } from './ResetPassword';

export interface SessionProps {}

export const SessionLayout: React.FC<SessionProps> = () => {
  return (
    <SessionProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ChangePassword />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/mfa" element={<MFA />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Outlet />
    </SessionProvider>
  );
};

export default SessionLayout;
