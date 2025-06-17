import { Box, FileInput, Input, Text } from '@/atoms'
import AtomRadio from '@/atoms/radio/Radio';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import data from '@/data/selectData.json';
import React from 'react'

const Abg = () => {
  return (
    <Box>
      <Text className="text-[#804595] !text-[19px] !font-[500] ">ABG Test</Text>
      <Box mt={2} className="flex gap-4 w-full items-center justify-evenly">
        <Box className="w-full">
          <Text className="bg-[#C967A226] text-[#C967A2] text-center rounded-lg !mb-[28px] ">ABG Test 1</Text>
          <Box mt={2} className="flex flex-col gap-y-7">
            <FileInput label="Test Report 1" fullWidth  />

            <Box>
              <Input
                label={
                  <span>
                    FiO<sub>2</sub>1
                  </span>
                }
                fullWidth
              />
            </Box>
          </Box>
        </Box>
        <Box className="w-full">
          <Text className="bg-[#C967A226] text-[#C967A2] text-center !mb-[28px] rounded-lg ">ABG Test 2</Text>
          <Box mt={2} className="flex flex-col gap-y-7">
            <FileInput label="Test Report 2" fullWidth  />
            <Box>
              <Input
                label={
                  <span>
                    FiO<sub>2</sub>2
                  </span>
                }
                fullWidth
              />
            </Box>
          </Box>
        </Box>
        <Box className="w-full">
          <Text className="bg-[#C967A226] text-[#C967A2] text-center !mb-[28px] rounded-lg ">ABG Test 2</Text>
          <Box mt={2} className="flex flex-col gap-y-7">
            <FileInput label="Test Report 3" fullWidth  />
            <Box>
              <Input
                label={
                  <span>
                    FiO<sub>2</sub>2
                  </span>
                }
                fullWidth
              />
            </Box>
          </Box>
        </Box>
        <Box className="w-full">
          <Text className="bg-[#C967A226] text-[#C967A2] text-center !mb-[28px] rounded-lg ">ABG Test 2</Text>
          <Box mt={2} className="flex flex-col gap-y-7">
            <FileInput label="Test Report 4" fullWidth  />
            <Box>
              <Input
                label={
                  <span>
                    FiO<sub>2</sub>2
                  </span>
                }
                fullWidth
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={4} className="flex w-full flex-col">
        <Text className="text-[#804595] !text-[19px] !mb-[28px] !font-[500]">Medication-Intropes</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Inotrope Dosage 1" fullWidth />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Inotrope Dosage 2" fullWidth />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Inotrope Dosage 3" fullWidth  />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px] ">
            <Input label="Inotrope Dosage 4" fullWidth  />
          </Box>
        </Box>
      </Box>
      <Box className="w-full">
        <Text className="text-[#804595] !text-[19px] !mb-[28px] !font-[500]">Hormone Replacement Therapy</Text>
        <Box className="flex">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Steriods" row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Vasopressin"  row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box>
            <AtomRadioGroup label="Thyroxine" row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Abg