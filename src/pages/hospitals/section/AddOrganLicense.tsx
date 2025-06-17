import { Box, Button, Input, MultiImageInput, Text } from '@/atoms';
import { Grid } from '@mui/material';
import React, { useState } from 'react';

import heartImage from '@/assets/imgs/heart.png';
import kidneyImage from '@/assets/imgs/kidney.png';
import liverImage from '@/assets/imgs/liver.png';
import lungImage from '@/assets/imgs/lungs.png';
import pancreasImage from '@/assets/imgs/pancreas.png';
import stomach from '@assets/imgs/stomach.png';
import smallbowl from '@assets/imgs/intestine.png';
import hand from '@assets/imgs/hand.png';
import heartvalves from '@assets/imgs/heart2.png';
import corner from '@assets/imgs/eye.png';
import skin from '@assets/imgs/skin.png';
import bloodvessels from '@assets/imgs/blood-vessel.png';
import spine from '@assets/imgs/spine.png';
import bone from '@assets/imgs/bone.png';
import abdominal from '@assets/imgs/abdomanal-flap.png';
import { FileUploadIcon, MessageQuestion } from '@/assets/icons';
import { useNavigate } from 'react-router';

const AddOrganLicense: React.FC = () => {
  const imageOptions = [
    { src: heartImage, label: 'Heart' },
    { src: kidneyImage, label: 'Kidney' },
    { src: liverImage, label: 'Liver' },
    { src: lungImage, label: 'Lungs' },
    { src: pancreasImage, label: 'Pancreas' },
    { src: stomach, label: 'Stomach' }
  ];
  const imageOptions2 = [
    { src: smallbowl, label: 'Small Bowl' },
    { src: hand, label: 'Hand' },
    { src: heartvalves, label: 'Heart Valves' },
    { src: corner, label: 'Eye' },
    { src: skin, label: 'Skin' },
    { src: bloodvessels, label: 'Blood Vessel' },
    { src: spine, label: 'Spine' },
    { src: bone, label: 'Bone' },
    { src: abdominal, label: 'Abdominal Flab' }
  ];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };
  const navigate = useNavigate();
  const handlenavigate = () => {
    navigate('/hospitals');
  };
  return (
    <div>
      <Box px={5} className="mt-7 mb-7">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <span className="relative">
              <Input label="Transtant Certificate Number" required fullWidth />
              <span className="absolute top-[16px] right-[25px]">
                <MessageQuestion />
              </span>
            </span>
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Organ First Level Registration Date" required fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="License Expiry Date" required fullWidth />
          </Grid>
          <Grid item xs={12} md={4}>
            <Input label="Paayment Reference Number" required fullWidth />
          </Grid>
        </Grid>
      </Box>
      <Box px={5} className="mb-10">
        <Text className="!text-[19px] !text-[#804595] !font-[700]">Add License</Text>
        <Box mt={3} className="relative">
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <MultiImageInput
                id="outlined-full-width"
                label="Select Organs"
                fullWidth
                variant="outlined"
                value={selectedImage ? selectedImage : ''}
                InputProps={{
                  readOnly: true,
                  style: {
                    cursor: 'pointer'
                  },
                  onClick: () => {}
                }}
              />
            </Grid>
          </Grid>
          <Box className="flex w-[70%] items-center justify-evenly absolute top-[35%] left-[-4%] ">
            {imageOptions.map((option, index) => (
              <Box className="flex-col  text-center" key={index} onClick={() => handleImageClick(option.src)}>
                <img
                  src={option.src}
                  alt={`Organ ${index}`}
                  className="h-[70px] w-[70px] p-3 cursor-pointer hover:bg-[#8045954D] hover:border-[#804595] hover:border-2 hover:rounded-full  "
                />
                <span className="text-lg font-semibold ">{option.label}</span>
              </Box>
            ))}
          </Box>
        </Box>
        <Box mt={3} className="relative">
          <Grid container spacing={3}>
            <Grid item xs={12} md={11}>
              <MultiImageInput
                id="outlined-full-width"
                label="Select Tissues"
                fullWidth
                variant="outlined"
                value={selectedImage ? selectedImage : ''}
                InputProps={{
                  readOnly: true,
                  style: {
                    cursor: 'pointer'
                  },
                  onClick: () => {}
                }}
              />
            </Grid>
          </Grid>
          <Box className="flex w-[95%] items-center justify-evenly absolute top-[35%] left-[-2%] ">
            {imageOptions2.map((option, index) => (
              <Box className="flex-col text-center" key={index} onClick={() => handleImageClick(option.src)}>
                <img
                  src={option.src}
                  alt={`Organ ${index}`}
                  className="h-[70px] w-[70px] p-3 cursor-pointer hover:bg-[#8045954D] hover:border-[#804595] hover:border-2 hover:rounded-full  "
                />
                <span className="text-lg font-semibold ">{option.label}</span>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Box px={5}>
        <Text className="!text-[19px] !text-[#804595] !font-[700] !mb-7">Attachments</Text>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <span className="relative">
              <Input label="Organ Transplant License" fullWidth required />
              <span className="absolute top-[16px] right-[25px]">
                <FileUploadIcon />
              </span>
            </span>
          </Grid>
        </Grid>
      </Box>
      <Box px={5} className="flex  items-center !justify-end p-4 mt-[10%] mb-10  gap-3">
        <Button variant="outlined" className="!border-[#D876A9] !text-[#D876A9] w-[150px] ">
          Cancel
        </Button>
        <Button variant="contained" className="!bg-[#D876A9] w-[150px]" onClick={handlenavigate}>
          Submit
        </Button>
      </Box>
    </div>
  );
};

export default AddOrganLicense;
