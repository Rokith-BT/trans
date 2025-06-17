import { Box } from '@/atoms';
import { InhouseWaitingList } from '@/types/waitinglist';
import React, { useState } from 'react';
import PositionChangeDialog from '../PositionChangeDialog';
import { useWindowType } from '@/hooks/useWindowType';
import DeskTopView from './DeskTopView';
import MobileView from './MobileView';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';

interface InhouseTableProps {
  list: InhouseWaitingList[];
  isInhouseFinal?: boolean;
  canUpdate?: boolean;
}
const InhouseTable: React.FC<InhouseTableProps> = ({ list = [], isInhouseFinal, canUpdate }) => {
  // const navigate = useNavigate();
  const { isTablet, isMobile } = useWindowType();
  const [openDialog, setOpendialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<InhouseWaitingList>();

  return (
    <Box>
      {!isMobile && !isTablet ? (
        <DeskTopView
          list={list}
          setOpendialog={setOpendialog}
          setSelectedRow={setSelectedRow}
          isInhouseFinal={isInhouseFinal}
          canUpdate={canUpdate}
        />
      ) : (
        <MobileCardRenderer
          list={list}
          renderCard={(item) => (
            <MobileView
              list={item}
              setOpendialog={setOpendialog}
              setSelectedRow={setSelectedRow}
              isInhouseFinal={isInhouseFinal}
            />
          )}
        />
      )}
      <PositionChangeDialog open={openDialog} onClose={() => setOpendialog(false)} selectedData={selectedRow} />
    </Box>
  );
};

export default InhouseTable;
