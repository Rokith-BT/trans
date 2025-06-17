import { Box, CustomDialog, Text } from '@/atoms';
import React from 'react';

export interface LicensceViewProps {
  open: boolean;
  onClose: () => void;
}
const LicenseView: React.FC<LicensceViewProps> = ({ open, onClose }) => {
  return (
    <React.Fragment>
      <CustomDialog open={open} onClose={onClose}>
        <Box>
          <Text className="!text-[#804595] !font-[600] !text-[23px]">Heart DMS License</Text>
          <img src="" alt="" />
        </Box>
      </CustomDialog>
    </React.Fragment>
  );
};

export default LicenseView;
