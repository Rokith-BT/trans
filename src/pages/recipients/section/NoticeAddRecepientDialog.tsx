import { Box, Button, CustomDialog } from '@/atoms';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import React from 'react';

interface NoticeAddRecepientDialogProps {
  open: boolean;
  onClose: () => void;
}

const NoticeAddRecepientDialog: React.FC<NoticeAddRecepientDialogProps> = ({ open, onClose }) => {
  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="md">
      <Box mt={3} className="relative">
        <Typography fontSize={'16px'} fontWeight={'500'}>
          Kindly follow the below steps:
        </Typography>
        <List>
          <ListItem>
            <span className="absolute text-5xl left-0 mt-[-26px]">.</span> First verify the Aadhar ID for
            authentication. Patient personal details will be automatically generated.
          </ListItem>
          <ListItem>
            <span className="absolute text-5xl left-0 mt-[-26px]">.</span> Then continue to fill the medical details.
          </ListItem>
          <ListItem>
            <span className="absolute text-5xl left-0 mt-[-26px]">.</span> Payment gateway page will open after you
            submit the registration form.
          </ListItem>
          <ListItem>
            <span className="absolute text-5xl left-0 mt-[-26px]">.</span> Incomplete registration form will not open
            the payment gateway.
          </ListItem>
        </List>
        <Box className="flex items-center justify-end">
          <Button className="!bg-[#D876A9] !text-[#F8F8FF]" onClick={onClose}>
            Ok, I Understand
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default NoticeAddRecepientDialog;
