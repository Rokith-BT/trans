import { ArrowUpIcon } from '@/assets/icons';
import CloseIcon from '@/assets/icons/Close';
import { Box, Button, Input, Text } from '@/atoms';
import { Dialog, DialogActions, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useHospitalId } from '@/hooks/useHospitalID';
import { useRole } from '@/hooks/useRole';

export interface AddUseDialogProps {
  open: boolean;
  onClose: () => void;
  userType: string;
  hospitalName?: string;
}

const AddUseDialog: React.FC<AddUseDialogProps> = ({ open, onClose, userType, hospitalName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalId = useHospitalId();
  const { isSuperAdmin } = useRole();
  const basePath = isSuperAdmin ? '/hospitals' : '';

  const handleNavigate = () => {
    navigate(`${basePath}/${hospitalId}/users`, {
      state: {
        existUser: false,
        userType,
        origin: 'hospitals',
        hospitalName: hospitalName ?? '',
        hospitalId: hospitalId ?? 0,
        tab: `${location.hash}`,
        filter: location.search
      }
    });
  };
  const [existUser, setExistUser] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const handleExistuser = () => {
    setExistUser(!existUser);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleClickArrow = () => {
    if (inputValue.length === 10) {
      navigate(`/hospitals/add-${userType.toLowerCase()}`, {
        state: { existUser: true, inputValue, userType }
      });
    }
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
        fullWidth={true}
        PaperProps={{
          style: {
            width: '90%',
            maxWidth: '400px',
            margin: 'auto',
            padding: '10px',
            borderRadius: '8px'
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon className="h-5 w-5" />
        </IconButton>
        <DialogActions>
          <Box className="flex flex-col w-full p-2">
            <Text className="!text-[#1A0616]  !text-[16px] !font-[500] !ml-1 !mb-3">Add {userType}</Text>

            <Box className="flex w-full items-center justify-between p-1  gap-3">
              <Button
                variant="outlined"
                className="!border-[#D876A9] !text-[#D876A9] hover:!bg-[#D876A9] hover:!text-white"
                fullWidth
                onClick={handleNavigate}
              >
                New User
              </Button>
              {userType !== 'Director' && (
                <Button
                  variant="outlined"
                  className={`!border-[#D876A9] !text-[#D876A9] hover:!bg-[#D876A9] hover:!text-white focus:bg-[#D876A9] focus:!text-white ${inputValue.length >= 1 ? '!bg-[#D876A9] !text-white' : ''}`}
                  fullWidth
                  onClick={handleExistuser}
                >
                  Existing User
                </Button>
              )}
            </Box>
            {existUser && (
              <Box mt={3} className="relative px-1 mb-[30%]">
                <Input
                  label="Enter Transtant Id"
                  fullWidth
                  required
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                  value={inputValue}
                />
                <Text
                  component={'span'}
                  onClick={handleClickArrow}
                  className={` absolute rounded-full top-[120px] right-[5px] h-[40px] flex items-center justify-center w-[40px] ${inputValue.length === 10 ? 'bg-[#804595] cursor-pointer' : 'bg-[#A1999F]'}`}
                >
                  <ArrowUpIcon />
                </Text>
              </Box>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddUseDialog;
