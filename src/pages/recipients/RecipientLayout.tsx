import { Box } from '@/atoms';
import { Outlet, Route, Routes } from 'react-router';
import Recipient from './Recipient';
import { RecipientProvider } from './RecipientContext';
import AddRecipient from './add/AddRecipient';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import { HospitalListProvider } from '../hospitals/hospitalListContext';
import RecipientTransfer from './section/RecipientTransfer';
import ViewRecipient from './view/ViewRecipient';
import TransferRecipient from './TransferRecipient';
import ViewTransferRecipient from './view/ViewTransferRecipient';
import { ALFProvider } from '../alf/ALFContext';

const RecipientLayout = () => {
  return (
    <MasterDataProvider>
      <HospitalListProvider>
        <RecipientProvider>
          <ALFProvider>
            <Box className="w-full px-4 md:px-10">
              <Routes>
                <Route path="/" element={<Recipient />} />
                <Route path="/add-recipient" element={<AddRecipient />} />
                <Route path="/:recipientId/edit" element={<AddRecipient />} />
                <Route path="/manage-transfer" element={<TransferRecipient />} />
                <Route path="/manage-transfer/transfer" element={<RecipientTransfer />} />
                <Route path="/:recipientId/view" element={<ViewRecipient />} />
                <Route path="/view-recipient-transfer" element={<ViewTransferRecipient />} />
                <Route path="/approval-transfer" element={<ViewTransferRecipient />} />
              </Routes>
              <Outlet />
            </Box>
          </ALFProvider>
        </RecipientProvider>
      </HospitalListProvider>
    </MasterDataProvider>
  );
};

export default RecipientLayout;
