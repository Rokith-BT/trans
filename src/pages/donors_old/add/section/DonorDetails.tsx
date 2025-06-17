import { CalenderIcon } from '@/assets/icons';
import { Box, Input, Select, Text } from '@/atoms';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import React, { useState } from 'react';
import data from '@/data/selectData.json';
import AtomRadio from '@/atoms/radio/Radio';

const DonorDetails = () => {
  const [mlcCase, setMLCCase] = useState(false);

  return (
    <Box px={5}>
      <Text className=" !mb-4 text-[#804595] !text-[19px] !font-medium">Donor Details</Text>
      <Box className=" flex flex-wrap">
        <Box className="w-full md:w-1/3 px-[24px] mb-[28px] ">
          <Input label="Donour Name" placeholder="Enter here" fullWidth required />
        </Box>
        <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
          <Input label="Date of Birth" placeholder="Enter here" fullWidth required />
          <span className="absolute right-[30px] top-[10px]">
            <CalenderIcon />
          </span>
        </Box>
        <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
          <Input label="Age" placeholder="Enter here" fullWidth />
        </Box>
        <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
          <Select menuOptions={data.genderOptions} label="Gender" placeholder="Select here" fullWidth required />
        </Box>
        <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
          <Select
            menuOptions={data.bloodGroupOptions}
            label="Blood Group"
            placeholder="Enter here"
            fullWidth
            required
          />
        </Box>
        <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
          <Input label="Height" placeholder="Select here" fullWidth required />
          <span className="absolute right-[24px] top-[1px] border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[62px] text-[#804595]">
            Cm
          </span>
        </Box>
        <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
          <Input label="Weigth" placeholder="Select here" fullWidth required />
          <span className=" absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[62px] text-[#804595]">
            Kg
          </span>
        </Box>
        <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
          <Input label="BMI" placeholder="Select here" fullWidth required />
          <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[62px] text-[#804595]">
            Kg/m<sup>2</sup>
          </span>
        </Box>
        <Box>
          <Box className="w-full  px-[24px] mb-[28px]">
            <AtomRadioGroup label="Is MLC Case?" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio
                  key={index}
                  value={item.value}
                  label={item.label}
                  onClick={() => setMLCCase(item.required)}
                />
              ))}
            </AtomRadioGroup>
          </Box>
        </Box>
        <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
          {mlcCase ? (
            <Input label="AR Case Number" placeholder="Select here" fullWidth required />
          ) : (
            <Input label="AR Case Number" placeholder="Select here" fullWidth />
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Text className=" !mb-4 text-[#804595] !text-[19px] !font-medium">Basic Medical Details</Text>
        <Box className=" flex flex-wrap">
          <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Pulse Rate" placeholder="Upload Document" fullWidth required />
            <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[90px] text-center text-[#804595]">
              Per Minute
            </span>
          </Box>
          <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="BP-Systolic" placeholder="Upload Document" fullWidth required />
            <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[62px] text-[#804595]">
              mmgh
            </span>
          </Box>
          <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="BP-Diastolic" placeholder="Upload Document" fullWidth required />
            <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[62px] text-[#804595]">
              mmgh
            </span>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="MAP" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Urine Output" placeholder="Upload Document" fullWidth required />
            <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[62px] text-[#804595]">
              ml/hr
            </span>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="CVP" multiline minRows={3} placeholder="Enter here" fullWidth required />
          </Box>
          <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Pulse Rate" placeholder="Upload Document" fullWidth required />
            <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[90px] text-[#804595]">
              Percentage
            </span>
          </Box>
          <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Pulse Rate" placeholder="Upload Document" fullWidth required />
            <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[80px] text-[#804595]">
              Farenhite
            </span>
          </Box>
        </Box>
        <Box mt={4}>
          <Text className=" !mb-4 !text-[16px] !font-medium !text-[#804595] ">Medical Details</Text>
          <Box className=" flex flex-wrap -mx-[24px]">
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Case of Brain Death" placeholder="Enter here" fullWidth required />
            </Box>
            <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Number of Days in Ventilator" placeholder="Upload Document" fullWidth required />
              <span className="absolute right-[24px] top-0 border-l-[1px] border-[#804595] bg-[#8045954D] p-[10px] font-medium rounded-r-lg text-[13px] w-[80px] text-[#804595]">
                Days
              </span>
            </Box>
            <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Date of Onset of illness" placeholder="Select Here" fullWidth required />
              <span className="absolute right-[40px] top-[8px]">
                <CalenderIcon />
              </span>
            </Box>
            <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Date of Admission" placeholder="Select Here" fullWidth required />
              <span className="absolute right-[40px] top-[8px]">
                <CalenderIcon />
              </span>
            </Box>
            <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Tentative Retrieval Date & Time" placeholder="Select Here" fullWidth />
              <span className="absolute right-[40px] top-[8px]">
                <CalenderIcon />
              </span>
            </Box>
            <Box className="relative w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Assessment Date & Time" placeholder="Select Here" fullWidth />
              <span className="absolute right-[40px] top-[8px]">
                <CalenderIcon />
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DonorDetails;
