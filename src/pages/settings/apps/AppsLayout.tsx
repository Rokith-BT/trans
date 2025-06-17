import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GeneralSetting from './GeneralSetting';
import Localization from './Localization';
import Modules from './Modules';
import Notification from './Notification';
import Sms from './Sms';
import Email from './Email';
import Payments from './Payments';
import Prefix from './Prefix';
import Recaptcha from './Recaptcha';
import Footer from './Footer';
import LoginType from './LoginType';
import SystemUpdate from './SystemUpdates';
import { MasterDataProvider } from '../setups/masterCotext';

interface LayoutProps {}

const AppsLayout: React.FC<LayoutProps> = () => {
  return (
    <div className="w-full">
      <MasterDataProvider>
        <Routes>
          <Route path="generals" element={<GeneralSetting />} />
          <Route path="localizations" element={<Localization />} />
          <Route path="modules" element={<Modules />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="sms" element={<Sms />} />
          <Route path="emails" element={<Email />} />
          <Route path="payments" element={<Payments />} />
          <Route path="prefix-settings" element={<Prefix />} />
          <Route path="recaptcha" element={<Recaptcha />} />
          <Route path="footers" element={<Footer />} />
          <Route path="login-types" element={<LoginType />} />
          <Route path="system-updates" element={<SystemUpdate />} />
        </Routes>
      </MasterDataProvider>
    </div>
  );
};

export default AppsLayout;
