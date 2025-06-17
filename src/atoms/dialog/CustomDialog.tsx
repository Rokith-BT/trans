// src/components/dialog/CustomDialog.tsx
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogActions } from '@mui/material';

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  customWidth?: string;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  children,
  actions,
  maxWidth = 'sm',
  customWidth
}) => {
  return (
    <Dialog
      className="!rounded-[16px]"
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      sx={{ borderRadius: '16px', minWidth: customWidth }}
    >
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
