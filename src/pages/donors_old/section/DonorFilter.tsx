import { Box, Button, CustomDialog, Input, Select, Text } from '@/atoms';
import React from 'react';
import donorData from '@/data/donorSelectData.json';
import data from '@/data/selectData.json';

interface DonorFilterProps {
  open: boolean;
  onClose: () => void;
  selectedTab: string;
}

const DonorFilter: React.FC<DonorFilterProps> = ({ open, onClose, selectedTab }) => {
  return (
    <Box>
      <CustomDialog open={open} onClose={onClose} maxWidth="md">
        <Text className="pb-[25px] !font-[700] !text-[16px] text-[#804595] ">Smart Filter</Text>
        <Box className="flex w-full mb-[60px] flex-col gap-y-[20px]">
          <Box className="flex mx-[-20px]  gap-y-[20px] flex-wrap">
            {selectedTab === '#identification' && (
              <Box className="md:w-1/2 px-[20px]">
                <Input label="Created On" required fullWidth />
              </Box>
            )}
            <Box className="md:w-1/2 px-[20px]">
              <Select menuOptions={donorData.HospitalName} label="Hospital Name" required fullWidth />
            </Box>
            {selectedTab !== '#identification' && (
              <Box className="md:w-1/2 px-[20px]">
                <Select menuOptions={donorData.Status} label="Status" required fullWidth />
              </Box>
            )}
            {(selectedTab === '#identification' || selectedTab==='#confirmed') && (
             
                <Box className="md:w-1/2 px-[20px]">
                  <Select menuOptions={donorData.HospitalType} label="Hospital Type" required fullWidth />
                </Box>
             
            )}
            {selectedTab === '#confirmed' && (
              <>
                <Box className="md:w-1/2 px-[20px]">
                  <Select menuOptions={donorData.DateRange} label="Date Range (Created ON)" required fullWidth />
                </Box>
              </>
            )}
            <Box className="md:w-1/2 px-[20px]">
              <Select menuOptions={data.genderOptions} label="Gender" required fullWidth />
            </Box>
            <Box className="md:w-1/2 px-[20px]">
              <Select menuOptions={donorData.Age} label="Age" required fullWidth />
            </Box>
            <Box className="md:w-1/2 px-[20px]">
              <Select menuOptions={data.bloodGroupOptions} label="Blood" required fullWidth />
            </Box>
            {selectedTab === '#identification' && (
              <>
                <Box className="md:w-1/2 px-[20px]">
                  <Select menuOptions={donorData['MLC/Non-MLC']} label="MLC/Non-MLC" required fullWidth />
                </Box>

                <Box className="md:w-1/2 px-[20px]">
                  <Select menuOptions={donorData.ApnoeaStatus} label="First Apnoea Status" required fullWidth />
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box className="flex justify-end gap-5 mb-3">
          <Button onClick={onClose} variant="outlined" className="!border-[#D876A9] w-[164px] !text-[#D876A9]">
            Cancel
          </Button>
          <Button onClick={onClose} variant="contained" className="!bg-[#D876A9] w-[164px] !text-white ">
            Apply Filter
          </Button>
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default DonorFilter;
