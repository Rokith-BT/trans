import { Box, Button, CustomDialog, Select, Text } from '@/atoms';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import donorData from '@/data/donorSelectData.json';

interface AddDonorDialogProps {
  open: boolean;
  onClose: () => void;
  selectedTab?: string;
}

const AddDonorDialog: React.FC<AddDonorDialogProps> = ({ open, onClose, selectedTab }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event?.target.value);
  };

  const handleNavigate = () => {
    if (selectedTab === '#identification') {
      navigate('/donors/identification');
    } else {
      navigate('/donors/add-donor');
    }
  };

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box>
        <Text className="!text-[#804595] !text-[16px] !font-bold !mb-[25px]">Add Donor</Text>
        <Select menuOptions={donorData.HospitalName}
          onChange={()=>handleInputChange}
          value={value}
          label="hospital Name"
          fullWidth
          required
          className="!mb-[60px]"
        />
        <Box className="flex gap-6 justify-between">
          <Button onClick={onClose} variant="outlined" className="!border-[#D876A9] !text-[#D876A9] w-[150px]">
            Cancel
          </Button>
          <Button
            onClick={handleNavigate}
            variant="contained"
            className={`!bg-[#A1999F] w-[150px] text-[white] ${value.split('').length >= 5 ? '!bg-[#D876A9]' : ''}`}
          >
            Next
          </Button>
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default AddDonorDialog;
