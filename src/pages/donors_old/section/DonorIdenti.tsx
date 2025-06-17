import { CalenderIcon } from '@/assets/icons';
import { Box, Input, Select, Text } from '@/atoms';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import React, { useState } from 'react';
import data from '@/data/selectData.json';
import donorData from '@/data/donorSelectData.json'
import AtomRadio from '@/atoms/radio/Radio';

const DonorIdenti = () => {
  const [required, setrequired] = useState(false);

  return (
    <Box px={5} mt={2}>
      <Text className="text-[#804595] !text-[19px] !font-[500] !mb-[24px]">Donor Details</Text>
      <Box className="flex flex-wrap -mx-[24px]">
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Input label="Donor Name" fullWidth required />
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px] relative">
          <Input label="Date Of Birth" fullWidth required />
          <span className="absolute right-[35px] top-[10px]">
            <CalenderIcon />
          </span>
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Input label="Age" fullWidth required />
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Select menuOptions={data.genderOptions} label="Gender" fullWidth required />
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Select menuOptions={data.bloodGroupOptions} label="Blood" fullWidth required />
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <AtomRadioGroup label="is MLC case" isRequired={true} row>
            {data.radioOption.map((item, index) => (
              <AtomRadio key={index} value={item.value} label={item.label} onClick={() => {}} />
            ))}
          </AtomRadioGroup>
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Input label="AR Case Number" fullWidth />
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Input label="Cause Of Brain Death" fullWidth required />
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px] relative">
          <Input label="Date of Accident" fullWidth required />
          <span className="absolute right-[35px] top-[10px]">
            <CalenderIcon />
          </span>
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px] relative">
          <Input label="Date of Admission" fullWidth required />
          <span className="absolute right-[35px] top-[10px]">
            <CalenderIcon />
          </span>
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px] relative">
          <Input label="No of Days in Ventilator" fullWidth required />
          <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
            Days
          </span>
        </Box>
        <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
          <Select menuOptions={donorData.Status} label="Status" fullWidth required />
        </Box>
      </Box>
      <Box>
        <Text className="text-[#80459580] !text-[16px] !font-[600] !mb-5">First Apnoea Details</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="md:w-1/3 w-full px-[24px] mb-[48px]">
            <AtomRadioGroup row isRequired={true} label="First Apnoea Status">
              {data.radioOption.map((item, index) => (
                <AtomRadio
                  key={index}
                  value={item.value}
                  label={item.label}
                  onClick={() => {
                    setrequired(item.required);
                  }}
                />
              ))}
            </AtomRadioGroup>
          </Box>

          <Box className="md:w-1/3 w-full px-[24px] mb-[48px] relative">
            {required ? (
              <Input label="First Apnoea Date & Time" fullWidth required />
            ) : (
              <Input label="First Apnoea Date & Time" fullWidth />
            )}

            <span className="absolute right-[35px] top-[10px]">
              <CalenderIcon />
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default DonorIdenti;
