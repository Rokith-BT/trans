import { Box } from '@/atoms';
import React, { useState } from 'react';
import { RecipientAlfDoctor } from '@/types/alf';
import ALFRestoreDialog from '../ALFRestoreDialog';
import ALFDeleteDialog from '../ALFDeleteDialog';
import { useWindowType } from '@/hooks/useWindowType';
import DeskTopView from './DeskTopView';
import MobileView from './MobileView';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';

interface ALFDataTableProps {
  list: RecipientAlfDoctor[];
  isAlfDeleted?: boolean;
}

const ALFDataTable: React.FC<ALFDataTableProps> = ({ isAlfDeleted, list }) => {
  const [openRestore, setOpenRestore] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RecipientAlfDoctor>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isTablet, isMobile } = useWindowType();

  return (
    <Box mt={1}>
      {!isMobile && !isTablet ? (
        <DeskTopView
          list={list}
          isAlfDeleted={isAlfDeleted}
          setSelectedRow={setSelectedRow}
          setOpenDeleteDialog={setOpenDeleteDialog}
          setOpenRestore={setOpenRestore}
        />
      ) : (
        <MobileCardRenderer
          list={list}
          renderCard={(item) => (
            <MobileView
              list={item}
              setOpenDeleteDialog={setOpenDeleteDialog}
              setOpenRestore={setOpenRestore}
              setSelectedRow={setSelectedRow}
              isAlfDeleted={isAlfDeleted}
            />
          )}
        />
      )}
      <ALFRestoreDialog open={openRestore} onclose={() => setOpenRestore(false)} />
      <ALFDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        isDoctorDelete={true}
        doctorData={selectedRow}
      />
    </Box>
  );
};

export default ALFDataTable;
