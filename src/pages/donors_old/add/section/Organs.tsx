import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Input, Text } from '@/atoms';
import AtomRadioGroup from '@/pages/components/AtomRadioGroup';
import data from '@/data/selectData.json';
import AtomRadio from '@/atoms/radio/Radio';

const CustomToggleButton = styled(ToggleButton)(({}) => ({
  '&.Mui-selected': {
    backgroundColor: '#D876A9', // Pink color
    color: 'white',
    '&:hover': {
      backgroundColor: '#ff69b4' // Darker pink on hover if needed
    }
  }
}));

export default function Organs() {
  const [covid, setCovid] = React.useState(false);

  

  const [selections, setSelections] = React.useState<{ [key: string]: string | null }>({
    kidney: null,
    liver: null,
    heart: null,
    pancreas: null,
    dlungs: null,
    sbowel: null,
    hand: null,
    spinal: null,
    bvessel: null,
    stomach: null,
    aflap: null,
    lbowl: null,
    cornea: null,
    skin: null,
    bone: null,
    tissue: null,
    hvalves: null
  });

  const handleSelectionChange = (event: React.MouseEvent<HTMLElement>, newSelection: string | null, organ: string) => {
    setSelections((prev) => ({
      ...prev,
      [organ]: newSelection
    }));
  };

  const organs = [
    { name: 'Kidney', key: 'kidney' },
    { name: 'Liver', key: 'liver' },
    { name: 'Pancreas', key: 'pancreas' },
    { name: 'Heart', key: 'heart' },
    { name: 'Dual Lungs', key: 'dlungs' },
    { name: 'Small Bowel', key: 'sbowel' },
    { name: 'Hand', key: 'hand' },
    { name: 'Spinal Bone and Disc Tissue', key: 'spinal' },
    { name: 'Blood vessel', key: 'bvessel' },
    { name: 'Stomach', key: 'stomach' },
    { name: 'Abdomianl Flap', key: 'aflap' },
    { name: 'Large Bowl', key: 'lbowl' }
  ];

  const tissues = [
    { name: 'Cornea', key: 'cornea' },
    { name: 'Skin', key: 'skin' },
    { name: 'Bone', key: 'bone' },
    { name: 'Tissue', key: 'tissue' },
    { name: 'Heart Valves', key: 'hvalves' }
  ];

  return (
    <Box>
      <Text className="!text-[#804595] !text-[19px] !font-[500] !mt-[38px] !mb-[16px]">Organ Consented</Text>
      <Box className="flex  flex-wrap -mx-[24px]">
        {organs.map((organ) => (
          <Box className="flex flex-col w-full  md:w-1/5 p-2" key={organ.key}>
            <Text className="!mb-2 !text-[13px]">{organ.name}</Text>
            <ToggleButtonGroup
              color="secondary"
              value={selections[organ.key]}
              exclusive
              onChange={(event, newSelection) => handleSelectionChange(event, newSelection, organ.key)}
              aria-label={`${organ.name} selection`}
              sx={{ width: '128px' }}
            >
              <CustomToggleButton
                sx={{ color: '#C967A2', borderBottomLeftRadius: '18px', border: '1px #C967A2 solid', width: '64px' }}
                value="yes"
              >
                Yes
              </CustomToggleButton>
              <CustomToggleButton
                sx={{ color: '#C967A2', borderTopRightRadius: '18px', border: '1px #C967A2 solid', width: '64px' }}
                value="no"
              >
                No
              </CustomToggleButton>
            </ToggleButtonGroup>
          </Box>
        ))}
      </Box>
      <Box>
        <Text className="!text-[#804595] !text-[19px] !font-[500] !mt-[38px] !mb-[16px]">Tissue Consented</Text>
        <Box className="flex  flex-wrap  -mx-[24px]">
          {tissues.map((tissue, index) => (
            <Box key={index} className="flex flex-col w-full  md:w-1/5 p-2">
              <Text className="!mb-2 !text-[13px]">{tissue.name}</Text>
              <ToggleButtonGroup
                color="secondary"
                value={selections[tissue.key]}
                exclusive
                onChange={(event, newSelection) => handleSelectionChange(event, newSelection, tissue.key)}
                aria-label={`${tissue.name}selection`}
              >
                <CustomToggleButton
                  sx={{ color: '#C967A2', borderBottomLeftRadius: '18px', border: '1px #C967A2 solid', width: '64px' }}
                  value="yes"
                >
                  Yes
                </CustomToggleButton>
                <CustomToggleButton
                  sx={{ color: '#C967A2', borderTopRightRadius: '18px', border: '1px #C967A2 solid', width: '64px' }}
                  value="no"
                >
                  No
                </CustomToggleButton>
              </ToggleButtonGroup>
            </Box>
          ))}
        </Box>
      </Box>
      <Box mt={5}>
        <Text className="!mb-5 !text-[#804595] !text-[19px] !font-[700]">Medical History</Text>
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
              <AtomRadioGroup label="Histroy of Alcohol" isRequired={true} row>
                {data.radioOption.map((item, index) => (
                  <AtomRadio key={index} value={item.value} label={item.label} />
                ))}
              </AtomRadioGroup>
            </Box>
            <Box className="w-full md:w-1/3 px-[24px] mb-[28px]">
              <AtomRadioGroup label="Diabetes" isRequired={true} row>
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
                  <AtomRadio key={index} value={item.value} label={item.label} onClick={()=>setCovid(item.required)}/>
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
      </Box>
    </Box>
  );
}
