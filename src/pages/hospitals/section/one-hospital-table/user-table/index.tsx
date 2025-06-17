import { Box } from '@/atoms';
import React, { useState } from 'react';
// import { isdeleteIconUser, isEditforUser } from '@/utils/actionButtonStatus';
import { UsersTable } from '@/types/common.type';
import { useLocation } from 'react-router';

import QS from 'query-string';
import { useHospital } from '@/pages/hospitals/hospitalContext';
import { RestoreHospitalDialog } from '../../RestoreHospitalDialog';
import { DeleteHospitalDialog } from '../../DeleteHospitalDialog';
import UserApproveDialog from '../../UserApproveDialog';
import { useWindowType } from '@/hooks/useWindowType';
import UserDesktopView from './DesktopView';
import UserMobileView from './MobileView';
import { MobileCardRenderer } from '@/pages/components/MobileCardRender';

interface DeleteUserTableProps {
  pageSize?: number;
  data?: Array<UsersTable>;
  isUser?: boolean;
  list?: UsersTable[];
  hospitalName?: string;
}

const UserDataTable: React.FC<DeleteUserTableProps> = ({ pageSize, isUser, list = [], hospitalName }) => {
  const location = useLocation();
  const parsedQS = QS.parse(location.search);
  const {
    actions: { deleteHospitalUsers, getHospitalUsers, restoreHospitalUsers, approveHospitalUser },
    state: { hospitalUsers }
  } = useHospital();
  //   const hospitalId = useHospitalId();
  //   const { isSuperAdmin } = useRole();
  //   const basePath = isSuperAdmin ? '/hospitals' : '';

  //   const navigate = useNavigate();
  console.log('hosptial usrs from user table ', hospitalUsers);

  const [selectedRow, setSelectedRow] = useState<UsersTable | null>(null);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [openDeleteDialog, setOpenDeletedialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const { isMobile } = useWindowType();
  return (
    <Box>
      {!isMobile ? (
        <UserDesktopView
          list={list}
          hospitalName={hospitalName}
          pageSize={pageSize}
          isUser={isUser}
          setOpenApproveDialog={setOpenApproveDialog}
          setOpenDeletedialog={setOpenDeletedialog}
          setOpenRestoreDialog={setOpenRestoreDialog}
          setSelectedRow={setSelectedRow}
        />
      ) : (
        <Box className="w-full max-w-full pr-2">
          <MobileCardRenderer
            list={list}
            renderCard={(item) => (
              <UserMobileView
                data={item}
                hospitalName={hospitalName}
                pageSize={pageSize}
                isUser={isUser}
                setOpenApproveDialog={setOpenApproveDialog}
                setOpenDeletedialog={setOpenDeletedialog}
                setOpenRestoreDialog={setOpenRestoreDialog}
                setSelectedRow={setSelectedRow}
              />
            )}
          />
        </Box>
      )}

      <RestoreHospitalDialog
        open={openRestoreDialog}
        onClose={() => setOpenRestoreDialog(false)}
        user={selectedRow}
        onRestore={(id: number, reason: string) => {
          restoreHospitalUsers(id, reason);
          getHospitalUsers(parsedQS);
        }}
      />
      <DeleteHospitalDialog
        open={openDeleteDialog}
        onDelete={(id: number, reason: string) => {
          deleteHospitalUsers(id, reason);
          getHospitalUsers(parsedQS);
        }}
        onClose={() => setOpenDeletedialog(false)}
        user={selectedRow}
      />
      <UserApproveDialog
        open={openApproveDialog}
        onClose={() => {
          setOpenApproveDialog(false);
        }}
        selectedUser={selectedRow}
        onApprove={(id: number) => {
          approveHospitalUser(id);
        }}
      />
    </Box>
  );
};

export default UserDataTable;
