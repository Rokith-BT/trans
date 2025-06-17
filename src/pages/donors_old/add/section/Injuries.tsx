import { Box, FileInput, Input, Text } from '@/atoms';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import data from '@/data/selectData.json';

import { useState } from 'react';
import AtomRadio from '@/atoms/radio/Radio';

const Injuries = () => {
  const [CRPFile, setCPRFile] = useState(false);
  const [isVentialtion, setIsventialtion] = useState(false);

  return (
    <Box>
      <Text className="!text-[#804595] !text-[19px] !font-[700] !mb-4">Injuries</Text>
      <Box mt={2} className="w-full flex flex-col gap-10">
        <Box className="flex flex-wrap p-2 -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Chest Injuries" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Abdomen Injuries" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <Input label="Notes" fullWidth  />
          </Box>
        </Box>
        <Box>
          <Text className="!text-[19px] !text-[#804595] !font-[700] ">Resuscitative Measures</Text>
          <Box className="flex flex-col mt-5">
            <Box className="flex flex-wrap -mx-[24px] ">
              <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
                <AtomRadioGroup label="CPR Given" isRequired={true} row>
                  {data.radioOption.map((item, index) => (
                    <AtomRadio
                      key={index}
                      value={item.value}
                      label={item.label}
                      onClick={() => setCPRFile(item.required)}
                    />
                  ))}
                </AtomRadioGroup>
              </Box>
              {CRPFile && (
                <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
                  <FileInput label="CPR File" fullWidth required />
                </Box>
              )}
              <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
                <AtomRadioGroup label="Hypotensive Episode" isRequired={true} row>
                  {data.radioOption.map((item, index) => (
                    <AtomRadio key={index} value={item.value} label={item.label} />
                  ))}
                </AtomRadioGroup>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Text className="!text-[#804595] !text-[19px] !font-[500]">Ventilator Settings</Text>
          <Box className="flex flex-wrap -mx-[24px] mt-5">
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <AtomRadioGroup label="Is Ventilation" isRequired={true} row>
                {data.radioOption.map((item, index) => (
                  <AtomRadio
                    key={index}
                    value={item.value}
                    label={item.label}
                    onClick={() => setIsventialtion(item.required)}
                  />
                ))}
              </AtomRadioGroup>
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              {isVentialtion ? (
                <Input label="Volume Control Ventilation (VCV)" fullWidth required />
              ) : (
                <Input label="Volume Control Ventilation (VCV)" fullWidth />
              )}
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              {isVentialtion ? (
                <Input label="Pressure Control Ventilation (PVC)" fullWidth required />
              ) : (
                <Input label="Pressure Control Ventilation (PVC)" fullWidth />
              )}
            </Box>
          </Box>
        </Box>
        <Box>
          <Text className="!text-[16px] !text-[#804595] !font-[600]">Other Settings</Text>
          <Box className="flex flex-wrap -mx-[24px] mt-5">
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input
                label={
                  <span>
                    FiO<sub>2</sub>
                  </span>
                }
                fullWidth
                required
              />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="PEEP" fullWidth required />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="PIP" fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="TV" fullWidth required />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Respiratory Rate" fullWidth required />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Pressure Support" fullWidth  />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Others" fullWidth  />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Injuries;
