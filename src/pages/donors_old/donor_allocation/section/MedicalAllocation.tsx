import { Box, Input, Text } from '@/atoms';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import React, { useState } from 'react';
import data from '@/data/selectData.json';
import AtomRadio from '@/atoms/radio/Radio';

const MedicalAllocation = () => {
  const [covid, setCovid] = useState(false);

  const [crp, setCRP] = useState(false);

  const [isventilation, setIsVentilation]=useState(false);

  

  return (
    <Box className="bg-[#F8F8FF]">
      <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Medical History</Text>
      <Box className="flex flex-col ">
        <Box className="flex flex-wrap -mx-[24px] ">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="History of Smoking" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="History of Alcohol" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="diabets" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="HT" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Coronary Arterial Disease" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Renal Disease" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Liver Disease" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} />
              ))}
            </AtomRadioGroup>
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="History of Covid" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} onClick={() => setCovid(item.required)} />
              ))}
            </AtomRadioGroup>
          </Box>
          {covid && (
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Covid Free Period" fullWidth required />
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Injuries</Text>
        <Box className="flex flex-wrap -mx-[24px]">
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
            <Input label="Notes" fullWidth />
          </Box>
        </Box>
      </Box>
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Resuscitative Measures</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="CPR Given" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio key={index} value={item.value} label={item.label} onClick={() => setCRP(item.required)} />
              ))}
            </AtomRadioGroup>
          </Box>
          {crp && (
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="CPR File" fullWidth required />
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
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Ventilator Settings</Text>
        <Box className="flex flex-wrap -mx-[24px]">
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            <AtomRadioGroup label="Is ventilation" isRequired={true} row>
              {data.radioOption.map((item, index) => (
                <AtomRadio
                  key={index}
                  value={item.value}
                  label={item.label}
                  onClick={() => setIsVentilation(item.required)}
                />
              ))}
            </AtomRadioGroup>
          </Box>

          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            {isventilation ? (
              <Input label="Volume Control Ventilation (VCV)" fullWidth required />
            ) : (
              <Input label="Volume Control Ventilation (VCV)" fullWidth />
            )}
          </Box>
          <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
            {isventilation ? (
              <Input label="Pressure Control Ventilation (PCV)" fullWidth required />
            ) : (
              <Input label="Pressure Control Ventilation (PCV)" fullWidth />
            )}
          </Box>
        </Box>
      </Box>
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-bold !mb-4">Other Settings</Text>
        <Box className="flex flex-col w-full">
          <Box className="flex flex-wrap -mx-[24px]">
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input
                label={
                  <span>
                    FiO<sup>2</sup>
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
              <Input label="PIP" fullWidth required />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="TV" fullWidth required />
            </Box>

            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Respiratory Rate" fullWidth required />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Pressure Support" fullWidth required />
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <Input label="Others" fullWidth required />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MedicalAllocation;
