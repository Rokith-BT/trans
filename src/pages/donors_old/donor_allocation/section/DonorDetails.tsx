import { CalenderIcon } from '@/assets/icons';
import { Box, Input, Select, Text } from '@/atoms';
import AtomRadio from '@/atoms/radio/Radio';
import data from '@/data/selectData.json';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import React, { useState } from 'react';

const DonorDetails = () => {
  const [isMlc,setIsMlc] = useState(false)
  return (
    <Box className="bg-[#F8F8FF]">
      <Box className="w-full flex flex-col gap-[16px]">
        <Text className="text-[#804595]">Donor Details</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px]  mb-[48px]">
            <Input label="Donor Name" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px]  mb-[48px]">
            <Input label="Date of Birth" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px]  mb-[48px]">
            <Input label="Age" placeholder="Enter here" fullWidth  />
          </Box>

          <Box className="w-full md:w-1/3 px-[24px] mb-[48px]">
            <Select menuOptions={data.genderOptions} label="Gender" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className=" w-full md:w-1/3 px-[24px] mb-[48px]">
            <Select
              menuOptions={data.bloodGroupOptions}
              label="Blood Group"
              placeholder="Enter here"
              fullWidth
              required
            />
          </Box>
          <Box className=" relative w-full md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Height" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              Cm
            </span>
          </Box>
          <Box className=" relative w-full md:w-1/3 px-[24px] mb-[48px]">
            <Input label="weight" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595] ">
              Kg
            </span>
          </Box>
          <Box className=" relative w-full md:w-1/3 px-[24px] mb-[48px]">
            <Input label="BMI" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              Kg/m<sup>2</sup>
            </span>
          </Box>
          <Box className=" md:w-1/3 px-[24px] mb-[48px] ">
            <AtomRadioGroup label="Is MLC case ?" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} onClick={() => setIsMlc(item.required)} />
              ))}
            </AtomRadioGroup>
          </Box>

          <Box className="  md:w-1/3 px-[24px] mb-[48px]">
            {isMlc ? (
              <Input label="AR Case Nubmber" placeholder="Enter here" fullWidth required />
            ) : (
              <Input label="AR Case Nubmber" placeholder="Enter here" fullWidth  />
            )}
          </Box>
        </Box>
      </Box>
      <Box className="w-full flex flex-col gap-[16px]">
        <Text className="text-[#804595]">Basic Medical Details</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Pluse Rate" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              Per Minute
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="BP Systolic" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              mmgh
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="BP Diastolic" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              mmgh
            </span>
          </Box>
          <Box className=" md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Map" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className=" md:w-1/3 px-[24px] mb-[48px]">
            <Select menuOptions={data.numberOption} label="Urine Output" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className=" md:w-1/3 px-[24px] mb-[48px]">
            <Input multiline minRows={3} label="CVP" placeholder="Enter here" fullWidth required />
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="SPO2" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              Percentage
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Temperature" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              Ferenhite
            </span>
          </Box>
        </Box>
      </Box>
      <Box className="w-full flex flex-col gap-[16px]">
        <Text className="text-[#804595]"> Medical Details</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Case od Brain Death" fullWidth required />
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Number of Days in Ventilator" placeholder="Enter here" fullWidth required />
            <span className="absolute top-0 p-2 bg-[#8045954D] right-[24px] rounded-r-lg border-l-[1px] border-[#804595] text-[#804595]">
              Days
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Date of Onset of illness" fullWidth required />
            <span className=" absolute top-[10px] right-[35px]">
              <CalenderIcon />
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Date of Admission" fullWidth required />
            <span className=" absolute top-[10px] right-[35px]">
              <CalenderIcon />
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Tentative Retrieval Date & Time" fullWidth />
            <span className=" absolute top-[10px] right-[35px]">
              <CalenderIcon />
            </span>
          </Box>
          <Box className=" relative md:w-1/3 px-[24px] mb-[48px]">
            <Input label="Assessment Date & Time" fullWidth  />
            <span className=" absolute top-[10px] right-[35px]">
              <CalenderIcon />
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DonorDetails;
