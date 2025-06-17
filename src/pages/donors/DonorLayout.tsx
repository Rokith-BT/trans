import { Route, Routes } from 'react-router';
import Donor from './Donor';
import { Box } from '@/atoms';
import { DonorProvider } from './DonorContext';
import AddDonor from './add/AddDonor';
import DonorApnoeaDetails from './add/section/DonorApnoeaDetails';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import { RecipientProvider } from '../recipients/RecipientContext';
import { HospitalListProvider } from '../hospitals/hospitalListContext';
import GenerateWaitingList from './allocation/GenerateWaitingList';
import LiveTransplant from './LiveTransplant/LiveTransplant';
import AddLiveTransplantTable from './LiveTransplant/LiveTransplantTable';
import TransplantDetails from './LiveTransplant/section/TransplantDetails';

const DonorLayout = () => {
  return (
    <Box className="w-full px-[20px] md:px-[80px]">
      <HospitalListProvider>
        <RecipientProvider>
          <DonorProvider>
            <MasterDataProvider>
              <Routes>
                <Route path="/" element={<Donor />} />
                <Route path="/add-donor" element={<AddDonor />} />
                <Route path="/:donorId/edit" element={<AddDonor />} />
                <Route path="/donor-basic-details" element={<DonorApnoeaDetails />} />
                <Route path="/donor-basic-details/:donorId/edit" element={<DonorApnoeaDetails />} />
                <Route path="/generate-waiting-list" element={<GenerateWaitingList />} />
                <Route path="/livetransplant" element={<LiveTransplant list={[]} />} />
                <Route path="/addlivetransplanttable" element={<AddLiveTransplantTable list={[]} />} />
                <Route path="/transplantdetails" element={<TransplantDetails />} />
                <Route path="/transplantdetails/:id/edit" element={<TransplantDetails />} />
              </Routes>
            </MasterDataProvider>
          </DonorProvider>
        </RecipientProvider>
      </HospitalListProvider>
    </Box>
  );
};

export default DonorLayout;
