import { Box, FileInput, Text } from '@/atoms'
import React from 'react'

const Attachment = () => {
  return (
    <Box>
      <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Donor Legal Form</Text>
      <Box className="flex flex-col w-full">
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <FileInput label="Form 8" fullWidth />
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <FileInput label="Form 10" fullWidth />
          </Box>
        </Box>
      </Box>
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Attachments</Text>
        <Box className="flex flex-col w-full">
          <Box className="flex flex-wrap -mx-[24px]">
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Urine Rountine" fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Urine Culture" fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Complete Hemogram" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Blood Measure, Certaine, Blood Sugar,HbAIC " fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Serum Electrolyes" fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Serology(HIV, HbsAg, HCV) " fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Liver Function Test" fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Coagulation Profile" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Chest X Ray" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="EGC" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Echo" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="CT Chest" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="USG Abdomen" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="RIPCR" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Any Other Investigation 1" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Any Other Investigation 2" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Any Other Investigation 3" fullWidth />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <FileInput label="Any Other Investigation 4" fullWidth />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Attachment