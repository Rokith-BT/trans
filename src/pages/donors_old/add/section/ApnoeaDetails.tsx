import { CalenderIcon } from '@/assets/icons';
import { AtomCheckbox, Box, FileInput, Input, Select, Text } from '@/atoms';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import React, { useState } from 'react';
import data from '@/data/selectData.json';
import AtomRadio from '@/atoms/radio/Radio';
import { StyledPhoneInput } from '@/pages/components/StyledPhoneInput';
import CheckboxGroup from '@/pages/components/AtomCheckBoxGroup';

const ApnoeaAllocation = () => {
  const [value, setValue] = useState('');

  const [consent, setConsent] = useState(false);
  const [written, setWritten] = useState(false);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  

  return (
    <Box>
      <Text className="text-[#804595] !text-[19px] !font-[500]">Apnoea Details</Text>
      <Box mt={2} className="w-full flex gap-10">
        <Box className="flex w-full flex-col ">
          <Text className="text-[#C967A2] bg-[#C967A226] text-center  rounded-lg">First Apnoea Test</Text>
          <Box mt={2} className="flex flex-wrap -mx-[24px]">
            <Box className="  w-full md:w-1/2 px-[24px]  mb-[28px]">
              <AtomRadioGroup label="First Apnoea Status" row>
                {data.radioOption.map((item, index) => (
                  <AtomRadio key={index} value={item.value} label={item.label} />
                ))}
              </AtomRadioGroup>
            </Box>
            <Box className=" relative w-full md:w-1/2 px-[24px]  mb-[28px]">
              <Input label="First Apnoea Date & Time" fullWidth />
              <span className="absolute top-[10px] right-[35px]">
                <CalenderIcon />
              </span>
            </Box>
            <Box className="w-full md:w-1/2 px-[24px]  mb-[28px]">
              <FileInput label="Pre Apnoea ABG" fullWidth />
            </Box>
            <Box className="w-full md:w-1/2 px-[24px]  mb-[28px]">
              <FileInput label="Post Apnoea ABG" fullWidth />
            </Box>
          </Box>
        </Box>
        <Box className="flex w-full flex-col">
          <Text className="text-[#C967A2] bg-[#C967A226] text-center rounded-lg">Second Apnoea Test</Text>
          <Box mt={2} className="flex flex-wrap -mx-[24px]">
            <Box className="  w-full md:w-1/2 px-[24px]  mb-[28px]">
              <AtomRadioGroup label="Second Apnoea Status" row>
                {data.radioOption.map((item, index) => (
                  <AtomRadio key={index} value={item.value} label={item.label} />
                ))}
              </AtomRadioGroup>
            </Box>
            <Box className=" relative w-full md:w-1/2 px-[24px]  mb-[28px]">
              <Input label="Second Apnoea Date & Time" fullWidth />
              <span className="absolute top-[10px] right-[35px]">
                <CalenderIcon />
              </span>
            </Box>
            <Box className="w-full md:w-1/2 px-[24px]  mb-[28px]">
              <FileInput label="Pre Apnoea ABG" fullWidth />
            </Box>
            <Box className="w-full md:w-1/2 px-[24px]  mb-[28px]">
              <FileInput label="Post Apnoea ABG" fullWidth />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-[500]">Consent Details</Text>
        <Box mt={2} className="flex flex-wrap -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px]  mb-[28px]">
            <AtomRadioGroup label="Consent Given" row>
              {data.radioOption.map((item, index) => (
                <AtomRadio
                  key={index}
                  value={item.value}
                  label={item.label}
                  onClick={() => setConsent(item.required)}
                />
              ))}
            </AtomRadioGroup>
          </Box>
          {consent && (
            <Box className="  w-full md:w-1/3 px-[24px]  mb-[28px]">
              <CheckboxGroup label="Consent Given">
                <AtomCheckbox label="Written" onClick={() => setWritten(!written)} />
                <AtomCheckbox label="Audio" onClick={() => setAudio(!audio)} />
                <AtomCheckbox label="Video" onClick={() => setVideo(!video)} />
              </CheckboxGroup>
            </Box>
          )}
          <Box className="w-full md:w-1/3 px-[24px]  mb-[28px]">
            <Select menuOptions={data.RelationType} label="Donor Relationship" fullWidth required />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px]  mb-[28px]">
            <Input label="First Name" fullWidth required />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px]  mb-[28px]">
            <Input label="Last Name" fullWidth required />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px]  mb-[28px]">
            <Input label="Email" fullWidth  />
          </Box>
          <Box className="w-full flex gap-3 md:w-1/3 px-[24px]  mb-[28px]">
            <StyledPhoneInput value={value} onChange={() => setValue} />
           
          </Box>
          <Box className="w-full flex gap-3 md:w-1/3 px-[24px]  mb-[28px]">
            <StyledPhoneInput value={value} onChange={() => setValue} />
          
          </Box>
        </Box>
      </Box>
      <Box>
        <Text className="text-[#804595]">Consent Attachemnt</Text>
        <Box mt={2} className="flex flex-wrap -mx-[24px]">
          <Box className=" relative w-full md:w-1/3 px-[24px]  mb-[28px]">
            <FileInput label="Consent Letter 1" fullWidth/>
          </Box>
          <Box className=" relative w-full md:w-1/3 px-[24px]  mb-[28px]">
            <FileInput label="Consent Letter 2" fullWidth/>
          </Box>
          {written && (
            <Box className={`w-full ${!consent ? 'hidden': ''} md:w-1/3 px-[24px]  mb-[28px]`}>
              <FileInput label="Written Consent" fullWidth required />
            </Box>
          )}
          {audio && (
            <Box className={`w-full ${!consent ? 'hidden' : '' } md:w-1/3 px-[24px]  mb-[28px]`}>
              <FileInput label="Audio Consent" fullWidth required />
            </Box>
          )}
          {video && (
            <Box className= {`w-full ${!consent ? 'hidden':''} md:w-1/3 px-[24px]  mb-[28px]`}>
              <FileInput label="Video Consent" fullWidth required />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ApnoeaAllocation;
