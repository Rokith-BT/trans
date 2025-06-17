import { EditIcon } from '@/assets/icons';
import { Box, DataTable } from '@/atoms';
import expData from '@/data/experienceData.json';

import React, { useState } from 'react';
import ExistingDoctorDialog from './ExistingDoctorDialog';

const UserExperienceTable = () => {
  const [openExpDialog, setOpenExpdialog] = useState(false);
  return (
    <Box>
      <DataTable
        onCellClick={() => {}}
        rowData={expData}
        columnDefs={[
          { headerName: 'Role', field: 'expRole' },
          { headerName: 'Previous Hospital', field: 'prevHospital' },
          { headerName: 'Duration', field: 'duration' },
          { headerName: 'Case Handled', field: 'caseHandled' },
          {
            headerName: 'Actions',
            cellRenderer: () => {
              return (
                <Box className="h-[40px] flex items-center">
                  <EditIcon className="cursor-pointer" onClick={() => setOpenExpdialog(true)} />
                </Box>
              );
            }
          }
        ]}
      />
      <ExistingDoctorDialog
        open={openExpDialog}
        onClose={() => {
          setOpenExpdialog(false);
        }}
      />
    </Box>
  );
};

export default UserExperienceTable;
