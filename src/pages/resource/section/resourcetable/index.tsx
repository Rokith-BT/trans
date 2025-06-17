import { Box } from '@/atoms';
import { TranstanUser } from '@/types/resource';
import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
import ActionDialog from '../ActionDialog';
import { useWindowType } from '@/hooks/useWindowType';
import DeskTopView from './DeskTopView';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';
import MobileView from './MobileView';

interface ResourceTableProps {
  list: TranstanUser[];
  isHospitalUser?: boolean;
  canRead?: boolean;
  canDelete?: boolean;
  canUpdate?: boolean;
}

// const statusColorMapping: { [key: string]: { bgColor: string; textColor: string } } = {
//   Active: { bgColor: '#CFEEBC', textColor: '#027545' },
//   Deleted: { bgColor: '#FFE1E1', textColor: '#DD2323' }
// };

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const ResourceTable: React.FC<ResourceTableProps> = ({
  list = [],
  isHospitalUser = false,
  canDelete,
  canUpdate,
  canRead
}) => {
  //   const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState<TranstanUser>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { isTablet, isMobile } = useWindowType();
  return (
    <Box>
      {/* <DataTable columnDefs={baseColumnDefs} rowData={list} /> */}
      {!isTablet && !isMobile ? (
        <DeskTopView
          list={list}
          isHospitalUser={isHospitalUser}
          setOpenDeleteDialog={setOpenDeleteDialog}
          setSelectedRow={setSelectedRow}
          canDelete={canDelete}
          canUpdate={canUpdate}
          canRead={canRead}
        />
      ) : (
        <MobileCardRenderer
          list={list}
          renderCard={(item) => (
            <MobileView
              list={item}
              isHospitalUser={isHospitalUser}
              setOpenDeleteDialog={setOpenDeleteDialog}
              setSelectedRow={setSelectedRow}
              canDelete={canDelete}
              canUpdate={canUpdate}
              canRead={canRead}
            />
          )}
        />
      )}
      <ActionDialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        selectedRow={selectedRow}
      />
    </Box>
  );
};

export default ResourceTable;
