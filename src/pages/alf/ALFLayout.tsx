import { Route, Routes } from 'react-router';
import ADDALF from './ALF';
import { MasterDataProvider } from '../settings/setups/masterCotext';
import { HospitalListProvider } from '../hospitals/hospitalListContext';
import { ALFProvider } from './ALFContext';
import ADDALFDetails from './section/ADDALFDetails';
// import AddAlfDoctor from './add/AddALFDoctorDialog';
import ALF from './ALFDoctors';
import { RecipientProvider } from '../recipients/RecipientContext';
import ALFView from './view/ALFView';

const ALFLayout = () => {
  return (
    <div className="w-full ">
      <MasterDataProvider>
        <HospitalListProvider>
          <RecipientProvider>
            <ALFProvider>
              <Routes>
                <Route path="/" element={<ADDALF />} />
                <Route path="/alf-doctor" element={<ALF />} />
                <Route path="/:recipientId/add" element={<ADDALFDetails />} />
                <Route path="/:recipientId/view" element={<ALFView />} />
                {/* <Route path="/addalfdoctor" element={<AddAlfDoctor />} /> */}
              </Routes>
            </ALFProvider>
          </RecipientProvider>
        </HospitalListProvider>
      </MasterDataProvider>
    </div>
  );
};

export default ALFLayout;
