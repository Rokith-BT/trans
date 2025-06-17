import { Box, Button, Text } from '@/atoms';
import {ToggleButtonComponent} from '@/pages/components/CustomToggleButton';
import React, { useState } from 'react';

interface InitiationAllocationProps{
onSelectionSubmit:(_selection:{[key:string]:string | null})=>void
}

const InitiationAllocation:React.FC<InitiationAllocationProps> = ({onSelectionSubmit}) => {
  const [selection, setSelection] = useState<{ [key: string]: string | null }>({
    spinal: null,
    stomach: null,
    lbowel: null,
    cornea: null,
    skin: null,
    bone: null,
    tissue: null,
    hvalves: null
  });
  const [submittedSelection, setSubmittedSelection] = useState<{ [key: string]: string | null }>({});
  const [submitted, setSubmitted] = useState(false);

  const organ = [
    { name: 'Spinal Bone and Disc Tissues', key: 'spinal' },
    { name: 'Stomach', key: 'stomach' },
    { name: 'Large Bowel', key: 'lbowel' },
    { name: 'Cornea', key: 'cornea' },
    { name: 'Skin', key: 'skin' },
    { name: 'Bone', key: 'bone' },
    { name: 'Tissue', key: 'tissue' },
    { name: 'Heart Valves', key: 'hvalves' }
  ];

  const handleChange = (organ: string) => (event: React.MouseEvent<HTMLElement>, newSelection: string | null) => {
    setSelection((prev) => ({
      ...prev,
      [organ]: newSelection
    }));
  };

  const handleSubmit = () => {
    setSubmittedSelection(selection);
    setSubmitted(true);
    onSelectionSubmit(selection)
  };

  return (
    <Box className="bg-[#F8F8FF]">
      {!submitted && (
        <>
          <Text className="text-[#804595] !text-[19px] !font-[500] !mb-7">Process not Initiated</Text>
          <Box className="px-[20px]">
            <Box className="flex flex-wrap">
              {organ.map((organ) => (
                <Box className="w-full flex mb-[28px] md:w-1/5" key={organ.key}>
                  <ToggleButtonComponent
                    label={organ.name}
                    options={[
                      {
                        value: 'local',
                        label: 'Local'
                      },
                      {
                        value: 'share',
                        label: 'Share'
                      }
                    ]}
                    value={selection[organ.key]}
                    onChange={handleChange(organ.key)}
                    submitted={false}
                  />
                </Box>
              ))}
            </Box>
          </Box>
          <Box className="flex justify-end pr-[8%]">
            <Button className="!bg-[#D876A9] !text-[#F8F8FF] w-[164px]" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </>
      )}
      <Box>
        <Text className="text-[#804595] !text-[19px] !font-[500]">Process Initiated</Text>
        <Box className="px-[20px] mt-5">
          <Box className="flex flex-wrap">
            {Object.keys(submittedSelection).map(
              (key) =>
                submittedSelection[key] && (
                  <Box className="w-full flex mb-[28px] md:w-1/5" key={key}>
                    <ToggleButtonComponent
                      label={organ.find((o) => o.key === key)?.name || 'Unknown'}
                      options={[
                        {
                          value: 'local',
                          label: 'Local'
                        },
                        {
                          value: 'share',
                          label: 'Share'
                        }
                      ]}
                      value={submittedSelection[key]}
                      onChange={handleChange(key)}
                      submitted={true}
                    />
                  </Box>
                )
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InitiationAllocation;
