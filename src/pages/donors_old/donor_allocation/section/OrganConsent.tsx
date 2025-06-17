import { Box, Text } from '@/atoms';
import {ToggleButtonComponent} from '@/pages/components/CustomToggleButton';
import * as React from 'react';

const OrganConsent = () => {
  const [selectOrgan, setSelectOrgan] = React.useState<{ [key: string]: string | null }>({
    kidney: null,
    liver: null,
    heart: null,
    pancreas: null,
    duallungs: null,
    smallbowel: null,
    hand: null,
    spinal: null,
    bvessel: null,
    stomach: null,
    aflap: null,
    lbowel: null,
    cornea: null,
    skin: null,
    bone: null,
    tissue: null,
    hvalves: null
  });

  const handleChange = (organ: string) => (event: React.MouseEvent<HTMLElement>, newSelection: string | null) => {
    setSelectOrgan((prev) => ({ ...prev, [organ]: newSelection }));
  };

  const organs = [
    { name: 'Kidney', key: 'kidney' },
    { name: 'Liver', key: 'liver' },
    { name: 'Pancreas', key: 'pancreas' },
    { name: 'Heart', key: 'heart' },
    { name: 'Duallungs', key: 'duallungs' },
    { name: 'Smallbowel', key: 'smallbowel' },
    { name: 'Hand', key: 'hand' },
    { name: 'Spinal Bone and Disc Tissue', key: 'spinal' },
    { name: 'Blood Vessel', key: 'bvessel' },
    { name: 'Stomach', key: 'stomach' },
    { name: 'Abdominal Flap', key: 'aflap' },
    { name: 'Large Bowel', key: 'lbowel' }
  ];

  const tissuesConsented = [
    { name: 'Cornea', key: 'cornea' },
    { name: 'Skin', key: 'skin' },
    { name: 'Bone', key: 'bone' },
    { name: 'Tissues', key: 'tissues' },
    { name: 'Heart Valves', key: 'hvalves' }
  ];

  return (
    <Box className="bg-[#F8F8FF]">
      <Text className="!text-[#804595] !text-[] !font-[]">Organs Consented</Text>
      <Box className="px-[20px]">
        <Box className="flex  flex-wrap -mx-[24px]">
          {organs.map((organ) => (
            <Box className="flex w-full  md:w-1/5 p-2" key={organ.key}>
              <ToggleButtonComponent
                submitted={false}
                label={organ.name}
                options={[
                  {
                    value: 'yes',
                    label: 'Yes'
                  },
                  {
                    value: 'no',
                    label: 'No'
                  }
                ]}
                value={selectOrgan[organ.key]}
                onChange={handleChange(organ.key)}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box mb={3} mt={3}>
        <Text sx={{ color: '#804595' }}>Tissues Consented</Text>
        <Box className="flex flex-wrap -mx-[24px] px-[20px]">
          {tissuesConsented.map((tissue) => (
            <Box className="flex w-full xs:w-1/2 sm:w-1/3 md:w-1/5 p-2" key={tissue.key}>
              <ToggleButtonComponent
                submitted={false}
                label={tissue.name}
                options={[
                  {
                    value: 'yes',
                    label: 'Yes'
                  },
                  {
                    value: 'no',
                    label: 'No'
                  }
                ]}
                value={selectOrgan[tissue.key]}
                onChange={handleChange(tissue.key)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OrganConsent;
