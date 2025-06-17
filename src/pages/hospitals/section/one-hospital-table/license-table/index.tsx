import { Box } from '@/atoms';
import { HospitalOrganDocumnets } from '@/types/organLicense';
import React, { useState } from 'react';
import { OrganDeleteDialog } from '../../OrganDeleteDialog';
import { OrganLicenseDialog } from '../../OrganLicenseDialog';
import { OrganRestoreDialog } from '../../OrganRestoreDialog';
import { useWindowType } from '@/hooks/useWindowType';
import LicenseDesktopView from './DesktopView';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import LicenseMobileView from './MobileView';

interface HospitalUserTableProps {
  list?: HospitalOrganDocumnets[];
  hospitalName?: string;
}

const LicenseTable: React.FC<HospitalUserTableProps> = ({ list = [], hospitalName }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openLicenceView, setOpenLicenseView] = useState(false);
  const [currentSerialNumber, setCurrentSerialNumber] = useState<number>(-1);

  const [selectedData, setSelectedData] = useState<HospitalOrganDocumnets>();
  const { isMobile } = useWindowType();

  //   for file view
  const handleNext = () => {
    if (list.length === 0) return;
    const nextSerail = currentSerialNumber < list.length ? currentSerialNumber + 1 : 1;
    setCurrentSerialNumber(nextSerail);
  };
  const handlePrevious = () => {
    if (list.length === 0) return;
    const previousSerial = currentSerialNumber > 1 ? currentSerialNumber - 1 : list.length;
    setCurrentSerialNumber(previousSerial);
  };

  return (
    <Box>
      {!isMobile ? (
        <LicenseDesktopView
          list={list}
          hospitalName={hospitalName}
          setCurrentSerialNumber={setCurrentSerialNumber}
          setOpenDeleteDialog={setOpenDeleteDialog}
          setOpenLicenseView={setOpenLicenseView}
          setOpenRestoreDialog={setOpenRestoreDialog}
          setSelectedData={setSelectedData}
        />
      ) : (
        <Box className="w-full max-w-full pr-2">
          <MobileCardRenderer
            list={list}
            renderCard={(item) => (
              <LicenseMobileView
                key={item.id}
                data={item}
                hospitalName={hospitalName}
                setCurrentSerialNumber={setCurrentSerialNumber}
                setOpenDeleteDialog={setOpenDeleteDialog}
                setOpenLicenseView={setOpenLicenseView}
                setOpenRestoreDialog={setOpenRestoreDialog}
                setSelectedData={setSelectedData}
              />
            )}
          />
        </Box>
      )}
      <OrganDeleteDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        hospitalData={selectedData}
      />
      <OrganRestoreDialog
        open={openRestoreDialog}
        onClose={() => {
          setOpenRestoreDialog(false);
        }}
        hospitalData={selectedData}
      />
      <OrganLicenseDialog
        open={openLicenceView}
        onClose={() => {
          setOpenLicenseView(false);
          setCurrentSerialNumber(-1);
        }}
        documentUrl={list?.find((item) => item.serialNumber === currentSerialNumber)?.dmsLicensePath}
        currentPosition={currentSerialNumber}
        onNext={handleNext}
        onPrevious={handlePrevious}
        totalItems={list?.length}
      />
    </Box>
  );
};

export default LicenseTable;
