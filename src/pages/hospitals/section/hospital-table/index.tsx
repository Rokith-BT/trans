import { Box /* , DataTable, Text */ } from '@/atoms';
import { FC, useState } from 'react';
// import { withVisibility } from '@/hoc/Visibility';
// import { DeleteIcon, EditIcon, FlagIcon, LoginIcon, PhoneIcon, UndoIcon, VerifyIcon, ViewIcon } from '@/assets/icons';
// import {
//   isDeleteforHospital,
//   isEditforHosptial,
//   isLoginIconHospital,
//   isUndoIconHospital,
//   isVerifyforHospital,
//   isViewforHospital
// } from '@/utils/actionButtonStatus';
// import { useNavigate } from 'react-router';
import { Hospital } from '@/types/hospital';
import { DeleteHospitalDialog } from '../DeleteHospitalDialog';
import { RestoreHospitalDialog } from '../RestoreHospitalDialog';
// import { OrganLicenseDialog } from './OrganLicenseDialog';
import { useHospitals } from '../../hospitalListContext';
// import { useHospital } from '../hospitalContext';
import QS from 'query-string';
import { ContactList } from '../dialogs';
import { useWindowType } from '@/hooks/useWindowType';
// import { truncateTextByLines } from '@/utils/truncateText';
// import OrganImageswithSlide from '@/pages/components/OrganImageswithSlide';
import DesktopView from './DesktopView';
import HospitalCard from './HospitalCard';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';

interface HospitalTableProps {
  list?: Hospital[];
}

const HospitalTable: FC<HospitalTableProps> = ({ list = [] }) => {
  const parsedQS = QS.parse(location.search);
  const { isMobile, isDesktop, isTablet } = useWindowType();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Hospital | null>(null);
  const [openRestore, setOpenRestore] = useState(false);
  // const [openLicense, setOpenLicense] = useState(false);
  const [openContact, setContact] = useState(false);
  // const [openorgan, setOrgan] = useState(false);
  // const [selectRow, setSelectRow] = useState<Hospital | undefined>(undefined);

  console.log('HospitalTable / window.innerWidth: ', window.innerWidth);
  console.log('HospitalTable / isMobile: ', isMobile);
  console.log('HospitalTable / isDesktop: ', isDesktop);

  const {
    actions: { restoreHospital, deleteHospital, getAll }
  } = useHospitals();

  return (
    <Box>
      <Box>
        {!isTablet && !isMobile ? (
          <DesktopView
            list={list}
            setSelectedRow={setSelectedRow}
            setContact={setContact}
            setOpenDelete={setOpenDelete}
            setOpenRestore={setOpenRestore}
          />
        ) : (
          <Box className="w-full max-w-full pr-2">
            <MobileCardRenderer
              list={list}
              renderCard={(item) => (
                <HospitalCard
                  key={item.id}
                  data={item}
                  setSelectedRow={setSelectedRow}
                  setContact={setContact}
                  setOpenDelete={setOpenDelete}
                  setOpenRestore={setOpenRestore}
                />
              )}
            />
          </Box>
        )}
        <DeleteHospitalDialog
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setSelectedRow(null);
          }}
          hospital={selectedRow}
          onDelete={(id: number, reason: string) => {
            deleteHospital(id, reason);
            getAll(parsedQS);
          }}
        />
        <RestoreHospitalDialog
          open={openRestore}
          onClose={() => setOpenRestore(false)}
          hospital={selectedRow}
          onRestore={(id: number, reason: string) => {
            restoreHospital(id, reason);
            getAll(parsedQS);
          }}
        />
        {/* <OrganLicenseDialog open={openLicense} onClose={() => setOpenLicense(false)} hospital={selectedHospital} /> */}
        <ContactList open={openContact} onClose={() => setContact(false)} data={selectedRow} isHospital={true} />
        {/*
      <OrganListDialog open={openorgan} onClose={() => setOrgan(false)} data2={selectRow} /> */}
      </Box>
    </Box>
  );
};

export default HospitalTable;
