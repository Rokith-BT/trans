import { FC, useState } from 'react';
import { Box } from '@/atoms';
import { HospitalsOrgansLicences } from '@/types/organLicense';
import { OrganDeleteDialog } from '../OrganDeleteDialog';
import { OrganRestoreDialog } from '../OrganRestoreDialog';
import { OrganLicenseDialog } from '../OrganLicenseDialog';
import { useWindowType } from '@/hooks/useWindowType';
import OrganDesktopView from './DeskTopView';
import OrganCard from './OrganCard';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
interface OrganTableProps {
  list?: HospitalsOrgansLicences[];
  totalCount?: number;
}
const OrganTable: FC<OrganTableProps> = ({ list = [], totalCount = 0 }: OrganTableProps) => {
  const { isMobile } = useWindowType();
  const [selectedData, setSelectedData] = useState<HospitalsOrgansLicences | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const [openLicense, setOpenLicense] = useState(false);
  const [currentSerialNumber, setCurrentSerialNumber] = useState<number>(-1);

  const handleNext = () => {
    if (list.length === 0) return;
    const nextSerail = currentSerialNumber < totalCount ? currentSerialNumber + 1 : 1;
    setCurrentSerialNumber(nextSerail);
  };
  const handlePrevious = () => {
    if (list.length === 0) return;
    const previousSerial = currentSerialNumber > 1 ? currentSerialNumber - 1 : totalCount;
    setCurrentSerialNumber(previousSerial);
  };
  console.log('organData ', list);

  return (
    <Box>
      <Box>
        {!isMobile ? (
          <>
            <OrganDesktopView
              list={list}
              setSelectedData={setSelectedData}
              setOpenLicense={setOpenLicense}
              setOpenDelete={setOpenDelete}
              setOpenRestore={setOpenRestore}
              setCurrentSerialNumber={setCurrentSerialNumber}
            />
          </>
        ) : (
          <>
            <Box className="w-full max-w-full pr-2">
              <MobileCardRenderer
                list={list}
                renderCard={(item) => (
                  <OrganCard
                    key={item.id}
                    data={item}
                    setSelectedData={setSelectedData}
                    setOpenLicense={setOpenLicense}
                    setOpenDelete={setOpenDelete}
                    setOpenRestore={setOpenRestore}
                    setCurrentSerialNumber={setCurrentSerialNumber}
                  />
                )}
              />
            </Box>
          </>
        )}
      </Box>
      <OrganDeleteDialog open={openDelete} onClose={() => setOpenDelete(false)} data={selectedData} />
      <OrganRestoreDialog open={openRestore} onClose={() => setOpenRestore(false)} data={selectedData} />
      <OrganLicenseDialog
        open={openLicense}
        onClose={() => {
          setOpenLicense(false);
          setCurrentSerialNumber(-1);
        }}
        hospital={list.find((item) => item.serialNumber === currentSerialNumber)}
        documentUrl={list.find((item) => item.serialNumber === currentSerialNumber)?.dmsLicenseDoc}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentPosition={currentSerialNumber}
        totalItems={totalCount}
      />
    </Box>
  );
};

export default OrganTable;
